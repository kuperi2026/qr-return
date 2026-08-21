"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type MenuType = "about" | "shop" | "faq" | "contact" | null;

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [openMenu, setOpenMenu] = useState<MenuType>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ka = language === "ka";

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      /*
        ADMIN CHECK

        1. ჯერ ვამოწმებთ user_metadata.role-ს
        2. შემდეგ admin_users ცხრილს.

        ასე admin ღილაკის გამოჩენა უფრო საიმედოა,
        მაგრამ /admin გვერდიც აუცილებლად დაცული უნდა იყოს.
      */

      const metadataAdmin =
        user.user_metadata?.role === "admin" ||
        user.app_metadata?.role === "admin";

      if (metadataAdmin) {
        setIsAdmin(true);
        return;
      }

      const { data: adminRow, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.warn("Admin check failed:", error.message);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(Boolean(adminRow));
    };

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleMenu = (menu: Exclude<MenuType, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <main className="page">
      {/* ==================================================
          HEADER
      ================================================== */}

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
            {/* LANGUAGES — შესვლამდე */}
            <div className="languages">
              <button
                type="button"
                className={language === "ka" ? "selected" : ""}
                onClick={() => setLanguage("ka")}
              >
                GEO
              </button>

              <span className="languageDivider" />

              <button
                type="button"
                className={language === "en" ? "selected" : ""}
                onClick={() => setLanguage("en")}
              >
                ENG
              </button>
            </div>

            {/* ADMIN — მხოლოდ ადმინისტრატორისთვის */}
            {isAdmin && (
              <a href="/admin" className="adminButton">
                {ka ? "ადმინ პანელი" : "Admin Panel"}
              </a>
            )}

            {isLoggedIn ? (
              <a href="/account" className="accountButton">
                {ka ? "ჩემი ანგარიში" : "My Account"}
              </a>
            ) : (
              <>
                <a href="/login" className="accountButton">
                  {ka ? "შესვლა" : "Sign In"}
                </a>

                <a href="/signup" className="accountButton">
                  {ka ? "რეგისტრაცია" : "Register"}
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ==================================================
          ABOUT
      ================================================== */}

      {openMenu === "about" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="sectionHeader">
              <span className="sectionNumber">01</span>
              <span className="eyebrow">
                {ka ? "ჩვენ შესახებ" : "ABOUT QR RETURN"}
              </span>

              <h1>
                {ka
                  ? "იდეა, მისია და ხედვა."
                  : "The idea, mission and vision."}
              </h1>

              <p>
                {ka
                  ? "QR RETURN შეიქმნა იმისთვის, რომ საჭირო მომენტში სწორი კავშირი უფრო სწრაფად და უსაფრთხოდ შეიქმნას."
                  : "QR RETURN was created to make the right connection faster and safer when it matters."}
              </p>
            </div>

            <div className="aboutCards">
              {/* FOUNDER */}

              <article className="blueCard founderCard">
                <span className="cardNumber">01</span>

                <div className="founderIdentity">
                  <div className="founderAvatar">NK</div>

                  <div>
                    <strong>Nino Kuprava</strong>
                    <span>Founder &amp; CEO</span>
                    <small>QR RETURN</small>
                  </div>
                </div>

                <h2>
                  {ka ? "დამფუძნებლის სიტყვა" : "Founder’s Message"}
                </h2>

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
                      იცის, ვის დაუკავშირდეს. დაკარგულ ცხოველს არ შეუძლია
                      პატრონის ვინაობის თქმა, ნივთზე კი, როგორც წესი, არ
                      არსებობს ინფორმაცია, რომელიც მის დაბრუნებას
                      გაამარტივებს.
                    </p>

                    <div className="founderQuote">
                      QR RETURN-ის მთავარი ღირებულება მხოლოდ QR კოდში არ
                      არის — ეს არის სწრაფად აღმოჩენილი სწორი კავშირი მაშინ,
                      როდესაც დრო, უსაფრთხოება და ინფორმაცია ყველაზე მეტად
                      გვჭირდება.
                    </div>

                    <p>
                      ჩემთვის განსაკუთრებით მნიშვნელოვანია, რომ მომხმარებელი
                      თავად აკონტროლებდეს საკუთარ ინფორმაციას — რას აჩვენებს,
                      ვის აჩვენებს და რა გზით შეიძლება მასთან დაკავშირება.
                    </p>

                    <p>
                      ჩემი მიზანია QR RETURN გახდეს პატარა, მაგრამ
                      მნიშვნელოვანი დამცავი რგოლი ადამიანებს, მათ საყვარელ
                      ცხოველებსა და მათთვის ძვირფას ნივთებს შორის.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      QR RETURN began with one simple question: what happens
                      when someone loses something important, a beloved pet,
                      or needs urgent help when essential information is not
                      immediately available?
                    </p>

                    <p>
                      The purpose of QR RETURN is to create a fast, simple
                      and secure connection at the moment it matters most.
                    </p>
                  </>
                )}
              </article>

              {/* MISSION */}

              <article className="blueCard">
                <span className="cardNumber">02</span>

                <div className="whiteIcon">
                  <TargetIcon />
                </div>

                <h2>{ka ? "ჩვენი მისია" : "Our Mission"}</h2>

                <p>
                  {ka
                    ? "ჩვენი მისიაა ერთი QR სკანირებით მპოვნელსა და მფლობელს შორის უსაფრთხო, სწრაფი და მარტივი კავშირის შექმნა."
                    : "Our mission is to create a fast, simple and secure connection between a finder and an owner through one QR scan."}
                </p>

                <p>
                  {ka
                    ? "მომხმარებელი თავად ირჩევს, რა ინფორმაცია იყოს ხელმისაწვდომი და რა გზით შეძლოს მპოვნელმა მასთან დაკავშირება."
                    : "Users decide what information is available and how a finder may contact them."}
                </p>

                <strong className="cardStatement">
                  {ka
                    ? "მარტივი. სწრაფი. უსაფრთხო."
                    : "Simple. Fast. Secure."}
                </strong>
              </article>

              {/* VISION */}

              <article className="blueCard">
                <span className="cardNumber">03</span>

                <div className="whiteIcon">
                  <VisionIcon />
                </div>

                <h2>{ka ? "ჩვენი ხედვა" : "Our Vision"}</h2>

                <p>
                  {ka
                    ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური სისტემა ნივთების, ცხოველებისა და Emergency პროფილების დასაცავად."
                    : "Our vision is for QR RETURN to become a universal system for protecting belongings, pets and Emergency profiles."}
                </p>

                <p>
                  {ka
                    ? "ჩვენ გვინდა QR კოდი იქცეს სანდო კავშირად სწორ ადამიანს, სწორ ინფორმაციასა და საჭირო მომენტს შორის."
                    : "We want the QR code to become a trusted connection between the right person, the right information and the right moment."}
                </p>

                <strong className="cardStatement">
                  {ka
                    ? "ერთი სისტემა. მეტი დაცულობა."
                    : "One system. More protection."}
                </strong>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          ONLINE SHOP
      ================================================== */}

      {openMenu === "shop" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="sectionHeader">
              <span className="sectionNumber">02</span>
              <span className="eyebrow">
                {ka ? "ონლაინ შეძენა" : "SHOP ONLINE"}
              </span>

              <h1>
                {ka
                  ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
                  : "Choose QR RETURN for your needs."}
              </h1>

              <p>
                {ka
                  ? "აირჩიეთ პროდუქტი და გააქტიურეთ თქვენი QR პროფილი რამდენიმე მარტივ ნაბიჯში."
                  : "Choose your product and activate your QR profile in a few simple steps."}
              </p>
            </div>

            <div className="shopCards">
              <a href="#how-to-order" className="shopCard">
                <span className="shopNumber">01</span>

                <div className="shopIcon">
                  <OrderIcon />
                </div>

                <h2>{ka ? "როგორ შევუკვეთო" : "How to Order"}</h2>

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
                <span className="shopNumber">02</span>

                <div className="shopIcon">
                  <StoreIcon />
                </div>

                <h2>{ka ? "მაღაზია" : "Store"}</h2>

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

      {/* ==================================================
          FAQ
      ================================================== */}

      {openMenu === "faq" && (
        <section className="megaMenu">
          <div className="megaInner faqGrid">
            <div className="sectionHeader">
              <span className="sectionNumber">03</span>
              <span className="eyebrow">FAQ</span>

              <h1>
                {ka
                  ? "ხშირად დასმული კითხვები"
                  : "Frequently Asked Questions"}
              </h1>

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
                    ? "არა. მპოვნელს არ სჭირდება რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა."
                    : "No. A finder does not need to register or download an app."
                }
              />

              <FAQ
                question={
                  ka
                    ? "რა ინფორმაციას ხედავს მპოვნელი?"
                    : "What information does a finder see?"
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
                    ? "შეიძლება რამდენიმე QR პროფილის მართვა?"
                    : "Can I manage multiple QR profiles?"
                }
                answer={
                  ka
                    ? "დიახ. ერთი ანგარიშიდან შესაძლებელია რამდენიმე QR პროფილის მართვა."
                    : "Yes. Multiple QR profiles can be managed from one account."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ==================================================
          CONTACT
      ================================================== */}

      {openMenu === "contact" && (
        <section className="megaMenu">
          <div className="megaInner contactGrid">
            <div className="sectionHeader">
              <span className="sectionNumber">04</span>
              <span className="eyebrow">QR RETURN SUPPORT</span>

              <h1>
                {ka ? "როგორ დაგეხმაროთ?" : "How can we help?"}
              </h1>

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

                <span className="supportLabel">LIVE CHAT</span>

                <h2>
                  {ka ? "მოგვწერეთ პირდაპირ" : "Chat with us"}
                </h2>

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

                <span className="supportLabel">
                  {ka ? "ტელეფონი" : "PHONE"}
                </span>

                <h2>QR RETURN მხარდაჭერა</h2>

                <p>
                  {ka
                    ? "დაგვიკავშირდით QR RETURN-ის სატელეფონო მხარდაჭერის საშუალებით. ოფიციალური ნომერი აქ დაემატება."
                    : "Contact QR RETURN phone support. The official number will be displayed here."}
                </p>

                <strong className="comingSoon">
                  {ka ? "ნომერი მალე დაემატება" : "Number coming soon"}
                </strong>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* შემდეგი სექციის ადგილი */}
      <section className="pageBody">
        <span>QR RETURN</span>

        <h2>
          {ka
            ? "შემდეგ მთავარ სექციას აქ დავამატებთ."
            : "The next homepage section will be added here."}
        </h2>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #ffffff;
          color: #1d3048;
        }

        /* HEADER */

        .header {
          position: relative;
          z-index: 100;
          width: 100%;
          background: #ffffff;
          border-bottom: 1px solid #e5eaf0;
        }

        .headerInner {
          width: calc(100% - 110px);
          max-width: 1360px;
          min-height: 80px;
          margin: 0 auto;

          display: grid;
          grid-template-columns: 205px 1fr auto;
          align-items: center;
          gap: 18px;
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
          color: white;
          background: #172b43;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #172b43;
          font-size: 16px;
          font-weight: 900;
        }

        .brandText span {
          margin-top: 3px;
          color: #909ba7;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .navigation {
          display: flex;
          align-items: center;
          gap: 27px;
        }

        .nav {
          padding: 29px 0;
          display: inline-flex;
          align-items: center;
          gap: 5px;

          border: 0;
          background: transparent;
          color: #1266e9;

          cursor: pointer;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
        }

        .nav:hover,
        .nav.active {
          color: #084ead;
        }

        /*
          მთელი მარჯვენა ბლოკი ოდნავ მარცხნივ
        */

        .actions {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-right: 30px;
        }

        /* LANGUAGES */

        .languages {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-right: 9px;
        }

        .languages button {
          padding: 6px 2px;
          border: 0;
          background: transparent;
          color: #7f8c9b;
          cursor: pointer;

          font-family: inherit;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.3px;
        }

        .languages button.selected {
          color: #1266e9;
        }

        .languageDivider {
          width: 1px;
          height: 14px;
          background: #d6dee7;
        }

        .accountButton,
        .adminButton {
          min-height: 40px;
          padding: 0 15px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: #ffffff;
          text-decoration: none;
          white-space: nowrap;

          font-size: 11px;
          font-weight: 850;
        }

        .accountButton {
          background: #1266e9;
          border: 1px solid #1266e9;
        }

        .adminButton {
          background: #172b43;
          border: 1px solid #172b43;
        }

        /* MEGA MENU */

        .megaMenu {
          position: relative;
          z-index: 90;
          width: 100%;

          background: #f8fbff;
          border-bottom: 1px solid #dfe7f0;

          box-shadow: 0 18px 48px rgba(28, 49, 76, 0.07);
        }

        .megaInner {
          width: calc(100% - 80px);
          max-width: 1240px;
          margin: 0 auto;
          padding: 45px 0 52px;
        }

        .sectionHeader {
          max-width: 670px;
          margin-bottom: 29px;
        }

        .sectionNumber {
          margin-right: 9px;
          color: #1266e9;
          font-size: 10px;
          font-weight: 900;
        }

        .eyebrow {
          color: #1266e9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .sectionHeader h1 {
          margin: 9px 0 0;
          color: #1d324c;

          font-size: 27px;
          line-height: 1.15;
          letter-spacing: -0.8px;
        }

        .sectionHeader > p {
          max-width: 620px;
          margin: 11px 0 0;

          color: #6d7d90;
          font-size: 13px;
          line-height: 1.65;
        }

        /* ABOUT — სამივე ლურჯი */

        .aboutCards {
          display: grid;
          grid-template-columns: 1.25fr 0.875fr 0.875fr;
          gap: 14px;
        }

        .blueCard {
          min-height: 330px;
          padding: 25px;

          border-radius: 17px;
          border: 1px solid rgba(255, 255, 255, 0.14);

          color: #ffffff;
          background: linear-gradient(145deg, #1266e9 0%, #0b55c9 100%);

          box-shadow: 0 15px 32px rgba(18, 102, 233, 0.16);
        }

        .cardNumber {
          color: rgba(255, 255, 255, 0.7);
          font-size: 10px;
          font-weight: 900;
        }

        .founderIdentity {
          margin-top: 17px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .founderAvatar {
          width: 47px;
          height: 47px;

          display: grid;
          place-items: center;

          border: 1px solid rgba(255, 255, 255, 0.42);
          border-radius: 50%;

          color: #1266e9;
          background: #ffffff;

          font-size: 11px;
          font-weight: 900;
        }

        .founderIdentity strong,
        .founderIdentity span,
        .founderIdentity small {
          display: block;
        }

        .founderIdentity strong {
          color: white;
          font-size: 13px;
        }

        .founderIdentity span {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.83);
          font-size: 10px;
        }

        .founderIdentity small {
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .whiteIcon {
          width: 43px;
          height: 43px;
          margin-top: 18px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #ffffff;
        }

        .blueCard h2 {
          margin: 19px 0 0;
          color: white;
          font-size: 17px;
          line-height: 1.3;
        }

        .blueCard p {
          margin: 11px 0 0;
          color: rgba(255, 255, 255, 0.88);

          font-size: 12px;
          line-height: 1.7;
        }

        .founderQuote {
          margin: 15px 0;
          padding: 14px 15px;

          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 11px;

          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;

          font-size: 12px;
          font-weight: 700;
          line-height: 1.65;
        }

        .cardStatement {
          display: block;
          margin-top: 21px;

          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
        }

        /* SHOP */

        .shopCards {
          max-width: 900px;

          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .shopCard {
          min-height: 235px;
          padding: 26px;

          border: 1px solid #cdddf4;
          border-radius: 16px;

          color: inherit;
          background: #ffffff;
          text-decoration: none;

          transition: 0.2s ease;
        }

        .shopCard:hover {
          transform: translateY(-2px);
          border-color: #a9c9f5;
          box-shadow: 0 12px 28px rgba(32, 76, 133, 0.08);
        }

        .shopNumber {
          color: #1266e9;
          font-size: 11px;
          font-weight: 900;
        }

        .shopIcon {
          width: 45px;
          height: 45px;
          margin-top: 17px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;
          background: #edf4ff;
        }

        .shopCard h2 {
          margin: 17px 0 0;
          color: #273d56;

          font-size: 18px;
          line-height: 1.3;
        }

        .shopCard p {
          max-width: 430px;
          margin: 11px 0 0;

          color: #697a8f;
          font-size: 13px;
          line-height: 1.7;
        }

        .shopCard strong {
          display: block;
          margin-top: 22px;

          color: #1266e9;
          font-size: 12px;
          font-weight: 900;
        }

        /* FAQ */

        .faqGrid,
        .contactGrid {
          display: grid;
          grid-template-columns: 0.65fr 1.35fr;
          gap: 60px;
        }

        .faqList {
          border-top: 1px solid #dbe4ed;
        }

        .faqItem {
          padding: 17px 0;
          border-bottom: 1px solid #dbe4ed;
        }

        .faqItem h3 {
          margin: 0;
          color: #273d56;
          font-size: 14px;
        }

        .faqItem p {
          max-width: 700px;
          margin: 7px 0 0;

          color: #6f7f92;
          font-size: 12px;
          line-height: 1.65;
        }

        /* CONTACT */

        .supportCards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .supportCard {
          min-height: 245px;
          padding: 26px;

          border: 1px solid #cdddf4;
          border-radius: 16px;

          color: inherit;
          background: #ffffff;
          text-decoration: none;
        }

        a.supportCard:hover {
          border-color: #a9c9f5;
          background: #f7faff;
        }

        .supportIcon {
          width: 50px;
          height: 50px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          color: #1266e9;
          background: #eaf3ff;
        }

        .supportLabel {
          display: block;
          margin-top: 18px;

          color: #1266e9;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .supportCard h2 {
          margin: 7px 0 0;
          color: #263d56;

          font-size: 17px;
          line-height: 1.3;
        }

        .supportCard p {
          margin: 9px 0 0;

          color: #697a8f;
          font-size: 13px;
          line-height: 1.65;
        }

        .supportCard strong {
          display: block;
          margin-top: 20px;

          color: #1266e9;
          font-size: 12px;
          font-weight: 900;
        }

        .comingSoon {
          color: #66798e !important;
        }

        /* PAGE */

        .pageBody {
          min-height: 500px;
          padding: 115px 30px;
          text-align: center;
        }

        .pageBody span {
          color: #1266e9;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .pageBody h2 {
          max-width: 620px;
          margin: 14px auto 0;

          color: #223750;
          font-size: 29px;
          line-height: 1.16;
        }

        /* RESPONSIVE */

        @media (max-width: 1150px) {
          .headerInner {
            width: calc(100% - 40px);
          }

          .navigation {
            gap: 16px;
          }

          .nav {
            font-size: 11px;
          }

          .actions {
            padding-right: 0;
          }
        }

        @media (max-width: 980px) {
          .navigation {
            display: none;
          }

          .headerInner {
            grid-template-columns: auto 1fr;
          }

          .actions {
            justify-self: end;
          }

          .aboutCards {
            grid-template-columns: 1fr;
          }

          .faqGrid,
          .contactGrid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }

        @media (max-width: 680px) {
          .headerInner,
          .megaInner {
            width: calc(100% - 26px);
          }

          .brandText span {
            display: none;
          }

          .languages button {
            font-size: 10px;
          }

          .accountButton,
          .adminButton {
            min-height: 36px;
            padding: 0 9px;
            font-size: 9px;
          }

          .shopCards,
          .supportCards {
            grid-template-columns: 1fr;
          }

          .sectionHeader h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </main>
  );
}

/* ==================================================
   SMALL UI FUNCTIONS
================================================== */

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

function TargetIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function VisionIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
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
      strokeWidth="1.8"
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
      strokeWidth="1.8"
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
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2Z" />
      <path d="M20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z" />
      <path d="M17 18c-1 2-3 2-5 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
