import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
interface CreateTaskFormProps {
    onCreateTask: (title: string, deadline: string) => Promise<void>;
}

export default function CreateTaskForm({ onCreateTask }: CreateTaskFormProps) {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle) {
            toast.error("Please enter a task title");
            return;
        }
        if (!newTaskDeadline) {
            toast.error("Please select a deadline");
            return;
        }

        setLoading(true);
        try {
            await onCreateTask(newTaskTitle, newTaskDeadline);
            setNewTaskTitle('');
            setNewTaskDeadline('');
            // Toast is handled by parent/hook
        } catch {
            // Error handled by parent/hook
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="rounded-[32px] border-none shadow-xl bg-white/95 dark:bg-evergreen-900/90 backdrop-blur-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
            <div className="h-1.5 bg-gradient-to-r from-evergreen-500 via-sage-green-500 to-olive-500 w-full"></div>
            <CardContent className="p-8">
                <h3 className="text-xl font-bold text-evergreen-800 dark:text-white mb-6 flex items-center gap-3">
                    <div className="bg-sage-green-100 dark:bg-sage-green-900/30 p-2 rounded-xl text-sage-green-600 dark:text-sage-green-400">
                        <Plus size={22} strokeWidth={3} />
                    </div>
                    Create New Task
                </h3>
                <form onSubmit={handleCreateTask} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-sage-green-600 uppercase tracking-widest pl-1 group-focus-within:text-evergreen-600 transition-colors">Task Title</label>
                        <Input
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="What's your main focus?"
                            className="bg-white border-sage-green-200 h-14 rounded-2xl focus:ring-4 focus:ring-evergreen-500/10 focus:border-evergreen-500 transition-all text-base px-4 text-evergreen-900 placeholder:text-sage-green-400 font-medium shadow-sm"
                        />
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-sage-green-600 uppercase tracking-widest pl-1 group-focus-within:text-evergreen-600 transition-colors">Target Deadline</label>
                        <Input
                            type="datetime-local"
                            value={newTaskDeadline}
                            onChange={(e) => setNewTaskDeadline(e.target.value)}
                            className={cn(
                                "bg-white border-sage-green-200 h-14 rounded-2xl focus:ring-4 focus:ring-evergreen-500/10 focus:border-evergreen-500 transition-all text-base pl-4 pr-10 font-medium shadow-sm [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-4 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
                                newTaskDeadline ? "text-evergreen-900" : "text-sage-green-400"
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-evergreen-900 hover:bg-evergreen-950 dark:bg-white dark:text-black dark:hover:bg-gray-100 text-white font-bold text-lg shadow-xl shadow-evergreen-900/20 active:scale-[0.98] transition-all">
                        {loading ? 'Adding...' : 'Add Task'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
