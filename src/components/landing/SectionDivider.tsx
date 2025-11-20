import React from "react";

interface SectionDividerProps {
  /**
   * Tailwind color utility class to apply to the wave fill, e.g. 'text-white', 'text-slate-50'.
   * The class is applied to the parent <svg> via `className`, and the SVG path uses `fill="currentColor"`.
   */
  colorClass?: string;
  /** Flip the wave vertically to inverse the direction (use when previous section is light and next is dark, or vice-versa). */
  flip?: boolean;
  /** Height of the divider in Tailwind height units (e.g. 'h-16'). */
  heightClass?: string;
}

/**
 * SectionDivider
 * A lightweight SVG wave used to create a smooth visual transition between background colors of adjacent sections.
 * 単なる余白 div の代替として使用し、LP セクション間のメリハリを高める。
 */
export function SectionDivider({
  colorClass = "text-white",
  heightClass = "h-16",
  flip = false,
}: SectionDividerProps) {
  return (
    <div className={`w-full overflow-hidden leading-none ${heightClass} ${colorClass}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`relative block w-full h-full ${flip ? "transform rotate-180" : ""}`}
        style={{ width: "calc(100% + 1.3px)" }}
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
