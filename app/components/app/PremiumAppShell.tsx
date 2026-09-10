"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type ChatAlert = {
  title: string;
  message: string;
  href: string;
};

const NAV_ITEMS = [
  { href: "/app/dashboard", icon: "home", label: "მთავარი" },
  { href: "/app/profiles", icon: "profiles", label: "პროფილები" },
  { href: "/app/products", icon: "plus", label: "პროდუქტები", primary: true },
  { href: "/app/chat", icon: "chat", label: "ჩათი" },
  { href: "/app/account", icon: "user", label: "ანგარიში" },
];

export default function PremiumAppShell() {
  const pathname = usePathname();
  const [appMode, setAppMode] = useState(false);
  const [online, setOnline] = useState(true);
  const [chatAlert, setChatAlert] = useState<ChatAlert | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    const preview = new URLSearchParams(window.location.search).get("app_preview") === "1";
    const savedApp = window.localStorage.getItem("kompasi-app-mode") === "1";
    setAppMode(standalone || preview || savedApp);
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

  const registrationArea = pathname.startsWith("/register") || pathname.startsWith("/register-item") || pathname.startsWith("/emergency/register");
  const ownerArea = pathname.startsWith("/app/") || pathname === "/my-profiles" || pathname.startsWith("/account") || pathname.startsWith("/profile/") || registrationArea;

  useEffect(() => {
    if (typeof Notification !== "undefined") setNotificationPermission(Notification.permission);
  }, []);

  useEffect(() => {
    if (!appMode || !ownerArea) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;

    const supabase = createClient(url, key);
    let cancelled = false;
    const channel = supabase.channel("kompasi-owner-chat-alerts");

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const [{ data: items }, { data: emergencyProfiles }] = await Promise.all([
        supabase.from("item").select("id,tag_code,item_type,pet_type,item_name").eq("owner_id", user.id),
        supabase.from("emergency_profiles").select("id,tag_code,first_name,last_name").eq("owner_id", user.id),
      ]);
      if (cancelled) return;

      const ownedItems = new Map((items || []).map((item) => [item.id, item]));
      const emergencyByTag = new Map((emergencyProfiles || []).map((profile) => [profile.tag_code, profile]));
      channel
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload) => {
          const message = payload.new as {
            item_id?: string;
            sender_role?: string;
            message_text?: string;
            message?: string;
          };
          if (!message.item_id || message.sender_role === "owner") return;
          const item = ownedItems.get(message.item_id);
          if (!item) return;

          const type = item.item_type || item.pet_type || "item";
          const title = `${item.item_name || "QR პროფილი"}: ახალი შეტყობინება`;
          const body = message.message_text || message.message || "მპოვნელი დაგიკავშირდათ ჩატში.";
          const href = `/chat/${type}/${item.tag_code}`;
          setChatAlert({ title, message: body, href });
          navigator.vibrate?.([180, 90, 180]);

          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              const notification = new Notification(title, { body, icon: "/app-icons/app-icon.svg", tag: `chat-${message.item_id}` });
              notification.onclick = () => {
                window.focus();
                window.location.assign(href);
                notification.close();
              };
            } catch {
              // The in-app alert remains visible on mobile browsers that disallow this constructor.
            }
          }
        })
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "live_chat_messages" }, (payload) => {
          const message = payload.new as { profile_type?: string; tag_code?: string; sender_type?: string; message?: string };
          if (message.profile_type !== "emergency" || !message.tag_code || message.sender_type === "owner") return;
          const profile = emergencyByTag.get(message.tag_code);
          if (!profile) return;
          const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Emergency პროფილი";
          const title = `${name}: ახალი Emergency შეტყობინება`;
          const body = message.message || "მპოვნელი Emergency ჩატში დაგიკავშირდათ.";
          const href = `/app/live-chat/emergency/${encodeURIComponent(message.tag_code)}`;
          setChatAlert({ title, message: body, href });
          navigator.vibrate?.([220, 90, 220]);
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            try {
              const notification = new Notification(title, { body, icon: "/app-icons/app-icon.svg", tag: `emergency-chat-${message.tag_code}` });
              notification.onclick = () => { window.focus(); window.location.assign(href); notification.close(); };
            } catch {
              // The in-app alert remains available when system notifications are unavailable.
            }
          }
        })
        .subscribe();
    })();

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [appMode, ownerArea]);

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    setNotificationPermission(await Notification.requestPermission());
  };

  useEffect(() => {
    document.body.classList.toggle("kompasiAppMode", appMode && ownerArea);
    document.body.classList.toggle("kompasiAppRegistration", appMode && registrationArea);
    return () => {
      document.body.classList.remove("kompasiAppMode");
      document.body.classList.remove("kompasiAppRegistration");
    };
  }, [appMode, ownerArea, registrationArea]);

  if (!appMode || !ownerArea) return null;

  return (
    <>
      {!online && <div className="offlinePill">◌ ინტერნეტთან კავშირი შეწყდა</div>}
      {notificationPermission === "default" && (
        <button className="notificationPill" type="button" onClick={enableNotifications}>♢ ჩართეთ ჩატის შეტყობინებები</button>
      )}
      {chatAlert && (
        <aside className="chatAlert" role="status" aria-live="polite">
          <Link href={chatAlert.href} onClick={() => setChatAlert(null)}>
            <b>{chatAlert.title}</b>
            <span>{chatAlert.message}</span>
          </Link>
          <button type="button" aria-label="შეტყობინების დახურვა" onClick={() => setChatAlert(null)}>×</button>
        </aside>
      )}
      <nav className="appDock" aria-label="KOMPASI აპის ნავიგაცია">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/my-profiles" || item.href === "/app/dashboard"
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
        body.kompasiAppRegistration{background:#f3f7fc!important}
        body.kompasiAppRegistration .page{width:100%!important;min-height:100vh!important;padding:0 10px 92px!important;background:radial-gradient(circle at 50% 0,#deecff,transparent 24%),#f3f7fc!important}
        body.kompasiAppRegistration .topbar{width:min(560px,100%)!important;height:60px!important;margin:0 auto!important;padding:0 4px!important;border-bottom:1px solid #dce6f0!important}
        body.kompasiAppRegistration .topbar .brandMark{width:36px!important;height:36px!important;border-radius:10px!important;font-size:12px!important}
        body.kompasiAppRegistration .topbar .brandText strong{color:#173652!important;font-size:12px!important}
        body.kompasiAppRegistration .topbar .brandText small{color:#71869a!important;font-size:7px!important}
        body.kompasiAppRegistration .topButton,body.kompasiAppRegistration .profilesButton{padding:8px 11px!important;border:1px solid #cfdeed!important;background:#fff!important;color:#1761bd!important;font-size:9px!important}
        body.kompasiAppRegistration .mainCard,body.kompasiAppRegistration .form,body.kompasiAppRegistration .itemForm,body.kompasiAppRegistration .emergencyChoiceCard,body.kompasiAppRegistration main>form{width:min(560px,100%)!important;max-width:560px!important;margin-left:auto!important;margin-right:auto!important}
        body.kompasiAppRegistration .mainCard{padding:19px 14px!important;border-radius:18px!important;box-shadow:0 10px 28px rgba(15,57,105,.1)!important}
        body.kompasiAppRegistration .heroCard{padding:20px 17px!important;border-radius:18px!important}
        body.kompasiAppRegistration .heroCard h1,body.kompasiAppRegistration .heading h1,body.kompasiAppRegistration .intro h1{font-size:22px!important;line-height:1.2!important}
        body.kompasiAppRegistration .heroCard p,body.kompasiAppRegistration .heading p,body.kompasiAppRegistration .intro p{font-size:10px!important;line-height:1.5!important}
        body.kompasiAppRegistration .card,body.kompasiAppRegistration .sectionCard,body.kompasiAppRegistration .saveCard{padding:17px 14px!important;border-radius:16px!important;box-shadow:0 7px 20px rgba(22,63,109,.07)!important}
        body.kompasiAppRegistration .cardHeader,body.kompasiAppRegistration .sectionHeader{padding-bottom:13px!important;gap:10px!important}
        body.kompasiAppRegistration .cardHeader .icon,body.kompasiAppRegistration .sectionHeader .icon,body.kompasiAppRegistration .headingIcon{width:42px!important;height:42px!important;flex-basis:42px!important;border-radius:12px!important;font-size:20px!important}
        body.kompasiAppRegistration .cardHeader h2,body.kompasiAppRegistration .sectionHeader h2,body.kompasiAppRegistration .heading h2{font-size:15px!important}
        body.kompasiAppRegistration .cardHeader p,body.kompasiAppRegistration .sectionHeader p{font-size:9px!important}
        body.kompasiAppRegistration .grid,body.kompasiAppRegistration .formGrid,body.kompasiAppRegistration .textareaGrid,body.kompasiAppRegistration .visibilityLayout,body.kompasiAppRegistration .choiceGrid,body.kompasiAppRegistration .relationshipGrid{grid-template-columns:1fr!important;gap:11px!important}
        body.kompasiAppRegistration .qrBox,body.kompasiAppRegistration .qrSection,body.kompasiAppRegistration .infoBox,body.kompasiAppRegistration .optionalBox{margin-top:14px!important;padding:13px!important;border-radius:12px!important}
        body.kompasiAppRegistration input,body.kompasiAppRegistration select{min-height:46px!important;font-size:13px!important}
        body.kompasiAppRegistration textarea{min-height:90px!important;font-size:13px!important}
        body.kompasiAppRegistration label{font-size:10px!important}
        body.kompasiAppRegistration .actions,body.kompasiAppRegistration .bottomBar,body.kompasiAppRegistration .finalActions{gap:8px!important}
        body.kompasiAppRegistration .actions button,body.kompasiAppRegistration .actions a,body.kompasiAppRegistration .primaryButton,body.kompasiAppRegistration .secondaryButton,body.kompasiAppRegistration .createButton{min-height:45px!important;border-radius:11px!important;font-size:10px!important}
        body.kompasiAppRegistration .progressRow{width:min(560px,100%)!important;margin-left:auto!important;margin-right:auto!important}
        @media(max-width:600px){body.kompasiAppRegistration .actions,body.kompasiAppRegistration .finalActions{display:grid!important;grid-template-columns:1fr!important}body.kompasiAppRegistration .choice{min-height:74px!important;padding:12px!important}}
        .appDock{position:fixed;left:50%;bottom:max(7px,env(safe-area-inset-bottom));z-index:990;width:min(480px,calc(100% - 16px));height:62px;padding:5px 8px;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;border:1px solid rgba(255,255,255,.76);border-radius:20px;background:rgba(250,253,255,.93);box-shadow:0 14px 38px rgba(2,28,70,.24),inset 0 1px 0 #fff;backdrop-filter:blur(22px) saturate(145%);transform:translateX(-50%)}
        .appDock a{position:relative;min-width:0;height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border-radius:13px;color:#728398;text-decoration:none;transition:160ms ease}.navIcon{width:21px;height:21px;display:grid;place-items:center}.navIcon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.appDock a small{max-width:100%;overflow:hidden;font-size:8px;font-weight:800;letter-spacing:.05px;text-overflow:ellipsis;white-space:nowrap}.appDock a.active{color:#075dce}.appDock a.active::after{content:"";position:absolute;bottom:1px;width:16px;height:2px;border-radius:999px;background:#176be5}.appDock a.primary{width:48px;height:48px;margin:0 auto;border-radius:15px;background:linear-gradient(145deg,#0c74ee,#3158d8 55%,#6549df);color:#fff;box-shadow:0 8px 19px rgba(32,87,210,.31)}.appDock a.primary .navIcon{width:22px;height:22px}.appDock a.primary small{color:#fff;font-size:7px}.appDock a.primary::after{display:none}.offlinePill{position:fixed;left:50%;top:max(10px,env(safe-area-inset-top));z-index:1100;padding:8px 13px;border:1px solid #f5d08c;border-radius:999px;background:#fff7e6;color:#925d06;box-shadow:0 9px 25px rgba(60,35,0,.16);font:800 11px/1.2 Arial,sans-serif;transform:translateX(-50%)}
        .notificationPill{position:fixed;left:50%;top:max(10px,env(safe-area-inset-top));z-index:1090;padding:9px 13px;border:1px solid #bcd4f3;border-radius:999px;background:#f6faff;color:#0b5dbc;box-shadow:0 9px 25px rgba(13,69,139,.14);font:800 10px/1.2 Arial,sans-serif;transform:translateX(-50%)}
        .offlinePill+.notificationPill{top:max(48px,calc(env(safe-area-inset-top) + 48px))}
        .chatAlert{position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));z-index:1200;width:min(450px,calc(100% - 24px));display:flex;align-items:flex-start;gap:10px;padding:13px 12px 13px 15px;border:1px solid #c7ddf7;border-radius:16px;background:rgba(250,253,255,.97);box-shadow:0 16px 42px rgba(5,53,115,.24);backdrop-filter:blur(18px);transform:translateX(-50%)}
        .chatAlert a{min-width:0;flex:1;color:#173652;text-decoration:none}.chatAlert b,.chatAlert span{display:block}.chatAlert b{font-size:11px}.chatAlert span{margin-top:4px;overflow:hidden;color:#657b90;font-size:9px;line-height:1.35;text-overflow:ellipsis;white-space:nowrap}.chatAlert button{width:27px;height:27px;border:0;border-radius:9px;background:#edf4fc;color:#52708e;font-size:18px;line-height:1}
      `}</style>
    </>
  );
}

function NavIcon({ name }: { name: string }) {
  if (name === "home") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.5 10.5 8.5-7 8.5 7"/><path d="M5.5 9.5v10h13v-10M9.5 19.5v-6h5v6"/></svg>;
  if (name === "chat") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 9 9 0 0 1-3.5-.7L4 20l1.5-4A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg>;
  if (name === "profiles") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>;
  if (name === "plus") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "bell") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8Z"/><path d="M10 20h4"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>;
}
