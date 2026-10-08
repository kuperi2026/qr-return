import type { CSSProperties } from "react";
export type IconName = "back" | "arrow" | "phone" | "chat" | "info" | "plus" | "calculator" | "profiles" | "image" | "mic" | "pin" | "smile" | "send" | "close" | "stop" | "check" | "history" | "chevronDown" | "edit" | "download" | "external" | "trash" | "key" | "wallet" | "bag" | "suitcase" | "car" | "medical" | "dog" | "cat";
const paths: Record<IconName, React.ReactNode> = {
  history: <><path d="M3 11a9 9 0 1 1 2.6 7M3 4v7h7M12 7v5l3 2"/></>,
  chevronDown: <path d="m6 9 6 6 6-6"/>,
  edit: <><path d="m15 5 4 4M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15l-1 5Z"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></>,
  external: <><path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/></>,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></>,
  key: <><circle cx="8" cy="8" r="5"/><path d="m11.5 11.5 9 9M16 16l3-3M18 18l3-3M6.5 6.5h.01"/></>,
  wallet: <><path d="M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14V8H6a2 2 0 0 1 0-4"/><path d="M20 12h-5v5h5M16 14.5h.01"/></>,
  bag: <><path d="M5 8h14l2 13H3L5 8ZM8 9V6a4 4 0 0 1 8 0v3"/></>,
  suitcase: <><rect x="5" y="5" width="14" height="15" rx="3"/><path d="M9 5V2h6v3M9 9v7m6-7v7M8 20v2m8-2v2"/></>,
  car: <><path d="m4 10 2-6h12l2 6M3 10h18v9H3v-9ZM5 19v3m14-3v3M7 14h1m8 0h1M3 9H1m20 0h2"/></>,
  medical: <><path d="M8 5V2h8v3M8 19v3h8v-3"/><rect x="5" y="5" width="14" height="14" rx="4"/><path d="M12 9v6m-3-3h6"/></>,
  dog: <><path d="m6 5-4 7 4 2V8m12-3 4 7-4 2V8M6 5c4-3 8-3 12 0v11c0 7-12 7-12 0V5ZM9 11h.01M15 11h.01m-5 4h4l-2 2-2-2Zm2 2v3"/></>,
  cat: <><path d="M4 10V3l6 4h4l6-4v12c0 8-16 8-16 0v-5ZM8 12h.01M16 12h.01M11 15h2l-1 2-1-2ZM1 14l5 1m-5 4 5-2m17-3-5 1m5 4-5-2"/></>,
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
