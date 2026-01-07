const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
    constructor(message) {
        super(message, 403, 'AUTHORIZATION_ERROR', 'authorization');
        this.name = 'AuthorizationError';
    }
}

module.exports = AuthorizationError;
