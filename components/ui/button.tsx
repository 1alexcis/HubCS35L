import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, CSSProperties & { iconSize: number }> = {
  sm: { padding: "5px 10px", fontSize: 12.5, borderRadius: 7, height: 28, iconSize: 13 },
  md: { padding: "7px 13px", fontSize: 13.5, borderRadius: 8, height: 34, iconSize: 14 },
  lg: { padding: "10px 16px", fontSize: 14.5, borderRadius: 9, height: 40, iconSize: 16 },
};

const VARIANTS: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "#fff",
    borderColor: "var(--accent)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,.18), 0 1px 0 rgba(20,40,80,.06)",
  },
  secondary: {
    background: "var(--bg-1)",
    color: "var(--ink-1)",
    borderColor: "var(--border)",
    boxShadow: "0 1px 0 rgba(20,40,80,.04)",
  },
  ghost: { background: "transparent", color: "var(--ink-2)", borderColor: "transparent" },
  soft:  { background: "var(--bg-2)",  color: "var(--ink-1)", borderColor: "var(--border)" },
  danger: {
    background: "var(--bg-1)",
    color: "#a83a3a",
    borderColor: "color-mix(in oklch, #a83a3a 40%, var(--border))",
  },
  accent: { background: "var(--gold)", color: "#3b2c0a", borderColor: "var(--gold)" },
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  full,
  children,
  disabled,
  style,
  type = "button",
  ...rest
}: ButtonProps) {
  const { iconSize, ...sizeStyle } = SIZES[size];
  return (
    <button
      type={type}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontFamily: "var(--font-sans, Inter, system-ui, sans-serif)",
        fontWeight: 500,
        letterSpacing: "-0.005em",
        cursor: disabled ? "not-allowed" : "pointer",
        border: "1px solid transparent",
        transition: "background 120ms ease, border-color 120ms ease, color 120ms ease",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.55 : 1,
        whiteSpace: "nowrap",
        ...sizeStyle,
        ...VARIANTS[variant],
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
