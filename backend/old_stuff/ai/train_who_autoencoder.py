import json
import os
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf
from dotenv import load_dotenv

from mongo_utils import get_collection


def load_config():
    config_path = Path(__file__).parent / "config.json"
    with open(config_path, "r", encoding="utf-8") as f:
        return json.load(f)


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


def build_autoencoder(input_dim, learning_rate):
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.Dense(4, activation="relu"),
        tf.keras.layers.Dense(2, activation="relu"),
        tf.keras.layers.Dense(4, activation="relu"),
        tf.keras.layers.Dense(input_dim, activation="linear")
    ])

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
        loss="mse"
    )
    return model


def train_models(df, config):
    output_dir = Path(__file__).parent / "models"
    output_dir.mkdir(parents=True, exist_ok=True)

    epochs = config["model"]["epochs"]
    batch_size = config["model"]["batch_size"]
    learning_rate = config["model"]["learning_rate"]

    trained = []

    for indicator_code, group in df.groupby("indicatorCode"):
        values = group["value"].astype(float).values
        if len(values) < 10:
            continue

        mean = float(np.mean(values))
        std = float(np.std(values)) if float(np.std(values)) > 0 else 1.0
        normalized = (values - mean) / std

        model = build_autoencoder(1, learning_rate)
        model.fit(normalized.reshape(-1, 1), normalized.reshape(-1, 1),
                  epochs=epochs, batch_size=batch_size, verbose=0)

        model_path = output_dir / f"{indicator_code}.keras"
        scaler_path = output_dir / f"{indicator_code}_scaler.json"

        model.save(model_path)
        with open(scaler_path, "w", encoding="utf-8") as f:
            json.dump({"mean": mean, "std": std}, f)

        trained.append(indicator_code)

    return trained


def main():
    load_dotenv()
    config = load_config()
    df = fetch_who_data()

    if df.empty:
        print("No WHO data found. Run /api/who/fetch first.")
        return

    trained = train_models(df, config)
    print(f"Trained models for indicators: {trained}")


if __name__ == "__main__":
    main()
