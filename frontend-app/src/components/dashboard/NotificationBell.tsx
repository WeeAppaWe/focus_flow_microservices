import { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refetch } = useNotifications();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBellClick = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            refetch();
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'task_reminder':
                return '⏰';
            case 'system':
                return '⚙️';
            default:
                return 'ℹ️';
        }
    };

    const decodeHtml = (html: string) => {
        if (!html) return '';
        let txt = html;
        // Decode multiple times to handle double/triple encoding (e.g. &amp;quot; -> &quot; -> ")
        for (let i = 0; i < 3; i++) {
            txt = txt
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&#39;/g, "'");
        }
        return txt;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <Button
                variant="ghost"
                onClick={handleBellClick}
                className="relative bg-white/50 hover:bg-sage-green-50 text-sage-green-600 border border-white/60 rounded-xl px-3 py-6 h-auto transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </Button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0d170c] rounded-2xl shadow-3xl border border-sage-green-100 dark:border-evergreen-700 overflow-hidden z-[9999]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-sage-green-100 dark:border-evergreen-800">
                            <h3 className="font-semibold text-evergreen-900 dark:text-white">
                                Notifications
                            </h3>
                            <div className="flex gap-1">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={markAllAsRead}
                                        className="text-xs text-sage-green-600 hover:text-evergreen-700"
                                    >
                                        <CheckCheck size={14} className="mr-1" />
                                        Mark all read
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="text-sage-green-400 hover:text-red-500 p-1"
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center text-sage-green-500">
                                    Loading...
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-8 text-center text-sage-green-500">
                                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`p-4 border-b border-sage-green-50 dark:border-evergreen-800 hover:bg-sage-green-50/50 dark:hover:bg-evergreen-800/50 transition-colors ${!notif.is_read ? 'bg-evergreen-50/50 dark:bg-evergreen-800/30' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <span className="text-xl">
                                                {getNotificationIcon(notif.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-evergreen-900 dark:text-white truncate">
                                                    {notif.title}
                                                </p>
                                                <p className="text-xs text-sage-green-600 mt-0.5 line-clamp-2">
                                                    {decodeHtml(notif.message)}
                                                </p>
                                                <p className="text-xs text-sage-green-400 mt-1">
                                                    {(() => {
                                                        try {
                                                            const date = new Date(notif.created_at);
                                                            return isNaN(date.getTime())
                                                                ? 'Just now'
                                                                : formatDistanceToNow(date, { addSuffix: true });
                                                        } catch {
                                                            return 'Just now';
                                                        }
                                                    })()}
                                                </p>
                                            </div>
                                            {!notif.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="p-1 text-sage-green-400 hover:text-evergreen-600"
                                                >
                                                    <Check size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
