"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white/90 group-[.toaster]:dark:bg-evergreen-900/90 group-[.toaster]:text-evergreen-900 group-[.toaster]:dark:text-sage-green-50 group-[.toaster]:border-sage-green-200 group-[.toaster]:dark:border-evergreen-800 group-[.toaster]:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-[.toaster]:backdrop-blur-xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:border",
                    description: "group-[.toast]:text-sage-green-600 group-[.toast]:dark:text-sage-green-400 font-medium",
                    actionButton:
                        "group-[.toast]:bg-evergreen-600 group-[.toast]:text-white font-bold hover:group-[.toast]:bg-evergreen-700 transition-colors",
                    cancelButton:
                        "group-[.toast]:bg-sage-green-100 group-[.toast]:text-sage-green-700 hover:group-[.toast]:bg-sage-green-200 transition-colors",
                    error: "!text-red-600 !bg-red-50/90 !border-red-100",
                    success: "!text-evergreen-700 !bg-evergreen-50/90 !border-evergreen-100",
                    warning: "!text-amber-600 !bg-amber-50/90 !border-amber-100",
                    info: "!text-blue-600 !bg-blue-50/90 !border-blue-100",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }
