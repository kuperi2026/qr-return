"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FinderProfile = {
  tag_code: string;
  item_type: string;
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
  owner_photo_url: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

  finder_message: string | null;
  lost_seen_location: string | null;
  contact_preference: string | null;

  location_sharing_enabled: boolean | null;
  active: boolean | null;

  show_colour: boolean | null;
  show_sex: boolean | null;
  show_date_of_birth: boolean | null;
  show_weight: boolean | null;
  show_medical_info: boolean | null;

  show_brand: boolean | null;
  show_model: boolean | null;
  show_size: boolean | null;
  show_material: boolean | null;
  show_distinctive_features: boolean | null;
  show_description: boolean | null;

  show_photo: boolean | null;
  show_owner_photo: boolean | null;
  show_owner_phone: boolean | null;
  show_owner_email: boolean | null;
  show_additional_contact: boolean | null;
  show_finder_message: boolean | null;
  show_lost_seen_location: boolean | null;
};

export default function FinderPage() {
  const params = useParams();

  const rawTag = params?.tag_code;

  const tagCode = Array.isArray(rawTag)
    ? rawTag[0]
    : typeof rawTag === "string"
    ? rawTag
    : "";

  const [profile, setProfile] =
    useState<FinderProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [locationStatus, setLocationStatus] =
    useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!tagCode) {
        setError("QR კოდი ვერ მოიძებნა.");
        setLoading(false);
        return;
      }

      const decodedTag =
        decodeURIComponent(tagCode);

      const {
        data,
        error: fetchError,
      } = await supabase
        .from("item")
        .select("*")
        .eq("tag_code", decodedTag)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);

        setError(
          "პროფილის ჩატვირთვა ვერ მოხერხდა."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "ამ QR კოდზე პროფილი არ მოიძებნა."
        );

        setLoading(false);
        return;
      }

      setProfile(data as FinderProfile);
      setLoading(false);
    }

    loadProfile();
  }, [tagCode]);

  async function shareLocation() {
    if (!profile) return;

    if (!navigator.geolocation) {
      setLocationStatus(
        "თქვენს მოწყობილობას ლოკაციის გაზიარება არ აქვს მხარდაჭერილი."
      );
      return;
    }

    setLocationStatus(
      "ლოკაცია მუშავდება..."
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;

        const {
          error: updateError,
        } = await supabase
          .from("item")
          .update({
            last_scanned_at:
              new Date().toISOString(),

            last_scan_latitude:
              latitude,

            last_scan_longitude:
              longitude,

            last_scan_accuracy:
              accuracy,
          })
          .eq(
            "tag_code",
            profile.tag_code
          );

        if (updateError) {
          console.error(updateError);

          setLocationStatus(
            "ლოკაციის გაგზავნა ვერ მოხერხდა."
          );

          return;
        }

        setLocationStatus(
          "ლოკაცია წარმატებით გაიგზავნა."
        );
      },

      (geoError) => {
        console.error(geoError);

        if (
          geoError.code ===
          geoError.PERMISSION_DENIED
        ) {
          setLocationStatus(
            "ლოკაციის გაზიარებისთვის საჭიროა ნებართვა."
          );
        } else {
          setLocationStatus(
            "ლოკაციის მიღება ვერ მოხერხდა."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  if (loading) {
    return (
      <>
        <main className="centerPage">
          <div className="logo centerLogo">
            QR
          </div>

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
          <div className="logo centerLogo">
            QR
          </div>

          <h1>QR RETURN</h1>

          <div className="errorBox">
            {error || "პროფილი ვერ მოიძებნა."}
          </div>
        </main>

        <Styles />
      </>
    );
  }

  const isPet =
    profile.item_type === "dog" ||
    profile.item_type === "cat";

  const canShowPhoto =
    profile.show_photo !== false &&
    Boolean(profile.photo_url);

  const canCall =
    profile.show_owner_phone !== false &&
    Boolean(profile.owner_phone);

  const canEmail =
    profile.show_owner_email === true &&
    Boolean(profile.owner_email);

  return (
    <>
      <main className="page">
        <header className="header">
          <div className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>FOUND ITEM PROFILE</small>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="finderCard">
            <div className="hero">
              {canShowPhoto ? (
                <img
                  src={profile.photo_url!}
                  alt={
                    profile.item_name ||
                    "Profile"
                  }
                  className="mainPhoto"
                />
              ) : (
                <div className="photoPlaceholder">
                  {getIcon(
                    profile.item_type
                  )}
                </div>
              )}

              <div className="heroText">
                <div className="eyebrow">
                  YOU FOUND
                </div>

                <h1>
                  {profile.item_name ||
                    getCategory(
                      profile.item_type
                    )}
                </h1>

                <div className="categoryBadge">
                  {getCategory(
                    profile.item_type
                  )}
                </div>

                <p>
                  QR კოდი:{" "}
                  <strong>
                    {profile.tag_code}
                  </strong>
                </p>
              </div>
            </div>

            {profile.show_finder_message !==
              false &&
              profile.finder_message && (
                <div className="messageBox">
                  <span>
                    მფლობელის შეტყობინება
                  </span>

                  <p>
                    {
                      profile.finder_message
                    }
                  </p>
                </div>
              )}

            <section className="section">
              <h2>
                {isPet
                  ? "ცხოველის ინფორმაცია"
                  : "ნივთის ინფორმაცია"}
              </h2>

              <div className="grid">
                {profile.show_colour !==
                  false &&
                  profile.colour && (
                    <Info
                      label="ფერი"
                      value={
                        profile.colour
                      }
                    />
                  )}

                {isPet &&
                  profile.show_sex !==
                    false &&
                  profile.sex && (
                    <Info
                      label="სქესი"
                      value={translateSex(
                        profile.sex
                      )}
                    />
                  )}

                {isPet &&
                  profile.show_date_of_birth ===
                    true &&
                  profile.date_of_birth && (
                    <Info
                      label="დაბადების თარიღი"
                      value={
                        profile.date_of_birth
                      }
                    />
                  )}

                {isPet &&
                  profile.show_weight ===
                    true &&
                  profile.weight !==
                    null && (
                    <Info
                      label="წონა"
                      value={`${profile.weight}`}
                    />
                  )}

                {!isPet &&
                  profile.show_brand !==
                    false &&
                  profile.brand && (
                    <Info
                      label="ბრენდი"
                      value={
                        profile.brand
                      }
                    />
                  )}

                {!isPet &&
                  profile.show_model !==
                    false &&
                  profile.model && (
                    <Info
                      label="მოდელი"
                      value={
                        profile.model
                      }
                    />
                  )}

                {!isPet &&
                  profile.show_size ===
                    true &&
                  profile.size && (
                    <Info
                      label="ზომა"
                      value={
                        profile.size
                      }
                    />
                  )}

                {!isPet &&
                  profile.show_material ===
                    true &&
                  profile.material && (
                    <Info
                      label="მასალა"
                      value={
                        profile.material
                      }
                    />
                  )}
              </div>

              {isPet &&
                profile.show_medical_info ===
                  true &&
                profile.medical_info && (
                  <LongInfo
                    label="სამედიცინო ინფორმაცია"
                    value={
                      profile.medical_info
                    }
                  />
                )}

              {!isPet &&
                profile.show_distinctive_features !==
                  false &&
                profile.distinctive_features && (
                  <LongInfo
                    label="განმასხვავებელი ნიშნები"
                    value={
                      profile.distinctive_features
                    }
                  />
                )}

              {profile.show_description !==
                false &&
                profile.description && (
                  <LongInfo
                    label="დამატებითი აღწერა"
                    value={
                      profile.description
                    }
                  />
                )}

              {profile.show_lost_seen_location !==
                false &&
                profile.lost_seen_location && (
                  <LongInfo
                    label="ბოლო ნანახი ადგილი"
                    value={
                      profile.lost_seen_location
                    }
                  />
                )}
            </section>

            <section className="section">
              <h2>
                დაუკავშირდი მფლობელს
              </h2>

              {profile.show_owner_photo ===
                true &&
                profile.owner_photo_url && (
                  <div className="ownerPhotoWrap">
                    <img
                      src={
                        profile.owner_photo_url
                      }
                      alt="Owner"
                    />
                  </div>
                )}

              <div className="contactButtons">
                {canCall && (
                  <a
                    href={`tel:${profile.owner_phone}`}
                    className="primaryButton"
                  >
                    📞 დარეკვა
                  </a>
                )}

                {canEmail && (
                  <a
                    href={`mailto:${profile.owner_email}`}
                    className="secondaryButton"
                  >
                    ✉️ ელფოსტა
                  </a>
                )}
              </div>

              {profile.show_additional_contact ===
                true &&
                (profile.additional_contact_name ||
                  profile.additional_contact_phone ||
                  profile.additional_contact_email) && (
                  <div className="additionalContact">
                    <span>
                      დამატებითი საკონტაქტო პირი
                    </span>

                    {profile.additional_contact_name && (
                      <strong>
                        {
                          profile.additional_contact_name
                        }
                      </strong>
                    )}

                    {profile.additional_contact_phone && (
                      <a
                        href={`tel:${profile.additional_contact_phone}`}
                      >
                        📞{" "}
                        {
                          profile.additional_contact_phone
                        }
                      </a>
                    )}

                    {profile.additional_contact_email && (
                      <a
                        href={`mailto:${profile.additional_contact_email}`}
                      >
                        ✉️{" "}
                        {
                          profile.additional_contact_email
                        }
                      </a>
                    )}
                  </div>
                )}
            </section>

            {profile.location_sharing_enabled && (
              <section className="section">
                <h2>
                  მდებარეობის გაზიარება
                </h2>

                <p className="locationText">
                  სურვილის შემთხვევაში შეგიძლია
                  მფლობელს გაუზიარო შენი მიმდინარე
                  მდებარეობა.
                </p>

                <button
                  type="button"
                  className="locationButton"
                  onClick={shareLocation}
                >
                  📍 ჩემი ლოკაციის გაზიარება
                </button>

                {locationStatus && (
                  <div className="locationStatus">
                    {locationStatus}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>

        <Styles />
      </main>
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

    case "bag":
      return "ჩანთა";

    case "suitcase":
      return "ჩემოდანი";

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

    case "bag":
      return "🎒";

    case "suitcase":
      return "🧳";

    default:
      return "📦";
  }
}

function translateSex(
  sex: string
) {
  if (sex === "male") {
    return "მამრობითი";
  }

  if (sex === "female") {
    return "მდედრობითი";
  }

  return sex;
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      button,
      input {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background: #f8fafc;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e8ecf1;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        width: 43px;
        height: 43px;
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

      .content {
        width: calc(100% - 24px);
        max-width: 720px;
        margin: auto;
        padding: 42px 0 80px;
      }

      .finderCard {
        padding: 28px;
        border: 1px solid #e2e7ed;
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
        width: 150px;
        height: 150px;
        flex: 0 0 150px;
        border-radius: 22px;
      }

      .mainPhoto {
        object-fit: cover;
      }

      .photoPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 52px;
      }

      .eyebrow {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .heroText h1 {
        margin: 8px 0;
        font-size: 36px;
      }

      .categoryBadge {
        width: fit-content;
        padding: 6px 11px;
        border-radius: 30px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .heroText p {
        margin: 10px 0 0;
        color: #667085;
        font-size: 11px;
      }

      .messageBox {
        margin-top: 25px;
        padding: 18px;
        border-radius: 15px;
        background: #eef4ff;
      }

      .messageBox span,
      .infoBox span,
      .longInfo span,
      .additionalContact > span {
        display: block;
        color: #667085;
        font-size: 11px;
        font-weight: 800;
      }

      .messageBox p {
        margin: 7px 0 0;
        color: #1d2939;
        font-size: 14px;
        line-height: 1.6;
      }

      .section {
        margin-top: 28px;
        padding-top: 25px;
        border-top: 1px solid #edf0f3;
      }

      .section h2 {
        margin: 0 0 17px;
        font-size: 19px;
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

      .infoBox strong {
        display: block;
        margin-top: 5px;
        font-size: 14px;
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
        font-size: 13px;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .ownerPhotoWrap {
        margin-bottom: 15px;
      }

      .ownerPhotoWrap img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        object-fit: cover;
      }

      .contactButtons {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
      }

      .primaryButton,
      .secondaryButton,
      .locationButton {
        min-height: 54px;
        padding: 0 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 900;
      }

      .primaryButton {
        background: #1465e8;
        color: white;
      }

      .secondaryButton {
        border: 1px solid #d5dae1;
        background: white;
        color: #344054;
      }

      .additionalContact {
        margin-top: 14px;
        padding: 16px;
        border-radius: 13px;
        background: #f8fafc;
      }

      .additionalContact strong,
      .additionalContact a {
        display: block;
      }

      .additionalContact strong {
        margin-top: 6px;
        font-size: 14px;
      }

      .additionalContact a {
        margin-top: 6px;
        color: #1465e8;
        text-decoration: none;
        font-size: 12px;
      }

      .locationText {
        color: #667085;
        font-size: 12px;
        line-height: 1.6;
      }

      .locationButton {
        width: 100%;
        border: 0;
        background: #1465e8;
        color: white;
        cursor: pointer;
      }

      .locationStatus {
        margin-top: 10px;
        padding: 12px;
        border-radius: 10px;
        background: #f3f7fd;
        color: #344054;
        font-size: 11px;
      }

      .centerPage {
        width: calc(100% - 24px);
        max-width: 500px;
        margin: auto;
        padding-top: 130px;
        text-align: center;
        font-family: Arial, sans-serif;
      }

      .centerLogo {
        margin: auto;
      }

      .centerPage h1 {
        color: #1465e8;
      }

      .centerPage p {
        color: #667085;
      }

      .errorBox {
        margin-top: 20px;
        padding: 14px;
        border-radius: 12px;
        background: #fff1f1;
        color: #b42318;
        font-size: 12px;
      }

      @media (max-width: 600px) {
        .content {
          padding-top: 25px;
        }

        .finderCard {
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

        .contactButtons {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
