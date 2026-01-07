class ClientError extends Error {
    constructor(message, statusCode = 400, errorCode = 'CLIENT_ERROR', layer = 'application') {
        super(message);
        this.name = 'ClientError';
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.layer = layer;
    }
}

module.exports = ClientError;
