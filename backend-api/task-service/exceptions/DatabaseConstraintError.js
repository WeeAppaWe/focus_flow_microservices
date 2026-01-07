class DatabaseConstraintError extends Error {
    constructor(message = 'Database constraint violation') {
        super(message);
        this.statusCode = 409;
        this.errorCode = 'DB_CONSTRAINT_VIOLATION';
        this.layer = 'repository';
        this.name = 'DatabaseConstraintError';
    }
}

module.exports = DatabaseConstraintError;
