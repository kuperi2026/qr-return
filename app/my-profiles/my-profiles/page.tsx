"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Item = {
  id: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  photo: string | null;
  active: boolean | null;
  tag_code: string | null;
};

export default function MyProfilesPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      setUserEmail(user.email ?? "");

      const firstName = user.user_metadata?.first_name ?? "";
      const lastName = user.user_metadata?.last_name ?? "";

      setUserName(`${firstName} ${lastName}`.trim());

      const { data, error: itemsError } = await supabase
        .from("item")
        .select(
          "id, item_name, item_type, pet_type, photo, active, tag_code"
        )
        .eq("owner_id", user.id)
        .order("id", { ascending: false });

      if (itemsError) {
        throw itemsError;
      }

      setItems(data ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load profiles."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function getIcon(item: Item) {
    const value = `${item.item_type ?? ""} ${item.pet_type ?? ""}`.toLowerCase();

    if (value.includes("dog")) return "🐶";
    if (value.includes("cat")) return "🐱";
    if (value.includes("key")) return "🔑";
    if (value.includes("wallet")) return "👛";
    if (value.includes("suitcase") || value.includes("luggage")) return "🧳";
    if (value.includes("bag")) return "👜";
    if (value.includes("phone")) return "📱";
    if (value.includes("computer") || value.includes("laptop")) return "💻";

    return "🏷️";
  }

  function getTypeLabel(item: Item) {
    const type = item.item_type?.toLowerCase();

    if (type === "pet") {
      if (item.pet_type?.toLowerCase() === "dog") {
        return ka ? "ძაღლი" : "Dog";
      }

      if (item.pet_type?.toLowerCase() === "cat") {
        return ka ? "კატა" : "Cat";
      }

      return ka ? "ცხოველი" : "Pet";
    }

    if (type === "keys" || type === "key") {
      return ka ? "გასაღები" : "Keys";
    }

    if (type === "wallet") {
      return ka ? "საფულე" : "Wallet";
    }

    if (type === "suitcase" || type === "luggage") {
      return ka ? "ჩემოდანი" : "Suitcase";
    }

    if (type === "bag") {
      return ka ? "ჩანთა" : "Bag";
    }

    if (type === "phone") {
      return ka ? "ტელეფონი" : "Phone";
    }

    if (type === "computer" || type === "laptop") {
      return ka ? "კომპიუტერი" : "Computer";
    }

    return item.item_type || (ka ? "პროფილი" : "Profile");
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>MY PROFILES</small>
          </div>
        </a>

        <div className="headerRight">
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

          <button className="logout" onClick={handleLogout}>
            {ka ? "გასვლა" : "Sign out"}
          </button>
        </div>
      </header>

      <section className="container">
        <div className="welcome">
          <div>
            <span className="eyebrow">
              {ka ? "თქვენი ანგარიში" : "YOUR ACCOUNT"}
            </span>

            <h1>
              {userName
                ? ka
                  ? `გამარჯობა, ${userName}`
                  : `Hello, ${userName}`
                : ka
                ? "ჩემი პროფილები"
                : "My Profiles"}
            </h1>

            <p>
              {ka
                ? "აქ შეგიძლიათ მართოთ თქვენი ნივთებისა და ცხოველების QR პროფილები."
                : "Manage your item and pet QR profiles here."}
            </p>

            {userEmail && <small>{userEmail}</small>}
          </div>

          <a href="/register-item" className="addButton">
            <span>+</span>
            {ka ? "ახალი პროფილის დამატება" : "Add new profile"}
          </a>
        </div>

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            {ka ? "იტვირთება..." : "Loading..."}
          </div>
        ) : items.length === 0 ? (
          <div className="empty">
            <div className="emptyIcon">🏷️</div>

            <h2>
              {ka ? "ჯერ არცერთი პროფილი არ გაქვთ" : "No profiles yet"}
            </h2>

            <p>
              {ka
                ? "დაამატეთ თქვენი პირველი ნივთი ან ცხოველი და შემდეგ დაუკავშირეთ მას QR კოდი."
                : "Add your first item or pet and connect a QR code to it."}
            </p>

            <a href="/register-item" className="emptyButton">
              <span>+</span>
              {ka ? "პირველი პროფილის შექმნა" : "Create first profile"}
            </a>
          </div>
        ) : (
          <>
            <div className="sectionTitle">
              <div>
                <h2>{ka ? "ჩემი პროფილები" : "My profiles"}</h2>

                <p>
                  {ka
                    ? `${items.length} პროფილი`
                    : `${items.length} profile${items.length === 1 ? "" : "s"}`}
                </p>
              </div>

              <a href="/register-item" className="smallAdd">
                + {ka ? "დამატება" : "Add"}
              </a>
            </div>

            <div className="grid">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={`/profile/${item.id}`}
                  className="profileCard"
                >
                  <div className="photoArea">
                    {item.photo ? (
                      <img src={item.photo} alt={item.item_name ?? "Profile"} />
                    ) : (
                      <div className="placeholder">{getIcon(item)}</div>
                    )}

                    <span
                      className={`status ${item.active ? "active" : "inactive"}`}
                    >
                      {item.active
                        ? ka
                          ? "აქტიური"
                          : "Active"
                        : ka
                        ? "არააქტიური"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="content">
                    <div className="type">{getTypeLabel(item)}</div>

                    <h3>
                      {item.item_name ||
                        (ka ? "უსახელო პროფილი" : "Unnamed profile")}
                    </h3>

                    {item.tag_code && (
                      <div className="tagCode">
                        <span>QR</span>
                        {item.tag_code}
                      </div>
                    )}

                    <div className="manage">
                      {ka ? "პროფილის მართვა" : "Manage profile"}
                      <span>→</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
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
        background: #f7f9fc;
      }

      button,
      input {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        font-family: Inter, Arial, sans-serif;
        color: #101828;
        background:
          radial-gradient(
            circle at 8% 15%,
            rgba(20, 101, 232, 0.1),
            transparent 27%
          ),
          radial-gradient(
            circle at 93% 10%,
            rgba(118, 85, 247, 0.11),
            transparent 28%
          ),
          #f7f9fc;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1180px;
        min-height: 86px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .logo {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 14px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 21px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 10px;
        background: #eaecf0;
      }

      .languages button {
        padding: 8px 11px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #667085;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .logout {
        min-height: 38px;
        padding: 0 14px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        background: white;
        color: #475467;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .container {
        width: calc(100% - 36px);
        max-width: 1100px;
        margin: auto;
        padding: 65px 0 90px;
      }

      .welcome {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 30px;
        margin-bottom: 50px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .welcome h1 {
        margin: 10px 0 10px;
        font-size: clamp(34px, 5vw, 52px);
        line-height: 1.1;
        letter-spacing: -2px;
      }

      .welcome p {
        margin: 0;
        color: #667085;
        font-size: 16px;
        line-height: 1.6;
      }

      .welcome small {
        display: block;
        margin-top: 8px;
        color: #98a2b3;
      }

      .addButton,
      .emptyButton {
        min-height: 52px;
        padding: 0 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        border-radius: 11px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 14px;
        font-weight: 900;
        text-decoration: none;
        white-space: nowrap;
        box-shadow: 0 12px 26px rgba(20, 101, 232, 0.18);
      }

      .addButton span,
      .emptyButton span {
        font-size: 22px;
      }

      .loading {
        padding: 80px 20px;
        text-align: center;
        color: #667085;
        font-weight: 700;
      }

      .error {
        margin-bottom: 25px;
        padding: 14px 16px;
        border: 1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 13px;
        font-weight: 700;
      }

      .empty {
        max-width: 650px;
        margin: 30px auto 0;
        padding: 65px 30px;
        text-align: center;
        border: 1px dashed #cfd8e8;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.82);
      }

      .emptyIcon {
        width: 72px;
        height: 72px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
        font-size: 34px;
      }

      .empty h2 {
        margin: 20px 0 10px;
        font-size: 26px;
      }

      .empty p {
        max-width: 480px;
        margin: 0 auto 25px;
        color: #667085;
        font-size: 14px;
        line-height: 1.7;
      }

      .sectionTitle {
        margin-bottom: 20px;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 20px;
      }

      .sectionTitle h2 {
        margin: 0;
        font-size: 27px;
      }

      .sectionTitle p {
        margin: 5px 0 0;
        color: #98a2b3;
        font-size: 13px;
      }

      .smallAdd {
        padding: 9px 14px;
        border: 1px solid #dbe7ff;
        border-radius: 9px;
        background: white;
        color: #1465e8;
        font-size: 13px;
        font-weight: 900;
        text-decoration: none;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 22px;
      }

      .profileCard {
        overflow: hidden;
        border: 1px solid #e4e7ec;
        border-radius: 20px;
        background: white;
        text-decoration: none;
        box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease;
      }

      .profileCard:hover {
        transform: translateY(-3px);
        box-shadow: 0 18px 38px rgba(16, 24, 40, 0.1);
      }

      .photoArea {
        height: 190px;
        position: relative;
        background: #eef3f8;
      }

      .photoArea img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        font-size: 62px;
        background: linear-gradient(135deg, #eef4ff, #f3efff);
      }

      .status {
        position: absolute;
        top: 13px;
        right: 13px;
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 900;
      }

      .status.active {
        background: #ecfdf3;
        color: #027a48;
      }

      .status.inactive {
        background: #f2f4f7;
        color: #667085;
      }

      .content {
        padding: 20px;
      }

      .type {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.2px;
        text-transform: uppercase;
      }

      .content h3 {
        margin: 7px 0 15px;
        color: #101828;
        font-size: 22px;
      }

      .tagCode {
        margin-bottom: 17px;
        display: flex;
        align-items: center;
        gap: 7px;
        color: #667085;
        font-size: 12px;
        font-weight: 700;
      }

      .tagCode span {
        padding: 4px 6px;
        border-radius: 6px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
      }

      .manage {
        padding-top: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eaecf0;
        color: #1465e8;
        font-size: 13px;
        font-weight: 900;
      }

      .manage span {
        font-size: 18px;
      }

      @media (max-width: 900px) {
        .grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 700px) {
        .welcome {
          align-items: stretch;
          flex-direction: column;
        }

        .addButton {
          width: 100%;
        }
      }

      @media (max-width: 600px) {
        .header {
          min-height: 76px;
        }

        .brand small {
          display: none;
        }

        .logout {
          padding: 0 10px;
        }

        .container {
          padding-top: 40px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .photoArea {
          height: 220px;
        }

        .welcome h1 {
          font-size: 36px;
        }
      }
    `}</style>
  );
}
