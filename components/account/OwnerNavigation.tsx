"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import InterfaceIcon, { type IconName } from "@/app/components/ui/InterfaceIcon";
import styles from "./owner-navigation.module.css";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/my-profiles", label: "ჩემი პროფილები", icon: "profiles" },
  { href: "/account/subscriptions", label: "პაკეტები", icon: "calculator" },
  { href: "/account/chat", label: "შეტყობინებები", icon: "chat" },
];

export default function OwnerNavigation({ email, onLogout, loggingOut = false }: {
  email?: string;
  onLogout?: () => void;
  loggingOut?: boolean;
}) {
  const pathname = usePathname();
  return <header className={styles.header}>
    <div className={styles.top}>
      <Link href="/" className={styles.brand}><span className={styles.mark}>QR</span><span><strong>QR RETURN</strong><small>დაცული QR კავშირი</small></span></Link>
      <div className={styles.account}>
        {email && <span title={email} className={styles.email}>{email}</span>}
        {onLogout && <button type="button" disabled={loggingOut} onClick={onLogout}>{loggingOut ? "გადიხართ…" : "გამოსვლა"}</button>}
      </div>
    </div>
    <nav className={styles.nav} aria-label="მფლობელის სივრცის ნავიგაცია">
      {links.map(({ href, label, icon }) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}><InterfaceIcon name={icon} size={18}/>{label}</Link>)}
    </nav>
  </header>;
}
