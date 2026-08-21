"use client";

import { useState } from "react";

import HomeHeader from "../components/home/HomeHeader";
import AboutMenu from "../components/home/AboutMenu";
import ShopMenu from "../components/home/ShopMenu";
import FaqMenu from "../components/home/FaqMenu";
import ContactMenu from "../components/home/ContactMenu";
import EmergencyHero from "../components/home/EmergencyHero";

export type Lang = "ka" | "en";

export type Menu =
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

  return (
    <main>
      <HomeHeader
        language={language}
        openMenu={openMenu}
        onLanguageChange={setLanguage}
        onMenuChange={setOpenMenu}
      />

      {openMenu === "about" && (
        <AboutMenu language={language} />
      )}

      {openMenu === "shop" && (
        <ShopMenu language={language} />
      )}

      {openMenu === "faq" && (
        <FaqMenu language={language} />
      )}

      {openMenu === "contact" && (
        <ContactMenu language={language} />
      )}

      <EmergencyHero
        language={language}
      />
    </main>
  );
}
