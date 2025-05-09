"use client"

import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent",
        white: "text-white",
      },
      size: {
        xs: "w-4 h-4",
        sm: "w-6 h-6",
        md: "w-8 h-8", 
        lg: "w-12 h-12",
        xl: "w-16 h-16",
      },
      type: {
        border: "",
        dots: "",
        grow: "",
        ripple: "",
        gradient: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      type: "border"
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  variant, 
  size, 
  type,
  className,
  text 
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    switch (type) {
      case 'border':
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), className)}>
            <div className="absolute w-full h-full rounded-full border-4 border-current opacity-20"></div>
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-current animate-spin"></div>
          </div>
        );
      case 'dots':
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), "flex gap-1", className)}>
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "animate-bounce rounded-full bg-current",
                  size === "xs" ? "w-1 h-1" : 
                  size === "sm" ? "w-1.5 h-1.5" : 
                  size === "md" ? "w-2 h-2" : 
                  size === "lg" ? "w-3 h-3" : 
                  "w-4 h-4"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );
      case 'grow':
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), "flex gap-1", className)}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "bg-current animate-pulse",
                  size === "xs" ? "w-0.5 h-3" : 
                  size === "sm" ? "w-1 h-5" : 
                  size === "md" ? "w-1.5 h-7" : 
                  size === "lg" ? "w-2 h-9" : 
                  "w-2.5 h-12"
                )}
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "0.8s" 
                }}
              />
            ))}
          </div>
        );
      case 'ripple':
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), className)}>
            <div className="absolute inset-0 rounded-full bg-current opacity-10 animate-ping" 
                style={{ animationDuration: "1.5s" }}></div>
            <div className="rounded-full bg-current" 
                style={{ 
                  width: "40%", 
                  height: "40%"
                }}></div>
          </div>
        );
      case 'gradient':
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), "rounded-full animate-spin", className)}
               style={{ background: "conic-gradient(transparent, currentColor)" }}>
            <div className="absolute w-3/4 h-3/4 rounded-full bg-background top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        );
      default:
        return (
          <div className={cn(spinnerVariants({ variant, size, type }), className)}>
            <div className="absolute w-full h-full rounded-full border-4 border-current opacity-20"></div>
            <div className="w-full h-full rounded-full border-4 border-transparent border-t-current animate-spin"></div>
          </div>
        );
    }
  };

  if (text) {
    return (
      <div className="flex flex-col items-center gap-3">
        {renderSpinner()}
        <p className="text-center font-medium text-muted-foreground">{text}</p>
      </div>
    );
  }

  return renderSpinner();
}
