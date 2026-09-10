"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/my-profiles", icon: "⌂", label: "პროფილები" },
  { href: "/account/chat", icon: "◌", label: "ჩათი" },
  { href: "/register", icon: "+", label: "დამატება", primary: true },
  { href: "/account/notifications", icon: "♢", label: "სიახლეები" },
  { href: "/account/profile", icon: "◎", label: "ანგარიში" },
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
              <span>{item.icon}</span>
              <small>{item.label}</small>
            </Link>
          );
        })}
      </nav>
      <style jsx global>{`
        body.kompasiAppMode{padding-bottom:calc(92px + env(safe-area-inset-bottom))!important}
        .appDock{position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom));z-index:990;width:min(560px,calc(100% - 20px));min-height:72px;padding:8px 9px;display:grid;grid-template-columns:repeat(5,1fr);align-items:end;border:1px solid rgba(255,255,255,.7);border-radius:24px;background:rgba(255,255,255,.94);box-shadow:0 18px 55px rgba(1,24,65,.3);backdrop-filter:blur(20px);transform:translateX(-50%)}
        .appDock a{min-width:0;min-height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:15px;color:#687d93;text-decoration:none;transition:160ms ease}.appDock a span{font-size:23px;font-weight:900;line-height:1}.appDock a small{max-width:100%;overflow:hidden;font-size:9px;font-weight:850;text-overflow:ellipsis;white-space:nowrap}.appDock a.active{background:#edf5ff;color:#0759ca}.appDock a.primary{width:58px;height:58px;margin:0 auto 7px;border-radius:19px;background:linear-gradient(135deg,#0b71ed,#624de5);color:#fff;box-shadow:0 10px 25px rgba(30,91,218,.36)}.appDock a.primary span{font-size:29px}.appDock a.primary small{color:#fff}.offlinePill{position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));z-index:1100;padding:10px 15px;border:1px solid #f5d08c;border-radius:999px;background:#fff7e6;color:#925d06;box-shadow:0 10px 30px rgba(60,35,0,.18);font:850 12px/1.2 Arial,sans-serif;transform:translateX(-50%)}
        @media(min-width:700px){.appDock{min-height:76px}.appDock a small{font-size:10px}}
      `}</style>
    </>
  );
}
