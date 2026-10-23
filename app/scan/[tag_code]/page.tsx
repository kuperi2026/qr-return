"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  formatLocationAccuracy,
  getPreciseLocation,
  LocationAccuracyError,
} from "@/lib/geolocation";
import { getFinderSession } from "@/lib/finderSession";
import QRScanTracker from "@/components/QRScanTracker";
import AiFinderGuide from "@/app/components/ai/AiFinderGuide";

type FinderProfile = {
  id: string;
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
  photo: string | null;
  owner_photo_url: string | null;

  owner_name: string | null;
  owner_first_name: string | null;
  owner_last_name: string | null;
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
  show_email: boolean | null;
  show_pet_photo: boolean | null;
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

      const raw = data as FinderProfile;
      setProfile({
        ...raw,
        photo_url: raw.photo_url || raw.photo || null,
        owner_name:
          raw.owner_name ||
          [raw.owner_first_name, raw.owner_last_name]
            .filter(Boolean)
            .join(" ") ||
          null,
        show_photo: raw.show_photo ?? raw.show_pet_photo,
        show_owner_email: raw.show_owner_email ?? raw.show_email,
      });
      setLoading(false);
    }

    loadProfile();
  }, [tagCode]);

  async function shareLocation() {
    if (!profile) return;

    setLocationStatus(
      "მდებარეობა დგინდება..."
    );

    try {
      const position =
        await getPreciseLocation();

      const {
        latitude,
        longitude,
        accuracy,
      } = position.coords;

      const { data, error } =
        await supabase.rpc(
          "share_finder_location_v2",
          {
            p_tag_code:
              profile.tag_code,
            p_finder_session:
              getFinderSession(profile.tag_code),
            p_latitude: latitude,
            p_longitude: longitude,
            p_accuracy: accuracy,
          }
        );

      if (error) {
        throw error;
      }

      if (data !== true) {
        throw new Error(
          "ლოკაციის გაზიარება ვერ დადასტურდა."
        );
      }

      setLocationStatus(
        `მდებარეობა გაიგზავნა — სიზუსტე დაახლოებით ${formatLocationAccuracy(
          accuracy
        )} მეტრი.`
      );
    } catch (error) {
      console.error(
        "Geolocation error:",
        error
      );

      if (
        error instanceof
        LocationAccuracyError
      ) {
        setLocationStatus(
          "მდებარეობის დადგენა ვერ მოხერხდა. ჩართეთ ზუსტი მდებარეობა და სცადეთ ღია სივრცეში."
        );
      } else if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 1
      ) {
        setLocationStatus(
          "ჩართეთ Location და Precise Location ნებართვა ბრაუზერის პარამეტრებში."
        );
      } else {
        setLocationStatus(
          "ლოკაციის მიღება ვერ მოხერხდა."
        );
      }
    }
  }

  if (loading) {
    return (
      <main className="finderPage centerPage">
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
      <main className="finderPage centerPage">
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
    Boolean(profile.owner_phone);

  const canEmail =
    profile.show_owner_email === true &&
    Boolean(profile.owner_email);

  return (
    <>
      <QRScanTracker itemId={profile.id} tagCode={profile.tag_code} />
      <main className="finderPage">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>ნაპოვნი პროფილი</small>
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
                  თქვენ იპოვეთ
                </div>

                <h1>
                  {profile.item_name ||
                    getCategory(category)}
                </h1>

                <div className="categoryBadge">
                  {getCategory(category)}
                </div>

                {category === "parking" && (
                  <p className="driverStatus">● მძღოლთან დაკავშირება ხელმისაწვდომია</p>
                )}

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
                  <small>პროფილის დეტალები</small>

                  <h2>
                    {isPet
                      ? "ცხოველის ინფორმაცია"
                      : category === "parking"
                      ? "ავტომობილის ინფორმაცია"
                      : "ნივთის ინფორმაცია"}
                  </h2>
                </div>
              </div>

              <div className="grid">
                {category === "parking" && profile.item_name && (
                  <Info label="სახელმწიფო ნომერი" value={profile.item_name} />
                )}
                {profile.colour && (
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

            <AiFinderGuide
              category={category}
              tagCode={profile.tag_code}
              lostMode={profile.active === true}
              phone={profile.owner_phone}
              chatHref={
                profile.live_chat_enabled === true
                  ? `/chat/${encodeURIComponent(profile.item_type === "pet" ? profile.pet_type || "pet" : profile.item_type)}/${encodeURIComponent(profile.tag_code)}`
                  : null
              }
              canShareLocation={profile.location_sharing_enabled === true}
              onShareLocation={() => void shareLocation()}
            />

            <section className="section">
              <div className="sectionHeading">
                <span>02</span>

                <div>
                  <small>მფლობელის ინფორმაცია</small>

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

              {profile.owner_phone && (
                <div className="ownerName">
                  <span>ტელეფონის ნომერი</span>
                  <strong>{profile.owner_phone}</strong>
                </div>
              )}

              <div className="contactButtons">
                {canCall && (
                  <a
                    href={phoneHref(profile.owner_phone!)}
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
                    ელფოსტა
                  </a>
                )}

                {profile.live_chat_enabled ===
                  true && (
                  <a
                    href={`/chat/${encodeURIComponent(profile.item_type === "pet" ? profile.pet_type || "pet" : profile.item_type)}/${encodeURIComponent(profile.tag_code)}`}
                    className="secondaryButton"
                  >
                    ჩატი
                  </a>
                )}
              </div>

              {profile.show_additional_contact === true && (profile.additional_contact_name ||
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
                        href={phoneHref(profile.additional_contact_phone)}
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
                    <small>მდებარეობის გაზიარება</small>

                    <h2>
                      მდებარეობის გაზიარება
                    </h2>
                  </div>
                </div>

                <p>
                  სურვილის შემთხვევაში შეგიძლიათ მფლობელს გაუზიაროთ თქვენი მიმდინარე მდებარეობა.
                </p>

                <button
                  type="button"
                  onClick={shareLocation}
                  className="locationButton"
                >
                  📍 მიმდინარე მდებარეობის გაზიარება
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

    case "parking":
      return "მანქანა / Parking";

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

    case "parking":
      return "🚘";

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

function phoneHref(phone: string) {
  return `tel:${phone.trim().replace(/[^\d+]/g, "")}`;
}

function Styles() {
  return (
    <style jsx global>{`
      .finderPage * {
        box-sizing: border-box;
      }

      .finderPage a {
        text-decoration: none;
      }

      .finderPage {
        min-height: 100vh;
        background:
          radial-gradient(circle at 21% 17%, rgba(78,166,238,.3), transparent 30%),
          linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);
      }

      .finderPage .header {
        height: 70px;

        display: flex;
        align-items: center;

        padding: 0 28px;

        background: rgba(255,255,255,.1);
        border-bottom: 1px solid rgba(255,255,255,.22);
      }

      .finderPage .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .finderPage .logo {
        width: 39px;
        height: 39px;

        display: grid;
        place-items: center;

        border-radius: 10px;

        color: #ffffff;
        background: #1266e9;

        font-size: 12px;
        font-weight: 900;
      }

      .finderPage .brand strong,
      .finderPage .brand small {
        display: block;
      }

      .finderPage .brand strong {
        color: #ffffff;
        font-size: 17px;
      }

      .finderPage .brand small {
        margin-top: 3px;

        color: rgba(255,255,255,.7);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 1.1px;
      }

      .finderPage .content {
        width: calc(100% - 30px);
        max-width: 720px;

        margin: 0 auto;
        padding: 38px 0 60px;
      }

      .finderPage .finderCard {
        overflow: hidden;

        border: 1px solid #e0e7ef;
        border-radius: 22px;

        background: #ffffff;

        box-shadow: 0 24px 65px rgba(0,24,58,.28);
      }

      .finderPage .hero {
        padding: 32px;

        display: flex;
        align-items: center;
        gap: 24px;

        border-bottom: 1px solid #e8edf3;
      }

      .finderPage .mainPhoto,
      .finderPage .photoPlaceholder {
        width: 118px;
        height: 118px;

        flex: 0 0 118px;

        border-radius: 20px;
      }

      .finderPage .mainPhoto {
        object-fit: cover;
      }

      .finderPage .photoPlaceholder {
        display: grid;
        place-items: center;

        background: #edf5ff;

        font-size: 48px;
      }

      .finderPage .eyebrow {
        color: #1266e9;

        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .finderPage .heroText h1 {
        margin: 7px 0 8px;

        color: #172b43;

        font-size: 31px;
        line-height: 1.1;
      }

      .finderPage .categoryBadge {
        display: inline-flex;

        padding: 6px 10px;

        border-radius: 20px;

        color: #1266e9;
        background: #edf5ff;

        font-size: 12px;
        font-weight: 800;
      }

      .finderPage .heroText p {
        margin: 11px 0 0;

        color: #7c8998;
        font-size: 12px;
      }

      .finderPage .heroText p strong {
        color: #42556b;
      }

      .finderPage .heroText .driverStatus {
        margin-top: 10px;
        color: #16845b;
        font-size: 13px;
        font-weight: 850;
      }

      .finderPage .messageBox {
        margin: 24px 30px 0;
        padding: 20px;

        border: 1px solid #dbe8fb;
        border-radius: 15px;

        background: #f5f9ff;
      }

      .finderPage .messageBox span,
      .finderPage .rewardBox span {
        display: block;

        color: #1266e9;

        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .finderPage .messageBox p {
        margin: 8px 0 0;

        color: #34485f;

        font-size: 13px;
        line-height: 1.65;
      }

      .finderPage .rewardBox {
        margin: 13px 30px 0;
        padding: 17px 20px;

        border-radius: 13px;

        background: #f6f8fb;
      }

      .finderPage .rewardBox strong {
        display: block;

        margin-top: 5px;

        color: #172b43;
        font-size: 17px;
      }

      .finderPage .section,
      .finderPage .locationSection {
        padding: 30px;

        border-bottom: 1px solid #e8edf3;
      }

      .finderPage .sectionHeading {
        display: flex;
        align-items: flex-start;
        gap: 13px;

        margin-bottom: 20px;
      }

      .finderPage .sectionHeading > span {
        width: 28px;
        height: 28px;

        display: grid;
        place-items: center;

        border-radius: 8px;

        color: #1266e9;
        background: #edf5ff;

        font-size: 12px;
        font-weight: 900;
      }

      .finderPage .sectionHeading small {
        display: block;

        color: #9aa6b4;

        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .finderPage .sectionHeading h2 {
        margin: 3px 0 0;

        color: #20354e;

        font-size: 17px;
      }

      .finderPage .grid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 10px;
      }

      .finderPage .info {
        padding: 15px;

        border: 1px solid #e4eaf1;
        border-radius: 12px;

        background: #fbfcfe;
      }

      .finderPage .info span,
      .finderPage .longInfo span,
      .finderPage .ownerName span,
      .finderPage .additionalContact > span {
        display: block;

        color: #8996a5;

        font-size: 12px;
        font-weight: 800;
      }

      .finderPage .info strong {
        display: block;

        margin-top: 5px;

        color: #263a52;

        font-size: 12px;
      }

      .finderPage .longInfo {
        margin-top: 10px;
        padding: 16px;

        border: 1px solid #e4eaf1;
        border-radius: 12px;
      }

      .finderPage .longInfo p {
        margin: 7px 0 0;

        color: #53657a;

        font-size: 12px;
        line-height: 1.6;
      }

      .finderPage .ownerPhotoWrap {
        margin-bottom: 15px;
      }

      .finderPage .ownerPhotoWrap img {
        width: 60px;
        height: 60px;

        object-fit: cover;

        border-radius: 50%;
      }

      .finderPage .ownerName {
        margin-bottom: 14px;
      }

      .finderPage .ownerName strong {
        display: block;

        margin-top: 4px;

        color: #263a52;
        font-size: 13px;
      }

      .finderPage .contactButtons {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 9px;
      }

      .finderPage .primaryButton,
      .finderPage .secondaryButton {
        min-height: 45px;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 0 14px;

        border-radius: 11px;

        font-size: 12px;
        font-weight: 850;
      }

      .finderPage .primaryButton {
        color: #ffffff;
        background: #1266e9;
      }

      .finderPage .secondaryButton {
        color: #1266e9;
        background: #f1f6fd;

        border: 1px solid #dbe7f7;
      }

      .finderPage .additionalContact {
        margin-top: 16px;
        padding: 16px;

        border-radius: 12px;

        background: #f7f9fc;
      }

      .finderPage .additionalContact strong,
      .finderPage .additionalContact a {
        display: block;

        margin-top: 6px;

        color: #263a52;

        font-size: 12px;
      }

      .finderPage .locationSection {
        border-bottom: 0;
      }

      .finderPage .locationSection > p {
        margin: -5px 0 17px;

        color: #6f7e8e;

        font-size: 12px;
        line-height: 1.6;
      }

      .finderPage .locationButton {
        min-height: 45px;

        padding: 0 17px;

        border: 0;
        border-radius: 11px;

        color: #ffffff;
        background: #1266e9;

        font-size: 12px;
        font-weight: 850;

        cursor: pointer;
      }

      .finderPage .locationStatus {
        margin-top: 12px;

        color: #53657a;

        font-size: 12px;
      }

      .finderPage .privacy {
        padding: 19px 20px;

        text-align: center;
      }

      .finderPage .privacy strong {
        color: #1266e9;

        font-size: 12px;
        letter-spacing: 1px;
      }

      .finderPage .privacy p {
        max-width: 420px;

        margin: 6px auto 0;

        color: #98a4b1;

        font-size: 12px;
        line-height: 1.5;
      }

      .finderPage .eyebrow,.finderPage .messageBox span,.finderPage .rewardBox span{font-size:12px}.finderPage .heroText p{font-size:15px}.finderPage .categoryBadge{font-size:13px}.finderPage .messageBox p{font-size:16px}.finderPage .sectionHeading small{font-size:12px}.finderPage .sectionHeading h2{font-size:22px}.finderPage .info span,.finderPage .longInfo span,.finderPage .ownerName span,.finderPage .additionalContact>span{font-size:13px}.finderPage .info strong,.finderPage .longInfo p{font-size:16px}.finderPage .ownerName strong{font-size:17px}.finderPage .primaryButton,.finderPage .secondaryButton,.finderPage .locationButton{min-height:54px;font-size:16px}.finderPage .additionalContact strong,.finderPage .additionalContact a,.finderPage .locationSection>p{font-size:16px}.finderPage .locationStatus{font-size:14px}.finderPage .privacy strong{font-size:12px}.finderPage .privacy p{font-size:13px}

      .finderPage.centerPage {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 25px;

        text-align: center;

        background: #f4f7fb;
      }

      .finderPage .centerLogo {
        margin-bottom: 12px;
      }

      .finderPage .centerPage h1 {
        margin: 0;

        color: #172b43;

        font-size: 25px;
      }

      .finderPage .centerPage p {
        color: #7c8998;
        font-size: 12px;
      }

      .finderPage .errorBox {
        margin-top: 15px;
        padding: 14px 18px;

        border-radius: 11px;

        color: #53657a;
        background: #ffffff;

        border: 1px solid #e2e8ef;

        font-size: 12px;
      }

      @media (max-width: 600px) {
        .finderPage .header {
          height: 62px;
          padding: 0 16px;
        }

        .finderPage .content {
          width: calc(100% - 20px);
          padding-top: 18px;
        }

        .finderPage .finderCard {
          border-radius: 17px;
        }

        .finderPage .hero {
          padding: 22px;

          align-items: flex-start;
          gap: 16px;
        }

        .finderPage .mainPhoto,
        .finderPage .photoPlaceholder {
          width: 88px;
          height: 88px;

          flex-basis: 88px;

          border-radius: 16px;
        }

        .finderPage .photoPlaceholder {
          font-size: 37px;
        }

        .finderPage .heroText h1 {
          font-size: 25px;
        }

        .finderPage .messageBox,
        .finderPage .rewardBox {
          margin-left: 20px;
          margin-right: 20px;
        }

        .finderPage .section,
        .finderPage .locationSection {
          padding: 24px 20px;
        }

        .finderPage .grid,
        .finderPage .contactButtons {
          grid-template-columns: 1fr;
        }
      }

.finderPage { min-height:100dvh; background:linear-gradient(180deg,#eaf3ff 0,#f5f8fc 360px); color:#193650; }
.finderPage .header { background:white; border-bottom:1px solid #dce7f3; }
.finderPage .brand strong { color:#154c89; }
.finderPage .brand small { color:#617389; letter-spacing:0; }
.finderPage .content { padding-top:26px; }
.finderPage .finderCard { border-color:#dce7f3; box-shadow:0 12px 36px #24496c0c; }
.finderPage .hero { background:linear-gradient(120deg,#fff,#edf5ff); }
.finderPage .heroText h1 { color:#153c68; overflow-wrap:anywhere; }
.finderPage .mainPhoto,.finderPage .photoPlaceholder { border:3px solid white; box-shadow:0 4px 16px #24496c12; }
.finderPage .sectionHeading small,.finderPage .info span { color:#5d7289; }
.finderPage .messageBox { background:#edf5ff; border-color:#d5e6fb; }
.finderPage .rewardBox { background:#edf9f3; border:1px solid #cce8da; }
.finderPage .rewardBox strong { color:#21684e; }
.finderPage .primaryButton,.finderPage .locationButton { background:#1465d9; color:#fff; }
.finderPage .secondaryButton { border:1px solid #c7dcf7; background:#edf5ff; color:#1256b0; }
.finderPage .privacy { color:#617389; }
.finderPage :is(button,a):focus-visible { outline:3px solid #87b9f7; outline-offset:3px; }
.finderPage .aiGuide { margin:18px 24px; box-shadow:none; border-color:#d5e6fb; background:#f5f9ff; }
.finderPage .aiOrb { background:#1465d9; box-shadow:none; }
.finderPage .aiGuideHead small { color:#1465d9; }
@media(max-width:520px) { .finderPage .hero { padding:24px 18px; }.finderPage .aiGuide { margin:16px; }.finderPage .header { padding:0 18px; } }
    `}</style>
  );
}


function maskTagCode(tagCode: string) {
  const normalized = tagCode.trim();
  return `••••${normalized.slice(-4)}`;
}
