"use client";
import { FormEvent, useState } from "react";

type Result = { summary_ka:string; recommended_action_ka:string; suggested_message_ka?:string; suspicious:boolean; safety_warning_ka?:string|null };
export type ProfileSignals = { completeness:number; missingCount:number; visibilityCount:number; lostMode:boolean; liveChat:boolean; scanCount:number };
type Props = { category?:string; profileName?:string|null; subjectMode?:"self"|"other"|null; embedded?:boolean; profileSignals?:ProfileSignals };
type Flow = "profile"|"lost"|"finder"|"scans";
const FLOWS:Record<Flow,{icon:string;title:string;note:string}> = {
  profile:{icon:"◇",title:"პროფილის გაუმჯობესება",note:"შევსება, ხილვადობა და მზადყოფნა"},
  lost:{icon:"!",title:"დავკარგე",note:"პერსონალური დაბრუნების გეგმა"},
  finder:{icon:"◌",title:"მპოვნელი დამიკავშირდა",note:"უსაფრთხო პასუხი და რისკის შემოწმება"},
  scans:{icon:"⌖",title:"სკანების ანალიზი",note:"აქტივობის შეფასება და შემდეგი ნაბიჯი"},
};

export default function AppAiAssistant({category="item",profileName,subjectMode,embedded=false,profileSignals}:Props) {
  const [open,setOpen]=useState(false);
  const [flow,setFlow]=useState<Flow>("profile");
  const [message,setMessage]=useState("");
  const [consent,setConsent]=useState(false);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<Result|null>(null);
  const [error,setError]=useState("");
  const emergency=category==="emergency";
  function choose(next:Flow){setFlow(next);setMessage("");setResult(null);setError("");}
  function buildPrompt(){
    const s=profileSignals ? "შევსება "+profileSignals.completeness+"%; აკლია "+profileSignals.missingCount+" ველი; ხილულია "+profileSignals.visibilityCount+" ფუნქცია; Lost Mode "+(profileSignals.lostMode?"ჩართულია":"გამორთულია")+"; Live Chat "+(profileSignals.liveChat?"ჩართულია":"გამორთულია")+"; "+profileSignals.scanCount+" სკანი." : "პროფილის მაჩვენებლები სრულად მიუწვდომელია.";
    const m=message.trim() ? " დამატებითი კონტექსტი: "+message.trim() : "";
    if(flow==="profile") return "ჩაატარე "+category+" QR პროფილის აუდიტი. "+s+" გამოყავი მთავარი რისკი და სამი პრიორიტეტული გაუმჯობესება.";
    if(flow==="lost") return category+" დაიკარგა. "+s+" შექმენი უსაფრთხო დაბრუნების გეგმა: რა გავაკეთო ახლავე, რა გავუზიარო მპოვნელს და რას მოვერიდო."+m;
    if(flow==="finder") return "მპოვნელი დამიკავშირდა "+category+" პროფილზე. შეაფასე თაღლითობის რისკი და მოამზადე უსაფრთხო მოკლე პასუხი."+(m||" მოამზადე უნივერსალური პასუხი.");
    return "გაანალიზე "+category+" QR პროფილის სკანები. "+s+" განმარტე შესაძლო მნიშვნელობა ზედმეტი დასკვნის გარეშე და მომეცი შემდეგი ნაბიჯი."+m;
  }
  async function analyze(event:FormEvent){
    event.preventDefault();
    if(!consent){setError("გასაგრძელებლად მონიშნეთ AI ანალიზის თანხმობა.");return;}
    setLoading(true);setError("");setResult(null);
    try{
      const response=await fetch("/api/ai/guide",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:buildPrompt(),category,subjectMode,lostMode:profileSignals?.lostMode})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||"AI ანალიზი ვერ შესრულდა.");
      setResult(data);
    }catch(caught){setError(caught instanceof Error?caught.message:"AI დროებით მიუწვდომელია.");}
    finally{setLoading(false);}
  }
  const content=<form onSubmit={analyze}>
    <div className="hero"><i>K</i><div><small>KOMPASI COPILOT</small><h3>{profileName||"თქვენი QR პროფილი"}</h3><p>AI, რომელიც ამოწმებს და შემდეგ მოქმედებას გთავაზობთ.</p></div>{profileSignals&&<strong>{profileSignals.completeness}%<span>მზადაა</span></strong>}</div>
    <div className="flows">{(Object.keys(FLOWS) as Flow[]).map(key=><button type="button" key={key} className={flow===key?"on":""} onClick={()=>choose(key)}><i>{FLOWS[key].icon}</i><span><b>{key==="lost"&&emergency?"Emergency გეგმა":FLOWS[key].title}</b><small>{FLOWS[key].note}</small></span><em>›</em></button>)}</div>
    <div className="work">
      <header><i>{FLOWS[flow].icon}</i><div><small>არჩეული მოქმედება</small><b>{flow==="lost"&&emergency?"Emergency გეგმა":FLOWS[flow].title}</b></div></header>
      {profileSignals&&<div className="signals"><span><b>{profileSignals.completeness}%</b>შევსება</span><span><b>{profileSignals.scanCount}</b>სკანი</span><span><b>{profileSignals.liveChat?"ON":"OFF"}</b>Live Chat</span></div>}
      {flow!=="profile"&&<label><span>დამატებითი ინფორმაცია <small>არასავალდებულო</small></span><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder={flow==="finder"?"ჩასვით მპოვნელის შეტყობინება — პირადი მონაცემების გარეშე…":"სურვილის შემთხვევაში დაამატეთ გარემოება…"}/></label>}
      {emergency&&<div className="emergency"><b>უშუალო საფრთხისას AI-ს ნუ დაელოდებით</b><span>{subjectMode==="other"?"თქვენ მართავთ მესამე პირის პროფილს.":"ეს პირადი Emergency პროფილია."}</span><a href="tel:112">112-ზე დარეკვა</a></div>}
      <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>ვეთანხმები AI ანალიზს. სახელი, კონტაქტები და ფარული მონაცემები არ იგზავნება.</span></label>
      {error&&<p className="error">{error}</p>}
      <button className="run" disabled={loading}>{loading?"KOMPASI აანალიზებს…":"✦ შექმენი მოქმედების გეგმა"}</button>
    </div>
    {result&&<div className={"result "+(result.suspicious?"risk":"")}><header><i>✦</i><div><small>{result.suspicious?"რისკი აღმოჩენილია":"KOMPASI-ს გეგმა მზადაა"}</small><b>{result.summary_ka}</b></div></header><section><small>შემდეგი ნაბიჯი</small><p>{result.recommended_action_ka}</p></section>{flow==="finder"&&result.suggested_message_ka&&<section><small>მზა პასუხი მპოვნელისთვის</small><p>{result.suggested_message_ka}</p></section>}{result.safety_warning_ka&&<div className="warning">⚠ {result.safety_warning_ka}</div>}</div>}
  </form>;
  const css=".copilot{overflow:hidden;margin-top:8px;border:1px solid #cbdff3;border-radius:15px;background:#fff;color:#173652;font-family:'Noto Sans Georgian','Sylfaen',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif}.embedded{margin:0;border:0}.head{width:100%;height:54px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;border:0;background:#fff;color:#173652}.head b{font-size:14px}.head span{font-size:21px}form{padding:12px;background:#f4f9ff}.hero{padding:17px 14px;display:flex;align-items:center;gap:11px;border-radius:16px;background:linear-gradient(135deg,#073d91,#096fce 53%,#12a86b);color:#fff;box-shadow:0 12px 26px #075dcc25}.hero>i{width:44px;height:44px;display:grid;place-items:center;flex:0 0 44px;border:1px solid #ffffff55;border-radius:14px;background:#ffffff20;font-size:19px;font-style:normal;font-weight:950}.hero>div{min-width:0;flex:1}.hero small{color:#cfe7ff;font-size:9px;font-weight:900;letter-spacing:1px}.hero h3{margin:3px 0;font-size:15px}.hero p{margin:0;color:#e2f2ff;font-size:10px}.hero>strong{font-size:18px;text-align:center}.hero>strong span{display:block;font-size:8px}.flows{margin-top:9px;display:grid;gap:6px}.flows button{min-height:60px;padding:9px;display:flex;align-items:center;gap:9px;border:1px solid #d4e2f0;border-radius:12px;background:#fff;color:#173652;text-align:left}.flows button>i,.work header>i,.result header>i{width:35px;height:35px;display:grid;place-items:center;flex:0 0 35px;border-radius:10px;background:#eaf3ff;color:#0968cc;font-style:normal;font-weight:900}.flows button>span{min-width:0;flex:1}.flows b,.flows small{display:block}.flows b{font-size:12px}.flows small{margin-top:3px;color:#71869a;font-size:9px}.flows em{font-size:20px;font-style:normal}.flows button.on{border-color:#0c75d8;background:#edf6ff}.flows button.on i{background:#0b6fd3;color:#fff}.work{margin-top:10px;padding:13px;border:1px solid #d5e3f0;border-radius:14px;background:#fff}.work header,.result header{display:flex;align-items:center;gap:9px}.work header small,.work header b,.result header small,.result header b{display:block}.work header small{color:#8194a6;font-size:9px}.work header b{font-size:13px}.signals{margin-top:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.signals span{padding:8px 4px;border-radius:9px;background:#f1f6fb;color:#6b8195;text-align:center;font-size:9px}.signals b{display:block;color:#087c53;font-size:13px}.work>label:not(.consent){display:block;margin-top:11px}.work>label>span{font-size:11px;font-weight:850}.work>label>span small{color:#8a9baa;font-size:9px}.work textarea{width:100%;min-height:84px;margin-top:6px;padding:10px;border:1px solid #cfdeed;border-radius:10px;background:#fafdff;color:#173652;font:600 13px inherit;resize:none}.consent{margin-top:11px;display:flex;gap:8px;color:#657b90;font-size:9px;line-height:1.45}.consent input{width:17px;height:17px;flex:0 0 17px;accent-color:#0b72d9}.run{width:100%;min-height:46px;margin-top:11px;border:0;border-radius:11px;background:linear-gradient(90deg,#0969d2,#0aa16b);color:#fff;font:900 12px inherit;box-shadow:0 8px 18px #0879b926}.run:disabled{opacity:.65}.error{color:#b02f3b;font-size:10px}.emergency{margin-top:10px;padding:10px;border-radius:10px;background:#fff0f0;color:#8f2029}.emergency b,.emergency span{display:block;font-size:10px}.emergency a{min-height:38px;margin-top:8px;display:grid;place-items:center;border-radius:9px;background:#c92f3b;color:#fff;text-decoration:none;font-size:12px;font-weight:900}.result{margin-top:10px;padding:14px;border:1px solid #bfe3d1;border-radius:14px;background:#eaf9f1}.result.risk{border-color:#efc6a8;background:#fff4eb}.result header>i{background:#0b9460;color:#fff}.result header small{color:#168059;font-size:9px;font-weight:900}.result header b{margin-top:4px;font-size:13px;line-height:1.45}.result section{margin-top:12px;padding:11px;border-radius:10px;background:#fff}.result section small{color:#167b58;font-size:9px;font-weight:900}.result section p{margin:5px 0 0;font-size:12px;line-height:1.55}.warning{margin-top:9px;padding:9px;border-radius:9px;background:#fff0e4;color:#8d481c;font-size:10px}@media(min-width:430px){.flows{grid-template-columns:1fr 1fr}}";
  return <section className={"copilot "+(embedded?"embedded":"")}>{!embedded&&<button className="head" type="button" onClick={()=>setOpen(!open)} aria-expanded={open}><b>KOMPASI Copilot</b><span>{open?"×":"›"}</span></button>}{(embedded||open)&&content}<style jsx>{css}</style></section>;
}
