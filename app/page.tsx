"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "ka" | "en";

const profileTypes = [
  {
    number: "01",
    code: "DOG",
    ka: "ძაღლი",
    en: "Dog",
    detailKa: "ცხოველის QR პროფილი",
    detailEn: "Pet protection profile",
  },
  {
    number: "02",
    code: "CAT",
    ka: "კატა",
    en: "Cat",
    detailKa: "ცხოველის QR პროფილი",
    detailEn: "Pet protection profile",
  },
  {
    number: "03",
    code: "KEYS",
    ka: "გასაღები",
    en: "Keys",
    detailKa: "ნივთის QR პროფილი",
    detailEn: "Item protection profile",
  },
  {
    number: "04",
    code: "WALLET",
    ka: "საფულე",
    en: "Wallet",
    detailKa: "ნივთის QR პროფილი",
    detailEn: "Item protection profile",
  },
  {
    number: "05",
    code: "SUITCASE",
    ka: "ჩემოდანი",
    en: "Suitcase",
    detailKa: "სამოგზაურო QR პროფილი",
    detailEn: "Travel protection profile",
  },
  {
    number: "06",
    code: "BAG",
    ka: "ჩანთა",
    en: "Bag",
    detailKa: "ნივთის QR პროფილი",
    detailEn: "Item protection profile",
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  return (
    <main className="page">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <Link href="/" className="brand">
          <span className="brandMark">
            QR
          </span>

          <span className="brandCopy">
            <strong>QR RETURN</strong>
            <small>SECURE RETURN SYSTEM</small>
          </span>
        </Link>

        <nav className="navigation">
          <a href="#how">
            {ka
              ? "როგორ მუშაობს"
              : "How it works"}
          </a>

          <a href="#profiles">
            {ka
              ? "პროფილები"
              : "Profiles"}
          </a>

          <a href="#live-chat">
            Live Chat
          </a>

          <a href="#emergency">
            Emergency
          </a>

          <Link href="/store">
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>
        </nav>

        <div className="headerActions">
          <div className="language">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>

          <Link
            href="/admin"
            className="adminButton"
          >
            Admin Panel
          </Link>

          <Link
            href="/login"
            className="loginButton"
          >
            {ka ? "შესვლა" : "Login"}
          </Link>

          <Link
            href="/register"
            className="accountButton"
          >
            {ka
              ? "ანგარიშის შექმნა"
              : "Create Account"}
          </Link>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroGlow heroGlowOne" />
        <div className="heroGlow heroGlowTwo" />

        <div className="heroContent">
          <div className="eyebrow">
            <span className="eyebrowDot" />

            QR RETURN · SMART LOST & FOUND
          </div>

          <h1>
            {ka ? (
              <>
                დაკარგვა არ ნიშნავს
                <br />
                <span>დამშვიდობებას.</span>
              </>
            ) : (
              <>
                Losing it doesn&apos;t mean
                <br />
                <span>saying goodbye.</span>
              </>
            )}
          </h1>

          <p className="heroText">
            {ka
              ? "QR RETURN გაძლევთ ერთ უსაფრთხო სისტემას თქვენი ცხოველებისა და ნივთებისთვის — QR პროფილები, Live Chat, ლოკაციის გაზიარება, Emergency ინფორმაცია და პირადი მონაცემების სრული კონტროლი."
              : "QR RETURN gives you one secure system for your pets and belongings — QR profiles, Live Chat, location sharing, Emergency information and full privacy control."}
          </p>

          <div className="heroActions">
            <Link
              href="/register"
              className="primaryCta"
            >
              <span className="ctaIcon">
                +
              </span>

              <span>
                <small>
                  {ka
                    ? "პირველი ნაბიჯი"
                    : "First step"}
                </small>

                <strong>
                  {ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}
                </strong>
              </span>

              <span className="ctaArrow">
                →
              </span>
            </Link>

            <Link
              href="/login"
              className="secondaryCta"
            >
              <span>
                <small>
                  {ka
                    ? "უკვე გაქვს ანგარიში?"
                    : "Already registered?"}
                </small>

                <strong>
                  {ka
                    ? "შესვლა"
                    : "Sign In"}
                </strong>
              </span>

              <span>→</span>
            </Link>
          </div>

          <div className="heroLinks">
            <Link href="/my-profiles">
              <span className="miniIcon">
                P
              </span>

              {ka
                ? "ჩემი პროფილები"
                : "My Profiles"}
            </Link>

            <Link href="/account/messages">
              <span className="miniIcon">
                C
              </span>

              Live Chat
            </Link>

            <Link href="/store">
              <span className="miniIcon">
                S
              </span>

              {ka
                ? "მაღაზია"
                : "Store"}
            </Link>
          </div>
        </div>

        {/* HERO PRODUCT PREVIEW */}

        <div className="heroPreview">
          <div className="previewAura" />

          <div className="phone">
            <div className="phoneHeader">
              <span className="previewBrand">
                QR RETURN
              </span>

              <span className="status">
                <i />
                LIVE
              </span>
            </div>

            <div className="profileHero">
              <div className="petPortrait">
                <span>T</span>
              </div>

              <span className="profileLabel">
                LOST PET PROFILE
              </span>

              <h3>Toby</h3>

              <p>
                {ka
                  ? "მე დავიკარგე. გთხოვთ დაუკავშირდეთ ჩემს მფლობელს."
                  : "I'm lost. Please contact my owner."}
              </p>
            </div>

            <div className="profileActions">
              <button type="button">
                <span className="actionMark">
                  C
                </span>

                <span>
                  <small>
                    SECURE
                  </small>
                  Live Chat
                </span>

                <strong>→</strong>
              </button>

              <button
                type="button"
                className="locationAction"
              >
                <span className="actionMark">
                  L
                </span>

                <span>
                  <small>
                    LOCATION
                  </small>

                  {ka
                    ? "გაზიარება"
                    : "Share"}
                </span>

                <strong>→</strong>
              </button>
            </div>

            <div className="privacyLine">
              <span className="shield">
                ✓
              </span>

              <div>
                <strong>
                  Privacy protected
                </strong>

                <small>
                  Owner controls what the finder sees
                </small>
              </div>
            </div>
          </div>

          <div className="floating floatingChat">
            <span>C</span>

            <div>
              <strong>Live Chat</strong>
              <small>Finder connected</small>
            </div>
          </div>

          <div className="floating floatingLocation">
            <span>L</span>

            <div>
              <strong>
                Location shared
              </strong>

              <small>
                Secure location
              </small>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT FIRST
      ====================================================== */}

      <section className="accountFirst">
        <div className="accountIntro">
          <span className="sectionLabel">
            01 · START HERE
          </span>

          <h2>
            {ka
              ? "ყველაფერი იწყება ერთი ანგარიშით."
              : "Everything starts with one account."}
          </h2>

          <p>
            {ka
              ? "ჯერ ქმნით თქვენს QR RETURN ანგარიშს. შემდეგ ავსებთ მფლობელის პროფილს და მხოლოდ ამის შემდეგ ქმნით ძაღლის, კატის ან ნივთის QR პროფილებს."
              : "First, create your QR RETURN account. Then complete the Owner Profile. After that, create QR profiles for your pets and belongings."}
          </p>
        </div>

        <div className="accountFlow">
          <article>
            <span className="flowNumber">
              01
            </span>

            <div className="flowSymbol">
              A
            </div>

            <h3>
              {ka
                ? "შექმენი ანგარიში"
                : "Create Account"}
            </h3>

            <p>
              {ka
                ? "სახელი, გვარი, ელფოსტა, ტელეფონი და უსაფრთხოების ინფორმაცია."
                : "Create your secure QR RETURN account with your core information."}
            </p>

            <Link href="/register">
              {ka
                ? "ანგარიშის შექმნა"
                : "Create Account"}{" "}
              →
            </Link>
          </article>

          <div className="flowLine">
            <span>→</span>
          </div>

          <article>
            <span className="flowNumber">
              02
            </span>

            <div className="flowSymbol">
              O
            </div>

            <h3>
              {ka
                ? "მფლობელის პროფილი"
                : "Owner Profile"}
            </h3>

            <p>
              {ka
                ? "ერთხელ შეავსებ მფლობელის მონაცემებს და თავად აკონტროლებ რა დაინახოს მპოვნელმა."
                : "Complete your Owner Profile once and control what information finders can see."}
            </p>
          </article>

          <div className="flowLine">
            <span>→</span>
          </div>

          <article>
            <span className="flowNumber">
              03
            </span>

            <div className="flowSymbol">
              P
            </div>

            <h3>
              {ka
                ? "შექმენი QR პროფილი"
                : "Create QR Profile"}
            </h3>

            <p>
              {ka
                ? "შემდეგ დაამატე იმდენი ცხოველი ან ნივთი, რამდენიც გჭირდება."
                : "Then add as many pet or item profiles as you need."}
            </p>

            <Link href="/my-profiles">
              {ka
                ? "ჩემი პროფილები"
                : "My Profiles"}{" "}
              →
            </Link>
          </article>

          <div className="flowLine">
            <span>→</span>
          </div>

          <article>
            <span className="flowNumber">
              04
            </span>

            <div className="flowSymbol">
              QR
            </div>

            <h3>
              {ka
                ? "მიაბი QR"
                : "Connect QR"}
            </h3>

            <p>
              {ka
                ? "მიაბი ბრელოკი ან სტიკერი კონკრეტულ პროფილს და სისტემა მზადაა."
                : "Connect your tag or sticker to the selected profile and you're protected."}
            </p>

            <Link href="/store">
              {ka
                ? "QR-ის შეძენა"
                : "Buy QR"}{" "}
              →
            </Link>
          </article>
        </div>
      </section>

      {/* =====================================================
          PROFILE TYPES
      ====================================================== */}

      <section
        className="profiles"
        id="profiles"
      >
        <div className="sectionHeader">
          <div>
            <span className="sectionLabel">
              02 · PROFILE TYPES
            </span>

            <h2>
              {ka
                ? "ერთი ანგარიში. მრავალი QR პროფილი."
                : "One account. Multiple QR profiles."}
            </h2>

            <p>
              {ka
                ? "პროფილის ტიპს ანგარიშში შესვლის შემდეგ ირჩევთ. თითოეულ პროფილს საკუთარი ფოტო, ინფორმაცია, კონტაქტის პარამეტრები და ხილვადობის კონტროლი აქვს."
                : "Choose a profile type after signing in. Every profile has its own information, photo, contact preferences and visibility controls."}
            </p>
          </div>

          <Link
            href="/my-profiles"
            className="textLink"
          >
            {ka
              ? "ჩემი პროფილების გახსნა"
              : "Open My Profiles"}{" "}
            →
          </Link>
        </div>

        <div className="profileGrid">
          {profileTypes.map(
            (profile) => (
              <article
                className="profileType"
                key={profile.number}
              >
                <div className="profileTypeTop">
                  <span>
                    {profile.number}
                  </span>

                  <span className="profileCode">
                    {profile.code}
                  </span>
                </div>

                <div className="profileGraphic">
                  <span>
                    {profile.code.slice(
                      0,
                      1
                    )}
                  </span>
                </div>

                <h3>
                  {ka
                    ? profile.ka
                    : profile.en}
                </h3>

                <p>
                  {ka
                    ? profile.detailKa
                    : profile.detailEn}
                </p>

                <div className="profileFooter">
                  <span>
                    OWNER ACCOUNT REQUIRED
                  </span>

                  <strong>→</strong>
                </div>
              </article>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          LIVE CHAT
      ====================================================== */}

      <section
        className="liveChat"
        id="live-chat"
      >
        <div className="chatDemo">
          <div className="chatPanel">
            <div className="chatTop">
              <div className="finderIdentity">
                <span className="finderAvatar">
                  F
                </span>

                <span>
                  <strong>
                    Finder
                  </strong>

                  <small>
                    <i />
                    Online now
                  </small>
                </span>
              </div>

              <span className="encrypted">
                SECURE CHAT
              </span>
            </div>

            <div className="conversation">
              <div className="finderMessage">
                {ka
                  ? "გამარჯობა. თქვენი ნივთი ვიპოვე."
                  : "Hi. I found your item."}
              </div>

              <div className="ownerMessage">
                {ka
                  ? "დიდი მადლობა. შეგიძლიათ მდებარეობა გამიზიაროთ?"
                  : "Thank you. Could you share your location?"}
              </div>

              <div className="locationMessage">
                <span>L</span>

                <div>
                  <strong>
                    {ka
                      ? "ლოკაცია გაზიარებულია"
                      : "Location shared"}
                  </strong>

                  <small>
                    Secure location
                  </small>
                </div>
              </div>
            </div>

            <div className="chatInput">
              <span>
                {ka
                  ? "დაწერე შეტყობინება..."
                  : "Write a message..."}
              </span>

              <button type="button">
                ↑
              </button>
            </div>
          </div>
        </div>

        <div className="chatContent">
          <span className="sectionLabel">
            03 · LIVE CHAT
          </span>

          <h2>
            {ka
              ? "მპოვნელთან პირდაპირი კავშირი — ტელეფონის ნომრის გამჟღავნების გარეშე."
              : "Talk directly to the finder — without exposing your phone number."}
          </h2>

          <p>
            {ka
              ? "მპოვნელისთვის რეგისტრაცია საჭირო არ არის. ერთი QR სკანირების შემდეგ შეუძლია Live Chat-ის გახსნა, შეტყობინების გამოგზავნა და სურვილის შემთხვევაში ლოკაციის გაზიარება."
              : "The finder does not need an account. After one QR scan, they can open Live Chat, send you a message and optionally share their location."}
          </p>

          <div className="benefitList">
            <div>
              <span>01</span>

              <strong>
                {ka
                  ? "Finder-ს რეგისტრაცია არ სჭირდება"
                  : "No finder registration"}
              </strong>
            </div>

            <div>
              <span>02</span>

              <strong>
                {ka
                  ? "მფლობელის ნომერი შეიძლება დამალული იყოს"
                  : "Owner number can stay private"}
              </strong>
            </div>

            <div>
              <span>03</span>

              <strong>
                {ka
                  ? "ჩათის ისტორია ანგარიშში ინახება"
                  : "Chat history stays in your account"}
              </strong>
            </div>
          </div>

          <Link
            href="/account/messages"
            className="blackButton"
          >
            Live Chat
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}

      <section className="features">
        <div className="featureIntro">
          <span className="sectionLabel lightLabel">
            04 · SMART PROTECTION
          </span>

          <h2>
            {ka
              ? "QR-ზე ბევრად მეტი."
              : "Much more than a QR code."}
          </h2>

          <p>
            {ka
              ? "მფლობელი აკონტროლებს როგორ და რა პირობებში შეძლებს მპოვნელი მასთან დაკავშირებას."
              : "The owner controls exactly how and when a finder can make contact."}
          </p>
        </div>

        <div className="featureGrid">
          <article>
            <span>01</span>

            <strong>
              Live Chat
            </strong>

            <p>
              {ka
                ? "უსაფრთხო პირდაპირი კომუნიკაცია პლატფორმიდან."
                : "Secure direct communication through the platform."}
            </p>
          </article>

          <article>
            <span>02</span>

            <strong>
              {ka
                ? "ლოკაციის გაზიარება"
                : "Location Sharing"}
            </strong>

            <p>
              {ka
                ? "Finder-ს შეუძლია ერთი მოქმედებით გამოგიგზავნოთ მდებარეობა."
                : "A finder can share the location with a single action."}
            </p>
          </article>

          <article>
            <span>03</span>

            <strong>
              WhatsApp / Phone
            </strong>

            <p>
              {ka
                ? "მფლობელი თავად წყვეტს რომელი დაკავშირების მეთოდი იყოს ჩართული."
                : "The owner chooses which contact methods are enabled."}
            </p>
          </article>

          <article>
            <span>04</span>

            <strong>
              {ka
                ? "მპოვნელის ჯილდო"
                : "Finder Reward"}
            </strong>

            <p>
              {ka
                ? "სურვილის შემთხვევაში პროფილზე დაამატეთ ჯილდო."
                : "Optionally add a reward to the profile."}
            </p>
          </article>

          <article>
            <span>05</span>

            <strong>
              Lost Mode
            </strong>

            <p>
              {ka
                ? "დაკარგვის რეჟიმში გააქტიურეთ დამატებითი ინფორმაცია და კონტაქტები."
                : "Activate additional information and contacts when something is lost."}
            </p>
          </article>

          <article>
            <span>06</span>

            <strong>
              Privacy Control
            </strong>

            <p>
              {ka
                ? "ზუსტად განსაზღვრეთ რომელი მონაცემი დაინახოს Finder-მა."
                : "Choose exactly which information a finder can see."}
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================
          EMERGENCY
      ====================================================== */}

      <section
        className="emergency"
        id="emergency"
      >
        <div className="emergencyVisual">
          <div className="emergencyCard">
            <div className="emergencyCardTop">
              <span className="emergencyCross">
                +
              </span>

              <span className="emergencyTag">
                EMERGENCY PROFILE
              </span>
            </div>

            <div className="emergencyPerson">
              <div className="personPlaceholder">
                ID
              </div>

              <div>
                <small>
                  QR RETURN EMERGENCY
                </small>

                <strong>
                  Emergency ID
                </strong>
              </div>
            </div>

            <div className="emergencyRows">
              <div>
                <span>
                  EMERGENCY CONTACT
                </span>

                <strong>
                  Available
                </strong>
              </div>

              <div>
                <span>
                  ESSENTIAL INFO
                </span>

                <strong>
                  Owner controlled
                </strong>
              </div>

              <div>
                <span>
                  QR ACCESS
                </span>

                <strong>
                  Instant
                </strong>
              </div>
            </div>
          </div>
        </div>

        <div className="emergencyContent">
          <span className="emergencyEyebrow">
            QR RETURN EMERGENCY
          </span>

          <h2>
            {ka
              ? "Emergency პროფილი, როცა ინფორმაცია სწრაფად უნდა იყოს ხელმისაწვდომი."
              : "An Emergency profile when essential information needs to be available fast."}
          </h2>

          <p>
            {ka
              ? "Emergency ცალკე QR პროფილია. მომხმარებელი ჯერ ქმნის QR RETURN ანგარიშს და შემდეგ საკუთარ ანგარიშში ამატებს Emergency პროფილს."
              : "Emergency is a separate QR profile. The user first creates a QR RETURN account and then adds an Emergency profile from inside the account."}
          </p>

          <div className="emergencyActions">
            <Link
              href="/register"
              className="emergencyPrimary"
            >
              {ka
                ? "ჯერ შექმენი ანგარიში"
                : "Create Account First"}

              <span>→</span>
            </Link>

            <Link
              href="/my-profiles"
              className="emergencySecondary"
            >
              {ka
                ? "უკვე მაქვს ანგარიში"
                : "I Already Have an Account"}
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORE
      ====================================================== */}

      <section className="store">
        <div className="storeContent">
          <span className="sectionLabel lightLabel">
            05 · QR RETURN STORE
          </span>

          <h2>
            {ka
              ? "აირჩიე დიზაინი, რომელიც შენს ნივთს შეეფერება."
              : "Choose the design that fits what you protect."}
          </h2>

          <p>
            {ka
              ? "QR ბრელოკები და სტიკერები სხვადასხვა დიზაინით. ყიდვისთვის QR RETURN ანგარიში აუცილებელია, რათა პროდუქტი და შეკვეთა თქვენს ანგარიშს დაუკავშირდეს."
              : "QR tags and stickers in multiple designs. A QR RETURN account is required so your product and order stay connected to you."}
          </p>

          <div className="storeActions">
            <Link
              href="/store"
              className="storePrimary"
            >
              {ka
                ? "მაღაზიის გახსნა"
                : "Explore Store"}

              <span>→</span>
            </Link>

            <Link
              href="/account/orders"
              className="storeSecondary"
            >
              {ka
                ? "ჩემი შეკვეთები"
                : "My Orders"}
            </Link>
          </div>
        </div>

        <div className="productComposition">
          <div className="productTag tagLarge">
            <span>QR</span>

            <strong>
              RETURN
            </strong>
          </div>

          <div className="productTag tagSmall">
            <span>QR</span>
          </div>

          <div className="productSticker">
            <span>QR RETURN</span>

            <div className="fakeQr">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>

            <small>
              SCAN TO RETURN
            </small>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACCOUNT ACCESS
      ====================================================== */}

      <section className="accountAccess">
        <div className="accountAccessIntro">
          <span className="sectionLabel">
            06 · YOUR ACCOUNT
          </span>

          <h2>
            {ka
              ? "ყველაფერი ერთ პირად სივრცეში."
              : "Everything in one private workspace."}
          </h2>

          <p>
            {ka
              ? "შესვლის შემდეგ მომხმარებელი მართავს Owner Profile-ს, QR პროფილებს, Live Chat-ს, შეტყობინებებს და შეკვეთებს."
              : "After signing in, users manage their Owner Profile, QR profiles, Live Chat, notifications and orders."}
          </p>
        </div>

        <div className="accountLinks">
          <Link href="/my-profiles">
            <span>01</span>

            <div>
              <strong>
                {ka
                  ? "ჩემი პროფილები"
                  : "My Profiles"}
              </strong>

              <small>
                QR PROFILE MANAGEMENT
              </small>
            </div>

            <b>→</b>
          </Link>

          <Link href="/account/messages">
            <span>02</span>

            <div>
              <strong>
                Live Chat
              </strong>

              <small>
                FINDER CONVERSATIONS
              </small>
            </div>

            <b>→</b>
          </Link>

          <Link href="/account/notifications">
            <span>03</span>

            <div>
              <strong>
                {ka
                  ? "შეტყობინებები"
                  : "Notifications"}
              </strong>

              <small>
                SCANS · CHAT · LOCATION
              </small>
            </div>

            <b>→</b>
          </Link>

          <Link href="/account/orders">
            <span>04</span>

            <div>
              <strong>
                {ka
                  ? "ჩემი შეკვეთები"
                  : "My Orders"}
              </strong>

              <small>
                ORDER MANAGEMENT
              </small>
            </div>

            <b>→</b>
          </Link>
        </div>
      </section>

      {/* =====================================================
          ADMIN
      ====================================================== */}

      <section className="adminSection">
        <div>
          <span>
            QR RETURN ADMINISTRATION
          </span>

          <h2>
            Admin Panel
          </h2>

          <p>
            {ka
              ? "QR RETURN-ის ადმინისტრაციული მართვის სისტემა."
              : "Administrative management for the QR RETURN platform."}
        </div>

        <Link href="/admin">
          Open Admin Panel
          <span>→</span>
        </Link>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="finalCta">
        <span className="sectionLabel">
          QR RETURN
        </span>

        <h2>
          {ka
            ? "ერთი ანგარიში. ყველაფერი, რაც გინდა დაიცვა."
            : "One account. Everything you want to protect."}
        </h2>

        <p>
          {ka
            ? "შექმენი QR RETURN ანგარიში და შემდეგ დაამატე შენი ცხოველებისა და ნივთების პროფილები."
            : "Create your QR RETURN account, then add profiles for your pets and belongings."}
        </p>

        <div>
          <Link
            href="/register"
            className="finalPrimary"
          >
            {ka
              ? "ანგარიშის შექმნა"
              : "Create Account"}

            <span>→</span>
          </Link>

          <Link
            href="/login"
            className="finalSecondary"
          >
            {ka
              ? "შესვლა"
              : "Sign In"}
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerBrand">
          <span className="brandMark">
            QR
          </span>

          <div>
            <strong>QR RETURN</strong>

            <p>
              {ka
                ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
                : "Never lose what matters."}
            </p>
          </div>
        </div>

        <div className="footerColumn">
          <strong>PLATFORM</strong>

          <Link href="/register">
            Create Account
          </Link>

          <Link href="/login">
            Login
          </Link>

          <Link href="/my-profiles">
            My Profiles
          </Link>
        </div>

        <div className="footerColumn">
          <strong>FEATURES</strong>

          <Link href="/account/messages">
            Live Chat
          </Link>

          <Link href="/account/notifications">
            Notifications
          </Link>

          <a href="#emergency">
            Emergency
          </a>
        </div>

        <div className="footerColumn">
          <strong>STORE</strong>

          <Link href="/store">
            Products
          </Link>

          <Link href="/account/orders">
            My Orders
          </Link>

          <Link href="/admin">
            Admin Panel
          </Link>
        </div>

        <div className="footerBottom">
          <span>
            © 2026 QR RETURN
          </span>

          <span>
            SECURE RETURN SYSTEM
          </span>
        </div>
      </footer>

      {/* =====================================================
          CSS
      ====================================================== */}

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;

          color: #101d2e;
          background: #ffffff;

          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* ================= HEADER ================= */

        .header {
          width: calc(100% - 56px);
          max-width: 1320px;
          min-height: 86px;

          margin: auto;

          display: grid;
          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 36px;

          border-bottom:
            1px solid #e9edf2;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 12px;

          text-decoration: none;
        }

        .brandMark {
          width: 48px;
          height: 48px;

          flex: 0 0 48px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #0574f9 0%,
              #6855f5 100%
            );

          box-shadow:
            0 12px 30px
            rgba(
              26,
              103,
              236,
              0.22
            );

          font-size: 13px;
          font-weight: 950;
          letter-spacing: -0.5px;
        }

        .brandCopy strong,
        .brandCopy small {
          display: block;
        }

        .brandCopy strong {
          color: #0574f9;

          font-size: 16px;
          font-weight: 900;

          letter-spacing: -0.5px;
        }

        .brandCopy small {
          margin-top: 3px;

          color: #7e70e8;

          font-size: 8px;
          font-weight: 800;

          letter-spacing: 1.4px;
        }

        .navigation {
          display: flex;

          align-items: center;
          justify-content: center;

          gap: 28px;
        }

        .navigation a {
          color: #536174;

          text-decoration: none;

          font-size: 14px;
          font-weight: 650;

          transition: color 0.2s ease;
        }

        .navigation a:hover {
          color: #0574f9;
        }

        .headerActions {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .language {
          margin-right: 3px;
          padding: 4px;

          display: flex;

          border-radius: 10px;

          background: #f1f4f7;
        }

        .language button {
          width: 40px;
          height: 31px;

          border: 0;
          border-radius: 7px;

          color: #83909d;
          background: transparent;

          cursor: pointer;

          font-size: 11px;
          font-weight: 850;
        }

        .language button.active {
          color: #0574f9;
          background: #ffffff;

          box-shadow:
            0 3px 9px
            rgba(
              24,
              40,
              64,
              0.08
            );
        }

        .adminButton,
        .loginButton,
        .accountButton {
          min-height: 40px;

          padding: 0 14px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 9px;

          text-decoration: none;

          font-size: 13px;
          font-weight: 750;
        }

        .adminButton {
          color: #654cc9;

          border:
            1px solid #e1daf8;

          background: #faf8ff;
        }

        .loginButton {
          color: #536174;

          border:
            1px solid #dfe5eb;

          background: #ffffff;
        }

        .accountButton {
          color: #ffffff;
          background: #0574f9;
        }

        /* ================= HERO ================= */

        .hero {
          width: calc(100% - 56px);
          max-width: 1320px;
          min-height: 720px;

          margin: auto;

          position: relative;

          display: grid;
          grid-template-columns:
            minmax(0, 1.08fr)
            minmax(440px, 0.92fr);

          align-items: center;

          gap: 70px;
        }

        .heroGlow {
          position: absolute;

          border-radius: 999px;

          filter: blur(80px);

          pointer-events: none;
        }

        .heroGlowOne {
          width: 430px;
          height: 430px;

          right: -30px;
          top: 100px;

          background:
            rgba(
              102,
              82,
              246,
              0.11
            );
        }

        .heroGlowTwo {
          width: 300px;
          height: 300px;

          left: -220px;
          bottom: 20px;

          background:
            rgba(
              5,
              116,
              249,
              0.08
            );
        }

        .heroContent {
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          display: inline-flex;

          align-items: center;

          gap: 9px;

          padding: 9px 14px;

          border:
            1px solid #dfe8f7;

          border-radius: 999px;

          color: #526780;
          background: #f8fbff;

          font-size: 12px;
          font-weight: 800;

          letter-spacing: 1px;
        }

        .eyebrowDot {
          width: 7px;
          height: 7px;

          border-radius: 50%;

          background: #27ae6f;

          box-shadow:
            0 0 0 5px
            rgba(
              39,
              174,
              111,
              0.1
            );
        }

        .hero h1 {
          max-width: 850px;

          margin: 24px 0 0;

          color: #101d2e;

          font-size:
            clamp(
              60px,
              6vw,
              84px
            );

          line-height: 0.98;

          letter-spacing: -4.2px;

          font-weight: 800;
        }

        .hero h1 span {
          color: #0574f9;
        }

        .heroText {
          max-width: 700px;

          margin: 27px 0 0;

          color: #647487;

          font-size: 18px;

          line-height: 1.72;
        }

        .heroActions {
          margin-top: 34px;

          display: flex;
          flex-wrap: wrap;

          gap: 11px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 62px;

          display: flex;

          align-items: center;

          border-radius: 13px;

          text-decoration: none;
        }

        .primaryCta {
          min-width: 275px;

          padding: 0 17px;

          gap: 14px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #0574f9,
              #6555f5
            );

          box-shadow:
            0 18px 40px
            rgba(
              25,
              101,
              235,
              0.19
            );
        }

        .ctaIcon {
          width: 35px;
          height: 35px;

          flex: 0 0 35px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background:
            rgba(
              255,
              255,
              255,
              0.15
            );

          font-size: 21px;
          font-weight: 500;
        }

        .primaryCta small,
        .primaryCta strong,
        .secondaryCta small,
        .secondaryCta strong {
          display: block;
        }

        .primaryCta small {
          color:
            rgba(
              255,
              255,
              255,
              0.72
            );

          font-size: 11px;
          font-weight: 700;
        }

        .primaryCta strong {
          margin-top: 2px;

          font-size: 15px;
        }

        .ctaArrow {
          margin-left: auto;

          font-size: 20px;
        }

        .secondaryCta {
          min-width: 205px;

          padding: 0 17px;

          justify-content:
            space-between;

          gap: 30px;

          color: #39495b;

          border:
            1px solid #dce3e9;

          background: #ffffff;
        }

        .secondaryCta small {
          color: #8793a0;

          font-size: 11px;
        }

        .secondaryCta strong {
          margin-top: 2px;

          font-size: 15px;
        }

        .heroLinks {
          margin-top: 24px;

          display: flex;
          flex-wrap: wrap;

          gap: 22px;
        }

        .heroLinks a {
          display: flex;
          align-items: center;

          gap: 8px;

          color: #627184;

          text-decoration: none;

          font-size: 14px;
          font-weight: 650;
        }

        .miniIcon {
          width: 25px;
          height: 25px;

          display: grid;
          place-items: center;

          border-radius: 7px;

          color: #0574f9;
          background: #eff5ff;

          font-size: 10px;
          font-weight: 900;
        }

        /* ================= HERO PREVIEW ================= */

        .heroPreview {
          height: 570px;

          position: relative;

          z-index: 2;

          display: flex;

          align-items: center;
          justify-content: center;
        }

        .previewAura {
          width: 390px;
          height: 390px;

          position: absolute;

          border-radius: 50%;

          background:
            linear-gradient(
              145deg,
              rgba(
                5,
                116,
                249,
                0.1
              ),
              rgba(
                101,
                85,
                245,
                0.13
              )
            );

          filter: blur(10px);
        }

        .phone {
          width: 350px;

          position: relative;
          z-index: 3;

          padding: 20px;

          border:
            1px solid
            rgba(
              218,
              226,
              234,
              0.9
            );

          border-radius: 31px;

          background:
            rgba(
              255,
              255,
              255,
              0.95
            );

          box-shadow:
            0 40px 100px
            rgba(
              24,
              44,
              72,
              0.15
            );

          backdrop-filter: blur(18px);
        }

        .phoneHeader {
          min-height: 34px;

          display: flex;

          align-items: flex-start;
          justify-content: space-between;
        }

        .previewBrand {
          color: #0574f9;

          font-size: 12px;
          font-weight: 900;
        }

        .status {
          display: flex;
          align-items: center;

          gap: 5px;

          color: #27a969;

          font-size: 9px;
          font-weight: 850;
        }

        .status i {
          width: 6px;
          height: 6px;

          display: inline-block;

          border-radius: 50%;

          background: #27a969;
        }

        .profileHero {
          padding: 31px 23px 24px;

          border-radius: 21px;

          text-align: center;

          background:
            linear-gradient(
              145deg,
              #f4f8ff,
              #f8f6ff
            );
        }

        .petPortrait {
          width: 98px;
          height: 98px;

          margin: auto;

          display: grid;
          place-items: center;

          border:
            7px solid #ffffff;

          border-radius: 50%;

          color: #ffffff;

          background:
            linear-gradient(
              145deg,
              #0574f9,
              #6c5bf6
            );

          box-shadow:
            0 13px 30px
            rgba(
              31,
              83,
              173,
              0.18
            );

          font-size: 36px;
          font-weight: 800;
        }

        .profileLabel {
          display: block;

          margin-top: 18px;

          color: #705cf1;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1px;
        }

        .profileHero h3 {
          margin: 7px 0 0;

          color: #203247;

          font-size: 28px;
        }

        .profileHero p {
          max-width: 250px;

          margin: 9px auto 0;

          color: #768597;

          font-size: 14px;

          line-height: 1.55;
        }

        .profileActions {
          margin-top: 12px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 8px;
        }

        .profileActions button {
          min-height: 64px;

          padding: 0 12px;

          display: flex;

          align-items: center;

          gap: 9px;

          border: 0;

          border-radius: 12px;

          color: #ffffff;
          background: #0574f9;

          text-align: left;
        }

        .profileActions button > span:nth-child(2) {
          font-size: 13px;
          font-weight: 800;
        }

        .profileActions button small {
          display: block;

          margin-bottom: 2px;

          color:
            rgba(
              255,
              255,
              255,
              0.7
            );

          font-size: 8px;
        }

        .profileActions button strong {
          margin-left: auto;
        }

        .profileActions
          .locationAction {
          color: #445467;

          border:
            1px solid #dde4ea;

          background: #ffffff;
        }

        .locationAction small {
          color: #8b97a4 !important;
        }

        .actionMark {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background:
            rgba(
              255,
              255,
              255,
              0.16
            );

          font-size: 10px;
          font-weight: 900;
        }

        .locationAction
          .actionMark {
          color: #0574f9;

          background: #eff5ff;
        }

        .privacyLine {
          margin-top: 10px;
          padding: 12px;

          display: flex;
          align-items: center;

          gap: 10px;

          border:
            1px solid #e4e9ed;

          border-radius: 12px;

          background: #fbfcfd;
        }

        .shield {
          width: 31px;
          height: 31px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color: #249e68;
          background: #eaf8f1;

          font-size: 13px;
          font-weight: 900;
        }

        .privacyLine strong,
        .privacyLine small {
          display: block;
        }

        .privacyLine strong {
          color: #465668;

          font-size: 12px;
        }

        .privacyLine small {
          margin-top: 2px;

          color: #8b97a3;

          font-size: 9px;
        }

        .floating {
          position: absolute;
          z-index: 5;

          min-width: 175px;

          padding: 13px;

          display: flex;
          align-items: center;

          gap: 10px;

          border:
            1px solid
            rgba(
              220,
              227,
              233,
              0.9
            );

          border-radius: 14px;

          background:
            rgba(
              255,
              255,
              255,
              0.95
            );

          box-shadow:
            0 17px 45px
            rgba(
              28,
              48,
              77,
              0.12
            );
        }

        .floating > span {
          width: 37px;
          height: 37px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #0574f9;
          background: #eff5ff;

          font-size: 12px;
          font-weight: 900;
        }

        .floating strong,
        .floating small {
          display: block;
        }

        .floating strong {
          color: #405064;

          font-size: 12px;
        }

        .floating small {
          margin-top: 2px;

          color: #929da8;

          font-size: 9px;
        }

        .floatingChat {
          left: 5px;
          top: 130px;
        }

        .floatingLocation {
          right: -3px;
          bottom: 105px;
        }

        /* ================= SECTION TYPOGRAPHY ================= */

        .sectionLabel {
          color: #6957e7;

          font-size: 12px;
          font-weight: 850;

          letter-spacing: 1.5px;
        }

        .sectionHeader h2,
        .accountIntro h2,
        .chatContent h2,
        .featureIntro h2,
        .emergencyContent h2,
        .storeContent h2,
        .accountAccessIntro h2 {
          margin: 12px 0 0;

          color: #111f31;

          font-size:
            clamp(
              42px,
              4.3vw,
              58px
            );

          line-height: 1.05;

          letter-spacing: -2.7px;
        }

        /* ================= ACCOUNT FIRST ================= */

        .accountFirst {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: auto;

          padding: 110px 0 105px;

          border-top:
            1px solid #e9edf2;
        }

        .accountIntro {
          max-width: 850px;
        }

        .accountIntro p {
          max-width: 750px;

          margin: 18px 0 0;

          color: #667587;

          font-size: 17px;

          line-height: 1.72;
        }

        .accountFlow {
          margin-top: 52px;

          display: grid;

          grid-template-columns:
            1fr auto
            1fr auto
            1fr auto
            1fr;

          align-items: stretch;

          gap: 12px;
        }

        .accountFlow article {
          min-height: 295px;

          padding: 26px;

          display: flex;
          flex-direction: column;

          border:
            1px solid #e2e7ec;

          border-radius: 18px;

          background: #ffffff;
        }

        .flowNumber {
          color: #9ba6b0;

          font-size: 11px;
          font-weight: 850;
        }

        .flowSymbol {
          width: 50px;
          height: 50px;

          margin-top: 33px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          color: #0574f9;

          background: #eff5ff;

          font-size: 16px;
          font-weight: 900;
        }

        .accountFlow h3 {
          margin: 24px 0 0;

          color: #26374b;

          font-size: 21px;
        }

        .accountFlow p {
          margin: 10px 0 0;

          color: #758394;

          font-size: 15px;

          line-height: 1.63;
        }

        .accountFlow a {
          margin-top: auto;
          padding-top: 22px;

          color: #0574f9;

          text-decoration: none;

          font-size: 14px;
          font-weight: 750;
        }

        .flowLine {
          display: flex;
          align-items: center;
          justify-content: center;

          color: #aeb7c0;

          font-size: 22px;
        }

        /* ================= PROFILES ================= */

        .profiles {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: auto;

          padding: 105px 0;
        }

        .sectionHeader {
          display: flex;

          align-items: flex-end;
          justify-content: space-between;

          gap: 40px;

          margin-bottom: 46px;
        }

        .sectionHeader > div {
          max-width: 850px;
        }

        .sectionHeader p {
          max-width: 720px;

          margin: 17px 0 0;

          color: #687789;

          font-size: 17px;

          line-height: 1.7;
        }

        .textLink {
          flex: 0 0 auto;

          color: #0574f9;

          text-decoration: none;

          font-size: 14px;
          font-weight: 750;
        }

        .profileGrid {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 14px;
        }

        .profileType {
          min-height: 300px;

          padding: 25px;

          display: flex;
          flex-direction: column;

          border:
            1px solid #e1e7ec;

          border-radius: 19px;

          background: #ffffff;

          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .profileType:hover {
          transform:
            translateY(-4px);

          border-color: #ccdbf8;

          box-shadow:
            0 22px 50px
            rgba(
              25,
              54,
              95,
              0.08
            );
        }

        .profileTypeTop {
          display: flex;

          align-items: center;
          justify-content: space-between;

          color: #9ca7b1;

          font-size: 11px;
          font-weight: 800;
        }

        .profileCode {
          color: #0574f9;

          letter-spacing: 0.8px;
        }

        .profileGraphic {
          width: 74px;
          height: 74px;

          margin-top: 38px;

          display: grid;
          place-items: center;

          border-radius: 20px;

          color: #ffffff;

          background:
            linear-gradient(
              145deg,
              #0574f9,
              #6957f3
            );

          box-shadow:
            0 14px 31px
            rgba(
              30,
              103,
              231,
              0.15
            );

          font-size: 27px;
          font-weight: 800;
        }

        .profileType h3 {
          margin: 25px 0 0;

          color: #223449;

          font-size: 23px;
        }

        .profileType p {
          margin: 7px 0 0;

          color: #788697;

          font-size: 15px;
        }

        .profileFooter {
          margin-top: auto;
          padding-top: 26px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          color: #9aa5ae;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.7px;
        }

        .profileFooter strong {
          color: #0574f9;

          font-size: 18px;
        }

        /* ================= LIVE CHAT ================= */

        .liveChat {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: auto;
          padding: 78px;

          display: grid;

          grid-template-columns:
            minmax(420px, 0.9fr)
            minmax(0, 1.1fr);

          align-items: center;

          gap: 85px;

          border-radius: 30px;

          background:
            linear-gradient(
              145deg,
              #f4f8ff,
              #faf8ff
            );
        }

        .chatPanel {
          padding: 18px;

          border:
            1px solid #dce4eb;

          border-radius: 23px;

          background: #ffffff;

          box-shadow:
            0 28px 70px
            rgba(
              28,
              56,
              96,
              0.1
            );
        }

        .chatTop {
          min-height: 67px;

          padding: 0 8px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-bottom:
            1px solid #ebeff2;
        }

        .finderIdentity {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .finderAvatar {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #ffffff;
          background: #0574f9;

          font-size: 15px;
          font-weight: 800;
        }

        .finderIdentity strong,
        .finderIdentity small {
          display: block;
        }

        .finderIdentity strong {
          color: #37485b;

          font-size: 15px;
        }

        .finderIdentity small {
          margin-top: 3px;

          color: #2aa96b;

          font-size: 11px;
        }

        .finderIdentity small i {
          width: 6px;
          height: 6px;

          margin-right: 4px;

          display: inline-block;

          border-radius: 50%;

          background: #2aa96b;
        }

        .encrypted {
          color: #8c98a4;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 0.8px;
        }

        .conversation {
          min-height: 300px;

          padding: 35px 12px;

          display: flex;
          flex-direction: column;

          gap: 13px;

          background: #fafbfd;
        }

        .finderMessage,
        .ownerMessage {
          max-width: 72%;

          padding: 13px 16px;

          border-radius: 14px;

          font-size: 14px;

          line-height: 1.5;
        }

        .finderMessage {
          align-self: flex-start;

          color: #465568;

          border:
            1px solid #e0e6eb;

          background: #ffffff;
        }

        .ownerMessage {
          align-self: flex-end;

          color: #ffffff;

          background: #0574f9;
        }

        .locationMessage {
          align-self: flex-start;

          min-width: 200px;

          padding: 12px;

          display: flex;

          align-items: center;

          gap: 10px;

          border-radius: 13px;

          background: #eaf8f1;
        }

        .locationMessage > span {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color: #198a59;
          background: #d9f2e6;

          font-size: 11px;
          font-weight: 900;
        }

        .locationMessage strong,
        .locationMessage small {
          display: block;
        }

        .locationMessage strong {
          color: #37614f;

          font-size: 13px;
        }

        .locationMessage small {
          margin-top: 2px;

          color: #6a8d7d;

          font-size: 10px;
        }

        .chatInput {
          min-height: 58px;

          margin-top: 10px;
          padding: 0 9px 0 16px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border:
            1px solid #e0e6eb;

          border-radius: 12px;

          color: #98a3ad;

          font-size: 13px;
        }

        .chatInput button {
          width: 38px;
          height: 38px;

          border: 0;
          border-radius: 10px;

          color: #ffffff;
          background: #0574f9;

          cursor: pointer;
        }

        .chatContent p {
          max-width: 630px;

          margin: 20px 0 0;

          color: #687789;

          font-size: 17px;

          line-height: 1.75;
        }

        .benefitList {
          margin-top: 27px;

          display: grid;

          gap: 11px;
        }

        .benefitList > div {
          display: flex;
          align-items: center;

          gap: 11px;
        }

        .benefitList span {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          color: #0574f9;
          background: #ffffff;

          font-size: 10px;
          font-weight: 850;
        }

        .benefitList strong {
          color: #506073;

          font-size: 14px;
        }

        .blackButton {
          min-width: 170px;
          min-height: 49px;

          margin-top: 30px;
          padding: 0 15px;

          display: inline-flex;

          align-items: center;
          justify-content: space-between;

          gap: 40px;

          border-radius: 10px;

          color: #ffffff;
          background: #122238;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;
        }

        /* ================= FEATURES ================= */

        .features {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: 105px auto;

          padding: 74px;

          display: grid;

          grid-template-columns:
            0.8fr 1.2fr;

          gap: 70px;

          border-radius: 30px;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(
                105,
                87,
                243,
                0.35
              ),
              transparent 31%
            ),
            #102139;
        }

        .lightLabel {
          color: #8f80ff;
        }

        .featureIntro h2 {
          color: #ffffff;
        }

        .featureIntro p {
          max-width: 530px;

          margin: 18px 0 0;

          color: #a4b0be;

          font-size: 17px;

          line-height: 1.7;
        }

        .featureGrid {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .featureGrid article {
          min-height: 185px;

          padding: 21px;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.08
            );

          border-radius: 16px;

          background:
            rgba(
              255,
              255,
              255,
              0.035
            );
        }

        .featureGrid article > span {
          color: #8979ff;

          font-size: 10px;
          font-weight: 800;
        }

        .featureGrid article strong {
          display: block;

          margin-top: 30px;

          color: #ffffff;

          font-size: 18px;
        }

        .featureGrid article p {
          margin: 9px 0 0;

          color: #9eacbb;

          font-size: 14px;

          line-height: 1.6;
        }

        /* ================= EMERGENCY ================= */

        .emergency {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: 0 auto 105px;
          padding: 70px;

          display: grid;

          grid-template-columns:
            minmax(380px, 0.85fr)
            minmax(0, 1.15fr);

          align-items: center;

          gap: 80px;

          border:
            1px solid #f0dcdf;

          border-radius: 30px;

          background:
            linear-gradient(
              145deg,
              #fff9f9,
              #ffffff
            );
        }

        .emergencyCard {
          padding: 24px;

          border:
            1px solid #efdadd;

          border-radius: 22px;

          background: #ffffff;

          box-shadow:
            0 25px 65px
            rgba(
              100,
              42,
              49,
              0.08
            );
        }

        .emergencyCardTop {
          display: flex;

          align-items: center;
          justify-content: space-between;
        }

        .emergencyCross {
          width: 45px;
          height: 45px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          color: #ffffff;
          background: #d64b56;

          font-size: 23px;
          font-weight: 700;
        }

        .emergencyTag {
          color: #d64b56;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1px;
        }

        .emergencyPerson {
          margin-top: 30px;

          display: flex;
          align-items: center;

          gap: 13px;
        }

        .personPlaceholder {
          width: 66px;
          height: 66px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          color: #d64b56;
          background: #fff0f1;

          font-size: 16px;
          font-weight: 850;
        }

        .emergencyPerson small,
        .emergencyPerson strong {
          display: block;
        }

        .emergencyPerson small {
          color: #a07e82;

          font-size: 9px;
          font-weight: 750;
        }

        .emergencyPerson strong {
          margin-top: 4px;

          color: #3f4d5b;

          font-size: 20px;
        }

        .emergencyRows {
          margin-top: 27px;

          display: grid;

          gap: 8px;
        }

        .emergencyRows > div {
          min-height: 57px;

          padding: 0 14px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border:
            1px solid #f0e3e5;

          border-radius: 11px;

          background: #fffafa;
        }

        .emergencyRows span {
          color: #9b777c;

          font-size: 10px;
          font-weight: 750;
        }

        .emergencyRows strong {
          color: #625055;

          font-size: 12px;
        }

        .emergencyEyebrow {
          color: #d64b56;

          font-size: 12px;
          font-weight: 850;

          letter-spacing: 1.3px;
        }

        .emergencyContent p {
          max-width: 650px;

          margin: 20px 0 0;

          color: #74808c;

          font-size: 17px;

          line-height: 1.72;
        }

        .emergencyActions {
          margin-top: 29px;

          display: flex;
          flex-wrap: wrap;

          gap: 9px;
        }

        .emergencyPrimary,
        .emergencySecondary {
          min-height: 50px;

          padding: 0 16px;

          display: flex;

          align-items: center;
          justify-content: center;

          gap: 25px;

          border-radius: 10px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;
        }

        .emergencyPrimary {
          min-width: 210px;

          justify-content:
            space-between;

          color: #ffffff;
          background: #d64b56;
        }

        .emergencySecondary {
          color: #704e53;

          border:
            1px solid #ebd9dc;

          background: #ffffff;
        }

        /* ================= STORE ================= */

        .store {
          width: calc(100% - 56px);
          max-width: 1320px;
          min-height: 490px;

          margin: auto;
          padding: 70px;

          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(420px, 0.8fr);

          align-items: center;

          gap: 70px;

          overflow: hidden;

          border-radius: 30px;

          color: #ffffff;

          background:
            radial-gradient(
              circle at 90% 50%,
              rgba(
                105,
                87,
                243,
                0.42
              ),
              transparent 33%
            ),
            #11233c;
        }

        .storeContent h2 {
          color: #ffffff;
        }

        .storeContent p {
          max-width: 650px;

          margin: 19px 0 0;

          color: #a5b1bf;

          font-size: 17px;

          line-height: 1.73;
        }

        .storeActions {
          margin-top: 29px;

          display: flex;
          flex-wrap: wrap;

          gap: 9px;
        }

        .storePrimary,
        .storeSecondary {
          min-height: 50px;

          padding: 0 16px;

          display: inline-flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;
        }

        .storePrimary {
          min-width: 175px;

          justify-content:
            space-between;

          gap: 35px;

          color: #14243b;
          background: #ffffff;
        }

        .storeSecondary {
          color: #ffffff;

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.17
            );

          background:
            rgba(
              255,
              255,
              255,
              0.04
            );
        }

        .productComposition {
          height: 330px;

          position: relative;
        }

        .productTag,
        .productSticker {
          position: absolute;

          display: grid;
          place-items: center;

          color: #0574f9;

          background:
            rgba(
              255,
              255,
              255,
              0.96
            );

          box-shadow:
            0 30px 80px
            rgba(
              0,
              0,
              0,
              0.2
            );
        }

        .productTag {
          border-radius: 50%;
        }

        .tagLarge {
          width: 180px;
          height: 180px;

          left: 40px;
          top: 75px;

          z-index: 3;
        }

        .tagLarge span {
          font-size: 40px;
          font-weight: 900;
        }

        .tagLarge strong {
          position: absolute;

          bottom: 43px;

          color: #6858ef;

          font-size: 10px;

          letter-spacing: 2px;
        }

        .tagSmall {
          width: 125px;
          height: 125px;

          right: 35px;
          top: 20px;

          z-index: 2;

          transform:
            rotate(9deg);
        }

        .tagSmall span {
          font-size: 31px;
          font-weight: 900;
        }

        .productSticker {
          width: 175px;
          height: 125px;

          right: 0;
          bottom: 13px;

          z-index: 4;

          border-radius: 19px;

          transform:
            rotate(-7deg);
        }

        .productSticker > span {
          position: absolute;

          top: 14px;

          color: #0574f9;

          font-size: 12px;
          font-weight: 900;
        }

        .fakeQr {
          width: 52px;
          height: 52px;

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 3px;
        }

        .fakeQr i {
          background: #15243a;
        }

        .productSticker small {
          position: absolute;

          bottom: 12px;

          color: #8b97a2;

          font-size: 7px;
          font-weight: 800;
        }

        /* ================= ACCOUNT ACCESS ================= */

        .accountAccess {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: auto;
          padding: 110px 0;

          display: grid;

          grid-template-columns:
            minmax(0, 0.8fr)
            minmax(500px, 1.2fr);

          gap: 80px;
        }

        .accountAccessIntro p {
          max-width: 560px;

          margin: 18px 0 0;

          color: #6b7989;

          font-size: 17px;

          line-height: 1.7;
        }

        .accountLinks {
          display: grid;

          gap: 9px;
        }

        .accountLinks a {
          min-height: 84px;

          padding: 0 20px;

          display: grid;

          grid-template-columns:
            40px 1fr auto;

          align-items: center;

          gap: 15px;

          border:
            1px solid #e1e7ec;

          border-radius: 14px;

          color: inherit;

          background: #ffffff;

          text-decoration: none;
        }

        .accountLinks > a > span {
          color: #0574f9;

          font-size: 11px;
          font-weight: 850;
        }

        .accountLinks strong,
        .accountLinks small {
          display: block;
        }

        .accountLinks strong {
          color: #324256;

          font-size: 16px;
        }

        .accountLinks small {
          margin-top: 3px;

          color: #98a3ad;

          font-size: 9px;
          font-weight: 800;

          letter-spacing: 0.7px;
        }

        .accountLinks b {
          color: #0574f9;

          font-size: 19px;
        }

        /* ================= ADMIN ================= */

        .adminSection {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: 0 auto 110px;
          padding: 35px 40px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 35px;

          border:
            1px solid #e2dcf2;

          border-radius: 18px;

          background:
            linear-gradient(
              135deg,
              #faf8ff,
              #ffffff
            );
        }

        .adminSection > div > span {
          color: #765ed7;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1px;
        }

        .adminSection h2 {
          margin: 6px 0 0;

          color: #28223b;

          font-size: 27px;
        }

        .adminSection p {
          margin: 6px 0 0;

          color: #7b748a;

          font-size: 14px;
        }

        .adminSection > a {
          min-width: 180px;
          min-height: 49px;

          padding: 0 16px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          border-radius: 10px;

          color: #ffffff;
          background: #5e49b5;

          text-decoration: none;

          font-size: 14px;
          font-weight: 800;
        }

        /* ================= FINAL CTA ================= */

        .finalCta {
          width: calc(100% - 56px);
          max-width: 950px;

          margin: 0 auto 120px;

          text-align: center;
        }

        .finalCta h2 {
          margin: 14px 0 0;

          color: #111f31;

          font-size:
            clamp(
              48px,
              5vw,
              66px
            );

          line-height: 1.02;

          letter-spacing: -3.2px;
        }

        .finalCta p {
          max-width: 650px;

          margin: 18px auto 0;

          color: #6e7c8c;

          font-size: 17px;

          line-height: 1.7;
        }

        .finalCta > div {
          margin-top: 28px;

          display: flex;
          justify-content: center;

          gap: 9px;
        }

        .finalPrimary,
        .finalSecondary {
          min-height: 52px;

          padding: 0 19px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 15px;
          font-weight: 800;
        }

        .finalPrimary {
          min-width: 195px;

          justify-content:
            space-between;

          gap: 32px;

          color: #ffffff;

          background:
            linear-gradient(
              135deg,
              #0574f9,
              #6555f5
            );
        }

        .finalSecondary {
          color: #526174;

          border:
            1px solid #dce3e9;

          background: #ffffff;
        }

        /* ================= FOOTER ================= */

        .footer {
          width: calc(100% - 56px);
          max-width: 1320px;

          margin: auto;
          padding: 52px 0 30px;

          display: grid;

          grid-template-columns:
            minmax(260px, 1fr)
            repeat(
              3,
              175px
            );

          gap: 30px;

          border-top:
            1px solid #e5eaee;
        }

        .footerBrand {
          display: flex;

          align-items: flex-start;

          gap: 12px;
        }

        .footerBrand strong {
          color: #0574f9;

          font-size: 16px;
        }

        .footerBrand p {
          margin: 6px 0 0;

          color: #8b96a1;

          font-size: 13px;
        }

        .footerColumn {
          display: flex;
          flex-direction: column;

          gap: 10px;
        }

        .footerColumn > strong {
          margin-bottom: 5px;

          color: #98a2ab;

          font-size: 10px;
          font-weight: 850;

          letter-spacing: 1.1px;
        }

        .footerColumn a {
          color: #5f6f80;

          text-decoration: none;

          font-size: 14px;
        }

        .footerBottom {
          grid-column: 1 / -1;

          margin-top: 30px;
          padding-top: 22px;

          display: flex;

          justify-content: space-between;

          border-top:
            1px solid #edf0f2;

          color: #9aa4ad;

          font-size: 11px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1120px) {
          .navigation {
            display: none;
          }

          .hero {
            grid-template-columns:
              minmax(0, 1fr)
              410px;
          }

          .accountFlow {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .flowLine {
            display: none;
          }

          .features {
            grid-template-columns:
              1fr;
          }

          .liveChat {
            gap: 45px;
          }
        }

        @media (max-width: 900px) {
          .header {
            grid-template-columns:
              auto 1fr;
          }

          .adminButton {
            display: none;
          }

          .hero {
            padding: 80px 0;

            grid-template-columns:
              1fr;

            text-align: center;
          }

          .heroText {
            margin-left: auto;
            margin-right: auto;
          }

          .heroActions,
          .heroLinks {
            justify-content: center;
          }

          .heroPreview {
            margin-top: 30px;
          }

          .profileGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .liveChat {
            padding: 45px;

            grid-template-columns:
              1fr;
          }

          .emergency {
            padding: 45px;

            grid-template-columns:
              1fr;
          }

          .store {
            padding: 50px;

            grid-template-columns:
              1fr;
          }

          .productComposition {
            max-width: 500px;

            width: 100%;

            margin: auto;
          }

          .accountAccess {
            grid-template-columns:
              1fr;
          }

          .footer {
            grid-template-columns:
              1fr 1fr;
          }
        }

        @media (max-width: 650px) {
          .header,
          .hero,
          .accountFirst,
          .profiles,
          .liveChat,
          .features,
          .emergency,
          .store,
          .accountAccess,
          .adminSection,
          .footer {
            width:
              calc(
                100% - 28px
              );
          }

          .header {
            min-height: 76px;
          }

          .brandCopy small {
            display: none;
          }

          .language,
          .loginButton {
            display: none;
          }

          .accountButton {
            padding: 0 11px;
          }

          .hero {
            padding: 55px 0;
          }

          .hero h1 {
            font-size: 48px;

            letter-spacing: -2.6px;
          }

          .heroText {
            font-size: 16px;
          }

          .heroActions {
            flex-direction: column;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .heroLinks {
            gap: 12px;
          }

          .heroPreview {
            height: 510px;
          }

          .phone {
            width: 300px;
          }

          .floating {
            min-width: 145px;
          }

          .floatingChat {
            left: -5px;
          }

          .floatingLocation {
            right: -5px;
          }

          .accountFirst,
          .profiles,
          .accountAccess {
            padding: 75px 0;
          }

          .accountFlow {
            grid-template-columns:
              1fr;
          }

          .sectionHeader {
            align-items: flex-start;

            flex-direction: column;
          }

          .profileGrid {
            grid-template-columns:
              1fr;
          }

          .liveChat {
            padding: 25px 16px;
          }

          .features {
            padding: 35px 20px;
          }

          .featureGrid {
            grid-template-columns:
              1fr;
          }

          .emergency {
            padding: 27px 18px;
          }

          .emergencyActions {
            flex-direction: column;
          }

          .emergencyPrimary,
          .emergencySecondary {
            width: 100%;
          }

          .store {
            padding: 38px 20px;
          }

          .productComposition {
            height: 285px;
          }

          .tagLarge {
            left: 15px;
          }

          .tagSmall {
            right: 12px;
          }

          .adminSection {
            padding: 28px 22px;

            align-items: flex-start;

            flex-direction: column;
          }

          .adminSection > a {
            width: 100%;
          }

          .finalCta {
            width:
              calc(
                100% - 28px
              );

            margin-bottom: 80px;
          }

          .finalCta h2 {
            font-size: 45px;
          }

          .finalCta > div {
            flex-direction: column;
          }

          .finalPrimary,
          .finalSecondary {
            width: 100%;
          }

          .footer {
            grid-template-columns:
              1fr;
          }

          .footerBottom {
            align-items: flex-start;

            flex-direction: column;

            gap: 7px;
          }
        }
      `}</style>
    </main>
  );
}
