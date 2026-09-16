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

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);

    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/app"); return; }
      const { data } = await supabase
        .from("item")
        .select("id,tag_code,item_name,item_type,pet_type,lost")
        .eq("owner_id", user.id);
      setItems((data || []) as Item[]);
    })();
  }, [router]);

  return (
    <main className="contactHome">
      <div className="homeWrap">
        <header className="homeHeader">
          <Link href="/app/dashboard" className="brand">
            <img src="/app-icons/app-icon.svg" alt="" />
            <span><b>KOMPASI</b><small>SMART LOST &amp; FOUND</small></span>
          </Link>
          <Link href="/account/notifications" className="notificationButton" aria-label="სიახლეები">♢</Link>
        </header>

        <section className="contactHero">
          <span className="online"><i /> ONLINE · 24/7</span>
          <h1>ყოველთვის კავშირზე</h1>
          <p>დახმარება, დაცული ჩათი და Lost Mode — სწრაფად, ერთ სივრცეში.</p>
          <Link href="/support?source=app" className="contactButton">
            <span className="contactIcon">?</span>
            <span><b>24/7 კონტაქტი</b><small>KOMPASI დახმარებასთან დაკავშირება</small></span>
            <em>›</em>
          </Link>
        </section>

        <section className="mainActions">
          <Link href="/app/chat" className="chatAction">
            <i>◌</i>
            <span><b>ჩათი</b><small>ახალი და მიმდინარე საუბრები</small></span>
            <em>›</em>
          </Link>
          <button type="button" className="lostAction" onClick={() => setShowProducts((current) => !current)}>
            <i>!</i>
            <span><b>Lost Mode</b><small>აირჩიეთ დაკარგული პროდუქტი</small></span>
            <em>{showProducts ? "⌃" : "⌄"}</em>
          </button>
        </section>

        {showProducts && (
          <section className="productList">
            <header><div><small>MY PRODUCTS</small><h2>აირჩიეთ პროდუქტი</h2></div><button type="button" onClick={() => setShowProducts(false)}>×</button></header>
            {items.length ? items.map((item) => (
              <Link key={item.id} href={`/app/product/${item.tag_code}?panel=lost`}>
                <span className="productIcon">{productIcon(item)}</span>
                <div><b>{item.item_name || "QR პროფილი"}</b><small>QR {item.tag_code || "—"}</small></div>
                <em className={item.lost ? "on" : "off"}>{item.lost ? "ON" : "OFF"}</em>
              </Link>
            )) : (
              <div className="emptyProducts"><span>⌁</span><b>პროდუქტი ჯერ არ არის</b><Link href="/app/add">პროფილის რეგისტრაცია</Link></div>
            )}
          </section>
        )}
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}.contactHome{min-height:100vh;background:radial-gradient(circle at 92% 0%,rgba(13,181,139,.2),transparent 25%),radial-gradient(circle at 5% 5%,rgba(36,124,245,.35),transparent 32%),linear-gradient(180deg,#05182d 0%,#082e50 52%,#061f38 100%);color:#fff;font-family:"Noto Sans Georgian",Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.homeWrap{width:min(520px,100%);margin:auto;padding:0 14px 108px}.homeHeader{height:72px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand img{width:40px;height:40px;border-radius:13px;box-shadow:0 9px 22px rgba(0,12,28,.36)}.brand b,.brand small{display:block}.brand b{font-size:15px;letter-spacing:1.1px}.brand small{margin-top:2px;color:#9ebfd8;font-size:7px;letter-spacing:1px}.notificationButton{width:41px;height:41px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.24);border-radius:13px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;font-size:20px;backdrop-filter:blur(12px)}
        .contactHero{position:relative;overflow:hidden;padding:24px 19px 19px;border:1px solid rgba(133,205,255,.28);border-radius:25px;background:linear-gradient(145deg,rgba(13,79,139,.96),rgba(5,36,70,.98) 58%,rgba(5,103,81,.93));box-shadow:0 27px 60px rgba(0,12,29,.4),inset 0 1px 0 rgba(255,255,255,.18)}.contactHero:after{content:"";position:absolute;right:-70px;top:-92px;width:185px;height:185px;border:29px solid rgba(255,255,255,.055);border-radius:50%}.online{position:relative;z-index:1;display:inline-flex;align-items:center;gap:7px;color:#a8f0d7;font-size:8px;font-weight:950;letter-spacing:1.1px}.online i{width:7px;height:7px;border-radius:50%;background:#25d99d;box-shadow:0 0 0 5px rgba(37,217,157,.13)}.contactHero h1{position:relative;z-index:1;margin:15px 0 0;font-size:27px;letter-spacing:-.5px}.contactHero>p{position:relative;z-index:1;margin:7px 0 0;max-width:360px;color:#d2e7f5;font-size:11px;line-height:1.55}.contactButton{position:relative;z-index:1;min-height:67px;margin-top:21px;padding:10px 12px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.28);border-radius:17px;background:linear-gradient(145deg,rgba(255,255,255,.2),rgba(255,255,255,.1));color:#fff;text-decoration:none;box-shadow:0 12px 29px rgba(0,18,39,.22);backdrop-filter:blur(12px)}.contactIcon{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:13px;background:linear-gradient(145deg,#1682ee,#0bb084);font-size:20px;font-weight:950;box-shadow:0 8px 18px rgba(0,30,58,.3)}.contactButton>span:nth-child(2){min-width:0;flex:1}.contactButton b,.contactButton small{display:block}.contactButton b{font-size:13px}.contactButton small{margin-top:4px;color:#cce3ef;font-size:9px}.contactButton em{font-size:23px;font-style:normal}
        .mainActions{margin-top:12px;display:grid;gap:9px}.mainActions>a,.mainActions>button{width:100%;min-height:78px;padding:12px 13px;display:flex;align-items:center;gap:11px;border:1px solid rgba(255,255,255,.17);border-radius:19px;color:#fff;text-align:left;text-decoration:none;font-family:inherit;box-shadow:0 15px 32px rgba(0,14,31,.25);cursor:pointer}.mainActions i{width:45px;height:45px;display:grid;place-items:center;flex:0 0 45px;border-radius:14px;background:rgba(255,255,255,.16);font-size:20px;font-style:normal;font-weight:950;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}.mainActions span{min-width:0;flex:1}.mainActions b,.mainActions small{display:block}.mainActions b{font-size:14px}.mainActions small{margin-top:4px;color:rgba(255,255,255,.79);font-size:9px}.mainActions em{font-size:20px;font-style:normal}.chatAction{background:linear-gradient(145deg,#075fbd,#0b8da6)}.lostAction{background:linear-gradient(145deg,#922c42,#d04b58)}
        .productList{margin-top:10px;padding:14px;border:1px solid rgba(171,211,239,.42);border-radius:20px;background:linear-gradient(145deg,rgba(255,255,255,.98),rgba(241,248,252,.97));color:#123650;box-shadow:0 20px 45px rgba(0,15,32,.32)}.productList>header{display:flex;align-items:center;justify-content:space-between;padding:1px 1px 6px}.productList header small{color:#0a8f66;font-size:8px;font-weight:950;letter-spacing:1px}.productList h2{margin:3px 0 0;font-size:17px}.productList header button{width:32px;height:32px;border:0;border-radius:10px;background:#e9f1f6;color:#49677d;font-size:20px}.productList>a{margin-top:7px;padding:9px 10px;display:flex;align-items:center;gap:10px;border:1px solid #d8e5ed;border-radius:14px;background:#fff;color:#123650;text-decoration:none;box-shadow:0 6px 16px rgba(5,48,84,.06)}.productIcon{width:40px;height:40px;display:grid;place-items:center;flex:0 0 40px;border-radius:12px;background:linear-gradient(145deg,#e8f4fc,#f5fbff);font-size:19px}.productList>a>div{min-width:0;flex:1}.productList a b,.productList a small{display:block}.productList a b{overflow:hidden;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.productList a small{margin-top:4px;color:#71879a;font-size:8px}.productList em{min-width:38px;padding:6px 8px;border-radius:9px;text-align:center;font-size:8px;font-style:normal;font-weight:950}.productList em.on{background:#ffe6e9;color:#b62f3c}.productList em.off{background:#e4f8ee;color:#078154}.emptyProducts{padding:25px 10px 15px;display:grid;justify-items:center;gap:7px;color:#6d8395;text-align:center}.emptyProducts>span{width:46px;height:46px;display:grid;place-items:center;border-radius:14px;background:#e8f3fa;color:#0a6ab5;font-size:22px}.emptyProducts b{font-size:11px}.emptyProducts a{padding:8px 11px;border-radius:9px;background:#0a75d5;color:#fff;text-decoration:none;font-size:9px;font-weight:900}
      `}</style>
    </main>
  );
}
