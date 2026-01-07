const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../exceptions');

const authMiddleware = (req, res, next) => {
    try {
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
