class DatabaseTimeoutError extends Error {
    constructor(message = 'Database operation timeout') {
        super(message);
        this.statusCode = 504;
        this.errorCode = 'DB_TIMEOUT';
        this.layer = 'repository';
        this.name = 'DatabaseTimeoutError';
    }
}

module.exports = DatabaseTimeoutError;
