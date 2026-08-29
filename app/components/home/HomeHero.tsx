"use client";

import { useState } from "react";
import ProductOrbit from "./ProductOrbit";

type Benefit = {
  title: string;
  description: string;
};

export default function HomeHero({ ka }: { ka: boolean }) {
  const ownerBenefits: Benefit[] = ka
    ? [
        { title: "ყველა პროფილი ერთ ანგარიშზე", description: "ძაღლის, კატის, გასაღების, საფულის, ჩანთის, ჩემოდნისა და Emergency სამაჯურის QR პროფილები ერთი დაცული ანგარიშიდან მართეთ." },
        { title: "კატეგორიაზე მორგებული პროფილი", description: "ცხოველისთვის დაამატეთ სამედიცინო და ქცევითი ინფორმაცია, ნივთისთვის კი — მისი ამოცნობისთვის საჭირო შესაბამისი დეტალები." },
        { title: "ინფორმაციის სრული კონტროლი", description: "თავად განსაზღვრეთ, რომელი ფოტო, აღწერა, ელფოსტა და დამატებითი ინფორმაცია გამოჩნდება მპოვნელის გვერდზე." },
        { title: "Lost ON და Scan ინფორმაცია", description: "დაკარგვისას ჩართეთ Lost ON და ნახეთ QR კოდის დასკანირების ინფორმაცია და მპოვნელის მიერ ნებაყოფლობით გაზიარებული მდებარეობა." },
        { title: "ტელეფონი და Live Chat", description: "მიეცით მპოვნელს თქვენთან ტელეფონით ან Live Chat-ის საშუალებით დაკავშირების შესაძლებლობა." },
        { title: "Emergency პროფილის მართვა", description: "შექმენით Emergency პროფილი საკუთარი ან სხვა პირისთვის და მართეთ მნიშვნელოვანი სამედიცინო ინფორმაცია და Emergency კონტაქტები." },
      ]
    : [
        { title: "Every profile in one account", description: "Manage QR profiles for dogs, cats, keys, wallets, bags, suitcases, and Emergency bracelets from one secure account." },
        { title: "Category-specific profiles", description: "Add medical and behavior information for pets, or the relevant identification details for personal belongings." },
        { title: "Full information control", description: "Choose which photo, description, email, and additional details appear on the finder page." },
        { title: "Lost ON and scan information", description: "Turn on Lost ON and view scan information, including a location voluntarily shared by the finder." },
        { title: "Phone and Live Chat", description: "Let the finder contact you by phone or through Live Chat." },
        { title: "Emergency profile management", description: "Create an Emergency profile for yourself or another person and manage medical details and Emergency contacts." },
      ];

  const finderBenefits: Benefit[] = ka
    ? [
        { title: "ერთი სკანირება", description: "QR კოდის სკანირების შემდეგ მპოვნელი პირდაპირ შესაბამის ციფრულ პროფილზე გადადის." },
        { title: "რეგისტრაციის გარეშე", description: "QR პროფილის სანახავად მპოვნელს ანგარიშის შექმნა არ სჭირდება." },
        { title: "აპლიკაციის გარეშე", description: "პროფილი ტელეფონის კამერით იხსნება და დამატებითი აპლიკაციის ჩამოტვირთვა საჭირო არ არის." },
        { title: "სწრაფი დაკავშირება", description: "მფლობელთან დაკავშირება შესაძლებელია ტელეფონით ან Live Chat-ის საშუალებით." },
        { title: "ნებაყოფლობითი ლოკაცია", description: "მპოვნელი თავად წყვეტს, გააზიაროს თუ არა თავისი ზუსტი მდებარეობა." },
        { title: "Emergency ინფორმაციაზე წვდომა", description: "სამაჯურის სკანირებისას ჩანს პროფილის მმართველის მიერ არჩეული სამედიცინო ინფორმაცია და Emergency კონტაქტები." },
      ]
    : [
        { title: "One scan", description: "After scanning the QR code, the finder goes directly to the corresponding digital profile." },
        { title: "No registration", description: "The finder does not need to create an account to view a QR profile." },
        { title: "No app required", description: "The profile opens with the phone camera, with no additional app to download." },
        { title: "Fast contact", description: "The finder can contact the owner by phone or through Live Chat." },
        { title: "Voluntary location sharing", description: "The finder decides whether to share their precise location." },
        { title: "Emergency information access", description: "Scanning the bracelet shows the medical information and Emergency contacts selected by the profile manager." },
      ];

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
            <InfoPanel eyebrow="OWNER" title={ka ? "მფლობელის უპირატესობები" : "Owner benefits"} items={ownerBenefits} />
            <div className="orbitFrame"><ProductOrbit ka={ka} /></div>
            <InfoPanel eyebrow="FINDER" title={ka ? "მპოვნელის უპირატესობები" : "Finder benefits"} items={finderBenefits} />
          </div>
        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#063B72}.homeHeroInner{width:calc(100% - 80px);max-width:1340px;margin:auto;padding:74px 0 86px}.heroTitle{max-width:1040px;margin:0 auto;text-align:center}.heroTitle>span{color:rgba(255,255,255,.72);font-size:11px;font-weight:900;letter-spacing:1.5px}.heroTitle h1{margin:14px 0 0;color:#fff;font-size:clamp(29px,2.8vw,40px);line-height:1.22;letter-spacing:-1px}.heroTitle p{max-width:820px;margin:18px auto 0;color:rgba(255,255,255,.78);font-size:18px;line-height:1.65}.productExperience{margin-top:48px;display:grid;grid-template-columns:300px minmax(430px,1fr) 300px;gap:18px;align-items:center}.productExperience>:global(.infoPanel):first-child{transform:translate(-16px,-24px)}.productExperience>:global(.infoPanel):last-child{transform:translate(16px,-24px)}.orbitFrame{min-width:0;display:flex;justify-content:center}
        @media(max-width:1100px){.productExperience{grid-template-columns:1fr 1fr;gap:24px}.productExperience>:global(.infoPanel):first-child,.productExperience>:global(.infoPanel):last-child{transform:none}.orbitFrame{grid-column:1/-1;grid-row:1}}
        @media(max-width:760px){.homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}.heroTitle h1{font-size:27px;letter-spacing:-.5px}.heroTitle p{font-size:16px}.productExperience{grid-template-columns:1fr;margin-top:38px}.orbitFrame{grid-column:auto;grid-row:auto;order:-1}}
      `}</style>
    </>
  );
}

function InfoPanel({ eyebrow, title, items }: { eyebrow: string; title: string; items: Benefit[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <aside className="infoPanel">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <div className="accordion">
        {items.map((item, index) => {
          const open = openIndex === index;
          const urgent = /Lost|Emergency/i.test(item.title);
          return (
            <section className={["benefit", open ? "open" : "", urgent ? "urgent" : ""].filter(Boolean).join(" ")} key={item.title}>
              <button type="button" aria-expanded={open} onClick={() => setOpenIndex(open ? null : index)}>
                <b>{String(index + 1).padStart(2, "0")}</b>
                <strong>{item.title}</strong>
                <i aria-hidden="true">{open ? "−" : "+"}</i>
              </button>
              {open && <p>{item.description}</p>}
            </section>
          );
        })}
      </div>
      <style jsx>{`
        .infoPanel{padding:23px 20px;border:1px solid rgba(255,255,255,.34);border-radius:20px;background:#fff;box-shadow:0 20px 48px rgba(0,22,50,.24)}.infoPanel>span{color:#0758B7;font-size:9px;font-weight:900;letter-spacing:1.3px}.infoPanel h2{margin:10px 0 0;color:#063B72;font-size:21px;line-height:1.3}.accordion{margin-top:17px}.benefit{border-top:1px solid #dce6f0}.benefit button{width:100%;min-height:49px;padding:10px 0;display:grid;grid-template-columns:23px 1fr 20px;align-items:center;gap:8px;border:0;background:transparent;color:#063B72;text-align:left;cursor:pointer}.benefit button b{color:#72869b;font-size:8px}.benefit button strong{font-size:13px;font-weight:850;line-height:1.35}.benefit button i{width:20px;height:20px;display:grid;place-items:center;border:1px solid #b9cadb;border-radius:50%;font-style:normal;font-size:14px}.benefit p{margin:-1px 0 13px;padding:0 0 0 31px;color:#526b83;font-size:12px;line-height:1.58}.benefit.open button i{border-color:#063B72;background:#063B72;color:#fff}.benefit.open button strong{color:#063B72}@media(max-width:760px){.infoPanel{padding:20px}.infoPanel h2{font-size:20px}.benefit button strong{font-size:14px}.benefit p{font-size:13px}}
      `}</style>
    </aside>
  );
}
