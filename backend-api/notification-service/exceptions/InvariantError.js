const ClientError = require('./ClientError');

class InvariantError extends ClientError {
    constructor(message) {
        super(message, 400, 'INVARIANT_ERROR', 'validation');
        this.name = 'InvariantError';
    }
}

module.exports = InvariantError;
