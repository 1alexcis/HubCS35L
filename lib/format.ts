import { TODAY } from "@/lib/data";

export function fmtDate(d: Date, opts: { weekday?: "long" | "short" | "narrow"; month?: "long" | "short" | "narrow" | "2-digit" | "numeric" } = {}): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: opts.weekday,
    month: opts.month ?? "short",
    day: "numeric",
  }).format(d);
}

export function fmtTime(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d).toLowerCase();
}

export function relTime(d: Date): string {
  const diffMs = d.getTime() - TODAY.getTime();
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays === 0)  return "Today";
  if (diffDays === 1)  return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0 && diffDays <= 6)  return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -6) return `${-diffDays} days ago`;
  return fmtDate(d);
}
