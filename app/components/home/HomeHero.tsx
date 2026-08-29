"use client";

import EmergencySection from "./EmergencySection";
import ProductOrbit from "./ProductOrbit";

export default function HomeHero({ ka }: { ka: boolean }) {
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

          <div className="productStory">
            <ProductOrbit ka={ka} />
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
        .productStory{margin-top:54px;display:flex;justify-content:center}
        @media(max-width:760px){
          .homeHeroInner{width:calc(100% - 28px);padding:52px 0 65px}
          .heroTitle h1{font-size:30px;letter-spacing:-.8px}
          .heroTitle p{font-size:13px}
          .productStory{margin-top:38px}
        }
      `}</style>
    </>
  );
}
