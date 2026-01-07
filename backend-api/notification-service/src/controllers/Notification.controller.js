const NotificationService = require('../services/Notification.service');
const { response } = require('../../utils/response-api.utility');

class NotificationController {
    async getNotifications(req, res, next) {
        try {
            const result = await NotificationService.getNotifications(req);
            return response(res, 200, 'success', 'Notifications retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async getUnreadCount(req, res, next) {
        try {
            const result = await NotificationService.getUnreadCount(req);
            return response(res, 200, 'success', 'Unread count retrieved', result);
        } catch (error) {
            next(error);
        }
    }

    async createNotification(req, res, next) {
        try {
            const notification = await NotificationService.createNotification(req);
            return response(res, 201, 'success', 'Notification created', notification);
        } catch (error) {
            next(error);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const notification = await NotificationService.markAsRead(req);
            return response(res, 200, 'success', 'Notification marked as read', notification);
        } catch (error) {
            next(error);
        }
    }

    async markAllAsRead(req, res, next) {
        try {
            const result = await NotificationService.markAllAsRead(req);
            return response(res, 200, 'success', 'All notifications marked as read', result);
        } catch (error) {
            next(error);
        }
    }

    async deleteNotification(req, res, next) {
        try {
            await NotificationService.deleteNotification(req);
            return response(res, 200, 'success', 'Notification deleted', null);
        } catch (error) {
            next(error);
        }
    }

    async deleteAllNotifications(req, res, next) {
        try {
            const result = await NotificationService.deleteAllNotifications(req);
            return response(res, 200, 'success', 'All notifications deleted', result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NotificationController();
