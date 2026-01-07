const express = require('express');
const router = express.Router();
const AuthController = require('../src/controllers/Auth.controller');
const validate = require('../middlewares/Validation.middleware');
const { registerSchema, loginSchema } = require('../src/validations/Auth.validation');

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;
