/**
 * WHO Data Routes
 * API endpoints for accessing and managing WHO health data
 */

const express = require('express');
const whoDataService = require('../library/whoDataService');
const HealthIndicator = require('../models/HealthIndicator');
const logger = require('../old_stuff/helper/logger');

const router = express.Router();

/**
 * GET /api/who/indicators
 * Query health indicators from database
 * 
 * Query parameters:
 * - country: Filter by country
 * - category: Filter by category (disease_burden, mortality, etc.)
 * - indicatorCode: Filter by indicator code
 * - year: Filter by specific year
 * - yearFrom, yearTo: Filter by year range
 * - tags: Filter by tags (comma-separated)
 * - limit: Maximum results (default: 100)
 */
router.get('/indicators', async (req, res) => {
  try {
    const { country, category, indicatorCode, year, yearFrom, yearTo, tags, limit } = req.query;

    const filters = {};
    if (country) filters.country = country;
    if (category) filters.category = category;
    if (indicatorCode) filters.indicatorCode = indicatorCode;
    if (year) filters.year = parseInt(year);
    if (yearFrom && yearTo) {
      filters.yearRange = {
        from: parseInt(yearFrom),
        to: parseInt(yearTo),
      };
    }
    if (tags) {
      filters.tags = tags.split(',').map((t) => t.trim());
    }
    if (limit) filters.limit = parseInt(limit);

    const results = await whoDataService.queryIndicators(filters);

    return res.status(200).json({
      success: true,
      data: results,
      count: results.length,
      filters,
    });
  } catch (error) {
    logger.error('[WHO Routes] Query indicators failed', {
      error: error.message,
      query: req.query,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/indicators/:indicatorCode
 * Get specific indicator details and all countries' data
 */
router.get('/indicators/:indicatorCode', async (req, res) => {
  try {
    const { indicatorCode } = req.params;
    const { year } = req.query;

    const filters = {
      indicatorCode,
    };
    if (year) {
      filters.year = parseInt(year);
    }

    const results = await whoDataService.queryIndicators(filters);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No data found for indicator: ${indicatorCode}`,
      });
    }

    return res.status(200).json({
      success: true,
      indicator: results[0].indicatorCode,
      indicatorName: results[0].indicatorName,
      category: results[0].category,
      description: results[0].description,
      data: results,
      count: results.length,
    });
  } catch (error) {
    logger.error('[WHO Routes] Get indicator failed', {
      error: error.message,
      indicatorCode: req.params.indicatorCode,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/country/:country
 * Get all health indicators for a specific country
 */
router.get('/country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const { year, category, limit } = req.query;

    const filters = {
      country,
      limit: limit ? parseInt(limit) : 100,
    };
    if (year) filters.year = parseInt(year);
    if (category) filters.category = category;

    const results = await whoDataService.queryIndicators(filters);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No data found for country: ${country}`,
      });
    }

    // Group by category
    const grouped = {};
    results.forEach((indicator) => {
      if (!grouped[indicator.category]) {
        grouped[indicator.category] = [];
      }
      grouped[indicator.category].push(indicator);
    });

    return res.status(200).json({
      success: true,
      country: results[0].geography.country,
      totalIndicators: results.length,
      byCategory: grouped,
    });
  } catch (error) {
    logger.error('[WHO Routes] Get country indicators failed', {
      error: error.message,
      country: req.params.country,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/disease-burden/:indicator
 * Compare disease burden across countries
 */
router.get('/disease-burden/:indicator', async (req, res) => {
  try {
    const { indicator } = req.params;
    const { year = 2023 } = req.query;

    const results = await whoDataService.getDiseaseBurdenComparison(indicator, parseInt(year));

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No disease burden data found for: ${indicator}`,
      });
    }

    return res.status(200).json({
      success: true,
      indicator,
      year: parseInt(year),
      comparison: results,
      topAffected: results.slice(0, 10),
      count: results.length,
    });
  } catch (error) {
    logger.error('[WHO Routes] Get disease burden failed', {
      error: error.message,
      indicator: req.params.indicator,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/who/fetch
 * Fetch and ingest WHO data
 * 
 * Body:
 * {
 *   "indicatorCodes": ["M_003", "M_004"], // Optional, will fetch defaults if not provided
 *   "countries": ["USA", "GBR", "IND"],    // Optional, will fetch defaults if not provided
 *   "year": 2023,                          // Optional, fetch specific year
 *   "fromYear": 2015,
 *   "toYear": 2023
 * }
 */
router.post('/fetch', async (req, res) => {
  try {
    const { indicatorCodes, countries, year, fromYear, toYear } = req.body;

    logger.info('[WHO Routes] Starting data fetch', {
      indicatorCodes: indicatorCodes?.length,
      countries: countries?.length,
    });

    const results = await whoDataService.bulkIngest({
      indicatorCodes,
      countries,
      year,
      fromYear: fromYear || 2015,
      toYear: toYear || 2023,
    });

    return res.status(200).json({
      success: true,
      message: 'WHO data ingestion completed',
      results: {
        successfulRecords: results.successfulRecords,
        failedRecords: results.failedRecords,
        savedIndicators: results.savedIndicators.length,
        errors: results.errors,
      },
    });
  } catch (error) {
    logger.error('[WHO Routes] Fetch failed', {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/training-dataset
 * Get structured dataset for AI model training
 * 
 * Query parameters:
 * - category: Data category (disease_burden, mortality, etc.)
 * - minYear: Minimum year (default: 2015)
 * - maxYear: Maximum year (default: 2023)
 * - minCountries: Minimum number of countries (default: 10)
 */
router.get('/training-dataset', async (req, res) => {
  try {
    const { category = 'disease_burden', minYear = 2015, maxYear = 2023, minCountries = 10 } = req.query;

    const dataset = await whoDataService.getTrainingDataset({
      category,
      minYear: parseInt(minYear),
      maxYear: parseInt(maxYear),
      minCountries: parseInt(minCountries),
    });

    return res.status(200).json({
      success: true,
      data: dataset,
    });
  } catch (error) {
    logger.error('[WHO Routes] Training dataset fetch failed', {
      error: error.message,
      query: req.query,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/available-indicators
 * Get list of available WHO indicators
 */
router.get('/available-indicators', (req, res) => {
  try {
    const availableIndicators = Object.entries(whoDataService.indicatorMappings).map(
      ([code, mapping]) => ({
        code,
        name: mapping.name,
        category: mapping.category,
        unit: mapping.unit,
      })
    );

    return res.status(200).json({
      success: true,
      indicators: availableIndicators,
      count: availableIndicators.length,
      totalAvailable: `${availableIndicators.length} pre-configured (more available via API)`,
    });
  } catch (error) {
    logger.error('[WHO Routes] List indicators failed', {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/who/summary
 * Get summary statistics of stored WHO data
 */
router.get('/summary', async (req, res) => {
  try {
    const totalRecords = await HealthIndicator.countDocuments();
    const uniqueCountries = await HealthIndicator.distinct('geography.country');
    const uniqueIndicators = await HealthIndicator.distinct('indicatorCode');
    const categories = await HealthIndicator.distinct('category');
    const yearRange = await HealthIndicator.aggregate([
      {
        $group: {
          _id: null,
          minYear: { $min: '$year' },
          maxYear: { $max: '$year' },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      summary: {
        totalRecords,
        uniqueCountries: uniqueCountries.length,
        uniqueIndicators: uniqueIndicators.length,
        categories: categories.length,
        yearRange: yearRange[0] || { minYear: null, maxYear: null },
        lastUpdated: new Date().toISOString(),
      },
      topCountries: uniqueCountries.slice(0, 10),
      indicatorCategories: categories,
    });
  } catch (error) {
    logger.error('[WHO Routes] Summary failed', {
      error: error.message,
    });
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
