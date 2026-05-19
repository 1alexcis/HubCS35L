import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={`flex items-end justify-between mb-3 ${className ?? ""}`.trim()}>
      <div>
        <h2
          className="font-serif font-medium tracking-tight text-ink-1"
          style={{ margin: 0, fontSize: 22, letterSpacing: "-0.015em" }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-[13px] text-ink-3">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
