# Data Ingestion Module - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION MODULE                        │
│                  AI-Driven Preventive Health Partner                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           DATA SOURCES                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │  EHR Systems │    │  Wearables   │    │Manual Upload │         │
│  │              │    │              │    │              │         │
│  │ • Epic FHIR  │    │ • Fitbit     │    │ • CSV/JSON   │         │
│  │ • Cerner     │    │ • Apple      │    │ • FHIR Bundle│         │
│  │ • Custom     │    │ • Samsung    │    │ • Direct API │         │
│  │   FHIR API   │    │ • Google Fit │    │              │         │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
└─────────┼────────────────────┼────────────────────┼─────────────────┘
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER (Express)                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │              Routes (routes/dataIngestion.js)               │  │
│  │  /api/ingestion/ehr/*          /api/ingestion/wearables/*   │  │
│  │  /api/ingestion/normalize/*    /api/ingestion/logs          │  │
│  └────────────────────────┬────────────────────────────────────┘  │
│                           │                                        │
│                           ▼                                        │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │        Controller (controller/dataIngestionController.js)    │  │
│  │  • Request validation                                        │  │
│  │  • Response formatting                                       │  │
│  │  • Error handling                                            │  │
│  └────────────────────────┬────────────────────────────────────┘  │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐               │
│  │  EHR Ingestion       │  │  Wearables Ingestion │               │
│  │  Service             │  │  Service             │               │
│  │  (FR1.1)             │  │  (FR1.2)             │               │
│  │                      │  │                      │               │
│  │ • FHIR endpoint      │  │ • Device mgmt        │               │
│  │   configuration      │  │ • OAuth handling     │               │
│  │ • Batch uploads      │  │ • Periodic sync      │               │
│  │ • Real-time pulls    │  │ • Error recovery     │               │
│  │ • Data validation    │  │ • Multi-platform     │               │
│  │ • Retry logic        │  │   support            │               │
│  └──────────┬───────────┘  └──────────┬───────────┘               │
│             │                          │                           │
│             └──────────┬───────────────┘                           │
│                        │                                           │
│                        ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │         FHIR Normalization Service (FR1.3)                  │  │
│  │                                                             │  │
│  │  • Raw data → FHIR conversion                               │  │
│  │  • HL7 FHIR R4 compliance                                   │  │
│  │  • LOINC code mapping                                       │  │
│  │  • Bundle creation                                          │  │
│  │  • Resource validation                                      │  │
│  └────────────────────────┬────────────────────────────────────┘  │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPPORT SERVICES                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────┐                │
│  │  Logger Service  │         │  Error Handler   │                │
│  │                  │         │                  │                │
│  │ • Structured     │         │ • Centralized    │                │
│  │   logging        │         │   error mgmt     │                │
│  │ • File output    │         │ • Custom errors  │                │
│  │ • Level control  │         │ • Stack traces   │                │
│  └──────────────────┘         └──────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA PERSISTENCE LAYER                        │
├─────────────────────────────────────────────────────────────────────┤
│                         MongoDB Database                            │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Patient          │  │ HealthObservation│  │ DataIngestionLog│  │
│  │ Collection       │  │ Collection       │  │ Collection      │  │
│  │                  │  │                  │  │                 │  │
│  │ • Demographics   │  │ • Measurements   │  │ • Audit trail   │  │
│  │ • Contact info   │  │ • FHIR data      │  │ • Statistics    │  │
│  │ • MRN/FHIR ID    │  │ • Source info    │  │ • Errors        │  │
│  │ • Devices        │  │ • Validation     │  │ • Data hash     │  │
│  └──────────────────┘  └──────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### FR1.1: EHR/FHIR Ingestion Flow

```
┌─────────────┐
│ EHR System  │
│ (FHIR API)  │
└──────┬──────┘
       │
       │ HTTPS Request
       ▼
┌─────────────────────────────────────────┐
│ POST /api/ingestion/ehr/batch           │
│ POST /api/ingestion/ehr/pull            │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ dataIngestionController                 │
│ • Validate request                      │
│ • Extract FHIR bundle                   │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ ehrIngestionService                     │
│ • Create ingestion log                  │
│ • Validate FHIR bundle                  │
│ • Process each resource                 │
│ • Handle errors/retries                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ fhirNormalizationService                │
│ • Validate FHIR structure               │
│ • Extract data fields                   │
│ • Map LOINC codes                       │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Save to MongoDB                         │
│ • Patient documents                     │
│ • HealthObservation documents           │
│ • DataIngestionLog                      │
└─────────────────────────────────────────┘
```

### FR1.2: Wearables Ingestion Flow

```
┌──────────────┐
│ Wearable     │
│ Device       │
└──────┬───────┘
       │
       │ Device API
       ▼
┌─────────────────────────────────────────┐
│ POST /api/ingestion/wearables/connect   │
│ POST /api/ingestion/wearables/sync      │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ wearablesIngestionService               │
│ • Connect to device API                 │
│ • Authenticate with OAuth               │
│ • Fetch data (periodic or on-demand)    │
│ • Handle disconnections                 │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ fhirNormalizationService                │
│ • Convert to FHIR Observation           │
│ • Add device metadata                   │
│ • Validate data                         │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Save to MongoDB                         │
│ • Update patient device status          │
│ • Store observations                    │
│ • Log sync activity                     │
└─────────────────────────────────────────┘
```

## Key Components

### Models (Data Schema)
- **Patient**: Demographics, identifiers, connected devices
- **HealthObservation**: Clinical measurements with FHIR compatibility
- **DataIngestionLog**: Audit trail for all ingestion activities

### Services (Business Logic)
- **ehrIngestionService**: EHR/FHIR data ingestion
- **wearablesIngestionService**: Wearable device data ingestion
- **fhirNormalizationService**: FHIR conversion and validation

### Controllers
- **dataIngestionController**: HTTP request/response handling

### Routes
- **dataIngestion**: API endpoint definitions

### Helpers
- **logger**: Structured logging
- **errorHandler**: Centralized error management

## Technology Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **HTTP Client**: Axios
- **Standards**: HL7 FHIR R4, LOINC codes
- **Authentication**: OAuth 2.0 (for wearables)

## Security Considerations

1. **Data Encryption**: All PHI encrypted at rest and in transit
2. **Authentication**: OAuth 2.0 for external APIs
3. **Authorization**: Role-based access control (future)
4. **Audit Logging**: All data access logged
5. **HIPAA Compliance**: Following healthcare data standards

## Performance Features

1. **Batch Processing**: Efficient handling of large FHIR bundles
2. **Async Operations**: Non-blocking I/O for API calls
3. **Retry Logic**: Automatic retry for failed API requests
4. **Connection Pooling**: MongoDB connection management
5. **Rate Limiting**: Prevent API abuse (future)

## Monitoring & Observability

1. **Structured Logging**: All activities logged with context
2. **Ingestion Metrics**: Success/failure rates tracked
3. **Error Tracking**: Detailed error logs with stack traces
4. **Performance Metrics**: Response times and throughput (future)

## Future Enhancements

1. **Real-time Streaming**: WebSocket connections for live data
2. **ML Integration**: Connect to PyTorch models for predictions
3. **Data Validation**: Advanced medical data validation rules
4. **Caching Layer**: Redis for frequently accessed data
5. **Message Queue**: RabbitMQ/Kafka for async processing
6. **API Gateway**: Centralized authentication and routing

---

**Status**: ✅ Module Complete
**Version**: 1.0.0
**Last Updated**: February 21, 2026
