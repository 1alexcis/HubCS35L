import type { CSSProperties, ReactNode } from "react";
import type { Visibility } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/icon";

export type BadgeTone = "neutral" | "blue" | "gold" | "green" | "red" | "inverse";

const TONES: Record<BadgeTone, { bg: string; color: string; border: string }> = {
  neutral: {
    bg: "var(--bg-2)",
    color: "var(--ink-2)",
    border: "var(--border)",
  },
  blue: {
    bg: "color-mix(in oklch, var(--accent) 10%, transparent)",
    color: "var(--accent)",
    border: "color-mix(in oklch, var(--accent) 22%, transparent)",
  },
  gold: {
    bg: "color-mix(in oklch, var(--gold) 18%, transparent)",
    color: "#7a5a1a",
    border: "color-mix(in oklch, var(--gold) 40%, transparent)",
  },
  green: {
    bg: "rgba(15, 111, 92, 0.10)",
    color: "#0f6f5c",
    border: "rgba(15, 111, 92, 0.22)",
  },
  red: {
    bg: "rgba(168, 58, 58, 0.10)",
    color: "#a83a3a",
    border: "rgba(168, 58, 58, 0.22)",
  },
  inverse: {
    bg: "var(--ink-1)",
    color: "var(--bg-1)",
    border: "var(--ink-1)",
  },
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: IconName;
  className?: string;
  style?: CSSProperties;
}

export function Badge({ children, tone = "neutral", icon, className, style }: BadgeProps) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide leading-snug whitespace-nowrap${className ? ` ${className}` : ""}`}
      style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}`, ...style }}
    >
      {icon && <Icon name={icon} size={11} />}
      {children}
    </span>
  );
}

const VISIBILITY_MAP: Record<Visibility, { tone: BadgeTone; icon: IconName; label: string }> = {
  public: { tone: "neutral", icon: "globe", label: "Public" },
  followers: { tone: "blue", icon: "eye", label: "Followers" },
};

export function VisibilityChip({ visibility }: { visibility: Visibility | null | undefined }) {
  const m = VISIBILITY_MAP[visibility as Visibility] ?? VISIBILITY_MAP.public;
  return <Badge tone={m.tone} icon={m.icon}>{m.label}</Badge>;
}
