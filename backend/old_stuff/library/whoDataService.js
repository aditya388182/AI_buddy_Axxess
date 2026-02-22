/**
 * WHO Data Integration Service
 * Fetches and processes health data from WHO Global Health Observatory (GHO)
 * Normalizes WHO data to FHIR format for AI training and analysis
 */

const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const HealthIndicator = require('../models/HealthIndicator');
const logger = require('../old_stuff/helper/logger');

class WHODataService {
  constructor() {
    // WHO GHO API endpoints
    this.ghoBaseUrl = 'https://www.who.int/data/gho';
    this.ghoApiUrl = 'https://www.who.int/data/gho/data/athena/json';
    
    // Cache for WHO indicator definitions
    this.indicatorCache = {};
    
    // Common health indicator mappings
    this.indicatorMappings = {
      'M_003': {
        name: 'Crude Death Rate',
        category: 'mortality',
        unit: 'per 1000 population',
      },
      'M_004': {
        name: 'Infant Mortality Rate',
        category: 'mortality',
        unit: 'per 1000 live births',
      },
      'M_005': {
        name: 'Under-five Mortality Rate',
        category: 'mortality',
        unit: 'per 1000 live births',
      },
      'M_075': {
        name: 'Life Expectancy at Birth',
        category: 'health_coverage',
        unit: 'years',
      },
      'UHCER_DIARRHEA': {
        name: 'Diarrheal Disease Mortality',
        category: 'disease_burden',
        unit: 'deaths per 100,000',
      },
      'UHCER_LOWERRESP': {
        name: 'Lower Respiratory Infection Mortality',
        category: 'disease_burden',
        unit: 'deaths per 100,000',
      },
      'UHCER_MALARIA': {
        name: 'Malaria Mortality',
        category: 'disease_burden',
        unit: 'deaths per 100,000',
      },
      'UHCER_TB': {
        name: 'Tuberculosis Mortality',
        category: 'disease_burden',
        unit: 'deaths per 100,000',
      },
      'UHCER_HIV': {
        name: 'HIV/AIDS Mortality',
        category: 'disease_burden',
        unit: 'deaths per 100,000',
      },
      'M_101': {
        name: 'DTP3 Immunization Coverage',
        category: 'vaccination',
        unit: 'percentage',
      },
      'M_117': {
        name: 'Measles Immunization Coverage',
        category: 'vaccination',
        unit: 'percentage',
      },
      'M_008': {
        name: 'Maternal Mortality Ratio',
        category: 'mortality',
        unit: 'per 100,000 live births',
      },
    };
    
    // Country code mappings
    this.countryMappings = {
      'USA': 'United States of America',
      'UK': 'United Kingdom',
      'CHN': 'China',
      'IND': 'India',
      'BRA': 'Brazil',
      'ZAF': 'South Africa',
      'MEX': 'Mexico',
      'JPN': 'Japan',
      'DEU': 'Germany',
      'FRA': 'France',
      'CAN': 'Canada',
      'AUS': 'Australia',
      'NZL': 'New Zealand',
      'IDN': 'Indonesia',
      'RUS': 'Russian Federation',
    };
  }

  /**
   * Fetch health indicator data from WHO GHO API
   * @param {Object} options - Query options
   * @param {String} options.indicatorCode - WHO indicator code (e.g., 'M_003')
   * @param {String} options.country - Country code or name
   * @param {Number} options.year - Specific year (optional)
   * @param {Number} options.fromYear - Start year (optional)
   * @param {Number} options.toYear - End year (optional)
   * @returns {Object} Raw WHO data response
   */
  async fetchFromWHO(options) {
    try {
      const { indicatorCode, country, year, fromYear = 2010, toYear = 2023 } = options;

      if (!indicatorCode || !country) {
        throw new Error('indicatorCode and country are required');
      }

      logger.info('[WHO Data] Fetching data', {
        indicator: indicatorCode,
        country,
        year,
        fromYear,
        toYear,
      });

      // Build WHO API query
      const params = {
        profile: 'json',
        filter: `COUNTRY:${country}`,
      };

      if (year) {
        params.filter += `;YEAR:${year}`;
      } else if (fromYear && toYear) {
        params.filter += `;YEAR:${fromYear}|${toYear}`;
      }

      const url = `${this.ghoApiUrl}?target=GHO/${indicatorCode}`;
      
      const response = await axios.get(url, {
        params,
        timeout: 15000,
      });

      logger.info('[WHO Data] Successfully fetched data', {
        indicator: indicatorCode,
        recordsReceived: response.data?.value?.length || 0,
      });

      return response.data;
    } catch (error) {
      logger.error('[WHO Data] Fetch failed', {
        error: error.message,
        options,
      });
      throw error;
    }
  }

  /**
   * Normalize WHO data to HealthIndicator model
   * @param {Object} whoData - Raw WHO API response
   * @param {String} indicatorCode - Indicator code
   * @param {String} country - Country name/code
   * @returns {Object} Normalized health indicator
   */
  normalizeWHOData(whoData, indicatorCode, country) {
    const mapping = this.indicatorMappings[indicatorCode];

    if (!whoData.value || whoData.value.length === 0) {
      throw new Error(`No data found for indicator ${indicatorCode} in ${country}`);
    }

    // Take the first (most recent) data point
    const dataPoint = whoData.value[0];

    const normalizedIndicator = {
      indicatorCode,
      indicatorName: mapping?.name || dataPoint.GHO || indicatorCode,
      description: `WHO Global Health Observatory indicator: ${indicatorCode}`,
      
      category: mapping?.category || 'other',
      
      dataSource: {
        type: 'who_gho',
        sourceId: indicatorCode,
        sourceUrl: `${this.ghoBaseUrl}/${indicatorCode}`,
      },
      
      geography: {
        country: this._normalizeCountry(country),
        countryCode: this._getCountryCode(country),
      },
      
      year: parseInt(dataPoint.Year) || new Date().getFullYear(),
      
      value: parseFloat(dataPoint.NumericValue),
      unit: mapping?.unit || dataPoint.Unit || 'unknown',
      
      dataQuality: this._assessDataQuality(dataPoint),
      
      populationAge: this._extractPopulationAge(dataPoint),
      populationGender: this._extractPopulationGender(dataPoint),
      
      interpretation: {
        trend: dataPoint.Trend || 'unknown',
      },
      
      notes: dataPoint.Comments || '',
      
      tags: [
        indicatorCode,
        mapping?.category || 'health_data',
        'who_data',
        'ai_training',
      ],
    };

    return normalizedIndicator;
  }

  /**
   * Save health indicator to database
   * @param {Object} indicator - Normalized indicator data
   * @returns {Object} Saved document
   */
  async saveIndicator(indicator) {
    try {
      const existingIndicator = await HealthIndicator.findOne({
        indicatorCode: indicator.indicatorCode,
        'geography.country': indicator.geography.country,
        year: indicator.year,
      });

      let saved;
      if (existingIndicator) {
        // Update existing
        Object.assign(existingIndicator, indicator);
        saved = await existingIndicator.save();
        logger.info('[WHO Data] Updated indicator', {
          indicator: indicator.indicatorCode,
          country: indicator.geography.country,
        });
      } else {
        // Create new
        saved = await HealthIndicator.create(indicator);
        logger.info('[WHO Data] Saved new indicator', {
          indicator: indicator.indicatorCode,
          country: indicator.geography.country,
        });
      }

      return saved;
    } catch (error) {
      logger.error('[WHO Data] Save failed', {
        error: error.message,
        indicatorCode: indicator.indicatorCode,
      });
      throw error;
    }
  }

  /**
   * Fetch and ingest WHO data for multiple countries
   * @param {Object} options - Query options
   * @returns {Object} Ingestion results
   */
  async bulkIngest(options) {
    const {
      indicatorCodes = Object.keys(this.indicatorMappings),
      countries = ['USA', 'GBR', 'CHN', 'IND', 'BRA', 'ZAF'],
      year,
      fromYear = 2015,
      toYear = 2023,
    } = options;

    const results = {
      indicators: indicatorCodes,
      countries,
      successfulRecords: 0,
      failedRecords: 0,
      savedIndicators: [],
      errors: [],
    };

    logger.info('[WHO Data] Starting bulk ingestion', {
      indicatorsCount: indicatorCodes.length,
      countriesCount: countries.length,
    });

    for (const indicatorCode of indicatorCodes) {
      for (const country of countries) {
        try {
          const whoData = await this.fetchFromWHO({
            indicatorCode,
            country,
            year,
            fromYear,
            toYear,
          });

          if (whoData.value && whoData.value.length > 0) {
            const normalized = this.normalizeWHOData(whoData, indicatorCode, country);
            const saved = await this.saveIndicator(normalized);
            results.savedIndicators.push(saved);
            results.successfulRecords++;
          }
        } catch (error) {
          results.failedRecords++;
          results.errors.push({
            indicator: indicatorCode,
            country,
            error: error.message,
          });
        }

        // Respect API rate limits
        await this._delay(100);
      }
    }

    logger.info('[WHO Data] Bulk ingestion completed', {
      successful: results.successfulRecords,
      failed: results.failedRecords,
    });

    return results;
  }

  /**
   * Query health indicators from database
   * @param {Object} filters - Query filters
   * @returns {Array} Matching indicators
   */
  async queryIndicators(filters = {}) {
    try {
      const query = {};

      if (filters.country) {
        query['geography.country'] = filters.country;
      }
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.indicatorCode) {
        query.indicatorCode = filters.indicatorCode;
      }
      if (filters.year) {
        query.year = filters.year;
      }
      if (filters.yearRange) {
        query.year = {
          $gte: filters.yearRange.from,
          $lte: filters.yearRange.to,
        };
      }
      if (filters.tags) {
        query.tags = { $in: Array.isArray(filters.tags) ? filters.tags : [filters.tags] };
      }

      const results = await HealthIndicator.find(query)
        .sort({ year: -1, lastUpdated: -1 })
        .limit(filters.limit || 100);

      logger.info('[WHO Data] Query executed', {
        filters,
        resultCount: results.length,
      });

      return results;
    } catch (error) {
      logger.error('[WHO Data] Query failed', {
        error: error.message,
        filters,
      });
      throw error;
    }
  }

  /**
   * Get data for AI training
   * Returns structured dataset with features and labels
   * @param {Object} options - Dataset options
   * @returns {Object} Training dataset
   */
  async getTrainingDataset(options = {}) {
    const {
      category = 'disease_burden',
      minYear = 2015,
      maxYear = 2023,
      minCountries = 10,
    } = options;

    try {
      const indicators = await HealthIndicator.find({
        category,
        year: { $gte: minYear, $lte: maxYear },
      })
        .sort({ year: -1 })
        .lean();

      if (indicators.length < minCountries) {
        throw new Error(`Insufficient data: found ${indicators.length} records, need at least ${minCountries}`);
      }

      // Group by country and year for structured dataset
      const dataset = {};
      const countries = new Set();
      const years = new Set();

      indicators.forEach((indicator) => {
        const country = indicator.geography.country;
        const year = indicator.year;

        countries.add(country);
        years.add(year);

        if (!dataset[country]) {
          dataset[country] = {};
        }
        if (!dataset[country][year]) {
          dataset[country][year] = {};
        }

        dataset[country][year][indicator.indicatorCode] = {
          value: indicator.value,
          unit: indicator.unit,
          quality: indicator.dataQuality,
        };
      });

      logger.info('[WHO Data] Training dataset created', {
        category,
        countries: countries.size,
        years: years.size,
        records: indicators.length,
      });

      return {
        category,
        period: {
          from: minYear,
          to: maxYear,
        },
        statistics: {
          totalCountries: countries.size,
          totalYears: years.size,
          totalRecords: indicators.length,
        },
        countries: Array.from(countries).sort(),
        years: Array.from(years).sort(),
        dataset,
      };
    } catch (error) {
      logger.error('[WHO Data] Training dataset creation failed', {
        error: error.message,
        options,
      });
      throw error;
    }
  }

  /**
   * Get disease burden comparison across countries
   * @param {String} indicator - Disease/condition indicator
   * @param {Number} year - Year of comparison
   * @returns {Array} Sorted comparison data
   */
  async getDiseaseBurdenComparison(indicator, year = 2023) {
    try {
      const results = await HealthIndicator.find({
        indicatorCode: indicator,
        year,
        category: 'disease_burden',
      })
        .sort({ value: -1 })
        .lean();

      return results.map((r) => ({
        country: r.geography.country,
        value: r.value,
        unit: r.unit,
        quality: r.dataQuality,
        dataSource: r.dataSource.sourceId,
      }));
    } catch (error) {
      logger.error('[WHO Data] Disease burden comparison failed', {
        error: error.message,
        indicator,
        year,
      });
      throw error;
    }
  }

  // ========== Helper Methods ==========

  _normalizeCountry(country) {
    return this.countryMappings[country] || country;
  }

  _getCountryCode(country) {
    for (const [code, name] of Object.entries(this.countryMappings)) {
      if (name.toUpperCase() === country.toUpperCase() || code.toUpperCase() === country.toUpperCase()) {
        return code;
      }
    }
    return country;
  }

  _assessDataQuality(dataPoint) {
    if (dataPoint.Comments && dataPoint.Comments.toLowerCase().includes('estimate')) {
      return 'estimated';
    }
    if (dataPoint.Trend === 'unknown') {
      return 'low';
    }
    return 'medium';
  }

  _extractPopulationAge(dataPoint) {
    if (dataPoint.AgeGroup) {
      if (dataPoint.AgeGroup.includes('under') || dataPoint.AgeGroup.includes('Under')) {
        return 'under_5';
      }
      if (dataPoint.AgeGroup.includes('70') || dataPoint.AgeGroup.includes('Elder')) {
        return '70_plus';
      }
    }
    return 'all_ages';
  }

  _extractPopulationGender(dataPoint) {
    if (dataPoint.Gender || dataPoint.Sex) {
      const gender = (dataPoint.Gender || dataPoint.Sex).toLowerCase();
      if (gender.includes('male')) return 'male';
      if (gender.includes('female')) return 'female';
    }
    return 'both';
  }

  _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = new WHODataService();
