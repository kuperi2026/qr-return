"use client";

import { useMemo, useState } from "react";

type Props = {
  category: string;
  tagCode: string;
  lostMode: boolean;
  phone?: string | null;
  chatHref?: string | null;
  canShareLocation?: boolean;
  onShareLocation?: () => void;
  emergency?: boolean;
};

type SmartAction = {
  icon: string;
  label: string;
  message: string;
  urgent?: boolean;
};

type AiAnalysis = {
  detected_language: string;
  urgency: "low" | "medium" | "high" | "emergency";
  intent: string;
  summary_ka: string;
  recommended_action_ka: string;
  suggested_message_ka: string;
  suspicious: boolean;
  safety_warning_ka: string | null;
  source: string;
};

const ACTIONS: Record<string, SmartAction[]> = {
  dog: [
    { icon: "🐾", label: "ცხოველი უსაფრთხოდ არის", message: "გამარჯობა, თქვენი ძაღლი ვიპოვე და უსაფრთხოდ არის." },
    { icon: "📍", label: "ახლოს დავინახე", message: "თქვენი ძაღლი ახლოს დავინახე. შემიძლია მდებარეობა გაგიზიაროთ." },
    { icon: "🚨", label: "დახმარება სჭირდება", message: "თქვენი ძაღლი ვიპოვე და შესაძლოა დახმარება სჭირდებოდეს.", urgent: true },
  ],
  cat: [
    { icon: "🐾", label: "ცხოველი უსაფრთხოდ არის", message: "გამარჯობა, თქვენი კატა ვიპოვე და უსაფრთხოდ არის." },
    { icon: "📍", label: "ახლოს დავინახე", message: "თქვენი კატა ახლოს დავინახე. შემიძლია მდებარეობა გაგიზიაროთ." },
    { icon: "🚨", label: "დახმარება სჭირდება", message: "თქვენი კატა ვიპოვე და შესაძლოა დახმარება სჭირდებოდეს.", urgent: true },
  ],
  parking: [
    { icon: "🚗", label: "მანქანა მიშლის ხელს", message: "გამარჯობა, თქვენი ავტომობილი მოძრაობაში მიშლის ხელს. გთხოვთ, შეძლებისდაგვარად მალე დამიკავშირდეთ.", urgent: true },
    { icon: "💡", label: "ფარები ჩართულია", message: "გამარჯობა, თქვენს ავტომობილს ფარები ჩართული დარჩა." },
    { icon: "⚠️", label: "სხვა პრობლემა", message: "გამარჯობა, თქვენს ავტომობილთან დაკავშირებით მნიშვნელოვანი ინფორმაცია მაქვს." },
  ],
  suitcase: [
    { icon: "🧳", label: "ჩემოდანი ვიპოვე", message: "გამარჯობა, თქვენი ჩემოდანი ვიპოვე და უსაფრთხოდ მაქვს." },
    { icon: "📍", label: "ადგილზე დავტოვე", message: "თქვენი ჩემოდანი ვიპოვე. შემიძლია ზუსტი მდებარეობა გაგიზიაროთ." },
    { icon: "💬", label: "დეტალების მიწერა", message: "გამარჯობა, თქვენი ჩემოდნის დაბრუნებასთან დაკავშირებით გწერთ." },
  ],
  keys: [
    { icon: "🔑", label: "გასაღები ვიპოვე", message: "გამარჯობა, თქვენი გასაღები ვიპოვე და უსაფრთხოდ მაქვს." },
    { icon: "📍", label: "ადგილის გაზიარება", message: "თქვენი გასაღები ვიპოვე. შემიძლია მდებარეობა გაგიზიაროთ." },
  ],
  wallet: [
    { icon: "👛", label: "საფულე ვიპოვე", message: "გამარჯობა, თქვენი საფულე ვიპოვე და უსაფრთხოდ მაქვს." },
    { icon: "📍", label: "ადგილის გაზიარება", message: "თქვენი საფულე ვიპოვე. შემიძლია მდებარეობა გაგიზიაროთ." },
  ],
  bag: [
    { icon: "👜", label: "ჩანთა ვიპოვე", message: "გამარჯობა, თქვენი ჩანთა ვიპოვე და უსაფრთხოდ მაქვს." },
    { icon: "📍", label: "ადგილის გაზიარება", message: "თქვენი ჩანთა ვიპოვე. შემიძლია მდებარეობა გაგიზიაროთ." },
  ],
  emergency: [
    { icon: "🚑", label: "გადაუდებელი დახმარება", message: "Emergency პროფილი დავასკანერე. პირს შესაძლოა გადაუდებელი დახმარება სჭირდებოდეს.", urgent: true },
    { icon: "📍", label: "ლოკაციის გაზიარება", message: "Emergency პროფილი დავასკანერე და შემიძლია მდებარეობა გაგიზიაროთ." },
    { icon: "📞", label: "საკონტაქტო პირთან კავშირი", message: "Emergency პროფილზე მითითებულ საკონტაქტო პირს ვუკავშირდები." },
  ],
};

export default function AiFinderGuide({
  category,
  tagCode,
  lostMode,
  phone,
  chatHref,
  canShareLocation,
  onShareLocation,
  emergency = false,
}: Props) {
  const normalized = emergency ? "emergency" : category.toLowerCase();
  const actions = useMemo(
    () => ACTIONS[normalized] || [
      { icon: "📦", label: "ნივთი ვიპოვე", message: "გამარჯობა, თქვენი ნივთი ვიპოვე და უსაფრთხოდ მაქვს." },
      { icon: "📍", label: "ადგილის გაზიარება", message: "თქვენი ნივთი ვიპოვე. შემიძლია მდებარეობა გაგიზიაროთ." },
    ],
    [normalized]
  );
  const [selected, setSelected] = useState<SmartAction | null>(null);
  const [situation, setSituation] = useState("");
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const suggestedMessage = analysis?.suggested_message_ka || selected?.message || "";
  const chatLink = suggestedMessage && chatHref
    ? `${chatHref}?${new URLSearchParams({ suggestion: suggestedMessage }).toString()}`
    : chatHref || "#";

  async function analyzeSituation() {
    const clean = situation.trim();
    if (clean.length < 2 || analyzing) return;
    setAnalyzing(true);
    setAnalysisError("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/ai/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, category: normalized, lostMode }),
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "AI ანალიზი ვერ შესრულდა.");
      setAnalysis(result as AiAnalysis);
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : "AI ანალიზი დროებით მიუწვდომელია.");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <section className="aiGuide" aria-label="QR RETURN AI ასისტენტი">
      <div className="aiGuideHead">
        <div className="aiOrb">AI</div>
        <div>
          <small>QR RETURN AI ENGINE</small>
          <h2>{emergency ? "SOS ასისტენტი" : "როგორ დაგეხმაროთ?"}</h2>
          <p>
            {emergency
              ? "აირჩიეთ სიტუაცია. გადაუდებელ შემთხვევაში პირველ რიგში დარეკეთ 911-ზე."
              : `სისტემამ ამოიცნო ${categoryLabel(normalized)} პროფილი${lostMode ? " და აქტიური Lost Mode" : ""}. აირჩიეთ შესაბამისი მოქმედება.`}
          </p>
        </div>
        <span className="aiReady">● მზადაა</span>
      </div>

      <div className="aiActions">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`aiAction ${selected?.label === action.label ? "selected" : ""} ${action.urgent ? "urgent" : ""}`}
            onClick={() => setSelected(action)}
          >
            <span>{action.icon}</span>
            <strong>{action.label}</strong>
          </button>
        ))}
      </div>

      <div className="aiDescribe">
        <label htmlFor={`ai-situation-${tagCode}`}>ან აღწერეთ რა მოხდა</label>
        <div className="aiInputRow">
          <textarea
            id={`ai-situation-${tagCode}`}
            value={situation}
            onChange={(event) => setSituation(event.target.value)}
            placeholder={emergency ? "მაგალითად: ადამიანი უგონოდაა..." : "მაგალითად: მანქანა გასასვლელს კეტავს..."}
            maxLength={1000}
          />
          <button type="button" onClick={() => void analyzeSituation()} disabled={analyzing || situation.trim().length < 2}>
            {analyzing ? "AI აანალიზებს..." : "AI ანალიზი"}
          </button>
        </div>
        <small>არ ჩაწეროთ პაროლი, საბანკო მონაცემები ან ერთჯერადი კოდი.</small>
      </div>

      {analysisError && <div className="aiError">⚠ {analysisError}</div>}

      {analysis && (
        <div className={`aiAnalysis ${analysis.urgency} ${analysis.suspicious ? "suspicious" : ""}`}>
          <div className="aiAnalysisTop">
            <strong>{urgencyLabel(analysis.urgency)}</strong>
            <span>{analysis.detected_language.toUpperCase()}</span>
          </div>
          <p>{analysis.recommended_action_ka}</p>
          {analysis.safety_warning_ka && <div className="aiWarning">⚠ {analysis.safety_warning_ka}</div>}
          <div className="aiCtas">
            {analysis.urgency === "emergency" && <a className="aiEmergency" href="tel:911">☎ 911</a>}
            {canShareLocation && onShareLocation && <button type="button" onClick={onShareLocation}>📍 ლოკაცია</button>}
            {chatHref && <a href={chatLink}>💬 პირადი ჩათი</a>}
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>📞 დარეკვა</a>}
          </div>
        </div>
      )}

      {selected && (
        <div className="aiNext">
          <div>
            <small>AI რეკომენდაცია</small>
            <strong>{selected.message}</strong>
          </div>
          <div className="aiCtas">
            {emergency && selected.urgent && <a className="aiEmergency" href="tel:911">☎ 911</a>}
            {canShareLocation && onShareLocation && (
              <button type="button" onClick={onShareLocation}>📍 ლოკაცია</button>
            )}
            {chatHref && <a href={chatLink}>💬 პირადი ჩათი</a>}
            {phone && <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>📞 დარეკვა</a>}
          </div>
        </div>
      )}

      <style jsx>{`
        .aiGuide{margin:18px 0;padding:20px;border:1px solid #cfe0fb;border-radius:20px;background:linear-gradient(145deg,#f9fcff 0%,#edf5ff 100%);box-shadow:0 14px 38px rgba(13,72,156,.10);color:#17324f}
        .aiGuideHead{display:flex;align-items:center;gap:13px}.aiGuideHead>div:nth-child(2){flex:1}.aiOrb{width:52px;height:52px;display:grid;place-items:center;flex:0 0 52px;border-radius:16px;background:linear-gradient(135deg,#0b68e8,#7048e8);color:#fff;font-size:18px;font-weight:950;box-shadow:0 8px 20px rgba(25,91,214,.25)}
        .aiGuideHead small,.aiNext small{color:#7755e8;font-size:10px;font-weight:950;letter-spacing:.8px}.aiGuideHead h2{margin:4px 0;font-size:21px}.aiGuideHead p{margin:0;color:#5a6d84;font-size:13px;line-height:1.45}.aiReady{padding:7px 10px;border-radius:999px;background:#e9fbf2;color:#08754a;font-size:10px;font-weight:900}
        .aiActions{margin-top:16px;display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.aiAction{min-height:76px;padding:10px;border:1px solid #d4e1f4;border-radius:14px;background:#fff;color:#24415f;cursor:pointer;text-align:left}.aiAction span{display:block;font-size:21px}.aiAction strong{display:block;margin-top:6px;font-size:12px;line-height:1.25}.aiAction:hover,.aiAction.selected{border-color:#1769e8;box-shadow:0 0 0 2px rgba(23,105,232,.12)}.aiAction.urgent.selected{border-color:#d92d20;background:#fff7f6}
        .aiDescribe{margin-top:15px}.aiDescribe label{display:block;margin-bottom:7px;color:#17324f;font-size:13px;font-weight:900}.aiInputRow{display:grid;grid-template-columns:1fr auto;gap:8px}.aiInputRow textarea{min-height:70px;padding:11px;border:1px solid #cbd9ed;border-radius:12px;background:#fff;color:#17324f;font:inherit;resize:vertical}.aiInputRow button{padding:0 15px;border:0;border-radius:12px;background:#1769e8;color:#fff;font-weight:900;cursor:pointer}.aiInputRow button:disabled{opacity:.55;cursor:default}.aiDescribe>small{display:block;margin-top:6px;color:#75869a;font-size:10px}.aiError{margin-top:10px;padding:10px;border-radius:10px;background:#fff1f0;color:#b42318;font-size:12px}.aiAnalysis{margin-top:13px;padding:14px;border-radius:15px;background:#102f61;color:#fff}.aiAnalysis.high{background:#8b4513}.aiAnalysis.emergency,.aiAnalysis.suspicious{background:#8f1d1d}.aiAnalysisTop{display:flex;justify-content:space-between;gap:10px}.aiAnalysisTop span{font-size:10px;font-weight:900;opacity:.75}.aiAnalysis p{margin:8px 0 0;font-size:13px;line-height:1.5}.aiWarning{margin-top:9px;padding:9px;border-radius:9px;background:rgba(255,255,255,.14);font-size:12px;font-weight:800}.aiNext{margin-top:13px;padding:14px;border-radius:15px;background:#102f61;color:#fff}.aiNext small{color:#acd0ff}.aiNext strong{display:block;margin-top:4px;font-size:13px;line-height:1.45}.aiCtas{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}.aiCtas a,.aiCtas button{min-height:39px;padding:0 12px;display:inline-flex;align-items:center;border:0;border-radius:10px;background:#fff;color:#0b55bc;text-decoration:none;font-size:12px;font-weight:900;cursor:pointer}.aiCtas .aiEmergency{background:#d92d20;color:#fff}
        @media(max-width:620px){.aiInputRow{grid-template-columns:1fr}.aiInputRow button{min-height:44px}.aiGuide{padding:16px}.aiGuideHead{align-items:flex-start;flex-wrap:wrap}.aiOrb{width:46px;height:46px;flex-basis:46px}.aiReady{margin-left:59px;margin-top:-8px}.aiActions{grid-template-columns:1fr}.aiAction{min-height:58px;display:flex;align-items:center;gap:10px}.aiAction span,.aiAction strong{margin:0}.aiCtas{display:grid;grid-template-columns:1fr 1fr}.aiCtas a,.aiCtas button{justify-content:center}}
      `}</style>
    </section>
  );
}

function categoryLabel(type: string) {
  const labels: Record<string, string> = {
    dog: "ძაღლის",
    cat: "კატის",
    parking: "ავტომობილის",
    suitcase: "ჩემოდნის",
    keys: "გასაღების",
    key: "გასაღების",
    wallet: "საფულის",
    bag: "ჩანთის",
    emergency: "Emergency",
  };
  return labels[type] || "ნივთის";
}

function urgencyLabel(value: AiAnalysis["urgency"]) {
  if (value === "emergency") return "🚨 გადაუდებელი";
  if (value === "high") return "⚠ მაღალი პრიორიტეტი";
  if (value === "medium") return "● საშუალო პრიორიტეტი";
  return "✓ დაბალი პრიორიტეტი";
}
