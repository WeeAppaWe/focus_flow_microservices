const express = require('express');
const router = express.Router();
const NotificationController = require('../src/controllers/Notification.controller');
const authMiddleware = require('../middlewares/Auth.middleware');
const validate = require('../middlewares/Validation.middleware');
const { createNotificationSchema } = require('../src/validations/Notification.validation');

// All routes require authentication
router.use(authMiddleware);

// GET /notifications - Get all notifications for user
router.get('/', NotificationController.getNotifications);

// GET /notifications/unread-count - Get unread count
router.get('/unread-count', NotificationController.getUnreadCount);

// POST /notifications - Create notification
router.post('/', validate(createNotificationSchema), NotificationController.createNotification);

// PATCH /notifications/read-all - Mark all as read
router.patch('/read-all', NotificationController.markAllAsRead);

// PATCH /notifications/:id/read - Mark single as read
router.patch('/:id/read', NotificationController.markAsRead);

// DELETE /notifications - Delete all notifications
router.delete('/', NotificationController.deleteAllNotifications);

// DELETE /notifications/:id - Delete single notification
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;
