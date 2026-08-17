"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  const title = useMemo(
    () => (ka ? category.ka : category.en),
    [ka, category]
  );

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

      {/* TITLE */}
      <section className="intro">
        <div className="categoryIcon">
          {category.icon}
        </div>

        <div>
          <div className="eyebrow">
            QR RETURN REGISTRATION
          </div>

          <h1>
            {ka
              ? `${title} — რეგისტრაცია`
              : `${title} Registration`}
          </h1>

          <p>
            {ka
              ? "შეავსეთ ინფორმაცია, რომელიც საჭირო იქნება QR პროფილისთვის."
              : "Complete the information that will be used for the QR profile."}
          </p>
        </div>
      </section>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* QR */}
        <section className="panel">
          <div className="sectionTitle">
            <span>01</span>

            <div>
              <h2>
                {ka
                  ? "QR ინფორმაცია"
                  : "QR information"}
              </h2>

              <p>
                {ka
                  ? "QR ტეგთან დაკავშირებული მონაცემი."
                  : "Information connected to the QR tag."}
              </p>
            </div>
          </div>

          <div className="grid">
            <Field
              label={ka ? "QR კოდი" : "QR code"}
              name="tag_code"
              placeholder="LF-XXXXXX"
              required
            />
          </div>
        </section>

        {/* BASIC ITEM INFO */}
        <section className="panel">
          <div className="sectionTitle">
            <span>02</span>

            <div>
              <h2>
                {ka
                  ? "ძირითადი ინფორმაცია"
                  : "Basic information"}
              </h2>

              <p>
                {ka
                  ? "ინფორმაცია ცხოველის ან ნივთის შესახებ."
                  : "Information about the pet or item."}
              </p>
            </div>
          </div>

          <div className="grid">
            {/* PHOTO_URL */}
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

                <div className="uploadIcon">＋</div>

                <strong>
                  {photoName ||
                    (ka
                      ? "ფოტოს არჩევა"
                      : "Choose photo")}
                </strong>

                <small>
                  photo_url
                </small>
              </label>
            </div>

            {/* PET ONLY */}
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
                      {ka
                        ? "აირჩიეთ"
                        : "Select"}
                    </option>

                    <option value="male">
                      {ka
                        ? "მამრობითი"
                        : "Male"}
                    </option>

                    <option value="female">
                      {ka
                        ? "მდედრობითი"
                        : "Female"}
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
                  placeholder={
                    ka
                      ? "მაგ: 12.5"
                      : "Example: 12.5"
                  }
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
                rows={5}
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
                  rows={5}
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
          <div className="sectionTitle">
            <span>03</span>

            <div>
              <h2>
                {ka
                  ? "მფლობელის ინფორმაცია"
                  : "Owner information"}
              </h2>

              <p>
                {ka
                  ? "მფლობელის მონაცემები QR პროფილისთვის."
                  : "Owner details for the QR profile."}
              </p>
            </div>
          </div>

          <div className="grid">
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

        {/* FINDER INFO */}
        <section className="panel">
          <div className="sectionTitle">
            <span>04</span>

            <div>
              <h2>
                {ka
                  ? "ინფორმაცია მპოვნელისთვის"
                  : "Finder information"}
              </h2>

              <p>
                {ka
                  ? "ეს ინფორმაცია გამოიყენება დაკარგვის შემთხვევაში."
                  : "This information is used if the pet or item is lost."}
              </p>
            </div>
          </div>

          <div className="grid">
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
                    : "Message shown when Lost Mode is active..."
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
                  <strong>
                    ⚠️ Lost Mode
                  </strong>

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
                value={
                  lostMode ? "true" : "false"
                }
              />
            </div>
          </div>
        </section>

        {/* FINAL */}
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

            <p>
              {ka
                ? "ამ ეტაპზე ფორმა მხოლოდ დიზაინია. შემდეგ ცალკე მივაბამთ Supabase-ის შენახვას."
                : "This is currently the form interface. Supabase saving will be connected separately."}
            </p>
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
          background: #f4f7fb;
          color: #0b1729;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .header {
          max-width: 1120px;
          min-height: 88px;
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
          border-radius: 14px;
          background: #1465e8;
          color: white;
          display: grid;
          place-items: center;
          font-weight: 950;
          font-size: 14px;
        }

        .brandName {
          color: #1465e8;
          font-size: 22px;
          font-weight: 950;
          letter-spacing: -0.8px;
        }

        .brandSub {
          margin-top: 4px;
          color: #8a95a6;
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
          background: #e9eef5;
          padding: 4px;
          border-radius: 10px;
        }

        .language button {
          border: 0;
          background: transparent;
          color: #7e8a9c;
          padding: 7px 9px;
          border-radius: 7px;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.selected {
          background: white;
          color: #1465e8;
          box-shadow:
            0 2px 8px rgba(25, 50, 90, 0.08);
        }

        .intro {
          max-width: 1000px;
          margin: auto;
          padding: 55px 24px 35px;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .categoryIcon {
          width: 90px;
          height: 90px;
          flex-shrink: 0;
          border-radius: 28px;
          background:
            linear-gradient(
              145deg,
              #e7f1ff,
              #ffffff
            );
          border: 1px solid #dde8f6;
          display: grid;
          place-items: center;
          font-size: 50px;
          box-shadow:
            0 15px 40px rgba(25, 75, 145, 0.08);
        }

        .eyebrow {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.6px;
        }

        .intro h1 {
          margin: 8px 0 6px;
          font-size:
            clamp(34px, 5vw, 50px);
          letter-spacing: -2px;
        }

        .intro p {
          margin: 0;
          color: #718096;
          line-height: 1.6;
        }

        .form {
          max-width: 1000px;
          margin: auto;
          padding: 0 24px 100px;
        }

        .panel {
          margin-top: 18px;
          padding: 34px;
          border-radius: 27px;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 16px 45px rgba(20, 50, 90, 0.045);
        }

        .sectionTitle {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding-bottom: 25px;
          border-bottom: 1px solid #edf1f5;
        }

        .sectionTitle > span {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 21px;
        }

        .sectionTitle p {
          margin: 6px 0 0;
          color: #8290a3;
          font-size: 13px;
        }

        .grid {
          margin-top: 27px;
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 21px;
        }

        .field {
          display: flex;
          flex-direction: column;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          margin-bottom: 8px;
          color: #26364d;
          font-size: 13px;
          font-weight: 850;
        }

        input,
        textarea,
        select {
          width: 100%;
          border: 1px solid #d9e1eb;
          background: #ffffff;
          border-radius: 12px;
          padding: 14px 15px;
          color: #111827;
          font: inherit;
          outline: none;
        }

        textarea {
          resize: vertical;
        }

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #1465e8;
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .uploadBox {
          min-height: 135px;
          margin: 0;
          border: 1px dashed #b9c7d8;
          border-radius: 16px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }

        .uploadBox input {
          display: none;
        }

        .uploadIcon {
          color: #1465e8;
          font-size: 28px;
          line-height: 1;
        }

        .uploadBox strong {
          margin-top: 7px;
          color: #25364d;
        }

        .uploadBox small {
          margin-top: 4px;
          color: #8c98aa;
        }

        .lostMode {
          width: 100%;
          border: 1px solid #dbe2eb;
          background: white;
          padding: 19px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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

        .submitPanel {
          margin-top: 20px;
          padding: 36px;
          border-radius: 28px;
          background:
            linear-gradient(
              135deg,
              #07182e,
              #11427d
            );
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .submitLabel {
          color: #69a6ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.5px;
        }

        .submitPanel h2 {
          margin: 10px 0 6px;
          font-size: 25px;
        }

        .submitPanel p {
          max-width: 600px;
          margin: 0;
          color: #a5b7cf;
          font-size: 13px;
          line-height: 1.6;
        }

        .submitPanel button {
          flex-shrink: 0;
          border: 0;
          background: white;
          color: #1465e8;
          padding: 15px 20px;
          border-radius: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 700px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .field.full {
            grid-column: auto;
          }

          .intro {
            align-items: flex-start;
          }

          .submitPanel {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 500px) {
          .brandSub {
            display: none;
          }

          .intro {
            padding-top: 35px;
          }

          .categoryIcon {
            width: 70px;
            height: 70px;
            font-size: 40px;
          }

          .panel {
            padding: 24px 20px;
          }
        }
      `}</style>
    </main>
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
