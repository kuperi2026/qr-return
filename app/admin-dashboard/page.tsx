"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type AdminAccess = {
  admin_record_id: number;
  owner_id: string;
  admin_email: string;

  can_view_profiles: boolean;
  can_edit_profiles: boolean;
  can_manage_lost_mode: boolean;
  can_manage_visibility: boolean;
  can_manage_contacts: boolean;
  can_manage_location: boolean;
  can_manage_additional_contact: boolean;
  can_use_live_chat: boolean;

  active: boolean;
};

type OwnerAccount = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo: string | null;
};

type QrProfile = {
  id: string;
  owner_id: string;

  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;

  photo: string | null;
  tag_code: string | null;

  active: boolean | null;

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;
  location_sharing_enabled: boolean | null;
};

export default function AdminDashboardPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [access, setAccess] = useState<AdminAccess | null>(null);
  const [owner, setOwner] = useState<OwnerAccount | null>(null);
  const [profiles, setProfiles] = useState<QrProfile[]>([]);

  const [loading, setLoading] = useState(true);
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

      // 1. Admin access claim / load
      const {
        data: accessData,
        error: accessError,
      } = await supabase.rpc("claim_admin_access");

      if (accessError) {
        throw accessError;
      }

      if (!accessData || accessData.length === 0) {
        setError(
          ka
            ? "ამ ანგარიშზე აქტიური Admin წვდომა ვერ მოიძებნა."
            : "No active Admin access was found for this account."
        );

        setLoading(false);
        return;
      }

      const adminAccess = accessData[0] as AdminAccess;

      if (!adminAccess.active) {
        setError(
          ka
            ? "Owner-მა Admin წვდომა დროებით გათიშა."
            : "The Owner has disabled Admin access."
        );

        setLoading(false);
        return;
      }

      setAccess(adminAccess);

      // 2. Owner-ის ძირითადი ინფორმაცია
      const {
        data: ownerData,
        error: ownerError,
      } = await supabase
        .from("owner_accounts")
        .select(
          "user_id, first_name, last_name, email, phone, photo"
        )
        .eq("user_id", adminAccess.owner_id)
        .maybeSingle();

      if (ownerError) {
        throw ownerError;
      }

      setOwner((ownerData ?? null) as OwnerAccount | null);

      // 3. QR პროფილები მხოლოდ მაშინ,
      // თუ Owner-მა view permission მისცა
      if (adminAccess.can_view_profiles) {
        const {
          data: profileData,
          error: profileError,
        } = await supabase
          .from("item")
          .select(
            `
            id,
            owner_id,
            item_name,
            item_type,
            pet_type,
            photo,
            tag_code,
            active,
            phone_enabled,
            whatsapp_enabled,
            live_chat_enabled,
            location_sharing_enabled
            `
          )
          .eq("owner_id", adminAccess.owner_id);

        if (profileError) {
          throw profileError;
        }

        setProfiles((profileData ?? []) as QrProfile[]);
      } else {
        setProfiles([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Admin Dashboard-ის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load Admin Dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  async function toggleLostMode(profile: QrProfile) {
    if (!access?.can_manage_lost_mode) return;

    try {
      const newValue = !Boolean(profile.active);

      const { error } = await supabase
        .from("item")
        .update({
          active: newValue,
        })
        .eq("id", profile.id)
        .eq("owner_id", access.owner_id);

      if (error) {
        throw error;
      }

      setProfiles((current) =>
        current.map((item) =>
          item.id === profile.id
            ? {
                ...item,
                active: newValue,
              }
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Lost Mode-ის შეცვლა ვერ მოხერხდა."
          : "Could not change Lost Mode."
      );
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

  if (!access) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>

        <h1>QR RETURN</h1>

        <div className="errorBox">
          {error ||
            (ka
              ? "Admin წვდომა ვერ მოიძებნა."
              : "Admin access not found.")}
        </div>

        <button
          type="button"
          className="logoutState"
          onClick={handleLogout}
        >
          {ka ? "გასვლა" : "Sign out"}
        </button>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/admin-dashboard" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>ADMIN DASHBOARD</small>
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
              {ka ? "ADMIN წვდომა" : "ADMIN ACCESS"}
            </div>

            <h1>
              {ka
                ? "Admin Dashboard"
                : "Admin Dashboard"}
            </h1>

            <p>
              {ka
                ? "აქ შეგიძლიათ მართოთ მხოლოდ ის ფუნქციები, რომლებზეც Owner-მა მოგცათ უფლება."
                : "You can only manage the features specifically authorized by the Owner."}
            </p>
          </div>

          <div className="adminBadge">
            <span>👥</span>

            <div>
              <small>ADMIN</small>
              <strong>{access.admin_email}</strong>
            </div>
          </div>
        </div>

        {error && (
          <div className="errorBox">
            {error}
          </div>
        )}

        {owner && (
          <section className="ownerCard">
            <div className="ownerAvatar">
              {owner.photo ? (
                <img
                  src={owner.photo}
                  alt={`${owner.first_name} ${owner.last_name}`}
                />
              ) : (
                "👤"
              )}
            </div>

            <div className="ownerDetails">
              <span>
                {ka ? "ანგარიშის Owner" : "ACCOUNT OWNER"}
              </span>

              <h2>
                {owner.first_name} {owner.last_name}
              </h2>

              <p>{owner.email}</p>
            </div>

            <div className="ownerLock">
              🔒{" "}
              {ka
                ? "Owner-ის პროფილს Admin ვერ ცვლის"
                : "Owner profile is locked for Admin"}
            </div>
          </section>
        )}

        <section className="permissionsCard">
          <div className="sectionHeader">
            <div>
              <div className="eyebrow">
                {ka ? "თქვენი უფლებები" : "YOUR PERMISSIONS"}
              </div>

              <h2>
                {ka
                  ? "Owner-ის მიერ მინიჭებული წვდომა"
                  : "Access granted by the Owner"}
              </h2>
            </div>
          </div>

          <div className="permissionGrid">
            <Permission
              icon="👁️"
              label={ka ? "პროფილების ნახვა" : "View profiles"}
              enabled={access.can_view_profiles}
            />

            <Permission
              icon="✏️"
              label={ka ? "პროფილების რედაქტირება" : "Edit profiles"}
              enabled={access.can_edit_profiles}
            />

            <Permission
              icon="🚨"
              label={ka ? "Lost Mode" : "Lost Mode"}
              enabled={access.can_manage_lost_mode}
            />

            <Permission
              icon="👁"
              label={ka ? "ხილვადობის მართვა" : "Finder visibility"}
              enabled={access.can_manage_visibility}
            />

            <Permission
              icon="📞"
              label={ka ? "კონტაქტების მართვა" : "Contact methods"}
              enabled={access.can_manage_contacts}
            />

            <Permission
              icon="📍"
              label={ka ? "ლოკაციის მართვა" : "Location sharing"}
              enabled={access.can_manage_location}
            />

            <Permission
              icon="👥"
              label={
                ka
                  ? "დამატებითი კონტაქტი"
                  : "Additional contact"
              }
              enabled={access.can_manage_additional_contact}
            />

            <Permission
              icon="💬"
              label="Live Chat"
              enabled={access.can_use_live_chat}
            />
          </div>

          <div className="lockedNotice">
            🔒{" "}
            {ka
              ? "თქვენ ვერ შეცვლით საკუთარ უფლებებს და ვერ დაამატებთ სხვა Admin-ს."
              : "You cannot change your own permissions or add another Admin."}
          </div>
        </section>

        {!access.can_view_profiles ? (
          <section className="noAccessCard">
            <div className="bigLock">🔒</div>

            <h2>
              {ka
                ? "QR პროფილების ნახვის უფლება გამორთულია"
                : "QR profile access is disabled"}
            </h2>

            <p>
              {ka
                ? "Owner-ს თქვენთვის QR პროფილების ნახვის უფლება არ აქვს ჩართული."
                : "The Owner has not enabled QR profile access for this Admin."}
            </p>
          </section>
        ) : (
          <section className="profilesSection">
            <div className="sectionHeader">
              <div>
                <div className="eyebrow">
                  {ka ? "QR პროფილები" : "QR PROFILES"}
                </div>

                <h2>
                  {ka
                    ? "Owner-ის ცხოველები და ნივთები"
                    : "Owner's pets and items"}
                </h2>

                <p>
                  {ka
                    ? `${profiles.length} პროფილი`
                    : `${profiles.length} profile${
                        profiles.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>
            </div>

            {profiles.length === 0 ? (
              <div className="emptyProfiles">
                {ka
                  ? "Owner-ს ჯერ QR პროფილი არ აქვს."
                  : "The Owner has no QR profiles yet."}
              </div>
            ) : (
              <div className="profilesGrid">
                {profiles.map((profile) => {
                  const type = getType(profile);

                  return (
                    <article
                      className="profileCard"
                      key={profile.id}
                    >
                      <div className="visual">
                        {profile.photo ? (
                          <img
                            src={profile.photo}
                            alt={profile.item_name ?? ""}
                          />
                        ) : (
                          <div className="visualPlaceholder">
                            {type.icon}
                          </div>
                        )}

                        <span
                          className={`status ${
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

                      <div className="profileBody">
                        <span className="profileType">
                          {type.label}
                        </span>

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

                        <div className="methodStatus">
                          {profile.phone_enabled && (
                            <span>📞</span>
                          )}

                          {profile.whatsapp_enabled && (
                            <span>💬</span>
                          )}

                          {profile.live_chat_enabled && (
                            <span>🗨️</span>
                          )}

                          {profile.location_sharing_enabled && (
                            <span>📍</span>
                          )}
                        </div>

                        <div className="actions">
                          {access.can_edit_profiles && (
                            <a
                              href={`/admin-edit-profile/${profile.id}`}
                            >
                              ✏️{" "}
                              {ka
                                ? "რედაქტირება"
                                : "Edit"}
                            </a>
                          )}

                          {access.can_manage_lost_mode && (
                            <button
                              type="button"
                              className={
                                profile.active
                                  ? "safeButton"
                                  : "lostButton"
                              }
                              onClick={() =>
                                toggleLostMode(profile)
                              }
                            >
                              {profile.active
                                ? ka
                                  ? "✓ უსაფრთხოდ"
                                  : "Mark safe"
                                : ka
                                ? "🚨 დაიკარგა"
                                : "Mark lost"}
                            </button>
                          )}

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

                          {access.can_use_live_chat &&
                            profile.live_chat_enabled &&
                            profile.tag_code && (
                              <a
                                href={`/admin-chat/${profile.tag_code}`}
                              >
                                💬 Live Chat
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
        )}
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
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #f7f9fc;
        }

        .stateLogo {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-weight: 900;
        }

        .statePage h1 {
          margin: 0 0 15px;
          color: #1465e8;
        }

        .logoutState {
          margin-top: 15px;
          padding: 10px 14px;
          border: 1px solid #d0d5dd;
          border-radius: 9px;
          background: white;
          color: #475467;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
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
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
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

        .languages button.active {
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
          max-width: 1050px;
          margin: auto;
          padding: 55px 0 90px;
        }

        .welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .welcome h1 {
          margin: 7px 0;
          font-size: 44px;
          letter-spacing: -2px;
        }

        .welcome p {
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.6;
        }

        .adminBadge {
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #dbe7ff;
          border-radius: 13px;
          background: #f5f9ff;
        }

        .adminBadge > span {
          font-size: 24px;
        }

        .adminBadge small,
        .adminBadge strong {
          display: block;
        }

        .adminBadge small {
          color: #7655f7;
          font-size: 8px;
          font-weight: 900;
        }

        .adminBadge strong {
          margin-top: 3px;
          font-size: 11px;
        }

        .ownerCard,
        .permissionsCard,
        .profilesSection,
        .noAccessCard {
          margin-top: 20px;
          padding: 25px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 30px rgba(16, 24, 40, 0.04);
        }

        .ownerCard {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ownerAvatar {
          width: 64px;
          height: 64px;
          flex: 0 0 64px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          background: #eef4ff;
          font-size: 28px;
        }

        .ownerAvatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ownerDetails {
          flex: 1;
        }

        .ownerDetails span {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
        }

        .ownerDetails h2 {
          margin: 4px 0;
          font-size: 21px;
        }

        .ownerDetails p {
          margin: 0;
          color: #667085;
          font-size: 11px;
        }

        .ownerLock {
          padding: 9px 11px;
          border-radius: 9px;
          background: #f2f4f7;
          color: #667085;
          font-size: 9px;
          font-weight: 800;
        }

        .sectionHeader h2 {
          margin: 6px 0;
          font-size: 23px;
        }

        .sectionHeader p {
          margin: 0;
          color: #667085;
          font-size: 11px;
        }

        .permissionGrid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .permission {
          min-height: 90px;
          padding: 13px;
          border: 1px solid #eaecf0;
          border-radius: 12px;
          background: #fafbfc;
        }

        .permissionIcon {
          font-size: 19px;
        }

        .permission strong {
          display: block;
          margin-top: 8px;
          font-size: 10px;
        }

        .permission span.statusText {
          display: block;
          margin-top: 5px;
          font-size: 9px;
          font-weight: 900;
        }

        .permission.enabled span.statusText {
          color: #027a48;
        }

        .permission.disabled {
          opacity: 0.6;
        }

        .permission.disabled span.statusText {
          color: #98a2b3;
        }

        .lockedNotice {
          margin-top: 15px;
          padding: 11px;
          border-radius: 10px;
          background: #f2f4f7;
          color: #667085;
          font-size: 10px;
        }

        .noAccessCard {
          text-align: center;
          padding: 55px 25px;
        }

        .bigLock {
          font-size: 40px;
        }

        .noAccessCard h2 {
          margin: 14px 0 7px;
        }

        .noAccessCard p {
          margin: 0;
          color: #667085;
          font-size: 11px;
        }

        .profilesGrid {
          margin-top: 20px;
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
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 50px;
        }

        .status {
          position: absolute;
          top: 11px;
          right: 11px;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
        }

        .status.safe {
          background: #ecfdf3;
          color: #027a48;
        }

        .status.lost {
          background: #fff1f0;
          color: #b42318;
        }

        .profileBody {
          padding: 16px;
        }

        .profileType {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
        }

        .profileBody h3 {
          margin: 5px 0 7px;
          font-size: 19px;
        }

        .tagCode {
          margin: 0;
          color: #98a2b3;
          font-size: 9px;
        }

        .methodStatus {
          margin-top: 10px;
          display: flex;
          gap: 6px;
        }

        .methodStatus span {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: #f2f4f7;
          font-size: 12px;
        }

        .actions {
          margin-top: 14px;
          padding-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          border-top: 1px solid #eaecf0;
        }

        .actions a,
        .actions button {
          min-height: 34px;
          padding: 0 9px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
        }

        .actions a {
          border: 1px solid #dbe7ff;
          background: #f5f9ff;
          color: #1465e8;
        }

        .actions button {
          border: 0;
        }

        .lostButton {
          background: #fff1f0;
          color: #b42318;
        }

        .safeButton {
          background: #ecfdf3;
          color: #027a48;
        }

        .emptyProfiles {
          margin-top: 20px;
          padding: 40px;
          text-align: center;
          border-radius: 13px;
          background: #f7f9fc;
          color: #667085;
          font-size: 11px;
        }

        .errorBox {
          margin-top: 15px;
          padding: 13px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .permissionGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .profilesGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .welcome {
            align-items: stretch;
            flex-direction: column;
          }

          .adminBadge {
            width: 100%;
          }

          .ownerCard {
            align-items: flex-start;
            flex-direction: column;
          }

          .ownerLock {
            width: 100%;
          }

          .profilesGrid,
          .permissionGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Permission({
  icon,
  label,
  enabled,
}: {
  icon: string;
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`permission ${
        enabled ? "enabled" : "disabled"
      }`}
    >
      <div className="permissionIcon">
        {icon}
      </div>

      <strong>
        {label}
      </strong>

      <span className="statusText">
        {enabled ? "ON" : "OFF"}
      </span>
    </div>
  );
}
