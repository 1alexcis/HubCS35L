import type { Org } from "@/lib/types";

interface OrgLogoProps {
  org: Pick<Org, "color" | "logo">;
  size?: number;
  radius?: number;
  className?: string;
}

export function OrgLogo({ org, size = 36, radius, className }: OrgLogoProps) {
  const r = radius != null ? radius : Math.round(size * 0.22);
  return (
    <div
      className={`grid place-items-center font-serif font-semibold flex-shrink-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] select-none${className ? ` ${className}` : ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: org.color,
        color: "#fff",
        fontSize: size * 0.4,
        letterSpacing: "-0.02em",
      }}
      aria-hidden
    >
      {org.logo}
    </div>
  );
}
