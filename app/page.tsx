"use client";

import { useState } from "react";
import HomeHeader from "./components/home/HomeHeader";

type Lang = "ka" | "en";

export default function HomePage() {
  const [language, setLanguage] = useState<Lang>("ka");

  return (
    <>
      <HomeHeader
        language={language}
        onLanguageChange={setLanguage}
      />

      <main>
        {/* შემდეგ კომპონენტებს აქ თითო-თითოდ დავამატებთ */}
      </main>
    </>
  );
}
