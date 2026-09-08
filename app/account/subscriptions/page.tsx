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
    const rows = (data || []) as Profile[]; setProfiles(rows); setSelectedProfiles(rows[0]?.id ? [rows[0].id] : []); setLoading(false);
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

  return <main className="page">
    <header className="topbar">
      <Link href="/my-profiles" className="brand"><span>QR</span><div><strong>QR RETURN</strong><small>მფლობელის სივრცე</small></div></Link>
      <Link href="/my-profiles" className="back">← ჩემს პროფილებზე დაბრუნება</Link>
    </header>

    <section className="shell">
      <div className="intro"><div><small>მომსახურება და პაკეტები</small><h1>აირჩიე QR პროფილის მომსახურების ვადა</h1><p>ყოველი ახალი პროფილი გააქტიურებიდან პირველი 2 თვე უფასოდ მუშაობს.</p></div><div className="free"><b>2 თვე</b><span>უფასო მომსახურება</span></div></div>

      <div className="layout">
        <section className="panel">
          <h2>1. აირჩიე შენი პროფილი</h2>
          {loading ? <div className="state">პროფილები იტვირთება...</div> : profiles.length ? <div className="profiles">{profiles.map((profile) => {
            const meta = PRODUCTS.find((item) => item.type === normalizeType(profile));
            const selected = selectedProfiles.includes(profile.id);
            return <button key={profile.id} className={selected ? "profile selected" : "profile"} onClick={() => toggleProfile(profile.id)}><span className="icon">{meta?.icon || "🏷️"}</span><span><b>{profile.item_name || meta?.name || "QR პროფილი"}</b><small>{meta?.name} · {profile.tag_code}</small></span><i>{selected ? "✓" : ""}</i></button>;
          })}</div> : <div className="state">ჯერ QR პროფილი არ გაქვს. <Link href="/register">პროფილის დამატება</Link></div>}

          <h2>2. აირჩიე ვადა</h2>
          <div className="periods">{PERIODS.map((item) => { const sum = selectedItems.reduce((amount, profile) => amount + (PRODUCTS.find((p) => p.type === normalizeType(profile))?.prices[item.value] || 0), 0); return <button key={item.value} className={period === item.value ? "period active" : "period"} onClick={() => setPeriod(item.value)}><b>{item.label}</b><span>{selectedItems.length ? `${sum} ₾` : "—"}</span>{item.value === "12" && <em>საუკეთესო ფასი</em>}</button>; })}</div>
        </section>

        <aside className="summary">
          <small>შეკვეთის შეჯამება</small><h2>{selectedItems.length ? `${selectedItems.length} არჩეული პროფილი` : "აირჩიე პროფილები"}</h2>
          {selectedItems.length > 0 && <div className="chosen">{selectedItems.map((profile) => { const meta = PRODUCTS.find((item) => item.type === normalizeType(profile)); return <div key={profile.id}><span>{meta?.icon} {profile.item_name || meta?.name}</span><b>{meta?.prices[period] || 0} ₾</b></div>; })}</div>}
          <div className="line"><span>არჩეული ვადა</span><b>{PERIODS.find((item) => item.value === period)?.label}</b></div>
          <div className="line"><span>საწყისი ჯამი</span><b>{subtotal ? `${subtotal} ₾` : "—"}</b></div>
          <div className="line discount"><span>მრავალპროდუქტიანი ფასდაკლება</span><b>{discountPercent ? `−${discountPercent}%` : "0%"}</b></div>
          {discountAmount > 0 && <div className="saving">თქვენ დაზოგავთ <b>{discountAmount} ₾-ს</b></div>}
          <div className="total"><span>სულ გადასახდელი</span><strong>{total ? `${total} ₾` : "0 ₾"}</strong></div>
          {message && <div className="requestSuccess">✓ {message}</div>}
          {error && <div className="requestError">{error}</div>}
          <button disabled={!selectedItems.length || submitting} onClick={requestActivation}>{submitting ? "იგზავნება..." : "გააქტიურების მოთხოვნის გაგზავნა"}</button>
          <p>მომსახურება ჩაირთვება QR RETURN-ის დადასტურების შემდეგ.</p>
        </aside>
      </div>

      <section className="prices"><div><small>სრული ტარიფები</small><h2>ყველა პროდუქტის ფასი</h2><p className="discountNote">3–4 პროდუქტი −5% · 5–6 პროდუქტი −10% · 7 პროდუქტი −12% · რვავე პროდუქტი −15%</p></div><div className="tableWrap"><table><thead><tr><th>პროდუქტი</th>{PERIODS.map((p) => <th key={p.value}>{p.label}</th>)}</tr></thead><tbody>{PRODUCTS.map((item) => <tr key={item.type}><td><span>{item.icon}</span><b>{item.name}</b></td>{PERIODS.map((p) => <td key={p.value}>{item.prices[p.value]} ₾</td>)}</tr>)}</tbody></table></div></section>
    </section>

    <style jsx global>{`
      .requestSuccess,.requestError{margin-top:14px;padding:11px 12px;border-radius:10px;font-size:12px;font-weight:800;line-height:1.45}.requestSuccess{background:#e8f8f0;color:#087443}.requestError{background:#fff0f0;color:#b42318}
      .chosen{margin:0 0 14px;padding:10px 12px;border-radius:12px;background:#f6f9fd}.chosen>div{padding:7px 0;display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e3eaf2;font-size:13px}.chosen>div:last-child{border-bottom:0}.discount b{color:#087443}.saving{margin-top:12px;padding:10px 12px;border-radius:11px;background:#e8f8f0;color:#087443;font-size:13px}.discountNote{margin:-10px 0 18px;color:#087443;font-size:14px;font-weight:800}
      *{box-sizing:border-box}body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;background:radial-gradient(circle at 18% 12%,rgba(70,167,246,.36),transparent 28%),linear-gradient(180deg,#0a4c8a,#063b72);color:#13283f}.page{min-height:100vh;padding-bottom:60px}.topbar{width:calc(100% - 32px);max-width:1120px;min-height:76px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.2)}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand>span{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#1266e9;font-weight:950}.brand strong,.brand small{display:block}.brand strong{font-size:17px}.brand small{margin-top:2px;color:#b9ddfc;font-size:12px}.back{color:#fff;text-decoration:none;font-size:14px;font-weight:800}.shell{width:calc(100% - 28px);max-width:1120px;margin:28px auto}.intro{display:flex;align-items:center;justify-content:space-between;gap:24px;color:#fff}.intro small,.prices>div>small{font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.intro h1{max-width:700px;margin:8px 0;font-size:34px;line-height:1.2}.intro p{margin:0;color:#d8edff;font-size:17px}.free{min-width:190px;padding:18px 22px;border:1px solid rgba(255,255,255,.25);border-radius:18px;background:rgba(255,255,255,.12);text-align:center}.free b,.free span{display:block}.free b{font-size:30px}.free span{margin-top:3px;font-size:14px}.layout{margin-top:24px;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:18px}.panel,.summary,.prices{border:1px solid #dce7f3;border-radius:22px;background:#fff;box-shadow:0 20px 55px rgba(0,26,60,.18)}.panel{padding:25px}.panel h2{margin:0 0 15px;font-size:19px}.panel h2:not(:first-child){margin-top:26px}.profiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.profile{min-height:72px;padding:10px 12px;display:flex;align-items:center;gap:11px;border:1px solid #dbe5ef;border-radius:14px;background:#f8fbff;color:#13283f;text-align:left;cursor:pointer}.profile.selected{border:2px solid #1266e9;background:#edf5ff}.profile .icon{width:43px;height:43px;display:grid;place-items:center;border-radius:12px;background:#fff;font-size:23px}.profile span:nth-child(2){min-width:0;flex:1}.profile b,.profile small{display:block}.profile b{font-size:15px}.profile small{margin-top:4px;overflow:hidden;color:#6a7d90;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.profile i{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#1266e9;color:#fff;font-style:normal}.periods{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.period{position:relative;min-height:94px;padding:14px 8px;border:1px solid #dbe5ef;border-radius:14px;background:#fff;color:#13283f;cursor:pointer}.period.active{border:2px solid #1266e9;background:#edf5ff}.period b,.period span{display:block}.period b{font-size:14px}.period span{margin-top:8px;color:#1266e9;font-size:22px;font-weight:950}.period em{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);padding:3px 7px;border-radius:10px;background:#0b9b62;color:#fff;font-size:9px;font-style:normal;white-space:nowrap}.summary{align-self:start;padding:25px;position:sticky;top:18px}.summary>small{color:#1266e9;font-size:13px;font-weight:900}.summary h2{margin:8px 0 22px;font-size:23px}.line{padding:13px 0;display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid #e5ebf2;font-size:14px}.total{margin-top:18px;padding:17px;border-radius:14px;background:#eaf3ff}.total span,.total strong{display:block}.total span{font-size:13px}.total strong{margin-top:5px;color:#0647c8;font-size:31px}.summary button{width:100%;min-height:52px;margin-top:15px;border:0;border-radius:12px;background:#1266e9;color:#fff;font-size:16px;font-weight:900;cursor:pointer}.summary button:disabled{opacity:.45}.summary p{text-align:center;color:#718397;font-size:12px}.prices{margin-top:18px;padding:25px}.prices h2{margin:5px 0 18px;font-size:25px}.tableWrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:14px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:15px}th{background:#f2f7fd;color:#536a80;font-size:13px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:9px;font-size:21px}tbody tr:hover{background:#f8fbff}.state{padding:25px;border:1px dashed #cbd9e8;border-radius:14px;text-align:center;color:#66798d}.state a{color:#1266e9;font-weight:800}
      @media(max-width:760px){.topbar{min-height:66px}.brand small{display:none}.back{font-size:12px}.shell{width:100%;margin:18px auto 0}.intro{padding:0 15px;align-items:flex-start}.intro h1{font-size:26px}.intro p{font-size:15px}.free{min-width:105px;padding:12px}.free b{font-size:23px}.free span{font-size:11px}.layout{grid-template-columns:1fr}.panel,.summary,.prices{border-radius:18px 18px 0 0;border-left:0;border-right:0}.panel{padding:18px 14px}.profiles{grid-template-columns:1fr}.periods{grid-template-columns:repeat(2,1fr)}.summary{position:static;border-radius:0;padding:20px 15px}.prices{border-radius:0;padding:20px 0}.prices>div{padding:0 15px}.tableWrap{padding-left:12px}table{min-width:680px}th,td{padding:13px 10px}.intro{flex-direction:column}.free{width:100%;display:flex;align-items:center;justify-content:center;gap:10px}.free span{margin:0;font-size:13px}}
    `}</style>
  </main>;
}
