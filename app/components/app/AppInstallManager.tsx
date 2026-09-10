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
        .installCard{position:fixed;right:18px;bottom:max(18px,env(safe-area-inset-bottom));z-index:1000;max-width:420px;padding:12px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.72);border-radius:17px;background:rgba(255,255,255,.97);box-shadow:0 18px 50px rgba(0,25,70,.28);font-family:Arial,sans-serif;color:#17324f;backdrop-filter:blur(14px)}
        .installIcon{width:44px;height:44px;display:grid;place-items:center;flex:0 0 44px;border-radius:13px;background:linear-gradient(135deg,#075ee5,#7048e8);color:#fff;font-size:20px;font-weight:950}.installCopy{min-width:0;flex:1}.installCopy strong,.installCopy small{display:block}.installCopy strong{font-size:14px}.installCopy small{margin-top:3px;color:#60758b;font-size:11px;line-height:1.3}.installCard>button:not(.dismiss){min-height:39px;padding:0 12px;border:0;border-radius:10px;background:#0b62df;color:#fff;font-size:12px;font-weight:900;cursor:pointer}.dismiss{width:28px;height:28px;padding:0;border:0;background:transparent;color:#75869a;font-size:22px;cursor:pointer}
        @media(max-width:560px){.installCard{left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom))}.installCopy small{font-size:10px}}
      `}</style>
    </aside>
  );
}
