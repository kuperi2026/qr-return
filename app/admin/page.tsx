"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type AdminUser = {
  user_id: string;
};

export default function AdminDashboardPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function loadAdmin() {
      setLoading(true);
      setError("");

      const {
        data: userData,
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const {
        data: adminData,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (adminError) {
        setError(adminError.message);
        setLoading(false);
        return;
      }

      const admin = adminData as AdminUser | null;

      if (!admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const {
        data: messageData,
        error: messageError,
      } = await supabase
        .from("support_messages")
        .select("id, sender")
        .eq("sender", "user");

      if (!messageError) {
        setSupportCount(messageData?.length || 0);
      }

      setLoading(false);
    }

    void loadAdmin();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const channel = supabase
      .channel("admin-dashboard-support")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
        },
        (payload) => {
          const message = payload.new as {
            sender?: string;
          };

          if (message.sender === "user") {
            setSupportCount((current) => current + 1);
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  if (loading) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          {ka
            ? "Admin Dashboard იტვირთება..."
            : "Loading Admin Dashboard..."}
        </strong>

        <Styles />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="statePage">
        <div className="lock">🔒</div>

        <h1>
          {ka
            ? "Admin წვდომაა საჭირო"
            : "Admin access required"}
        </h1>

        <p>
          {ka
            ? "ამ გვერდის ნახვა მხოლოდ QR RETURN ადმინისტრატორს შეუძლია."
            : "Only a QR RETURN administrator can access this page."}
        </p>

        <a href="/login">
          {ka
            ? "Admin ანგარიშით შესვლა"
            : "Sign in as Admin"}
        </a>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>ADMIN DASHBOARD</small>
          </div>
        </a>

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
      </header>

      <section className="dashboard">
        <div className="intro">
          <div className="eyebrow">
            QR RETURN
          </div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            {ka
              ? "მართეთ QR RETURN-ის Support, მომხმარებლები და QR პროფილები ერთი ადგილიდან."
              : "Manage QR RETURN Support, users and QR profiles from one place."}
          </p>
        </div>

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        <div className="grid">
          <a
            href="/admin/support"
            className="card support"
          >
            <div className="cardTop">
              <div className="icon">
                💬
              </div>

              {supportCount > 0 && (
                <div className="badge">
                  {supportCount}
                </div>
              )}
            </div>

            <h2>
              Support Inbox
            </h2>

            <p>
              {ka
                ? "ნახეთ მომხმარებლების შეტყობინებები და უპასუხეთ Live Chat-ში."
                : "View customer messages and reply through Live Chat."}
            </p>

            <span className="openLink">
              {ka ? "გახსენით" : "Open"} →
            </span>
          </a>

          <div className="card disabled">
            <div className="cardTop">
              <div className="icon">
                🔎
              </div>

              <div className="soon">
                {ka ? "მალე" : "Soon"}
              </div>
            </div>

            <h2>
              {ka ? "QR ძებნა" : "QR Search"}
            </h2>

            <p>
              {ka
                ? "მოძებნეთ პროფილი QR კოდის საშუალებით."
                : "Find a profile using its QR code."}
            </p>
          </div>

          <div className="card disabled">
            <div className="cardTop">
              <div className="icon">
                👥
              </div>

              <div className="soon">
                {ka ? "მალე" : "Soon"}
              </div>
            </div>

            <h2>
              {ka ? "მომხმარებლები" : "Users"}
            </h2>

            <p>
              {ka
                ? "ნახეთ რეგისტრირებული ანგარიშები და პროფილები."
                : "View registered accounts and profiles."}
            </p>
          </div>

          <div className="card disabled">
            <div className="cardTop">
              <div className="icon">
                🏷️
              </div>

              <div className="soon">
                {ka ? "მალე" : "Soon"}
              </div>
            </div>

            <h2>
              {ka ? "QR პროფილები" : "QR Profiles"}
            </h2>

            <p>
              {ka
                ? "ნახეთ აქტიური QR კოდები, ცხოველები, ნივთები და Emergency პროფილები."
                : "View active QR codes, pets, items and Emergency profiles."}
            </p>
          </div>
        </div>

        <div className="quickActions">
          <a href="/admin/support">
            💬{" "}
            {ka
              ? "Support შეტყობინებებზე გადასვლა"
              : "Open Support messages"}
          </a>

          <a href="/">
            ←{" "}
            {ka
              ? "მთავარ გვერდზე დაბრუნება"
              : "Back to website"}
          </a>
        </div>
      </section>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f5f7fb;
      }

      button {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        color: #101828;
        font-family:
          Inter,
          Arial,
          sans-serif;
        background:
          radial-gradient(
            circle at 95% 5%,
            rgba(118, 85, 247, 0.1),
            transparent 26%
          ),
          #f5f7fb;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1180px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
      }

      .logo {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background:
          linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 18px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.9px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .dashboard {
        width: calc(100% - 32px);
        max-width: 1080px;
        margin: auto;
        padding: 55px 0 80px;
      }

      .intro {
        max-width: 700px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .intro h1 {
        margin: 10px 0 10px;
        font-size: clamp(34px, 5vw, 52px);
        letter-spacing: -2px;
      }

      .intro p {
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.65;
      }

      .grid {
        margin-top: 36px;
        display: grid;
        grid-template-columns:
          repeat(2, 1fr);
        gap: 16px;
      }

      .card {
        min-height: 220px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        border: 1px solid #e4e7ec;
        border-radius: 20px;
        background: white;
        color: inherit;
        text-decoration: none;
        box-shadow:
          0 12px 38px rgba(16, 24, 40, 0.05);
      }

      .card.support {
        border-color: #d9d6fe;
        background:
          linear-gradient(
            135deg,
            #ffffff,
            #f5f3ff
          );
      }

      .card:not(.disabled) {
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease;
      }

      .card:not(.disabled):hover {
        transform: translateY(-3px);
        box-shadow:
          0 18px 48px rgba(16, 24, 40, 0.1);
      }

      .card.disabled {
        opacity: 0.66;
      }

      .cardTop {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .icon {
        width: 54px;
        height: 54px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: #eef4ff;
        font-size: 26px;
      }

      .support .icon {
        background:
          linear-gradient(
            135deg,
            #e8efff,
            #eee9ff
          );
      }

      .badge {
        min-width: 30px;
        height: 30px;
        padding: 0 8px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: #d92d20;
        color: white;
        font-size: 10px;
        font-weight: 900;
      }

      .soon {
        padding: 5px 8px;
        border-radius: 7px;
        background: #f2f4f7;
        color: #667085;
        font-size: 8px;
        font-weight: 800;
      }

      .card h2 {
        margin: 20px 0 8px;
        color: #344054;
        font-size: 20px;
      }

      .card p {
        flex: 1;
        margin: 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.55;
      }

      .openLink {
        margin-top: 20px;
        color: #1465e8;
        font-size: 11px;
        font-weight: 900;
      }

      .quickActions {
        margin-top: 28px;
        padding-top: 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        border-top: 1px solid #e4e7ec;
      }

      .quickActions a {
        color: #1465e8;
        font-size: 11px;
        font-weight: 800;
        text-decoration: none;
      }

      .error {
        margin-top: 20px;
        padding: 12px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 10px;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        color: #344054;
        font-family:
          Inter,
          Arial,
          sans-serif;
        text-align: center;
      }

      .statePage p {
        max-width: 420px;
        color: #667085;
        font-size: 12px;
        line-height: 1.55;
      }

      .statePage a {
        margin-top: 12px;
        padding: 11px 15px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .lock {
        font-size: 42px;
      }

      .loader {
        width: 36px;
        height: 36px;
        margin-bottom: 11px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 700px) {
        .dashboard {
          padding-top: 38px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .quickActions {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
