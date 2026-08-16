"use client";

import { useState } from "react";

export default function ItemRegistrationPage() {
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [qrId, setQrId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "15px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "14px",
    fontSize: "16px",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "800",
    color: "#111827",
  };

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
          width: "100%",
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
            marginTop: "28px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "30px",
            padding: "36px",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.07)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto",
                borderRadius: "20px",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              🏷️
            </div>

            <h1
              style={{
                margin: "20px 0 0",
                fontSize: "36px",
                fontWeight: "900",
                color: "#111827",
              }}
            >
              ნივთის რეგისტრაცია
            </h1>

            <p
              style={{
                margin: "12px auto 0",
                maxWidth: "520px",
                color: "#6b7280",
                lineHeight: "1.7",
              }}
            >
              შეავსე ნივთის ინფორმაცია და დაუკავშირე მას შენი QR კოდი.
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
              <label style={labelStyle}>ნივთის ტიპი</label>

              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                style={fieldStyle}
              >
                <option value="">აირჩიე ნივთი</option>
                <option value="keys">🔑 გასაღები</option>
                <option value="wallet">👛 საფულე</option>
                <option value="suitcase">🧳 ჩემოდანი</option>
                <option value="bag">🎒 ჩანთა</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>ნივთის სახელი</label>

              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="მაგ: ჩემი სამუშაო ჩანთა"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>ფერი</label>

              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="მაგ: შავი"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>აღწერა</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="მაგ: შავი ტყავის საფულე, შიგნით რამდენიმე ბარათით"
                rows={4}
                style={{
                  ...fieldStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>QR ID</label>

              <input
                type="text"
                value={qrId}
                onChange={(e) => setQrId(e.target.value)}
                placeholder="მაგ: QR-00128"
                style={fieldStyle}
              />
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                marginTop: "6px",
                paddingTop: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "20px",
                  color: "#111827",
                }}
              >
                საკონტაქტო ინფორმაცია
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                ეს ინფორმაცია გამოყენებული იქნება მპოვნელთან დასაკავშირებლად.
              </p>
            </div>

            <div>
              <label style={labelStyle}>ტელეფონის ნომერი</label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 000 000 0000"
                style={fieldStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>ელფოსტა</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={fieldStyle}
              />
            </div>

            <button
              type="button"
              style={{
                marginTop: "8px",
                width: "100%",
                border: "none",
                borderRadius: "15px",
                padding: "17px 20px",
                background: "#2563eb",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              ნივთის რეგისტრაცია →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
