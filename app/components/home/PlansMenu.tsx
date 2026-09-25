"use client";
import Link from "next/link";

export default function PlansMenu({ ka = true }: { ka?: boolean }) {
  return <section className="plansMenu" aria-label={ka ? "მომსახურება და პაკეტები" : "Service and plans"}>
    <div className="plansInner">
      <div className="plansHead"><div><small>QR RETURN</small><h2>{ka ? "მომსახურება და პაკეტები" : "Service and plans"}</h2><p>{ka ? "ფასის გამოთვლა და შექმნილი პროფილების გააქტიურება — ორი მკაფიო გზა." : "Two clear paths: estimate a price or activate existing profiles."}</p></div><span className="freeBadge">{ka ? "პირველი 60 დღე უფასოა" : "First 60 days free"}</span></div>
      <div className="plansPaths">
        <Link href="/account/subscriptions#estimate" className="plansPath"><span className="plansNumber">01</span><span><strong>{ka ? "ფასის წინასწარ გამოთვლა" : "Estimate the price"}</strong><small>{ka ? "ნახეთ პროდუქტის ფასი, ვადა, რაოდენობა და ჯამი. პროფილის შექმნა საჭირო არ არის." : "See products, terms, quantities and the estimated total without creating a profile."}</small></span><b aria-hidden="true">→</b></Link>
        <Link href="/account/subscriptions#my-profiles" className="plansPath"><span className="plansNumber">02</span><span><strong>{ka ? "ჩემი შექმნილი პროფილები" : "My existing profiles"}</strong><small>{ka ? "გახსენით ყველა პროფილი, თითოეულს ცალკე ვადა აურჩიეთ და გააქტიურება მოითხოვეთ." : "Open your profiles, choose a term for each and request activation."}</small></span><b aria-hidden="true">→</b></Link>
      </div>
      <p className="plansNote">{ka ? "წინასწარი გამოთვლა პროფილს არ ქმნის და მოთხოვნას არ აგზავნის." : "An estimate does not create a profile or send an activation request."}</p>
    </div>
    <style jsx global>{`
      .plansMenu{position:relative;z-index:90;padding:22px 24px;border-bottom:1px solid #dce6ef;background:#fff;color:#17314d;box-shadow:0 14px 30px rgba(0,35,70,.12)}.plansInner{max-width:1120px;margin:auto}.plansHead{display:flex;justify-content:space-between;align-items:center;gap:18px}.plansHead small{color:#1266e9;font-size:12px;font-weight:900;letter-spacing:.08em}.plansHead h2{margin:4px 0;font-size:24px;line-height:1.2}.plansHead p{margin:0;color:#5a7187;font-size:14px;line-height:1.45}.plansMenu .freeBadge{flex:0 0 auto;padding:9px 13px;border-radius:999px;background:#e8f3ff;color:#075bdc;font-size:13px;font-weight:800}.plansPaths{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.plansPath{min-height:112px;padding:17px;display:flex;align-items:center;gap:14px;border:1px solid #dce7f2;border-radius:14px;background:#f7faff;color:#17314d;text-decoration:none;transition:border-color .18s,background .18s}.plansPath:hover,.plansPath:focus-visible{border-color:#1266e9;background:#edf5ff;outline:none}.plansNumber{width:42px;height:42px;display:grid;place-items:center;flex:0 0 42px;border-radius:11px;background:#e1eeff;color:#075bdc;font-size:14px;font-weight:900}.plansPath>span:nth-child(2){min-width:0;flex:1}.plansPath strong,.plansPath small{display:block}.plansPath strong{font-size:17px}.plansPath small{margin-top:6px;color:#597188;font-size:13px;line-height:1.45}.plansPath>b{color:#1266e9;font-size:20px}.plansNote{margin:13px 1px 0;color:#60758a;font-size:13px}@media(max-width:690px){.plansMenu{padding:18px 12px}.plansHead{align-items:flex-start;flex-direction:column}.plansHead h2{font-size:21px}.plansPaths{grid-template-columns:1fr;gap:9px;margin-top:14px}.plansPath{min-height:96px;padding:13px}.plansPath strong{font-size:16px}}
    `}</style>
  </section>;
}
