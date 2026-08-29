"use client";

import { QRIcon, ShieldIcon } from "./HomeIcons";

export default function HomeContinuation({ka}:{ka:boolean}) {
  const steps = [
    {
      title: ka ? "შექმენით ანგარიში" : "Create your account",
      text: ka ? "შეიყვანეთ ძირითადი მონაცემები და შექმენით თქვენი დაცული QR RETURN სივრცე." : "Add the essential details and create your secure QR RETURN space.",
      rows: ka ? ["სახელი და გვარი", "ელფოსტა", "ტელეფონი"] : ["Full name", "Email", "Phone"],
      action: ka ? "ანგარიშის შექმნა" : "Create account",
    },
    {
      title: ka ? "შედით ანგარიშში" : "Sign in",
      text: ka ? "ელფოსტითა და პაროლით შედით ყველა თქვენი QR პროფილის სამართავად." : "Sign in with email and password to manage every QR profile.",
      rows: ka ? ["ელფოსტა", "პაროლი"] : ["Email", "Password"],
      action: ka ? "შესვლა" : "Sign in",
    },
    {
      title: ka ? "აირჩიეთ პროდუქტი" : "Choose a product",
      text: ka ? "აირჩიეთ თქვენი QR პროდუქტის შესაბამისი კატეგორია." : "Select the category that matches your QR product.",
      rows: ["🐶  🐱  🔑", "👛  👜  🧳", "Emergency"],
      action: ka ? "არჩევა" : "Select",
    },
    {
      title: ka ? "შექმენით პროფილი" : "Create the profile",
      text: ka ? "დაამატეთ ფოტო, საჭირო ინფორმაცია და მპოვნელისთვის განკუთვნილი დეტალები." : "Add a photo, essential information and finder-facing details.",
      rows: ka ? ["ფოტო", "ძირითადი ინფორმაცია", "დამატებითი დეტალები"] : ["Photo", "Basic information", "Additional details"],
      action: ka ? "პროფილის შენახვა" : "Save profile",
    },
    {
      title: ka ? "მართეთ ფუნქციები" : "Control the features",
      text: ka ? "ჩართეთ Lost ON, მართეთ Live Chat და თავად განსაზღვრეთ ხილვადობა." : "Enable Lost ON, manage Live Chat and control visibility.",
      rows: ["Lost ON", "Live Chat", ka ? "ხილვადობის მართვა" : "Visibility controls"],
      action: ka ? "ცვლილებების შენახვა" : "Save changes",
    },
    {
      title: ka ? "დაუკავშირდით მპოვნელს" : "Connect with the finder",
      text: ka ? "სკანირების შემდეგ დაიწყეთ ზარი ან Live Chat და მიიღეთ თანხმობით გაზიარებული ლოკაცია." : "After a scan, use phone or Live Chat and receive consent-based location.",
      rows: ka ? ["Scan შეტყობინება", "ზარი ან Live Chat", "გაზიარებული ლოკაცია"] : ["Scan alert", "Call or Live Chat", "Shared location"],
      action: ka ? "დაკავშირება" : "Connect",
    },
  ];

  return <div className="continuation">
    <section className="section how" id="how-it-works">
      <div className="shell">
        <SectionTitle number="01" label="HOW IT WORKS" title={ka ? "როგორ მუშაობს QR RETURN" : "How QR RETURN Works"} text={ka ? "ექვსი მარტივი ნაბიჯი რეგისტრაციიდან უსაფრთხო დაბრუნებამდე." : "Six simple steps from registration to safe return."} />
        <div className="phoneFlow">
          {steps.map((step,index) => (
            <article className="phoneStep" key={String(step.title)}>
              <span className="stepNumber">0{index + 1}</span>
              <div className="phoneDevice">
                <div className="phoneTop" />
                <div className="phoneBrand">QR RETURN</div>
                <h3>{step.title}</h3>
                <div className="screenRows">
                  {step.rows.map((row) => (
                    <div className="screenRow" key={row}>{row}</div>
                  ))}
                </div>
                <div className="phoneAction">{step.action}</div>
              </div>
              <div className="phoneCopy">
                <span>STEP 0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
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
      .continuation{color:#fff;background:#0754c7}.shell{width:calc(100% - 80px);max-width:1280px;margin:auto}.section{padding:92px 0}.sectionBorder{border-top:1px solid rgba(255,255,255,.16)}.phoneFlow{margin-top:50px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}.phoneStep{min-width:0;position:relative;padding:28px 20px 24px;border:1px solid rgba(255,255,255,.17);border-radius:24px;background:rgba(4,48,126,.24)}.stepNumber{position:absolute;top:17px;left:18px;color:rgba(255,255,255,.52);font-size:9px;font-weight:900;letter-spacing:1px}.phoneDevice{width:210px;height:370px;margin:6px auto 0;padding:22px 17px 18px;display:flex;flex-direction:column;border:7px solid #fff;border-radius:36px;color:#0754c7;background:#f7faff;box-shadow:0 25px 55px rgba(0,27,85,.28)}.phoneTop{width:64px;height:15px;margin:-15px auto 0;border-radius:0 0 10px 10px;background:#0754c7}.phoneBrand{margin-top:30px;color:#0754c7;font-size:7px;font-weight:950;letter-spacing:1.2px;text-align:center}.phoneDevice>h3{min-height:43px;margin:12px 0 0;color:#183657;font-size:16px;line-height:1.25;text-align:center}.screenRows{margin-top:17px;display:grid;gap:8px}.screenRow{min-height:38px;padding:0 11px;display:flex;align-items:center;border:1px solid #d9e6f7;border-radius:9px;color:#546d87;background:#fff;font-size:9px;font-weight:750}.phoneAction{min-height:39px;margin-top:auto;display:grid;place-items:center;border-radius:10px;color:#fff;background:#0754c7;font-size:9px;font-weight:900}.phoneCopy{margin-top:24px}.phoneCopy>span{color:rgba(255,255,255,.58);font-size:8px;font-weight:900;letter-spacing:1.2px}.phoneCopy h3{margin:9px 0 0;color:#fff;font-size:20px;line-height:1.25}.phoneCopy p{margin:10px 0 0;color:rgba(255,255,255,.76);font-size:11px;line-height:1.7}.privacyInner{display:grid;grid-template-columns:100px 1fr .72fr;gap:28px;align-items:center}.privacyIcon{width:86px;height:86px;display:grid;place-items:center;border-radius:20px;background:#fff;color:#0754c7}.privacyIcon :global(svg){width:40px;height:40px}.privacy h2,.cta h2{margin:8px 0 0;font-size:30px}.privacy p,.cta p,.footerTop>p{color:rgba(255,255,255,.74);font-size:11px;line-height:1.7}.privacyPoints{display:grid;gap:9px}.privacyPoints strong{padding:12px 13px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:rgba(255,255,255,.08);font-size:10px}.cta{padding:54px 0}.ctaInner{display:grid;grid-template-columns:70px 1fr auto;gap:22px;align-items:center}.ctaQr{width:62px;height:62px;display:grid;place-items:center;border-radius:16px;background:#fff;color:#0754c7}.cta h2{font-size:26px}.cta p{margin:6px 0 0}.ctaButtons{display:flex;gap:8px}.ctaButtons a{min-height:40px;padding:0 15px;display:flex;align-items:center;border-radius:9px;background:#fff;color:#0754c7;font-size:10px;font-weight:900;text-decoration:none}.ctaButtons a:last-child{border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}footer{padding:46px 0 18px;border-top:1px solid rgba(255,255,255,.16);background:#0649ad}.footerTop{display:grid;grid-template-columns:220px 1fr auto;gap:25px;align-items:center}.brand{display:flex;align-items:center;gap:9px}.brand>div{width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:#fff;color:#0754c7}.brand strong{font-size:13px}.brand small{display:block;margin-top:2px;color:rgba(255,255,255,.6);font-size:6px;letter-spacing:1px}.footerTop nav{display:flex;gap:15px}.footerTop a{color:#fff;font-size:9px;font-weight:800;text-decoration:none}.copyright{margin-top:28px;padding-top:15px;border-top:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.55);font-size:8px}
      @media(max-width:1050px){.phoneFlow{grid-template-columns:repeat(2,minmax(0,1fr))}.privacyInner{grid-template-columns:86px 1fr}.privacyPoints{grid-column:1/-1;grid-template-columns:repeat(3,1fr)}.footerTop{grid-template-columns:1fr 1fr}.footerTop nav{grid-column:1/-1}}@media(max-width:650px){.shell{width:calc(100% - 28px)}.section{padding:64px 0}.phoneFlow{display:flex;gap:16px;overflow-x:auto;padding:0 2px 16px;scroll-snap-type:x mandatory}.phoneStep{min-width:286px;scroll-snap-align:start}.phoneDevice{width:205px;height:360px}.privacyInner{grid-template-columns:1fr}.privacyPoints{grid-template-columns:1fr}.ctaInner{grid-template-columns:60px 1fr}.ctaButtons{grid-column:1/-1}.footerTop{grid-template-columns:1fr}.footerTop nav{grid-column:auto;flex-wrap:wrap}}
    `}</style>
  </div>
}

function SectionTitle({number,label,title,text}:{number:string;label:string;title:string;text:string}){return <div className="title"><span>{number} · {label}</span><div><h2>{title}</h2><p>{text}</p></div><style jsx>{`.title>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1.2px}.title>div{margin-top:9px;display:flex;align-items:end;justify-content:space-between;gap:30px}.title h2{margin:0;color:#fff;font-size:clamp(30px,3.7vw,48px);letter-spacing:-1.5px}.title p{max-width:420px;margin:0;color:rgba(255,255,255,.74);font-size:12px;line-height:1.65}@media(max-width:650px){.title>div{align-items:flex-start;flex-direction:column;gap:10px}}`}</style></div>}
function StoreIcon(){return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h16l-1 11H5L4 9Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>}
function ProfileIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M5 21c.5-5 2.8-7 7-7s6.5 2 7 7"/></svg>}
function ReturnIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12a8 8 0 1 0 3-6"/><path d="M4 4v6h6"/></svg>}
