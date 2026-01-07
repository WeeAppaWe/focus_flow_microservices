const sequelize = require('../../config/database');
const TaskRepository = require('../repositories/Task.repo');
const { NotFoundError, AuthorizationError, InternalError } = require('../../exceptions');
const { sanitizeInput, sanitizeTaskOutput, sanitizeTasksOutput } = require('../../utils/sanitize.utility');

class TaskService {
    async createTask(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const payload = req.body;
            const { title, deadline } = payload;

            const sanitizedTitle = sanitizeInput(title);

            const task = await TaskRepository.createTask({
                title: sanitizedTitle,
                deadline,
                user_id: userId
            }, transaction);

            await transaction.commit();
            return sanitizeTaskOutput(task);
        } catch (error) {
            await transaction.rollback();
            throw new InternalError('Failed to create task');
        }
    }

    async getTasks(req) {
        try {
            const userId = req.user.id;
            const tasks = await TaskRepository.findTasksByUserId(userId);
            return sanitizeTasksOutput(tasks);
        } catch (error) {
            throw new InternalError('Failed to retrieve tasks');
        }
    }

    async updateTask(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const payload = req.body;

            const task = await TaskRepository.findTaskById(taskId, transaction);
            if (!task) {
                throw new NotFoundError('Task not found');
            }

            if (task.user_id !== userId) {
                throw new AuthorizationError('You are not authorized to access this task');
            }

            const sanitizedPayload = { ...payload };
            if (payload.title) {
                sanitizedPayload.title = sanitizeInput(payload.title);
            }

            await TaskRepository.updateTask(taskId, sanitizedPayload, transaction);
            const updatedTask = await TaskRepository.findTaskById(taskId, transaction);

            await transaction.commit();
            return sanitizeTaskOutput(updatedTask);
        } catch (error) {
            await transaction.rollback();
            if (error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new InternalError('Failed to update task');
        }
    }

    async deleteTask(req) {
        const transaction = await sequelize.transaction();
        try {
            const userId = req.user.id;
            const taskId = req.params.id;

            const task = await TaskRepository.findTaskById(taskId, transaction);
            if (!task) {
                throw new NotFoundError('Task not found');
            }

            if (task.user_id !== userId) {
                throw new AuthorizationError('You are not authorized to access this task');
            }

            await TaskRepository.deleteTask(taskId, transaction);
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            if (error instanceof NotFoundError || error instanceof AuthorizationError) {
                throw error;
            }
            throw new InternalError('Failed to delete task');
        }
    }
}

module.exports = new TaskService();
