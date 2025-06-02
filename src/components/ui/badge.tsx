import * as React from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
    
    let variantClasses = ""
    switch (variant) {
      case 'secondary':
        variantClasses = "border-gray-200 bg-gray-100 text-gray-800"
        break
      case 'outline':
        variantClasses = "border-gray-300 text-gray-700"
        break
      case 'destructive':
        variantClasses = "border-red-500 bg-red-500 text-white"
        break
      default:
        variantClasses = "border-blue-500 bg-blue-500 text-white"
    }

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
export type { BadgeProps } 