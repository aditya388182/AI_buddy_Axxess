/**
 * AI Data Transformation Service
 * Two-step pipeline: Data Cleaning (Qwen) → Anomaly Detection (DeepSeek)
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');

class DataTransformationService {
  constructor(config = {}) {
    this.client = new OpenAI({
      baseURL: config.baseURL || 'https://api.featherless.ai/v1',
      apiKey: config.apiKey || process.env.FEATHERLESS_API_KEY || 'KEY GOES HERE',
    });
    this.cleaningModel = config.cleaningModel || 'Qwen/Qwen2.5-72B-Instruct';
    this.anomalyModel = config.anomalyModel || 'deepseek-ai/DeepSeek-V3.2';
  }

  /**
   * Process patient data through full pipeline
   * STEP 1: Clean and structure data (Qwen)
   * STEP 2: Detect anomalies (DeepSeek)
   * @param {String} rawData - Raw patient notes or data
   * @returns {Promise<Object>} Cleaned data and anomaly report
   */
  async processPatientData(rawData) {
    try {
      logger.info('Starting data transformation pipeline', { dataLength: rawData.length });

      // STEP 1: Data Cleaning & Transformation
      const structuredData = await this.cleanAndStructureData(rawData);
      
      // STEP 2: Anomaly Detection
      const anomalyReport = await this.detectAnomaliesInStructuredData(structuredData);

      return {
        success: true,
        original: rawData,
        structured: structuredData,
        anomalies: anomalyReport,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Pipeline processing failed', { error: error.message });
      throw new Error(`Pipeline failed: ${error.message}`);
    }
  }

  /**
   * STEP 1: Clean and structure raw medical data using Qwen
   * @param {String} rawData - Raw medical notes or data
   * @returns {Promise<Object>} Structured JSON data
   */
  async cleanAndStructureData(rawData) {
    try {
      logger.debug('Cleaning data with Qwen', { model: this.cleaningModel });

      const response = await this.client.chat.completions.create({
        model: this.cleaningModel,
        messages: [
          {
            role: 'system',
            content: `You are a medical data transformation assistant. Your task is to:
1. Parse messy medical notes into structured JSON format
2. Standardize units (e.g., convert temperatures to Celsius, BP to mmHg)
3. Fix typos and abbreviations
4. Extract key information: patient demographics, vitals, medications, symptoms, lab results

Return ONLY valid JSON in this format:
{
  "patient": {
    "name": "...",
    "age": number,
    "gender": "..."
  },
  "vitals": {
    "bloodPressure": { "systolic": number, "diastolic": number },
    "temperature": number,
    "heartRate": number,
    "respiratoryRate": number
  },
  "medications": [
    { "name": "...", "dosage": "...", "frequency": "..." }
  ],
  "labs": [
    { "test": "...", "value": number, "unit": "..." }
  ],
  "symptoms": ["..."],
  "notes": "..."
}`,
          },
          {
            role: 'user',
            content: rawData,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const structuredText = response.choices[0].message.content;
      return this._parseJSON(structuredText);
    } catch (error) {
      logger.error('Data cleaning failed', { error: error.message });
      throw new Error(`Data cleaning failed: ${error.message}`);
    }
  }

  /**
   * STEP 2: Detect anomalies in structured data using DeepSeek
   * @param {Object} structuredData - Cleaned, structured patient data
   * @returns {Promise<Object>} Anomaly detection report
   */
  async detectAnomaliesInStructuredData(structuredData) {
    try {
      logger.debug('Detecting anomalies with DeepSeek', { model: this.anomalyModel });

      const response = await this.client.chat.completions.create({
        model: this.anomalyModel,
        messages: [
          {
            role: 'system',
            content: `You are a senior clinical analyst. Review the structured patient data and identify:
1. Physiological anomalies (values outside normal ranges)
2. Medical contradictions (conflicting medications or diagnoses)
3. Critical warning signs requiring immediate attention
4. Data inconsistencies

Provide detailed reasoning for each finding.

Return ONLY valid JSON:
{
  "hasAnomalies": boolean,
  "criticalFindings": [
    {
      "category": "vitals|labs|medications|symptoms",
      "finding": "...",
      "severity": "critical|high|medium|low",
      "reasoning": "...",
      "recommendation": "..."
    }
  ],
  "contradictions": [
    {
      "issue": "...",
      "explanation": "..."
    }
  ],
  "riskLevel": "critical|high|medium|low",
  "requiresImmediateAttention": boolean,
  "clinicalSummary": "..."
}`,
          },
          {
            role: 'user',
            content: JSON.stringify(structuredData, null, 2),
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });

      const anomalyText = response.choices[0].message.content;
      return this._parseJSON(anomalyText);
    } catch (error) {
      logger.error('Anomaly detection failed', { error: error.message });
      throw new Error(`Anomaly detection failed: ${error.message}`);
    }
  }

  /**
   * Clean medical notes only (Step 1 standalone)
   * @param {String} rawData - Raw medical notes
   * @returns {Promise<Object>} Structured data
   */
  async cleanOnly(rawData) {
    return this.cleanAndStructureData(rawData);
  }

  /**
   * Transform and validate lab results
   * @param {String} rawLabData - Raw lab result text
   * @returns {Promise<Object>} Structured and validated lab results
   */
  async transformLabResults(rawLabData) {
    try {
      const response = await this.client.chat.completions.create({
        model: this.cleaningModel,
        messages: [
          {
            role: 'system',
            content: `Transform raw lab results into structured JSON format. Standardize test names and units.
            
Return JSON:
{
  "labs": [
    {
      "test": "standardized test name",
      "value": number,
      "unit": "standardized unit",
      "referenceRange": "...",
      "flag": "normal|low|high|critical"
    }
  ]
}`,
          },
          {
            role: 'user',
            content: rawLabData,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      return this._parseJSON(response.choices[0].message.content);
    } catch (error) {
      logger.error('Lab transformation failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Parse JSON from AI response
   * @private
   */
  _parseJSON(text) {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error(`Could not extract JSON from response: ${text.substring(0, 200)}`);
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      throw new Error(`Invalid JSON in response: ${error.message}`);
    }
  }

  /**
   * Health check for data transformation service
   */
  async healthCheck() {
    try {
      const response = await this.client.chat.completions.create({
        model: this.cleaningModel,
        messages: [
          {
            role: 'user',
            content: 'Respond with: OK',
          },
        ],
        max_tokens: 10,
      });

      if (response.choices?.[0]?.message?.content) {
        logger.info('Data transformation service healthy', { 
          cleaningModel: this.cleaningModel,
          anomalyModel: this.anomalyModel 
        });
        return { 
          healthy: true, 
          models: {
            cleaning: this.cleaningModel,
            anomaly: this.anomalyModel
          }
        };
      }
      throw new Error('Invalid response');
    } catch (error) {
      logger.error('Data transformation service unhealthy', { error: error.message });
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = DataTransformationService;