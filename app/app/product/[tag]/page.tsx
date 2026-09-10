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
type ProductAction = {
  icon: string;
  title: string;
  description: string;
  href: string;
  tone?: "danger" | "chat";
};
type ActionGroup = {
  title: string;
  description: string;
  actions: ProductAction[];
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
  const groups: ActionGroup[] = [
    {
      title: "პროფილი და ინფორმაცია",
      description: "მართეთ მონაცემები და ის, რასაც მპოვნელი დაინახავს",
      actions: [
        { icon: "▤", title: "პროფილის ინფორმაცია", description: "ყველა შენახული მონაცემის ნახვა", href: "/profile/" + tag },
        { icon: "✎", title: "ინფორმაციის რედაქტირება", description: m[1] + "ს მონაცემებისა და ფოტოს შეცვლა", href: "/profile/" + tag + "/edit" },
        { icon: "◐", title: "ხილვადობა და კონფიდენციალურობა", description: "აირჩიეთ, რას დაინახავს QR-ის დამსკანირებელი", href: "/profile/" + tag + "/edit#visibility" },
        { icon: "◉", title: "პროფილი მპოვნელისთვის", description: "ნახეთ საჯარო QR პროფილი მპოვნელის თვალით", href: "/scan/" + tag },
      ],
    },
    {
      title: "დაცვა და დაბრუნება",
      description: "დაკარგვის რეჟიმი, QR და სკანირების აქტივობა",
      actions: [
        { icon: "!", title: "Lost Mode", description: "ჩართეთ ან გამორთეთ დაკარგვის რეჟიმი", href: "/profile/" + tag, tone: "danger" },
        { icon: "⌖", title: "სკანირებები და მდებარეობა", description: "რაოდენობა, ბოლო დრო და გაზიარებული ლოკაცია", href: "/profile/" + tag },
        { icon: "⌄", title: "QR კოდის მართვა", description: "QR-ის ნახვა და ფაილის ჩამოტვირთვა", href: "/profile/" + tag },
      ],
    },
    {
      title: "კავშირი",
      description: "მპოვნელის შეტყობინებები და პროფილზე წვდომა",
      actions: [
        { icon: "◌", title: "Live Chat", description: "გახსენით მპოვნელთან უსაფრთხო საუბარი", href: "/chat/" + type + "/" + tag, tone: "chat" },
        { icon: "♢", title: "შეტყობინებები", description: "სკანები, ჩატი და მნიშვნელოვანი აქტივობა", href: "/account/notifications?profile=" + p.id },
        { icon: "♙", title: "თანაადმინისტრატორი", description: "დაამატეთ სანდო ადამიანი და მართეთ უფლებები", href: "/account/admin?profile=" + p.id },
      ],
    },
    {
      title: "მომსახურება",
      description: "პროდუქტის პაკეტი და განახლება",
      actions: [
        { icon: "◇", title: "მომსახურება და პაკეტი", description: "ნახეთ ვადა, პირობები და განახლება", href: "/account/subscriptions?profile=" + p.id },
      ],
    },
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
          <b>{m[1]}ს მართვა</b>
          <small>ყველაფერი ერთ სივრცეში</small>
        </div>
        <div className="actionGroups">
          {groups.map((group) => (
            <section className="actionGroup" key={group.title}>
              <header>
                <b>{group.title}</b>
                <small>{group.description}</small>
              </header>
              <div className="actionList">
                {group.actions.map((action) => (
                  <Link href={action.href} key={action.title} className={action.tone || ""}>
                    <i>{action.icon}</i>
                    <span>
                      <b>{action.title}</b>
                      <small>{action.description}</small>
                    </span>
                    <em>›</em>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
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
        .actionGroups {
          display: grid;
          gap: 12px;
        }
        .actionGroup {
          overflow: hidden;
          border: 1px solid #dce6f0;
          border-radius: 17px;
          background: #fff;
          box-shadow: 0 7px 20px #173f6d0d;
        }
        .actionGroup > header {
          padding: 13px 14px 11px;
          border-bottom: 1px solid #e8eef5;
          background: linear-gradient(135deg, #f8fbff, #f1f6fc);
        }
        .actionGroup > header b,
        .actionGroup > header small {
          display: block;
        }
        .actionGroup > header b {
          font-size: 10px;
        }
        .actionGroup > header small {
          margin-top: 4px;
          color: #7c8fa2;
          font-size: 7px;
          line-height: 1.35;
        }
        .actionList a {
          min-height: 64px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border-bottom: 1px solid #edf1f5;
          color: #173652;
          text-decoration: none;
        }
        .actionList a:last-child {
          border-bottom: 0;
        }
        .actionList i {
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
        .actionList a.danger i {
          background: #fff0f1;
          color: #c43643;
        }
        .actionList a.chat i {
          background: #e8f8f1;
          color: #087b4b;
        }
        .actionList span {
          min-width: 0;
          flex: 1;
        }
        .actionList b,
        .actionList small {
          display: block;
        }
        .actionList b {
          font-size: 10px;
          line-height: 1.25;
        }
        .actionList small {
          margin-top: 4px;
          color: #778b9e;
          font-size: 8px;
          line-height: 1.35;
        }
        .actionList > a > em {
          color: #1761bd;
          font-size: 18px;
          font-style: normal;
        }
        @media (max-width: 375px) {
          .title small {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
