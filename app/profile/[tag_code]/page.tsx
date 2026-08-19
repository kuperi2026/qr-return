"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Profile = {
  id: string;
  tag_code: string;

  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;

  photo: string | null;
  colour: string | null;
  description: string | null;

  sex: string | null;
  date_of_birth: string | null;
  weight: string | null;
  medical_info: string | null;
  behaviour_note: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  owner_address: string | null;
  owner_photo: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

  finder_message: string | null;

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;
  location_sharing_enabled: boolean | null;

  show_owner_name: boolean | null;
  show_owner_phone: boolean | null;
  show_owner_email: boolean | null;
  show_owner_address: boolean | null;
  show_owner_photo: boolean | null;

  show_photo: boolean | null;
  show_colour: boolean | null;
  show_description: boolean | null;

  show_sex: boolean | null;
  show_date_of_birth: boolean | null;
  show_weight: boolean | null;
  show_medical_info: boolean | null;
  show_behaviour_note: boolean | null;

  show_brand: boolean | null;
  show_model: boolean | null;
  show_size: boolean | null;
  show_material: boolean | null;
  show_distinctive_features: boolean | null;

  show_additional_contact: boolean | null;
  show_finder_message: boolean | null;

  active: boolean | null;
};

export default function PublicProfilePage() {
  const params = useParams();

  const rawTag = Array.isArray(params.tag_code)
    ? params.tag_code[0]
    : params.tag_code;

  const tagCode =
    typeof rawTag === "string"
      ? decodeURIComponent(rawTag)
      : "";

  const [lang, setLang] = useState<Lang>("ka");
  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const ka = lang === "ka";

  const isPet = useMemo(() => {
    if (!profile) return false;

    return (
      profile.item_type === "pet" ||
      profile.pet_type === "dog" ||
      profile.pet_type === "cat"
    );
  }, [profile]);

  useEffect(() => {
    void loadProfile();
  }, [tagCode]);

  async function loadProfile() {
    if (!tagCode) {
      setError(
        ka
          ? "QR კოდი ვერ მოიძებნა."
          : "QR code not found."
      );

      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: loadError } = await supabase
        .from("item")
        .select("*")
        .eq("tag_code", tagCode)
        .maybeSingle();

      if (loadError) {
        throw loadError;
      }

      if (!data) {
        setError(
          ka
            ? "ამ QR კოდზე პროფილი ვერ მოიძებნა."
            : "No profile was found for this QR code."
        );

        return;
      }

      setProfile(data as Profile);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function shareLocation() {
    if (!profile || !profile.location_sharing_enabled) {
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage(
        ka
          ? "თქვენი მოწყობილობა ლოკაციის გაზიარებას არ უჭერს მხარს."
          : "Your device does not support location sharing."
      );

      return;
    }

    setLocationLoading(true);
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const {
            latitude,
            longitude,
            accuracy,
          } = position.coords;

          const { error: updateError } = await supabase
            .from("item")
            .update({
              last_scan_latitude: latitude,
              last_scan_longitude: longitude,
              last_scan_accuracy: accuracy,
              last_scanned_at: new Date().toISOString(),
            })
            .eq("id", profile.id)
            .eq("tag_code", profile.tag_code);

          if (updateError) {
            throw updateError;
          }

          setLocationMessage(
            ka
              ? "✓ ლოკაცია წარმატებით გაეგზავნა მფლობელს."
              : "✓ Location shared successfully with the owner."
          );
        } catch (err) {
          setLocationMessage(
            err instanceof Error
              ? err.message
              : ka
              ? "ლოკაციის გაზიარება ვერ მოხერხდა."
              : "Could not share location."
          );
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocationLoading(false);

        setLocationMessage(
          ka
            ? "ლოკაციაზე წვდომა არ მოგიციათ."
            : "Location permission was not granted."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  function typeInfo() {
    if (!profile) {
      return {
        icon: "🏷️",
        ka: "QR პროფილი",
        en: "QR Profile",
        chatType: "profile",
      };
    }

    if (profile.pet_type === "dog") {
      return {
        icon: "🐶",
        ka: "ძაღლი",
        en: "Dog",
        chatType: "dog",
      };
    }

    if (profile.pet_type === "cat") {
      return {
        icon: "🐱",
        ka: "კატა",
        en: "Cat",
        chatType: "cat",
      };
    }

    if (profile.item_type === "keys") {
      return {
        icon: "🔑",
        ka: "გასაღები",
        en: "Keys",
        chatType: "key",
      };
    }

    if (profile.item_type === "wallet") {
      return {
        icon: "👛",
        ka: "საფულე",
        en: "Wallet",
        chatType: "wallet",
      };
    }

    if (profile.item_type === "bag") {
      return {
        icon: "👜",
        ka: "ჩანთა",
        en: "Bag",
        chatType: "bag",
      };
    }

    if (profile.item_type === "suitcase") {
      return {
        icon: "🧳",
        ka: "ჩემოდანი",
        en: "Suitcase",
        chatType: "suitcase",
      };
    }

    return {
      icon: "🏷️",
      ka: "QR პროფილი",
      en: "QR Profile",
      chatType: "profile",
    };
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <h1>QR RETURN</h1>

        <p>
          {ka
            ? "იტვირთება..."
            : "Loading..."}
        </p>

        <Styles />
      </main>
    );
  }

  if (!profile || error) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <h1>QR RETURN</h1>

        <div className="errorBox">
          {error ||
            (ka
              ? "პროფილი ვერ მოიძებნა."
              : "Profile not found.")}
        </div>

        <a
          href="/"
          className="homeButton"
        >
          {ka
            ? "მთავარ გვერდზე დაბრუნება"
            : "Back to home"}
        </a>

        <Styles />
      </main>
    );
  }

  const type = typeInfo();

  const lost = Boolean(
    profile.active
  );

  const cleanPhone =
    profile.owner_phone?.replace(
      /[^\d+]/g,
      ""
    ) ?? "";

  const whatsappPhone =
    profile.owner_phone?.replace(
      /\D/g,
      ""
    ) ?? "";

  const additionalCleanPhone =
    profile.additional_contact_phone?.replace(
      /[^\d+]/g,
      ""
    ) ?? "";

  const finderChatUrl =
    `/chat/${type.chatType}/${encodeURIComponent(
      profile.tag_code
    )}`;

  return (
    <main className="page">
      <header className="header">
        <a
          href="/"
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              FINDER VIEW
            </small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={
              ka
                ? "active"
                : ""
            }
            onClick={() =>
              setLang("ka")
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              !ka
                ? "active"
                : ""
            }
            onClick={() =>
              setLang("en")
            }
          >
            ENG
          </button>
        </div>
      </header>

      <section className="container">
        <div className="profileCard">
          <section className="hero">
            <div className="mainPhotoWrap">
              {profile.photo &&
              profile.show_photo !== false ? (
                <img
                  src={profile.photo}
                  alt={
                    profile.item_name ??
                    ""
                  }
                  className="mainPhoto"
                />
              ) : (
                <div className="photoPlaceholder">
                  {type.icon}
                </div>
              )}

              <div
                className={`status ${
                  lost
                    ? "lost"
                    : "safe"
                }`}
              >
                {lost
                  ? ka
                    ? "დაკარგულია"
                    : "LOST"
                  : ka
                  ? "უსაფრთხოდ არის"
                  : "SAFE"}
              </div>
            </div>

            <div className="heroInfo">
              <div className="eyebrow">
                QR RETURN PROFILE
              </div>

              <h1>
                {profile.item_name ||
                  (ka
                    ? type.ka
                    : type.en)}
              </h1>

              <div className="category">
                {type.icon}{" "}
                {ka
                  ? type.ka
                  : type.en}
              </div>

              <div className="tagCode">
                QR ·{" "}
                {profile.tag_code}
              </div>
            </div>
          </section>

          {!lost && (
            <section className="safeNotice">
              <div className="safeIcon">
                ✓
              </div>

              <div>
                <strong>
                  {ka
                    ? "ეს პროფილი დაკარგულად არ არის მონიშნული"
                    : "This profile is not marked as lost"}
                </strong>

                <p>
                  {ka
                    ? "ძირითადი ინფორმაცია შეგიძლიათ ნახოთ, თუმცა საკონტაქტო მოქმედებები მხოლოდ Lost Mode-ის დროს აქტიურდება."
                    : "Basic profile information is available, but contact actions are enabled only when Lost Mode is active."}
                </p>
              </div>
            </section>
          )}

          <section className="section">
            <SectionTitle
              number="01"
              title={
                ka
                  ? "მფლობელი"
                  : "Owner"
              }
            />

            <div className="ownerCard">
              {profile.show_owner_photo &&
              profile.owner_photo ? (
                <img
                  src={
                    profile.owner_photo
                  }
                  alt=""
                  className="ownerPhoto"
                />
              ) : (
                <div className="ownerPlaceholder">
                  👤
                </div>
              )}

              <div className="ownerInfo">
                <strong>
                  {profile.owner_name ||
                    (ka
                      ? "მფლობელი"
                      : "Owner")}
                </strong>

                {profile.owner_phone && (
                  <p>
                    📞{" "}
                    {profile.owner_phone}
                  </p>
                )}

                {profile.show_owner_email &&
                  profile.owner_email && (
                    <p>
                      ✉️{" "}
                      {profile.owner_email}
                    </p>
                  )}

                {profile.show_owner_address &&
                  profile.owner_address && (
                    <p>
                      📍{" "}
                      {profile.owner_address}
                    </p>
                  )}
              </div>
            </div>
          </section>

          <section className="section">
            <SectionTitle
              number="02"
              title={
                isPet
                  ? ka
                    ? "ცხოველის ინფორმაცია"
                    : "Pet information"
                  : ka
                  ? "ნივთის ინფორმაცია"
                  : "Item information"
              }
            />

            <div className="infoGrid">
              {profile.show_colour !== false &&
                profile.colour && (
                  <Info
                    label={
                      ka
                        ? "ფერი"
                        : "Color"
                    }
                    value={
                      profile.colour
                    }
                  />
                )}

              {isPet &&
                profile.show_sex !== false &&
                profile.sex && (
                  <Info
                    label={
                      ka
                        ? "სქესი"
                        : "Sex"
                    }
                    value={
                      profile.sex ===
                      "male"
                        ? ka
                          ? "მამრობითი"
                          : "Male"
                        : profile.sex ===
                          "female"
                        ? ka
                          ? "მდედრობითი"
                          : "Female"
                        : profile.sex
                    }
                  />
                )}

              {isPet &&
                profile.show_date_of_birth !==
                  false &&
                profile.date_of_birth && (
                  <Info
                    label={
                      ka
                        ? "დაბადების თარიღი"
                        : "Date of birth"
                    }
                    value={
                      profile.date_of_birth
                    }
                  />
                )}

              {isPet &&
                profile.show_weight !==
                  false &&
                profile.weight && (
                  <Info
                    label={
                      ka
                        ? "წონა"
                        : "Weight"
                    }
                    value={
                      profile.weight
                    }
                  />
                )}

              {!isPet &&
                profile.show_brand !==
                  false &&
                profile.brand && (
                  <Info
                    label={
                      ka
                        ? "ბრენდი"
                        : "Brand"
                    }
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
                    label={
                      ka
                        ? "მოდელი"
                        : "Model"
                    }
                    value={
                      profile.model
                    }
                  />
                )}

              {!isPet &&
                profile.show_size !==
                  false &&
                profile.size && (
                  <Info
                    label={
                      ka
                        ? "ზომა"
                        : "Size"
                    }
                    value={
                      profile.size
                    }
                  />
                )}

              {!isPet &&
                profile.show_material !==
                  false &&
                profile.material && (
                  <Info
                    label={
                      ka
                        ? "მასალა"
                        : "Material"
                    }
                    value={
                      profile.material
                    }
                  />
                )}
            </div>

            {isPet &&
              profile.show_medical_info !==
                false &&
              profile.medical_info && (
                <LongInfo
                  label={
                    ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical information"
                  }
                  value={
                    profile.medical_info
                  }
                />
              )}

            {isPet &&
              profile.show_behaviour_note !==
                false &&
              profile.behaviour_note && (
                <LongInfo
                  label={
                    ka
                      ? "ქცევის შესახებ ინფორმაცია"
                      : "Behaviour information"
                  }
                  value={
                    profile.behaviour_note
                  }
                />
              )}

            {!isPet &&
              profile.show_distinctive_features !==
                false &&
              profile.distinctive_features && (
                <LongInfo
                  label={
                    ka
                      ? "განსაკუთრებული ნიშნები"
                      : "Distinctive features"
                  }
                  value={
                    profile.distinctive_features
                  }
                />
              )}

            {profile.show_description !==
              false &&
              profile.description && (
                <LongInfo
                  label={
                    ka
                      ? "აღწერა"
                      : "Description"
                  }
                  value={
                    profile.description
                  }
                />
              )}
          </section>

          {profile.show_finder_message !==
            false &&
            profile.finder_message && (
              <section className="section">
                <SectionTitle
                  number="03"
                  title={
                    ka
                      ? "მპოვნელისთვის შეტყობინება"
                      : "Message for the finder"
                  }
                />

                <div className="finderMessage">
                  “
                  {
                    profile.finder_message
                  }
                  ”
                </div>
              </section>
            )}

          {profile.show_additional_contact &&
            (profile.additional_contact_name ||
              profile.additional_contact_phone ||
              profile.additional_contact_email) && (
              <section className="section">
                <SectionTitle
                  number="04"
                  title={
                    ka
                      ? "დამატებითი საკონტაქტო პირი"
                      : "Additional contact"
                  }
                />

                <div className="additionalCard">
                  {profile.additional_contact_name && (
                    <p>
                      👤{" "}
                      {
                        profile.additional_contact_name
                      }
                    </p>
                  )}

                  {profile.additional_contact_phone && (
                    <p>
                      📞{" "}
                      {
                        profile.additional_contact_phone
                      }
                    </p>
                  )}

                  {profile.additional_contact_email && (
                    <p>
                      ✉️{" "}
                      {
                        profile.additional_contact_email
                      }
                    </p>
                  )}

                  {lost &&
                    profile.additional_contact_phone && (
                      <a
                        href={`tel:${additionalCleanPhone}`}
                      >
                        {ka
                          ? "დარეკვა დამატებით კონტაქტთან"
                          : "Call additional contact"}
                      </a>
                    )}
                </div>
              </section>
            )}

          {lost && (
            <section className="section">
              <SectionTitle
                number="05"
                title={
                  ka
                    ? "დაუკავშირდით მფლობელს"
                    : "Contact the owner"
                }
              />

              <div className="contactGrid">
                {profile.phone_enabled &&
                  profile.owner_phone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="contactButton phone"
                    >
                      <span>
                        📞
                      </span>

                      <div>
                        <small>
                          {ka
                            ? "მობილური"
                            : "Mobile"}
                        </small>

                        <strong>
                          {ka
                            ? "დარეკვა"
                            : "Call"}
                        </strong>
                      </div>
                    </a>
                  )}

                {profile.whatsapp_enabled &&
                  whatsappPhone && (
                    <a
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contactButton whatsapp"
                    >
                      <span>
                        💬
                      </span>

                      <div>
                        <small>
                          WhatsApp
                        </small>

                        <strong>
                          {ka
                            ? "დაკავშირება"
                            : "Open"}
                        </strong>
                      </div>
                    </a>
                  )}

                {profile.live_chat_enabled && (
                  <a
                    href={
                      finderChatUrl
                    }
                    className="contactButton chat"
                  >
                    <span>
                      💬
                    </span>

                    <div>
                      <small>
                        QR RETURN
                      </small>

                      <strong>
                        Live Chat
                      </strong>
                    </div>
                  </a>
                )}
              </div>
            </section>
          )}

          {lost &&
            profile.location_sharing_enabled && (
              <section className="section">
                <SectionTitle
                  number="06"
                  title={
                    ka
                      ? "ლოკაციის გაზიარება"
                      : "Share location"
                  }
                />

                <div className="locationCard">
                  <div className="locationIcon">
                    📍
                  </div>

                  <div className="locationText">
                    <strong>
                      {ka
                        ? "გაუზიარეთ თქვენი ლოკაცია მფლობელს"
                        : "Share your location with the owner"}
                    </strong>

                    <p>
                      {ka
                        ? "ერთი ღილაკით გაუგზავნეთ მფლობელს ადგილი, სადაც QR კოდი დაასკანერეთ."
                        : "Send the location where you scanned this QR code."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      shareLocation
                    }
                    disabled={
                      locationLoading
                    }
                  >
                    {locationLoading
                      ? ka
                        ? "იგზავნება..."
                        : "Sharing..."
                      : ka
                      ? "გაზიარება"
                      : "Share"}
                  </button>
                </div>

                {locationMessage && (
                  <div
                    className={`locationMessage ${
                      locationMessage.startsWith(
                        "✓"
                      )
                        ? "success"
                        : ""
                    }`}
                  >
                    {
                      locationMessage
                    }
                  </div>
                )}
              </section>
            )}

          <div className="privacyBox">
            <span>
              🔒
            </span>

            <div>
              <strong>
                {ka
                  ? "მფლობელი თავად აკონტროლებს ხილვადობას"
                  : "Visibility is controlled by the owner"}
              </strong>

              <p>
                {ka
                  ? "QR RETURN აჩვენებს მხოლოდ იმ დამატებით ინფორმაციას, რომლის გაზიარებაც მფლობელმა ჩართო."
                  : "QR RETURN shows only the additional information the owner has chosen to share."}
              </p>
            </div>
          </div>

          <footer>
            <div>
              <strong>
                QR RETURN
              </strong>

              <span>
                {ka
                  ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
                  : "Never lose what matters."}
              </span>
            </div>

            <a href="/">
              {ka
                ? "მთავარი გვერდი"
                : "Home"}{" "}
              →
            </a>
          </footer>
        </div>
      </section>

      <Styles />
    </main>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="sectionTitle">
      <span>
        {number}
      </span>

      <h2>
        {title}
      </h2>
    </div>
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
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
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
      <span>
        {label}
      </span>

      <p>
        {value}
      </p>
    </div>
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px;
        text-align: center;
      }

      .statePage .logo {
        margin-bottom: 10px;
      }

      .statePage h1 {
        margin: 0;
        color: #1465e8;
      }

      .statePage p {
        color: #667085;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 900px;
        min-height: 82px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        text-decoration: none;
      }

      .logo {
        width: 48px;
        height: 48px;
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
        font-size: 20px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 2px;
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
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
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 780px;
        margin: auto;
        padding: 38px 0 70px;
      }

      .profileCard {
        padding: 30px;
        border: 1px solid #e4e7ec;
        border-radius: 26px;
        background: white;
        box-shadow: 0 22px 60px rgba(16, 24, 40, 0.08);
      }

      .hero {
        display: flex;
        align-items: center;
        gap: 25px;
      }

      .mainPhotoWrap {
        width: 175px;
        height: 175px;
        flex: 0 0 175px;
        position: relative;
      }

      .mainPhoto,
      .photoPlaceholder {
        width: 100%;
        height: 100%;
        border-radius: 22px;
      }

      .mainPhoto {
        object-fit: cover;
      }

      .photoPlaceholder {
        display: grid;
        place-items: center;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f0edff
        );
        font-size: 60px;
      }

      .status {
        position: absolute;
        left: 12px;
        bottom: 12px;
        padding: 7px 10px;
        border-radius: 999px;
        font-size: 9px;
        font-weight: 900;
      }

      .status.safe {
        background: rgba(236, 253, 243, 0.95);
        color: #027a48;
      }

      .status.lost {
        background: rgba(255, 241, 240, 0.95);
        color: #b42318;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .heroInfo h1 {
        margin: 8px 0 10px;
        font-size: 37px;
        line-height: 1.05;
      }

      .category {
        width: fit-content;
        padding: 7px 11px;
        border-radius: 999px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 11px;
        font-weight: 900;
      }

      .tagCode {
        margin-top: 10px;
        color: #98a2b3;
        font-size: 10px;
      }

      .safeNotice {
        margin-top: 27px;
        padding: 17px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border: 1px solid #abefc6;
        border-radius: 15px;
        background: #ecfdf3;
      }

      .safeIcon {
        width: 34px;
        height: 34px;
        flex: 0 0 34px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #12b76a;
        color: white;
        font-weight: 900;
      }

      .safeNotice strong {
        color: #027a48;
        font-size: 13px;
      }

      .safeNotice p {
        margin: 5px 0 0;
        color: #475467;
        font-size: 11px;
        line-height: 1.55;
      }

      .section {
        margin-top: 29px;
        padding-top: 27px;
        border-top: 1px solid #eaecf0;
      }

      .sectionTitle {
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sectionTitle span {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .sectionTitle h2 {
        margin: 0;
        font-size: 20px;
      }

      .ownerCard {
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px solid #eaecf0;
        border-radius: 14px;
        background: #fafbfc;
      }

      .ownerPhoto,
      .ownerPlaceholder {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        border-radius: 15px;
      }

      .ownerPhoto {
        object-fit: cover;
      }

      .ownerPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 26px;
      }

      .ownerInfo p {
        margin: 4px 0;
        color: #475467;
        font-size: 11px;
      }

      .infoGrid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 11px;
      }

      .infoBox {
        padding: 14px;
        border: 1px solid #eaecf0;
        border-radius: 12px;
        background: #fafbfc;
      }

      .infoBox span,
      .longInfo span {
        display: block;
        margin-bottom: 5px;
        color: #98a2b3;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .infoBox strong {
        color: #344054;
        font-size: 13px;
      }

      .longInfo {
        margin-top: 11px;
        padding: 14px;
        border: 1px solid #eaecf0;
        border-radius: 12px;
        background: #fafbfc;
      }

      .longInfo p {
        margin: 0;
        color: #475467;
        font-size: 12px;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .finderMessage {
        padding: 17px;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f0edff
        );
        color: #344054;
        font-size: 13px;
        line-height: 1.7;
      }

      .additionalCard {
        padding: 16px;
        border: 1px solid #eaecf0;
        border-radius: 14px;
        background: #fafbfc;
      }

      .additionalCard p {
        margin: 6px 0;
        font-size: 11px;
      }

      .additionalCard a {
        margin-top: 10px;
        display: inline-flex;
        padding: 10px 13px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .contactGrid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .contactButton {
        min-height: 76px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 14px;
        color: white;
        text-decoration: none;
      }

      .contactButton > span {
        font-size: 22px;
      }

      .contactButton small,
      .contactButton strong {
        display: block;
      }

      .contactButton small {
        opacity: 0.8;
        font-size: 8px;
      }

      .contactButton strong {
        margin-top: 2px;
        font-size: 11px;
      }

      .phone {
        background: #1465e8;
      }

      .whatsapp {
        background: #16a765;
      }

      .chat {
        background: linear-gradient(
          135deg,
          #7655f7,
          #5635da
        );
      }

      .locationCard {
        padding: 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #dbe7ff;
        border-radius: 14px;
        background: #f5f9ff;
      }

      .locationIcon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: white;
        font-size: 21px;
      }

      .locationText {
        flex: 1;
      }

      .locationText strong {
        font-size: 12px;
      }

      .locationText p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
      }

      .locationCard button {
        min-height: 40px;
        padding: 0 13px;
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .locationCard button:disabled {
        opacity: 0.65;
      }

      .locationMessage {
        margin-top: 10px;
        padding: 10px;
        border-radius: 9px;
        background: #fff1f0;
        color: #b42318;
        font-size: 10px;
      }

      .locationMessage.success {
        background: #ecfdf3;
        color: #027a48;
      }

      .privacyBox {
        margin-top: 28px;
        padding: 15px;
        display: flex;
        gap: 11px;
        border-radius: 13px;
        background: #f2f4f7;
      }

      .privacyBox strong {
        font-size: 11px;
      }

      .privacyBox p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
      }

      footer {
        margin-top: 27px;
        padding-top: 19px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eaecf0;
      }

      footer strong,
      footer span {
        display: block;
      }

      footer strong {
        color: #1465e8;
        font-size: 12px;
      }

      footer span {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 9px;
      }

      footer a {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .errorBox {
        padding: 13px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 12px;
      }

      .homeButton {
        margin-top: 15px;
        padding: 11px 15px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 11px;
        font-weight: 900;
        text-decoration: none;
      }

      @media (max-width: 700px) {
        .profileCard {
          padding: 21px;
        }

        .hero {
          align-items: flex-start;
          flex-direction: column;
        }

        .mainPhotoWrap {
          width: 100%;
          height: 290px;
          flex: none;
        }

        .contactGrid {
          grid-template-columns: 1fr;
        }

        .locationCard {
          align-items: stretch;
          flex-direction: column;
        }

        .locationCard button {
          width: 100%;
        }

        .infoGrid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 480px) {
        .container {
          width: calc(100% - 16px);
          padding-top: 25px;
        }

        .profileCard {
          padding: 17px;
        }

        .mainPhotoWrap {
          height: 250px;
        }
      }
    `}</style>
  );
}
