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
};
const label = (p: Profile) => p.item_type || p.pet_type || "QR პროფილი";

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
      const { data } = await sb
        .from("item")
        .select(
          "id,tag_code,item_type,pet_type,item_name,photo,active,lost,scan_count",
        )
        .eq("owner_id", user.id);
      setItems((data || []) as Profile[]);
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
                    <span>{label(p).includes("dog") ? "🐕" : "⌁"}</span>
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
                <Link className="open" href={"/app/product/" + p.tag_code}>
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
        background: #f4f7fb;
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
        min-height: 79px;
        padding: 10px 38px 10px 10px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #dce6f0;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 6px 18px #173f6d0d;
      }
      .photo {
        width: 53px;
        height: 53px;
        display: grid;
        place-items: center;
        flex: 0 0 53px;
        overflow: hidden;
        border-radius: 13px;
        background: #edf4fc;
        font-size: 22px;
      }
      .photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .info {
        min-width: 0;
        flex: 1;
      }
      .info small,
      .info b,
      .info span {
        display: block;
      }
      .info small {
        color: #71869a;
        font-size: 8px;
      }
      .info b {
        margin-top: 3px;
        overflow: hidden;
        font-size: 12px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .info span {
        margin-top: 5px;
        color: #7b8fa2;
        font-size: 8px;
      }
      .active,
      .lost {
        position: absolute;
        right: 34px;
        top: 10px;
        padding: 4px 6px;
        border-radius: 999px;
        font-size: 7px;
        font-weight: 850;
      }
      .active {
        background: #e6f8ef;
        color: #08784a;
      }
      .lost {
        background: #fff0f0;
        color: #bd3434;
      }
      .open {
        position: absolute;
        right: 12px;
        bottom: 16px;
        color: #1761bd;
        text-decoration: none;
        font-size: 24px;
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
