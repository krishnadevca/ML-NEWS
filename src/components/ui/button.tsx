import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
    
    const variants = {
      default: "bg-white text-black hover:bg-neutral-200 shadow-sm active:scale-[0.99]",
      destructive: "bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800",
      outline: "border border-neutral-800 bg-black text-neutral-200 hover:text-white hover:bg-neutral-900 hover:border-neutral-700",
      secondary: "bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white border border-neutral-800",
      ghost: "hover:bg-neutral-900 text-neutral-400 hover:text-white",
      link: "text-white underline-offset-4 hover:underline",
      glow: "bg-white text-black hover:bg-neutral-200 shadow-sm font-semibold active:scale-[0.99]",
    }

    const sizes = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-sm font-semibold",
      icon: "h-9 w-9",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
