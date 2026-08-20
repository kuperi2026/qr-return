"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type EmergencyForm = {
  tagCode: string;

  firstName: string;
  lastName: string;
  dateOfBirth: string;

  bloodType: string;

  allergies: string;
  medications: string;
  medicalInfo: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  secondaryContactName: string;
  secondaryContactPhone: string;

  doctorName: string;
  doctorPhone: string;

  ownerEmail: string;

  finderMessage: string;

  showName: boolean;
  showDateOfBirth: boolean;
  showBloodType: boolean;
  showAllergies: boolean;
  showMedications: boolean;
  showMedicalInfo: boolean;

  showEmergencyContact: boolean;
  showSecondaryContact: boolean;
  showDoctor: boolean;

  allowCall: boolean;
  allowEmail: boolean;
};

const initialForm: EmergencyForm = {
  tagCode: "",

  firstName: "",
  lastName: "",
  dateOfBirth: "",

  bloodType: "",

  allergies: "",
  medications: "",
  medicalInfo: "",

  emergencyContactName: "",
  emergencyContactPhone: "",

  secondaryContactName: "",
  secondaryContactPhone: "",

  doctorName: "",
  doctorPhone: "",

  ownerEmail: "",

  finderMessage:
    "თუ დახმარება მჭირდება, გთხოვთ გამოიყენოთ ამ გვერდზე მითითებული Emergency Contact.",

  showName: true,
  showDateOfBirth: true,
  showBloodType: true,
  showAllergies: true,
  showMedications: true,
  showMedicalInfo: true,

  showEmergencyContact: true,
  showSecondaryContact: false,
  showDoctor: false,

  allowCall: true,
  allowEmail: false,
};

export default function EmergencyRegisterPage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [form, setForm] =
    useState<EmergencyForm>(
      initialForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const ka = lang === "ka";

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user },
        error,
      } =
        await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      setForm((current) => ({
        ...current,
        ownerEmail:
          user.email || "",
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Account error"
      );
    } finally {
      setLoading(false);
    }
  }

  function update<
    K extends keyof EmergencyForm
  >(
    key: K,
    value: EmergencyForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !form.tagCode.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.emergencyContactPhone.trim()
    ) {
      setError(
        ka
          ? "შეავსეთ Tag Code, სახელი, გვარი და მთავარი Emergency Contact."
          : "Complete Tag Code, first name, last name, and the primary emergency contact."
      );

      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const privacy = {
        show_name:
          form.showName,

        show_date_of_birth:
          form.showDateOfBirth,

        show_blood_type:
          form.showBloodType,

        show_allergies:
          form.showAllergies,

        show_medications:
          form.showMedications,

        show_medical_info:
          form.showMedicalInfo,

        show_emergency_contact:
          form.showEmergencyContact,

        show_secondary_contact:
          form.showSecondaryContact,

        show_doctor:
          form.showDoctor,

        allow_call:
          form.allowCall,

        allow_email:
          form.allowEmail,
      };

      const emergencyData = {
        first_name:
          form.firstName.trim(),

        last_name:
          form.lastName.trim(),

        date_of_birth:
          form.dateOfBirth ||
          null,

        blood_type:
          form.bloodType ||
          null,

        allergies:
          form.allergies.trim() ||
          null,

        medications:
          form.medications.trim() ||
          null,

        medical_info:
          form.medicalInfo.trim() ||
          null,

        emergency_contact_name:
          form.emergencyContactName.trim() ||
          null,

        emergency_contact_phone:
          form.emergencyContactPhone.trim(),

        secondary_contact_name:
          form.secondaryContactName.trim() ||
          null,

        secondary_contact_phone:
          form.secondaryContactPhone.trim() ||
          null,

        doctor_name:
          form.doctorName.trim() ||
          null,

        doctor_phone:
          form.doctorPhone.trim() ||
          null,

        privacy,
      };

      /*
        Emergency-ს item table-ში ვტოვებთ
        მხოლოდ როგორც QR profile type-ს.
        დეტალური Emergency მონაცემები
        metadata-ში ინახება.
      */

      const {
        data,
        error,
      } = await supabase
        .from("item")
        .insert({
          owner_id:
            user.id,

          tag_code:
            form.tagCode
              .trim()
              .toUpperCase(),

          item_type:
            "emergency",

          item_name:
            `${form.firstName.trim()} ${form.lastName.trim()}`,

          owner_email:
            form.ownerEmail.trim() ||
            user.email ||
            null,

          finder_message:
            form.finderMessage.trim() ||
            null,

          description:
            JSON.stringify(
              emergencyData
            ),

          active:
            true,

          scan_count:
            0,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      window.location.href =
        "/my-profiles";
    } catch (err) {
      console.error(
        "Emergency registration error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Emergency ID-ის შექმნა ვერ მოხერხდა."
          : "Could not create Emergency ID."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loading">
        Emergency Registration იტვირთება...

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: grid;
            place-items: center;

            background: #f5f7f8;
            color: #697581;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="languageBar">
        <button
          type="button"
          className={
            ka
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
            !ka
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

      <div className="shell">
        <Link
          href="/my-profiles"
          className="back"
        >
          ←{" "}
          {ka
            ? "ჩემი პროფილები"
            : "My Profiles"}
        </Link>

        <span className="eyebrow">
          QR RETURN EMERGENCY
        </span>

        <h1>
          {ka
            ? "Emergency ID რეგისტრაცია"
            : "Emergency ID Registration"}
        </h1>

        <p className="intro">
          {ka
            ? "შექმენით Emergency QR პროფილი და თქვენ თვითონ გადაწყვიტეთ რომელი ინფორმაცია გამოჩნდება QR-ის დასკანერებისას."
            : "Create an Emergency QR profile and choose exactly what information is shown when the QR is scanned."}
        </p>

        <form
          className="form"
          onSubmit={
            handleSubmit
          }
        >
          <Section
            number="01"
            title={
              ka
                ? "QR და პირადი ინფორმაცია"
                : "QR & Personal Information"
            }
          >
            <Field
              label="Tag Code *"
              value={
                form.tagCode
              }
              placeholder="QR-XXXXXX"
              onChange={(value) =>
                update(
                  "tagCode",
                  value
                )
              }
            />

            <div className="two">
              <Field
                label={
                  ka
                    ? "სახელი *"
                    : "First Name *"
                }
                value={
                  form.firstName
                }
                onChange={(value) =>
                  update(
                    "firstName",
                    value
                  )
                }
              />

              <Field
                label={
                  ka
                    ? "გვარი *"
                    : "Last Name *"
                }
                value={
                  form.lastName
                }
                onChange={(value) =>
                  update(
                    "lastName",
                    value
                  )
                }
              />
            </div>

            <div className="two">
              <Field
                label={
                  ka
                    ? "დაბადების თარიღი"
                    : "Date of Birth"
                }
                type="date"
                value={
                  form.dateOfBirth
                }
                onChange={(value) =>
                  update(
                    "dateOfBirth",
                    value
                  )
                }
              />

              <Field
                label={
                  ka
                    ? "სისხლის ჯგუფი"
                    : "Blood Type"
                }
                value={
                  form.bloodType
                }
                placeholder="O+, A+, B-..."
                onChange={(value) =>
                  update(
                    "bloodType",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section
            number="02"
            title={
              ka
                ? "სამედიცინო ინფორმაცია"
                : "Medical Information"
            }
          >
            <TextArea
              label={
                ka
                  ? "ალერგიები"
                  : "Allergies"
              }
              value={
                form.allergies
              }
              onChange={(value) =>
                update(
                  "allergies",
                  value
                )
              }
            />

            <TextArea
              label={
                ka
                  ? "მედიკამენტები"
                  : "Medications"
              }
              value={
                form.medications
              }
              onChange={(value) =>
                update(
                  "medications",
                  value
                )
              }
            />

            <TextArea
              label={
                ka
                  ? "სხვა მნიშვნელოვანი ინფორმაცია"
                  : "Important Medical Information"
              }
              value={
                form.medicalInfo
              }
              onChange={(value) =>
                update(
                  "medicalInfo",
                  value
                )
              }
            />
          </Section>

          <Section
            number="03"
            title={
              ka
                ? "Emergency Contacts"
                : "Emergency Contacts"
            }
          >
            <div className="two">
              <Field
                label={
                  ka
                    ? "მთავარი კონტაქტის სახელი"
                    : "Primary Contact Name"
                }
                value={
                  form.emergencyContactName
                }
                onChange={(value) =>
                  update(
                    "emergencyContactName",
                    value
                  )
                }
              />

              <Field
                label={
                  ka
                    ? "მთავარი ტელეფონი *"
                    : "Primary Phone *"
                }
                type="tel"
                value={
                  form.emergencyContactPhone
                }
                placeholder="+1 ..."
                onChange={(value) =>
                  update(
                    "emergencyContactPhone",
                    value
                  )
                }
              />
            </div>

            <div className="two">
              <Field
                label={
                  ka
                    ? "დამატებითი პირის სახელი"
                    : "Secondary Contact Name"
                }
                value={
                  form.secondaryContactName
                }
                onChange={(value) =>
                  update(
                    "secondaryContactName",
                    value
                  )
                }
              />

              <Field
                label={
                  ka
                    ? "დამატებითი პირის ტელეფონი"
                    : "Secondary Contact Phone"
                }
                type="tel"
                value={
                  form.secondaryContactPhone
                }
                placeholder="+1 ..."
                onChange={(value) =>
                  update(
                    "secondaryContactPhone",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section
            number="04"
            title={
              ka
                ? "ექიმი / კლინიკა"
                : "Doctor / Clinic"
            }
          >
            <div className="two">
              <Field
                label={
                  ka
                    ? "ექიმის სახელი"
                    : "Doctor Name"
                }
                value={
                  form.doctorName
                }
                onChange={(value) =>
                  update(
                    "doctorName",
                    value
                  )
                }
              />

              <Field
                label={
                  ka
                    ? "ექიმის ტელეფონი"
                    : "Doctor Phone"
                }
                type="tel"
                value={
                  form.doctorPhone
                }
                onChange={(value) =>
                  update(
                    "doctorPhone",
                    value
                  )
                }
              />
            </div>
          </Section>

          <Section
            number="05"
            title={
              ka
                ? "Emergency შეტყობინება"
                : "Emergency Message"
            }
          >
            <TextArea
              label={
                ka
                  ? "რას დაინახავს მპოვნელი"
                  : "Message shown to the finder"
              }
              value={
                form.finderMessage
              }
              onChange={(value) =>
                update(
                  "finderMessage",
                  value
                )
              }
            />

            <Field
              label="Owner Email"
              type="email"
              value={
                form.ownerEmail
              }
              onChange={(value) =>
                update(
                  "ownerEmail",
                  value
                )
              }
            />
          </Section>

          <Section
            number="06"
            title={
              ka
                ? "Privacy Controls"
                : "Privacy Controls"
            }
          >
            <div className="toggles">
              <Toggle
                title={
                  ka
                    ? "სახელის ჩვენება"
                    : "Show Name"
                }
                checked={
                  form.showName
                }
                onChange={(value) =>
                  update(
                    "showName",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "დაბადების თარიღი"
                    : "Show Date of Birth"
                }
                checked={
                  form.showDateOfBirth
                }
                onChange={(value) =>
                  update(
                    "showDateOfBirth",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "სისხლის ჯგუფი"
                    : "Show Blood Type"
                }
                checked={
                  form.showBloodType
                }
                onChange={(value) =>
                  update(
                    "showBloodType",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "ალერგიები"
                    : "Show Allergies"
                }
                checked={
                  form.showAllergies
                }
                onChange={(value) =>
                  update(
                    "showAllergies",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "მედიკამენტები"
                    : "Show Medications"
                }
                checked={
                  form.showMedications
                }
                onChange={(value) =>
                  update(
                    "showMedications",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "სამედიცინო ინფორმაცია"
                    : "Show Medical Information"
                }
                checked={
                  form.showMedicalInfo
                }
                onChange={(value) =>
                  update(
                    "showMedicalInfo",
                    value
                  )
                }
              />

              <Toggle
                title="Primary Emergency Contact"
                checked={
                  form.showEmergencyContact
                }
                onChange={(value) =>
                  update(
                    "showEmergencyContact",
                    value
                  )
                }
              />

              <Toggle
                title="Secondary Contact"
                checked={
                  form.showSecondaryContact
                }
                onChange={(value) =>
                  update(
                    "showSecondaryContact",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "ექიმის ინფორმაციის ჩვენება"
                    : "Show Doctor Information"
                }
                checked={
                  form.showDoctor
                }
                onChange={(value) =>
                  update(
                    "showDoctor",
                    value
                  )
                }
              />

              <Toggle
                title={
                  ka
                    ? "პირდაპირი დარეკვა"
                    : "Allow Direct Call"
                }
                checked={
                  form.allowCall
                }
                onChange={(value) =>
                  update(
                    "allowCall",
                    value
                  )
                }
              />

              <Toggle
                title="Allow Email"
                checked={
                  form.allowEmail
                }
                onChange={(value) =>
                  update(
                    "allowEmail",
                    value
                  )
                }
              />
            </div>
          </Section>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="submitArea">
            <div>
              <span>
                QR RETURN EMERGENCY
              </span>

              <strong>
                {ka
                  ? "ინფორმაციის შეცვლა მოგვიანებითაც შეგეძლებათ."
                  : "You can update this information later."}
              </strong>
            </div>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "Emergency ID-ის შექმნა"
                : "Create Emergency ID"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          padding: 45px 0 90px;

          position: relative;

          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 900px;

          margin: 0 auto;
        }

        .languageBar {
          position: fixed;

          top: 18px;
          right: 20px;

          z-index: 20;

          display: flex;
          gap: 4px;

          padding: 4px;

          border:
            1px solid #e0e5e8;

          border-radius: 999px;

          background: white;
        }

        .languageBar button {
          min-width: 38px;
          height: 27px;

          border: 0;
          border-radius: 999px;

          color: #89939d;
          background: transparent;

          cursor: pointer;

          font-size: 7px;
          font-weight: 900;
        }

        .languageBar button.active {
          color: white;
          background: #202b37;
        }

        .back {
          display: inline-block;

          margin-bottom: 24px;

          color: #697581;

          font-size: 9px;
          font-weight: 800;

          text-decoration: none;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 7px 0 0;

          color: #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          font-weight: 760;
          letter-spacing: -1.8px;
        }

        .intro {
          max-width: 700px;

          margin: 10px 0 0;

          color: #78838e;

          font-size: 10px;
          line-height: 1.7;
        }

        .form {
          margin-top: 30px;

          display: grid;
          gap: 16px;
        }

        .two {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .toggles {
          display: grid;

          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        .error {
          padding: 13px;

          border:
            1px solid #edd3d5;

          border-radius: 9px;

          color: #9d3f45;
          background: #fff5f5;

          font-size: 8px;
        }

        .submitArea {
          padding: 18px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 20px;

          border:
            1px solid #e0e5e8;

          border-radius: 13px;

          background: white;
        }

        .submitArea span,
        .submitArea strong {
          display: block;
        }

        .submitArea span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
        }

        .submitArea strong {
          margin-top: 5px;

          color: #697581;

          font-size: 8px;
        }

        .submitArea button {
          min-height: 43px;

          padding: 0 14px;

          border: 0;
          border-radius: 9px;

          color: white;
          background: #c84a50;

          cursor: pointer;

          font-size: 8px;
          font-weight: 850;
        }

        .submitArea button:disabled {
          opacity: 0.6;
        }

        @media(max-width:650px) {
          .two,
          .toggles {
            grid-template-columns: 1fr;
          }

          .submitArea {
            align-items: stretch;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="heading">
        <span>
          {number}
        </span>

        <h2>
          {title}
        </h2>
      </div>

      <div className="content">
        {children}
      </div>

      <style jsx>{`
        .section {
          padding: 20px;

          border:
            1px solid #e0e5e8;

          border-radius: 14px;

          background: white;
        }

        .heading {
          padding-bottom: 13px;

          border-bottom:
            1px solid #e8ebed;
        }

        .heading span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
        }

        h2 {
          margin: 5px 0 0;

          color: #35414c;

          font-size: 16px;
        }

        .content {
          padding-top: 15px;

          display: grid;
          gap: 12px;
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange:
    (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 6px;
        }

        span {
          color: #56636f;

          font-size: 9px;
          font-weight: 850;
        }

        input {
          width: 100%;
          height: 44px;

          padding: 0 11px;

          border:
            1px solid #dce2e6;

          border-radius: 9px;

          outline: 0;

          background: #fbfcfc;
        }
      `}</style>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange:
    (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <textarea
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 6px;
        }

        span {
          color: #56636f;

          font-size: 9px;
          font-weight: 850;
        }

        textarea {
          width: 100%;

          padding: 11px;

          border:
            1px solid #dce2e6;

          border-radius: 9px;

          outline: 0;

          background: #fbfcfc;

          resize: vertical;
          font-family: inherit;
        }
      `}</style>
    </label>
  );
}

function Toggle({
  title,
  checked,
  onChange,
}: {
  title: string;
  checked: boolean;
  onChange:
    (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <strong>
        {title}
      </strong>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />

      <style jsx>{`
        .toggle {
          min-height: 56px;

          padding: 11px;

          display: flex;
          align-items: center;
          justify-content:
            space-between;

          gap: 10px;

          border:
            1px solid #e2e6e9;

          border-radius: 10px;

          background: #fafbfb;
        }

        strong {
          color: #4b5864;

          font-size: 8px;
        }

        input {
          width: 17px;
          height: 17px;
        }
      `}</style>
    </label>
  );
}
