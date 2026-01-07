const ClientError = require('./ClientError');

class DatabaseError extends ClientError {
    constructor(message) {
        super(message, 500, 'DATABASE_ERROR', 'database');
        this.name = 'DatabaseError';
    }
}

module.exports = DatabaseError;
