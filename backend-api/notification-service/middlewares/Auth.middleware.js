const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../exceptions');

const authMiddleware = (req, res, next) => {
    try {
        // Check for internal service call (from task-service scheduler)
        const internalService = req.headers['x-internal-service'];
        const internalUserId = req.headers['x-user-id'];

        if (internalService && internalUserId) {
            // Internal service call - trust the user_id from header
            req.user = { id: parseInt(internalUserId) };
            return next();
        }

        // Regular JWT authentication
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new AuthenticationError('Authentication required');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AuthenticationError('Invalid token format');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id: user.id }
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            next(new AuthenticationError('Invalid or expired token'));
        } else {
            next(error);
        }
    }
};

module.exports = authMiddleware;

