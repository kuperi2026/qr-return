"use client";

import ProductOrbit from "./ProductOrbit";

export default function HomeHero({ ka }: { ka: boolean }) {
  const journey = [
    { title: ka ? "რეგისტრაცია" : "Registration", rows: ka ? ["სახელი · გვარი", "ტელეფონი", "ელფოსტა", "პაროლი"] : ["First · Last name", "Phone", "Email", "Password"], action: ka ? "ანგარიშის შექმნა" : "Create account" },
    { title: ka ? "შესვლა" : "Sign in", rows: ["Email", "Password", "Forgot password?"], action: "Sign In" },
    { title: ka ? "პროდუქტის არჩევა" : "Choose product", rows: ["🐶 · 🐱 · 🔑", "👛 · 👜 · 🧳", "Emergency"], action: ka ? "არჩევა" : "Select" },
    { title: ka ? "პროფილის შექმნა" : "Create profile", rows: ka ? ["QR / Tag Code", "ფოტო", "ინფორმაცია", "მპოვნელის ტექსტი"] : ["QR / Tag Code", "Photo", "Information", "Finder message"], action: ka ? "შენახვა" : "Save" },
    { title: ka ? "ხილვადობის მართვა" : "Visibility", rows: ka ? ["ტელეფონი · აქტიური", "Live Chat · ON/OFF", "ელფოსტა · ON/OFF"] : ["Phone · Active", "Live Chat · ON/OFF", "Email · ON/OFF"], action: ka ? "შენახვა" : "Save" },
    { title: ka ? "მპოვნელთან კავშირი" : "Finder contact", rows: ka ? ["დარეკვა", "Live Chat", "ლოკაცია", "Scan ინფორმაცია"] : ["Call", "Live Chat", "Location", "Scan information"], action: ka ? "დაკავშირება" : "Connect" },
  ];

  const features = ka
    ? ["ტელეფონი და Live Chat", "ლოკაციის გაზიარება", "Lost ON", "Scan შეტყობინება", "ინფორმაციის კონტროლი", "Emergency პროფილი მესამე პირისთვის"]
    : ["Phone and Live Chat", "Location sharing", "Lost ON", "Scan alert", "Information control", "Emergency profile for another person"];

  const finderBenefits = ka
    ? ["რეგისტრაცია არ სჭირდება", "აპლიკაცია არ სჭირდება", "ზარი ან Live Chat", "ხედავს მხოლოდ არჩეულ ინფორმაციას", "ლოკაციას მხოლოდ თანხმობით აზიარებს", "Emergency ინფორმაციაზე სწრაფი წვდომა"]
    : ["No registration required", "No app required", "Call or Live Chat", "Sees only selected information", "Shares location only by consent", "Fast access to Emergency information"];

  return (
    <>
      <section className="homeHero">
        <div className="homeHeroInner">
          <header className="heroTitle">
            <span>QR RETURN · SMART LOST &amp; FOUND</span>
            <h1>{ka ? "QR პროფილის შექმნის შემდეგ ნივთი, შინაური ცხოველი ან Emergency სამაჯური უნიკალურ ციფრულ გვერდს უკავშირდება." : "Each QR profile connects an item, pet, or Emergency bracelet to a unique digital page."}</h1>
            <p>{ka ? "ერთი სკანირებით მპოვნელი ხედავს მხოლოდ იმ ინფორმაციასა და დაკავშირების საშუალებებს, რომლებიც მფლობელმა წინასწარ განსაზღვრა." : "With one scan, the finder sees only the information and contact options selected by the owner."}</p>
          </header>

          <div className="productExperience">
            <InfoPanel eyebrow="OWNER" title={ka ? "მფლობელის შესაძლებლობები" : "Owner capabilities"} items={features} />
            <div className="orbitFrame"><ProductOrbit ka={ka} /></div>
            <InfoPanel eyebrow="FINDER" title={ka ? "მპოვნელის შესაძლებლობები" : "Finder capabilities"} items={finderBenefits} />
          </div>

          <div className="journeyHeading" id="how-it-works">
            <span>HOW IT WORKS</span>
            <h2>{ka ? "QR RETURN თქვენს ტელეფონში" : "QR RETURN on your phone"}</h2>
          </div>
          <div className="journeyCards">
            {journey.map((card, index) => <JourneyCard card={card} number={index + 1} key={card.title} />)}
          </div>
        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#0754c7}.homeHeroInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:74px 0 86px}.heroTitle{max-width:1040px;margin:0 auto;text-align:center}.heroTitle>span,.journeyHeading>span{color:rgba(255,255,255,.64);font-size:9px;font-weight:900;letter-spacing:1.5px}.heroTitle h1{margin:14px 0 0;color:#fff;font-size:clamp(30px,3.4vw,48px);line-height:1.16;letter-spacing:-1.5px}.heroTitle p{max-width:820px;margin:18px auto 0;color:rgba(255,255,255,.82);font-size:15px;line-height:1.72}.productExperience{margin-top:48px;display:grid;grid-template-columns:250px minmax(480px,1fr) 250px;gap:24px;align-items:center}.orbitFrame{min-width:0;display:flex;justify-content:center}.journeyHeading{margin-top:48px;text-align:center}.journeyHeading h2{margin:9px 0 0;color:#fff;font-size:30px}.journeyCards{margin-top:24px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
        @media(max-width:1100px){.productExperience{grid-template-columns:1fr 1fr}.orbitFrame{grid-column:1/-1;grid-row:1}.journeyCards{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:760px){.homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}.heroTitle h1{font-size:30px;letter-spacing:-.8px}.heroTitle p{font-size:13px}.productExperience{grid-template-columns:1fr;margin-top:38px}.orbitFrame{grid-column:auto;grid-row:auto;order:-1}.journeyCards{grid-template-columns:1fr}.journeyHeading h2{font-size:25px}}
      `}</style>
    </>
  );
}

function InfoPanel({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return <aside className="infoPanel"><span>{eyebrow}</span><h2>{title}</h2><div>{items.map((item,index)=><p key={item}><b>{String(index+1).padStart(2,"0")}</b>{item}</p>)}</div><style jsx>{`
    .infoPanel{padding:22px 19px;border:1px solid rgba(255,255,255,.2);border-radius:19px;background:rgba(4,48,126,.28);box-shadow:0 18px 40px rgba(0,35,102,.14)}.infoPanel>span{color:rgba(255,255,255,.6);font-size:8px;font-weight:900;letter-spacing:1.2px}.infoPanel h2{margin:10px 0 0;color:#fff;font-size:19px;line-height:1.3}.infoPanel>div{margin-top:16px}.infoPanel p{min-height:42px;margin:0;padding:10px 0;display:flex;align-items:center;gap:10px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.9);font-size:11px;font-weight:800}.infoPanel b{color:rgba(255,255,255,.48);font-size:8px}@media(max-width:760px){.infoPanel{padding:18px}.infoPanel h2{font-size:18px}.infoPanel p{font-size:12px}}
  `}</style></aside>
}

function JourneyCard({ card, number }: { card: { title: string; rows: string[]; action: string }; number: number }) {
  return <article className="journeyCard"><span>0{number}</span><div className="miniPhone"><i/><strong>QR RETURN</strong><h3>{card.title}</h3><div>{card.rows.map(row=><small key={row}>{row}</small>)}</div><b>{card.action}</b></div><div className="cardCopy"><small>STEP 0{number}</small><h3>{card.title}</h3></div><style jsx>{`
    .journeyCard{min-height:218px;padding:20px;display:grid;grid-template-columns:106px 1fr;gap:20px;align-items:center;position:relative;border:1px solid rgba(255,255,255,.19);border-radius:19px;background:rgba(4,48,126,.28)}.journeyCard>span{position:absolute;top:12px;right:13px;color:rgba(255,255,255,.5);font-size:9px;font-weight:900}.miniPhone{width:100px;height:174px;padding:11px 8px 9px;display:flex;flex-direction:column;border:4px solid #fff;border-radius:22px;color:#0754c7;background:#f7faff;box-shadow:0 15px 30px rgba(0,27,85,.25)}.miniPhone>i{width:32px;height:7px;margin:-7px auto 0;border-radius:0 0 5px 5px;background:#0754c7}.miniPhone>strong{margin-top:9px;font-size:6px;letter-spacing:.7px;text-align:center}.miniPhone>h3{min-height:25px;margin:6px 0 0;color:#193a5d;font-size:9px;line-height:1.25;text-align:center}.miniPhone>div{margin-top:5px;display:grid;gap:3px}.miniPhone small{min-height:18px;padding:0 5px;display:flex;align-items:center;border:1px solid #dce7f4;border-radius:5px;color:#49647f;background:#fff;font-size:6.5px;font-weight:750}.miniPhone>b{min-height:20px;margin-top:auto;display:grid;place-items:center;border-radius:5px;color:#fff;background:#0754c7;font-size:6.5px}.cardCopy>small{color:rgba(255,255,255,.62);font-size:9px;font-weight:900;letter-spacing:1px}.cardCopy h3{margin:10px 0 0;color:#fff;font-size:18px;line-height:1.35}@media(max-width:760px){.journeyCard{min-height:205px}.cardCopy h3{font-size:19px}}
  `}</style></article>
}
