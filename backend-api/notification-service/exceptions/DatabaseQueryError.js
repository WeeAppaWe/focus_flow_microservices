const DatabaseError = require('./DatabaseError');

class DatabaseQueryError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'DatabaseQueryError';
        this.errorCode = 'DATABASE_QUERY_ERROR';
    }
}

module.exports = DatabaseQueryError;
