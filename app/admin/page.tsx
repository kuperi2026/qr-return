"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

export default function AdminDashboardPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [supportCount, setSupportCount] = useState(0);

  const ka = lang === "ka";

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!admin) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);

      const { count } = await supabase
        .from("support_messages")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("sender", "user");

      setSupportCount(count || 0);
      setLoading(false);
    }

    void checkAdmin();
  }, []);

  if (loading) {
    return (
      <main className="center">
        <div className="loader" />
        <strong>
          {ka ? "იტვირთება..." : "Loading..."}
        </strong>

        <Styles />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="center">
        <div className="lock">🔒</div>

        <h1>
          {ka
            ? "Admin წვდომაა საჭირო"
            : "Admin access required"}
        </h1>

        <p>
          {ka
            ? "შედით თქვენი QR RETURN Admin ანგარიშით."
            : "Sign in with your QR RETURN Admin account."}
        </p>

        <a className="loginButton" href="/login">
          {ka ? "შესვლა" : "Sign in"}
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
            <small>ADMIN</small>
          </div>
        </a>

        <div className="languages">
          <button
            className={ka ? "active" : ""}
            onClick={() => setLang("ka")}
          >
            GEO
          </button>

          <button
            className={!ka ? "active" : ""}
            onClick={() => setLang("en")}
          >
            ENG
          </button>
        </div>
      </header>

      <section className="content">
        <div className="welcome">
          <span>QR RETURN</span>

          <h1>Admin Dashboard</h1>

          <p>
            {ka
              ? "მართეთ თქვენი პლატფორმა ერთი ადგილიდან."
              : "Manage your platform from one place."}
          </p>
        </div>

        <div className="grid">

          {/* SUPPORT */}
          <a href="/admin/support" className="card support">
            <div className="top">
              <div className="icon">💬</div>

              {supportCount > 0 && (
                <div className="badge">
                  {supportCount}
                </div>
              )}
            </div>

            <h2>Support Inbox</h2>

            <p>
              {ka
                ? "ნახეთ მომხმარებლების შეტყობინებები და უპასუხეთ Live Chat-ში."
                : "View messages and reply through Live Chat."}
            </p>

            <strong className="open">
              {ka ? "გახსნა" : "Open"} →
            </strong>
          </a>

          {/* QR SEARCH */}
          <a href="/admin/search" className="card">
            <div className="icon">🔎</div>

            <h2>
              {ka ? "QR ძებნა" : "QR Search"}
            </h2>

            <p>
              {ka
                ? "მოძებნეთ მომხმარებელი ან პროფილი QR კოდის საშუალებით."
                : "Find a user or profile using a QR code."}
            </p>

            <strong className="open">
              {ka ? "გახსნა" : "Open"} →
            </strong>
          </a>

          {/* USERS */}
          <a href="/admin/users" className="card">
            <div className="icon">👥</div>

            <h2>
              {ka ? "მომხმარებლები" : "Users"}
            </h2>

            <p>
              {ka
                ? "ნახეთ QR RETURN-ში რეგისტრირებული მომხმარებლები."
                : "View registered QR RETURN users."}
            </p>

            <strong className="open">
              {ka ? "გახსნა" : "Open"} →
            </strong>
          </a>

          {/* QR PROFILES */}
          <a href="/admin/items" className="card">
            <div className="icon">🏷️</div>

            <h2>
              {ka ? "QR პროფილები" : "QR Profiles"}
            </h2>

            <p>
              {ka
                ? "მართეთ ცხოველების, ნივთებისა და Emergency QR პროფილები."
                : "Manage pet, item and Emergency QR profiles."}
            </p>

            <strong className="open">
              {ka ? "გახსნა" : "Open"} →
            </strong>
          </a>

        </div>

        <div className="bottom">
          <a href="/">← {ka ? "საიტზე დაბრუნება" : "Back to website"}</a>
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

      body {
        margin: 0;
        background: #f5f7fb;
        font-family: Inter, Arial, sans-serif;
        color: #101828;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 95% 0%,
            rgba(118,85,247,.12),
            transparent 28%
          ),
          #f5f7fb;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1150px;
        height: 80px;
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
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg,#1465e8,#7655f7);
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #1465e8;
        font-size: 18px;
        font-weight: 900;
      }

      .brand small {
        display: block;
        margin-top: 2px;
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .languages {
        display: flex;
        padding: 4px;
        border-radius: 10px;
        background: #eaecf0;
      }

      .languages button {
        padding: 8px 10px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .content {
        width: calc(100% - 32px);
        max-width: 1050px;
        margin: auto;
        padding: 58px 0 80px;
      }

      .welcome span {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .welcome h1 {
        margin: 8px 0;
        font-size: clamp(35px,5vw,50px);
        letter-spacing: -2px;
      }

      .welcome p {
        margin: 0;
        color: #667085;
        font-size: 15px;
      }

      .grid {
        margin-top: 38px;
        display: grid;
        grid-template-columns: repeat(2,1fr);
        gap: 18px;
      }

      .card {
        min-height: 225px;
        padding: 25px;
        display: flex;
        flex-direction: column;
        border: 1px solid #e4e7ec;
        border-radius: 21px;
        background: white;
        color: #344054;
        text-decoration: none;
        box-shadow: 0 12px 35px rgba(16,24,40,.05);
        transition: .18s ease;
      }

      .card:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 45px rgba(16,24,40,.1);
      }

      .card.support {
        border-color: #d9d6fe;
        background: linear-gradient(135deg,#fff,#f5f3ff);
      }

      .top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .icon {
        width: 56px;
        height: 56px;
        display: grid;
        place-items: center;
        border-radius: 16px;
        background: #eef4ff;
        font-size: 27px;
      }

      .badge {
        min-width: 31px;
        height: 31px;
        padding: 0 8px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: #d92d20;
        color: white;
        font-size: 11px;
        font-weight: 900;
      }

      .card h2 {
        margin: 20px 0 8px;
        font-size: 21px;
      }

      .card p {
        flex: 1;
        margin: 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .open {
        margin-top: 18px;
        color: #1465e8;
        font-size: 12px;
      }

      .bottom {
        margin-top: 30px;
        padding-top: 22px;
        border-top: 1px solid #e4e7ec;
      }

      .bottom a {
        color: #1465e8;
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
      }

      .center {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        text-align: center;
        font-family: Inter,Arial,sans-serif;
      }

      .lock {
        font-size: 44px;
      }

      .center p {
        color: #667085;
      }

      .loginButton {
        margin-top: 10px;
        padding: 11px 17px;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-weight: 900;
        text-decoration: none;
      }

      .loader {
        width: 38px;
        height: 38px;
        margin-bottom: 12px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @media(max-width:700px) {
        .grid {
          grid-template-columns: 1fr;
        }

        .content {
          padding-top: 38px;
        }
      }
    `}</style>
  );
}
