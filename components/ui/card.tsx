import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: "lift" | "glow" | "border" | "none"
    animation?: "float" | "pulse" | "none"
    glass?: boolean
    variant?: "default" | "gradient" | "outline"
  }
>(({ className, hover = "none", animation = "none", glass = false, variant = "default", ...props }, ref) => {
  const hoverClasses = {
    lift: "hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300",
    glow: "hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-300",
    border: "hover:border-primary/50 transition-all duration-300",
    none: "",
  }

  const animationClasses = {
    float: "floating",
    pulse: "pulse-glow",
    none: "",
  }

  const variantClasses = {
    default: "bg-card text-card-foreground",
    gradient: "bg-gradient-to-br from-primary/5 to-accent/5",
    outline: "bg-background border-2",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm",
        variantClasses[variant],
        hoverClasses[hover],
        animationClasses[animation],
        glass && "backdrop-blur-lg bg-white/10 dark:bg-black/10",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight relative group",
      className
    )}
    {...props}
  >
    {props.children}
    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-300"></span>
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
