const ClientError = require('./ClientError');

class InternalError extends ClientError {
    constructor(message) {
        super(message, 500, 'INTERNAL_ERROR', 'application');
        this.name = 'InternalError';
    }
}

module.exports = InternalError;
