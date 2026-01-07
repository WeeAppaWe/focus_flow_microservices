const express = require('express');
const router = express.Router();
const TaskController = require('../src/controllers/Task.controller');
const authMiddleware = require('../middlewares/Auth.middleware');
const validate = require('../middlewares/Validation.middleware');
const { createTaskSchema, updateTaskSchema } = require('../src/validations/Task.validation');

// All routes require authentication
router.use(authMiddleware);

router.get('/', TaskController.getTasks);
router.post('/', validate(createTaskSchema), TaskController.createTask);
router.put('/:id', validate(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;

