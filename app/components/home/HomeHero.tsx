"use client";

import ProductOrbit from "./ProductOrbit";

export default function HomeHero({ ka }: { ka: boolean }) {
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

        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#0754c7}.homeHeroInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:74px 0 86px}.heroTitle{max-width:1040px;margin:0 auto;text-align:center}.heroTitle>span{color:rgba(255,255,255,.64);font-size:11px;font-weight:900;letter-spacing:1.5px}.heroTitle h1{margin:14px 0 0;color:#fff;font-size:clamp(29px,2.8vw,40px);line-height:1.22;letter-spacing:-1px}.heroTitle p{max-width:820px;margin:18px auto 0;color:rgba(255,255,255,.82);font-size:18px;line-height:1.65}.productExperience{margin-top:48px;display:grid;grid-template-columns:250px minmax(480px,1fr) 250px;gap:24px;align-items:center}.orbitFrame{min-width:0;display:flex;justify-content:center}
        @media(max-width:1100px){.productExperience{grid-template-columns:1fr 1fr}.orbitFrame{grid-column:1/-1;grid-row:1}}
        @media(max-width:760px){.homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}.heroTitle h1{font-size:27px;letter-spacing:-.5px}.heroTitle p{font-size:16px}.productExperience{grid-template-columns:1fr;margin-top:38px}.orbitFrame{grid-column:auto;grid-row:auto;order:-1}}
      `}</style>
    </>
  );
}

function InfoPanel({ eyebrow, title, items }: { eyebrow: string; title: string; items: string[] }) {
  return <aside className="infoPanel"><span>{eyebrow}</span><h2>{title}</h2><div>{items.map((item,index)=><p key={item}><b>{String(index+1).padStart(2,"0")}</b>{item}</p>)}</div><style jsx>{`
    .infoPanel{padding:22px 19px;border:1px solid rgba(255,255,255,.2);border-radius:19px;background:rgba(4,48,126,.28);box-shadow:0 18px 40px rgba(0,35,102,.14)}.infoPanel>span{color:rgba(255,255,255,.6);font-size:8px;font-weight:900;letter-spacing:1.2px}.infoPanel h2{margin:10px 0 0;color:#fff;font-size:21px;line-height:1.3}.infoPanel>div{margin-top:16px}.infoPanel p{min-height:42px;margin:0;padding:10px 0;display:flex;align-items:center;gap:10px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.9);font-size:13px;font-weight:800}.infoPanel b{color:rgba(255,255,255,.48);font-size:8px}@media(max-width:760px){.infoPanel{padding:18px}.infoPanel h2{font-size:20px}.infoPanel p{font-size:13px}}
  `}</style></aside>
}

