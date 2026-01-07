const jwt = require('jsonwebtoken');
const sequelize = require('../../config/database');
const UserRepository = require('../repositories/User.repo');
const { encryptPassword, comparePassword } = require('../../utils/encrypt-decrypt.utility');
const { InvariantError, AuthenticationError, InternalError } = require('../../exceptions');

class AuthService {
    async register(req) {
        const transaction = await sequelize.transaction();
        try {
            const payload = req.body;
            const { name, email, password } = payload;

            const existingUser = await UserRepository.findByEmail(email, transaction);
            if (existingUser) {
                throw new InvariantError('Email already registered');
            }

            const hashedPassword = await encryptPassword(password);
            const newUser = await UserRepository.createUser({
                name,
                email,
                password: hashedPassword,
            }, transaction);

            await transaction.commit();
            return { id: newUser.id, name: newUser.name, email: newUser.email };
        } catch (error) {
            await transaction.rollback();
            if (error instanceof InvariantError) {
                throw error;
            }
            throw new InternalError('Failed to register user');
        }
    }

    async login(req) {
        try {
            const payload = req.body;
            const { email, password } = payload;

            const user = await UserRepository.findByEmail(email);
            if (!user) {
                throw new AuthenticationError('Invalid email or password');
            }

            const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                throw new AuthenticationError('Invalid email or password');
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
                expiresIn: '1d',
            });

            return { token, user: { id: user.id, name: user.name, email: user.email } };
        } catch (error) {
            if (error instanceof AuthenticationError) {
                throw error;
            }
            throw new InternalError('Failed to login');
        }
    }
}

module.exports = new AuthService();
