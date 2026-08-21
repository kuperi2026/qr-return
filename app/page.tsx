"use client";

import { useState } from "react";

import HomeHeader from "./components/home/HomeHeader";
import AboutMenu from "./components/home/AboutMenu";
import ShopMenu from "./components/home/ShopMenu";

type Lang = "ka" | "en";

type Menu =
  | "about"
  | "shop"
  | "faq"
  | "contact"
  | null;

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");
  const [openMenu, setOpenMenu] = useState<Menu>(null);

  const toggleMenu = (menu: Exclude<Menu, null>) => {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#1266e9",
      }}
    >
      <HomeHeader
        language={language}
        openMenu={openMenu}
        setLanguage={setLanguage}
        toggleMenu={toggleMenu}
      />

      {openMenu === "about" && (
        <AboutMenu ka={language === "ka"} />
      )}

      {openMenu === "shop" && (
        <ShopMenu ka={language === "ka"} />
      )}

      <section
        style={{
          minHeight: "650px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "48px",
            }}
          >
            QR RETURN
          </h1>

          <p
            style={{
              marginTop: "10px",
              fontSize: "13px",
              letterSpacing: "2px",
            }}
          >
            SMART LOST &amp; FOUND
          </p>
        </div>
      </section>
    </main>
  );
}
