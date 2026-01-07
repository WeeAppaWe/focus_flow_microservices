const validator = require('validator');

/**
 * Escape HTML special characters to prevent XSS attacks
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text safe for display
 */
const escapeHtml = (text) => {
    if (!text || typeof text !== 'string') return '';
    return validator.escape(text);
};

/**
 * Sanitize input before saving to database
 * Trims whitespace and escapes HTML to prevent stored XSS
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeInput = (text) => {
    if (!text || typeof text !== 'string') return '';
    return validator.escape(validator.trim(text));
};

/**
 * Sanitize notification object for API response output
 * @param {Object} notification - Notification object from database
 * @returns {Object} - Sanitized notification object
 */
const sanitizeNotificationOutput = (notification) => {
    if (!notification) return null;
    const plain = notification.toJSON ? notification.toJSON() : { ...notification };
    return {
        ...plain,
        title: escapeHtml(plain.title),
        message: escapeHtml(plain.message),
    };
};

/**
 * Sanitize array of notifications for API response
 * @param {Array} notifications - Array of notification objects
 * @returns {Array} - Array of sanitized notifications
 */
const sanitizeNotificationsOutput = (notifications) => {
    if (!Array.isArray(notifications)) return [];
    return notifications.map(sanitizeNotificationOutput);
};

module.exports = {
    escapeHtml,
    sanitizeInput,
    sanitizeNotificationOutput,
    sanitizeNotificationsOutput,
};
