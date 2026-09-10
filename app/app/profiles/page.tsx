"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id: string;
  tag_code: string | null;
  item_type: string | null;
  pet_type: string | null;
  item_name: string | null;
  photo: string | null;
  active: boolean | null;
  lost: boolean | null;
  scan_count: number | null;
  href: string;
  emergency?: boolean;
};
const category = (p: Profile) => p.item_type === "pet" && p.pet_type ? p.pet_type : p.item_type || p.pet_type || "item";
const labels: Record<string, string> = { dog: "ძაღლი", cat: "კატა", parking: "ავტომობილი / Parking", suitcase: "ჩემოდანი", luggage: "ჩემოდანი", keys: "გასაღები", wallet: "საფულე", bag: "ჩანთა", emergency: "Emergency" };
const label = (p: Profile) => labels[category(p)] || "QR პროფილი";
const icons: Record<string, string> = {
  dog: "🐕", cat: "🐈", parking: "🚘", suitcase: "🧳", luggage: "🧳",
  keys: "🔑", wallet: "👛", bag: "👜", emergency: "✚",
};

export default function AppProfiles() {
  const router = useRouter();
  const [items, setItems] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_KEY;
      if (!url || !key) return setLoading(false);
      const sb = createClient(url, key);
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) {
        router.replace("/login?source=app");
        return;
      }
      const [{ data: products }, { data: emergencyProfiles }] = await Promise.all([
        sb.from("item")
          .select("id,tag_code,item_type,pet_type,item_name,photo,active,lost,scan_count")
          .eq("owner_id", user.id),
        sb.from("emergency_profiles")
          .select("id,tag_code,first_name,last_name,photo_url,active,missing_mode")
          .eq("owner_id", user.id),
      ]);
      const regular = ((products || []) as Omit<Profile, "href">[]).map((profile) => ({
        ...profile,
        href: "/app/product/" + profile.tag_code,
      }));
      const emergency = ((emergencyProfiles || []) as Array<{
        id: string; tag_code: string | null; first_name: string | null; last_name: string | null;
        photo_url: string | null; active: boolean | null; missing_mode: boolean | null;
      }>).map((profile): Profile => ({
        id: profile.id,
        tag_code: profile.tag_code,
        item_type: "emergency",
        pet_type: null,
        item_name: [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Emergency პროფილი",
        photo: profile.photo_url,
        active: profile.active,
        lost: profile.missing_mode,
        scan_count: null,
        href: "/app/emergency/" + profile.id,
        emergency: true,
      }));
      setItems([...regular, ...emergency]);
      setLoading(false);
    })();
  }, [router]);
  const visible = items.filter((p) =>
    (p.item_name + " " + p.tag_code + " " + label(p))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <main className="ap">
      <div className="aw">
        <header>
          <div>
            <small>მფლობელის სივრცე</small>
            <h1>QR პროფილები</h1>
          </div>
          <Link href="/app/products">＋</Link>
        </header>
        <div className="search">
          ⌕
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="მოძებნეთ სახელი ან QR კოდი"
          />
        </div>
        {loading ? (
          <p className="empty">პროფილები იტვირთება…</p>
        ) : visible.length === 0 ? (
          <div className="empty">
            <b>პროფილი ვერ მოიძებნა</b>
            <span>დაამატეთ ახალი QR პროფილი ქვედა ღილაკით.</span>
          </div>
        ) : (
          <section>
            {visible.map((p) => (
              <article key={p.id}>
                <div className="photo">
                  {p.photo ? (
                    <img src={p.photo} alt="" />
                  ) : (
                    <span>{icons[category(p)] || "⌁"}</span>
                  )}
                </div>
                <div className="info">
                  <small>{label(p)}</small>
                  <b>{p.item_name || "უსახელო პროფილი"}</b>
                  <span>
                    QR {p.tag_code || "—"} · {p.scan_count || 0} სკანირება
                  </span>
                </div>
                <div className={p.lost ? "lost" : "active"}>
                  {p.lost ? "დაკარგულია" : "აქტიური"}
                </div>
                <Link className="open" href={p.href}>
                  ›
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
      <Style />
    </main>
  );
}
function Style() {
  return (
    <style jsx global>{`
      .ap {
        min-height: 100vh;
        overflow-x: hidden;
        background: #edf7ff;
        color: #173652;
        font-family: Inter, Arial, sans-serif;
      }
      .aw {
        width: min(560px, 100%);
        margin: auto;
        padding: 22px 13px 94px;
      }
      .ap header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ap header small {
        color: #71869a;
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.8px;
      }
      .ap h1 {
        margin: 4px 0 0;
        font-size: 22px;
      }
      .ap header > a {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #0b65d4;
        color: #fff;
        text-decoration: none;
        font-size: 22px;
      }
      .search {
        height: 45px;
        margin-top: 17px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        gap: 9px;
        border: 1px solid #dbe5ef;
        border-radius: 13px;
        background: #fff;
        color: #6f8498;
      }
      .search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 11px;
      }
      .ap section {
        margin-top: 11px;
        display: grid;
        gap: 8px;
      }
      .ap article {
        position: relative;
        min-height: 58px;
        padding: 6px 42px 6px 7px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #dce6f0;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 6px 18px #173f6d0d;
      }
      .ap .photo {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        flex: 0 0 40px;
        overflow: hidden;
        border-radius: 13px;
        background: #edf4fc;
        font-size: 22px;
      }
      .ap .photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .ap .info {
        min-width: 0;
        flex: 1;
      }
      .ap .info small,
      .ap .info b,
      .ap .info span {
        display: block;
      }
      .ap .info small {
        color: #71869a;
        font-size: 8px;
      }
      .ap .info b {
        margin-top: 3px;
        overflow: hidden;
        font-size: 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ap .info span {
        margin-top: 5px;
        color: #7b8fa2;
        font-size: 8px;
      }
      .ap article > .active,
      .ap article > .lost {
        position: absolute;
        right: 34px;
        top: 6px;
        padding: 4px 6px;
        border-radius: 999px;
        font-size: 7px;
        font-weight: 850;
      }
      .ap article > .active {
        background: #e6f8ef;
        color: #08784a;
      }
      .ap article > .lost {
        background: #fff0f0;
        color: #bd3434;
      }
      .ap .open {
        position: absolute;
        right: 9px;
        top: 50%;
        width: 28px;
        height: 28px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #19a66a;
        color: #ffffff;
        text-decoration: none;
        font-size: 18px;
        line-height: 1;
        transform: translateY(-50%);
      }
      .empty {
        margin-top: 25px;
        display: grid;
        gap: 7px;
        color: #7a8da0;
        text-align: center;
        font-size: 10px;
      }
      .empty b {
        color: #304c68;
        font-size: 13px;
      }
    `}</style>
  );
}
