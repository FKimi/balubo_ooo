interface SimpleProgressProps {
  value: number
  className?: string
}

export function SimpleProgress({ value, className }: SimpleProgressProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-gray-200 ${className || 'h-2'}`}>
      <div 
        className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full" 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
} 