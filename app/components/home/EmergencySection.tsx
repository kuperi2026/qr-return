"use client";

import { useState } from "react";
import { PhoneIcon, QRIcon, ShieldIcon } from "./HomeIcons";

export default function EmergencySection({ ka }: { ka: boolean }) {
  const [activeFeature, setActiveFeature] = useState<number | null>(0);
  const features = [
    [<ChatIcon key="chat" />, "Live Chat", ka ? "უსაფრთხოდ დაუკავშირდით ერთმანეთს პირადი ნომრის გამჟღავნების გარეშე." : "Connect securely without revealing a private phone number."],
    [<PhoneIcon key="phone" />, ka ? "ტელეფონით დაკავშირება" : "Phone contact", ka ? "მპოვნელი ერთი შეხებით დაგირეკავთ, თუ ამ ფუნქციას ჩართავთ." : "The finder can call in one tap when you enable this option."],
    [<LocationIcon key="location" />, ka ? "ლოკაციის გაზიარება" : "Location sharing", ka ? "ზუსტი ადგილი გაზიარდება მხოლოდ შესაბამისი მხარის თანხმობით." : "Precise location is shared only with the person's consent."],
    [<LostIcon key="lost" />, "Lost ON", ka ? "აჩვენებს, რომ პროდუქტი დაკარგულია და ააქტიურებს დაბრუნების ფუნქციებს." : "Shows the product is lost and activates return tools."],
    [<QRIcon key="scan" size={23} />, ka ? "Scan შეტყობინება" : "Scan alert", ka ? "მფლობელი ხედავს, როდის დასკანერდა მისი QR კოდი." : "The owner can see when the QR code was scanned."],
    [<ShieldIcon key="shield" />, ka ? "ინფორმაციის კონტროლი" : "Information control", ka ? "თქვენ ირჩევთ, რომელი მონაცემი გამოჩნდეს მპოვნელისთვის." : "You choose which information the finder can see."],
  ];

  return (
    <>
      <div className="featurePanel">
        <span className="eyebrow">QR RETURN · FEATURES</span>
        <h1>{ka ? "ყველა საჭირო ფუნქცია ერთ სისტემაში" : "Every essential feature in one system"}</h1>
        <p className="lead">
          {ka
            ? "QR კოდის ერთი სკანირება მპოვნელს აძლევს თქვენთან დაკავშირების უსაფრთხო გზას, რათა დაკარგული ნივთი ან ცხოველი უფრო სწრაფად დაბრუნდეს. მფლობელი თავად აკონტროლებს კომუნიკაციას, ხილვადობასა და ლოკაციას."
            : "One QR scan gives the finder a safe way to reach you, helping a lost item or pet return faster. The owner controls communication, visibility and location."}
        </p>

        <div className="featureTabs" role="tablist" aria-label={ka ? "QR RETURN ფუნქციები" : "QR RETURN features"}>
          {features.map(([icon, title], index) => (
            <button
              className={activeFeature === index ? "featureTab active" : "featureTab"}
              key={String(title)}
              type="button"
              aria-expanded={activeFeature === index}
              onClick={() => setActiveFeature(activeFeature === index ? null : index)}
            >
              <span className="tabIcon">{icon}</span>
              <strong>{title}</strong>
              <span className="toggle">{activeFeature === index ? "−" : "+"}</span>
            </button>
          ))}
        </div>

        {activeFeature !== null && (
          <div className="featureDetails" role="region" aria-live="polite">
            <div className="detailIcon">{features[activeFeature][0]}</div>
            <div>
              <strong>{features[activeFeature][1]}</strong>
              <p>{features[activeFeature][2]}</p>
            </div>
          </div>
        )}

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
            <p>{ka ? "მართეთ შეუზღუდავი QR პროფილები, შეცვალეთ ხილვადობა, ჩართეთ Lost ON და აკონტროლეთ Scan ისტორია, Live Chat და ლოკაცია." : "Manage unlimited QR profiles, edit visibility, activate Lost ON, and control scan history, Live Chat and location."}</p>
            <a href="/signup">{ka ? "რეგისტრაცია" : "Register"} →</a>
          </article>
          <article>
            <span>FINDER</span>
            <strong>{ka ? "მპოვნელის გვერდი" : "Finder page"}</strong>
            <p>{ka ? "მპოვნელს რეგისტრაცია და აპლიკაცია არ სჭირდება — სკანირების შემდეგ ხედავს მხოლოდ არჩეულ ინფორმაციას და შეუძლია ზარი, Live Chat ან ლოკაციის გაზიარება." : "The finder needs no registration or app, sees only selected information, and can call, chat or share location after scanning."}</p>
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
        .featurePanel{max-width:640px}.eyebrow{color:rgba(255,255,255,.68);font-size:8px;font-weight:900;letter-spacing:1.4px}h1{max-width:590px;margin:12px 0 0;color:#fff;font-size:clamp(31px,3.1vw,43px);line-height:1.08;letter-spacing:-1.4px}.lead{max-width:570px;margin:14px 0 0;color:rgba(255,255,255,.8);font-size:12px;line-height:1.65}.featureTabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:22px}.featureTab{min-height:82px;padding:10px;display:grid;grid-template-columns:38px 1fr 16px;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.18);border-radius:12px;color:#fff;background:rgba(255,255,255,.08);font:inherit;text-align:left;cursor:pointer;transition:background .2s ease,border-color .2s ease}.featureTab:hover,.featureTab.active{border-color:rgba(255,255,255,.48);background:rgba(255,255,255,.15)}.tabIcon,.detailIcon{display:grid;place-items:center;background:#fff;color:#1266e9}.tabIcon{width:38px;height:38px;border-radius:10px}.tabIcon :global(svg){width:21px;height:21px}.featureTab strong{font-size:10px;line-height:1.3}.toggle{font-size:17px;font-weight:500;text-align:center}.featureDetails{min-height:108px;margin-top:9px;padding:17px;display:flex;align-items:center;gap:14px;border:1px solid rgba(255,255,255,.3);border-radius:13px;background:rgba(255,255,255,.14)}.detailIcon{width:48px;height:48px;flex:0 0 auto;border-radius:12px}.detailIcon :global(svg){width:26px;height:26px}.featureDetails strong{display:block;color:#fff;font-size:14px}.featureDetails p{margin:7px 0 0;color:rgba(255,255,255,.84);font-size:12px;line-height:1.55}.rolesIntro{margin-top:18px}.rolesIntro>span{color:rgba(255,255,255,.58);font-size:7px;font-weight:900;letter-spacing:1px}.rolesIntro h2{margin:6px 0 0;color:#fff;font-size:20px;line-height:1.25}.rolesIntro p{margin:7px 0 0;color:rgba(255,255,255,.78);font-size:11px;line-height:1.55}.roles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:9px}.roles article{min-height:154px;padding:15px;border:1px solid rgba(255,255,255,.17);border-radius:12px;background:rgba(255,255,255,.07)}.roles span{display:block;color:rgba(255,255,255,.58);font-size:7px;font-weight:900;letter-spacing:1px}.roles strong{display:block;margin-top:8px;color:#fff;font-size:14px}.roles p{margin:8px 0 0;color:rgba(255,255,255,.78);font-size:10px;line-height:1.55}.roles a{display:inline-block;margin-top:10px;color:#fff;font-size:10px;font-weight:900;text-decoration:none}.slogan{display:block;margin-top:14px;color:#fff;font-size:11px}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.actions a{min-height:39px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,.38);border-radius:9px;color:#fff;background:rgba(255,255,255,.07);font-size:10px;font-weight:900;text-decoration:none}.actions .primary{border-color:#fff;color:#1266e9;background:#fff}
        @media(max-width:650px){h1{font-size:32px}.lead{font-size:13px}.featureTabs{display:flex;overflow-x:auto;padding-bottom:5px;scroll-snap-type:x proximity}.featureTab{min-width:170px;scroll-snap-align:start}.featureDetails{align-items:flex-start}.roles{grid-template-columns:1fr}.roles article{min-height:auto}.actions a{flex:1}}
        @media(max-width:390px){.featureTab{min-width:155px}}
      `}</style>
    </>
  );
}

function ChatIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>}
function LocationIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>}
function LostIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>}
