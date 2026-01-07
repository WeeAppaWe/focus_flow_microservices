const TaskService = require('../services/Task.service');
const { response } = require('../../utils/response-api.utility');

class TaskController {
    async getTasks(req, res, next) {
        try {
            const tasks = await TaskService.getTasks(req);
            return response(res, 200, 'success', 'Tasks retrieved', tasks);
        } catch (error) {
            next(error);
        }
    }

    async createTask(req, res, next) {
        try {
            const task = await TaskService.createTask(req);

            const io = req.app.get('io');
            io.emit('task_update');

            return response(res, 201, 'success', 'Task created', task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req, res, next) {
        try {
            const task = await TaskService.updateTask(req);

            const io = req.app.get('io');
            io.emit('task_update');

            return response(res, 200, 'success', 'Task updated', task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req, res, next) {
        try {
            await TaskService.deleteTask(req);

            const io = req.app.get('io');
            io.emit('task_update');

            return response(res, 200, 'success', 'Task deleted', null);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TaskController();
