import type { CSSProperties } from "react";
export type IconName = "back" | "arrow" | "phone" | "chat" | "info" | "plus" | "calculator" | "profiles" | "image" | "mic" | "pin" | "smile" | "send" | "close" | "stop" | "check";
const paths: Record<IconName, React.ReactNode> = {
  back: <><path d="m12 5-7 7 7 7M5 12h14"/></>,
  arrow: <><path d="m9 5 7 7-7 7"/></>,
  phone: <path d="m8 3 3 5-3 3c1 2 3 4 5 5l3-3 5 3-1 4c-1 3-7 0-11-4S2 6 4 4l4-1Z"/>,
  chat: <path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0ZM7 10h10M7 14h6"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  calculator: <><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M8 6h8M8 11h1m6 0h1M8 15h1m6 0h1M8 19h1m6 0h1"/></>,
  profiles: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 5V3h8v2M3 11h18M10 15h4"/></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><path d="m3 17 5-5 4 4 4-7 5 8"/></>,
  mic: <><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M9 22h6"/></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="9" r="2"/></>,
  smile: <><circle cx="12" cy="12" r="9"/><path d="M8 9h.01M16 9h.01M8 14c2 3 6 3 8 0"/></>,
  send: <path d="m3 3 19 9-19 9 4-9-4-9ZM7 12h15"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2"/>,
  check: <path d="m5 12 4 4L19 6"/>,
};
export default function InterfaceIcon({ name, size = 20, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, ...style }}>{paths[name]}</svg>;
}
