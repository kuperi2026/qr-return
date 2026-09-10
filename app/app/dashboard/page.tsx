"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Item = { id: string; scan_count: number | null; lost: boolean | null };

export default function Dashboard() {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/app"); return; }
      setEmail(user.email || "");
      const [{ data: products }, { data: emergencyProfiles }] = await Promise.all([
        supabase.from("item").select("id,scan_count,lost").eq("owner_id", user.id),
        supabase.from("emergency_profiles").select("id,missing_mode").eq("owner_id", user.id),
      ]);
      const emergencyItems = ((emergencyProfiles || []) as Array<{ id: string; missing_mode: boolean | null }>).map((profile) => ({ id: profile.id, scan_count: 0, lost: profile.missing_mode }));
      setItems([...(products || []) as Item[], ...emergencyItems]);
    })();
  }, [router]);

  const scans = items.reduce((total, item) => total + (item.scan_count || 0), 0);
  const lost = items.filter((item) => item.lost).length;

  return <main className="simpleDash"><div className="dashWrap">
    <header><Link href="/app/dashboard" className="brand"><img src="/app-icons/app-icon.svg" alt="" /><span><b>KOMPASI</b><small>დაცული QR კავშირი</small></span></Link><Link href="/account/notifications" className="notifications" aria-label="შეტყობინებები">♢</Link></header>
    <section className="welcome"><span className="welcomeIcon">✦</span><div><small>მფლობელის სივრცე</small><h1>მოგესალმებით</h1><p>{email || "თქვენი მნიშვნელოვანი ყოველთვის ახლოსაა"}</p></div></section>
    <section className="miniStatus" aria-label="ანგარიშის მოკლე სტატუსი"><div className="blue"><i>⌁</i><span><b>{items.length}</b><small>პროფილი</small></span></div><div className="green"><i>⌖</i><span><b>{scans}</b><small>სკანირება</small></span></div><div className={lost ? "red" : "violet"}><i>!</i><span><b>{lost}</b><small>Lost Mode</small></span></div></section>
    <p className="hint"><span>＋</span> ახალი პროფილის დასამატებლად ქვედა მენიუში დააჭირეთ „პროდუქტებს“.</p>
    <section className="compactActions"><Link className="profilesAction" href="/app/profiles"><i>▤</i><span><b>პროფილების მართვა</b><small>ყველა პროდუქტი, რედაქტირება, Lost Mode და AI</small></span><em>›</em></Link><Link href="/app/chat"><i>◌</i><span><b>Live Chat</b><small>მპოვნელის შეტყობინებები</small></span><em>›</em></Link><Link href="/app/account"><i>◇</i><span><b>მომსახურება და პაკეტები</b><small>ანგარიში და პირობები</small></span><em>›</em></Link></section>
  </div><style jsx global>{`
    *{box-sizing:border-box}.simpleDash{min-height:100vh;background:radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%),linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);color:#fff;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.dashWrap{width:min(560px,100%);margin:auto;padding:0 16px 100px}.simpleDash header{height:70px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand img{width:38px;height:38px;border-radius:12px;box-shadow:0 7px 18px rgba(4,39,79,.24)}.brand b,.brand small{display:block}.brand b{font-size:15px;letter-spacing:1.1px}.brand small{margin-top:2px;color:#cae2f7;font-size:10px}.notifications{width:39px;height:39px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.35);border-radius:12px;background:rgba(255,255,255,.14);color:#fff;text-decoration:none;font-size:20px}.welcome{padding:18px 2px 16px;display:flex;align-items:center;gap:13px}.welcomeIcon{width:45px;height:45px;display:grid;place-items:center;flex:0 0 45px;border:1px solid rgba(255,255,255,.28);border-radius:14px;background:rgba(255,255,255,.13);font-size:19px}.welcome small{color:#c7e1f7;font-size:10px;font-weight:800}.welcome h1{margin:3px 0 0;font-size:22px}.welcome p{max-width:330px;margin:4px 0 0;overflow:hidden;color:#d9ebfa;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.miniStatus{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.miniStatus>div{min-width:0;min-height:63px;padding:10px;display:flex;align-items:center;gap:8px;border-radius:14px;color:#173652}.miniStatus i{width:31px;height:31px;display:grid;place-items:center;flex:0 0 31px;border-radius:9px;background:rgba(255,255,255,.72);font-size:14px;font-style:normal;font-weight:900}.miniStatus b,.miniStatus small{display:block}.miniStatus b{font-size:16px}.miniStatus small{margin-top:2px;font-size:8px;font-weight:800;white-space:nowrap}.miniStatus .blue{background:#dceeff}.miniStatus .green{background:#dcf5e8}.miniStatus .violet{background:#eee4ff}.miniStatus .red{background:#ffe0e3;color:#a51f2a}.hint{margin:14px 0 17px;padding:11px 12px;display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.22);border-radius:12px;background:rgba(255,255,255,.1);color:#e0eef9;font-size:10px;line-height:1.45}.hint span{font-size:17px;font-weight:900}.compactActions{display:grid;gap:9px}.compactActions a{min-height:67px;padding:11px 13px;display:flex;align-items:center;gap:11px;border:1px solid #dce6f0;border-radius:15px;background:#fff;color:#173652;text-decoration:none;box-shadow:0 8px 22px rgba(1,30,66,.14)}.compactActions i{width:40px;height:40px;display:grid;place-items:center;flex:0 0 40px;border-radius:11px;font-size:18px;font-style:normal}.compactActions a:first-child i{background:#e6f1ff;color:#075dcc}.compactActions a:last-child i{background:#fff0d9;color:#a45f00}.compactActions span{min-width:0;flex:1}.compactActions b,.compactActions small{display:block}.compactActions b{font-size:13px}.compactActions small{margin-top:4px;color:#74899d;font-size:10px}.compactActions em{color:#1761bd;font-size:20px;font-style:normal}@media(max-width:360px){.dashWrap{padding-left:11px;padding-right:11px}.miniStatus{gap:5px}.miniStatus>div{padding:8px 6px;gap:5px}.miniStatus i{width:27px;height:27px;flex-basis:27px}.miniStatus small{font-size:7px}}
  `}</style></main>;
}
