import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base styles with rounded-2xl for consistency
          "flex w-full rounded-2xl border-2 border-gray-300 bg-white px-4 py-3 text-sm transition-all duration-200",
          // Focus states - blue ring per Unified Design Rules
          "focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
          // Hover state
          "hover:border-gray-400",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          // Placeholder
          "placeholder:text-gray-400",
          // File input specific
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Touch target for accessibility
          "touch-target",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
