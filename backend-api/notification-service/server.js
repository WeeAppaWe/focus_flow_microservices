require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');

const PORT = process.env.NOTIFICATION_PORT || 3003;

// Start Server
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        await sequelize.sync();
        console.log('Database models synced.');

        app.listen(PORT, () => {
            console.log(`Notification Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();
