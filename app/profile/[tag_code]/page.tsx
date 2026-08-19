"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ItemProfile = {
  id: string;
  tag_code: string;

  item_type: string | null;
  pet_type: string | null;
  item_name: string | null;

  colour: string | null;
  sex: string | null;
  date_of_birth: string | null;
  weight: string | number | null;
  medical_info: string | null;
  behaviour_note: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;
  description: string | null;

  photo: string | null;
  photo_url: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;

  owner_photo: string | null;
  owner_photo_url: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

  finder_message: string | null;
  lost_seen_location: string | null;

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;
  location_sharing_enabled: boolean | null;

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

  const [lang, setLang] = useState<Lang>("ka");
  const [profile, setProfile] = useState<ItemProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    loadProfile();
  }, [tagCode]);

  async function loadProfile() {
    setLoading(true);
    setError("");

    if (!tagCode) {
      setError(
        ka
          ? "QR კოდი ვერ მოიძებნა."
          : "QR code was not found."
      );

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
        throw fetchError;
      }

      if (!data) {
        setError(
          ka
            ? "ამ QR კოდზე პროფილი არ მოიძებნა."
            : "No profile was found for this QR code."
        );

        return;
      }

      setProfile(data as ItemProfile);
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
    if (!profile || locationLoading) return;

    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage(
        ka
          ? "თქვენი მოწყობილობა ლოკაციის გაზიარებას არ უჭერს მხარს."
          : "Your device does not support location sharing."
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;

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
        setLocationMessage(
          ka
            ? "ლოკაციაზე წვდომა არ მოგიციათ."
            : "Location permission was not granted."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>

        <h1>QR RETURN</h1>

        <p>
          {ka ? "პროფილი იტვირთება..." : "Loading profile..."}
        </p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>

        <h1>QR RETURN</h1>

        <div className="errorBox">
          {error ||
            (ka
              ? "პროფილი ვერ მოიძებნა."
              : "Profile not found.")}
        </div>

        <a href="/" className="homeButton">
          {ka ? "მთავარ გვერდზე დაბრუნება" : "Back to home"}
        </a>
      </main>
    );
  }

  const isPet =
    profile.item_type === "pet" ||
    profile.pet_type === "dog" ||
    profile.pet_type === "cat" ||
    profile.item_type === "dog" ||
    profile.item_type === "cat";

  const realType = getRealType(profile);

  const profilePhoto =
    profile.photo ||
    profile.photo_url ||
    null;

  const ownerPhoto =
    profile.owner_photo ||
    profile.owner_photo_url ||
    null;

  const lost = profile.active === true;

  const cleanPhone =
    profile.owner_phone?.replace(/[^\d+]/g, "") || "";

  const whatsappPhone =
    profile.owner_phone?.replace(/\D/g, "") || "";

  const showPhone =
    lost &&
    profile.phone_enabled === true &&
    Boolean(profile.owner_phone);

  const showWhatsApp =
    lost &&
    profile.whatsapp_enabled === true &&
    Boolean(whatsappPhone);

  const showChat =
    lost &&
    profile.live_chat_enabled === true;

  const chatType = normalizeChatType(realType);

  const hasContact =
    showPhone ||
    showWhatsApp ||
    showChat;

  const showFinderMessage =
    lost &&
    Boolean(profile.finder_message) &&
    profile.show_finder_message !== false;

  const showLastSeen =
    lost &&
    Boolean(profile.lost_seen_location) &&
    profile.show_lost_seen_location !== false;

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>FOUND PROFILE</small>
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

      <section className="container">
        <div className="profileCard">
          <section className="hero">
            <div className="photoWrapper">
              {profilePhoto && profile.show_photo !== false ? (
                <img
                  src={profilePhoto}
                  alt={profile.item_name || "QR profile"}
                  className="mainPhoto"
                />
              ) : (
                <div className="photoPlaceholder">
                  {getIcon(realType)}
                </div>
              )}

              <div
                className={`statusBadge ${
                  lost ? "lost" : "safe"
                }`}
              >
                <span />

                {lost
                  ? ka
                    ? "დაკარგულია"
                    : "LOST"
                  : ka
                  ? "უსაფრთხოდ არის"
                  : "SAFE"}
              </div>
            </div>

            <div className="heroText">
              <div className="eyebrow">
                QR RETURN PROFILE
              </div>

              <h1>
                {profile.item_name ||
                  getCategory(realType, lang)}
              </h1>

              <div className="category">
                {getIcon(realType)}{" "}
                {getCategory(realType, lang)}
              </div>

              <p className="tagCode">
                QR: <strong>{profile.tag_code}</strong>
              </p>
            </div>
          </section>

          {!lost && (
            <section className="safeNotice">
              <div className="safeNoticeIcon">✓</div>

              <div>
                <strong>
                  {ka
                    ? "ეს პროფილი დაკარგულად არ არის მონიშნული"
                    : "This profile is not marked as lost"}
                </strong>

                <p>
                  {ka
                    ? "მფლობელის საკონტაქტო ინფორმაცია დაცულია. თუ ფიქრობთ, რომ ეს ნივთი ან ცხოველი დაკარგულია, შეინახეთ QR კოდი და სცადეთ მოგვიანებით."
                    : "The owner's contact information is protected. If you believe this item or pet is lost, save the QR code and try again later."}
                </p>
              </div>
            </section>
          )}

          <section className="section">
            <div className="sectionTitle">
              <span>01</span>

              <h2>
                {isPet
                  ? ka
                    ? "ცხოველის ინფორმაცია"
                    : "Pet information"
                  : ka
                  ? "ნივთის ინფორმაცია"
                  : "Item information"}
              </h2>
            </div>

            <div className="infoGrid">
              {profile.colour &&
                profile.show_colour !== false && (
                  <Info
                    label={ka ? "ფერი" : "Color"}
                    value={profile.colour}
                  />
                )}

              {isPet &&
                profile.sex &&
                profile.show_sex !== false && (
                  <Info
                    label={ka ? "სქესი" : "Sex"}
                    value={translateSex(profile.sex, lang)}
                  />
                )}

              {isPet &&
                profile.date_of_birth &&
                profile.show_date_of_birth !== false && (
                  <Info
                    label={
                      ka
                        ? "დაბადების თარიღი"
                        : "Date of birth"
                    }
                    value={profile.date_of_birth}
                  />
                )}

              {isPet &&
                profile.weight !== null &&
                profile.weight !== undefined &&
                profile.show_weight !== false && (
                  <Info
                    label={ka ? "წონა" : "Weight"}
                    value={`${profile.weight}`}
                  />
                )}

              {!isPet &&
                profile.brand &&
                profile.show_brand !== false && (
                  <Info
                    label={ka ? "ბრენდი" : "Brand"}
                    value={profile.brand}
                  />
                )}

              {!isPet &&
                profile.model &&
                profile.show_model !== false && (
                  <Info
                    label={ka ? "მოდელი" : "Model"}
                    value={profile.model}
                  />
                )}

              {!isPet &&
                profile.size &&
                profile.show_size !== false && (
                  <Info
                    label={ka ? "ზომა" : "Size"}
                    value={profile.size}
                  />
                )}

              {!isPet &&
                profile.material &&
                profile.show_material !== false && (
                  <Info
                    label={ka ? "მასალა" : "Material"}
                    value={profile.material}
                  />
                )}
            </div>

            {isPet &&
              profile.medical_info &&
              profile.show_medical_info !== false && (
                <LongInfo
                  label={
                    ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical information"
                  }
                  value={profile.medical_info}
                />
              )}

            {isPet && profile.behaviour_note && (
              <LongInfo
                label={
                  ka
                    ? "ქცევის შესახებ ინფორმაცია"
                    : "Behaviour information"
                }
                value={profile.behaviour_note}
              />
            )}

            {!isPet &&
              profile.distinctive_features &&
              profile.show_distinctive_features !== false && (
                <LongInfo
                  label={
                    ka
                      ? "განსაკუთრებული ნიშნები"
                      : "Distinctive features"
                  }
                  value={profile.distinctive_features}
                />
              )}

            {profile.description &&
              profile.show_description !== false && (
                <LongInfo
                  label={
                    ka
                      ? "დამატებითი აღწერა"
                      : "Additional description"
                  }
                  value={profile.description}
                />
              )}
          </section>

          {lost && (
            <section className="section contactSection">
              <div className="sectionTitle">
                <span>02</span>

                <h2>
                  {ka
                    ? "დაუკავშირდით მფლობელს"
                    : "Contact the owner"}
                </h2>
              </div>

              <div className="ownerCard">
                {ownerPhoto &&
                profile.show_owner_photo !== false ? (
                  <img
                    src={ownerPhoto}
                    alt="Owner"
                    className="ownerPhoto"
                  />
                ) : (
                  <div className="ownerPlaceholder">
                    👤
                  </div>
                )}

                <div className="ownerInfo">
                  <small>
                    {ka ? "მფლობელი" : "Owner"}
                  </small>

                  <strong>
                    {profile.owner_name ||
                      (ka
                        ? "პროფილის მმართველი"
                        : "Profile manager")}
                  </strong>

                  {profile.show_owner_phone === true &&
                    profile.owner_phone && (
                      <a href={`tel:${cleanPhone}`}>
                        📞 {profile.owner_phone}
                      </a>
                    )}

                  {profile.show_owner_email === true &&
                    profile.owner_email && (
                      <a
                        href={`mailto:${profile.owner_email}`}
                      >
                        ✉️ {profile.owner_email}
                      </a>
                    )}
                </div>
              </div>

              {hasContact ? (
                <div className="contactButtons">
                  {showPhone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="contactButton phoneButton"
                    >
                      <span>📞</span>

                      <div>
                        <small>
                          {ka ? "მობილური" : "Mobile"}
                        </small>

                        <strong>
                          {ka ? "დარეკვა" : "Call owner"}
                        </strong>
                      </div>
                    </a>
                  )}

                  {showWhatsApp && (
                    <a
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contactButton whatsappButton"
                    >
                      <span>💬</span>

                      <div>
                        <small>WhatsApp</small>
                        <strong>
                          {ka
                            ? "WhatsApp-ით დაკავშირება"
                            : "Open WhatsApp"}
                        </strong>
                      </div>
                    </a>
                  )}

                  {showChat && (
                    <a
                      href={`/chat/${chatType}/${encodeURIComponent(
                        profile.tag_code
                      )}`}
                      className="contactButton chatButton"
                    >
                      <span>💬</span>

                      <div>
                        <small>QR RETURN</small>

                        <strong>Live Chat</strong>
                      </div>
                    </a>
                  )}
                </div>
              ) : (
                <div className="noContact">
                  {ka
                    ? "მფლობელს პირდაპირი დაკავშირების მეთოდი ჯერ არ აქვს ჩართული."
                    : "The owner has not enabled a direct contact method."}
                </div>
              )}

              {profile.show_additional_contact === true &&
                (profile.additional_contact_name ||
                  profile.additional_contact_phone ||
                  profile.additional_contact_email) && (
                  <div className="additionalContact">
                    <strong>
                      {ka
                        ? "დამატებითი საკონტაქტო პირი"
                        : "Additional contact"}
                    </strong>

                    {profile.additional_contact_name && (
                      <p>
                        👤 {profile.additional_contact_name}
                      </p>
                    )}

                    {profile.additional_contact_phone && (
                      <a
                        href={`tel:${profile.additional_contact_phone}`}
                      >
                        📞 {profile.additional_contact_phone}
                      </a>
                    )}

                    {profile.additional_contact_email && (
                      <a
                        href={`mailto:${profile.additional_contact_email}`}
                      >
                        ✉️ {profile.additional_contact_email}
                      </a>
                    )}
                  </div>
                )}
            </section>
          )}

          {lost &&
            (showFinderMessage ||
              showLastSeen ||
              profile.location_sharing_enabled === true) && (
              <section className="section">
                <div className="sectionTitle">
                  <span>03</span>

                  <h2>
                    {ka
                      ? "მპოვნელისთვის"
                      : "For the finder"}
                  </h2>
                </div>

                {showFinderMessage &&
                  profile.finder_message && (
                    <div className="finderMessage">
                      <div className="quote">“</div>

                      <p>{profile.finder_message}</p>
                    </div>
                  )}

                {showLastSeen &&
                  profile.lost_seen_location && (
                    <LongInfo
                      label={
                        ka
                          ? "ბოლო ნანახი ადგილი"
                          : "Last seen location"
                      }
                      value={profile.lost_seen_location}
                    />
                  )}

                {profile.location_sharing_enabled === true && (
                  <div className="locationCard">
                    <div className="locationIcon">📍</div>

                    <div className="locationText">
                      <strong>
                        {ka
                          ? "გაუზიარეთ თქვენი ლოკაცია მფლობელს"
                          : "Share your location with the owner"}
                      </strong>

                      <p>
                        {ka
                          ? "ერთი ღილაკით გაუგზავნეთ მფლობელს ადგილი, სადაც QR კოდი დაასკანერეთ."
                          : "Send the owner the location where you scanned this QR code."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={shareLocation}
                      disabled={locationLoading}
                    >
                      {locationLoading
                        ? ka
                          ? "იგზავნება..."
                          : "Sharing..."
                        : ka
                        ? "ლოკაციის გაზიარება"
                        : "Share location"}
                    </button>
                  </div>
                )}

                {locationMessage && (
                  <div
                    className={
                      locationMessage.startsWith("✓")
                        ? "locationResult success"
                        : "locationResult"
                    }
                  >
                    {locationMessage}
                  </div>
                )}
              </section>
            )}

          <div className="privacyBox">
            <span>🔒</span>

            <div>
              <strong>
                {ka
                  ? "თქვენი კონფიდენციალურობა დაცულია"
                  : "Privacy protected"}
              </strong>

              <p>
                {ka
                  ? "QR RETURN აჩვენებს მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც პროფილის მფლობელმა გადაწყვიტა."
                  : "QR RETURN shows only information the profile owner has chosen to share."}
              </p>
            </div>
          </div>

          <footer className="footer">
            <div>
              <strong>QR RETURN</strong>

              <span>
                {ka
                  ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
                  : "Never lose what matters."}
              </span>
            </div>

            <a href="/">
              {ka ? "მთავარი გვერდი" : "Home"} →
            </a>
          </footer>
        </div>
      </section>

      <Styles />
    </main>
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

function getRealType(profile: ItemProfile) {
  if (profile.pet_type === "dog") return "dog";
  if (profile.pet_type === "cat") return "cat";

  if (profile.item_type === "dog") return "dog";
  if (profile.item_type === "cat") return "cat";

  if (profile.item_type === "key") return "keys";

  return profile.item_type || "profile";
}

function normalizeChatType(type: string) {
  if (type === "keys") return "key";
  return type;
}

function getCategory(type: string, lang: Lang) {
  const ka = lang === "ka";

  switch (type) {
    case "dog":
      return ka ? "ძაღლი" : "Dog";

    case "cat":
      return ka ? "კატა" : "Cat";

    case "key":
    case "keys":
      return ka ? "გასაღები" : "Keys";

    case "wallet":
      return ka ? "საფულე" : "Wallet";

    case "bag":
      return ka ? "ჩანთა" : "Bag";

    case "suitcase":
      return ka ? "ჩემოდანი" : "Suitcase";

    case "luggage":
      return ka ? "ჩემოდანი" : "Luggage";

    default:
      return ka ? "QR პროფილი" : "QR Profile";
  }
}

function getIcon(type: string) {
  switch (type) {
    case "dog":
      return "🐶";

    case "cat":
      return "🐱";

    case "key":
    case "keys":
      return "🔑";

    case "wallet":
      return "👛";

    case "bag":
      return "👜";

    case "suitcase":
    case "luggage":
      return "🧳";

    default:
      return "🏷️";
  }
}

function translateSex(sex: string, lang: Lang) {
  if (sex === "male") {
    return lang === "ka" ? "მამრობითი" : "Male";
  }

  if (sex === "female") {
    return lang === "ka" ? "მდედრობითი" : "Female";
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
        background: #f6f8fc;
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
            circle at 7% 10%,
            rgba(20, 101, 232, 0.08),
            transparent 28%
          ),
          radial-gradient(
            circle at 95% 8%,
            rgba(118, 85, 247, 0.08),
            transparent 28%
          ),
          #f6f8fc;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 900px;
        min-height: 80px;
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

      .logo,
      .stateLogo {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-size: 12px;
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
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 10px;
        border: 0;
        border-radius: 7px;
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
        padding: 42px 0 70px;
      }

      .profileCard {
        padding: 30px;
        border: 1px solid #e4e7ec;
        border-radius: 26px;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 24px 65px rgba(16, 24, 40, 0.08);
      }

      .hero {
        display: flex;
        align-items: center;
        gap: 25px;
      }

      .photoWrapper {
        width: 170px;
        height: 170px;
        flex: 0 0 170px;
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
          #f1edff
        );
        font-size: 60px;
      }

      .statusBadge {
        position: absolute;
        left: 12px;
        bottom: 12px;
        padding: 7px 10px;
        display: flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        backdrop-filter: blur(10px);
        font-size: 9px;
        font-weight: 900;
      }

      .statusBadge span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }

      .statusBadge.lost {
        background: rgba(255, 241, 240, 0.94);
        color: #b42318;
      }

      .statusBadge.lost span {
        background: #d92d20;
      }

      .statusBadge.safe {
        background: rgba(236, 253, 243, 0.94);
        color: #027a48;
      }

      .statusBadge.safe span {
        background: #12b76a;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .heroText h1 {
        margin: 8px 0 10px;
        font-size: 37px;
        line-height: 1.1;
        letter-spacing: -1.5px;
      }

      .category {
        width: fit-content;
        padding: 7px 11px;
        border-radius: 999px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 12px;
        font-weight: 900;
      }

      .tagCode {
        margin: 12px 0 0;
        color: #98a2b3;
        font-size: 11px;
      }

      .safeNotice {
        margin-top: 28px;
        padding: 18px;
        display: flex;
        align-items: flex-start;
        gap: 13px;
        border: 1px solid #abefc6;
        border-radius: 16px;
        background: #ecfdf3;
      }

      .safeNoticeIcon {
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
        font-size: 14px;
      }

      .safeNotice p {
        margin: 5px 0 0;
        color: #475467;
        font-size: 12px;
        line-height: 1.6;
      }

      .section {
        margin-top: 30px;
        padding-top: 28px;
        border-top: 1px solid #eaecf0;
      }

      .sectionTitle {
        margin-bottom: 19px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .sectionTitle > span {
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

      .infoGrid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .infoBox {
        padding: 15px;
        border: 1px solid #eaecf0;
        border-radius: 13px;
        background: #fafbfc;
      }

      .infoBox span,
      .longInfo span {
        display: block;
        margin-bottom: 5px;
        color: #98a2b3;
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.7px;
      }

      .infoBox strong {
        color: #344054;
        font-size: 14px;
      }

      .longInfo {
        margin-top: 12px;
        padding: 16px;
        border: 1px solid #eaecf0;
        border-radius: 13px;
        background: #fafbfc;
      }

      .longInfo p {
        margin: 0;
        color: #475467;
        font-size: 13px;
        line-height: 1.65;
        white-space: pre-wrap;
      }

      .ownerCard {
        padding: 17px;
        display: flex;
        align-items: center;
        gap: 14px;
        border: 1px solid #e4e7ec;
        border-radius: 16px;
        background: #fafbfc;
      }

      .ownerPhoto,
      .ownerPlaceholder {
        width: 58px;
        height: 58px;
        flex: 0 0 58px;
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

      .ownerInfo small,
      .ownerInfo strong {
        display: block;
      }

      .ownerInfo small {
        color: #98a2b3;
        font-size: 9px;
        font-weight: 900;
        text-transform: uppercase;
      }

      .ownerInfo strong {
        margin: 3px 0 5px;
        color: #344054;
        font-size: 15px;
      }

      .ownerInfo a {
        display: block;
        margin-top: 4px;
        color: #1465e8;
        font-size: 11px;
        font-weight: 700;
        text-decoration: none;
      }

      .contactButtons {
        margin-top: 14px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .contactButton {
        min-height: 78px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
        border-radius: 14px;
        color: white;
        text-decoration: none;
      }

      .contactButton > span {
        font-size: 23px;
      }

      .contactButton small,
      .contactButton strong {
        display: block;
      }

      .contactButton small {
        opacity: 0.8;
        font-size: 8px;
        text-transform: uppercase;
      }

      .contactButton strong {
        margin-top: 3px;
        font-size: 11px;
      }

      .phoneButton {
        background: #1465e8;
      }

      .whatsappButton {
        background: #16a765;
      }

      .chatButton {
        background: linear-gradient(
          135deg,
          #7655f7,
          #5635da
        );
      }

      .noContact {
        margin-top: 14px;
        padding: 14px;
        border-radius: 12px;
        background: #f2f4f7;
        color: #667085;
        font-size: 12px;
      }

      .additionalContact {
        margin-top: 14px;
        padding: 15px;
        border: 1px solid #e4e7ec;
        border-radius: 13px;
      }

      .additionalContact strong {
        display: block;
        margin-bottom: 8px;
        font-size: 12px;
      }

      .additionalContact p,
      .additionalContact a {
        display: block;
        margin: 5px 0;
        color: #475467;
        font-size: 11px;
        text-decoration: none;
      }

      .finderMessage {
        padding: 18px;
        display: flex;
        gap: 12px;
        border-radius: 16px;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f3f0ff
        );
      }

      .quote {
        color: #7655f7;
        font-family: Georgia, serif;
        font-size: 35px;
        line-height: 1;
      }

      .finderMessage p {
        margin: 0;
        color: #344054;
        font-size: 14px;
        line-height: 1.7;
        white-space: pre-wrap;
      }

      .locationCard {
        margin-top: 14px;
        padding: 17px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px solid #dbe7ff;
        border-radius: 16px;
        background: #f5f9ff;
      }

      .locationIcon {
        width: 46px;
        height: 46px;
        flex: 0 0 46px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: white;
        font-size: 22px;
      }

      .locationText {
        flex: 1;
      }

      .locationText strong {
        font-size: 13px;
      }

      .locationText p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.5;
      }

      .locationCard button {
        min-height: 42px;
        padding: 0 14px;
        border: 0;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .locationCard button:disabled {
        opacity: 0.6;
      }

      .locationResult {
        margin-top: 10px;
        padding: 11px;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 11px;
      }

      .locationResult.success {
        background: #ecfdf3;
        color: #027a48;
      }

      .privacyBox {
        margin-top: 28px;
        padding: 16px;
        display: flex;
        gap: 11px;
        border-radius: 14px;
        background: #f2f4f7;
      }

      .privacyBox > span {
        font-size: 19px;
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

      .footer {
        margin-top: 27px;
        padding-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border-top: 1px solid #eaecf0;
      }

      .footer strong,
      .footer span {
        display: block;
      }

      .footer strong {
        color: #1465e8;
        font-size: 12px;
      }

      .footer span {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 9px;
      }

      .footer a {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: Inter, Arial, sans-serif;
        background: #f7f9fc;
      }

      .stateLogo {
        margin-bottom: 12px;
      }

      .statePage h1 {
        margin: 0 0 8px;
        color: #1465e8;
      }

      .statePage p {
        color: #667085;
      }

      .errorBox {
        max-width: 500px;
        padding: 14px;
        border: 1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 13px;
      }

      .homeButton {
        margin-top: 16px;
        padding: 12px 17px;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-size: 12px;
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

        .photoWrapper {
          width: 100%;
          height: 290px;
          flex: none;
        }

        .heroText h1 {
          font-size: 31px;
        }

        .infoGrid {
          grid-template-columns: 1fr;
        }

        .contactButtons {
          grid-template-columns: 1fr;
        }

        .contactButton {
          min-height: 68px;
        }

        .locationCard {
          align-items: stretch;
          flex-direction: column;
        }

        .locationCard button {
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .container {
          width: calc(100% - 16px);
          padding-top: 25px;
        }

        .profileCard {
          padding: 17px;
          border-radius: 20px;
        }

        .photoWrapper {
          height: 250px;
        }

        .footer {
          align-items: flex-start;
          flex-direction: column;
        }
      }
    `}</style>
  );
}
