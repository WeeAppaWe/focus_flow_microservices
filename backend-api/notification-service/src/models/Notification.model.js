const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Notification = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('task_reminder', 'system', 'info'),
        defaultValue: 'info',
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'notifications',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['is_read'] },
        { fields: ['type'] },
        { fields: ['user_id', 'is_read'] },
        { fields: ['created_at'] },
    ],
});

module.exports = Notification;
