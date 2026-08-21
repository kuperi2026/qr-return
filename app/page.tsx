"use client";

import { useEffect, useState } from "react";

import HomeHeader from "@/components/home/HomeHeader";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

export default function HomePage() {
  const [language, setLanguage] =
    useState<Language>("ka");

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      const { data } =
        await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

      setIsAdmin(Boolean(data));
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

  return (
    <main>
      <HomeHeader
        language={language}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onLanguageChange={
          setLanguage
        }
      />
    </main>
  );
}
