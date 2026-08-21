"use client";

import { useState } from "react";

type Lang = "ka" | "en";
type Menu = "about" | "shop" | "faq" | "contact" | null;

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");
  const [openMenu, setOpenMenu] = useState<Menu>(null);

  const ka = language === "ka";

  const toggleMenu = (menu: Exclude<Menu, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <main className="page">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="headerInner">

          <a href="/" className="brand">
            <div className="brandLogo">
              <QRIcon size={23} />
            </div>

            <div>
              <strong>QR RETURN</strong>
              <span>SMART LOST &amp; FOUND</span>
            </div>
          </a>

          <nav className="nav">
            <button onClick={() => toggleMenu("about")}>
              {ka ? "ჩვენ შესახებ" : "About"}
              <Chevron open={openMenu === "about"} />
            </button>

            <button onClick={() => toggleMenu("shop")}>
              {ka ? "ონლაინ შეძენა" : "Shop"}
              <Chevron open={openMenu === "shop"} />
            </button>

            <button onClick={() => toggleMenu("faq")}>
              {ka ? "ხშირად დასმული კითხვები" : "FAQ"}
            </button>

            <button onClick={() => toggleMenu("contact")}>
              {ka ? "კონტაქტი" : "Contact"}
            </button>
          </nav>

          <div className="actions">

            <div className="languages">
              <button
                className={language === "ka" ? "activeLang" : ""}
                onClick={() => setLanguage("ka")}
              >
                GEO
              </button>

              <span />

              <button
                className={language === "en" ? "activeLang" : ""}
                onClick={() => setLanguage("en")}
              >
                ENG
              </button>
            </div>

            {/* დროებით ჩანს მხოლოდ დიზაინის სანახავად */}
            <a href="/admin" className="admin">
              {ka ? "ადმინ პანელი" : "Admin"}
            </a>

            <a href="/login" className="auth">
              {ka ? "შესვლა" : "Sign in"}
            </a>

            <a href="/signup" className="auth">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>

          </div>
        </div>
      </header>


      {/* ================= ABOUT ================= */}

      {openMenu === "about" && (
        <section className="dropdown">
          <div className="dropdownInner">

            <div className="sectionTitle">
              <span>01 · QR RETURN</span>
              <h2>{ka ? "ჩვენ შესახებ" : "About QR RETURN"}</h2>
            </div>

            <div className="aboutGrid">

              <article className="infoCard founderCard">
                <span className="number">01</span>

                <div className="founderIdentity">
                  <div className="nk">NK</div>

                  <div>
                    <strong>Nino Kuprava</strong>
                    <span>Founder &amp; CEO</span>
                    <small>QR RETURN</small>
                  </div>
                </div>

                <h3>
                  {ka ? "დამფუძნებლის სიტყვა" : "Founder’s Message"}
                </h3>

                <p>
                  {ka
                    ? "QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან გაჩნდა: რა ხდება მაშინ, როდესაც ადამიანი კარგავს მისთვის მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან როდესაც გადაუდებელ სიტუაციაში მის შესახებ აუცილებელი ინფორმაცია ხელმისაწვდომი არ არის?"
                    : "QR RETURN began with one simple question: how can we create the right connection when something important is lost or urgent information is needed?"}
                </p>

                <p>
                  {ka
                    ? "ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ არ იცის, ვის დაუკავშირდეს. სწორედ ამ პრობლემაზე ფიქრისას გაჩნდა QR RETURN-ის შექმნის იდეა — საჭირო მომენტში ადამიანებს შორის სწორი კავშირი სწრაფად და უსაფრთხოდ შეიქმნას."
                    : "The idea was to create a simple system that connects people quickly and securely when it matters."}
                </p>

                <div className="quote">
                  {ka
                    ? "ზოგჯერ დასაბრუნებლად ან დასახმარებლად მხოლოდ ერთი სწორი კავშირია საჭირო."
                    : "Sometimes one right connection is all that is needed."}
                </div>

                <p>
                  {ka
                    ? "ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აჩვენებს, ვის აჩვენებს და რა გზით შეიძლება მასთან დაკავშირება."
                    : "Users should remain in control of what information they share and how they can be contacted."}
                </p>

              </article>

              <article className="infoCard">
                <span className="number">02</span>

                <h3>{ka ? "ჩვენი მისია" : "Our Mission"}</h3>

                <p>
                  {ka
                    ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო და მარტივი კავშირის შექმნა."
                    : "Our mission is to create a simple and secure connection between finder and owner through one QR scan."}
                </p>

                <p>
                  {ka
                    ? "მომხმარებელი თავად განსაზღვრავს, რა ინფორმაცია იყოს ხელმისაწვდომი და რა გზით შეძლოს სხვა ადამიანმა მასთან დაკავშირება."
                    : "Users decide what information is available and how they can be contacted."}
                </p>

                <strong className="statement">
                  {ka
                    ? "მარტივი. სწრაფი. უსაფრთხო."
                    : "Simple. Fast. Secure."}
                </strong>
              </article>

              <article className="infoCard">
                <span className="number">03</span>

                <h3>{ka ? "ჩვენი ხედვა" : "Our Vision"}</h3>

                <p>
                  {ka
                    ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                    : "Our vision is for QR RETURN to become a universal system for belongings, pets and Emergency profiles."}
                </p>

                <p>
                  {ka
                    ? "ერთი სისტემა, რომელიც საჭირო მომენტში ერთმანეთთან აკავშირებს ადამიანს, მნიშვნელოვან ინფორმაციასა და სწორ საკონტაქტო პირს."
                    : "One system connecting people, essential information and the right contact at the right moment."}
                </p>
              </article>

            </div>
          </div>
        </section>
      )}


      {/* ================= SHOP ================= */}

      {openMenu === "shop" && (
        <section className="dropdown">
          <div className="dropdownInner">

            <div className="sectionTitle">
              <span>02 · {ka ? "ონლაინ შეძენა" : "ONLINE SHOP"}</span>

              <h2>
                {ka
                  ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
                  : "Choose QR RETURN for your needs."}
              </h2>
            </div>

            <div className="twoCards">

              <a href="#how-to-order" className="whiteCard">
                <span className="cardNumber">01</span>

                <h3>{ka ? "როგორ შევუკვეთო" : "How to order"}</h3>

                <p>
                  {ka
                    ? "აირჩიეთ თქვენთვის საჭირო QR პროდუქტი, შეიძინეთ ონლაინ და მიღების შემდეგ დაარეგისტრირეთ თქვენს ანგარიშზე."
                    : "Choose your QR product, purchase it online and register it to your account after delivery."}
                </p>

                <strong>
                  {ka ? "გაიგეთ მეტი" : "Learn more"} →
                </strong>
              </a>

              <a href="/store" className="whiteCard">
                <span className="cardNumber">02</span>

                <h3>{ka ? "მაღაზია" : "Store"}</h3>

                <p>
                  {ka
                    ? "იხილეთ QR RETURN-ის პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                    : "Explore QR RETURN products for belongings, pets and Emergency use."}
                </p>

                <strong>
                  {ka ? "პროდუქტების ნახვა" : "View products"} →
                </strong>
              </a>

            </div>
          </div>
        </section>
      )}


      {/* ================= FAQ ================= */}

      {openMenu === "faq" && (
        <section className="dropdown">
          <div className="dropdownInner split">

            <div className="sectionTitle">
              <span>03 · FAQ</span>

              <h2>
                {ka
                  ? "ხშირად დასმული კითხვები"
                  : "Frequently Asked Questions"}
              </h2>
            </div>

            <div className="faq">

              <Faq
                q={ka ? "რა არის QR RETURN?" : "What is QR RETURN?"}
                a={
                  ka
                    ? "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველებისა და Emergency პროფილებისთვის."
                    : "QR RETURN is a QR-based system for belongings, pets and Emergency profiles."
                }
              />

              <Faq
                q={
                  ka
                    ? "სჭირდება მპოვნელს რეგისტრაცია?"
                    : "Does the finder need an account?"
                }
                a={
                  ka
                    ? "არა. QR კოდის დასკანერებისთვის მპოვნელს რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა არ სჭირდება."
                    : "No. The finder does not need an account or an app."
                }
              />

              <Faq
                q={
                  ka
                    ? "ვინ განსაზღვრავს ხილულ ინფორმაციას?"
                    : "Who controls visible information?"
                }
                a={
                  ka
                    ? "პროფილის მფლობელი თავად ირჩევს, რომელი ინფორმაცია იყოს ხილული."
                    : "The profile owner chooses what information is visible."
                }
              />

              <Faq
                q={
                  ka
                    ? "შეიძლება რამდენიმე QR პროფილის მართვა?"
                    : "Can I manage multiple QR profiles?"
                }
                a={
                  ka
                    ? "დიახ. ერთი ანგარიშიდან შესაძლებელია რამდენიმე QR პროფილის მართვა."
                    : "Yes. Multiple QR profiles can be managed from one account."
                }
              />

            </div>
          </div>
        </section>
      )}


      {/* ================= CONTACT ================= */}

      {openMenu === "contact" && (
        <section className="dropdown">
          <div className="dropdownInner split">

            <div className="sectionTitle">
              <span>04 · QR RETURN SUPPORT</span>

              <h2>
                {ka ? "როგორ დაგეხმაროთ?" : "How can we help?"}
              </h2>

              <p>
                {ka
                  ? "დაგვიკავშირდით ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ. აირჩიეთ დახმარების ტიპი."
                  : "Contact us about your account, QR profile, order or product."}
              </p>
            </div>

            <div className="twoCards">

              <a href="/support" className="whiteCard">
                <span className="cardNumber">LIVE CHAT</span>

                <h3>
                  {ka ? "მოგვწერეთ პირდაპირ" : "Chat with us"}
                </h3>

                <p>
                  {ka
                    ? "გახსენით QR RETURN-ის მხარდაჭერის Live Chat და მოგვწერეთ თქვენი საკითხის შესახებ."
                    : "Open QR RETURN Support Live Chat."}
                </p>

                <strong>
                  {ka ? "Live Chat-ის გახსნა" : "Open Live Chat"} →
                </strong>
              </a>

              <div className="whiteCard">
                <span className="cardNumber">
                  {ka ? "ტელეფონი" : "PHONE"}
                </span>

                <h3>QR RETURN Support</h3>

                <p>
                  {ka
                    ? "QR RETURN-ის მხარდაჭერის საკონტაქტო ტელეფონის ნომერი აქ განთავსდება."
                    : "QR RETURN support phone number will appear here."}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}


      {/* ================= BLUE HERO ================= */}

      <section className="hero">
        <div className="heroInner">

          {/* EMERGENCY */}

          <div className="emergency">

            <span className="heroEyebrow">
              QR RETURN · EMERGENCY
            </span>

            <h1>
              {ka
                ? "გადაუდებელ სიტუაციაში საჭირო ინფორმაცია — ერთი სკანირებით."
                : "Essential information in an emergency — one scan away."}
            </h1>

            <p className="lead">
              {ka
                ? "Emergency პროფილი სწრაფად აჩვენებს თქვენ მიერ წინასწარ შერჩეულ მნიშვნელოვან ინფორმაციას და საგანგებო საკონტაქტო პირებს, რათა დახმარების აღმოჩენა უფრო სწრაფად და ორგანიზებულად მოხდეს."
                : "An Emergency profile provides quick access to the essential information and emergency contacts you have chosen in advance."}
            </p>


            {/* EMERGENCY FLOW */}

            <div className="emergencyFlow">

              <div className="flowStep">
                <span className="stepNo">01</span>

                <div className="braceletVisual">
                  <div className="band" />
                  <div className="braceletQR">
                    <QRIcon size={28} />
                  </div>
                  <div className="band" />
                </div>

                <div>
                  <strong>
                    {ka ? "Emergency სამაჯური" : "Emergency Bracelet"}
                  </strong>

                  <p>
                    {ka
                      ? "QR კოდი ყოველთვის ხელმისაწვდომია სამაჯურზე."
                      : "The QR code is available directly on the bracelet."}
                  </p>
                </div>
              </div>


              <div className="flowArrow">→</div>


              <div className="flowStep">
                <span className="stepNo">02</span>

                <div className="phoneVisual">
                  <div className="phoneTop" />
                  <QRIcon size={32} />
                  <div className="scanLine" />
                </div>

                <div>
                  <strong>
                    {ka ? "QR-ის სკანირება" : "Scan QR"}
                  </strong>

                  <p>
                    {ka
                      ? "დამხმარე ადამიანი ასკანირებს კოდს ტელეფონით."
                      : "A helper scans the QR code using a phone."}
                  </p>
                </div>
              </div>


              <div className="flowArrow">→</div>


              <div className="flowStep emergencyCall">
                <span className="stepNo">03</span>

                <div className="callIcon">
                  <PhoneIcon />
                </div>

                <div>
                  <strong>
                    {ka ? "საჭირო მოქმედება" : "Take action"}
                  </strong>

                  <p>
                    {ka
                      ? "პროფილიდან შესაძლებელია საგანგებო საკონტაქტო პირთან დაკავშირება ან საჭიროების შემთხვევაში 112-ზე დარეკვა."
                      : "Contact the emergency person or call 911 when emergency services are needed."}
                  </p>

                  <div className="emergencyNumber">
                    {ka ? "112" : "911"}
                  </div>
                </div>
              </div>

            </div>


            <div className="privacyNote">
              <ShieldIcon />

              <span>
                {ka
                  ? "პროფილში ჩანს მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც მომხმარებელმა წინასწარ აირჩია."
                  : "Only information selected by the user is visible in the profile."}
              </span>
            </div>

          </div>


          {/* PRODUCTS */}

          <div className="productsArea">

            <div className="productIntro">
              <span>QR RETURN</span>

              <h2>
                {ka
                  ? "ერთი QR სისტემა თქვენი მნიშვნელოვანი ნივთებისა და ცხოველებისთვის."
                  : "One QR system for your belongings and pets."}
              </h2>
            </div>

            <div className="productCircle">

              <div className="ring ringOne" />
              <div className="ring ringTwo" />

              <div className="mainQR">
                <QRIcon size={48} />

                <strong>QR RETURN</strong>

                <span>
                  {ka ? "დაასკანერე" : "SCAN"}
                </span>
              </div>

              <Product
                emoji="🐶"
                name={ka ? "ძაღლი" : "Dog"}
                className="p1"
              />

              <Product
                emoji="🐱"
                name={ka ? "კატა" : "Cat"}
                className="p2"
              />

              <Product
                emoji="👛"
                name={ka ? "საფულე" : "Wallet"}
                className="p3"
              />

              <Product
                emoji="🧳"
                name={ka ? "ჩემოდანი" : "Suitcase"}
                className="p4"
              />

              <Product
                emoji="👜"
                name={ka ? "ჩანთა" : "Bag"}
                className="p5"
              />

              <Product
                emoji="🔑"
                name={ka ? "გასაღები" : "Keys"}
                className="p6"
              />

            </div>

            <p className="productsCaption">
              {ka
                ? "ერთი სკანირება მპოვნელს აძლევს თქვენ მიერ არჩეულ ინფორმაციასა და დაკავშირების გზას."
                : "One scan gives the finder access to the information and contact options you selected."}
            </p>

          </div>
        </div>
      </section>


      {/* ================= CSS ================= */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #0b5bd3;
          color: #172b43;
        }


        /* HEADER */

        .header {
          position: relative;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #e6ebf1;
        }

        .headerInner {
          width: calc(100% - 90px);
          max-width: 1380px;
          min-height: 78px;
          margin: auto;

          display: grid;
          grid-template-columns: 210px 1fr auto;
          align-items: center;
          gap: 25px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandLogo {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: #1266e9;
          color: white;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #172b43;
          font-size: 16px;
          font-weight: 900;
        }

        .brand span {
          margin-top: 3px;

          color: #8995a4;

          font-size: 7px;
          font-weight: 800;
          letter-spacing: 1.3px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav button {
          padding: 28px 0;

          display: flex;
          align-items: center;
          gap: 5px;

          border: 0;
          background: transparent;

          color: #1266e9;

          font-family: inherit;
          font-size: 12px;
          font-weight: 800;

          cursor: pointer;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;

          padding-right: 25px;
        }

        .languages {
          margin-right: 9px;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .languages button {
          padding: 4px 1px;

          border: 0;
          background: transparent;

          color: #7b8796;

          font-size: 11px;
          font-weight: 900;

          cursor: pointer;
        }

        .languages .activeLang {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 14px;
          background: #d9e0e8;
        }

        .auth,
        .admin {
          min-height: 38px;
          padding: 0 13px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          font-size: 10px;
          font-weight: 850;

          text-decoration: none;
          white-space: nowrap;
        }

        .auth {
          color: white;
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .admin {
          color: #1266e9;
          background: #ffffff;
          border: 1px solid #cdddf4;
        }


        /* DROPDOWN */

        .dropdown {
          position: relative;
          z-index: 90;

          background: #f7faff;

          border-bottom: 1px solid #dfe7f1;

          box-shadow: 0 20px 45px rgba(10, 48, 100, 0.1);
        }

        .dropdownInner {
          width: calc(100% - 80px);
          max-width: 1240px;

          margin: auto;
          padding: 38px 0 45px;
        }

        .sectionTitle {
          max-width: 620px;
          margin-bottom: 23px;
        }

        .sectionTitle > span {
          color: #1266e9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .sectionTitle h2 {
          margin: 8px 0 0;

          color: #1c324d;

          font-size: 25px;
          line-height: 1.15;
        }

        .sectionTitle p {
          margin: 8px 0 0;

          color: #6e7e91;

          font-size: 12px;
          line-height: 1.6;
        }

        .aboutGrid {
          display: grid;
          grid-template-columns: 1.25fr .875fr .875fr;
          gap: 13px;
        }

        .infoCard {
          padding: 23px;

          border-radius: 16px;

          background: #1266e9;
          color: white;

          box-shadow: 0 12px 25px rgba(18,102,233,.14);
        }

        .number {
          font-size: 9px;
          font-weight: 900;

          color: rgba(255,255,255,.7);
        }

        .founderIdentity {
          margin-top: 14px;

          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nk {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #1266e9;
          background: white;

          font-size: 10px;
          font-weight: 900;
        }

        .founderIdentity strong,
        .founderIdentity span,
        .founderIdentity small {
          display: block;
        }

        .founderIdentity strong {
          font-size: 12px;
        }

        .founderIdentity span {
          margin-top: 2px;
          font-size: 9px;
          opacity: .8;
        }

        .founderIdentity small {
          margin-top: 2px;
          font-size: 7px;
          opacity: .65;
        }

        .infoCard h3 {
          margin: 17px 0 0;

          color: white;
          font-size: 16px;
        }

        .infoCard p {
          margin: 9px 0 0;

          color: rgba(255,255,255,.88);

          font-size: 11px;
          line-height: 1.67;
        }

        .quote {
          margin: 14px 0;
          padding: 12px;

          border-radius: 9px;
          border: 1px solid rgba(255,255,255,.18);

          background: rgba(255,255,255,.1);

          font-size: 11px;
          font-weight: 700;
          line-height: 1.6;
        }

        .statement {
          display: block;
          margin-top: 18px;

          font-size: 10px;
        }

        .twoCards {
          max-width: 900px;

          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .whiteCard {
          min-height: 205px;
          padding: 24px;

          border: 1px solid #d7e2ef;
          border-radius: 15px;

          background: white;
          color: inherit;

          text-decoration: none;
        }

        .cardNumber {
          color: #1266e9;

          font-size: 10px;
          font-weight: 900;
        }

        .whiteCard h3 {
          margin: 17px 0 0;

          color: #263c55;
          font-size: 17px;
        }

        .whiteCard p {
          margin: 9px 0 0;

          color: #6d7c90;

          font-size: 12px;
          line-height: 1.68;
        }

        .whiteCard strong {
          display: block;

          margin-top: 19px;

          color: #1266e9;

          font-size: 11px;
        }

        .split {
          display: grid;
          grid-template-columns: .7fr 1.3fr;
          gap: 55px;
        }

        .faq {
          border-top: 1px solid #dce4ed;
        }


        /* HERO */

        .hero {
          min-height: 720px;

          color: white;

          background:
            radial-gradient(
              circle at 79% 48%,
              rgba(255,255,255,.14),
              transparent 31%
            ),
            linear-gradient(
              135deg,
              #0750ba 0%,
              #1266e9 48%,
              #0748aa 100%
            );
        }

        .heroInner {
          width: calc(100% - 80px);
          max-width: 1280px;

          margin: auto;
          padding: 72px 0 82px;

          display: grid;
          grid-template-columns: 1.03fr .97fr;
          gap: 75px;
          align-items: center;
        }


        /* EMERGENCY */

        .emergency {
          max-width: 640px;
        }

        .heroEyebrow {
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;

          color: rgba(255,255,255,.72);
        }

        .emergency h1 {
          max-width: 610px;

          margin: 14px 0 0;

          font-size: clamp(35px, 3.5vw, 49px);
          line-height: 1.08;

          letter-spacing: -1.7px;

          color: white;
        }

        .lead {
          max-width: 590px;

          margin: 18px 0 0;

          color: rgba(255,255,255,.82);

          font-size: 13px;
          line-height: 1.72;
        }


        /* FLOW */

        .emergencyFlow {
          margin-top: 30px;

          display: grid;
          grid-template-columns: 1fr 25px 1fr 25px 1fr;
          align-items: stretch;
          gap: 6px;
        }

        .flowStep {
          min-height: 205px;
          padding: 16px;

          position: relative;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          border: 1px solid rgba(255,255,255,.18);
          border-radius: 14px;

          background: rgba(255,255,255,.1);

          backdrop-filter: blur(8px);
        }

        .stepNo {
          color: rgba(255,255,255,.58);

          font-size: 8px;
          font-weight: 900;
        }

        .flowStep strong {
          display: block;

          margin-top: 11px;

          color: white;

          font-size: 11px;
        }

        .flowStep p {
          margin: 5px 0 0;

          color: rgba(255,255,255,.7);

          font-size: 9px;
          line-height: 1.55;
        }

        .flowArrow {
          display: grid;
          place-items: center;

          color: rgba(255,255,255,.55);

          font-size: 17px;
        }


        /* BRACELET */

        .braceletVisual {
          height: 65px;

          margin-top: 12px;

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .band {
          width: 29px;
          height: 19px;

          background: white;
        }

        .braceletQR {
          width: 51px;
          height: 51px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: white;
          color: #1266e9;

          box-shadow: 0 6px 14px rgba(0,0,0,.08);
        }


        /* PHONE */

        .phoneVisual {
          width: 55px;
          height: 88px;

          margin: 8px auto 0;

          position: relative;

          display: grid;
          place-items: center;

          border: 2px solid white;
          border-radius: 10px;

          color: white;
        }

        .phoneTop {
          width: 16px;
          height: 2px;

          position: absolute;
          top: 5px;

          border-radius: 2px;

          background: rgba(255,255,255,.7);
        }

        .scanLine {
          width: 37px;
          height: 1px;

          position: absolute;

          background: #9fd1ff;

          box-shadow: 0 0 7px #ffffff;
        }


        /* CALL */

        .callIcon {
          width: 52px;
          height: 52px;

          margin: 12px auto 0;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #1266e9;
          background: white;
        }

        .emergencyNumber {
          margin-top: 8px;

          display: inline-flex;

          padding: 5px 10px;

          border-radius: 7px;

          color: #1266e9;
          background: white;

          font-size: 11px;
          font-weight: 900;
        }

        .privacyNote {
          margin-top: 18px;

          display: flex;
          align-items: center;
          gap: 8px;

          color: rgba(255,255,255,.72);

          font-size: 9px;
          line-height: 1.5;
        }


        /* PRODUCTS */

        .productsArea {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .productIntro {
          max-width: 440px;

          text-align: center;
        }

        .productIntro > span {
          color: rgba(255,255,255,.65);

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .productIntro h2 {
          margin: 8px 0 0;

          color: white;

          font-size: 18px;
          line-height: 1.4;
        }

        .productCircle {
          width: 450px;
          height: 450px;

          margin-top: 18px;

          position: relative;

          border-radius: 50%;
        }

        .ring {
          position: absolute;

          border-radius: 50%;

          border: 1px solid rgba(255,255,255,.19);
        }

        .ringOne {
          inset: 42px;
        }

        .ringTwo {
          inset: 98px;

          border-color: rgba(255,255,255,.1);
        }

        .mainQR {
          width: 138px;
          height: 138px;

          position: absolute;

          top: 50%;
          left: 50%;

          transform: translate(-50%, -50%);

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: white;
          color: #1266e9;

          box-shadow: 0 17px 40px rgba(0,0,0,.14);
        }

        .mainQR strong {
          margin-top: 7px;

          color: #223a55;

          font-size: 10px;
        }

        .mainQR span {
          margin-top: 3px;

          color: #8593a4;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .productCircle :global(.product) {
          width: 82px;

          position: absolute;

          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .productCircle :global(.productEmoji) {
          width: 62px;
          height: 62px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background: white;

          font-size: 28px;

          box-shadow: 0 9px 23px rgba(0,0,0,.12);
        }

        .productCircle :global(.productName) {
          margin-top: 7px;

          color: rgba(255,255,255,.9);

          font-size: 9px;
          font-weight: 800;
        }

        .productCircle :global(.p1) {
          top: 0;
          left: 112px;
        }

        .productCircle :global(.p2) {
          top: 0;
          right: 112px;
        }

        .productCircle :global(.p3) {
          top: 170px;
          right: 0;
        }

        .productCircle :global(.p4) {
          right: 80px;
          bottom: 2px;
        }

        .productCircle :global(.p5) {
          left: 80px;
          bottom: 2px;
        }

        .productCircle :global(.p6) {
          top: 170px;
          left: 0;
        }

        .productsCaption {
          max-width: 390px;

          margin: 8px 0 0;

          text-align: center;

          color: rgba(255,255,255,.65);

          font-size: 9px;
          line-height: 1.55;
        }


        /* RESPONSIVE */

        @media (max-width: 1050px) {

          .headerInner {
            width: calc(100% - 35px);
          }

          .nav {
            gap: 14px;
          }

          .nav button {
            font-size: 10px;
          }

          .actions {
            padding-right: 0;
          }

          .heroInner {
            grid-template-columns: 1fr;
          }

          .emergency {
            max-width: 700px;
            margin: auto;
          }

          .aboutGrid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 800px) {

          .nav {
            display: none;
          }

          .headerInner {
            grid-template-columns: auto 1fr;
          }

          .actions {
            justify-self: end;
          }

          .admin {
            display: none;
          }

          .split {
            grid-template-columns: 1fr;
          }

          .twoCards {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 650px) {

          .headerInner {
            width: calc(100% - 20px);
          }

          .brand span {
            display: none;
          }

          .auth {
            padding: 0 8px;
            font-size: 8px;
          }

          .languages button {
            font-size: 9px;
          }

          .dropdownInner,
          .heroInner {
            width: calc(100% - 28px);
          }

          .heroInner {
            padding-top: 52px;
          }

          .emergency h1 {
            font-size: 35px;
          }

          .emergencyFlow {
            grid-template-columns: 1fr;
          }

          .flowArrow {
            height: 24px;
            transform: rotate(90deg);
          }

          .flowStep {
            min-height: 190px;
          }

          .productCircle {
            width: 340px;
            height: 340px;
          }

          .ringOne {
            inset: 34px;
          }

          .ringTwo {
            inset: 76px;
          }

          .mainQR {
            width: 105px;
            height: 105px;
          }

          .productCircle :global(.product) {
            width: 62px;
          }

          .productCircle :global(.productEmoji) {
            width: 48px;
            height: 48px;

            font-size: 22px;
          }

          .productCircle :global(.p1) {
            left: 83px;
          }

          .productCircle :global(.p2) {
            right: 83px;
          }

          .productCircle :global(.p3) {
            top: 127px;
          }

          .productCircle :global(.p4) {
            right: 56px;
          }

          .productCircle :global(.p5) {
            left: 56px;
          }

          .productCircle :global(.p6) {
            top: 127px;
          }

        }

      `}</style>

    </main>
  );
}


/* ================= SMALL COMPONENTS ================= */

function Product({
  emoji,
  name,
  className,
}: {
  emoji: string;
  name: string;
  className: string;
}) {
  return (
    <div className={`product ${className}`}>
      <div className="productEmoji">{emoji}</div>
      <span className="productName">{name}</span>
    </div>
  );
}


function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="faqItem">
      <h3>{q}</h3>
      <p>{a}</p>

      <style jsx>{`
        .faqItem {
          padding: 15px 0;
          border-bottom: 1px solid #dce4ed;
        }

        h3 {
          margin: 0;

          color: #293f58;

          font-size: 13px;
        }

        p {
          margin: 6px 0 0;

          color: #718095;

          font-size: 11px;
          line-height: 1.65;
        }
      `}</style>
    </div>
  );
}


/* ================= ICONS ================= */

function QRIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4" />
      <path d="M14 21v-4" />
      <path d="M18 18h3v3" />
    </svg>
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
        transform: open ? "rotate(180deg)" : "rotate(0)",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


function PhoneIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6 19.7 19.7 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.4 2.1L8 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 2 2.3Z" />
    </svg>
  );
}


function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
