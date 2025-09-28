"use client";

interface HighlightChipsProps {
  totalWorks?: number | undefined;
  experienceYears?: number | undefined;
}

export function HighlightChips({
  totalWorks,
  experienceYears,
}: HighlightChipsProps) {
  const chips: Array<{ label: string; value: string } | null> = [
    typeof totalWorks === "number"
      ? { label: "作品", value: `${totalWorks}` }
      : null,
    typeof experienceYears === "number"
      ? { label: "活動歴", value: `${experienceYears}年` }
      : null,
  ];
  const items = chips.filter(Boolean) as Array<{
    label: string;
    value: string;
  }>;
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
        >
          {c.label} {c.value}
        </span>
      ))}
    </div>
  );
}
