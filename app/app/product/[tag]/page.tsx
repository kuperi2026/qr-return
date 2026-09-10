"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import AppAiAssistant from "@/app/components/app/AppAiAssistant";
type Item = {
  id: string;
  tag_code: string;
  item_type: string | null;
  pet_type: string | null;
  item_name: string | null;
  photo: string | null;
  active: boolean | null;
  lost: boolean | null;
  scan_count: number | null;
  last_scanned_at: string | null;
};
const names: Record<string, [string, string]> = {
  dog: ["🐕", "ძაღლი"],
  cat: ["🐈", "კატა"],
  parking: ["🚘", "ავტომობილი"],
  suitcase: ["🧳", "ჩემოდანი"],
  luggage: ["🧳", "ჩემოდანი"],
  keys: ["🔑", "გასაღები"],
  wallet: ["👛", "საფულე"],
  bag: ["👜", "ჩანთა"],
  emergency: ["✚", "Emergency"],
};
export default function ProductCenter() {
  const { tag } = useParams<{ tag: string }>(),
    router = useRouter(),
    [p, setP] = useState<Item | null>(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    const u = process.env.NEXT_PUBLIC_SUPABASE_URL,
      k =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!u || !k) return setLoading(false);
    const sb = createClient(u, k);
    void (async () => {
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        router.replace("/login?source=app");
        return;
      }
      const { data } = await sb
        .from("item")
        .select(
          "id,tag_code,item_type,pet_type,item_name,photo,active,lost,scan_count,last_scanned_at",
        )
        .eq("owner_id", user.id)
        .eq("tag_code", tag)
        .maybeSingle();
      setP(data as Item | null);
      setLoading(false);
    })();
  }, [router, tag]);
  if (loading) return <main className="centerState">პროფილი იტვირთება…</main>;
  if (!p) return <main className="centerState">პროფილი ვერ მოიძებნა.</main>;
  const type = p.item_type || p.pet_type || "item",
    m = names[type] || ["⌁", "QR პროფილი"];
  const actions = [
    ["▤", "პროფილის ინფორმაცია", "ყველა შენახული მონაცემი", "/profile/" + tag],
    ["✎", "რედაქტირება", "ინფორმაციის შეცვლა", "/profile/" + tag + "/edit"],
    ["!", "Lost Mode", "დაკარგვის რეჟიმის მართვა", "/profile/" + tag],
    ["◉", "პროფილი მპოვნელისთვის", "Finder View", "/scan/" + tag],
    ["◌", "Live Chat", "მპოვნელთან საუბარი", "/chat/" + type + "/" + tag],
    ["⌖", "სკანირებები", "რაოდენობა, დრო და ლოკაცია", "/profile/" + tag],
    [
      "◇",
      "მომსახურება და პაკეტი",
      "ვადა და განახლება",
      "/account/subscriptions?profile=" + p.id,
    ],
    [
      "♙",
      "თანაადმინისტრატორი",
      "უფლებები და მონაცემები",
      "/account/admin?profile=" + p.id,
    ],
    ["⌄", "QR კოდის ჩამოტვირთვა", "QR ფაილის მართვა", "/profile/" + tag],
  ];
  return (
    <main className="cc">
      <div className="cw">
        <Link className="back" href={"/app/products/" + type}>
          ← {m[1]}
        </Link>
        <section className="profileHead">
          <div className="photo">
            {p.photo ? <img src={p.photo} alt="" /> : <span>{m[0]}</span>}
          </div>
          <div>
            <small>
              {m[1]} · QR {p.tag_code}
            </small>
            <h1>{p.item_name || m[1]}</h1>
            <em className={p.lost ? "lost" : "ok"}>
              {p.lost ? "Lost Mode აქტიურია" : "აქტიური"}
            </em>
          </div>
        </section>
        <section className="summary">
          <div>
            <small>სკანირებები</small>
            <b>{p.scan_count || 0}</b>
          </div>
          <div>
            <small>ბოლო სკანირება</small>
            <b>
              {p.last_scanned_at
                ? new Intl.DateTimeFormat("ka-GE", {
                    dateStyle: "medium",
                  }).format(new Date(p.last_scanned_at))
                : "ჯერ არ ყოფილა"}
            </b>
          </div>
        </section>
        <AppAiAssistant />
        <div className="title">
          <b>პროფილის მართვა</b>
          <small>აირჩიეთ საჭირო მოქმედება</small>
        </div>
        <section className="actionGrid">
          {actions.map(([i, a, b, h]) => (
            <Link href={h} key={a}>
              <i>{i}</i>
              <span>
                <b>{a}</b>
                <small>{b}</small>
              </span>
              <em>›</em>
            </Link>
          ))}
        </section>
      </div>
      <style jsx global>{`
        .centerState {
          min-height: 100vh;
          display: grid;
          place-items: center;
          background: #f4f7fb;
          color: #6e8296;
          font:
            700 11px Inter,
            Arial;
        }
        .cc {
          min-height: 100vh;
          background: #f4f7fb;
          color: #173652;
          font-family: Inter, Arial, sans-serif;
        }
        .cw {
          width: min(560px, 100%);
          margin: auto;
          padding: 20px 13px 94px;
        }
        .back {
          color: #1761bd;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }
        .profileHead {
          margin-top: 15px;
          padding: 17px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-radius: 19px;
          background: linear-gradient(140deg, #07366f, #0a65d2);
          color: #fff;
          box-shadow: 0 13px 30px #0b4eaa27;
        }
        .profileHead .photo {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          flex: 0 0 62px;
          overflow: hidden;
          border: 2px solid #ffffff55;
          border-radius: 17px;
          background: #ffffff18;
          font-size: 27px;
        }
        .profileHead img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profileHead small {
          color: #bcdafa;
          font-size: 8px;
        }
        .profileHead h1 {
          margin: 5px 0 0;
          font-size: 20px;
        }
        .profileHead em {
          display: inline-block;
          margin-top: 7px;
          padding: 4px 7px;
          border-radius: 999px;
          font-size: 7px;
          font-style: normal;
          font-weight: 850;
        }
        .profileHead .ok {
          background: #dff7eb;
          color: #087649;
        }
        .profileHead .lost {
          background: #ffe6e8;
          color: #b82937;
        }
        .summary {
          margin-top: 9px;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 7px;
        }
        .summary div {
          min-height: 65px;
          padding: 12px;
          border: 1px solid #dce6f0;
          border-radius: 14px;
          background: #fff;
        }
        .summary small,
        .summary b {
          display: block;
        }
        .summary small {
          color: #778b9e;
          font-size: 7px;
        }
        .summary b {
          margin-top: 7px;
          color: #155db5;
          font-size: 11px;
        }
        .title {
          margin: 19px 3px 9px;
          display: flex;
          justify-content: space-between;
        }
        .title b {
          font-size: 11px;
        }
        .title small {
          color: #8395a7;
          font-size: 7px;
        }
        .actionGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .actionGrid a {
          min-height: 72px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #dce6f0;
          border-radius: 15px;
          background: #fff;
          color: #173652;
          text-decoration: none;
        }
        .actionGrid i {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          flex: 0 0 36px;
          border-radius: 10px;
          background: #eaf3ff;
          color: #0d63c9;
          font-size: 15px;
          font-style: normal;
        }
        .actionGrid span {
          min-width: 0;
          flex: 1;
        }
        .actionGrid b,
        .actionGrid small {
          display: block;
        }
        .actionGrid b {
          font-size: 9px;
          line-height: 1.25;
        }
        .actionGrid small {
          margin-top: 4px;
          color: #778b9e;
          font-size: 7px;
        }
        .actionGrid > a > em {
          color: #1761bd;
          font-size: 18px;
          font-style: normal;
        }
        @media (max-width: 375px) {
          .actionGrid {
            grid-template-columns: 1fr;
          }
          .title small {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
