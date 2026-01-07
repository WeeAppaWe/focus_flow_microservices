const ClientError = require('../exceptions/ClientError');

const formatError = (err, res) => {
    // Handle custom errors (ClientError and its subclasses)
    if (err instanceof ClientError || err.errorCode) {
        return res.status(err.statusCode || 500).json({
            status: 'fail',
            errorCode: err.errorCode || 'UNKNOWN_ERROR',
            message: err.message,
            layer: err.layer || 'unknown',
            timestamp: new Date().toISOString(),
        });
    }

    // Handle Joi Validation Errors
    if (err.isJoi) {
        return res.status(400).json({
            status: 'fail',
            errorCode: 'VALIDATION_ERROR',
            message: err.details[0].message,
            layer: 'validation',
            timestamp: new Date().toISOString(),
        });
    }

    // Handle unexpected errors
    console.error('Unexpected Error:', err);
    return res.status(500).json({
        status: 'error',
        errorCode: 'UNEXPECTED_ERROR',
        message: 'Internal Server Error',
        layer: 'application',
        timestamp: new Date().toISOString(),
    });
};

module.exports = { formatError };
