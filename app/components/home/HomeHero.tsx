"use client";

import EmergencySection from "./EmergencySection";
import ProductOrbit from "./ProductOrbit";

export default function HomeHero({ ka }: { ka: boolean }) {
  const journey = [
    {
      title: ka ? "რეგისტრაცია" : "Registration",
      rows: ka ? ["სახელი · გვარი", "ტელეფონი", "ელფოსტა", "პაროლი"] : ["First · Last name", "Phone", "Email", "Password"],
      action: ka ? "ანგარიშის შექმნა" : "Create account",
    },
    {
      title: ka ? "შესვლა" : "Sign in",
      rows: ["Email", "Password", "Forgot password?"],
      action: "Sign In",
    },
    {
      title: ka ? "პროდუქტის არჩევა" : "Choose product",
      rows: ["🐶 · 🐱 · 🔑", "👛 · 👜 · 🧳", "Emergency"],
      action: ka ? "არჩევა" : "Select",
    },
    {
      title: ka ? "პროფილის შექმნა" : "Create profile",
      rows: ka ? ["QR / Tag Code", "ფოტო", "ინფორმაცია", "მპოვნელის ტექსტი"] : ["QR / Tag Code", "Photo", "Information", "Finder message"],
      action: ka ? "შენახვა" : "Save",
    },
    {
      title: ka ? "ხილვადობის მართვა" : "Visibility",
      rows: ka ? ["ტელეფონი · აქტიური", "Live Chat · ON/OFF", "ელფოსტა · ON/OFF"] : ["Phone · Active", "Live Chat · ON/OFF", "Email · ON/OFF"],
      action: ka ? "შენახვა" : "Save",
    },
    {
      title: ka ? "მპოვნელთან კავშირი" : "Finder contact",
      rows: ka ? ["დარეკვა", "Live Chat", "ლოკაცია", "Scan ინფორმაცია"] : ["Call", "Live Chat", "Location", "Scan information"],
      action: ka ? "დაკავშირება" : "Connect",
    },
  ];

  return (
    <>
      <section className="homeHero">
        <div className="homeHeroInner">
          <header className="heroTitle">
            <span>QR RETURN · SMART LOST &amp; FOUND</span>
            <h1>
              {ka
                ? "QR პროფილის შექმნის შემდეგ ნივთი, შინაური ცხოველი ან Emergency სამაჯური უნიკალურ ციფრულ გვერდს უკავშირდება."
                : "Each QR profile connects an item, pet, or Emergency bracelet to a unique digital page."}
            </h1>
            <p>
              {ka
                ? "ერთი სკანირებით მპოვნელი ხედავს მხოლოდ იმ ინფორმაციასა და დაკავშირების საშუალებებს, რომლებიც მფლობელმა წინასწარ განსაზღვრა."
                : "With one scan, the finder sees only the information and contact options selected by the owner."}
            </p>
          </header>

          <div className="journeyOrbit" id="how-it-works">
            <div className="journeySide">
              {journey.slice(0, 3).map((card, index) => (
                <JourneyCard card={card} number={index + 1} key={card.title} />
              ))}
            </div>

            <div className="orbitFrame">
              <ProductOrbit ka={ka} />
            </div>

            <div className="journeySide">
              {journey.slice(3).map((card, index) => (
                <JourneyCard card={card} number={index + 4} key={card.title} />
              ))}
            </div>
          </div>

          <EmergencySection ka={ka} />
        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#0754c7}
        .homeHeroInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:74px 0 86px}
        .heroTitle{max-width:1040px;margin:0 auto;text-align:center}
        .heroTitle>span{color:rgba(255,255,255,.64);font-size:9px;font-weight:900;letter-spacing:1.5px}
        .heroTitle h1{margin:14px 0 0;color:#fff;font-size:clamp(30px,3.4vw,48px);line-height:1.16;letter-spacing:-1.5px}
        .heroTitle p{max-width:820px;margin:18px auto 0;color:rgba(255,255,255,.82);font-size:15px;line-height:1.72}
        .journeyOrbit{margin-top:50px;display:grid;grid-template-columns:210px minmax(600px,1fr) 210px;gap:22px;align-items:center}.journeySide{display:grid;gap:16px}.orbitFrame{min-width:0;display:flex;justify-content:center}
        @media(max-width:1100px){.journeyOrbit{grid-template-columns:1fr 1fr}.orbitFrame{grid-column:1/-1;grid-row:1}.journeySide{grid-template-columns:repeat(3,minmax(0,1fr))}}
        @media(max-width:760px){
          .homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}
          .heroTitle h1{font-size:30px;letter-spacing:-.8px}
          .heroTitle p{font-size:13px}
          .journeyOrbit{grid-template-columns:1fr;margin-top:38px}
          .orbitFrame{grid-column:auto;grid-row:auto;order:-1}
          .journeySide{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        }
      `}</style>
    </>
  );
}

function JourneyCard({
  card,
  number,
}: {
  card: { title: string; rows: string[]; action: string };
  number: number;
}) {
  return (
    <article className="journeyCard">
      <span>0{number}</span>
      <div className="miniPhone">
        <i />
        <strong>QR RETURN</strong>
        <h3>{card.title}</h3>
        <div>{card.rows.map((row) => <small key={row}>{row}</small>)}</div>
        <b>{card.action}</b>
      </div>
      <h3>{card.title}</h3>
      <style jsx>{`
        .journeyCard{min-height:172px;padding:13px;display:grid;grid-template-columns:82px 1fr;gap:12px;align-items:center;position:relative;border:1px solid rgba(255,255,255,.18);border-radius:16px;background:rgba(4,48,126,.27)}
        .journeyCard>span{position:absolute;top:9px;right:10px;color:rgba(255,255,255,.5);font-size:8px;font-weight:900}
        .journeyCard>h3{margin:0;color:#fff;font-size:13px;line-height:1.35}
        .miniPhone{width:82px;height:142px;padding:9px 6px 7px;display:flex;flex-direction:column;border:4px solid #fff;border-radius:18px;color:#0754c7;background:#f7faff;box-shadow:0 12px 25px rgba(0,27,85,.24)}
        .miniPhone>i{width:27px;height:6px;margin:-6px auto 0;border-radius:0 0 5px 5px;background:#0754c7}
        .miniPhone>strong{margin-top:7px;font-size:5px;letter-spacing:.6px;text-align:center}
        .miniPhone>h3{min-height:21px;margin:5px 0 0;color:#193a5d;font-size:8px;line-height:1.25;text-align:center}
        .miniPhone>div{margin-top:4px;display:grid;gap:3px}
        .miniPhone small{min-height:15px;padding:0 4px;display:flex;align-items:center;border:1px solid #dce7f4;border-radius:4px;color:#49647f;background:#fff;font-size:5.5px;font-weight:750}
        .miniPhone>b{min-height:17px;margin-top:auto;display:grid;place-items:center;border-radius:5px;color:#fff;background:#0754c7;font-size:5.5px}
        @media(max-width:760px){.journeyCard{min-height:158px;padding:10px;grid-template-columns:72px 1fr;gap:8px}.journeyCard>h3{font-size:11px}.miniPhone{width:72px;height:128px}.miniPhone small{font-size:5px}}
      `}</style>
    </article>
  );
}
