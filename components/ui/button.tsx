import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground hover:bg-primary/90 before:absolute before:inset-0 before:bg-white/10 before:transform before:translate-y-[101%] before:transition-transform before:duration-300 hover:before:translate-y-0 hover:shadow-md active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 before:absolute before:inset-0 before:bg-white/10 before:transform before:translate-y-[101%] before:transition-transform before:duration-300 hover:before:translate-y-0 hover:shadow-md active:scale-[0.98]",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-accent relative after:absolute after:inset-0 after:rounded-md after:bg-accent/10 after:opacity-0 after:transition-opacity hover:after:opacity-100 after:-z-10 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md relative before:absolute before:inset-0 before:rounded-md before:bg-primary/5 before:opacity-0 before:transition-opacity hover:before:opacity-100 active:scale-[0.98]",
        ghost: "hover:bg-accent hover:text-accent-foreground relative after:absolute after:inset-0 after:rounded-md after:bg-accent/10 after:opacity-0 after:transition-opacity hover:after:opacity-100 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 relative transition-colors p-0 h-auto",
        gradient: "bg-gradient-to-r from-primary to-accent text-white hover:from-primary/90 hover:to-accent/90 hover:shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] before:skew-x-[-20deg] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 active:scale-[0.98]",
        glass: "bg-white/10 backdrop-filter backdrop-blur-lg text-foreground border border-white/20 hover:bg-white/20 hover:shadow-md active:scale-[0.98]",
        icon: "h-9 w-9 rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground relative after:absolute after:inset-0 after:rounded-full after:bg-primary/10 after:opacity-0 after:transition-opacity hover:after:opacity-100 after:-z-10 active:scale-[0.95]",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-9 w-9 rounded-full",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        float: "floating",
        glow: "pulse-glow",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, animation, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
