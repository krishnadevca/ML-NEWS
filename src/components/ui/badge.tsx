import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default: "border-neutral-700 bg-white text-black font-semibold",
    secondary: "border-neutral-800 bg-neutral-900 text-neutral-300",
    destructive: "border-neutral-700 bg-neutral-900 text-neutral-200",
    outline: "border-neutral-800 text-neutral-300",
    success: "border-neutral-600 bg-neutral-900 text-white font-medium",
    warning: "border-neutral-700 bg-neutral-900 text-neutral-300",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
