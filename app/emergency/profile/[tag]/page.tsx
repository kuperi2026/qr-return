"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type EmergencyProfile = {
  tag_code: string;

  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;

  date_of_birth: string | null;
  sex: string | null;
  blood_type: string | null;
  address: string | null;

  allergies: string | null;
  medical_conditions: string | null;
  medications: string | null;
  medical_note: string | null;
  additional_info: string | null;

  emergency_message: string | null;

  emergency_contact_enabled: boolean | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_mobile_enabled: boolean | null;
  emergency_contact_whatsapp_enabled: boolean | null;
  emergency_contact_live_chat_enabled: boolean | null;

  second_contact_enabled: boolean | null;
  second_contact_name: string | null;
  second_contact_relationship: string | null;
  second_contact_phone: string | null;
  second_contact_mobile_enabled: boolean | null;
  second_contact_whatsapp_enabled: boolean | null;
  second_contact_live_chat_enabled: boolean | null;

  show_name: boolean | null;
  show_photo: boolean | null;
  show_date_of_birth: boolean | null;
  show_sex: boolean | null;
  show_blood_type: boolean | null;
  show_address: boolean | null;
  show_allergies: boolean | null;
  show_medical_conditions: boolean | null;
  show_medications: boolean | null;
  show_medical_note: boolean | null;
  show_additional_info: boolean | null;
  show_emergency_message: boolean | null;
  show_emergency_contact: boolean | null;
  show_second_contact: boolean | null;

  live_chat_enabled: boolean | null;
  active: boolean | null;
};

export default function EmergencyProfilePage() {
  const params = useParams();

  const rawTag = params?.tag;

  const tag =
    typeof rawTag === "string"
      ? decodeURIComponent(rawTag).trim().toUpperCase()
      : "";

  const [lang, setLang] = useState<Lang>("ka");

  const [profile, setProfile] =
    useState<EmergencyProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ka = lang === "ka";

  useEffect(() => {
    async function loadProfile() {
      if (!tag) {
        setError(
          ka
            ? "QR კოდი ვერ მოიძებნა."
            : "QR code was not found."
        );

        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error: loadError } =
        await supabase
          .from("emergency_profiles")
          .select("*")
          .eq("tag_code", tag)
          .maybeSingle();

      if (loadError) {
        console.error(loadError);

        setError(
          ka
            ? "პროფილის გახსნა ვერ მოხერხდა."
            : "Could not open the profile."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          ka
            ? "ამ QR კოდზე Emergency პროფილი არ მოიძებნა."
            : "No Emergency profile was found for this QR code."
        );

        setLoading(false);
        return;
      }

      if (data.active === false) {
        setError(
          ka
            ? "ეს Emergency პროფილი არააქტიურია."
            : "This Emergency profile is inactive."
        );

        setLoading(false);
        return;
      }

      setProfile(data as EmergencyProfile);
      setLoading(false);
    }

    void loadProfile();
  }, [tag, ka]);

  if (loading) {
    return (
      <>
        <main className="state">
          <div className="logo">QR</div>

          <h1>QR RETURN</h1>

          <p>
            {ka
              ? "Emergency პროფილი იტვირთება..."
              : "Loading Emergency profile..."}
          </p>
        </main>

        <Styles />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <main className="state">
          <div className="logo">QR</div>

          <h1>
            {ka
              ? "პროფილი ვერ მოიძებნა"
              : "Profile not found"}
          </h1>

          <p>{error}</p>

          <a href="/">
            QR RETURN
          </a>
        </main>

        <Styles />
      </>
    );
  }

  const fullName =
    [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ");

  const showName =
    profile.show_name !== false &&
    Boolean(fullName);

  const showPhoto =
    profile.show_photo !== false &&
    Boolean(profile.photo_url);

  const showEmergencyContact =
    profile.emergency_contact_enabled === true &&
    profile.show_emergency_contact !== false &&
    Boolean(
      profile.emergency_contact_name ||
        profile.emergency_contact_phone
    );

  const showSecondContact =
    profile.second_contact_enabled === true &&
    profile.show_second_contact === true &&
    Boolean(
      profile.second_contact_name ||
        profile.second_contact_phone
    );

  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>EMERGENCY ID</small>
            </div>
          </a>

          <div className="languages">
            <button
              className={
                lang === "ka" ? "activeLang" : ""
              }
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              className={
                lang === "en" ? "activeLang" : ""
              }
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </header>

        <section className="container">
          <div className="profileCard">
            <section className="identity">
              {showPhoto ? (
                <img
                  src={profile.photo_url!}
                  alt={fullName || "Emergency profile"}
                  className="photo"
                />
              ) : (
                <div className="photoPlaceholder">
                  ✚
                </div>
              )}

              <div className="identityText">
                <div className="emergencyLabel">
                  EMERGENCY PROFILE
                </div>

                {showName ? (
                  <h1>{fullName}</h1>
                ) : (
                  <h1>QR RETURN</h1>
                )}

                <p>
                  QR: <strong>{profile.tag_code}</strong>
                </p>
              </div>

              <a
                href="tel:112"
                className="call112Top"
              >
                <span>📞</span>

                <div>
                  <small>
                    {ka ? "დარეკვა" : "Call"}
                  </small>

                  <strong>112</strong>
                </div>
              </a>
            </section>

            {profile.show_emergency_message !== false &&
              profile.emergency_message && (
                <section className="alert">
                  <span>!</span>

                  <div>
                    <strong>
                      {ka
                        ? "მნიშვნელოვანი ინფორმაცია"
                        : "Important information"}
                    </strong>

                    <p>
                      {profile.emergency_message}
                    </p>
                  </div>
                </section>
              )}

            <section className="section">
              <SectionTitle
                number="01"
                eyebrow="MEDICAL INFORMATION"
                title={
                  ka
                    ? "სამედიცინო ინფორმაცია"
                    : "Medical information"
                }
              />

              <div className="medicalGrid">
                {profile.show_blood_type !== false &&
                  profile.blood_type && (
                    <Info
                      label={
                        ka
                          ? "სისხლის ჯგუფი"
                          : "Blood type"
                      }
                      value={profile.blood_type}
                      emphasis
                    />
                  )}

                {profile.show_date_of_birth === true &&
                  profile.date_of_birth && (
                    <Info
                      label={
                        ka
                          ? "დაბადების თარიღი"
                          : "Date of birth"
                      }
                      value={formatDate(
                        profile.date_of_birth,
                        lang
                      )}
                    />
                  )}

                {profile.show_sex === true &&
                  profile.sex && (
                    <Info
                      label={
                        ka ? "სქესი" : "Sex"
                      }
                      value={profile.sex}
                    />
                  )}

                {profile.show_address === true &&
                  profile.address && (
                    <Info
                      label={
                        ka
                          ? "მისამართი"
                          : "Address"
                      }
                      value={profile.address}
                    />
                  )}
              </div>

              {profile.show_allergies !== false &&
                profile.allergies && (
                  <MedicalRow
                    label={
                      ka
                        ? "ალერგიები"
                        : "Allergies"
                    }
                    value={profile.allergies}
                  />
                )}

              {profile.show_medical_conditions !==
                false &&
                profile.medical_conditions && (
                  <MedicalRow
                    label={
                      ka
                        ? "სამედიცინო მდგომარეობები"
                        : "Medical conditions"
                    }
                    value={
                      profile.medical_conditions
                    }
                  />
                )}

              {profile.show_medications !== false &&
                profile.medications && (
                  <MedicalRow
                    label={
                      ka
                        ? "მედიკამენტები"
                        : "Medications"
                    }
                    value={profile.medications}
                  />
                )}

              {profile.show_medical_note !== false &&
                profile.medical_note && (
                  <MedicalRow
                    label={
                      ka
                        ? "სამედიცინო შენიშვნა"
                        : "Medical note"
                    }
                    value={profile.medical_note}
                  />
                )}

              {profile.show_additional_info === true &&
                profile.additional_info && (
                  <MedicalRow
                    label={
                      ka
                        ? "დამატებითი ინფორმაცია"
                        : "Additional information"
                    }
                    value={profile.additional_info}
                  />
                )}
            </section>

            {showEmergencyContact && (
              <section className="section">
                <SectionTitle
                  number="02"
                  eyebrow="EMERGENCY CONTACT"
                  title={
                    ka
                      ? "საკონტაქტო პირი"
                      : "Emergency contact"
                  }
                />

                <Contact
                  name={
                    profile.emergency_contact_name
                  }
                  relationship={
                    profile.emergency_contact_relationship
                  }
                  phone={
                    profile.emergency_contact_phone
                  }
                  mobile={
                    profile.emergency_contact_mobile_enabled !==
                    false
                  }
                  whatsapp={
                    profile.emergency_contact_whatsapp_enabled ===
                    true
                  }
                  liveChat={
                    profile.emergency_contact_live_chat_enabled ===
                    true
                  }
                  lang={lang}
                />
              </section>
            )}

            {showSecondContact && (
              <section className="section secondarySection">
                <SectionTitle
                  number="03"
                  eyebrow="SECOND CONTACT"
                  title={
                    ka
                      ? "დამატებითი საკონტაქტო პირი"
                      : "Additional contact"
                  }
                />

                <Contact
                  name={profile.second_contact_name}
                  relationship={
                    profile.second_contact_relationship
                  }
                  phone={
                    profile.second_contact_phone
                  }
                  mobile={
                    profile.second_contact_mobile_enabled !==
                    false
                  }
                  whatsapp={
                    profile.second_contact_whatsapp_enabled ===
                    true
                  }
                  liveChat={
                    profile.second_contact_live_chat_enabled ===
                    true
                  }
                  lang={lang}
                />
              </section>
            )}

            <section className="emergencyFooter">
              <div>
                <strong>
                  {ka
                    ? "გადაუდებელი დახმარება"
                    : "Emergency services"}
                </strong>

                <p>
                  {ka
                    ? "გადაუდებელ სიტუაციაში დაუკავშირდით 112-ს."
                    : "In an emergency, call 112."}
                </p>
              </div>

              <a
                href="tel:112"
                className="call112"
              >
                📞 {ka ? "დარეკვა 112-ზე" : "Call 112"}
              </a>
            </section>
          </div>

          <div className="privacy">
            <strong>QR RETURN</strong>

            <p>
              {ka
                ? "ნაჩვენებია მხოლოდ ის ინფორმაცია, რომლის გაზიარებაც პროფილის მფლობელს აქვს არჩეული."
                : "Only information selected by the profile owner for sharing is displayed."}
            </p>
          </div>
        </section>
      </main>

      <Styles />
    </>
  );
}

function SectionTitle({
  number,
  eyebrow,
  title,
}: {
  number: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="sectionTitle">
      <span>{number}</span>

      <div>
        <small>{eyebrow}</small>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={
        emphasis ? "info emphasis" : "info"
      }
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MedicalRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="medicalRow">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

function Contact({
  name,
  relationship,
  phone,
  mobile,
  whatsapp,
  liveChat,
  lang,
}: {
  name: string | null;
  relationship: string | null;
  phone: string | null;
  mobile: boolean;
  whatsapp: boolean;
  liveChat: boolean;
  lang: Lang;
}) {
  const ka = lang === "ka";

  const whatsappPhone =
    phone?.replace(/\D/g, "") || "";

  return (
    <div className="contact">
      <div className="contactIdentity">
        <div className="avatar">👤</div>

        <div>
          <strong>
            {name ||
              (ka
                ? "საკონტაქტო პირი"
                : "Emergency contact")}
          </strong>

          {relationship && (
            <p>{relationship}</p>
          )}

          {phone && (
            <span>{phone}</span>
          )}
        </div>
      </div>

      <div className="contactActions">
        {mobile && phone && (
          <a
            href={`tel:${phone}`}
            className="primaryAction"
          >
            📞 {ka ? "დარეკვა" : "Call"}
          </a>
        )}

        {whatsapp && phone && (
          <a
            href={`https://wa.me/${whatsappPhone}`}
            className="action"
          >
            WhatsApp
          </a>
        )}

        {liveChat && (
          <a
            href="/support"
            className="action"
          >
            Live Chat
          </a>
        )}
      </div>
    </div>
  );
}

function formatDate(
  value: string,
  lang: Lang
) {
  const date =
    new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    lang === "ka"
      ? "ka-GE"
      : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
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
        color: #1b3048;
        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }

      a {
        text-decoration: none;
      }

      button {
        font-family: inherit;
      }

      .page {
        min-height: 100vh;
      }

      .header {
        height: 64px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 24px;

        background: #ffffff;
        border-bottom: 1px solid #e3e9f0;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .logo {
        width: 36px;
        height: 36px;

        display: grid;
        place-items: center;

        border-radius: 9px;

        background: #1266e9;
        color: #ffffff;

        font-size: 9px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1c3048;
        font-size: 13px;
      }

      .brand small {
        margin-top: 2px;

        color: #8794a3;
        font-size: 7px;
        font-weight: 800;
        letter-spacing: 1px;
      }

      .languages {
        display: flex;
        gap: 4px;

        padding: 3px;

        border-radius: 9px;
        background: #f0f4f9;
      }

      .languages button {
        padding: 6px 9px;

        border: 0;
        border-radius: 7px;

        background: transparent;
        color: #778697;

        font-size: 8px;
        font-weight: 900;

        cursor: pointer;
      }

      .languages .activeLang {
        background: #1266e9;
        color: #ffffff;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 680px;

        margin: 0 auto;
        padding: 24px 0 45px;
      }

      .profileCard {
        overflow: hidden;

        border: 1px solid #dfe6ee;
        border-radius: 18px;

        background: #ffffff;

        box-shadow:
          0 14px 45px
          rgba(25, 48, 74, 0.06);
      }

      .identity {
        display: grid;
        grid-template-columns:
          72px 1fr auto;
        align-items: center;

        gap: 15px;

        padding: 20px 22px;
      }

      .photo,
      .photoPlaceholder {
        width: 72px;
        height: 72px;

        border-radius: 15px;
      }

      .photo {
        object-fit: cover;
      }

      .photoPlaceholder {
        display: grid;
        place-items: center;

        background: #edf5ff;
        color: #1266e9;

        font-size: 27px;
        font-weight: 900;
      }

      .emergencyLabel {
        color: #1266e9;

        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.1px;
      }

      .identityText h1 {
        margin: 5px 0 5px;

        color: #1d3149;

        font-size: 22px;
        line-height: 1.1;
      }

      .identityText p {
        margin: 0;

        color: #8794a2;
        font-size: 9px;
      }

      .call112Top {
        min-width: 90px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;

        padding: 10px 12px;

        border-radius: 11px;

        background: #1266e9;
        color: #ffffff;
      }

      .call112Top > span {
        font-size: 15px;
      }

      .call112Top small,
      .call112Top strong {
        display: block;
      }

      .call112Top small {
        font-size: 7px;
        opacity: 0.85;
      }

      .call112Top strong {
        margin-top: 1px;
        font-size: 17px;
      }

      .alert {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        margin: 0 22px 4px;
        padding: 12px 14px;

        border-radius: 11px;

        background: #f1f6fd;
        border: 1px solid #dbe8f9;
      }

      .alert > span {
        width: 22px;
        height: 22px;

        display: grid;
        place-items: center;

        flex: 0 0 22px;

        border-radius: 50%;

        background: #1266e9;
        color: #ffffff;

        font-size: 11px;
        font-weight: 900;
      }

      .alert strong {
        display: block;

        color: #263b53;
        font-size: 10px;
      }

      .alert p {
        margin: 4px 0 0;

        color: #637386;

        font-size: 10px;
        line-height: 1.5;
      }

      .section {
        padding: 20px 22px;

        border-top: 1px solid #e7ecf2;
      }

      .sectionTitle {
        display: flex;
        align-items: flex-start;
        gap: 10px;

        margin-bottom: 14px;
      }

      .sectionTitle > span {
        width: 25px;
        height: 25px;

        display: grid;
        place-items: center;

        flex: 0 0 25px;

        border-radius: 7px;

        background: #edf5ff;
        color: #1266e9;

        font-size: 8px;
        font-weight: 900;
      }

      .sectionTitle small {
        display: block;

        color: #96a2af;

        font-size: 6px;
        font-weight: 900;
        letter-spacing: 0.9px;
      }

      .sectionTitle h2 {
        margin: 2px 0 0;

        color: #253950;

        font-size: 15px;
      }

      .medicalGrid {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));

        gap: 8px;

        margin-bottom: 8px;
      }

      .info {
        min-height: 57px;

        padding: 11px 12px;

        border: 1px solid #e3e9f0;
        border-radius: 10px;

        background: #fbfcfe;
      }

      .info span {
        display: block;

        color: #8b98a6;

        font-size: 8px;
        font-weight: 700;
      }

      .info strong {
        display: block;

        margin-top: 4px;

        color: #293e56;

        font-size: 11px;
      }

      .info.emphasis {
        background: #edf5ff;
        border-color: #d7e6fa;
      }

      .info.emphasis strong {
        color: #1266e9;
        font-size: 15px;
      }

      .medicalRow {
        display: grid;
        grid-template-columns:
          145px 1fr;

        gap: 12px;

        padding: 10px 12px;

        border-top: 1px solid #edf0f4;
      }

      .medicalRow span {
        color: #758496;

        font-size: 9px;
        font-weight: 800;
      }

      .medicalRow p {
        margin: 0;

        color: #344960;

        font-size: 10px;
        line-height: 1.5;
      }

      .contact {
        padding: 14px;

        border: 1px solid #e2e8ef;
        border-radius: 12px;

        background: #fbfcfe;
      }

      .contactIdentity {
        display: flex;
        align-items: center;
        gap: 11px;
      }

      .avatar {
        width: 38px;
        height: 38px;

        display: grid;
        place-items: center;

        flex: 0 0 38px;

        border-radius: 10px;

        background: #edf5ff;

        font-size: 17px;
      }

      .contactIdentity strong {
        display: block;

        color: #263b53;
        font-size: 12px;
      }

      .contactIdentity p {
        margin: 3px 0 0;

        color: #8794a2;
        font-size: 9px;
      }

      .contactIdentity span {
        display: block;

        margin-top: 4px;

        color: #1266e9;

        font-size: 10px;
        font-weight: 800;
      }

      .contactActions {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;

        margin-top: 12px;
      }

      .primaryAction,
      .action {
        min-height: 34px;

        display: inline-flex;
        align-items: center;
        justify-content: center;

        padding: 0 13px;

        border-radius: 9px;

        font-size: 9px;
        font-weight: 850;
      }

      .primaryAction {
        background: #1266e9;
        color: #ffffff;
      }

      .action {
        background: #edf5ff;
        color: #1266e9;
      }

      .secondarySection {
        background: #fcfdff;
      }

      .emergencyFooter {
        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 15px;

        padding: 17px 22px;

        border-top: 1px solid #e4eaf1;

        background: #f6f9fd;
      }

      .emergencyFooter strong {
        display: block;

        color: #253a52;

        font-size: 11px;
      }

      .emergencyFooter p {
        margin: 3px 0 0;

        color: #8190a0;

        font-size: 8px;
      }

      .call112 {
        flex: 0 0 auto;

        padding: 10px 14px;

        border-radius: 10px;

        background: #1266e9;
        color: #ffffff;

        font-size: 9px;
        font-weight: 900;
      }

      .privacy {
        padding: 16px;

        text-align: center;
      }

      .privacy strong {
        color: #1266e9;

        font-size: 8px;
        letter-spacing: 1px;
      }

      .privacy p {
        max-width: 420px;

        margin: 5px auto 0;

        color: #98a4b1;

        font-size: 8px;
        line-height: 1.5;
      }

      .state {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 25px;

        background: #f4f7fb;

        text-align: center;
      }

      .state .logo {
        margin-bottom: 12px;
      }

      .state h1 {
        margin: 0;

        color: #1d3149;
        font-size: 22px;
      }

      .state p {
        color: #7f8c9a;
        font-size: 11px;
      }

      .state a {
        margin-top: 10px;

        color: #1266e9;

        font-size: 10px;
        font-weight: 800;
      }

      @media (max-width: 560px) {
        .header {
          height: 59px;
          padding: 0 14px;
        }

        .container {
          width: calc(100% - 16px);
          padding-top: 12px;
        }

        .profileCard {
          border-radius: 14px;
        }

        .identity {
          grid-template-columns:
            58px 1fr auto;

          gap: 10px;

          padding: 15px;
        }

        .photo,
        .photoPlaceholder {
          width: 58px;
          height: 58px;

          border-radius: 12px;
        }

        .photoPlaceholder {
          font-size: 22px;
        }

        .identityText h1 {
          font-size: 18px;
        }

        .call112Top {
          min-width: 70px;
          padding: 8px;
        }

        .call112Top > span {
          display: none;
        }

        .call112Top strong {
          font-size: 15px;
        }

        .alert {
          margin-left: 15px;
          margin-right: 15px;
        }

        .section {
          padding: 17px 15px;
        }

        .medicalGrid {
          grid-template-columns: 1fr 1fr;
        }

        .medicalRow {
          grid-template-columns: 1fr;
          gap: 4px;

          padding-left: 4px;
          padding-right: 4px;
        }

        .emergencyFooter {
          padding: 15px;

          align-items: flex-start;
          flex-direction: column;
        }

        .call112 {
          width: 100%;

          text-align: center;
        }
      }
    `}</style>
  );
}
