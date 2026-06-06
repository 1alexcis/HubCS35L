// [GenAI Use] Prompt: "Role: React and Tailwind CSS expert. In context: Developing basic UI elements for a club discovery website for UCLA using Next.js and TypeScript. Problem: Develop a Card component that has a padding, can have a hover state, and an option to add an onClick handler. Criteria: Clean TypeScript interfaces, minimal implementation, consistent with a design token system."
// [GenAI Use] LLM Response Start
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  padding?: number;
  hoverable?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, padding, hoverable, onClick, className, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`${hoverable ? "hover:border-border-strong hover:-translate-y-px hover:shadow-sm" : ""} ${className ?? ""}`.trim()}
      style={{
        background: "var(--bg-1)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: padding != null ? padding : 16,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: Tested that the animation of hover (-translate-y-px) was not distracting. Verified default padding size (16px) was consistent with spacing across all instances of the card in the dashboard and on the org page.
