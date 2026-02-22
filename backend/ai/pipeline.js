/**
 * AI Anomaly Detection Pipeline
 * Uses DeepSeek-V3.2 to detect anomalies in patient health data
 */

const OpenAI = require('openai');
const logger = require('../utils/logger');

class AnomalyDetectionPipeline {
  constructor(config = {}) {
    this.client = new OpenAI({
      baseURL: config.baseURL || 'https://api.featherless.ai/v1',
      apiKey: config.apiKey || process.env.FEATHERLESS_API_KEY || 'rc_4f027275f3f72b7bbc8ee4c449a9f721bf8bea5e9f4a1bfe168439c883fb1b7f',
    });
    this.model = config.model || 'deepseek-ai/DeepSeek-V3.2';
    this.maxTokens = config.maxTokens || 4096;
  }

  /**
   * Analyze patient health data for anomalies
   * @param {Object} patientData - Patient health data object
   * @returns {Promise<Object>} Anomaly detection results
   */
  async detectAnomalies(patientData) {
    try {
      const prompt = this._buildAnomalyPrompt(patientData);
      
      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.2, // Lower temperature for more deterministic analysis
        messages: [
          {
            role: 'system',
            content: 'You are a medical data analyst AI assistant. Your role is to identify anomalies, outliers, and concerning patterns in patient health data. Respond with structured JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const result = response.choices[0].message.content;
      return this._parseAnomalyResponse(result);
    } catch (error) {
      logger.error('Anomaly detection failed', { error: error.message });
      throw new Error(`Anomaly detection failed: ${error.message}`);
    }
  }

  /**
   * Detect anomalies in vital signs
   * @param {Object} vitals - Vital signs data
   * @returns {Promise<Object>} Anomaly report
   */
  async detectVitalAnomalies(vitals) {
    try {
      const prompt = `Analyze these vital signs for anomalies, outliers, or concerning patterns:

${JSON.stringify(vitals, null, 2)}

Consider:
- Normal ranges for each vital sign
- Age and gender-appropriate ranges
- Trends over time if multiple readings present
- Critical values requiring immediate attention
- Mild vs severe anomalies

Return JSON format:
{
  "hasAnomalies": boolean,
  "severity": "none|mild|moderate|severe|critical",
  "anomalies": [
    {
      "parameter": "...",
      "value": "...",
      "expected": "...",
      "severity": "...",
      "reason": "...",
      "recommendation": "..."
    }
  ],
  "overallRisk": "low|medium|high|critical",
  "requiresImmediateAttention": boolean,
  "summary": "..."
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI analyzing vital signs. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return this._parseJSON(response.choices[0].message.content);
    } catch (error) {
      logger.error('Vital anomaly detection failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Detect anomalies in lab results
   * @param {Array} labResults - Array of lab result objects
   * @returns {Promise<Object>} Lab anomaly report
   */
  async detectLabAnomalies(labResults) {
    try {
      const prompt = `Analyze these lab results for anomalies and concerning patterns:

${JSON.stringify(labResults, null, 2)}

Identify:
- Values outside normal ranges
- Critical values
- Concerning combinations of abnormal values
- Trends suggesting specific conditions

Return JSON format:
{
  "hasAnomalies": boolean,
  "abnormalResults": [
    {
      "testName": "...",
      "value": "...",
      "normalRange": "...",
      "interpretation": "...",
      "severity": "mild|moderate|severe|critical"
    }
  ],
  "possibleConditions": ["..."],
  "recommendations": ["..."],
  "urgency": "routine|urgent|critical"
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a medical laboratory AI analyzing test results. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return this._parseJSON(response.choices[0].message.content);
    } catch (error) {
      logger.error('Lab anomaly detection failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Detect anomalies in medication patterns
   * @param {Array} medications - Array of medication objects
   * @param {Object} patientInfo - Patient demographic and condition info
   * @returns {Promise<Object>} Medication anomaly report
   */
  async detectMedicationAnomalies(medications, patientInfo = {}) {
    try {
      const prompt = `Analyze this medication regimen for anomalies, interactions, or concerns:

Patient Info: ${JSON.stringify(patientInfo, null, 2)}

Medications: ${JSON.stringify(medications, null, 2)}

Identify:
- Dangerous drug interactions
- Duplicate therapies
- Inappropriate dosages
- Contraindications based on patient conditions
- Missing expected medications

Return JSON format:
{
  "hasAnomalies": boolean,
  "interactions": [
    {
      "medications": ["...", "..."],
      "severity": "mild|moderate|severe",
      "description": "...",
      "recommendation": "..."
    }
  ],
  "dosageIssues": [
    {
      "medication": "...",
      "issue": "...",
      "recommendation": "..."
    }
  ],
  "contraindications": ["..."],
  "recommendations": ["..."],
  "requiresReview": boolean
}`;

      const response = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a pharmaceutical AI analyzing medication regimens. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      return this._parseJSON(response.choices[0].message.content);
    } catch (error) {
      logger.error('Medication anomaly detection failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Build prompt for general anomaly detection
   * @private
   */
  _buildAnomalyPrompt(patientData) {
    return `Analyze this patient health data comprehensively for any anomalies, concerning patterns, or data quality issues:

${JSON.stringify(patientData, null, 2)}

Provide a comprehensive analysis including:
1. Data quality issues (missing, inconsistent, or suspicious data)
2. Clinical anomalies (abnormal values, concerning patterns)
3. Risk assessment
4. Recommendations for clinical follow-up

Return your analysis in valid JSON format:
{
  "dataQuality": {
    "score": 0.0-1.0,
    "issues": [{"field": "...", "issue": "...", "severity": "..."}]
  },
  "clinicalAnomalies": [
    {
      "category": "vitals|labs|medications|symptoms",
      "finding": "...",
      "severity": "mild|moderate|severe|critical",
      "recommendation": "..."
    }
  ],
  "riskAssessment": {
    "overallRisk": "low|medium|high|critical",
    "specificRisks": ["..."]
  },
  "recommendations": {
    "immediate": ["..."],
    "followUp": ["..."],
    "preventive": ["..."]
  },
  "requiresProviderReview": boolean
}`;
  }

  /**
   * Parse anomaly detection response
   * @private
   */
  _parseAnomalyResponse(responseText) {
    try {
      return this._parseJSON(responseText);
    } catch (error) {
      logger.error('Failed to parse anomaly response', { responseText });
      return {
        error: 'Failed to parse AI response',
        rawResponse: responseText,
      };
    }
  }

  /**
   * Extract and parse JSON from response
   * @private
   */
  _parseJSON(text) {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error(`Could not extract JSON from response: ${text.substring(0, 200)}`);
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Health check for AI service
   */
  async healthCheck() {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: 'Respond with: OK',
          },
        ],
        max_tokens: 10,
      });

      if (response.choices?.[0]?.message?.content) {
        logger.info('AI Pipeline healthy', { model: this.model });
        return { healthy: true, model: this.model };
      }
      throw new Error('Invalid response');
    } catch (error) {
      logger.error('AI Pipeline unhealthy', { error: error.message });
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = AnomalyDetectionPipeline;
