"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Menu =
  | "about"
  | "shop"
  | "faq"
  | "contact"
  | null;

export default function HomePage() {
  const [language, setLanguage] =
    useState<Lang>("ka");

  const [openMenu, setOpenMenu] =
    useState<Menu>(null);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const ka = language === "ka";

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      const {
        data: adminRow,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) {
        console.warn(
          "Admin check:",
          adminError.message
        );
      }

      setIsAdmin(Boolean(adminRow));
    }

    void loadUser();

    const { data } =
      supabase.auth.onAuthStateChange(
        () => {
          void loadUser();
        }
      );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  function toggleMenu(
    menu: Exclude<Menu, null>
  ) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  return (
    <main className="page">
      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">
        <div className="headerInner">
          <a
            href="/"
            className="brand"
          >
            <div className="logoMark">
              <QRIcon />
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART LOST &amp; FOUND
              </span>
            </div>
          </a>

          <nav className="navigation">
            <button
              type="button"
              className={
                openMenu === "about"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("about")
              }
            >
              {ka
                ? "ჩვენ შესახებ"
                : "About"}

              <Chevron
                open={
                  openMenu === "about"
                }
              />
            </button>

            <button
              type="button"
              className={
                openMenu === "shop"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("shop")
              }
            >
              {ka
                ? "ონლაინ შეძენა"
                : "Shop Online"}

              <Chevron
                open={
                  openMenu === "shop"
                }
              />
            </button>

            <button
              type="button"
              className={
                openMenu === "faq"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("faq")
              }
            >
              {ka
                ? "ხშირად დასმული კითხვები"
                : "FAQ"}
            </button>

            <button
              type="button"
              className={
                openMenu === "contact"
                  ? "nav active"
                  : "nav"
              }
              onClick={() =>
                toggleMenu("contact")
              }
            >
              {ka
                ? "კონტაქტი"
                : "Contact"}
            </button>
          </nav>

          <div className="actions">
            {/* ენები ახლა შესვლამდეა */}

            <div className="languages">
              <button
                type="button"
                className={
                  language === "ka"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setLanguage("ka")
                }
              >
                GEO
              </button>

              <span />

              <button
                type="button"
                className={
                  language === "en"
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setLanguage("en")
                }
              >
                ENG
              </button>
            </div>

            {/* მხოლოდ Admin ხედავს */}

            {isAdmin && (
              <a
                href="/admin"
                className="adminButton"
              >
                {ka
                  ? "ადმინ პანელი"
                  : "Admin Panel"}
              </a>
            )}

            {isLoggedIn ? (
              <a
                href="/account"
                className="blueButton"
              >
                {ka
                  ? "ჩემი ანგარიში"
                  : "My Account"}
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="blueButton"
                >
                  {ka
                    ? "შესვლა"
                    : "Sign In"}
                </a>

                <a
                  href="/signup"
                  className="blueButton"
                >
                  {ka
                    ? "რეგისტრაცია"
                    : "Register"}
                </a>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ======================================
          ABOUT
      ====================================== */}

      {openMenu === "about" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="sectionIntro">
              <span className="eyebrow">
                QR RETURN
              </span>

              <h1>
                {ka
                  ? "ჩვენ შესახებ"
                  : "About QR RETURN"}
              </h1>

              <p>
                {ka
                  ? "იდეა, მისია და ხედვა, რომლებზეც QR RETURN შეიქმნა."
                  : "The idea, mission and vision behind QR RETURN."}
              </p>
            </div>

            <div className="aboutCards">
              {/* FOUNDER */}

              <article className="aboutCard founderCard">
                <span className="number">
                  01
                </span>

                <div className="founderIdentity">
                  <div className="founderAvatar">
                    NK
                  </div>

                  <div>
                    <strong>
                      Nino Kuprava
                    </strong>

                    <span>
                      Founder &amp; CEO
                    </span>

                    <small>
                      QR RETURN
                    </small>
                  </div>
                </div>

                <h2>
                  {ka
                    ? "დამფუძნებლის სიტყვა"
                    : "Founder’s Message"}
                </h2>

                {ka ? (
                  <>
                    <p>
                      QR RETURN-ის იდეა ერთი
                      მარტივი შეკითხვიდან
                      გაჩნდა: რა ხდება მაშინ,
                      როდესაც ადამიანი კარგავს
                      მისთვის მნიშვნელოვან
                      ნივთს, საყვარელ ცხოველს,
                      ან როდესაც ოჯახის წევრს
                      გადაუდებელ სიტუაციაში
                      დახმარება სჭირდება და მის
                      შესახებ აუცილებელი
                      ინფორმაცია ხელმისაწვდომი
                      არ არის?
                    </p>

                    <p>
                      ხშირად მპოვნელს დახმარება
                      ნამდვილად სურს, მაგრამ არ
                      იცის, ვის დაუკავშირდეს.
                      დაკარგულ ცხოველს არ
                      შეუძლია პატრონის ვინაობის
                      თქმა, ნივთზე კი ხშირად არ
                      არსებობს ინფორმაცია,
                      რომელიც მის დაბრუნებას
                      გაამარტივებს.
                    </p>

                    <div className="quote">
                      QR RETURN-ის მთავარი
                      ღირებულება მხოლოდ QR
                      კოდში არ არის — ეს არის
                      სწრაფად შექმნილი სწორი
                      კავშირი მაშინ, როდესაც
                      დრო, უსაფრთხოება და
                      ინფორმაცია ყველაზე
                      მნიშვნელოვანია.
                    </div>

                    <p>
                      ჩემთვის განსაკუთრებით
                      მნიშვნელოვანია, რომ
                      მომხმარებელი თავად
                      აკონტროლებდეს საკუთარ
                      ინფორმაციას — რას
                      აჩვენებს, ვის აჩვენებს და
                      რა გზით შეიძლება მასთან
                      დაკავშირება.
                    </p>

                    <p>
                      ჩემი მიზანია QR RETURN
                      გახდეს პატარა, მაგრამ
                      მნიშვნელოვანი დამცავი
                      რგოლი ადამიანებს, მათ
                      საყვარელ ცხოველებსა და
                      მათთვის ძვირფას ნივთებს
                      შორის.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      QR RETURN began with one
                      simple question: what
                      happens when someone loses
                      something important, a
                      beloved pet, or needs
                      urgent help when essential
                      information is unavailable?
                    </p>

                    <p>
                      QR RETURN was created to
                      make the right connection
                      faster, simpler and safer.
                    </p>
                  </>
                )}
              </article>

              {/* MISSION */}

              <article className="aboutCard">
                <span className="number">
                  02
                </span>

                <div className="smallIcon">
                  <TargetIcon />
                </div>

                <h2>
                  {ka
                    ? "ჩვენი მისია"
                    : "Our Mission"}
                </h2>

                <p>
                  {ka
                    ? "ჩვენი მისიაა ერთი QR სკანირებით შევქმნათ სწრაფი, მარტივი და უსაფრთხო კავშირი მპოვნელსა და მფლობელს შორის."
                    : "Our mission is to create a fast, simple and secure connection between a finder and an owner through one QR scan."}
                </p>

                <p>
                  {ka
                    ? "მომხმარებელი თავად აკონტროლებს, რა ინფორმაცია გამოჩნდება და რა გზით შეიძლება მასთან დაკავშირება."
                    : "The user remains in control of what information is shown and how others may make contact."}
                </p>

                <strong className="statement">
                  {ka
                    ? "მარტივი. სწრაფი. უსაფრთხო."
                    : "Simple. Fast. Secure."}
                </strong>
              </article>

              {/* VISION */}

              <article className="aboutCard">
                <span className="number">
                  03
                </span>

                <div className="smallIcon">
                  <VisionIcon />
                </div>

                <h2>
                  {ka
                    ? "ჩვენი ხედვა"
                    : "Our Vision"}
                </h2>

                <p>
                  {ka
                    ? "ჩვენი ხედვაა QR RETURN გახდეს უნივერსალური დაცვის სისტემა ნივთებისთვის, ცხოველებისა და Emergency პროფილებისთვის."
                    : "Our vision is for QR RETURN to become a universal protection system for belongings, pets and Emergency profiles."}
                </p>

                <p>
                  {ka
                    ? "QR კოდი უნდა იყოს არა მხოლოდ იდენტიფიკატორი, არამედ სანდო კავშირი სწორ ადამიანს, სწორ ინფორმაციასა და საჭირო მომენტს შორის."
                    : "A QR code should be more than an identifier — it should connect the right person with the right information at the right moment."}
                </p>

                <strong className="statement">
                  {ka
                    ? "ერთი სისტემა. მეტი დაცულობა."
                    : "One system. More protection."}
                </strong>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* ======================================
          ONLINE SHOP
      ====================================== */}

      {openMenu === "shop" && (
        <section className="megaMenu">
          <div className="megaInner">
            <div className="sectionIntro">
              <span className="sectionIndex">
                02
              </span>

              <span className="eyebrow">
                {ka
                  ? "ონლაინ შეძენა"
                  : "SHOP ONLINE"}
              </span>

              <h1>
                {ka
                  ? "აირჩიეთ QR RETURN თქვენი საჭიროებისთვის."
                  : "Choose QR RETURN for your needs."}
              </h1>

              <p>
                {ka
                  ? "პროდუქტის შერჩევიდან QR პროფილის გააქტიურებამდე — ყველაფერი რამდენიმე მარტივ ნაბიჯში."
                  : "From choosing a product to activating your QR profile in a few simple steps."}
              </p>
            </div>

            <div className="shopCards">
              <a
                href="#how-to-order"
                className="shopCard"
              >
                <span className="number">
                  01
                </span>

                <div className="smallIcon">
                  <OrderIcon />
                </div>

                <h2>
                  {ka
                    ? "როგორ შევუკვეთო"
                    : "How to Order"}
                </h2>

                <p>
                  {ka
                    ? "აირჩიეთ თქვენთვის საჭირო QR პროდუქტი, შეიძინეთ ონლაინ და მიღების შემდეგ დაარეგისტრირეთ თქვენს QR RETURN ანგარიშზე."
                    : "Choose your QR product, purchase it online and register it to your QR RETURN account after delivery."}
                </p>

                <strong>
                  {ka
                    ? "გაიგეთ მეტი"
                    : "Learn more"}
                  {"  →"}
                </strong>
              </a>

              <a
                href="/store"
                className="shopCard featured"
              >
                <span className="number">
                  02
                </span>

                <div className="smallIcon">
                  <StoreIcon />
                </div>

                <h2>
                  {ka
                    ? "მაღაზია"
                    : "Store"}
                </h2>

                <p>
                  {ka
                    ? "იხილეთ QR RETURN-ის პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                    : "Explore QR RETURN products for belongings, pets and Emergency use."}
                </p>

                <strong>
                  {ka
                    ? "პროდუქტების ნახვა"
                    : "View Products"}
                  {"  →"}
                </strong>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ======================================
          FAQ
      ====================================== */}

      {openMenu === "faq" && (
        <section className="megaMenu">
          <div className="megaInner faqLayout">
            <div>
              <span className="eyebrow">
                FAQ
              </span>

              <h1 className="menuTitle">
                {ka
                  ? "ხშირად დასმული კითხვები"
                  : "Frequently Asked Questions"}
              </h1>

              <p className="menuDescription">
                {ka
                  ? "ყველაზე მნიშვნელოვანი ინფორმაცია QR RETURN-ის გამოყენების შესახებ."
                  : "Essential information about using QR RETURN."}
              </p>
            </div>

            <div className="faqList">
              <FAQ
                question={
                  ka
                    ? "რა არის QR RETURN?"
                    : "What is QR RETURN?"
                }
                answer={
                  ka
                    ? "QR RETURN არის QR-ზე დაფუძნებული სისტემა ნივთების, ცხოველებისა და Emergency პროფილებისთვის."
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
                    ? "არა. მპოვნელს რეგისტრაცია ან აპლიკაციის ჩამოტვირთვა არ სჭირდება."
                    : "No. The finder does not need an account or an app."
                }
              />

              <FAQ
                question={
                  ka
                    ? "რა ინფორმაციას დაინახავს მპოვნელი?"
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
                    : "Can I manage multiple profiles?"
                }
                answer={
                  ka
                    ? "დიახ. ერთი ანგარიშიდან შეგიძლიათ მართოთ რამდენიმე QR პროფილი."
                    : "Yes. Multiple QR profiles can be managed from one account."
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
                    ? "Emergency პროფილი გამოიყენება მომხმარებლის მიერ წინასწარ არჩეული მნიშვნელოვანი ინფორმაციისა და საგანგებო კონტაქტების სწრაფად მისაწვდომად."
                    : "An Emergency profile provides fast access to selected essential information and emergency contacts."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================
          CONTACT
      ====================================== */}

      {openMenu === "contact" && (
        <section className="megaMenu">
          <div className="megaInner contactLayout">
            <div>
              <span className="eyebrow">
                QR RETURN SUPPORT
              </span>

              <h1 className="menuTitle">
                {ka
                  ? "როგორ დაგეხმაროთ?"
                  : "How can we help?"}
              </h1>

              <p className="menuDescription">
                {ka
                  ? "დაგვიკავშირდით ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ. აირჩიეთ დახმარების ტიპი."
                  : "Contact us about your account, QR profile, order or product. Choose the type of support you need."}
              </p>
            </div>

            <div className="supportCards">
              <a
                href="/support"
                className="supportCard"
              >
                <div className="agentAvatar">
                  <div className="hair" />
                  <div className="face" />
                  <div className="headset">
                    <i />
                  </div>
                </div>

                <div className="supportText">
                  <small>
                    LIVE CHAT
                  </small>

                  <h2>
                    {ka
                      ? "მოგვწერეთ პირდაპირ"
                      : "Chat with us"}
                  </h2>

                  <p>
                    {ka
                      ? "გახსენით QR RETURN-ის მხარდაჭერის Live Chat და მოგვწერეთ თქვენი საკითხის შესახებ."
                      : "Open QR RETURN Live Chat and tell us how we can help."}
                  </p>

                  <strong>
                    {ka
                      ? "Live Chat-ის გახსნა"
                      : "Open Live Chat"}
                    {"  →"}
                  </strong>
                </div>
              </a>

              <div className="supportCard">
                <div className="phoneIcon">
                  <PhoneIcon />
                </div>

                <div className="supportText">
                  <small>
                    {ka
                      ? "ტელეფონი"
                      : "PHONE"}
                  </small>

                  <h2>
                    QR RETURN Support
                  </h2>

                  <p>
                    {ka
                      ? "სატელეფონო მხარდაჭერის ოფიციალური ნომერი აქ გამოჩნდება მისი გააქტიურების შემდეგ."
                      : "The official support phone number will appear here once activated."}
                  </p>

                  <span className="phoneStatus">
                    {ka
                      ? "სატელეფონო მხარდაჭერა"
                      : "Phone Support"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* დროებით */}

      <section className="preview">
        <span>
          QR RETURN
        </span>

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

          border-bottom:
            1px solid #e5eaf0;
        }

        .headerInner {
          width:
            calc(100% - 72px);

          max-width: 1400px;
          min-height: 78px;

          margin: 0 auto;

          display: grid;

          grid-template-columns:
            210px 1fr auto;

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

          color: #ffffff;

          background: #162a43;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #162a43;

          font-size: 16px;
          font-weight: 900;
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

          gap: 27px;

          transform:
            translateX(-18px);
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

          font-size: 13px;
          font-weight: 800;

          white-space: nowrap;
        }

        .nav:hover,
        .nav.active {
          color: #084dad;
        }

        .actions {
          display: flex;
          align-items: center;

          gap: 7px;
        }

        /* LANGUAGES */

        .languages {
          margin-right: 8px;

          display: flex;
          align-items: center;

          gap: 6px;
        }

        .languages button {
          padding: 5px 2px;

          border: 0;

          color: #8d98a5;
          background: transparent;

          cursor: pointer;

          font-size: 10px;
          font-weight: 900;
        }

        .languages button.selected {
          color: #1266e9;
        }

        .languages span {
          width: 1px;
          height: 13px;

          background: #d8dfe6;
        }

        .blueButton,
        .adminButton {
          min-height: 39px;

          padding: 0 14px;

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

        .blueButton {
          border:
            1px solid #1266e9;

          background: #1266e9;
        }

        .adminButton {
          border:
            1px solid #172b43;

          background: #172b43;
        }

        /* MEGA MENU */

        .megaMenu {
          position: relative;
          z-index: 90;

          width: 100%;

          background: #f8fbff;

          border-bottom:
            1px solid #dfe7f0;

          box-shadow:
            0 18px 48px
            rgba(
              28,
              49,
              76,
              0.07
            );
        }

        .megaInner {
          width:
            calc(100% - 72px);

          max-width: 1240px;

          margin: auto;

          padding: 44px 0 50px;
        }

        .sectionIntro {
          max-width: 650px;

          margin-bottom: 26px;
        }

        .sectionIndex {
          margin-right: 9px;

          color: #1266e9;

          font-size: 8px;
          font-weight: 900;
        }

        .eyebrow {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .sectionIntro h1,
        .menuTitle {
          margin: 8px 0 0;

          color: #1d324c;

          font-size: 25px;

          line-height: 1.15;

          letter-spacing: -0.8px;
        }

        .sectionIntro p,
        .menuDescription {
          max-width: 560px;

          margin: 10px 0 0;

          color: #728095;

          font-size: 11px;
          line-height: 1.65;
        }

        /* ABOUT */

        .aboutCards {
          display: grid;

          grid-template-columns:
            1.3fr 0.85fr 0.85fr;

          gap: 12px;
        }

        .aboutCard,
        .shopCard,
        .supportCard {
          border:
            1px solid #cfe0fa;

          border-radius: 15px;

          background: #ffffff;

          box-shadow:
            0 7px 22px
            rgba(
              40,
              79,
              130,
              0.04
            );
        }

        .aboutCard {
          padding: 22px;
        }

        .founderCard {
          border-top:
            3px solid #1266e9;
        }

        .number {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;
        }

        .founderIdentity {
          margin-top: 14px;

          display: flex;
          align-items: center;

          gap: 10px;
        }

        .founderAvatar {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #ffffff;

          background: #1266e9;

          font-size: 10px;
          font-weight: 900;
        }

        .founderIdentity strong,
        .founderIdentity span,
        .founderIdentity small {
          display: block;
        }

        .founderIdentity strong {
          color: #21364f;

          font-size: 12px;
        }

        .founderIdentity span {
          margin-top: 2px;

          color: #718095;

          font-size: 9px;
        }

        .founderIdentity small {
          margin-top: 2px;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;
        }

        .aboutCard h2 {
          margin: 17px 0 0;

          color: #283d55;

          font-size: 15px;
        }

        .aboutCard p {
          margin: 9px 0 0;

          color: #6e7d90;

          font-size: 10.5px;

          line-height: 1.65;
        }

        .quote {
          margin: 14px 0;

          padding: 13px 14px;

          border-radius: 10px;

          color: #29425f;

          background: #edf5ff;

          font-size: 10.5px;

          line-height: 1.58;

          font-weight: 700;
        }

        .smallIcon {
          width: 40px;
          height: 40px;

          margin-top: 15px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1266e9;

          background: #edf4ff;
        }

        .statement {
          display: block;

          margin-top: 18px;

          color: #1266e9;

          font-size: 9px;
          font-weight: 850;
        }

        /* SHOP */

        .shopCards {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 12px;

          max-width: 850px;
        }

        .shopCard {
          min-height: 205px;

          padding: 22px;

          color: inherit;

          text-decoration: none;
        }

        .shopCard.featured {
          background: #f0f6ff;
        }

        .shopCard h2 {
          margin: 14px 0 0;

          color: #273d56;

          font-size: 15px;
        }

        .shopCard p {
          max-width: 420px;

          margin: 9px 0 0;

          color: #718095;

          font-size: 10.5px;

          line-height: 1.65;
        }

        .shopCard strong {
          display: block;

          margin-top: 20px;

          color: #1266e9;

          font-size: 9.5px;

          font-weight: 850;
        }

        /* FAQ */

        .faqLayout,
        .contactLayout {
          display: grid;

          grid-template-columns:
            0.65fr 1.35fr;

          gap: 56px;
        }

        .faqList {
          border-top:
            1px solid #dce5ee;
        }

        .faqItem {
          padding: 14px 0;

          border-bottom:
            1px solid #dce5ee;
        }

        .faqItem h3 {
          margin: 0;

          color: #2c4058;

          font-size: 12px;
        }

        .faqItem p {
          max-width: 700px;

          margin: 6px 0 0;

          color: #748296;

          font-size: 10px;

          line-height: 1.65;
        }

        /* CONTACT */

        .supportCards {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 12px;
        }

        .supportCard {
          min-height: 170px;

          padding: 21px;

          display: grid;

          grid-template-columns:
            58px 1fr;

          align-items: center;

          gap: 15px;

          color: inherit;

          text-decoration: none;
        }

        a.supportCard:hover {
          border-color: #a9c9f6;

          background: #f6faff;
        }

        .agentAvatar {
          width: 58px;
          height: 58px;

          position: relative;

          overflow: hidden;

          border-radius: 50%;

          background: #dceaff;
        }

        .hair {
          width: 38px;
          height: 34px;

          position: absolute;

          z-index: 1;

          left: 10px;
          top: 7px;

          border-radius:
            50% 50% 38% 38%;

          background: #26384e;
        }

        .face {
          width: 27px;
          height: 32px;

          position: absolute;

          z-index: 2;

          left: 16px;
          top: 15px;

          border-radius:
            48% 48% 43% 43%;

          background: #f3c3a3;
        }

        .headset {
          width: 41px;
          height: 34px;

          position: absolute;

          z-index: 3;

          left: 8px;
          top: 13px;

          border:
            2px solid #1266e9;

          border-bottom: 0;

          border-radius:
            22px 22px 0 0;
        }

        .headset i {
          width: 11px;
          height: 3px;

          position: absolute;

          right: -5px;
          bottom: 1px;

          border-radius: 5px;

          background: #1266e9;
        }

        .phoneIcon {
          width: 50px;
          height: 50px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: #1266e9;

          background: #edf4ff;
        }

        .supportText small {
          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .supportText h2 {
          margin: 5px 0 0;

          color: #273d56;

          font-size: 13px;
        }

        .supportText p {
          margin: 6px 0 0;

          color: #718095;

          font-size: 10px;

          line-height: 1.55;
        }

        .supportText strong {
          display: block;

          margin-top: 11px;

          color: #1266e9;

          font-size: 9px;
        }

        .phoneStatus {
          display: inline-block;

          margin-top: 11px;

          padding: 5px 8px;

          border-radius: 7px;

          color: #1266e9;

          background: #edf4ff;

          font-size: 8px;
          font-weight: 800;
        }

        /* PREVIEW */

        .preview {
          min-height: 500px;

          padding: 115px 30px;

          text-align: center;
        }

        .preview span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .preview h2 {
          max-width: 600px;

          margin: 14px auto 0;

          color: #223750;

          font-size: 29px;

          line-height: 1.16;
        }

        @media (
          max-width: 1100px
        ) {
          .navigation {
            gap: 14px;

            transform: none;
          }

          .nav {
            font-size: 11px;
          }
        }

        @media (
          max-width: 950px
        ) {
          .navigation {
            display: none;
          }

          .headerInner {
            grid-template-columns:
              auto 1fr;
          }

          .actions {
            justify-self: end;
          }

          .aboutCards {
            grid-template-columns:
              1fr;
          }

          .faqLayout,
          .contactLayout {
            grid-template-columns:
              1fr;
          }
        }

        @media (
          max-width: 650px
        ) {
          .headerInner,
          .megaInner {
            width:
              calc(100% - 26px);
          }

          .headerInner {
            min-height: 70px;
          }

          .brandText span {
            display: none;
          }

          .languages {
            margin-right: 2px;
          }

          .blueButton,
          .adminButton {
            min-height: 35px;

            padding: 0 8px;

            font-size: 9px;
          }

          .shopCards,
          .supportCards {
            grid-template-columns:
              1fr;
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

function Chevron({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      style={{
        transform: open
          ? "rotate(180deg)"
          : "rotate(0deg)",
        transition:
          "transform .2s ease",
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
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />
      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />
      <path d="M14 14h3v3h3v4h-6z" />
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
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
      />
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
      strokeWidth="1.8"
    >
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg
      width="20"
      height="20"
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
      width="20"
      height="20"
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

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
