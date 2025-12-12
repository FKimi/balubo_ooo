import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background touch-target",
  {
    variants: {
      variant: {
        default:
          "bg-gray-900 text-white hover:bg-gray-800 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] hover:scale-[1.02]",
        cta: "bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] hover:scale-[1.02]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 rounded-full shadow-[0_8px_24px_rgba(220,38,38,0.25)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.35)]",
        outline:
          "border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-2xl",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-2xl",
        ghost: "hover:bg-gray-100 rounded-2xl",
        link: "underline-offset-4 hover:underline text-gray-900",
      },
      size: {
        default: "h-11 py-2.5 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
