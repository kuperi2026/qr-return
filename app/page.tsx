"use client";

import Link from "next/link";
import { useState } from "react";

type Lang = "ka" | "en";

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  return (
    <main className="page">
      <header className="header">
        <Link href="/" className="brand">
          <span className="logo">QR</span>

          <span className="brandText">
            <strong>QR RETURN</strong>
            <small>SECURE RETURN SYSTEM</small>
          </span>
        </Link>

        <nav className="nav">
          <a href="#start">
            {ka ? "როგორ დავიწყო" : "How to Start"}
          </a>

          <a href="#features">
            {ka ? "შესაძლებლობები" : "Features"}
          </a>

          <a href="#emergency">Emergency</a>

          <Link href="/store">
            {ka ? "მაღაზია" : "Store"}
          </Link>
        </nav>

        <div className="actions">
          <div className="languages">
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

          <Link href="/admin" className="admin">
            Admin
          </Link>

          <Link href="/login" className="login">
            {ka ? "შესვლა" : "Login"}
          </Link>

          <Link href="/register" className="register">
            {ka ? "ანგარიშის შექმნა" : "Create Account"}
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow">
            QR RETURN · SMART LOST & FOUND
          </span>

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

          <p>
            {ka
              ? "შექმენი ერთი QR RETURN ანგარიში, შეავსე მფლობელის პროფილი და შემდეგ დაამატე შენი ძაღლის, კატის ან ნივთების QR პროფილები."
              : "Create one QR RETURN account, complete your Owner Profile, then add QR profiles for your pets and belongings."}
          </p>

          <div className="heroButtons">
            <Link href="/register" className="primary">
              {ka ? "ანგარიშის შექმნა" : "Create Account"}
              <span>→</span>
            </Link>

            <Link href="/login" className="secondary">
              {ka ? "შესვლა" : "Sign In"}
            </Link>
          </div>

          <div className="quickLinks">
            <Link href="/my-profiles">
              {ka ? "ჩემი პროფილები" : "My Profiles"}
            </Link>

            <Link href="/account/messages">Live Chat</Link>

            <Link href="/store">
              {ka ? "მაღაზია" : "Store"}
            </Link>
          </div>
        </div>

        <div className="heroVisual">
          <div className="visualCard">
            <span className="visualLabel">QR RETURN</span>

            <div className="profileCircle">QR</div>

            <h3>Owner Connected</h3>

            <p>
              {ka
                ? "ერთი სკანირება მპოვნელს აკავშირებს მფლობელთან."
                : "One scan connects the finder with the owner."}
            </p>

            <div className="visualActions">
              <div>
                <strong>Live Chat</strong>
                <small>Secure contact</small>
              </div>

              <div>
                <strong>Location</strong>
                <small>Share securely</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="start" id="start">
        <div className="sectionTitle">
          <span>01 · START HERE</span>

          <h2>
            {ka
              ? "ჯერ ანგარიში. შემდეგ მფლობელი. მერე QR პროფილები."
              : "Account first. Then Owner Profile. Then QR Profiles."}
          </h2>
        </div>

        <div className="flow">
          <article>
            <span>01</span>
            <h3>
              {ka ? "ანგარიშის შექმნა" : "Create Account"}
            </h3>
            <p>
              {ka
                ? "შექმენი შენი პირადი QR RETURN ანგარიში."
                : "Create your personal QR RETURN account."}
            </p>
            <Link href="/register">
              {ka ? "დაწყება" : "Start"} →
            </Link>
          </article>

          <article>
            <span>02</span>
            <h3>
              {ka ? "მფლობელის პროფილი" : "Owner Profile"}
            </h3>
            <p>
              {ka
                ? "შეავსე მფლობელის ინფორმაცია და ხილვადობის პარამეტრები."
                : "Complete owner information and visibility settings."}
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>
              {ka ? "QR პროფილის შექმნა" : "Create QR Profile"}
            </h3>
            <p>
              {ka
                ? "დაამატე ძაღლი, კატა ან ნივთი შენს ანგარიშში."
                : "Add a dog, cat or item inside your account."}
            </p>
            <Link href="/my-profiles">
              {ka ? "ჩემი პროფილები" : "My Profiles"} →
            </Link>
          </article>

          <article>
            <span>04</span>
            <h3>
              {ka ? "QR-ის მიბმა" : "Connect QR"}
            </h3>
            <p>
              {ka
                ? "მიაბი ბრელოკი ან სტიკერი კონკრეტულ პროფილს."
                : "Connect a tag or sticker to the selected profile."}
            </p>
            <Link href="/store">
              {ka ? "მაღაზია" : "Store"} →
            </Link>
          </article>
        </div>
      </section>

      <section className="profileTypes">
        <div className="sectionTitle">
          <span>02 · QR PROFILE TYPES</span>

          <h2>
            {ka
              ? "ერთი ანგარიში. რამდენიმე ტიპის პროფილი."
              : "One account. Multiple profile types."}
          </h2>
        </div>

        <div className="profileGrid">
          {[
            ["DOG", ka ? "ძაღლი" : "Dog"],
            ["CAT", ka ? "კატა" : "Cat"],
            ["KEYS", ka ? "გასაღები" : "Keys"],
            ["WALLET", ka ? "საფულე" : "Wallet"],
            ["SUITCASE", ka ? "ჩემოდანი" : "Suitcase"],
            ["BAG", ka ? "ჩანთა" : "Bag"],
          ].map(([code, title]) => (
            <article key={code}>
              <span>{code}</span>
              <div className="typeMark">{code.charAt(0)}</div>
              <h3>{title}</h3>
              <p>
                {ka
                  ? "პროფილი იქმნება ანგარიშში შესვლის შემდეგ."
                  : "Created after signing in to your account."}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="features" id="features">
        <div className="sectionTitle light">
          <span>03 · SMART PROTECTION</span>

          <h2>
            {ka
              ? "მეტი ვიდრე უბრალოდ QR კოდი."
              : "More than just a QR code."}
          </h2>
        </div>

        <div className="featureGrid">
          <article>
            <span>01</span>
            <h3>Live Chat</h3>
            <p>
              {ka
                ? "Finder-ს შეუძლია მფლობელს პირდაპირ პლატფორმიდან მისწეროს."
                : "The finder can contact the owner directly through the platform."}
            </p>
          </article>

          <article>
            <span>02</span>
            <h3>
              {ka ? "ლოკაციის გაზიარება" : "Location Sharing"}
            </h3>
            <p>
              {ka
                ? "მპოვნელს შეუძლია მდებარეობის გაზიარება ერთი მოქმედებით."
                : "A finder can share location with one action."}
            </p>
          </article>

          <article>
            <span>03</span>
            <h3>WhatsApp / Phone</h3>
            <p>
              {ka
                ? "მფლობელი თავად ირჩევს რომელი დაკავშირების მეთოდი გამოჩნდეს."
                : "The owner chooses which contact methods are visible."}
            </p>
          </article>

          <article>
            <span>04</span>
            <h3>
              {ka ? "პირადი მონაცემების კონტროლი" : "Privacy Control"}
            </h3>
            <p>
              {ka
                ? "მფლობელი ზუსტად აკონტროლებს რას დაინახავს Finder."
                : "The owner controls exactly what the finder can see."}
            </p>
          </article>
        </div>
      </section>

      <section className="chatSection">
        <div className="chatPreview">
          <div className="chatHeader">
            <div>
              <strong>Finder</strong>
              <small>● Online</small>
            </div>

            <span>SECURE CHAT</span>
          </div>

          <div className="messages">
            <div className="finderMessage">
              {ka
                ? "გამარჯობა, თქვენი ნივთი ვიპოვე."
                : "Hi, I found your item."}
            </div>

            <div className="ownerMessage">
              {ka
                ? "დიდი მადლობა. შეგიძლიათ ლოკაცია გამიზიაროთ?"
                : "Thank you. Could you share your location?"}
            </div>

            <div className="locationMessage">
              {ka
                ? "ლოკაცია გაზიარებულია"
                : "Location shared"}
            </div>
          </div>
        </div>

        <div className="chatCopy">
          <span>LIVE CHAT</span>

          <h2>
            {ka
              ? "Finder-ს რეგისტრაცია არ სჭირდება."
              : "The finder does not need an account."}
          </h2>

          <p>
            {ka
              ? "ერთი QR სკანირების შემდეგ მპოვნელმა შეიძლება გახსნას Live Chat, გამოგიგზავნოს შეტყობინება ან ლოკაცია."
              : "After one QR scan, the finder can open Live Chat, send a message or share location."}
          </p>

          <Link href="/account/messages">
            Live Chat →
          </Link>
        </div>
      </section>

      <section className="emergency" id="emergency">
        <div>
          <span className="emergencyLabel">
            QR RETURN EMERGENCY
          </span>

          <h2>
            {ka
              ? "Emergency პროფილიც იქმნება შენი ანგარიშიდან."
              : "Emergency profiles are also created from your account."}
          </h2>

          <p>
            {ka
              ? "ჯერ ქმნი QR RETURN ანგარიშს, შემდეგ Owner Profile-ს და ამის შემდეგ შეგიძლია Emergency პროფილის დამატება."
              : "Create your QR RETURN account first, complete the Owner Profile, then add an Emergency profile."}
          </p>
        </div>

        <div className="emergencyButtons">
          <Link href="/register" className="emergencyPrimary">
            {ka ? "ანგარიშის შექმნა" : "Create Account"}
            <span>→</span>
          </Link>

          <Link href="/my-profiles" className="emergencySecondary">
            {ka ? "ჩემი პროფილები" : "My Profiles"}
          </Link>
        </div>
      </section>

      <section className="store">
        <div>
          <span>QR RETURN STORE</span>

          <h2>
            {ka
              ? "QR ბრელოკები და სტიკერები სხვადასხვა დიზაინით."
              : "QR tags and stickers in multiple designs."}
          </h2>

          <p>
            {ka
              ? "პროდუქტის ყიდვა მხოლოდ რეგისტრირებული მომხმარებლის ანგარიშიდან ხდება."
              : "Purchases are made through a registered QR RETURN account."}
          </p>

          <Link href="/store">
            {ka ? "მაღაზიის გახსნა" : "Explore Store"} →
          </Link>
        </div>

        <div className="storeGraphic">
          <div className="tagLarge">QR</div>
          <div className="tagSmall">QR</div>
          <div className="sticker">QR RETURN</div>
        </div>
      </section>

      <section className="accountLinks">
        <div className="sectionTitle">
          <span>YOUR ACCOUNT</span>

          <h2>
            {ka
              ? "შესვლის შემდეგ ყველაფერი ერთ სივრცეშია."
              : "Everything stays in one place after sign-in."}
          </h2>
        </div>

        <div className="accountGrid">
          <Link href="/my-profiles">
            <span>01</span>
            <strong>
              {ka ? "ჩემი პროფილები" : "My Profiles"}
            </strong>
            <b>→</b>
          </Link>

          <Link href="/account/messages">
            <span>02</span>
            <strong>Live Chat</strong>
            <b>→</b>
          </Link>

          <Link href="/account/notifications">
            <span>03</span>
            <strong>
              {ka ? "შეტყობინებები" : "Notifications"}
            </strong>
            <b>→</b>
          </Link>

          <Link href="/account/orders">
            <span>04</span>
            <strong>
              {ka ? "ჩემი შეკვეთები" : "My Orders"}
            </strong>
            <b>→</b>
          </Link>
        </div>
      </section>

      <section className="adminSection">
        <div>
          <span>QR RETURN ADMINISTRATION</span>

          <h2>Admin Panel</h2>

          <p>
            {ka
              ? "პლატფორმის ადმინისტრაციული მართვა."
              : "Administrative management for the platform."}
          </p>
        </div>

        <Link href="/admin">
          Open Admin Panel →
        </Link>
      </section>

      <footer className="footer">
        <div>
          <strong>QR RETURN</strong>
          <p>
            {ka
              ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
              : "Never lose what matters."}
          </p>
        </div>

        <Link href="/register">
          {ka ? "ანგარიშის შექმნა" : "Create Account"}
        </Link>

        <Link href="/login">
          {ka ? "შესვლა" : "Login"}
        </Link>

        <Link href="/admin">
          Admin
        </Link>
      </footer>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background: #ffffff;
          color: #142236;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .header {
          width: calc(100% - 48px);
          max-width: 1280px;
          min-height: 84px;
          margin: auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 32px;
          border-bottom: 1px solid #e7ecf1;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
        }

        .logo {
          width: 47px;
          height: 47px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(135deg, #0874f9, #6557f5);
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
        }

        .brandText strong,
        .brandText small {
          display: block;
        }

        .brandText strong {
          color: #0874f9;
          font-size: 16px;
          font-weight: 900;
        }

        .brandText small {
          margin-top: 3px;
          color: #7767e8;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
        }

        .nav a {
          color: #58677a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
        }

        .actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #f1f4f7;
        }

        .languages button {
          width: 39px;
          height: 30px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          color: #84909d;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .languages button.active {
          background: #ffffff;
          color: #0874f9;
        }

        .admin,
        .login,
        .register {
          min-height: 40px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          border-radius: 9px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        .admin {
          color: #654fc0;
          border: 1px solid #e4ddf6;
          background: #fbf9ff;
        }

        .login {
          color: #536174;
          border: 1px solid #dde4ea;
        }

        .register {
          color: white;
          background: #0874f9;
        }

        .hero {
          width: calc(100% - 48px);
          max-width: 1280px;
          min-height: 690px;
          margin: auto;
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(400px, 0.9fr);
          align-items: center;
          gap: 70px;
        }

        .eyebrow,
        .sectionTitle > span,
        .chatCopy > span,
        .store > div:first-child > span {
          color: #6c5bea;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 1.3px;
        }

        .hero h1 {
          margin: 22px 0 0;
          max-width: 800px;
          font-size: clamp(60px, 6vw, 82px);
          line-height: 0.98;
          letter-spacing: -4px;
        }

        .hero h1 span {
          color: #0874f9;
        }

        .heroCopy > p {
          max-width: 680px;
          margin: 25px 0 0;
          color: #657487;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroButtons {
          margin-top: 32px;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .primary,
        .secondary {
          min-height: 52px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 35px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
        }

        .primary {
          color: white;
          background: linear-gradient(135deg, #0874f9, #6557f5);
        }

        .secondary {
          color: #536174;
          border: 1px solid #dce3e9;
        }

        .quickLinks {
          margin-top: 22px;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .quickLinks a {
          color: #637285;
          text-decoration: none;
          font-size: 14px;
          font-weight: 650;
        }

        .heroVisual {
          display: flex;
          justify-content: center;
        }

        .visualCard {
          width: 360px;
          padding: 28px;
          border: 1px solid #dfe6ed;
          border-radius: 28px;
          background: linear-gradient(145deg, #f5f9ff, #f9f7ff);
          box-shadow: 0 35px 90px rgba(29, 49, 78, 0.13);
        }

        .visualLabel {
          color: #0874f9;
          font-size: 11px;
          font-weight: 900;
        }

        .profileCircle {
          width: 110px;
          height: 110px;
          margin: 35px auto 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: white;
          background: linear-gradient(145deg, #0874f9, #6557f5);
          font-size: 30px;
          font-weight: 900;
        }

        .visualCard h3 {
          margin: 24px 0 0;
          text-align: center;
          font-size: 24px;
        }

        .visualCard > p {
          margin: 10px auto 0;
          max-width: 260px;
          text-align: center;
          color: #748294;
          font-size: 14px;
          line-height: 1.6;
        }

        .visualActions {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .visualActions div {
          padding: 16px;
          border: 1px solid #dfe5eb;
          border-radius: 12px;
          background: white;
        }

        .visualActions strong,
        .visualActions small {
          display: block;
        }

        .visualActions strong {
          font-size: 14px;
        }

        .visualActions small {
          margin-top: 4px;
          color: #89949f;
          font-size: 11px;
        }

        .start,
        .profileTypes,
        .accountLinks {
          width: calc(100% - 48px);
          max-width: 1280px;
          margin: auto;
          padding: 100px 0;
          border-top: 1px solid #e9edf2;
        }

        .sectionTitle {
          max-width: 850px;
        }

        .sectionTitle h2,
        .chatCopy h2,
        .emergency h2,
        .store h2 {
          margin: 12px 0 0;
          font-size: clamp(42px, 4vw, 56px);
          line-height: 1.05;
          letter-spacing: -2.3px;
        }

        .flow {
          margin-top: 45px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .flow article,
        .profileGrid article {
          min-height: 270px;
          padding: 25px;
          border: 1px solid #e1e7ec;
          border-radius: 18px;
          background: white;
        }

        .flow article > span,
        .profileGrid article > span {
          color: #8f9aa5;
          font-size: 11px;
          font-weight: 800;
        }

        .flow h3,
        .profileGrid h3 {
          margin: 45px 0 0;
          font-size: 21px;
        }

        .flow p,
        .profileGrid p {
          margin: 9px 0 0;
          color: #768496;
          font-size: 15px;
          line-height: 1.6;
        }

        .flow a {
          display: inline-block;
          margin-top: 25px;
          color: #0874f9;
          text-decoration: none;
          font-size: 14px;
          font-weight: 750;
        }

        .profileGrid {
          margin-top: 45px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .typeMark {
          width: 68px;
          height: 68px;
          margin-top: 34px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          color: white;
          background: linear-gradient(145deg, #0874f9, #6557f5);
          font-size: 25px;
          font-weight: 900;
        }

        .profileGrid h3 {
          margin-top: 22px;
        }

        .features {
          width: calc(100% - 48px);
          max-width: 1280px;
          margin: auto;
          padding: 70px;
          border-radius: 28px;
          background: #102139;
          color: white;
        }

        .sectionTitle.light h2 {
          color: white;
        }

        .featureGrid {
          margin-top: 45px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        .featureGrid article {
          min-height: 220px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          background: rgba(255,255,255,0.035);
        }

        .featureGrid article > span {
          color: #8b7cff;
          font-size: 11px;
          font-weight: 800;
        }

        .featureGrid h3 {
          margin: 40px 0 0;
          font-size: 19px;
        }

        .featureGrid p {
          margin: 9px 0 0;
          color: #a3afbc;
          font-size: 14px;
          line-height: 1.6;
        }

        .chatSection {
          width: calc(100% - 48px);
          max-width: 1280px;
          margin: 100px auto;
          padding: 65px;
          display: grid;
          grid-template-columns: minmax(400px, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: 75px;
          border-radius: 28px;
          background: linear-gradient(145deg, #f5f9ff, #faf8ff);
        }

        .chatPreview {
          padding: 18px;
          border: 1px solid #dfe5eb;
          border-radius: 20px;
          background: white;
        }

        .chatHeader {
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e9edf1;
        }

        .chatHeader strong,
        .chatHeader small {
          display: block;
        }

        .chatHeader strong {
          font-size: 15px;
        }

        .chatHeader small {
          margin-top: 3px;
          color: #2bab6d;
          font-size: 11px;
        }

        .chatHeader > span {
          color: #8c98a4;
          font-size: 10px;
          font-weight: 800;
        }

        .messages {
          min-height: 280px;
          padding: 30px 10px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fafbfd;
        }

        .finderMessage,
        .ownerMessage,
        .locationMessage {
          max-width: 73%;
          padding: 13px 16px;
          border-radius: 14px;
          font-size: 14px;
        }

        .finderMessage {
          align-self: flex-start;
          border: 1px solid #e1e6eb;
          background: white;
        }

        .ownerMessage {
          align-self: flex-end;
          color: white;
          background: #0874f9;
        }

        .locationMessage {
          align-self: flex-start;
          color: #36715a;
          background: #e8f7ef;
        }

        .chatCopy p {
          max-width: 600px;
          margin: 18px 0 0;
          color: #687789;
          font-size: 17px;
          line-height: 1.7;
        }

        .chatCopy a {
          display: inline-block;
          margin-top: 25px;
          color: #0874f9;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
        }

        .emergency,
        .store {
          width: calc(100% - 48px);
          max-width: 1280px;
          margin: 0 auto 100px;
          padding: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 50px;
          border-radius: 26px;
        }

        .emergency {
          border: 1px solid #efdadd;
          background: #fff9f9;
        }

        .emergency > div:first-child {
          max-width: 800px;
        }

        .emergencyLabel {
          color: #d64b56;
          font-size: 12px;
          font-weight: 850;
          letter-spacing: 1.2px;
        }

        .emergency p,
        .store p {
          max-width: 700px;
          margin: 16px 0 0;
          color: #707e8d;
          font-size: 17px;
          line-height: 1.7;
        }

        .emergencyButtons {
          min-width: 210px;
          display: grid;
          gap: 8px;
        }

        .emergencyPrimary,
        .emergencySecondary {
          min-height: 49px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .emergencyPrimary {
          color: white;
          background: #d64b56;
        }

        .emergencySecondary {
          color: #754e54;
          border: 1px solid #ead9dc;
          background: white;
        }

        .store {
          min-height: 430px;
          color: white;
          background: #11233b;
        }

        .store > div:first-child {
          max-width: 730px;
        }

        .store h2 {
          color: white;
        }

        .store p {
          color: #a7b3c0;
        }

        .store a {
          display: inline-block;
          margin-top: 25px;
          color: #11233b;
          background: white;
          padding: 14px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .storeGraphic {
          width: 360px;
          height: 260px;
          position: relative;
        }

        .tagLarge,
        .tagSmall,
        .sticker {
          position: absolute;
          display: grid;
          place-items: center;
          color: #0874f9;
          background: white;
          box-shadow: 0 25px 70px rgba(0,0,0,0.2);
          font-weight: 900;
        }

        .tagLarge {
          width: 160px;
          height: 160px;
          left: 20px;
          top: 55px;
          border-radius: 50%;
          font-size: 34px;
        }

        .tagSmall {
          width: 105px;
          height: 105px;
          right: 15px;
          top: 10px;
          border-radius: 50%;
          font-size: 25px;
        }

        .sticker {
          width: 150px;
          height: 95px;
          right: 0;
          bottom: 5px;
          border-radius: 17px;
          font-size: 14px;
        }

        .accountGrid {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .accountGrid a {
          min-height: 85px;
          padding: 0 20px;
          display: grid;
          grid-template-columns: 45px 1fr auto;
          align-items: center;
          gap: 15px;
          border: 1px solid #e1e7ec;
          border-radius: 14px;
          color: inherit;
          text-decoration: none;
        }

        .accountGrid span {
          color: #0874f9;
          font-size: 12px;
          font-weight: 850;
        }

        .accountGrid strong {
          font-size: 17px;
        }

        .accountGrid b {
          color: #0874f9;
          font-size: 20px;
        }

        .adminSection {
          width: calc(100% - 48px);
          max-width: 1280px;
          margin: 0 auto 100px;
          padding: 35px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border: 1px solid #e4def4;
          border-radius: 18px;
          background: #faf9ff;
        }

        .adminSection > div > span {
          color: #7058ca;
          font-size: 11px;
          font-weight: 850;
        }

        .adminSection h2 {
          margin: 6px 0 0;
          font-size: 28px;
        }

        .adminSection p {
          margin: 5px 0 0;
          color: #81798d;
          font-size: 14px;
        }

        .adminSection a {
          min-height: 48px;
          padding: 0 17px;
          display: flex;
          align-items: center;
          border-radius: 10px;
          color: white;
          background: #614ab6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
        }

        .footer {
          width: calc(100% - 48px);
          max-width: 1280px;
          min-height: 115px;
          margin: auto;
          display: flex;
          align-items: center;
          gap: 30px;
          border-top: 1px solid #e5eaee;
        }

        .footer > div {
          margin-right: auto;
        }

        .footer strong {
          color: #0874f9;
          font-size: 16px;
        }

        .footer p {
          margin: 4px 0 0;
          color: #89949f;
          font-size: 13px;
        }

        .footer a {
          color: #5d6c7d;
          text-decoration: none;
          font-size: 14px;
        }

        @media (max-width: 1000px) {
          .nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
            padding: 70px 0;
            text-align: center;
          }

          .heroCopy > p {
            margin-left: auto;
            margin-right: auto;
          }

          .heroButtons,
          .quickLinks {
            justify-content: center;
          }

          .flow,
          .featureGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chatSection {
            grid-template-columns: 1fr;
          }

          .emergency,
          .store {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 650px) {
          .header,
          .hero,
          .start,
          .profileTypes,
          .features,
          .chatSection,
          .emergency,
          .store,
          .accountLinks,
          .adminSection,
          .footer {
            width: calc(100% - 26px);
          }

          .header {
            grid-template-columns: auto 1fr;
          }

          .languages,
          .admin,
          .login {
            display: none;
          }

          .brandText small {
            display: none;
          }

          .hero h1 {
            font-size: 46px;
            letter-spacing: -2.5px;
          }

          .heroCopy > p {
            font-size: 16px;
          }

          .heroButtons {
            flex-direction: column;
          }

          .primary,
          .secondary {
            width: 100%;
          }

          .visualCard {
            width: 100%;
          }

          .flow,
          .profileGrid,
          .featureGrid,
          .accountGrid {
            grid-template-columns: 1fr;
          }

          .features,
          .chatSection,
          .emergency,
          .store {
            padding: 30px 20px;
          }

          .storeGraphic {
            width: 100%;
          }

          .adminSection {
            align-items: flex-start;
            flex-direction: column;
          }

          .adminSection a {
            width: 100%;
          }

          .footer {
            padding: 30px 0;
            align-items: flex-start;
            flex-direction: column;
          }

          .footer > div {
            margin-right: 0;
          }
        }
      `}</style>
    </main>
  );
}
