import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type FilterType = 'all' | 'pending' | 'completed';

interface TaskFiltersProps {
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
    totalCount: number;
}

export default function TaskFilters({ filter, setFilter, totalCount }: TaskFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between bg-white/40 backdrop-blur-md p-2 rounded-2xl border border-sage-green-100/50"
        >
            <div className="flex p-1 bg-sage-green-100/50 rounded-xl space-x-1 w-full sm:w-auto">
                <button onClick={() => setFilter('all')} className={cn("px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none", filter === 'all' ? "bg-white text-evergreen-900 shadow-md" : "text-sage-green-600 hover:text-sage-green-800")}>
                    All Tasks
                </button>
                <button onClick={() => setFilter('pending')} className={cn("px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none", filter === 'pending' ? "bg-white text-olive-600 shadow-md" : "text-sage-green-600 hover:text-sage-green-800")}>
                    Pending
                </button>
                <button onClick={() => setFilter('completed')} className={cn("px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex-1 sm:flex-none", filter === 'completed' ? "bg-white text-evergreen-600 shadow-md" : "text-sage-green-600 hover:text-sage-green-800")}>
                    Completed
                </button>
            </div>

            <div className="hidden sm:flex text-evergreen-900 text-sm font-semibold pr-4 items-center gap-2">
                <Filter size={16} />
                Showing {totalCount} tasks
            </div>
        </motion.div>
    );
}
