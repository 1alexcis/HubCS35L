// [GenAI Use] Prompt: "Role: React and Tailwind CSS expert. Context: working on a foundation UI for a app to help discover UCLA clubs using Next.js and TypeScript. Objective: Develop a SectionHeader component that will have a title, subtitle (optional), and action slot for buttons (optional). Criteria: Clean TypeScript interfaces, minimal implementation."
// [GenAI Use] LLM Response Start
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
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: Showed that the action slot was positioned properly in relation to the title in the Upcoming and Following sections of the dashboard. Verified subtitle on the correct size compared to the title.
