import { cn } from '@/lib/utils';

interface BackgroundBlobsProps {
    className?: string;
}

export default function BackgroundBlobs({ className }: BackgroundBlobsProps) {
    return (
        <div className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-olive-leaf-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob opacity-70"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-sage-green-400/20 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000 opacity-70"></div>
            <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-olive-400/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 opacity-50"></div>
        </div>
    );
}
