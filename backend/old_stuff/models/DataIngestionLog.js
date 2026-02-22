const mongoose = require('mongoose');

/**
 * Data Ingestion Log Model
 * Tracks all data ingestion activities for auditing and debugging
 * Ensures compliance and traceability
 */

const dataIngestionLogSchema = new mongoose.Schema({
  // Ingestion Details
  batchId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  
  source: {
    type: String,
    enum: ['ehr', 'wearable', 'manual', 'lab', 'api'],
    required: true,
  },
  
  sourceDetails: {
    system: String, // e.g., 'epic', 'fitbit', 'samsung_health'
    endpoint: String,
    apiVersion: String,
  },
  
  // Patient Reference
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    index: true,
  },
  
  // Ingestion Statistics
  recordsReceived: {
    type: Number,
    default: 0,
  },
  
  recordsProcessed: {
    type: Number,
    default: 0,
  },
  
  recordsSuccessful: {
    type: Number,
    default: 0,
  },
  
  recordsFailed: {
    type: Number,
    default: 0,
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'partial'],
    default: 'pending',
    index: true,
  },
  
  // Timestamps
  startTime: {
    type: Date,
    default: Date.now,
  },
  
  endTime: {
    type: Date,
  },
  
  duration: {
    type: Number, // in milliseconds
  },
  
  // Error Tracking
  errorList: [{
    timestamp: Date,
    errorType: String,
    errorMessage: String,
    recordIndex: Number,
    recordData: mongoose.Schema.Types.Mixed,
  }],
  
  // Validation Issues
  validationWarnings: [{
    timestamp: Date,
    warningType: String,
    message: String,
    recordIndex: Number,
  }],
  
  // Data Integrity
  dataHash: String, // For verifying data hasn't been tampered with
  
  // Additional Context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  
}, {
  timestamps: true,
});

// Indexes for querying logs
dataIngestionLogSchema.index({ startTime: -1 });
dataIngestionLogSchema.index({ source: 1, status: 1 });

module.exports = mongoose.model('DataIngestionLog', dataIngestionLogSchema);
