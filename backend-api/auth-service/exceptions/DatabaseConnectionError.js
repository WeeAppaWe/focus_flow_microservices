class DatabaseConnectionError extends Error {
    constructor(message = 'Database connection failed') {
        super(message);
        this.statusCode = 503;
        this.errorCode = 'DB_CONNECTION_FAILED';
        this.layer = 'repository';
        this.name = 'DatabaseConnectionError';
    }
}

module.exports = DatabaseConnectionError;
