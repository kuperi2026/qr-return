"use client";

import { useState } from "react";

import HomeHeader from "./components/home/HomeHeader";
import AboutMenu from "./components/home/AboutMenu";
import ShopMenu from "./components/home/ShopMenu";
import FAQMenu from "./components/home/FAQMenu";
import ContactMenu from "./components/home/ContactMenu";
import HomeHero from "./components/home/HomeHero";

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

  const ka = language === "ka";

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
        <AboutMenu ka={ka} />
      )}

      {openMenu === "shop" && (
        <ShopMenu ka={ka} />
      )}

      {openMenu === "faq" && (
        <FAQMenu ka={ka} />
      )}

      {openMenu === "contact" && (
        <ContactMenu ka={ka} />
      )}

      <HomeHero ka={ka} />
    </main>
  );
}
