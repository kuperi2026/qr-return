"use client";

import { useState } from "react";
import type { ReactNode } from "react";

type Lang = "ka" | "en";
type Menu = "about" | "shop" | "faq" | "contact" | null;

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");
  const [openMenu, setOpenMenu] = useState<Menu>(null);

  const ka = language === "ka";

  /*
    მხოლოდ დიზაინის ტესტისთვისაა TRUE.
    როცა Admin ავტორიზაციას საბოლოოდ მივაბამთ,
    ეს შეიცვლება რეალური Supabase admin-check-ით.
  */
  const adminPreview = true;

  function toggleMenu(menu: Exclude<Menu, null>) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  return (
    <main className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <div className="headerInner">
          <a href="/" className="brand">
            <div className="brandIcon">
              <QRLogoIcon />
            </div>

            <div className="brandCopy">
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

          <div className="headerRight">
            <div className="language">
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

            {adminPreview && (
              <a href="/admin" className="adminButton">
                {ka ? "ადმინ პანელი" : "Admin Panel"}
              </a>
            )}

            <a href="/login" className="accountButton">
              {ka ? "შესვლა" : "Sign In"}
            </a>

            <a href="/signup" className="accountButton">
              {ka ? "რეგისტრაცია" : "Register"}
            </a>
          </div>
        </div>
      </header>

      {/* =====================================================
          ABOUT DROPDOWN
      ====================================================== */}

      {openMenu === "about" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="menuIntro">
              <span>01 · QR RETURN</span>

              <h2>{ka ? "ჩვენ შესახებ" : "About QR RETURN"}</h2>

              <p>
                {ka
                  ? "იდეა, მისია და ხედვა, რომლებზეც QR RETURN შეიქმნა."
                  : "The idea, mission and vision behind QR RETURN."}
              </p>
            </div>

            <div className="aboutCards">
              <article className="blueCard founderCard">
                <span className="cardNo">01</span>

                <div className="founder">
                  <div className="founderMark">NK</div>

                  <div>
                    <strong>Nino Kuprava</strong>
                    <span>Founder &amp; CEO</span>
                    <small>QR RETURN</small>
                  </div>
                </div>

                <h3>
                  {ka ? "დამფუძნებლის სიტყვა" : "Founder’s Message"}
                </h3>

                {ka ? (
                  <>
                    <p>
                      QR RETURN-ის იდეა ერთი მარტივი შეკითხვიდან გაჩნდა:
                      რა ხდება მაშინ, როდესაც ადამიანი კარგავს მისთვის
                      მნიშვნელოვან ნივთს, საყვარელ ცხოველს, ან როდესაც
                      ოჯახის წევრს გადაუდებელ სიტუაციაში დახმარება სჭირდება
                      და მის შესახებ აუცილებელი ინფორმაცია ხელმისაწვდომი
                      არ არის?
                    </p>

                    <p>
                      ხშირად მპოვნელს დახმარება ნამდვილად სურს, მაგრამ არ
                      იცის, ვის დაუკავშირდეს. სწორედ ამ პრობლემებზე ფიქრისას
                      გაჩნდა QR RETURN-ის შექმნის იდეა — საჭირო მომენტში
                      ადამიანებს შორის სწორი კავშირი უფრო სწრაფად და
                      უსაფრთხოდ შეიქმნას.
                    </p>

                    <div className="founderQuote">
                      QR RETURN-ის მთავარი ღირებულება მხოლოდ QR კოდში არ
                      არის — მთავარი ღირებულება საჭირო მომენტში სწრაფად
                      აღმოჩენილი სწორი კავშირია.
                    </div>

                    <p>
                      ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი
                      თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აჩვენებს,
                      ვის აჩვენებს და რა გზით შეიძლება მასთან დაკავშირება.
                    </p>
                  </>
                ) : (
                  <p>
                    QR RETURN began with one simple question: how can the
                    right person and the right information be connected
                    quickly when something important is lost or urgent help
                    is needed?
                  </p>
                )}
              </article>

              <article className="blueCard">
                <span className="cardNo">02</span>

                <div className="whiteIcon">
                  <TargetIcon />
                </div>

                <h3>{ka ? "ჩვენი მისია" : "Our Mission"}</h3>

                <p>
                  {ka
                    ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის სწრაფი, მარტივი და უსაფრთხო კავშირის შექმნა."
                    : "Our mission is to create a fast, simple and secure connection between a finder and an owner through one QR scan."}
                </p>

                <p>
                  {ka
                    ? "მომხმარებელი თავად განსაზღვრავს, რა ინფორმაცია იყოს ხილული და რა გზით შეძლოს სხვა ადამიანმა მასთან დაკავშირება."
                    : "Users decide what information is visible and how others can contact them."}
                </p>

                <strong className="cardStatement">
                  {ka
                    ? "მარტივი. სწრაფი. უსაფრთხო."
                    : "Simple. Fast. Secure."}
                </strong>
              </article>

              <article className="blueCard">
                <span className="cardNo">03</span>

                <div className="whiteIcon">
                  <VisionIcon />
                </div>

                <h3>{ka ? "ჩვენი ხედვა" : "Our Vision"}</h3>

                <p>
                  {ka
                    ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                    : "Our vision is for QR RETURN to become a universal system for belongings, pets and Emergency profiles."}
                </p>

                <p>
                  {ka
                    ? "QR კოდი უნდა იყოს არა მხოლოდ იდენტიფიკატორი, არამედ სანდო კავშირი სწორ ადამიანს, სწორ ინფორმაციასა და საჭირო მომენტს შორის."
                    : "A QR code should be more than an identifier — it should create the right connection at the right moment."}
                </p>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SHOP DROPDOWN
      ====================================================== */}

      {openMenu === "shop" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="menuIntro">
              <span>02 · {ka ? "ონლაინ შეძენა" : "SHOP ONLINE"}</span>

              <h2>
                {ka
                  ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
                  : "Choose QR RETURN for your needs."}
              </h2>
            </div>

            <div className="shopCards">
              <a href="#how-to-order" className="shopCard">
                <span>01</span>

                <div className="shopIcon">
                  <OrderIcon />
                </div>

                <h3>{ka ? "როგორ შევუკვეთო" : "How to Order"}</h3>

                <p>
                  {ka
                    ? "აირჩიეთ თქვენთვის საჭირო QR პროდუქტი, შეიძინეთ ონლაინ და მიღების შემდეგ დაარეგისტრირეთ თქვენს ანგარიშზე."
                    : "Choose the QR product you need, purchase it online and register it to your account after delivery."}
                </p>

                <strong>
                  {ka ? "გაიგეთ მეტი" : "Learn More"} →
                </strong>
              </a>

              <a href="/store" className="shopCard">
                <span>02</span>

                <div className="shopIcon">
                  <StoreIcon />
                </div>

                <h3>{ka ? "მაღაზია" : "Store"}</h3>

                <p>
                  {ka
                    ? "იხილეთ QR RETURN-ის პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                    : "Explore QR RETURN products for belongings, pets and Emergency use."}
                </p>

                <strong>
                  {ka ? "პროდუქტების ნახვა" : "View Products"} →
                </strong>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          FAQ DROPDOWN
      ====================================================== */}

      {openMenu === "faq" && (
        <section className="megaMenu">
          <div className="megaInner splitMenu">
            <div className="menuIntro">
              <span>03 · FAQ</span>

              <h2>
                {ka
                  ? "ხშირად დასმული კითხვები"
                  : "Frequently Asked Questions"}
              </h2>

              <p>
                {ka
                  ? "ყველაზე მნიშვნელოვანი ინფორმაცია QR RETURN-ის გამოყენების შესახებ."
                  : "Essential information about using QR RETURN."}
              </p>
            </div>

            <div className="faqList">
              <FAQ
                question={ka ? "რა არის QR RETURN?" : "What is QR RETURN?"}
                answer={
                  ka
                    ? "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველებისა და Emergency პროფილებისთვის."
                    : "QR RETURN is a QR-based system for belongings, pets and Emergency profiles."
                }
              />

              <FAQ
                question={
                  ka
                    ? "სჭირდება მპოვნელს რეგისტრაცია?"
                    : "Does the finder need to register?"
                }
                answer={
                  ka
                    ? "არა. მპოვნელს რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა არ სჭირდება."
                    : "No. A finder does not need to register or download an app."
                }
              />

              <FAQ
                question={
                  ka
                    ? "რა ინფორმაციას ხედავს მპოვნელი?"
                    : "What information can a finder see?"
                }
                answer={
                  ka
                    ? "მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც პროფილის მფლობელმა თავად აირჩია."
                    : "Only the information the profile owner has chosen to share."
                }
              />

              <FAQ
                question={
                  ka
                    ? "შემიძლია რამდენიმე QR პროფილის მართვა?"
                    : "Can I manage multiple QR profiles?"
                }
                answer={
                  ka
                    ? "დიახ. ერთი ანგარიშიდან შეგიძლიათ მართოთ რამდენიმე QR პროფილი."
                    : "Yes. Multiple QR profiles can be managed from one account."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CONTACT DROPDOWN
      ====================================================== */}

      {openMenu === "contact" && (
        <section className="megaMenu">
          <div className="megaInner splitMenu">
            <div className="menuIntro">
              <span>04 · QR RETURN SUPPORT</span>

              <h2>{ka ? "როგორ დაგეხმაროთ?" : "How can we help?"}</h2>

              <p>
                {ka
                  ? "თუ გაქვთ შეკითხვა ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ, აირჩიეთ დაკავშირების ტიპი."
                  : "If you have a question about your account, QR profile, order or product, choose how you would like to contact us."}
              </p>
            </div>

            <div className="supportCards">
              <a href="/support" className="supportCard">
                <div className="supportIcon">
                  <SupportIcon />
                </div>

                <small>LIVE CHAT</small>

                <h3>{ka ? "მოგვწერეთ პირდაპირ" : "Chat with us"}</h3>

                <p>
                  {ka
                    ? "გახსენით QR RETURN-ის მხარდაჭერის Live Chat და მოგვწერეთ თქვენი საკითხის შესახებ."
                    : "Open QR RETURN Live Chat and tell us how we can help."}
                </p>

                <strong>
                  {ka ? "Live Chat-ის გახსნა" : "Open Live Chat"} →
                </strong>
              </a>

              <div className="supportCard">
                <div className="supportIcon">
                  <PhoneIcon />
                </div>

                <small>{ka ? "ტელეფონი" : "PHONE"}</small>

                <h3>QR RETURN Support</h3>

                <p>
                  {ka
                    ? "QR RETURN-ის ოფიციალური სატელეფონო მხარდაჭერის ნომერი აქ დაემატება."
                    : "The official QR RETURN support phone number will be added here."}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          HERO — EMERGENCY + QR CIRCLE
      ====================================================== */}

      <section className="hero">
        <div className="heroInner">
          {/* LEFT */}

          <div className="heroCopy">
            <div className="eyebrow">
              <span />
              EMERGENCY
            </div>

            <h1>
              {ka
                ? "საჭირო ინფორმაცია — ერთი QR სკანირებით."
                : "Essential information — one QR scan away."}
            </h1>

            <p className="heroText">
              {ka
                ? "QR RETURN Emergency პროფილი საჭირო მომენტში დამხმარე ადამიანს აძლევს წვდომას მხოლოდ იმ ინფორმაციაზე, რომლის გაზიარებაც წინასწარ გაქვთ არჩეული."
                : "A QR RETURN Emergency profile gives a helper access only to the information you have chosen to share."}
            </p>

            <div className="emergencyCard">
              <div className="emergencyIcon">
                <MedicalIcon />
              </div>

              <div>
                <small>QR RETURN</small>

                <h2>{ka ? "Emergency პროფილი" : "Emergency Profile"}</h2>

                <p>
                  {ka
                    ? "მნიშვნელოვანი ინფორმაცია და საგანგებო საკონტაქტო პირი — ერთ უსაფრთხო პროფილში."
                    : "Essential information and emergency contacts in one secure profile."}
                </p>
              </div>
            </div>

            <div className="heroActions">
              <a href="/emergency" className="primaryButton">
                {ka ? "Emergency პროფილი" : "Emergency Profile"}
                <ArrowIcon />
              </a>

              <a href="/store" className="secondaryButton">
                {ka ? "პროდუქტების ნახვა" : "View Products"}
              </a>
            </div>

            <div className="trustRow">
              <Trust text={ka ? "სწრაფი წვდომა" : "Fast access"} />
              <Trust text={ka ? "თქვენი კონტროლი" : "Your control"} />
              <Trust
                text={ka ? "აპლიკაციის გარეშე" : "No app required"}
              />
            </div>
          </div>

          {/* RIGHT */}

          <div className="visualSide">
            <div className="qrUniverse">
              <div className="outerRing" />
              <div className="innerRing" />

              <div className="centerQR">
                <QRIcon />
                <strong>QR RETURN</strong>
                <span>{ka ? "ერთი სკანირება" : "ONE SCAN"}</span>
              </div>

              <Product
                className="dog"
                label={ka ? "ძაღლი" : "Dog"}
                icon={<DogIcon />}
              />

              <Product
                className="cat"
                label={ka ? "კატა" : "Cat"}
                icon={<CatIcon />}
              />

              <Product
                className="wallet"
                label={ka ? "საფულე" : "Wallet"}
                icon={<WalletIcon />}
              />

              <Product
                className="keys"
                label={ka ? "გასაღები" : "Keys"}
                icon={<KeyIcon />}
              />

              <Product
                className="bag"
                label={ka ? "ჩანთა" : "Bag"}
                icon={<BagIcon />}
              />

              <Product
                className="suitcase"
                label={ka ? "ჩემოდანი" : "Suitcase"}
                icon={<SuitcaseIcon />}
              />
            </div>

            <p className="visualCaption">
              {ka
                ? "ერთი სისტემა თქვენი მნიშვნელოვანი ნივთებისა და საყვარელი ცხოველებისთვის."
                : "One system for your important belongings and pets."}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SMALL FEATURE BAR
      ====================================================== */}

      <section className="featureBar">
        <div className="featureInner">
          <Feature
            icon={<ShieldIcon />}
            title={ka ? "კონფიდენციალურობა" : "Privacy"}
            text={
              ka
                ? "თავად ირჩევთ რა გამოჩნდება"
                : "You choose what is visible"
            }
          />

          <Feature
            icon={<MiniQRIcon />}
            title={ka ? "ერთი QR კოდი" : "One QR Code"}
            text={ka ? "მარტივი სკანირება" : "Simple scanning"}
          />

          <Feature
            icon={<ContactIcon />}
            title={ka ? "სწრაფი კავშირი" : "Fast Contact"}
            text={ka ? "პირდაპირი დაკავშირება" : "Direct communication"}
          />
        </div>
      </section>

      {/* =====================================================
          CSS
      ====================================================== */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          color: #172b43;
          background: #ffffff;
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 100;
          border-bottom: 1px solid #e8edf3;
          background: #ffffff;
        }

        .headerInner {
          width: calc(100% - 110px);
          max-width: 1380px;
          min-height: 78px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 205px 1fr auto;
          align-items: center;
          gap: 22px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .brandIcon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: white;
          background: #172b43;
        }

        .brandCopy strong,
        .brandCopy span {
          display: block;
        }

        .brandCopy strong {
          color: #172b43;
          font-size: 16px;
          font-weight: 900;
        }

        .brandCopy span {
          margin-top: 3px;
          color: #929ca8;
          font-size: 7px;
          font-weight: 850;
          letter-spacing: 1.35px;
        }

        .navigation {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .nav {
          padding: 28px 0;
          display: inline-flex;
          align-items: center;
          gap: 5px;

          border: 0;
          color: #1266e9;
          background: transparent;

          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .nav:hover,
        .nav.active {
          color: #084ead;
        }

        .headerRight {
          padding-right: 28px;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .language {
          margin-right: 9px;

          display: flex;
          align-items: center;
          gap: 7px;
        }

        .language button {
          padding: 5px 2px;

          border: 0;
          color: #7c8998;
          background: transparent;

          cursor: pointer;
          font-size: 11px;
          font-weight: 900;
        }

        .language button.selected {
          color: #1266e9;
        }

        .language span {
          width: 1px;
          height: 14px;
          background: #d8dfe6;
        }

        .accountButton,
        .adminButton {
          min-height: 38px;
          padding: 0 13px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;
          white-space: nowrap;

          font-size: 10px;
          font-weight: 850;
        }

        .accountButton {
          color: #ffffff;
          border: 1px solid #1266e9;
          background: #1266e9;
        }

        .adminButton {
          color: #172b43;
          border: 1px solid #d8e0e9;
          background: #ffffff;
        }

        /* MEGA MENU */

        .megaMenu {
          position: relative;
          z-index: 90;

          border-bottom: 1px solid #dfe7f0;
          background: #f8fbff;

          box-shadow: 0 18px 45px rgba(28, 49, 76, 0.07);
        }

        .megaInner {
          width: calc(100% - 80px);
          max-width: 1240px;
          margin: 0 auto;
          padding: 42px 0 48px;
        }

        .menuIntro {
          max-width: 630px;
          margin-bottom: 25px;
        }

        .menuIntro > span {
          color: #1266e9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .menuIntro h2 {
          margin: 8px 0 0;
          color: #1d324c;
          font-size: 25px;
          line-height: 1.15;
        }

        .menuIntro p {
          margin: 9px 0 0;
          color: #718095;
          font-size: 12px;
          line-height: 1.65;
        }

        /* ABOUT */

        .aboutCards {
          display: grid;
          grid-template-columns: 1.25fr 0.875fr 0.875fr;
          gap: 13px;
        }

        .blueCard {
          padding: 23px;

          border-radius: 16px;

          color: #ffffff;

          background: linear-gradient(
            145deg,
            #1266e9,
            #0b55c9
          );

          box-shadow: 0 14px 30px rgba(18, 102, 233, 0.13);
        }

        .cardNo {
          color: rgba(255, 255, 255, 0.72);
          font-size: 9px;
          font-weight: 900;
        }

        .founder {
          margin-top: 15px;

          display: flex;
          align-items: center;
          gap: 10px;
        }

        .founderMark {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #1266e9;
          background: #ffffff;

          font-size: 10px;
          font-weight: 900;
        }

        .founder strong,
        .founder span,
        .founder small {
          display: block;
        }

        .founder strong {
          color: white;
          font-size: 12px;
        }

        .founder span {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 9px;
        }

        .founder small {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.64);
          font-size: 7px;
          font-weight: 900;
        }

        .whiteIcon {
          width: 42px;
          height: 42px;
          margin-top: 16px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1266e9;
          background: white;
        }

        .blueCard h3 {
          margin: 17px 0 0;
          color: white;
          font-size: 16px;
        }

        .blueCard p {
          margin: 10px 0 0;

          color: rgba(255, 255, 255, 0.88);

          font-size: 11px;
          line-height: 1.67;
        }

        .founderQuote {
          margin: 14px 0;
          padding: 13px;

          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 10px;

          color: white;
          background: rgba(255, 255, 255, 0.1);

          font-size: 11px;
          font-weight: 700;
          line-height: 1.6;
        }

        .cardStatement {
          display: block;
          margin-top: 18px;

          color: white;

          font-size: 10px;
          font-weight: 900;
        }

        /* SHOP */

        .shopCards,
        .supportCards {
          max-width: 900px;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .shopCard,
        .supportCard {
          min-height: 220px;
          padding: 24px;

          border: 1px solid #cdddf4;
          border-radius: 15px;

          color: inherit;
          background: white;

          text-decoration: none;
        }

        .shopCard > span {
          color: #1266e9;
          font-size: 10px;
          font-weight: 900;
        }

        .shopIcon,
        .supportIcon {
          width: 45px;
          height: 45px;
          margin-top: 15px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #edf4ff;
        }

        .shopCard h3,
        .supportCard h3 {
          margin: 15px 0 0;
          color: #273d56;
          font-size: 17px;
        }

        .shopCard p,
        .supportCard p {
          margin: 9px 0 0;

          color: #6c7c90;

          font-size: 12px;
          line-height: 1.68;
        }

        .shopCard strong,
        .supportCard strong {
          display: block;
          margin-top: 19px;

          color: #1266e9;

          font-size: 11px;
          font-weight: 900;
        }

        .supportCard small {
          display: block;
          margin-top: 15px;

          color: #1266e9;

          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        /* SPLIT */

        .splitMenu {
          display: grid;
          grid-template-columns: 0.65fr 1.35fr;
          gap: 55px;
        }

        .faqList {
          border-top: 1px solid #dce5ee;
        }

        .faqItem {
          padding: 15px 0;
          border-bottom: 1px solid #dce5ee;
        }

        .faqItem h3 {
          margin: 0;
          color: #2c4058;
          font-size: 13px;
        }

        .faqItem p {
          margin: 6px 0 0;
          color: #748296;
          font-size: 11px;
          line-height: 1.65;
        }

        /* HERO */

        .hero {
          overflow: hidden;

          background:
            radial-gradient(
              circle at 79% 45%,
              rgba(18, 102, 233, 0.07),
              transparent 34%
            ),
            #ffffff;
        }

        .heroInner {
          width: calc(100% - 80px);
          max-width: 1240px;
          min-height: 650px;
          margin: 0 auto;
          padding: 68px 0 75px;

          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          align-items: center;
          gap: 80px;
        }

        .heroCopy {
          max-width: 520px;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;

          color: #1266e9;

          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .eyebrow span {
          width: 27px;
          height: 1px;
          background: #1266e9;
        }

        .heroCopy h1 {
          margin: 17px 0 0;

          color: #172b43;

          font-size: clamp(38px, 4vw, 50px);
          font-weight: 780;

          line-height: 1.08;
          letter-spacing: -1.8px;
        }

        .heroText {
          margin: 20px 0 0;

          color: #68798d;

          font-size: 14px;
          line-height: 1.74;
        }

        .emergencyCard {
          margin-top: 27px;
          padding: 18px;

          display: grid;
          grid-template-columns: 47px 1fr;
          gap: 14px;

          border: 1px solid #dfe8f2;
          border-radius: 14px;

          background: #fafcfe;
        }

        .emergencyIcon {
          width: 47px;
          height: 47px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #eaf3ff;
        }

        .emergencyCard small {
          color: #1266e9;
          font-size: 8px;
          font-weight: 900;
        }

        .emergencyCard h2 {
          margin: 4px 0 0;
          color: #263b53;
          font-size: 15px;
        }

        .emergencyCard p {
          margin: 6px 0 0;

          color: #748397;

          font-size: 11px;
          line-height: 1.6;
        }

        .heroActions {
          margin-top: 21px;

          display: flex;
          gap: 9px;
        }

        .primaryButton,
        .secondaryButton {
          min-height: 44px;
          padding: 0 16px;

          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 10.5px;
          font-weight: 850;
        }

        .primaryButton {
          color: white;
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .secondaryButton {
          color: #43556a;
          background: white;
          border: 1px solid #dbe3ec;
        }

        .trustRow {
          margin-top: 24px;

          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        /* RIGHT CIRCLE */

        .visualSide {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qrUniverse {
          width: 500px;
          height: 500px;

          position: relative;

          border-radius: 50%;

          background:
            radial-gradient(
              circle at center,
              #f4f8ff 0%,
              #ffffff 65%
            );
        }

        .outerRing,
        .innerRing {
          position: absolute;
          border-radius: 50%;
        }

        .outerRing {
          inset: 48px;
          border: 1px solid #d9e7f9;
        }

        .innerRing {
          inset: 103px;
          border: 1px solid #edf3fa;
        }

        .centerQR {
          width: 148px;
          height: 148px;

          position: absolute;
          z-index: 10;

          top: 50%;
          left: 50%;

          transform: translate(-50%, -50%);

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          border: 1px solid #cfdef4;
          border-radius: 50%;

          background: white;

          box-shadow: 0 14px 34px rgba(30, 75, 132, 0.09);
        }

        .centerQR :global(svg) {
          color: #1266e9;
        }

        .centerQR strong {
          margin-top: 7px;
          color: #263c54;
          font-size: 11px;
          font-weight: 900;
        }

        .centerQR span {
          margin-top: 3px;
          color: #919ba7;
          font-size: 6.5px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .qrUniverse :global(.product) {
          width: 82px;

          position: absolute;
          z-index: 20;

          display: flex;
          flex-direction: column;
          align-items: center;

          text-align: center;
        }

        .qrUniverse :global(.productIcon) {
          width: 61px;
          height: 61px;

          display: grid;
          place-items: center;

          border: 1px solid #dce7f4;
          border-radius: 50%;

          color: #1266e9;
          background: white;

          box-shadow: 0 7px 18px rgba(30, 72, 124, 0.06);
        }

        .qrUniverse :global(.productLabel) {
          margin-top: 7px;

          color: #516276;

          font-size: 9px;
          font-weight: 800;
        }

        .qrUniverse :global(.dog) {
          top: 4px;
          left: 132px;
        }

        .qrUniverse :global(.cat) {
          top: 4px;
          right: 132px;
        }

        .qrUniverse :global(.wallet) {
          top: 192px;
          right: 0;
        }

        .qrUniverse :global(.keys) {
          right: 92px;
          bottom: 14px;
        }

        .qrUniverse :global(.bag) {
          left: 92px;
          bottom: 14px;
        }

        .qrUniverse :global(.suitcase) {
          top: 192px;
          left: 0;
        }

        .visualCaption {
          max-width: 410px;
          margin: 7px 0 0;

          color: #8793a1;

          text-align: center;

          font-size: 9.5px;
          line-height: 1.55;
        }

        /* FEATURE BAR */

        .featureBar {
          border-top: 1px solid #edf1f5;
          border-bottom: 1px solid #edf1f5;
          background: #fbfcfe;
        }

        .featureInner {
          width: calc(100% - 80px);
          max-width: 1180px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        /* RESPONSIVE */

        @media (max-width: 1080px) {
          .headerInner {
            width: calc(100% - 40px);
          }

          .navigation {
            gap: 14px;
          }

          .nav {
            font-size: 10px;
          }

          .headerRight {
            padding-right: 0;
          }
        }

        @media (max-width: 940px) {
          .navigation {
            display: none;
          }

          .headerInner {
            grid-template-columns: auto 1fr;
          }

          .headerRight {
            justify-self: end;
          }

          .heroInner {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .heroCopy {
            max-width: 650px;
            margin: 0 auto;
            text-align: center;
          }

          .eyebrow,
          .heroActions,
          .trustRow {
            justify-content: center;
          }

          .emergencyCard {
            max-width: 540px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
          }

          .aboutCards,
          .splitMenu {
            grid-template-columns: 1fr;
          }

          .featureInner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .headerInner {
            width: calc(100% - 20px);
            min-height: 70px;
          }

          .brandCopy span,
          .adminButton {
            display: none;
          }

          .language {
            margin-right: 2px;
          }

          .language button {
            font-size: 9px;
          }

          .accountButton {
            min-height: 35px;
            padding: 0 8px;
            font-size: 8.5px;
          }

          .megaInner,
          .heroInner {
            width: calc(100% - 28px);
          }

          .shopCards,
          .supportCards {
            grid-template-columns: 1fr;
          }

          .heroCopy h1 {
            font-size: 36px;
            letter-spacing: -1.3px;
          }

          .qrUniverse {
            width: 350px;
            height: 350px;
          }

          .outerRing {
            inset: 36px;
          }

          .innerRing {
            inset: 74px;
          }

          .centerQR {
            width: 108px;
            height: 108px;
          }

          .qrUniverse :global(.product) {
            width: 64px;
          }

          .qrUniverse :global(.productIcon) {
            width: 47px;
            height: 47px;
          }

          .qrUniverse :global(.dog) {
            top: 0;
            left: 91px;
          }

          .qrUniverse :global(.cat) {
            top: 0;
            right: 91px;
          }

          .qrUniverse :global(.wallet) {
            top: 131px;
            right: 0;
          }

          .qrUniverse :global(.keys) {
            right: 61px;
            bottom: 3px;
          }

          .qrUniverse :global(.bag) {
            left: 61px;
            bottom: 3px;
          }

          .qrUniverse :global(.suitcase) {
            top: 131px;
            left: 0;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   SMALL UI
========================================================= */

function Product({
  className,
  label,
  icon,
}: {
  className: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <div className={`product ${className}`}>
      <div className="productIcon">{icon}</div>
      <span className="productLabel">{label}</span>
    </div>
  );
}

function Trust({ text }: { text: string }) {
  return (
    <div className="trust">
      <CheckIcon />
      <span>{text}</span>

      <style jsx>{`
        .trust {
          display: flex;
          align-items: center;
          gap: 6px;

          color: #718095;

          font-size: 9.5px;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="feature">
      <div className="featureIcon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <style jsx>{`
        .feature {
          min-height: 86px;
          padding: 0 30px;

          display: flex;
          align-items: center;
          gap: 13px;

          border-right: 1px solid #e3e8ee;
        }

        .feature:last-child {
          border-right: 0;
        }

        .featureIcon {
          width: 38px;
          height: 38px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1266e9;
          background: #edf4ff;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #293d55;
          font-size: 11px;
        }

        span {
          margin-top: 3px;
          color: #7f8b9a;
          font-size: 8.5px;
        }

        @media (max-width: 940px) {
          .feature {
            border-right: 0;
            border-bottom: 1px solid #e3e8ee;
          }
        }
      `}</style>
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
  return (
    <article className="faqItem">
      <h3>{question}</h3>
      <p>{answer}</p>
    </article>
  );
}

/* =========================================================
   ICONS
========================================================= */

function QRLogoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
    </svg>
  );
}

function QRIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <path d="M14 14h3v3h4M14 21v-4M18 18h3v3" />
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
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform .2s ease",
      }}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1266e9"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M7 4h10l2 4v12H5V8l2-4Z" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 10v10h16V10" />
      <path d="M3 4h18l-2 6H5L3 4Z" />
      <path d="M9 20v-5h6v5" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Z" />
      <path d="M20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z" />
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function DogIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8 3 5v7l3 3" />
      <path d="m18 8 3-3v7l-3 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
    </svg>
  );
}

function CatIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m6 8-2-5 5 3" />
      <path d="m18 8 2-5-5 3" />
      <path d="M6 8c1-2 3-3 6-3s5 1 6 3v7c0 3-2 5-6 5s-6-2-6-5V8Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 9h18" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M15 12v2" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 8h14l1 12H4L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function SuitcaseIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="6" width="14" height="14" rx="2" />
      <path d="M9 6V4h6v2M9 10v6M15 10v6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MiniQRIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3" y="3" width="6" height="6" />
      <rect x="15" y="3" width="6" height="6" />
      <rect x="3" y="15" width="6" height="6" />
      <path d="M15 15h2v2h-2zM19 15h2v6h-6v-2" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M21 12a8 8 0 0 1-8 8H6l-3 2 1-5a9 9 0 1 1 17-5Z" />
    </svg>
  );
}
