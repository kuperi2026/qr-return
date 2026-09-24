"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Period = "1" | "3" | "6" | "12";
type Choice = { id: number; productId: string; period: Period };
type OwnedProfile = { id: number; tag_code: string; item_name: string | null; item_type: string | null; pet_type: string | null };
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
  const [ownedProfiles,setOwnedProfiles]=useState<OwnedProfile[]>([]);
  const [accountState,setAccountState]=useState<"loading"|"guest"|"ready"|"error">("loading");
  const [profilePeriods,setProfilePeriods]=useState<Record<number,Period>>({});
  const [pendingIds,setPendingIds]=useState<number[]>([]);
  const [submitting,setSubmitting]=useState(false);
  const [requestMessage,setRequestMessage]=useState("");
  const [requestError,setRequestError]=useState("");
  const [choices,setChoices]=useState<Choice[]>([]);
  const [nextId,setNextId]=useState(1);
  const totals=useMemo(()=>{
    const subtotal=choices.reduce((sum,choice)=>{
      const product=plans.find(p=>p.id===choice.productId);
      return sum+(product?.prices[choice.period] || 0);
    },0);
    const discount=discountFor(choices.length), saving=subtotal*discount/100;
    return {subtotal,discount,saving,total:subtotal-saving};
  },[choices]);
  const add=(productId:string)=>{setChoices(current=>[...current,{id:nextId,productId,period:"1"}]);setNextId(id=>id+1)};
  const remove=(id:number)=>setChoices(current=>current.filter(choice=>choice.id!==id));
  const setChoicePeriod=(id:number,period:Period)=>setChoices(current=>current.map(choice=>choice.id===id?{...choice,period}:choice));
  const money=(value:number)=>`${Number.isInteger(value)?value:value.toFixed(2)} ₾`;
  const chosenProfiles=ownedProfiles.filter(profile=>profilePeriods[profile.id]);
  const chosenSubtotal=chosenProfiles.reduce((sum,profile)=>{
    const period=profilePeriods[profile.id];
    return sum+(profileProduct(profile)?.prices[period]||0);
  },0);
  const chosenDiscount=discountFor(chosenProfiles.length);
  const chosenTotal=Number((chosenSubtotal*(1-chosenDiscount/100)).toFixed(2));

  useEffect(()=>{
    let active=true;
    async function loadProfiles(){
      setAccountState("loading");
      const {data:{user},error:authError}=await supabase.auth.getUser();
      if(!active)return;
      if(authError){setAccountState("error");return;}
      if(!user){setOwnedProfiles([]);setAccountState("guest");return;}
      const {data,error}=await supabase.from("item")
        .select("id,tag_code,item_name,item_type,pet_type")
        .eq("owner_id",user.id).order("id",{ascending:false});
      if(!active)return;
      if(error){setAccountState("error");return;}
      setOwnedProfiles((data||[]) as OwnedProfile[]);
      const {data:requests}=await supabase.from("service_activation_requests")
        .select("item_id").eq("owner_id",user.id).eq("status","pending");
      if(!active)return;
      setPendingIds((requests||[]).map(request=>Number(request.item_id)));
      setAccountState("ready");
    }
    void loadProfiles();
    const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{window.setTimeout(()=>{void loadProfiles()},0)});
    return ()=>{active=false;subscription.unsubscribe()};
  },[]);

  const profileProduct=(profile:OwnedProfile)=>{
    const type=(profile.item_type==="pet"?profile.pet_type:profile.item_type)||"";
    return plans.find(p=>p.id===(type==="key"?"keys":type.toLowerCase()));
  };

  function chooseOwnedPeriod(id:number,period:Period){
    setRequestMessage("");setRequestError("");
    setProfilePeriods(current=>{
      const next={...current};
      if(next[id]===period)delete next[id];else next[id]=period;
      return next;
    });
  }

  async function requestActivation(){
    if(!chosenProfiles.length||submitting)return;
    setSubmitting(true);setRequestMessage("");setRequestError("");
    try{
      const {data:{user}}=await supabase.auth.getUser();
      if(!user)throw new Error("გთხოვთ, ხელახლა შეხვიდეთ ანგარიშში.");
      if(chosenProfiles.some(profile=>pendingIds.includes(profile.id)))throw new Error("არჩეულ პროფილზე მოთხოვნა უკვე გაგზავნილია.");
      const rows=chosenProfiles.map(profile=>{
        const period=profilePeriods[profile.id];
        const product=profileProduct(profile);
        if(!product)throw new Error("ერთ-ერთი პროფილის ფასის დადგენა ვერ მოხერხდა.");
        const base=product.prices[period];
        return {owner_id:user.id,item_id:profile.id,period_months:Number(period),base_amount:base,discount_percent:chosenDiscount,final_amount:Number((base*(1-chosenDiscount/100)).toFixed(2)),metadata:{tag_code:profile.tag_code}};
      });
      const {error}=await supabase.from("service_activation_requests").insert(rows);
      if(error)throw error;
      setPendingIds(current=>[...new Set([...current,...chosenProfiles.map(profile=>profile.id)])]);
      setProfilePeriods({});
      setRequestMessage("მოთხოვნა მიღებულია. დადასტურების შესახებ შეტყობინებას მიიღებთ.");
    }catch(error){setRequestError(error instanceof Error?error.message:"მოთხოვნის გაგზავნა ვერ მოხერხდა.");}
    finally{setSubmitting(false);}
  }

  return <section className="plansMenu"><div className="plansInner">
    <div className="plansHead"><div><span>QR RETURN SERVICE</span><h2>{ka?"მომსახურება და პაკეტები":"Service & plans"}</h2><p>{ka?"არსებული პროფილის ვადა აირჩიეთ ან ახალი პროფილის ფასი წინასწარ გამოთვალეთ.":"Choose a term for an existing profile or estimate the price of new ones."}</p></div><div className="freeBadge"><strong>2 თვე</strong><small>{ka?"უფასოდ":"free"}</small></div></div>
    <details className="planDisclosure ownedDisclosure">
      <summary><span><strong>{ka?"ჩემი შექმნილი პროფილები":"My existing profiles"}</strong><small>{accountState==="ready"?ka?`${ownedProfiles.length} პროფილი · თითოეულს ცალკე ვადა`:`${ownedProfiles.length} profiles · individual terms`:ka?"პროფილების ნახვა და ვადის არჩევა":"View profiles and choose terms"}</small></span><b aria-hidden="true">⌄</b></summary>
      <div className="ownedContent">
        {accountState==="loading"?<p className="ownedPlansState">{ka?"პროფილები იტვირთება...":"Loading profiles..."}</p>:accountState==="guest"?<p className="ownedPlansState">{ka?"თქვენი პროფილების სანახავად შედით ანგარიშში.":"Sign in to see your profiles."} <Link href="/login">{ka?"შესვლა →":"Sign in →"}</Link></p>:accountState==="error"?<p className="ownedPlansState">{ka?"პროფილების ჩატვირთვა ვერ მოხერხდა.":"Could not load your profiles."}</p>:ownedProfiles.length?<>
          <p className="ownedHelp">{ka?"აირჩიეთ ვადა თითოეული პროფილის რიგში. არჩეულ ფასზე ხელახლა დაჭერა არჩევანს მოხსნის.":"Choose a term in each profile row. Click the selected price again to clear it."}</p>
          <div className="ownedProfileList">{ownedProfiles.map(profile=>{const product=profileProduct(profile);const selected=profilePeriods[profile.id];const pending=pendingIds.includes(profile.id);return <article key={profile.id} className="ownedProfileRow"><div className="ownedProfileName"><span className="ownedIcon">{product?.icon||"🏷️"}</span><span><strong>{profile.item_name||product?.name||profile.tag_code}</strong><small>{product?.name||"QR პროფილი"} · {profile.tag_code}</small></span></div>{pending?<span className="pendingLabel">{ka?"მოთხოვნა გაგზავნილია":"Request pending"}</span>:product?<div className="ownedTerms">{periods.map(term=><button type="button" key={term.value} className={selected===term.value?"active":""} aria-pressed={selected===term.value} aria-label={`${profile.item_name||product.name}: ${term.label}, ${product.prices[term.value]} ლარი`} onClick={()=>chooseOwnedPeriod(profile.id,term.value)}><small>{term.label}</small><strong>{product.prices[term.value]} ₾</strong></button>)}</div>:<Link href={`/account/subscriptions?profile=${profile.id}`}>{ka?"ვადის არჩევა →":"Choose term →"}</Link>}</article>})}</div>
          {chosenProfiles.length>0&&<div className="ownedCheckout"><div><strong>{chosenProfiles.length} {ka?"არჩეული პროფილი":"selected profiles"}</strong><span>{ka?"ჯამი":"Subtotal"} {money(chosenSubtotal)} · {ka?"ფასდაკლება":"Discount"} {chosenDiscount}%</span></div><strong>{money(chosenTotal)}</strong><button type="button" disabled={submitting} onClick={requestActivation}>{submitting?ka?"იგზავნება...":"Sending...":ka?"გააქტიურების მოთხოვნა":"Request activation"}</button></div>}
          {requestMessage&&<p className="ownedSuccess" role="status">✓ {requestMessage}</p>}{requestError&&<p className="ownedError" role="alert">{requestError}</p>}
        </>:<p className="ownedPlansState">{ka?"ჯერ QR პროფილი არ შეგიქმნიათ.":"You have not created a QR profile yet."} <Link href="/register">{ka?"პროფილის შექმნა →":"Create profile →"}</Link></p>}
      </div>
    </details>
    <details className="planDisclosure"><summary><span><strong>{ka?"ფასის გამოთვლა":"Estimate a price"}</strong><small>{ka?"აირჩიეთ პროდუქტები და ვადები — მხოლოდ საცდელად":"Try products and terms without placing an order"}</small></span><b aria-hidden="true">⌄</b></summary>
    <div className="calculator">
      <div className="calculatorMain">
        <Title number="01" title="დაამატეთ QR პროფილები" text="ერთი ტიპის რამდენიმე პროფილიც შეგიძლიათ დაამატოთ." />
        <div className="productPicker">{plans.map(p=><button type="button" key={p.id} onClick={()=>add(p.id)} aria-label={`${p.name}: პროფილის დამატება`}><span>{p.icon}</span><b>{p.name}</b><i>+</i></button>)}</div>
        <div className="periodTitle"><Title number="02" title="აირჩიეთ ვადა თითოეული პროფილისთვის" text="მაგალითად, კატას — 1 თვე, გასაღებს — 6 თვე." /></div>
        {choices.length ? <div className="profileChoices">{choices.map(choice=>{const product=plans.find(p=>p.id===choice.productId)!;return <div className="profileChoice" key={choice.id}><div className="choiceHeading"><b>{product.icon} {product.name}</b><button type="button" onClick={()=>remove(choice.id)} aria-label={`${product.name}: წაშლა`}>×</button></div><div className="periodPicker">{periods.map(p=><button type="button" key={p.value} className={choice.period===p.value?"selected":""} aria-pressed={choice.period===p.value} onClick={()=>setChoicePeriod(choice.id,p.value)}>{p.label}<small>{product.prices[p.value]} ₾</small></button>)}</div></div>})}</div>:<p className="choiceEmpty">დააჭირეთ პროდუქტს პროფილის დასამატებლად.</p>}
      </div>
      <aside className="summary"><small>სავარაუდო ღირებულება · არჩევანს ანგარიშში დაადასტურებთ</small><h3>თქვენი პაკეტი</h3>{choices.map(choice=>{const product=plans.find(p=>p.id===choice.productId)!;return <div key={choice.id}><span>{product.icon} {product.name} · {periods.find(p=>p.value===choice.period)?.label}</span><b>{money(product.prices[choice.period])}</b></div>})}<div><span>არჩეული პროფილი</span><b>{choices.length}</b></div><div><span>შუალედური ჯამი</span><b>{money(totals.subtotal)}</b></div><div><span>ფასდაკლება</span><b className="green">−{totals.discount}%</b></div><div><span>თქვენ ზოგავთ</span><b className="green">{money(totals.saving)}</b></div><div className="grand"><span>საბოლოო თანხა</span><strong>{money(totals.total)}</strong></div><p>{choices.length===0?"დაამატეთ პროფილი და თანხა ავტომატურად დაითვლება.":choices.length<3?"3 პროფილის არჩევისას მიიღებთ 5%-იან ფასდაკლებას.":"ფასდაკლება უკვე გათვალისწინებულია საბოლოო თანხაში."}</p><Link href="/account/subscriptions">ჩემს პროფილებზე ვადის არჩევა →</Link></aside>
    </div>
    </details>
    <details className="planDisclosure priceDisclosure"><summary><span><strong>{ka?"ყველა ფასი და ფასდაკლება":"All prices and discounts"}</strong><small>{ka?"1, 3, 6 და 12 თვე თითოეული პროდუქტისთვის":"1, 3, 6 and 12 months for each product"}</small></span><b aria-hidden="true">⌄</b></summary><div className="details">
      <div className="tableWrap"><h3>ყველა პროდუქტის ფასი · თითო პროფილზე</h3><table><thead><tr><th>პროდუქტი</th>{periods.map(p=><th key={p.value}>{p.label}</th>)}</tr></thead><tbody>{plans.map(p=><tr key={p.id}><td><span>{p.icon}</span><b>{p.name}</b></td>{periods.map(item=><td key={item.value} data-label={item.label}>{p.prices[item.value]} ₾</td>)}</tr>)}</tbody></table></div>
      <aside className="discounts"><h3>რამდენიმე პროფილის ფასდაკლება</h3><div><span>3–4 პროფილი</span><b>−5%</b></div><div><span>5–6 პროფილი</span><b>−10%</b></div><div><span>7 პროფილი</span><b>−12%</b></div><div><span>8 ან მეტი პროფილი</span><b>−15%</b></div><p>ფასდაკლება არჩეული პროფილების საერთო ღირებულებას ავტომატურად აკლდება.</p></aside>
    </div></details>
  </div><Styles/><MobileStyles/></section>;
}

function Title({number,title,text}:{number:string;title:string;text:string}){return <div className="sectionTitle"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>}
function Styles(){return <style jsx global>{`
  .plansMenu{position:relative;z-index:90;padding:24px 30px 30px;border-bottom:1px solid #dce6ef;background:#fff;color:#17314d;box-shadow:0 18px 35px rgba(0,35,70,.14)}.plansInner{max-width:1260px;margin:auto}.plansHead{margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:24px}.plansHead>div:first-child{max-width:880px}.plansHead span{color:#1266e9;font-size:11px;font-weight:950;letter-spacing:.12em}.plansHead h2{margin:5px 0 6px;font-size:28px}.plansHead p{margin:0;color:#60758a;font-size:15px;line-height:1.5}.freeBadge{min-width:130px;padding:13px 18px;border-radius:15px;background:linear-gradient(135deg,#0647c8,#1675ed);color:#fff;text-align:center}.freeBadge strong,.freeBadge small{display:block}.freeBadge strong{font-size:23px}.ownedPlans{margin:0 0 18px;padding:18px;border:1px solid #dce7f2;border-radius:16px;background:#fff}.ownedPlansHead{display:flex;justify-content:space-between;align-items:center;gap:16px}.ownedPlansHead h3,.estimateHeading h3{margin:0 0 4px;font-size:18px}.ownedPlansHead p,.estimateHeading p{margin:0;color:#60758a;font-size:14px;line-height:1.5}.ownedPlansHead>a,.ownedPlansGrid article>a{color:#075bdc;font-size:14px;font-weight:850;text-decoration:none}.ownedPlansHead>a{white-space:nowrap}.ownedPlansState{margin:15px 0 0;color:#60758a;font-size:14px}.ownedPlansState a{color:#075bdc;font-weight:850}.ownedPlansGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:9px;margin-top:14px}.ownedPlansGrid article{display:flex;align-items:center;gap:10px;padding:11px;border:1px solid #dce7f2;border-radius:11px;background:#f7faff}.ownedPlansGrid article>div{min-width:0;flex:1}.ownedPlansGrid strong,.ownedPlansGrid small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ownedPlansGrid strong{font-size:14px}.ownedPlansGrid small{margin-top:3px;color:#60758a;font-size:12px}.ownedPlansGrid article>a{font-size:12px;white-space:nowrap}.ownedIcon{font-size:23px}.estimateHeading{margin:18px 2px 12px}.calculator{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:16px;padding:18px;border:1px solid #dce7f2;border-radius:18px;background:#f7faff}.sectionTitle{display:flex;align-items:center;gap:10px}.sectionTitle>span{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#e3efff;color:#075bdc;font-size:12px;font-weight:950}.sectionTitle h3{margin:0 0 2px;font-size:16px}.sectionTitle p{margin:0;color:#718397;font-size:12px}.productPicker{margin-top:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.productPicker button{position:relative;min-height:68px;padding:10px 30px 10px 10px;display:flex;align-items:center;gap:8px;border:1px solid #dce6f0;border-radius:12px;background:#fff;color:#17314d;text-align:left;cursor:pointer}.productPicker button>span{font-size:22px}.productPicker button b{font-size:12px}.productPicker button i{position:absolute;right:9px;width:21px;height:21px;display:grid;place-items:center;border-radius:50%;background:#edf3f9;color:#35617f;font-style:normal;font-weight:900}.productPicker button.selected{border-color:#0866e9;background:#eaf3ff;box-shadow:0 0 0 1px #0866e9}.productPicker button.selected i{background:#0866e9;color:#fff}.periodTitle{margin-top:18px}.profileChoices{display:grid;gap:10px;margin-top:12px}.profileChoice{padding:12px;border:1px solid #dce6f0;border-radius:12px;background:#fff}.choiceHeading{display:flex;align-items:center;justify-content:space-between}.choiceHeading button{width:30px;height:30px;border:0;border-radius:8px;background:#edf3f9;color:#31516e;font-size:21px;cursor:pointer}.choiceEmpty{color:#60758a;font-size:14px}.periodPicker button small{display:block;margin-top:3px;font-size:12px}.periodPicker{margin-top:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.periodPicker button{min-height:42px;border:1px solid #dbe5ee;border-radius:10px;background:#fff;color:#32516c;font-weight:850;cursor:pointer}.periodPicker button.selected{border-color:#0866e9;background:#0866e9;color:#fff}.summary{padding:18px;border-radius:15px;background:#082f59;color:#fff}.summary>small{color:#79b8ff;font-size:10px;font-weight:900;letter-spacing:.1em}.summary h3{margin:5px 0 12px;font-size:20px}.summary>div{padding:8px 0;display:flex;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.14);font-size:12px}.summary .green{color:#79e1ae}.summary .grand{margin-top:5px;padding:13px 0;border-bottom:0;align-items:center}.summary .grand strong{font-size:25px}.summary p{min-height:34px;margin:4px 0 11px;color:#c7e2f8;font-size:11px;line-height:1.45}.summary a{min-height:42px;padding:0 12px;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff;color:#0647c8;text-decoration:none;font-size:12px;font-weight:950}.details{margin-top:15px;display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:15px}.tableWrap{overflow-x:auto;border:1px solid #dfe8f1;border-radius:15px}.tableWrap h3{margin:0;padding:14px 15px 8px;font-size:15px}table{width:100%;border-collapse:collapse}th,td{padding:9px 12px;border-bottom:1px solid #e7edf3;text-align:center;font-size:12px}th{background:#eef5ff;color:#567087;font-size:11px}th:first-child,td:first-child{text-align:left}td:first-child span{margin-right:8px;font-size:17px}tbody tr:last-child td{border-bottom:0}.discounts{padding:16px;border-radius:15px;background:#eef5ff}.discounts h3{margin:0 0 9px;font-size:15px}.discounts>div{padding:8px 0;display:flex;justify-content:space-between;border-bottom:1px solid #d5e4f5;font-size:12px}.discounts>div b{color:#087548;font-size:14px}.discounts p{margin:11px 0 0;color:#60758a;font-size:11px;line-height:1.5}@media(max-width:900px){.calculator,.details{grid-template-columns:1fr}.productPicker{grid-template-columns:repeat(2,1fr)}.tableWrap table{min-width:620px}}@media(max-width:600px){.plansMenu{padding:18px 12px}.plansHead{align-items:flex-start}.plansHead h2{font-size:22px}.plansHead p{font-size:13px}.freeBadge{min-width:88px;padding:10px}.freeBadge strong{font-size:18px}.calculator{padding:12px}.productPicker{grid-template-columns:1fr 1fr}.productPicker button{min-height:62px}.productPicker button b{font-size:11px}.periodPicker{grid-template-columns:1fr 1fr}.summary .grand strong{font-size:23px}}
  .plansMenu .plansHead{margin-bottom:12px}.plansMenu .plansHead h2{font-size:24px}.plansMenu .freeBadge{min-width:90px;padding:8px 10px}.plansMenu .freeBadge strong{font-size:17px}.plansMenu .ownedPlans{margin-bottom:10px;padding:14px}.plansMenu .ownedPlansGrid{grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:7px;margin-top:10px}.plansMenu .ownedPlansGrid article{padding:8px 10px}.plansMenu .allProfilesLink{display:flex;align-items:center;padding:8px 10px;color:#075bdc;font-size:13px;font-weight:850;text-decoration:none}.plansMenu .planDisclosure{margin-top:8px;border:1px solid #dce7f2;border-radius:12px;background:#fff;overflow:hidden}.plansMenu .planDisclosure>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 16px;cursor:pointer;list-style:none}.plansMenu .planDisclosure>summary::-webkit-details-marker{display:none}.plansMenu .planDisclosure>summary strong,.plansMenu .planDisclosure>summary small{display:block}.plansMenu .planDisclosure>summary strong{color:#17314d;font-size:15px}.plansMenu .planDisclosure>summary small{margin-top:3px;color:#60758a;font-size:13px}.plansMenu .planDisclosure>summary b{color:#075bdc;font-size:19px;transition:transform .2s}.plansMenu .planDisclosure[open]>summary b{transform:rotate(180deg)}.plansMenu .planDisclosure .calculator{margin:0 10px 10px;padding:12px;border-radius:11px;box-shadow:none}.plansMenu .planDisclosure .details{margin:0 10px 10px}.plansMenu .productPicker button{min-height:50px}.plansMenu .periodTitle{margin-top:12px}.plansMenu .profileChoice{padding:9px}.plansMenu .summary{padding:14px}.plansMenu .summary h3{font-size:17px}.plansMenu .summary>div{padding:6px 0}
  .plansMenu .ownedContent{padding:0 14px 14px}.plansMenu .ownedHelp{margin:0 0 10px;color:#60758a;font-size:13px}.plansMenu .ownedProfileList{display:grid;gap:7px}.plansMenu .ownedProfileRow{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 12px;border:1px solid #dce7f2;border-radius:11px;background:#f7faff}.plansMenu .ownedProfileName{display:flex;align-items:center;gap:9px;min-width:180px;max-width:35%}.plansMenu .ownedProfileName>span:last-child{min-width:0}.plansMenu .ownedProfileName strong,.plansMenu .ownedProfileName small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plansMenu .ownedProfileName strong{font-size:14px}.plansMenu .ownedProfileName small{margin-top:3px;color:#60758a;font-size:12px}.plansMenu .ownedTerms{display:grid;grid-template-columns:repeat(4,minmax(70px,1fr));gap:6px;max-width:440px;flex:1}.plansMenu .ownedTerms button{min-height:44px;padding:5px;border:1px solid #d5e2f0;border-radius:9px;background:#fff;color:#17314d;cursor:pointer}.plansMenu .ownedTerms button small,.plansMenu .ownedTerms button strong{display:block}.plansMenu .ownedTerms button small{font-size:11px}.plansMenu .ownedTerms button strong{margin-top:2px;font-size:13px}.plansMenu .ownedTerms button.active{border-color:#0866e9;background:#e8f2ff;color:#075bdc}.plansMenu .pendingLabel{color:#60758a;font-size:13px}.plansMenu .ownedCheckout{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:10px;padding:12px;border-radius:11px;background:#082f59;color:#fff}.plansMenu .ownedCheckout>div strong,.plansMenu .ownedCheckout>div span{display:block}.plansMenu .ownedCheckout>div strong{font-size:14px}.plansMenu .ownedCheckout>div span{margin-top:3px;color:#c7e2f8;font-size:12px}.plansMenu .ownedCheckout>strong{font-size:21px}.plansMenu .ownedCheckout button{min-height:38px;padding:0 12px;border:0;border-radius:8px;background:#fff;color:#075bdc;font-weight:850;cursor:pointer}.plansMenu .ownedCheckout button:disabled{opacity:.6;cursor:wait}.plansMenu .ownedSuccess,.plansMenu .ownedError{margin:9px 0 0;font-size:13px}.plansMenu .ownedSuccess{color:#087548}.plansMenu .ownedError{color:#b42318}@media(max-width:650px){.plansMenu .ownedProfileRow{align-items:stretch;flex-direction:column;gap:8px}.plansMenu .ownedProfileName{max-width:100%}.plansMenu .ownedTerms{max-width:none;width:100%;grid-template-columns:repeat(4,minmax(0,1fr))}.plansMenu .ownedCheckout{flex-wrap:wrap}.plansMenu .ownedCheckout button{width:100%}}
`}</style>}
function MobileStyles(){return <style jsx global>{`
  @media(max-width:600px){
    .plansMenu{padding:16px 10px;box-shadow:none;overflow:hidden}.ownedPlansHead{align-items:flex-start;flex-direction:column}.ownedPlansGrid{grid-template-columns:1fr}.plansHead{position:relative;display:block;padding-right:82px}.plansHead h2{font-size:21px;line-height:1.2}.plansHead p{font-size:13px}.freeBadge{position:absolute;right:0;top:0;min-width:70px;padding:9px 7px}.freeBadge strong{font-size:16px}.freeBadge small{font-size:10px}.calculator{padding:10px;border-radius:14px}.sectionTitle h3{font-size:15px}.sectionTitle p{font-size:11px}.productPicker{grid-template-columns:1fr;gap:6px}.productPicker button{min-height:52px;padding:7px 36px 7px 10px}.productPicker button>span{font-size:20px}.productPicker button b{font-size:12px}.periodPicker{grid-template-columns:1fr 1fr}.details{gap:10px}.tableWrap{overflow:visible;border:0}.tableWrap h3{padding:10px 2px}.tableWrap table{min-width:0}.tableWrap thead{display:none}.tableWrap tbody{display:grid;gap:8px}.tableWrap tr{padding:10px;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;border:1px solid #dfe8f1;border-radius:12px;background:#fff}.tableWrap td{padding:4px 2px;border:0;text-align:center;font-size:12px}.tableWrap td:first-child{grid-column:1/-1;padding-bottom:8px;border-bottom:1px solid #e7edf3;font-size:13px}.tableWrap td:not(:first-child)::before{content:attr(data-label);display:block;margin-bottom:3px;color:#708399;font-size:9px;font-weight:800}.discounts{padding:14px}
  }
`}</style>}
