const cron = require('node-cron');
const axios = require('axios');
const { Op } = require('sequelize');
const TaskRepository = require('../src/repositories/Task.repo');
const { sanitizeForNotification } = require('../utils/sanitize.utility');

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3003';

const initScheduler = (io) => {
    cron.schedule('* * * * *', async () => {
        try {
            console.log('Running Task Scheduler...');
            const currentTime = new Date();

            const tasksToNotify = await TaskRepository.findUpcomingTasks(currentTime);

            if (tasksToNotify.length > 0) {
                const notifiedIds = [];

                for (const task of tasksToNotify) {
                    const safeTitle = task.title;
                    const notificationData = {
                        title: "Task Reminder",
                        message: `Task "${safeTitle}" is due!`,
                        type: "task_reminder",
                        task_id: task.id
                    };

                    // Emit via Socket.IO for real-time notification
                    io.to(`user_${task.user_id}`).emit('notification', {
                        ...notificationData,
                        taskId: task.id
                    });

                    // Save to notification-service DB
                    try {
                        await axios.post(
                            `${NOTIFICATION_SERVICE_URL}/notifications`,
                            notificationData,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    // Internal service call - create a system token for this user
                                    'X-Internal-Service': 'task-service',
                                    'X-User-Id': task.user_id.toString()
                                }
                            }
                        );
                        console.log(`Notification saved for task ${task.id}`);
                    } catch (apiError) {
                        console.error(`Failed to save notification for task ${task.id}:`, apiError.message);
                    }

                    notifiedIds.push(task.id);
                }

                if (notifiedIds.length > 0) {
                    await TaskRepository.markAsNotified(notifiedIds);
                    console.log(`Notified ${notifiedIds.length} tasks.`);
                }
            }
        } catch (error) {
            console.error('Scheduler Error:', error);
        }
    });
};

module.exports = initScheduler;

