require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const erpRoutes = require('./routes/erpRoutes');
const pool = require('./config/db');

const app = express();

// Security Middlewares
app.use(helmet());

// Dynamic CORS configuration via environment variables or sensible dev defaults
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost', 'http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} blocked by CORS policy`));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - 200 requests per 15-minute window per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));

// Health Check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', erpRoutes);

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error('[Server Error]', err.message || err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ERP] Enterprise Secure Server running on port ${PORT}`);
});

// Graceful shutdown handling (Docker container lifecycle)
const shutdown = (signal) => {
    console.log(`[ERP] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
        console.log('[ERP] HTTP server closed.');
        try {
            await pool.end();
            console.log('[ERP] Database pool drained and closed.');
            process.exit(0);
        } catch (err) {
            console.error('[ERP] Error closing database pool:', err.message);
            process.exit(1);
        }
    });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
