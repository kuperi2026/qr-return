"use client";

import { useState } from "react";

type Lang = "ka" | "en";
type Menu = "about" | "shop" | "faq" | "contact" | null;

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");
  const [openMenu, setOpenMenu] = useState<Menu>(null);

  const ka = language === "ka";

  function toggleMenu(menu: Exclude<Menu, null>) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  return (
    <main className="page">
      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="headerInner">
          <a href="/" className="brand">
            <div className="logoMark">
              <QRIcon />
            </div>

            <div className="brandText">
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <nav className="navigation">
            <button
              type="button"
              className={openMenu === "about" ? "nav active" : "nav"}
              onClick={() => toggleMenu("about")}
            >
              {ka ? "ჩვენ შესახებ" : "About"}
              <Chevron open={openMenu === "about"} />
            </button>

            <button
              type="button"
              className={openMenu === "shop" ? "nav active" : "nav"}
              onClick={() => toggleMenu("shop")}
            >
              {ka ? "ონლაინ შეძენა" : "Shop Online"}
              <Chevron open={openMenu === "shop"} />
            </button>

            <button
              type="button"
              className={openMenu === "faq" ? "nav active" : "nav"}
              onClick={() => toggleMenu("faq")}
            >
              {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
            </button>

            <button
              type="button"
              className={openMenu === "contact" ? "nav active" : "nav"}
              onClick={() => toggleMenu("contact")}
            >
              {ka ? "კონტაქტი" : "Contact"}
            </button>
          </nav>

          <div className="actions">
            {/*
              ADMIN აქ განზრახ არ არის.
              ჩვეულებრივ მომხმარებელს საერთოდ არ ვაჩვენებთ.
              მოგვიანებით შენს Admin ავტორიზაციას მივაბამთ.
            */}

            <a href="/login" className="blueButton">
              {ka ? "შესვლა" : "Sign In"}
            </a>

            <a href="/signup" className="blueButton">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

            <div className="languages">
              <button
                type="button"
                className={language === "ka" ? "selected" : ""}
                onClick={() => setLanguage("ka")}
              >
                GEO
              </button>

              <span />

              <button
                type="button"
                className={language === "en" ? "selected" : ""}
                onClick={() => setLanguage("en")}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ================= DROPDOWN ================= */}

      {openMenu && (
        <section className="megaMenu">
          <div className="megaInner">

            {/* ============ ABOUT ============ */}

            {openMenu === "about" && (
              <div className="aboutLayout">
                <aside className="sideTitle">
                  <span className="sectionNumber">01</span>

                  <span className="eyebrow">
                    {ka ? "QR RETURN-ის შესახებ" : "ABOUT QR RETURN"}
                  </span>

                  <h2>
                    {ka
                      ? "ერთი სწორი კავშირი საჭირო მომენტში."
                      : "The right connection when it matters."}
                  </h2>
                </aside>

                <div className="aboutContent">
                  <section className="contentBlock">
                    <div className="contentHeading">
                      <span>01</span>
                      <h3>
                        {ka
                          ? "დამფუძნებლის სიტყვა"
                          : "Founder’s Message"}
                      </h3>
                    </div>

                    {ka ? (
                      <>
                        <p className="lead">
                          QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან
                          გაჩნდა: რა ხდება მაშინ, როდესაც ადამიანი კარგავს
                          მისთვის მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან
                          როდესაც ოჯახის წევრს გადაუდებელ სიტუაციაში
                          დახმარება სჭირდება და მის შესახებ აუცილებელი
                          ინფორმაცია ხელმისაწვდომი არ არის?
                        </p>

                        <p>
                          ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ
                          არ იცის, ვის დაუკავშირდეს. დაკარგულ ცხოველს არ
                          შეუძლია პატრონის ვინაობის თქმა, ნივთზე კი, როგორც
                          წესი, არ არსებობს ინფორმაცია, რომელიც მის
                          დაბრუნებას გაამარტივებს.
                        </p>

                        <p>
                          Emergency სამაჯურის შემთხვევაში თითოეულ წუთსაც
                          შეიძლება დიდი მნიშვნელობა ჰქონდეს — განსაკუთრებით
                          მაშინ, როდესაც ადამიანი ვერ ახერხებს საკუთარი
                          სახელის, ჯანმრთელობის მდგომარეობის ან ოჯახის
                          წევრის საკონტაქტო ინფორმაციის თქმას.
                        </p>

                        <div className="founderStatement">
                          <small>QR RETURN</small>
                          <strong>
                            მარტივი და უსაფრთხო სისტემა, რომელიც საჭირო
                            მომენტში ადამიანებს სწრაფად აკავშირებს.
                          </strong>
                        </div>

                        <p>
                          QR RETURN აერთიანებს დაკარგული ნივთების
                          დაბრუნებას, საყვარელი ცხოველების დაცვას და
                          ადამიანებისთვის განკუთვნილ Emergency პროფილებს.
                          QR კოდის დასკანერებით დამხმარე ადამიანს შეუძლია
                          ნახოს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც
                          მომხმარებელს წინასწარ აქვს არჩეული.
                        </p>

                        <p>
                          ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ
                          მომხმარებელი თავად აკონტროლებდეს საკუთარ
                          ინფორმაციას — რას აჩვენებს, ვის აჩვენებს და რა
                          გზით შეიძლება მასთან დაკავშირება. ამიტომ QR
                          RETURN-ის საფუძველია სიმარტივე, უსაფრთხოება,
                          კონფიდენციალურობა და ნდობა.
                        </p>

                        <p>
                          QR RETURN ჩემთვის უბრალოდ პროდუქტი ან
                          ტექნოლოგიური პლატფორმა არ არის. ჩემი მიზანია, ის
                          გახდეს პატარა, მაგრამ მნიშვნელოვანი დამცავი
                          რგოლი ადამიანებს, მათ საყვარელ ცხოველებსა და
                          მათთვის ძვირფას ნივთებს შორის — რადგან ზოგჯერ
                          დასაბრუნებლად ან დასახმარებლად მხოლოდ ერთი სწორი
                          კავშირია საჭირო.
                        </p>

                        <p className="thanks">
                          მადლობა, რომ ენდობით QR RETURN-ს.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="lead">
                          QR RETURN began with one simple question: what
                          happens when someone loses something important,
                          a beloved pet, or needs urgent help when essential
                          information is not immediately available?
                        </p>

                        <p>
                          QR RETURN was created to establish a simple,
                          secure and fast connection when it matters most.
                        </p>

                        <p>
                          The platform brings together lost belongings, pet
                          protection and Emergency profiles while giving
                          users control over the information they share.
                        </p>
                      </>
                    )}

                    <div className="signature">
                      <div className="signatureMark">NK</div>

                      <div>
                        <strong>Nino Kuprava</strong>
                        <span>Founder &amp; CEO</span>
                        <small>QR RETURN</small>
                      </div>
                    </div>
                  </section>

                  <div className="twoColumns">
                    <section className="miniCard">
                      <span>02</span>

                      <h3>
                        {ka ? "ჩვენი მისია" : "Our Mission"}
                      </h3>

                      <p>
                        {ka
                          ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო და მარტივი კავშირის შექმნა."
                          : "Our mission is to create a simple and secure connection between a finder and an owner with a single QR scan."}
                      </p>
                    </section>

                    <section className="miniCard">
                      <span>03</span>

                      <h3>
                        {ka ? "ჩვენი ხედვა" : "Our Vision"}
                      </h3>

                      <p>
                        {ka
                          ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                          : "Our vision is for QR RETURN to become a universal system for belongings, pets and Emergency profiles."}
                      </p>
                    </section>
                  </div>
                </div>
              </div>
            )}

            {/* ============ SHOP ============ */}

            {openMenu === "shop" && (
              <div className="simpleLayout">
                <div className="sideTitle">
                  <span className="sectionNumber">02</span>

                  <span className="eyebrow">
                    {ka ? "ონლაინ შეძენა" : "SHOP ONLINE"}
                  </span>

                  <h2>
                    {ka
                      ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
                      : "Choose QR RETURN for what matters to you."}
                  </h2>
                </div>

                <div className="cards">
                  <a href="#how-to-order" className="menuCard">
                    <span className="cardNumber">01</span>

                    <h3>
                      {ka ? "როგორ შევუკვეთო" : "How to Order"}
                    </h3>

                    <p>
                      {ka
                        ? "აირჩიეთ თქვენთვის საჭირო QR პროდუქტი, შეიძინეთ ონლაინ და მიღების შემდეგ დაარეგისტრირეთ თქვენს ანგარიშზე."
                        : "Choose your QR product, purchase it online and register it to your account after delivery."}
                    </p>

                    <strong className="cardLink">
                      {ka ? "გაიგეთ მეტი" : "Learn more"} →
                    </strong>
                  </a>

                  <a href="/store" className="menuCard featured">
                    <span className="cardNumber">02</span>

                    <h3>{ka ? "მაღაზია" : "Store"}</h3>

                    <p>
                      {ka
                        ? "იხილეთ QR RETURN-ის პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                        : "Explore QR RETURN products for belongings, pets and Emergency use."}
                    </p>

                    <strong className="cardLink">
                      {ka ? "პროდუქტების ნახვა" : "View products"} →
                    </strong>
                  </a>
                </div>
              </div>
            )}

            {/* ============ FAQ ============ */}

            {openMenu === "faq" && (
              <div className="simpleLayout">
                <div className="sideTitle">
                  <span className="sectionNumber">03</span>

                  <span className="eyebrow">
                    {ka ? "დახმარება" : "HELP CENTER"}
                  </span>

                  <h2>
                    {ka
                      ? "ხშირად დასმული კითხვები"
                      : "Frequently Asked Questions"}
                  </h2>

                  <p className="sideDescription">
                    {ka
                      ? "მოკლე პასუხები QR RETURN-ის გამოყენების, კონფიდენციალურობისა და პროდუქტების შესახებ."
                      : "Quick answers about using QR RETURN, privacy and products."}
                  </p>
                </div>

                <div className="faqList">
                  <FAQ
                    question={
                      ka
                        ? "როგორ მუშაობს QR RETURN?"
                        : "How does QR RETURN work?"
                    }
                    answer={
                      ka
                        ? "QR კოდის დასკანერების შემდეგ მპოვნელი ხედავს თქვენ მიერ წინასწარ არჩეულ ინფორმაციას და ხელმისაწვდომ დაკავშირების მეთოდებს."
                        : "After scanning the QR code, the finder sees only the information and contact methods you have chosen to make available."
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
                        ? "არა. QR კოდის დასკანერებისთვის და მფლობელთან დასაკავშირებლად მპოვნელს რეგისტრაცია არ სჭირდება."
                        : "No. The finder does not need to register to scan the QR code and contact the owner."
                    }
                  />

                  <FAQ
                    question={
                      ka
                        ? "ვინ აკონტროლებს ჩემს ინფორმაციას?"
                        : "Who controls my information?"
                    }
                    answer={
                      ka
                        ? "თქვენ თავად ირჩევთ, რომელი ინფორმაცია იყოს ხილული QR პროფილში და რა გზით შეძლოს მპოვნელმა თქვენთან დაკავშირება."
                        : "You control which information is visible on the QR profile and how a finder may contact you."
                    }
                  />

                  <FAQ
                    question={
                      ka
                        ? "შემიძლია რამდენიმე QR პროფილის დამატება?"
                        : "Can I add multiple QR profiles?"
                    }
                    answer={
                      ka
                        ? "დიახ. ერთ ანგარიშში შეგიძლიათ მართოთ რამდენიმე QR პროფილი თქვენი ნივთებისა და ცხოველებისთვის."
                        : "Yes. You can manage multiple QR profiles for your belongings and pets from one account."
                    }
                  />

                  <FAQ
                    question={
                      ka
                        ? "რისთვის გამოიყენება Emergency პროფილი?"
                        : "What is an Emergency profile for?"
                    }
                    answer={
                      ka
                        ? "Emergency პროფილი შექმნილია იმისთვის, რომ საჭიროების შემთხვევაში დამხმარე ადამიანს სწრაფად მიაწოდოს მომხმარებლის მიერ არჩეული მნიშვნელოვანი ინფორმაცია და საკონტაქტო პირები."
                        : "An Emergency profile helps provide selected essential information and emergency contacts when assistance is needed."
                    }
                  />

                  <FAQ
                    question={
                      ka
                        ? "რა მოხდება, თუ QR კოდი დაასკანერეს?"
                        : "What happens when my QR code is scanned?"
                    }
                    answer={
                      ka
                        ? "მპოვნელი გადადის QR RETURN-ის პროფილზე, სადაც ხედავს მხოლოდ თქვენ მიერ გასაჯაროებულ ინფორმაციას და დაკავშირების ხელმისაწვდომ გზებს."
                        : "The finder is taken to the QR RETURN profile and sees only the information and contact options you have made available."
                    }
                  />
                </div>
              </div>
            )}

            {/* ============ CONTACT ============ */}

            {openMenu === "contact" && (
              <div className="simpleLayout">
                <div className="sideTitle">
                  <span className="sectionNumber">04</span>

                  <span className="eyebrow">QR RETURN SUPPORT</span>

                  <h2>
                    {ka ? "დაგვიკავშირდით" : "Contact Us"}
                  </h2>

                  <p className="sideDescription">
                    {ka
                      ? "თუ გაქვთ შეკითხვა ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ, დაგვიკავშირდით."
                      : "Contact us with questions about your account, QR profile, order or product."}
                  </p>
                </div>

                <div className="contactCards">
                  <a href="/support" className="contactCard">
                    <div className="contactIcon">
                      <ChatIcon />
                    </div>

                    <div className="contactText">
                      <small>LIVE CHAT</small>

                      <h3>
                        {ka ? "მოგვწერეთ პირდაპირ" : "Chat with us"}
                      </h3>

                      <p>
                        {ka
                          ? "გახსენით QR RETURN-ის მხარდაჭერის Live Chat."
                          : "Open QR RETURN support Live Chat."}
                      </p>
                    </div>

                    <span className="arrow">→</span>
                  </a>

                  <div className="contactCard">
                    <div className="contactIcon">
                      <PhoneIcon />
                    </div>

                    <div className="contactText">
                      <small>{ka ? "ტელეფონი" : "PHONE"}</small>

                      <h3>
                        {ka
                          ? "QR RETURN მხარდაჭერა"
                          : "QR RETURN Support"}
                      </h3>

                      <p>
                        {ka
                          ? "საკონტაქტო ტელეფონის ნომერი დაემატება აქ."
                          : "The support phone number will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* დროებით ცარიელია — ახლა მხოლოდ Header/Mega Menu-ს ვტესტავთ */}

      <section className="previewArea">
        <span>QR RETURN</span>

        <h1>
          {ka
            ? "მთავარი გვერდის შემდეგ ნაწილებს აქ დავამატებთ."
            : "The next sections of the homepage will be added here."}
        </h1>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          margin: 0;
          background: #ffffff;
          color: #17283d;
        }

        /* HEADER */

        .header {
          width: 100%;
          position: relative;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #e7ebf0;
        }

        .headerInner {
          width: calc(100% - 72px);
          max-width: 1400px;
          min-height: 78px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 210px 1fr auto;
          align-items: center;
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .logoMark {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 10px;
          color: #ffffff;
          background: #17283d;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #17283d;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: -0.35px;
        }

        .brandText span {
          margin-top: 3px;
          color: #929ca8;
          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1.35px;
        }

        .navigation {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 27px;
          transform: translateX(-18px);
        }

        .nav {
          padding: 28px 0;

          display: inline-flex;
          align-items: center;
          gap: 5px;

          border: 0;
          background: transparent;

          color: #1266e9;

          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;

          white-space: nowrap;

          transition: color 0.18s ease;
        }

        .nav:hover,
        .nav.active {
          color: #084eaf;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .blueButton {
          min-height: 39px;
          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border: 1px solid #1266e9;
          border-radius: 9px;

          color: #ffffff;
          background: #1266e9;

          text-decoration: none;
          white-space: nowrap;

          font-size: 11px;
          font-weight: 800;

          transition: background 0.18s ease;
        }

        .blueButton:hover {
          background: #0d57c8;
        }

        .languages {
          margin-left: 7px;

          display: flex;
          align-items: center;
          gap: 6px;
        }

        .languages button {
          padding: 4px 1px;

          border: 0;
          background: transparent;

          color: #9aa4af;

          cursor: pointer;

          font-size: 9px;
          font-weight: 900;
        }

        .languages button.selected {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 12px;
          background: #d8dee5;
        }

        /* MEGA MENU */

        .megaMenu {
          position: relative;
          z-index: 90;

          width: 100%;

          background: #fbfcfe;

          border-bottom: 1px solid #e4e9ef;

          box-shadow: 0 18px 45px rgba(25, 42, 65, 0.07);
        }

        .megaInner {
          width: calc(100% - 72px);
          max-width: 1240px;
          margin: 0 auto;

          padding: 52px 0 58px;
        }

        .aboutLayout,
        .simpleLayout {
          display: grid;
          grid-template-columns: 0.72fr 1.28fr;
          gap: 72px;
          align-items: start;
        }

        .sideTitle {
          padding-right: 20px;
        }

        .sectionNumber {
          display: block;

          color: #1266e9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .eyebrow {
          display: block;

          margin-top: 16px;

          color: #8995a4;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .sideTitle h2 {
          max-width: 390px;

          margin: 10px 0 0;

          color: #182b43;

          font-size: 27px;
          line-height: 1.13;
          letter-spacing: -1px;

          font-weight: 760;
        }

        .sideDescription {
          max-width: 380px;

          margin: 15px 0 0;

          color: #738195;

          font-size: 11.5px;
          line-height: 1.7;
        }

        /* FOUNDER */

        .aboutContent {
          min-width: 0;
        }

        .contentBlock {
          padding-left: 30px;

          border-left: 1px solid #dfe5ec;
        }

        .contentHeading {
          margin-bottom: 22px;

          display: flex;
          align-items: center;
          gap: 10px;
        }

        .contentHeading span {
          color: #1266e9;

          font-size: 9px;
          font-weight: 900;
        }

        .contentHeading h3 {
          margin: 0;

          color: #25384f;

          font-size: 15px;
          font-weight: 800;
        }

        .contentBlock p {
          max-width: 720px;

          margin: 0 0 13px;

          color: #68778a;

          font-size: 11.5px;
          line-height: 1.72;
        }

        .contentBlock .lead {
          color: #35475d;

          font-size: 12.5px;
          line-height: 1.7;
        }

        .founderStatement {
          max-width: 720px;

          margin: 21px 0;
          padding: 17px 19px;

          border: 1px solid #e1e8f4;
          border-radius: 12px;

          background: #f4f8ff;
        }

        .founderStatement small {
          display: block;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .founderStatement strong {
          display: block;

          margin-top: 6px;

          color: #2b3e55;

          font-size: 13px;
          line-height: 1.5;
          font-weight: 750;
        }

        .thanks {
          color: #31445b !important;
          font-weight: 750;
        }

        .signature {
          max-width: 720px;

          margin-top: 23px;
          padding-top: 19px;

          display: flex;
          align-items: center;
          gap: 11px;

          border-top: 1px solid #e2e7ed;
        }

        .signatureMark {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #ffffff;
          background: #1266e9;

          font-size: 10px;
          font-weight: 900;
        }

        .signature strong,
        .signature span,
        .signature small {
          display: block;
        }

        .signature strong {
          color: #26394f;
          font-size: 12px;
        }

        .signature span {
          margin-top: 2px;

          color: #778598;

          font-size: 9px;
        }

        .signature small {
          margin-top: 2px;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .twoColumns {
          margin-top: 27px;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 11px;
        }

        .miniCard {
          padding: 20px;

          border: 1px solid #e2e7ed;
          border-radius: 13px;

          background: #ffffff;
        }

        .miniCard > span,
        .cardNumber {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;
        }

        .miniCard h3,
        .menuCard h3 {
          margin: 8px 0 0;

          color: #293c53;

          font-size: 14px;
          font-weight: 800;
        }

        .miniCard p,
        .menuCard p {
          margin: 8px 0 0;

          color: #738195;

          font-size: 11px;
          line-height: 1.65;
        }

        /* SHOP */

        .cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .menuCard {
          min-height: 185px;

          padding: 23px;

          display: block;

          border: 1px solid #e1e7ed;
          border-radius: 15px;

          color: inherit;
          background: #ffffff;

          text-decoration: none;

          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .menuCard:hover {
          transform: translateY(-2px);

          border-color: #cddcf4;

          box-shadow: 0 10px 30px rgba(34, 65, 110, 0.07);
        }

        .menuCard.featured {
          background: #f4f8ff;
        }

        .cardLink {
          display: block;

          margin-top: 22px;

          color: #1266e9;

          font-size: 10px;
          font-weight: 800;
        }

        /* FAQ */

        .faqList {
          border-top: 1px solid #dde4eb;
        }

        .faqItem {
          padding: 17px 2px;

          border-bottom: 1px solid #e1e7ed;
        }

        .faqItem h3 {
          margin: 0;

          color: #2a3c52;

          font-size: 12.5px;
          font-weight: 800;
        }

        .faqItem p {
          max-width: 720px;

          margin: 7px 0 0;

          color: #738195;

          font-size: 11px;
          line-height: 1.65;
        }

        /* CONTACT */

        .contactCards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .contactCard {
          min-height: 150px;

          padding: 22px;

          display: grid;
          grid-template-columns: 40px 1fr auto;
          align-items: center;
          gap: 13px;

          border: 1px solid #e1e7ed;
          border-radius: 15px;

          color: inherit;
          background: #ffffff;

          text-decoration: none;
        }

        a.contactCard:hover {
          border-color: #cbdcf7;
          background: #f7faff;
        }

        .contactIcon {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #eaf2ff;
        }

        .contactText small {
          display: block;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .contactText h3 {
          margin: 5px 0 0;

          color: #293c53;

          font-size: 13px;
          font-weight: 800;
        }

        .contactText p {
          margin: 5px 0 0;

          color: #758396;

          font-size: 10.5px;
          line-height: 1.55;
        }

        .arrow {
          color: #1266e9;
          font-size: 17px;
        }

        /* PREVIEW */

        .previewArea {
          min-height: 500px;

          padding: 110px 36px;

          text-align: center;

          background: #ffffff;
        }

        .previewArea span {
          color: #1266e9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .previewArea h1 {
          max-width: 650px;

          margin: 15px auto 0;

          color: #1d3047;

          font-size: 34px;
          line-height: 1.15;
          letter-spacing: -1.4px;
        }

        /* RESPONSIVE */

        @media (max-width: 1050px) {
          .navigation {
            gap: 14px;
            transform: none;
          }

          .nav {
            font-size: 11px;
          }

          .headerInner {
            width: calc(100% - 36px);
          }
        }

        @media (max-width: 900px) {
          .navigation {
            display: none;
          }

          .headerInner {
            grid-template-columns: auto 1fr;
          }

          .actions {
            justify-self: end;
          }

          .aboutLayout,
          .simpleLayout {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .contentBlock {
            padding-left: 0;
            border-left: 0;
          }
        }

        @media (max-width: 650px) {
          .headerInner {
            width: calc(100% - 20px);
            min-height: 70px;
          }

          .brandText span,
          .languages {
            display: none;
          }

          .blueButton {
            min-height: 35px;
            padding: 0 8px;
            font-size: 9px;
          }

          .megaInner {
            width: calc(100% - 28px);
            padding: 35px 0 42px;
          }

          .sideTitle h2 {
            font-size: 23px;
          }

          .twoColumns,
          .cards,
          .contactCards {
            grid-template-columns: 1fr;
          }

          .contentBlock p {
            font-size: 11px;
          }

          .previewArea h1 {
            font-size: 27px;
          }
        }
      `}</style>
    </main>
  );
}

function FAQ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <article className="faqItem">
      <h3>{question}</h3>
      <p>{answer}</p>
    </article>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .2s ease",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a9 9 0 1 1 17-5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
