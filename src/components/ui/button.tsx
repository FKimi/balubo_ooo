import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant = 
  | "default"
  | "cta"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          // Base styles - touch-target for accessibility
          "inline-flex items-center justify-center text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background touch-target",
          {
            // Default: Pill-shaped primary button (Unified Design Rules 2025)
            "bg-gray-900 text-white hover:bg-gray-800 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] hover:scale-[1.02]":
              variant === "default",
            // CTA: Blue pill-shaped button for main actions
            "bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow-[0_8px_24px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.35)] hover:scale-[1.02]":
              variant === "cta",
            // Destructive: Red pill-shaped button
            "bg-red-600 text-white hover:bg-red-700 rounded-full shadow-[0_8px_24px_rgba(220,38,38,0.25)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.35)]":
              variant === "destructive",
            // Outline: Rounded button with border
            "border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-2xl":
              variant === "outline",
            // Secondary: Soft background
            "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-2xl":
              variant === "secondary",
            // Ghost: Transparent with hover
            "hover:bg-gray-100 rounded-2xl": variant === "ghost",
            // Link: Text-only
            "underline-offset-4 hover:underline text-gray-900":
              variant === "link",
          },
          {
            "h-11 py-2.5 px-6": size === "default",
            "h-9 px-4 text-xs": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-11 w-11 rounded-full": size === "icon",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
