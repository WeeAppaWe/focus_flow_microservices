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
 * Sanitize user input for safe display in notifications
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeForNotification = (text) => {
    return escapeHtml(text);
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
 * Sanitize task object for API response output
 * @param {Object} task - Task object from database
 * @returns {Object} - Sanitized task object
 */
const sanitizeTaskOutput = (task) => {
    if (!task) return null;
    const plain = task.toJSON ? task.toJSON() : { ...task };
    return {
        ...plain,
        title: escapeHtml(plain.title),
    };
};

/**
 * Sanitize array of tasks for API response
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Array of sanitized tasks
 */
const sanitizeTasksOutput = (tasks) => {
    if (!Array.isArray(tasks)) return [];
    return tasks.map(sanitizeTaskOutput);
};

module.exports = {
    escapeHtml,
    sanitizeForNotification,
    sanitizeInput,
    sanitizeTaskOutput,
    sanitizeTasksOutput,
};
