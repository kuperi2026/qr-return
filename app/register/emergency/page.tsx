"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type Step = 1 | 2 | 3;

type FormState = {
  tag_code: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  blood_type: string;
  allergies: string;
  medical_conditions: string;
  medications: string;
  medical_note: string;
  address: string;

  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;

  second_contact_name: string;
  second_contact_relationship: string;
  second_contact_phone: string;

  emergency_message: string;
};

type VisibilityState = {
  show_photo: boolean;
  show_date_of_birth: boolean;
  show_blood_type: boolean;
  show_allergies: boolean;
  show_medical_conditions: boolean;
  show_medications: boolean;
  show_medical_note: boolean;
  show_address: boolean;
  show_second_contact: boolean;
  show_emergency_message: boolean;
};

const initialForm: FormState = {
  tag_code: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
  blood_type: "",
  allergies: "",
  medical_conditions: "",
  medications: "",
  medical_note: "",
  address: "",

  emergency_contact_name: "",
  emergency_contact_relationship: "",
  emergency_contact_phone: "",

  second_contact_name: "",
  second_contact_relationship: "",
  second_contact_phone: "",

  emergency_message: "",
};

const initialVisibility: VisibilityState = {
  show_photo: true,
  show_date_of_birth: false,
  show_blood_type: true,
  show_allergies: true,
  show_medical_conditions: true,
  show_medications: true,
  show_medical_note: true,
  show_address: false,
  show_second_contact: false,
  show_emergency_message: true,
};

export default function EmergencyRegistrationPage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [visibility, setVisibility] =
    useState<VisibilityState>(initialVisibility);

  const [photo, setPhoto] = useState<File | null>(null);
  const [locationSharing, setLocationSharing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const ka = language === "ka";

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function toggle(field: keyof VisibilityState) {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function top() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function nextStep() {
    setError("");

    if (step === 1) {
      if (!form.tag_code.trim()) {
        setError(ka ? "შეიყვანეთ QR კოდი." : "Enter the QR code.");
        return;
      }

      if (!form.first_name.trim()) {
        setError(ka ? "შეიყვანეთ სახელი." : "Enter the first name.");
        return;
      }

      if (!form.last_name.trim()) {
        setError(ka ? "შეიყვანეთ გვარი." : "Enter the last name.");
        return;
      }

      setStep(2);
      top();
      return;
    }

    if (step === 2) {
      setStep(3);
      top();
    }
  }

  function previousStep() {
    setError("");

    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
    }

    top();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step !== 3) {
      nextStep();
      return;
    }

    if (!form.emergency_contact_name.trim()) {
      setError(
        ka
          ? "შეიყვანეთ სასწრაფო დახმარების კონტაქტის სახელი და გვარი."
          : "Enter the emergency contact's full name."
      );
      return;
    }

    if (!form.emergency_contact_relationship.trim()) {
      setError(
        ka
          ? "მიუთითეთ, ვინ არის ეს პირი თქვენთვის."
          : "Select the emergency contact's relationship to you."
      );
      return;
    }

    if (!form.emergency_contact_phone.trim()) {
      setError(
        ka
          ? "შეიყვანეთ სასწრაფო დახმარების კონტაქტის ტელეფონის ნომერი."
          : "Enter the emergency contact's phone number."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      /*
        IMPORTANT:
        Emergency-ისთვის Supabase-ში ცალკე ცხრილს შევქმნით.
        მაგალითად: emergency_profiles

        სანამ ცხრილს არ შევქმნით, რეალურ INSERT-ს არ ვუშვებთ,
        რათა არსებული item ცხრილი არ დაზიანდეს.
      */

      console.log({
        ...form,
        ...visibility,
        location_sharing_enabled: locationSharing,
        photo,
      });

      setSuccess(true);
      top();
    } catch (err) {
      console.error(err);

      setError(
        ka
          ? "პროფილის შენახვისას დაფიქსირდა შეცდომა."
          : "An error occurred while saving the profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <main className="page">
        <Header
          language={language}
          setLanguage={setLanguage}
        />

        <section className="success">
          <div className="successIcon">✓</div>

          <div className="eyebrow">EMERGENCY ID</div>

          <h1>
            {ka
              ? "Emergency პროფილი მზადაა"
              : "Emergency profile is ready"}
          </h1>

          <p>
            {ka
              ? "ინფორმაცია წარმატებით დამუშავდა."
              : "Your information was processed successfully."}
          </p>

          <a href="/" className="primaryButton">
            {ka ? "მთავარ გვერდზე დაბრუნება" : "Return home"}
          </a>
        </section>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <Header
        language={language}
        setLanguage={setLanguage}
      />

      <section className="content">
        <div className="hero">
          <div className="emergencyIcon">✚</div>

          <div>
            <div className="eyebrow">QR RETURN • EMERGENCY ID</div>

            <h1>
              {ka
                ? "Emergency სამაჯურის რეგისტრაცია"
                : "Emergency Bracelet Registration"}
            </h1>

            <p>
              {ka
                ? "შექმენით Emergency პროფილი და თავად განსაზღვრეთ, რომელი დამატებითი ინფორმაცია გამოჩნდება QR კოდის დასკანერებისას."
                : "Create an emergency profile and choose which optional information appears when the QR code is scanned."}
            </p>
          </div>
        </div>

        <div className="infoBox">
          <strong>
            {ka ? "ინფორმაციის ხილვადობა" : "Information visibility"}
          </strong>

          <p>
            {ka
              ? "სავალდებულო ინფორმაცია ყოველთვის გამოჩნდება. დანარჩენი ინფორმაციის შევსებაც და ჩვენებაც თქვენი არჩევანია."
              : "Required information is always visible. Completing and displaying all other information is your choice."}
          </p>
        </div>

        <div className="progress">
          <Progress
            number="1"
            label={ka ? "პირადი ინფორმაცია" : "Personal"}
            active={step >= 1}
            current={step === 1}
          />

          <div className={step >= 2 ? "line active" : "line"} />

          <Progress
            number="2"
            label={ka ? "სამედიცინო" : "Medical"}
            active={step >= 2}
            current={step === 2}
          />

          <div className={step >= 3 ? "line active" : "line"} />

          <Progress
            number="3"
            label={ka ? "კონტაქტი" : "Contact"}
            active={step >= 3}
            current={step === 3}
          />
        </div>

        <form className="card" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <StepTitle
                number="01"
                title={ka ? "პირადი ინფორმაცია" : "Personal information"}
                text={
                  ka
                    ? "ძირითადი ინფორმაცია Emergency პროფილისთვის."
                    : "Basic information for the emergency profile."
                }
              />

              <RequiredField
                label={ka ? "QR კოდი" : "QR code"}
                value={form.tag_code}
                onChange={(value) => updateField("tag_code", value)}
                ka={ka}
              />

              <div className="grid2">
                <RequiredField
                  label={ka ? "სახელი" : "First name"}
                  value={form.first_name}
                  onChange={(value) => updateField("first_name", value)}
                  ka={ka}
                />

                <RequiredField
                  label={ka ? "გვარი" : "Last name"}
                  value={form.last_name}
                  onChange={(value) => updateField("last_name", value)}
                  ka={ka}
                />
              </div>

              <OptionalPhoto
                label={ka ? "ფოტო" : "Photo"}
                file={photo}
                setFile={setPhoto}
                visible={visibility.show_photo}
                onToggle={() => toggle("show_photo")}
                ka={ka}
              />

              <OptionalField
                label={ka ? "დაბადების თარიღი" : "Date of birth"}
                type="date"
                value={form.date_of_birth}
                onChange={(value) => updateField("date_of_birth", value)}
                visible={visibility.show_date_of_birth}
                onToggle={() => toggle("show_date_of_birth")}
                ka={ka}
              />

              <OptionalSelect
                label={ka ? "სისხლის ჯგუფი" : "Blood type"}
                value={form.blood_type}
                onChange={(value) => updateField("blood_type", value)}
                visible={visibility.show_blood_type}
                onToggle={() => toggle("show_blood_type")}
                ka={ka}
                options={[
                  "",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <OptionalField
                label={ka ? "მისამართი" : "Address"}
                value={form.address}
                onChange={(value) => updateField("address", value)}
                visible={visibility.show_address}
                onToggle={() => toggle("show_address")}
                ka={ka}
              />

              {error && <ErrorBox text={error} />}

              <button
                type="button"
                className="primaryButton full"
                onClick={nextStep}
              >
                {ka ? "შემდეგი" : "Next"} →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <StepTitle
                number="02"
                title={ka ? "სამედიცინო ინფორმაცია" : "Medical information"}
                text={
                  ka
                    ? "შეავსეთ მხოლოდ თქვენთვის მნიშვნელოვანი ინფორმაცია."
                    : "Add only the information that is relevant to you."
                }
              />

              <OptionalTextArea
                label={ka ? "ალერგიები" : "Allergies"}
                value={form.allergies}
                onChange={(value) => updateField("allergies", value)}
                visible={visibility.show_allergies}
                onToggle={() => toggle("show_allergies")}
                ka={ka}
              />

              <OptionalTextArea
                label={ka ? "სამედიცინო მდგომარეობა" : "Medical conditions"}
                value={form.medical_conditions}
                onChange={(value) =>
                  updateField("medical_conditions", value)
                }
                visible={visibility.show_medical_conditions}
                onToggle={() => toggle("show_medical_conditions")}
                ka={ka}
              />

              <OptionalTextArea
                label={ka ? "მიღებული მედიკამენტები" : "Current medications"}
                value={form.medications}
                onChange={(value) => updateField("medications", value)}
                visible={visibility.show_medications}
                onToggle={() => toggle("show_medications")}
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "მნიშვნელოვანი სამედიცინო ინფორმაცია"
                    : "Important medical information"
                }
                value={form.medical_note}
                onChange={(value) => updateField("medical_note", value)}
                visible={visibility.show_medical_note}
                onToggle={() => toggle("show_medical_note")}
                ka={ka}
              />

              <div className="buttons">
                <button
                  type="button"
                  className="backButton"
                  onClick={previousStep}
                >
                  ← {ka ? "უკან" : "Back"}
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  onClick={nextStep}
                >
                  {ka ? "შემდეგი" : "Next"} →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <StepTitle
                number="03"
                title={
                  ka
                    ? "სასწრაფო დახმარების კონტაქტი"
                    : "Emergency contact"
                }
                text={
                  ka
                    ? "მიუთითეთ პირი, რომელსაც საგანგებო სიტუაციაში უნდა დაუკავშირდნენ."
                    : "Add the person who should be contacted in an emergency."
                }
              />

              <RequiredField
                label={ka ? "სახელი და გვარი" : "Full name"}
                value={form.emergency_contact_name}
                onChange={(value) =>
                  updateField("emergency_contact_name", value)
                }
                ka={ka}
              />

              <RequiredSelect
                label={ka ? "თქვენთან კავშირი" : "Relationship to you"}
                value={form.emergency_contact_relationship}
                onChange={(value) =>
                  updateField("emergency_contact_relationship", value)
                }
                ka={ka}
              />

              <RequiredField
                label={ka ? "ტელეფონის ნომერი" : "Phone number"}
                type="tel"
                value={form.emergency_contact_phone}
                onChange={(value) =>
                  updateField("emergency_contact_phone", value)
                }
                ka={ka}
              />

              <div className="sectionDivider" />

              <div className="sectionHeading">
                <strong>
                  {ka
                    ? "მეორე საკონტაქტო პირი"
                    : "Second emergency contact"}
                </strong>

                <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
              </div>

              <OptionalField
                label={ka ? "სახელი და გვარი" : "Full name"}
                value={form.second_contact_name}
                onChange={(value) =>
                  updateField("second_contact_name", value)
                }
                visible={visibility.show_second_contact}
                onToggle={() => toggle("show_second_contact")}
                ka={ka}
              />

              <OptionalSelectRelationship
                label={ka ? "თქვენთან კავშირი" : "Relationship to you"}
                value={form.second_contact_relationship}
                onChange={(value) =>
                  updateField("second_contact_relationship", value)
                }
                visible={visibility.show_second_contact}
                onToggle={() => toggle("show_second_contact")}
                ka={ka}
              />

              <OptionalField
                label={ka ? "ტელეფონის ნომერი" : "Phone number"}
                type="tel"
                value={form.second_contact_phone}
                onChange={(value) =>
                  updateField("second_contact_phone", value)
                }
                visible={visibility.show_second_contact}
                onToggle={() => toggle("show_second_contact")}
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "დამატებითი შეტყობინება"
                    : "Additional emergency message"
                }
                value={form.emergency_message}
                onChange={(value) =>
                  updateField("emergency_message", value)
                }
                visible={visibility.show_emergency_message}
                onToggle={() => toggle("show_emergency_message")}
                ka={ka}
              />

              <div className="locationCard">
                <div>
                  <strong>
                    {ka ? "ლოკაციის გაზიარება" : "Location sharing"}
                  </strong>

                  <p>
                    {ka
                      ? "ჩართვის შემთხვევაში QR კოდის დამსკანერებელს შეეძლება თავისი მიმდინარე ლოკაციის გაზიარება."
                      : "When enabled, the person scanning the QR code can share their current location."}
                  </p>
                </div>

                <Switch
                  active={locationSharing}
                  onClick={() => setLocationSharing(!locationSharing)}
                />
              </div>

              <div className="disclaimer">
                {ka
                  ? "Emergency პროფილში მითითებული ინფორმაცია მოწოდებულია მომხმარებლის მიერ და არ ცვლის პროფესიულ სამედიცინო ჩანაწერს ან გადაუდებელი დახმარების მომსახურებას."
                  : "Information in the Emergency profile is provided by the user and does not replace professional medical records or emergency services."}
              </div>

              {error && <ErrorBox text={error} />}

              <div className="buttons">
                <button
                  type="button"
                  className="backButton"
                  onClick={previousStep}
                >
                  ← {ka ? "უკან" : "Back"}
                </button>

                <button
                  type="submit"
                  className="primaryButton"
                  disabled={saving}
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "პროფილის შენახვა"
                    : "Save profile"}
                </button>
              </div>
            </>
          )}
        </form>
      </section>

      <Styles />
    </main>
  );
}

function Header({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const ka = language === "ka";

  return (
    <header className="header">
      <a href="/" className="brand">
        <div className="logo">QR</div>

        <div>
          <strong>QR RETURN</strong>
          <small>EMERGENCY ID</small>
        </div>
      </a>

      <div className="headerRight">
        <a href="/" className="headerBack">
          ← {ka ? "უკან" : "Back"}
        </a>

        <div className="languages">
          <button
            type="button"
            className={language === "ka" ? "selected" : ""}
            onClick={() => setLanguage("ka")}
          >
            GEO
          </button>

          <button
            type="button"
            className={language === "en" ? "selected" : ""}
            onClick={() => setLanguage("en")}
          >
            ENG
          </button>
        </div>
      </div>
    </header>
  );
}

function Progress({
  number,
  label,
  active,
  current,
}: {
  number: string;
  label: string;
  active: boolean;
  current: boolean;
}) {
  return (
    <div className="progressItem">
      <span
        className={`circle ${active ? "active" : ""} ${
          current ? "current" : ""
        }`}
      >
        {number}
      </span>

      <small>{label}</small>
    </div>
  );
}

function StepTitle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="stepTitle">
      <b>{number}</b>

      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

function RequiredField({
  label,
  value,
  onChange,
  ka,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  ka: boolean;
  type?: string;
}) {
  return (
    <div className="requiredField">
      <label>
        <strong>{label} *</strong>

        <input
          type={type}
          value={value}
          required
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? "სავალდებულო • ყოველთვის ხილული"
          : "Required • Always visible"}
      </div>
    </div>
  );
}

function OptionalField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  ka,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
  type?: string;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>{label}</strong>
          <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
        </div>

        <Switch active={visible} onClick={onToggle} />
      </div>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="optionalNote">
        {ka ? "მპოვნელისთვის ჩვენება:" : "Show to finder:"}{" "}
        <b>{visible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}

function OptionalTextArea({
  label,
  value,
  onChange,
  visible,
  onToggle,
  ka,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>{label}</strong>
          <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
        </div>

        <Switch active={visible} onClick={onToggle} />
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <div className="optionalNote">
        {ka ? "მპოვნელისთვის ჩვენება:" : "Show to finder:"}{" "}
        <b>{visible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}

function OptionalSelect({
  label,
  value,
  onChange,
  visible,
  onToggle,
  ka,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
  options: string[];
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>{label}</strong>
          <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
        </div>

        <Switch active={visible} onClick={onToggle} />
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option || "empty"} value={option}>
            {option || (ka ? "აირჩიეთ" : "Select")}
          </option>
        ))}
      </select>

      <div className="optionalNote">
        {ka ? "მპოვნელისთვის ჩვენება:" : "Show to finder:"}{" "}
        <b>{visible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}

function RequiredSelect({
  label,
  value,
  onChange,
  ka,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  ka: boolean;
}) {
  const options = ka
    ? [
        "",
        "დედა",
        "მამა",
        "მეუღლე",
        "შვილი",
        "და",
        "ძმა",
        "ნათესავი",
        "მეგობარი",
        "მომვლელი",
        "სხვა",
      ]
    : [
        "",
        "Mother",
        "Father",
        "Spouse",
        "Child",
        "Sister",
        "Brother",
        "Relative",
        "Friend",
        "Caregiver",
        "Other",
      ];

  return (
    <div className="requiredField">
      <label>
        <strong>{label} *</strong>

        <select
          value={value}
          required
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option || "empty"} value={option}>
              {option || (ka ? "აირჩიეთ" : "Select")}
            </option>
          ))}
        </select>
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? "სავალდებულო • ყოველთვის ხილული"
          : "Required • Always visible"}
      </div>
    </div>
  );
}

function OptionalSelectRelationship({
  label,
  value,
  onChange,
  visible,
  onToggle,
  ka,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
}) {
  const options = ka
    ? [
        "",
        "დედა",
        "მამა",
        "მეუღლე",
        "შვილი",
        "და",
        "ძმა",
        "ნათესავი",
        "მეგობარი",
        "მომვლელი",
        "სხვა",
      ]
    : [
        "",
        "Mother",
        "Father",
        "Spouse",
        "Child",
        "Sister",
        "Brother",
        "Relative",
        "Friend",
        "Caregiver",
        "Other",
      ];

  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>{label}</strong>
          <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
        </div>

        <Switch active={visible} onClick={onToggle} />
      </div>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option || "empty"} value={option}>
            {option || (ka ? "აირჩიეთ" : "Select")}
          </option>
        ))}
      </select>

      <div className="optionalNote">
        {ka ? "მპოვნელისთვის ჩვენება:" : "Show to finder:"}{" "}
        <b>{visible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}

function OptionalPhoto({
  label,
  file,
  setFile,
  visible,
  onToggle,
  ka,
}: {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>{label}</strong>
          <span>{ka ? "ნებაყოფლობითი" : "Optional"}</span>
        </div>

        <Switch active={visible} onClick={onToggle} />
      </div>

      <label className="photo">
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setFile(event.target.files?.[0] || null)
          }
        />

        <b>{file ? "✓" : "+"}</b>

        <div>
          <strong>
            {file
              ? file.name
              : ka
              ? "ფოტოს დამატება"
              : "Add photo"}
          </strong>

          <small>{ka ? "აირჩიეთ სურათი" : "Choose an image"}</small>
        </div>
      </label>

      <div className="optionalNote">
        {ka ? "მპოვნელისთვის ჩვენება:" : "Show to finder:"}{" "}
        <b>{visible ? "ON" : "OFF"}</b>
      </div>
    </div>
  );
}

function Switch({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "switch active" : "switch"}
      onClick={onClick}
      aria-pressed={active}
    >
      <span />
    </button>
  );
}

function ErrorBox({ text }: { text: string }) {
  return <div className="error">{text}</div>;
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background: #f8fafc;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e5e9ef;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 44px;
        height: 44px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #155eef;
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #155eef;
        font-size: 20px;
      }

      .brand small {
        display: block;
        margin-top: 2px;
        color: #d92d20;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .headerBack {
        color: #475467;
        text-decoration: none;
        font-size: 13px;
        font-weight: 800;
      }

      .languages {
        padding: 4px;
        display: flex;
        background: #edf0f4;
        border-radius: 10px;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #7d8795;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages .selected {
        background: white;
        color: #155eef;
      }

      .content {
        width: calc(100% - 24px);
        max-width: 760px;
        margin: auto;
        padding: 44px 0 80px;
      }

      .hero {
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }

      .emergencyIcon {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: #fff0ee;
        color: #d92d20;
        font-size: 31px;
        font-weight: 900;
      }

      .eyebrow {
        color: #d92d20;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .hero h1 {
        margin: 7px 0;
        font-size: 36px;
      }

      .hero p {
        max-width: 620px;
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.6;
      }

      .infoBox {
        margin-top: 24px;
        padding: 17px;
        border: 1px solid #d9e5fb;
        border-left: 4px solid #155eef;
        border-radius: 14px;
        background: #f2f7ff;
      }

      .infoBox strong {
        font-size: 15px;
      }

      .infoBox p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.6;
      }

      .progress {
        margin: 34px 0 24px;
        display: flex;
        align-items: center;
      }

      .progressItem {
        min-width: 84px;
        text-align: center;
      }

      .circle {
        width: 35px;
        height: 35px;
        margin: auto;
        display: grid;
        place-items: center;
        border: 1px solid #d4dae2;
        border-radius: 50%;
        background: white;
        color: #98a2b3;
        font-size: 11px;
        font-weight: 900;
      }

      .circle.active {
        border-color: #155eef;
        color: #155eef;
      }

      .circle.current {
        border-color: #d92d20;
        background: #d92d20;
        color: white;
      }

      .progressItem small {
        display: block;
        margin-top: 6px;
        color: #667085;
        font-size: 11px;
        font-weight: 800;
      }

      .line {
        flex: 1;
        height: 2px;
        margin-bottom: 20px;
        background: #e1e5eb;
      }

      .line.active {
        background: #155eef;
      }

      .card {
        padding: 28px;
        border: 1px solid #e2e7ed;
        border-top: 4px solid #d92d20;
        border-radius: 22px;
        background: white;
        box-shadow: 0 12px 35px rgba(16, 24, 40, 0.05);
      }

      .stepTitle {
        margin-bottom: 26px;
        display: flex;
        gap: 13px;
      }

      .stepTitle > b {
        color: #d92d20;
        font-size: 12px;
      }

      .stepTitle h2 {
        margin: 0;
        font-size: 22px;
      }

      .stepTitle p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.5;
      }

      .grid2 {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .requiredField,
      .optionalField {
        margin-bottom: 20px;
      }

      .requiredField label > strong,
      .fieldHeader strong {
        display: block;
        margin-bottom: 8px;
        color: #344054;
        font-size: 15px;
        font-weight: 850;
      }

      .requiredField input,
      .requiredField select,
      .optionalField input,
      .optionalField select,
      .optionalField textarea {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: white;
        outline: none;
      }

      .requiredField input,
      .requiredField select,
      .optionalField input,
      .optionalField select {
        height: 54px;
        padding: 0 14px;
      }

      .optionalField textarea {
        min-height: 105px;
        padding: 14px;
        resize: vertical;
      }

      .requiredField input:focus,
      .requiredField select:focus,
      .optionalField input:focus,
      .optionalField select:focus,
      .optionalField textarea:focus {
        border-color: #155eef;
        box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.08);
      }

      .requiredNote {
        margin-top: 8px;
        color: #16803b;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 800;
      }

      .fieldHeader {
        margin-bottom: 9px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .fieldHeader strong {
        margin-bottom: 4px;
      }

      .fieldHeader span {
        display: block;
        color: #667085;
        font-size: 14px;
        font-weight: 700;
      }

      .optionalNote {
        margin-top: 8px;
        color: #667085;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 700;
      }

      .optionalNote b {
        color: #155eef;
        font-weight: 900;
      }

      .switch {
        width: 50px;
        height: 29px;
        flex: 0 0 50px;
        padding: 3px;
        border: 0;
        border-radius: 30px;
        background: #cdd3db;
        cursor: pointer;
      }

      .switch span {
        display: block;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background: white;
        transition: 0.2s;
      }

      .switch.active {
        background: #155eef;
      }

      .switch.active span {
        transform: translateX(21px);
      }

      .photo {
        min-height: 72px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px dashed #c9d0da;
        border-radius: 13px;
        background: #fafbfc;
        cursor: pointer;
      }

      .photo input {
        display: none;
      }

      .photo > b {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #eaf2ff;
        color: #155eef;
        font-size: 20px;
      }

      .photo strong,
      .photo small {
        display: block;
      }

      .photo strong {
        color: #344054;
        font-size: 13px;
      }

      .photo small {
        margin-top: 4px;
        color: #98a2b3;
        font-size: 12px;
      }

      .sectionDivider {
        height: 1px;
        margin: 28px 0;
        background: #eaecf0;
      }

      .sectionHeading {
        margin-bottom: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .sectionHeading strong {
        font-size: 16px;
      }

      .sectionHeading span {
        color: #667085;
        font-size: 13px;
        font-weight: 700;
      }

      .locationCard {
        margin-top: 22px;
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border: 1px solid #d9e5fb;
        border-radius: 14px;
        background: #f5f8ff;
      }

      .locationCard strong {
        font-size: 15px;
      }

      .locationCard p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.5;
      }

      .disclaimer {
        margin-top: 20px;
        padding: 14px;
        border-radius: 12px;
        background: #f9fafb;
        color: #667085;
        font-size: 12px;
        line-height: 1.6;
      }

      .buttons {
        margin-top: 26px;
        display: flex;
        gap: 10px;
      }

      .primaryButton,
      .backButton {
        min-height: 52px;
        padding: 0 21px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .primaryButton {
        margin-left: auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 0;
        background: #155eef;
        color: white;
        text-decoration: none;
      }

      .primaryButton.full {
        width: 100%;
        margin-top: 10px;
      }

      .primaryButton:disabled {
        opacity: 0.6;
      }

      .backButton {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .error {
        margin-top: 18px;
        padding: 14px;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 750;
      }

      .success {
        width: calc(100% - 24px);
        max-width: 580px;
        margin: auto;
        padding: 110px 0;
        text-align: center;
      }

      .successIcon {
        width: 70px;
        height: 70px;
        margin: 0 auto 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #e9f8ef;
        color: #16803b;
        font-size: 29px;
        font-weight: 900;
      }

      .success h1 {
        margin: 8px 0;
      }

      .success p {
        margin-bottom: 25px;
        color: #667085;
      }

      @media (max-width: 600px) {
        .headerBack {
          display: none;
        }

        .content {
          padding-top: 28px;
        }

        .hero h1 {
          font-size: 28px;
        }

        .grid2 {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .card {
          padding: 20px 14px;
        }

        .requiredField input,
        .requiredField select,
        .optionalField input,
        .optionalField select,
        .optionalField textarea {
          font-size: 16px;
        }

        .requiredNote,
        .fieldHeader span,
        .optionalNote {
          font-size: 13px;
        }

        .buttons {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
        }

        .primaryButton,
        .backButton {
          width: 100%;
          margin: 0;
        }
      }
    `}</style>
  );
}
