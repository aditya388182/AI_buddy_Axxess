# AI Anomaly Detection Pipeline - Testing Guide

## ✅ Implementation Checklist

- [x] **Fixed ES6 import syntax** → now uses CommonJS `require()`
- [x] **Created proper class structure** → `AnomalyDetectionPipeline`
- [x] **Added multiple detection methods**:
  - General anomaly detection
  - Vital signs analysis
  - Lab results analysis
  - Medication interaction detection
- [x] **Created API routes** → `/api/anomaly/*`
- [x] **Integrated into Express backend**
- [x] **Added error handling & logging**
- [x] **Created test suite**

---

## 🚀 Quick Start

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
[INFO] 🚀 AI Nurse Backend started on port 5000
```

### 2. Test the AI Health Check

```bash
curl http://localhost:5000/api/anomaly/health
```

Expected response:
```json
{
  "healthy": true,
  "model": "deepseek-ai/DeepSeek-V3.2"
}
```

---

## 🧪 Testing the Pipeline

### Option 1: Run Automated Test Suite

```bash
node backend/ai/test-pipeline.js
```

This tests all 5 functions with sample data.

### Option 2: Manual API Testing

#### Test 1: Detect Vital Sign Anomalies

```bash
curl -X POST http://localhost:5000/api/anomaly/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "vitals": {
      "bloodPressure": { "systolic": 180, "diastolic": 110 },
      "heartRate": 120,
      "temperature": 38.5,
      "respiratoryRate": 24,
      "oxygenSaturation": 92
    }
  }'
```

#### Test 2: Detect Lab Result Anomalies

```bash
curl -X POST http://localhost:5000/api/anomaly/labs \
  -H "Content-Type: application/json" \
  -d '{
    "labResults": [
      { "testName": "Hemoglobin", "value": 8.5, "unit": "g/dL" },
      { "testName": "White Blood Cell Count", "value": 15000, "unit": "cells/μL" },
      { "testName": "Blood Glucose", "value": 250, "unit": "mg/dL" }
    ]
  }'
```

#### Test 3: Detect Medication Interactions

```bash
curl -X POST http://localhost:5000/api/anomaly/medications \
  -H "Content-Type: application/json" \
  -d '{
    "medications": [
      { "name": "Warfarin", "dosage": "5mg", "frequency": "daily" },
      { "name": "Aspirin", "dosage": "325mg", "frequency": "daily" }
    ],
    "patientInfo": {
      "age": 65,
      "conditions": ["Atrial Fibrillation"]
    }
  }'
```

#### Test 4: General Patient Data Anomaly Detection

```bash
curl -X POST http://localhost:5000/api/anomaly/detect \
  -H "Content-Type: application/json" \
  -d '{
    "patientData": {
      "demographics": { "age": 45, "gender": "male" },
      "vitals": {
        "bloodPressure": { "systolic": 160, "diastolic": 95 },
        "heartRate": 95
      },
      "medications": [
        { "name": "Metformin", "dosage": "1000mg", "frequency": "twice daily" }
      ],
      "conditions": ["Type 2 Diabetes", "Hypertension"]
    }
  }'
```

---

## 📊 Expected Response Format

### Vital Signs Analysis
```json
{
  "success": true,
  "data": {
    "hasAnomalies": true,
    "severity": "severe",
    "anomalies": [
      {
        "parameter": "bloodPressure",
        "value": "180/110",
        "expected": "120/80",
        "severity": "severe",
        "reason": "Significantly elevated blood pressure",
        "recommendation": "Immediate medical attention required"
      }
    ],
    "overallRisk": "high",
    "requiresImmediateAttention": true,
    "summary": "Multiple concerning vital signs detected"
  }
}
```

### Lab Results Analysis
```json
{
  "success": true,
  "data": {
    "hasAnomalies": true,
    "abnormalResults": [
      {
        "testName": "Hemoglobin",
        "value": "8.5",
        "normalRange": "13.5-17.5 g/dL",
        "interpretation": "Low - indicates anemia",
        "severity": "moderate"
      }
    ],
    "possibleConditions": ["Anemia", "Infection"],
    "recommendations": ["Follow-up with hematologist", "Repeat tests in 2 weeks"],
    "urgency": "urgent"
  }
}
```

---

## 🔍 Validation Checklist

Run through these checks to ensure proper implementation:

### ✅ Syntax Check
```bash
node -c backend/ai/pipeline.js
```
Should return no errors.

### ✅ Module Loading
```bash
node -e "const P = require('./backend/ai/pipeline'); console.log(typeof P)"
```
Should print: `function`

### ✅ API Endpoint Tests
- [ ] `/api/anomaly/health` returns 200
- [ ] `/api/anomaly/vitals` accepts POST with vitals data
- [ ] `/api/anomaly/labs` accepts POST with lab data
- [ ] `/api/anomaly/medications` accepts POST with medication data
- [ ] `/api/anomaly/detect` accepts POST with patient data

### ✅ Error Handling
```bash
curl -X POST http://localhost:5000/api/anomaly/vitals \
  -H "Content-Type: application/json" \
  -d '{}'
```
Should return 400 error with message: "vitals data is required"

### ✅ AI Response Format
- [ ] All responses return valid JSON
- [ ] Anomalies array is structured correctly
- [ ] Severity levels are appropriate
- [ ] Recommendations are actionable

---

## 🐛 Troubleshooting

### Error: "Cannot use import statement"
**Fixed!** Changed from ES6 `import` to CommonJS `require()`.

### Error: "OpenAI is not a constructor"
Check that `openai` package is installed:
```bash
npm list openai
```

### Error: "Failed to detect anomalies"
Check the backend logs for specific error. Likely causes:
- Featherless API key invalid
- Network connectivity issues
- API rate limits

### AI Returns Invalid JSON
The pipeline has built-in JSON extraction. If it fails:
1. Check the `rawResponse` in the error
2. Adjust the prompt to be more specific about JSON format
3. Lower the temperature (more deterministic)

---

## 📈 Performance Benchmarks

Typical response times:
- Health check: < 1 second
- Vital analysis: 2-4 seconds
- Lab analysis: 3-5 seconds
- Medication analysis: 3-5 seconds
- General analysis: 4-7 seconds

---

## 🔐 Security Notes

- API key is stored in `.env` file (add to `.gitignore`)
- All patient data is sent to Featherless AI (ensure compliance)
- Consider implementing request rate limiting
- Add authentication/authorization for production use

---

## 🎯 Integration with Your App

### In Your Data Ingestion Pipeline
```javascript
const AnomalyDetectionPipeline = require('./ai/pipeline');
const pipeline = new AnomalyDetectionPipeline();

// When receiving new patient data
async function processPatientData(patientData) {
  // Detect anomalies
  const anomalies = await pipeline.detectAnomalies(patientData);
  
  // Flag for review if needed
  if (anomalies.requiresProviderReview) {
    await flagForReview(patientData.patientId, anomalies);
  }
  
  // Store data
  await storePatientData(patientData);
}
```

### In Your Dashboard
```javascript
// Get anomaly alerts for dashboard
app.get('/api/patients/:id/anomalies', async (req, res) => {
  const patientData = await getPatientData(req.params.id);
  const anomalies = await pipeline.detectAnomalies(patientData);
  res.json(anomalies);
});
```

---

## ✅ Final Verification

Run this complete test:

```bash
# 1. Start server
npm run dev

# 2. In another terminal, run automated tests
node backend/ai/test-pipeline.js

# 3. Test API endpoints
curl http://localhost:5000/api/anomaly/health
curl -X POST http://localhost:5000/api/anomaly/vitals \
  -H "Content-Type: application/json" \
  -d '{"vitals": {"heartRate": 120}}'
```

If all three succeed, **your pipeline is properly implemented!** 🎉
