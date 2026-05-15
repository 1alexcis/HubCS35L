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
