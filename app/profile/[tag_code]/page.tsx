"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type ItemProfile = {
  tag_code: string;
  item_type: string;
  pet_type: string | null;
  item_name: string | null;
  colour: string | null;

  sex: string | null;
  date_of_birth: string | null;
  weight: number | null;
  medical_info: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;
  description: string | null;

  photo_url: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  owner_photo_url: string | null;

  finder_message: string | null;
  contact_preference: string | null;
  location_sharing_enabled: boolean | null;
  active: boolean | null;
};

export default function ProfilePage() {
  const params = useParams();

  const rawTag = params?.tag_code;

  const tagCode = Array.isArray(rawTag)
    ? rawTag[0]
    : typeof rawTag === "string"
    ? rawTag
    : "";

  const [profile, setProfile] = useState<ItemProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError("");

      if (!tagCode) {
        setError("QR კოდი ვერ მოიძებნა.");
        setLoading(false);
        return;
      }

      try {
        const decodedTag = decodeURIComponent(tagCode);

        const { data, error: fetchError } = await supabase
          .from("item")
          .select("*")
          .eq("tag_code", decodedTag)
          .maybeSingle();

        if (fetchError) {
          console.error("Profile load error:", fetchError);
          setError(
            `პროფილის ჩატვირთვა ვერ მოხერხდა: ${fetchError.message}`
          );
          setLoading(false);
          return;
        }

        if (!data) {
          setError("ამ QR კოდზე პროფილი არ მოიძებნა.");
          setLoading(false);
          return;
        }

        setProfile(data as ItemProfile);
      } catch (err) {
        console.error("Profile error:", err);
        setError("პროფილის ჩატვირთვა ვერ მოხერხდა.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [tagCode]);

  if (loading) {
    return (
      <>
        <main className="centerPage">
          <div className="logo centerLogo">QR</div>
          <h1>QR RETURN</h1>
          <p>პროფილი იტვირთება...</p>
        </main>

        <Styles />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <main className="centerPage">
          <div className="logo centerLogo">QR</div>

          <h1>QR RETURN</h1>

          <div className="errorBox">
            {error || "პროფილი ვერ მოიძებნა."}
          </div>

          <a href="/" className="homeButton">
            მთავარ გვერდზე დაბრუნება
          </a>
        </main>

        <Styles />
      </>
    );
  }

  const isPet =
    profile.item_type === "dog" ||
    profile.item_type === "cat";

  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>OWNER PROFILE</small>
            </div>
          </a>

          <a href="/" className="homeLink">
            მთავარი
          </a>
        </header>

        <div className="container">
          <section className="profileCard">
            <div className="hero">
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt={profile.item_name || "Profile"}
                  className="mainPhoto"
                />
              ) : (
                <div className="photoPlaceholder">
                  {getIcon(profile.item_type)}
                </div>
              )}

              <div className="heroText">
                <span className="profileLabel">
                  QR PROFILE
                </span>

                <h1>
                  {profile.item_name ||
                    getCategory(profile.item_type)}
                </h1>

                <div className="category">
                  {getCategory(profile.item_type)}
                </div>

                <p className="tag">
                  QR კოდი:{" "}
                  <strong>{profile.tag_code}</strong>
                </p>

                <div
                  className={
                    profile.active === false
                      ? "status inactive"
                      : "status active"
                  }
                >
                  <span />

                  {profile.active === false
                    ? "არააქტიური"
                    : "აქტიური"}
                </div>
              </div>
            </div>

            <section className="section">
              <div className="sectionTitle">
                <span>01</span>

                <h2>
                  {isPet
                    ? "ცხოველის ინფორმაცია"
                    : "ნივთის ინფორმაცია"}
                </h2>
              </div>

              <div className="grid">
                {profile.colour && (
                  <Info
                    label="ფერი"
                    value={profile.colour}
                  />
                )}

                {isPet && profile.sex && (
                  <Info
                    label="სქესი"
                    value={translateSex(profile.sex)}
                  />
                )}

                {isPet && profile.date_of_birth && (
                  <Info
                    label="დაბადების თარიღი"
                    value={profile.date_of_birth}
                  />
                )}

                {isPet && profile.weight !== null && (
                  <Info
                    label="წონა"
                    value={`${profile.weight}`}
                  />
                )}

                {!isPet && profile.brand && (
                  <Info
                    label="ბრენდი"
                    value={profile.brand}
                  />
                )}

                {!isPet && profile.model && (
                  <Info
                    label="მოდელი"
                    value={profile.model}
                  />
                )}

                {!isPet && profile.size && (
                  <Info
                    label="ზომა"
                    value={profile.size}
                  />
                )}

                {!isPet && profile.material && (
                  <Info
                    label="მასალა"
                    value={profile.material}
                  />
                )}
              </div>

              {profile.medical_info && (
                <LongInfo
                  label="სამედიცინო ინფორმაცია"
                  value={profile.medical_info}
                />
              )}

              {profile.distinctive_features && (
                <LongInfo
                  label="განმასხვავებელი ნიშნები"
                  value={profile.distinctive_features}
                />
              )}

              {profile.description && (
                <LongInfo
                  label="დამატებითი აღწერა"
                  value={profile.description}
                />
              )}
            </section>

            <section className="section">
              <div className="sectionTitle">
                <span>02</span>
                <h2>მფლობელის ინფორმაცია</h2>
              </div>

              <div className="ownerCard">
                {profile.owner_photo_url ? (
                  <img
                    src={profile.owner_photo_url}
                    alt="Owner"
                    className="ownerPhoto"
                  />
                ) : (
                  <div className="ownerPlaceholder">
                    👤
                  </div>
                )}

                <div className="ownerInfo">
                  <small>მფლობელი</small>

                  <strong>
                    {profile.owner_name ||
                      "სახელი მითითებული არ არის"}
                  </strong>

                  {profile.owner_phone && (
                    <a href={`tel:${profile.owner_phone}`}>
                      📞 {profile.owner_phone}
                    </a>
                  )}

                  {profile.owner_email && (
                    <a
                      href={`mailto:${profile.owner_email}`}
                    >
                      ✉️ {profile.owner_email}
                    </a>
                  )}
                </div>
              </div>

              {profile.contact_preference && (
                <div className="singleInfo">
                  <Info
                    label="დაკავშირების მეთოდი"
                    value={translateContact(
                      profile.contact_preference
                    )}
                  />
                </div>
              )}
            </section>

            <section className="section">
              <div className="sectionTitle">
                <span>03</span>
                <h2>მპოვნელისთვის</h2>
              </div>

              {profile.finder_message ? (
                <LongInfo
                  label="შეტყობინება მპოვნელისთვის"
                  value={profile.finder_message}
                />
              ) : (
                <div className="empty">
                  შეტყობინება მითითებული არ არის.
                </div>
              )}

              <div className="singleInfo">
                <Info
                  label="ლოკაციის გაზიარება"
                  value={
                    profile.location_sharing_enabled
                      ? "ჩართულია"
                      : "გამორთულია"
                  }
                />
              </div>
            </section>

            <div className="buttons">
              <a
                href={`/profile/${encodeURIComponent(
                  profile.tag_code
                )}/edit`}
                className="editButton"
              >
                ✏️ პროფილის რედაქტირება
              </a>

              <a
                href="/"
                className="secondaryButton"
              >
                მთავარ გვერდზე დაბრუნება
              </a>
            </div>
          </section>
        </div>
      </main>

      <Styles />
    </>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="infoBox">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LongInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="longInfo">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function getCategory(type: string) {
  switch (type) {
    case "dog":
      return "ძაღლი";
    case "cat":
      return "კატა";
    case "key":
      return "გასაღები";
    case "wallet":
      return "საფულე";
    case "luggage":
      return "ჩანთა / ჩემოდანი";
    default:
      return type;
  }
}

function getIcon(type: string) {
  switch (type) {
    case "dog":
      return "🐕";
    case "cat":
      return "🐈";
    case "key":
      return "🔑";
    case "wallet":
      return "👛";
    case "luggage":
      return "🧳";
    default:
      return "📦";
  }
}

function translateSex(sex: string) {
  if (sex === "male") return "მამრობითი";
  if (sex === "female") return "მდედრობითი";
  return sex;
}

function translateContact(value: string) {
  if (value === "both") {
    return "Live Chat და ტელეფონი";
  }

  if (value === "chat") {
    return "Live Chat";
  }

  if (value === "phone") {
    return "ტელეფონი";
  }

  return value;
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

      .page {
        min-height: 100vh;
        color: #101828;
        font-family: Arial, Helvetica, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e7ebf0;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #1465e8;
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #1465e8;
        font-size: 20px;
      }

      .brand small {
        display: block;
        margin-top: 2px;
        color: #98a2b3;
        font-size: 7px;
        letter-spacing: 2px;
      }

      .homeLink {
        color: #475467;
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 760px;
        margin: auto;
        padding: 45px 0 80px;
      }

      .profileCard {
        padding: 28px;
        border: 1px solid #e1e6ec;
        border-radius: 24px;
        background: white;
      }

      .hero {
        display: flex;
        align-items: center;
        gap: 22px;
      }

      .mainPhoto,
      .photoPlaceholder {
        width: 160px;
        height: 160px;
        flex: 0 0 160px;
        border-radius: 22px;
      }

      .mainPhoto {
        object-fit: cover;
      }

      .photoPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 55px;
      }

      .profileLabel {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .heroText h1 {
        margin: 8px 0;
        font-size: 36px;
      }

      .category {
        width: fit-content;
        padding: 6px 10px;
        border-radius: 30px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .tag {
        margin: 10px 0 0;
        color: #667085;
        font-size: 12px;
      }

      .status {
        width: fit-content;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 800;
      }

      .status span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }

      .status.active {
        color: #16803b;
      }

      .status.active span {
        background: #16803b;
      }

      .status.inactive {
        color: #b42318;
      }

      .status.inactive span {
        background: #b42318;
      }

      .section {
        margin-top: 30px;
        padding-top: 26px;
        border-top: 1px solid #edf0f3;
      }

      .sectionTitle {
        margin-bottom: 17px;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sectionTitle span {
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
      }

      .sectionTitle h2 {
        margin: 0;
        font-size: 18px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .infoBox {
        padding: 14px;
        border-radius: 12px;
        background: #f8fafc;
      }

      .infoBox span,
      .longInfo span {
        display: block;
        color: #7b8492;
        font-size: 10px;
        font-weight: 700;
      }

      .infoBox strong {
        display: block;
        margin-top: 5px;
        font-size: 13px;
      }

      .longInfo {
        margin-top: 12px;
        padding: 14px;
        border-radius: 12px;
        background: #f8fafc;
      }

      .longInfo p {
        margin: 6px 0 0;
        color: #344054;
        font-size: 12px;
        line-height: 1.6;
      }

      .ownerCard {
        margin-bottom: 12px;
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 14px;
        border-radius: 14px;
        background: #f8fafc;
      }

      .ownerPhoto,
      .ownerPlaceholder {
        width: 70px;
        height: 70px;
        flex: 0 0 70px;
        border-radius: 50%;
      }

      .ownerPhoto {
        object-fit: cover;
      }

      .ownerPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 27px;
      }

      .ownerInfo small,
      .ownerInfo strong,
      .ownerInfo a {
        display: block;
      }

      .ownerInfo small {
        color: #98a2b3;
        font-size: 9px;
      }

      .ownerInfo strong {
        margin: 3px 0 7px;
        font-size: 15px;
      }

      .ownerInfo a {
        margin-top: 5px;
        color: #475467;
        font-size: 11px;
        text-decoration: none;
      }

      .singleInfo {
        margin-top: 12px;
      }

      .empty {
        padding: 14px;
        border-radius: 12px;
        background: #f8fafc;
        color: #98a2b3;
        font-size: 12px;
      }

      .buttons {
        margin-top: 30px;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
        gap: 10px;
      }

      .editButton,
      .secondaryButton,
      .homeButton {
        min-height: 54px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .editButton {
        background: #1465e8;
        color: white;
      }

      .secondaryButton {
        border: 1px solid #d5dae1;
        background: white;
        color: #475467;
      }

      .centerPage {
        width: calc(100% - 24px);
        max-width: 500px;
        margin: auto;
        padding-top: 130px;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
      }

      .centerLogo {
        margin: auto;
      }

      .centerPage h1 {
        color: #1465e8;
      }

      .errorBox {
        margin: 20px 0;
        padding: 15px;
        border-radius: 12px;
        background: #fff1f1;
        color: #b42318;
        font-size: 12px;
      }

      .homeButton {
        margin-top: 20px;
        background: #1465e8;
        color: white;
      }

      @media (max-width: 600px) {
        .header {
          min-height: 70px;
        }

        .homeLink {
          display: none;
        }

        .container {
          padding-top: 25px;
        }

        .profileCard {
          padding: 18px 14px;
          border-radius: 18px;
        }

        .hero {
          align-items: flex-start;
          gap: 14px;
        }

        .mainPhoto,
        .photoPlaceholder {
          width: 105px;
          height: 105px;
          flex-basis: 105px;
          border-radius: 16px;
        }

        .heroText h1 {
          font-size: 26px;
        }

        .grid {
          grid-template-columns: 1fr;
        }

        .buttons {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
