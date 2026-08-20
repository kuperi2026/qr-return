"use client";

import EmergencyScanTracker from "@/components/EmergencyScanTracker";
import EmergencyLocationShare from "@/components/EmergencyLocationShare";

type Privacy = {
  show_name?: boolean;
  show_date_of_birth?: boolean;
  show_blood_type?: boolean;
  show_allergies?: boolean;
  show_medications?: boolean;
  show_medical_info?: boolean;

  show_emergency_contact?: boolean;
  show_secondary_contact?: boolean;
  show_doctor?: boolean;

  allow_call?: boolean;
  allow_email?: boolean;
};

export type EmergencyProfileData = {
  first_name?: string | null;
  last_name?: string | null;

  date_of_birth?: string | null;
  blood_type?: string | null;

  allergies?: string | null;
  medications?: string | null;
  medical_info?: string | null;

  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;

  secondary_contact_name?: string | null;
  secondary_contact_phone?: string | null;

  doctor_name?: string | null;
  doctor_phone?: string | null;

  privacy?: Privacy;
};

type Props = {
  itemId?: string;

  currentScanCount?: number | null;

  data: EmergencyProfileData;

  tagCode?: string | null;

  ownerEmail?: string | null;

  finderMessage?: string | null;

  photo?: string | null;

  language?: "ka" | "en";
};

export default function EmergencyPublicProfile({
  itemId,
  data,
  tagCode,
  ownerEmail,
  finderMessage,
  photo,
  language = "ka",
}: Props) {
  const ka = language === "ka";

  const privacy =
    data.privacy || {};

  const fullName = [
    data.first_name,
    data.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const showName =
    privacy.show_name !== false;

  const showDob =
    privacy.show_date_of_birth !== false;

  const showBlood =
    privacy.show_blood_type !== false;

  const showAllergies =
    privacy.show_allergies !== false;

  const showMedications =
    privacy.show_medications !== false;

  const showMedical =
    privacy.show_medical_info !== false;

  const showPrimary =
    privacy.show_emergency_contact !== false;

  const showSecondary =
    privacy.show_secondary_contact === true;

  const showDoctor =
    privacy.show_doctor === true;

  const allowCall =
    privacy.allow_call !== false;

  const allowEmail =
    privacy.allow_email === true;

  return (
    <main className="page">
      {itemId && tagCode && (
        <EmergencyScanTracker
          itemId={itemId}
          tagCode={tagCode}
        />
      )}

      <div className="shell">
        <header className="brand">
          <div className="brandMark">
            <MedicalIcon />
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <span>
              EMERGENCY ID
            </span>
          </div>
        </header>

        <section className="alert">
          <div className="alertIcon">
            <MedicalIcon />
          </div>

          <div>
            <span>
              EMERGENCY INFORMATION
            </span>

            <strong>
              {ka
                ? "მნიშვნელოვანი ინფორმაცია დახმარებისთვის"
                : "Important information for assistance"}
            </strong>
          </div>
        </section>

        <section className="profile">
          <div className="photo">
            {photo ? (
              <img
                src={photo}
                alt={
                  fullName ||
                  "Emergency ID"
                }
              />
            ) : (
              <div className="placeholder">
                <PersonIcon />
              </div>
            )}
          </div>

          <div className="identity">
            <span className="type">
              QR RETURN EMERGENCY ID
            </span>

            <h1>
              {showName &&
              fullName
                ? fullName
                : "Emergency ID"}
            </h1>

            {tagCode && (
              <span className="tag">
                QR · {tagCode}
              </span>
            )}
          </div>
        </section>

        {finderMessage && (
          <section className="message">
            <span>
              {ka
                ? "მნიშვნელოვანი შეტყობინება"
                : "Important Message"}
            </span>

            <p>
              {finderMessage}
            </p>
          </section>
        )}

        {itemId &&
          tagCode && (
            <EmergencyLocationShare
              itemId={itemId}
              tagCode={tagCode}
              language={language}
            />
          )}

        <section className="medicalGrid">
          {showDob &&
            data.date_of_birth && (
              <InfoCard
                label={
                  ka
                    ? "დაბადების თარიღი"
                    : "Date of Birth"
                }
                value={formatDate(
                  data.date_of_birth
                )}
              />
            )}

          {showBlood &&
            data.blood_type && (
              <InfoCard
                label={
                  ka
                    ? "სისხლის ჯგუფი"
                    : "Blood Type"
                }
                value={
                  data.blood_type
                }
                important
              />
            )}

          {showAllergies &&
            data.allergies && (
              <InfoCard
                label={
                  ka
                    ? "ალერგიები"
                    : "Allergies"
                }
                value={
                  data.allergies
                }
                important
              />
            )}

          {showMedications &&
            data.medications && (
              <InfoCard
                label={
                  ka
                    ? "მედიკამენტები"
                    : "Medications"
                }
                value={
                  data.medications
                }
              />
            )}
        </section>

        {showMedical &&
          data.medical_info && (
            <section className="detail">
              <span>
                {ka
                  ? "მნიშვნელოვანი სამედიცინო ინფორმაცია"
                  : "Important Medical Information"}
              </span>

              <p>
                {data.medical_info}
              </p>
            </section>
          )}

        {showPrimary &&
          data.emergency_contact_phone && (
            <ContactCard
              eyebrow={
                ka
                  ? "მთავარი Emergency Contact"
                  : "Primary Emergency Contact"
              }
              name={
                data.emergency_contact_name ||
                "Emergency Contact"
              }
              phone={
                data.emergency_contact_phone
              }
              allowCall={
                allowCall
              }
              language={
                language
              }
            />
          )}

        {showSecondary &&
          data.secondary_contact_phone && (
            <ContactCard
              eyebrow={
                ka
                  ? "დამატებითი Emergency Contact"
                  : "Secondary Emergency Contact"
              }
              name={
                data.secondary_contact_name ||
                (ka
                  ? "დამატებითი კონტაქტი"
                  : "Secondary Contact")
              }
              phone={
                data.secondary_contact_phone
              }
              allowCall={
                allowCall
              }
              language={
                language
              }
            />
          )}

        {showDoctor &&
          (data.doctor_name ||
            data.doctor_phone) && (
            <ContactCard
              eyebrow={
                ka
                  ? "ექიმი / კლინიკა"
                  : "Doctor / Clinic"
              }
              name={
                data.doctor_name ||
                (ka
                  ? "ექიმი"
                  : "Doctor")
              }
              phone={
                data.doctor_phone ||
                ""
              }
              allowCall={
                allowCall
              }
              language={
                language
              }
            />
          )}

        {allowEmail &&
          ownerEmail && (
            <section className="emailCard">
              <div>
                <span>
                  EMAIL
                </span>

                <strong>
                  {ownerEmail}
                </strong>
              </div>

              <a
                href={`mailto:${ownerEmail}`}
              >
                {ka
                  ? "Email-ის გაგზავნა"
                  : "Send Email"}
              </a>
            </section>
          )}

        <section className="notice">
          <ShieldIcon />

          <p>
            {ka
              ? "ეს ინფორმაცია ნაჩვენებია QR პროფილის მფლობელის მიერ არჩეული Privacy პარამეტრების მიხედვით. QR RETURN აჩვენებს მხოლოდ იმ ინფორმაციას, რომლის გაზიარებაც მფლობელმა დაუშვა."
              : "This information is displayed according to the profile owner's privacy settings. QR RETURN only shows information the owner has chosen to share."}
          </p>
        </section>

        <section className="disclaimer">
          <span>
            +
          </span>

          <p>
            {ka
              ? "Emergency ID-ზე მითითებული ინფორმაცია არ ცვლის პროფესიულ სამედიცინო შეფასებას ან გადაუდებელ სამედიცინო დახმარებას."
              : "Information shown on this Emergency ID does not replace professional medical evaluation or emergency medical care."}
          </p>
        </section>

        <footer>
          <div>
            <strong>
              QR RETURN
            </strong>

            <span>
              Emergency ID
            </span>
          </div>

          <a href="/">
            {ka
              ? "მთავარი"
              : "Home"}{" "}
            →
          </a>
        </footer>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 30px 0 60px;
          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 28px);
          max-width: 650px;
          margin: 0 auto;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .brandMark {
          width: 40px;
          height: 40px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: white;
          background: #c84a50;
        }

        .brandMark :global(svg) {
          width: 20px;
          height: 20px;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand strong {
          color: #202b37;
          font-size: 13px;
          font-weight: 900;
        }

        .brand span {
          margin-top: 2px;

          color: #9b4b50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .alert {
          margin-top: 24px;
          padding: 14px;

          display: flex;
          align-items: center;
          gap: 11px;

          border: 1px solid #edd6d8;
          border-radius: 13px;

          background: #fff5f5;
        }

        .alertIcon {
          width: 41px;
          height: 41px;

          flex: 0 0 41px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          color: white;
          background: #c84a50;
        }

        .alertIcon :global(svg) {
          width: 19px;
          height: 19px;
        }

        .alert span,
        .alert strong {
          display: block;
        }

        .alert span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .alert strong {
          margin-top: 4px;

          color: #4a3638;
          font-size: 10px;
        }

        .profile {
          margin-top: 13px;
          padding: 18px;

          display: grid;

          grid-template-columns:
            90px minmax(0, 1fr);

          align-items: center;

          gap: 16px;

          border: 1px solid #e0e5e8;
          border-radius: 15px;

          background: white;
        }

        .photo {
          width: 90px;
          height: 90px;

          overflow: hidden;

          border-radius: 15px;

          background: #f0f2f4;
        }

        .photo img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          color: #9ca5ad;
        }

        .placeholder :global(svg) {
          width: 39px;
          height: 39px;
        }

        .identity {
          min-width: 0;
        }

        .type {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        h1 {
          margin: 5px 0 0;

          color: #28343f;

          font-size: 25px;
          line-height: 1.1;

          overflow-wrap: anywhere;
        }

        .tag {
          display: inline-block;

          margin-top: 8px;

          padding: 5px 7px;

          border-radius: 999px;

          color: #67737e;
          background: #f0f3f5;

          font-size: 6px;
          font-weight: 900;
        }

        .message {
          margin-top: 12px;
          padding: 16px;

          border-radius: 13px;

          color: white;
          background: #c84a50;
        }

        .message span {
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.8px;
        }

        .message p {
          margin: 7px 0 0;

          font-size: 10px;
          line-height: 1.65;
        }

        .medicalGrid {
          margin-top: 12px;

          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        .detail {
          margin-top: 10px;
          padding: 15px;

          border: 1px solid #e0e5e8;
          border-radius: 12px;

          background: white;
        }

        .detail span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .detail p {
          margin: 6px 0 0;

          color: #596672;

          font-size: 9px;
          line-height: 1.65;

          white-space: pre-wrap;
        }

        .emailCard {
          margin-top: 10px;
          padding: 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border: 1px solid #e0e5e8;
          border-radius: 12px;

          background: white;
        }

        .emailCard span,
        .emailCard strong {
          display: block;
        }

        .emailCard span {
          color: #99a2aa;

          font-size: 6px;
          font-weight: 900;
        }

        .emailCard strong {
          margin-top: 4px;

          color: #45515d;

          font-size: 9px;

          overflow-wrap: anywhere;
        }

        .emailCard a {
          min-height: 36px;

          padding: 0 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          border-radius: 8px;

          color: white;
          background: #202b37;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        .notice {
          margin-top: 14px;
          padding: 14px;

          display: grid;

          grid-template-columns:
            auto 1fr;

          gap: 9px;

          color: #78838e;
          background: #eef1f3;

          border-radius: 11px;
        }

        .notice :global(svg) {
          width: 18px;
          height: 18px;
        }

        .notice p {
          margin: 0;

          font-size: 7px;
          line-height: 1.55;
        }

        .disclaimer {
          margin-top: 8px;
          padding: 12px;

          display: grid;

          grid-template-columns:
            auto 1fr;

          gap: 9px;

          border: 1px solid #ece2e3;
          border-radius: 10px;

          color: #7f6d6f;
          background: #fffafa;
        }

        .disclaimer span {
          width: 20px;
          height: 20px;

          display: grid;
          place-items: center;

          border-radius: 6px;

          color: white;
          background: #c84a50;

          font-size: 12px;
          font-weight: 900;
        }

        .disclaimer p {
          margin: 0;

          font-size: 7px;
          line-height: 1.55;
        }

        footer {
          margin-top: 23px;
          padding-top: 16px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border-top: 1px solid #dfe4e8;
        }

        footer strong,
        footer span {
          display: block;
        }

        footer strong {
          color: #35414c;
          font-size: 8px;
        }

        footer span {
          margin-top: 2px;

          color: #999fa6;
          font-size: 7px;
        }

        footer a {
          color: #56626d;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        @media (max-width: 520px) {
          .profile {
            grid-template-columns:
              72px minmax(0, 1fr);
          }

          .photo {
            width: 72px;
            height: 72px;
          }

          h1 {
            font-size: 21px;
          }

          .medicalGrid {
            grid-template-columns: 1fr;
          }

          .emailCard {
            align-items: stretch;
            flex-direction: column;
          }

          .emailCard a {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

function InfoCard({
  label,
  value,
  important = false,
}: {
  label: string;
  value: string;
  important?: boolean;
}) {
  return (
    <article
      className={
        important
          ? "card important"
          : "card"
      }
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .card {
          min-height: 90px;
          padding: 14px;

          border: 1px solid #e0e5e8;
          border-radius: 12px;

          background: white;
        }

        .important {
          border-color: #edd5d7;
          background: #fff7f7;
        }

        span {
          color: #969fa8;

          font-size: 6px;
          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 9px;

          color: #3f4b56;

          font-size: 11px;
          line-height: 1.45;

          overflow-wrap: anywhere;
        }

        .important strong {
          color: #9d4147;
        }
      `}</style>
    </article>
  );
}

function ContactCard({
  eyebrow,
  name,
  phone,
  allowCall,
  language,
}: {
  eyebrow: string;
  name: string;
  phone: string;
  allowCall: boolean;
  language: "ka" | "en";
}) {
  const ka =
    language === "ka";

  const cleanPhone =
    phone.replace(
      /[^\d+]/g,
      ""
    );

  return (
    <section className="contact">
      <div>
        <span>
          {eyebrow}
        </span>

        <strong>
          {name}
        </strong>

        {phone && (
          <small>
            {phone}
          </small>
        )}
      </div>

      {phone &&
        allowCall && (
          <a
            href={`tel:${cleanPhone}`}
          >
            ☎{" "}
            {ka
              ? "დარეკვა"
              : "Call"}
          </a>
        )}

      <style jsx>{`
        .contact {
          margin-top: 10px;
          padding: 15px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border: 1px solid #e0e5e8;
          border-radius: 12px;

          background: white;
        }

        span,
        strong,
        small {
          display: block;
        }

        span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        strong {
          margin-top: 5px;

          color: #3e4a55;
          font-size: 11px;
        }

        small {
          margin-top: 4px;

          color: #7f8993;
          font-size: 8px;
        }

        a {
          min-width: 86px;
          min-height: 39px;

          padding: 0 11px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex: 0 0 auto;

          border-radius: 9px;

          color: white;
          background: #c84a50;

          text-decoration: none;

          font-size: 8px;
          font-weight: 850;
        }

        @media (max-width: 470px) {
          .contact {
            align-items: stretch;
            flex-direction: column;
          }

          a {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

function formatDate(
  value: string
) {
  try {
    return new Date(
      `${value}T00:00:00`
    ).toLocaleDateString();
  } catch {
    return value;
  }
}

function MedicalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M12 2.5 19 6v5.3c0 4.7-2.4 7.8-7 10.2-4.6-2.4-7-5.5-7-10.2V6z" />

      <path d="m8.8 12 2.1 2.1 4.5-4.5" />
    </svg>
  );
}
