const mongoose = require('mongoose');

/**
 * Health Indicator Model
 * Stores aggregated health metrics from WHO and other public health sources
 * Used for population-level data for AI training and analysis
 */

const healthIndicatorSchema = new mongoose.Schema({
  // Indicator metadata
  indicatorCode: {
    type: String,
    required: true,
    index: true,
  },
  
  indicatorName: {
    type: String,
    required: true,
  },
  
  description: String,
  
  // Data classification
  category: {
    type: String,
    enum: [
      'disease_burden',
      'mortality',
      'morbidity',
      'health_coverage',
      'risk_factors',
      'environmental_health',
      'health_services',
      'health_workforce',
      'health_financing',
      'vaccination',
      'epidemiology',
      'other',
    ],
    index: true,
  },
  
  dataSource: {
    type: {
      type: String,
      enum: ['who_gho', 'worldbank', 'un_data', 'cdc', 'manual', 'other'],
      required: true,
    },
    sourceId: String, // e.g., 'GHO_M_003' for WHO
    sourceUrl: String,
  },
  
  // Geographic data
  geography: {
    country: String,
    countryCode: String, // ISO 3166-1 alpha-3
    region: String,
    subRegion: String,
    latitude: Number,
    longitude: Number,
  },
  
  // Temporal data
  year: {
    type: Number,
    required: true,
    index: true,
  },
  
  // Measurement
  value: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  
  unit: {
    type: String,
  },
  
  dataQuality: {
    type: String,
    enum: ['high', 'medium', 'low', 'estimated'],
    default: 'medium',
  },
  
  // Population details
  populationAge: {
    type: String,
    enum: ['all_ages', 'under_5', '5_14', '15_49', '50_69', '70_plus', 'other'],
    default: 'all_ages',
  },
  
  populationGender: {
    type: String,
    enum: ['both', 'male', 'female', 'other'],
    default: 'both',
  },
  
  // Additional context
  interpretation: {
    normalRange: {
      low: mongoose.Schema.Types.Decimal128,
      high: mongoose.Schema.Types.Decimal128,
    },
    targetValue: mongoose.Schema.Types.Decimal128,
    trend: {
      type: String,
      enum: ['improving', 'declining', 'stable', 'unknown'],
    },
  },
  
  // Confidence interval
  confidenceInterval: {
    lower: mongoose.Schema.Types.Decimal128,
    upper: mongoose.Schema.Types.Decimal128,
  },
  
  // Notes and metadata
  notes: String,
  
  // Related indicators
  relatedIndicators: [String], // Other indicator codes that relate to this
  
  // Data integration
  normalizedFhir: {
    resourceType: String, // 'Observation', 'Population'
    code: String,
    system: String,
  },
  
  // Timestamps
  dataCollectionDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  
  // Tags for searching
  tags: [String],
  
}, {
  timestamps: true,
});

// Compound indexes for common queries
healthIndicatorSchema.index({ country: 1, year: -1 });
healthIndicatorSchema.index({ category: 1, year: -1 });
healthIndicatorSchema.index({ indicatorCode: 1, year: -1 });
healthIndicatorSchema.index({ dataSource: 1, lastUpdated: -1 });
healthIndicatorSchema.index({ tags: 1 });

module.exports = mongoose.model('HealthIndicator', healthIndicatorSchema);
