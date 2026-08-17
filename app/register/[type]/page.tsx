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

type Language = "ka" | "en";

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    pet: true,
    itemType: "pet",
    petType: "dog",
  },
  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    pet: true,
    itemType: "pet",
    petType: "cat",
  },
  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    pet: false,
    itemType: "keys",
    petType: "",
  },
  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    pet: false,
    itemType: "wallet",
    petType: "",
  },
  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    pet: false,
    itemType: "suitcase",
    petType: "",
  },
  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    pet: false,
    itemType: "bag",
    petType: "",
  },
} as const;

export default function RegistrationPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const type: CategoryKey =
    rawType && rawType in categories
      ? (rawType as CategoryKey)
      : "dog";

  const category = categories[type];

  const [language, setLanguage] =
    useState<Language>("ka");

  const [photoName, setPhotoName] =
    useState("");

  const [ownerPhotoName, setOwnerPhotoName] =
    useState("");

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(true);

  const [
    ownerMessageEnabled,
    setOwnerMessageEnabled,
  ] = useState(true);

  const ka = language === "ka";

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">
              QR RETURN
            </div>

            <div className="brandSub">
              SMART LOST & FOUND
            </div>
          </div>
        </a>

        <div className="headerRight">
          <a
            href="/register"
            className="back"
          >
            ← {ka ? "უკან" : "Back"}
          </a>

          <div className="language">
            <button
              type="button"
              className={
                ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("ka")
              }
            >
              GEO
            </button>

            <button
              type="button"
              className={
                !ka ? "selected" : ""
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="intro">
        <div className="categoryIcon">
          {category.icon}
        </div>

        <div>
          <div className="eyebrow">
            QR RETURN
          </div>

          <h1>
            {ka
              ? "შეავსეთ ინფორმაცია, რომელიც დაკარგვის შემთხვევაში მპოვნელს თქვენთან დაკავშირებას გაუმარტივებს."
              : "Complete the information that will make it easier for a finder to contact you if your pet or item is lost."}
          </h1>
        </div>
      </section>

      <form
        className="form"
        onSubmit={(e) =>
          e.preventDefault()
        }
      >
        <input
          type="hidden"
          name="item_type"
          value={category.itemType}
        />

        <input
          type="hidden"
          name="pet_type"
          value={category.petType}
        />

        <section className="panel">
          <SectionTitle
            number="01"
            title={
              ka
                ? "ძირითადი ინფორმაცია"
                : "Basic information"
            }
          />

          <div className="fields">
            <Field
              label={
                ka
                  ? "QR კოდი"
                  : "QR code"
              }
              name="tag_code"
              placeholder="LF-XXXXXX"
              required
            />

            <Field
              label={
                ka
                  ? "სახელი"
                  : "Name"
              }
              name="item_name"
              placeholder={
                category.pet
                  ? ka
                    ? "მაგ: ბობი"
                    : "Example: Bobby"
                  : ka
                  ? "მაგ: ჩემი ჩემოდანი"
                  : "Example: My suitcase"
              }
              required
            />

            <div className="field">
              <label>
                {ka ? "ფოტო" : "Photo"}
              </label>

              <label className="fileInput">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoName(
                      e.target.files?.[0]
                        ?.name || ""
                    )
                  }
                />

                <span className="plus">
                  +
                </span>

                <span className="fileName">
                  {photoName ||
                    (ka
                      ? "ფოტოს არჩევა"
                      : "Choose photo")}
                </span>
              </label>
            </div>

            <Field
              label={
                ka
                  ? "ფერი"
                  : "Colour"
              }
              name="colour"
              placeholder={
                ka
                  ? "მაგ: შავი"
                  : "Example: Black"
              }
            />

            {category.pet && (
              <>
                <div className="field">
                  <label>
                    {ka
                      ? "სქესი"
                      : "Sex"}
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
                  label={
                    ka
                      ? "წონა"
                      : "Weight"
                  }
                  name="weight"
                  type="number"
                  placeholder="12.5"
                />
              </>
            )}

            {!category.pet && (
              <>
                <Field
                  label={
                    ka
                      ? "ბრენდი"
                      : "Brand"
                  }
                  name="brand"
                  placeholder={
                    ka
                      ? "მაგ: Samsonite"
                      : "Example: Samsonite"
                  }
                />

                <Field
                  label={
                    ka
                      ? "მოდელი"
                      : "Model"
                  }
                  name="model"
                />

                <Field
                  label={
                    ka
                      ? "ზომა"
                      : "Size"
                  }
                  name="size"
                />

                <Field
                  label={
                    ka
                      ? "მასალა"
                      : "Material"
                  }
                  name="material"
                />

                <div className="field full">
                  <label>
                    {ka
                      ? "განმასხვავებელი ნიშნები"
                      : "Distinctive features"}
                  </label>

                  <textarea
                    name="distinctive_features"
                    rows={4}
                    placeholder={
                      ka
                        ? "აღწერეთ განსაკუთრებული ნიშნები..."
                        : "Describe distinctive features..."
                    }
                  />
                </div>
              </>
            )}

            <div className="field full">
              <label>
                {ka
                  ? "აღწერა"
                  : "Description"}
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder={
                  ka
                    ? "დამატებითი ინფორმაცია..."
                    : "Additional information..."
                }
              />
            </div>
          </div>
        </section>

        {category.pet && (
          <section className="panel">
            <SectionTitle
              number="02"
              title={
                ka
                  ? "ცხოველის დამატებითი ინფორმაცია"
                  : "Additional pet information"
              }
            />

            <div className="fields">
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
                      ? "მიუთითეთ მნიშვნელოვანი სამედიცინო ინფორმაცია..."
                      : "Enter important medical information..."
                  }
                />
              </div>

              <div className="field full">
                <label>
                  {ka
                    ? "ქცევის შესახებ ინფორმაცია"
                    : "Behaviour note"}
                </label>

                <textarea
                  name="behaviour_note"
                  rows={4}
                  placeholder={
                    ka
                      ? "მაგ: მეგობრულია, უცხოებთან ფრთხილია..."
                      : "Example: Friendly, cautious with strangers..."
                  }
                />
              </div>
            </div>
          </section>
        )}

        <section className="panel">
          <SectionTitle
            number={
              category.pet
                ? "03"
                : "02"
            }
            title={
              ka
                ? "მფლობელის ინფორმაცია"
                : "Owner information"
            }
          />

          <div className="fields">
            <div className="field">
              <label>
                {ka
                  ? "მფლობელის ფოტო"
                  : "Owner photo"}
              </label>

              <label className="fileInput">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setOwnerPhotoName(
                      e.target.files?.[0]
                        ?.name || ""
                    )
                  }
                />

                <span className="plus">
                  +
                </span>

                <span className="fileName">
                  {ownerPhotoName ||
                    (ka
                      ? "ფოტოს არჩევა"
                      : "Choose photo")}
                </span>
              </label>
            </div>

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

            <div className="field">
              <label>
                {ka
                  ? "დაკავშირების მეთოდი"
                  : "Contact preference"}
              </label>

              <select
                name="contact_preference"
              >
                <option value="both">
                  {ka
                    ? "Live Chat და ტელეფონი"
                    : "Live Chat & Phone"}
                </option>

                <option value="chat">
                  Live Chat
                </option>

                <option value="phone">
                  {ka
                    ? "ტელეფონი"
                    : "Phone"}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            number={
              category.pet
                ? "04"
                : "03"
            }
            title={
              ka
                ? "ინფორმაცია მპოვნელისთვის"
                : "Finder information"
            }
          />

          <div className="fields">
            <div className="field full">
              <label>
                {ka
                  ? "შეტყობინება მპოვნელისთვის"
                  : "Finder message"}
              </label>

              <textarea
                name="finder_message"
                rows={4}
                placeholder={
                  ka
                    ? "ტექსტი, რომელსაც მპოვნელი დაინახავს..."
                    : "Message visible to the finder..."
                }
              />
            </div>

            <div className="field full">
              <label>
                {ka
                  ? "დაკარგვის შეტყობინება"
                  : "Lost message"}
              </label>

              <textarea
                name="lost_message"
                rows={4}
                placeholder={
                  ka
                    ? "დაკარგვის შემთხვევაში გამოსაჩენი ინფორმაცია..."
                    : "Message displayed if the item is lost..."
                }
              />
            </div>

            <Field
              label={
                ka
                  ? "მპოვნელის ჯილდო"
                  : "Finder reward"
              }
              name="reward"
              type="number"
              placeholder={
                ka
                  ? "მაგ: 100"
                  : "Example: 100"
              }
            />

            <Field
              label={
                ka
                  ? "ბოლო ნანახი ადგილი"
                  : "Last seen location"
              }
              name="lost_seen_location"
              placeholder={
                ka
                  ? "მაგ: Central Park"
                  : "Example: Central Park"
              }
            />

            <Toggle
              title={
                ka
                  ? "ლოკაციის გაზიარება"
                  : "Location sharing"
              }
              description={
                ka
                  ? "მპოვნელს შეეძლება თავისი მდებარეობა გაგიზიაროთ."
                  : "Allow the finder to share their location."
              }
              enabled={
                locationSharingEnabled
              }
              onClick={() =>
                setLocationSharingEnabled(
                  !locationSharingEnabled
                )
              }
            />

            <Toggle
              title={
                ka
                  ? "მფლობელის შეტყობინება"
                  : "Owner message"
              }
              description={
                ka
                  ? "QR გვერდზე გამოჩნდეს მფლობელის შეტყობინება."
                  : "Show the owner's message on the QR page."
              }
              enabled={
                ownerMessageEnabled
              }
              onClick={() =>
                setOwnerMessageEnabled(
                  !ownerMessageEnabled
                )
              }
            />

            <input
              type="hidden"
              name="location_sharing_enabled"
              value={String(
                locationSharingEnabled
              )}
            />

            <input
              type="hidden"
              name="owner_message_enabled"
              value={String(
                ownerMessageEnabled
              )}
            />
          </div>
        </section>

        <section className="submitPanel">
          <div>
            <div className="submitLabel">
              QR RETURN
            </div>

            <h2>
              {ka
                ? "ინფორმაცია მზადაა შესანახად."
                : "Information ready to save."}
            </h2>
          </div>

          <button type="submit">
            {ka
              ? "შენახვა"
              : "Save"}{" "}
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

        .header {
          max-width: 1220px;
          min-height: 84px;
          margin: auto;
          padding: 0 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 11px;
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
        }

        .brandName {
          color: #1465e8;
          font-size: 22px;
          font-weight: 950;
        }

        .brandSub {
          margin-top: 4px;
          color: #8792a3;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back {
          text-decoration: none;
          color: #536276;
          font-size: 13px;
          font-weight: 800;
        }

        .language {
          display: flex;
          background: #e9eef5;
          padding: 4px;
          border-radius: 10px;
        }

        .language button {
          border: 0;
          background: transparent;
          padding: 7px 9px;
          border-radius: 7px;
          color: #7e8999;
          font-size: 9px;
          font-weight: 900;
          cursor: pointer;
        }

        .language .selected {
          background: white;
          color: #1465e8;
        }

        .intro {
          width: 100%;
          max-width: 1180px;
          margin: auto;
          padding: 48px 28px 30px;
          display: flex;
          gap: 22px;
          align-items: center;
        }

        .categoryIcon {
          width: 76px;
          height: 76px;
          flex: 0 0 76px;
          border-radius: 22px;
          background: #eaf2ff;
          border: 1px solid #dbe7f6;
          display: grid;
          place-items: center;
          font-size: 43px;
        }

        .eyebrow {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.3px;
        }

        .intro h1 {
          max-width: 900px;
          margin: 9px 0 0;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.18;
          letter-spacing: -1.5px;
        }

        .form {
          width: 100%;
          max-width: 1180px;
          margin: auto;
          padding: 0 28px 90px;
        }

        .panel {
          width: 100%;
          margin-top: 20px;
          padding: 36px 38px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
        }

        .sectionTitle {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 20px;
          border-bottom: 1px solid #edf1f5;
        }

        .sectionTitle > span {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 19px;
        }

        .fields {
          width: 100%;
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 28px;
          row-gap: 22px;
        }

        .field {
          min-width: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .field.full {
          grid-column: 1 / -1;
        }

        .field label {
          margin-bottom: 8px;
          color: #28374e;
          font-size: 13px;
          font-weight: 850;
        }

        input,
        select,
        textarea {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          border: 1px solid #d7e0ea;
          border-radius: 11px;
          background: white;
          color: #111827;
          font-family: inherit;
          font-size: 16px;
          outline: none;
        }

        input,
        select {
          height: 52px;
          padding: 0 16px;
        }

        textarea {
          min-height: 108px;
          padding: 13px 16px;
          line-height: 1.55;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #1465e8;
          box-shadow:
            0 0 0 3px
            rgba(20, 101, 232, 0.08);
        }

        .fileInput {
          width: 100%;
          height: 52px;
          margin: 0;
          padding: 0 16px;
          border: 1px dashed #b8c6d7;
          border-radius: 11px;
          background: #f9fafc;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .fileInput input {
          display: none;
        }

        .plus {
          flex: 0 0 auto;
          color: #1465e8;
          font-size: 20px;
        }

        .fileName {
          min-width: 0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #526176;
          font-size: 13px;
        }

        .toggle {
          grid-column: 1 / -1;
          width: 100%;
          min-height: 72px;
          border: 1px solid #dae2eb;
          border-radius: 13px;
          background: white;
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          text-align: left;
          cursor: pointer;
        }

        .toggle strong {
          color: #17263d;
        }

        .toggle p {
          margin: 4px 0 0;
          color: #8490a2;
          font-size: 12px;
        }

        .toggle > span {
          flex: 0 0 auto;
          color: #99a4b4;
          font-size: 11px;
          font-weight: 950;
        }

        .toggle.active {
          border-color: #1465e8;
          background: #f2f7ff;
        }

        .toggle.active > span {
          color: #1465e8;
        }

        .submitPanel {
          width: 100%;
          margin-top: 20px;
          padding: 32px 38px;
          border-radius: 24px;
          background: linear-gradient(135deg, #07182e, #11427d);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
        }

        .submitLabel {
          color: #69a6ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.3px;
        }

        .submitPanel h2 {
          margin: 8px 0 0;
          font-size: 22px;
        }

        .submitPanel button {
          flex: 0 0 auto;
          height: 48px;
          border: 0;
          border-radius: 11px;
          background: white;
          color: #1465e8;
          padding: 0 21px;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 700px) {
          .header {
            padding-left: 14px;
            padding-right: 14px;
          }

          .brandSub {
            display: none;
          }

          .intro {
            padding: 32px 15px 19px;
            align-items: flex-start;
          }

          .categoryIcon {
            width: 60px;
            height: 60px;
            flex-basis: 60px;
            font-size: 34px;
          }

          .intro h1 {
            font-size: 24px;
            letter-spacing: -0.8px;
          }

          .form {
            padding: 0 14px 60px;
          }

          .panel {
            padding: 22px 18px;
          }

          .fields {
            grid-template-columns: 1fr;
            gap: 17px;
          }

          .field.full,
          .toggle {
            grid-column: auto;
          }

          input,
          select,
          .fileInput {
            height: 52px;
          }

          textarea {
            min-height: 100px;
          }

          .submitPanel {
            padding: 22px 18px;
            flex-direction: column;
            align-items: stretch;
          }

          .submitPanel button {
            width: 100%;
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

function Toggle({
  title,
  description,
  enabled,
  onClick,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        enabled
          ? "toggle active"
          : "toggle"
      }
      onClick={onClick}
    >
      <div>
        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <span>
        {enabled
          ? "ON"
          : "OFF"}
      </span>
    </button>
  );
}
