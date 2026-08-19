"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type OwnerAccount = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  photo: string | null;
};

type QrProfile = {
  id: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  tag_code: string | null;
  active: boolean | null;
};

type AdminRecord = {
  id: number;
  admin_email: string;
  active: boolean;
};

export default function AccountPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [owner, setOwner] = useState<OwnerAccount | null>(null);
  const [profiles, setProfiles] = useState<QrProfile[]>([]);
  const [admin, setAdmin] = useState<AdminRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [missingOwner, setMissingOwner] = useState(false);
  const [error, setError] = useState("");
  const [errorStage, setErrorStage] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    void loadAccount();
  }, []);

  async function loadAccount() {
    setLoading(true);
    setError("");
    setErrorStage("");
    setMissingOwner(false);

    try {
      // AUTH
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        setErrorStage("AUTH");
        throw new Error(userError.message);
      }

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // OWNER
      const { data: ownerData, error: ownerError } = await supabase
        .from("owner_accounts")
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (ownerError) {
        setErrorStage("OWNER");
        throw new Error(ownerError.message);
      }

      if (!ownerData) {
        setMissingOwner(true);
        return;
      }

      setOwner(ownerData as OwnerAccount);

      // ITEMS
      // IMPORTANT: item.photo does NOT exist,
      // so we do not request it.
      const { data: profileData, error: profileError } = await supabase
        .from("item")
        .select(
          "id, item_name, item_type, pet_type, tag_code, active"
        )
        .eq("owner_id", user.id);

      if (profileError) {
        setErrorStage("ITEM");
        throw new Error(profileError.message);
      }

      setProfiles((profileData ?? []) as QrProfile[]);

      // ADMIN
      const { data: adminData, error: adminError } = await supabase
        .from("owner_admins")
        .select("id, admin_email, active")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (adminError) {
        setErrorStage("ADMIN");
        throw new Error(adminError.message);
      }

      setAdmin((adminData ?? null) as AdminRecord | null);
    } catch (err) {
      console.error("ACCOUNT LOAD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unknown account loading error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function getType(profile: QrProfile) {
    if (profile.pet_type === "dog") {
      return {
        icon: "🐶",
        label: ka ? "ძაღლი" : "Dog",
      };
    }

    if (profile.pet_type === "cat") {
      return {
        icon: "🐱",
        label: ka ? "კატა" : "Cat",
      };
    }

    switch (profile.item_type) {
      case "keys":
        return {
          icon: "🔑",
          label: ka ? "გასაღები" : "Keys",
        };

      case "wallet":
        return {
          icon: "👛",
          label: ka ? "საფულე" : "Wallet",
        };

      case "bag":
        return {
          icon: "👜",
          label: ka ? "ჩანთა" : "Bag",
        };

      case "suitcase":
        return {
          icon: "🧳",
          label: ka ? "ჩემოდანი" : "Suitcase",
        };

      default:
        return {
          icon: "🏷️",
          label: ka ? "QR პროფილი" : "QR Profile",
        };
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>
        <strong>QR RETURN</strong>
        <p>{ka ? "ანგარიში იტვირთება..." : "Loading account..."}</p>
        <Styles />
      </main>
    );
  }

  if (error) {
    return (
      <main className="errorPage">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>
            <div>
              <strong>QR RETURN</strong>
              <small>OWNER ACCOUNT</small>
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

        <section className="errorWrap">
          <div className="diagnosticCard">
            <div className="diagnosticIcon">⚠️</div>

            <div className="eyebrow">QR RETURN DIAGNOSTIC</div>

            <h1>
              {ka
                ? "ანგარიშის ჩატვირთვის შეცდომა"
                : "Account loading error"}
            </h1>

            <div className="errorStageBox">
              <span>{ka ? "შეცდომის ეტაპი" : "Error stage"}</span>
              <strong>{errorStage || "UNKNOWN"}</strong>
            </div>

            <div className="realError">
              <span>{ka ? "Supabase პასუხი" : "Supabase response"}</span>
              <code>{error}</code>
            </div>

            <p>
              {ka
                ? "თუ შეცდომა ისევ გამოჩნდა, გამომიგზავნეთ Error stage და Supabase პასუხი."
                : "If an error still appears, send the Error stage and Supabase response."}
            </p>

            <div className="diagnosticActions">
              <button
                type="button"
                className="primaryAction"
                onClick={() => void loadAccount()}
              >
                ↻ {ka ? "თავიდან ცდა" : "Try again"}
              </button>

              <button
                type="button"
                className="secondaryAction"
                onClick={handleLogout}
              >
                {ka ? "გასვლა" : "Sign out"}
              </button>
            </div>
          </div>
        </section>

        <Styles />
      </main>
    );
  }

  if (missingOwner) {
    return (
      <main className="missingPage">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>
            <div>
              <strong>QR RETURN</strong>
              <small>OWNER ACCOUNT</small>
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

        <section className="missingWrap">
          <div className="missingCard">
            <div className="missingIcon">👤</div>

            <div className="eyebrow">OWNER PROFILE</div>

            <h1>
              {ka
                ? "დაასრულეთ მფლობელის პროფილი"
                : "Complete your Owner Profile"}
            </h1>

            <p>
              {ka
                ? "თქვენი Login ანგარიში არსებობს, მაგრამ Owner Profile ჯერ არ არის შენახული."
                : "Your Login account exists, but the Owner Profile has not been saved yet."}
            </p>

            <div className="missingNotice">
              <span>🔒</span>
              <div>
                <strong>
                  {ka
                    ? "Login ანგარიში შენარჩუნებულია"
                    : "Your login account is safe"}
                </strong>

                <p>
                  {ka
                    ? "ახალი Auth მომხმარებელი არ შექმნათ."
                    : "Do not create another Auth user."}
                </p>
              </div>
            </div>

            <div className="missingActions">
              <a href="/account/register" className="primaryButton">
                {ka
                  ? "მფლობელის პროფილის დასრულება"
                  : "Complete Owner Profile"}{" "}
                →
              </a>

              <button
                type="button"
                className="logoutSecondary"
                onClick={handleLogout}
              >
                {ka ? "გასვლა" : "Sign out"}
              </button>
            </div>
          </div>
        </section>

        <Styles />
      </main>
    );
  }

  if (!owner) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>
        <strong>QR RETURN</strong>
        <p>
          {ka
            ? "მფლობელის პროფილი ვერ მოიძებნა."
            : "Owner profile not found."}
        </p>
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
            <small>OWNER DASHBOARD</small>
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

          <button
            type="button"
            className="logoutButton"
            onClick={handleLogout}
          >
            {ka ? "გასვლა" : "Sign out"}
          </button>
        </div>
      </header>

      <section className="container">
        <div className="welcome">
          <div>
            <div className="eyebrow">
              {ka ? "მფლობელის ანგარიში" : "OWNER ACCOUNT"}
            </div>

            <h1>
              {ka
                ? `გამარჯობა, ${owner.first_name}`
                : `Hello, ${owner.first_name}`}
            </h1>

            <p>
              {ka
                ? "აქედან მართავთ თქვენს პროფილს, უსაფრთხოებას, ადმინისტრატორს, Live Chat-ს და ყველა QR პროფილს."
                : "Manage your profile, security, administrator, Live Chat and all QR profiles from here."}
            </p>
          </div>

          <div className="welcomeActions">
            <a href="/account/chat" className="messagesButton">
              <span className="messagesIcon">💬</span>

              <div>
                <small>LIVE CHAT</small>
                <strong>{ka ? "შეტყობინებები" : "Messages"}</strong>
              </div>
            </a>

            <a href="/add-profile" className="primaryButton">
              + {ka ? "QR პროფილის დამატება" : "Add QR profile"}
            </a>
          </div>
        </div>

        <div className="topGrid">
          <section className="panel">
            <div className="panelHeader">
              <div className="panelTitle">
                <div className="panelIcon">👤</div>

                <div>
                  <span>{ka ? "მფლობელი" : "OWNER"}</span>
                  <h2>
                    {owner.first_name} {owner.last_name}
                  </h2>
                </div>
              </div>

              <a href="/account/profile" className="smallButton">
                ✏️ {ka ? "რედაქტირება" : "Edit"}
              </a>
            </div>

            <div className="ownerBody">
              <div className="avatar">
                {owner.photo ? (
                  <img src={owner.photo} alt="" />
                ) : (
                  <div className="avatarPlaceholder">👤</div>
                )}
              </div>

              <div className="ownerData">
                <div>
                  <span>{ka ? "ელფოსტა" : "Email"}</span>
                  <strong>{owner.email}</strong>
                </div>

                <div>
                  <span>{ka ? "ტელეფონი" : "Phone"}</span>
                  <strong>{owner.phone}</strong>
                </div>

                <div>
                  <span>{ka ? "მისამართი" : "Address"}</span>
                  <strong>
                    {owner.address ||
                      (ka ? "არ არის მითითებული" : "Not provided")}
                  </strong>
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panelHeader">
              <div className="panelTitle">
                <div className="panelIcon">🔐</div>

                <div>
                  <span>{ka ? "უსაფრთხოება" : "SECURITY"}</span>

                  <h2>
                    {ka
                      ? "ანგარიშის უსაფრთხოება"
                      : "Account security"}
                  </h2>
                </div>
              </div>

              <a href="/account/security" className="smallButton">
                {ka ? "მართვა" : "Manage"} →
              </a>
            </div>

            <div className="securityText">
              <p>
                {ka
                  ? "კოდური სიტყვა და პირადი ნომერი დაცულია და მპოვნელისთვის არასდროს გამოჩნდება."
                  : "Your code word and personal ID remain private and are never shown to finders."}
              </p>
            </div>
          </section>
        </div>

        <section className="panel">
          <div className="panelHeader">
            <div className="panelTitle">
              <div className="panelIcon">💬</div>

              <div>
                <span>LIVE CHAT</span>
                <h2>
                  {ka
                    ? "მპოვნელების შეტყობინებები"
                    : "Finder messages"}
                </h2>
              </div>
            </div>

            <a href="/account/chat" className="smallButton">
              {ka ? "Inbox-ის გახსნა" : "Open Inbox"} →
            </a>
          </div>

          <div className="chatPanelBody">
            <div>
              <strong>QR RETURN Live Chat</strong>

              <p>
                {ka
                  ? "როდესაც მპოვნელი თქვენი QR კოდიდან Live Chat-ს გამოიყენებს, საუბარი აქ გამოჩნდება."
                  : "When a finder uses Live Chat from your QR code, the conversation will appear here."}
              </p>
            </div>

            <a href="/account/chat" className="openChatButton">
              💬 {ka ? "შეტყობინებები" : "Messages"}
            </a>
          </div>
        </section>

        <section className="panel">
          <div className="panelHeader">
            <div className="panelTitle">
              <div className="panelIcon">👥</div>

              <div>
                <span>
                  {ka ? "ადმინისტრატორი" : "ADMINISTRATOR"}
                </span>

                <h2>
                  {admin
                    ? ka
                      ? "დამატებული Admin"
                      : "Secondary Admin"
                    : ka
                    ? "Admin ჯერ არ არის დამატებული"
                    : "No Admin added yet"}
                </h2>
              </div>
            </div>

            <a href="/account/admin" className="smallButton">
              {ka ? "მართვა" : "Manage"} →
            </a>
          </div>

          {admin ? (
            <div className="adminStatus">
              <div>
                <strong>{admin.admin_email}</strong>

                <p>
                  {ka
                    ? "Owner თავად განსაზღვრავს მის თითოეულ უფლებას."
                    : "The Owner controls each permission separately."}
                </p>
              </div>

              <span
                className={`statusBadge ${
                  admin.active ? "active" : "inactive"
                }`}
              >
                {admin.active
                  ? ka
                    ? "აქტიურია"
                    : "Active"
                  : ka
                    ? "გათიშულია"
                    : "Disabled"}
              </span>
            </div>
          ) : (
            <div className="emptyAdmin">
              <p>
                {ka
                  ? "შეგიძლიათ დაამატოთ მაქსიმუმ ერთი Admin."
                  : "You can add one secondary Admin."}
              </p>

              <a href="/account/admin">
                + {ka ? "Admin-ის დამატება" : "Add Admin"}
              </a>
            </div>
          )}
        </section>

        <section className="profilesSection">
          <div className="profilesHeader">
            <div>
              <div className="eyebrow">
                {ka ? "ჩემი QR პროფილები" : "MY QR PROFILES"}
              </div>

              <h2>
                {ka ? "ცხოველები და ნივთები" : "Pets and items"}
              </h2>

              <p>
                {ka
                  ? "ერთ Owner Account-ზე შეგიძლიათ რამდენიც გსურთ იმდენი QR პროფილი შექმნათ."
                  : "Create as many QR profiles as you need under one Owner Account."}
              </p>
            </div>

            <a href="/add-profile" className="primaryButton">
              + {ka ? "დამატება" : "Add profile"}
            </a>
          </div>

          {profiles.length === 0 ? (
            <div className="emptyProfiles">
              <div className="bigIcon">🏷️</div>

              <h3>
                {ka
                  ? "ჯერ QR პროფილი არ გაქვთ"
                  : "No QR profiles yet"}
              </h3>

              <p>
                {ka
                  ? "აირჩიეთ ძაღლი, კატა, გასაღები, საფულე, ჩანთა ან ჩემოდანი."
                  : "Choose a dog, cat, keys, wallet, bag or suitcase."}
              </p>

              <a href="/add-profile">
                +{" "}
                {ka
                  ? "პირველი პროფილის შექმნა"
                  : "Create first profile"}
              </a>
            </div>
          ) : (
            <div className="profilesGrid">
              {profiles.map((profile) => {
                const type = getType(profile);

                return (
                  <article className="profileCard" key={profile.id}>
                    <div className="visual">
                      <div className="visualPlaceholder">
                        {type.icon}
                      </div>

                      <span
                        className={`lostStatus ${
                          profile.active ? "lost" : "safe"
                        }`}
                      >
                        {profile.active
                          ? ka
                            ? "დაკარგულია"
                            : "Lost"
                          : ka
                            ? "უსაფრთხოდ"
                            : "Safe"}
                      </span>
                    </div>

                    <div className="profileContent">
                      <span className="profileType">{type.label}</span>

                      <h3>
                        {profile.item_name ||
                          (ka
                            ? "უსახელო პროფილი"
                            : "Unnamed profile")}
                      </h3>

                      {profile.tag_code && (
                        <p className="tagCode">
                          QR · {profile.tag_code}
                        </p>
                      )}

                      <div className="profileActions">
                        <a href={`/edit-profile/${profile.id}`}>
                          ✏️ {ka ? "რედაქტირება" : "Edit"}
                        </a>

                        {profile.tag_code && (
                          <a
                            href={`/profile/${profile.tag_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            👁{" "}
                            {ka
                              ? "მპოვნელის ხედვა"
                              : "Finder view"}
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
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
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      button {
        font: inherit;
      }

      .page,
      .missingPage,
      .errorPage {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 8% 10%,
            rgba(20, 101, 232, 0.07),
            transparent 28%
          ),
          radial-gradient(
            circle at 94% 8%,
            rgba(118, 85, 247, 0.07),
            transparent 28%
          ),
          #f7f9fc;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #667085;
        text-align: center;
      }

      .stateLogo,
      .logo {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-weight: 900;
      }

      .stateLogo {
        margin-bottom: 10px;
      }

      .statePage > strong {
        color: #1465e8;
        font-size: 20px;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1120px;
        min-height: 86px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
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
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.6px;
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
        padding: 8px 10px;
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

      .logoutButton,
      .logoutSecondary {
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        background: white;
        color: #475467;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .container {
        width: calc(100% - 36px);
        max-width: 1080px;
        margin: auto;
        padding: 58px 0 90px;
      }

      .welcome {
        margin-bottom: 28px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .welcome h1 {
        margin: 8px 0;
        font-size: clamp(40px, 5vw, 52px);
        letter-spacing: -2px;
      }

      .welcome p,
      .profilesHeader p {
        margin: 0;
        max-width: 650px;
        color: #667085;
        font-size: 13px;
        line-height: 1.6;
      }

      .welcomeActions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .messagesButton {
        min-height: 48px;
        padding: 0 16px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #dbe7ff;
        border-radius: 10px;
        background: white;
        text-decoration: none;
      }

      .messagesIcon {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #eef4ff;
      }

      .messagesButton small,
      .messagesButton strong {
        display: block;
      }

      .messagesButton small {
        color: #7655f7;
        font-size: 7px;
        font-weight: 900;
      }

      .messagesButton strong {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .primaryButton {
        min-height: 48px;
        padding: 0 17px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        border-radius: 10px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 11px;
        font-weight: 900;
        text-decoration: none;
        white-space: nowrap;
      }

      .topGrid {
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        gap: 20px;
      }

      .panel,
      .profilesSection {
        margin-top: 20px;
        padding: 25px;
        border: 1px solid #e4e7ec;
        border-radius: 20px;
        background: white;
        box-shadow: 0 10px 30px rgba(16, 24, 40, 0.04);
      }

      .panelHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
      }

      .panelTitle {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .panelIcon {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
        font-size: 23px;
      }

      .panelTitle span {
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.3px;
      }

      .panelTitle h2 {
        margin: 4px 0 0;
        font-size: 20px;
      }

      .smallButton {
        min-height: 40px;
        padding: 0 13px;
        display: inline-flex;
        align-items: center;
        border: 1px solid #dbe7ff;
        border-radius: 9px;
        background: #f5f9ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .ownerBody {
        margin-top: 22px;
        display: flex;
        gap: 16px;
      }

      .avatar {
        width: 85px;
        height: 85px;
        flex: 0 0 85px;
        overflow: hidden;
        border-radius: 20px;
      }

      .avatar img,
      .avatarPlaceholder {
        width: 100%;
        height: 100%;
      }

      .avatar img {
        object-fit: cover;
      }

      .avatarPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 34px;
      }

      .ownerData {
        flex: 1;
        display: grid;
        gap: 10px;
      }

      .ownerData span {
        display: block;
        margin-bottom: 3px;
        color: #98a2b3;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .ownerData strong {
        color: #344054;
        font-size: 12px;
      }

      .securityText {
        margin-top: 22px;
        padding: 15px;
        border-radius: 12px;
        background: #f7f9fc;
      }

      .securityText p {
        margin: 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.6;
      }

      .chatPanelBody {
        margin-top: 20px;
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 1px solid #dbe7ff;
        border-radius: 14px;
        background: linear-gradient(135deg, #f5f9ff, #faf8ff);
      }

      .chatPanelBody strong {
        font-size: 13px;
      }

      .chatPanelBody p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.6;
      }

      .openChatButton {
        min-height: 42px;
        padding: 0 15px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
        white-space: nowrap;
      }

      .adminStatus {
        margin-top: 20px;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-radius: 13px;
        background: #f7f9fc;
      }

      .adminStatus p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 10px;
      }

      .statusBadge {
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 900;
      }

      .statusBadge.active {
        background: #ecfdf3;
        color: #027a48;
      }

      .statusBadge.inactive {
        background: #f2f4f7;
        color: #667085;
      }

      .emptyAdmin {
        margin-top: 18px;
        padding: 15px;
        border-radius: 12px;
        background: #f7f9fc;
      }

      .emptyAdmin p {
        margin: 0 0 9px;
        color: #667085;
        font-size: 11px;
      }

      .emptyAdmin a {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .profilesHeader {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 25px;
      }

      .profilesHeader h2 {
        margin: 7px 0;
        font-size: 25px;
      }

      .emptyProfiles {
        margin-top: 22px;
        padding: 55px 25px;
        text-align: center;
        border: 1px dashed #cfd8e8;
        border-radius: 17px;
        background: #fafbfc;
      }

      .bigIcon {
        width: 64px;
        height: 64px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: #eef4ff;
        font-size: 30px;
      }

      .emptyProfiles h3 {
        margin: 15px 0 7px;
      }

      .emptyProfiles p {
        margin: 0 auto 16px;
        color: #667085;
        font-size: 11px;
      }

      .emptyProfiles a {
        display: inline-flex;
        padding: 11px 14px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .profilesGrid {
        margin-top: 22px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 17px;
      }

      .profileCard {
        overflow: hidden;
        border: 1px solid #e4e7ec;
        border-radius: 17px;
        background: white;
      }

      .visual {
        height: 165px;
        position: relative;
        background: #eef4ff;
      }

      .visualPlaceholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
        font-size: 50px;
      }

      .lostStatus {
        position: absolute;
        top: 11px;
        right: 11px;
        padding: 6px 8px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 900;
      }

      .lostStatus.safe {
        background: #ecfdf3;
        color: #027a48;
      }

      .lostStatus.lost {
        background: #fff1f0;
        color: #b42318;
      }

      .profileContent {
        padding: 16px;
      }

      .profileType {
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .profileContent h3 {
        margin: 5px 0 7px;
        font-size: 19px;
      }

      .tagCode {
        margin: 0;
        color: #98a2b3;
        font-size: 9px;
      }

      .profileActions {
        margin-top: 14px;
        padding-top: 12px;
        display: flex;
        justify-content: space-between;
        gap: 8px;
        border-top: 1px solid #eaecf0;
      }

      .profileActions a {
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
        text-decoration: none;
      }

      .missingWrap,
      .errorWrap {
        width: calc(100% - 30px);
        max-width: 620px;
        min-height: calc(100vh - 86px);
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 50px 0;
      }

      .missingCard,
      .diagnosticCard {
        width: 100%;
        padding: 38px;
        text-align: center;
        border: 1px solid #e4e7ec;
        border-radius: 24px;
        background: white;
        box-shadow: 0 25px 65px rgba(16, 24, 40, 0.09);
      }

      .missingIcon,
      .diagnosticIcon {
        width: 70px;
        height: 70px;
        margin: 0 auto 18px;
        display: grid;
        place-items: center;
        border-radius: 19px;
        background: linear-gradient(135deg, #eef4ff, #f0edff);
        font-size: 32px;
      }

      .diagnosticIcon {
        background: #fff1f0;
      }

      .missingCard h1,
      .diagnosticCard h1 {
        margin: 8px 0 12px;
        font-size: 32px;
      }

      .missingCard > p,
      .diagnosticCard > p {
        margin: 16px auto 0;
        max-width: 500px;
        color: #667085;
        font-size: 12px;
        line-height: 1.7;
      }

      .missingNotice {
        margin-top: 22px;
        padding: 14px;
        display: flex;
        gap: 11px;
        text-align: left;
        border: 1px solid #dbe7ff;
        border-radius: 13px;
        background: #f5f9ff;
      }

      .missingNotice strong {
        font-size: 11px;
      }

      .missingNotice p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 9px;
      }

      .missingActions,
      .diagnosticActions {
        margin-top: 22px;
        display: flex;
        justify-content: center;
        gap: 10px;
      }

      .errorStageBox {
        margin-top: 20px;
        padding: 14px;
        border-radius: 12px;
        background: #fff7ed;
        text-align: left;
      }

      .errorStageBox span,
      .realError span {
        display: block;
        margin-bottom: 5px;
        color: #98a2b3;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .errorStageBox strong {
        color: #b54708;
        font-size: 15px;
      }

      .realError {
        margin-top: 10px;
        padding: 14px;
        border: 1px solid #fecdca;
        border-radius: 12px;
        background: #fff1f0;
        text-align: left;
      }

      .realError code {
        display: block;
        overflow-wrap: anywhere;
        color: #b42318;
        font-family: monospace;
        font-size: 11px;
        line-height: 1.6;
      }

      .primaryAction,
      .secondaryAction {
        min-height: 43px;
        padding: 0 15px;
        border-radius: 9px;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .primaryAction {
        border: 0;
        background: #1465e8;
        color: white;
      }

      .secondaryAction {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      @media (max-width: 850px) {
        .topGrid {
          grid-template-columns: 1fr;
        }

        .profilesGrid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 650px) {
        .welcome,
        .profilesHeader {
          align-items: stretch;
          flex-direction: column;
        }

        .welcomeActions,
        .missingActions,
        .diagnosticActions {
          width: 100%;
          flex-direction: column;
          align-items: stretch;
        }

        .messagesButton,
        .primaryButton,
        .logoutSecondary,
        .primaryAction,
        .secondaryAction {
          width: 100%;
          justify-content: center;
        }

        .ownerBody {
          flex-direction: column;
        }

        .profilesGrid {
          grid-template-columns: 1fr;
        }

        .panelHeader {
          align-items: flex-start;
          flex-direction: column;
        }

        .smallButton {
          width: 100%;
          justify-content: center;
        }

        .chatPanelBody {
          align-items: stretch;
          flex-direction: column;
        }

        .openChatButton {
          width: 100%;
        }
      }
    `}</style>
  );
}
