"use client";
import Link from "next/link";

const rows = [
  ["🧳", "ჩემოდანი", 2, 5, 9, 16], ["🔑", "გასაღები", 2, 5, 9, 16],
  ["👛", "საფულე", 2, 5, 9, 16], ["👜", "ჩანთა", 2, 5, 9, 16],
  ["🐱", "კატა", 2, 5, 9, 16], ["🐶", "ძაღლი", 3, 8, 15, 27],
  ["🆘", "Emergency სამაჯური", 5, 13, 24, 43], ["🚗", "Parking QR", 6, 15, 27, 49],
];

export default function PlansMenu({ ka = true }: { ka?: boolean }) {
  return <section className="plansMenu">
    <div className="plansInner">
      <div className="plansHead"><div><span>QR RETURN SERVICE</span><h2>{ka ? "მომსახურება და პაკეტები" : "Service & plans"}</h2><p>{ka ? "ყველა ახალი QR პროფილი გააქტიურებიდან პირველი 2 თვე უფასოდ მუშაობს. შემდეგ აირჩიეთ თქვენთვის სასურველი მომსახურების ვადა." : "Every new QR profile includes two free months. Then choose the service period that suits you."}</p></div><div className="freeBadge"><strong>2 თვე</strong><small>{ka ? "უფასოდ" : "free"}</small></div></div>
      <div className="plansBody"><div className="tableWrap"><table><thead><tr><th>{ka ? "პროდუქტი" : "Product"}</th><th>1 {ka ? "თვე" : "month"}</th><th>3 {ka ? "თვე" : "months"}</th><th>6 {ka ? "თვე" : "months"}</th><th>1 {ka ? "წელი" : "year"}</th></tr></thead><tbody>{rows.map((row) => <tr key={String(row[1])}><td><span>{row[0]}</span><b>{row[1]}</b></td><td>{row[2]} ₾</td><td>{row[3]} ₾</td><td>{row[4]} ₾</td><td><strong>{row[5]} ₾</strong></td></tr>)}</tbody></table></div>
        <aside><h3>{ka ? "რამდენიმე პროდუქტის ფასდაკლება" : "Multi-product discount"}</h3><div><span>3–4 {ka ? "პროდუქტი" : "products"}</span><b>−5%</b></div><div><span>5–6 {ka ? "პროდუქტი" : "products"}</span><b>−10%</b></div><div><span>7 {ka ? "პროდუქტი" : "products"}</span><b>−12%</b></div><div><span>{ka ? "რვავე პროდუქტი" : "All 8 products"}</span><b>−15%</b></div><p>{ka ? "ფასდაკლება ავტომატურად აკლდება არჩეული მომსახურების პაკეტების ჯამურ ღირებულებას." : "The discount is automatically applied to the combined service-plan total."}</p><Link href="/account/subscriptions">{ka ? "პაკეტის შერჩევა" : "Choose a plan"} →</Link></aside>
      </div>
    </div>
    <style jsx>{`
      .plansMenu{position:relative;z-index:90;padding:24px 30px 28px;border-bottom:1px solid #dce6ef;background:#fff;color:#17314d;box-shadow:0 18px 35px rgba(0,35,70,.14)}.plansInner{max-width:1260px;margin:auto}.plansHead{margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:24px}.plansHead>div:first-child{max-width:850px}.plansHead span{color:#1266e9;font-size:11px;font-weight:950;letter-spacing:.12em}.plansHead h2{margin:5px 0 6px;font-size:27px}.plansHead p{margin:0;color:#60758a;font-size:15px;line-height:1.5}.freeBadge{min-width:130px;padding:13px 18px;border-radius:15px;background:linear-gradient(135deg,#0647c8,#1675ed);color:#fff;text-align:center}.freeBadge strong,.freeBadge small{display:block}.freeBadge strong{font-size:23px}.freeBadge small{margin-top:2px;font-size:12px}.plansBody{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:15px}.tableWrap{overflow-x:auto;border:1px solid #dfe8f1;border-radius:15px}table{width:100%;border-collapse:collapse}th,td{padding:10px 12px;border-bottom:1px solid #e7edf3;text-align:center;font-size:13px}th{background:#eef5ff;color:#567087;font-size:12px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:8px;font-size:18px}tbody tr:last-child td{border-bottom:0}td strong{color:#0647c8}aside{padding:16px;border-radius:15px;background:#082f59;color:#fff}aside h3{margin:0 0 9px;font-size:15px}aside>div{padding:7px 0;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.14);font-size:12px}aside>div b{color:#79e1ae;font-size:14px}aside p{margin:11px 0;color:#c7e2f8;font-size:11px;line-height:1.5}aside a{min-height:40px;padding:0 12px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff;color:#0647c8;text-decoration:none;font-size:12px;font-weight:950}@media(max-width:850px){.plansBody{grid-template-columns:1fr}.tableWrap table{min-width:650px}}@media(max-width:600px){.plansMenu{padding:18px 12px}.plansHead{align-items:flex-start}.plansHead h2{font-size:22px}.plansHead p{font-size:13px}.freeBadge{min-width:92px;padding:10px}.freeBadge strong{font-size:18px}.tableWrap{border-radius:12px}}
    `}</style>
  </section>;
}
