"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import InterfaceIcon from "./ui/InterfaceIcon";

export default function SiteBackNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const visits = useRef<string[]>([]);
  useEffect(() => {
    const track = () => {
      const url = location.pathname + location.search + location.hash;
      const stack = visits.current;
      if (stack[stack.length - 1] === url) return;
      if (stack[stack.length - 2] === url) stack.pop();
      else stack.push(url);
    };
    track();
    window.addEventListener("hashchange", track);
    window.addEventListener("popstate", track);
    return () => { window.removeEventListener("hashchange", track); window.removeEventListener("popstate", track); };
  }, [pathname]);
  if (pathname === "/" || pathname.startsWith("/admin") || pathname.startsWith("/app/")) return null;
  const fallback = pathname.startsWith("/account/") ? "/account" : "/";
  return <nav className="siteReturnNav" aria-label="გვერდებს შორის დაბრუნება">
    <div><a href={fallback} onClick={(event) => {
      const referrerIsLocal = document.referrer && new URL(document.referrer).origin === location.origin;
      if (history.length > 1 && (visits.current.length > 1 || referrerIsLocal)) { event.preventDefault(); router.back(); }
    }}><InterfaceIcon name="back" size={18}/>უკან დაბრუნება</a><Link href="/">QR RETURN</Link></div>
    <style jsx>{`
      .siteReturnNav{position:relative;z-index:40;background:#fff;border-bottom:1px solid #e4eaf1;color:#193c59;font-family:var(--font-georgian),Arial,sans-serif}
      .siteReturnNav>div{max-width:1180px;margin:auto;min-height:56px;padding:6px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px;box-sizing:border-box}
      .siteReturnNav :global(a){display:inline-flex;align-items:center;gap:9px;min-height:40px;color:#193c59;text-decoration:none;font-size:14px;font-weight:600;border-radius:8px;padding:0 8px}
      .siteReturnNav :global(a:hover){background:#eff5fb}.siteReturnNav :global(a:focus-visible){outline:2px solid #245da1;outline-offset:3px}
      @media(max-width:540px){.siteReturnNav>div{padding:4px 12px}.siteReturnNav :global(a){font-size:13px}}
    `}</style>
  </nav>;
}
