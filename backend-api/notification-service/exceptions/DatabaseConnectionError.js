const DatabaseError = require('./DatabaseError');

class DatabaseConnectionError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'DatabaseConnectionError';
        this.errorCode = 'DATABASE_CONNECTION_ERROR';
    }
}

module.exports = DatabaseConnectionError;
