const mongoose = require('mongoose');

/**
 * Patient Model
 * Stores patient demographic and identification data
 * FHIR-compatible structure
 */

const patientSchema = new mongoose.Schema({
  // FHIR Patient Resource fields
  fhirId: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  
  // Demographics
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  
  dateOfBirth: {
    type: Date,
    required: true,
  },
  
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'unknown'],
    required: true,
  },
  
  // Contact Information
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  
  phone: {
    type: String,
    trim: true,
  },
  
  address: {
    line: [String],
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  
  // Medical Record Numbers
  mrn: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
  },
  
  // Connected Devices/Services
  connectedDevices: [{
    deviceType: {
      type: String,
      enum: ['fitbit', 'apple_watch', 'samsung_health', 'google_fit', 'manual', 'other'],
    },
    deviceId: String,
    connected: {
      type: Boolean,
      default: true,
    },
    lastSync: Date,
    apiCredentials: {
      type: mongoose.Schema.Types.Mixed,
      select: false, // Don't include by default for security
    },
  }],
  
  // Healthcare Provider References
  primaryProviderId: {
    type: String,
  },
  
  hospitalSystem: {
    type: String,
  },
  
  // Metadata
  active: {
    type: Boolean,
    default: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  lastDataIngestion: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for performance
patientSchema.index({ lastName: 1, firstName: 1 });
patientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Patient', patientSchema);
