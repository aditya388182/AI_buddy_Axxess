/**
 * FHIR Normalization Service (FR1.3)
 * Converts raw data from various sources into FHIR-compatible format
 * Supports HL7 FHIR resources: Patient, Observation
 * Output: JSON FHIR bundles
 */

const { v4: uuidv4 } = require('uuid');

class FHIRNormalizationService {
  constructor() {
    // LOINC codes mapping for common observations
    this.loincCodeMap = {
      heart_rate: '8867-4',
      blood_pressure: '85354-9',
      systolic_bp: '8480-6',
      diastolic_bp: '8462-4',
      blood_glucose: '2339-0',
      body_temperature: '8310-5',
      weight: '29463-7',
      height: '8302-2',
      bmi: '39156-5',
      spo2: '59408-5',
      respiratory_rate: '9279-1',
      steps: '41950-7',
    };
  }

  /**
   * Create FHIR Patient resource from raw patient data
   * @param {Object} rawPatientData - Raw patient data
   * @returns {Object} FHIR Patient resource
   */
  normalizePatient(rawPatientData) {
    const fhirPatient = {
      resourceType: 'Patient',
      id: rawPatientData.fhirId || uuidv4(),
      meta: {
        lastUpdated: new Date().toISOString(),
        versionId: '1',
      },
      identifier: [],
      active: rawPatientData.active !== undefined ? rawPatientData.active : true,
      name: [
        {
          use: 'official',
          family: rawPatientData.lastName,
          given: [rawPatientData.firstName],
        },
      ],
      gender: rawPatientData.gender,
      birthDate: this._formatDate(rawPatientData.dateOfBirth),
    };

    // Add MRN if available
    if (rawPatientData.mrn) {
      fhirPatient.identifier.push({
        use: 'official',
        type: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
              code: 'MR',
              display: 'Medical Record Number',
            },
          ],
        },
        value: rawPatientData.mrn,
      });
    }

    // Add contact information
    if (rawPatientData.email || rawPatientData.phone) {
      fhirPatient.telecom = [];
      if (rawPatientData.email) {
        fhirPatient.telecom.push({
          system: 'email',
          value: rawPatientData.email,
          use: 'home',
        });
      }
      if (rawPatientData.phone) {
        fhirPatient.telecom.push({
          system: 'phone',
          value: rawPatientData.phone,
          use: 'home',
        });
      }
    }

    // Add address
    if (rawPatientData.address) {
      fhirPatient.address = [
        {
          use: 'home',
          type: 'physical',
          line: rawPatientData.address.line || [],
          city: rawPatientData.address.city,
          state: rawPatientData.address.state,
          postalCode: rawPatientData.address.postalCode,
          country: rawPatientData.address.country,
        },
      ];
    }

    return fhirPatient;
  }

  /**
   * Create FHIR Observation resource from raw health data
   * @param {Object} rawObservation - Raw observation data
   * @param {String} patientFhirId - Patient's FHIR ID
   * @returns {Object} FHIR Observation resource
   */
  normalizeObservation(rawObservation, patientFhirId) {
    const loincCode = this.loincCodeMap[rawObservation.observationType] || null;

    const fhirObservation = {
      resourceType: 'Observation',
      id: rawObservation.fhirId || uuidv4(),
      meta: {
        lastUpdated: new Date().toISOString(),
      },
      status: rawObservation.status || 'final',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/observation-category',
              code: this._getCategoryCode(rawObservation.source?.type),
              display: this._getCategoryDisplay(rawObservation.source?.type),
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'http://loinc.org',
            code: loincCode || 'custom',
            display: this._getDisplayName(rawObservation.observationType),
          },
        ],
        text: this._getDisplayName(rawObservation.observationType),
      },
      subject: {
        reference: `Patient/${patientFhirId}`,
      },
      effectiveDateTime: new Date(rawObservation.effectiveDateTime).toISOString(),
      issued: new Date(rawObservation.ingestionTimestamp || Date.now()).toISOString(),
    };

    // Add value
    if (rawObservation.components && rawObservation.components.length > 0) {
      // Complex observation (e.g., blood pressure)
      fhirObservation.component = rawObservation.components.map((comp) => ({
        code: {
          coding: [
            {
              system: 'http://loinc.org',
              code: this.loincCodeMap[comp.type] || 'custom',
              display: comp.type,
            },
          ],
        },
        valueQuantity: {
          value: parseFloat(comp.value),
          unit: comp.unit,
          system: 'http://unitsofmeasure.org',
        },
      }));
    } else {
      // Simple observation
      const value = parseFloat(rawObservation.value);
      if (!isNaN(value)) {
        fhirObservation.valueQuantity = {
          value: value,
          unit: rawObservation.unit,
          system: 'http://unitsofmeasure.org',
          code: rawObservation.unit,
        };
      } else {
        fhirObservation.valueString = String(rawObservation.value);
      }
    }

    // Add interpretation
    if (rawObservation.interpretation) {
      fhirObservation.interpretation = [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation',
              code: this._getInterpretationCode(rawObservation.interpretation),
              display: rawObservation.interpretation,
            },
          ],
        },
      ];
    }

    // Add reference range
    if (rawObservation.referenceRange) {
      fhirObservation.referenceRange = [
        {
          low: {
            value: rawObservation.referenceRange.low,
            unit: rawObservation.referenceRange.unit,
          },
          high: {
            value: rawObservation.referenceRange.high,
            unit: rawObservation.referenceRange.unit,
          },
        },
      ];
    }

    // Add note
    if (rawObservation.note) {
      fhirObservation.note = [
        {
          text: rawObservation.note,
        },
      ];
    }

    // Add device information if from wearable
    if (rawObservation.source?.deviceType) {
      fhirObservation.device = {
        display: `${rawObservation.source.deviceType} (${rawObservation.source.deviceId || 'unknown'})`,
      };
    }

    return fhirObservation;
  }

  /**
   * Create FHIR Bundle containing multiple resources
   * @param {Array} resources - Array of FHIR resources
   * @param {String} bundleType - Type of bundle (collection, transaction, batch)
   * @returns {Object} FHIR Bundle
   */
  createBundle(resources, bundleType = 'collection') {
    return {
      resourceType: 'Bundle',
      id: uuidv4(),
      meta: {
        lastUpdated: new Date().toISOString(),
      },
      type: bundleType,
      total: resources.length,
      entry: resources.map((resource) => ({
        fullUrl: `${resource.resourceType}/${resource.id}`,
        resource: resource,
      })),
    };
  }

  /**
   * Validate FHIR resource structure
   * @param {Object} fhirResource - FHIR resource to validate
   * @returns {Object} Validation result
   */
  validateFhirResource(fhirResource) {
    const errors = [];
    const warnings = [];

    // Basic validation
    if (!fhirResource.resourceType) {
      errors.push('Missing required field: resourceType');
    }

    if (fhirResource.resourceType === 'Patient') {
      if (!fhirResource.name || fhirResource.name.length === 0) {
        errors.push('Patient resource must have at least one name');
      }
      if (!fhirResource.gender) {
        warnings.push('Patient resource should have a gender');
      }
    }

    if (fhirResource.resourceType === 'Observation') {
      if (!fhirResource.status) {
        errors.push('Observation must have a status');
      }
      if (!fhirResource.code) {
        errors.push('Observation must have a code');
      }
      if (!fhirResource.subject) {
        errors.push('Observation must reference a subject (patient)');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Helper methods
  _formatDate(date) {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  _getCategoryCode(sourceType) {
    const categoryMap = {
      wearable: 'vital-signs',
      ehr: 'laboratory',
      lab: 'laboratory',
      manual: 'vital-signs',
    };
    return categoryMap[sourceType] || 'vital-signs';
  }

  _getCategoryDisplay(sourceType) {
    const displayMap = {
      wearable: 'Vital Signs',
      ehr: 'Laboratory',
      lab: 'Laboratory',
      manual: 'Vital Signs',
    };
    return displayMap[sourceType] || 'Vital Signs';
  }

  _getDisplayName(observationType) {
    const displayMap = {
      heart_rate: 'Heart Rate',
      blood_pressure: 'Blood Pressure',
      blood_glucose: 'Blood Glucose',
      body_temperature: 'Body Temperature',
      weight: 'Weight',
      height: 'Height',
      bmi: 'Body Mass Index',
      spo2: 'Oxygen Saturation',
      steps: 'Steps',
      sleep_duration: 'Sleep Duration',
      exercise_minutes: 'Exercise Minutes',
      respiratory_rate: 'Respiratory Rate',
    };
    return displayMap[observationType] || observationType;
  }

  _getInterpretationCode(interpretation) {
    const codeMap = {
      normal: 'N',
      high: 'H',
      low: 'L',
      critical_high: 'HH',
      critical_low: 'LL',
      abnormal: 'A',
    };
    return codeMap[interpretation] || 'N';
  }
}

module.exports = new FHIRNormalizationService();
