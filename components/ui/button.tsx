'use client'

import React from 'react'
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-lightest shadow hover:bg-accent/90",
        destructive:
          "bg-error text-lightest shadow-sm hover:bg-error/90",
        outline:
          "border border-accent/20 text-lighter bg-transparent shadow-sm hover:bg-accent/10 hover:border-accent/30",
        secondary:
          "bg-secondary text-lightest shadow-sm hover:bg-secondary/80",
        ghost: "text-lighter hover:bg-accent/10 hover:text-lightest",
        link: "text-accent underline-offset-4 hover:underline hover:text-lighter",
        success: "bg-success text-lightest shadow-sm hover:bg-success/90",
        warning: "bg-warning text-darkest shadow-sm hover:bg-warning/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
