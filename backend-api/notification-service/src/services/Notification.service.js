const sequelize = require('../../config/database');
const NotificationRepository = require('../repositories/Notification.repo');
const { NotFoundError, AuthorizationError, InternalError } = require('../../exceptions');
const { sanitizeInput, sanitizeNotificationOutput, sanitizeNotificationsOutput } = require('../../utils/sanitize.utility');

class NotificationService {
    async createNotification(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const payload = req.body;
            const { title, message, type, task_id } = payload;

            const sanitizedTitle = sanitizeInput(title);
            const sanitizedMessage = sanitizeInput(message);

            const notification = await NotificationRepository.createNotification({
                title: sanitizedTitle,
                message: sanitizedMessage,
                type: type || 'info',
                task_id: task_id || null,
                user_id: userId
            }, transaction);

            await transaction.commit();
            return sanitizeNotificationOutput(notification);
        } catch (error) {
            await transaction.rollback();
            throw new InternalError('Failed to create notification');
        }
    }

    async getNotifications(req) {
        try {
            const userId = req.user.id;
            const { page = 1, limit = 20, unread_only = false } = req.query;

            const result = await NotificationRepository.findByUserId(userId, {
                page: parseInt(page),
                limit: parseInt(limit),
                unreadOnly: unread_only === 'true',
            });

            return {
                notifications: sanitizeNotificationsOutput(result.notifications),
                pagination: result.pagination,
            };
        } catch (error) {
            throw new InternalError('Failed to retrieve notifications');
        }
    }

    async getUnreadCount(req) {
        try {
            const userId = req.user.id;
            const count = await NotificationRepository.countUnread(userId);
            return { unread_count: count };
        } catch (error) {
            throw new InternalError('Failed to count unread notifications');
        }
    }

    async markAsRead(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;

            const notification = await NotificationRepository.findById(notificationId, transaction);
            if (!notification) {
                throw new NotFoundError('Notification not found');
            }

            if (notification.user_id !== userId) {
                throw new AuthorizationError('You are not authorized to access this notification');
            }

            await NotificationRepository.markAsRead(notificationId, transaction);
            const updatedNotification = await NotificationRepository.findById(notificationId, transaction);

            await transaction.commit();
            return sanitizeNotificationOutput(updatedNotification);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new InternalError('Failed to mark notification as read');
        }
    }

    async markAllAsRead(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            await NotificationRepository.markAllAsRead(userId, transaction);
            await transaction.commit();
            return { message: 'All notifications marked as read' };
        } catch (error) {
            await transaction.rollback();
            throw new InternalError('Failed to mark all notifications as read');
        }
    }

    async deleteNotification(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const notificationId = req.params.id;

            const notification = await NotificationRepository.findById(notificationId, transaction);
            if (!notification) {
                throw new NotFoundError('Notification not found');
            }

            if (notification.user_id !== userId) {
                throw new AuthorizationError('You are not authorized to access this notification');
            }

            await NotificationRepository.deleteNotification(notificationId, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            if (error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new InternalError('Failed to delete notification');
        }
    }

    async deleteAllNotifications(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            await NotificationRepository.deleteAllByUserId(userId, transaction);
            await transaction.commit();
            return { message: 'All notifications deleted' };
        } catch (error) {
            await transaction.rollback();
            throw new InternalError('Failed to delete all notifications');
        }
    }
}

module.exports = new NotificationService();
