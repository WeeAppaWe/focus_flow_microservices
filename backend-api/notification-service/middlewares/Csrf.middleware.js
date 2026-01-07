const { AuthenticationError } = require('../exceptions');

/**
 * CSRF Protection Middleware using Custom Header Validation
 * Requires X-Requested-With header for all state-changing requests
 * This prevents CSRF attacks as browsers don't allow setting custom headers from other domains
 */
const csrfProtection = (req, res, next) => {
    const method = req.method.toUpperCase();

    // Only check state-changing methods (not GET, HEAD, OPTIONS)
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (safeMethods.includes(method)) {
        return next();
    }

    // Check for custom header presence
    const customHeader = req.headers['x-requested-with'];

    if (!customHeader || customHeader !== 'XMLHttpRequest') {
        return next(new AuthenticationError('Missing required security header'));
    }

    next();
};

module.exports = csrfProtection;
