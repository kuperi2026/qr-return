"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function AppHome() {
  const router = useRouter();

  useEffect(() => {
    window.localStorage.setItem("kompasi-app-mode", "1");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    const supabase = createClient(url, key);
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/app/products");
    });
  }, [router]);

  return (
    <main className="appEntry">
      <div className="entryWrap">
        <header>
          <Link href="/app" className="brand">
            <img src="/app-icons/app-icon.svg" alt="" />
            <span><strong>KOMPASI</strong><small>დაცული QR კავშირი</small></span>
          </Link>
        </header>

        <section className="entryCard">
          <div className="status"><i /> SMART QR PROTECTION</div>
          <div className="mark"><span>⌁</span></div>
          <h1>აღმოაჩინე მეტი.</h1>
          <p className="lead">დაიცავით თქვენთვის მნიშვნელოვანი და დაუკავშირდით მპოვნელს უსაფრთხოდ.</p>

          <Link href="/signup?source=app" className="register">
            <span><small>ახალი მომხმარებელი</small><strong>რეგისტრაცია</strong></span>
            <b>→</b>
          </Link>

          <div className="divider"><span>ან</span></div>

          <div className="existing">
            <div><small>უკვე გაქვთ ანგარიში?</small><strong>გახსენით თქვენი QR პროფილები</strong></div>
            <Link href="/login?source=app">შესვლა</Link>
          </div>

          <div className="trust">
            <span>✓ უსაფრთხო ანგარიში</span>
            <span>✓ ყველა პროფილი ერთ სივრცეში</span>
          </div>
        </section>

        <section className="finderNote">
          <div className="qrMini">⌗</div>
          <div><strong>მპოვნელისთვის რეგისტრაცია საჭირო არ არის</strong><p>QR კოდის სკანირებისას დაცული პროფილი ავტომატურად გაიხსნება.</p></div>
        </section>

        <footer>© 2026 KOMPASI · აღმოაჩინე მეტი</footer>
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}.appEntry{min-height:100vh;background:radial-gradient(circle at 50% 0,#dcecff 0,transparent 36%),linear-gradient(180deg,#f7faff,#edf3fa);color:#153451;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.entryWrap{width:min(500px,100%);margin:auto;padding:0 16px 28px}.entryWrap>header{height:78px;display:flex;align-items:center;justify-content:center}.brand{display:flex;align-items:center;gap:10px;color:#11365e;text-decoration:none}.brand img{width:40px;height:40px;border-radius:12px;box-shadow:0 7px 18px #16539926}.brand strong,.brand small{display:block}.brand strong{font-size:15px;letter-spacing:1.3px}.brand small{margin-top:2px;color:#6a829a;font-size:9px;font-weight:750}
        .entryCard{position:relative;overflow:hidden;padding:27px 23px 22px;border:1px solid #dbe6f2;border-radius:25px;background:#fff;box-shadow:0 18px 45px #173f6d1c}.entryCard:before{content:"";position:absolute;width:190px;height:190px;right:-100px;top:-100px;border:28px solid #eaf3ff;border-radius:50%}.status{position:relative;z-index:1;display:flex;align-items:center;justify-content:center;gap:7px;color:#6c8298;font-size:8px;font-weight:900;letter-spacing:1px}.status i{width:7px;height:7px;border-radius:50%;background:#20bd78;box-shadow:0 0 0 4px #20bd7818}.mark{position:relative;z-index:1;width:54px;height:54px;margin:19px auto 0;display:grid;place-items:center;border-radius:17px;background:linear-gradient(145deg,#0a6ee4,#344fd0);color:#fff;box-shadow:0 10px 24px #1557c23b}.mark span{font-size:27px;font-weight:900}.entryCard h1{position:relative;z-index:1;margin:17px 0 0;text-align:center;font-size:27px;letter-spacing:-.7px}.lead{position:relative;z-index:1;max-width:350px;margin:8px auto 0;color:#647b91;text-align:center;font-size:12px;font-weight:600;line-height:1.55}
        .register{position:relative;z-index:1;min-height:62px;margin-top:23px;padding:0 17px;display:flex;align-items:center;justify-content:space-between;border-radius:15px;background:linear-gradient(135deg,#096de5,#3154d5);color:#fff;text-decoration:none;box-shadow:0 11px 25px #1557c236}.register small,.register strong{display:block}.register small{color:#cfe5ff;font-size:8px;font-weight:750}.register strong{margin-top:3px;font-size:15px}.register>b{font-size:18px}.divider{height:35px;display:flex;align-items:center}.divider:before,.divider:after{content:"";height:1px;flex:1;background:#e2e9f1}.divider span{padding:0 10px;color:#9aacbc;font-size:9px;font-weight:800}
        .existing{min-height:61px;padding:10px 11px 10px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;border:1px solid #dce6f0;border-radius:15px;background:#f8fbff}.existing small,.existing strong{display:block}.existing small{color:#74889c;font-size:8px}.existing strong{margin-top:3px;font-size:10px}.existing a{min-height:38px;padding:0 16px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #c7d9ec;border-radius:10px;background:#fff;color:#0c5fc4;text-decoration:none;font-size:11px;font-weight:900}.trust{margin-top:18px;padding-top:15px;display:flex;justify-content:center;gap:8px 17px;flex-wrap:wrap;border-top:1px solid #e5ebf2;color:#71869a;font-size:8px;font-weight:750}
        .finderNote{margin-top:12px;padding:15px 17px;display:flex;align-items:center;gap:13px;border:1px solid #d8e4f0;border-radius:17px;background:#fafdff}.qrMini{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;border-radius:11px;background:#e7f2ff;color:#0b62cc;font-size:20px;font-weight:900}.finderNote strong{font-size:10px}.finderNote p{margin:4px 0 0;color:#72869a;font-size:8px;line-height:1.45}.entryWrap footer{padding-top:19px;color:#8b9daf;text-align:center;font-size:8px;font-weight:700}
        @media(max-width:390px){.entryWrap{padding:0 10px 22px}.entryWrap>header{height:68px}.entryCard{padding:23px 17px 19px;border-radius:21px}.entryCard h1{font-size:24px}.register{margin-top:19px}.existing strong{font-size:9px}}
      `}</style>
    </main>
  );
}
