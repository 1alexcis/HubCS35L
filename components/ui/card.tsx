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
