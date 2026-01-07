const DatabaseError = require('./DatabaseError');

class DatabaseConstraintError extends DatabaseError {
    constructor(message) {
        super(message);
        this.name = 'DatabaseConstraintError';
        this.errorCode = 'DATABASE_CONSTRAINT_ERROR';
        this.statusCode = 400;
    }
}

module.exports = DatabaseConstraintError;
