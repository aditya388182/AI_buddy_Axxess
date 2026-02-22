/**
 * AI Nurse - Backend Server
 * Main entry point for the AI-Driven Preventive Health Partner
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const logger = require('./old_stuff/helper/logger');
const ErrorHandler = require('./old_stuff/helper/errorHandler');

// Import routes
const dataIngestionRoutes = require('./routes/dataIngestion');
const whoDataRoutes = require('./routes/whoData');

// Initialize Express app
const app = express();

// Set log level based on environment
if (process.env.NODE_ENV === 'development') {
  logger.setLevel('DEBUG');
} else {
  logger.setLevel('INFO');
}

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for FHIR bundles
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.apiRequest(req.method, req.path, {
    query: req.query,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Nurse Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/ingestion', dataIngestionRoutes);
app.use('/api/who', whoDataRoutes);

// 404 handler
app.use(ErrorHandler.notFound());

// Error handling middleware (must be last)
app.use(ErrorHandler.middleware());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 AI Nurse Backend started on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', {
    error: err.message,
    stack: err.stack,
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', {
    error: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

module.exports = app;