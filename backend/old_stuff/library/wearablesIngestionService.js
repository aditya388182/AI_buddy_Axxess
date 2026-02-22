/**
 * Wearables Ingestion Service (FR1.2)
 * Handles real-time/periodic data from wearables
 * Supports: Samsung Health, Google Fit, Fitbit, Apple Watch, etc.
 * Handles intervals (15-60 minutes), error handling for disconnected devices
 */

const axios = require('axios');
const Patient = require('../models/Patient');
const HealthObservation = require('../models/HealthObservation');
const DataIngestionLog = require('../models/DataIngestionLog');
const fhirNormalizationService = require('./fhirNormalizationService');

class WearablesIngestionService {
  constructor() {
    // Configuration for different wearable platforms
    this.platformConfigs = {
      // Placeholder configurations - will be set from environment
      samsung_health: {
        baseUrl: 'https://developer-api.samsunghealth.com',
        authUrl: 'https://auth.samsunghealth.com',
        scopes: ['heart_rate', 'blood_pressure', 'steps', 'sleep'],
      },
      google_fit: {
        baseUrl: 'https://www.googleapis.com/fitness/v1',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scopes: [
          'https://www.googleapis.com/auth/fitness.activity.read',
          'https://www.googleapis.com/auth/fitness.heart_rate.read',
          'https://www.googleapis.com/auth/fitness.blood_pressure.read',
        ],
      },
      fitbit: {
        baseUrl: 'https://api.fitbit.com/1',
        authUrl: 'https://www.fitbit.com/oauth2/authorize',
        scopes: ['heartrate', 'activity', 'sleep', 'weight'],
      },
      apple_watch: {
        // Apple Health Kit data typically comes through app integration
        baseUrl: null,
        note: 'Data ingested via iOS app HealthKit integration',
      },
    };

    // Default sync interval (in minutes)
    this.defaultSyncInterval = 15;

    // Active sync jobs tracking
    this.activeSyncJobs = new Map();
  }

  /**
   * Connect a wearable device for a patient
   * @param {String} patientId - Patient's MongoDB ID
   * @param {String} deviceType - Type of device (e.g., 'samsung_health')
   * @param {Object} credentials - OAuth tokens or API credentials
   * @returns {Object} Connection result
   */
  async connectDevice(patientId, deviceType, credentials) {
    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Validate device type
      if (!this.platformConfigs[deviceType]) {
        throw new Error(`Unsupported device type: ${deviceType}`);
      }

      // Test connection by fetching a small amount of data
      await this._testDeviceConnection(deviceType, credentials);

      // Add or update device connection
      const existingDeviceIndex = patient.connectedDevices.findIndex(
        (d) => d.deviceType === deviceType
      );

      const deviceConnection = {
        deviceType,
        deviceId: credentials.deviceId || `${deviceType}_${Date.now()}`,
        connected: true,
        lastSync: new Date(),
        apiCredentials: credentials,
      };

      if (existingDeviceIndex >= 0) {
        patient.connectedDevices[existingDeviceIndex] = deviceConnection;
      } else {
        patient.connectedDevices.push(deviceConnection);
      }

      await patient.save();

      return {
        success: true,
        message: `Successfully connected ${deviceType}`,
        deviceId: deviceConnection.deviceId,
      };
    } catch (error) {
      throw new Error(`Failed to connect device: ${error.message}`);
    }
  }

  /**
   * Disconnect a wearable device
   * @param {String} patientId - Patient's MongoDB ID
   * @param {String} deviceType - Type of device
   */
  async disconnectDevice(patientId, deviceType) {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    const deviceIndex = patient.connectedDevices.findIndex((d) => d.deviceType === deviceType);
    if (deviceIndex >= 0) {
      patient.connectedDevices[deviceIndex].connected = false;
      await patient.save();

      // Stop any active sync jobs for this device
      const syncJobKey = `${patientId}_${deviceType}`;
      if (this.activeSyncJobs.has(syncJobKey)) {
        clearInterval(this.activeSyncJobs.get(syncJobKey));
        this.activeSyncJobs.delete(syncJobKey);
      }
    }

    return { success: true, message: 'Device disconnected' };
  }

  /**
   * Sync data from a wearable device (single pull)
   * @param {String} patientId - Patient's MongoDB ID
   * @param {String} deviceType - Type of device
   * @param {Object} options - Sync options (startDate, endDate, dataTypes)
   * @returns {Object} Sync result
   */
  async syncDeviceData(patientId, deviceType, options = {}) {
    const batchId = this._generateBatchId(deviceType, patientId);
    const ingestionLog = await this._createIngestionLog(batchId, deviceType, patientId);

    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      // Find device connection
      const device = patient.connectedDevices.find(
        (d) => d.deviceType === deviceType && d.connected
      );
      if (!device) {
        throw new Error(`Device ${deviceType} not connected for this patient`);
      }

      ingestionLog.status = 'processing';
      await ingestionLog.save();

      // Determine time range for data fetch
      const endDate = options.endDate || new Date();
      const startDate = options.startDate || device.lastSync || new Date(Date.now() - 24 * 60 * 60 * 1000); // Last 24 hours

      // Fetch data from wearable platform
      const rawData = await this._fetchWearableData(
        deviceType,
        device.apiCredentials,
        startDate,
        endDate,
        options.dataTypes
      );

      ingestionLog.recordsReceived = rawData.length;

      // Process and save observations
      const observations = [];
      for (let i = 0; i < rawData.length; i++) {
        try {
          const observation = await this._processWearableObservation(
            rawData[i],
            patient._id,
            deviceType,
            device.deviceId,
            batchId
          );
          observations.push(observation);
          ingestionLog.recordsSuccessful++;
        } catch (error) {
          ingestionLog.recordsFailed++;
          ingestionLog.errorList.push({
            timestamp: new Date(),
            errorType: error.name,
            errorMessage: error.message,
            recordIndex: i,
            recordData: rawData[i],
          });
        }
      }

      // Update device sync timestamp
      device.lastSync = new Date();
      patient.lastDataIngestion = new Date();
      await patient.save();

      // Complete ingestion log
      ingestionLog.status = ingestionLog.recordsFailed > 0 ? 'partial' : 'completed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.recordsProcessed = ingestionLog.recordsSuccessful + ingestionLog.recordsFailed;
      await ingestionLog.save();

      return {
        success: true,
        batchId,
        recordsProcessed: ingestionLog.recordsProcessed,
        recordsSuccessful: ingestionLog.recordsSuccessful,
        recordsFailed: ingestionLog.recordsFailed,
        observations,
      };
    } catch (error) {
      ingestionLog.status = 'failed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.errorList.push({
        timestamp: new Date(),
        errorType: error.name,
        errorMessage: error.message,
      });
      await ingestionLog.save();

      // Mark device as disconnected if authentication error
      if (error.message.includes('authentication') || error.message.includes('unauthorized')) {
        const patient = await Patient.findById(patientId);
        const device = patient.connectedDevices.find((d) => d.deviceType === deviceType);
        if (device) {
          device.connected = false;
          await patient.save();
        }
      }

      throw error;
    }
  }

  /**
   * Start periodic sync for a device
   * @param {String} patientId - Patient's MongoDB ID
   * @param {String} deviceType - Type of device
   * @param {Number} intervalMinutes - Sync interval in minutes (default: 15)
   */
  async startPeriodicSync(patientId, deviceType, intervalMinutes = this.defaultSyncInterval) {
    const syncJobKey = `${patientId}_${deviceType}`;

    // Stop existing sync job if any
    if (this.activeSyncJobs.has(syncJobKey)) {
      clearInterval(this.activeSyncJobs.get(syncJobKey));
    }

    // Start new sync job
    const intervalId = setInterval(async () => {
      try {
        console.log(`[Periodic Sync] Starting sync for patient ${patientId}, device ${deviceType}`);
        await this.syncDeviceData(patientId, deviceType);
        console.log(`[Periodic Sync] Completed sync for patient ${patientId}, device ${deviceType}`);
      } catch (error) {
        console.error(
          `[Periodic Sync] Failed sync for patient ${patientId}, device ${deviceType}:`,
          error.message
        );
      }
    }, intervalMinutes * 60 * 1000);

    this.activeSyncJobs.set(syncJobKey, intervalId);

    // Do an immediate sync
    await this.syncDeviceData(patientId, deviceType);

    return {
      success: true,
      message: `Periodic sync started (every ${intervalMinutes} minutes)`,
      syncJobKey,
    };
  }

  /**
   * Stop periodic sync for a device
   * @param {String} patientId - Patient's MongoDB ID
   * @param {String} deviceType - Type of device
   */
  stopPeriodicSync(patientId, deviceType) {
    const syncJobKey = `${patientId}_${deviceType}`;

    if (this.activeSyncJobs.has(syncJobKey)) {
      clearInterval(this.activeSyncJobs.get(syncJobKey));
      this.activeSyncJobs.delete(syncJobKey);
      return { success: true, message: 'Periodic sync stopped' };
    }

    return { success: false, message: 'No active sync job found' };
  }

  /**
   * Ingest wearable data manually (for testing or batch import)
   * @param {String} patientId - Patient's MongoDB ID
   * @param {Array} observations - Array of observation data
   * @param {String} deviceType - Type of device
   * @returns {Object} Ingestion result
   */
  async manualIngest(patientId, observations, deviceType = 'manual') {
    const batchId = this._generateBatchId(deviceType, patientId);
    const ingestionLog = await this._createIngestionLog(batchId, deviceType, patientId);

    try {
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }

      ingestionLog.status = 'processing';
      ingestionLog.recordsReceived = observations.length;
      await ingestionLog.save();

      const savedObservations = [];
      for (let i = 0; i < observations.length; i++) {
        try {
          const observation = await this._processWearableObservation(
            observations[i],
            patient._id,
            deviceType,
            'manual',
            batchId
          );
          savedObservations.push(observation);
          ingestionLog.recordsSuccessful++;
        } catch (error) {
          ingestionLog.recordsFailed++;
          ingestionLog.errorList.push({
            timestamp: new Date(),
            errorType: error.name,
            errorMessage: error.message,
            recordIndex: i,
            recordData: observations[i],
          });
        }
      }

      patient.lastDataIngestion = new Date();
      await patient.save();

      ingestionLog.status = ingestionLog.recordsFailed > 0 ? 'partial' : 'completed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.recordsProcessed = ingestionLog.recordsSuccessful + ingestionLog.recordsFailed;
      await ingestionLog.save();

      return {
        success: true,
        batchId,
        recordsProcessed: ingestionLog.recordsProcessed,
        recordsSuccessful: ingestionLog.recordsSuccessful,
        recordsFailed: ingestionLog.recordsFailed,
        observations: savedObservations,
      };
    } catch (error) {
      ingestionLog.status = 'failed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.errorList.push({
        timestamp: new Date(),
        errorType: error.name,
        errorMessage: error.message,
      });
      await ingestionLog.save();

      throw error;
    }
  }

  /**
   * Test device connection
   * @private
   */
  async _testDeviceConnection(deviceType, credentials) {
    // Placeholder for actual API testing
    // In production, this would make a test API call to verify credentials
    
    if (deviceType === 'samsung_health') {
      return this._testSamsungHealth(credentials);
    } else if (deviceType === 'google_fit') {
      return this._testGoogleFit(credentials);
    } else if (deviceType === 'fitbit') {
      return this._testFitbit(credentials);
    }

    return true; // For manual or unsupported types
  }

  /**
   * Fetch data from wearable platform
   * @private
   */
  async _fetchWearableData(deviceType, credentials, startDate, endDate, dataTypes) {
    if (deviceType === 'samsung_health') {
      return this._fetchSamsungHealthData(credentials, startDate, endDate, dataTypes);
    } else if (deviceType === 'google_fit') {
      return this._fetchGoogleFitData(credentials, startDate, endDate, dataTypes);
    } else if (deviceType === 'fitbit') {
      return this._fetchFitbitData(credentials, startDate, endDate, dataTypes);
    }

    throw new Error(`Fetching data from ${deviceType} not implemented yet`);
  }

  /**
   * Samsung Health API methods
   * @private
   */
  async _testSamsungHealth(credentials) {
    // Placeholder - implement actual Samsung Health API call
    // TODO: Implement when Samsung Health API credentials are available
    console.log('[Samsung Health] Connection test - placeholder');
    return true;
  }

  async _fetchSamsungHealthData(credentials, startDate, endDate, dataTypes) {
    // Placeholder for Samsung Health API integration
    // TODO: Implement actual Samsung Health API calls
    // Example endpoint: GET /v1/user/{userId}/data/{dataType}
    
    console.log('[Samsung Health] Fetching data - placeholder');
    console.log(`  Date range: ${startDate} to ${endDate}`);
    console.log(`  Data types: ${dataTypes || 'all'}`);

    // Return empty array for now - will be replaced with actual API calls
    return [];
  }

  /**
   * Google Fit API methods
   * @private
   */
  async _testGoogleFit(credentials) {
    // Placeholder - implement actual Google Fit API call
    // TODO: Implement when Google Fit API credentials are available
    console.log('[Google Fit] Connection test - placeholder');
    return true;
  }

  async _fetchGoogleFitData(credentials, startDate, endDate, dataTypes) {
    // Placeholder for Google Fit API integration
    // TODO: Implement actual Google Fit API calls
    // Example: POST https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate
    
    console.log('[Google Fit] Fetching data - placeholder');
    console.log(`  Date range: ${startDate} to ${endDate}`);
    console.log(`  Data types: ${dataTypes || 'all'}`);

    // Return empty array for now - will be replaced with actual API calls
    return [];
  }

  /**
   * Fitbit API methods
   * @private
   */
  async _testFitbit(credentials) {
    // Placeholder - implement actual Fitbit API call
    // TODO: Implement when Fitbit API credentials are available
    console.log('[Fitbit] Connection test - placeholder');
    return true;
  }

  async _fetchFitbitData(credentials, startDate, endDate, dataTypes) {
    // Placeholder for Fitbit API integration
    // TODO: Implement actual Fitbit API calls
    // Example: GET /1/user/-/activities/heart/date/{date}/{period}.json
    
    console.log('[Fitbit] Fetching data - placeholder');
    console.log(`  Date range: ${startDate} to ${endDate}`);
    console.log(`  Data types: ${dataTypes || 'all'}`);

    // Return empty array for now - will be replaced with actual API calls
    return [];
  }

  /**
   * Process wearable observation and save to database
   * @private
   */
  async _processWearableObservation(rawData, patientId, deviceType, deviceId, batchId) {
    // Normalize observation data
    const observationData = {
      patientId,
      observationType: rawData.type || rawData.observationType,
      value: rawData.value,
      unit: rawData.unit,
      effectiveDateTime: new Date(rawData.timestamp || rawData.effectiveDateTime || Date.now()),
      source: {
        type: 'wearable',
        deviceType,
        deviceId,
      },
      batchId,
      status: 'final',
      validated: false,
    };

    // Handle complex observations (e.g., blood pressure)
    if (rawData.components) {
      observationData.components = rawData.components;
    }

    // Add interpretation if provided
    if (rawData.interpretation) {
      observationData.interpretation = rawData.interpretation;
    }

    // Add reference range if provided
    if (rawData.referenceRange) {
      observationData.referenceRange = rawData.referenceRange;
    }

    // Normalize to FHIR format
    const patient = await Patient.findById(patientId);
    const fhirObservation = fhirNormalizationService.normalizeObservation(
      observationData,
      patient.fhirId
    );
    observationData.rawFhirData = fhirObservation;

    // Save to database
    const observation = new HealthObservation(observationData);
    await observation.save();

    return observation;
  }

  /**
   * Create ingestion log
   * @private
   */
  async _createIngestionLog(batchId, deviceType, patientId) {
    const log = new DataIngestionLog({
      batchId,
      source: 'wearable',
      sourceDetails: {
        system: deviceType,
      },
      patientId,
    });
    await log.save();
    return log;
  }

  /**
   * Generate batch ID
   * @private
   */
  _generateBatchId(deviceType, patientId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `wearable-${deviceType}-${patientId}-${timestamp}-${random}`;
  }
}

module.exports = new WearablesIngestionService();
