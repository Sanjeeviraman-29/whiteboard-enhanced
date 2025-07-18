import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-primary-foreground shadow-elevation hover:scale-105 hover:shadow-ai font-medium",
        destructive:
          "bg-destructive text-destructive-foreground shadow-elevation hover:bg-destructive/90 hover:scale-105",
        outline:
          "border border-glass-border bg-glass backdrop-blur-sm shadow-glass hover:bg-glass-hover hover:border-primary/30 hover:shadow-elevation",
        secondary:
          "bg-secondary text-secondary-foreground shadow-elevation hover:bg-secondary/80 hover:scale-105",
        ghost: "hover:bg-glass-hover hover:text-foreground transition-colors",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        ai: "bg-gradient-ai text-foreground shadow-ai hover:scale-105 hover:shadow-elevation ai-pulse font-medium",
        glass: "glass glass-hover text-foreground font-medium",
        tool: "bg-muted hover:bg-tool-hover hover:text-foreground border border-glass-border rounded-lg transition-all duration-200",
        floating: "glass glass-hover text-foreground shadow-elevation hover:shadow-ai hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        tool: "h-12 w-12 p-0",
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
