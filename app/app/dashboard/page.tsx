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

type Activity = {
  id: string;
  title: string;
  message: string | null;
  type: string;
  read: boolean;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [showLostProfiles, setShowLostProfiles] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/app"); return; }

      const [{ data: profiles }, { data: notifications }] = await Promise.all([
        supabase.from("item").select("id,tag_code,item_name,item_type,pet_type,lost").eq("owner_id", user.id),
        supabase.from("notifications").select("id,title,message,type,read,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
      ]);

      setItems((profiles || []) as Item[]);
      setActivity((notifications || []) as Activity[]);
    })();
  }, [router]);

  const lostItems = items.filter((item) => item.lost);
  const hasAttention = lostItems.length > 0 || activity.some((item) => !item.read);

  return (
    <main className="premiumHome">
      <div className="homeWrap">
        <header className="homeHeader">
          <Link href="/app/dashboard" className="brand">
            <img src="/app-icons/app-icon.svg" alt="" />
            <span><b>KOMPASI</b><small>SMART LOST &amp; FOUND</small></span>
          </Link>
          <Link href="/account/notifications" className="notificationButton" aria-label="სიახლეები">♢</Link>
        </header>

        <section className={`statusHero ${hasAttention ? "attention" : "safe"}`}>
          <div className="statusTop">
            <span className="statusIcon">{hasAttention ? "!" : "✓"}</span>
            <small>{hasAttention ? "ATTENTION NEEDED" : "PROTECTED STATUS"}</small>
          </div>
          <h1>{hasAttention ? "არის სანახავი აქტივობა" : "ყველაფერი დაცულია"}</h1>
          <p>{lostItems.length ? `${lostItems.length} პროფილზე Lost Mode ჩართულია.` : "აქტიური Lost Mode არ არის და თქვენი QR სივრცე მზადაა."}</p>
          <div className="statusLine"><span /> ბოლო შემოწმება · ახლა</div>
        </section>

        <section className="quickActions" aria-label="სწრაფი მოქმედებები">
          <button type="button" className="lostAction" onClick={() => setShowLostProfiles((current) => !current)}>
            <i>!</i><span><b>Lost Mode</b><small>პროფილის დაკარგულად მონიშვნა</small></span><em>{showLostProfiles ? "⌃" : "⌄"}</em>
          </button>
          <Link href="/support?source=app" className="supportAction">
            <i>?</i><span><b>KOMPASI დახმარება</b><small>მოგვწერეთ პირდაპირ</small></span><em>›</em>
          </Link>
        </section>

        {showLostProfiles && (
          <section className="profileChooser">
            <header><div><small>აირჩიეთ პროფილი</small><h2>Lost Mode მართვა</h2></div><button type="button" onClick={() => setShowLostProfiles(false)}>×</button></header>
            {items.length ? items.map((item) => (
              <Link key={item.id} href={`/app/product/${item.tag_code}?panel=lost`}>
                <span>{item.pet_type === "dog" ? "🐕" : item.pet_type === "cat" ? "🐈" : "⌁"}</span>
                <div><b>{item.item_name || "QR პროფილი"}</b><small>{item.lost ? "Lost Mode ჩართულია" : "Lost Mode გამორთულია"}</small></div>
                <em className={item.lost ? "on" : "off"}>{item.lost ? "ON" : "OFF"}</em>
              </Link>
            )) : <p>ჯერ რეგისტრირებული პროფილი არ გაქვთ.</p>}
          </section>
        )}

        <section className="important">
          <div className="sectionTitle"><div><small>LIVE OVERVIEW</small><h2>ახლა მნიშვნელოვანი</h2></div><Link href="/account/notifications">ყველა სიახლე ›</Link></div>

          {activity.length ? (
            <div className="activityList">
              {activity.map((item) => (
                <Link href="/account/notifications" key={item.id} className={`activityItem type-${item.type} ${item.read ? "" : "unread"}`}>
                  <span className="activityIcon">{item.type === "chat" ? "◌" : item.type === "location" ? "⌖" : item.type === "scan" ? "⌁" : item.type === "order" ? "▣" : "✦"}</span>
                  <div><b>{item.title}</b><small>{item.message || "დეტალების სანახავად გახსენით სიახლეები."}</small></div>
                  {!item.read && <i>NEW</i>}
                </Link>
              ))}
            </div>
          ) : (
            <div className="allClear"><span>✓</span><div><b>ყველაფერი წესრიგშია</b><small>ახალი სკანი, შეტყობინება ან გაფრთხილება არ არის.</small></div></div>
          )}
        </section>
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}.premiumHome{min-height:100vh;background:radial-gradient(circle at 92% 0%,rgba(11,170,129,.2),transparent 25%),radial-gradient(circle at 5% 4%,rgba(31,117,231,.34),transparent 30%),linear-gradient(180deg,#061a31 0,#0a355c 330px,#eef5f9 330px);color:#fff;font-family:"Noto Sans Georgian",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.homeWrap{width:min(520px,100%);margin:auto;padding:0 14px 108px}.homeHeader{height:70px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand img{width:39px;height:39px;border-radius:12px;box-shadow:0 8px 20px rgba(0,16,35,.3)}.brand b,.brand small{display:block}.brand b{font-size:15px;letter-spacing:1px}.brand small{margin-top:2px;color:#a9c8e1;font-size:7px;letter-spacing:1px}.notificationButton{width:40px;height:40px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.25);border-radius:13px;background:rgba(255,255,255,.11);color:#fff;text-decoration:none;font-size:20px;backdrop-filter:blur(10px)}
        .statusHero{position:relative;overflow:hidden;padding:22px 19px 18px;border:1px solid rgba(255,255,255,.23);border-radius:23px;box-shadow:0 24px 55px rgba(0,16,36,.34),inset 0 1px 0 rgba(255,255,255,.17)}.statusHero.safe{background:linear-gradient(145deg,#0c5792,#07345f 58%,#08765b)}.statusHero.attention{background:linear-gradient(145deg,#8f331f,#50203a 58%,#1a3155)}.statusHero:after{content:"";position:absolute;width:180px;height:180px;right:-70px;top:-95px;border:28px solid rgba(255,255,255,.06);border-radius:50%}.statusTop{position:relative;z-index:1;display:flex;align-items:center;gap:9px}.statusIcon{width:31px;height:31px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.17);font-size:15px;font-weight:950}.statusTop small{color:#bfe8db;font-size:8px;font-weight:900;letter-spacing:1.25px}.statusHero h1{position:relative;z-index:1;margin:15px 0 0;font-size:25px;letter-spacing:-.4px}.statusHero p{position:relative;z-index:1;margin:7px 0 0;color:#d4e8f6;font-size:11px;line-height:1.55}.statusLine{position:relative;z-index:1;margin-top:17px;display:flex;align-items:center;gap:6px;color:#b9d3e6;font-size:8px}.statusLine span{width:7px;height:7px;border-radius:50%;background:#27d59d;box-shadow:0 0 0 4px rgba(39,213,157,.13)}
        .quickActions{margin-top:11px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.quickActions>a,.quickActions>button{min-width:0;min-height:76px;padding:11px;display:flex;align-items:center;gap:9px;border:0;border-radius:17px;color:#fff;text-align:left;text-decoration:none;font-family:inherit;box-shadow:0 12px 28px rgba(3,28,54,.18);cursor:pointer}.quickActions i{width:39px;height:39px;display:grid;place-items:center;flex:0 0 39px;border-radius:12px;background:rgba(255,255,255,.18);font-size:18px;font-style:normal;font-weight:950}.quickActions span{min-width:0;flex:1}.quickActions b,.quickActions small{display:block}.quickActions b{font-size:12px}.quickActions small{margin-top:4px;color:rgba(255,255,255,.8);font-size:8px;line-height:1.3}.quickActions em{font-size:17px;font-style:normal}.lostAction{background:linear-gradient(145deg,#a92f42,#d14d59)}.supportAction{background:linear-gradient(145deg,#075fbd,#0b91a8)}
        .profileChooser{margin-top:9px;padding:13px;border:1px solid #bfd4e3;border-radius:18px;background:#fff;color:#163851;box-shadow:0 16px 36px rgba(4,43,80,.17)}.profileChooser>header{display:flex;align-items:center;justify-content:space-between}.profileChooser header small{color:#0a8e64;font-size:8px;font-weight:900;letter-spacing:.7px}.profileChooser h2{margin:3px 0 0;font-size:16px}.profileChooser header button{width:31px;height:31px;border:0;border-radius:10px;background:#eef4f8;color:#426078;font-size:20px}.profileChooser>a{margin-top:7px;padding:9px;display:flex;align-items:center;gap:9px;border:1px solid #deE8ef;border-radius:12px;color:#163851;text-decoration:none}.profileChooser>a>span{width:35px;height:35px;display:grid;place-items:center;border-radius:10px;background:#edf6fc}.profileChooser>a>div{min-width:0;flex:1}.profileChooser a b,.profileChooser a small{display:block}.profileChooser a b{font-size:11px}.profileChooser a small{margin-top:3px;color:#71879a;font-size:8px}.profileChooser em{padding:5px 7px;border-radius:8px;font-size:8px;font-style:normal;font-weight:950}.profileChooser em.on{background:#ffe8ea;color:#b52d3b}.profileChooser em.off{background:#e8f8f0;color:#08784a}.profileChooser>p{margin:14px 0;color:#71879a;font-size:10px;text-align:center}
        .important{margin-top:19px;color:#163851}.sectionTitle{display:flex;align-items:end;justify-content:space-between;padding:0 2px}.sectionTitle small{color:#0b72c9;font-size:8px;font-weight:950;letter-spacing:1px}.sectionTitle h2{margin:3px 0 0;font-size:18px}.sectionTitle>a{color:#0b69b7;font-size:9px;font-weight:850;text-decoration:none}.activityList{margin-top:9px;display:grid;gap:7px}.activityItem{min-height:67px;padding:10px 11px;display:flex;align-items:center;gap:10px;border:1px solid #d3e1eb;border-left-width:4px;border-radius:15px;background:linear-gradient(145deg,#fff,#f9fcfe);color:#163851;text-decoration:none;box-shadow:0 8px 21px rgba(5,44,82,.08)}.activityItem.unread{box-shadow:0 11px 25px rgba(5,65,119,.13)}.activityItem.type-chat{border-left-color:#1475d1}.activityItem.type-scan{border-left-color:#6954d8}.activityItem.type-location{border-left-color:#0aa369}.activityItem.type-order{border-left-color:#d98218}.activityIcon{width:39px;height:39px;display:grid;place-items:center;flex:0 0 39px;border-radius:12px;background:#e9f3fb;color:#0b69b7;font-size:17px}.activityItem>div{min-width:0;flex:1}.activityItem b,.activityItem small{display:block}.activityItem b{overflow:hidden;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.activityItem small{margin-top:4px;overflow:hidden;color:#6c8295;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.activityItem i{padding:4px 6px;border-radius:7px;background:#e7f2ff;color:#0b69b7;font-size:7px;font-style:normal;font-weight:950}.allClear{margin-top:9px;padding:16px;display:flex;align-items:center;gap:11px;border:1px solid #bfe2d3;border-radius:17px;background:linear-gradient(145deg,#fff,#eefaf5);box-shadow:0 9px 23px rgba(5,79,58,.08)}.allClear>span{width:42px;height:42px;display:grid;place-items:center;border-radius:13px;background:#0aa369;color:#fff;font-size:20px;font-weight:950}.allClear b,.allClear small{display:block}.allClear b{font-size:13px}.allClear small{margin-top:4px;color:#638072;font-size:9px}
        @media(max-width:360px){.homeWrap{padding-left:10px;padding-right:10px}.quickActions{grid-template-columns:1fr}.statusHero{padding-left:15px;padding-right:15px}}
      `}</style>
    </main>
  );
}
