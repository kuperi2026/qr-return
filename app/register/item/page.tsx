"use client";

import { useState } from "react";

export default function ItemRegistrationPage() {
  const [itemType, setItemType] = useState("");
  const [itemName, setItemName] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");
  const [qrId, setQrId] = useState("");

  const [contactMethod, setContactMethod] = useState<
    "phone" | "chat" | "both"
  >("both");

  const [phone, setPhone] = useState("");
  const [allowLocation, setAllowLocation] = useState(true);
  const [finderReward, setFinderReward] = useState(false);

  const inputStyle = {
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
    fontWeight: "800",
    color: "#111827",
    fontSize: "14px",
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
            boxShadow: "0 18px 45px rgba(15,23,42,0.07)",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "68px",
                height: "68px",
                margin: "0 auto",
                borderRadius: "20px",
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
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
                maxWidth: "560px",
                color: "#6b7280",
                lineHeight: "1.7",
              }}
            >
              შეავსე ნივთის ინფორმაცია და აირჩიე, როგორ შეძლებს მპოვნელი
              შენთან დაკავშირებას.
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
                style={inputStyle}
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
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>ფერი</label>

              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="მაგ: შავი"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>აღწერა</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="მოკლედ აღწერე ნივთი..."
                rows={4}
                style={{
                  ...inputStyle,
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
                style={inputStyle}
              />
            </div>

            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                paddingTop: "26px",
                marginTop: "4px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "22px",
                  color: "#111827",
                }}
              >
                როგორ დაგიკავშირდეს მპოვნელი?
              </h2>

              <p
                style={{
                  margin: "8px 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                შეგიძლია აირჩიო მობილური, Live Chat ან ორივე.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
              }}
            >
              {[
                {
                  id: "phone",
                  icon: "📞",
                  title: "მობილური",
                },
                {
                  id: "chat",
                  icon: "💬",
                  title: "Live Chat",
                },
                {
                  id: "both",
                  icon: "📱",
                  title: "ორივე",
                },
              ].map((option) => {
                const active = contactMethod === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setContactMethod(
                        option.id as "phone" | "chat" | "both"
                      )
                    }
                    style={{
                      border: active
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                      background: active ? "#eff6ff" : "#ffffff",
                      borderRadius: "18px",
                      padding: "20px 14px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "28px",
                      }}
                    >
                      {option.icon}
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontWeight: "800",
                        color: "#111827",
                      }}
                    >
                      {option.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {(contactMethod === "phone" || contactMethod === "both") && (
              <div>
                <label style={labelStyle}>ტელეფონის ნომერი</label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 000 000 0000"
                  style={inputStyle}
                />
              </div>
            )}

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => setAllowLocation(!allowLocation)}
                style={{
                  border: allowLocation
                    ? "2px solid #2563eb"
                    : "1px solid #e5e7eb",
                  background: allowLocation ? "#eff6ff" : "#ffffff",
                  borderRadius: "18px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    📍 ლოკაციის გაზიარება
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    მპოვნელს შეეძლება ერთი ღილაკით გამოგიგზავნოს მდებარეობა.
                  </div>
                </div>

                <div
                  style={{
                    color: allowLocation ? "#2563eb" : "#94a3b8",
                    fontWeight: "900",
                  }}
                >
                  {allowLocation ? "ON" : "OFF"}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFinderReward(!finderReward)}
                style={{
                  border: finderReward
                    ? "2px solid #16a34a"
                    : "1px solid #e5e7eb",
                  background: finderReward ? "#f0fdf4" : "#ffffff",
                  borderRadius: "18px",
                  padding: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: "800",
                      color: "#111827",
                    }}
                  >
                    🎁 მპოვნელის დაჯილდოება
                  </div>

                  <div
                    style={{
                      marginTop: "5px",
                      color: "#6b7280",
                      fontSize: "13px",
                    }}
                  >
                    სურვილის შემთხვევაში შეგიძლია მიუთითო, რომ ჯილდოს სთავაზობ.
                  </div>
                </div>

                <div
                  style={{
                    color: finderReward ? "#16a34a" : "#94a3b8",
                    fontWeight: "900",
                  }}
                >
                  {finderReward ? "ON" : "OFF"}
                </div>
              </button>
            </div>

            <button
              type="button"
              style={{
                marginTop: "10px",
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
