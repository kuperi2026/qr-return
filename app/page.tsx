"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface AuthStatus {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

export function useAuthStatus(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>({
    isLoggedIn: false,
    isAdmin: false,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (!user) {
        setStatus({ isLoggedIn: false, isAdmin: false, isLoading: false });
        return;
      }

      const metadataAdmin =
        user.user_metadata?.role === "admin" ||
        user.app_metadata?.role === "admin";

      if (metadataAdmin) {
        setStatus({ isLoggedIn: true, isAdmin: true, isLoading: false });
        return;
      }

      const { data: adminRow, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (error) {
        console.warn("Admin check failed:", error.message);
        setStatus({ isLoggedIn: true, isAdmin: false, isLoading: false });
        return;
      }

      setStatus({
        isLoggedIn: true,
        isAdmin: Boolean(adminRow),
        isLoading: false,
      });
    };

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkUser();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return status;
}
