from datetime import datetime


def create_diagnostic_report(subject_id, subject_type, indicator_code, indicator_name, severity, trend, explanation):
    timestamp = datetime.utcnow().isoformat() + "Z"

    observation = {
        "resourceType": "Observation",
        "status": "final",
        "code": {
            "text": indicator_name,
            "coding": [
                {
                    "system": "https://who.int/gho/indicator",
                    "code": indicator_code,
                    "display": indicator_name
                }
            ]
        },
        "subject": {
            "reference": f"{subject_type}/{subject_id}"
        },
        "effectiveDateTime": timestamp,
        "interpretation": [
            {
                "text": f"{severity} risk"
            }
        ],
        "note": [
            {
                "text": explanation
            }
        ]
    }

    report = {
        "resourceType": "DiagnosticReport",
        "status": "final",
        "code": {
            "text": f"Anomaly detection report for {indicator_name}"
        },
        "subject": {
            "reference": f"{subject_type}/{subject_id}"
        },
        "effectiveDateTime": timestamp,
        "result": [
            {
                "reference": "Observation/auto-generated"
            }
        ],
        "conclusion": f"{severity} anomaly detected. Trend: {trend}"
    }

    return {
        "diagnosticReport": report,
        "observation": observation
    }
