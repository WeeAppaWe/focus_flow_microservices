import * as React from "react"
import { cn } from "@/lib/utils"
// We don't have CVA installed yet, let's stick to simple props or install it? 
// User mentioned "rich aesthetics", let's keep it simple but animated.


// Simplified Button without CVA to avoid extra deps if not installed
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
            secondary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 shadow-sm",
            danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
            ghost: "hover:bg-gray-100 hover:text-gray-900"
        }

        const sizes = {
            sm: "h-9 px-3",
            md: "h-10 px-4 py-2",
            lg: "h-11 px-8"
        }

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className, "active:scale-95 transition-transform duration-100")}
                ref={ref}
                {...props}
            />
        )

    }
)
Button.displayName = "Button"

export { Button }
