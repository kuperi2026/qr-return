"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Item = {
  id: string;
  tag_code: string | null;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  lost: boolean | null;
};

type Lang = "ka" | "en";

const productIcon = (item: Item) => {
  const type = item.item_type || item.pet_type || "";
  if (type === "dog") return "🐕";
  if (type === "cat") return "🐈";
  if (type === "keys") return "🔑";
  if (type === "wallet") return "👛";
  if (type === "bag") return "👜";
  if (type === "suitcase") return "🧳";
  if (type === "parking") return "🚘";
  if (type.includes("emergency")) return "✚";
  return "⌁";
};

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [lang, setLang] = useState<Lang>("ka");
  const [firstName, setFirstName] = useState("");
  const [now, setNow] = useState(() => new Date());

  const ka = lang === "ka";

  const changeLanguage = (next: Lang) => {
    setLang(next);
    window.localStorage.setItem("kompasi-language", next);
  };

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);
    const savedLanguage = window.localStorage.getItem("kompasi-language");
    if (savedLanguage === "ka" || savedLanguage === "en") setLang(savedLanguage);

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/app"); return; }
      setFirstName(String(user.user_metadata?.first_name || ""));
      const { data } = await supabase
        .from("item")
        .select("id,tag_code,item_name,item_type,pet_type,lost")
        .eq("owner_id", user.id);
      setItems((data || []) as Item[]);
    })();

    const clock = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(clock);
  }, [router]);

  const dateLabel = new Intl.DateTimeFormat(ka ? "ka-GE" : "en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const timeLabel = new Intl.DateTimeFormat(ka ? "ka-GE" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);

  return (
    <main className="contactHome">
      <div className="homeWrap">
        <header className="homeHeader">
          <div className="userWelcome">
            <span className="userAvatar">{firstName ? firstName.charAt(0).toUpperCase() : "K"}</span>
            <span><small>{dateLabel} · {timeLabel}</small><b>{ka ? "გამარჯობა" : "Hello"}{firstName ? `, ${firstName}` : ""}</b></span>
          </div>
          <div className="headerTools">
            <div className="languageSwitch" aria-label="Language">
              <button type="button" className={ka ? "active" : ""} onClick={() => changeLanguage("ka")}>ქარ</button>
              <button type="button" className={!ka ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button>
            </div>
            <Link href="/account/notifications" className="notificationButton" aria-label={ka ? "სიახლეები" : "Notifications"}>
              <svg viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>
            </Link>
          </div>
        </header>

        <section className="contactHero">
          <div className="returnSignal" aria-hidden="true">
            <span className="signalRing ringOne" />
            <span className="signalRing ringTwo" />
            <svg className="returnPath" viewBox="0 0 120 120" fill="none"><path d="M20 80C34 102 74 101 88 76C99 57 88 32 67 28"/><path d="m68 21-8 8 10 5"/></svg>
            <span className="signalNode nodeOne" /><span className="signalNode nodeTwo" /><span className="signalNode nodeThree" />
            <span className="signalTag"><i /><svg viewBox="0 0 34 34"><path d="M3 3h10v10H3zm3 3v4h4V6zM21 3h10v10H21zm3 3v4h4V6zM3 21h10v10H3zm3 3v4h4v-4z" fillRule="evenodd"/><path d="M16 3h3v8h-3zm0 11h8v4h-8zm11 2h4v6h-4zm-11 5h4v5h-4zm7 2h4v4h-4zm-7 6h11v3H16zm13-4h3v7h-3z"/></svg></span>
            <b>K</b>
          </div>
          <span className="online"><i /> ONLINE · 24/7</span>
          <h1>{ka ? "ყოველთვის კავშირზე" : "Always connected"}</h1>
          <p>{ka ? "დახმარება, დაცული ჩათი და Lost Mode — სწრაფად, ერთ სივრცეში." : "Support, secure chat and Lost Mode — quickly, in one place."}</p>
          <Link href="/support?source=app" className="contactButton">
            <span className="contactIcon">?</span>
            <span><b>{ka ? "24/7 კონტაქტი" : "24/7 contact"}</b><small>{ka ? "KOMPASI დახმარებასთან დაკავშირება" : "Contact KOMPASI support"}</small></span>
            <em>›</em>
          </Link>
        </section>

        <section className="mainActions">
          <Link href="/app/chat" className="chatAction">
            <i>◌</i>
            <span><b>{ka ? "ჩათი" : "Chat"}</b><small>{ka ? "ახალი და მიმდინარე საუბრები" : "New and active conversations"}</small></span>
            <em>›</em>
          </Link>
          <button type="button" className="lostAction" onClick={() => setShowProducts((current) => !current)}>
            <i>!</i>
            <span><b>Lost Mode</b><small>{ka ? "აირჩიეთ დაკარგული პროდუქტი" : "Choose a missing product"}</small></span>
            <em>{showProducts ? "⌃" : "⌄"}</em>
          </button>
        </section>

        {showProducts && (
          <section className="productList">
            <header><div><small>MY PRODUCTS</small><h2>{ka ? "აირჩიეთ პროდუქტი" : "Choose a product"}</h2></div><button type="button" onClick={() => setShowProducts(false)}>×</button></header>
            {items.length ? items.map((item) => (
              <Link key={item.id} href={`/app/product/${item.tag_code}?panel=lost`}>
                <span className="productIcon">{productIcon(item)}</span>
                <div><b>{item.item_name || (ka ? "QR პროფილი" : "QR profile")}</b><small>QR {item.tag_code || "—"}</small></div>
                <em className={item.lost ? "on" : "off"}>{item.lost ? "ON" : "OFF"}</em>
              </Link>
            )) : (
              <div className="emptyProducts"><span>⌁</span><b>{ka ? "პროდუქტი ჯერ არ არის" : "No products yet"}</b><Link href="/app/add">{ka ? "პროფილის რეგისტრაცია" : "Register a profile"}</Link></div>
            )}
          </section>
        )}
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}.contactHome{min-height:100vh;background:radial-gradient(circle at 92% 0%,rgba(13,181,139,.2),transparent 25%),radial-gradient(circle at 5% 5%,rgba(36,124,245,.35),transparent 32%),linear-gradient(180deg,#05182d 0%,#082e50 52%,#061f38 100%);color:#fff;font-family:"Noto Sans Georgian",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.homeWrap{width:min(520px,100%);margin:auto;padding:0 14px 108px}.homeHeader{min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:10px}.userWelcome{min-width:0;display:flex;align-items:center;gap:10px}.userAvatar{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border:1px solid rgba(255,255,255,.3);border-radius:50%;background:linear-gradient(145deg,#2b8fe8,#0aa57a);color:#fff;font-size:16px;font-weight:950;box-shadow:0 8px 20px rgba(0,17,37,.28)}.userWelcome>span:last-child{min-width:0}.userWelcome small,.userWelcome b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.userWelcome small{color:#aac7dd;font-size:8px;text-transform:capitalize}.userWelcome b{margin-top:3px;font-size:15px}.headerTools{display:flex;align-items:center;gap:7px}.languageSwitch{padding:3px;display:flex;border:1px solid rgba(255,255,255,.22);border-radius:11px;background:rgba(255,255,255,.08)}.languageSwitch button{height:29px;padding:0 7px;border:0;border-radius:8px;background:transparent;color:#9fbed5;font-family:inherit;font-size:8px;font-weight:950;cursor:pointer}.languageSwitch button.active{background:#fff;color:#075a9d;box-shadow:0 4px 10px rgba(0,18,38,.18)}.notificationButton{position:relative;width:41px;height:41px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.28);border-radius:13px;background:linear-gradient(145deg,rgba(255,255,255,.19),rgba(255,255,255,.08));color:#fff;text-decoration:none;backdrop-filter:blur(12px);box-shadow:0 8px 18px rgba(0,18,38,.2)}.notificationButton svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
        .contactHero{position:relative;overflow:hidden;padding:24px 19px 19px;border:1px solid rgba(133,205,255,.28);border-radius:25px;background:linear-gradient(145deg,rgba(13,79,139,.96),rgba(5,36,70,.98) 58%,rgba(5,103,81,.93));box-shadow:0 27px 60px rgba(0,12,29,.4),inset 0 1px 0 rgba(255,255,255,.18)}.contactHero:after{content:"";position:absolute;right:-70px;top:-92px;width:185px;height:185px;border:29px solid rgba(255,255,255,.055);border-radius:50%}.returnSignal{position:absolute;z-index:0;right:9px;top:7px;width:126px;height:126px;opacity:.92}.signalRing{position:absolute;left:50%;top:50%;border:1px solid rgba(158,230,214,.22);border-radius:50%;transform:translate(-50%,-50%)}.ringOne{width:112px;height:112px}.ringTwo{width:86px;height:86px;border-style:dashed}.returnPath{position:absolute;inset:3px;width:120px;height:120px}.returnPath path{stroke:rgba(181,241,226,.5);stroke-width:1.35;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:3 5}.signalNode{position:absolute;width:7px;height:7px;border:2px solid rgba(255,255,255,.75);border-radius:50%;background:#2adea5;box-shadow:0 0 0 4px rgba(42,222,165,.09)}.nodeOne{left:10px;bottom:34px}.nodeTwo{right:16px;top:25px;background:#5db2ff}.nodeThree{right:8px;bottom:29px;width:5px;height:5px;background:#ffd66c}.signalTag{position:absolute;left:50%;top:50%;width:50px;height:59px;display:grid;place-items:center;border:4px solid rgba(255,255,255,.86);border-radius:14px;background:linear-gradient(145deg,#1687e4,#0bab83);box-shadow:0 13px 25px rgba(0,20,42,.26);transform:translate(-50%,-50%) rotate(5deg)}.signalTag:after{content:"";position:absolute;right:-7px;top:21px;width:7px;height:14px;border-radius:0 7px 7px 0;background:rgba(255,255,255,.9)}.signalTag i{position:absolute;top:4px;width:6px;height:6px;border:1.5px solid #fff;border-radius:50%}.signalTag svg{width:29px;height:29px;margin-top:7px;fill:#fff;transform:rotate(-5deg)}.returnSignal>b{position:absolute;right:6px;bottom:2px;width:22px;height:22px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.38);border-radius:50%;background:rgba(5,35,65,.72);color:#a9f2dc;font-size:9px;box-shadow:0 5px 12px rgba(0,12,27,.22)}.online{position:relative;z-index:1;display:inline-flex;align-items:center;gap:7px;color:#a8f0d7;font-size:8px;font-weight:950;letter-spacing:1.1px}.online i{width:7px;height:7px;border-radius:50%;background:#25d99d;box-shadow:0 0 0 5px rgba(37,217,157,.13)}.contactHero h1{position:relative;z-index:1;max-width:245px;margin:15px 0 0;font-size:27px;letter-spacing:-.5px}.contactHero>p{position:relative;z-index:1;max-width:270px;margin:7px 0 0;color:#d2e7f5;font-size:11px;line-height:1.55}.contactButton{position:relative;z-index:1;min-height:67px;margin-top:21px;padding:10px 12px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.28);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.1));color:#fff;text-decoration:none;box-shadow:0 12px 29px rgba(0,18,39,.22);backdrop-filter:blur(12px)}.contactIcon{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:13px;background:linear-gradient(145deg,#1682ee,#0bb084);font-size:20px;font-weight:950;box-shadow:0 8px 18px rgba(0,30,58,.3)}.contactButton>span:nth-child(2){min-width:0;flex:1}.contactButton b,.contactButton small{display:block}.contactButton b{font-size:13px}.contactButton small{margin-top:4px;color:#cce3ef;font-size:9px}.contactButton em{font-size:23px;font-style:normal}
        .mainActions{margin-top:12px;display:grid;gap:9px}.mainActions>a,.mainActions>button{width:100%;min-height:78px;padding:12px 13px;display:flex;align-items:center;gap:11px;border:1px solid rgba(255,255,255,.17);border-radius:19px;color:#fff;text-align:left;text-decoration:none;font-family:inherit;box-shadow:0 15px 32px rgba(0,14,31,.25);cursor:pointer}.mainActions i{width:45px;height:45px;display:grid;place-items:center;flex:0 0 45px;border-radius:14px;background:rgba(255,255,255,.16);font-size:20px;font-style:normal;font-weight:950;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.mainActions span{min-width:0;flex:1}.mainActions b,.mainActions small{display:block}.mainActions b{font-size:14px}.mainActions small{margin-top:4px;color:rgba(255,255,255,.79);font-size:9px}.mainActions em{font-size:20px;font-style:normal}.chatAction{background:linear-gradient(145deg,#075fbd,#0b8da6)}.lostAction{background:linear-gradient(145deg,#922c42,#d04b58)}
        .productList{margin-top:10px;padding:14px;border:1px solid rgba(171,211,239,.42);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(241,248,252,.97));color:#123650;box-shadow:0 20px 45px rgba(0,15,32,.32)}.productList>header{display:flex;align-items:center;justify-content:space-between;padding:1px 1px 6px}.productList header small{color:#0a8f66;font-size:8px;font-weight:950;letter-spacing:1px}.productList h2{margin:3px 0 0;font-size:17px}.productList header button{width:32px;height:32px;border:0;border-radius:10px;background:#e9f1f6;color:#49677d;font-size:20px}.productList>a{margin-top:7px;padding:9px 10px;display:flex;align-items:center;gap:10px;border:1px solid #d8e5ed;border-radius:14px;background:#fff;color:#123650;text-decoration:none;box-shadow:0 6px 16px rgba(5,48,84,.06)}.productIcon{width:40px;height:40px;display:grid;place-items:center;flex:0 0 40px;border-radius:12px;background:linear-gradient(145deg,#e8f4fc,#f5fbff);font-size:19px}.productList>a>div{min-width:0;flex:1}.productList a b,.productList a small{display:block}.productList a b{overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.productList a small{margin-top:4px;color:#71879a;font-size:8px}.productList em{min-width:38px;padding:6px 8px;border-radius:9px;text-align:center;font-size:8px;font-style:normal;font-weight:950}.productList em.on{background:#ffe6e9;color:#b62f3c}.productList em.off{background:#e4f8ee;color:#078154}.emptyProducts{padding:25px 10px 15px;display:grid;justify-items:center;gap:7px;color:#6d8395;text-align:center}.emptyProducts>span{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;background:#e8f3fa;color:#0a6ab5;font-size:22px}.emptyProducts b{font-size:11px}.emptyProducts a{padding:8px 11px;border-radius:9px;background:#0a75d5;color:#fff;text-decoration:none;font-size:9px;font-weight:900}
        @media(max-width:400px){.returnSignal{right:5px;top:7px;transform:scale(.82);transform-origin:top right}.contactHero h1{max-width:205px;font-size:24px}.contactHero>p{max-width:215px}}
      `}</style>
    </main>
  );
}
