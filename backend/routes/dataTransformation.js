/**
 * Data Transformation Routes
 * Endpoints for cleaning and transforming raw medical data
 */

const express = require('express');
const router = express.Router();
const DataTransformationService = require('../ai/transform_data');
const ErrorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');

// Initialize service
const transformService = new DataTransformationService();

/**
 * Health check endpoint
 * GET /api/transform/health
 */
router.get('/health', async (req, res, next) => {
  try {
    const health = await transformService.healthCheck();
    res.json(health);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({ 
      healthy: false, 
      error: 'Data transformation service unavailable' 
    });
  }
});

/**
 * Process raw patient data through full pipeline
 * POST /api/transform/process
 * Body: { rawData: "..." }
 */
router.post('/process', async (req, res, next) => {
  try {
    const { rawData } = req.body;

    if (!rawData || rawData.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'rawData field is required and cannot be empty',
      });
    }

    logger.debug('Processing raw patient data', { length: rawData.length });

    const result = await transformService.processPatientData(rawData);

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to process patient data'));
  }
});

/**
 * Clean and structure raw medical notes (Step 1 only)
 * POST /api/transform/clean
 * Body: { rawData: "..." }
 */
router.post('/clean', async (req, res, next) => {
  try {
    const { rawData } = req.body;

    if (!rawData || rawData.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'rawData field is required and cannot be empty',
      });
    }

    logger.debug('Cleaning raw data', { length: rawData.length });

    const structuredData = await transformService.cleanOnly(rawData);

    res.json({
      success: true,
      data: {
        original: rawData,
        structured: structuredData,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to clean data'));
  }
});

/**
 * Transform and validate lab results
 * POST /api/transform/labs
 * Body: { rawLabData: "..." }
 */
router.post('/labs', async (req, res, next) => {
  try {
    const { rawLabData } = req.body;

    if (!rawLabData || rawLabData.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'rawLabData field is required and cannot be empty',
      });
    }

    logger.debug('Transforming lab results', { length: rawLabData.length });

    const structuredLabs = await transformService.transformLabResults(rawLabData);

    res.json({
      success: true,
      data: structuredLabs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to transform lab results'));
  }
});

/**
 * Detect anomalies in already structured data
 * POST /api/transform/detect-anomalies
 * Body: { structuredData: {...} }
 */
router.post('/detect-anomalies', async (req, res, next) => {
  try {
    const { structuredData } = req.body;

    if (!structuredData || Object.keys(structuredData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'structuredData object is required',
      });
    }

    logger.debug('Detecting anomalies in structured data');

    const anomalyReport = await transformService.detectAnomaliesInStructuredData(structuredData);

    res.json({
      success: true,
      data: anomalyReport,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    next(ErrorHandler.handle(error, 'Failed to detect anomalies'));
  }
});

module.exports = router;
