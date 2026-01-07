class ClientError extends Error {
    constructor(message, statusCode = 400, errorCode = 'CLIENT_ERROR', layer = 'application') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.layer = layer;
        this.name = 'ClientError';
    }
}

module.exports = ClientError;
