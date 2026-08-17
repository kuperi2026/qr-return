"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type CategoryKey =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "suitcase"
  | "bag";

type Lang = "ka" | "en";

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    pet: true,
  },
  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    pet: true,
  },
  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    pet: false,
  },
  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    pet: false,
  },
  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    pet: false,
  },
  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    pet: false,
  },
} satisfies Record<
  CategoryKey,
  {
    icon: string;
    ka: string;
    en: string;
    pet: boolean;
  }
>;

export default function RegistrationDetailsPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const type: CategoryKey =
    rawType && rawType in categories
      ? (rawType as CategoryKey)
      : "dog";

  const category = categories[type];

  const [lang, setLang] = useState<Lang>("ka");
  const [lostMode, setLostMode] = useState(false);
  const [photoName, setPhotoName] = useState("");

  const ka = lang === "ka";

  return (
    <main className="page">
      {/* HEADER */}
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">
              SMART LOST & FOUND
            </div>
          </div>
        </a>

        <div className="headerActions">
          <a href="/register" className="backLink">
            ← {ka ? "უკან" : "Back"}
          </a>

          <div className="language">
            <button
              type="button"
              className={ka ? "selected" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "selected" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      {/* INTRO */}
      <section className="intro">
        <div className="categoryIcon">
          {category.icon}
        </div>

        <div className="introText">
          <div className="eyebrow">
            QR RETURN
          </div>

          <h1>
            {ka
              ? "შეავსეთ ინფორმაცია, რომელიც დაკარგვის შემთხვევაში მპოვნელს თქვენთან დაკავშირებას გაუმარტივებს."
              : "Add the information that will make it easier for a finder to contact you if your pet or item is lost."}
          </h1>
        </div>
      </section>

      <form
        className="form"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* QR */}
        <section className="panel">
          <SectionTitle
            number="01"
            title={ka ? "QR ინფორმაცია" : "QR information"}
          />

          <div className="fieldsGrid">
            <Field
              label={ka ? "QR კოდი" : "QR code"}
              name="tag_code"
              placeholder="LF-XXXXXX"
              required
            />
          </div>
        </section>

        {/* BASIC */}
        <section className="panel">
          <SectionTitle
            number="02"
            title={
              ka
                ? "ძირითადი ინფორმაცია"
                : "Basic information"
            }
          />

          <div className="fieldsGrid">
            <div className="field full">
              <label>
                {ka ? "ფოტო" : "Photo"}
              </label>

              <label className="uploadBox">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoName(
                      e.target.files?.[0]?.name || ""
                    )
                  }
                />

                <span className="uploadIcon">＋</span>

                <strong>
                  {photoName ||
                    (ka
                      ? "ფოტოს არჩევა"
                      : "Choose photo")}
                </strong>

                <small>JPG / PNG</small>
              </label>
            </div>

            {category.pet && (
              <>
                <Field
                  label={ka ? "ჯიში" : "Breed"}
                  name="breed"
                  placeholder={
                    ka
                      ? "მაგ: Golden Retriever"
                      : "Example: Golden Retriever"
                  }
                />

                <div className="field">
                  <label>
                    {ka ? "სქესი" : "Sex"}
                  </label>

                  <select name="sex">
                    <option value="">
                      {ka ? "აირჩიეთ" : "Select"}
                    </option>

                    <option value="male">
                      {ka ? "მამრობითი" : "Male"}
                    </option>

                    <option value="female">
                      {ka ? "მდედრობითი" : "Female"}
                    </option>
                  </select>
                </div>

                <Field
                  label={
                    ka
                      ? "დაბადების თარიღი"
                      : "Date of birth"
                  }
                  name="date_of_birth"
                  type="date"
                />

                <Field
                  label={ka ? "წონა" : "Weight"}
                  name="weight"
                  type="number"
                  placeholder="12.5"
                />
              </>
            )}

            <Field
              label={ka ? "ფერი" : "Colour"}
              name="colour"
              placeholder={
                ka
                  ? "მიუთითეთ ფერი"
                  : "Enter colour"
              }
            />

            <div className="field full">
              <label>
                {ka ? "აღწერა" : "Description"}
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder={
                  ka
                    ? "აღწერეთ ნივთი ან ცხოველი..."
                    : "Describe the pet or item..."
                }
              />
            </div>

            {category.pet && (
              <div className="field full">
                <label>
                  {ka
                    ? "სამედიცინო ინფორმაცია"
                    : "Medical information"}
                </label>

                <textarea
                  name="medical_info"
                  rows={4}
                  placeholder={
                    ka
                      ? "მნიშვნელოვანი სამედიცინო ინფორმაცია..."
                      : "Important medical information..."
                  }
                />
              </div>
            )}
          </div>
        </section>

        {/* OWNER */}
        <section className="panel">
          <SectionTitle
            number="03"
            title={
              ka
                ? "მფლობელის ინფორმაცია"
                : "Owner information"
            }
          />

          <div className="fieldsGrid">
            <Field
              label={
                ka
                  ? "მფლობელის სახელი"
                  : "Owner name"
              }
              name="owner_name"
              placeholder={
                ka
                  ? "სახელი და გვარი"
                  : "Full name"
              }
              required
            />

            <Field
              label={
                ka
                  ? "მფლობელის ელფოსტა"
                  : "Owner email"
              }
              name="owner_email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
        </section>

        {/* FINDER */}
        <section className="panel">
          <SectionTitle
            number="04"
            title={
              ka
                ? "ინფორმაცია მპოვნელისთვის"
                : "Finder information"
            }
          />

          <div className="fieldsGrid">
            <Field
              label={
                ka
                  ? "მპოვნელის ჯილდო"
                  : "Finder reward"
              }
              name="reward"
              type="number"
              placeholder="0"
            />

            <div className="field full">
              <label>
                {ka
                  ? "შეტყობინება მპოვნელისთვის"
                  : "Message for finder"}
              </label>

              <textarea
                name="finder_message"
                rows={4}
                placeholder={
                  ka
                    ? "მაგ: გთხოვთ დამიკავშირდეთ..."
                    : "Example: Please contact me..."
                }
              />
            </div>

            <div className="field full">
              <label>
                {ka
                  ? "შეტყობინება დაკარგვის შემთხვევაში"
                  : "Lost message"}
              </label>

              <textarea
                name="lost_message"
                rows={4}
                placeholder={
                  ka
                    ? "ტექსტი, რომელიც გამოჩნდება Lost Mode-ის დროს..."
                    : "Message displayed while Lost Mode is active..."
                }
              />
            </div>

            <div className="field full">
              <button
                type="button"
                className={
                  lostMode
                    ? "lostMode active"
                    : "lostMode"
                }
                onClick={() =>
                  setLostMode(!lostMode)
                }
              >
                <div>
                  <strong>⚠️ Lost Mode</strong>

                  <p>
                    {ka
                      ? "გააქტიურეთ დაკარგვის შემთხვევაში."
                      : "Activate when the pet or item is lost."}
                  </p>
                </div>

                <span>
                  {lostMode ? "ON" : "OFF"}
                </span>
              </button>

              <input
                type="hidden"
                name="lost_mode"
                value={lostMode ? "true" : "false"}
              />
            </div>
          </div>
        </section>

        {/* SUBMIT */}
        <section className="submitPanel">
          <div>
            <div className="submitLabel">
              QR RETURN
            </div>

            <h2>
              {ka
                ? "ინფორმაცია მზადაა."
                : "Your information is ready."}
            </h2>
          </div>

          <button type="submit">
            {ka
              ? "რეგისტრაციის დასრულება"
              : "Complete registration"}{" "}
            →
          </button>
        </section>
      </form>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f5f7fb;
          color: #0b1729;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* HEADER */

        .header {
          width: 100%;
          max-width: 1120px;
          min-height: 84px;
          margin: auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brandMark {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #1465e8;
          color: #fff;
          font-size: 14px;
          font-weight: 950;
        }

        .brandName {
          color: #1465e8;
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -0.8px;
        }

        .brandSub {
          margin-top: 4px;
          color: #8b96a7;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .headerActions,
        .language {
          display: flex;
          align-items: center;
        }

        .headerActions {
          gap: 12px;
        }

        .backLink {
          color: #526176;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .language {
          padding: 4px;
          border-radius: 10px;
          background: #e9eef5;
        }

        .language button {
          border: 0;
          background: transparent;
          padding: 7px 9px;
          border-radius: 7px;
          color: #7f8a9c;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.selected {
          background: #fff;
          color: #1465e8;
        }

        /* INTRO */

        .intro {
          width: 100%;
          max-width: 1000px;
          margin: auto;
          padding: 50px 24px 30px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .categoryIcon {
          width: 82px;
          height: 82px;
          flex: 0 0 82px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: #eaf2ff;
          border: 1px solid #dae7f8;
          font-size: 46px;
        }

        .introText {
          min-width: 0;
        }

        .eyebrow {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.4px;
        }

        .intro h1 {
          max-width: 820px;
          margin: 10px 0 0;
          font-size: clamp(28px, 4vw, 43px);
          line-height: 1.18;
          letter-spacing: -1.8px;
        }

        /* FORM */

        .form {
          width: 100%;
          max-width: 1000px;
          margin: auto;
          padding: 0 24px 90px;
        }

        .panel {
          width: 100%;
          margin-top: 18px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          background: #fff;
          box-shadow: 0 14px 40px rgba(20, 50, 90, 0.04);
        }

        .sectionTitle {
          display: flex;
          gap: 16px;
          align-items: center;
          padding-bottom: 22px;
          border-bottom: 1px solid #edf1f5;
        }

        .sectionTitle > span {
          flex-shrink: 0;
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 20px;
        }

        /*
          DESKTOP:
          always two equal columns.
          No random narrow fields.
        */
        .fieldsGrid {
          width: 100%;
          margin-top: 26px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 20px;
        }

        .field {
          width: 100%;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          min-height: 20px;
          margin-bottom: 8px;
          color: #26364d;
          font-size: 13px;
          font-weight: 850;
        }

        input,
        select,
        textarea {
          display: block;
          width: 100%;
          max-width: 100%;
          min-width: 0;
          border: 1px solid #d8e0ea;
          border-radius: 12px;
          background: #fff;
          color: #111827;
          font: inherit;
          font-size: 16px;
          outline: none;
        }

        input,
        select {
          height: 52px;
          padding: 0 15px;
        }

        textarea {
          min-height: 112px;
          padding: 14px 15px;
          line-height: 1.55;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #1465e8;
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        /* PHOTO */

        .uploadBox {
          width: 100%;
          min-height: 115px;
          margin: 0;
          padding: 20px;
          border: 1px dashed #bcc9d9;
          border-radius: 14px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .uploadBox input {
          display: none;
        }

        .uploadIcon {
          color: #1465e8;
          font-size: 25px;
          line-height: 1;
        }

        .uploadBox strong {
          max-width: 100%;
          margin-top: 7px;
          color: #25364d;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .uploadBox small {
          margin-top: 4px;
          color: #8c98aa;
        }

        /* LOST MODE */

        .lostMode {
          width: 100%;
          min-height: 78px;
          border: 1px solid #dbe2eb;
          border-radius: 14px;
          background: #fff;
          padding: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          text-align: left;
          cursor: pointer;
        }

        .lostMode strong {
          color: #17263d;
        }

        .lostMode p {
          margin: 5px 0 0;
          color: #8490a2;
          font-size: 12px;
        }

        .lostMode > span {
          flex-shrink: 0;
          color: #9ba5b4;
          font-size: 11px;
          font-weight: 950;
        }

        .lostMode.active {
          border-color: #e5484d;
          background: #fff6f6;
        }

        .lostMode.active > span {
          color: #e5484d;
        }

        /* SUBMIT */

        .submitPanel {
          width: 100%;
          margin-top: 20px;
          padding: 32px;
          border-radius: 24px;
          background:
            linear-gradient(
              135deg,
              #07182e,
              #11427d
            );
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .submitLabel {
          color: #69a6ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.4px;
        }

        .submitPanel h2 {
          margin: 9px 0 0;
          font-size: 23px;
        }

        .submitPanel button {
          flex-shrink: 0;
          min-height: 50px;
          border: 0;
          border-radius: 12px;
          background: #fff;
          color: #1465e8;
          padding: 0 20px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        /*
          TABLET / PHONE
          Everything becomes ONE clean column.
        */
        @media (max-width: 720px) {
          .header {
            padding-left: 16px;
            padding-right: 16px;
          }

          .brandSub {
            display: none;
          }

          .intro {
            padding:
              34px 18px
              20px;
            align-items: flex-start;
          }

          .categoryIcon {
            width: 64px;
            height: 64px;
            flex-basis: 64px;
            border-radius: 19px;
            font-size: 36px;
          }

          .intro h1 {
            font-size: 27px;
            letter-spacing: -1px;
          }

          .form {
            padding:
              0 14px
              70px;
          }

          .panel {
            padding: 23px 18px;
            border-radius: 20px;
          }

          .fieldsGrid {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .field.full {
            grid-column: auto;
          }

          input,
          select {
            /*
              16px prevents Safari/iPhone
              auto zoom on focus.
            */
            height: 52px;
            font-size: 16px;
          }

          textarea {
            font-size: 16px;
          }

          .submitPanel {
            padding: 25px 20px;
            flex-direction: column;
            align-items: stretch;
          }

          .submitPanel button {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .backLink {
            font-size: 11px;
          }

          .intro {
            gap: 14px;
          }

          .intro h1 {
            font-size: 23px;
          }

          .sectionTitle h2 {
            font-size: 18px;
          }
        }
      `}</style>
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
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder = "",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required ? " *" : ""}
      </label>

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
