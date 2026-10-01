"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { items } from "@/data/items";

function DetailsContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const selectedItem = items.find((item) => item.id === type);

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
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <a
          href="/register"
          style={{
            textDecoration: "none",
            color: "#2563eb",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          ← უკან დაბრუნება
        </a>

        <div
          style={{
            background: "#ffffff",
            marginTop: "30px",
            borderRadius: "32px",
            padding: "36px",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "64px" }}>
              {selectedItem?.icon || "🏷️"}
            </div>

            <h1
              style={{
                marginTop: "18px",
                marginBottom: 0,
                fontSize: "36px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              {selectedItem
                ? `${selectedItem.nameKa} — რეგისტრაცია`
                : "QR რეგისტრაცია"}
            </h1>

            <p
              style={{
                marginTop: "12px",
                color: "#6b7280",
                lineHeight: "1.7",
              }}
            >
              შეავსე ძირითადი ინფორმაცია. მოგვიანებით დამატებითი ინფორმაციის
              შეცვლაც შეგეძლება.
            </p>
          </div>

          <div
            style={{
              marginTop: "36px",
              display: "grid",
              gap: "22px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                სახელი
              </label>

              <input
                type="text"
                placeholder={
                  selectedItem?.id === "dog" || selectedItem?.id === "cat"
                    ? "მაგ: ბობი"
                    : "მაგ: ჩემი სამუშაო ჩანთა"
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "14px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                QR ID
              </label>

              <input
                type="text"
                placeholder="მაგ: QR-00128"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "14px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                ტელეფონის ნომერი
              </label>

              <input
                type="tel"
                placeholder="+1 000 000 0000"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "14px",
                  fontSize: "16px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "800",
                  color: "#111827",
                }}
              >
                ელფოსტა
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "14px",
                  fontSize: "16px",
                }}
              />
            </div>

            <button
              type="button"
              style={{
                marginTop: "10px",
                border: "none",
                background: "#2563eb",
                color: "#ffffff",
                padding: "16px",
                borderRadius: "15px",
                fontSize: "16px",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              ინფორმაციის შენახვა →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DetailsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "40px" }}>იტვირთება...</div>}>
      <DetailsContent />
    </Suspense>
  );
}
