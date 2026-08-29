"use client";

import EmergencySection from "./EmergencySection";
import ProductOrbit from "./ProductOrbit";
import { QRIcon, ShieldIcon } from "./HomeIcons";

export default function HomeHero({ ka }: { ka: boolean }) {
  return (
    <>
      <section className="homeHero">
        <div className="homeHeroInner">
          <header className="heroTitle">
            <span>QR RETURN · SMART LOST &amp; FOUND</span>
            <h1>
              {ka
                ? "დაკარგული ნივთის დაბრუნება იწყება ერთი სკანირებით."
                : "A safe return begins with one scan."}
            </h1>
            <p>
              {ka
                ? "7 პროდუქტი. ერთი მიზანი — მპოვნელისა და მფლობელის სწრაფად, მარტივად და უსაფრთხოდ დაკავშირება."
                : "7 products. One mission — connecting finder and owner quickly, simply and securely."}
            </p>
          </header>

          <div className="productStory">
            <article className="roleCard">
              <span>OWNER</span>
              <div className="roleIcon"><ShieldIcon /></div>
              <h2>{ka ? "ყველაფერი თქვენი კონტროლით" : "Everything under your control"}</h2>
              <p>
                {ka
                  ? "ერთი დაცული ანგარიშიდან მართეთ ყველა QR პროფილი და თავად განსაზღვრეთ, რას დაინახავს მპოვნელი."
                  : "Manage every QR profile from one secure account and decide exactly what the finder sees."}
              </p>
              <ul>
                <li>{ka ? "შეუზღუდავი QR პროფილები" : "Unlimited QR profiles"}</li>
                <li>{ka ? "Lost ON და Scan ისტორია" : "Lost ON and scan history"}</li>
                <li>{ka ? "კონტაქტისა და ხილვადობის მართვა" : "Contact and visibility controls"}</li>
              </ul>
              <a href="/signup">{ka ? "რეგისტრაცია" : "Register"} →</a>
            </article>

            <div className="orbitFrame">
              <ProductOrbit ka={ka} />
            </div>

            <article className="roleCard">
              <span>FINDER</span>
              <div className="roleIcon"><QRIcon size={25} /></div>
              <h2>{ka ? "დახმარება რეგისტრაციის გარეშე" : "Help without registration"}</h2>
              <p>
                {ka
                  ? "მპოვნელი ასკანირებს QR კოდს და მაშინვე იღებს დაბრუნებისთვის საჭირო, თქვენ მიერ არჩეულ გზებს."
                  : "The finder scans the QR and immediately gets the return options you selected."}
              </p>
              <ul>
                <li>{ka ? "აპლიკაცია არ სჭირდება" : "No app required"}</li>
                <li>{ka ? "ზარი ან უსაფრთხო Live Chat" : "Call or secure Live Chat"}</li>
                <li>{ka ? "ნებაყოფლობითი ლოკაცია" : "Voluntary location sharing"}</li>
              </ul>
              <strong>{ka ? "დაასკანირე. დაუკავშირდი. დააბრუნე." : "Scan. Connect. Return."}</strong>
            </article>
          </div>

          <EmergencySection ka={ka} />
        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#0754c7}.homeHeroInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:74px 0 86px}.heroTitle{max-width:920px;margin:0 auto;text-align:center}.heroTitle>span,.roleCard>span{color:rgba(255,255,255,.64);font-size:9px;font-weight:900;letter-spacing:1.5px}.heroTitle h1{margin:14px 0 0;color:#fff;font-size:clamp(38px,4.5vw,64px);line-height:1.05;letter-spacing:-2.2px}.heroTitle p{max-width:720px;margin:18px auto 0;color:rgba(255,255,255,.8);font-size:14px;line-height:1.7}.productStory{margin-top:48px;display:grid;grid-template-columns:minmax(0,1fr) minmax(440px,1.35fr) minmax(0,1fr);gap:18px;align-items:center}.roleCard{min-height:390px;padding:24px;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,.2);border-radius:18px;background:rgba(4,48,126,.3);box-shadow:0 18px 45px rgba(0,35,102,.16)}.roleIcon{width:52px;height:52px;margin-top:25px;display:grid;place-items:center;border-radius:13px;color:#0754c7;background:#fff}.roleIcon :global(svg){width:26px;height:26px}.roleCard h2{margin:23px 0 0;color:#fff;font-size:22px;line-height:1.2}.roleCard p{margin:11px 0 0;color:rgba(255,255,255,.76);font-size:12px;line-height:1.7}.roleCard ul{margin:18px 0 0;padding:0;list-style:none}.roleCard li{padding:8px 0;border-top:1px solid rgba(255,255,255,.13);color:rgba(255,255,255,.86);font-size:11px}.roleCard li:before{content:"✓";margin-right:8px;font-weight:900}.roleCard a,.roleCard>strong{margin-top:auto;padding-top:19px;color:#fff;font-size:10px;font-weight:900;text-decoration:none}.orbitFrame{min-width:0;display:flex;justify-content:center}
        @media(max-width:1100px){.productStory{grid-template-columns:1fr 1fr}.orbitFrame{grid-column:1/-1;grid-row:1}.roleCard{min-height:340px}}@media(max-width:650px){.homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}.heroTitle h1{font-size:38px;letter-spacing:-1.4px}.heroTitle p{font-size:13px}.productStory{grid-template-columns:1fr;margin-top:36px}.orbitFrame{grid-column:auto;grid-row:auto;order:-1}.roleCard{min-height:auto;padding:20px}.roleCard h2{font-size:20px}}
      `}</style>
    </>
  );
}
