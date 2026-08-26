"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { maskTagCode } from "@/lib/maskTagCode";

type FinderProfile = {
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

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;
  show_reward: boolean | null;
  reward: string | null;
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

    setLocationStatus("ლოკაცია მუშავდება...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;

        const { error: updateError } =
          await supabase
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
      <main className="centerPage">
        <div className="logo centerLogo">
          QR
        </div>

        <h1>QR RETURN</h1>
        <p>პროფილი იტვირთება...</p>

        <Styles />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="centerPage">
        <div className="logo centerLogo">
          QR
        </div>

        <h1>QR RETURN</h1>

        <div className="errorBox">
          {error || "პროფილი ვერ მოიძებნა."}
        </div>

        <Styles />
      </main>
    );
  }

  /*
   * ბაზაში ცხოველი ინახება ასე:
   *
   * item_type = "pet"
   * pet_type = "dog" ან "cat"
   *
   * ამიტომ ვიზუალური კატეგორია pet_type-დან
   * უნდა ავიღოთ.
   */
  const category =
    profile.item_type === "pet"
      ? profile.pet_type || "pet"
      : profile.item_type;

  const isPet =
    profile.item_type === "pet";

  const canShowPhoto =
    profile.show_photo !== false &&
    Boolean(profile.photo_url);

  const canCall =
    profile.show_owner_phone !== false &&
    profile.phone_enabled !== false &&
    Boolean(profile.owner_phone);

  const canEmail =
    profile.show_owner_email === true &&
    Boolean(profile.owner_email);

  const canWhatsApp =
    profile.whatsapp_enabled === true &&
    Boolean(profile.owner_phone);

  const whatsappPhone =
    profile.owner_phone
      ? profile.owner_phone.replace(/\D/g, "")
      : "";

  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>FOUND PROFILE</small>
            </div>
          </a>
        </header>

        <section className="content">
          <div className="finderCard">
            <div className="hero">
              {canShowPhoto ? (
                <img
                  src={profile.photo_url!}
                  alt={
                    profile.item_name ||
                    "QR RETURN Profile"
                  }
                  className="mainPhoto"
                />
              ) : (
                <div className="photoPlaceholder">
                  {getIcon(category)}
                </div>
              )}

              <div className="heroText">
                <div className="eyebrow">
                  YOU FOUND
                </div>

                <h1>
                  {profile.item_name ||
                    getCategory(category)}
                </h1>

                <div className="categoryBadge">
                  {getCategory(category)}
                </div>

                <p>
                  QR კოდი:{" "}
                  <strong>
                    {maskTagCode(profile.tag_code)}
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
                    {profile.finder_message}
                  </p>
                </div>
              )}

            {profile.show_reward === true &&
              profile.reward && (
                <div className="rewardBox">
                  <span>ჯილდო</span>
                  <strong>
                    {profile.reward}
                  </strong>
                </div>
              )}

            <section className="section">
              <div className="sectionHeading">
                <span>01</span>

                <div>
                  <small>PROFILE DETAILS</small>

                  <h2>
                    {isPet
                      ? "ცხოველის ინფორმაცია"
                      : "ნივთის ინფორმაცია"}
                  </h2>
                </div>
              </div>

              <div className="grid">
                {profile.show_colour !==
                  false &&
                  profile.colour && (
                    <Info
                      label="ფერი"
                      value={profile.colour}
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
                  profile.weight !== null && (
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
                      value={profile.brand}
                    />
                  )}

                {!isPet &&
                  profile.show_model !==
                    false &&
                  profile.model && (
                    <Info
                      label="მოდელი"
                      value={profile.model}
                    />
                  )}

                {!isPet &&
                  profile.show_size ===
                    true &&
                  profile.size && (
                    <Info
                      label="ზომა"
                      value={profile.size}
                    />
                  )}

                {!isPet &&
                  profile.show_material ===
                    true &&
                  profile.material && (
                    <Info
                      label="მასალა"
                      value={profile.material}
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
              <div className="sectionHeading">
                <span>02</span>

                <div>
                  <small>CONTACT OWNER</small>

                  <h2>
                    დაუკავშირდი მფლობელს
                  </h2>
                </div>
              </div>

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

              {profile.owner_name && (
                <div className="ownerName">
                  <span>მფლობელი</span>
                  <strong>
                    {profile.owner_name}
                  </strong>
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

                {canWhatsApp && (
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    className="secondaryButton"
                  >
                    WhatsApp
                  </a>
                )}

                {canEmail && (
                  <a
                    href={`mailto:${profile.owner_email}`}
                    className="secondaryButton"
                  >
                    ელფოსტა
                  </a>
                )}

                {profile.live_chat_enabled ===
                  true && (
                  <a
                    href="/support"
                    className="secondaryButton"
                  >
                    Live Chat
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
                        {
                          profile.additional_contact_phone
                        }
                      </a>
                    )}

                    {profile.additional_contact_email && (
                      <a
                        href={`mailto:${profile.additional_contact_email}`}
                      >
                        {
                          profile.additional_contact_email
                        }
                      </a>
                    )}
                  </div>
                )}
            </section>

            {profile.location_sharing_enabled !==
              false && (
              <section className="locationSection">
                <div className="sectionHeading">
                  <span>03</span>

                  <div>
                    <small>SHARE LOCATION</small>

                    <h2>
                      მდებარეობის გაზიარება
                    </h2>
                  </div>
                </div>

                <p>
                  სურვილის შემთხვევაში შეგიძლია
                  მფლობელს გაუზიარო შენი მიმდინარე
                  მდებარეობა.
                </p>

                <button
                  type="button"
                  onClick={shareLocation}
                  className="locationButton"
                >
                  ჩემი ლოკაციის გაზიარება
                </button>

                {locationStatus && (
                  <div className="locationStatus">
                    {locationStatus}
                  </div>
                )}
              </section>
            )}
          </div>

          <div className="privacy">
            <strong>
              QR RETURN
            </strong>

            <p>
              მპოვნელს ეჩვენება მხოლოდ ის
              ინფორმაცია, რომლის გაზიარებაც
              მფლობელს აქვს არჩეული.
            </p>
          </div>
        </section>
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
    <div className="info">
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

    case "keys":
      return "გასაღები";

    case "wallet":
      return "საფულე";

    case "bag":
      return "ჩანთა";

    case "suitcase":
      return "ჩემოდანი";

    case "pet":
      return "ცხოველი";

    default:
      return "ნივთი";
  }
}

function getIcon(type: string) {
  switch (type) {
    case "dog":
      return "🐶";

    case "cat":
      return "🐱";

    case "keys":
      return "🔑";

    case "wallet":
      return "👛";

    case "bag":
      return "👜";

    case "suitcase":
      return "🧳";

    default:
      return "📦";
  }
}

function translateSex(sex: string) {
  const value = sex.toLowerCase();

  if (
    value === "male" ||
    value === "m"
  ) {
    return "მამრობითი";
  }

  if (
    value === "female" ||
    value === "f"
  ) {
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

      html,
      body {
        margin: 0;
        padding: 0;
      }

      body {
        background: #f4f7fb;
        color: #172b43;
        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }

      a {
        text-decoration: none;
      }

      .page {
        min-height: 100vh;
      }

      .header {
        height: 70px;

        display: flex;
        align-items: center;

        padding: 0 28px;

        background: #ffffff;
        border-bottom: 1px solid #e4eaf1;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        width: 39px;
        height: 39px;

        display: grid;
        place-items: center;

        border-radius: 10px;

        color: #ffffff;
        background: #1266e9;

        font-size: 10px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #172b43;
        font-size: 14px;
      }

      .brand small {
        margin-top: 3px;

        color: #8b98a7;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: 1.1px;
      }

      .content {
        width: calc(100% - 30px);
        max-width: 720px;

        margin: 0 auto;
        padding: 38px 0 60px;
      }

      .finderCard {
        overflow: hidden;

        border: 1px solid #e0e7ef;
        border-radius: 22px;

        background: #ffffff;

        box-shadow:
          0 18px 60px
          rgba(22, 48, 78, 0.07);
      }

      .hero {
        padding: 32px;

        display: flex;
        align-items: center;
        gap: 24px;

        border-bottom: 1px solid #e8edf3;
      }

      .mainPhoto,
      .photoPlaceholder {
        width: 118px;
        height: 118px;

        flex: 0 0 118px;

        border-radius: 20px;
      }

      .mainPhoto {
        object-fit: cover;
      }

      .photoPlaceholder {
        display: grid;
        place-items: center;

        background: #edf5ff;

        font-size: 48px;
      }

      .eyebrow {
        color: #1266e9;

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .heroText h1 {
        margin: 7px 0 8px;

        color: #172b43;

        font-size: 31px;
        line-height: 1.1;
      }

      .categoryBadge {
        display: inline-flex;

        padding: 6px 10px;

        border-radius: 20px;

        color: #1266e9;
        background: #edf5ff;

        font-size: 10px;
        font-weight: 800;
      }

      .heroText p {
        margin: 11px 0 0;

        color: #7c8998;
        font-size: 11px;
      }

      .heroText p strong {
        color: #42556b;
      }

      .messageBox {
        margin: 24px 30px 0;
        padding: 20px;

        border: 1px solid #dbe8fb;
        border-radius: 15px;

        background: #f5f9ff;
      }

      .messageBox span,
      .rewardBox span {
        display: block;

        color: #1266e9;

        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .messageBox p {
        margin: 8px 0 0;

        color: #34485f;

        font-size: 13px;
        line-height: 1.65;
      }

      .rewardBox {
        margin: 13px 30px 0;
        padding: 17px 20px;

        border-radius: 13px;

        background: #f6f8fb;
      }

      .rewardBox strong {
        display: block;

        margin-top: 5px;

        color: #172b43;
        font-size: 17px;
      }

      .section,
      .locationSection {
        padding: 30px;

        border-bottom: 1px solid #e8edf3;
      }

      .sectionHeading {
        display: flex;
        align-items: flex-start;
        gap: 13px;

        margin-bottom: 20px;
      }

      .sectionHeading > span {
        width: 28px;
        height: 28px;

        display: grid;
        place-items: center;

        border-radius: 8px;

        color: #1266e9;
        background: #edf5ff;

        font-size: 9px;
        font-weight: 900;
      }

      .sectionHeading small {
        display: block;

        color: #9aa6b4;

        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .sectionHeading h2 {
        margin: 3px 0 0;

        color: #20354e;

        font-size: 17px;
      }

      .grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 10px;
      }

      .info {
        padding: 15px;

        border: 1px solid #e4eaf1;
        border-radius: 12px;

        background: #fbfcfe;
      }

      .info span,
      .longInfo span,
      .ownerName span,
      .additionalContact > span {
        display: block;

        color: #8996a5;

        font-size: 9px;
        font-weight: 800;
      }

      .info strong {
        display: block;

        margin-top: 5px;

        color: #263a52;

        font-size: 12px;
      }

      .longInfo {
        margin-top: 10px;
        padding: 16px;

        border: 1px solid #e4eaf1;
        border-radius: 12px;
      }

      .longInfo p {
        margin: 7px 0 0;

        color: #53657a;

        font-size: 12px;
        line-height: 1.6;
      }

      .ownerPhotoWrap {
        margin-bottom: 15px;
      }

      .ownerPhotoWrap img {
        width: 60px;
        height: 60px;

        object-fit: cover;

        border-radius: 50%;
      }

      .ownerName {
        margin-bottom: 14px;
      }

      .ownerName strong {
        display: block;

        margin-top: 4px;

        color: #263a52;
        font-size: 13px;
      }

      .contactButtons {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 9px;
      }

      .primaryButton,
      .secondaryButton {
        min-height: 45px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0 14px;

        border-radius: 11px;

        font-size: 11px;
        font-weight: 850;
      }

      .primaryButton {
        color: #ffffff;
        background: #1266e9;
      }

      .secondaryButton {
        color: #1266e9;
        background: #f1f6fd;

        border: 1px solid #dbe7f7;
      }

      .additionalContact {
        margin-top: 16px;
        padding: 16px;

        border-radius: 12px;

        background: #f7f9fc;
      }

      .additionalContact strong,
      .additionalContact a {
        display: block;

        margin-top: 6px;

        color: #263a52;

        font-size: 11px;
      }

      .locationSection {
        border-bottom: 0;
      }

      .locationSection > p {
        margin: -5px 0 17px;

        color: #6f7e8e;

        font-size: 12px;
        line-height: 1.6;
      }

      .locationButton {
        min-height: 45px;

        padding: 0 17px;

        border: 0;
        border-radius: 11px;

        color: #ffffff;
        background: #1266e9;

        font-size: 11px;
        font-weight: 850;

        cursor: pointer;
      }

      .locationStatus {
        margin-top: 12px;

        color: #53657a;

        font-size: 10px;
      }

      .privacy {
        padding: 19px 20px;

        text-align: center;
      }

      .privacy strong {
        color: #1266e9;

        font-size: 9px;
        letter-spacing: 1px;
      }

      .privacy p {
        max-width: 420px;

        margin: 6px auto 0;

        color: #98a4b1;

        font-size: 9px;
        line-height: 1.5;
      }

      .centerPage {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 25px;

        text-align: center;

        background: #f4f7fb;
      }

      .centerLogo {
        margin-bottom: 12px;
      }

      .centerPage h1 {
        margin: 0;

        color: #172b43;

        font-size: 25px;
      }

      .centerPage p {
        color: #7c8998;
        font-size: 12px;
      }

      .errorBox {
        margin-top: 15px;
        padding: 14px 18px;

        border-radius: 11px;

        color: #53657a;
        background: #ffffff;

        border: 1px solid #e2e8ef;

        font-size: 12px;
      }

      @media (max-width: 600px) {
        .header {
          height: 62px;
          padding: 0 16px;
        }

        .content {
          width: calc(100% - 20px);
          padding-top: 18px;
        }

        .finderCard {
          border-radius: 17px;
        }

        .hero {
          padding: 22px;

          align-items: flex-start;
          gap: 16px;
        }

        .mainPhoto,
        .photoPlaceholder {
          width: 88px;
          height: 88px;

          flex-basis: 88px;

          border-radius: 16px;
        }

        .photoPlaceholder {
          font-size: 37px;
        }

        .heroText h1 {
          font-size: 25px;
        }

        .messageBox,
        .rewardBox {
          margin-left: 20px;
          margin-right: 20px;
        }

        .section,
        .locationSection {
          padding: 24px 20px;
        }

        .grid,
        .contactButtons {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
