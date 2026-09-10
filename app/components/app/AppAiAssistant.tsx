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
    <div className="aiIntro"><span>AI</span><div><b>KOMPASI Intelligence</b><small>{profileName || "QR პროფილი"} · უსაფრთხოების ანალიზი და მოქმედების გეგმა</small></div></div>
    <div className="aiCapabilities"><span><b>01</b> მზადყოფნა</span><span><b>02</b> რისკი</span><span><b>03</b> შემდეგი ნაბიჯი</span></div>
    {profileSignals && <div className="modeTabs"><button type="button" className={mode === "profile" ? "active" : ""} onClick={() => { setMode("profile"); setResult(null); }}>პროფილის ანალიზი</button><button type="button" className={mode === "situation" ? "active" : ""} onClick={() => { setMode("situation"); setResult(null); }}>სიტუაციის ანალიზი</button></div>}
    {!category && <label>კატეგორია<select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
    {mode === "profile" && profileSignals ? <div className="score"><div><strong>{profileSignals.completeness}%</strong><span>შევსებულია</span></div><div><strong>{profileSignals.missingCount}</strong><span>აკლია</span></div><div><strong>{profileSignals.visibilityCount}</strong><span>ხილულია</span></div></div> : <><div className="scenarioGrid">{(scenarios[activeCategory] || []).map((scenario) => <button type="button" key={scenario} className={message === scenario ? "selected" : ""} onClick={() => setMessage(scenario)}>{scenario}</button>)}</div><label>რა მოხდა?<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={prompts[activeCategory] || "აღწერეთ სიტუაცია…"} /></label></>}
    {activeCategory === "emergency" && <div className="emergencyNote"><b>უშუალო საფრთხეა?</b><span>AI არ ცვლის ექიმს ან 112-ს.</span><a href="tel:112">112-ზე დარეკვა</a></div>}
    <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>თანახმა ვარ, ანალიზისთვის ტექსტი OpenAI-ს გადაეცეს. პროფილის სახელი და საკონტაქტო მონაცემები არ იგზავნება.</span></label>
    {error && <p className="aiError">{error}</p>}
    <button className="analyze" disabled={loading}>{loading ? "მიმდინარეობს ანალიზი…" : mode === "profile" ? "პროფილის გაანალიზება" : "სიტუაციის გაანალიზება"}</button>
    {result && <div className={`aiResult ${result.suspicious ? "warning" : ""}`}><small>{result.urgency === "emergency" ? "გადაუდებელი შეფასება" : "KOMPASI AI შეფასება"}</small><b>{result.summary_ka}</b><div className="nextAction"><span>რეკომენდებული მოქმედება</span><p>{result.recommended_action_ka}</p></div>{result.safety_warning_ka && <em>{result.safety_warning_ka}</em>}</div>}
  </form>;

  return <section className={`appAi ${embedded || open ? "open" : ""} ${embedded ? "embedded" : ""}`}>
    {!embedded && <button className="aiHead" type="button" onClick={() => setOpen(!open)} aria-expanded={open}><b>AI პროფილის დამხმარე</b><span>{open ? "×" : "›"}</span></button>}
    {(embedded || open) && content}
    <style jsx>{`.appAi{overflow:hidden;margin-top:8px;border:1px solid #cbdff3;border-radius:14px;background:#fff;color:#173652;font-family:"Noto Sans Georgian","Sylfaen",-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif}.appAi.embedded{margin:0;border:0;border-radius:0}.aiHead{width:100%;height:52px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border:0;background:#fff;color:#173652}.aiHead b{font-size:14px}.aiHead span{color:#159761;font-size:20px}.appAi form{padding:14px;background:#f8fbff}.aiIntro{padding:14px;display:flex;align-items:center;gap:11px;border-radius:13px;background:linear-gradient(135deg,#075dcc,#159b65);color:#fff}.aiIntro>span{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:11px;background:#ffffff2b;font-size:13px;font-weight:950}.aiIntro b,.aiIntro small{display:block}.aiIntro b{font-size:15px}.aiIntro small{margin-top:4px;color:#dff7ed;font-size:11px;line-height:1.4}.aiCapabilities{margin-top:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.aiCapabilities span{padding:9px 5px;border:1px solid #d7e5f2;border-radius:9px;background:#fff;color:#526b83;text-align:center;font-size:10px;font-weight:750}.aiCapabilities b{color:#0b69cf}.modeTabs{margin-top:10px;padding:4px;display:grid;grid-template-columns:1fr 1fr;gap:4px;border-radius:11px;background:#e7f0f9}.modeTabs button{min-height:42px;border:0;border-radius:9px;background:transparent;color:#60778d;font-size:12px;font-weight:850}.modeTabs button.active{background:#fff;color:#075dcc;box-shadow:0 2px 7px #173f6d18}.score{margin-top:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.score div{padding:13px 6px;border:1px solid #d7e5f2;border-radius:11px;background:#fff;text-align:center}.score strong,.score span{display:block}.score strong{color:#08784a;font-size:21px}.score span{margin-top:3px;color:#73889b;font-size:10px}.scenarioGrid{margin-top:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.scenarioGrid button{min-height:43px;padding:7px;border:1px solid #cfdeed;border-radius:10px;background:#fff;color:#42617e;font-size:10px;font-weight:800}.scenarioGrid button.selected{border-color:#159b65;background:#e7f8ef;color:#08784a}.appAi form>label{display:block;margin-top:11px;color:#4e687f;font-size:12px;font-weight:850}.appAi select,.appAi textarea{width:100%;margin-top:6px;border:1px solid #cfdeed;border-radius:10px;background:#fff;color:#173652;font:600 14px inherit}.appAi select{height:44px;padding:0 10px}.appAi textarea{min-height:96px;padding:11px;resize:none}.consent{display:flex!important;align-items:flex-start;gap:9px;font-size:10px!important;font-weight:650!important;line-height:1.5}.consent input{width:17px;height:17px;margin:1px 0 0;flex:0 0 17px}.analyze{width:100%;height:46px;margin-top:11px;border:0;border-radius:10px;background:#0868d8;color:#fff;font-size:12px;font-weight:900}.aiError{margin:8px 0 0;color:#b02f3b;font-size:11px}.aiResult{margin-top:11px;padding:14px;border:1px solid #cce8d9;border-radius:12px;background:#e8f7ef;color:#174c36}.aiResult.warning{border-color:#f0d5be;background:#fff2e8;color:#783d17}.aiResult small,.aiResult>b{display:block}.aiResult small{font-size:10px;font-weight:900;letter-spacing:.35px}.aiResult>b{margin-top:7px;font-size:14px;line-height:1.45}.nextAction{margin-top:11px;padding-top:10px;border-top:1px solid currentColor}.nextAction span{font-size:10px;font-weight:900}.aiResult p{margin:5px 0 0;font-size:13px;line-height:1.55}.aiResult em{display:block;margin-top:8px;font-size:11px;line-height:1.45;font-style:normal}.emergencyNote{margin-top:10px;padding:11px;border-radius:10px;background:#fff0f0;color:#8f2029}.emergencyNote b,.emergencyNote span{display:block}.emergencyNote b{font-size:12px}.emergencyNote span{margin-top:3px;font-size:10px}.emergencyNote a{min-height:40px;margin-top:8px;display:grid;place-items:center;border-radius:9px;background:#c92f3b;color:#fff;text-decoration:none;font-size:12px;font-weight:900}@media(max-width:360px){.scenarioGrid,.aiCapabilities{grid-template-columns:1fr}.modeTabs button{font-size:11px}}`}</style>
  </section>;
}
