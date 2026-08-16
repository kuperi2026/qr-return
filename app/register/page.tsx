"use client";

import { useState } from "react";
import { items } from "@/data/items";

export default function RegisterPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 20px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          ← მთავარ გვერდზე დაბრუნება
        </a>

        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "#eff6ff",
              color: "#2563eb",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "800",
            }}
          >
            QR REGISTRATION
          </div>

          <h1
            style={{
              marginTop: "18px",
              marginBottom: 0,
              fontSize: "clamp(36px, 6vw, 56px)",
              fontWeight: "900",
              color: "#111827",
              letterSpacing: "-1px",
            }}
          >
            რის რეგისტრაციას აკეთებ?
          </h1>

          <p
            style={{
              marginTop: "16px",
              color: "#6b7280",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            აირჩიე ცხოველი ან ნივთი, რომელსაც QR კოდი უნდა დაუკავშირო.
          </p>
        </div>

        <div
          style={{
            marginTop: "45px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item) => {
            const active = selectedItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item.id)}
                style={{
                  border: active
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                  background: active ? "#eff6ff" : "#ffffff",
                  borderRadius: "28px",
                  padding: "28px 20px",
                  cursor: "pointer",
                  minHeight: "220px",
                  boxShadow: active
                    ? "0 18px 40px rgba(37,99,235,0.14)"
                    : "0 12px 30px rgba(15,23,42,0.05)",
                  transition: "0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: "58px",
                  }}
                >
                  {item.icon}
                </div>

                <div
                  style={{
                    marginTop: "18px",
                    fontSize: "21px",
                    fontWeight: "900",
                    color: "#111827",
                  }}
                >
                  {item.nameKa}
                </div>

                <div
                  style={{
                    marginTop: "9px",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  QR კოდის მიბმა
                </div>

                {active && (
                  <div
                    style={{
                      marginTop: "16px",
                      color: "#2563eb",
                      fontSize: "14px",
                      fontWeight: "800",
                    }}
                  >
                    ✓ არჩეულია
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "45px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            disabled={!selectedItem}
            style={{
              border: "none",
              background: selectedItem ? "#2563eb" : "#cbd5e1",
              color: "#ffffff",
              padding: "16px 36px",
              borderRadius: "16px",
              fontWeight: "900",
              fontSize: "16px",
              cursor: selectedItem ? "pointer" : "not-allowed",
              minWidth: "220px",
            }}
          >
            გაგრძელება →
          </button>
        </div>
      </div>
    </main>
  );
}
