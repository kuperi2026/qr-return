"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type FormState = {
  tagCode: string;

  firstName: string;
  lastName: string;

  dateOfBirth: string;
  bloodType: string;

  allergies: string;
  medications: string;
  medicalInfo: string;

  primaryName: string;
  primaryPhone: string;

  secondaryName: string;
  secondaryPhone: string;

  doctorName: string;
  doctorPhone: string;

  ownerEmail: string;
  finderMessage: string;

  active: boolean;

  showName: boolean;
  showDateOfBirth: boolean;
  showBloodType: boolean;
  showAllergies: boolean;
  showMedications: boolean;
  showMedicalInfo: boolean;

  showPrimaryContact: boolean;
  showSecondaryContact: boolean;
  showDoctor: boolean;

  allowCall: boolean;
  allowEmail: boolean;
};

const emptyForm: FormState = {
  tagCode: "",

  firstName: "",
  lastName: "",

  dateOfBirth: "",
  bloodType: "",

  allergies: "",
  medications: "",
  medicalInfo: "",

  primaryName: "",
  primaryPhone: "",

  secondaryName: "",
  secondaryPhone: "",

  doctorName: "",
  doctorPhone: "",

  ownerEmail: "",
  finderMessage: "",

  active: true,

  showName: true,
  showDateOfBirth: true,
  showBloodType: true,
  showAllergies: true,
  showMedications: true,
  showMedicalInfo: true,

  showPrimaryContact: true,
  showSecondaryContact: false,
  showDoctor: false,

  allowCall: true,
  allowEmail: false,
};

export default function EmergencyEditPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const id =
    typeof rawId === "string"
      ? rawId
      : "";

  const [lang, setLang] =
    useState<Lang>("ka");

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const ka = lang === "ka";

  useEffect(() => {
    if (id) {
      void loadProfile();
    }
  }, [id]);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        data,
        error: loadError,
      } = await supabase
        .from("emergency_profiles")
        .select(
          `
            id,
            owner_id,
            tag_code,
            first_name,
            last_name,
            date_of_birth,
            blood_type,
            allergies,
            medications,
            medical_conditions,
            medical_note,
            emergency_contact_name,
            emergency_contact_phone,
            second_contact_name,
            second_contact_phone,
            owner_email,
            emergency_message,
            active,
            show_name,
            show_date_of_birth,
            show_blood_type,
            show_allergies,
            show_medications,
            show_medical_conditions,
            show_emergency_contact,
            show_second_contact,
            emergency_contact_mobile_enabled,
            live_chat_enabled
          `
        )
        .eq("id", id)
        .eq("owner_id", user.id)
        .maybeSingle();

      if (loadError) {
        throw loadError;
      }

      if (!data) {
        throw new Error(
          ka
            ? "Emergency ID ვერ მოიძებნა."
            : "Emergency ID not found."
        );
      }

      setForm({
        tagCode:
          data.tag_code || "",

        firstName:
          data.first_name || "",

        lastName:
          data.last_name || "",

        dateOfBirth:
          data.date_of_birth || "",

        bloodType:
          data.blood_type || "",

        allergies:
          data.allergies || "",

        medications:
          data.medications || "",

        medicalInfo:
          data.medical_conditions || "",

        primaryName:
          data.emergency_contact_name || "",

        primaryPhone:
          data.emergency_contact_phone || "",

        secondaryName:
          data.second_contact_name || "",

        secondaryPhone:
          data.second_contact_phone || "",

        doctorName:
          data.medical_note || "",

        doctorPhone:
          "",

        ownerEmail:
          data.owner_email ||
          user.email ||
          "",

        finderMessage:
          data.emergency_message || "",

        active:
          data.active !== false,

        showName:
          data.show_name !== false,

        showDateOfBirth:
          data.show_date_of_birth !==
          false,

        showBloodType:
          data.show_blood_type !== false,

        showAllergies:
          data.show_allergies !== false,

        showMedications:
          data.show_medications !== false,

        showMedicalInfo:
          data.show_medical_conditions !== false,

        showPrimaryContact:
          data.show_emergency_contact !==
          false,

        showSecondaryContact:
          data.show_second_contact ===
          true,

        showDoctor:
          Boolean(data.medical_note),

        allowCall:
          data.emergency_contact_mobile_enabled !== false,

        allowEmail:
          data.live_chat_enabled === true,
      });
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load profile."
      );
    } finally {
      setLoading(false);
    }
  }

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setSuccess("");
  }

  async function saveProfile(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.primaryPhone.trim()
    ) {
      setError(
        ka
          ? "სახელი, გვარი და მთავარი Emergency Contact აუცილებელია."
          : "First name, last name and primary Emergency Contact are required."
      );

      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        error: updateError,
      } = await supabase
        .from("emergency_profiles")
        .update({
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          date_of_birth: form.dateOfBirth || null,
          blood_type: form.bloodType.trim() || null,
          allergies: form.allergies.trim() || null,
          medications: form.medications.trim() || null,
          medical_conditions: form.medicalInfo.trim() || null,
          medical_note: form.showDoctor
            ? [form.doctorName.trim(), form.doctorPhone.trim()]
                .filter(Boolean)
                .join(" · ") || null
            : null,
          emergency_contact_enabled: true,
          emergency_contact_name: form.primaryName.trim() || null,
          emergency_contact_phone: form.primaryPhone.trim(),
          second_contact_enabled: Boolean(
            form.secondaryName.trim() || form.secondaryPhone.trim()
          ),
          second_contact_name: form.secondaryName.trim() || null,
          second_contact_phone: form.secondaryPhone.trim() || null,

          owner_email:
            form.ownerEmail.trim() ||
            user.email ||
            null,

          emergency_message:
            form.finderMessage.trim() ||
            null,

          active:
            form.active,

          show_name: form.showName,
          show_date_of_birth: form.showDateOfBirth,
          show_blood_type: form.showBloodType,
          show_allergies: form.showAllergies,
          show_medications: form.showMedications,
          show_medical_conditions: form.showMedicalInfo,
          show_medical_note: form.showDoctor,
          show_emergency_contact: form.showPrimaryContact,
          show_second_contact: form.showSecondaryContact,
          emergency_contact_mobile_enabled: form.allowCall,
          live_chat_enabled: form.allowEmail,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("owner_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(
        ka
          ? "✓ Emergency ID წარმატებით განახლდა."
          : "✓ Emergency ID updated successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ცვლილებების შენახვა ვერ მოხერხდა."
          : "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loading">
        {ka
          ? "Emergency ID იტვირთება..."
          : "Loading Emergency ID..."}

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: grid;
            place-items: center;

            color: #697581;
            background: #f5f7f8;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="language">
        <button
          type="button"
          className={
            ka ? "active" : ""
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
            !ka ? "active" : ""
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

        <div className="heading">
          <span>
            QR RETURN EMERGENCY
          </span>

          <h1>
            {ka
              ? "Emergency ID-ის რედაქტირება"
              : "Edit Emergency ID"}
          </h1>

          <p>
            {ka
              ? "შეცვალეთ Emergency ინფორმაცია და აკონტროლეთ რა გამოჩნდება QR-ის დასკანერებისას."
              : "Update emergency information and control what appears when the QR is scanned."}
          </p>
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <form
          onSubmit={saveProfile}
          className="form"
        >
          <Section
            number="01"
            title={
              ka
                ? "პირადი ინფორმაცია"
                : "Personal Information"
            }
          >
            <Field
              label="Tag Code"
              value={form.tagCode}
              disabled
              onChange={() => {}}
            />

            <div className="two">
              <Field
                label={
                  ka
                    ? "სახელი *"
                    : "First Name *"
                }
                value={form.firstName}
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
                value={form.lastName}
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
                type="date"
                label={
                  ka
                    ? "დაბადების თარიღი"
                    : "Date of Birth"
                }
                value={form.dateOfBirth}
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
                value={form.bloodType}
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
              value={form.allergies}
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
              value={form.medications}
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
                  ? "მნიშვნელოვანი სამედიცინო ინფორმაცია"
                  : "Important Medical Information"
              }
              value={form.medicalInfo}
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
            title="Emergency Contacts"
          >
            <div className="two">
              <Field
                label={
                  ka
                    ? "მთავარი კონტაქტის სახელი"
                    : "Primary Contact Name"
                }
                value={form.primaryName}
                onChange={(value) =>
                  update(
                    "primaryName",
                    value
                  )
                }
              />

              <Field
                type="tel"
                label={
                  ka
                    ? "მთავარი ტელეფონი *"
                    : "Primary Phone *"
                }
                value={form.primaryPhone}
                onChange={(value) =>
                  update(
                    "primaryPhone",
                    value
                  )
                }
              />
            </div>

            <div className="two">
              <Field
                label={
                  ka
                    ? "დამატებითი კონტაქტის სახელი"
                    : "Secondary Contact Name"
                }
                value={form.secondaryName}
                onChange={(value) =>
                  update(
                    "secondaryName",
                    value
                  )
                }
              />

              <Field
                type="tel"
                label={
                  ka
                    ? "დამატებითი ტელეფონი"
                    : "Secondary Phone"
                }
                value={form.secondaryPhone}
                onChange={(value) =>
                  update(
                    "secondaryPhone",
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
                value={form.doctorName}
                onChange={(value) =>
                  update(
                    "doctorName",
                    value
                  )
                }
              />

              <Field
                type="tel"
                label={
                  ka
                    ? "ექიმის ტელეფონი"
                    : "Doctor Phone"
                }
                value={form.doctorPhone}
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
                  ? "QR-ის დამსკანერებლისთვის შეტყობინება"
                  : "Message for the person scanning the QR"
              }
              value={form.finderMessage}
              onChange={(value) =>
                update(
                  "finderMessage",
                  value
                )
              }
            />

            <Field
              type="email"
              label="Email"
              value={form.ownerEmail}
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
            title="Privacy Controls"
          >
            <div className="toggles">
              <Toggle
                title={
                  ka
                    ? "სახელის ჩვენება"
                    : "Show Name"
                }
                checked={form.showName}
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
                    ? "დაბადების თარიღის ჩვენება"
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
                    ? "სისხლის ჯგუფის ჩვენება"
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
                    ? "ალერგიების ჩვენება"
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
                    ? "მედიკამენტების ჩვენება"
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
                    ? "სამედიცინო ინფორმაციის ჩვენება"
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
                  form.showPrimaryContact
                }
                onChange={(value) =>
                  update(
                    "showPrimaryContact",
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
                    ? "დარეკვის დაშვება"
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

          <Section
            number="07"
            title={
              ka
                ? "Emergency ID სტატუსი"
                : "Emergency ID Status"
            }
          >
            <Toggle
              title={
                ka
                  ? "Emergency ID აქტიურია"
                  : "Emergency ID is active"
              }
              checked={form.active}
              onChange={(value) =>
                update(
                  "active",
                  value
                )
              }
            />
          </Section>

          <div className="bottom">
            <Link
              href="/my-profiles"
              className="cancel"
            >
              {ka
                ? "გაუქმება"
                : "Cancel"}
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="save"
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "ცვლილებების შენახვა"
                : "Save Changes"}
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
          margin: auto;
        }

        .language {
          position: fixed;
          top: 18px;
          right: 20px;
          z-index: 20;
          display: flex;
          gap: 4px;
          padding: 4px;
          border: 1px solid #e0e5e8;
          border-radius: 999px;
          background: white;
        }

        .language button {
          min-width: 38px;
          height: 27px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #89939d;
          cursor: pointer;
          font-size: 7px;
          font-weight: 900;
        }

        .language button.active {
          background: #202b37;
          color: white;
        }

        .back {
          display: inline-block;
          margin-bottom: 24px;
          color: #697581;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
        }

        .heading span {
          color: #c84a50;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .heading h1 {
          margin: 7px 0 0;
          color: #202b37;
          font-size: clamp(34px, 4vw, 46px);
          letter-spacing: -1.8px;
        }

        .heading p {
          max-width: 680px;
          margin: 10px 0 0;
          color: #78838e;
          font-size: 10px;
          line-height: 1.7;
        }

        .form {
          margin-top: 28px;
          display: grid;
          gap: 15px;
        }

        .two,
        .toggles {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .error,
        .success {
          margin-top: 20px;
          padding: 13px;
          border-radius: 10px;
          font-size: 9px;
        }

        .error {
          border: 1px solid #edd3d5;
          color: #9d3f45;
          background: #fff5f5;
        }

        .success {
          border: 1px solid #b7e2c8;
          color: #26724a;
          background: #f1fbf5;
        }

        .bottom {
          padding: 18px;
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          border: 1px solid #e0e5e8;
          border-radius: 13px;
          background: white;
        }

        .cancel,
        .save {
          min-height: 43px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 8px;
          font-weight: 850;
        }

        .cancel {
          border: 1px solid #dce2e6;
          color: #596672;
          background: white;
          text-decoration: none;
        }

        .save {
          border: 0;
          color: white;
          background: #c84a50;
          cursor: pointer;
        }

        .save:disabled {
          opacity: 0.6;
        }

        @media (max-width: 650px) {
          .two,
          .toggles {
            grid-template-columns: 1fr;
          }

          .bottom {
            display: grid;
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
  children: React.ReactNode;
}) {
  return (
    <section className="section">
      <div className="sectionHeading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>

      <div className="content">
        {children}
      </div>

      <style jsx>{`
        .section {
          padding: 20px;
          border: 1px solid #e0e5e8;
          border-radius: 14px;
          background: white;
        }

        .sectionHeading {
          padding-bottom: 13px;
          border-bottom: 1px solid #e8ebed;
        }

        .sectionHeading span {
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
  type = "text",
  placeholder = "",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) =>
          onChange(event.target.value)
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
          border: 1px solid #dce2e6;
          border-radius: 9px;
          outline: 0;
          background: #fbfcfc;
        }

        input:disabled {
          color: #8c969f;
          background: #f0f2f3;
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
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <textarea
        rows={4}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
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
          border: 1px solid #dce2e6;
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
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <strong>{title}</strong>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
      />

      <style jsx>{`
        .toggle {
          min-height: 56px;
          padding: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid #e2e6e9;
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
