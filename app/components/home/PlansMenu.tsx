"use client";
import ServiceChoiceCards from "../service/ServiceChoiceCards";
export default function PlansMenu({ ka = true }: { ka?: boolean }) {
  return <section className="plansMenu" aria-label={ka ? "მომსახურება და პაკეტები" : "Service and plans"}>
    <div className="plansInner"><header><div><small>QR RETURN</small><h2>{ka ? "მომსახურება და პაკეტები" : "Service and plans"}</h2></div><span>{ka ? "პირველი 60 დღე უფასოა" : "First 60 days free"}</span></header><ServiceChoiceCards ka={ka}/></div>
    <style jsx>{`
      .plansMenu{position:relative;z-index:90;padding:28px 24px 32px;background:#f5f8fb;border-bottom:1px solid #dce6ef;color:#173953;font-family:var(--font-georgian),Arial,sans-serif}.plansInner{max-width:1120px;margin:auto}header{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:22px}header small{color:#667e94;font-size:12px;font-weight:600;letter-spacing:.12em}h2{font-size:24px;font-weight:650;line-height:1.5;margin:5px 0 0}header>span{padding:9px 13px;border:1px solid #d6e6df;border-radius:30px;color:#376958;background:#edf6f1;font-size:13px;white-space:nowrap}@media(max-width:620px){.plansMenu{padding:22px 16px}header{align-items:flex-start;flex-direction:column;gap:12px}h2{font-size:21px}}
    `}</style>
  </section>;
}
