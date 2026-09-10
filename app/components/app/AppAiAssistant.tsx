"use client";

import { FormEvent, useState } from "react";

type Result = { urgency: string; summary_ka: string; recommended_action_ka: string; suspicious: boolean; safety_warning_ka?: string | null };
type Props = { category?: string; profileName?: string | null; subjectMode?: "self" | "other" | null; embedded?: boolean };

const categories = [["item", "ნივთი"], ["pet", "ძაღლი / კატა"], ["parking", "ავტომობილი"], ["emergency", "Emergency"]];
const prompts: Record<string, string> = {
  dog: "მაგალითად: ჩემი ძაღლი დაიკარგა — რა გავაკეთო პირველ რიგში?",
  cat: "მაგალითად: კატა სახლიდან გავიდა — როგორ მოვძებნო უსაფრთხოდ?",
  parking: "მაგალითად: მანქანა გასასვლელს კეტავს — როგორ დავუკავშირდე მფლობელს?",
  keys: "მაგალითად: გასაღებები ვიპოვე — როგორ დავაბრუნო უსაფრთხოდ?",
  wallet: "მაგალითად: საფულე ვიპოვე — როგორ დავიცვა პირადი მონაცემები?",
  bag: "მაგალითად: ჩანთა ვიპოვე — რა არის უსაფრთხო შემდეგი ნაბიჯი?",
  suitcase: "მაგალითად: ჩემოდანი აეროპორტში დაიკარგა — როგორ მოვიქცე?",
  emergency: "აღწერეთ მდგომარეობა. უშუალო საფრთხის შემთხვევაში ჯერ დარეკეთ 112-ზე.",
};

export default function AppAiAssistant({ category, profileName, subjectMode, embedded = false }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "item");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const activeCategory = category || selectedCategory;

  async function analyze(event: FormEvent) {
    event.preventDefault();
    if (!consent) { setError("AI ანალიზისთვის საჭიროა თანხმობა."); return; }
    if (message.trim().length < 2) { setError("მოკლედ აღწერეთ სიტუაცია."); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/ai/guide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, category: activeCategory, profileName, subjectMode }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI ანალიზი ვერ შესრულდა.");
      setResult(data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "AI ანალიზი დროებით მიუწვდომელია."); }
    finally { setLoading(false); }
  }

  const form = <form onSubmit={analyze}>
    {!category && <label>კატეგორია<select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>{categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
    {activeCategory === "emergency" && <div className="emergencyWarning"><b>გადაუდებელი შემთხვევა?</b><span>AI არ ცვლის ექიმს ან 112-ს. უშუალო საფრთხისას ჯერ დარეკეთ 112-ზე.</span><a href="tel:112">112-ზე დარეკვა</a></div>}
    <label>რა მოხდა?<textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder={prompts[activeCategory] || "მოკლედ აღწერეთ სიტუაცია…"} /></label>
    <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span>თანახმა ვარ, ტექსტი AI ანალიზისთვის OpenAI-ს გადაეცეს.</span></label>
    {error && <p className="aiError">{error}</p>}
    <button className="analyze" disabled={loading}>{loading ? "AI აანალიზებს…" : "სიტუაციის შეფასება →"}</button>
    {result && <div className={`aiResult ${result.suspicious ? "warning" : ""}`}><small>{result.urgency === "emergency" ? "გადაუდებელი" : result.urgency === "high" ? "მაღალი პრიორიტეტი" : "AI რეკომენდაცია"}</small><b>{result.summary_ka}</b><p>{result.recommended_action_ka}</p>{result.safety_warning_ka && <em>{result.safety_warning_ka}</em>}{result.urgency === "emergency" && <a href="tel:112">112-ზე დარეკვა</a>}</div>}
  </form>;

  return <section className={`appAi ${embedded || open ? "open" : ""} ${embedded ? "embedded" : ""}`}>
    {!embedded && <button className="aiHead" onClick={() => setOpen(!open)} aria-expanded={open}><span className="aiLogo">AI</span><span><small>KOMPASI INTELLIGENCE</small><b>ჭკვიანი დახმარება</b><em>სიტუაციის შეფასება და უსაფრთხო მოქმედება</em></span><i>{open ? "×" : "›"}</i></button>}
    {(embedded || open) && form}
    <style jsx>{`.appAi{margin-top:11px;border:1px solid #cfe0f2;border-radius:18px;background:#fff;box-shadow:0 8px 24px #173f6d10;overflow:hidden}.appAi.embedded{margin:0;border:0;border-radius:0;box-shadow:none}.aiHead{width:100%;min-height:72px;padding:12px 14px;display:flex;align-items:center;gap:11px;border:0;background:linear-gradient(135deg,#fff,#f0f6ff);color:#173652;text-align:left}.aiLogo{width:43px;height:43px;display:grid;place-items:center;flex:0 0 43px;border-radius:13px;background:linear-gradient(145deg,#096ce0,#644ada);color:#fff;font-size:13px;font-weight:950}.aiHead>span:nth-child(2){min-width:0;flex:1}.aiHead small,.aiHead b,.aiHead em{display:block}.aiHead small{color:#6653cf;font-size:8px;font-weight:950}.aiHead b{margin-top:3px;font-size:13px}.aiHead em{margin-top:3px;color:#71869a;font-size:9px;font-style:normal}.aiHead>i{font-size:21px;font-style:normal}.appAi form{padding:8px 14px 15px}.appAi form>label{display:block;margin-top:12px;color:#536b82;font-size:10px;font-weight:850}.appAi select,.appAi textarea{width:100%;margin-top:6px;border:1px solid #d5e1ed;border-radius:11px;background:#f9fbfe;color:#173652;font:600 12px Inter,Arial,sans-serif}.appAi select{height:42px;padding:0 10px}.appAi textarea{min-height:88px;padding:11px;resize:vertical}.consent{display:flex!important;align-items:flex-start;gap:8px;font-weight:650!important;line-height:1.4}.consent input{margin:2px 0 0}.analyze{width:100%;height:44px;margin-top:12px;border:0;border-radius:11px;background:#0b63cf;color:#fff;font-size:11px;font-weight:900}.aiError{color:#b02f3b;font-size:10px}.aiResult{margin-top:11px;padding:13px;border-radius:12px;background:#ecf7f2;color:#174c36}.aiResult.warning{background:#fff4eb;color:#7b3c12}.aiResult small,.aiResult b{display:block}.aiResult b{margin-top:5px;font-size:11px}.aiResult p{font-size:10px;line-height:1.5}.aiResult em{display:block;font-size:9px;font-style:normal}.aiResult a,.emergencyWarning a{margin-top:9px;min-height:38px;display:grid;place-items:center;border-radius:9px;background:#d82f3b;color:#fff;text-decoration:none;font-size:11px;font-weight:900}.emergencyWarning{margin-top:8px;padding:12px;border-radius:11px;background:#fff0f0;color:#8f2029}.emergencyWarning b,.emergencyWarning span{display:block}.emergencyWarning b{font-size:12px}.emergencyWarning span{margin-top:4px;font-size:9px;line-height:1.45}`}</style>
  </section>;
}
