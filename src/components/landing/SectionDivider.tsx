import React from 'react'

interface SectionDividerProps {
  /**
   * Tailwind color utility class to apply to the wave fill, e.g. 'text-white', 'text-slate-50'.
   * The class is applied to the parent <svg> via `className`, and the SVG path uses `fill="currentColor"`.
   */
  colorClass?: string
  /** Flip the wave vertically to inverse the direction (use when previous section is light and next is dark, or vice-versa). */
  flip?: boolean
  /** Height of the divider in Tailwind height units (e.g. 'h-16'). */
  heightClass?: string
}

/**
 * SectionDivider
 * A lightweight SVG wave used to create a smooth visual transition between background colors of adjacent sections.
 * 単なる余白 div の代替として使用し、LP セクション間のメリハリを高める。
 */
export default function SectionDivider({
  colorClass = 'text-white',
  flip = false,
  heightClass = 'h-16',
}: SectionDividerProps) {
  return (
    <div className={`relative w-full overflow-hidden leading-none ${heightClass}`}>
      <svg
        className={`absolute inset-0 w-full ${flip ? 'rotate-180' : ''} ${colorClass}`}
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        {/* 波形パスは https://smooth.ie/blogs/news/svg-wavey-transitions 参照 */}
        <path
          d="M0 67c47.6 0 95.3-5 142.9-10.7C238 48 333 29 428 21.3 523 13 618 17 713 25.3c95.1 8.3 190.1 21.3 285.2 21.4 95.1.2 190.2-12.8 285.3-20.7C1378.3 18 1439 13 1440 12V100H0V67z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
} 