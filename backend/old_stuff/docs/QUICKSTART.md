# Quick Start Guide - Data Ingestion Module

## Prerequisites
- Node.js v18+ installed
- MongoDB installed and running
- Git installed

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start MongoDB
**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod --dbpath="C:\data\db"
```

**macOS/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using homebrew (macOS)
brew services start mongodb-community
```

### 3. Start the Backend Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start at: `http://localhost:5000`

### 4. Test the API

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Test Batch Upload (creates sample patient and observations)
```bash
curl -X POST http://localhost:5000/api/ingestion/ehr/batch \
  -H "Content-Type: application/json" \
  -d @- << 'EOF'
{
  "fhirBundle": {
    "resourceType": "Bundle",
    "type": "collection",
    "entry": [
      {
        "resource": {
          "resourceType": "Patient",
          "id": "patient-001",
          "name": [{"family": "Doe", "given": ["John"]}],
          "gender": "male",
          "birthDate": "1980-05-15"
        }
      },
      {
        "resource": {
          "resourceType": "Observation",
          "id": "obs-001",
          "status": "final",
          "code": {
            "coding": [{"system": "http://loinc.org", "code": "8867-4"}]
          },
          "subject": {"reference": "Patient/patient-001"},
          "effectiveDateTime": "2024-01-15T10:30:00Z",
          "valueQuantity": {"value": 75, "unit": "bpm"}
        }
      }
    ]
  },
  "systemName": "test"
}
EOF
```

#### View Ingestion Logs
```bash
curl http://localhost:5000/api/ingestion/logs
```

## Testing with Postman

1. Import the collection (coming soon) or use these endpoints:
   - POST `/api/ingestion/ehr/batch` - Upload FHIR data
   - POST `/api/ingestion/wearables/manual` - Upload wearable data
   - GET `/api/ingestion/logs` - View ingestion logs

2. Check [testData.js](testData.js) for sample data

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` file or kill the process using port 5000

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` again

## Next Steps

1. Review the [README.md](README.md) for full API documentation
2. Check [testData.js](testData.js) for more examples
3. Start building the frontend integration
4. Connect real wearable APIs (Samsung Health, Google Fit, etc.)
5. Integrate with PyTorch models for AI predictions

## API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/api/ingestion/ehr/batch` | Batch upload FHIR data |
| POST | `/api/ingestion/ehr/configure` | Configure FHIR endpoint |
| POST | `/api/ingestion/ehr/pull` | Pull patient data |
| POST | `/api/ingestion/wearables/connect` | Connect device |
| POST | `/api/ingestion/wearables/sync` | Sync device data |
| POST | `/api/ingestion/wearables/manual` | Manual data upload |
| POST | `/api/ingestion/normalize/fhir` | Normalize to FHIR |
| GET | `/api/ingestion/logs` | View ingestion logs |
| GET | `/api/ingestion/observations/:id` | Get patient observations |

## Development Workflow

1. Make changes to code
2. Server auto-reloads (with nodemon)
3. Test with curl or Postman
4. Check logs in console
5. Query MongoDB to verify data

## MongoDB Quick Commands

```bash
# Connect to MongoDB
mongosh

# Use the AI Nurse database
use ai_nurse_db

# View patients
db.patients.find().pretty()

# View observations
db.healthobservations.find().pretty()

# View ingestion logs
db.dataingestionlogs.find().pretty()

# Count documents
db.patients.countDocuments()
```

---

**Need Help?** Check the main README or contact the team!
