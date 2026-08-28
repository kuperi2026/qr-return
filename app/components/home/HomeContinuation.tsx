"use client";

import { PhoneIcon, QRIcon, ShieldIcon } from "./HomeIcons";

export default function HomeContinuation({ka}:{ka:boolean}) {
  const steps = [
    [<StoreIcon key="store" />, ka ? "შეიძინეთ QR RETURN" : "Purchase QR RETURN", ka ? "აირჩიეთ თქვენთვის შესაბამისი QR პროდუქტი მაღაზიაში." : "Choose the right QR product in the store."],
    [<ProfileIcon key="profile" />, ka ? "შექმენით პროფილი" : "Create a profile", ka ? "დაარეგისტრირეთ მიღებული QR კოდი თქვენს ანგარიშზე." : "Register the received QR code in your account."],
    [<QRIcon key="qr" size={29} />, ka ? "მპოვნელი ასკანირებს" : "Finder scans", ka ? "QR იხსნება ტელეფონით, აპლიკაციისა და რეგისტრაციის გარეშე." : "The QR opens on a phone without an app or registration."],
    [<ReturnIcon key="return" />, ka ? "იწყება დაბრუნება" : "Return begins", ka ? "ზარი, Live Chat ან ლოკაცია აკავშირებს მპოვნელსა და მფლობელს." : "Call, Live Chat or location connects finder and owner."],
  ];

  const features = [
    [<ChatIcon key="chat" />, "Live Chat", ka ? "მპოვნელსა და მფლობელს შეუძლიათ უსაფრთხოდ მიწერონ ერთმანეთს." : "Finder and owner can message each other securely."],
    [<PhoneIcon key="phone" />, ka ? "ტელეფონით დაკავშირება" : "Phone contact", ka ? "ტელეფონის ღილაკი გამოჩნდება მფლობელის არჩევანის შესაბამისად." : "The call button appears according to the owner's choice."],
    [<LocationIcon key="location" />, ka ? "ლოკაციის გაზიარება" : "Location sharing", ka ? "ორივე მხარისთვის სრულად ნებაყოფლობითი და მხოლოდ ღილაკზე დაჭერით." : "Fully voluntary for both sides and shared only by pressing a button."],
    [<LostIcon key="lost" />, "Lost ON", ka ? "დაკარგულად მონიშვნისას აქტიურდება შესაბამისი შეტყობინება და ფუნქციები." : "Lost status activates the relevant message and return tools."],
    [<ScanIcon key="scan" />, ka ? "Scan შეტყობინება" : "Scan alert", ka ? "მფლობელს შეუძლია ნახოს QR-ის დასკანერების ინფორმაცია." : "The owner can see QR scan information."],
    [<ShieldIcon key="shield" />, ka ? "ინფორმაციის კონტროლი" : "Information control", ka ? "მფლობელი თავად მართავს, რომელი მონაცემი გამოჩნდეს მპოვნელისთვის." : "The owner controls what information the finder can see."],
  ];

  return <div className="continuation">
    <section className="section" id="how-it-works">
      <div className="shell">
        <SectionTitle number="01" label="HOW IT WORKS" title={ka ? "როგორ მუშაობს QR RETURN" : "How QR RETURN Works"} text={ka ? "მარტივი პროცესი შეძენიდან უსაფრთხო დაბრუნებამდე." : "A simple process from purchase to safe return."} />
        <div className="steps">{steps.map(([icon,title,text],index)=><article className="step" key={String(title)}><div className="stepTop"><span>0{index+1}</span><div className="icon">{icon}</div></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="section sectionBorder">
      <div className="shell">
        <SectionTitle number="02" label="QR RETURN FEATURES" title={ka ? "ყველა საჭირო ფუნქცია ერთ სისტემაში" : "Every Essential Feature in One System"} text={ka ? "მფლობელი თავად აკონტროლებს კომუნიკაციას, ხილვადობასა და ლოკაციას." : "The owner controls communication, visibility and location."} />
        <div className="features">{features.map(([icon,title,text])=><article className="feature" key={String(title)}><div className="icon large">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </div>
    </section>

    <section className="section sectionBorder">
      <div className="shell">
        <SectionTitle number="03" label="OWNER & FINDER" title={ka ? "მარტივი გამოცდილება ორივე მხარისთვის" : "Simple for Both Sides"} text={ka ? "მპოვნელს ანგარიში არ სჭირდება, მფლობელი კი ყველაფერს ერთი დაცული ანგარიშიდან მართავს." : "The finder needs no account, while the owner manages everything securely."} />
        <div className="roles">
          <article className="role"><span>OWNER</span><div className="roleHead"><div className="icon large"><ProfileIcon /></div><h3>{ka ? "მფლობელის სივრცე" : "Owner space"}</h3></div><ul><li>{ka ? "შეუზღუდავი QR პროფილები" : "Unlimited QR profiles"}</li><li>{ka ? "მონაცემებისა და ხილვადობის რედაქტირება" : "Edit data and visibility"}</li><li>{ka ? "Lost ON და Scan ისტორია" : "Lost status and scan history"}</li><li>{ka ? "Live Chat და ლოკაციის მართვა" : "Live Chat and location controls"}</li></ul><a href="/signup">{ka ? "რეგისტრაცია" : "Register"} →</a></article>
          <article className="role"><span>FINDER</span><div className="roleHead"><div className="icon large"><ScanIcon /></div><h3>{ka ? "მპოვნელის გვერდი" : "Finder page"}</h3></div><ul><li>{ka ? "რეგისტრაცია არ სჭირდება" : "No registration needed"}</li><li>{ka ? "ხედავს მხოლოდ არჩეულ ინფორმაციას" : "Sees only selected information"}</li><li>{ka ? "ზარი ან Live Chat ერთი შეხებით" : "Call or Live Chat in one tap"}</li><li>{ka ? "ლოკაციის ნებაყოფლობითი გაზიარება" : "Voluntary location sharing"}</li></ul><strong>{ka ? "დაასკანირე. დაუკავშირდი. დააბრუნე." : "Scan. Connect. Return."}</strong></article>
        </div>
      </div>
    </section>

    <section className="section privacy sectionBorder">
      <div className="shell privacyInner"><div className="privacyIcon"><ShieldIcon /></div><div><span>04 · PRIVACY</span><h2>{ka ? "თქვენი ინფორმაცია — თქვენი არჩევანი." : "Your Information, Your Choice."}</h2><p>{ka ? "საჯარო გვერდზე სრული Tag Code არ ჩანს. მფლობელი თავად ირჩევს ტელეფონის, ელფოსტის, მისამართის, Live Chat-ისა და ლოკაციის ხილვადობას." : "The full Tag Code is not public. The owner controls phone, email, address, Live Chat and location visibility."}</p></div><div className="privacyPoints"><strong>✓ {ka ? "Tag Code დაფარულია" : "Tag Code masked"}</strong><strong>✓ {ka ? "ლოკაცია ნებაყოფლობითია" : "Location is voluntary"}</strong><strong>✓ {ka ? "მონაცემებს მფლობელი მართავს" : "Owner controls data"}</strong></div></div>
    </section>

    <section className="cta sectionBorder"><div className="shell ctaInner"><div className="ctaQr"><QRIcon size={42}/></div><div><span>QR RETURN</span><h2>{ka ? "დაკარგვა არ ნიშნავს დამშვიდობებას." : "Never lose what matters."}</h2><p>{ka ? "ერთი სწორი კავშირი შეიძლება გახდეს დაბრუნების დასაწყისი." : "One right connection can begin the return."}</p></div><div className="ctaButtons"><a href="/store">{ka ? "მაღაზია" : "Store"}</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a></div></div></section>

    <footer><div className="shell footerTop"><div className="brand"><div><QRIcon size={23}/></div><strong>QR RETURN<small>SMART LOST &amp; FOUND</small></strong></div><p>{ka ? "ნივთების, ცხოველებისა და Emergency პროფილების ერთიანი QR სისტემა." : "One QR system for belongings, pets and Emergency profiles."}</p><nav><a href="/store">{ka ? "მაღაზია" : "Store"}</a><a href="/support">Live Chat</a><a href="/login">{ka ? "შესვლა" : "Sign in"}</a><a href="/signup">{ka ? "რეგისტრაცია" : "Register"}</a></nav></div><div className="shell copyright">© 2026 QR RETURN</div></footer>

    <style jsx>{`
      .continuation{color:#fff;background:#1266e9}.shell{width:calc(100% - 80px);max-width:1280px;margin:auto}.section{padding:82px 0}.sectionBorder{border-top:1px solid rgba(255,255,255,.16)}.steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:31px}.step,.feature,.role{border:1px solid rgba(255,255,255,.2);border-radius:15px;background:rgba(255,255,255,.09)}.step{min-height:220px;padding:18px}.stepTop{display:flex;align-items:center;justify-content:space-between}.stepTop>span,.role>span,.privacyInner>div>span,.ctaInner>div>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1px}.icon{width:45px;height:45px;display:grid;place-items:center;border-radius:12px;background:#fff;color:#1266e9}.icon :global(svg){width:25px;height:25px}.icon.large{width:52px;height:52px}.step h3,.feature h3{margin:40px 0 0;color:#fff;font-size:14px}.step p,.feature p{margin:8px 0 0;color:rgba(255,255,255,.72);font-size:10px;line-height:1.65}.features{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:31px}.feature{min-height:218px;padding:19px}.feature h3{margin-top:30px}.roles{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:31px}.role{min-height:370px;padding:24px}.roleHead{display:flex;align-items:center;gap:14px;margin-top:22px}.roleHead h3{margin:0;font-size:20px}.role ul{margin:22px 0 0;padding:0;list-style:none}.role li{padding:10px 0;border-bottom:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.78);font-size:11px}.role li:before{content:"✓";margin-right:8px;color:#fff;font-weight:900}.role a,.role>strong{display:inline-block;margin-top:24px;color:#fff;font-size:11px;font-weight:900;text-decoration:none}.privacyInner{display:grid;grid-template-columns:100px 1fr .72fr;gap:28px;align-items:center}.privacyIcon{width:86px;height:86px;display:grid;place-items:center;border-radius:20px;background:#fff;color:#1266e9}.privacyIcon :global(svg){width:40px;height:40px}.privacy h2,.cta h2{margin:8px 0 0;font-size:30px}.privacy p,.cta p,.footerTop>p{color:rgba(255,255,255,.72);font-size:11px;line-height:1.7}.privacyPoints{display:grid;gap:9px}.privacyPoints strong{padding:12px 13px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:rgba(255,255,255,.08);font-size:10px}.cta{padding:54px 0}.ctaInner{display:grid;grid-template-columns:70px 1fr auto;gap:22px;align-items:center}.ctaQr{width:62px;height:62px;display:grid;place-items:center;border-radius:16px;background:#fff;color:#1266e9}.cta h2{font-size:26px}.cta p{margin:6px 0 0}.ctaButtons{display:flex;gap:8px}.ctaButtons a{min-height:40px;padding:0 15px;display:flex;align-items:center;border-radius:9px;background:#fff;color:#1266e9;font-size:10px;font-weight:900;text-decoration:none}.ctaButtons a:last-child{border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff}footer{padding:46px 0 18px;border-top:1px solid rgba(255,255,255,.16);background:#0d55c4}.footerTop{display:grid;grid-template-columns:220px 1fr auto;gap:25px;align-items:center}.brand{display:flex;align-items:center;gap:9px}.brand>div{width:40px;height:40px;display:grid;place-items:center;border-radius:10px;background:#fff;color:#1266e9}.brand strong{font-size:13px}.brand small{display:block;margin-top:2px;color:rgba(255,255,255,.6);font-size:6px;letter-spacing:1px}.footerTop nav{display:flex;gap:15px}.footerTop a{color:#fff;font-size:9px;font-weight:800;text-decoration:none}.copyright{margin-top:28px;padding-top:15px;border-top:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.55);font-size:8px}
      @media(max-width:900px){.steps{grid-template-columns:repeat(2,1fr)}.privacyInner{grid-template-columns:86px 1fr}.privacyPoints{grid-column:1/-1;grid-template-columns:repeat(3,1fr)}.footerTop{grid-template-columns:1fr 1fr}.footerTop nav{grid-column:1/-1}}@media(max-width:650px){.shell{width:calc(100% - 28px)}.section{padding:60px 0}.steps,.features,.roles{grid-template-columns:1fr}.step,.feature{min-height:195px}.privacyInner{grid-template-columns:1fr}.privacyPoints{grid-template-columns:1fr}.ctaInner{grid-template-columns:60px 1fr}.ctaButtons{grid-column:1/-1}.footerTop{grid-template-columns:1fr}.footerTop nav{grid-column:auto;flex-wrap:wrap}}
    `}</style>
  </div>
}

function SectionTitle({number,label,title,text}:{number:string;label:string;title:string;text:string}){return <div className="title"><span>{number} · {label}</span><div><h2>{title}</h2><p>{text}</p></div><style jsx>{`.title>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1.2px}.title>div{margin-top:9px;display:flex;align-items:end;justify-content:space-between;gap:30px}.title h2{margin:0;color:#fff;font-size:clamp(27px,3vw,38px);letter-spacing:-1px}.title p{max-width:390px;margin:0;color:rgba(255,255,255,.7);font-size:10px;line-height:1.65}@media(max-width:650px){.title>div{align-items:flex-start;flex-direction:column;gap:10px}}`}</style></div>}
function StoreIcon(){return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9h16l-1 11H5L4 9Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/></svg>}
function ProfileIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="4"/><path d="M5 21c.5-5 2.8-7 7-7s6.5 2 7 7"/></svg>}
function ReturnIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12a8 8 0 1 0 3-6"/><path d="M4 4v6h6"/></svg>}
function ChatIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>}
function LocationIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>}
function LostIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>}
function ScanIcon(){return <svg viewBox="0 0 24 24" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/><circle cx="12" cy="12" r="2.5"/></svg>}
