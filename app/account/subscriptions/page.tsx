"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Period = "1" | "3" | "6" | "12";
type Product = { type: string; icon: string; name: string; prices: Record<Period, number> };
type Profile = { id: number; tag_code: string; item_name: string | null; item_type: string | null; pet_type: string | null; created_at?: string | null };
type ServiceRequest = {
  id: string;
  item_id: number;
  period_months: number;
  final_amount: number;
  status: string;
  requested_at: string;
  confirmed_at: string | null;
  service_starts_at: string | null;
  service_expires_at: string | null;
};

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

const PROFILE_CATEGORIES = [
  { type: "dog", icon: "🐶", label: "ძაღლები" },
  { type: "cat", icon: "🐱", label: "კატები" },
  { type: "emergency", icon: "🆘", label: "Emergency სამაჯურები" },
  { type: "keys", icon: "🔑", label: "გასაღებები" },
  { type: "wallet", icon: "👛", label: "საფულეები" },
  { type: "bag", icon: "👜", label: "ჩანთები" },
  { type: "suitcase", icon: "🧳", label: "ჩემოდნები" },
  { type: "parking", icon: "🚗", label: "Parking QR" },
] as const;

function normalizeType(profile: Profile) {
  const value = (profile.item_type === "pet" ? profile.pet_type : profile.item_type) || "";
  return value === "key" ? "keys" : value.toLowerCase();
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<number[]>([]);
  const [period, setPeriod] = useState<Period>("6");
  const [profilePeriods, setProfilePeriods] = useState<Record<number, Period>>({});
  const [isAppPricing, setIsAppPricing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pendingItems, setPendingItems] = useState<number[]>([]);
  const [history, setHistory] = useState<ServiceRequest[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [appStep, setAppStep] = useState<1 | 2 | 3>(1);
  const [openCategory, setOpenCategory] = useState("");
  const [openPricingPanel, setOpenPricingPanel] = useState<"prices" | "guide" | null>(null);

  useEffect(() => { void (async () => {
    const params = new URLSearchParams(window.location.search);
    const appContext = params.get("source") === "app" || params.get("app_preview") === "1" || window.localStorage.getItem("kompasi-app-mode") === "1";
    setIsAppPricing(appContext);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/login"); return; }
    const { data } = await supabase.from("item").select("id,tag_code,item_name,item_type,pet_type,created_at").eq("owner_id", user.id).order("created_at", { ascending: false });
    const rows = (data || []) as Profile[];
    const requestedProfile = Number(new URLSearchParams(window.location.search).get("profile"));
    const initialProfile = rows.find((profile) => profile.id === requestedProfile) || rows[0];
    setProfiles(rows); setSelectedProfiles(!appContext && initialProfile?.id ? [initialProfile.id] : []);
    setOpenCategory(initialProfile ? normalizeType(initialProfile) : ""); setLoading(false);
    const { data: requests } = await supabase
      .from("service_activation_requests")
      .select("id,item_id,period_months,final_amount,status,requested_at,confirmed_at,service_starts_at,service_expires_at")
      .eq("owner_id", user.id)
      .order("requested_at", { ascending: false });
    const requestRows = (requests || []) as ServiceRequest[];
    setHistory(requestRows);
    setPendingItems(requestRows.filter((request) => request.status === "pending").map((request) => Number(request.item_id)));
  })(); }, [router]);

  const selectedItems = useMemo(() => profiles.filter((item) => selectedProfiles.includes(item.id)), [profiles, selectedProfiles]);
  const profileGroups = useMemo(() => {
    const groups = PROFILE_CATEGORIES.map((category) => ({
      ...category,
      profiles: profiles.filter((profile) => normalizeType(profile) === category.type),
    })).filter((category) => category.profiles.length > 0);
    const knownTypes = new Set(PROFILE_CATEGORIES.map((category) => category.type as string));
    const otherProfiles = profiles.filter((profile) => !knownTypes.has(normalizeType(profile)));
    return otherProfiles.length ? [...groups, { type: "other", icon: "🏷️", label: "სხვა პროფილები", profiles: otherProfiles }] : groups;
  }, [profiles]);
  const selectedPeriod = (profileId: number): Period | null => isAppPricing ? (profilePeriods[profileId] || null) : period;
  const subtotal = useMemo(() => selectedItems.reduce((sum, profile) => { const chosenPeriod = isAppPricing ? profilePeriods[profile.id] : period; return sum + (chosenPeriod ? (PRODUCTS.find((item) => item.type === normalizeType(profile))?.prices[chosenPeriod] || 0) : 0); }, 0), [selectedItems, period, profilePeriods, isAppPricing]);
  const hasIncompletePeriods = isAppPricing && selectedItems.some((profile) => !profilePeriods[profile.id]);
  const discountPercent = selectedItems.length >= 8 ? 15 : selectedItems.length === 7 ? 12 : selectedItems.length >= 5 ? 10 : selectedItems.length >= 3 ? 5 : 0;
  const discountAmount = Number((subtotal * discountPercent / 100).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  function toggleProfile(id: number) {
    setSelectedProfiles((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      setOpenPricingPanel("prices");
      return [...current, id];
    });
  }

  function chooseProfilePeriod(id: number, chosenPeriod: Period) {
    const alreadyActive = selectedProfiles.includes(id) && profilePeriods[id] === chosenPeriod;
    setSelectedProfiles((current) => alreadyActive ? current.filter((value) => value !== id) : current.includes(id) ? current : [...current, id]);
    setProfilePeriods((current) => {
      if (!alreadyActive) return { ...current, [id]: chosenPeriod };
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  async function requestActivation() {
    if (!selectedItems.length || submitting) return;
    setSubmitting(true); setMessage(""); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login"); return; }
      if (selectedItems.some((profile) => pendingItems.includes(profile.id))) throw new Error("ერთ-ერთ არჩეულ პროფილზე მოთხოვნა უკვე გაგზავნილია.");
      if (hasIncompletePeriods) throw new Error("ყველა არჩეულ პროფილს კალენდარში მიუთითეთ მომსახურების ვადა.");
      const rows = selectedItems.map((profile) => {
        const profilePeriod = selectedPeriod(profile.id);
        if (!profilePeriod) throw new Error("პროფილის მომსახურების ვადა არჩეული არ არის.");
        const base = PRODUCTS.find((item) => item.type === normalizeType(profile))?.prices[profilePeriod] || 0;
        return { owner_id:user.id, item_id:profile.id, period_months:Number(profilePeriod), base_amount:base, discount_percent:discountPercent, final_amount:Number((base*(1-discountPercent/100)).toFixed(2)), metadata:{tag_code:profile.tag_code} };
      });
      const { error: insertError } = await supabase.from("service_activation_requests").insert(rows);
      if (insertError) throw insertError;
      setPendingItems((current) => [...new Set([...current, ...selectedItems.map((profile) => profile.id)])]);
      setMessage("პაკეტის მოთხოვნა მიღებულია. დასტური გამოგეგზავნათ შეტყობინებებსა და QR RETURN-ის ჩატში.");
    } catch (err) { setError(err instanceof Error ? err.message : "მოთხოვნის გაგზავნა ვერ მოხერხდა."); }
    finally { setSubmitting(false); }
  }

  return <main className="subscriptionsPage" data-app-step={appStep}>
    <header className="topbar">
      <Link href="/my-profiles" className="brand"><span>QR</span><div><strong>QR RETURN</strong><small>მფლობელის სივრცე</small></div></Link>
      <Link href="/my-profiles" className="back">← ჩემს პროფილებზე დაბრუნება</Link>
    </header>

    <section className="shell">
      <Link href="/app/products" className="appBack" style={{ display: "none" }}>← ჰაბში დაბრუნება</Link>
      <section className="appTariffHeader">
        <small>მომსახურება და პაკეტები</small>
        <h1>ყველა პროდუქტის ტარიფი</h1>
        <p>თითოეული QR კოდის გააქტიურებიდან პირველი <b>60 დღე უფასოა</b>.</p>
        <Link className="appVideoGuide" href="/app/guides"><span>▶</span><b>ვიდეო ინსტრუქცია</b><small>ნახეთ კალენდარში არჩევა და შეძენა</small><i>›</i></Link>
        <details className="purchaseGuide" open={openPricingPanel === "guide"} onToggle={(event) => { if (event.currentTarget.open) setOpenPricingPanel("guide"); else if (openPricingPanel === "guide") setOpenPricingPanel(null); }}><summary><span>ტარიფები, ფასდაკლება და ინსტრუქცია</span><b>გახსნა ⌄</b></summary><div><article><i>1</i><p><b>პროფილები ავტომატურად ჩანს</b><span>არჩევის კალენდარში მხოლოდ თქვენს ანგარიშზე უკვე შექმნილი QR პროფილებია.</span></p></article><article><i>2</i><p><b>ფასზე დაჭერა ნიშნავს არჩევას</b><span>თითოეულ პროფილს პირდაპირ მიანიჭეთ 1, 3, 6 ან 12 თვე; აქტიურ ფასზე მეორედ დაჭერა არჩევანს მოხსნის.</span></p></article><article><i>3</i><p><b>ერთიანი შეჯამება</b><span>სხვადასხვა ვადა ერთ შეკვეთაში გაერთიანდება და თითოეული ცალკე გამოჩნდება.</span></p></article><article><i>4</i><p><b>რაოდენობრივი ფასდაკლება</b><span>3–4 პროფილი −5% · 5–6 −10% · 7 −12% · 8 ან მეტი −15%.</span></p></article><section className="referencePriceTable" aria-label="ყველა პროდუქტის ტარიფები"><header><span>ყველა პროდუქტის ტარიფი</span><small>საინფორმაციო ცხრილი</small></header><div className="referencePriceHead"><b>პროდუქტი</b>{PERIODS.map((item) => <span key={item.value}>{item.label}</span>)}</div>{PRODUCTS.map((product) => <div className="referencePriceRow" key={product.type}><b>{product.icon} {product.name}</b>{PERIODS.map((item) => <span key={item.value}>{product.prices[item.value]}₾</span>)}</div>)}</section><footer>ფასიანი ვადა იწყება თითოეული QR კოდის უფასო 60-დღიანი პერიოდის დასრულების შემდეგ.</footer></div></details>
      </section>
      <div className="intro"><div><small>მომსახურება და პაკეტები</small><h1>გააგრძელეთ თქვენი QR პროფილის მომსახურება</h1><p>ყოველი QR კოდის გააქტიურებიდან პირველი 60 დღის განმავლობაში მომსახურება უფასოა.</p></div><div className="free"><b>60 დღე უფასოდ</b><span>თითოეული QR კოდის გააქტიურებიდან</span></div></div>

      <nav className="appCheckoutSteps" aria-label="პაკეტის გააქტიურების ეტაპები">
        {([1, 3] as const).map((step) => (
          <button key={step} type="button" className={appStep === step ? "active" : appStep > step ? "done" : ""} onClick={() => setAppStep(step)}>
            <span>{appStep > step ? "✓" : step === 1 ? "1" : "2"}</span>
            <b>{step === 1 ? "პროფილი და ფასი" : "შეჯამება"}</b>
          </button>
        ))}
      </nav>

      <div className="layout">
        <section className="panel">
          <div className="checkoutStage profileStage"><h2><span className="stepNumber">1</span> შექმნილი პროფილების ვადა</h2>
          <section className="liveCalculator" aria-label="ფასის კალკულატორი">
            <header><div><small>უკვე დარეგისტრირებული პროფილები</small><h3>აირჩიეთ პროფილი და ვადა</h3></div><div><span>{selectedItems.length} არჩეული</span><strong>{selectedItems.length ? `${total} ₾` : "—"}</strong></div></header>
            {loading ? <div className="calendarEmpty">პროფილები იტვირთება...</div> : profiles.length ? <section className="priceInstructions appProfileCalendar"><div className="priceCalendar"><div className="priceCalendarHead"><span>პროფილი</span>{PERIODS.map((item) => <b key={item.value}>{item.label}</b>)}</div>{PRODUCTS.map((product) => { const owned = profiles.filter((profile) => normalizeType(profile) === product.type); if (!owned.length) return null; return <section key={product.type} className="chosenProductGroup"><header><span>{product.icon} {product.name}</span><b>{owned.length} პროფილი</b></header>{owned.map((profile) => { const ownPeriod = profilePeriods[profile.id] || null; const selected = selectedProfiles.includes(profile.id); return <article key={profile.id} className={selected ? "chosenProduct selectedCalendarProfile" : "chosenProduct"}><span><strong>{profile.item_name || profile.tag_code}</strong><small>{profile.tag_code}</small></span>{PERIODS.map((item) => { const active = selected && ownPeriod === item.value; return <button key={item.value} type="button" className={active ? "active" : ""} onClick={() => chooseProfilePeriod(profile.id, item.value)}><span>{product.prices[item.value]}₾</span>{active && <i>✓</i>}</button>; })}</article>; })}</section>; })}</div></section> : <div className="calendarEmpty"><b>გასააქტიურებელი პროფილი არ გაქვთ</b><span>ჯერ შექმენით QR პროფილი და ის ავტომატურად გამოჩნდება ამ კალენდარში.</span><Link href="/app/add">+ პროფილის დამატება</Link></div>}
            <details className="purchaseGuide" open={openPricingPanel === "guide"} onToggle={(event) => { if (event.currentTarget.open) setOpenPricingPanel("guide"); else if (openPricingPanel === "guide") setOpenPricingPanel(null); }}><summary><span>ფასები და როგორ მუშაობს?</span><b>ინსტრუქცია ⌄</b></summary><div><article><i>1</i><p><b>პროფილები ავტომატურად ჩანს</b><span>კალენდარში მხოლოდ თქვენს ანგარიშზე უკვე შექმნილი QR პროფილებია.</span></p></article><article><i>2</i><p><b>ფასზე დაჭერა ნიშნავს არჩევას</b><span>თითოეულ პროფილს პირდაპირ მიანიჭეთ 1, 3, 6 ან 12 თვე; აქტიურ ფასზე მეორედ დაჭერა არჩევანს მოხსნის.</span></p></article><article><i>3</i><p><b>მიიღეთ ერთიანი შეჯამება</b><span>სხვადასხვა ვადა ერთ შეკვეთაში გაერთიანდება და თითოეული ცალკე გამოჩნდება.</span></p></article><article><i>4</i><p><b>რაოდენობრივი ფასდაკლება</b><span>3–4 პროფილი −5% · 5–6 −10% · 7 −12% · 8 ან მეტი −15%.</span></p></article><section className="referencePriceTable" aria-label="ყველა პროდუქტის ტარიფები"><header><span>ყველა პროდუქტის ტარიფი</span><small>საინფორმაციო ცხრილი</small></header><div className="referencePriceHead"><b>პროდუქტი</b>{PERIODS.map((item) => <span key={item.value}>{item.label}</span>)}</div>{PRODUCTS.map((product) => <div className="referencePriceRow" key={product.type}><b>{product.icon} {product.name}</b>{PERIODS.map((item) => <span key={item.value}>{product.prices[item.value]}₾</span>)}</div>)}</section><footer>თითოეული QR კოდის გააქტიურებიდან პირველი <b>60 დღე უფასოა</b>. ფასიანი ვადა იწყება უფასო პერიოდის დასრულების შემდეგ.</footer></div></details>
          </section>
          {loading ? <div className="state">პროფილები იტვირთება...</div> : profiles.length ? <div className="profilePicker">
            <div className="categoryTabs" role="tablist" aria-label="პროფილის კატეგორიები">{profileGroups.map((group) => {
              const active = openCategory === group.type;
              const selectedCount = group.profiles.filter((profile) => selectedProfiles.includes(profile.id)).length;
              return <button key={group.type} type="button" role="tab" aria-selected={active} className={active ? "categoryTab active" : "categoryTab"} onClick={() => setOpenCategory(group.type)}>
                <span className="groupIcon">{group.icon}</span><span className="groupTitle"><b>{group.label}</b><small>{group.profiles.length} პროფილი</small></span>{selectedCount > 0 && <i>{selectedCount}</i>}
              </button>;
            })}</div>
            {profileGroups.map((group) => {
              if (group.type !== openCategory) return null;
              return <section key={group.type} className="activeProfiles" role="tabpanel">
              <div className="activeProfilesHeading"><div><span>{group.icon}</span><b>{group.label}</b></div><small>აირჩიეთ ერთი ან რამდენიმე</small></div>
              <div className="profiles">{group.profiles.map((profile) => {
                const meta = PRODUCTS.find((item) => item.type === normalizeType(profile));
                const selected = selectedProfiles.includes(profile.id);
                const ownPeriod = selectedPeriod(profile.id);
                return <article key={profile.id} className={selected ? "profileOption selected" : "profileOption"}><button className={selected ? "profile selected" : "profile"} onClick={() => toggleProfile(profile.id)}><span className="icon">{meta?.icon || "🏷️"}</span><span><b>{profile.item_name || meta?.name || "QR პროფილი"}</b><small>{meta?.name} · {profile.tag_code}</small></span><span className="profilePrice">{selected && ownPeriod ? `${meta?.prices[ownPeriod] || 0} ₾` : selected ? "ვადა აირჩიეთ" : ""}<small>{selected && ownPeriod ? PERIODS.find((item) => item.value === ownPeriod)?.label : ""}</small></span><i>{selected ? "✓" : ""}</i></button>{selected && !isAppPricing && <div className="profileTerms"><div className="desktopProfileTerm"><span>არჩეული ვადა</span><b>{PERIODS.find((item) => item.value === ownPeriod)?.label}</b></div><div className="desktopProfileTerm"><span>პროფილის ფასი</span><b>{ownPeriod ? meta?.prices[ownPeriod] || 0 : 0} ₾</b></div><p className="repeatedFreePeriod">QR კოდის გააქტიურების შემდეგ მომსახურებით სარგებლობა 60 დღის განმავლობაში უფასოა.</p></div>}</article>;
              })}</div>
            </section>;})}
          </div> : <div className="state">ჯერ QR პროფილი არ გაქვს. <Link href="/register">პროფილის დამატება</Link></div>}
          <button type="button" className="appNext" disabled={!selectedProfiles.length || hasIncompletePeriods} onClick={() => setAppStep(3)}>{hasIncompletePeriods ? "ყველა პროფილს აირჩიეთ ვადა" : `შეჯამება · ${selectedItems.length ? `${total} ₾` : "—"}`} <span>→</span></button>
          </div>

          <div className="checkoutStage periodStage"><h2><span className="stepNumber">2</span> აირჩიეთ მომსახურების ვადა</h2>
          <details className="inlineProfileEditor">
            <summary><span><small>არჩეული პროფილი</small><b>{selectedItems.map((profile) => profile.item_name || profile.tag_code).join(", ")}</b></span><strong>შეცვლა ⌄</strong></summary>
            <div className="inlineProfileEditorBody">
              <div className="categoryTabs" role="tablist" aria-label="პროფილის კატეგორიები">{profileGroups.map((group) => <button key={group.type} type="button" role="tab" aria-selected={openCategory === group.type} className={openCategory === group.type ? "categoryTab active" : "categoryTab"} onClick={() => setOpenCategory(group.type)}><span className="groupIcon">{group.icon}</span><span className="groupTitle"><b>{group.label}</b><small>{group.profiles.length} პროფილი</small></span></button>)}</div>
              {profileGroups.map((group) => group.type === openCategory && <div key={group.type} className="profiles">{group.profiles.map((profile) => { const meta = PRODUCTS.find((item) => item.type === normalizeType(profile)); const selected = selectedProfiles.includes(profile.id); return <button key={profile.id} type="button" className={selected ? "profile selected" : "profile"} onClick={() => toggleProfile(profile.id)}><span className="icon">{meta?.icon || "🏷️"}</span><span><b>{profile.item_name || meta?.name || "QR პროფილი"}</b><small>{meta?.name} · {profile.tag_code}</small></span><i>{selected ? "✓" : ""}</i></button>; })}</div>)}
            </div>
          </details>
          <div className="periods">{PERIODS.map((item) => { const sum = selectedItems.reduce((amount, profile) => amount + (PRODUCTS.find((p) => p.type === normalizeType(profile))?.prices[item.value] || 0), 0); const active = period === item.value; return <button key={item.value} className={active ? "period active" : "period"} aria-pressed={active} onClick={() => setPeriod(item.value)}><i aria-hidden="true">{active ? "✓" : ""}</i><small>მომსახურების ვადა</small><b>{item.label}</b><span>{selectedItems.length ? `${sum} ₾` : "—"}</span></button>; })}</div>
          <details className="appPriceCatalog"><summary>ყველა პროდუქტის ფასი <span>⌄</span></summary><div className="appPriceRows"><div className="appPriceHeader"><b>პროდუქტი</b><span>1 თვე</span><span>3 თვე</span><span>6 თვე</span><span>1 წელი</span></div>{PRODUCTS.map((item) => <article key={item.type}><b>{item.icon} {item.name}</b>{PERIODS.map((p) => <span key={p.value}>{item.prices[p.value]}₾</span>)}</article>)}</div></details>
          <div className="appStageActions"><button type="button" className="appPrevious" onClick={() => setAppStep(1)}>← პროფილები</button><button type="button" className="appNext" disabled={!selectedProfiles.length} onClick={() => setAppStep(3)}>შეჯამება <span>→</span></button></div></div>
        </section>

        <aside className="summary checkoutStage summaryStage">
          <div className="summaryTitle"><div><small>თქვენი არჩევანი</small><h2>{selectedItems.length ? `${selectedItems.length} არჩეული პროფილი` : "აირჩიეთ პროფილი"}</h2></div><button type="button" className="summaryEdit" onClick={() => setAppStep(1)}>პროფილების შეცვლა</button></div>
          {selectedItems.length > 0 && <div className="chosen">{selectedItems.map((profile) => { const meta = PRODUCTS.find((item) => item.type === normalizeType(profile)); const ownPeriod = selectedPeriod(profile.id); return <div key={profile.id}><span>{meta?.icon} {profile.item_name || meta?.name}<small>{PERIODS.find((item) => item.value === ownPeriod)?.label || "ვადა არჩეული არ არის"}</small></span><b>{ownPeriod ? meta?.prices[ownPeriod] || 0 : 0} ₾</b></div>; })}</div>}
          <div className="line desktopSharedPeriod"><span>არჩეული ვადა</span><b>{PERIODS.find((item) => item.value === period)?.label}</b></div>
          <div className="line"><span>საწყისი ჯამი</span><b>{subtotal ? `${subtotal} ₾` : "—"}</b></div>
          <div className="line discount"><span>მრავალპროდუქტიანი ფასდაკლება</span><b>{discountPercent ? `−${discountPercent}%` : "0%"}</b></div>
          {discountAmount > 0 && <div className="saving">თქვენ დაზოგავთ <b>{discountAmount} ₾-ს</b></div>}
          <div className="total"><span>სულ გადასახდელი</span><strong>{total ? `${total} ₾` : "0 ₾"}</strong></div>
          {message && <div className="requestSuccess">✓ {message}</div>}
          {error && <div className="requestError">{error}</div>}
          <button disabled={!selectedItems.length || hasIncompletePeriods || submitting} onClick={requestActivation}>{submitting ? "მოთხოვნა იგზავნება..." : "გააქტიურების მოთხოვნა"}</button>
          <p>მომსახურება ჩაირთვება QR RETURN-ის დადასტურების შემდეგ.</p>
        </aside>
      </div>

      <section className="purchaseHistory" id="history">
        <div className="historyHeading">
          <div>
            <small>მომსახურება და გადახდები</small>
            <h2>შეძენებისა და პაკეტების ისტორია</h2>
          </div>
          <span>{history.length} ჩანაწერი</span>
        </div>

        {history.length === 0 ? (
          <div className="historyEmpty">შეძენის ისტორია ჯერ არ გაქვთ.</div>
        ) : (
          <div className="historyList">
            {history.map((request) => {
              const profile = profiles.find((item) => item.id === Number(request.item_id));
              return (
                <article key={request.id}>
                  <div>
                    <strong>{profile?.item_name || profile?.tag_code || "QR პროფილი"}</strong>
                    <span>{request.period_months === 12 ? "1 წელი" : `${request.period_months} თვე`} · {formatHistoryDate(request.requested_at)}</span>
                  </div>
                  <div className="historyAmount">{Number(request.final_amount)} ₾</div>
                  <div className={`historyStatus ${request.status}`}>{historyStatusLabel(request.status)}</div>
                  <div className="historyDates">
                    <div><small>დაწყების თარიღი</small><strong>{request.service_starts_at ? formatHistoryDate(request.service_starts_at) : "დადასტურების შემდეგ"}</strong></div>
                    <div><small>დასრულების თარიღი</small><strong>{request.service_expires_at ? formatHistoryDate(request.service_expires_at) : "დადასტურების შემდეგ"}</strong></div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="prices"><div><small>სრული ტარიფები</small><h2>ყველა პროდუქტის ფასი</h2><p className="discountNote">3–4 პროდუქტი −5% · 5–6 პროდუქტი −10% · 7 პროდუქტი −12% · რვავე პროდუქტი −15%</p></div><div className="tableWrap"><table><thead><tr><th>პროდუქტი</th>{PERIODS.map((p) => <th key={p.value}>{p.label}</th>)}</tr></thead><tbody>{PRODUCTS.map((item) => <tr key={item.type}><td><span>{item.icon}</span><b>{item.name}</b></td>{PERIODS.map((p) => <td key={p.value}>{item.prices[p.value]} ₾</td>)}</tr>)}</tbody></table></div></section>
    </section>

    <style jsx>{`
      .appCheckoutSteps,.appNext,.appStageActions,.summaryPrevious,.appPriceCatalog,.inlineCalculator,.calculatorLauncher,.calculatorOverlay,.liveCalculator{display:none}
      .purchaseHistory{margin-top:16px;padding:24px;border:1px solid #d9dddf;border-radius:15px;background:#fff;box-shadow:0 12px 30px rgba(38,48,56,.07)}.historyHeading{display:flex;align-items:center;justify-content:space-between;gap:18px}.historyHeading small{color:#1266e9;font-size:12px;font-weight:900}.historyHeading h2{margin:5px 0 0;color:#17324d;font-size:25px}.historyHeading>span{padding:8px 11px;border-radius:9px;background:#eef5ff;color:#075dcc;font-size:12px;font-weight:900}.historyEmpty{margin-top:18px;padding:22px;border:1px dashed #cbd9e8;border-radius:12px;color:#60758a;text-align:center}.historyList{margin-top:18px;display:grid;gap:10px}.historyList article{padding:14px;display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:12px;border:1px solid #dde6ef;border-radius:12px;background:#f8fbff}.historyList article strong,.historyList article span{display:block}.historyList article strong{color:#17324d;font-size:15px}.historyList article span{margin-top:4px;color:#60758a;font-size:12px}.historyAmount{color:#17324d;font-size:17px;font-weight:950}.historyStatus{padding:7px 9px;border-radius:999px;background:#fff4d8;color:#8a5b00;font-size:12px;font-weight:900}.historyStatus.confirmed{background:#e8f8f0;color:#087443}.historyStatus.rejected,.historyStatus.cancelled{background:#fff0f0;color:#a51d26}.historyDates{grid-column:1/-1;padding-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:8px;border-top:1px solid #e3eaf2}.historyDates>div{padding:10px;border:1px solid #dce8f2;border-radius:10px;background:#fff}.historyDates small,.historyDates strong{display:block}.historyDates small{color:#71879a!important;font-size:9px!important;font-weight:850}.historyDates strong{margin-top:4px;color:#19476b!important;font-size:12px!important}@media(max-width:760px){.purchaseHistory{padding:18px 14px}.historyHeading{align-items:flex-start}.historyHeading h2{font-size:21px}.historyList article{grid-template-columns:1fr auto}.historyStatus{grid-column:2}.historyDates{grid-template-columns:1fr 1fr;gap:7px}}

      .stepNumber{width:27px;height:27px;margin-right:5px;display:inline-grid;place-items:center;border-radius:8px;background:#eaf3ff;color:#0966db;font-size:13px}.requestSuccess,.requestError{margin-top:14px;padding:11px 12px;border-radius:10px;font-size:12px;font-weight:800;line-height:1.45}.requestSuccess{background:#e8f8f0;color:#087443}.requestError{background:#fff0f0;color:#b42318}
      .chosen{margin:0 0 14px;padding:10px 12px;border-radius:12px;background:#f6f9fd}.chosen>div{padding:7px 0;display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e3eaf2;font-size:13px}.chosen>div:last-child{border-bottom:0}.discount b{color:#087443}.saving{margin-top:12px;padding:10px 12px;border-radius:11px;background:#e8f8f0;color:#087443;font-size:13px}.discountNote{margin:-10px 0 18px;color:#087443;font-size:14px;font-weight:800}
      .summaryTitle{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.summaryTitle small{color:#89c2ff;font-size:10px;font-weight:900}.summaryTitle h2{margin-top:6px!important}.summaryEdit{width:auto!important;min-height:34px!important;margin:0!important;padding:0 10px!important;border:1px solid rgba(255,255,255,.24)!important;background:rgba(255,255,255,.1)!important;color:#fff!important;font-size:10px!important;box-shadow:none!important}.summaryPeriodHeading{margin:2px 0 8px;display:flex;align-items:center;justify-content:space-between;gap:10px}.summaryPeriodHeading span{color:#fff;font-size:12px;font-weight:900}.summaryPeriodHeading small{color:#9af1df;font-size:10px}.summaryPeriods{margin-bottom:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.summaryPeriods button{min-width:0!important;min-height:54px!important;margin:0!important;padding:7px 2px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:10px!important;background:rgba(255,255,255,.09)!important;color:#dbeaff!important;box-shadow:none!important}.summaryPeriods button span,.summaryPeriods button b{display:block}.summaryPeriods button span{font-size:9px}.summaryPeriods button b{margin-top:4px;font-size:12px}.summaryPeriods button.active{border-color:#fff!important;background:#fff!important;color:#075f65!important;box-shadow:0 6px 14px rgba(0,20,50,.2)!important}
      .profilePicker{display:grid;gap:14px}.categoryTabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.categoryTab{position:relative;min-height:67px;padding:10px 12px;display:flex;align-items:center;gap:10px;border:1px solid #d8e5f1;border-radius:15px;background:#f5f9fd;color:#17324d;text-align:left;cursor:pointer;font-family:inherit;transition:border-color .18s ease,background .18s ease,box-shadow .18s ease}.categoryTab.active{border-color:#0872e3;background:#fff;box-shadow:0 0 0 1px #0872e3,0 8px 20px rgba(8,92,178,.12)}.groupIcon{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:13px;background:#fff;font-size:22px;box-shadow:0 3px 10px rgba(11,67,119,.08)}.categoryTab.active .groupIcon{background:#e7f2ff}.groupTitle{min-width:0;flex:1}.groupTitle b,.groupTitle small{display:block}.groupTitle b{overflow:hidden;font-size:15px;text-overflow:ellipsis;white-space:nowrap}.groupTitle small{margin-top:4px;color:#718497;font-size:11px;font-weight:750}.categoryTab>i{width:23px;height:23px;display:grid;place-items:center;flex:0 0 23px;border-radius:50%;background:#0872e3;color:#fff;font-size:11px;font-style:normal;font-weight:900}.activeProfiles{overflow:hidden;border:1px solid #cfe1f2;border-radius:17px;background:#fff;box-shadow:0 10px 25px rgba(13,75,132,.08)}.activeProfilesHeading{min-height:55px;padding:10px 13px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #dce9f5;background:linear-gradient(135deg,#eaf4ff,#f8fbff)}.activeProfilesHeading>div{display:flex;align-items:center;gap:8px;color:#123b61}.activeProfilesHeading>div span{font-size:19px}.activeProfilesHeading b{font-size:15px}.activeProfilesHeading>small{color:#62809b;font-size:11px;font-weight:750}.activeProfiles .profiles{padding:10px}
      .inlineProfileEditor{margin:0 0 13px;overflow:hidden;border:1px solid #cfe0ef;border-radius:14px;background:#fff}.inlineProfileEditor>summary{min-height:62px;padding:10px 13px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;list-style:none}.inlineProfileEditor>summary::-webkit-details-marker{display:none}.inlineProfileEditor>summary span{min-width:0}.inlineProfileEditor>summary small,.inlineProfileEditor>summary b{display:block}.inlineProfileEditor>summary small{color:#71879b;font-size:9px;font-weight:850}.inlineProfileEditor>summary b{margin-top:4px;overflow:hidden;color:#173652;font-size:14px;text-overflow:ellipsis;white-space:nowrap}.inlineProfileEditor>summary strong{flex:0 0 auto;padding:7px 9px;border-radius:9px;background:#e8f3ff;color:#0867ca;font-size:10px}.inlineProfileEditor[open]>summary{border-bottom:1px solid #dce8f3;background:#f3f8fd}.inlineProfileEditorBody{padding:10px;display:grid;gap:10px;background:#f8fbfe}.inlineProfileEditorBody .categoryTab{min-height:54px;padding:7px}.inlineProfileEditorBody .groupIcon{width:34px;height:34px;flex-basis:34px;font-size:17px}.inlineProfileEditorBody .groupTitle b{font-size:11px}.inlineProfileEditorBody .groupTitle small{font-size:9px}.inlineProfileEditorBody>.profiles{grid-template-columns:1fr!important}
      .inlineCalculator{margin:0 0 13px;overflow:hidden;border:1px solid #bcd9f2;border-radius:15px;background:#fff;box-shadow:0 8px 22px rgba(10,77,139,.1)}.inlineCalculator>summary{min-height:66px;padding:10px 13px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;list-style:none;background:linear-gradient(135deg,#e7f3ff,#f8fbff)}.inlineCalculator>summary::-webkit-details-marker{display:none}.inlineCalculator>summary span small,.inlineCalculator>summary span b{display:block}.inlineCalculator>summary span small{color:#6a849c;font-size:9px;font-weight:850}.inlineCalculator>summary span b{margin-top:3px;color:#123e68;font-size:15px}.inlineCalculator>summary strong{padding:9px 11px;border-radius:10px;background:#0b6fd9;color:#fff;font-size:12px}.inlineCalculator>summary strong i{margin-left:6px;font-style:normal}.inlineCalculator[open]>summary strong i{display:inline-block;transform:rotate(180deg)}.inlineCalculatorBody{padding:11px;background:#f8fbfe}.inlineCalculatorBody>p{margin:0 0 10px;color:#627b91;font-size:10px;line-height:1.45}.calculatorPriceGuide{margin-top:10px;overflow:hidden;border:1px solid #d8e5f0;border-radius:11px;background:#fff}.calculatorPriceGuide>summary{min-height:44px;padding:0 11px;display:flex;align-items:center;justify-content:space-between;color:#315c82;cursor:pointer;list-style:none;font-size:11px;font-weight:900}.calculatorPriceGuide>summary::-webkit-details-marker{display:none}.calculatorPriceGuide>div{padding:0 9px 8px;display:grid;grid-template-columns:1fr 1fr;gap:5px}.calculatorPriceGuide article{padding:7px 8px;display:flex;align-items:center;justify-content:space-between;gap:5px;border-radius:8px;background:#eff6fc;color:#36566f;font-size:9px}.calculatorPriceGuide article span{color:#0967c6;font-weight:900}
      .calculatorLauncher{width:100%;min-height:72px;margin:0 0 13px;padding:10px 12px;align-items:center;gap:10px;border:1px solid #acd2f3;border-radius:16px;background:linear-gradient(135deg,#fff,#eaf5ff);color:#173652;text-align:left;font-family:inherit;box-shadow:0 9px 23px rgba(8,78,143,.12)}.calculatorMark{width:44px;height:44px;display:grid;place-items:center;flex:0 0 44px;border-radius:13px;background:linear-gradient(145deg,#0b74e5,#13a66b);color:#fff;font-size:22px;font-weight:950}.calculatorLauncher>span:nth-child(2){min-width:0;flex:1}.calculatorLauncher small,.calculatorLauncher b,.calculatorLauncher em{display:block}.calculatorLauncher small{color:#6d8499;font-size:8px;font-weight:900}.calculatorLauncher b{margin-top:2px;font-size:14px}.calculatorLauncher em{margin-top:3px;color:#71879b;font-size:9px;font-style:normal}.calculatorLauncher>strong{color:#0870d8;font-size:14px;white-space:nowrap}.calculatorLauncher>strong i{margin-left:5px;font-style:normal}.calculatorOverlay{position:fixed;inset:0;z-index:1300;align-items:flex-end;justify-content:center;padding:18px 10px max(12px,env(safe-area-inset-bottom));background:rgba(1,22,48,.58);backdrop-filter:blur(5px)}.calculatorSheet{width:min(500px,100%);max-height:min(78svh,720px);overflow-y:auto;border:1px solid rgba(255,255,255,.8);border-radius:25px 25px 18px 18px;background:#f8fbfe;box-shadow:0 -18px 55px rgba(0,20,50,.35)}.sheetHandle{width:42px;height:4px;margin:8px auto 2px;border-radius:99px;background:#bfd0df}.calculatorSheet>header{padding:10px 14px 12px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dce8f3}.calculatorSheet>header small{color:#6f8498;font-size:8px;font-weight:900}.calculatorSheet h3{margin:2px 0 0;color:#173652;font-size:19px}.calculatorSheet>header button{width:34px;height:34px;border:0;border-radius:50%;background:#e6f1fb;color:#315b80;font-size:21px}.sheetTotal{margin-top:10px;padding:11px 12px;display:flex;align-items:center;justify-content:space-between;border-radius:12px;background:#e9f5ff;color:#48677f}.sheetTotal span{font-size:10px;font-weight:800}.sheetTotal strong{color:#0870d8;font-size:20px}.calculatorDone{width:100%;min-height:46px;margin-top:9px;border:0;border-radius:12px;background:linear-gradient(110deg,#0b74e5,#13a66b);color:#fff;font-family:inherit;font-size:12px;font-weight:900;box-shadow:0 8px 18px rgba(7,106,139,.2)}
      .liveCalculator{margin:0 0 13px;padding:12px;border:1px solid #bcd9f2;border-radius:16px;background:linear-gradient(145deg,#fff,#eff7ff);box-shadow:0 9px 23px rgba(8,78,143,.11)}.liveCalculator>header{display:flex;align-items:center;justify-content:space-between;gap:10px}.liveCalculator>header small{color:#6d8498;font-size:8px;font-weight:900}.liveCalculator h3{margin:2px 0 0;color:#173652;font-size:16px}.liveCalculator>header>div:last-child{text-align:right}.liveCalculator>header>div:last-child span,.liveCalculator>header>div:last-child strong{display:block}.liveCalculator>header>div:last-child span{color:#6f879c;font-size:9px}.liveCalculator>header>div:last-child strong{margin-top:2px;color:#0870d8;font-size:20px}.priceInstructions{margin-top:9px;border-top:1px solid #dce8f3}.priceInstructions>summary{min-height:42px;display:flex;align-items:center;justify-content:space-between;color:#315f87;cursor:pointer;list-style:none;font-size:10px;font-weight:900}.priceInstructions>summary::-webkit-details-marker{display:none}.priceInstructions>summary b{padding:6px 8px;border-radius:8px;background:#e4f1fd;color:#0870d8;font-size:9px}.priceInstructions[open]>summary b{background:#0870d8;color:#fff}.priceCalendar{padding:5px 0 2px}.priceCalendarHead,.priceCalendar article{display:grid;grid-template-columns:minmax(92px,1.35fr) repeat(4,minmax(42px,.55fr));align-items:center;gap:4px}.priceCalendarHead{padding:6px 7px;color:#75899b;font-size:7px}.priceCalendarHead b{text-align:center}.priceCalendar article{min-height:48px;margin-top:5px;padding:5px 7px;border:1px solid #dce7f0;border-radius:10px;background:#fff;color:#48647b}.priceCalendar article>span{min-width:0;position:relative;display:grid;grid-template-columns:25px minmax(0,1fr);align-items:center;gap:5px}.priceCalendar article>span i{font-size:16px;font-style:normal}.priceCalendar article strong{overflow:hidden;font-size:9px;text-overflow:ellipsis;white-space:nowrap}.priceCalendar article em{position:absolute;top:-9px;right:1px;padding:2px 5px;border-radius:99px;background:#0aa26b;color:#fff;font-size:7px;font-style:normal}.priceCalendar article>button{height:36px;position:relative;padding:0;border:1px solid #d6e3ee;border-radius:8px;background:#f5f9fc;color:#0870d8;font-family:inherit;font-size:10px;font-weight:900}.priceCalendar article>button:disabled{cursor:not-allowed;opacity:.42}.priceCalendar article>button.active{border-color:#0870d8;background:#0870d8;color:#fff;box-shadow:0 5px 11px rgba(8,112,216,.2)}.priceCalendar article>button i{position:absolute;top:-6px;right:-4px;width:14px;height:14px;display:grid;place-items:center;border-radius:50%;background:#0aa26b;color:#fff;font-size:8px;font-style:normal}.priceCalendar article.chosenProduct{border-color:#0aa26b;background:#edfbf5;box-shadow:0 0 0 1px #0aa26b}.priceCalendar>p{margin:7px 2px 2px;padding:8px;border-radius:9px;background:#eef6fd;color:#587187;font-size:8px;line-height:1.45}.priceCalendar>p strong{color:#0870d8}.profilePrice{flex:0 0 auto;color:#0870d8;font-size:12px;font-weight:950;text-align:right}.profilePrice small{margin-top:2px!important;color:#7890a4!important;font-size:8px!important}.profile:not(.selected)>i{background:#e7eff7}.profile.selected .profilePrice{color:#07845a}
      .categoryPricing{margin:9px 10px 0;overflow:hidden;border:1px solid #cfe0ef;border-radius:12px;background:#f6faff}.categoryPricing>summary{min-height:50px;padding:8px 11px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#234e73;cursor:pointer;list-style:none}.categoryPricing>summary::-webkit-details-marker{display:none}.categoryPricing>summary span b,.categoryPricing>summary span small{display:block}.categoryPricing>summary span b{font-size:11px}.categoryPricing>summary span small{margin-top:3px;color:#0870d8;font-size:10px;font-weight:900}.categoryPricing>summary i{font-size:16px;font-style:normal}.categoryPricing[open]>summary i{transform:rotate(180deg)}.categoryPricing>div{padding:9px 10px;border-top:1px solid #dce8f2;background:#fff}.categoryPeriods{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}.categoryPeriods button{min-width:0;min-height:48px;padding:5px 2px;border:1px solid #d8e5ef;border-radius:9px;background:#f8fbfe;color:#607a90;font-family:inherit}.categoryPeriods span,.categoryPeriods b{display:block}.categoryPeriods span{font-size:8px}.categoryPeriods b{margin-top:3px;color:#0870d8;font-size:12px}.categoryPeriods button.active{border-color:#0b72db;background:#0b72db;color:#fff}.categoryPeriods button.active b{color:#fff}.categoryPricing p{margin:8px 1px 0;color:#61798e;font-size:9px;line-height:1.45}.categoryPricing p b{color:#07845a}
      .profileOption{overflow:hidden;border:1px solid #dbe5ef;border-radius:13px;background:#fff}.profileOption .profile{width:100%;border:0!important;border-radius:0!important;box-shadow:none!important}.profileOption.selected{border:2px solid #10a369;background:#effcf6;box-shadow:0 7px 18px rgba(16,163,105,.13)}.profileOption.selected .profile{background:#effcf6!important}.profileTerms{padding:9px 11px 10px;display:grid;grid-template-columns:1fr 1fr;gap:6px;border-top:1px solid #cdebdc;background:#f7fffb}.profileTerms>div{padding:7px 8px;border-radius:8px;background:#fff}.profileTerms span,.profileTerms b{display:block}.profileTerms span{color:#71889b;font-size:8px}.profileTerms b{margin-top:2px;color:#173652;font-size:11px}.profileTerms p{grid-column:1/-1;margin:2px 1px 0;color:#31705a;font-size:9px;line-height:1.4}
      .profilePeriodPicker{display:none}.chosen span small{display:block;margin-top:3px;color:inherit;font-size:9px;opacity:.72}.chosenProductGroup{margin-top:7px;padding:6px;border:1px solid #0aa26b;border-radius:12px;background:#edfbf5}.chosenProductGroup>header{padding:2px 4px 6px;display:flex;align-items:center;justify-content:space-between;color:#167054;font-size:10px;font-weight:900}.chosenProductGroup>header b{padding:3px 6px;border-radius:99px;background:#d7f5e8;font-size:8px}.chosenProductGroup .chosenProduct{margin-top:4px}.chosenProductGroup .chosenProduct>span{grid-template-columns:1fr}.chosenProductGroup .chosenProduct>span strong,.chosenProductGroup .chosenProduct>span small{display:block}.chosenProductGroup .chosenProduct>span strong{font-size:10px}.chosenProductGroup .chosenProduct>span small{margin-top:2px;overflow:hidden;color:#71889a;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.priceCalendar .referencePrice>b{text-align:center;color:#0870d8;font-size:11px}.purchaseGuide{margin-top:8px;overflow:hidden;border:1px solid #d8e5f0;border-radius:12px;background:#fff}.purchaseGuide>summary{min-height:46px;padding:0 10px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;list-style:none;color:#315f87;font-size:11px;font-weight:900}.purchaseGuide>summary::-webkit-details-marker{display:none}.purchaseGuide>summary b{padding:6px 8px;border-radius:8px;background:#e9f3fc;color:#0870d8;font-size:9px}.purchaseGuide[open]>summary{border-bottom:1px solid #dce8f2;background:#f4f9fd}.purchaseGuide[open]>summary b{background:#0870d8;color:#fff}.purchaseGuide>div{padding:9px;display:grid;gap:7px}.purchaseGuide article{padding:8px;display:flex;align-items:flex-start;gap:8px;border-radius:10px;background:#f4f8fc}.purchaseGuide article>i{width:24px;height:24px;display:grid;place-items:center;flex:0 0 24px;border-radius:8px;background:#0870d8;color:#fff;font-size:10px;font-style:normal;font-weight:950}.purchaseGuide article p{margin:0}.purchaseGuide article b,.purchaseGuide article span{display:block}.purchaseGuide article b{color:#254966;font-size:10px}.purchaseGuide article span{margin-top:3px;color:#668096;font-size:9px;line-height:1.4}.purchaseGuide footer{padding:10px;border-radius:10px;background:linear-gradient(135deg,#e8f4ff,#e8fbf3);color:#315e78;font-size:9px;line-height:1.5}.purchaseGuide footer b{color:#07845a}
      :global(*){box-sizing:border-box}:global(body){margin:0;background:#063b72;color:#13283f}.subscriptionsPage{min-height:100vh;padding-bottom:52px;background:radial-gradient(circle at 16% 10%,rgba(75,174,249,.42),transparent 29%),linear-gradient(150deg,#0c5aa0 0%,#073f78 48%,#062f5d 100%);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.topbar{width:calc(100% - 32px);max-width:1120px;min-height:76px;margin:auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.22)}.brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.brand>span{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#1266e9;font-weight:950}.brand strong,.brand small{display:block}.brand strong{font-size:17px}.brand small{margin-top:2px;color:#c6e6ff;font-size:12px}.back{padding:10px 13px;border:1px solid rgba(255,255,255,.25);border-radius:10px;background:rgba(255,255,255,.1);color:#fff;text-decoration:none;font-size:13px;font-weight:850}.shell{width:calc(100% - 28px);max-width:1120px;margin:30px auto}.intro{display:flex;align-items:center;justify-content:space-between;gap:24px;color:#fff}.intro small,.prices>div>small{font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.intro h1{max-width:700px;margin:8px 0 9px;color:#fff;font-size:36px;line-height:1.16}.intro p{max-width:760px;margin:0;color:#d7ecff;font-size:16px;line-height:1.55}.free{min-width:185px;padding:17px 20px;border:1px solid rgba(255,255,255,.3);border-radius:17px;background:rgba(255,255,255,.13);color:#fff;text-align:center;box-shadow:inset 0 1px rgba(255,255,255,.15)}.free b,.free span{display:block}.free b{font-size:30px}.free span{margin-top:3px;color:#d8edff;font-size:13px}.layout{margin-top:24px;display:grid;grid-template-columns:minmax(0,1fr) 350px;gap:16px}.panel,.summary,.prices{border:1px solid rgba(220,231,243,.95);border-radius:20px;background:#fff;box-shadow:0 18px 45px rgba(0,23,52,.2)}.panel{padding:24px}.panel h2{display:flex;align-items:center;margin:0 0 15px;color:#17324d;font-size:19px}.panel h2:not(:first-child){margin-top:25px}.profiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.profile{min-height:72px;padding:10px 12px;display:flex;align-items:center;gap:11px;border:1px solid #dbe5ef;border-radius:13px;background:#f8fbff;color:#13283f;text-align:left;cursor:pointer;transition:.18s ease}.profile:hover{border-color:#9fc3ed;transform:translateY(-1px)}.profile.selected{border:2px solid #1266e9;background:#edf5ff;box-shadow:0 5px 16px rgba(18,102,233,.12)}.profile .icon{width:43px;height:43px;display:grid;place-items:center;border-radius:11px;background:#fff;font-size:23px}.profile span:nth-child(2){min-width:0;flex:1}.profile b,.profile small{display:block}.profile b{font-size:15px}.profile small{margin-top:4px;overflow:hidden;color:#6a7d90;font-size:12px;text-overflow:ellipsis;white-space:nowrap}.profile i{width:23px;height:23px;display:grid;place-items:center;border-radius:50%;background:#1266e9;color:#fff;font-style:normal}.periods{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.period{position:relative;min-height:94px;padding:14px 8px;border:1px solid #dbe5ef;border-radius:13px;background:#fff;color:#13283f;cursor:pointer}.period>i{position:absolute;top:8px;right:8px;width:18px;height:18px;display:grid;place-items:center;border:1px solid #c9d8e6;border-radius:50%;color:#fff;font-size:10px;font-style:normal}.period.active>i{border-color:#1266e9;background:#1266e9}.period>small{display:block;margin-bottom:5px;color:#718397;font-size:9px;font-weight:800}.period.active{border:2px solid #1266e9;background:#edf5ff;box-shadow:0 5px 16px rgba(18,102,233,.1)}.period b,.period span{display:block}.period b{font-size:14px}.period span{margin-top:8px;color:#1266e9;font-size:23px;font-weight:950}.period em{position:absolute;left:50%;bottom:-8px;transform:translateX(-50%);padding:3px 7px;border-radius:10px;background:#0b9b62;color:#fff;font-size:9px;font-style:normal;white-space:nowrap}.summary{align-self:start;padding:24px;position:sticky;top:18px}.summary>small{color:#1266e9;font-size:12px;font-weight:900}.summary h2{margin:8px 0 20px;color:#17324d;font-size:23px}.line{padding:12px 0;display:flex;justify-content:space-between;gap:15px;border-bottom:1px solid #e5ebf2;color:#526b82;font-size:13px}.line b{color:#1b3852}.total{margin-top:16px;padding:16px;border-radius:13px;background:#eaf3ff}.total span,.total strong{display:block}.total span{color:#56718a;font-size:12px}.total strong{margin-top:5px;color:#0647c8;font-size:31px}.summary button{width:100%;min-height:50px;margin-top:14px;border:0;border-radius:11px;background:#1266e9;color:#fff;font-family:inherit;font-size:15px;font-weight:900;cursor:pointer;box-shadow:0 8px 18px rgba(18,102,233,.2)}.summary button:disabled{opacity:.45}.summary p{text-align:center;color:#718397;font-size:11px;line-height:1.4}.prices{margin-top:16px;padding:24px}.prices h2{margin:5px 0 18px;color:#17324d;font-size:25px}.tableWrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th,td{padding:13px;border-bottom:1px solid #e5ebf2;text-align:center;font-size:14px}th{background:#f2f7fd;color:#536a80;font-size:12px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:9px;font-size:20px}tbody tr:hover{background:#f8fbff}.state{padding:25px;border:1px dashed #cbd9e8;border-radius:14px;text-align:center;color:#66798d}.state a{color:#1266e9;font-weight:800}
      .subscriptionsPage{background:linear-gradient(180deg,#eceeef 0%,#f5f6f6 42%,#fff 100%);color:#27333d}.topbar{width:100%;max-width:none;padding:0 max(24px,calc((100% - 1260px)/2));border-bottom:1px solid #d8dcdf;background:rgba(255,255,255,.92)}.brand{color:#27333d}.brand>span{background:#1266e9;color:#fff}.brand small{color:#7c878f}.back{border-color:#d7dcdf;background:#f3f4f4;color:#3e4b55}.shell{max-width:1260px;margin-top:25px}.intro{color:#27333d}.intro small{color:#1266e9}.intro h1{color:#202c35;font-size:32px}.intro p{color:#68747d;font-size:15px}.free{border:0;background:linear-gradient(135deg,#444d54,#69737a);color:#fff;box-shadow:0 8px 20px rgba(44,52,58,.12)}.free span{color:#eef1f2}.layout{grid-template-columns:minmax(0,1fr) 310px;padding:18px;border:1px solid #d9dddf;border-radius:18px;background:#fff;box-shadow:0 16px 38px rgba(38,48,56,.1)}.panel{padding:2px;border:0;background:transparent;box-shadow:none}.profiles{grid-template-columns:repeat(2,minmax(0,1fr))}.profile{background:#f5f6f6;border-color:#dadddf}.profile.selected{background:#eef3f7;border-color:#566d7d;box-shadow:0 5px 16px rgba(50,65,75,.1)}.profile i{background:#485963}.period.active{background:#eef1f3;border-color:#566d7d;box-shadow:0 5px 16px rgba(50,65,75,.08)}.period.active span{color:#334b59}.summary{padding:20px;border:0;border-radius:15px;background:#323a40;color:#fff;box-shadow:none}.summary>small{color:#c9d1d6}.summary h2{color:#fff}.chosen{background:rgba(255,255,255,.08)}.chosen>div{border-color:rgba(255,255,255,.13);color:#fff}.line{border-color:rgba(255,255,255,.14);color:#d7dde0}.line b{color:#fff}.total{background:#fff}.total strong{color:#313d45}.summary button{background:#fff;color:#303c44;box-shadow:none}.summary p{color:#d3dadd}.prices{margin-top:15px;border-color:#d9dddf;border-radius:15px;background:#fff;box-shadow:0 12px 30px rgba(38,48,56,.07)}.prices>div>small{color:#68747d}
      @media(max-width:760px){.subscriptionsPage{padding-bottom:24px}.topbar{width:100%;padding:0 12px;min-height:66px}.brand small{display:none}.back{padding:8px 9px;font-size:10px}.shell{width:calc(100% - 20px);margin:18px auto 0}.intro{padding:0 4px;align-items:flex-start;flex-direction:column;gap:15px}.intro h1{font-size:26px;line-height:1.18}.intro p{font-size:14px;line-height:1.55}.free{width:100%;padding:13px;display:flex;align-items:center;justify-content:center;gap:10px}.free b{font-size:24px}.free span{margin:0;font-size:13px}.layout{grid-template-columns:1fr;gap:16px;padding:12px}.panel{padding:2px}.panel h2{font-size:17px}.profiles{grid-template-columns:1fr}.categoryTab{min-height:62px;padding:8px}.categoryTab .groupIcon{width:38px;height:38px;flex-basis:38px;font-size:20px}.groupTitle b{font-size:13px}.activeProfilesHeading>small{display:none}.periods{grid-template-columns:repeat(2,1fr)}.period{min-height:88px}.summary{position:static;padding:20px 15px}.prices{padding:20px 0}.prices>div{padding:0 15px}.prices h2{font-size:22px}.tableWrap{padding-left:12px}table{min-width:680px}th,td{padding:13px 10px}}
      :global(html),:global(body){min-height:100%;background:#0A4C8A}.subscriptionsPage{background:#0A4C8A}.topbar{background:transparent;border-color:rgba(255,255,255,.22)}.brand{color:#fff}.brand>span{background:#fff;color:#1266e9}.brand small{color:#c6e6ff}.back{border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#fff}.intro{color:#fff}.intro small{color:#bdddff}.intro h1{color:#fff}.intro p{color:#d7ecff}.prices{margin-bottom:26px}.free{background:linear-gradient(135deg,#0647c8,#1675ed);box-shadow:none}.layout{background:#f7faff;border-color:#dce7f2}.profile{background:#fff;border-color:#dce6f0}.profile.selected{border-color:#0866e9;background:#eaf3ff;box-shadow:0 0 0 1px #0866e9}.profile i{background:#0866e9}.period.active{border-color:#0866e9;background:#0866e9;color:#fff;box-shadow:none}.period.active span{color:#fff}.summary{background:#082f59}.summary>small{color:#79b8ff}.summary button{background:#fff;color:#0647c8}.total strong{color:#0647c8}.prices>div>small{color:#1266e9}.period b{font-size:16px}.period span{font-size:28px}.chosen>div{font-size:15px}.chosen>div b,.line b{font-size:16px}.line{font-size:15px}.total span{font-size:14px}.total strong{font-size:38px;line-height:1.08}tbody td:not(:first-child){font-size:17px;font-weight:850}th{font-size:13px}
      @media(max-width:760px){.period b{font-size:16px}.period span{font-size:27px}.line{font-size:14px}.line b{font-size:15px}.total strong{font-size:36px}tbody td:not(:first-child){font-size:16px}}
      .priceCalendarHead{font-size:9px!important}.priceCalendar article>button{font-size:12px!important}.appProfileCalendar{margin-top:10px!important;border-top:1px solid #dce8f3}.selectedCalendarProfile{border-color:#0870d8!important;background:#eef7ff!important;box-shadow:0 0 0 1px #0870d8!important}.calendarEmpty{margin-top:10px;padding:18px 12px;display:grid;gap:6px;border:1px dashed #bdd3e6;border-radius:12px;background:#f8fbfe;color:#60798e;text-align:center;font-size:10px}.calendarEmpty b{color:#254b6a;font-size:13px}.calendarEmpty span{line-height:1.45}.calendarEmpty a{min-height:40px;margin-top:5px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:#0870d8;color:#fff;font-size:11px;font-weight:900;text-decoration:none}.referencePriceTable{margin-top:3px;padding:9px;overflow:hidden;border:1px solid #cfe0ee;border-radius:12px;background:#fff}.referencePriceTable>header{padding:2px 2px 9px;display:flex;align-items:flex-end;justify-content:space-between;gap:8px}.referencePriceTable>header span{color:#214b6c;font-size:11px;font-weight:950}.referencePriceTable>header small{color:#71889b;font-size:7px}.referencePriceHead,.referencePriceRow{display:grid;grid-template-columns:minmax(94px,1.45fr) repeat(4,minmax(38px,.55fr));align-items:center;gap:4px}.referencePriceHead{padding:6px;color:#71879a;background:#edf5fb;font-size:7px}.referencePriceHead span{text-align:center}.referencePriceRow{min-height:39px;padding:5px 6px;border-bottom:1px solid #e4ebf1}.referencePriceRow:last-child{border-bottom:0}.referencePriceRow b{overflow:hidden;color:#31536f;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.referencePriceRow span{color:#0870d8;font-size:10px;font-weight:900;text-align:center}
      .appTariffHeader{display:none}
      .appVideoGuide{display:none}
      body.kompasiAppMode .appVideoGuide{margin-top:12px;min-height:58px;padding:10px 12px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.26);border-radius:15px;background:rgba(255,255,255,.14);color:#fff;text-decoration:none;box-shadow:inset 0 1px rgba(255,255,255,.18)}body.kompasiAppMode .appVideoGuide>span{width:36px;height:36px;display:grid;place-items:center;flex:0 0 36px;border-radius:11px;background:#fff;color:#0870d8;font-size:13px}body.kompasiAppMode .appVideoGuide>b{font-size:13px}body.kompasiAppMode .appVideoGuide>small{margin-left:auto;color:#d7ebff;font-size:9px;font-weight:700}body.kompasiAppMode .appVideoGuide>i{font-style:normal;font-size:20px}
    `}</style>
  </main>;
}


function formatHistoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("ka-GE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function historyStatusLabel(status: string) {
  if (status === "confirmed") return "აქტიური";
  if (status === "rejected") return "უარყოფილი";
  if (status === "cancelled") return "გაუქმებული";
  return "დადასტურების მოლოდინში";
}
