/**
 * Data Ingestion Controller
 * Handles HTTP requests for data ingestion operations
 */

const ehrIngestionService = require('../library/ehrIngestionService');
const wearablesIngestionService = require('../library/wearablesIngestionService');
const fhirNormalizationService = require('../library/fhirNormalizationService');
const Patient = require('../models/Patient');
const HealthObservation = require('../models/HealthObservation');
const DataIngestionLog = require('../models/DataIngestionLog');

class DataIngestionController {
  /**
   * FR1.1: Batch upload of FHIR data from EHR
   * POST /api/ingestion/ehr/batch
   */
  async batchUploadEHR(req, res) {
    try {
      const { fhirBundle, systemName } = req.body;

      if (!fhirBundle) {
        return res.status(400).json({
          success: false,
          error: 'FHIR Bundle is required',
        });
      }

      const result = await ehrIngestionService.batchUpload(fhirBundle, systemName || 'manual');

      return res.status(200).json({
        success: true,
        message: 'Batch upload completed',
        data: result,
      });
    } catch (error) {
      console.error('[EHR Batch Upload] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.1: Configure FHIR endpoint for real-time pulls
   * POST /api/ingestion/ehr/configure
   */
  async configureEHREndpoint(req, res) {
    try {
      const { systemName, baseUrl, apiKey, apiSecret, version, headers } = req.body;

      if (!systemName || !baseUrl) {
        return res.status(400).json({
          success: false,
          error: 'systemName and baseUrl are required',
        });
      }

      ehrIngestionService.configureFhirEndpoint(systemName, {
        baseUrl,
        apiKey,
        apiSecret,
        version,
        headers,
      });

      return res.status(200).json({
        success: true,
        message: `FHIR endpoint configured for ${systemName}`,
      });
    } catch (error) {
      console.error('[EHR Configure] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.1: Pull patient data from FHIR endpoint
   * POST /api/ingestion/ehr/pull
   */
  async pullEHRData(req, res) {
    try {
      const { systemName, patientId } = req.body;

      if (!systemName || !patientId) {
        return res.status(400).json({
          success: false,
          error: 'systemName and patientId are required',
        });
      }

      const result = await ehrIngestionService.ingestPatientData(systemName, patientId);

      return res.status(200).json({
        success: true,
        message: 'Patient data ingested successfully',
        data: result,
      });
    } catch (error) {
      console.error('[EHR Pull] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Connect a wearable device
   * POST /api/ingestion/wearables/connect
   */
  async connectWearable(req, res) {
    try {
      const { patientId, deviceType, credentials } = req.body;

      if (!patientId || !deviceType) {
        return res.status(400).json({
          success: false,
          error: 'patientId and deviceType are required',
        });
      }

      const result = await wearablesIngestionService.connectDevice(
        patientId,
        deviceType,
        credentials || {}
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      console.error('[Wearable Connect] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Disconnect a wearable device
   * POST /api/ingestion/wearables/disconnect
   */
  async disconnectWearable(req, res) {
    try {
      const { patientId, deviceType } = req.body;

      if (!patientId || !deviceType) {
        return res.status(400).json({
          success: false,
          error: 'patientId and deviceType are required',
        });
      }

      const result = await wearablesIngestionService.disconnectDevice(patientId, deviceType);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('[Wearable Disconnect] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Sync wearable data (single pull)
   * POST /api/ingestion/wearables/sync
   */
  async syncWearable(req, res) {
    try {
      const { patientId, deviceType, options } = req.body;

      if (!patientId || !deviceType) {
        return res.status(400).json({
          success: false,
          error: 'patientId and deviceType are required',
        });
      }

      const result = await wearablesIngestionService.syncDeviceData(
        patientId,
        deviceType,
        options || {}
      );

      return res.status(200).json({
        success: true,
        message: 'Wearable data synced successfully',
        data: result,
      });
    } catch (error) {
      console.error('[Wearable Sync] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Start periodic sync for wearable
   * POST /api/ingestion/wearables/sync/start
   */
  async startPeriodicSync(req, res) {
    try {
      const { patientId, deviceType, intervalMinutes } = req.body;

      if (!patientId || !deviceType) {
        return res.status(400).json({
          success: false,
          error: 'patientId and deviceType are required',
        });
      }

      const result = await wearablesIngestionService.startPeriodicSync(
        patientId,
        deviceType,
        intervalMinutes
      );

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      console.error('[Periodic Sync Start] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Stop periodic sync for wearable
   * POST /api/ingestion/wearables/sync/stop
   */
  async stopPeriodicSync(req, res) {
    try {
      const { patientId, deviceType } = req.body;

      if (!patientId || !deviceType) {
        return res.status(400).json({
          success: false,
          error: 'patientId and deviceType are required',
        });
      }

      const result = wearablesIngestionService.stopPeriodicSync(patientId, deviceType);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      console.error('[Periodic Sync Stop] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.2: Manual ingestion of wearable data
   * POST /api/ingestion/wearables/manual
   */
  async manualWearableIngest(req, res) {
    try {
      const { patientId, observations, deviceType } = req.body;

      if (!patientId || !observations || !Array.isArray(observations)) {
        return res.status(400).json({
          success: false,
          error: 'patientId and observations array are required',
        });
      }

      const result = await wearablesIngestionService.manualIngest(
        patientId,
        observations,
        deviceType || 'manual'
      );

      return res.status(200).json({
        success: true,
        message: 'Manual ingestion completed',
        data: result,
      });
    } catch (error) {
      console.error('[Manual Ingest] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.3: Convert data to FHIR format
   * POST /api/ingestion/normalize/fhir
   */
  async normalizeToFHIR(req, res) {
    try {
      const { resourceType, data } = req.body;

      if (!resourceType || !data) {
        return res.status(400).json({
          success: false,
          error: 'resourceType and data are required',
        });
      }

      let fhirResource;
      if (resourceType === 'Patient') {
        fhirResource = fhirNormalizationService.normalizePatient(data);
      } else if (resourceType === 'Observation') {
        const patientFhirId = data.patientFhirId || 'unknown';
        fhirResource = fhirNormalizationService.normalizeObservation(data, patientFhirId);
      } else {
        return res.status(400).json({
          success: false,
          error: `Unsupported resource type: ${resourceType}`,
        });
      }

      // Validate FHIR resource
      const validation = fhirNormalizationService.validateFhirResource(fhirResource);

      return res.status(200).json({
        success: true,
        fhirResource,
        validation,
      });
    } catch (error) {
      console.error('[FHIR Normalize] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * FR1.3: Create FHIR Bundle
   * POST /api/ingestion/normalize/bundle
   */
  async createFHIRBundle(req, res) {
    try {
      const { resources, bundleType } = req.body;

      if (!resources || !Array.isArray(resources)) {
        return res.status(400).json({
          success: false,
          error: 'resources array is required',
        });
      }

      const bundle = fhirNormalizationService.createBundle(resources, bundleType);

      return res.status(200).json({
        success: true,
        bundle,
      });
    } catch (error) {
      console.error('[FHIR Bundle] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get ingestion logs
   * GET /api/ingestion/logs
   */
  async getIngestionLogs(req, res) {
    try {
      const { patientId, source, status, limit = 50, skip = 0 } = req.query;

      const query = {};
      if (patientId) query.patientId = patientId;
      if (source) query.source = source;
      if (status) query.status = status;

      const logs = await DataIngestionLog.find(query)
        .sort({ startTime: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .populate('patientId', 'firstName lastName mrn');

      const total = await DataIngestionLog.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: logs,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + logs.length,
        },
      });
    } catch (error) {
      console.error('[Get Logs] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get ingestion log by batch ID
   * GET /api/ingestion/logs/:batchId
   */
  async getIngestionLog(req, res) {
    try {
      const { batchId } = req.params;

      const log = await DataIngestionLog.findOne({ batchId }).populate(
        'patientId',
        'firstName lastName mrn'
      );

      if (!log) {
        return res.status(404).json({
          success: false,
          error: 'Ingestion log not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error) {
      console.error('[Get Log] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * Get patient observations
   * GET /api/ingestion/observations/:patientId
   */
  async getPatientObservations(req, res) {
    try {
      const { patientId } = req.params;
      const { observationType, startDate, endDate, limit = 100, skip = 0 } = req.query;

      const query = { patientId };
      if (observationType) query.observationType = observationType;
      if (startDate || endDate) {
        query.effectiveDateTime = {};
        if (startDate) query.effectiveDateTime.$gte = new Date(startDate);
        if (endDate) query.effectiveDateTime.$lte = new Date(endDate);
      }

      const observations = await HealthObservation.find(query)
        .sort({ effectiveDateTime: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await HealthObservation.countDocuments(query);

      return res.status(200).json({
        success: true,
        data: observations,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: total > parseInt(skip) + observations.length,
        },
      });
    } catch (error) {
      console.error('[Get Observations] Error:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new DataIngestionController();
