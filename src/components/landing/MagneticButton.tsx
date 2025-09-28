"use client";

import React, { useRef } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "transform 0.1s ease-out",
      }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        ref.current.style.transform = `translate(${distanceX * strength}px, ${distanceY * strength}px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) {
          ref.current.style.transform = "translate(0px, 0px)";
        }
      }}
    >
      {children}
    </div>
  );
}
