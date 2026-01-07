const Joi = require('joi');

const createNotificationSchema = Joi.object({
    title: Joi.string().required().max(255),
    message: Joi.string().required().max(1000),
    type: Joi.string().valid('task_reminder', 'system', 'info').default('info'),
    task_id: Joi.number().integer().optional().allow(null),
});

module.exports = { createNotificationSchema };
