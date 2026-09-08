"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Period = "1" | "3" | "6" | "12";
const plans = [
  { id:"suitcase", icon:"🧳", name:"ჩემოდანი", prices:{"1":2,"3":5,"6":9,"12":16} },
  { id:"keys", icon:"🔑", name:"გასაღები", prices:{"1":2,"3":5,"6":9,"12":16} },
  { id:"wallet", icon:"👛", name:"საფულე", prices:{"1":2,"3":5,"6":9,"12":16} },
  { id:"bag", icon:"👜", name:"ჩანთა", prices:{"1":2,"3":5,"6":9,"12":16} },
  { id:"cat", icon:"🐱", name:"კატა", prices:{"1":2,"3":5,"6":9,"12":16} },
  { id:"dog", icon:"🐶", name:"ძაღლი", prices:{"1":3,"3":8,"6":15,"12":27} },
  { id:"emergency", icon:"🆘", name:"Emergency სამაჯური", prices:{"1":5,"3":13,"6":24,"12":43} },
  { id:"parking", icon:"🚗", name:"Parking QR", prices:{"1":6,"3":15,"6":27,"12":49} },
] as const;
const periods:{value:Period;label:string}[]=[{value:"1",label:"1 თვე"},{value:"3",label:"3 თვე"},{value:"6",label:"6 თვე"},{value:"12",label:"1 წელი"}];
const discountFor=(count:number)=>count>=8?15:count>=7?12:count>=5?10:count>=3?5:0;

export default function PlansMenu({ka=true}:{ka?:boolean}) {
  const [selected,setSelected]=useState<string[]>([]);
  const [period,setPeriod]=useState<Period>("6");
  const totals=useMemo(()=>{
    const subtotal=plans.filter(p=>selected.includes(p.id)).reduce((sum,p)=>sum+p.prices[period],0);
    const discount=discountFor(selected.length), saving=subtotal*discount/100;
    return {subtotal,discount,saving,total:subtotal-saving};
  },[selected,period]);
  const toggle=(id:string)=>setSelected(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
  const money=(value:number)=>`${Number.isInteger(value)?value:value.toFixed(2)} ₾`;

  return <section className="plansMenu"><div className="plansInner">
    <div className="plansHead"><div><span>QR RETURN SERVICE</span><h2>{ka?"მომსახურება და პაკეტები":"Service & plans"}</h2><p>{ka?"ყველა ახალი QR პროფილი გააქტიურებიდან პირველი 2 თვე უფასოდ მუშაობს. აირჩიეთ პროდუქტები და კალკულატორი ზუსტ ღირებულებას ავტომატურად გამოთვლის.":"Every new QR profile includes two free months. Select products to calculate the exact price."}</p></div><div className="freeBadge"><strong>2 თვე</strong><small>{ka?"უფასოდ":"free"}</small></div></div>
    <div className="calculator">
      <div className="calculatorMain">
        <Title number="01" title="აირჩიეთ პროდუქტები" text="შეგიძლიათ მონიშნოთ ერთი ან რამდენიმე პროდუქტი." />
        <div className="productPicker">{plans.map(p=><button type="button" key={p.id} className={selected.includes(p.id)?"selected":""} onClick={()=>toggle(p.id)}><span>{p.icon}</span><b>{p.name}</b><i>{selected.includes(p.id)?"✓":"+"}</i></button>)}</div>
        <div className="periodTitle"><Title number="02" title="აირჩიეთ მომსახურების ვადა" text="ფასი მითითებულია თითოეული QR პროფილისთვის." /></div>
        <div className="periodPicker">{periods.map(p=><button type="button" key={p.value} className={period===p.value?"selected":""} onClick={()=>setPeriod(p.value)}>{p.label}</button>)}</div>
      </div>
      <aside className="summary"><small>ღირებულების კალკულატორი</small><h3>თქვენი პაკეტი</h3><div><span>არჩეული პროდუქტი</span><b>{selected.length}</b></div><div><span>შუალედური ჯამი</span><b>{money(totals.subtotal)}</b></div><div><span>ფასდაკლება</span><b className="green">−{totals.discount}%</b></div><div><span>თქვენ ზოგავთ</span><b className="green">{money(totals.saving)}</b></div><div className="grand"><span>საბოლოო თანხა</span><strong>{money(totals.total)}</strong></div><p>{selected.length===0?"მონიშნეთ პროდუქტი და თანხა ავტომატურად დაითვლება.":selected.length<3?"3 პროდუქტის არჩევისას მიიღებთ 5%-იან ფასდაკლებას.":"ფასდაკლება უკვე გათვალისწინებულია საბოლოო თანხაში."}</p><Link href="/account/subscriptions">პაკეტის გააქტიურება →</Link></aside>
    </div>
    <div className="details">
      <div className="tableWrap"><h3>ყველა პროდუქტის ფასი</h3><table><thead><tr><th>პროდუქტი</th>{periods.map(p=><th key={p.value}>{p.label}</th>)}</tr></thead><tbody>{plans.map(p=><tr key={p.id}><td><span>{p.icon}</span><b>{p.name}</b></td>{periods.map(item=><td key={item.value}>{p.prices[item.value]} ₾</td>)}</tr>)}</tbody></table></div>
      <aside className="discounts"><h3>რამდენიმე პროდუქტის ფასდაკლება</h3><div><span>3–4 პროდუქტი</span><b>−5%</b></div><div><span>5–6 პროდუქტი</span><b>−10%</b></div><div><span>7 პროდუქტი</span><b>−12%</b></div><div><span>რვავე პროდუქტი</span><b>−15%</b></div><p>ფასდაკლება არჩეული პაკეტების საერთო ღირებულებას ავტომატურად აკლდება.</p></aside>
    </div>
  </div><Styles/></section>;
}

function Title({number,title,text}:{number:string;title:string;text:string}){return <div className="sectionTitle"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>}
function Styles(){return <style jsx>{`
  .plansMenu{position:relative;z-index:90;padding:24px 30px 30px;border-bottom:1px solid #dce6ef;background:#fff;color:#17314d;box-shadow:0 18px 35px rgba(0,35,70,.14)}.plansInner{max-width:1260px;margin:auto}.plansHead{margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:24px}.plansHead>div:first-child{max-width:880px}.plansHead span{color:#1266e9;font-size:11px;font-weight:950;letter-spacing:.12em}.plansHead h2{margin:5px 0 6px;font-size:28px}.plansHead p{margin:0;color:#60758a;font-size:15px;line-height:1.5}.freeBadge{min-width:130px;padding:13px 18px;border-radius:15px;background:linear-gradient(135deg,#0647c8,#1675ed);color:#fff;text-align:center}.freeBadge strong,.freeBadge small{display:block}.freeBadge strong{font-size:23px}.calculator{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:16px;padding:18px;border:1px solid #dce7f2;border-radius:18px;background:#f7faff}.sectionTitle{display:flex;align-items:center;gap:10px}.sectionTitle>span{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#e3efff;color:#075bdc;font-size:12px;font-weight:950}.sectionTitle h3{margin:0 0 2px;font-size:16px}.sectionTitle p{margin:0;color:#718397;font-size:12px}.productPicker{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.productPicker button{position:relative;min-height:68px;padding:10px 30px 10px 10px;display:flex;align-items:center;gap:8px;border:1px solid #dce6f0;border-radius:12px;background:#fff;color:#17314d;text-align:left;cursor:pointer}.productPicker button>span{font-size:22px}.productPicker button b{font-size:12px}.productPicker button i{position:absolute;right:9px;width:21px;height:21px;display:grid;place-items:center;border-radius:50%;background:#edf3f9;color:#35617f;font-style:normal;font-weight:900}.productPicker button.selected{border-color:#0866e9;background:#eaf3ff;box-shadow:0 0 0 1px #0866e9}.productPicker button.selected i{background:#0866e9;color:#fff}.periodTitle{margin-top:18px}.periodPicker{margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.periodPicker button{min-height:42px;border:1px solid #dbe5ee;border-radius:10px;background:#fff;color:#32516c;font-weight:850;cursor:pointer}.periodPicker button.selected{border-color:#0866e9;background:#0866e9;color:#fff}.summary{padding:18px;border-radius:15px;background:#082f59;color:#fff}.summary>small{color:#79b8ff;font-size:10px;font-weight:900;letter-spacing:.1em}.summary h3{margin:5px 0 12px;font-size:20px}.summary>div{padding:8px 0;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.14);font-size:12px}.summary .green{color:#79e1ae}.summary .grand{margin-top:5px;padding:13px 0;border-bottom:0;align-items:center}.summary .grand strong{font-size:25px}.summary p{min-height:34px;margin:4px 0 11px;color:#c7e2f8;font-size:11px;line-height:1.45}.summary a{min-height:42px;padding:0 12px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff;color:#0647c8;text-decoration:none;font-size:12px;font-weight:950}.details{margin-top:15px;display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:15px}.tableWrap{overflow-x:auto;border:1px solid #dfe8f1;border-radius:15px}.tableWrap h3{margin:0;padding:14px 15px 8px;font-size:15px}table{width:100%;border-collapse:collapse}th,td{padding:9px 12px;border-bottom:1px solid #e7edf3;text-align:center;font-size:12px}th{background:#eef5ff;color:#567087;font-size:11px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:8px;font-size:17px}tbody tr:last-child td{border-bottom:0}.discounts{padding:16px;border-radius:15px;background:#eef5ff}.discounts h3{margin:0 0 9px;font-size:15px}.discounts>div{padding:8px 0;display:flex;justify-content:space-between;border-bottom:1px solid #d5e4f5;font-size:12px}.discounts>div b{color:#087548;font-size:14px}.discounts p{margin:11px 0 0;color:#60758a;font-size:11px;line-height:1.5}@media(max-width:900px){.calculator,.details{grid-template-columns:1fr}.productPicker{grid-template-columns:repeat(2,1fr)}.tableWrap table{min-width:620px}}@media(max-width:600px){.plansMenu{padding:18px 12px}.plansHead{align-items:flex-start}.plansHead h2{font-size:22px}.plansHead p{font-size:13px}.freeBadge{min-width:88px;padding:10px}.freeBadge strong{font-size:18px}.calculator{padding:12px}.productPicker{grid-template-columns:1fr 1fr}.productPicker button{min-height:62px}.productPicker button b{font-size:11px}.periodPicker{grid-template-columns:1fr 1fr}.summary .grand strong{font-size:23px}}
`}</style>}
