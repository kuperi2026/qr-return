"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id: string; tag_code: string | null; item_type: string | null; pet_type: string | null;
  item_name: string | null; photo: string | null; active: boolean | null;
  lost: boolean | null; scan_count: number | null;
};

const profileType = (profile: Profile) => profile.item_type || profile.pet_type || "QR პროფილი";
function profileIcon(profile: Profile) {
  const type = profileType(profile).toLowerCase();
  if (type.includes("dog")) return "🐕";
  if (type.includes("cat")) return "🐈";
  if (type.includes("suitcase")) return "▣";
  if (type.includes("emergency")) return "✚";
  if (type.includes("wallet")) return "▤";
  return "⌁";
}

export default function AppProfiles() {
  const router = useRouter();
  const [items, setItems] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
      if (!url || !key) return setLoading(false);
      const supabase = createClient(url, key);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login?source=app&next=%2Fapp%2Fprofiles"); return; }
      const { data } = await supabase.from("item").select("id,tag_code,item_type,pet_type,item_name,photo,active,lost,scan_count").eq("owner_id", user.id);
      const profiles = (data || []) as Profile[];
      setItems(profiles);
      setOpenId(profiles[0]?.id || null);
      setLoading(false);
    })();
  }, [router]);

  const lostCount = useMemo(() => items.filter((profile) => profile.lost).length, [items]);

  return (
    <main className="profilesPage">
      <div className="profilesWrap">
        <header className="profilesHeader">
          <div><small>ჩემი სივრცე</small><h1>პროფილების მართვა</h1><p>ყველა შექმნილი QR პროფილი ერთ ადგილას</p></div>
          <Link href="/app/add" aria-label="ახალი პროფილის რეგისტრაცია">＋</Link>
        </header>

        {!loading && items.length > 0 && (
          <section className="profilesSummary">
            <div><b>{items.length} აქტიური პროფილი</b><span>{lostCount ? `${lostCount} პროფილს ჩართული აქვს Lost Mode` : "ყველა პროფილი უსაფრთხოდ არის"}</span></div>
            <em>{lostCount ? "საჭიროა ყურადღება" : "უსაფრთხოა"}</em>
          </section>
        )}

        {loading ? <div className="profilesState">პროფილები იტვირთება…</div> : items.length === 0 ? (
          <section className="profilesState empty"><b>ჯერ შექმნილი პროფილი არ გაქვს</b><span>დაამატე პირველი QR პროფილი და მართე აქედან.</span><Link href="/app/add">＋ პროფილის დამატება</Link></section>
        ) : (
          <section className="profilesList">
            {items.map((profile) => {
              const expanded = openId === profile.id;
              const href = `/app/product/${profile.tag_code}`;
              return (
                <article className={`profileCard ${expanded ? "expanded" : ""}`} key={profile.id}>
                  <button className="profileMain" type="button" onClick={() => setOpenId(expanded ? null : profile.id)} aria-expanded={expanded}>
                    <span className="profilePhoto">{profile.photo ? <Image src={profile.photo} alt="" fill sizes="48px" unoptimized /> : profileIcon(profile)}</span>
                    <span className="profileInfo"><small>{profileType(profile)}</small><b>{profile.item_name || "უსახელო პროფილი"}</b><em>QR {profile.tag_code || "—"} · {profile.scan_count || 0} სკანირება</em></span>
                    <span className={`profileStatus ${profile.lost ? "lost" : "active"}`}>{profile.lost ? "დაკარგულია" : "აქტიური"}</span>
                    <span className="profileChevron">⌄</span>
                  </button>
                  {expanded && (
                    <div className="profileActions">
                      <Link href={`${href}?panel=edit`}><span>✎</span><b>რედაქტირება</b></Link>
                      <Link className={profile.lost ? "lost enabled" : "lost"} href={`${href}?panel=lost`}><span>!</span><b>Lost Mode</b></Link>
                      <Link href={`${href}?panel=visibility`}><span>◉</span><b>ხილვადობა</b></Link>
                      <Link className="manage" href={href}>პროფილის სრულად მართვა <span>→</span></Link>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
      <style jsx global>{`
        .profilesPage,.profilesPage *{box-sizing:border-box}.profilesPage{min-height:100vh;overflow-x:hidden;background:radial-gradient(circle at 15% 5%,rgba(115,205,255,.25),transparent 32%),linear-gradient(180deg,#f0f9ff 0%,#fbfeff 75%);color:#163a52;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.profilesWrap{width:min(480px,calc(100% - 28px));margin:auto;padding:25px 0 104px}.profilesHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.profilesHeader small{color:#1478d4;font-size:12px;font-weight:900}.profilesHeader h1{margin:7px 0 0;font-size:27px;line-height:1.18}.profilesHeader p{margin:8px 0 0;color:#758b99;font-size:13px}.profilesHeader>a{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:14px;background:#1478d4;color:#fff;text-decoration:none;font-size:25px;box-shadow:0 9px 20px rgba(20,120,212,.22)}.profilesSummary{min-height:70px;margin-top:21px;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:20px;background:#103b5c;color:#fff}.profilesSummary b,.profilesSummary span{display:block}.profilesSummary b{font-size:15px}.profilesSummary span{margin-top:5px;color:#cfeaff;font-size:10px}.profilesSummary em{padding:7px 9px;border-radius:999px;background:#e5f7f0;color:#16825f;font-size:10px;font-style:normal;font-weight:900;text-align:center}.profilesList{margin-top:14px;display:grid;gap:10px}.profileCard{overflow:hidden;border:1px solid #d9e9f2;border-radius:20px;background:#fff;box-shadow:0 8px 24px rgba(16,59,92,.06)}.profileMain{position:relative;width:100%;min-height:79px;padding:12px 88px 12px 12px;display:flex;align-items:center;gap:12px;border:0;background:transparent;color:#163a52;text-align:left;font:inherit;cursor:pointer}.profilePhoto{position:relative;width:50px;height:50px;display:grid;place-items:center;flex:0 0 50px;overflow:hidden;border-radius:15px;background:#eff7fc;color:#103b5c;font-size:20px;font-weight:900}.profilePhoto img{object-fit:cover}.profileInfo{min-width:0;flex:1}.profileInfo small,.profileInfo b,.profileInfo em{display:block}.profileInfo small{color:#758b99;font-size:10px}.profileInfo b{margin-top:3px;overflow:hidden;font-size:15px;text-overflow:ellipsis;white-space:nowrap}.profileInfo em{margin-top:5px;overflow:hidden;color:#758b99;font-size:9px;font-style:normal;text-overflow:ellipsis;white-space:nowrap}.profileStatus{position:absolute;top:12px;right:13px;padding:6px 8px;border-radius:999px;font-size:9px;font-weight:900}.profileStatus.active{background:#e5f7f0;color:#16825f}.profileStatus.lost{background:#fff4df;color:#b46a10}.profileChevron{position:absolute;right:17px;bottom:12px;color:#1478d4;font-size:17px;font-weight:900;transition:transform .2s}.profileCard.expanded .profileChevron{transform:rotate(180deg)}.profileActions{padding:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;border-top:1px solid #d9e9f2}.profileActions>a{min-height:52px;padding:7px 4px;display:grid;place-items:center;align-content:center;gap:3px;border-radius:14px;background:#eff7fc;color:#163a52;text-align:center;text-decoration:none}.profileActions>a>span{color:#1478d4;font-size:15px;font-weight:900}.profileActions>a>b{font-size:9px}.profileActions>a.lost{background:#fff4df}.profileActions>a.lost>span{color:#d78319}.profileActions>a.lost.enabled{background:#fff0f1}.profileActions>a.manage{min-height:42px;grid-column:1/-1;padding:0 13px;display:flex;align-items:center;justify-content:space-between;background:#1478d4;color:#fff;font-size:11px;font-weight:900}.profileActions>a.manage span{color:#fff}.profilesState{margin-top:22px;padding:24px;border:1px dashed #bdd3e6;border-radius:18px;background:#fff;color:#60798e;text-align:center;font-size:12px}.profilesState.empty{display:grid;gap:8px}.profilesState b{color:#254b6a;font-size:15px}.profilesState a{min-height:42px;margin-top:5px;display:grid;place-items:center;border-radius:12px;background:#1478d4;color:#fff;text-decoration:none;font-weight:900}@media(max-width:360px){.profileMain{padding-right:76px}.profilesSummary{align-items:flex-start;flex-direction:column}.profilesSummary em{align-self:flex-start}}
      `}</style>
    </main>
  );
}
