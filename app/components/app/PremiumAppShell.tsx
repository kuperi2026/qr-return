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
  { href: "/app/products", icon: "plus", label: "ჰაბი", primary: true },
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
    const params = new URLSearchParams(window.location.search);
    const preview = params.get("app_preview") === "1" || params.get("source") === "app";
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
      const { data: items } = await supabase
        .from("item")
        .select("id,tag_code,item_type,pet_type,item_name")
        .eq("owner_id", user.id);
      if (!items?.length || cancelled) return;

      const ownedItems = new Map(items.map((item) => [item.id, item]));
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
        body.kompasiAppRegistration{overflow-x:hidden!important;background:#063b72!important}
        body.kompasiAppRegistration *{min-width:0;box-sizing:border-box}
        body.kompasiAppRegistration .page{width:100%!important;min-height:100vh!important;overflow-x:hidden!important;padding:0 12px 100px!important;background:radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)!important}
        body.kompasiAppRegistration .registrationPage{width:100%!important;min-height:100vh!important;overflow-x:hidden!important;padding:0 12px 100px!important;background:radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)!important;color:#173652!important}
        body.kompasiAppRegistration .emojiBackground{display:none!important}
        body.kompasiAppRegistration .topbar,body.kompasiAppRegistration .registrationHeader{width:min(520px,100%)!important;max-width:520px!important;height:60px!important;min-height:60px!important;margin:0 auto!important;padding:0 4px!important;border-bottom:1px solid rgba(255,255,255,.22)!important}
        body.kompasiAppRegistration .changeProduct{border:1px solid #c9daea!important;background:#fff!important;color:#1761bd!important;font-size:10px!important}
        body.kompasiAppRegistration .topbar .brandMark{width:36px!important;height:36px!important;border-radius:10px!important;font-size:12px!important}
        body.kompasiAppRegistration .topbar .brandText strong{color:#173652!important;font-size:12px!important}
        body.kompasiAppRegistration .topbar .brandText small{color:#71869a!important;font-size:7px!important}
        body.kompasiAppRegistration .topButton,body.kompasiAppRegistration .profilesButton{padding:8px 11px!important;border:1px solid #cfdeed!important;background:#fff!important;color:#1761bd!important;font-size:9px!important}
        body.kompasiAppRegistration .mainCard,body.kompasiAppRegistration .form,body.kompasiAppRegistration .itemForm,body.kompasiAppRegistration .emergencyChoiceCard,body.kompasiAppRegistration main>form,body.kompasiAppRegistration .registrationCard,body.kompasiAppRegistration .marketingLine,body.kompasiAppRegistration .progressWrap,body.kompasiAppRegistration .registrationProgress{width:min(520px,100%)!important;max-width:520px!important;margin-left:auto!important;margin-right:auto!important}
        body.kompasiAppRegistration .registrationCard{padding:12px!important;overflow:hidden!important;border:1px solid #d6e3ef!important;border-radius:16px!important;background:#fff!important;box-shadow:0 10px 28px rgba(23,63,109,.1)!important}
        body.kompasiAppRegistration .marketingLine{margin-top:10px!important;padding:12px!important;border-radius:13px!important;background:linear-gradient(135deg,#075dcc,#159b65)!important;color:#fff!important;box-shadow:0 8px 20px rgba(7,93,204,.16)!important}
        body.kompasiAppRegistration .marketingLine strong{color:#fff!important;font-size:13px!important}
        body.kompasiAppRegistration .marketingLine p{color:#dff3ff!important;font-size:10px!important}
        body.kompasiAppRegistration .mainCard{padding:19px 14px!important;border-radius:18px!important;box-shadow:0 10px 28px rgba(15,57,105,.1)!important}
        body.kompasiAppRegistration .heroCard{padding:20px 17px!important;border-radius:18px!important}
        body.kompasiAppRegistration .heroCard h1,body.kompasiAppRegistration .heading h1,body.kompasiAppRegistration .intro h1{font-size:22px!important;line-height:1.2!important}
        body.kompasiAppRegistration .heroCard p,body.kompasiAppRegistration .heading p,body.kompasiAppRegistration .intro p{font-size:10px!important;line-height:1.5!important}
        body.kompasiAppRegistration .card,body.kompasiAppRegistration .sectionCard,body.kompasiAppRegistration .saveCard,body.kompasiAppRegistration .formSection{width:100%!important;padding:14px 12px!important;overflow:hidden!important;border:1px solid #dce6f0!important;border-radius:13px!important;background:#fff!important;box-shadow:none!important}
        body.kompasiAppRegistration .cardHeader,body.kompasiAppRegistration .sectionHeader{padding-bottom:13px!important;gap:10px!important}
        body.kompasiAppRegistration .cardHeader .icon,body.kompasiAppRegistration .sectionHeader .icon,body.kompasiAppRegistration .headingIcon{width:42px!important;height:42px!important;flex-basis:42px!important;border-radius:12px!important;font-size:20px!important}
        body.kompasiAppRegistration .cardHeader h2,body.kompasiAppRegistration .sectionHeader h2,body.kompasiAppRegistration .heading h2{font-size:15px!important}
        body.kompasiAppRegistration .cardHeader p,body.kompasiAppRegistration .sectionHeader p{font-size:9px!important}
        body.kompasiAppRegistration .grid,body.kompasiAppRegistration .formGrid,body.kompasiAppRegistration .textareaGrid,body.kompasiAppRegistration .visibilityLayout,body.kompasiAppRegistration .choiceGrid,body.kompasiAppRegistration .relationshipGrid{grid-template-columns:1fr!important;gap:11px!important}
        body.kompasiAppRegistration .qrBox,body.kompasiAppRegistration .qrSection,body.kompasiAppRegistration .infoBox,body.kompasiAppRegistration .optionalBox{margin-top:14px!important;padding:13px!important;border-radius:12px!important}
        body.kompasiAppRegistration input,body.kompasiAppRegistration select{width:100%!important;max-width:100%!important;min-height:46px!important;border-radius:10px!important;font-size:13px!important}
        body.kompasiAppRegistration textarea{width:100%!important;max-width:100%!important;min-height:90px!important;border-radius:10px!important;font-size:13px!important;resize:vertical!important}
        body.kompasiAppRegistration label{font-size:10px!important}
        body.kompasiAppRegistration .actions,body.kompasiAppRegistration .bottomBar,body.kompasiAppRegistration .finalActions{gap:8px!important}
        body.kompasiAppRegistration .actions button,body.kompasiAppRegistration .actions a,body.kompasiAppRegistration .primaryButton,body.kompasiAppRegistration .secondaryButton,body.kompasiAppRegistration .createButton{min-height:46px!important;border-radius:11px!important;font-size:11px!important}
        body.kompasiAppRegistration .actions button:last-child,body.kompasiAppRegistration .primaryButton,body.kompasiAppRegistration .createButton{border-color:#159b65!important;background:#159b65!important;color:#fff!important;box-shadow:0 7px 16px rgba(21,155,101,.2)!important}
        body.kompasiAppRegistration .progressRow{width:min(560px,100%)!important;margin-left:auto!important;margin-right:auto!important}
        body.kompasiAppMode .subscriptionsPage{padding-bottom:100px!important;background:radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%)!important;color:#173652!important}
        body.kompasiAppMode .subscriptionsPage .topbar{display:none!important}
        body.kompasiAppMode .subscriptionsPage .shell{width:min(520px,calc(100% - 20px))!important;margin:0 auto!important;padding-top:22px!important}
        body.kompasiAppMode .subscriptionsPage .intro{padding:0 4px!important;display:block!important;color:#fff!important}
        body.kompasiAppMode .subscriptionsPage .intro small{color:#bdddff!important;font-size:10px!important}
        body.kompasiAppMode .subscriptionsPage .intro h1{margin-top:6px!important;color:#fff!important;font-size:24px!important;line-height:1.2!important}
        body.kompasiAppMode .subscriptionsPage .intro p{color:#d7ecff!important;font-size:12px!important;line-height:1.5!important}
        body.kompasiAppMode .subscriptionsPage .free{width:100%!important;margin-top:13px!important;padding:12px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;border-radius:13px!important;background:linear-gradient(135deg,#075dcc,#159b65)!important}
        body.kompasiAppMode .subscriptionsPage .free b{font-size:22px!important}
        body.kompasiAppMode .subscriptionsPage .free span{margin:0!important;font-size:11px!important}
        body.kompasiAppMode .subscriptionsPage .layout{display:block!important;margin-top:12px!important;padding:11px!important;border-radius:16px!important;background:#fff!important;box-shadow:0 10px 26px rgba(23,63,109,.1)!important}
        body.kompasiAppMode .subscriptionsPage .panel{padding:2px!important}
        body.kompasiAppMode .subscriptionsPage .panel h2{font-size:15px!important}
        body.kompasiAppMode .subscriptionsPage .profiles{grid-template-columns:1fr!important}
        body.kompasiAppMode .subscriptionsPage .profile{min-height:62px!important}
        body.kompasiAppMode .subscriptionsPage .periods{display:flex!important;gap:7px!important;overflow-x:auto!important;padding:2px 1px 10px!important;scroll-snap-type:x mandatory!important}
        body.kompasiAppMode .subscriptionsPage .period{min-width:112px!important;min-height:78px!important;flex:0 0 112px!important;padding:10px 6px!important;scroll-snap-align:start!important}
        body.kompasiAppMode .subscriptionsPage .period b{font-size:13px!important}
        body.kompasiAppMode .subscriptionsPage .period span{margin-top:5px!important;font-size:21px!important}
        body.kompasiAppMode .subscriptionsPage .summary{position:static!important;margin-top:12px!important;padding:17px 14px!important;border-radius:14px!important}
        body.kompasiAppMode .subscriptionsPage .summary h2{font-size:18px!important}
        body.kompasiAppMode .subscriptionsPage .line{font-size:12px!important}
        body.kompasiAppMode .subscriptionsPage .total strong{font-size:30px!important}
        body.kompasiAppMode .subscriptionsPage .purchaseHistory{margin-top:12px!important;padding:15px 12px!important;border-radius:14px!important}
        body.kompasiAppMode .subscriptionsPage .historyHeading h2{font-size:17px!important}
        body.kompasiAppMode .subscriptionsPage .historyList article{grid-template-columns:1fr auto!important}
        body.kompasiAppMode .subscriptionsPage .appBack{width:max-content!important;margin:0 0 15px 3px!important;padding:8px 11px!important;display:block!important;border:1px solid rgba(255,255,255,.3)!important;border-radius:10px!important;background:rgba(255,255,255,.12)!important;color:#fff!important;text-decoration:none!important;font-size:11px!important;font-weight:850!important}
        body.kompasiAppMode .subscriptionsPage .layout{padding:12px!important;border:1px solid rgba(255,255,255,.7)!important;border-radius:17px!important;background:#f8fbff!important;box-shadow:0 12px 30px rgba(1,30,66,.2)!important}
        body.kompasiAppMode .subscriptionsPage .panel h2{margin:4px 0 11px!important;font-size:15px!important}
        body.kompasiAppMode .subscriptionsPage .stepNumber{width:30px!important;height:30px!important;margin-right:7px!important;border-radius:9px!important;background:#0b65d4!important;color:#fff!important}
        body.kompasiAppMode .subscriptionsPage .profile{min-height:64px!important;padding:9px!important;border-radius:11px!important}
        body.kompasiAppMode .subscriptionsPage .profile .icon{width:39px!important;height:39px!important;font-size:20px!important}
        body.kompasiAppMode .subscriptionsPage .profile b{font-size:13px!important}
        body.kompasiAppMode .subscriptionsPage .profile small{font-size:10px!important}
        body.kompasiAppMode .subscriptionsPage .periods{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;overflow:visible!important;padding:1px 0 8px!important}
        body.kompasiAppMode .subscriptionsPage .period{width:100%!important;min-width:0!important;min-height:80px!important;flex:none!important;padding:10px 6px!important}
        body.kompasiAppMode .subscriptionsPage .summary{margin-top:14px!important;background:#082f59!important}
        body.kompasiAppMode .subscriptionsPage .summary>small{color:#89c2ff!important;font-size:10px!important}
        body.kompasiAppMode .subscriptionsPage .purchaseHistory{border:0!important;background:#fff!important;box-shadow:0 10px 24px rgba(1,30,66,.16)!important}
        body.kompasiAppMode .subscriptionsPage .historyHeading>span{font-size:9px!important}
        body.kompasiAppMode .subscriptionsPage .historyList article{padding:11px!important;border-radius:10px!important}
        body.kompasiAppMode .subscriptionsPage .prices{display:none!important}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps{margin:16px 0 12px;padding:5px;display:grid!important;grid-template-columns:repeat(3,1fr);gap:5px;border:1px solid rgba(255,255,255,.26);border-radius:15px;background:rgba(4,40,82,.34);box-shadow:inset 0 1px 0 rgba(255,255,255,.14);backdrop-filter:blur(12px)}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button{min-width:0;min-height:52px;padding:6px 3px;display:flex;align-items:center;justify-content:center;gap:6px;border:0;border-radius:11px;background:transparent;color:#cfe6ff;font-family:inherit;cursor:pointer}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button span{width:22px;height:22px;display:grid;place-items:center;flex:0 0 22px;border:1px solid rgba(255,255,255,.35);border-radius:50%;font-size:10px;font-weight:950}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button b{overflow:hidden;font-size:10px;text-overflow:ellipsis;white-space:nowrap}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button.active{background:#fff;color:#174f9c;box-shadow:0 6px 16px rgba(0,24,58,.2)}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button.active span{border-color:#7157d9;background:#7157d9;color:#fff}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button.done{color:#fff}
        body.kompasiAppMode .subscriptionsPage .appCheckoutSteps button.done span{border-color:#12a66a;background:#12a66a;color:#fff}
        body.kompasiAppMode .subscriptionsPage[data-app-step="1"] .periodStage,body.kompasiAppMode .subscriptionsPage[data-app-step="1"] .summaryStage,body.kompasiAppMode .subscriptionsPage[data-app-step="2"] .profileStage,body.kompasiAppMode .subscriptionsPage[data-app-step="2"] .summaryStage,body.kompasiAppMode .subscriptionsPage[data-app-step="3"] .panel,body.kompasiAppMode .subscriptionsPage[data-app-step="3"] .profileStage,body.kompasiAppMode .subscriptionsPage[data-app-step="3"] .periodStage{display:none!important}
        body.kompasiAppMode .subscriptionsPage[data-app-step="3"] .layout{padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important}
        body.kompasiAppMode .subscriptionsPage[data-app-step="3"] .summaryStage{display:block!important;margin-top:0!important}
        body.kompasiAppMode .subscriptionsPage[data-app-step="1"] .purchaseHistory,body.kompasiAppMode .subscriptionsPage[data-app-step="2"] .purchaseHistory{display:none!important}
        body.kompasiAppMode .subscriptionsPage .appNext,body.kompasiAppMode .subscriptionsPage .appPrevious{min-height:47px;padding:0 15px;border:0;border-radius:12px;font-family:inherit;font-size:12px;font-weight:900;cursor:pointer}
        body.kompasiAppMode .subscriptionsPage .appNext,body.kompasiAppMode .subscriptionsPage .summaryPrevious{display:block!important}
        body.kompasiAppMode .subscriptionsPage .appNext{width:100%;margin-top:15px;background:linear-gradient(135deg,#7157d9,#6547c7)!important;color:#fff!important;box-shadow:0 8px 18px rgba(87,62,180,.24)}
        body.kompasiAppMode .subscriptionsPage .appNext:disabled{opacity:.45;box-shadow:none}
        body.kompasiAppMode .subscriptionsPage .appStageActions{margin-top:15px;display:grid;grid-template-columns:.75fr 1.25fr;gap:8px}
        body.kompasiAppMode .subscriptionsPage .appStageActions .appNext{margin-top:0}
        body.kompasiAppMode .subscriptionsPage .appPrevious{border:1px solid #d5e2ef;background:#fff;color:#4d657d}
        body.kompasiAppMode .subscriptionsPage .summaryPrevious{width:100%;margin-top:8px!important;border:1px solid rgba(255,255,255,.25)!important;background:rgba(255,255,255,.09)!important;color:#fff!important;box-shadow:none!important}
        body.kompasiAppMode .subscriptionsPage{background:radial-gradient(circle at 15% 4%,rgba(83,185,255,.48),transparent 28%),radial-gradient(circle at 92% 22%,rgba(104,73,223,.28),transparent 31%),linear-gradient(160deg,#0b579b 0%,#073f78 48%,#052d59 100%)!important}
        body.kompasiAppMode .subscriptionsPage .appBack{border-color:rgba(255,255,255,.38)!important;background:rgba(255,255,255,.14)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.18)!important;backdrop-filter:blur(12px)!important}
        body.kompasiAppMode .subscriptionsPage .free{border:1px solid rgba(255,255,255,.28)!important;background:linear-gradient(120deg,#0b74e5,#13a66b)!important;box-shadow:0 10px 24px rgba(4,49,102,.24),inset 0 1px 0 rgba(255,255,255,.22)!important}
        body.kompasiAppMode .subscriptionsPage .layout{border-color:rgba(255,255,255,.88)!important;background:linear-gradient(155deg,rgba(255,255,255,.98),rgba(241,247,255,.96))!important;box-shadow:0 18px 44px rgba(1,24,58,.28),inset 0 1px 0 #fff!important}
        body.kompasiAppMode .subscriptionsPage .profile{border-color:#d8e6f2!important;background:#fff!important;box-shadow:0 5px 14px rgba(19,63,109,.06)!important}
        body.kompasiAppMode .subscriptionsPage .profile.selected{border:2px solid #10a369!important;background:linear-gradient(135deg,#edfff6,#f8fffc)!important;box-shadow:0 7px 18px rgba(16,163,105,.15)!important}
        body.kompasiAppMode .subscriptionsPage .profile.selected .icon{background:#dff8eb!important}
        body.kompasiAppMode .subscriptionsPage .profile.selected i{background:#10a369!important}
        body.kompasiAppMode .subscriptionsPage .period{border-color:#d5e2ef!important;background:#fff!important;box-shadow:0 5px 14px rgba(19,63,109,.05)!important}
        body.kompasiAppMode .subscriptionsPage .period.active{border:0!important;background:linear-gradient(145deg,#176ee5,#644fdc)!important;color:#fff!important;box-shadow:0 9px 22px rgba(63,80,207,.28)!important}
        body.kompasiAppMode .subscriptionsPage .period.active span{color:#fff!important}
        body.kompasiAppMode .subscriptionsPage .period em{background:#12a66a!important;box-shadow:0 4px 10px rgba(18,166,106,.25)!important}
        body.kompasiAppMode .subscriptionsPage .summary{border:1px solid rgba(117,181,255,.2)!important;background:radial-gradient(circle at 90% 0,rgba(67,143,232,.3),transparent 38%),linear-gradient(145deg,#092f59,#071f3e)!important;box-shadow:0 13px 28px rgba(3,27,59,.25)!important}
        body.kompasiAppMode .subscriptionsPage .total{border:1px solid #dceaff!important;background:linear-gradient(135deg,#fff,#eef6ff)!important;box-shadow:0 7px 18px rgba(0,32,77,.14)!important}
        body.kompasiAppMode .subscriptionsPage .summary button{background:linear-gradient(90deg,#f8fbff,#dfeeff)!important;color:#0753b8!important;box-shadow:0 8px 18px rgba(0,18,45,.2)!important}
        body.kompasiAppMode .subscriptionsPage .purchaseHistory{background:linear-gradient(155deg,#fff,#f4f8fd)!important;box-shadow:0 14px 32px rgba(1,30,66,.22)!important}
        body.kompasiAppMode .subscriptionsPage .historyHeading>span{background:#e8f2ff!important;color:#075dcc!important}
        body.kompasiAppMode .subscriptionsPage .historyList article{border-color:#dce8f3!important;background:rgba(255,255,255,.86)!important}
        body.kompasiAppMode .subscriptionsPage .free b{font-size:27px!important;line-height:1!important}
        body.kompasiAppMode .subscriptionsPage .free span{font-size:14px!important;font-weight:850!important;letter-spacing:.15px!important}
        body.kompasiAppMode .subscriptionsPage .panel h2:not(:first-child){margin:22px 0 12px!important;padding:11px 12px!important;border:1px solid #d5e5f4!important;border-radius:12px!important;background:linear-gradient(100deg,#e8f3ff,#f3efff)!important;color:#173652!important;box-shadow:0 5px 14px rgba(23,63,109,.07)!important}
        body.kompasiAppMode .subscriptionsPage .period:nth-child(n){border-color:#d7c9f3!important;background:linear-gradient(145deg,#f0eaff,#fcfaff)!important}
        body.kompasiAppMode .subscriptionsPage .period:nth-child(n) span{color:#6847c6!important}
        body.kompasiAppMode .subscriptionsPage .period.active{border:0!important;background:linear-gradient(135deg,#6750dc 0%,#087fcc 48%,#09a878 100%)!important;color:#fff!important;box-shadow:0 10px 24px rgba(54,79,196,.34),inset 0 1px 0 rgba(255,255,255,.25)!important}
        body.kompasiAppMode .subscriptionsPage .period.active span{color:#fff!important}
        body.kompasiAppMode .subscriptionsPage .summary{border:1px solid rgba(129,238,219,.25)!important;background:radial-gradient(circle at 92% 5%,rgba(25,210,177,.3),transparent 35%),linear-gradient(145deg,#322267 0%,#183f72 52%,#075f65 100%)!important;box-shadow:0 16px 34px rgba(27,20,81,.32),inset 0 1px 0 rgba(255,255,255,.14)!important}
        body.kompasiAppMode .subscriptionsPage .summary>small{color:#9af1df!important}
        body.kompasiAppMode .subscriptionsPage .chosen{background:rgba(255,255,255,.1)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)!important}
        body.kompasiAppMode .subscriptionsPage .total{border:1px solid rgba(255,255,255,.75)!important;background:linear-gradient(135deg,#fff9e9,#e9fff8 52%,#e8f0ff)!important;box-shadow:0 9px 22px rgba(10,20,70,.22)!important}
        body.kompasiAppMode .subscriptionsPage .total strong{background:linear-gradient(90deg,#6645cf,#087bc8,#078b62)!important;background-clip:text!important;-webkit-background-clip:text!important;color:transparent!important}
        body.kompasiAppMode .subscriptionsPage .summary button{background:linear-gradient(90deg,#fff2c7,#d9fff2)!important;color:#214267!important;box-shadow:0 9px 20px rgba(7,21,66,.25)!important}
        @media(max-width:600px){body.kompasiAppRegistration .actions,body.kompasiAppRegistration .finalActions{display:grid!important;grid-template-columns:1fr!important}body.kompasiAppRegistration .choice{min-height:74px!important;padding:12px!important}}
        .appDock{position:fixed;left:50%;bottom:calc(9px + env(safe-area-inset-bottom,0px));z-index:990;width:min(472px,calc(100% - 18px));height:68px;padding:6px 9px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:center;overflow:visible;border:1px solid rgba(205,228,250,.9);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.97),rgba(235,245,255,.94));box-shadow:0 16px 42px rgba(1,25,62,.32),0 3px 10px rgba(0,50,110,.12),inset 0 1px 0 #fff;backdrop-filter:blur(24px) saturate(155%);transform:translate3d(-50%,0,0);will-change:transform;contain:layout paint;isolation:isolate}
        .appDock a{position:relative;min-width:0;height:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border-radius:14px;color:#657d94;text-decoration:none;transition:none;transform:none}.navIcon{width:23px;height:23px;display:grid;place-items:center}.navIcon svg{width:23px;height:23px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.appDock a small{max-width:100%;overflow:hidden;font-size:10px;font-weight:900;letter-spacing:.02px;text-overflow:ellipsis;white-space:nowrap}.appDock a.active{background:#eaf3ff;color:#075dce}.appDock a.active::after{content:"";position:absolute;bottom:2px;width:20px;height:3px;border-radius:999px;background:linear-gradient(90deg,#0b72ed,#11a66d)}.appDock a.primary{width:58px;height:58px;margin:-7px auto 0;border:2px solid rgba(255,255,255,.92);border-radius:18px;background:linear-gradient(145deg,#0b79ef 0%,#3158d8 54%,#6b47df 100%);color:#fff;box-shadow:0 10px 24px rgba(32,87,210,.38),inset 0 1px 0 rgba(255,255,255,.28)}.appDock a.primary .navIcon{width:24px;height:24px}.appDock a.primary .navIcon svg{width:24px;height:24px}.appDock a.primary small{color:#fff;font-size:9px}.appDock a.primary.active{background:linear-gradient(145deg,#0b79ef,#3158d8 54%,#6b47df)}.appDock a.primary::after{display:none}.offlinePill{position:fixed;left:50%;top:max(10px,env(safe-area-inset-top));z-index:1100;padding:8px 13px;border:1px solid #f5d08c;border-radius:999px;background:#fff7e6;color:#925d06;box-shadow:0 9px 25px rgba(60,35,0,.16);font:800 11px/1.2 Arial,sans-serif;transform:translateX(-50%)}
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
