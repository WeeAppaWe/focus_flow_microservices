class DatabaseError extends Error {
    constructor(message = 'Database operation failed') {
        super(message);
        this.statusCode = 500;
        this.errorCode = 'DATABASE_ERROR';
        this.layer = 'repository';
        this.name = 'DatabaseError';
    }
}

module.exports = DatabaseError;
