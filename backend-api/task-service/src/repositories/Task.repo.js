const { Task } = require('../models');
const { Op } = require('sequelize');
const {
    DatabaseConnectionError,
    DatabaseConstraintError,
    DatabaseQueryError,
    DatabaseTimeoutError
} = require('../../exceptions');

class TaskRepository {
    async createTask(taskData, transaction = null) {
        try {
            return await Task.create(taskData, { transaction });
        } catch (error) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw new DatabaseConstraintError('Invalid user_id');
            }
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to create task');
        }
    }

    async findTasksByUserId(userId, transaction = null) {
        try {
            return await Task.findAll({
                where: { user_id: userId },
                order: [['deadline', 'ASC']],
                attributes: ['id', 'title', 'deadline', 'is_completed', 'is_notified', 'created_at', 'updated_at'],
                transaction,
            });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find tasks');
        }
    }

    async findTaskById(id, transaction = null) {
        try {
            return await Task.findByPk(id, { transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find task');
        }
    }

    async updateTask(id, updateData, transaction = null) {
        try {
            return await Task.update(updateData, { where: { id }, transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to update task');
        }
    }

    async deleteTask(id, transaction = null) {
        try {
            return await Task.destroy({ where: { id }, transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to delete task');
        }
    }

    async findUpcomingTasks(currentTime, transaction = null) {
        try {
            return await Task.findAll({
                where: {
                    deadline: { [Op.lte]: currentTime },
                    is_completed: false,
                    is_notified: false,
                },
                transaction,
            });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find upcoming tasks');
        }
    }

    async markAsNotified(ids, transaction = null) {
        try {
            if (ids.length === 0) return;
            return await Task.update({ is_notified: true }, {
                where: { id: { [Op.in]: ids } },
                transaction,
            });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to mark tasks as notified');
        }
    }
}

module.exports = new TaskRepository();
