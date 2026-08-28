"use client";

import { PhoneIcon, QRIcon, ShieldIcon } from "./HomeIcons";

export default function EmergencySection({ ka }: { ka: boolean }) {
  const features = [
    [<ChatIcon key="chat" />, "Live Chat", ka ? "უსაფრთხო მიმოწერა" : "Secure messaging"],
    [<PhoneIcon key="phone" />, ka ? "ტელეფონი" : "Phone", ka ? "მფლობელის არჩევანით" : "Owner controlled"],
    [<LocationIcon key="location" />, ka ? "ლოკაცია" : "Location", ka ? "მხოლოდ ნებაყოფლობით" : "Always voluntary"],
    [<LostIcon key="lost" />, "Lost ON", ka ? "დაკარგვის რეჟიმი" : "Lost mode"],
    [<QRIcon key="scan" size={23} />, ka ? "Scan შეტყობინება" : "Scan alert", ka ? "სკანირების ინფორმაცია" : "Scan information"],
    [<ShieldIcon key="shield" />, ka ? "ინფორმაციის კონტროლი" : "Data control", ka ? "აჩვენეთ მხოლოდ არჩეული" : "Share only what you choose"],
  ];

  return (
    <>
      <div className="featurePanel">
        <span className="eyebrow">QR RETURN · FEATURES</span>
        <h1>{ka ? "ყველა საჭირო ფუნქცია ერთ სისტემაში" : "Every essential feature in one system"}</h1>
        <p className="lead">
          {ka
            ? "მფლობელი თავად აკონტროლებს კომუნიკაციას, ხილვადობასა და ლოკაციას."
            : "The owner controls communication, visibility and location."}
        </p>

        <div className="features">
          {features.map(([icon, title, text]) => (
            <article className="feature" key={String(title)}>
              <div className="icon">{icon}</div>
              <div><strong>{title}</strong><span>{text}</span></div>
            </article>
          ))}
        </div>

        <div className="rolesIntro">
          <span>OWNER &amp; FINDER</span>
          <h2>{ka ? "მარტივი გამოცდილება ორივე მხარისთვის" : "Simple for both sides"}</h2>
          <p>
            {ka
              ? "მპოვნელს ანგარიში არ სჭირდება, მფლობელი კი ყველაფერს დაცული ანგარიშიდან მართავს."
              : "The finder needs no account, while the owner manages everything securely."}
          </p>
        </div>

        <div className="roles">
          <article>
            <span>OWNER</span>
            <strong>{ka ? "მფლობელის სივრცე" : "Owner space"}</strong>
            <p>{ka ? "შეუზღუდავი პროფილები · რედაქტირება · Lost ON/Scan · Chat/ლოკაცია" : "Unlimited profiles · Editing · Lost ON/Scan · Chat/Location"}</p>
            <a href="/signup">{ka ? "რეგისტრაცია" : "Register"} →</a>
          </article>
          <article>
            <span>FINDER</span>
            <strong>{ka ? "მპოვნელის გვერდი" : "Finder page"}</strong>
            <p>{ka ? "რეგისტრაციის გარეშე · არჩეული ინფორმაცია · ზარი/Chat · ლოკაცია" : "No registration · Selected information · Call/Chat · Location"}</p>
          </article>
        </div>

        <strong className="slogan">
          {ka ? "დაასკანირე. დაუკავშირდი. დააბრუნე." : "Scan. Connect. Return."}
        </strong>

        <div className="actions">
          <a className="primary" href="/store">{ka ? "მაღაზიის ნახვა" : "View store"}</a>
          <a href="#how-it-works">{ka ? "როგორ მუშაობს" : "How it works"}</a>
        </div>
      </div>

      <style jsx>{`
        .featurePanel{max-width:640px}.eyebrow{color:rgba(255,255,255,.68);font-size:8px;font-weight:900;letter-spacing:1.4px}h1{max-width:590px;margin:12px 0 0;color:#fff;font-size:clamp(31px,3.1vw,43px);line-height:1.08;letter-spacing:-1.4px}.lead{max-width:570px;margin:14px 0 0;color:rgba(255,255,255,.8);font-size:12px;line-height:1.65}.features{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:22px}.feature{min-height:72px;padding:11px;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.17);border-radius:12px;background:rgba(255,255,255,.09)}.icon{width:38px;height:38px;flex:0 0 auto;display:grid;place-items:center;border-radius:10px;background:#fff;color:#1266e9}.icon :global(svg){width:21px;height:21px}.feature strong,.feature span{display:block}.feature strong{color:#fff;font-size:10px}.feature span{margin-top:4px;color:rgba(255,255,255,.66);font-size:8px}.rolesIntro{margin-top:18px}.rolesIntro>span{color:rgba(255,255,255,.58);font-size:7px;font-weight:900;letter-spacing:1px}.rolesIntro h2{margin:5px 0 0;color:#fff;font-size:16px;line-height:1.25}.rolesIntro p{margin:5px 0 0;color:rgba(255,255,255,.7);font-size:8px;line-height:1.5}.roles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.roles article{min-height:101px;padding:12px;border:1px solid rgba(255,255,255,.17);border-radius:12px;background:rgba(255,255,255,.07)}.roles span{display:block;color:rgba(255,255,255,.58);font-size:7px;font-weight:900;letter-spacing:1px}.roles strong{display:block;margin-top:7px;color:#fff;font-size:11px}.roles p{margin:6px 0 0;color:rgba(255,255,255,.68);font-size:8px;line-height:1.5}.roles a{display:inline-block;margin-top:8px;color:#fff;font-size:8px;font-weight:900;text-decoration:none}.slogan{display:block;margin-top:14px;color:#fff;font-size:11px}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.actions a{min-height:39px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.38);border-radius:9px;color:#fff;background:rgba(255,255,255,.07);font-size:10px;font-weight:900;text-decoration:none}.actions .primary{border-color:#fff;color:#1266e9;background:#fff}
        @media(max-width:650px){h1{font-size:32px}.features{grid-template-columns:1fr 1fr}.feature{min-height:68px;padding:9px}.roles{grid-template-columns:1fr}.roles article{min-height:auto}.actions a{flex:1}}
        @media(max-width:390px){.features{grid-template-columns:1fr}.feature{min-height:62px}}
      `}</style>
    </>
  );
}

function ChatIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>}
function LocationIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>}
function LostIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>}
