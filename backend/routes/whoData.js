/**
 * WHO Data Routes
 * Placeholder for WHO data integration endpoints
 */

const express = require('express');
const router = express.Router();

/**
 * Placeholder endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WHO Data service placeholder',
  });
});

module.exports = router;
