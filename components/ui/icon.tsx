import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "home" | "compass" | "calendar" | "bell" | "inbox" | "plus"
  | "search" | "chev_r" | "chev_d" | "check" | "x" | "pin"
  | "clock" | "users" | "eye" | "lock" | "globe" | "sparkle"
  | "edit" | "arrow_r" | "flag" | "settings" | "logout"
  | "megaphone" | "doc" | "filter" | "sliders" | "star";

const PATHS: Record<IconName, ReactNode> = {
  home: <><path d="M3 11.5L12 4l9 7.5" /><path d="M5 10v9h14v-9" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5L13 13l-4.5 2.5L11 11z" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  bell: <><path d="M6 16V11a6 6 0 0112 0v5l1.5 2H4.5L6 16z" /><path d="M10 20a2 2 0 004 0" /></>,
  inbox: <><path d="M3 13l3-9h12l3 9v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z" /><path d="M3 13h5l1 2h6l1-2h5" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.5-4.5" /></>,
  chev_r: <path d="M9 6l6 6-6 6" />,
  chev_d: <path d="M6 9l6 6 6-6" />,
  check: <path d="M5 12l5 5 9-11" />,
  x: <path d="M5 5l14 14M19 5L5 19" />,
  pin: <><path d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" /><circle cx="17" cy="9" r="2.5" /><path d="M14.5 14.5c2 .5 4 2 4.5 5" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />,
  edit: <><path d="M4 20h4l10-10-4-4L4 16v4z" /><path d="M14 6l4 4" /></>,
  arrow_r: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  flag: <path d="M5 21V4M5 4h12l-2 4 2 4H5" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" /></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
  megaphone: <><path d="M3 11v2a2 2 0 002 2h2l8 5V4l-8 5H5a2 2 0 00-2 2z" /><path d="M18 8a5 5 0 010 8" /></>,
  doc: <><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" /><path d="M14 3v6h6" /></>,
  filter: <path d="M4 5h16l-6 8v6l-4-2v-4z" />,
  sliders: <><path d="M4 6h12M4 12h7M4 18h16M16 6h4M11 12h9M16 18h0" /><circle cx="20" cy="6" r="1.5" fill="currentColor" /><circle cx="11" cy="12" r="1.5" fill="currentColor" /><circle cx="16" cy="18" r="1.5" fill="currentColor" /></>,
  star: <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9z" />,
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> {
  name: IconName;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 16, stroke = 1.6, style, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ flexShrink: 0, ...style }}
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
