"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AppAiAssistant from "@/app/components/app/AppAiAssistant";

type Item = {
  id: string;
  tag_code: string | null;
  item_name: string | null;
  scan_count: number | null;
  last_scanned_at: string | null;
  lost: boolean | null;
};
export default function Dashboard() {
  const router = useRouter(),
    [items, setItems] = useState<Item[]>([]),
    [email, setEmail] = useState("");
  useEffect(() => {
    const u = process.env.NEXT_PUBLIC_SUPABASE_URL,
      k =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!u || !k) return;
    const sb = createClient(u, k);
    void (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        router.replace("/login?source=app");
        return;
      }
      setEmail(user.email || "");
      const { data } = await sb
        .from("item")
        .select("id,tag_code,item_name,scan_count,last_scanned_at,lost")
        .eq("owner_id", user.id);
      setItems((data || []) as Item[]);
    })();
  }, [router]);
  const scans = items.reduce((n, p) => n + (p.scan_count || 0), 0),
    lost = items.filter((p) => p.lost).length;
  const latest = useMemo(
    () =>
      [...items]
        .filter((p) => p.last_scanned_at)
        .sort(
          (a, b) =>
            new Date(b.last_scanned_at || 0).getTime() -
            new Date(a.last_scanned_at || 0).getTime(),
        )[0],
    [items],
  );
  return (
    <main className="dash">
      <div className="dw">
        <header>
          <Link href="/app/dashboard" className="db">
            <img src="/app-icons/app-icon.svg" alt="" />
            <span>
              <b>KOMPASI</b>
              <small>დაცული QR კავშირი</small>
            </span>
          </Link>
          <Link href="/account/notifications" className="bell">
            ♢
          </Link>
        </header>
        <section className="hero">
          <div>
            <small>მფლობელის სივრცე</small>
            <h1>მოგესალმებით</h1>
            <p>{email || "თქვენი მნიშვნელოვანი ყოველთვის ახლოსაა."}</p>
          </div>
          <i>✦</i>
        </section>
        <section className="stats">
          <Link href="/app/profiles">
            <small>პროფილები</small>
            <b>{items.length}</b>
            <span>ყველას ნახვა →</span>
          </Link>
          <Link href="/app/profiles">
            <small>სკანირებები</small>
            <b>{scans}</b>
            <span>{latest?.item_name || "აქტივობა არ არის"}</span>
          </Link>
          <Link href="/app/profiles">
            <small>Lost Mode</small>
            <b className={lost ? "red" : ""}>{lost}</b>
            <span>{lost ? "საჭიროა ყურადღება" : "ყველაფერი დაცულია"}</span>
          </Link>
        </section>
        <AppAiAssistant />
        <div className="title">
          <b>სწრაფი მოქმედებები</b>
          <small>გაიხსნება მხოლოდ არჩევის შემდეგ</small>
        </div>
        <section className="quick">
          <Link href="/app/products">
            <i>⌁</i>
            <span>
              <b>პროდუქტები</b>
              <small>8 კატეგორია და რეგისტრაცია</small>
            </span>
            <em>›</em>
          </Link>
          <Link href="/app/profiles">
            <i>▦</i>
            <span>
              <b>QR პროფილები</b>
              <small>მართვა და სტატუსები</small>
            </span>
            <em>›</em>
          </Link>
          <Link href="/app/chat">
            <i>◌</i>
            <span>
              <b>Live Chat</b>
              <small>უსაფრთხო საუბრები</small>
            </span>
            <em>›</em>
          </Link>
          <Link href="/app/account">
            <i>◇</i>
            <span>
              <b>მომსახურება</b>
              <small>პაკეტები და ანგარიში</small>
            </span>
            <em>›</em>
          </Link>
        </section>
      </div>
      <style jsx global>{`
        .dash {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0, #dcecff, transparent 28%), #f4f7fb;
          color: #153451;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }
        .dw {
          width: min(560px, 100%);
          margin: auto;
          padding: 0 13px 94px;
        }
        .dash header {
          height: 67px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .db {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #153451;
          text-decoration: none;
        }
        .db img {
          width: 36px;
          height: 36px;
          border-radius: 11px;
        }
        .db b,
        .db small {
          display: block;
        }
        .db b {
          font-size: 13px;
          letter-spacing: 1px;
        }
        .db small {
          margin-top: 2px;
          color: #6c8197;
          font-size: 8px;
        }
        .bell {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid #d5e2ef;
          border-radius: 11px;
          background: #fff;
          color: #1761bb;
          text-decoration: none;
          font-size: 19px;
        }
        .hero {
          min-height: 126px;
          padding: 23px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 21px;
          background: linear-gradient(140deg, #062f68, #0865d3);
          color: #fff;
          box-shadow: 0 14px 32px #0b4eaa2b;
        }
        .hero small {
          color: #b9d9fa;
          font-size: 8px;
          font-weight: 850;
          letter-spacing: 1px;
        }
        .hero h1 {
          margin: 6px 0 0;
          font-size: 24px;
          letter-spacing: -0.4px;
        }
        .hero p {
          margin: 7px 0 0;
          max-width: 250px;
          overflow: hidden;
          color: #d6e9fc;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .hero > i {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border: 1px solid #ffffff38;
          border-radius: 15px;
          background: #ffffff18;
          font-size: 20px;
          font-style: normal;
        }
        .stats {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
        }
        .stats a {
          min-width: 0;
          min-height: 91px;
          padding: 12px;
          border: 1px solid #dae5ef;
          border-radius: 15px;
          background: #fff;
          color: #173652;
          text-decoration: none;
          box-shadow: 0 6px 18px #173f6d0c;
        }
        .stats small,
        .stats b,
        .stats span {
          display: block;
        }
        .stats small {
          color: #71869a;
          font-size: 7px;
          font-weight: 850;
        }
        .stats b {
          margin-top: 7px;
          color: #0b61c9;
          font-size: 20px;
        }
        .stats b.red {
          color: #d43e49;
        }
        .stats span {
          margin-top: 6px;
          overflow: hidden;
          color: #788b9e;
          font-size: 7px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .title {
          margin: 19px 3px 9px;
          display: flex;
          align-items: end;
          justify-content: space-between;
        }
        .title b {
          font-size: 12px;
        }
        .title small {
          color: #8597aa;
          font-size: 7px;
        }
        .quick {
          display: grid;
          gap: 7px;
        }
        .quick a {
          min-height: 61px;
          padding: 10px 13px;
          display: flex;
          align-items: center;
          gap: 11px;
          border: 1px solid #dce6f0;
          border-radius: 15px;
          background: #fff;
          color: #173652;
          text-decoration: none;
        }
        .quick i {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #eaf3ff;
          color: #0d63c9;
          font-size: 18px;
          font-style: normal;
        }
        .quick span {
          flex: 1;
        }
        .quick b,
        .quick small {
          display: block;
        }
        .quick b {
          font-size: 10px;
        }
        .quick small {
          margin-top: 4px;
          color: #778b9e;
          font-size: 8px;
        }
        .quick em {
          color: #1761bd;
          font-size: 20px;
          font-style: normal;
        }
        @media (max-width: 380px) {
          .title small {
            display: none;
          }
          .stats a {
            padding: 10px 8px;
          }
        }
      `}</style>
    </main>
  );
}
