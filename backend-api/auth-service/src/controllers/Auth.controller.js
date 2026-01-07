const AuthService = require('../services/Auth.service');
const { response } = require('../../utils/response-api.utility');

class AuthController {
    async register(req, res, next) {
        try {
            const data = await AuthService.register(req);
            return response(res, 201, 'success', 'User registered successfully', data);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const data = await AuthService.login(req);
            return response(res, 200, 'success', 'Login successful', data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
