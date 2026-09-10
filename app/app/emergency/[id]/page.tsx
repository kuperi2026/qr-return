"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import AppAiAssistant from "@/app/components/app/AppAiAssistant";

type PanelProps = { name: string; icon: string; title: string; subtitle: string; children: React.ReactNode; danger?: boolean; open: string | null; onToggle: (name: string) => void };

function Panel({ name, icon, title, subtitle, children, danger = false, open, onToggle }: PanelProps) {
  return <details className={`emPanel ${danger ? "danger" : ""}`} open={open === name}><summary onClick={(event) => { event.preventDefault(); onToggle(name); }}><i>{icon}</i><span><b>{title}</b><small>{subtitle}</small></span><em>⌄</em></summary><div className="panelBody">{children}</div></details>;
}

type EmergencyProfile = {
  id: string; tag_code: string; first_name: string | null; last_name: string | null; photo_url: string | null;
  date_of_birth: string | null; sex: string | null; blood_type: string | null; address: string | null;
  allergies: string | null; medical_conditions: string | null; medications: string | null; medical_note: string | null;
  profile_for: "self" | "other" | null; profile_manager_type: string | null; manager_first_name: string | null;
  manager_last_name: string | null; manager_relationship: string | null; owner_phone: string | null; owner_email: string | null;
  emergency_contact_name: string | null; emergency_contact_relationship: string | null; emergency_contact_phone: string | null;
  second_contact_name: string | null; second_contact_relationship: string | null; second_contact_phone: string | null;
  emergency_message: string | null; missing_mode: boolean | null; missing_message: string | null; active: boolean | null;
  live_chat_enabled: boolean | null; location_sharing_enabled: boolean | null;
};

const SELECT = "id,tag_code,first_name,last_name,photo_url,date_of_birth,sex,blood_type,address,allergies,medical_conditions,medications,medical_note,profile_for,profile_manager_type,manager_first_name,manager_last_name,manager_relationship,owner_phone,owner_email,emergency_contact_name,emergency_contact_relationship,emergency_contact_phone,second_contact_name,second_contact_relationship,second_contact_phone,emergency_message,missing_mode,missing_message,active,live_chat_enabled,location_sharing_enabled";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;
  return url && key ? createClient(url, key) : null;
}

export default function EmergencyAppProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [sb, setSb] = useState<SupabaseClient | null>(null);
  const [profile, setProfile] = useState<EmergencyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = getClient(); setSb(supabase);
    if (!supabase) { setLoading(false); return; }
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/app"); return; }
      const { data } = await supabase.from("emergency_profiles").select(SELECT).eq("id", id).eq("owner_id", user.id).maybeSingle();
      setProfile(data as EmergencyProfile | null); setLoading(false);
    })();
  }, [id, router]);

  if (loading) return <main className="emState">Emergency პროფილი იტვირთება…</main>;
  if (!profile || !sb) return <main className="emState">Emergency პროფილი ვერ მოიძებნა.</main>;

  const holderName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Emergency ID";
  const managerName = [profile.manager_first_name, profile.manager_last_name].filter(Boolean).join(" ");
  const isThirdParty = profile.profile_for === "other" || profile.profile_manager_type === "other";
  const toggle = (panel: string) => setOpen((current) => current === panel ? null : panel);

  async function toggleMissing() {
    setSaving(true); setError("");
    const { data: { user } } = await sb!.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { data, error: updateError } = await sb!.from("emergency_profiles").update({ missing_mode: !profile!.missing_mode, updated_at: new Date().toISOString() }).eq("id", profile!.id).eq("owner_id", user.id).select("missing_mode").maybeSingle();
    if (updateError || !data) setError(updateError?.message || "რეჟიმი ვერ შეიცვალა.");
    else setProfile((current) => current ? { ...current, missing_mode: data.missing_mode } : current);
    setSaving(false);
  }

  return <main className="emApp"><div className="emWrap">
    <Link className="back" href="/app/profiles">← ჩემი პროფილები</Link>
    <section className="emHero"><div className="emPhoto">{profile.photo_url ? <img src={profile.photo_url} alt={holderName} /> : "✚"}</div><div><small>EMERGENCY BRACELET · {profile.tag_code}</small><h1>{holderName}</h1><b>{isThirdParty ? "მესამე პირის პროფილი" : "პირადი პროფილი"}</b></div></section>
    {error && <p className="error">{error}</p>}
    <div className="emPanels">
      <Panel open={open} onToggle={toggle} name="holder" icon="◉" title="სამაჯურის მატარებელი" subtitle="პირადი და საიდენტიფიკაციო ინფორმაცია"><div className="rows"><Row label="სახელი" value={holderName} /><Row label="დაბადების თარიღი" value={profile.date_of_birth} /><Row label="სქესი" value={profile.sex} /><Row label="მისამართი" value={profile.address} /></div><Link className="primary" href={`/emergency/edit/${profile.id}`}>ინფორმაციის რედაქტირება</Link></Panel>
      <Panel open={open} onToggle={toggle} name="manager" icon={isThirdParty ? "♙" : "✓"} title={isThirdParty ? "პროფილის მმართველი — მესამე პირი" : "პროფილის მმართველი — თავად"} subtitle={isThirdParty ? "ვინ შექმნა და მართავს პროფილს" : "მატარებელი თავად მართავს პროფილს"}><div className="rows"><Row label="მმართველი" value={managerName || holderName} /><Row label="კავშირი მატარებელთან" value={isThirdParty ? profile.manager_relationship : "თავად"} /><Row label="ტელეფონი" value={profile.owner_phone} /><Row label="ელფოსტა" value={profile.owner_email} /></div></Panel>
      <Panel open={open} onToggle={toggle} name="medical" icon="✚" title="სამედიცინო ინფორმაცია" subtitle="კრიტიკული მონაცემები პირველადი დახმარებისთვის"><div className="critical"><Row label="სისხლის ჯგუფი" value={profile.blood_type} /><Row label="ალერგიები" value={profile.allergies} /><Row label="დაავადებები / მდგომარეობები" value={profile.medical_conditions} /><Row label="მედიკამენტები" value={profile.medications} /><Row label="სამედიცინო შენიშვნა" value={profile.medical_note} /></div><p className="medicalNote">ეს ინფორმაცია არ ცვლის ექიმის შეფასებას. გადაუდებელი შემთხვევისას დარეკეთ 112-ზე.</p><a className="call112" href="tel:112">112-ზე დარეკვა</a></Panel>
      <Panel open={open} onToggle={toggle} name="contacts" icon="☎" title="Emergency კონტაქტები" subtitle="მთავარი და დამატებითი საკონტაქტო პირები"><Contact title="მთავარი Emergency კონტაქტი" name={profile.emergency_contact_name} relationship={profile.emergency_contact_relationship} phone={profile.emergency_contact_phone} /><Contact title="მეორე Emergency კონტაქტი" name={profile.second_contact_name} relationship={profile.second_contact_relationship} phone={profile.second_contact_phone} /></Panel>
      <Panel open={open} onToggle={toggle} name="missing" icon="!" title="Missing Mode" subtitle={profile.missing_mode ? "აქტიურია" : "დაკარგვის/გაუჩინარების რეჟიმი"} danger={Boolean(profile.missing_mode)}><p className="explain">{profile.missing_mode ? "QR პროფილზე გამოჩნდება, რომ ადამიანი დაკარგულად ითვლება." : "ჩართეთ მხოლოდ მაშინ, როცა სამაჯურის მატარებლის მოძებნაა საჭირო."}</p><button className="missingButton" type="button" disabled={saving} onClick={toggleMissing}>{saving ? "ინახება…" : profile.missing_mode ? "Missing Mode-ის გამორთვა" : "Missing Mode-ის ჩართვა"}</button></Panel>
      <Panel open={open} onToggle={toggle} name="ai" icon="AI" title="Emergency AI დამხმარე" subtitle="უსაფრთხო შეფასება პირველი და მესამე პირისთვის"><AppAiAssistant category="emergency" profileName={holderName} subjectMode={isThirdParty ? "other" : "self"} embedded /></Panel>
      <Panel open={open} onToggle={toggle} name="visibility" icon="◐" title="ხილვადობა და მპოვნელის ეკრანი" subtitle="რა გამოჩნდება QR-ის დასკანირებისას"><div className="actionGrid"><Link href={`/emergency/edit/${profile.id}`}>ხილვადობის მართვა</Link><Link href={`/emergency/${encodeURIComponent(profile.tag_code)}`} target="_blank">მპოვნელის პროფილი ↗</Link>{profile.live_chat_enabled && <Link href={`/app/live-chat/emergency/${encodeURIComponent(profile.tag_code)}`}>Live Chat</Link>}</div></Panel>
    </div>
  </div><style jsx global>{`
    *{box-sizing:border-box}.emState{min-height:100vh;display:grid;place-items:center;background:#edf7ff;color:#667b90;font:700 12px Inter,Arial}.emApp{min-height:100vh;background:#edf7ff;color:#173652;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.emWrap{width:min(560px,100%);margin:auto;padding:18px 14px 100px}.back{color:#1761bd;text-decoration:none;font-size:12px;font-weight:850}.emHero{margin-top:14px;padding:18px;display:flex;align-items:center;gap:14px;border-radius:20px;background:linear-gradient(140deg,#7d1320,#d43845);color:#fff;box-shadow:0 13px 30px rgba(136,21,35,.25)}.emPhoto{width:72px;height:72px;display:grid;place-items:center;flex:0 0 72px;overflow:hidden;border:2px solid rgba(255,255,255,.5);border-radius:20px;background:rgba(255,255,255,.16);font-size:40px}.emPhoto img{width:100%;height:100%;object-fit:cover}.emHero small{color:#ffd5d8;font-size:9px}.emHero h1{margin:5px 0 8px;font-size:22px}.emHero b{padding:4px 8px;border-radius:999px;background:#fff;color:#9e202b;font-size:9px}.emPanels{margin-top:14px;display:grid;gap:9px}.emPanel{overflow:hidden;border:1px solid #d7e3ef;border-radius:15px;background:#fff;box-shadow:0 5px 16px rgba(23,63,109,.05)}.emPanel summary{min-height:54px;padding:7px 9px;display:flex;align-items:center;gap:11px;cursor:pointer;list-style:none}.emPanel summary::-webkit-details-marker{display:none}.emPanel summary i{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:11px;background:#eaf3ff;color:#075dcc;font-size:15px;font-style:normal;font-weight:950}.emPanel summary span{min-width:0;flex:1}.emPanel summary b,.emPanel summary small{display:block}.emPanel summary b{overflow:hidden;font-size:11px;text-overflow:ellipsis;white-space:nowrap}.emPanel summary small{margin-top:2px;overflow:hidden;color:#74899d;font-size:8px;text-overflow:ellipsis;white-space:nowrap}.emPanel summary em{width:29px;height:29px;display:grid;place-items:center;flex:0 0 29px;border-radius:9px;background:#19a66a;color:#fff;font-size:16px;font-style:normal;transition:.2s}.emPanel[open] summary{border-bottom:1px solid #e3ebf3}.emPanel[open] summary em{transform:rotate(180deg)}.emPanel.danger summary i{background:#ffe5e7;color:#b5232f}.panelBody{padding:10px}.panelBody .appAi form{padding:10px 12px 13px;background:#f7fbff}.panelBody .quickScenarios>div{display:grid;grid-template-columns:1fr 1fr;gap:6px;overflow:visible}.panelBody .quickScenarios button{min-height:36px;white-space:normal}.panelBody .appAi textarea{min-height:72px}.rows,.critical{display:grid;grid-template-columns:1fr 1fr;gap:8px}.row{padding:10px;border-radius:10px;background:#edf7ff}.row span,.row b{display:block}.row span{color:#788da0;font-size:8px}.row b{margin-top:4px;font-size:11px;word-break:break-word}.primary,.call112{min-height:43px;margin-top:12px;display:grid;place-items:center;border-radius:10px;background:#1266e9;color:#fff;text-decoration:none;font-size:11px;font-weight:900}.call112{background:#c52d39}.medicalNote,.explain{color:#61788d;font-size:10px;line-height:1.5}.contact{padding:11px 0;border-bottom:1px solid #e3eaf2}.contact small,.contact b,.contact span{display:block}.contact small{color:#b12632;font-size:9px;font-weight:900}.contact b{margin-top:5px;font-size:12px}.contact span{margin-top:3px;color:#70869a;font-size:9px}.contact a{display:inline-block;margin-top:7px;color:#075dcc;font-size:11px;font-weight:900;text-decoration:none}.missingButton{width:100%;min-height:44px;border:0;border-radius:10px;background:#c62e3a;color:#fff;font:900 11px inherit}.actionGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.actionGrid a{min-height:43px;padding:8px;display:grid;place-items:center;border:1px solid #d6e2ed;border-radius:10px;color:#075dcc;text-align:center;text-decoration:none;font-size:10px;font-weight:850}.error{padding:10px;border-radius:10px;background:#fff0f0;color:#a5222d;font-size:10px}@media(max-width:380px){.rows,.critical,.actionGrid{grid-template-columns:1fr}}
  `}</style></main>;
}

function Row({ label, value }: { label: string; value: string | null }) { return <div className="row"><span>{label}</span><b>{value || "არ არის მითითებული"}</b></div>; }
function Contact({ title, name, relationship, phone }: { title: string; name: string | null; relationship: string | null; phone: string | null }) { return <div className="contact"><small>{title}</small><b>{name || "არ არის მითითებული"}</b><span>{relationship || "კავშირი არ არის მითითებული"}</span>{phone && <a href={`tel:${phone}`}>{phone}</a>}</div>; }
