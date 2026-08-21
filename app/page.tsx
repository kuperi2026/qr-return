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

      const { data: admin } =
        await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

      setIsAdmin(Boolean(admin));
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

      {/* ================= HEADER ================= */}

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

            {/* LANGUAGES — შესვლამდე */}

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

            {/* ADMIN — მხოლოდ ADMIN ხედავს */}

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

      {/* ================= ABOUT ================= */}

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
                <span className="cardNumber">
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
                    : "Founder's Message"}
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
                      დახმარება სჭირდება და
                      მის შესახებ აუცილებელი
                      ინფორმაცია
                      ხელმისაწვდომი არ არის?
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

                    <p>
                      Emergency სამაჯურის
                      შემთხვევაში თითოეულ
                      წუთსაც შეიძლება დიდი
                      მნიშვნელობა ჰქონდეს —
                      განსაკუთრებით მაშინ,
                      როდესაც ადამიანი თავად
                      ვერ ახერხებს საჭირო
                      ინფორმაციის მიწოდებას.
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
                      QR RETURN ჩემთვის მხოლოდ
                      ტექნოლოგიური პროდუქტი არ
                      არის. ჩემი მიზანია, ის
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
                      information is not
                      available?
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
                <span className="cardNumber">
                  02
                </span>

                <div className="cardIcon">
                  <TargetIcon />
                </div>

                <h2>
                  {ka
                    ? "ჩვენი მისია"
                    : "Our Mission"}
                </h2>

                <p>
                  {ka
                    ? "ჩვენი მისიაა ერთი QR სკანირებით შევქმნათ პირდაპირი, უსაფრთხო და მარტივი კავშირი მპოვნელსა და მფლობელს შორის."
                    : "Our mission is to create a direct, simple and secure connection between a finder and an owner through a single QR scan."}
                </p>

                <p>
                  {ka
                    ? "ნივთის, ცხოველის თუ Emergency პროფილის შემთხვევაში მომხმარებელი თავად აკონტროლებს, რა ინფორმაცია გახდება ხელმისაწვდომი და როგორ შეძლებს სხვა ადამიანი მასთან დაკავშირებას."
                    : "Users remain in control of what information is shared and how others can contact them."}
                </p>

                <strong className="cardStatement">
                  {ka
                    ? "მარტივი. სწრაფი. უსაფრთხო."
                    : "Simple. Fast. Secure."}
                </strong>
              </article>

              {/* VISION */}

              <article className="aboutCard">
                <span className="cardNumber">
                  03
                </span>

                <div className="cardIcon">
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
                    ? "ჩვენ გვინდა QR კოდი იქცეს არა მხოლოდ იდენტიფიკატორად, არამედ სანდო კავშირად სწორ ადამიანს, სწორ ინფორმაციასა და საჭირო მომენტს შორის."
                    : "We want the QR code to become more than an identifier — a trusted connection between the right person, the right information and the right moment."}
                </p>

                <strong className="cardStatement">
                  {ka
                    ? "ერთი სისტემა. მრავალი დაცული რამ."
                    : "One system. More protected."}
                </strong>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* ================= SHOP ================= */}

      {openMenu === "shop" && (
        <section className="megaMenu">
          <div className="megaInner shopLayout">

            <article className="shopCard">
              <span className="cardNumber">
                01
              </span>

              <h2>
                {ka
                  ? "როგორ შევუკვეთო"
                  : "How to Order"}
              </h2>

              <p>
                {ka
                  ? "აირჩიეთ თქვენთვის საჭირო QR RETURN პროდუქტი, გაიარეთ რეგისტრაცია ან შედით ანგარიშში, დაასრულეთ ონლაინ შეკვეთა და პროდუქტის მიღების შემდეგ დაარეგისტრირეთ QR კოდი შესაბამის პროფილზე."
                  : "Choose your QR RETURN product, sign in or register, complete your order and connect the QR code to the relevant profile after delivery."}
              </p>

              <div className="orderSteps">
                <span>01 არჩევა</span>
                <span>02 რეგისტრაცია</span>
                <span>03 შეკვეთა</span>
                <span>04 აქტივაცია</span>
              </div>
            </article>

            <a
              href="/store"
              className="shopCard storeCard"
            >
              <span className="cardNumber">
                02
              </span>

              <h2>
                {ka
                  ? "მაღაზია"
                  : "Store"}
              </h2>

              <p>
                {ka
                  ? "იხილეთ QR RETURN-ის ხელმისაწვდომი პროდუქტები ნივთებისთვის, ცხოველებისა და Emergency გამოყენებისთვის."
                  : "Explore QR RETURN products for belongings, pets and Emergency use."}
              </p>

              <strong>
                {ka
                  ? "პროდუქტების ნახვა"
                  : "View Products"}
                {" →"}
              </strong>
            </a>
          </div>
        </section>
      )}

      {/* ================= FAQ ================= */}

      {openMenu === "faq" && (
        <section className="megaMenu">
          <div className="megaInner faqLayout">

            <div className="faqIntro">
              <span className="eyebrow">
                FAQ
              </span>

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
                    : "No. The finder does not need to register or download an app."
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
                    ? "მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც თავად გაქვთ გააქტიურებული."
                    : "Only the information you have chosen to make visible."
                }
              />

              <FAQ
                question={
                  ka
                    ? "შემიძლია რამდენიმე პროფილის მართვა?"
                    : "Can I manage multiple profiles?"
                }
                answer={
                  ka
                    ? "დიახ. ერთი ანგარიშიდან შესაძლებელია რამდენიმე QR პროფილის მართვა."
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
                    ? "Emergency პროფილი გამოიყენება საჭირო სიტუაციაში მომხმარებლის მიერ წინასწარ შერჩეული მნიშვნელოვანი ინფორმაციის სწრაფად გასაზიარებლად."
                    : "An Emergency profile provides selected essential information when assistance is needed."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTACT ================= */}

      {openMenu === "contact" && (
        <section className="megaMenu">
          <div className="megaInner contactLayout">

            <div className="contactIntro">
              <span className="eyebrow">
                QR RETURN SUPPORT
              </span>

              <h2>
                {ka
                  ? "როგორ დაგეხმაროთ?"
                  : "How can we help?"}
              </h2>

              <p>
                {ka
                  ? "დაგვიკავშირდით ანგარიშის, QR პროფილის, შეკვეთის ან პროდუქტის შესახებ."
                  : "Contact us about your account, QR profile, order or product."}
              </p>
            </div>

            <div className="supportCards">

              <a
                href="/support"
                className="supportCard"
              >
                <div className="agentAvatar">
                  <div className="agentHair" />
                  <div className="agentFace" />
                  <div className="headset">
                    <span />
                  </div>
                </div>

                <div className="supportCopy">
                  <small>
                    LIVE CHAT
                  </small>

                  <h3>
                    {ka
                      ? "მოგვწერეთ პირდაპირ"
                      : "Chat with our team"}
                  </h3>

                  <p>
                    {ka
                      ? "QR RETURN-ის მხარდაჭერის გუნდი დაგეხმარებათ ანგარიშის, QR პროფილისა და შეკვეთის საკითხებში."
                      : "Our support team can help with your account, QR profile and order."}
                  </p>

                  <strong>
                    {ka
                      ? "Live Chat-ის გახსნა"
                      : "Open Live Chat"}
                    {" →"}
                  </strong>
                </div>
              </a>

              <div className="supportCard">
                <div className="supportIcon">
                  <PhoneIcon />
                </div>

                <div className="supportCopy">
                  <small>
                    {ka
                      ? "ტელეფონი"
                      : "PHONE"}
                  </small>

                  <h3>
                    QR RETURN Support
                  </h3>

                  <p>
                    {ka
                      ? "საკონტაქტო ნომერი დაემატება მხარდაჭერის ოფიციალური ნომრის გააქტიურების შემდეგ."
                      : "The official support number will appear here once activated."}
                  </p>

                  <span className="availability">
                    {ka
                      ? "Support Contact"
                      : "Support Contact"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* დროებითი ადგილი */}

      <section className="preview">
        <span>
          QR RETURN
        </span>

        <h1>
          {ka
            ? "შემდეგი მთავარი სექცია აქ დაემატება."
            : "The next homepage section will be added here."}
        </h1>
      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;

          color: #192b42;
          background: #ffffff;
        }

        /* HEADER */

        .header {
          position: relative;

          z-index: 100;

          width: 100%;

          background: #ffffff;

          border-bottom:
            1px solid #e5ebf1;
        }

        .headerInner {
          width:
            calc(100% - 72px);

          max-width: 1400px;
          min-height: 78px;

          margin: auto;

          display: grid;

          grid-template-columns:
            210px 1fr auto;

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

          color: white;

          background: #162b44;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #162b44;

          font-size: 16px;
          font-weight: 900;
        }

        .brandText span {
          margin-top: 3px;

          color: #929daa;

          font-size: 7px;
          font-weight: 850;

          letter-spacing: 1.3px;
        }

        .navigation {
          display: flex;
          align-items: center;

          gap: 28px;

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
          color: #084daf;
        }

        .actions {
          display: flex;
          align-items: center;

          gap: 7px;
        }

        /* LANGUAGE ახლა შესვლამდეა */

        .languages {
          margin-right: 5px;

          display: flex;
          align-items: center;

          gap: 6px;
        }

        .languages button {
          padding: 4px 2px;

          border: 0;

          color: #9aa4af;
          background: transparent;

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

          background: #d9dfe6;
        }

        .blueButton,
        .adminButton {
          min-height: 39px;

          padding: 0 14px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          color: white;

          text-decoration: none;

          font-size: 11px;
          font-weight: 850;

          white-space: nowrap;
        }

        .blueButton {
          border:
            1px solid #1266e9;

          background: #1266e9;
        }

        .adminButton {
          border:
            1px solid #162b44;

          background: #162b44;
        }

        /* MEGA */

        .megaMenu {
          position: relative;
          z-index: 90;

          width: 100%;

          background: #f8fbff;

          border-bottom:
            1px solid #dfe7f0;

          box-shadow:
            0 20px 55px
            rgba(
              28,
              49,
              76,
              0.08
            );
        }

        .megaInner {
          width:
            calc(100% - 72px);

          max-width: 1240px;

          margin: auto;

          padding: 48px 0 54px;
        }

        .sectionIntro {
          max-width: 620px;

          margin-bottom: 28px;
        }

        .eyebrow {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.5px;
        }

        .sectionIntro h1,
        .faqIntro h2,
        .contactIntro h2 {
          margin: 8px 0 0;

          color: #1b3049;

          font-size: 27px;
          line-height: 1.15;

          letter-spacing: -0.9px;
        }

        .sectionIntro p,
        .faqIntro p,
        .contactIntro p {
          max-width: 540px;

          margin: 10px 0 0;

          color: #718095;

          font-size: 11.5px;
          line-height: 1.65;
        }

        /* ABOUT — სამი ბარათი */

        .aboutCards {
          display: grid;

          grid-template-columns:
            1.35fr 0.825fr 0.825fr;

          gap: 13px;

          align-items: stretch;
        }

        .aboutCard {
          padding: 24px;

          border:
            1px solid #cfe0fa;

          border-radius: 16px;

          background: #ffffff;

          box-shadow:
            0 8px 26px
            rgba(
              40,
              79,
              130,
              0.05
            );
        }

        .aboutCard:hover {
          border-color: #aac9f6;
        }

        .founderCard {
          border-top:
            3px solid #1266e9;
        }

        .cardNumber {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;
        }

        .founderIdentity {
          margin-top: 15px;

          display: flex;
          align-items: center;

          gap: 11px;
        }

        .founderAvatar {
          width: 44px;
          height: 44px;

          display: grid;
          place-items: center;

          flex: 0 0 44px;

          border-radius: 50%;

          color: #ffffff;

          background: #1266e9;

          font-size: 11px;
          font-weight: 900;
        }

        .founderIdentity strong,
        .founderIdentity span,
        .founderIdentity small {
          display: block;
        }

        .founderIdentity strong {
          color: #20354f;

          font-size: 13px;
        }

        .founderIdentity span {
          margin-top: 2px;

          color: #6f7f91;

          font-size: 10px;
        }

        .founderIdentity small {
          margin-top: 2px;

          color: #1266e9;

          font-size: 7px;
          font-weight: 900;
        }

        .aboutCard h2 {
          margin: 20px 0 0;

          color: #233851;

          font-size: 17px;
          font-weight: 800;
        }

        .aboutCard p {
          margin: 11px 0 0;

          color: #6c7b8e;

          font-size: 11px;
          line-height: 1.67;
        }

        .quote {
          margin: 16px 0;

          padding: 15px;

          border-radius: 11px;

          color: #28415e;

          background: #eef5ff;

          font-size: 11.5px;
          line-height: 1.6;

          font-weight: 700;
        }

        .cardIcon {
          width: 42px;
          height: 42px;

          margin-top: 17px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: #1266e9;

          background: #edf4ff;
        }

        .cardStatement {
          display: block;

          margin-top: 20px;

          color: #1266e9;

          font-size: 10px;
          font-weight: 850;
        }

        /* SHOP */

        .shopLayout {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 13px;
        }

        .shopCard {
          padding: 26px;

          border:
            1px solid #cfe0fa;

          border-radius: 16px;

          color: inherit;
          background: white;

          text-decoration: none;
        }

        .shopCard h2 {
          margin: 12px 0 0;

          color: #263b54;

          font-size: 17px;
        }

        .shopCard p {
          margin: 10px 0 0;

          color: #6f7e91;

          font-size: 11px;
          line-height: 1.65;
        }

        .storeCard {
          background: #eef5ff;
        }

        .storeCard strong {
          display: block;

          margin-top: 22px;

          color: #1266e9;

          font-size: 11px;
        }

        .orderSteps {
          margin-top: 22px;

          display: flex;
          flex-wrap: wrap;

          gap: 7px;
        }

        .orderSteps span {
          padding: 7px 9px;

          border-radius: 8px;

          color: #1266e9;
          background: #edf4ff;

          font-size: 9px;
          font-weight: 800;
        }

        /* FAQ */

        .faqLayout {
          display: grid;

          grid-template-columns:
            0.65fr 1.35fr;

          gap: 60px;
        }

        .faqList {
          border-top:
            1px solid #dce5ee;
        }

        .faqItem {
          padding: 15px 0;

          border-bottom:
            1px solid #dce5ee;
        }

        .faqItem h3 {
          margin: 0;

          color: #2b3f57;

          font-size: 12.5px;
        }

        .faqItem p {
          max-width: 700px;

          margin: 6px 0 0;

          color: #748296;

          font-size: 10.5px;
          line-height: 1.65;
        }

        /* CONTACT */

        .contactLayout {
          display: grid;

          grid-template-columns:
            0.65fr 1.35fr;

          gap: 60px;
        }

        .supportCards {
          display: grid;

          grid-template-columns:
            repeat(2, 1fr);

          gap: 13px;
        }

        .supportCard {
          min-height: 170px;

          padding: 22px;

          display: grid;

          grid-template-columns:
            58px 1fr;

          align-items: center;

          gap: 16px;

          border:
            1px solid #cfe0fa;

          border-radius: 16px;

          color: inherit;
          background: #ffffff;

          text-decoration: none;
        }

        a.supportCard:hover {
          border-color: #a9c9f6;

          background: #f7faff;
        }

        /* პატარა support-agent illustration */

        .agentAvatar {
          width: 58px;
          height: 58px;

          position: relative;

          flex: 0 0 58px;

          overflow: hidden;

          border-radius: 50%;

          background: #dceaff;
        }

        .agentFace {
          width: 27px;
          height: 32px;

          position: absolute;

          left: 16px;
          top: 14px;

          border-radius:
            48% 48% 44% 44%;

          background: #f4c6a6;
        }

        .agentHair {
          width: 36px;
          height: 31px;

          position: absolute;

          z-index: 2;

          left: 11px;
          top: 8px;

          border-radius:
            50% 50% 35% 35%;

          background: #29394e;
        }

        .agentFace {
          z-index: 3;
        }

        .headset {
          width: 39px;
          height: 33px;

          position: absolute;

          z-index: 4;

          left: 9px;
          top: 13px;

          border:
            2px solid #1266e9;

          border-bottom: 0;

          border-radius:
            22px 22px 0 0;
        }

        .headset span {
          width: 10px;
          height: 3px;

          position: absolute;

          right: -4px;
          bottom: 2px;

          border-radius: 10px;

          background: #1266e9;
        }

        .supportIcon {
          width: 50px;
          height: 50px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          color: #1266e9;

          background: #edf4ff;
        }

        .supportCopy small {
          color: #1266e9;

          font-size: 7px;
          font-weight: 900;

          letter-spacing: 1px;
        }

        .supportCopy h3 {
          margin: 5px 0 0;

          color: #263b54;

          font-size: 13px;
        }

        .supportCopy p {
          margin: 6px 0 0;

          color: #718095;

          font-size: 10.5px;
          line-height: 1.55;
        }

        .supportCopy strong {
          display: block;

          margin-top: 12px;

          color: #1266e9;

          font-size: 10px;
        }

        .availability {
          display: inline-block;

          margin-top: 12px;

          padding: 5px 8px;

          border-radius: 7px;

          color: #1266e9;

          background: #edf4ff;

          font-size: 8px;
          font-weight: 800;
        }

        /* PREVIEW */

        .preview {
          min-height: 520px;

          padding: 120px 30px;

          text-align: center;
        }

        .preview span {
          color: #1266e9;

          font-size: 8px;
          font-weight: 900;

          letter-spacing: 1.4px;
        }

        .preview h1 {
          max-width: 650px;

          margin: 15px auto 0;

          color: #20354d;

          font-size: 32px;

          line-height: 1.14;

          letter-spacing: -1.3px;
        }

        /* RESPONSIVE */

        @media (
          max-width: 1120px
        ) {
          .navigation {
            gap: 15px;

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

          .brandText span,
          .languages {
            display: none;
          }

          .blueButton,
          .adminButton {
            min-height: 35px;

            padding: 0 8px;

            font-size: 9px;
          }

          .megaInner {
            padding:
              34px 0 40px;
          }

          .shopLayout,
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
      width="21"
      height="21"
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

      <path d="M12 2v3M22 12h-3" />
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

      <circle
        cx="12"
        cy="12"
        r="2.5"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}
