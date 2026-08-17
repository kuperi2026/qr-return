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
} satisfies Record<
  CategoryKey,
  {
    icon: string;
    ka: string;
    en: string;
    pet: boolean;
    itemType: string;
    petType: string;
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
  const [locationSharing, setLocationSharing] = useState(true);
  const [ownerMessageEnabled, setOwnerMessageEnabled] = useState(true);
  const [photoName, setPhotoName] = useState("");
  const [ownerPhotoName, setOwnerPhotoName] = useState("");

  const ka = lang === "ka";

  return (
    <main className="page">
      <header className="header">
        <a href="/" className="brand">
          <div className="brandMark">QR</div>

          <div>
            <div className="brandName">QR RETURN</div>
            <div className="brandSub">SMART LOST & FOUND</div>
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

      <section className="intro">
        <div className="categoryIcon">{category.icon}</div>

        <div>
          <div className="eyebrow">QR RETURN</div>

          <h1>
            {ka
              ? "შეავსეთ ინფორმაცია, რომელიც დაკარგვის შემთხვევაში მპოვნელს თქვენთან დაკავშირებას გაუმარტივებს."
              : "Add the information that will make it easier for a finder to contact you if your pet or item is lost."}
          </h1>
        </div>
      </section>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input type="hidden" name="item_type" value={category.itemType} />
        <input type="hidden" name="pet_type" value={category.petType} />

        <section className="panel">
          <SectionTitle
            number="01"
            title={ka ? "QR და ძირითადი ინფორმაცია" : "QR & basic information"}
          />

          <div className="fieldsGrid">
            <Field
              label={ka ? "QR კოდი" : "QR code"}
              name="tag_code"
              placeholder="LF-XXXXXX"
              required
            />

            <Field
              label={ka ? "სახელი" : "Name"}
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
              <label>{ka ? "ფოტო" : "Photo"}</label>

              <label className="uploadBox compact">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPhotoName(e.target.files?.[0]?.name || "")
                  }
                />

                <span>＋</span>
                <strong>
                  {photoName || (ka ? "აირჩიეთ ფოტო" : "Choose photo")}
                </strong>
              </label>
            </div>

            <Field
              label={ka ? "ფერი" : "Colour"}
              name="colour"
              placeholder={ka ? "მაგ: შავი" : "Example: Black"}
            />

            {category.pet && (
              <>
                <div className="field">
                  <label>{ka ? "სქესი" : "Sex"}</label>

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
                  label={ka ? "დაბადების თარიღი" : "Date of birth"}
                  name="date_of_birth"
                  type="date"
                />

                <Field
                  label={ka ? "წონა" : "Weight"}
                  name="weight"
                  type="number"
                  placeholder="12.5"
                />

                <Field
                  label={ka ? "ჯიში" : "Breed"}
                  name="breed"
                  placeholder={
                    ka ? "მაგ: Golden Retriever" : "Example: Golden Retriever"
                  }
                />
              </>
            )}

            {!category.pet && (
              <>
                <Field
                  label={ka ? "ბრენდი" : "Brand"}
                  name="brand"
                  placeholder={ka ? "მაგ: Samsonite" : "Example: Samsonite"}
                />

                <Field
                  label={ka ? "მოდელი" : "Model"}
                  name="model"
                />

                <Field
                  label={ka ? "ზომა" : "Size"}
                  name="size"
                />

                <Field
                  label={ka ? "მასალა" : "Material"}
                  name="material"
                />

                <div className="field full">
                  <label>
                    {ka ? "განმასხვავებელი ნიშნები" : "Distinctive features"}
                  </label>

                  <textarea
                    name="distinctive_features"
                    rows={4}
                    placeholder={
                      ka
                        ? "აღწერეთ ნიშნები, რომლითაც ნივთის ამოცნობა მარტივია..."
                        : "Describe details that make the item easy to identify..."
                    }
                  />
                </div>
              </>
            )}

            <div className="field full">
              <label>{ka ? "აღწერა" : "Description"}</label>

              <textarea
                name="description"
                rows={4}
                placeholder={
                  ka
                    ? "დამატებითი აღწერა..."
                    : "Additional description..."
                }
              />
            </div>
          </div>
        </section>

        {category.pet && (
          <section className="panel">
            <SectionTitle
              number="02"
              title={ka ? "ცხოველის დამატებითი ინფორმაცია" : "Pet information"}
            />

            <div className="fieldsGrid">
              <div className="field full">
                <label>
                  {ka ? "სამედიცინო ინფორმაცია" : "Medical information"}
                </label>

                <textarea
                  name="medical_info"
                  rows={4}
                  placeholder={
                    ka
                      ? "დაავადება, ალერგია, წამალი ან სხვა მნიშვნელოვანი ინფორმაცია..."
                      : "Condition, allergy, medication or other important information..."
                  }
                />
              </div>

              <div className="field full">
                <label>{ka ? "ქცევის შენიშვნა" : "Behaviour note"}</label>

                <textarea
                  name="behaviour_note"
                  rows={4}
                  placeholder={
                    ka
                      ? "მაგ: მეგობრულია, უცხოებთან ფრთხილია, ხმაურზე რეაგირებს..."
                      : "Example: Friendly, cautious with strangers, reacts to loud noise..."
                  }
                />
              </div>
            </div>
          </section>
        )}

        <section className="panel">
          <SectionTitle
            number={category.pet ? "03" : "02"}
            title={ka ? "მფლობელის ინფორმაცია" : "Owner information"}
          />

          <div className="fieldsGrid">
            <Field
              label={ka ? "სახელი" : "First name"}
              name="owner_first_name"
              placeholder={ka ? "სახელი" : "First name"}
              required
            />

            <Field
              label={ka ? "გვარი" : "Last name"}
              name="owner_last_name"
              placeholder={ka ? "გვარი" : "Last name"}
              required
            />

            <div className="field">
              <label>{ka ? "მფლობელის ფოტო" : "Owner photo"}</label>

              <label className="uploadBox compact">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setOwnerPhotoName(e.target.files?.[0]?.name || "")
                  }
                />

                <span>＋</span>
                <strong>
                  {ownerPhotoName || (ka ? "აირჩიეთ ფოტო" : "Choose photo")}
                </strong>
              </label>
            </div>

            <Field
              label={ka ? "ელფოსტა" : "Owner email"}
              name="owner_email"
              type="email"
              placeholder="name@example.com"
              required
            />

            <Field
              label={ka ? "ტელეფონის ნომერი" : "Phone number"}
              name="owner_phone"
              type="tel"
              placeholder="+1 000 000 0000"
            />

            <div className="field">
              <label>{ka ? "კონტაქტის მეთოდი" : "Contact preference"}</label>

              <select name="contact_preference">
                <option value="both">
                  {ka ? "Live Chat და ტელეფონი" : "Live Chat & Phone"}
                </option>
                <option value="chat">Live Chat</option>
                <option value="phone">
                  {ka ? "ტელეფონი" : "Phone"}
                </option>
              </select>
            </div>
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            number={category.pet ? "04" : "03"}
            title={
              ka
                ? "დამატებითი საკონტაქტო პირი"
                : "Additional contact person"
            }
          />

          <div className="fieldsGrid">
            <Field
              label={ka ? "სახელი" : "First name"}
              name="additional_contact_first_name"
            />

            <Field
              label={ka ? "გვარი" : "Last name"}
              name="additional_contact_last_name"
            />

            <Field
              label={ka ? "ტელეფონი" : "Phone"}
              name="additional_contact_phone"
              type="tel"
            />

            <Field
              label={ka ? "ელფოსტა" : "Email"}
              name="additional_contact_email"
              type="email"
            />
          </div>
        </section>

        <section className="panel">
          <SectionTitle
            number={category.pet ? "05" : "04"}
            title={ka ? "ინფორმაცია მპოვნელისთვის" : "Finder information"}
          />

          <div className="fieldsGrid">
            <div className="field full">
              <label>
                {ka ? "შეტყობინება მპოვნელისთვის" : "Finder message"}
              </label>

              <textarea
                name="finder_message"
                rows={4}
                placeholder={
                  ka
                    ? "მაგ: გთხოვთ დამიკავშირდეთ. მადლობა დახმარებისთვის..."
                    : "Example: Please contact me. Thank you for helping..."
                }
              />
            </div>

            <div className="field full">
              <label>{ka ? "დაკარგვის შეტყობინება" : "Lost message"}</label>

              <textarea
                name="lost_message"
                rows={4}
                placeholder={
                  ka
                    ? "ტექსტი, რომელიც გამოჩნდება დაკარგვის შემთხვევაში..."
                    : "Message displayed when the item is marked as lost..."
                }
              />
            </div>

            <Field
              label={ka ? "მპოვნელის ჯილდო" : "Finder reward"}
              name="reward"
              type="number"
              placeholder="0"
            />

            <Field
              label={ka ? "ბოლო ნანახი ადგილი" : "Last seen location"}
              name="lost_seen_location"
              placeholder={
                ka ? "მაგ: Central Park, NYC" : "Example: Central Park, NYC"
              }
            />

            <Toggle
              title={ka ? "ლოკაციის გაზიარება" : "Location sharing"}
              description={
                ka
                  ? "მპოვნელს შეეძლება მიმდინარე მდებარეობის გაზიარება."
                  : "Allow the finder to share the current location."
              }
              enabled={locationSharing}
              onClick={() => setLocationSharing(!locationSharing)}
            />

            <Toggle
              title={ka ? "მფლობელის შეტყობინება" : "Owner message"}
              description={
                ka
                  ? "მპოვნელისთვის გამოჩნდეს მფლობელის შეტყობინება."
                  : "Show the owner's message to the finder."
              }
              enabled={ownerMessageEnabled}
              onClick={() => setOwnerMessageEnabled(!ownerMessageEnabled)}
            />

            <input
              type="hidden"
              name="location_sharing_enabled"
              value={String(locationSharing)}
            />

            <input
              type="hidden"
              name="owner_message_enabled"
              value={String(ownerMessageEnabled)}
            />
          </div>
        </section>

        <section className="submitPanel">
          <div>
            <div className="submitLabel">QR RETURN</div>

            <h2>{ka ? "ინფორმაცია მზადაა." : "Information ready."}</h2>
          </div>

          <button type="submit">
            {ka ? "შენახვა" : "Save"} →
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
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #1465e8;
          color: white;
          font-size: 14px;
          font-weight: 950;
        }

        .brandName {
          color: #1465e8;
          font-size: 22px;
          font-weight: 950;
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
          background: #e9eef5;
          border-radius: 10px;
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
          background: white;
          color: #1465e8;
        }

        .intro {
          max-width: 1000px;
          margin: auto;
          padding: 48px 24px 28px;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .categoryIcon {
          width: 78px;
          height: 78px;
          flex: 0 0 78px;
          border-radius: 23px;
          background: #eaf2ff;
          border: 1px solid #dae7f8;
          display: grid;
          place-items: center;
          font-size: 44px;
        }

        .eyebrow {
          color: #1465e8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 2.4px;
        }

        .intro h1 {
          max-width: 800px;
          margin: 10px 0 0;
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.17;
          letter-spacing: -1.7px;
        }

        .form {
          max-width: 1000px;
          margin: auto;
          padding: 0 24px 90px;
        }

        .panel {
          margin-top: 18px;
          padding: 30px;
          border: 1px solid #e2e8f0;
          border-radius: 23px;
          background: white;
        }

        .sectionTitle {
          display: flex;
          gap: 15px;
          align-items: center;
          padding-bottom: 21px;
          border-bottom: 1px solid #edf1f5;
        }

        .sectionTitle > span {
          color: #1465e8;
          font-size: 11px;
          font-weight: 950;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 20px;
        }

        .fieldsGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
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
          margin-bottom: 8px;
          color: #26364d;
          font-size: 13px;
          font-weight: 850;
        }

        input,
        select,
        textarea {
          width: 100%;
          min-width: 0;
          max-width: 100%;
          border: 1px solid #d8e0ea;
          border-radius: 12px;
          background: white;
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
          min-height: 108px;
          padding: 14px 15px;
          line-height: 1.55;
          resize: vertical;
        }

        input:focus,
        select:focus,
        textarea:focus {
          border-color: #1465e8;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .uploadBox.compact {
          height: 52px;
          margin: 0;
          padding: 0 15px;
          border: 1px dashed #b9c7d8;
          border-radius: 12px;
          background: #f8fafc;
          display: flex;
          flex-direction: row;
          gap: 8px;
          align-items: center;
          cursor: pointer;
        }

        .uploadBox input {
          display: none;
        }

        .uploadBox span {
          color: #1465e8;
          font-size: 20px;
        }

        .uploadBox strong {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #334155;
          font-size: 13px;
        }

        .toggle {
          grid-column: 1 / -1;
          width: 100%;
          min-height: 76px;
          padding: 16px;
          border: 1px solid #dbe2eb;
          border-radius: 14px;
          background: white;
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
          margin: 5px 0 0;
          color: #8490a2;
          font-size: 12px;
        }

        .toggle > span {
          color: #9ba5b4;
          font-size: 11px;
          font-weight: 950;
        }

        .toggle.active {
          border-color: #1465e8;
          background: #f1f6ff;
        }

        .toggle.active > span {
          color: #1465e8;
        }

        .submitPanel {
          margin-top: 20px;
          padding: 30px;
          border-radius: 23px;
          background: linear-gradient(135deg, #07182e, #11427d);
          color: white;
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
          height: 50px;
          border: 0;
          border-radius: 12px;
          background: white;
          color: #1465e8;
          padding: 0 22px;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 720px) {
          .header {
            padding-left: 15px;
            padding-right: 15px;
          }

          .brandSub {
            display: none;
          }

          .intro {
            padding: 34px 16px 20px;
            align-items: flex-start;
          }

          .categoryIcon {
            width: 62px;
            height: 62px;
            flex-basis: 62px;
            font-size: 35px;
          }

          .intro h1 {
            font-size: 25px;
            letter-spacing: -1px;
          }

          .form {
            padding: 0 12px 65px;
          }

          .panel {
            padding: 22px 17px;
          }

          .fieldsGrid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .field.full,
          .toggle {
            grid-column: auto;
          }

          input,
          select,
          .uploadBox.compact {
            height: 52px;
          }

          .submitPanel {
            padding: 24px 19px;
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
      className={enabled ? "toggle active" : "toggle"}
      onClick={onClick}
    >
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <span>{enabled ? "ON" : "OFF"}</span>
    </button>
  );
}
