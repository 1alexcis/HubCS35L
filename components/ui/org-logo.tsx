// [GenAI Use] Prompt: "Role: React and Tailwind CSS expert. Project Description: I am creating a component library for a project to be used in a web app for discovering clubs at the UCLA created in Next.js and TypeScript. Task: Write an OrgLogo component that displays an abbreviation of the organization name in a rounded, coloured square, with a variable background colour and border radius. Criteria: Take size, color, radius as props; follow TypeScript best practice."
// [GenAI Use] LLM Response Start
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
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: I believe that the border radius auto-calculation (size * 0.22) is correct for small and large sizes in the sidebar or on an org page. It is the confirmed fact that the inset shadow made the logo look tasteful and it was in line with the entire UI.