"use client";

import { useRef, useCallback, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number; // 0.25 = subtle, 0.5 = medium
  className?: string;
  style?: React.CSSProperties;
}

export default function MagneticButton({
  children,
  strength = 0.3,
  className,
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)", display: "inline-flex", ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
