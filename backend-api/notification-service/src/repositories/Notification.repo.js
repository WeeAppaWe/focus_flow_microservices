const { Notification } = require('../models');
const { Op } = require('sequelize');
const {
    DatabaseConnectionError,
    DatabaseConstraintError,
    DatabaseQueryError,
    DatabaseTimeoutError
} = require('../../exceptions');

class NotificationRepository {
    async createNotification(notificationData, transaction = null) {
        try {
            return await Notification.create(notificationData, { transaction });
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
            throw new DatabaseQueryError('Failed to create notification');
        }
    }

    async findByUserId(userId, options = {}, transaction = null) {
        try {
            const { page = 1, limit = 20, unreadOnly = false } = options;
            const offset = (page - 1) * limit;

            const where = { user_id: userId };
            if (unreadOnly) {
                where.is_read = false;
            }

            const { count, rows } = await Notification.findAndCountAll({
                where,
                order: [['created_at', 'DESC']],
                limit,
                offset,
                transaction,
            });

            return {
                notifications: rows,
                pagination: {
                    total: count,
                    page,
                    limit,
                    totalPages: Math.ceil(count / limit),
                }
            };
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find notifications');
        }
    }

    async findById(id, transaction = null) {
        try {
            return await Notification.findByPk(id, { transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to find notification');
        }
    }

    async markAsRead(id, transaction = null) {
        try {
            return await Notification.update(
                { is_read: true },
                { where: { id }, transaction }
            );
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to mark notification as read');
        }
    }

    async markAllAsRead(userId, transaction = null) {
        try {
            return await Notification.update(
                { is_read: true },
                { where: { user_id: userId, is_read: false }, transaction }
            );
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to mark all notifications as read');
        }
    }

    async deleteNotification(id, transaction = null) {
        try {
            return await Notification.destroy({ where: { id }, transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to delete notification');
        }
    }

    async deleteAllByUserId(userId, transaction = null) {
        try {
            return await Notification.destroy({ where: { user_id: userId }, transaction });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to delete all notifications');
        }
    }

    async countUnread(userId, transaction = null) {
        try {
            return await Notification.count({
                where: { user_id: userId, is_read: false },
                transaction,
            });
        } catch (error) {
            if (error.name === 'SequelizeConnectionError') {
                throw new DatabaseConnectionError('Database connection lost');
            }
            if (error.name === 'SequelizeTimeoutError') {
                throw new DatabaseTimeoutError('Database operation timeout');
            }
            throw new DatabaseQueryError('Failed to count unread notifications');
        }
    }
}

module.exports = new NotificationRepository();
