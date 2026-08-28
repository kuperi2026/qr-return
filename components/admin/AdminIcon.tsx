import type { ReactNode } from "react";

export type AdminIconName =
  | "support" | "search" | "qr" | "users" | "profiles" | "location"
  | "orders" | "notifications" | "chat" | "forms" | "website"
  | "contact" | "settings" | "products";

const paths: Record<AdminIconName, ReactNode> = {
  support: <><path d="M5 6.5h14v9H9l-4 3v-12Z"/><path d="M9 10h6M9 13h4"/></>,
  search: <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4 4"/></>,
  qr: <><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><rect x="8" y="8" width="3" height="3"/><rect x="14" y="13" width="3" height="3"/></>,
  users: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3.5 19c.4-4 2.3-6 5.5-6s5.1 2 5.5 6M14 14c3.4-.5 5.5 1.2 6 4"/></>,
  profiles: <><path d="M4 5h10l6 6-9 9-7-7V5Z"/><circle cx="9" cy="10" r="1.4"/></>,
  location: <><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.2"/></>,
  products: <><path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></>,
  orders: <><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
  notifications: <><path d="M6 17h12l-1.5-2.5V10a4.5 4.5 0 0 0-9 0v4.5L6 17Z"/><path d="M10 20h4"/></>,
  chat: <><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></>,
  forms: <><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  website: <><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M9 21h6M12 18v3"/></>,
  contact: <><path d="M7 4 4.5 6.5c.8 6.4 6.6 12.2 13 13L20 17l-4-3-2 2c-2.7-1.1-4.9-3.3-6-6l2-2-3-4Z"/></>,
  settings: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10M4 12h4M12 12h8"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/><circle cx="10" cy="12" r="2"/></>,
};

export default function AdminIcon({name}:{name:AdminIconName}) {
  return <svg className="adminIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
