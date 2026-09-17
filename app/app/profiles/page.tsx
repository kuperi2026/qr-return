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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
  async function deleteProfile(profile: Profile) {
    if (!window.confirm(`წავშალოთ „${profile.item_name || "უსახელო პროფილი"}“? პროფილი და მისი ისტორია ვეღარ აღდგება.`)) return;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
    if (!url || !key) return;
    setDeletingId(profile.id);
    const { error } = await createClient(url, key).rpc("delete_owned_item", { p_item_id: profile.id });
    setDeletingId(null);
    if (error) { window.alert(error.message); return; }
    setItems((current) => current.filter((item) => item.id !== profile.id));
  }
  return (
    <main className="ap">
      <div className="aw">
        <header>
          <div>
            <small>KOMPASI პროფილები</small>
            <h1>QR პროფილები</h1>
          </div>
          <Link href="/app/add" aria-label="ახალი პროფილის რეგისტრაცია">＋</Link>
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
            <span>დაამატეთ ახალი QR პროფილი ზედა „＋“ ღილაკით.</span>
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
                <Link className={`lostQuick ${p.lost ? "enabled" : ""}`} href={`/app/product/${p.tag_code}?panel=lost`}>
                  ! Lost Mode
                </Link>
                <div className="profileActions">
                  <Link className="editProfile" href={"/app/product/" + p.tag_code} aria-label="პროფილის რედაქტირება" title="რედაქტირება"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="m13.5 6.5 4 4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></Link>
                  <button type="button" className="deleteProfile" disabled={deletingId === p.id} onClick={() => void deleteProfile(p)} aria-label="პროფილის წაშლა" title="წაშლა"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                </div>
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
        background: radial-gradient(circle at 20% 5%,rgba(83,174,242,.38),transparent 31%), linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);
        color: #fff;
        font-family:"Noto Sans Georgian","Sylfaen",Inter,Arial,sans-serif;
      }
      .ap, .ap * {
        box-sizing: border-box;
      }
      .aw {
        width: min(480px, calc(100% - 24px));
        margin: auto;
        padding: 22px 0 94px;
      }
      .ap header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .ap header small {
        color: #bdddff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
      }
      .ap h1 {
        margin: 4px 0 0;
        color: #ffffff;
        font-size: 27px;
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
        background: #f7fbff;
        color: #6f8498;
      }
      .search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        font-size: 14px;
      }
      .ap section {
        margin-top: 11px;
        width: 100%;
        max-width: 100%;
        display: grid;
        gap: 8px;
        overflow: hidden;
      }
      .ap article {
        position: relative;
        width: 100%;
        min-width: 0;
        color: #173652;
        min-height: 79px;
        padding: 10px 66px 10px 10px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #dce6f0;
        border-radius: 16px;
        background: #f9fbfd;
        box-shadow: 0 6px 18px rgba(10,76,138,.07);
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
        font-size: 11px;
      }
      .info b {
        margin-top: 3px;
        overflow: hidden;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .info span {
        margin-top: 5px;
        color: #7b8fa2;
        font-size: 11px;
      }
      .active,
      .lost {
        position: absolute;
        right: 34px;
        top: 10px;
        padding: 4px 6px;
        border-radius: 999px;
        font-size: 9px;
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
      .profileActions{position:absolute;right:9px;bottom:9px;display:flex;gap:5px}.editProfile,.deleteProfile{width:27px;height:27px;padding:0;display:grid;place-items:center;border:1px solid #cbddeb;border-radius:9px;background:#edf6ff;color:#1761bd;cursor:pointer}.deleteProfile{border-color:#f0cccc;background:#fff2f2;color:#c23838}.editProfile svg,.deleteProfile svg{width:14px;height:14px}.deleteProfile:disabled{opacity:.45;cursor:wait}
      .lostQuick{position:absolute;right:75px;bottom:9px;padding:5px 7px;border:1px solid #f0c6a0;border-radius:8px;background:#fff7ed;color:#a85a0a;text-decoration:none;font-size:8px;font-weight:900}.lostQuick.enabled{border-color:#e7aeb3;background:#fff0f1;color:#b52b37}
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
