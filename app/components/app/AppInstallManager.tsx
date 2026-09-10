"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function AppInstallManager() {
  const pathname = usePathname();
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  const ownerArea = pathname === "/my-profiles" || pathname.startsWith("/account") || pathname.startsWith("/profile/");
  if (!ownerArea || !visible || !promptEvent) return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
      setPromptEvent(null);
    }
  }

  return (
    <aside className="installCard" aria-label="KOMPASI აპის დაყენება">
      <span className="installIcon">K</span>
      <span className="installCopy"><strong>KOMPASI აპი</strong><small>დააყენეთ ტელეფონში სწრაფი წვდომისთვის</small></span>
      <button type="button" onClick={() => void install()}>დაყენება</button>
      <button type="button" className="dismiss" onClick={() => setVisible(false)} aria-label="დახურვა">×</button>
      <style jsx>{`
        .installCard{position:fixed;right:14px;bottom:max(12px,env(safe-area-inset-bottom));z-index:1000;max-width:390px;padding:9px 10px;display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.78);border-radius:15px;background:rgba(251,253,255,.96);box-shadow:0 14px 38px rgba(0,25,70,.23);font-family:Arial,sans-serif;color:#17324f;backdrop-filter:blur(18px)}
        .installIcon{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border-radius:11px;background:linear-gradient(145deg,#0b72ed,#3c55d5 62%,#6549df);color:#fff;font-size:16px;font-weight:950;box-shadow:0 6px 15px rgba(34,87,208,.24)}.installCopy{min-width:0;flex:1}.installCopy strong,.installCopy small{display:block}.installCopy strong{font-size:13px}.installCopy small{margin-top:2px;color:#60758b;font-size:10px;line-height:1.3}.installCard>button:not(.dismiss){min-height:34px;padding:0 11px;border:0;border-radius:9px;background:#0b62df;color:#fff;font-size:11px;font-weight:900;cursor:pointer}.dismiss{width:24px;height:24px;padding:0;border:0;background:transparent;color:#8291a0;font-size:19px;cursor:pointer}
        @media(max-width:560px){.installCard{left:9px;right:9px;bottom:max(9px,env(safe-area-inset-bottom))}.installCopy small{font-size:9px}}
      `}</style>
    </aside>
  );
}
