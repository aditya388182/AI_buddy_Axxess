/**
 * Data Ingestion Routes
 * Defines API endpoints for the Data Ingestion Module
 */

const express = require('express');
const router = express.Router();
const dataIngestionController = require('../controller/dataIngestionController');

// ==================== FR1.1: EHR/FHIR Ingestion Routes ====================

/**
 * Configure FHIR endpoint for a specific EHR system
 * POST /api/ingestion/ehr/configure
 * Body: { systemName, baseUrl, apiKey, apiSecret, version, headers }
 */
router.post('/ehr/configure', dataIngestionController.configureEHREndpoint);

/**
 * Batch upload FHIR data
 * POST /api/ingestion/ehr/batch
 * Body: { fhirBundle, systemName }
 */
router.post('/ehr/batch', dataIngestionController.batchUploadEHR);

/**
 * Pull patient data from FHIR endpoint (real-time)
 * POST /api/ingestion/ehr/pull
 * Body: { systemName, patientId }
 */
router.post('/ehr/pull', dataIngestionController.pullEHRData);

// ==================== FR1.2: Wearables Ingestion Routes ====================

/**
 * Connect a wearable device
 * POST /api/ingestion/wearables/connect
 * Body: { patientId, deviceType, credentials }
 */
router.post('/wearables/connect', dataIngestionController.connectWearable);

/**
 * Disconnect a wearable device
 * POST /api/ingestion/wearables/disconnect
 * Body: { patientId, deviceType }
 */
router.post('/wearables/disconnect', dataIngestionController.disconnectWearable);

/**
 * Sync wearable data (single pull)
 * POST /api/ingestion/wearables/sync
 * Body: { patientId, deviceType, options: { startDate, endDate, dataTypes } }
 */
router.post('/wearables/sync', dataIngestionController.syncWearable);

/**
 * Start periodic sync for a wearable device
 * POST /api/ingestion/wearables/sync/start
 * Body: { patientId, deviceType, intervalMinutes }
 */
router.post('/wearables/sync/start', dataIngestionController.startPeriodicSync);

/**
 * Stop periodic sync for a wearable device
 * POST /api/ingestion/wearables/sync/stop
 * Body: { patientId, deviceType }
 */
router.post('/wearables/sync/stop', dataIngestionController.stopPeriodicSync);

/**
 * Manual ingestion of wearable data (for testing or batch import)
 * POST /api/ingestion/wearables/manual
 * Body: { patientId, observations: [...], deviceType }
 */
router.post('/wearables/manual', dataIngestionController.manualWearableIngest);

// ==================== FR1.3: FHIR Normalization Routes ====================

/**
 * Normalize data to FHIR format
 * POST /api/ingestion/normalize/fhir
 * Body: { resourceType: 'Patient' | 'Observation', data }
 */
router.post('/normalize/fhir', dataIngestionController.normalizeToFHIR);

/**
 * Create FHIR Bundle from resources
 * POST /api/ingestion/normalize/bundle
 * Body: { resources: [...], bundleType: 'collection' | 'transaction' | 'batch' }
 */
router.post('/normalize/bundle', dataIngestionController.createFHIRBundle);

// ==================== Query Routes ====================

/**
 * Get ingestion logs
 * GET /api/ingestion/logs?patientId=xxx&source=ehr&status=completed&limit=50&skip=0
 */
router.get('/logs', dataIngestionController.getIngestionLogs);

/**
 * Get specific ingestion log by batch ID
 * GET /api/ingestion/logs/:batchId
 */
router.get('/logs/:batchId', dataIngestionController.getIngestionLog);

/**
 * Get patient observations
 * GET /api/ingestion/observations/:patientId?observationType=heart_rate&startDate=2024-01-01&limit=100
 */
router.get('/observations/:patientId', dataIngestionController.getPatientObservations);

module.exports = router;
