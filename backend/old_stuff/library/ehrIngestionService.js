/**
 * EHR/FHIR Ingestion Service (FR1.1)
 * Handles data ingestion from Electronic Health Records via FHIR endpoints
 * Supports batch uploads and real-time pulls
 * Validates data integrity and logs all ingestion activities
 */

const axios = require('axios');
const crypto = require('crypto');
const Patient = require('../models/Patient');
const HealthObservation = require('../models/HealthObservation');
const DataIngestionLog = require('../models/DataIngestionLog');
const fhirNormalizationService = require('./fhirNormalizationService');

class EHRIngestionService {
  constructor() {
    // Configuration for FHIR endpoints (will be set from environment or config)
    this.fhirEndpoints = {
      // Placeholder for future EHR system integration
      // Example: epic: { baseUrl: '', apiKey: '', version: 'R4' }
    };

    // Rate limiting and retry configuration
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }

  /**
   * Configure FHIR endpoint for a specific EHR system
   * @param {String} systemName - Name of the EHR system (e.g., 'epic', 'cerner')
   * @param {Object} config - Configuration object with baseUrl, apiKey, etc.
   */
  configureFhirEndpoint(systemName, config) {
    this.fhirEndpoints[systemName] = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      version: config.version || 'R4',
      headers: config.headers || {},
    };
  }

  /**
   * Ingest patient data from FHIR endpoint (Real-time pull)
   * @param {String} systemName - EHR system name
   * @param {String} patientId - Patient ID in EHR system
   * @returns {Object} Ingestion result
   */
  async ingestPatientData(systemName, patientId) {
    const batchId = this._generateBatchId('ehr', systemName);
    const ingestionLog = await this._createIngestionLog(batchId, 'ehr', systemName);

    try {
      ingestionLog.status = 'processing';
      await ingestionLog.save();

      // Fetch patient data from FHIR endpoint
      const patientData = await this._fetchFhirPatient(systemName, patientId);
      
      // Fetch patient observations
      const observations = await this._fetchFhirObservations(systemName, patientId);

      ingestionLog.recordsReceived = 1 + observations.length;

      // Process patient data
      const patient = await this._processPatientData(patientData, systemName);
      ingestionLog.patientId = patient._id;
      ingestionLog.recordsSuccessful++;

      // Process observations
      for (let i = 0; i < observations.length; i++) {
        try {
          await this._processObservation(observations[i], patient._id, systemName, batchId);
          ingestionLog.recordsSuccessful++;
        } catch (error) {
          ingestionLog.recordsFailed++;
          ingestionLog.errors.push({
            timestamp: new Date(),
            errorType: error.name,
            errorMessage: error.message,
            recordIndex: i,
            recordData: observations[i],
          });
        }
      }

      // Update patient's last ingestion time
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
        patient,
        recordsProcessed: ingestionLog.recordsProcessed,
        recordsSuccessful: ingestionLog.recordsSuccessful,
        recordsFailed: ingestionLog.recordsFailed,
      };
    } catch (error) {
      ingestionLog.status = 'failed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.errors.push({
        timestamp: new Date(),
        errorType: error.name,
        errorMessage: error.message,
      });
      await ingestionLog.save();

      throw error;
    }
  }

  /**
   * Batch upload of FHIR data
   * @param {Object} fhirBundle - FHIR Bundle containing resources
   * @param {String} systemName - Source system name
   * @returns {Object} Ingestion result
   */
  async batchUpload(fhirBundle, systemName = 'manual') {
    const batchId = this._generateBatchId('ehr', systemName);
    const ingestionLog = await this._createIngestionLog(batchId, 'ehr', systemName);

    try {
      // Validate FHIR bundle structure
      if (!fhirBundle.resourceType || fhirBundle.resourceType !== 'Bundle') {
        throw new Error('Invalid FHIR Bundle: resourceType must be "Bundle"');
      }

      if (!fhirBundle.entry || !Array.isArray(fhirBundle.entry)) {
        throw new Error('Invalid FHIR Bundle: must contain entry array');
      }

      ingestionLog.status = 'processing';
      ingestionLog.recordsReceived = fhirBundle.entry.length;
      await ingestionLog.save();

      const results = {
        patients: [],
        observations: [],
        errors: [],
      };

      // Process each entry in the bundle
      for (let i = 0; i < fhirBundle.entry.length; i++) {
        const entry = fhirBundle.entry[i];
        const resource = entry.resource;

        try {
          if (resource.resourceType === 'Patient') {
            const patient = await this._processFhirPatient(resource, systemName);
            results.patients.push(patient);
            if (!ingestionLog.patientId) {
              ingestionLog.patientId = patient._id;
            }
            ingestionLog.recordsSuccessful++;
          } else if (resource.resourceType === 'Observation') {
            const observation = await this._processFhirObservation(resource, systemName, batchId);
            results.observations.push(observation);
            ingestionLog.recordsSuccessful++;
          } else {
            ingestionLog.validationWarnings.push({
              timestamp: new Date(),
              warningType: 'UnsupportedResourceType',
              message: `Resource type ${resource.resourceType} not supported yet`,
              recordIndex: i,
            });
          }
        } catch (error) {
          ingestionLog.recordsFailed++;
          ingestionLog.errorList.push({
            timestamp: new Date(),
            errorType: error.name,
            errorMessage: error.message,
            recordIndex: i,
            recordData: resource,
          });
          results.errors.push({
            index: i,
            error: error.message,
          });
        }
      }

      // Complete ingestion
      ingestionLog.status = ingestionLog.recordsFailed > 0 ? 'partial' : 'completed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.recordsProcessed = ingestionLog.recordsSuccessful + ingestionLog.recordsFailed;
      ingestionLog.dataHash = this._generateDataHash(fhirBundle);
      await ingestionLog.save();

      return {
        success: true,
        batchId,
        recordsProcessed: ingestionLog.recordsProcessed,
        recordsSuccessful: ingestionLog.recordsSuccessful,
        recordsFailed: ingestionLog.recordsFailed,
        results,
      };
    } catch (error) {
      ingestionLog.status = 'failed';
      ingestionLog.endTime = new Date();
      ingestionLog.duration = ingestionLog.endTime - ingestionLog.startTime;
      ingestionLog.errors.push({
        timestamp: new Date(),
        errorType: error.name,
        errorMessage: error.message,
      });
      await ingestionLog.save();

      throw error;
    }
  }

  /**
   * Fetch FHIR Patient resource from endpoint
   * @private
   */
  async _fetchFhirPatient(systemName, patientId, retries = 0) {
    try {
      const endpoint = this.fhirEndpoints[systemName];
      if (!endpoint) {
        throw new Error(`FHIR endpoint not configured for system: ${systemName}`);
      }

      const url = `${endpoint.baseUrl}/Patient/${patientId}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${endpoint.apiKey}`,
          'Accept': 'application/fhir+json',
          ...endpoint.headers,
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      if (retries < this.maxRetries) {
        await this._delay(this.retryDelay * (retries + 1));
        return this._fetchFhirPatient(systemName, patientId, retries + 1);
      }
      throw new Error(`Failed to fetch patient data: ${error.message}`);
    }
  }

  /**
   * Fetch FHIR Observations for a patient
   * @private
   */
  async _fetchFhirObservations(systemName, patientId, retries = 0) {
    try {
      const endpoint = this.fhirEndpoints[systemName];
      if (!endpoint) {
        throw new Error(`FHIR endpoint not configured for system: ${systemName}`);
      }

      const url = `${endpoint.baseUrl}/Observation`;
      const response = await axios.get(url, {
        params: {
          patient: patientId,
          _count: 100, // Limit to 100 most recent observations
          _sort: '-date',
        },
        headers: {
          'Authorization': `Bearer ${endpoint.apiKey}`,
          'Accept': 'application/fhir+json',
          ...endpoint.headers,
        },
        timeout: 30000,
      });

      // Extract observations from bundle
      if (response.data.resourceType === 'Bundle' && response.data.entry) {
        return response.data.entry.map((entry) => entry.resource);
      }

      return [];
    } catch (error) {
      if (retries < this.maxRetries) {
        await this._delay(this.retryDelay * (retries + 1));
        return this._fetchFhirObservations(systemName, patientId, retries + 1);
      }
      throw new Error(`Failed to fetch observations: ${error.message}`);
    }
  }

  /**
   * Process and save FHIR Patient resource
   * @private
   */
  async _processFhirPatient(fhirPatient, systemName) {
    // Validate FHIR resource
    const validation = fhirNormalizationService.validateFhirResource(fhirPatient);
    if (!validation.valid) {
      throw new Error(`Invalid FHIR Patient: ${validation.errors.join(', ')}`);
    }

    // Extract patient data from FHIR resource
    const patientData = {
      fhirId: fhirPatient.id,
      firstName: fhirPatient.name?.[0]?.given?.[0] || 'Unknown',
      lastName: fhirPatient.name?.[0]?.family || 'Unknown',
      dateOfBirth: fhirPatient.birthDate ? new Date(fhirPatient.birthDate) : null,
      gender: fhirPatient.gender || 'unknown',
      active: fhirPatient.active !== undefined ? fhirPatient.active : true,
      hospitalSystem: systemName,
    };

    // Extract MRN
    const mrnIdentifier = fhirPatient.identifier?.find((id) => id.type?.coding?.[0]?.code === 'MR');
    if (mrnIdentifier) {
      patientData.mrn = mrnIdentifier.value;
    }

    // Extract contact info
    if (fhirPatient.telecom) {
      const email = fhirPatient.telecom.find((t) => t.system === 'email');
      const phone = fhirPatient.telecom.find((t) => t.system === 'phone');
      if (email) patientData.email = email.value;
      if (phone) patientData.phone = phone.value;
    }

    // Extract address
    if (fhirPatient.address && fhirPatient.address.length > 0) {
      const addr = fhirPatient.address[0];
      patientData.address = {
        line: addr.line || [],
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: addr.country,
      };
    }

    // Update or create patient
    let patient;
    if (patientData.fhirId) {
      patient = await Patient.findOneAndUpdate(
        { fhirId: patientData.fhirId },
        patientData,
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      patient = new Patient(patientData);
      await patient.save();
    }

    return patient;
  }

  /**
   * Process legacy patient data (non-FHIR)
   * @private
   */
  async _processPatientData(patientData, systemName) {
    // If already in FHIR format
    if (patientData.resourceType === 'Patient') {
      return this._processFhirPatient(patientData, systemName);
    }

    // Otherwise, normalize to FHIR first
    const fhirPatient = fhirNormalizationService.normalizePatient(patientData);
    return this._processFhirPatient(fhirPatient, systemName);
  }

  /**
   * Process FHIR Observation resource
   * @private
   */
  async _processFhirObservation(fhirObservation, systemName, batchId) {
    // Validate FHIR resource
    const validation = fhirNormalizationService.validateFhirResource(fhirObservation);
    if (!validation.valid) {
      throw new Error(`Invalid FHIR Observation: ${validation.errors.join(', ')}`);
    }

    // Extract patient reference
    const patientRef = fhirObservation.subject?.reference;
    if (!patientRef) {
      throw new Error('Observation missing patient reference');
    }

    const patientFhirId = patientRef.split('/').pop();
    const patient = await Patient.findOne({ fhirId: patientFhirId });
    if (!patient) {
      throw new Error(`Patient not found: ${patientFhirId}`);
    }

    // Extract observation data
    const observationData = {
      patientId: patient._id,
      fhirId: fhirObservation.id,
      status: fhirObservation.status,
      effectiveDateTime: new Date(fhirObservation.effectiveDateTime || fhirObservation.effectivePeriod?.start),
      source: {
        type: 'ehr',
        ehrSystem: systemName,
      },
      batchId,
      rawFhirData: fhirObservation,
    };

    // Extract observation type from LOINC code
    const loincCode = fhirObservation.code?.coding?.find((c) => c.system?.includes('loinc'))?.code;
    observationData.loincCode = loincCode;
    observationData.observationType = this._mapLoincToObservationType(loincCode);

    // Extract value
    if (fhirObservation.valueQuantity) {
      observationData.value = fhirObservation.valueQuantity.value;
      observationData.unit = fhirObservation.valueQuantity.unit;
    } else if (fhirObservation.valueString) {
      observationData.value = fhirObservation.valueString;
      observationData.unit = 'text';
    } else if (fhirObservation.component) {
      // Complex observation (e.g., blood pressure)
      observationData.components = fhirObservation.component.map((comp) => ({
        type: comp.code?.coding?.[0]?.display || 'unknown',
        value: comp.valueQuantity?.value,
        unit: comp.valueQuantity?.unit,
      }));
      observationData.value = `${observationData.components.length} components`;
      observationData.unit = 'complex';
    }

    // Extract interpretation
    if (fhirObservation.interpretation) {
      const interpCode = fhirObservation.interpretation[0]?.coding?.[0]?.code;
      observationData.interpretation = this._mapInterpretationCode(interpCode);
    }

    // Extract reference range
    if (fhirObservation.referenceRange && fhirObservation.referenceRange.length > 0) {
      const range = fhirObservation.referenceRange[0];
      observationData.referenceRange = {
        low: range.low?.value,
        high: range.high?.value,
        unit: range.low?.unit || range.high?.unit,
      };
    }

    // Extract note
    if (fhirObservation.note && fhirObservation.note.length > 0) {
      observationData.note = fhirObservation.note[0].text;
    }

    // Save observation
    const observation = new HealthObservation(observationData);
    await observation.save();

    return observation;
  }

  /**
   * Process legacy observation data
   * @private
   */
  async _processObservation(observationData, patientId, systemName, batchId) {
    // If already in FHIR format
    if (observationData.resourceType === 'Observation') {
      return this._processFhirObservation(observationData, systemName, batchId);
    }

    // Add context
    observationData.patientId = patientId;
    observationData.source = { type: 'ehr', ehrSystem: systemName };
    observationData.batchId = batchId;

    // Normalize and process
    const patient = await Patient.findById(patientId);
    const fhirObservation = fhirNormalizationService.normalizeObservation(
      observationData,
      patient.fhirId
    );
    
    return this._processFhirObservation(fhirObservation, systemName, batchId);
  }

  /**
   * Create ingestion log entry
   * @private
   */
  async _createIngestionLog(batchId, source, systemName) {
    const log = new DataIngestionLog({
      batchId,
      source,
      sourceDetails: {
        system: systemName,
      },
    });
    await log.save();
    return log;
  }

  /**
   * Generate unique batch ID
   * @private
   */
  _generateBatchId(source, systemName) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${source}-${systemName}-${timestamp}-${random}`;
  }

  /**
   * Generate data hash for integrity checking
   * @private
   */
  _generateDataHash(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Map LOINC code to observation type
   * @private
   */
  _mapLoincToObservationType(loincCode) {
    const loincMap = {
      '8867-4': 'heart_rate',
      '85354-9': 'blood_pressure',
      '8480-6': 'systolic_bp',
      '8462-4': 'diastolic_bp',
      '2339-0': 'blood_glucose',
      '8310-5': 'body_temperature',
      '29463-7': 'weight',
      '8302-2': 'height',
      '39156-5': 'bmi',
      '59408-5': 'spo2',
      '9279-1': 'respiratory_rate',
    };
    return loincMap[loincCode] || 'other';
  }

  /**
   * Map FHIR interpretation code
   * @private
   */
  _mapInterpretationCode(code) {
    const codeMap = {
      N: 'normal',
      H: 'high',
      L: 'low',
      HH: 'critical_high',
      LL: 'critical_low',
      A: 'abnormal',
    };
    return codeMap[code] || 'normal';
  }

  /**
   * Delay helper for retries
   * @private
   */
  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = new EHRIngestionService();
