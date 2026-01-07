const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Task = sequelize.define('Task', {
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
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_notified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'tasks',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['deadline'] },
        { fields: ['is_completed', 'is_notified'] },
        { fields: ['user_id', 'deadline'] },
    ],
});

module.exports = Task;
