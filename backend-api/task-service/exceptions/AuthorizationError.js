const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
    constructor(message) {
        super(message, 403, 'AUTHORIZATION_FAILED', 'service');
        this.name = 'AuthorizationError';
    }
}

module.exports = AuthorizationError;
