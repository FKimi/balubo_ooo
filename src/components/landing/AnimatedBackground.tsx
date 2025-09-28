"use client";

import { useEffect, useRef } from "react";

/**
 * AnimatedBackground
 * -------------------
 * Adds an interactive radial-gradient highlight that follows the
 * user's cursor. Pure CSS/JS – no external deps required.
 * Place this component inside a relatively-positioned parent that
 * should receive the effect (e.g. the Hero section).
 */
export default function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      const { clientX: x, clientY: y } = e;
      // Use vw/vh based coordinates so the gradient stays under the cursor.
      const xPercent = (x / window.innerWidth) * 100;
      const yPercent = (y / window.innerHeight) * 100;
      el.style.backgroundImage = `radial-gradient(circle at ${xPercent}% ${yPercent}%, rgba(59,130,246,0.35) 0%, transparent 60%)`;
    };

    // Initial paint so there's no flash.
    handlePointerMove({
      clientX: window.innerWidth / 2,
      clientY: window.innerHeight / 2,
    } as PointerEvent);

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div
      ref={bgRef}
      // Negative z-index keeps it behind the content but above the section background.
      className="pointer-events-none absolute inset-0 -z-10 transition-[background-image] duration-300 ease-out"
    />
  );
}
