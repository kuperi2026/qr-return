"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/my-profiles", icon: "home", label: "პროფილები" },
  { href: "/account/chat", icon: "chat", label: "ჩათი" },
  { href: "/register", icon: "plus", label: "დამატება", primary: true },
  { href: "/account/notifications", icon: "bell", label: "სიახლეები" },
  { href: "/account/profile", icon: "user", label: "ანგარიში" },
];

export default function PremiumAppShell() {
  const pathname = usePathname();
  const [appMode, setAppMode] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const preview = new URLSearchParams(window.location.search).get("app_preview") === "1";
    setAppMode(standalone || preview);
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const ownerArea = pathname === "/my-profiles" || pathname.startsWith("/account") || pathname.startsWith("/profile/") || pathname.startsWith("/register");

  useEffect(() => {
    document.body.classList.toggle("kompasiAppMode", appMode && ownerArea);
    return () => document.body.classList.remove("kompasiAppMode");
  }, [appMode, ownerArea]);

  if (!appMode || !ownerArea) return null;

  return (
    <>
      {!online && <div className="offlinePill">◌ ინტერნეტთან კავშირი შეწყდა</div>}
      <nav className="appDock" aria-label="KOMPASI აპის ნავიგაცია">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/my-profiles"
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`${active ? "active" : ""} ${item.primary ? "primary" : ""}`}>
              <span className="navIcon"><NavIcon name={item.icon} /></span>
              <small>{item.label}</small>
            </Link>
          );
        })}
      </nav>
      <style jsx global>{`
        body.kompasiAppMode{padding-bottom:calc(76px + env(safe-area-inset-bottom))!important}
        .appDock{position:fixed;left:50%;bottom:max(7px,env(safe-area-inset-bottom));z-index:990;width:min(480px,calc(100% - 16px));height:62px;padding:5px 8px;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;border:1px solid rgba(255,255,255,.76);border-radius:20px;background:rgba(250,253,255,.93);box-shadow:0 14px 38px rgba(2,28,70,.24),inset 0 1px 0 #fff;backdrop-filter:blur(22px) saturate(145%);transform:translateX(-50%)}
        .appDock a{position:relative;min-width:0;height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border-radius:13px;color:#728398;text-decoration:none;transition:160ms ease}.navIcon{width:21px;height:21px;display:grid;place-items:center}.navIcon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.appDock a small{max-width:100%;overflow:hidden;font-size:8px;font-weight:800;letter-spacing:.05px;text-overflow:ellipsis;white-space:nowrap}.appDock a.active{color:#075dce}.appDock a.active::after{content:"";position:absolute;bottom:1px;width:16px;height:2px;border-radius:999px;background:#176be5}.appDock a.primary{width:48px;height:48px;margin:0 auto;border-radius:15px;background:linear-gradient(145deg,#0c74ee,#3158d8 55%,#6549df);color:#fff;box-shadow:0 8px 19px rgba(32,87,210,.31)}.appDock a.primary .navIcon{width:22px;height:22px}.appDock a.primary small{color:#fff;font-size:7px}.appDock a.primary::after{display:none}.offlinePill{position:fixed;left:50%;top:max(10px,env(safe-area-inset-top));z-index:1100;padding:8px 13px;border:1px solid #f5d08c;border-radius:999px;background:#fff7e6;color:#925d06;box-shadow:0 9px 25px rgba(60,35,0,.16);font:800 11px/1.2 Arial,sans-serif;transform:translateX(-50%)}
      `}</style>
    </>
  );
}

function NavIcon({ name }: { name: string }) {
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10.5 8.5-7 8.5 7"/><path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6"/></svg>;
  if (name === "chat") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.5-.7L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>;
  if (name === "plus") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "bell") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8Z"/><path d="M10 20h4"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
}
