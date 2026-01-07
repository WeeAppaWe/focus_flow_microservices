const ClientError = require('./ClientError');

class AuthenticationError extends ClientError {
    constructor(message) {
        super(message, 401, 'AUTHENTICATION_FAILED', 'service');
        this.name = 'AuthenticationError';
    }
}

module.exports = AuthenticationError;
