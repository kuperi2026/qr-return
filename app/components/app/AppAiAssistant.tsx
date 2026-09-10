"use client";

import { FormEvent, useState } from "react";

type Result = { urgency: string; summary_ka: string; recommended_action_ka: string; suspicious: boolean; safety_warning_ka?: string | null };
export type ProfileSignals = { completeness: number; missingCount: number; visibilityCount: number; lostMode: boolean; liveChat: boolean; scanCount: number };
type Props = { category?: string; profileName?: string | null; subjectMode?: "self" | "other" | null; embedded?: boolean; profileSignals?: ProfileSignals };
type Mode = "profile" | "situation";

const categories = [["item", "ნივთი"], ["pet", "ძაღლი / კატა"], ["parking", "ავტომობილი"], ["emergency", "Emergency"]];
const prompts: Record<string, string> = {
  dog: "აღწერეთ სად და როდის დაიკარგა ძაღლი ან რა მოგწერათ მპოვნელმა.", cat: "აღწერეთ სად ნახეთ კატა ან რა დახმარება გჭირდებათ.",
  parking: "აღწერეთ პარკირების ან ავტომობილთან დაკავშირებული სიტუაცია.", keys: "აღწერეთ სად იპოვეთ ან დაკარგეთ გასაღები.",
  wallet: "აღწერეთ საფულის პოვნის ან დაკარგვის სიტუაცია — ბარათის ნომრები არ დაწეროთ.", bag: "აღწერეთ ჩანთის პოვნის ან დაკარგვის სიტუაცია.",
  suitcase: "აღწერეთ აეროპორტი, ტრანსპორტი ან დაკარგვის გარემოება.", emergency: "აღწერეთ მდგომარეობა. უშუალო საფრთხისას ჯერ დარეკეთ 112-ზე.",
};
const scenarios: Record<string, string[]> = {
  dog: ["დაიკარგა", "იპოვეს", "ეშინია"], cat: ["დაიკარგა", "იმალება", "იპოვეს"], parking: ["გასასვლელი ჩაკეტილია", "ფარები ჩართულია", "დაზიანებულია"],
  keys: ["ვიპოვე", "დავკარგე", "დაბრუნება"], wallet: ["ვიპოვე", "დავკარგე", "ბარათების დაცვა"], bag: ["ვიპოვე", "დავკარგე", "დაბრუნება"],
  suitcase: ["აეროპორტში დაიკარგა", "ვიპოვე", "Lost & Found"], emergency: ["კონტაქტურია", "მესამე პირია", "სასწრაფო საფრთხეა"],
};

export default function AppAiAssistant({ category, profileName, subjectMode, embedded = false, profileSignals }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(profileSignals ? "profile" : "situation");
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "item");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const activeCategory = category || selectedCategory;

  async function analyze(event: FormEvent) {
    event.preventDefault();
    if (!consent) return setError("AI ანალიზისთვის მონიშნეთ თანხმობა.");
    const input = mode === "profile" && profileSignals
      ? `შეაფასე ${activeCategory} QR პროფილის მზადყოფნა: შევსება ${profileSignals.completeness}%, აკლია ${profileSignals.missingCount} აუცილებელი ველი, ხილულია ${profileSignals.visibilityCount} საკონტაქტო/ინფორმაციული ფუნქცია, Lost Mode ${profileSignals.lostMode ? "ჩართულია" : "გამორთულია"}, Live Chat ${profileSignals.liveChat ? "ჩართულია" : "გამორთულია"}, სკანირება ${profileSignals.scanCount}. მომეცი სამი მოკლე პრიორიტეტული რეკომენდაცია.`
      : message.trim();
    if (input.length < 2) return setError("მოკლედ აღწერეთ სიტუაცია.");
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/ai/guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: input, category: activeCategory, subjectMode }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI ანალიზი ვერ შესრულდა.");
      setResult(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "AI დროებით მიუწვდომელია."); }
    finally { setLoading(false); }
  }

  const content = <form onSubmit={analyze}>
    <div className="aiIntro"><span>AI</span><div><b>{profileName || "KOMPASI პროფილი"}</b><small>ანალიზი და უსაფრთხო მოქმედების გეგმა</small></div></div>
    {profileSignals && <div className="modeTabs"><button type="button" className={mode === "profile" ? "active" : ""} onClick={() => { setMode("profile"); setResult(null); }}>პროფილის ანალიზი</button><button type="button" className={mode === "situation" ? "active" : ""} onClick={() => { setMode("situation"); setResult(null); }}>სიტუაციის ანალიზი</button></div>}
    {!category && <label>კატეგორია<select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
    {mode === "profile" && profileSignals ? <div className="score"><div><strong>{profileSignals.completeness}%</strong><span>შევსებულია</span></div><div><strong>{profileSignals.missingCount}</strong><span>აკლია</span></div><div><strong>{profileSignals.visibilityCount}</strong><span>ხილულია</span></div></div> : <><div className="scenarioGrid">{(scenarios[activeCategory] || []).map((scenario) => <button type="button" key={scenario} className={message === scenario ? "selected" : ""} onClick={() => setMessage(scenario)}>{scenario}</button>)}</div><label>რა მოხდა?<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={prompts[activeCategory] || "აღწერეთ სიტუაცია…"} /></label></>}
    {activeCategory === "emergency" && <div className="emergencyNote"><b>უშუალო საფრთხეა?</b><span>AI არ ცვლის ექიმს ან 112-ს.</span><a href="tel:112">112-ზე დარეკვა</a></div>}
    <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>თანახმა ვარ, ანალიზისთვის ტექსტი OpenAI-ს გადაეცეს. პროფილის სახელი და საკონტაქტო მონაცემები არ იგზავნება.</span></label>
    {error && <p className="aiError">{error}</p>}
    <button className="analyze" disabled={loading}>{loading ? "მიმდინარეობს ანალიზი…" : mode === "profile" ? "პროფილის გაანალიზება" : "სიტუაციის გაანალიზება"}</button>
    {result && <div className={`aiResult ${result.suspicious ? "warning" : ""}`}><small>{result.urgency === "emergency" ? "გადაუდებელი" : "AI რეკომენდაცია"}</small><b>{result.summary_ka}</b><p>{result.recommended_action_ka}</p>{result.safety_warning_ka && <em>{result.safety_warning_ka}</em>}</div>}
  </form>;

  return <section className={`appAi ${embedded || open ? "open" : ""} ${embedded ? "embedded" : ""}`}>
    {!embedded && <button className="aiHead" type="button" onClick={() => setOpen(!open)} aria-expanded={open}><b>AI პროფილის დამხმარე</b><span>{open ? "×" : "›"}</span></button>}
    {(embedded || open) && content}
    <style jsx>{`.appAi{overflow:hidden;margin-top:8px;border:1px solid #cbdff3;border-radius:14px;background:#fff;color:#173652}.appAi.embedded{margin:0;border:0;border-radius:0}.aiHead{width:100%;height:50px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;border:0;background:#fff;color:#173652}.aiHead b{font-size:12px}.aiHead span{color:#159761;font-size:20px}.appAi form{padding:10px;background:#f8fbff}.aiIntro{padding:10px;display:flex;align-items:center;gap:9px;border-radius:11px;background:linear-gradient(135deg,#075dcc,#159b65);color:#fff}.aiIntro>span{width:34px;height:34px;display:grid;place-items:center;flex:0 0 34px;border-radius:9px;background:#ffffff2b;font-size:11px;font-weight:950}.aiIntro b,.aiIntro small{display:block}.aiIntro b{font-size:12px}.aiIntro small{margin-top:2px;color:#dff7ed;font-size:9px}.modeTabs{margin-top:9px;padding:3px;display:grid;grid-template-columns:1fr 1fr;gap:3px;border-radius:10px;background:#e7f0f9}.modeTabs button{min-height:36px;border:0;border-radius:8px;background:transparent;color:#60778d;font-size:10px;font-weight:850}.modeTabs button.active{background:#fff;color:#075dcc;box-shadow:0 2px 7px #173f6d18}.score{margin-top:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.score div{padding:10px 5px;border:1px solid #d7e5f2;border-radius:10px;background:#fff;text-align:center}.score strong,.score span{display:block}.score strong{color:#08784a;font-size:17px}.score span{margin-top:2px;color:#73889b;font-size:8px}.scenarioGrid{margin-top:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.scenarioGrid button{min-height:36px;padding:5px;border:1px solid #cfdeed;border-radius:9px;background:#fff;color:#42617e;font-size:8px;font-weight:800}.scenarioGrid button.selected{border-color:#159b65;background:#e7f8ef;color:#08784a}.appAi form>label{display:block;margin-top:9px;color:#4e687f;font-size:10px;font-weight:850}.appAi select,.appAi textarea{width:100%;margin-top:5px;border:1px solid #cfdeed;border-radius:9px;background:#fff;color:#173652;font:600 12px Inter,Arial}.appAi select{height:40px;padding:0 9px}.appAi textarea{min-height:76px;padding:9px;resize:none}.consent{display:flex!important;align-items:flex-start;gap:7px;font-size:8px!important;font-weight:650!important;line-height:1.4}.consent input{margin:2px 0 0}.analyze{width:100%;height:40px;margin-top:9px;border:0;border-radius:9px;background:#0868d8;color:#fff;font-size:10px;font-weight:900}.aiError{margin:7px 0 0;color:#b02f3b;font-size:9px}.aiResult{margin-top:9px;padding:11px;border-radius:10px;background:#e8f7ef;color:#174c36}.aiResult.warning{background:#fff2e8;color:#783d17}.aiResult small,.aiResult b{display:block}.aiResult small{font-size:8px;font-weight:900}.aiResult b{margin-top:4px;font-size:10px}.aiResult p{margin:5px 0 0;font-size:10px;line-height:1.45}.aiResult em{display:block;margin-top:5px;font-size:9px;font-style:normal}.emergencyNote{margin-top:9px;padding:9px;border-radius:9px;background:#fff0f0;color:#8f2029}.emergencyNote b,.emergencyNote span{display:block}.emergencyNote b{font-size:10px}.emergencyNote span{margin-top:2px;font-size:8px}.emergencyNote a{min-height:34px;margin-top:7px;display:grid;place-items:center;border-radius:8px;background:#c92f3b;color:#fff;text-decoration:none;font-size:10px;font-weight:900}@media(max-width:360px){.scenarioGrid{grid-template-columns:1fr}.modeTabs button{font-size:9px}}`}</style>
  </section>;
}
