const mongoose = require('mongoose');

/**
 * Health Observation Model
 * Stores all health measurements and observations
 * Based on FHIR Observation Resource
 * Includes EHR data and wearable device data
 */

const healthObservationSchema = new mongoose.Schema({
  // Reference to patient
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    index: true,
  },
  
  // FHIR Observation fields
  fhirId: {
    type: String,
    sparse: true,
    index: true,
  },
  
  // Observation Type and Code (LOINC/SNOMED codes)
  observationType: {
    type: String,
    required: true,
    enum: [
      'heart_rate',
      'blood_pressure',
      'blood_glucose',
      'body_temperature',
      'weight',
      'height',
      'bmi',
      'spo2',
      'steps',
      'sleep_duration',
      'exercise_minutes',
      'respiratory_rate',
      'cholesterol',
      'hemoglobin',
      'lab_result',
      'other',
    ],
    index: true,
  },
  
  // LOINC Code (standard medical coding)
  loincCode: {
    type: String,
  },
  
  // Value and Unit
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be number, string, or object
    required: true,
  },
  
  unit: {
    type: String,
    required: true,
  },
  
  // For complex measurements (e.g., blood pressure has systolic/diastolic)
  components: [{
    type: {
      type: String,
    },
    value: mongoose.Schema.Types.Mixed,
    unit: String,
  }],
  
  // Timestamp
  effectiveDateTime: {
    type: Date,
    required: true,
    index: true,
  },
  
  // Data Source
  source: {
    type: {
      type: String,
      enum: ['ehr', 'wearable', 'manual', 'lab'],
      required: true,
    },
    deviceType: String, // e.g., 'fitbit', 'apple_watch'
    deviceId: String,
    ehrSystem: String, // e.g., 'epic', 'cerner'
  },
  
  // Status and Validation
  status: {
    type: String,
    enum: ['preliminary', 'final', 'amended', 'corrected', 'cancelled', 'error'],
    default: 'final',
  },
  
  validated: {
    type: Boolean,
    default: false,
  },
  
  // Clinical Context
  interpretation: {
    type: String,
    enum: ['normal', 'high', 'low', 'critical_high', 'critical_low', 'abnormal'],
  },
  
  // Reference ranges
  referenceRange: {
    low: Number,
    high: Number,
    unit: String,
  },
  
  // Notes
  note: String,
  
  // Metadata
  ingestionTimestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  
  batchId: {
    type: String,
    index: true,
  },
  
  // FHIR Bundle (raw FHIR data if applicable)
  rawFhirData: {
    type: mongoose.Schema.Types.Mixed,
  },
  
}, {
  timestamps: true,
});

// Compound indexes for common queries
healthObservationSchema.index({ patientId: 1, observationType: 1, effectiveDateTime: -1 });
healthObservationSchema.index({ patientId: 1, effectiveDateTime: -1 });
healthObservationSchema.index({ ingestionTimestamp: -1 });

module.exports = mongoose.model('HealthObservation', healthObservationSchema);
