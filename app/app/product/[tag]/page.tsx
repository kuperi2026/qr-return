"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import AppAiAssistant from "@/app/components/app/AppAiAssistant";

type Item = {
  id: string | number; tag_code: string; item_type: string | null; pet_type: string | null; item_name: string | null;
  photo: string | null; active: boolean | null; lost: boolean | null; lost_at: string | null; scan_count: number | null;
  last_scanned_at: string | null; last_scan_latitude: number | null; last_scan_longitude: number | null; last_scan_accuracy: number | null;
  breed: string | null; sex: string | null; colour: string | null; date_of_birth: string | null; weight: number | null;
  brand: string | null; model: string | null; size: string | null; material: string | null; distinctive_features: string | null;
  medical_info: string | null; behavior_note: string | null; description: string | null; finder_message: string | null;
  owner_first_name: string | null; owner_last_name: string | null; owner_phone: string | null; owner_email: string | null;
  show_pet_photo: boolean | null; show_owner_name: boolean | null; show_owner_phone: boolean | null; show_email: boolean | null;
  show_medical_info: boolean | null; show_behaviour_note: boolean | null; show_description: boolean | null; show_finder_message: boolean | null;
  live_chat_enabled: boolean | null; phone_enabled: boolean | null; service_status: string | null; service_expires_at: string | null; trial_ends_at: string | null;
};
type ScanEvent = { id: number; created_at: string; latitude: number | null; longitude: number | null; location_shared: boolean | null };

const META: Record<string, [string, string]> = {
  dog: ["🐕", "ძაღლი"], cat: ["🐈", "კატა"], parking: ["🚘", "ავტომობილი"], suitcase: ["🧳", "ჩემოდანი"],
  luggage: ["🧳", "ჩემოდანი"], keys: ["🔑", "გასაღები"], wallet: ["👛", "საფულე"], bag: ["👜", "ჩანთა"], emergency: ["✚", "Emergency"],
};
type Feature = { info: string; lost: string; scans: string; contact: string; ai: string; modeHint: string; scanHint: string; contactHint: string; tips: string[] };
const FEATURES: Record<string, Feature> = {
  dog: { info: "ძაღლის მონაცემები და ჯანმრთელობა", lost: "დაკარგული ძაღლის რეჟიმი", scans: "სკანები და ბოლო მდებარეობა", contact: "მპოვნელთან კავშირი და QR", ai: "AI ძაღლის მოძებნის დამხმარე", modeHint: "ჩართეთ დაკარგვისთანავე — მპოვნელს გამოუჩნდება თქვენი სპეციალური შეტყობინება.", scanHint: "ნახეთ სად და როდის დაასკანირეს ძაღლის QR.", contactHint: "ესაუბრეთ მპოვნელს და გაუზიარეთ უსაფრთხო მიახლოების ინსტრუქცია.", tips: ["განაახლეთ ახლანდელი ფოტო", "მიუთითეთ ქცევა და ჯანმრთელობის მნიშვნელოვანი ინფორმაცია", "შეშინებულ ძაღლთან მიახლოება მპოვნელს ფრთხილად სთხოვეთ"] },
  cat: { info: "კატის მონაცემები და ჯანმრთელობა", lost: "დაკარგული კატის რეჟიმი", scans: "სკანები და ბოლო მდებარეობა", contact: "მპოვნელთან კავშირი და QR", ai: "AI კატის მოძებნის დამხმარე", modeHint: "ჩართეთ დაკარგვისთანავე და აღწერეთ უსაფრთხოდ დაჭერის ან მიახლოების გზა.", scanHint: "შეამოწმეთ QR სკანები და ახლო დამალვის ადგილების მდებარეობა.", contactHint: "მპოვნელს სთხოვეთ კატას არ დაედევნოს და დაცული ჩათი გამოიყენოს.", tips: ["განაახლეთ მკაფიო ფოტო და ფერი", "მიუთითეთ არის თუ არა კატა შეშინებული ან აგრესიული", "დაამატეთ ჯანმრთელობის მნიშვნელოვანი ინფორმაცია"] },
  parking: { info: "ავტომობილისა და Parking პროფილი", lost: "Parking შეტყობინების რეჟიმი", scans: "მძღოლთან კავშირის სკანები", contact: "მძღოლთან უსაფრთხო კავშირი", ai: "AI Parking დამხმარე", modeHint: "გამოიყენეთ განსაკუთრებული მდგომარეობის ან ავტომობილის პრობლემის აღსანიშნავად.", scanHint: "ნახეთ როდის დაასკანირეს ავტომობილის QR და გაზიარდა თუ არა მდებარეობა.", contactHint: "დაცული ჩათი ან ზარი პირადი ნომრის საჯაროდ გამოტანის გარეშე.", tips: ["სახელმწიფო ნომერი შეამოწმეთ სიზუსტეზე", "არ გამოაჩინოთ მფლობელის მისამართი ან სხვა პირადი მონაცემი", "ავარიის ან საფრთხის შემთხვევაში AI-ის ნაცვლად 112 გამოიყენეთ"] },
  keys: { info: "გასაღების აღწერა და ნიშნები", lost: "დაკარგული გასაღების რეჟიმი", scans: "გასაღების პოვნის სკანები", contact: "უსაფრთხო დაბრუნება და QR", ai: "AI გასაღების დაბრუნების დამხმარე", modeHint: "ჩართეთ დაკარგვისას, მაგრამ არ დაწეროთ რომელ მისამართს ან საკეტს ეკუთვნის გასაღები.", scanHint: "ნახეთ QR-ის ბოლო სკანირება და გაზიარებული მდებარეობა.", contactHint: "დაბრუნება დაგეგმეთ საჯარო და უსაფრთხო ადგილზე.", tips: ["არ მიუთითოთ სახლის მისამართი", "არ აღწეროთ კონკრეტული კარი, მანქანა ან საკეტი", "დაბრუნებისთვის გამოიყენეთ დაცული ჩათი"] },
  wallet: { info: "საფულის აღწერა და კონფიდენციალურობა", lost: "დაკარგული საფულის რეჟიმი", scans: "საფულის პოვნის სკანები", contact: "კონფიდენციალური დაბრუნება", ai: "AI უსაფრთხო დაბრუნების დამხმარე", modeHint: "ჩართეთ დაკარგვისას; საბანკო ბარათები საჭიროების შემთხვევაში ცალკე დაბლოკეთ.", scanHint: "ნახეთ სად და როდის დაასკანირეს საფულის QR.", contactHint: "არ გააზიაროთ დოკუმენტის ფოტო, ბარათის ნომერი ან კოდი.", tips: ["დაკარგული საბანკო ბარათები ბანკთან დაბლოკეთ", "არ მოითხოვოთ დოკუმენტის ან ბარათის ფოტო", "შეხვედრა დანიშნეთ უსაფრთხო საჯარო ადგილზე"] },
  bag: { info: "ჩანთის აღწერა და განმასხვავებელი ნიშნები", lost: "დაკარგული ჩანთის რეჟიმი", scans: "ჩანთის პოვნის სკანები", contact: "მპოვნელთან უსაფრთხო კავშირი", ai: "AI ჩანთის დაბრუნების დამხმარე", modeHint: "ჩართეთ დაკარგვისას და აღწერეთ ჩანთა შიგთავსის საჯაროდ ჩამოთვლის გარეშე.", scanHint: "ნახეთ QR სკანები და ბოლო გაზიარებული მდებარეობა.", contactHint: "სთხოვეთ მპოვნელს ჩანთა არ გახსნას და დაცული ჩათი გამოიყენოს.", tips: ["მიუთითეთ ფერი, ბრენდი და განმასხვავებელი ნიშანი", "ძვირფასი შიგთავსი საჯაროდ არ ჩამოთვალოთ", "დაბრუნება უსაფრთხო ადგილზე დაგეგმეთ"] },
  suitcase: { info: "ჩემოდნის აღწერა და სამოგზაურო ნიშნები", lost: "დაკარგული ჩემოდნის რეჟიმი", scans: "მგზავრობისა და პოვნის სკანები", contact: "მპოვნელთან ან სამსახურთან კავშირი", ai: "AI მოგზაურობის დამხმარე", modeHint: "ჩართეთ დაკარგვისას და მიუთითეთ ბოლო ცნობილი აეროპორტი ან ტრანსპორტი.", scanHint: "ნახეთ მგზავრობისას გაკეთებული QR სკანები და მდებარეობა.", contactHint: "საჭიროებისას ჩართეთ ავიაკომპანიის ან ტრანსპორტის Lost & Found სამსახური.", tips: ["მიუთითეთ ფერი, ზომა და უნიკალური ნიშანი", "ბარგის შიგთავსი საჯაროდ არ ჩამოთვალოთ", "შეინახეთ ავიაკომპანიის ან გადამზიდავის განაცხადის ნომერი"] },
};
const SELECT_FIELDS = `id,tag_code,item_type,pet_type,item_name,photo,active,lost,lost_at,scan_count,last_scanned_at,last_scan_latitude,last_scan_longitude,last_scan_accuracy,breed,sex,colour,date_of_birth,weight,brand,model,size,material,distinctive_features,medical_info,behavior_note,description,finder_message,owner_first_name,owner_last_name,owner_phone,owner_email,show_pet_photo,show_owner_name,show_owner_phone,show_email,show_medical_info,show_behaviour_note,show_description,show_finder_message,live_chat_enabled,phone_enabled,service_status,service_expires_at,trial_ends_at`;

function createSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
  return url && key ? createClient(url, key) : null;
}
function formatDate(value: string | null) {
  return value ? new Intl.DateTimeFormat("ka-GE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "ჯერ არ ყოფილა";
}

export default function ProductProfile() {
  const { tag } = useParams<{ tag: string }>();
  const router = useRouter();
  const [sb, setSb] = useState<SupabaseClient | null>(null);
  const [item, setItem] = useState<Item | null>(null);
  const [draft, setDraft] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ScanEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabase(); setSb(supabase);
    if (!supabase) { setLoading(false); return; }
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/login?source=app"); return; }
      const { data } = await supabase.from("item").select(SELECT_FIELDS).eq("owner_id", user.id).eq("tag_code", tag).maybeSingle();
      setItem(data as Item | null); setDraft(data as Item | null); setLoading(false);
    })();
  }, [router, tag]);

  if (loading) return <main className="productState">პროფილი იტვირთება…</main>;
  if (!item || !draft || !sb) return <main className="productState">პროფილი ვერ მოიძებნა.</main>;

  const type = item.item_type === "pet" && item.pet_type ? item.pet_type : item.item_type || item.pet_type || "item";
  const meta = META[type] || ["⌁", "QR პროფილი"];
  const feature = FEATURES[type] || { info: "პროფილის ინფორმაცია", lost: "Lost Mode", scans: "სკანები და მდებარეობა", contact: "კავშირი და QR", ai: "AI დამხმარე", modeHint: "დაკარგვის შემთხვევაში ჩართეთ რეჟიმი.", scanHint: "ნახეთ QR-ის სკანირების ისტორია.", contactHint: "მპოვნელთან დასაკავშირებლად გამოიყენეთ დაცული ჩათი.", tips: ["განაახლეთ პროფილის ინფორმაცია", "გადაამოწმეთ ხილვადობა", "გამოიყენეთ დაცული კავშირი"] };
  const hasLocation = item.last_scan_latitude != null && item.last_scan_longitude != null;
  const details = type === "dog" || type === "cat"
    ? [["ჯიში", item.breed], ["სქესი", item.sex], ["ფერი", item.colour], ["დაბადების თარიღი", item.date_of_birth], ["წონა", item.weight ? `${item.weight} კგ` : null]]
    : type === "parking"
    ? [["სახელმწიფო ნომერი", item.item_name], ["მარკა", item.brand], ["მოდელი", item.model], ["ფერი", item.colour], ["განმასხვავებელი ნიშანი", item.distinctive_features]]
    : type === "keys"
    ? [["ფერი", item.colour], ["მასალა", item.material], ["ბრელოკი / განმასხვავებელი ნიშანი", item.distinctive_features]]
    : type === "wallet"
    ? [["ბრენდი", item.brand], ["მასალა", item.material], ["ფერი", item.colour], ["განმასხვავებელი ნიშანი", item.distinctive_features]]
    : [["ბრენდი", item.brand], ["მოდელი", item.model], ["ზომა", item.size], ["მასალა", item.material], ["ფერი", item.colour], ["განმასხვავებელი ნიშნები", item.distinctive_features]];

  async function saveProfile() {
    setSaving(true); setMessage("");
    const { data: { user } } = await sb!.auth.getUser();
    if (!user) { setSaving(false); return; }
    const fields = {
      item_name: draft!.item_name, breed: draft!.breed, sex: draft!.sex, colour: draft!.colour, date_of_birth: draft!.date_of_birth || null,
      weight: draft!.weight || null, brand: draft!.brand, model: draft!.model, size: draft!.size, material: draft!.material,
      distinctive_features: draft!.distinctive_features, medical_info: draft!.medical_info, behavior_note: draft!.behavior_note,
      description: draft!.description, finder_message: draft!.finder_message, owner_first_name: draft!.owner_first_name,
      owner_last_name: draft!.owner_last_name, owner_phone: draft!.owner_phone, owner_email: draft!.owner_email,
      show_pet_photo: draft!.show_pet_photo, show_owner_name: draft!.show_owner_name, show_owner_phone: draft!.show_owner_phone,
      show_email: draft!.show_email, show_medical_info: draft!.show_medical_info, show_behaviour_note: draft!.show_behaviour_note,
      show_description: draft!.show_description, show_finder_message: draft!.show_finder_message,
      live_chat_enabled: draft!.live_chat_enabled, phone_enabled: draft!.phone_enabled,
    };
    const { data, error } = await sb!.from("item").update(fields).eq("id", item!.id).eq("owner_id", user.id).select(SELECT_FIELDS).maybeSingle();
    if (error || !data) setMessage(error?.message || "ცვლილება ვერ შეინახა.");
    else { setItem(data as Item); setDraft(data as Item); setEditing(false); setMessage("ცვლილებები შენახულია."); }
    setSaving(false);
  }
  async function toggleLost() {
    setSaving(true); setMessage("");
    const { data: { user } } = await sb!.auth.getUser();
    if (!user) { setSaving(false); return; }
    const next = !item!.lost; const now = new Date().toISOString();
    const { data, error } = await sb!.from("item").update({ lost: next, lost_at: next ? now : null, found_at: next ? null : now }).eq("id", item!.id).eq("owner_id", user.id).select("lost,lost_at").maybeSingle();
    if (error || !data) setMessage(error?.message || "Lost Mode ვერ შეიცვალა.");
    else { setItem((current) => current ? { ...current, ...data } : current); setDraft((current) => current ? { ...current, ...data } : current); }
    setSaving(false);
  }
  async function loadHistory() {
    if (historyLoaded) return; setHistoryLoading(true);
    const { data } = await sb!.from("scan_events").select("id,created_at,latitude,longitude,location_shared").eq("item_id", item!.id).order("created_at", { ascending: false }).limit(50);
    setHistory((data || []) as ScanEvent[]); setHistoryLoaded(true); setHistoryLoading(false);
  }
  async function downloadQR() {
    const code = item!.tag_code.trim().toUpperCase();
    const image = await QRCode.toDataURL(`https://qr-return.vercel.app/scan/${encodeURIComponent(code)}`, { width: 1000, margin: 3, errorCorrectionLevel: "H", color: { dark: "#10263f", light: "#ffffff" } });
    const link = document.createElement("a"); link.href = image; link.download = `QR-RETURN-${code}.png`; link.click();
  }

  const textField = (key: keyof Item, label: string, inputType = "text") => <label><span>{label}</span><input type={inputType} value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: inputType === "number" ? Number(event.target.value) : event.target.value })} /></label>;
  const noteField = (key: keyof Item, label: string) => <label className="wide"><span>{label}</span><textarea value={String(draft[key] ?? "")} onChange={(event) => setDraft({ ...draft, [key]: event.target.value })} /></label>;
  const visibility = (key: keyof Item, label: string) => <label className="switch"><span>{label}</span><input type="checkbox" checked={Boolean(draft[key])} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} /></label>;

  return <main className="productProfile"><div className="profileWrap">
    <header className="topLine"><Link href="/app/profiles">← ჩემი პროფილები</Link></header>
    <section className="identity"><div className="photo">{item.photo ? <img src={item.photo} alt={item.item_name || meta[1]} /> : <span>{meta[0]}</span>}</div><div><small>{meta[1]} · QR {item.tag_code}</small><h1>{item.item_name || meta[1]}</h1><b className={item.lost ? "lost" : "active"}>{item.lost ? "დაკარგულია" : "აქტიური"}</b></div></section>
    {message && <p className={message.includes("შენახულია") ? "notice success" : "notice"}>{message}</p>}

    <div className="accordionList">
    <details className="accordion" open={openPanel === "profile"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "profile" ? null : "profile"); }}><span>▤</span><div><b>{feature.info}</b><small>მონაცემები, რედაქტირება და ხილვადობა</small></div><em>⌄</em></summary>
    {editing ? <section className="section editSection">
      <Title number="01" title="პროფილის რედაქტირება" text="ყველა ცვლილება ამავე ეკრანზე შეინახება" />
      <div className="formGrid">
        {textField("item_name", type === "parking" ? "სახელმწიფო ნომერი" : type === "dog" || type === "cat" ? "სახელი" : "პროფილის სახელი")}
        {(type === "dog" || type === "cat") && <>{textField("breed", "ჯიში")}{textField("sex", "სქესი")}{textField("colour", "ფერი")}{textField("date_of_birth", "დაბადების თარიღი", "date")}{textField("weight", "წონა (კგ)", "number")}</>}
        {type === "parking" && <>{textField("brand", "მარკა")}{textField("model", "მოდელი")}{textField("colour", "ფერი")}{textField("distinctive_features", "განმასხვავებელი ნიშანი")}</>}
        {type === "keys" && <>{textField("colour", "ფერი")}{textField("material", "მასალა")}{textField("distinctive_features", "ბრელოკი / განმასხვავებელი ნიშანი")}</>}
        {type === "wallet" && <>{textField("brand", "ბრენდი")}{textField("material", "მასალა")}{textField("colour", "ფერი")}{textField("distinctive_features", "განმასხვავებელი ნიშანი")}</>}
        {(type === "bag" || type === "suitcase" || type === "luggage") && <>{textField("brand", "ბრენდი")}{textField("model", "მოდელი")}{textField("size", "ზომა")}{textField("material", "მასალა")}{textField("colour", "ფერი")}{textField("distinctive_features", "განმასხვავებელი ნიშნები")}</>}
        {noteField("description", type === "parking" ? "ინსტრუქცია მძღოლისთვის" : "აღწერა")}
        {(type === "dog" || type === "cat") && <>{noteField("medical_info", "სამედიცინო ინფორმაცია")}{noteField("behavior_note", "ქცევის შენიშვნა")}</>}
        {noteField("finder_message", "შეტყობინება მპოვნელისთვის")}{textField("owner_first_name", "მფლობელის სახელი")}{textField("owner_last_name", "მფლობელის გვარი")}{textField("owner_phone", "ტელეფონი", "tel")}{textField("owner_email", "ელფოსტა", "email")}
      </div>
      <div className="visibility"><h3>რას დაინახავს მპოვნელი</h3>{visibility("show_pet_photo", type === "dog" || type === "cat" ? "ფოტო" : "პროდუქტის ფოტო")}{visibility("show_owner_name", "მფლობელის სახელი")}{visibility("show_owner_phone", "ტელეფონი")}{visibility("show_email", "ელფოსტა")}{(type === "dog" || type === "cat") && <>{visibility("show_medical_info", "სამედიცინო ინფორმაცია")}{visibility("show_behaviour_note", "ქცევის შენიშვნა")}</>}{visibility("show_description", "აღწერა")}{visibility("show_finder_message", "მპოვნელის შეტყობინება")}{visibility("phone_enabled", "დარეკვის ღილაკი")}{visibility("live_chat_enabled", "Live Chat")}</div>
      <button className="save" type="button" disabled={saving} onClick={saveProfile}>{saving ? "ინახება…" : "ცვლილებების შენახვა"}</button>
    </section> : <section className="section">
      <Title number="01" title={`${meta[1]}ს ინფორმაცია`} text="რეგისტრირებული პროფილის სრული მონაცემები" />
      <div className="infoRows">{details.filter(([, value]) => value).map(([label, value]) => <div key={String(label)}><span>{label}</span><b>{value}</b></div>)}</div>
      {(item.description || item.medical_info || item.behavior_note || item.finder_message) && <div className="notes">{item.description && <p><span>აღწერა</span>{item.description}</p>}{item.medical_info && <p><span>სამედიცინო ინფორმაცია</span>{item.medical_info}</p>}{item.behavior_note && <p><span>ქცევა</span>{item.behavior_note}</p>}{item.finder_message && <p><span>მპოვნელისთვის</span>{item.finder_message}</p>}</div>}
      <div className="owner"><span>მფლობელი</span><b>{[item.owner_first_name, item.owner_last_name].filter(Boolean).join(" ") || "არ არის მითითებული"}</b><small>{item.owner_phone || "ტელეფონი არ არის"} · {item.owner_email || "ელფოსტა არ არის"}</small></div>
      <button className="inlineEdit" type="button" onClick={() => { setEditing(true); setDraft(item); setMessage(""); }}>პროფილის რედაქტირება</button>
    </section>}
    </details>

    <details className={`accordion ${item.lost ? "danger" : ""}`} open={openPanel === "lost"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "lost" ? null : "lost"); }}><span>!</span><div><b>{feature.lost}</b><small>{item.lost ? "ჩართულია" : "ერთი დაჭერით ჩართვა"}</small></div><em>⌄</em></summary><section className={`section lostSection ${item.lost ? "isLost" : ""}`}><Title number="02" title={feature.lost} text={item.lost ? `ჩართულია ${formatDate(item.lost_at)}` : feature.modeHint} /><CategoryTips tips={feature.tips} /><button type="button" disabled={saving} onClick={toggleLost}>{item.lost ? "ნაპოვნია — რეჟიმის გამორთვა" : `${feature.lost} — ჩართვა`}</button></section></details>
    <details className="accordion" open={openPanel === "ai"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "ai" ? null : "ai"); }}><span>✦</span><div><b>{feature.ai}</b><small>{meta[1]}სთვის მორგებული დახმარება</small></div><em>⌄</em></summary><div className="aiPanel"><AppAiAssistant category={type} profileName={item.item_name} embedded /></div></details>
    <details className="accordion" open={openPanel === "scans"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "scans" ? null : "scans"); }}><span>⌖</span><div><b>{feature.scans}</b><small>{item.scan_count || 0} სკანირება</small></div><em>⌄</em></summary><section className="section"><Title number="03" title={feature.scans} text={feature.scanHint} /><div className="scanStats"><div><span>სულ</span><b>{item.scan_count || 0}</b></div><div><span>ბოლო სკანირება</span><b>{formatDate(item.last_scanned_at)}</b></div></div>{hasLocation && <a className="mapLink" href={`https://www.google.com/maps?q=${item.last_scan_latitude},${item.last_scan_longitude}`} target="_blank" rel="noreferrer">⌖ ბოლო მდებარეობის რუკაზე ნახვა ↗</a>}<button className="historyButton" type="button" onClick={loadHistory}>{historyLoaded ? "ისტორია განახლებულია" : "სკანირების ისტორიის ნახვა"}</button>{historyLoading && <p className="muted">ისტორია იტვირთება…</p>}{historyLoaded && <div className="history">{history.length ? history.map((event) => <div key={event.id}><span>{formatDate(event.created_at)}</span>{event.latitude != null && event.longitude != null ? <a href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`} target="_blank" rel="noreferrer">რუკა ↗</a> : <small>ლოკაცია არ გაზიარებულა</small>}</div>) : <p className="muted">სკანირება ჯერ არ ყოფილა.</p>}</div>}</section></details>
    <details className="accordion" open={openPanel === "contact"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "contact" ? null : "contact"); }}><span>◌</span><div><b>{feature.contact}</b><small>ჩატი, QR და თანაადმინი</small></div><em>⌄</em></summary><section className="section"><Title number="04" title={feature.contact} text={feature.contactHint} /><div className="mainActions"><Link className="chat" href={`/chat/${type}/${tag}`}>Live Chat-ის გახსნა</Link><Link href={`/scan/${tag}`} target="_blank">მპოვნელის პროფილი ↗</Link><button type="button" onClick={downloadQR}>QR კოდის ჩამოტვირთვა</button><Link href={`/account/admin?profile=${item.id}`}>თანაადმინისტრატორი</Link></div></section></details>
    <details className="accordion" open={openPanel === "service"}><summary onClick={(event) => { event.preventDefault(); setOpenPanel((current) => current === "service" ? null : "service"); }}><span>◇</span><div><b>მომსახურება და პაკეტი</b><small>{item.service_status === "active" ? "აქტიურია" : "მართვა"}</small></div><em>⌄</em></summary><section className="serviceLine"><div><span>მომსახურება</span><b>{item.service_status === "active" ? "აქტიური პაკეტი" : item.service_status === "expired" ? "ვადა გასულია" : "საცდელი პერიოდი"}</b><small>{formatDate(item.service_expires_at || item.trial_ends_at)}</small></div><Link href={`/account/subscriptions?profile=${item.id}`}>პაკეტის მართვა →</Link></section></details>
    </div>
  </div><ProductStyles /></main>;
}

function Title({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="sectionTitle"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></div>;
}
function CategoryTips({ tips }: { tips: string[] }) {
  return <div className="categoryTips"><b>სწრაფი შემოწმება</b>{tips.map((tip) => <p key={tip}><span>✓</span>{tip}</p>)}</div>;
}
function ProductStyles() {
  return <style jsx global>{`
    *{box-sizing:border-box}.productState{min-height:100vh;display:grid;place-items:center;background:#edf7ff;color:#6e8296;font:700 12px Inter,Arial}.productProfile{min-height:100vh;background:#edf7ff;color:#173652;font-family:Inter,Arial,sans-serif}.profileWrap{width:min(560px,100%);margin:auto;padding:16px 14px 100px}.topLine{display:flex;align-items:center;justify-content:space-between}.topLine a{color:#1761bd;text-decoration:none;font-size:10px;font-weight:850}.topLine button{padding:8px 12px;border:1px solid #cbdbea;border-radius:10px;background:#fff;color:#1761bd;font:850 10px inherit}.identity{margin-top:14px;padding:18px;display:flex;align-items:center;gap:14px;border-radius:20px;background:linear-gradient(140deg,#07366f,#0a65d2);color:#fff;box-shadow:0 13px 30px #0b4eaa27}.photo{width:72px;height:72px;display:grid;place-items:center;flex:0 0 72px;overflow:hidden;border:2px solid #ffffff55;border-radius:20px;background:#ffffff18;font-size:30px}.photo img{width:100%;height:100%;object-fit:cover}.identity small{color:#bcdafa;font-size:8px}.identity h1{margin:5px 0 8px;font-size:22px}.identity b{padding:4px 8px;border-radius:999px;font-size:8px}.identity .active{background:#dff7eb;color:#087649}.identity .lost{background:#ffe6e8;color:#b82937}.quickNav{margin:12px 0 4px;display:flex;gap:7px;overflow:auto;scrollbar-width:none}.quickNav a{flex:0 0 auto;padding:8px 10px;border:1px solid #dce6f0;border-radius:999px;background:#fff;color:#49647e;text-decoration:none;font-size:8px;font-weight:850}.section{padding:22px 2px;border-bottom:1px solid #dce5ee;scroll-margin-top:16px}.sectionTitle{display:flex;align-items:flex-start;gap:10px}.sectionTitle>span{width:29px;height:29px;display:grid;place-items:center;flex:0 0 29px;border-radius:9px;background:#e7f1ff;color:#1761bd;font-size:8px;font-weight:900}.sectionTitle h2{margin:0;font-size:15px}.sectionTitle p{margin:4px 0 0;color:#75899d;font-size:9px}.infoRows{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.infoRows div{padding:11px 0;border-bottom:1px solid #e5ebf1}.infoRows span,.infoRows b{display:block}.infoRows span{color:#8394a4;font-size:8px}.infoRows b{margin-top:4px;font-size:11px}.notes{margin-top:12px}.notes p{margin:0;padding:11px 0;border-bottom:1px solid #e5ebf1;color:#465f76;font-size:10px;line-height:1.5}.notes span{display:block;margin-bottom:4px;color:#1761bd;font-size:8px;font-weight:900}.owner{margin-top:14px;padding:13px 0}.owner span,.owner b,.owner small{display:block}.owner span{color:#8394a4;font-size:8px}.owner b{margin-top:4px;font-size:12px}.owner small{margin-top:4px;color:#657b90;font-size:9px}.formGrid{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.formGrid label span{display:block;margin-bottom:5px;color:#5e7489;font-size:8px;font-weight:850}.formGrid input,.formGrid textarea{width:100%;padding:11px;border:1px solid #d5e1ec;border-radius:10px;background:#fff;color:#173652;font:500 11px inherit}.formGrid textarea{min-height:76px;resize:vertical}.formGrid .wide{grid-column:1/-1}.visibility{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.visibility h3{grid-column:1/-1;margin:0 0 4px;font-size:11px}.switch{min-height:39px;padding:8px 9px;display:flex;align-items:center;justify-content:space-between;gap:7px;border:1px solid #dce6f0;border-radius:10px;background:#fff}.switch span{font-size:8px;font-weight:800}.switch input{accent-color:#176be5}.save{width:100%;min-height:45px;margin-top:14px;border:0;border-radius:11px;background:#1266e9;color:#fff;font:900 10px inherit}.lostSection button{width:100%;min-height:44px;margin-top:15px;border:0;border-radius:11px;background:#1266e9;color:#fff;font:900 10px inherit}.lostSection.isLost .sectionTitle>span{background:#ffe5e7;color:#bb2733}.lostSection.isLost button{border:1px solid #e9aeb4;background:#fff;color:#b4232c}.scanStats{margin-top:15px;display:grid;grid-template-columns:.7fr 1.5fr;gap:9px}.scanStats div{padding:12px 0}.scanStats span,.scanStats b{display:block}.scanStats span{color:#8394a4;font-size:8px}.scanStats b{margin-top:5px;color:#155db5;font-size:11px}.mapLink{display:block;margin-top:4px;padding:11px;border-radius:10px;background:#eaf3ff;color:#075dcc;text-decoration:none;font-size:9px;font-weight:850}.historyButton{margin-top:9px;padding:9px 11px;border:1px solid #d5e1ec;border-radius:9px;background:#fff;color:#49647e;font:850 9px inherit}.history{margin-top:9px}.history>div{min-height:38px;padding:8px 2px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e5ebf1;font-size:8px}.history a{color:#1761bd;text-decoration:none;font-weight:850}.history small,.muted{color:#8394a4;font-size:8px}.mainActions{margin-top:15px;display:grid;grid-template-columns:1fr 1fr;gap:8px}.mainActions a,.mainActions button{min-height:43px;padding:8px;display:flex;align-items:center;justify-content:center;border:1px solid #d5e1ec;border-radius:10px;background:#fff;color:#1761bd;text-align:center;text-decoration:none;font:850 9px inherit}.mainActions .chat{border-color:#176be5;background:#1266e9;color:#fff}.serviceLine{padding:20px 2px;display:flex;align-items:center;justify-content:space-between;gap:12px}.serviceLine span,.serviceLine b,.serviceLine small{display:block}.serviceLine span{color:#8394a4;font-size:8px}.serviceLine b{margin-top:4px;font-size:11px}.serviceLine small{margin-top:4px;color:#657b90;font-size:8px}.serviceLine a{padding:10px;border-radius:9px;background:#eaf3ff;color:#075dcc;text-decoration:none;font-size:8px;font-weight:900}.notice{margin:12px 0 0;padding:10px;border-radius:10px;background:#fff1f1;color:#a52630;font-size:9px;font-weight:800}.notice.success{background:#e8f8f0;color:#087649}@media(max-width:380px){.formGrid,.visibility,.mainActions{grid-template-columns:1fr}.formGrid .wide,.visibility h3{grid-column:1}.infoRows{grid-template-columns:1fr}}
    .categoryTips{margin-top:14px;padding:11px 12px;border:1px solid #d5e3f2;border-radius:11px;background:#f4f8fd}.categoryTips>b{display:block;margin-bottom:7px;color:#175cae;font-size:9px}.categoryTips p{margin:5px 0;display:flex;align-items:flex-start;gap:7px;color:#536b82;font-size:9px;line-height:1.4}.categoryTips p span{color:#08784a;font-weight:950}
    .accordionList{margin-top:14px;display:grid;gap:9px}.accordion{overflow:hidden;border:1px solid #d7e3ef;border-radius:15px;background:#fff;box-shadow:0 5px 16px #173f6d0c}.accordion summary{min-height:54px;padding:7px 9px;display:flex;align-items:center;gap:11px;cursor:pointer;list-style:none}.accordion summary::-webkit-details-marker{display:none}.accordion summary>span{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:11px;background:#eaf3ff;color:#0d63c9;font-size:17px;font-weight:900}.accordion summary>div{min-width:0;flex:1}.accordion summary b,.accordion summary small{display:block}.accordion summary b{overflow:hidden;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.accordion summary small{margin-top:2px;overflow:hidden;color:#778b9e;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.accordion summary em{width:29px;height:29px;display:grid;place-items:center;flex:0 0 29px;border-radius:9px;background:#19a66a;color:#fff;font-size:16px;font-style:normal;transition:.2s}.accordion[open] summary em{transform:rotate(180deg)}.accordion[open] summary{border-bottom:1px solid #e3ebf3}.accordion.danger summary>span{background:#fff0f0;color:#c13742}.accordion .section{padding:18px 14px;border:0}.aiPanel{padding:12px}.inlineEdit{width:100%;min-height:43px;margin-top:12px;border:0;border-radius:10px;background:#1266e9;color:#fff;font:900 11px inherit}.accordion .serviceLine{padding:18px 14px}.topLine a{font-size:12px}.identity small{font-size:10px}.identity b{font-size:9px}
  `}</style>;
}
