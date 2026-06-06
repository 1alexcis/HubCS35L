// [GenAI Use] Prompt: "Role: React and Tailwind CSS expert. Context: I'm building a component library for a UCLA club discovery web app using Next.js and TypeScript. Task: Create an Avatar component that displays user initials in a colored circle with configurable size and color. Criteria: Components should accept size and color as props and follow TypeScript best practices."
// [GenAI Use] LLM Response Start
interface AvatarProps {
  initials: string;
  name?: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Avatar({
  initials,
  name,
  size = 32,
  color = "var(--accent)",
  className,
}: AvatarProps) {
  return (
    <div
      className={`rounded-full grid place-items-center font-sans font-medium flex-shrink-0 select-none${className ? ` ${className}` : ""}`}
      style={{
        width: size,
        height: size,
        background: color,
        color: "#fff",
        fontSize: size * 0.42,
        letterSpacing: "-0.01em",
      }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: Checked the created component for accuracy. Refined the formula used to scale font size (size * 0.42) and color tokens to align with our design system. Tested that all of the user initials in the sidebar and dashboard work well with it.