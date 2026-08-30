"use client";

import { useState } from "react";
import ProductOrbit from "./ProductOrbit";

type Benefit = {
  title: string;
  description: string;
};

export default function HomeHero({ ka }: { ka: boolean }) {
  const [showAllBenefits, setShowAllBenefits] = useState(false);
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
          <div className="heroLayout">
            <div className="heroCopy">
              <span>QR RETURN · SMART LOST &amp; FOUND</span>
              <h1>{ka ? "მყისიერი კავშირი — საჭირო დროს, საჭირო ადამიანთან" : "Instant connection — at the right time, with the right person"}</h1>
              <p>{ka ? "QR პროფილის შექმნის შემდეგ ნივთი, შინაური ცხოველი ან Emergency სამაჯური უნიკალურ ციფრულ გვერდს უკავშირდება. ერთი სკანირებით მპოვნელი ხედავს მხოლოდ იმ ინფორმაციასა და დაკავშირების საშუალებებს, რომლებიც მფლობელმა წინასწარ განსაზღვრა." : "A QR profile connects an item, pet, or Emergency bracelet to a unique digital page. With one scan, the finder sees only the information and contact options selected by the owner."}</p>
            </div>

            <div className="productExperience">
              <div className="productSectionHead">
                <span>QR RETURN · COLLECTION</span>
                <h2>{ka ? "შვიდი გზა იმის დასაცავად, რაც მნიშვნელოვანია" : "Seven ways to protect what matters"}</h2>
                <p>{ka ? "აირჩიეთ შესაბამისი QR პროდუქტი ნივთისთვის, შინაური ცხოველისთვის ან Emergency საჭიროებისთვის." : "Choose the right QR product for an item, a pet, or an Emergency need."}</p>
              </div>
              <ProductOrbit ka={ka} />
            </div>
          </div>

          <div className="featuredBenefits">
            <div className="valueCard">
              <b>OWNER</b>
              <p><strong>{ka ? "ყველაფერი თქვენი კონტროლით" : "Everything under your control"}</strong> {ka ? "მართეთ ყველა პროფილი, Lost ON, ხილვადობა და მპოვნელთან კავშირი ერთი დაცული ანგარიშიდან." : "Manage every profile, Lost ON, visibility, and finder communication from one secure account."}</p>
            </div>
            <div className="valueCard">
              <b>FINDER</b>
              <p><strong>{ka ? "დახმარება რეგისტრაციის გარეშე" : "Help without registration"}</strong> {ka ? "ერთი სკანირებით მპოვნელი ხედავს მხოლოდ დაბრუნებისთვის საჭირო, თქვენ მიერ არჩეულ ინფორმაციასა და მოქმედებებს." : "With one scan, the finder sees only the information and actions you selected for a safe return."}</p>
            </div>
            <button type="button" aria-expanded={showAllBenefits} onClick={() => setShowAllBenefits((current) => !current)}>
              {ka ? "ყველა შესაძლებლობის ნახვა" : "Explore all capabilities"}
              <i aria-hidden="true">{showAllBenefits ? "−" : "+"}</i>
            </button>
          </div>

          {showAllBenefits && (
            <div className="benefitsDropdown">
              <InfoPanel eyebrow="OWNER" title={ka ? "მფლობელის შესაძლებლობები" : "Owner capabilities"} items={ownerBenefits} />
              <InfoPanel eyebrow="FINDER" title={ka ? "მპოვნელის შესაძლებლობები" : "Finder capabilities"} items={finderBenefits} />
            </div>
          )}

        </div>
      </section>

      <style jsx>{`
        .homeHero{color:#fff;background:#063B72}.homeHeroInner{width:calc(100% - 80px);max-width:1280px;margin:auto;padding:68px 0 86px}.heroLayout{display:flex;flex-direction:column}.heroCopy{max-width:930px;margin:auto;text-align:center}.heroCopy>span{color:rgba(255,255,255,.68);font-size:10px;font-weight:900;letter-spacing:1.5px}.heroCopy h1{max-width:900px;margin:18px auto 0;color:#fff;font-size:clamp(38px,4.5vw,62px);line-height:1.1;letter-spacing:-2.2px}.heroCopy>p{max-width:820px;margin:22px auto 0;color:rgba(255,255,255,.82);font-size:15px;line-height:1.75}.heroActions{margin-top:26px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap}.heroActions a{min-height:50px;padding:0 20px;display:flex;align-items:center;gap:18px;border:1px solid rgba(255,255,255,.62);border-radius:12px;color:#fff;font-size:12px;font-weight:900;text-decoration:none}.heroActions a:first-child{background:#fff;color:#063B72}.heroActions a b{font-size:18px}.heroCopy small{margin-top:15px;display:block;color:rgba(255,255,255,.66);font-size:10px;font-weight:800}.heroCopy small b{color:#fff;font-size:14px}.productExperience{width:100%;margin-top:48px}.productSectionHead{max-width:700px;margin:0 auto 22px;text-align:center}.productSectionHead span{color:rgba(255,255,255,.6);font-size:9px;font-weight:900;letter-spacing:1.4px}.productSectionHead h2{margin:9px 0 0;color:#fff;font-size:clamp(24px,3vw,36px);line-height:1.18;letter-spacing:-1px}.productSectionHead p{margin:10px auto 0;color:rgba(255,255,255,.72);font-size:13px;line-height:1.6}.featuredBenefits{margin:18px auto 0;padding:10px;display:grid;grid-template-columns:1fr 1fr auto;gap:9px;border:1px solid rgba(255,255,255,.2);border-radius:20px;background:rgba(255,255,255,.08)}.valueCard{min-height:94px;padding:16px 18px;display:grid;grid-template-columns:52px 1fr;align-items:center;gap:12px;border-radius:13px;background:#fff;box-shadow:0 12px 28px rgba(0,22,50,.13)}.featuredBenefits b{color:#6f88a1;font-size:8px;letter-spacing:1px}.valueCard p{margin:0;color:#294f73;font-size:12px;line-height:1.55}.valueCard strong{display:block;margin-bottom:3px;color:#063B72;font-size:15px}.featuredBenefits button{min-width:198px;min-height:54px;padding:0 17px;display:flex;align-items:center;justify-content:center;gap:11px;border:1px solid rgba(255,255,255,.55);border-radius:13px;background:transparent;color:#fff;font-family:inherit;font-size:12px;font-weight:900;cursor:pointer}.featuredBenefits button i{width:22px;height:22px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.45);border-radius:50%;font-style:normal;font-size:15px}.benefitsDropdown{margin:14px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:16px;animation:reveal .22s ease-out}@keyframes reveal{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
        .homeHero{background:#0A4C8A}
        .productExperience{margin-top:58px}.productSectionHead{margin-bottom:25px}.featuredBenefits{margin-top:22px;grid-template-columns:1fr 1fr}.valueCard{min-height:104px;padding:18px 20px;grid-template-columns:58px 1fr;gap:14px}.featuredBenefits b{font-size:9px}.valueCard p{font-size:13px}.valueCard strong{font-size:17px}.featuredBenefits button{grid-column:1/-1;min-height:56px}
        @media(max-width:1000px){.featuredBenefits{grid-template-columns:1fr 1fr}.featuredBenefits button{grid-column:1/-1}.benefitsDropdown{grid-template-columns:1fr 1fr}}
        @media(max-width:760px){.homeHeroInner{width:calc(100% - 28px);padding:44px 0 65px}.heroCopy h1{margin-top:14px;font-size:35px;line-height:1.14;letter-spacing:-1.3px}.heroCopy>p{margin-top:18px;font-size:14px;line-height:1.68}.productExperience{margin-top:42px}.featuredBenefits{grid-template-columns:1fr}.featuredBenefits button{grid-column:auto}.valueCard{padding:17px 15px;grid-template-columns:50px 1fr}.valueCard p{font-size:12px}.valueCard strong{font-size:16px}.benefitsDropdown{grid-template-columns:1fr}}
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
