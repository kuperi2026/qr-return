"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type EmergencyProfile = {
  tag_code: string;

  first_name: string;
  last_name: string;

  country_code: string | null;

  date_of_birth: string | null;
  show_date_of_birth: boolean | null;

  personal_number: string | null;
  show_personal_number: boolean | null;

  address: string | null;
  show_address: boolean | null;

  medical_conditions: string | null;
  show_medical_conditions: boolean | null;

  additional_info: string | null;
  show_additional_info: boolean | null;

  emergency_contact_enabled: boolean | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;

  show_emergency_contact: boolean | null;

  emergency_contact_mobile_enabled: boolean | null;
  emergency_contact_whatsapp_enabled: boolean | null;
  emergency_contact_live_chat_enabled: boolean | null;

  active: boolean | null;
};

function emergencyNumber(countryCode: string | null) {
  if (countryCode === "GE") {
    return "112";
  }

  if (countryCode === "US") {
    return "911";
  }

  return null;
}

function countryName(
  countryCode: string | null,
  lang: Lang
) {
  if (countryCode === "GE") {
    return lang === "ka"
      ? "🇬🇪 საქართველო"
      : "🇬🇪 Georgia";
  }

  if (countryCode === "US") {
    return lang === "ka"
      ? "🇺🇸 ამერიკის შეერთებული შტატები"
      : "🇺🇸 United States";
  }

  return "";
}

function formatDate(
  value: string | null,
  lang: Lang
) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    lang === "ka" ? "ka-GE" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}

function cleanPhoneForWhatsApp(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export default function EmergencyPublicProfilePage() {
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

  const emergency = useMemo(
    () => emergencyNumber(profile?.country_code ?? null),
    [profile?.country_code]
  );

  useEffect(() => {
    if (!tag) {
      setLoading(false);
      setError(
        ka
          ? "QR კოდი ვერ მოიძებნა."
          : "QR code was not found."
      );
      return;
    }

    async function loadProfile() {
      setLoading(true);
      setError("");

      const { data, error: loadError } = await supabase
        .from("emergency_profiles")
        .select(`
          tag_code,
          first_name,
          last_name,
          country_code,

          date_of_birth,
          show_date_of_birth,

          personal_number,
          show_personal_number,

          address,
          show_address,

          medical_conditions,
          show_medical_conditions,

          additional_info,
          show_additional_info,

          emergency_contact_enabled,
          emergency_contact_name,
          emergency_contact_relationship,
          emergency_contact_phone,
          show_emergency_contact,

          emergency_contact_mobile_enabled,
          emergency_contact_whatsapp_enabled,
          emergency_contact_live_chat_enabled,

          active
        `)
        .eq("tag_code", tag)
        .maybeSingle();

      if (loadError) {
        setError(
          ka
            ? `პროფილის გახსნა ვერ მოხერხდა: ${loadError.message}`
            : `Could not open profile: ${loadError.message}`
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          ka
            ? "ამ QR კოდზე Emergency პროფილი არ არის რეგისტრირებული."
            : "No Emergency profile is registered for this QR code."
        );

        setLoading(false);
        return;
      }

      if (data.active === false) {
        setError(
          ka
            ? "ეს Emergency პროფილი ამჟამად არააქტიურია."
            : "This Emergency profile is currently inactive."
        );

        setLoading(false);
        return;
      }

      setProfile(data as EmergencyProfile);
      setLoading(false);
    }

    void loadProfile();
  }, [tag]);

  if (loading) {
    return (
      <main className="page">
        <Header
          lang={lang}
          setLang={setLang}
        />

        <section className="centerState">
          <div className="loader" />

          <h2>
            {ka
              ? "Emergency პროფილი იტვირთება..."
              : "Loading Emergency profile..."}
          </h2>
        </section>

        <Styles />
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="page">
        <Header
          lang={lang}
          setLang={setLang}
        />

        <section className="centerState">
          <div className="errorIcon">
            !
          </div>

          <h1>
            {ka
              ? "პროფილი ვერ მოიძებნა"
              : "Profile not found"}
          </h1>

          <p>
            {error}
          </p>

          <a
            href="/"
            className="homeLink"
          >
            {ka
              ? "მთავარ გვერდზე დაბრუნება"
              : "Return home"}
          </a>
        </section>

        <Styles />
      </main>
    );
  }

  const showContact =
    Boolean(profile.emergency_contact_enabled) &&
    Boolean(profile.show_emergency_contact) &&
    Boolean(
      profile.emergency_contact_name ||
      profile.emergency_contact_phone
    );

  const whatsappPhone =
    profile.emergency_contact_phone
      ? cleanPhoneForWhatsApp(
          profile.emergency_contact_phone
        )
      : "";

  return (
    <main className="page">
      <Header
        lang={lang}
        setLang={setLang}
      />

      <section className="container">
        <div className="emergencyBadge">
          <div className="cross">
            ✚
          </div>

          <div>
            <span>
              QR RETURN
            </span>

            <strong>
              EMERGENCY ID
            </strong>
          </div>
        </div>

        <section className="identityCard">
          <div className="statusRow">
            <span className="activeDot" />

            <span>
              {ka
                ? "აქტიური Emergency პროფილი"
                : "Active Emergency profile"}
            </span>
          </div>

          <h1>
            {profile.first_name}{" "}
            {profile.last_name}
          </h1>

          {profile.country_code && (
            <div className="country">
              {countryName(
                profile.country_code,
                lang
              )}
            </div>
          )}

          <p className="identityHelp">
            {ka
              ? "ეს ინფორმაცია დაკავშირებულია ამ ადამიანის Emergency QR სამაჯურთან."
              : "This information is linked to this person's Emergency QR bracelet."}
          </p>
        </section>

        {emergency && (
          <section className="emergencyCallCard">
            <div>
              <span className="smallLabel">
                {ka
                  ? "გადაუდებელი დახმარება"
                  : "Emergency services"}
              </span>

              <strong>
                {ka
                  ? `დარეკეთ ${emergency}-ზე`
                  : `Call ${emergency}`}
              </strong>

              <p>
                {ka
                  ? "სიცოცხლისთვის საშიშ ან გადაუდებელ სიტუაციაში პირველ რიგში დაუკავშირდით საგანგებო სამსახურს."
                  : "In a life-threatening or urgent situation, contact emergency services first."}
              </p>
            </div>

            <a
              href={`tel:${emergency}`}
              className="emergencyCallButton"
            >
              📞 {emergency}
            </a>
          </section>
        )}

        <div className="sectionHeading">
          <span>
            {ka
              ? "ადამიანის ინფორმაცია"
              : "Person information"}
          </span>
        </div>

        <section className="infoGrid">
          {profile.show_date_of_birth &&
            profile.date_of_birth && (
              <InfoCard
                icon="🎂"
                title={
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

          {profile.show_personal_number &&
            profile.personal_number && (
              <InfoCard
                icon="🪪"
                title={
                  ka
                    ? "პირადი / საიდენტიფიკაციო ნომერი"
                    : "Personal identification number"
                }
                value={
                  profile.personal_number
                }
              />
            )}

          {profile.show_address &&
            profile.address && (
              <InfoCard
                icon="📍"
                title={
                  ka
                    ? "მისამართი"
                    : "Address"
                }
                value={
                  profile.address
                }
              />
            )}
        </section>

        {profile.show_medical_conditions &&
          profile.medical_conditions && (
            <section className="importantCard">
              <div className="importantIcon">
                +
              </div>

              <div>
                <span>
                  {ka
                    ? "ქრონიკული დაავადებები"
                    : "Chronic conditions"}
                </span>

                <p>
                  {
                    profile.medical_conditions
                  }
                </p>
              </div>
            </section>
          )}

        {profile.show_additional_info &&
          profile.additional_info && (
            <section className="additionalCard">
              <span>
                {ka
                  ? "დამატებითი ინფორმაცია"
                  : "Additional information"}
              </span>

              <p>
                {
                  profile.additional_info
                }
              </p>
            </section>
          )}

        {showContact && (
          <>
            <div className="sectionHeading">
              <span>
                {ka
                  ? "საკონტაქტო პირი"
                  : "Emergency contact"}
              </span>
            </div>

            <section className="contactCard">
              <div className="contactPerson">
                <div className="contactAvatar">
                  👤
                </div>

                <div>
                  <h2>
                    {profile.emergency_contact_name ||
                      (ka
                        ? "საკონტაქტო პირი"
                        : "Emergency contact")}
                  </h2>

                  {profile.emergency_contact_relationship && (
                    <p>
                      {ka
                        ? "კავშირი პირთან: "
                        : "Relationship: "}
                      <strong>
                        {
                          profile.emergency_contact_relationship
                        }
                      </strong>
                    </p>
                  )}

                  {profile.emergency_contact_phone && (
                    <p className="phoneText">
                      {
                        profile.emergency_contact_phone
                      }
                    </p>
                  )}
                </div>
              </div>

              <div className="contactActions">
                {profile.emergency_contact_mobile_enabled &&
                  profile.emergency_contact_phone && (
                    <a
                      className="contactButton"
                      href={`tel:${profile.emergency_contact_phone}`}
                    >
                      <span>
                        📞
                      </span>

                      <strong>
                        {ka
                          ? "დარეკვა"
                          : "Call"}
                      </strong>
                    </a>
                  )}

                {profile.emergency_contact_whatsapp_enabled &&
                  whatsappPhone && (
                    <a
                      className="contactButton whatsapp"
                      href={`https://wa.me/${whatsappPhone}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        🟢
                      </span>

                      <strong>
                        WhatsApp
                      </strong>
                    </a>
                  )}

                {profile.emergency_contact_live_chat_enabled && (
                  <a
                    className="contactButton chat"
                    href={`/emergency/chat/${encodeURIComponent(
                      profile.tag_code
                    )}`}
                  >
                    <span>
                      💬
                    </span>

                    <strong>
                      Live Chat
                    </strong>
                  </a>
                )}
              </div>

              <div className="contactNote">
                {ka
                  ? "ეს პირი მითითებულია Emergency პროფილში საკონტაქტო პირად."
                  : "This person is listed as the Emergency contact for this profile."}
              </div>
            </section>
          </>
        )}

        <section className="safetyNote">
          <strong>
            ⚕{" "}
            {ka
              ? "მნიშვნელოვანი"
              : "Important"}
          </strong>

          <p>
            {ka
              ? "QR RETURN Emergency პროფილში მოცემული ინფორმაცია მომხმარებლის მიერ არის შეყვანილი. გადაუდებელ სიტუაციაში გამოიყენეთ შესაბამისი საგანგებო სამსახური."
              : "Information in this QR RETURN Emergency profile is provided by the user. In an emergency, use the appropriate emergency service."}
          </p>
        </section>

        <footer className="footer">
          <strong>
            QR RETURN
          </strong>

          <span>
            Emergency ID
          </span>
        </footer>
      </section>

      <Styles />
    </main>
  );
}

function Header({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (
    lang: Lang
  ) => void;
}) {
  return (
    <header className="header">
      <a
        href="/"
        className="brand"
      >
        <div className="brandLogo">
          QR
        </div>

        <div>
          <strong>
            QR RETURN
          </strong>

          <small>
            EMERGENCY ID
          </small>
        </div>
      </a>

      <div className="languages">
        <button
          type="button"
          className={
            lang === "ka"
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
            lang === "en"
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
  );
}

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="infoCard">
      <div className="infoIcon">
        {icon}
      </div>

      <div>
        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>
      </div>
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
        background: #f6f8fb;
      }

      button,
      a {
        -webkit-tap-highlight-color: transparent;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 100% 0%,
            rgba(21, 94, 239, 0.09),
            transparent 27%
          ),
          #f6f8fb;
        color: #101828;
        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }

      .header {
        width: calc(100% - 28px);
        max-width: 760px;
        min-height: 76px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .brandLogo {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #155eef;
        color: #ffffff;
        font-size: 11px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #155eef;
        font-size: 19px;
        font-weight: 900;
      }

      .brand small {
        display: block;
        margin-top: 2px;
        color: #d92d20;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: #ffffff;
        color: #155eef;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 660px;
        margin: auto;
        padding: 38px 0 70px;
      }

      .emergencyBadge {
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        gap: 11px;
      }

      .cross {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border: 1px solid #fecdca;
        border-radius: 13px;
        background: #fff1f0;
        color: #d92d20;
        font-size: 23px;
        font-weight: 900;
      }

      .emergencyBadge span,
      .emergencyBadge strong {
        display: block;
      }

      .emergencyBadge span {
        color: #155eef;
        font-size: 15px;
        font-weight: 900;
      }

      .emergencyBadge strong {
        margin-top: 2px;
        color: #d92d20;
        font-size: 9px;
        letter-spacing: 1.8px;
      }

      .identityCard {
        padding: 27px 24px;
        border: 1px solid #e4e7ec;
        border-top: 4px solid #155eef;
        border-radius: 20px;
        background: #ffffff;
        box-shadow:
          0 12px 35px
          rgba(16, 24, 40, 0.06);
      }

      .statusRow {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #067647;
        font-size: 11px;
        font-weight: 800;
      }

      .activeDot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #12b76a;
      }

      .identityCard h1 {
        margin: 13px 0 8px;
        font-size: 35px;
        line-height: 1.1;
        letter-spacing: -0.8px;
      }

      .country {
        color: #475467;
        font-size: 13px;
        font-weight: 700;
      }

      .identityHelp {
        margin: 15px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .emergencyCallCard {
        margin-top: 16px;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border: 1px solid #fecdca;
        border-radius: 18px;
        background:
          linear-gradient(
            135deg,
            #fff1f0,
            #fff8f7
          );
      }

      .smallLabel {
        display: block;
        margin-bottom: 5px;
        color: #b42318;
        font-size: 10px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.2px;
      }

      .emergencyCallCard strong {
        display: block;
        color: #b42318;
        font-size: 20px;
      }

      .emergencyCallCard p {
        max-width: 380px;
        margin: 6px 0 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.5;
      }

      .emergencyCallButton {
        min-width: 112px;
        min-height: 58px;
        padding: 0 17px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 13px;
        background: #d92d20;
        color: #ffffff;
        text-decoration: none;
        font-size: 18px;
        font-weight: 900;
        box-shadow:
          0 8px 20px
          rgba(217, 45, 32, 0.2);
      }

      .sectionHeading {
        margin: 29px 0 11px;
      }

      .sectionHeading span {
        color: #475467;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.1px;
        text-transform: uppercase;
      }

      .infoGrid {
        display: grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
        gap: 10px;
      }

      .infoCard {
        min-height: 91px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #e4e7ec;
        border-radius: 15px;
        background: #ffffff;
      }

      .infoIcon {
        width: 41px;
        height: 41px;
        flex: 0 0 41px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #f2f7ff;
        font-size: 19px;
      }

      .infoCard span,
      .infoCard strong {
        display: block;
      }

      .infoCard span {
        margin-bottom: 5px;
        color: #667085;
        font-size: 11px;
      }

      .infoCard strong {
        color: #344054;
        font-size: 14px;
        line-height: 1.4;
        word-break: break-word;
      }

      .importantCard {
        margin-top: 10px;
        padding: 18px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border: 1px solid #fedf89;
        border-radius: 16px;
        background: #fffaeb;
      }

      .importantIcon {
        width: 40px;
        height: 40px;
        flex: 0 0 40px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #f79009;
        color: #ffffff;
        font-size: 22px;
        font-weight: 900;
      }

      .importantCard span,
      .additionalCard span {
        display: block;
        color: #344054;
        font-size: 12px;
        font-weight: 900;
      }

      .importantCard p,
      .additionalCard p {
        margin: 7px 0 0;
        color: #475467;
        font-size: 14px;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .additionalCard {
        margin-top: 10px;
        padding: 18px;
        border: 1px solid #e4e7ec;
        border-radius: 16px;
        background: #ffffff;
      }

      .contactCard {
        padding: 20px;
        border: 1px solid #d6e4ff;
        border-radius: 18px;
        background: #ffffff;
        box-shadow:
          0 8px 24px
          rgba(16, 24, 40, 0.045);
      }

      .contactPerson {
        display: flex;
        align-items: center;
        gap: 13px;
      }

      .contactAvatar {
        width: 50px;
        height: 50px;
        flex: 0 0 50px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #f2f7ff;
        font-size: 24px;
      }

      .contactPerson h2 {
        margin: 0;
        color: #101828;
        font-size: 19px;
      }

      .contactPerson p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 12px;
      }

      .phoneText {
        color: #155eef !important;
        font-weight: 800;
      }

      .contactActions {
        margin-top: 18px;
        display: grid;
        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          );
        gap: 8px;
      }

      .contactButton {
        min-height: 61px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        border: 1px solid #d6e4ff;
        border-radius: 12px;
        background: #f5f8ff;
        color: #155eef;
        text-decoration: none;
        font-size: 12px;
      }

      .contactButton span {
        font-size: 18px;
      }

      .contactButton.whatsapp {
        border-color: #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .contactButton.chat {
        border-color: #d9d6fe;
        background: #f4f3ff;
        color: #5925dc;
      }

      .contactNote {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px solid #eaecf0;
        color: #667085;
        font-size: 11px;
        line-height: 1.5;
      }

      .safetyNote {
        margin-top: 24px;
        padding: 16px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: #f9fafb;
      }

      .safetyNote strong {
        color: #344054;
        font-size: 12px;
      }

      .safetyNote p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .footer {
        padding: 34px 0 0;
        text-align: center;
      }

      .footer strong,
      .footer span {
        display: block;
      }

      .footer strong {
        color: #155eef;
        font-size: 13px;
      }

      .footer span {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 10px;
      }

      .centerState {
        width: calc(100% - 24px);
        max-width: 520px;
        margin: auto;
        padding: 120px 0;
        text-align: center;
      }

      .centerState h1,
      .centerState h2 {
        margin: 15px 0 8px;
      }

      .centerState p {
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .loader {
        width: 42px;
        height: 42px;
        margin: auto;
        border: 4px solid #e4e7ec;
        border-top-color: #155eef;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .errorIcon {
        width: 62px;
        height: 62px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #fff1f0;
        color: #d92d20;
        font-size: 27px;
        font-weight: 900;
      }

      .homeLink {
        min-height: 48px;
        margin-top: 18px;
        padding: 0 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        background: #155eef;
        color: #ffffff;
        text-decoration: none;
        font-size: 12px;
        font-weight: 900;
      }

      @media (max-width: 580px) {
        .container {
          padding-top: 27px;
        }

        .identityCard {
          padding: 22px 18px;
        }

        .identityCard h1 {
          font-size: 29px;
        }

        .emergencyCallCard {
          align-items: stretch;
          flex-direction: column;
        }

        .emergencyCallButton {
          width: 100%;
        }

        .infoGrid {
          grid-template-columns: 1fr;
        }

        .contactActions {
          grid-template-columns: 1fr;
        }

        .contactButton {
          min-height: 52px;
          flex-direction: row;
        }
      }
    `}</style>
  );
}
