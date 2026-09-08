"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Period = "1" | "3" | "6" | "12";
type Product = { type: string; icon: string; name: string; prices: Record<Period, number> };
type Profile = { id: number; tag_code: string; item_name: string | null; item_type: string | null; pet_type: string | null; created_at?: string | null };

const PERIODS: { value: Period; label: string }[] = [
  { value: "1", label: "1 თვე" }, { value: "3", label: "3 თვე" },
  { value: "6", label: "6 თვე" }, { value: "12", label: "1 წელი" },
];

const PRODUCTS: Product[] = [
  { type: "suitcase", icon: "🧳", name: "ჩემოდანი", prices: { "1": 2, "3": 5, "6": 9, "12": 16 } },
  { type: "keys", icon: "🔑", name: "გასაღები", prices: { "1": 2, "3": 5, "6": 9, "12": 16 } },
  { type: "wallet", icon: "👛", name: "საფულე", prices: { "1": 2, "3": 5, "6": 9, "12": 16 } },
  { type: "bag", icon: "👜", name: "ჩანთა", prices: { "1": 2, "3": 5, "6": 9, "12": 16 } },
  { type: "cat", icon: "🐱", name: "კატა", prices: { "1": 2, "3": 5, "6": 9, "12": 16 } },
  { type: "dog", icon: "🐶", name: "ძაღლი", prices: { "1": 3, "3": 8, "6": 15, "12": 27 } },
  { type: "emergency", icon: "🆘", name: "Emergency სამაჯური", prices: { "1": 5, "3": 13, "6": 24, "12": 43 } },
  { type: "parking", icon: "🚗", name: "Parking QR", prices: { "1": 6, "3": 15, "6": 27, "12": 49 } },
];

function normalizeType(profile: Profile) {
  const value = (profile.item_type === "pet" ? profile.pet_type : profile.item_type) || "";
  return value === "key" ? "keys" : value.toLowerCase();
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [period, setPeriod] = useState<Period>("6");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingItems, setPendingItems] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { void (async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { data } = await supabase.from("item").select("id,tag_code,item_name,item_type,pet_type,created_at").eq("owner_id", user.id).order("created_at", { ascending: false });
    const rows = (data || []) as Profile[];
    const requestedProfile = Number(new URLSearchParams(window.location.search).get("profile"));
    const initialProfile = rows.find((profile) => profile.id === requestedProfile) || rows[0];
    setProfiles(rows); setSelectedProfiles(initialProfile?.id ? [initialProfile.id] : []); setLoading(false);
    const { data: requests } = await supabase.from("service_activation_requests").select("item_id").eq("owner_id", user.id).eq("status", "pending");
    setPendingItems((requests || []).map((request) => Number(request.item_id)));
  })(); }, [router]);

  const selectedItems = useMemo(() => profiles.filter((item) => selectedProfiles.includes(item.id)), [profiles, selectedProfiles]);
  const subtotal = useMemo(() => selectedItems.reduce((sum, profile) => sum + (PRODUCTS.find((item) => item.type === normalizeType(profile))?.prices[period] || 0), 0), [selectedItems, period]);
  const discountPercent = selectedItems.length >= 8 ? 15 : selectedItems.length === 7 ? 12 : selectedItems.length >= 5 ? 10 : selectedItems.length >= 3 ? 5 : 0;
  const discountAmount = Number((subtotal * discountPercent / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  function toggleProfile(id: number) {
    setSelectedProfiles((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
  }

  async function requestActivation() {
    if (!selectedItems.length || submitting) return;
    setSubmitting(true); setMessage(""); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      if (selectedItems.some((profile) => pendingItems.includes(profile.id))) throw new Error("ერთ-ერთ არჩეულ პროფილზე მოთხოვნა უკვე გაგზავნილია.");
      const rows = selectedItems.map((profile) => {
        const base = PRODUCTS.find((item) => item.type === normalizeType(profile))?.prices[period] || 0;
        return { owner_id:user.id, item_id:profile.id, period_months:Number(period), base_amount:base, discount_percent:discountPercent, final_amount:Number((base*(1-discountPercent/100)).toFixed(2)), metadata:{tag_code:profile.tag_code} };
      });
      const { error: insertError } = await supabase.from("service_activation_requests").insert(rows);
      if (insertError) throw insertError;
      setPendingItems((current) => [...new Set([...current, ...selectedItems.map((profile) => profile.id)])]);
      setMessage("პაკეტის მოთხოვნა მიღებულია. დასტური გამოგეგზავნათ შეტყობინებებსა და QR RETURN-ის ჩატში.");
    } catch (err) { setError(err instanceof Error ? err.message : "მოთხოვნის გაგზავნა ვერ მოხერხდა."); }
    finally { setSubmitting(false); }
  }

  return <main className="subscriptionsPage">
    <header className="topbar">
      <Link href="/my-profiles" className="brand"><span>QR</span><div><strong>QR RETURN</strong><small>მფლობელის სივრცე</small></div></Link>
      <Link href="/my-profiles" className="back">← ჩემს პროფილებზე დაბრუნება</Link>
    </header>

    <section className="shell">
      <div className="intro"><div><small>მომსახურება და პაკეტები</small><h1>გააგრძელეთ თქვენი QR პროფილის მომსახურება</h1><p>აირჩიეთ პროფილი და სასურველი ვადა. თანხა ჩამოიჭრება მხოლოდ მოთხოვნის დადასტურების შემდეგ.</p></div><div className="free"><b>2 თვე</b><span>უფასო პერიოდი</span></div></div>

      <div className="layout">
        <section className="panel">
          <h2><span className="stepNumber">1</span> აირჩიეთ პროფილი</h2>
          {loading ? <div className="state">პროფილები იტვირთება...</div> : profiles.length ? <div className="profiles">{profiles.map((profile) => {
            const meta = PRODUCTS.find((item) => item.type === normalizeType(profile));
            const selected = selectedProfiles.includes(profile.id);
            return <button key={profile.id} className={selected ? "profile selected" : "profile"} onClick={() => toggleProfile(profile.id)}><span className="icon">{meta?.icon || "🏷️"}</span><span><b>{profile.item_name || meta?.name || "QR პროფილი"}</b><small>{meta?.name} · {profile.tag_code}</small></span><i>{selected ? "✓" : ""}</i></button>;
          })}</div> : <div className="state">ჯერ QR პროფილი არ გაქვს. <Link href="/register">პროფილის დამატება</Link></div>}

          <h2><span className="stepNumber">2</span> აირჩიეთ მომსახურების ვადა</h2>
          <div className="periods">{PERIODS.map((item) => { const sum = selectedItems.reduce((amount, profile) => amount + (PRODUCTS.find((p) => p.type === normalizeType(profile))?.prices[item.value] || 0), 0); return <button key={item.value} className={period === item.value ? "period active" : "period"} onClick={() => setPeriod(item.value)}><b>{item.label}</b><span>{selectedItems.length ? `${sum} ₾` : "—"}</span>{item.value === "12" && <em>საუკეთესო ფასი</em>}</button>; })}</div>
        </section>

        <aside className="summary">
          <small>თქვენი არჩევანი</small><h2>{selectedItems.length ? `${selectedItems.length} არჩეული პროფილი` : "აირჩიეთ პროფილი"}</h2>
          {selectedItems.length > 0 && <div className="chosen">{selectedItems.map((profile) => { const meta = PRODUCTS.find((item) => item.type === normalizeType(profile)); return <div key={profile.id}><span>{meta?.icon} {profile.item_name || meta?.name}</span><b>{meta?.prices[period] || 0} ₾</b></div>; })}</div>}
          <div className="line"><span>არჩეული ვადა</span><b>{PERIODS.find((item) => item.value === period)?.label}</b></div>
          <div className="line"><span>საწყისი ჯამი</span><b>{subtotal ? `${subtotal} ₾` : "—"}</b></div>
          <div className="line discount"><span>მრავალპროდუქტიანი ფასდაკლება</span><b>{discountPercent ? `−${discountPercent}%` : "0%"}</b></div>
          {discountAmount > 0 && <div className="saving">თქვენ დაზოგავთ <b>{discountAmount} ₾-ს</b></div>}
          <div className="total"><span>სულ გადასახდელი</span><strong>{total ? `${total} ₾` : "0 ₾"}</strong></div>
          {message && <div className="requestSuccess">✓ {message}</div>}
          {error && <div className="requestError">{error}</div>}
          <button disabled={!selectedItems.length || submitting} onClick={requestActivation}>{submitting ? "მოთხოვნა იგზავნება..." : "გააქტიურების მოთხოვნა"}</button>
          <p>მომსახურება ჩაირთვება QR RETURN-ის დადასტურების შემდეგ.</p>
        </aside>
      </div>

      <section className="prices"><div><small>სრული ტარიფები</small><h2>ყველა პროდუქტის ფასი</h2><p className="discountNote">3–4 პროდუქტი −5% · 5–6 პროდუქტი −10% · 7 პროდუქტი −12% · რვავე პროდუქტი −15%</p></div><div className="tableWrap"><table><thead><tr><th>პროდუქტი</th>{PERIODS.map((p) => <th key={p.value}>{p.label}</th>)}</tr></thead><tbody>{PRODUCTS.map((item) => <tr key={item.type}><td><span>{item.icon}</span><b>{item.name}</b></td>{PERIODS.map((p) => <td key={p.value}>{item.prices[p.value]} ₾</td>)}</tr>)}</tbody></table></div></section>
    </section>

    <style jsx>{`
      .stepNumber{width:27px;height:27px;margin-right:5px;display:inline-grid;place-items:center;border-radius:8px;background:#eaf3ff;color:#0966db;font-size:13px}.requestSuccess,.requestError{margin-top:14px;padding:11px 12px;border-radius:10px;font-size:12px;font-weight:800;line-height:1.45}.requestSuccess{background:#e8f8f0;color:#087443}.requestError{background:#fff0f0;color:#b42318}
      .chosen{margin:0 0 14px;padding:10px 12px;border-radius:12px;background:#f6f9fd}.chosen>div{padding:7px 0;display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e3eaf2;font-size:13px}.chosen>div:last-child{border-bottom:0}.discount b{color:#087443}.saving{margin-top:12px;padding:10px 12px;border-radius:11px;background:#e8f8f0;color:#087443;font-size:13px}.discountNote{margin:-10px 0 18px;color:#087443;font-size:14px;font-weight:800}
      :global(*){box-sizing:border-box}:global(body){margin:0;background:#063b72;color:#13283f}.subscriptionsPage{min-height:100vh;padding-bottom:52px;background:radial-gradient(circle at 16% 10%,rgba(75,174,249,.42),transparent 29%),linear-gradient(150deg,#0c5aa0 0%,#073f78 48%,#062f5d 100%);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.topbar{width:calc(100% - 32px);max-width:1120px;min-height:76px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.22)}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand>span{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#1266e9;font-weight:950}.brand strong,.brand small{display:block}.brand strong{font-size:17px}.brand small{margin-top:2px;color:#c6e6ff;font-size:12px}.back{padding:10px 13px;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;font-size:13px;font-weight:850}.shell{width:calc(100% - 28px);max-width:1120px;margin:30px auto}.intro{display:flex;align-items:center;justify-content:space-between;gap:24px;color:#fff}.intro small,.prices>div>small{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.intro h1{max-width:700px;margin:8px 0 9px;color:#fff;font-size:36px;line-height:1.16}.intro p{max-width:760px;margin:0;color:#d7ecff;font-size:16px;line-height:1.55}.free{min-width:185px;padding:17px 20px;border:1px solid rgba(255,255,255,.3);border-radius:17px;background:rgba(255,255,255,.13);color:#fff;text-align:center;box-shadow:inset 0 1px rgba(255,255,255,.15)}.free b,.free span{display:block}.free b{font-size:30px}.free span{margin-top:3px;color:#d8edff;font-size:13px}.layout{margin-top:24px;display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:16px}.panel,.summary,.prices{border:1px solid rgba(220,231,243,.95);border-radius:20px;background:#fff;box-shadow:0 18px 45px rgba(0,23,52,.2)}.panel{padding:24px}.panel h2{display:flex;align-items:center;margin:0 0 15px;color:#17324d;font-size:19px}.panel h2:not(:first-child){margin-top:25px}.profiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.profile{min-height:72px;padding:10px 12px;display:flex;align-items:center;gap:11px;border:1px solid #dbe5ef;border-radius:13px;background:#f8fbff;color:#13283f;text-align:left;cursor:pointer;transition:.18s ease}.profile:hover{border-color:#9fc3ed;transform:translateY(-1px)}.profile.selected{border:2px solid #1266e9;background:#edf5ff;box-shadow:0 5px 16px rgba(18,102,233,.12)}.profile .icon{width:43px;height:43px;display:grid;place-items:center;border-radius:11px;background:#fff;font-size:23px}.profile span:nth-child(2){min-width:0;flex:1}.profile b,.profile small{display:block}.profile b{font-size:15px}.profile small{margin-top:4px;overflow:hidden;color:#6a7d90;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.profile i{width:23px;height:23px;display:grid;place-items:center;border-radius:50%;background:#1266e9;color:#fff;font-style:normal}.periods{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.period{position:relative;min-height:94px;padding:14px 8px;border:1px solid #dbe5ef;border-radius:13px;background:#fff;color:#13283f;cursor:pointer}.period.active{border:2px solid #1266e9;background:#edf5ff;box-shadow:0 5px 16px rgba(18,102,233,.1)}.period b,.period span{display:block}.period b{font-size:14px}.period span{margin-top:8px;color:#1266e9;font-size:23px;font-weight:950}.period em{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);padding:3px 7px;border-radius:10px;background:#0b9b62;color:#fff;font-size:9px;font-style:normal;white-space:nowrap}.summary{align-self:start;padding:24px;position:sticky;top:18px}.summary>small{color:#1266e9;font-size:12px;font-weight:900}.summary h2{margin:8px 0 20px;color:#17324d;font-size:23px}.line{padding:12px 0;display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid #e5ebf2;color:#526b82;font-size:13px}.line b{color:#1b3852}.total{margin-top:16px;padding:16px;border-radius:13px;background:#eaf3ff}.total span,.total strong{display:block}.total span{color:#56718a;font-size:12px}.total strong{margin-top:5px;color:#0647c8;font-size:31px}.summary button{width:100%;min-height:50px;margin-top:14px;border:0;border-radius:11px;background:#1266e9;color:#fff;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 8px 18px rgba(18,102,233,.2)}.summary button:disabled{opacity:.45}.summary p{text-align:center;color:#718397;font-size:11px;line-height:1.4}.prices{margin-top:16px;padding:24px}.prices h2{margin:5px 0 18px;color:#17324d;font-size:25px}.tableWrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:13px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:14px}th{background:#f2f7fd;color:#536a80;font-size:12px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:9px;font-size:20px}tbody tr:hover{background:#f8fbff}.state{padding:25px;border:1px dashed #cbd9e8;border-radius:14px;text-align:center;color:#66798d}.state a{color:#1266e9;font-weight:800}
      .subscriptionsPage{background:linear-gradient(180deg,#eceeef 0%,#f5f6f6 42%,#fff 100%);color:#27333d}.topbar{width:100%;max-width:none;padding:0 max(24px,calc((100% - 1260px)/2));border-bottom:1px solid #d8dcdf;background:rgba(255,255,255,.92)}.brand{color:#27333d}.brand>span{background:#1266e9;color:#fff}.brand small{color:#7c878f}.back{border-color:#d7dcdf;background:#f3f4f4;color:#3e4b55}.shell{max-width:1260px;margin-top:25px}.intro{color:#27333d}.intro small{color:#1266e9}.intro h1{color:#202c35;font-size:32px}.intro p{color:#68747d;font-size:15px}.free{border:0;background:linear-gradient(135deg,#444d54,#69737a);color:#fff;box-shadow:0 8px 20px rgba(44,52,58,.12)}.free span{color:#eef1f2}.layout{grid-template-columns:minmax(0,1fr) 310px;padding:18px;border:1px solid #d9dddf;border-radius:18px;background:#fff;box-shadow:0 16px 38px rgba(38,48,56,.1)}.panel{padding:2px;border:0;background:transparent;box-shadow:none}.profiles{grid-template-columns:repeat(2,minmax(0,1fr))}.profile{background:#f5f6f6;border-color:#dadddf}.profile.selected{background:#eef3f7;border-color:#566d7d;box-shadow:0 5px 16px rgba(50,65,75,.1)}.profile i{background:#485963}.period.active{background:#eef1f3;border-color:#566d7d;box-shadow:0 5px 16px rgba(50,65,75,.08)}.period.active span{color:#334b59}.summary{padding:20px;border:0;border-radius:15px;background:#323a40;color:#fff;box-shadow:none}.summary>small{color:#c9d1d6}.summary h2{color:#fff}.chosen{background:rgba(255,255,255,.08)}.chosen>div{border-color:rgba(255,255,255,.13);color:#fff}.line{border-color:rgba(255,255,255,.14);color:#d7dde0}.line b{color:#fff}.total{background:#fff}.total strong{color:#313d45}.summary button{background:#fff;color:#303c44;box-shadow:none}.summary p{color:#d3dadd}.prices{margin-top:15px;border-color:#d9dddf;border-radius:15px;background:#fff;box-shadow:0 12px 30px rgba(38,48,56,.07)}.prices>div>small{color:#68747d}
      @media(max-width:760px){.subscriptionsPage{padding-bottom:24px}.topbar{width:100%;padding:0 12px;min-height:66px}.brand small{display:none}.back{padding:8px 9px;font-size:10px}.shell{width:calc(100% - 20px);margin:18px auto 0}.intro{padding:0 4px;align-items:flex-start;flex-direction:column;gap:15px}.intro h1{font-size:26px;line-height:1.18}.intro p{font-size:14px;line-height:1.55}.free{width:100%;padding:13px;display:flex;align-items:center;justify-content:center;gap:10px}.free b{font-size:24px}.free span{margin:0;font-size:13px}.layout{grid-template-columns:1fr;gap:16px;padding:12px}.panel{padding:2px}.panel h2{font-size:17px}.profiles{grid-template-columns:1fr}.periods{grid-template-columns:repeat(2,1fr)}.period{min-height:88px}.summary{position:static;padding:20px 15px}.prices{padding:20px 0}.prices>div{padding:0 15px}.prices h2{font-size:22px}.tableWrap{padding-left:12px}table{min-width:680px}th,td{padding:13px 10px}}
    `}</style>
  </main>;
}
