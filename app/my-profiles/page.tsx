"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Profile = {
  id: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  photo: string | null;
  tag_code: string | null;
  active: boolean | null;
};

export default function MyProfilesPage() {
  const [lang, setLang] = useState<Lang>("ka");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
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

      const firstName = user.user_metadata?.first_name ?? "";
      const lastName = user.user_metadata?.last_name ?? "";

      setName(`${firstName} ${lastName}`.trim());
      setEmail(user.email ?? "");

      const { data, error: profilesError } = await supabase
        .from("item")
        .select(
          "id, item_name, item_type, pet_type, photo, tag_code, active"
        )
        .eq("owner_id", user.id)
        .order("id", { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      setProfiles(data ?? []);
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

  function getIcon(profile: Profile) {
    const itemType = (profile.item_type ?? "").toLowerCase();
    const petType = (profile.pet_type ?? "").toLowerCase();

    if (petType === "dog") return "🐶";
    if (petType === "cat") return "🐱";

    if (itemType === "keys") return "🔑";
    if (itemType === "wallet") return "👛";
    if (itemType === "bag") return "👜";
    if (itemType === "suitcase") return "🧳";

    return "🏷️";
  }

  function getTypeName(profile: Profile) {
    const itemType = (profile.item_type ?? "").toLowerCase();
    const petType = (profile.pet_type ?? "").toLowerCase();

    if (petType === "dog") return ka ? "ძაღლი" : "Dog";
    if (petType === "cat") return ka ? "კატა" : "Cat";

    if (itemType === "keys") return ka ? "გასაღები" : "Keys";
    if (itemType === "wallet") return ka ? "საფულე" : "Wallet";
    if (itemType === "bag") return ka ? "ჩანთა" : "Bag";
    if (itemType === "suitcase") return ka ? "ჩემოდანი" : "Suitcase";

    return ka ? "პროფილი" : "Profile";
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>MY ACCOUNT</small>
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
        <div className="accountTop">
          <div>
            <div className="eyebrow">
              {ka ? "ჩემი ანგარიში" : "MY ACCOUNT"}
            </div>

            <h1>
              {name
                ? ka
                  ? `გამარჯობა, ${name}`
                  : `Hello, ${name}`
                : ka
                ? "ჩემი პროფილები"
                : "My Profiles"}
            </h1>

            <p>
              {ka
                ? "აქ შეგიძლიათ მართოთ თქვენი ყველა ცხოველისა და ნივთის QR პროფილი."
                : "Manage all your pet and item QR profiles here."}
            </p>

            {email && <small>{email}</small>}
          </div>

          <a href="/add-profile" className="addButton">
            <span>+</span>
            {ka ? "ახალი პროფილის დამატება" : "Add new profile"}
          </a>
        </div>

        {error && (
          <div className="errorBox">
            <strong>!</strong>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="loading">
            {ka ? "იტვირთება..." : "Loading..."}
          </div>
        ) : profiles.length === 0 ? (
          <div className="emptyState">
            <div className="emptyIcon">🏷️</div>

            <h2>
              {ka
                ? "ჯერ არცერთი პროფილი არ გაქვთ"
                : "You don't have any profiles yet"}
            </h2>

            <p>
              {ka
                ? "შეგიძლიათ შექმნათ ძაღლის, კატის, გასაღების, საფულის, ჩანთის ან ჩემოდნის ცალკე პროფილი."
                : "Create a separate profile for a dog, cat, keys, wallet, bag or suitcase."}
            </p>

            <a href="/add-profile" className="emptyButton">
              <span>+</span>
              {ka ? "პირველი პროფილის შექმნა" : "Create first profile"}
            </a>
          </div>
        ) : (
          <>
            <div className="sectionHeader">
              <div>
                <h2>{ka ? "ჩემი პროფილები" : "My Profiles"}</h2>

                <p>
                  {ka
                    ? `${profiles.length} პროფილი`
                    : `${profiles.length} profile${
                        profiles.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>

              <a href="/add-profile" className="smallAddButton">
                + {ka ? "დამატება" : "Add"}
              </a>
            </div>

            <div className="profilesGrid">
              {profiles.map((profile) => (
                <article className="profileCard" key={profile.id}>
                  <div className="imageArea">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt={profile.item_name ?? "Profile"}
                      />
                    ) : (
                      <div className="placeholder">
                        {getIcon(profile)}
                      </div>
                    )}

                    <div
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
                    </div>
                  </div>

                  <div className="cardContent">
                    <div className="type">
                      {getTypeName(profile)}
                    </div>

                    <h3>
                      {profile.item_name ||
                        (ka ? "უსახელო პროფილი" : "Unnamed profile")}
                    </h3>

                    {profile.tag_code && (
                      <div className="tagCode">
                        <span>QR</span>
                        {profile.tag_code}
                      </div>
                    )}

                    <div className="cardActions">
                      <a
                        href={`/profile/${profile.id}`}
                        className="editButton"
                      >
                        <span>✏️</span>
                        {ka ? "რედაქტირება" : "Edit"}
                      </a>

                      <a
                        href={`/profile/${profile.id}`}
                        className="openButton"
                      >
                        {ka ? "გახსნა" : "Open"} →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
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
        }

        button {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(20, 101, 232, 0.08),
              transparent 27%
            ),
            radial-gradient(
              circle at 93% 10%,
              rgba(118, 85, 247, 0.09),
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

        .logoutButton {
          min-height: 40px;
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

        .accountTop {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 50px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .accountTop h1 {
          margin: 10px 0 10px;
          font-size: clamp(36px, 5vw, 52px);
          line-height: 1.08;
          letter-spacing: -2px;
        }

        .accountTop p {
          margin: 0;
          color: #667085;
          font-size: 16px;
          line-height: 1.6;
        }

        .accountTop small {
          display: block;
          margin-top: 8px;
          color: #98a2b3;
          font-size: 12px;
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

        .addButton > span,
        .emptyButton > span {
          font-size: 22px;
        }

        .loading {
          padding: 80px 20px;
          text-align: center;
          color: #667085;
          font-weight: 700;
        }

        .errorBox {
          margin-bottom: 25px;
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 13px;
        }

        .errorBox strong {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d92d20;
          color: white;
          font-size: 10px;
        }

        .emptyState {
          max-width: 680px;
          margin: 20px auto 0;
          padding: 70px 30px;
          text-align: center;
          border: 1px dashed #cfd8e8;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
        }

        .emptyIcon {
          width: 74px;
          height: 74px;
          margin: auto;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: linear-gradient(135deg, #eef4ff, #f0edff);
          font-size: 35px;
        }

        .emptyState h2 {
          margin: 20px 0 10px;
          font-size: 26px;
        }

        .emptyState p {
          max-width: 500px;
          margin: 0 auto 25px;
          color: #667085;
          font-size: 14px;
          line-height: 1.7;
        }

        .sectionHeader {
          margin-bottom: 20px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
        }

        .sectionHeader h2 {
          margin: 0;
          font-size: 27px;
        }

        .sectionHeader p {
          margin: 5px 0 0;
          color: #98a2b3;
          font-size: 13px;
        }

        .smallAddButton {
          padding: 9px 14px;
          border: 1px solid #dbe7ff;
          border-radius: 9px;
          background: white;
          color: #1465e8;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .profilesGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .profileCard {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          box-shadow: 0 12px 30px rgba(16, 24, 40, 0.06);
        }

        .imageArea {
          height: 190px;
          position: relative;
          background: #eef3f8;
        }

        .imageArea img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #eef4ff, #f1edff);
          font-size: 62px;
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

        .status.safe {
          background: #ecfdf3;
          color: #027a48;
        }

        .status.lost {
          background: #fff1f0;
          color: #b42318;
        }

        .cardContent {
          padding: 20px;
        }

        .type {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .cardContent h3 {
          margin: 7px 0 13px;
          color: #101828;
          font-size: 22px;
        }

        .tagCode {
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

        .cardActions {
          margin-top: 18px;
          padding-top: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border-top: 1px solid #eaecf0;
        }

        .editButton,
        .openButton {
          color: #1465e8;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .editButton {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        @media (max-width: 900px) {
          .profilesGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .accountTop {
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

          .logoutButton {
            padding: 0 10px;
          }

          .container {
            padding-top: 40px;
          }

          .profilesGrid {
            grid-template-columns: 1fr;
          }

          .imageArea {
            height: 220px;
          }
        }
      `}</style>
    </main>
  );
}
