"use client";

import { useState } from "react";

type Lang = "ka" | "en";
type Menu = "about" | "shop" | "faq";

type Props = {
  language?: Lang;
  menu: Menu;
};

export default function HomeMegaMenu({
  language = "ka",
  menu,
}: Props) {
  const ka = language === "ka";

  if (menu === "about") {
    return (
      <section className="megaMenu">
        <div className="megaInner aboutGrid">

          {/* 01 — FOUNDER */}
          <article className="founder" id="founder">
            <div className="label">
              <span>01</span>
              {ka ? "დამფუძნებლის სიტყვა" : "FOUNDER'S MESSAGE"}
            </div>

            <h2>
              {ka
                ? "იდეა, რომელიც ერთი მარტივი შეკითხვიდან დაიწყო."
                : "An idea that began with one simple question."}
            </h2>

            {ka ? (
              <div className="text">
                <p className="lead">
                  QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან გაჩნდა:
                  რა ხდება მაშინ, როდესაც ადამიანი კარგავს მისთვის
                  მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან როდესაც
                  ოჯახის წევრს გადაუდებელ სიტუაციაში დახმარება სჭირდება
                  და მის შესახებ აუცილებელი ინფორმაცია ხელმისაწვდომი
                  არ არის?
                </p>

                <p>
                  ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ არ
                  იცის, ვის დაუკავშირდეს. დაკარგულ ცხოველს არ შეუძლია
                  პატრონის ვინაობის თქმა, ნივთზე კი, როგორც წესი,
                  არ არსებობს ინფორმაცია, რომელიც მის დაბრუნებას
                  გაამარტივებს.
                </p>

                <p>
                  Emergency სამაჯურის შემთხვევაში შეიძლება თითოეულ
                  წუთსაც დიდი მნიშვნელობა ჰქონდეს — განსაკუთრებით მაშინ,
                  როდესაც ადამიანი ვერ ახერხებს საკუთარი სახელის,
                  ჯანმრთელობის მდგომარეობის ან ოჯახის წევრის
                  საკონტაქტო ინფორმაციის თქმას.
                </p>

                <p>
                  სწორედ ამ პრობლემებზე ფიქრისას გაჩნდა QR RETURN-ის
                  შექმნის იდეა — შეგვექმნა ერთი მარტივი და უსაფრთხო
                  სისტემა, რომელიც საჭირო მომენტში ადამიანებს
                  ერთმანეთთან სწრაფად დააკავშირებდა.
                </p>

                <div className="highlight">
                  QR RETURN აერთიანებს დაკარგული ნივთების დაბრუნებას,
                  საყვარელი ცხოველების დაცვას და ადამიანებისთვის
                  განკუთვნილ Emergency პროფილებს.
                </div>

                <p>
                  QR კოდის დასკანერებით მპოვნელს ან დამხმარე ადამიანს
                  შეუძლია სწრაფად ნახოს მხოლოდ ის ინფორმაცია, რომლის
                  გაზიარებაც მომხმარებელს წინასწარ აქვს არჩეული, და
                  დაუკავშირდეს მფლობელს, ოჯახის წევრს ან საგანგებო
                  საკონტაქტო პირს.
                </p>

                <p>
                  ამ პროდუქტის მნიშვნელობა მხოლოდ QR კოდში არ არის.
                  მისი მთავარი ღირებულება არის სწრაფად აღმოჩენილი
                  კავშირი მაშინ, როდესაც დრო, უსაფრთხოება და სწორი
                  ინფორმაცია ყველაზე მეტად გვჭირდება.
                </p>

                <p>
                  ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი
                  თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აჩვენებს,
                  ვის აჩვენებს და რა გზით შეიძლება მასთან დაკავშირება.
                  ამიტომ QR RETURN-ის საფუძველია არა მხოლოდ სიმარტივე,
                  არამედ უსაფრთხოება, კონფიდენციალურობა და ნდობა.
                </p>

                <p>
                  QR RETURN ჩემთვის უბრალოდ პროდუქტი ან ტექნოლოგიური
                  პლატფორმა არ არის. ეს არის იდეა, რომელსაც რეალურ
                  ცხოვრებაში ადამიანებისთვის სიმშვიდის, დაცულობისა და
                  დახმარების მოტანა შეუძლია.
                </p>

                <p>
                  ჩემი მიზანია, QR RETURN გახდეს პატარა, მაგრამ
                  მნიშვნელოვანი დამცავი რგოლი ადამიანებს, მათ საყვარელ
                  ცხოველებსა და მათთვის ძვირფას ნივთებს შორის — რადგან
                  ზოგჯერ დასაბრუნებლად მხოლოდ ერთი სწორი კავშირია საჭირო.
                </p>

                <p className="thanks">
                  მადლობა, რომ ენდობით QR RETURN-ს.
                </p>

                <div className="signature">
                  <strong>ნინო კუპრავა</strong>
                  <span>Founder &amp; CEO</span>
                  <small>QR RETURN</small>
                </div>
              </div>
            ) : (
              <div className="text">
                <p className="lead">
                  QR RETURN began with one simple question: what happens
                  when someone loses something important, a beloved pet,
                  or when essential information is unavailable during
                  an emergency?
                </p>

                <p>
                  We created QR RETURN as a simple and secure way to
                  establish the right connection when it matters most.
                </p>

                <div className="signature">
                  <strong>Nino Kuprava</strong>
                  <span>Founder &amp; CEO</span>
                  <small>QR RETURN</small>
                </div>
              </div>
            )}
          </article>

          <div className="side">

            {/* 02 — MISSION */}
            <article className="card" id="mission">
              <div className="label">
                <span>02</span>
                {ka ? "ჩვენი მისია" : "OUR MISSION"}
              </div>

              <h3>
                {ka
                  ? "ერთი QR სკანირება. ერთი სწორი კავშირი."
                  : "One QR scan. The right connection."}
              </h3>

              <p>
                {ka
                  ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო და მარტივი კავშირის შექმნა. მომხმარებელი თავად აკონტროლებს, რა ინფორმაცია გამოჩნდება და რა გზით შეიძლება მასთან დაკავშირება."
                  : "Our mission is to create a simple and secure connection between the finder and the owner through a single QR scan."}
              </p>
            </article>

            {/* 03 — VISION */}
            <article className="card" id="vision">
              <div className="label">
                <span>03</span>
                {ka ? "ჩვენი ხედვა" : "OUR VISION"}
              </div>

              <h3>
                {ka
                  ? "უნივერსალური დაცვა ნივთებისთვის, ცხოველებისა და ადამიანებისთვის."
                  : "Universal protection for belongings, pets and people."}
              </h3>

              <p>
                {ka
                  ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად — მარტივი ტექნოლოგია, რომელიც საჭირო მომენტში სწორ ადამიანს სწორ ინფორმაციასთან აკავშირებს."
                  : "Our vision is for QR RETURN to become a universal system for belongings, pets and Emergency profiles."}
              </p>
            </article>
          </div>
        </div>

        <Styles />
      </section>
    );
  }

  if (menu === "shop") {
    return (
      <section className="megaMenu">
        <div className="megaInner shopGrid">

          {/* HOW TO ORDER */}
          <article id="how-to-order">
            <div className="label">
              <span>01</span>
              {ka ? "როგორ შევუკვეთო" : "HOW TO ORDER"}
            </div>

            <h2>
              {ka
                ? "QR RETURN-ის მიღება რამდენიმე მარტივ ნაბიჯში."
                : "Get QR RETURN in a few simple steps."}
            </h2>

            <div className="steps">
              <Step
                number="01"
                text={
                  ka
                    ? "აირჩიეთ თქვენთვის სასურველი QR RETURN პროდუქტი."
                    : "Choose your QR RETURN product."
                }
              />

              <Step
                number="02"
                text={
                  ka
                    ? "შექმენით ანგარიში ან შედით არსებულ ანგარიშში."
                    : "Create an account or sign in."
                }
              />

              <Step
                number="03"
                text={
                  ka
                    ? "შეასრულეთ ონლაინ შეკვეთა და გადახდა."
                    : "Complete your online order and payment."
                }
              />

              <Step
                number="04"
                text={
                  ka
                    ? "პროდუქტის მიღების შემდეგ დაარეგისტრირეთ QR კოდი და შექმენით შესაბამისი პროფილი."
                    : "Register your QR code and create the relevant profile."
                }
              />
            </div>
          </article>

          {/* STORE */}
          <article className="storeCard">
            <div className="label">
              <span>02</span>
              {ka ? "მაღაზია" : "STORE"}
            </div>

            <h3>
              {ka
                ? "აირჩიეთ QR RETURN პროდუქტი."
                : "Choose your QR RETURN product."}
            </h3>

            <p>
              {ka
                ? "იპოვეთ შესაბამისი QR პროდუქტი თქვენი ნივთისთვის, საყვარელი ცხოველისთვის ან Emergency პროფილისთვის."
                : "Find the right QR product for your belongings, pet or Emergency profile."}
            </p>

            <a href="/store" className="storeButton">
              {ka ? "პროდუქტების ნახვა" : "View Products"}
              <span>→</span>
            </a>
          </article>
        </div>

        <Styles />
      </section>
    );
  }

  return (
    <section className="megaMenu">
      <div className="megaInner faqGrid">
        <div>
          <div className="label">
            <span>FAQ</span>
          </div>

          <h2>
            {ka
              ? "ხშირად დასმული კითხვები"
              : "Frequently Asked Questions"}
          </h2>

          <p className="faqIntro">
            {ka
              ? "პასუხები QR RETURN-ის გამოყენების, პროფილების, კონფიდენციალურობისა და QR პროდუქტების შესახებ."
              : "Answers about QR RETURN, profiles, privacy and QR products."}
          </p>
        </div>

        <div className="faqList">
          <FAQ
            question={ka ? "რა არის QR RETURN?" : "What is QR RETURN?"}
            answer={
              ka
                ? "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველებისა და Emergency პროფილებისთვის, რომელიც საჭირო მომენტში მპოვნელს, მფლობელს ან საგანგებო საკონტაქტო პირს ერთმანეთთან აკავშირებს."
                : "QR RETURN is a QR-based system for belongings, pets and Emergency profiles."
            }
          />

          <FAQ
            question={
              ka
                ? "სჭირდება თუ არა მპოვნელს რეგისტრაცია?"
                : "Does the finder need an account?"
            }
            answer={
              ka
                ? "არა. მპოვნელს რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა არ სჭირდება. საკმარისია QR კოდის დასკანერება."
                : "No. The finder only needs to scan the QR code."
            }
          />

          <FAQ
            question={
              ka
                ? "რა ინფორმაციას დაინახავს მპოვნელი?"
                : "What information will the finder see?"
            }
            answer={
              ka
                ? "მპოვნელი ხედავს მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც პროფილის მფლობელმა თავად აირჩია."
                : "The finder sees only the information the profile owner has chosen to share."
            }
          />

          <FAQ
            question={
              ka
                ? "შემიძლია ერთ ანგარიშზე რამდენიმე QR პროფილი მქონდეს?"
                : "Can I have multiple QR profiles?"
            }
            answer={
              ka
                ? "დიახ. ერთი ანგარიშიდან შეგიძლიათ მართოთ რამდენიმე QR პროფილი სხვადასხვა ნივთისთვის, ცხოველისთვის ან სხვა შესაბამისი პროდუქტისთვის."
                : "Yes. You can manage multiple QR profiles from one account."
            }
          />

          <FAQ
            question={
              ka
                ? "შემიძლია პროფილის ინფორმაცია მოგვიანებით შევცვალო?"
                : "Can I update the profile later?"
            }
            answer={
              ka
                ? "დიახ. ინფორმაციის განახლება შეგიძლიათ თქვენი ანგარიშიდან და ამისთვის ფიზიკური QR კოდის შეცვლა არ არის საჭირო."
                : "Yes. You can update the profile without replacing the physical QR code."
            }
          />

          <FAQ
            question={
              ka
                ? "რა არის Emergency პროფილი?"
                : "What is an Emergency profile?"
            }
            answer={
              ka
                ? "Emergency პროფილი შექმნილია იმისთვის, რომ საჭირო სიტუაციაში ხელმისაწვდომი იყოს მომხმარებლის მიერ წინასწარ არჩეული მნიშვნელოვანი ინფორმაცია და საგანგებო საკონტაქტო პირები."
                : "An Emergency profile provides selected important information and emergency contacts when needed."
            }
          />
        </div>
      </div>

      <Styles />
    </section>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="step">
      <span>{number}</span>
      <p>{text}</p>
    </div>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faqItem">
      <button
        type="button"
        onClick={() => setOpen(!open)}
      >
        <strong>{question}</strong>
        <span>{open ? "−" : "+"}</span>
      </button>

      {open && <p>{answer}</p>}
    </div>
  );
}

function Styles() {
  return (
    <style jsx>{`
      .megaMenu {
        width: 100%;
        background: #ffffff;
        border-bottom: 1px solid #DFDFE2;
        box-shadow: 0 22px 55px rgba(23, 40, 64, 0.08);
      }

      .megaInner {
        width: calc(100% - 90px);
        max-width: 1250px;
        margin: 0 auto;
        padding: 48px 0 55px;
      }

      .aboutGrid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 65px;
      }

      .shopGrid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 50px;
      }

      .faqGrid {
        display: grid;
        grid-template-columns: 0.65fr 1.35fr;
        gap: 65px;
      }

      .label {
        display: flex;
        gap: 10px;
        color: #63636C;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.2px;
      }

      .label span {
        color: #2F3039;
      }

      h2 {
        max-width: 680px;
        margin: 13px 0 0;
        color: #2F3039;
        font-size: 34px;
        line-height: 1.1;
        letter-spacing: -1.4px;
      }

      h3 {
        margin: 13px 0 0;
        color: #2F3039;
        font-size: 20px;
        line-height: 1.35;
      }

      .text {
        margin-top: 25px;
      }

      .text p,
      .card p,
      .storeCard p,
      .faqIntro {
        color: #63636C;
        font-size: 13px;
        line-height: 1.75;
      }

      .text p {
        margin: 0 0 16px;
      }

      .text .lead {
        color: #45464F;
        font-size: 14px;
      }

      .highlight {
        margin: 24px 0;
        padding: 21px 23px;
        border-radius: 14px;
        color: #2F3039;
        background: linear-gradient(135deg, #F3F3F5, #F8F8F8);
        font-size: 15px;
        font-weight: 750;
        line-height: 1.6;
      }

      .thanks {
        color: #2F3039 !important;
        font-weight: 750;
      }

      .signature {
        margin-top: 27px;
        padding-top: 20px;
        border-top: 1px solid #DFDFE2;
      }

      .signature strong,
      .signature span,
      .signature small {
        display: block;
      }

      .signature strong {
        color: #2F3039;
        font-size: 14px;
      }

      .signature span {
        margin-top: 3px;
        color: #63636C;
        font-size: 11px;
      }

      .signature small {
        margin-top: 3px;
        color: #2F3039;
        font-size: 9px;
        font-weight: 900;
      }

      .side {
        display: grid;
        gap: 14px;
        align-content: start;
      }

      .card,
      .storeCard {
        padding: 28px;
        border: 1px solid #DFDFE2;
        border-radius: 18px;
        background: #F8F8F8;
      }

      .steps {
        margin-top: 28px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 11px;
      }

      .step {
        padding: 19px;
        display: grid;
        grid-template-columns: 32px 1fr;
        gap: 9px;
        border: 1px solid #DFDFE2;
        border-radius: 13px;
        background: #F8F8F8;
      }

      .step span {
        color: #2F3039;
        font-size: 10px;
        font-weight: 900;
      }

      .step p {
        margin: 0;
        color: #63636C;
        font-size: 12px;
        line-height: 1.6;
      }

      .storeButton {
        min-height: 45px;
        margin-top: 24px;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 9px;
        color: #ffffff;
        background: #2F3039;
        text-decoration: none;
        font-size: 12px;
        font-weight: 850;
      }

      .faqList {
        border-top: 1px solid #DFDFE2;
      }

      .faqItem {
        border-bottom: 1px solid #DFDFE2;
      }

      .faqItem button {
        width: 100%;
        min-height: 65px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 0;
        color: #2F3039;
        background: transparent;
        cursor: pointer;
        text-align: left;
      }

      .faqItem button strong {
        font-size: 14px;
      }

      .faqItem button span {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        flex: 0 0 31px;
        border-radius: 50%;
        color: #2F3039;
        background: #F3F3F5;
        font-size: 18px;
      }

      .faqItem > p {
        margin: -3px 45px 20px 0;
        color: #63636C;
        font-size: 13px;
        line-height: 1.7;
      }

      @media (max-width: 900px) {
        .aboutGrid,
        .shopGrid,
        .faqGrid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 650px) {
        .megaInner {
          width: calc(100% - 28px);
          padding: 35px 0;
        }

        h2 {
          font-size: 28px;
        }

        .steps {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
