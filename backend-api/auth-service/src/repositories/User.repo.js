const { User } = require('../models');
const {
    DatabaseConnectionError,
    DatabaseConstraintError,
    DatabaseQueryError,
    DatabaseTimeoutError
} = require('../../exceptions');

class UserRepository {
    async createUser(userData, transaction = null) {
        try {
            return await User.create(userData, { transaction });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new DatabaseConstraintError('User with this email already exists');
            }
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new DatabaseConstraintError('Foreign key constraint violation');
            }
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to create user');
        }
    }

    async findByEmail(email, transaction = null) {
        try {
            return await User.findOne({ where: { email }, transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find user by email');
        }
    }

    async findById(id, transaction = null) {
        try {
            return await User.findByPk(id, { transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find user by id');
        }
    }
}

module.exports = new UserRepository();
