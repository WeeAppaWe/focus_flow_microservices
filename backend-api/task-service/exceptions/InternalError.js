class InternalError extends Error {
    constructor(message = 'Internal server error') {
        super(message);
        this.statusCode = 500;
        this.errorCode = 'INTERNAL_ERROR';
        this.layer = 'service';
        this.name = 'InternalError';
    }
}

module.exports = InternalError;
