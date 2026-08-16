"use client";

import { useState } from "react";

export default function Header() {
  const [language, setLanguage] = useState<"KA" | "EN">("KA");

  return (
    <header
      style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "21px",
              fontWeight: "800",
            }}
          >
            QR
          </div>

          <div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "800",
                color: "#111827",
              }}
            >
              QR Return
            </div>

            <div
              style={{
                fontSize: "11px",
                color: "#6b7280",
              }}
            >
              Lost & Found
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {/* LANGUAGE */}
          <button
            onClick={() =>
              setLanguage(language === "KA" ? "EN" : "KA")
            }
            style={{
              padding: "10px 13px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {language === "KA" ? "EN" : "ქარ"}
          </button>

          {/* LOGIN */}
          <a
            href="/login"
            style={{
              color: "#111827",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {language === "KA" ? "შესვლა" : "Log in"}
          </a>

          {/* REGISTER */}
          <a
            href="/register"
            style={{
              background: "#111827",
              color: "white",
              padding: "11px 17px",
              borderRadius: "11px",
              textDecoration: "none",
              fontWeight: "700",
              fontSize: "14px",
            }}
          >
            {language === "KA" ? "რეგისტრაცია" : "Sign up"}
          </a>
        </nav>
      </div>
    </header>
  );
}
