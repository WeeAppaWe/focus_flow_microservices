class DatabaseQueryError extends Error {
    constructor(message = 'Database query execution failed') {
        super(message);
        this.statusCode = 500;
        this.errorCode = 'DB_QUERY_FAILED';
        this.layer = 'repository';
        this.name = 'DatabaseQueryError';
    }
}

module.exports = DatabaseQueryError;
