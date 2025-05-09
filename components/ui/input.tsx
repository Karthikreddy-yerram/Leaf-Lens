import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "modern" | "underline" | "glass"
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      modern: "flex h-10 w-full rounded-lg border-2 border-transparent bg-muted px-4 py-2 text-sm shadow-sm transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-primary/20 focus:border-primary focus:bg-background focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 group-[.has-error]:border-destructive",
      underline: "flex h-10 w-full border-0 border-b-2 border-input bg-transparent px-3 py-2 text-sm shadow-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/50",
      glass: "flex h-10 w-full rounded-md border border-white/10 bg-white/10 backdrop-blur-md px-3 py-2 text-sm placeholder:text-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-white/20 dark:border-black/10 dark:bg-black/10 dark:hover:bg-black/20"
    }

    return (
      <input
        type={type}
        className={cn(
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
