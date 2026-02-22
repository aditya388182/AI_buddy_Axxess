/**
 * LLM Data Cleaning Service
 * Uses Llama 3.1 8B (via Ollama) to transform and clean patient data
 * Optimized for healthcare data with privacy-first local inference
 */

const logger = require('../helper/logger');

class LLMDataCleaningService {
  constructor(config = {}) {
    this.provider = config.provider || 'ollama';
    this.modelName = config.modelName || 'llama2:7b-chat';
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.timeout = config.timeout || 30000; // 30 seconds
    this.maxRetries = config.maxRetries || 2;
  }

  /**
   * Clean and normalize patient name
   * @param {String} firstName - Patient first name
   * @param {String} lastName - Patient last name
   * @returns {Promise<Object>} Cleaned name object
   */
  async cleanPatientName(firstName, lastName) {
    const prompt = `You are a healthcare data cleaning assistant. Clean and standardize these patient names. Remove titles, extra spaces, special characters, and normalize case.
    
First Name: "${firstName}"
Last Name: "${lastName}"

Return ONLY a valid JSON object (no markdown, no code blocks): { "firstName": "...", "lastName": "...", "confidence": 0.0-1.0 }`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error cleaning patient name', { firstName, lastName, error: error.message });
      throw error;
    }
  }

  /**
   * Validate and standardize medical observations
   * @param {Object} observation - Observation data
   * @returns {Promise<Object>} Validated observation
   */
  async validateObservation(observation) {
    const prompt = `You are a medical data validation specialist. Validate and clean this health observation. Ensure values are within reasonable ranges for the observation type.

Observation Type: ${observation.observationType}
Value: ${observation.value}
Unit: ${observation.unit}
Recorded Time: ${observation.recordedAt || 'unknown'}

Return ONLY a valid JSON object: { "value": number, "unit": "...", "isValid": boolean, "outOfRange": boolean, "notes": "..." }`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error validating observation', { observation, error: error.message });
      throw error;
    }
  }

  /**
   * Extract structured data from clinical notes
   * @param {String} notes - Raw clinical notes
   * @returns {Promise<Object>} Extracted structured data
   */
  async extractFromClinicalNotes(notes) {
    const prompt = `You are a clinical data extraction specialist. Extract key medical information from these clinical notes into structured format.

Clinical Notes:
"${notes}"

Return ONLY a valid JSON object: { 
  "conditions": [{ "name": "...", "status": "active/resolved", "severity": "mild/moderate/severe" }], 
  "medications": [{ "name": "...", "dosage": "...", "frequency": "..." }], 
  "vitals": { "bloodPressure": "...", "heartRate": ..., "temperature": ... }, 
  "symptoms": [{ "name": "...", "duration": "...", "severity": "..." }],
  "recommendations": ["..."],
  "extractionConfidence": 0.0-1.0
}`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error extracting from clinical notes', { error: error.message });
      throw error;
    }
  }

  /**
   * Standardize medication data
   * @param {String} medicationInput - Raw medication input
   * @returns {Promise<Object>} Standardized medication
   */
  async standardizeMedication(medicationInput) {
    const prompt = `You are a pharmaceutical data specialist. Standardize this medication information into medical format. Include proper drug name, dosage, frequency, and route of administration.

Input: "${medicationInput}"

Return ONLY a valid JSON object: { 
  "drugName": "...", 
  "dosage": "...", 
  "frequency": "...", 
  "route": "oral/intramuscular/intravenous/topical/other", 
  "indication": "...",
  "confidence": 0.0-1.0
}`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error standardizing medication', { medicationInput, error: error.message });
      throw error;
    }
  }

  /**
   * Detect data quality issues
   * @param {Object} patientData - Patient data object
   * @returns {Promise<Object>} Quality assessment
   */
  async assessDataQuality(patientData) {
    const prompt = `You are a healthcare data quality auditor. Assess the quality and consistency of this patient data. Identify missing, inconsistent, or suspicious values.

Patient Data:
${JSON.stringify(patientData, null, 2)}

Return ONLY a valid JSON object: { 
  "overallScore": 0.0-1.0, 
  "issues": [{ "field": "...", "severity": "critical/warning/info", "description": "..." }],
  "recommendations": ["..."],
  "requiresManualReview": boolean
}`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error assessing data quality', { error: error.message });
      throw error;
    }
  }

  /**
   * Anonymize sensitive patient information
   * @param {Object} patientData - Patient data to anonymize
   * @returns {Promise<Object>} Anonymized data
   */
  async anonymizePatientData(patientData) {
    const prompt = `You are a healthcare privacy specialist. Remove or pseudonymize sensitive personal information while preserving clinical relevance.

Patient Data:
${JSON.stringify(patientData, null, 2)}

Return ONLY a valid JSON object with the same structure but with sensitive fields replaced with synthetic values: { "firstName": "[ANON]", "lastName": "[ANON]", "dateOfBirth": "[ANON]", ... }`;

    try {
      const response = await this._queryLlama(prompt);
      return this._extractJson(response);
    } catch (error) {
      logger.error('Error anonymizing patient data', { error: error.message });
      throw error;
    }
  }

  /**
   * Core LLM query method
   * @private
   */
  async _queryLlama(prompt) {
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this._callOllama(prompt);
        return response;
      } catch (error) {
        logger.warn(`LLM query attempt ${attempt + 1} failed`, { error: error.message });
        
        if (attempt === this.maxRetries) {
          throw new Error(`Failed after ${this.maxRetries + 1} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Call Ollama API
   * @private
   */
  async _callOllama(prompt) {
    const endpoint = `${this.baseUrl}/api/generate`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: prompt,
          stream: false,
          temperature: 0.3, // Lower temp for factual data cleaning
          top_p: 0.9,
          num_predict: 500,
          num_ctx: 2048,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Ollama API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Empty response from Ollama');
      }

      return data.response.trim();
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Extract JSON from LLM response
   * @private
   */
  _extractJson(text) {
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
   * Check if Ollama service is available
   */
  async healthCheck() {
    try {
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        timeout: 5000,
      });

      if (!response.ok) {
        throw new Error(`Ollama health check failed: ${response.statusText}`);
      }

      const data = await response.json();
      logger.info('Ollama service healthy', { models: data.models?.length || 0 });
      return { healthy: true, models: data.models };
    } catch (error) {
      logger.error('Ollama service unavailable', { error: error.message });
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = LLMDataCleaningService;
