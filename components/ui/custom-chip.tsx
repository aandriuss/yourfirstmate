import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary hover:bg-primary/20",
        success: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-400",
        danger: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-400",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-6 text-xs",
        sm: "h-5 text-xs",
        lg: "h-7 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, size, ...props }: ChipProps) {
  return (
    <div className={cn(chipVariants({ variant, size }), className)} {...props} />
  );
}

export { Chip, chipVariants }; 