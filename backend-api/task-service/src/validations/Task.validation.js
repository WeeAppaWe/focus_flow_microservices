const Joi = require('joi');

const createTaskSchema = Joi.object({
    title: Joi.string().required(),
    deadline: Joi.date().required(),
});

const updateTaskSchema = Joi.object({
    title: Joi.string(),
    deadline: Joi.date(),
    is_completed: Joi.boolean(),
});

module.exports = { createTaskSchema, updateTaskSchema };
