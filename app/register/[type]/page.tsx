"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

type CategoryKey =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "suitcase"
  | "bag";

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    isPet: true,
    itemType: "pet",
    petType: "dog",
  },

  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    isPet: true,
    itemType: "pet",
    petType: "cat",
  },

  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    isPet: false,
    itemType: "keys",
    petType: "",
  },

  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    isPet: false,
    itemType: "wallet",
    petType: "",
  },

  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    isPet: false,
    itemType: "suitcase",
    petType: "",
  },

  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    isPet: false,
    itemType: "bag",
    petType: "",
  },
} as const;

export default function RegistrationProfilePage() {
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

  const [itemPhotoName, setItemPhotoName] =
    useState("");

  const [ownerPhotoName, setOwnerPhotoName] =
    useState("");

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const ka = language === "ka";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const formData =
        new FormData(event.currentTarget);

      const itemName = String(
        formData.get("item_name") || ""
      ).trim();

      const tagCode = String(
        formData.get("tag_code") || ""
      ).trim();

      const ownerEmail = String(
        formData.get("owner_email") || ""
      ).trim();

      if (!tagCode) {
        setErrorMessage(
          ka
            ? "გთხოვთ, მიუთითოთ QR კოდი."
            : "Please enter the QR code."
        );
        return;
      }

      if (!itemName) {
        setErrorMessage(
          ka
            ? "გთხოვთ, მიუთითოთ სახელი."
            : "Please enter a name."
        );
        return;
      }

      if (!ownerEmail) {
        setErrorMessage(
          ka
            ? "გთხოვთ, მიუთითოთ ელფოსტა."
            : "Please enter an email address."
        );
        return;
      }

      /*
        ამ ეტაპზე მხოლოდ იმ მონაცემებს
        ვაგზავნით Supabase-ში, რომლებიც
        უკვე გვაქვს item ცხრილის სტრუქტურაში.

        ფოტოებს Storage-ს შემდეგ ეტაპზე მივაბამთ.
      */

      const payload = {
        tag_code: tagCode,

        item_type:
          category.itemType,

        pet_type:
          category.petType || null,

        item_name:
          itemName,

        colour:
          String(
            formData.get("colour") || ""
          ).trim() || null,

        sex:
          category.isPet
            ? String(
                formData.get("sex") || ""
              ) || null
            : null,

        date_of_birth:
          category.isPet
            ? String(
                formData.get(
                  "date_of_birth"
                ) || ""
              ) || null
            : null,

        weight:
          category.isPet &&
          String(
            formData.get("weight") || ""
          ).trim()
            ? Number(
                formData.get("weight")
              )
            : null,

        medical_info:
          category.isPet
            ? String(
                formData.get(
                  "medical_info"
                ) || ""
              ).trim() || null
            : null,

        behaviour_note:
          category.isPet
            ? String(
                formData.get(
                  "behaviour_note"
                ) || ""
              ).trim() || null
            : null,

        brand:
          !category.isPet
            ? String(
                formData.get("brand") || ""
              ).trim() || null
            : null,

        model:
          !category.isPet
            ? String(
                formData.get("model") || ""
              ).trim() || null
            : null,

        size:
          !category.isPet
            ? String(
                formData.get("size") || ""
              ).trim() || null
            : null,

        material:
          !category.isPet
            ? String(
                formData.get("material") || ""
              ).trim() || null
            : null,

        distinctive_features:
          !category.isPet
            ? String(
                formData.get(
                  "distinctive_features"
                ) || ""
              ).trim() || null
            : null,

        description:
          String(
            formData.get("description") || ""
          ).trim() || null,

        owner_email:
          ownerEmail,

        finder_message:
          String(
            formData.get(
              "finder_message"
            ) || ""
          ).trim() || null,

        contact_preference:
          String(
            formData.get(
              "contact_preference"
            ) || "both"
          ),

        location_sharing_enabled:
          locationSharingEnabled,

        lost_seen_location:
          String(
            formData.get(
              "lost_seen_location"
            ) || ""
          ).trim() || null,

        active: true,
      };

      const { error } = await supabase
        .from("item")
        .insert(payload);

      if (error) {
        console.error(
          "Supabase insert error:",
          error
        );

        setErrorMessage(
          ka
            ? `შენახვა ვერ მოხერხდა: ${error.message}`
            : `Save failed: ${error.message}`
        );

        return;
      }

      setSuccessMessage(
        ka
          ? "ინფორმაცია წარმატებით შეინახა."
          : "Information saved successfully."
      );
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setErrorMessage(
        ka
          ? "დაფიქსირდა შეცდომა ინფორმაციის შენახვისას."
          : "An error occurred while saving the information."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      {/* HEADER */}

      <header className="header">
        <a
          href="/"
          className="brand"
        >
          <div className="brandMark">
            QR
          </div>

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

      {/* INTRO */}

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

          <p>
            {ka
              ? "პროფილის მონაცემების შეცვლას მომავალშიც შეძლებთ. არჩეული კატეგორია კი უცვლელი დარჩება."
              : "You will be able to update the profile information later. The selected category will remain fixed."}
          </p>
        </div>
      </section>

      {/* FORM */}

      <form
        className="formCard"
        onSubmit={handleSubmit}
      >
        {/* BASIC */}

        <SectionHeading
          text={
            ka
              ? "ძირითადი ინფორმაცია"
              : "Basic information"
          }
        />

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
            category.isPet
              ? ka
                ? "ცხოველის სახელი"
                : "Pet name"
              : ka
              ? "ნივთის დასახელება"
              : "Item name"
          }
          name="item_name"
          placeholder={
            category.isPet
              ? ka
                ? "მაგ. ბობი"
                : "Example: Bobby"
              : ka
              ? "მაგ. ჩემი ჩემოდანი"
              : "Example: My suitcase"
          }
          required
        />

        <Field
          label={
            ka
              ? "ფერი"
              : "Colour"
          }
          name="colour"
          placeholder={
            ka
              ? "მაგ. ყავისფერი"
              : "Example: Brown"
          }
        />

        {/* PET */}

        {category.isPet && (
          <>
            <SelectField
              label={
                ka
                  ? "სქესი"
                  : "Sex"
              }
              name="sex"
              options={[
                {
                  value: "",
                  label: ka
                    ? "აირჩიეთ"
                    : "Select",
                },
                {
                  value: "male",
                  label: ka
                    ? "მამრობითი"
                    : "Male",
                },
                {
                  value: "female",
                  label: ka
                    ? "მდედრობითი"
                    : "Female",
                },
              ]}
            />

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
              placeholder={
                ka
                  ? "მაგ. 12.5"
                  : "Example: 12.5"
              }
            />

            <TextAreaField
              label={
                ka
                  ? "სამედიცინო ინფორმაცია"
                  : "Medical information"
              }
              name="medical_info"
              placeholder={
                ka
                  ? "მიუთითეთ მედიკამენტები, ალერგია, ჯანმრთელობის მდგომარეობა ან სხვა მნიშვნელოვანი ინფორმაცია."
                  : "Add medications, allergies, health conditions or other important information."
              }
            />

            <TextAreaField
              label={
                ka
                  ? "ქცევის შესახებ ინფორმაცია"
                  : "Behaviour information"
              }
              name="behaviour_note"
              placeholder={
                ka
                  ? "მაგ. მეგობრულია, უცხო ადამიანებთან ფრთხილია, ხმაურზე რეაგირებს..."
                  : "Example: Friendly, cautious around strangers, reacts to loud noises..."
              }
            />
          </>
        )}

        {/* ITEMS */}

        {!category.isPet && (
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
                  ? "მაგ. Samsonite"
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

            <TextAreaField
              label={
                ka
                  ? "განმასხვავებელი ნიშნები"
                  : "Distinctive features"
              }
              name="distinctive_features"
              placeholder={
                ka
                  ? "აღწერეთ ნიშნები, რომლებიც ნივთის ამოცნობას გაამარტივებს."
                  : "Describe details that make the item easier to identify."
              }
            />
          </>
        )}

        {/* PHOTO - STORAGE NEXT */}

        <FileField
          label={
            category.isPet
              ? ka
                ? "ცხოველის ფოტო — ნებაყოფლობითი"
                : "Pet photo — optional"
              : ka
              ? "ნივთის ფოტო — ნებაყოფლობითი"
              : "Item photo — optional"
          }
          fileName={itemPhotoName}
          setFileName={setItemPhotoName}
          emptyText={
            ka
              ? "ფოტოს არჩევა"
              : "Choose photo"
          }
        />

        <TextAreaField
          label={
            ka
              ? "დამატებითი აღწერა"
              : "Additional description"
          }
          name="description"
          placeholder={
            ka
              ? "დაწერეთ დამატებითი ინფორმაცია, რომელიც შესაძლოა მპოვნელს დაეხმაროს."
              : "Add any additional information that may help the finder."
          }
        />

        {/* OWNER */}

        <SectionHeading
          text={
            ka
              ? "მფლობელის ინფორმაცია"
              : "Owner information"
          }
        />

        <Field
          label={
            ka
              ? "სახელი"
              : "First name"
          }
          name="owner_first_name"
          placeholder={
            ka
              ? "მფლობელის სახელი"
              : "Owner first name"
          }
          required
        />

        <Field
          label={
            ka
              ? "გვარი"
              : "Last name"
          }
          name="owner_last_name"
          placeholder={
            ka
              ? "მფლობელის გვარი"
              : "Owner last name"
          }
          required
        />

        <Field
          label={
            ka
              ? "მობილურის ნომერი"
              : "Phone number"
          }
          name="owner_phone"
          type="tel"
          placeholder="+1 000 000 0000"
        />

        <Field
          label={
            ka
              ? "ელფოსტა"
              : "Email"
          }
          name="owner_email"
          type="email"
          placeholder="name@example.com"
          required
        />

        <FileField
          label={
            ka
              ? "მფლობელის ფოტო — ნებაყოფლობითი"
              : "Owner photo — optional"
          }
          fileName={ownerPhotoName}
          setFileName={setOwnerPhotoName}
          emptyText={
            ka
              ? "ფოტოს არჩევა"
              : "Choose photo"
          }
        />

        <SelectField
          label={
            ka
              ? "როგორ გსურთ მპოვნელი დაგიკავშირდეთ?"
              : "How would you like the finder to contact you?"
          }
          name="contact_preference"
          options={[
            {
              value: "both",
              label: ka
                ? "Live Chat და ტელეფონი"
                : "Live Chat & phone",
            },
            {
              value: "chat",
              label: "Live Chat",
            },
            {
              value: "phone",
              label: ka
                ? "ტელეფონი"
                : "Phone",
            },
          ]}
        />

        {/* ADDITIONAL CONTACT */}

        <SectionHeading
          text={
            ka
              ? "დამატებითი საკონტაქტო პირი — ნებაყოფლობითი"
              : "Additional contact person — optional"
          }
        />

        <Field
          label={
            ka
              ? "სახელი და გვარი"
              : "Full name"
          }
          name="additional_contact_name"
          placeholder={
            ka
              ? "დამატებითი საკონტაქტო პირის სახელი და გვარი"
              : "Additional contact person's full name"
          }
        />

        <Field
          label={
            ka
              ? "მობილურის ნომერი"
              : "Phone number"
          }
          name="additional_contact_phone"
          type="tel"
          placeholder="+1 000 000 0000"
        />

        <Field
          label={
            ka
              ? "ელფოსტა"
              : "Email"
          }
          name="additional_contact_email"
          type="email"
          placeholder="name@example.com"
        />

        {/* FINDER */}

        <SectionHeading
          text={
            ka
              ? "ინფორმაცია მპოვნელისთვის"
              : "Information for the finder"
          }
        />

        <TextAreaField
          label={
            ka
              ? "შეტყობინება მპოვნელისთვის"
              : "Message for the finder"
          }
          name="finder_message"
          placeholder={
            ka
              ? "მაგ. გთხოვთ დამიკავშირდეთ. მადლობა დახმარებისთვის."
              : "Example: Please contact me. Thank you for helping."
          }
        />

        <Field
          label={
            ka
              ? "მპოვნელის ჯილდო — ნებაყოფლობითი"
              : "Finder reward — optional"
          }
          name="reward"
          type="number"
          placeholder={
            ka
              ? "მაგ. 100"
              : "Example: 100"
          }
        />

        <Field
          label={
            ka
              ? "ბოლო ნანახი ადგილი — ნებაყოფლობითი"
              : "Last seen location — optional"
          }
          name="lost_seen_location"
          placeholder={
            ka
              ? "მაგ. Central Park, New York"
              : "Example: Central Park, New York"
          }
        />

        {/* LOCATION */}

        <SectionHeading
          text={
            ka
              ? "ლოკაციის გაზიარება"
              : "Location sharing"
          }
        />

        <Toggle
          title={
            ka
              ? "ლოკაციის გაზიარების ფუნქციის ჩართვა"
              : "Enable location sharing"
          }
          description={
            ka
              ? "თუ ფუნქციას ჩართავთ, QR კოდის დამსკანერებელს სურვილის შემთხვევაში შეეძლება გამოგიგზავნოთ თავისი მიმდინარე მდებარეობა. ლოკაცია ავტომატურად არ იგზავნება."
              : "When enabled, a person who scans the QR code may choose to send you their current location. Location is never shared automatically."
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

        {/* RESULT */}

        {errorMessage && (
          <div className="error">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="success">
            ✓ {successMessage}
          </div>
        )}

        {/* SAVE */}

        <button
          type="submit"
          className="saveButton"
          disabled={saving}
        >
          {saving
            ? ka
              ? "ინახება..."
              : "Saving..."
            : ka
            ? "ინფორმაციის შენახვა"
            : "Save Information"}
        </button>
      </form>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #fafafa;
          color: #101828;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .header {
          width: 100%;
          max-width: 1100px;
          min-height: 82px;
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
          gap: 11px;
          text-decoration: none;
        }

        .brandMark {
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #1465e8;
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .brandName {
          color: #1465e8;
          font-size: 21px;
          font-weight: 900;
        }

        .brandSub {
          margin-top: 3px;
          color: #9299a5;
          font-size: 7px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .headerRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .back {
          color: #505866;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .language {
          display: flex;
          padding: 4px;
          border-radius: 10px;
          background: #eceff3;
        }

        .language button {
          border: 0;
          background: transparent;
          padding: 7px 9px;
          border-radius: 7px;
          color: #7d8490;
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
          max-width: 860px;
          margin: auto;
          padding: 55px 24px 28px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .categoryIcon {
          width: 64px;
          height: 64px;
          flex: 0 0 64px;
          border-radius: 19px;
          background: #edf4ff;
          display: grid;
          place-items: center;
          font-size: 36px;
        }

        .eyebrow {
          margin-top: 2px;
          color: #1465e8;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2.5px;
        }

        .intro h1 {
          max-width: 720px;
          margin: 11px 0 0;
          font-size: clamp(
            30px,
            5vw,
            48px
          );
          line-height: 1.08;
          letter-spacing: -2px;
        }

        .intro p {
          max-width: 690px;
          margin: 15px 0 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.65;
        }

        .formCard {
          width: calc(100% - 32px);
          max-width: 860px;
          margin: 12px auto 90px;
          padding: 34px;
          border: 1px solid #e5e7eb;
          border-radius: 26px;
          background: white;
          box-shadow:
            0 15px 45px
            rgba(0, 0, 0, 0.035);
        }

        :global(.formField) {
          width: 100%;
          margin-bottom: 19px;
        }

        :global(.formLabel) {
          display: block;
          margin-bottom: 8px;
          color: #171717;
          font-size: 14px;
          font-weight: 700;
        }

        :global(.formControl) {
          display: block;
          width: 100%;
          height: 58px;
          border: 1px solid #d5d9df;
          border-radius: 13px;
          background: white;
          padding: 0 17px;
          color: #111827;
          font-family: inherit;
          font-size: 16px;
          outline: none;
        }

        :global(.formControl:focus) {
          border-color: #1465e8;
          box-shadow:
            0 0 0 3px
            rgba(20, 101, 232, 0.08);
        }

        :global(.textAreaControl) {
          min-height: 130px;
          height: auto;
          padding: 16px 17px;
          line-height: 1.55;
          resize: vertical;
        }

        :global(.fileControl) {
          width: 100%;
          height: 58px;
          border: 1px dashed #bfc5cc;
          border-radius: 13px;
          background: #fafbfc;
          padding: 0 17px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          overflow: hidden;
        }

        :global(.fileControl input) {
          display: none;
        }

        :global(.filePlus) {
          color: #1465e8;
          font-size: 22px;
        }

        :global(.fileText) {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #555f6d;
          font-size: 14px;
        }

        :global(.sectionHeading) {
          margin: 40px 0 23px;
          padding-top: 29px;
          border-top: 1px solid #eceff2;
          color: #1465e8;
          font-size: 13px;
          font-weight: 900;
        }

        :global(.toggleButton) {
          width: 100%;
          min-height: 88px;
          margin-bottom: 18px;
          border: 1px solid #d9dde2;
          border-radius: 14px;
          background: white;
          padding: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          text-align: left;
          cursor: pointer;
        }

        :global(.toggleButton.active) {
          border-color: #1465e8;
          background: #f3f7ff;
        }

        :global(.toggleTitle) {
          display: block;
          color: #171717;
          font-size: 14px;
          font-weight: 800;
        }

        :global(.toggleDescription) {
          display: block;
          margin-top: 6px;
          color: #7b8491;
          font-size: 12px;
          line-height: 1.5;
        }

        :global(.toggleStatus) {
          flex: 0 0 auto;
          color: #9ba2ad;
          font-size: 11px;
          font-weight: 900;
        }

        :global(
          .toggleButton.active
          .toggleStatus
        ) {
          color: #1465e8;
        }

        .error {
          margin-top: 20px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #fff1f1;
          color: #b42318;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.5;
        }

        .success {
          margin-top: 20px;
          padding: 14px 16px;
          border-radius: 12px;
          background: #eef9f1;
          color: #22743a;
          font-size: 13px;
          font-weight: 700;
        }

        .saveButton {
          width: 100%;
          min-height: 60px;
          margin-top: 25px;
          border: 0;
          border-radius: 14px;
          background: #1465e8;
          color: white;
          font-family: inherit;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .saveButton:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        @media (max-width: 600px) {
          .header {
            min-height: 74px;
            padding: 0 14px;
          }

          .brandMark {
            width: 40px;
            height: 40px;
          }

          .brandName {
            font-size: 18px;
          }

          .brandSub {
            display: none;
          }

          .back {
            font-size: 11px;
          }

          .intro {
            padding: 34px 16px 19px;
            gap: 14px;
          }

          .categoryIcon {
            width: 54px;
            height: 54px;
            flex-basis: 54px;
            border-radius: 16px;
            font-size: 31px;
          }

          .intro h1 {
            font-size: 27px;
            letter-spacing: -1px;
          }

          .intro p {
            font-size: 13px;
          }

          .formCard {
            width: calc(100% - 20px);
            margin-top: 8px;
            padding: 22px 16px;
            border-radius: 20px;
          }

          :global(.formControl),
          :global(.fileControl) {
            height: 58px;
            font-size: 16px;
          }

          :global(.textAreaControl) {
            min-height: 120px;
          }

          :global(.toggleButton) {
            align-items: flex-start;
          }

          .saveButton {
            min-height: 60px;
          }
        }
      `}</style>
    </main>
  );
}

function SectionHeading({
  text,
}: {
  text: string;
}) {
  return (
    <div className="sectionHeading">
      {text}
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
    <div className="formField">
      <label
        className="formLabel"
        htmlFor={name}
      >
        {label}
        {required ? " *" : ""}
      </label>

      <input
        id={name}
        className="formControl"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div className="formField">
      <label
        className="formLabel"
        htmlFor={name}
      >
        {label}
      </label>

      <select
        id={name}
        className="formControl"
        name={name}
        defaultValue=""
      >
        {options.map((option) => (
          <option
            key={`${name}-${option.value}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({
  label,
  name,
  placeholder = "",
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <div className="formField">
      <label
        className="formLabel"
        htmlFor={name}
      >
        {label}
      </label>

      <textarea
        id={name}
        className="formControl textAreaControl"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}

function FileField({
  label,
  fileName,
  setFileName,
  emptyText,
}: {
  label: string;
  fileName: string;
  setFileName: (
    value: string
  ) => void;
  emptyText: string;
}) {
  return (
    <div className="formField">
      <span className="formLabel">
        {label}
      </span>

      <label className="fileControl">
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setFileName(
              event.target.files?.[0]
                ?.name || ""
            )
          }
        />

        <span className="filePlus">
          +
        </span>

        <span className="fileText">
          {fileName || emptyText}
        </span>
      </label>
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
          ? "toggleButton active"
          : "toggleButton"
      }
      onClick={onClick}
    >
      <span>
        <span className="toggleTitle">
          {title}
        </span>

        <span className="toggleDescription">
          {description}
        </span>
      </span>

      <span className="toggleStatus">
        {enabled ? "ON" : "OFF"}
      </span>
    </button>
  );
}
