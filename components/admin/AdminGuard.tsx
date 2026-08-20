"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AdminGuardProps = {
  children: ReactNode;
};

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [checking, setChecking] =
    useState(true);

  const [allowed, setAllowed] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      try {
        const {
          data: { user },
          error: authError,
        } =
          await supabase.auth.getUser();

        if (!mounted) {
          return;
        }

        if (authError || !user) {
          setAllowed(false);
          setChecking(false);

          router.replace("/login");

          return;
        }

        const {
          data: admin,
          error: adminError,
        } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!mounted) {
          return;
        }

        if (adminError) {
          console.error(
            "Admin check error:",
            adminError
          );

          setAllowed(false);
          setChecking(false);

          router.replace("/my-profiles");

          return;
        }

        if (!admin) {
          setAllowed(false);
          setChecking(false);

          router.replace("/my-profiles");

          return;
        }

        setAllowed(true);
        setChecking(false);
      } catch (error) {
        console.error(
          "Admin guard error:",
          error
        );

        if (!mounted) {
          return;
        }

        setAllowed(false);
        setChecking(false);

        router.replace("/my-profiles");
      }
    }

    void checkAdmin();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (checking) {
    return (
      <main className="adminLoading">
        <div className="logo">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <span>
          Checking admin access...
        </span>

        <style jsx>{`
          .adminLoading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 8px;

            color: #7c8791;

            background: #f5f7f8;
          }

          .logo {
            width: 52px;
            height: 52px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            color: white;

            background: linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

            font-size: 12px;
            font-weight: 900;
          }

          strong {
            color: #202b37;
            font-size: 14px;
          }

          span {
            font-size: 8px;
          }
        `}</style>
      </main>
    );
  }

  if (!allowed) {
    return null;
  }

  return <>{children}</>;
}
