const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const csrfProtection = require('./middlewares/Csrf.middleware');
const routes = require('./routes');
const { formatError } = require('./utils/error-format.utility');

const app = express();

// Trust proxy for NGINX reverse proxy
app.set('trust proxy', 1);

// Security Headers
app.use(helmet());

// Response Compression
app.use(compression());

// Rate Limiting - Task routes
const taskLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 'fail',
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware - CORS
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    maxAge: 86400,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Apply rate limiter
app.use(taskLimiter);

// CSRF Protection
app.use(csrfProtection);

// Routes
app.use('/tasks', routes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    formatError(err, res);
});

module.exports = app;
