'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';

import DigitalClock from '@/components/dashboard/DigitalClock';
import BackgroundBlobs from '@/components/common/BackgroundBlobs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import CreateTaskForm from '@/components/dashboard/CreateTaskForm';
import TaskFilters, { FilterType } from '@/components/dashboard/TaskFilters';
import TaskItem from '@/components/dashboard/TaskItem';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { tasks, loading: loadingTasks, createTask, updateTask, toggleTaskCompletion, deleteTask } = useTasks(user?.id);
    const [filter, setFilter] = useState<FilterType>('all');

    // Filter Logic
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filter === 'pending') return !task.is_completed;
            if (filter === 'completed') return task.is_completed;
            return true;
        }).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }, [tasks, filter]);

    const pendingCount = tasks.filter(t => !t.is_completed).length;
    const completedCount = tasks.filter(t => t.is_completed).length;

    return (
        <div className="min-h-screen relative bg-sage-green-50 dark:bg-evergreen-950 font-sans overflow-x-hidden">

            <BackgroundBlobs />

            <div className="relative z-10 container mx-auto p-4 md:p-8 lg:p-12 max-w-7xl h-full flex flex-col gap-8">

                <DashboardHeader
                    user={user}
                    pendingCount={pendingCount}
                    completedCount={completedCount}
                    onLogout={logout}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Clock Card */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="group relative overflow-hidden bg-gradient-to-br from-evergreen-700 via-sage-green-700 to-olive-600 rounded-[32px] shadow-2xl text-white"
                        >
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] group-hover:bg-white/10 transition-colors duration-500"></div>
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col items-center w-full">
                                <DigitalClock />
                                <p className="text-olive-100/90 text-sm font-medium tracking-wide mb-6 text-center italic">
                                    &quot;I never think about the future - it comes soon enough.&quot; <br />
                                    <span className="text-xs not-italic opacity-80 mt-1 block">Albert Einstein</span>
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CreateTaskForm onCreateTask={createTask} />
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Task List */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        <TaskFilters filter={filter} setFilter={setFilter} totalCount={filteredTasks.length} />

                        <div className="space-y-4 min-h-[300px]">
                            <AnimatePresence mode='wait'>
                                {loadingTasks ? (
                                    // Loading Skeletons
                                    <div key="loader" className="space-y-4">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="h-28 w-full bg-white/40 rounded-[24px] animate-pulse"></div>
                                        ))}
                                    </div>
                                ) : filteredTasks.length === 0 ? (
                                    <motion.div
                                        key="empty-state"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-80 flex flex-col items-center justify-center text-center text-sage-green-700 bg-white/60 backdrop-blur-md rounded-[32px] border-2 border-dashed border-sage-green-300 mx-4"
                                    >
                                        <div className="bg-white/80 p-6 rounded-full mb-4 shadow-md">
                                            <Search size={48} className="text-evergreen-600" strokeWidth={1.5} />
                                        </div>
                                        <p className="font-bold text-xl text-evergreen-900 mb-2">No {filter !== 'all' ? filter : ''} tasks found</p>
                                        <p className="text-base text-sage-green-800 font-medium">Enjoy your free time or add a new task!</p>
                                    </motion.div>
                                ) : (
                                    <motion.div key="task-list" className="space-y-4">
                                        {filteredTasks.map((task) => (
                                            <TaskItem
                                                key={task.id}
                                                task={task}
                                                onToggle={toggleTaskCompletion}
                                                onDelete={deleteTask}
                                                onUpdate={updateTask}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
