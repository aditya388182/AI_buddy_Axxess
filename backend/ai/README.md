# AI Services Overview

This project now has **two powerful AI services** for healthcare data processing:

---

## 🤖 Service 1: Anomaly Detection Pipeline
**File:** `backend/ai/pipeline.js`  
**Model:** DeepSeek V3.2  
**Purpose:** Detect anomalies in **structured** patient data

### Capabilities:
- ✅ Vital signs analysis
- ✅ Lab result validation
- ✅ Medication interaction detection
- ✅ General patient data anomaly detection
- ✅ Risk assessment

### API Endpoints:
```
GET  /api/anomaly/health              - Health check
POST /api/anomaly/detect              - General anomaly detection
POST /api/anomaly/vitals              - Analyze vital signs
POST /api/anomaly/labs                - Analyze lab results
POST /api/anomaly/medications         - Detect drug interactions
```

### When to Use:
- You already have **structured data** (JSON format)
- Need detailed analysis of specific data types
- Want specialized validators for vitals, labs, or medications

### Example:
```bash
curl -X POST http://localhost:5000/api/anomaly/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "vitals": {
      "bloodPressure": {"systolic": 180, "diastolic": 110},
      "heartRate": 120
    }
  }'
```

---

## 🔄 Service 2: Data Transformation Service
**File:** `backend/ai/transform_data.js`  
**Models:** Qwen 2.5-72B (cleaning) + DeepSeek V3.2 (anomaly detection)  
**Purpose:** Two-step pipeline for **raw/messy** data

### Capabilities:
- ✅ Clean messy medical notes
- ✅ Structure unformatted data
- ✅ Standardize units and terminology
- ✅ Extract key information
- ✅ Detect anomalies in cleaned data
- ✅ Transform lab results

### API Endpoints:
```
GET  /api/transform/health            - Health check
POST /api/transform/process           - Full pipeline (clean + detect)
POST /api/transform/clean             - Clean data only
POST /api/transform/labs              - Transform lab results
POST /api/transform/detect-anomalies  - Detect in structured data
```

### When to Use:
- You have **raw, unstructured** medical notes
- Need to clean data from different EHR systems
- Want automated data standardization
- Need end-to-end processing (raw → structured → analyzed)

### Example:
```bash
curl -X POST http://localhost:5000/api/transform/process \
  -H "Content-Type: application/json" \
  -d '{
    "rawData": "Pt John Doe BP 180/110 on Metformin 500mg glucose 45"
  }'
```

---

## 🎯 Which Service Should I Use?

### Use **Anomaly Detection Pipeline** when:
- ✅ Data is already in JSON format
- ✅ Need specialized validators (vitals, labs, meds)
- ✅ Want detailed analysis of specific data types
- ✅ Building a dashboard with structured data

### Use **Data Transformation Service** when:
- ✅ Data is raw/unstructured text
- ✅ Need to clean messy clinical notes
- ✅ Importing from multiple EHR systems
- ✅ Want end-to-end pipeline (raw → clean → analyze)
- ✅ Need data standardization

### Use **Both Together** when:
- ✅ Need comprehensive analysis
- ✅ Want multiple perspectives on the same data
- ✅ Building a production system with multiple data sources

---

## 🔄 Combined Workflow Example

```javascript
// Step 1: Clean raw data
const rawNotes = "Patient has high BP 160/95, on lisinopril 10mg";
const cleaned = await transformService.cleanOnly(rawNotes);

// Step 2: Detailed anomaly detection
const vitalAnalysis = await anomalyPipeline.detectVitalAnomalies(cleaned.vitals);
const medAnalysis = await anomalyPipeline.detectMedicationAnomalies(
  cleaned.medications, 
  cleaned.patient
);

// Step 3: Comprehensive report
const report = {
  originalNotes: rawNotes,
  structuredData: cleaned,
  vitalAnomalies: vitalAnalysis,
  medicationAnomalies: medAnalysis
};
```

---

## 📊 Quick Comparison

| Feature | Anomaly Detection | Data Transformation |
|---------|-------------------|---------------------|
| **Input Format** | Structured JSON | Raw text |
| **Primary Model** | DeepSeek V3.2 | Qwen + DeepSeek |
| **Main Purpose** | Deep analysis | Clean + analyze |
| **Best For** | Detailed validation | Data ingestion |
| **Response Time** | 2-5 seconds | 5-8 seconds |
| **Specialization** | Domain-specific | General purpose |

---

## 🚀 Testing Both Services

### Test Service 1 (Anomaly Detection):
```bash
node backend/ai/test-pipeline.js
```

### Test Service 2 (Data Transformation):
```bash
node backend/ai/test-transform.js
```

### Test All API Endpoints:
```bash
# Anomaly Detection
curl http://localhost:5000/api/anomaly/health

# Data Transformation
curl http://localhost:5000/api/transform/health
```

---

## 📁 Project Structure

```
backend/
├── ai/
│   ├── pipeline.js              # Anomaly Detection Service
│   ├── transform_data.js        # Data Transformation Service
│   ├── test-pipeline.js         # Test anomaly detection
│   ├── test-transform.js        # Test transformation
│   ├── TESTING_GUIDE.md         # Anomaly testing guide
│   └── TRANSFORM_GUIDE.md       # Transformation guide
├── routes/
│   ├── anomalyDetection.js      # /api/anomaly/* endpoints
│   └── dataTransformation.js    # /api/transform/* endpoints
└── index.js                      # Main server with both routes
```

---

## ✅ All Endpoints Summary

### Anomaly Detection (`/api/anomaly/`)
- `GET  /health` - Check service
- `POST /detect` - General anomalies
- `POST /vitals` - Vital signs
- `POST /labs` - Lab results
- `POST /medications` - Drug interactions

### Data Transformation (`/api/transform/`)
- `GET  /health` - Check service
- `POST /process` - Full pipeline
- `POST /clean` - Clean only
- `POST /labs` - Transform labs
- `POST /detect-anomalies` - Anomalies only

---

## 🎉 Ready to Use!

Both services are fully implemented and ready to process patient data. Start your server and test them out!

```bash
cd backend
npm run dev
```

Then test with the provided test suites or API calls above!
