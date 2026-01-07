const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND', 'application');
        this.name = 'NotFoundError';
    }
}

module.exports = NotFoundError;
