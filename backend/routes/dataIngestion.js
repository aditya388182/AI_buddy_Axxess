/**
 * Data Ingestion Routes
 * Placeholder for EHR/FHIR data ingestion endpoints
 */

const express = require('express');
const router = express.Router();

/**
 * Placeholder endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Data Ingestion service placeholder',
  });
});

module.exports = router;
