const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    name: 'ZANDRA BEAUTY MATRIX (ZBM) Authentication API',
    database: db.getDatabaseEngine(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Authentication API routes
app.use('/api/auth', authRoutes);

// Serve frontend static files
const frontendPath = path.join(__dirname, '..');
app.use(express.static(frontendPath));

// Fallback to index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER UNHANDLED ERROR]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`✦ ZBM B2B Authentication Server running on port ${PORT}`);
  console.log(`✦ Local URL: http://localhost:${PORT}`);
  console.log(`✦ Database Engine: ${db.getDatabaseEngine()}`);
  console.log(`✦ Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});

module.exports = { app, server };
