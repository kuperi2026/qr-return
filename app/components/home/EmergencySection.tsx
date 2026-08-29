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
      <section className="featurePanel">
        <div className="featureHeading">
          <div>
            <span>QR RETURN · FEATURES</span>
            <h2>{ka ? "ყველა საჭირო ფუნქცია ერთ სისტემაში" : "Every essential feature in one system"}</h2>
          </div>
          <p>
            {ka
              ? "აირჩიეთ ფუნქცია და ნახეთ, როგორ ამარტივებს QR RETURN დაკარგული ნივთის ან ცხოველის უსაფრთხოდ დაბრუნებას."
              : "Select a feature to see how QR RETURN makes a safe return simpler."}
          </p>
        </div>

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

        <div className="featureFooter">
          <strong>{ka ? "დაასკანირე. დაუკავშირდი. დააბრუნე." : "Scan. Connect. Return."}</strong>
          <div>
            <a className="primary" href="/store">{ka ? "მაღაზიის ნახვა" : "View store"}</a>
            <a href="#how-it-works">{ka ? "როგორ მუშაობს" : "How it works"}</a>
          </div>
        </div>
      </section>

      <style jsx>{`
        .featurePanel{margin-top:66px;padding-top:54px;border-top:1px solid rgba(255,255,255,.18)}.featureHeading{display:flex;align-items:end;justify-content:space-between;gap:35px}.featureHeading>div>span{color:rgba(255,255,255,.62);font-size:8px;font-weight:900;letter-spacing:1.4px}.featureHeading h2{max-width:690px;margin:9px 0 0;color:#fff;font-size:clamp(30px,3.4vw,46px);line-height:1.08;letter-spacing:-1.4px}.featureHeading>p{max-width:430px;margin:0;color:rgba(255,255,255,.76);font-size:12px;line-height:1.7}.featureTabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;margin-top:30px}.featureTab{min-height:112px;padding:12px 10px;display:flex;flex-direction:column;align-items:flex-start;border:1px solid rgba(255,255,255,.2);border-radius:14px;color:#fff;background:rgba(4,48,126,.26);font:inherit;text-align:left;cursor:pointer;transition:background .2s ease,border-color .2s ease,transform .2s ease}.featureTab:hover,.featureTab.active{border-color:rgba(255,255,255,.55);background:rgba(255,255,255,.14);transform:translateY(-2px)}.tabIcon,.detailIcon{display:grid;place-items:center;color:#0754c7;background:#fff}.tabIcon{width:39px;height:39px;border-radius:10px}.tabIcon :global(svg){width:21px;height:21px}.featureTab strong{margin-top:13px;font-size:10px;line-height:1.3}.toggle{margin-top:auto;align-self:flex-end;font-size:17px}.featureDetails{min-height:124px;margin-top:10px;padding:21px;display:flex;align-items:center;gap:16px;border:1px solid rgba(255,255,255,.34);border-radius:15px;background:rgba(255,255,255,.13)}.detailIcon{width:56px;height:56px;flex:0 0 auto;border-radius:14px}.detailIcon :global(svg){width:29px;height:29px}.featureDetails strong{display:block;color:#fff;font-size:16px}.featureDetails p{margin:8px 0 0;color:rgba(255,255,255,.86);font-size:13px;line-height:1.6}.featureFooter{margin-top:20px;display:flex;align-items:center;justify-content:space-between;gap:20px}.featureFooter>strong{font-size:12px}.featureFooter>div{display:flex;gap:8px}.featureFooter a{min-height:42px;padding:0 17px;display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.4);border-radius:10px;color:#fff;background:rgba(255,255,255,.07);font-size:10px;font-weight:900;text-decoration:none}.featureFooter a.primary{border-color:#fff;color:#0754c7;background:#fff}
        @media(max-width:950px){.featureTabs{grid-template-columns:repeat(3,1fr)}.featureHeading{align-items:flex-start;flex-direction:column;gap:13px}}@media(max-width:650px){.featurePanel{margin-top:48px;padding-top:42px}.featureHeading h2{font-size:32px}.featureHeading>p{font-size:12px}.featureTabs{display:flex;overflow-x:auto;padding-bottom:6px;scroll-snap-type:x proximity}.featureTab{min-width:165px;scroll-snap-align:start}.featureDetails{align-items:flex-start}.featureFooter{align-items:flex-start;flex-direction:column}.featureFooter>div{width:100%}.featureFooter a{flex:1;justify-content:center}}
      `}</style>
    </>
  );
}

function ChatIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 5h16v11H9l-5 4V5Z"/><path d="M8 9h8M8 12h5"/></svg>}
function LocationIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 21s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="9" r="2"/></svg>}
function LostIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17h.01"/></svg>}
