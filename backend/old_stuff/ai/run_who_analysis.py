import json
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd
import tensorflow as tf
from dotenv import load_dotenv

from mongo_utils import get_collection
from fhir_report import create_diagnostic_report


def load_config():
    config_path = Path(__file__).parent / "config.json"
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_scaler(indicator_code):
    scaler_path = Path(__file__).parent / "models" / f"{indicator_code}_scaler.json"
    if not scaler_path.exists():
        return None
    with open(scaler_path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_model(indicator_code):
    model_path = Path(__file__).parent / "models" / f"{indicator_code}.keras"
    if not model_path.exists():
        return None
    return tf.keras.models.load_model(model_path)


def fetch_who_data():
    collection = get_collection("healthindicators")
    cursor = collection.find({}, {"indicatorCode": 1, "geography.country": 1, "year": 1, "value": 1})

    records = []
    for doc in cursor:
        value = doc.get("value")
        if value is None:
            continue
        try:
            value_float = float(value)
        except Exception:
            continue
        records.append({
            "indicatorCode": doc.get("indicatorCode"),
            "country": doc.get("geography", {}).get("country"),
            "year": doc.get("year"),
            "value": value_float
        })

    return pd.DataFrame(records)


def compute_trend(series, slope_threshold):
    if len(series) < 2:
        return "unknown", 0.0
    x = np.arange(len(series))
    slope = np.polyfit(x, series, 1)[0]
    if slope > slope_threshold:
        return "improving", slope
    if slope < -slope_threshold:
        return "declining", slope
    return "stable", slope


def get_thresholds(config, indicator_code):
    thresholds = config["thresholds"].get(indicator_code)
    if thresholds:
        return thresholds["zscore"]
    return config["thresholds"]["default"]["zscore"]


def classify_severity(zscore, thresholds):
    if abs(zscore) >= thresholds["high"]:
        return "high"
    if abs(zscore) >= thresholds["medium"]:
        return "medium"
    if abs(zscore) >= thresholds["low"]:
        return "low"
    return "none"


def analyze_indicator(df, indicator_code, config, results_collection):
    model = load_model(indicator_code)
    scaler = load_scaler(indicator_code)
    if model is None or scaler is None:
        return 0

    thresholds = get_thresholds(config, indicator_code)
    slope_threshold = config["analysis"]["trend_slope_threshold"]

    group = df[df["indicatorCode"] == indicator_code]
    saved = 0

    for country, series_group in group.groupby("country"):
        series_group = series_group.sort_values("year")
        values = series_group["value"].astype(float).values
        if len(values) < config["analysis"]["min_points_per_series"]:
            continue

        mean = scaler["mean"]
        std = scaler["std"] if scaler["std"] > 0 else 1.0
        normalized = (values - mean) / std

        recon = model.predict(normalized.reshape(-1, 1), verbose=0).reshape(-1)
        errors = np.abs(recon - normalized)

        latest_z = normalized[-1]
        severity = classify_severity(latest_z, thresholds)
        trend, slope = compute_trend(values, slope_threshold)

        explanation = (
            f"Latest z-score: {latest_z:.2f}. Trend: {trend}. "
            f"Reconstruction error: {errors[-1]:.4f}."
        )

        report = None
        if severity in ["medium", "high"]:
            report = create_diagnostic_report(
                subject_id=country,
                subject_type="Country",
                indicator_code=indicator_code,
                indicator_name=indicator_code,
                severity=severity,
                trend=trend,
                explanation=explanation
            )

        record = {
            "timestamp": datetime.utcnow(),
            "subjectType": "country",
            "subjectId": country,
            "indicatorCode": indicator_code,
            "severity": severity,
            "trend": trend,
            "slope": float(slope),
            "latestValue": float(values[-1]),
            "zscore": float(latest_z),
            "reconstructionError": float(errors[-1]),
            "explanation": explanation,
            "fhirReport": report
        }

        results_collection.insert_one(record)
        saved += 1

    return saved


def main():
    load_dotenv()
    config = load_config()
    df = fetch_who_data()

    if df.empty:
        print("No WHO data found. Run /api/who/fetch first.")
        return

    results_collection = get_collection("ai_analysis_logs")
    results_collection.create_index([("subjectId", 1), ("timestamp", -1)])
    results_collection.create_index([("indicatorCode", 1), ("timestamp", -1)])

    total_saved = 0
    for indicator_code in df["indicatorCode"].dropna().unique():
        total_saved += analyze_indicator(df, indicator_code, config, results_collection)

    print(f"Analysis complete. Records saved: {total_saved}")


if __name__ == "__main__":
    main()
