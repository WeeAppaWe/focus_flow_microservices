const DatabaseError = require('./DatabaseError');

class DatabaseTimeoutError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'DatabaseTimeoutError';
        this.errorCode = 'DATABASE_TIMEOUT_ERROR';
    }
}

module.exports = DatabaseTimeoutError;
