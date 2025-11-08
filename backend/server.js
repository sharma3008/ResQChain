require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const database = require('./config/database');
const kafkaService = require('./services/kafkaService');

const emergencyRoutes = require('./routes/emergencyRoutes');
const responderRoutes = require('./routes/responderRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ResQChain',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/emergency', emergencyRoutes);
app.use('/api/responders', responderRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/ambulances', ambulanceRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Initialize services
async function startServer() {
  try {
    // Connect to MongoDB
    await database.connect();
    logger.info('Connected to MongoDB');

    // Initialize Kafka
    await kafkaService.connect();
    logger.info('Connected to Kafka');

    // Start server
    app.listen(PORT, () => {
      logger.info(`ResQChain server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await kafkaService.disconnect();
  await database.disconnect();
  process.exit(0);
});

startServer();

module.exports = app;
