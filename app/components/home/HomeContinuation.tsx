"use client";

import { QRIcon, ShieldIcon } from "./HomeIcons";

export default function HomeContinuation({ka}:{ka:boolean}) {
  const steps = [
    {
      icon:<StoreIcon key="store"/>,
      title:ka ? "აირჩიეთ თქვენი QR RETURN პროდუქტი" : "Choose your QR RETURN product",
      text:ka ? "შეარჩიეთ კატეგორია თქვენი ძაღლისთვის, კატის, გასაღების, საფულის, ჩანთის, ჩემოდნის ან Emergency პროფილისთვის." : "Choose a category for a dog, cat, keys, wallet, bag, suitcase or Emergency profile.",
      points:ka ? ["7 განსხვავებული პროდუქტის კატეგორია","ერთი ანგარიშიდან რამდენიმე პროდუქტის მართვა","პროდუქტის ფოტო მოგვიანებით მარტივად ჩანაცვლდება"] : ["7 product categories","Manage multiple products in one account","Replace product imagery whenever ready"]
    },
    {
      icon:<ProfileIcon key="profile"/>,
      title:ka ? "შექმენით და მართეთ დაცული პროფილი" : "Create and control a secure profile",
      text:ka ? "დაარეგისტრირეთ QR კოდი, შეავსეთ საჭირო ინფორმაცია და ზუსტად განსაზღვრეთ, რომელი მონაცემი გამოჩნდება საჯარო გვერდზე." : "Register the QR, add the needed information and choose exactly what appears publicly.",
      points:ka ? ["ინფორმაციისა და ფოტოების რედაქტირება","კონტაქტის ფუნქციების ON/OFF მართვა","მპოვნელის გვერდის წინასწარი ნახვა"] : ["Edit information and photos","Turn contact options on or off","Preview the finder page"]
    },
    {
      icon:<QRIcon key="qr" size={36}/>,
      title:ka ? "მპოვნელი ასკანირებს — აპლიკაციის გარეშე" : "The finder scans — no app required",
      text:ka ? "ტელეფონის კამერით სკანირების შემდეგ მპოვნელი ხედავს მხოლოდ თქვენ მიერ არჩეულ ინფორმაციას და დაბრუნებისთვის საჭირო მოქმედებებს." : "After scanning with a phone camera, the finder sees only the information and return actions you selected.",
      points:ka ? ["რეგისტრაცია არ სჭირდება","სრული Tag Code დაფარულია","ზარი ან Live Chat ერთი შეხებით"] : ["No registration needed","Full Tag Code remains masked","Call or Live Chat in one tap"]
    },
    {
      icon:<ReturnIcon key="return"/>,
      title:ka ? "იწყება უსაფრთხო დაბრუნება" : "A safe return begins",
      text:ka ? "Lost ON, Scan შეტყობინება, Live Chat, ტელეფონი და ნებაყოფლობითი ლოკაცია ორივე მხარეს შეთანხმებაში და დაბრუნებაში ეხმარება." : "Lost ON, scan alerts, Live Chat, phone and voluntary location help both sides coordinate the return.",
      points:ka ? ["მფლობელი იღებს სკანირების ინფორმაციას","ლოკაცია მხოლოდ თანხმობით ზიარდება","კომუნიკაციას მფლობელი აკონტროლებს"] : ["Owner receives scan information","Location is shared only by consent","Owner controls communication"]
    }
  ];

  return <div className="continuation">
    <section className="section how" id="how-it-works">
      <div className="shell">
        <SectionTitle number="01" label="HOW IT WORKS" title={ka ? "როგორ მუშაობს QR RETURN" : "How QR RETURN Works"} text={ka ? "ოთხი მარტივი ეტაპი შეძენიდან უსაფრთხო დაბრუნებამდე." : "Four simple stages from purchase to safe return."} />
        <div className="storySteps">
          {steps.map((step,index)=><article className="storyStep" key={String(step.title)}>
            <div className="stepVisual">
              <span>0{index+1}</span>
              <div className="device">
                <div className="deviceTop"/>
                <div className="visualIcon">{step.icon}</div>
                <strong>QR RETURN</strong>
                <small>{index===0 ? (ka ? "აირჩიეთ პროდუქტი" : "Choose product") : index===1 ? (ka ? "მართეთ პროფილი" : "Manage profile") : index===2 ? (ka ? "დაასკანირეთ" : "Scan") : (ka ? "დააბრუნეთ" : "Return")}</small>
                <div className="deviceAction">{index===3 ? "✓" : "QR"}</div>
              </div>
            </div>
            <div className="stepCopy">
              <span>STEP 0{index+1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <ul>{step.points.map(point=><li key={point}>{point}</li>)}</ul>
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="section privacy sectionBorder">
      <div className="shell privacyInner">
        <div className="privacyIcon"><ShieldIcon /></div>
        <div><span>02 · PRIVACY</span><h2>{ka ? "თქვენი ინფორმაცია — თქვენი არჩევანი." : "Your Information, Your Choice."}</h2><p>{ka ? "საჯარო გვერდზე სრული Tag Code არ ჩანს. მფლობელი თავად ირჩევს ტელეფონის, ელფოსტის, მისამართის, Live Chat-ისა და ლოკაციის ხილვადობას." : "The full Tag Code is not public. The owner controls phone, email, address, Live Chat and location visibility."}</p></div>
        <div className="privacyPoints"><strong>✓ {ka ? "Tag Code დაფარულია" : "Tag Code masked"}</strong><strong>✓ {ka ? "ლოკაცია ნებაყოფლობითია" : "Location is voluntary"}</strong><strong>✓ {ka ? "მონაცემებს მფლობელი მართავს" : "Owner controls data"}</strong></div>
      </div>
    </section>

    <section className="cta sectionBorder"><div className="shell ctaInner"><div className="ctaQr"><QRIcon size={42}/></div><div><span>QR RETURN</span><h2>{ka ? "დაკარგვა არ ნიშნავს დამშვიდობებას." : "Never lose what matters."}</h2><p>{ka ? "ერთი სწორი კავშირი შეიძლება გახდეს დაბრუნების დასაწყისი." : "One right connection can begin the return."}</p></div><div className="ctaButtons"><a href="/store">{ka ? "მაღაზია" : "Store"}</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a></div></div></section>

    <footer><div className="shell footerTop"><div className="brand"><div><QRIcon size={23}/></div><strong>QR RETURN<small>SMART LOST &amp; FOUND</small></strong></div><p>{ka ? "ნივთების, ცხოველებისა და Emergency პროფილების ერთიანი QR სისტემა." : "One QR system for belongings, pets and Emergency profiles."}</p><nav><a href="/store">{ka ? "მაღაზია" : "Store"}</a><a href="/support">Live Chat</a><a href="/login">{ka ? "შესვლა" : "Sign in"}</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a></nav></div><div className="shell copyright">© 2026 QR RETURN</div></footer>

    <style jsx>{`
      .continuation{color:#fff;background:#0754c7}.shell{width:calc(100% - 80px);max-width:1280px;margin:auto}.section{padding:92px 0}.sectionBorder{border-top:1px solid rgba(255,255,255,.16)}.storySteps{margin-top:52px;display:grid;gap:76px}.storyStep{min-height:500px;display:grid;grid-template-columns:1fr 1fr;gap:75px;align-items:center}.storyStep:nth-child(even) .stepVisual{order:2}.stepVisual{min-height:480px;position:relative;display:grid;place-items:center;border:1px solid rgba(255,255,255,.17);border-radius:24px;background:radial-gradient(circle at 50% 48%,rgba(255,255,255,.16),transparent 48%),rgba(4,48,126,.25);overflow:hidden}.stepVisual>span{position:absolute;top:24px;left:25px;color:rgba(255,255,255,.48);font-size:10px;font-weight:900;letter-spacing:1px}.device{width:245px;height:390px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;border:8px solid #fff;border-radius:39px;color:#0754c7;background:#f7faff;box-shadow:0 30px 65px rgba(0,27,85,.32)}.deviceTop{width:72px;height:17px;margin-top:-15px;border-radius:0 0 11px 11px;background:#0754c7}.visualIcon{width:84px;height:84px;margin-top:54px;display:grid;place-items:center;border-radius:22px;color:#fff;background:#0754c7}.visualIcon :global(svg){width:42px;height:42px}.device>strong{margin-top:24px;color:#183657;font-size:15px}.device>small{margin-top:7px;color:#6d8299;font-size:9px}.deviceAction{width:100%;min-height:42px;margin-top:auto;display:grid;place-items:center;border-radius:12px;color:#fff;background:#0754c7;font-size:11px;font-weight:900}.stepCopy>span,.privacyInner>div>span,.ctaInner>div>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1.2px}.stepCopy h3{max-width:520px;margin:13px 0 0;color:#fff;font-size:clamp(31px,3.5vw,48px);line-height:1.08;letter-spacing:-1.5px}.stepCopy>p{max-width:540px;margin:19px 0 0;color:rgba(255,255,255,.78);font-size:13px;line-height:1.75}.stepCopy ul{margin:25px 0 0;padding:0;list-style:none}.stepCopy li{padding:11px 0;border-top:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.9);font-size:12px}.stepCopy li:before{content:"•";margin-right:10px;color:#fff;font-size:17px}.privacyInner{display:grid;grid-template-columns:100px 1fr .72fr;gap:28px;align-items:center}.privacyIcon{width:86px;height:86px;display:grid;place-items:center;border-radius:20px;background:#fff;color:#0754c7}.privacyIcon :global(svg){width:40px;height:40px}.privacy h2,.cta h2{margin:8px 0 0;font-size:30px}.privacy p,.cta p,.footerTop>p{color:rgba(255,255,255,.74);font-size:11px;line-height:1.7}.privacyPoints{display:grid;gap:9px}.privacyPoints strong{padding:12px 13px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:rgba(255,255,255,.08);font-size:10px}.cta{padding:54px 0}.ctaInner{display:grid;grid-template-columns:70px 1fr auto;gap:22px;align-items:center}.ctaQr{width:62px;height:62px;display:grid;place-items:center;border-radius:16px;background:#fff;color:#0754c7}.cta h2{font-size:26px}.cta p{margin:6px 0 0}.ctaButtons{display:flex;gap:8px}.ctaButtons a{min-height:40px;padding:0 15px;display:flex;align-items:center;border-radius:9px;background:#fff;color:#0754c7;font-size:10px;font-weight:900;text-decoration:none}.ctaButtons a:last-child{border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}footer{padding:46px 0 18px;border-top:1px solid rgba(255,255,255,.16);background:#0649ad}.footerTop{display:grid;grid-template-columns:220px 1fr auto;gap:25px;align-items:center}.brand{display:flex;align-items:center;gap:9px}.brand>div{width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:#fff;color:#0754c7}.brand strong{font-size:13px}.brand small{display:block;margin-top:2px;color:rgba(255,255,255,.6);font-size:6px;letter-spacing:1px}.footerTop nav{display:flex;gap:15px}.footerTop a{color:#fff;font-size:9px;font-weight:800;text-decoration:none}.copyright{margin-top:28px;padding-top:15px;border-top:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.55);font-size:8px}
      @media(max-width:900px){.storyStep{grid-template-columns:1fr;gap:35px}.storyStep:nth-child(even) .stepVisual{order:0}.privacyInner{grid-template-columns:86px 1fr}.privacyPoints{grid-column:1/-1;grid-template-columns:repeat(3,1fr)}.footerTop{grid-template-columns:1fr 1fr}.footerTop nav{grid-column:1/-1}}@media(max-width:650px){.shell{width:calc(100% - 28px)}.section{padding:64px 0}.storySteps{gap:60px}.storyStep{min-height:auto}.stepVisual{min-height:430px}.device{width:220px;height:350px}.stepCopy h3{font-size:32px}.privacyInner{grid-template-columns:1fr}.privacyPoints{grid-template-columns:1fr}.ctaInner{grid-template-columns:60px 1fr}.ctaButtons{grid-column:1/-1}.footerTop{grid-template-columns:1fr}.footerTop nav{grid-column:auto;flex-wrap:wrap}}
    `}</style>
  </div>
}

function SectionTitle({number,label,title,text}:{number:string;label:string;title:string;text:string}){return <div className="title"><span>{number} · {label}</span><div><h2>{title}</h2><p>{text}</p></div><style jsx>{`.title>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1.2px}.title>div{margin-top:9px;display:flex;align-items:end;justify-content:space-between;gap:30px}.title h2{margin:0;color:#fff;font-size:clamp(30px,3.7vw,48px);letter-spacing:-1.5px}.title p{max-width:420px;margin:0;color:rgba(255,255,255,.74);font-size:12px;line-height:1.65}@media(max-width:650px){.title>div{align-items:flex-start;flex-direction:column;gap:10px}}`}</style></div>}
function StoreIcon(){return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h16l-1 11H5L4 9Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>}
function ProfileIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M5 21c.5-5 2.8-7 7-7s6.5 2 7 7"/></svg>}
function ReturnIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12a8 8 0 1 0 3-6"/><path d="M4 4v6h6"/></svg>}
