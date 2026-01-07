import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Trash2, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Task } from '@/types';

interface TaskItemProps {
    task: Task;
    onToggle: (task: Task) => void;
    onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps & { onUpdate: (id: number, title: string, deadline: string) => void }) {
    const isOverdue = new Date(task.deadline) < new Date() && !task.is_completed;
    const exactTime = new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    // Format deadline for datetime-local input (YYYY-MM-DDTHH:mm)
    const [editDeadline, setEditDeadline] = useState(new Date(task.deadline).toISOString().slice(0, 16));

    const handleSave = () => {
        onUpdate(task.id, editTitle, editDeadline);
        setIsEditing(false);
    };

    // Helper: Relative Date
    const getRelativeDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const isTomorrow = new Date(now.setDate(now.getDate() + 1)).getDate() === date.getDate();

        if (isToday) return 'Today';
        if (isTomorrow) return 'Tomorrow';
        if (diffDays < 0) return 'Overdue';
        if (diffDays < 7 && diffDays > 0) return date.toLocaleDateString('en-US', { weekday: 'long' });

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const relativeDate = getRelativeDate(task.deadline);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="group relative"
        >
            <div className={cn(
                "relative flex items-stretch p-5 bg-white/80 dark:bg-evergreen-900/80 backdrop-blur-xl rounded-[24px] border border-white/40 shadow-sm transition-all hover:shadow-[0_10px_40px_-10px_rgba(75,85,63,0.15)] hover:-translate-y-1 overflow-hidden",
                task.is_completed ? "opacity-60 grayscale-[0.5]" : ""
            )}>

                <div className="flex items-center self-center">
                    <button
                        onClick={() => onToggle(task)}
                        disabled={isEditing}
                        className={cn(
                            "mr-4 md:mr-6 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-[3px] transition-all shadow-sm",
                            isEditing
                                ? "border-sage-green-100 text-sage-green-100 cursor-not-allowed opacity-50"
                                : "cursor-pointer group-hover:scale-105 active:scale-95",
                            !isEditing && (task.is_completed
                                ? "border-evergreen-500 bg-evergreen-500 text-white"
                                : "border-sage-green-200 text-transparent hover:border-olive-400 hover:text-olive-500")
                        )}
                    >
                        <CheckCircle size={24} className={cn("md:w-7 md:h-7", task.is_completed ? "scale-100" : "scale-0 transition-transform duration-300")} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                    {isEditing ? (
                        <div className="flex flex-col gap-2 mr-2">
                            <input
                                className="bg-white border border-sage-green-200 rounded-lg px-2 py-1 text-lg font-bold text-evergreen-900 focus:outline-none focus:ring-2 focus:ring-evergreen-500 shadow-sm"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <div className="flex flex-wrap gap-2">
                                <input
                                    type="datetime-local"
                                    className="bg-white border border-sage-green-200 rounded-lg px-2 py-1 text-sm font-medium text-evergreen-900 focus:outline-none focus:ring-2 focus:ring-evergreen-500 shadow-sm"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3 className={cn(
                                "font-bold text-lg md:text-xl truncate transition-all text-evergreen-900 dark:text-gray-100 mb-1 md:mb-2",
                                task.is_completed && "text-sage-green-500 line-through decoration-sage-green-400 decoration-2"
                            )}>
                                {task.title}
                            </h3>
                            <div className="flex items-center text-sm font-medium text-sage-green-600 gap-4">
                                <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg", isOverdue ? "bg-red-50 text-red-600" : "bg-sage-green-100/50 text-sage-green-700")}>
                                    <Calendar size={14} />
                                    <span>{relativeDate}</span>
                                    <span className="opacity-50 mx-1 hidden sm:inline">|</span>
                                    <span className="hidden sm:inline">{exactTime}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Status & Actions */}
                <div className="flex flex-col items-end justify-between gap-3 ml-4 min-w-[100px]">
                    {/* Status Indicator Pill */}
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-center w-max self-end",
                        task.is_completed
                            ? "bg-evergreen-100 text-evergreen-600"
                            : isOverdue
                                ? "bg-red-100 text-red-600 animate-pulse"
                                : "bg-olive-100 text-olive-700"
                    )}>
                        {task.is_completed ? "Completed" : isOverdue ? "Overdue" : "In Progress"}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1 md:gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="bg-evergreen-600 hover:bg-evergreen-700 text-white rounded-xl p-2 h-9 w-9 transition-all shadow-md"
                                    title="Save Changes"
                                >
                                    <Check size={18} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-white text-red-500 hover:bg-red-50 border border-sage-green-200 hover:border-red-200 rounded-xl p-2 h-9 w-9 transition-all shadow-sm"
                                    title="Cancel"
                                >
                                    <X size={18} />
                                </Button>
                            </>
                        ) : (
                            <>
                                {!task.is_completed && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="text-sage-green-400 hover:text-evergreen-600 hover:bg-evergreen-100 rounded-xl p-2 h-9 w-9 transition-all"
                                        title="Edit Task"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(task.id)}
                                    className="text-sage-green-400 hover:text-red-500 hover:bg-red-50 rounded-xl p-2 h-9 w-9 transition-all"
                                    title="Delete Task"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
