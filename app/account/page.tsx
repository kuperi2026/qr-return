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
  photo: string | null;
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
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
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

      const { data: ownerData, error: ownerError } = await supabase
        .from("owner_accounts")
        .select(
          "user_id, first_name, last_name, email, phone, address, photo"
        )
        .eq("user_id", user.id)
        .maybeSingle();

      if (ownerError) {
        throw ownerError;
      }

      if (!ownerData) {
        const newOwner = {
          user_id: user.id,
          first_name: user.user_metadata?.first_name ?? "",
          last_name: user.user_metadata?.last_name ?? "",
          email: user.email ?? "",
          phone: user.user_metadata?.phone ?? "",
          address: null,
          photo: null,
        };

        const { data: createdOwner, error: createError } = await supabase
          .from("owner_accounts")
          .insert(newOwner)
          .select(
            "user_id, first_name, last_name, email, phone, address, photo"
          )
          .single();

        if (createError) {
          throw createError;
        }

        setOwner(createdOwner as OwnerAccount);
      } else {
        setOwner(ownerData as OwnerAccount);
      }

      const { data: profileData, error: profileError } = await supabase
        .from("item")
        .select(
          "id, item_name, item_type, pet_type, photo, tag_code, active"
        )
        .eq("owner_id", user.id);

      if (profileError) {
        throw profileError;
      }

      setProfiles((profileData ?? []) as QrProfile[]);

      const { data: adminData, error: adminError } = await supabase
        .from("owner_admins")
        .select("id, admin_email, active")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      setAdmin((adminData ?? null) as AdminRecord | null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ანგარიშის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load account."
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
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!owner) {
    return (
      <main className="statePage">
        {error ||
          (ka
            ? "მფლობელის პროფილი ვერ მოიძებნა."
            : "Owner profile not found.")}
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
                ? "აქედან მართავთ თქვენს პროფილს, უსაფრთხოებას, ადმინისტრატორს და ყველა QR პროფილს."
                : "Manage your profile, security, administrator and all QR profiles from here."}
            </p>
          </div>

          <a href="/add-profile" className="primaryButton">
            + {ka ? "QR პროფილის დამატება" : "Add QR profile"}
          </a>
        </div>

        {error && <div className="errorBox">{error}</div>}

        <div className="topGrid">
          <section className="panel ownerPanel">
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

        <section className="panel adminPanel">
          <div className="panelHeader">
            <div className="panelTitle">
              <div className="panelIcon">👥</div>

              <div>
                <span>{ka ? "ადმინისტრატორი" : "ADMINISTRATOR"}</span>

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
                + {ka ? "პირველი პროფილის შექმნა" : "Create first profile"}
              </a>
            </div>
          ) : (
            <div className="profilesGrid">
              {profiles.map((profile) => {
                const type = getType(profile);

                return (
                  <article className="profileCard" key={profile.id}>
                    <div className="visual">
                      {profile.photo ? (
                        <img src={profile.photo} alt="" />
                      ) : (
                        <div className="visualPlaceholder">
                          {type.icon}
                        </div>
                      )}

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
                      <span className="profileType">
                        {type.label}
                      </span>

                      <h3>
                        {profile.item_name ||
                          (ka ? "უსახელო პროფილი" : "Unnamed profile")}
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
                            👁 {ka ? "მპოვნელის ხედვა" : "Finder view"}
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

        .page {
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
          display: grid;
          place-items: center;
          padding: 30px;
          color: #667085;
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

        .languages .active {
          background: white;
          color: #1465e8;
        }

        .logoutButton {
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
          margin: 8px 0 8px;
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

        .primaryButton {
          min-height: 48px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
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

        .adminStatus strong {
          font-size: 12px;
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

        .visual img,
        .visualPlaceholder {
          width: 100%;
          height: 100%;
        }

        .visual img {
          object-fit: cover;
        }

        .visualPlaceholder {
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

        .errorBox {
          margin-bottom: 15px;
          padding: 13px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 11px;
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

          .primaryButton {
            width: 100%;
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
        }
      `}</style>
    </main>
  );
}
