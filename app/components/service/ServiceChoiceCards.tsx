"use client";
import InterfaceIcon from "../ui/InterfaceIcon";
export default function ServiceChoiceCards({ ka = true, local = false, onChoose }: { ka?: boolean; local?: boolean; onChoose?: (view: "estimate" | "profiles") => void }) {
  const base = local ? "" : "/account/subscriptions";
  return <nav className="serviceChoices" aria-label={ka ? "მომსახურების არჩევანი" : "Service options"}>
    <a href={`${base}#estimate`} onClick={() => onChoose?.("estimate")} className="serviceChoice"><span className="choiceSymbol"><InterfaceIcon name="calculator" size={26}/></span><div><small>01</small><strong>{ka ? "ფასის წინასწარ გამოთვლა" : "Estimate the price"}</strong><p>{ka ? "აირჩიეთ პროდუქტი, რაოდენობა და ვადა." : "Choose a product, quantity and term."}</p></div><span className="choiceChevron"><InterfaceIcon name="arrow"/></span></a>
    <a href={`${base}#my-profiles`} onClick={() => onChoose?.("profiles")} className="serviceChoice"><span className="choiceSymbol"><InterfaceIcon name="profiles" size={26}/></span><div><small>02</small><strong>{ka ? "ჩემი შექმნილი პროფილები" : "My existing profiles"}</strong><p>{ka ? "აირჩიეთ მომსახურების ვადა თითოეული პროფილისთვის." : "Choose a service term for each profile."}</p></div><span className="choiceChevron"><InterfaceIcon name="arrow"/></span></a>
    <style jsx global>{`
      .serviceChoices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;font-family:var(--font-georgian),Arial,sans-serif}
      .serviceChoices .serviceChoice{box-sizing:border-box;position:relative;min-height:200px;padding:26px;display:flex;align-items:flex-start;gap:20px;border:1px solid #dce6ef;border-radius:20px;background:#fff;color:#173953;text-decoration:none;box-shadow:0 8px 28px #0b2c5510;transition:border-color .18s,box-shadow .18s,transform .18s}
      .serviceChoice:hover{border-color:#8baac8;box-shadow:0 12px 30px #0b2c551c;transform:translateY(-2px)}.serviceChoice:focus-visible{outline:3px solid #468bd1;outline-offset:3px}
      .serviceChoice .choiceSymbol{width:54px;height:54px;flex:0 0 54px;display:grid;place-items:center;border-radius:15px;background:#edf3fa;color:#244e77}
      .serviceChoice:nth-child(2) .choiceSymbol{background:#edf5f3;color:#286c60}.serviceChoice>div{min-width:0;padding-top:2px}.serviceChoice small{font-size:12px;font-weight:600;color:#77899b;letter-spacing:.08em}.serviceChoice strong{display:block;margin-top:9px;font-size:20px;font-weight:650;line-height:1.5}.serviceChoice p{margin:10px 0 22px;font-size:14px;line-height:1.65;color:#60748a}.serviceChoice .choiceChevron{position:absolute;right:22px;bottom:20px;color:#607b95}
      @media(max-width:700px){.serviceChoices{grid-template-columns:1fr;gap:12px}.serviceChoices .serviceChoice{min-height:158px;padding:20px;gap:15px}.serviceChoice strong{font-size:18px}.serviceChoice .choiceSymbol{width:46px;height:46px;flex-basis:46px}.serviceChoice p{font-size:13px;margin-bottom:10px}}
    `}</style>
  </nav>;
}
