/**
 * AI Anomaly Detection Routes
 * Endpoints for detecting anomalies in patient health data
 */

const express = require('express');
const router = express.Router();
const AnomalyDetectionPipeline = require('../ai/pipeline');
const ErrorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

// Initialize pipeline
const pipeline = new AnomalyDetectionPipeline();

/**
 * Health check endpoint
 * GET /api/anomaly/health
 */
router.get('/health', async (req, res, next) => {
  try {
    const health = await pipeline.healthCheck();
    res.json(health);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({ 
      healthy: false, 
      error: 'AI service unavailable' 
    });
  }
});

/**
 * Detect general anomalies in patient data
 * POST /api/anomaly/detect
 * Body: { patientData: {...} }
 */
router.post('/detect', async (req, res, next) => {
  try {
    const { patientData } = req.body;

    if (!patientData || Object.keys(patientData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'patientData is required',
      });
    }

    logger.debug('Detecting anomalies', { fields: Object.keys(patientData).length });

    const result = await pipeline.detectAnomalies(patientData);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to detect anomalies'));
  }
});

/**
 * Detect vital sign anomalies
 * POST /api/anomaly/vitals
 * Body: { vitals: {...} }
 */
router.post('/vitals', async (req, res, next) => {
  try {
    const { vitals } = req.body;

    if (!vitals) {
      return res.status(400).json({
        success: false,
        error: 'vitals data is required',
      });
    }

    logger.debug('Analyzing vital signs', { vitals });

    const result = await pipeline.detectVitalAnomalies(vitals);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to analyze vitals'));
  }
});

/**
 * Detect lab result anomalies
 * POST /api/anomaly/labs
 * Body: { labResults: [...] }
 */
router.post('/labs', async (req, res, next) => {
  try {
    const { labResults } = req.body;

    if (!labResults || !Array.isArray(labResults)) {
      return res.status(400).json({
        success: false,
        error: 'labResults array is required',
      });
    }

    logger.debug('Analyzing lab results', { count: labResults.length });

    const result = await pipeline.detectLabAnomalies(labResults);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to analyze lab results'));
  }
});

/**
 * Detect medication anomalies
 * POST /api/anomaly/medications
 * Body: { medications: [...], patientInfo: {...} }
 */
router.post('/medications', async (req, res, next) => {
  try {
    const { medications, patientInfo } = req.body;

    if (!medications || !Array.isArray(medications)) {
      return res.status(400).json({
        success: false,
        error: 'medications array is required',
      });
    }

    logger.debug('Analyzing medications', { count: medications.length });

    const result = await pipeline.detectMedicationAnomalies(medications, patientInfo);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to analyze medications'));
  }
});

module.exports = router;
