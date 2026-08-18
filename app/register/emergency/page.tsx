"use client";

import { FormEvent, ReactNode, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type RegisterFor = "self" | "other";

type FormData = {
  register_for: RegisterFor;

  manager_first_name: string;
  manager_last_name: string;
  manager_phone: string;
  manager_email: string;
  manager_address: string;

  codeword: string;
  codeword_confirm: string;

  tag_code: string;

  first_name: string;
  last_name: string;

  date_of_birth: string;
  country_code: string;
  personal_number: string;

  address: string;
  additional_info: string;

  contact_first_name: string;
  contact_last_name: string;
  contact_phone: string;
};

type Visibility = {
  show_date_of_birth: boolean;
  show_personal_number: boolean;
  show_address: boolean;
  show_additional_info: boolean;
  show_contact: boolean;
};

const TERMS_VERSION = "emergency-v3";

const initialForm: FormData = {
  register_for: "self",

  manager_first_name: "",
  manager_last_name: "",
  manager_phone: "",
  manager_email: "",
  manager_address: "",

  codeword: "",
  codeword_confirm: "",

  tag_code: "",

  first_name: "",
  last_name: "",

  date_of_birth: "",
  country_code: "",
  personal_number: "",

  address: "",
  additional_info: "",

  contact_first_name: "",
  contact_last_name: "",
  contact_phone: "",
};

const initialVisibility: Visibility = {
  show_date_of_birth: false,
  show_personal_number: false,
  show_address: false,
  show_additional_info: false,
  show_contact: true,
};

const countries = [
  {
    code: "US",
    ka: "🇺🇸 ამერიკის შეერთებული შტატები",
    en: "🇺🇸 United States",
    emergency: "911",
  },
  {
    code: "GE",
    ka: "🇬🇪 საქართველო",
    en: "🇬🇪 Georgia",
    emergency: "112",
  },
];

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeTag(value: string) {
  return value.trim().toUpperCase();
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function createCodewordHash(codeword: string) {
  const encoder = new TextEncoder();

  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const iterations = 210000;

  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(codeword),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

  const derivedBits =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt,
        iterations,
      },
      keyMaterial,
      256
    );

  return [
    "pbkdf2_sha256",
    iterations.toString(),
    bytesToBase64(salt),
    bytesToBase64(
      new Uint8Array(derivedBits)
    ),
  ].join("$");
}

export default function EmergencyRegisterPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [step, setStep] =
    useState<1 | 2 | 3>(1);

  const [form, setForm] =
    useState<FormData>(initialForm);

  const [
    visibility,
    setVisibility,
  ] =
    useState<Visibility>(
      initialVisibility
    );

  const [
    termsAccepted,
    setTermsAccepted,
  ] = useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const ka = lang === "ka";

  const selectedCountry =
    countries.find(
      (item) =>
        item.code ===
        form.country_code
    );

  const hasContact =
    Boolean(
      form.contact_first_name.trim() ||
        form.contact_last_name.trim() ||
        form.contact_phone.trim()
    );

  function updateField(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function toggleVisibility(
    field: keyof Visibility
  ) {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }));
  }

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }

  function validateManager() {
    if (
      !form.manager_first_name.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ ანგარიშის მმართველის სახელი."
          : "Enter the account manager's first name."
      );

      return false;
    }

    if (
      !form.manager_last_name.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ ანგარიშის მმართველის გვარი."
          : "Enter the account manager's last name."
      );

      return false;
    }

    if (
      !form.manager_phone.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ ანგარიშის მმართველის მობილურის ნომერი."
          : "Enter the account manager's mobile number."
      );

      return false;
    }

    if (
      !form.manager_email.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ ელფოსტა."
          : "Enter an email address."
      );

      return false;
    }

    if (
      !validEmail(
        form.manager_email
      )
    ) {
      setError(
        ka
          ? "ელფოსტა არასწორი ფორმატითაა."
          : "Invalid email format."
      );

      return false;
    }

    if (
      !form.manager_address.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ ანგარიშის მმართველის მისამართი."
          : "Enter the account manager's address."
      );

      return false;
    }

    if (
      form.codeword.trim().length <
      6
    ) {
      setError(
        ka
          ? "კოდური სიტყვა უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს."
          : "The codeword must contain at least 6 characters."
      );

      return false;
    }

    if (
      form.codeword !==
      form.codeword_confirm
    ) {
      setError(
        ka
          ? "კოდური სიტყვები ერთმანეთს არ ემთხვევა."
          : "The codewords do not match."
      );

      return false;
    }

    return true;
  }

  function validateWearer() {
    if (!form.tag_code.trim()) {
      setError(
        ka
          ? "QR კოდის მითითება სავალდებულოა."
          : "QR code is required."
      );

      return false;
    }

    if (!form.first_name.trim()) {
      setError(
        ka
          ? "სამაჯურის მფლობელის სახელი სავალდებულოა."
          : "The bracelet wearer's first name is required."
      );

      return false;
    }

    if (!form.last_name.trim()) {
      setError(
        ka
          ? "სამაჯურის მფლობელის გვარი სავალდებულოა."
          : "The bracelet wearer's last name is required."
      );

      return false;
    }

    if (!form.date_of_birth) {
      setError(
        ka
          ? "დაბადების სრული თარიღის მითითება სავალდებულოა."
          : "A complete date of birth is required."
      );

      return false;
    }

    if (!form.country_code) {
      setError(
        ka
          ? "აირჩიეთ ქვეყანა."
          : "Select a country."
      );

      return false;
    }

    if (
      !form.personal_number.trim()
    ) {
      setError(
        ka
          ? "პირადი ნომრის მითითება სავალდებულოა."
          : "Personal identification number is required."
      );

      return false;
    }

    return true;
  }

  function nextStep() {
    setError("");

    if (step === 1) {
      if (!validateManager()) {
        return;
      }

      if (
        form.register_for === "self"
      ) {
        setForm((current) => ({
          ...current,

          first_name:
            current.first_name ||
            current.manager_first_name,

          last_name:
            current.last_name ||
            current.manager_last_name,

          address:
            current.address ||
            current.manager_address,
        }));
      }

      setStep(2);
      goTop();

      return;
    }

    if (step === 2) {
      if (!validateWearer()) {
        return;
      }

      setStep(3);
      goTop();
    }
  }

  function previousStep() {
    setError("");

    if (step === 3) {
      setStep(2);
    } else {
      setStep(1);
    }

    goTop();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (step !== 3) {
      nextStep();
      return;
    }

    if (!termsAccepted) {
      setError(
        ka
          ? "პროფილის შესაქმნელად საჭიროა წესების წაკითხვა და დადასტურება."
          : "You must read and accept the terms before creating the profile."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const tagCode =
        normalizeTag(
          form.tag_code
        );

      /*
       * ერთი QR = ერთი ადამიანი.
       * ერთი და იგივე QR მეორედ ვერ დარეგისტრირდება.
       */
      const {
        data: existingProfile,
        error: checkError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .select("tag_code")
        .eq(
          "tag_code",
          tagCode
        )
        .maybeSingle();

      if (checkError) {
        setError(
          ka
            ? `QR კოდის შემოწმება ვერ მოხერხდა: ${checkError.message}`
            : `Could not check QR code: ${checkError.message}`
        );

        return;
      }

      if (existingProfile) {
        setError(
          ka
            ? "ეს QR კოდი უკვე რეგისტრირებულია და სხვა ადამიანზე გამოყენება შეუძლებელია."
            : "This QR code is already registered and cannot be used for another person."
        );

        return;
      }

      const codewordHash =
        await createCodewordHash(
          form.codeword
        );

      const contactFullName = [
        form.contact_first_name.trim(),
        form.contact_last_name.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const payload = {
        /*
         * ACCOUNT MANAGER
         * ეს ინფორმაცია საჯარო QR პროფილზე არ გამოჩნდება.
         */

        profile_manager_type:
          form.register_for,

        manager_first_name:
          form.manager_first_name.trim(),

        manager_last_name:
          form.manager_last_name.trim(),

        owner_phone:
          form.manager_phone.trim(),

        owner_email:
          normalizeEmail(
            form.manager_email
          ),

        manager_address:
          form.manager_address.trim(),

        codeword_hash:
          codewordHash,

        /*
         * BRACELET WEARER
         */

        tag_code:
          tagCode,

        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        date_of_birth:
          form.date_of_birth,

        country_code:
          form.country_code,

        personal_number:
          form.personal_number.trim(),

        address:
          form.address.trim() ||
          null,

        additional_info:
          form.additional_info.trim() ||
          null,

        /*
         * PUBLIC VISIBILITY
         *
         * სახელი და გვარი ყოველთვის გამოჩნდება.
         * 911/112 ავტომატურად განისაზღვრება ქვეყნის მიხედვით.
         */

        show_date_of_birth:
          visibility.show_date_of_birth,

        show_personal_number:
          visibility.show_personal_number,

        show_address:
          Boolean(
            form.address.trim()
          ) &&
          visibility.show_address,

        show_additional_info:
          Boolean(
            form.additional_info.trim()
          ) &&
          visibility.show_additional_info,

        /*
         * OPTIONAL CONTACT PERSON
         */

        emergency_contact_enabled:
          hasContact,

        emergency_contact_name:
          hasContact
            ? contactFullName || null
            : null,

        emergency_contact_phone:
          hasContact
            ? form.contact_phone.trim() ||
              null
            : null,

        show_emergency_contact:
          hasContact
            ? visibility.show_contact
            : false,

        /*
         * ერთი სახელის/გვარის დაცული ცვლილება.
         * რეგისტრაციისას ჯერ გამოყენებული არაა.
         */

        identity_edit_used:
          false,

        /*
         * TERMS
         */

        terms_accepted:
          true,

        terms_accepted_at:
          new Date().toISOString(),

        terms_version:
          TERMS_VERSION,

        active:
          true,
      };

      const {
        error: saveError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .insert(payload);

      if (saveError) {
        console.error(
          saveError
        );

        if (
          saveError.code ===
          "23505"
        ) {
          setError(
            ka
              ? "ეს QR კოდი უკვე რეგისტრირებულია."
              : "This QR code is already registered."
          );

          return;
        }

        setError(
          ka
            ? `პროფილის შენახვა ვერ მოხერხდა: ${saveError.message}`
            : `Could not save profile: ${saveError.message}`
        );

        return;
      }

      setSuccess(true);
      goTop();
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
    const tagCode =
      normalizeTag(
        form.tag_code
      );

    return (
      <main className="page">
        <Header
          lang={lang}
          setLang={setLang}
        />

        <section className="successPage">
          <div className="successIcon">
            ✓
          </div>

          <div className="eyebrow">
            QR RETURN • EMERGENCY ID
          </div>

          <h1>
            {ka
              ? "Emergency პროფილი წარმატებით შეიქმნა"
              : "Emergency profile created successfully"}
          </h1>

          <p>
            {ka
              ? `${form.first_name} ${form.last_name}-ის Emergency პროფილი შენახულია.`
              : `${form.first_name} ${form.last_name}'s Emergency profile has been saved.`}
          </p>

          <div className="successButtons">
            <a
              href={`/emergency/profile/${encodeURIComponent(
                tagCode
              )}`}
              className="viewButton"
            >
              {ka
                ? "პროფილის ნახვა"
                : "View profile"}
            </a>

            <a
              href={`/emergency/edit/${encodeURIComponent(
                tagCode
              )}`}
              className="manageButton"
            >
              {ka
                ? "პროფილის მართვა"
                : "Manage profile"}
            </a>
          </div>

          <div className="successNotice">
            <strong>
              🔒{" "}
              {ka
                ? "ერთი QR — ერთი ადამიანი"
                : "One QR — one person"}
            </strong>

            <p>
              {ka
                ? "QR კოდი ამ კონკრეტულ ადამიანს მიება და სხვა ადამიანზე გადატანა შეუძლებელია. პროფილის მართვის გვერდიდან მომავალში შესაძლებელი იქნება მაქსიმუმ ორი დამატებითი ადამიანის პროფილის რეგისტრაცია, თითოეულისთვის ახალი QR კოდით."
                : "This QR is permanently linked to this person. Up to two additional people may later be registered from profile management, each with their own QR code."}
            </p>
          </div>
        </section>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <Header
        lang={lang}
        setLang={setLang}
      />

      <section className="container">
        <div className="hero">
          <div className="emergencyIcon">
            ✚
          </div>

          <div>
            <div className="eyebrow">
              QR RETURN • EMERGENCY ID
            </div>

            <h1>
              {ka
                ? "Emergency პროფილის რეგისტრაცია"
                : "Emergency Profile Registration"}
            </h1>

            <p>
              {ka
                ? "ერთი QR კოდი განკუთვნილია ერთი კონკრეტული ადამიანისთვის."
                : "One QR code is intended for one specific person."}
            </p>
          </div>
        </div>

        <div className="progress">
          <StepIndicator
            number="1"
            label={
              ka
                ? "მმართველი"
                : "Manager"
            }
            active
            current={
              step === 1
            }
          />

          <div
            className={
              step >= 2
                ? "progressLine active"
                : "progressLine"
            }
          />

          <StepIndicator
            number="2"
            label={
              ka
                ? "პროფილი"
                : "Profile"
            }
            active={
              step >= 2
            }
            current={
              step === 2
            }
          />

          <div
            className={
              step >= 3
                ? "progressLine active"
                : "progressLine"
            }
          />

          <StepIndicator
            number="3"
            label={
              ka
                ? "წესები"
                : "Terms"
            }
            active={
              step >= 3
            }
            current={
              step === 3
            }
          />
        </div>

        <form
          className="card"
          onSubmit={
            handleSubmit
          }
        >
          {step === 1 && (
            <>
              <SectionTitle
                number="01"
                title={
                  ka
                    ? "ვისთვის ქმნით პროფილს?"
                    : "Who is this profile for?"
                }
                description={
                  ka
                    ? "აირჩიეთ, საკუთარ თავს არეგისტრირებთ თუ სხვა ადამიანს."
                    : "Choose whether you are registering yourself or another person."
                }
              />

              <div className="choiceGrid">
                <button
                  type="button"
                  className={
                    form.register_for ===
                    "self"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    updateField(
                      "register_for",
                      "self"
                    )
                  }
                >
                  <span>
                    👤
                  </span>

                  <strong>
                    {ka
                      ? "საკუთარი თავისთვის"
                      : "For myself"}
                  </strong>
                </button>

                <button
                  type="button"
                  className={
                    form.register_for ===
                    "other"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    updateField(
                      "register_for",
                      "other"
                    )
                  }
                >
                  <span>
                    👥
                  </span>

                  <strong>
                    {ka
                      ? "სხვა პირისთვის"
                      : "For another person"}
                  </strong>
                </button>
              </div>

              <InfoBox>
                <strong>
                  {ka
                    ? "ანგარიშის მმართველი"
                    : "Account manager"}
                </strong>

                <p>
                  {ka
                    ? "ქვემოთ შეიყვანეთ იმ ადამიანის მონაცემები, ვინც Emergency პროფილს მართავს. ეს ინფორმაცია QR-ის საჯარო პროფილზე არ გამოჩნდება."
                    : "Enter the information of the person who manages this Emergency profile. This information is never displayed on the public QR profile."}
                </p>
              </InfoBox>

              <div className="grid2">
                <RequiredInput
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={
                    form.manager_first_name
                  }
                  onChange={(value) =>
                    updateField(
                      "manager_first_name",
                      value
                    )
                  }
                  ka={ka}
                />

                <RequiredInput
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={
                    form.manager_last_name
                  }
                  onChange={(value) =>
                    updateField(
                      "manager_last_name",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <RequiredInput
                label={
                  ka
                    ? "მობილურის ნომერი"
                    : "Mobile number"
                }
                type="tel"
                value={
                  form.manager_phone
                }
                onChange={(value) =>
                  updateField(
                    "manager_phone",
                    value
                  )
                }
                ka={ka}
              />

              <RequiredInput
                label={
                  ka
                    ? "ელფოსტა"
                    : "Email"
                }
                type="email"
                value={
                  form.manager_email
                }
                onChange={(value) =>
                  updateField(
                    "manager_email",
                    value
                  )
                }
                ka={ka}
              />

              <RequiredInput
                label={
                  ka
                    ? "მისამართი"
                    : "Address"
                }
                value={
                  form.manager_address
                }
                onChange={(value) =>
                  updateField(
                    "manager_address",
                    value
                  )
                }
                ka={ka}
              />

              <div className="grid2">
                <RequiredInput
                  label={
                    ka
                      ? "კოდური სიტყვა"
                      : "Codeword"
                  }
                  type="password"
                  value={
                    form.codeword
                  }
                  onChange={(value) =>
                    updateField(
                      "codeword",
                      value
                    )
                  }
                  ka={ka}
                />

                <RequiredInput
                  label={
                    ka
                      ? "გაიმეორეთ კოდური სიტყვა"
                      : "Repeat codeword"
                  }
                  type="password"
                  value={
                    form.codeword_confirm
                  }
                  onChange={(value) =>
                    updateField(
                      "codeword_confirm",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <div className="securityBox">
                🔐{" "}
                {ka
                  ? "კოდური სიტყვა დაგჭირდებათ დაცული ინფორმაციის ცვლილებისთვის. სახელისა და გვარის ერთჯერადი ცვლილება შესაძლებელი იქნება კოდური სიტყვით ან რეგისტრირებულ ელფოსტაზე მიღებული კოდით."
                  : "The codeword is used for protected changes. The one-time name correction can be verified with the codeword or a code sent to the registered email."}
              </div>

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <button
                type="button"
                className="primaryButton full"
                onClick={
                  nextStep
                }
              >
                {ka
                  ? "შემდეგი"
                  : "Next"}{" "}
                →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <SectionTitle
                number="02"
                title={
                  ka
                    ? "სამაჯურის მფლობელის ინფორმაცია"
                    : "Bracelet wearer information"
                }
                description={
                  ka
                    ? "ეს არის ადამიანი, რომელსაც კონკრეტული Emergency QR ეკუთვნის."
                    : "This is the person this specific Emergency QR belongs to."
                }
              />

              <div className="alwaysVisibleBox">
                <strong>
                  {ka
                    ? "სახელი და გვარი ყოველთვის გამოჩნდება"
                    : "First and last name are always visible"}
                </strong>

                <p>
                  {ka
                    ? "სახელი და გვარი სავალდებულოა და QR კოდის დასკანერებისას ყოველთვის გამოჩნდება."
                    : "First and last name are required and always visible when the QR code is scanned."}
                </p>
              </div>

              <RequiredInput
                label={
                  ka
                    ? "QR კოდი"
                    : "QR code"
                }
                value={
                  form.tag_code
                }
                onChange={(value) =>
                  updateField(
                    "tag_code",
                    value
                  )
                }
                ka={ka}
              />

              <div className="grid2">
                <RequiredAlwaysVisibleInput
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={
                    form.first_name
                  }
                  onChange={(value) =>
                    updateField(
                      "first_name",
                      value
                    )
                  }
                  ka={ka}
                />

                <RequiredAlwaysVisibleInput
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={
                    form.last_name
                  }
                  onChange={(value) =>
                    updateField(
                      "last_name",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <VisibilityField
                label={
                  ka
                    ? "დაბადების სრული თარიღი"
                    : "Complete date of birth"
                }
                type="date"
                required
                value={
                  form.date_of_birth
                }
                onChange={(value) =>
                  updateField(
                    "date_of_birth",
                    value
                  )
                }
                visible={
                  visibility.show_date_of_birth
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_date_of_birth"
                  )
                }
                explanation={
                  ka
                    ? "შევსება სავალდებულოა. თქვენ წყვეტთ, გამოჩნდეს თუ არა დაბადების თარიღი QR პროფილზე."
                    : "Required. You decide whether the date of birth appears on the QR profile."
                }
                ka={ka}
              />

              <div className="standardField">
                <label>
                  {ka
                    ? "ქვეყანა *"
                    : "Country *"}
                </label>

                <select
                  value={
                    form.country_code
                  }
                  onChange={(event) =>
                    updateField(
                      "country_code",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    {ka
                      ? "აირჩიეთ ქვეყანა"
                      : "Select country"}
                  </option>

                  {countries.map(
                    (item) => (
                      <option
                        key={
                          item.code
                        }
                        value={
                          item.code
                        }
                      >
                        {ka
                          ? item.ka
                          : item.en}
                      </option>
                    )
                  )}
                </select>

                <small className="requiredNote">
                  ✓{" "}
                  {ka
                    ? "სავალდებულო"
                    : "Required"}
                </small>
              </div>

              {selectedCountry && (
                <div className="emergencyNumber">
                  <strong>
                    🚨{" "}
                    {ka
                      ? `გადაუდებელი დახმარება — ${selectedCountry.emergency}`
                      : `Emergency services — ${selectedCountry.emergency}`}
                  </strong>

                  <p>
                    {ka
                      ? `${selectedCountry.emergency} QR პროფილზე ყოველთვის გამოჩნდება არჩეული ქვეყნის მიხედვით.`
                      : `${selectedCountry.emergency} will always appear on the QR profile based on the selected country.`}
                  </p>
                </div>
              )}

              <VisibilityField
                label={
                  ka
                    ? "პირადი ნომერი"
                    : "Personal identification number"
                }
                required
                value={
                  form.personal_number
                }
                onChange={(value) =>
                  updateField(
                    "personal_number",
                    value
                  )
                }
                visible={
                  visibility.show_personal_number
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_personal_number"
                  )
                }
                explanation={
                  ka
                    ? "შევსება სავალდებულოა. უსაფრთხოების მიზნით QR პროფილზე გამოჩენა საწყისად გამორთულია. სურვილის შემთხვევაში შეგიძლიათ ჩართოთ."
                    : "Required. Public visibility is off by default for privacy. You may enable it if you wish."
                }
                ka={ka}
              />

              <VisibilityField
                label={
                  ka
                    ? "მისამართი"
                    : "Address"
                }
                value={
                  form.address
                }
                onChange={(value) =>
                  updateField(
                    "address",
                    value
                  )
                }
                visible={
                  visibility.show_address
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_address"
                  )
                }
                explanation={
                  ka
                    ? "მისამართის მითითება ნებაყოფლობითია. თუ შეავსებთ, თავად ირჩევთ გამოჩნდეს თუ არა QR პროფილზე."
                    : "Address is optional. If entered, you choose whether it appears on the QR profile."
                }
                ka={ka}
              />

              <VisibilityTextarea
                label={
                  ka
                    ? "დამატებითი ინფორმაცია"
                    : "Additional information"
                }
                value={
                  form.additional_info
                }
                onChange={(value) =>
                  updateField(
                    "additional_info",
                    value
                  )
                }
                visible={
                  visibility.show_additional_info
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_additional_info"
                  )
                }
                explanation={
                  ka
                    ? "ეს ველი ნებაყოფლობითია. შეგიძლიათ მიუთითოთ ინფორმაცია, რომელიც საგანგებო სიტუაციაში შეიძლება მნიშვნელოვანი იყოს."
                    : "Optional. You may enter information that could be important in an emergency."
                }
                ka={ka}
              />

              <div className="contactCard">
                <div className="visibilityHeader">
                  <div>
                    <strong>
                      {ka
                        ? "საკონტაქტო პირი"
                        : "Contact person"}
                    </strong>

                    <span>
                      {ka
                        ? "ნებაყოფლობითი"
                        : "Optional"}
                    </span>
                  </div>

                  <Switch
                    active={
                      visibility.show_contact
                    }
                    onClick={() =>
                      toggleVisibility(
                        "show_contact"
                      )
                    }
                  />
                </div>

                <p className="fieldExplanation">
                  {ka
                    ? "საკონტაქტო პირის დამატება ნებაყოფლობითია. თუ მიუთითებთ და ჩვენება ჩართულია, QR-ის დამსკანერებელს შეეძლება ამ პირთან დაკავშირება."
                    : "Adding a contact person is optional. If added and visibility is enabled, the QR scanner can contact this person."}
                </p>

                <div className="grid2">
                  <OptionalInput
                    label={
                      ka
                        ? "სახელი"
                        : "First name"
                    }
                    value={
                      form.contact_first_name
                    }
                    onChange={(value) =>
                      updateField(
                        "contact_first_name",
                        value
                      )
                    }
                  />

                  <OptionalInput
                    label={
                      ka
                        ? "გვარი"
                        : "Last name"
                    }
                    value={
                      form.contact_last_name
                    }
                    onChange={(value) =>
                      updateField(
                        "contact_last_name",
                        value
                      )
                    }
                  />
                </div>

                <OptionalInput
                  label={
                    ka
                      ? "მობილურის ნომერი"
                      : "Mobile number"
                  }
                  type="tel"
                  value={
                    form.contact_phone
                  }
                  onChange={(value) =>
                    updateField(
                      "contact_phone",
                      value
                    )
                  }
                />

                <div className="visibilityStatus">
                  {ka
                    ? "QR პროფილზე გამოჩენა:"
                    : "Show on QR profile:"}{" "}
                  <b>
                    {visibility.show_contact
                      ? "ON"
                      : "OFF"}
                  </b>
                </div>
              </div>

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <div className="buttons">
                <button
                  type="button"
                  className="backButton"
                  onClick={
                    previousStep
                  }
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="button"
                  className="primaryButton"
                  onClick={
                    nextStep
                  }
                >
                  {ka
                    ? "შემდეგი"
                    : "Next"}{" "}
                  →
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <SectionTitle
                number="03"
                title={
                  ka
                    ? "წესები და თანხმობა"
                    : "Terms and consent"
                }
                description={
                  ka
                    ? "პროფილის შექმნამდე გაეცანით QR RETURN Emergency-ის ძირითად წესებს."
                    : "Review the QR RETURN Emergency rules before creating the profile."
                }
              />

              <div className="termsBox">
                <h3>
                  QR RETURN Emergency
                </h3>

                <ol>
                  <li>
                    {ka
                      ? "ერთი Emergency QR კოდი ეკუთვნის მხოლოდ ერთ კონკრეტულ ადამიანს."
                      : "One Emergency QR code belongs to one specific person."}
                  </li>

                  <li>
                    {ka
                      ? "რეგისტრაციის შემდეგ QR კოდის სხვა ადამიანზე გადატანა შეუძლებელია."
                      : "The QR code cannot be transferred to another person after registration."}
                  </li>

                  <li>
                    {ka
                      ? "სამაჯურის მფლობელის სახელი და გვარი სავალდებულოა და QR პროფილზე ყოველთვის გამოჩნდება."
                      : "The wearer's first and last name are required and always visible on the QR profile."}
                  </li>

                  <li>
                    {ka
                      ? "სახელისა და გვარის შეცვლა შესაძლებელია მხოლოდ ერთხელ. ეს შესაძლებლობა განკუთვნილია შეცდომის გასასწორებლად და არა QR-ის სხვა ადამიანისთვის გადასაცემად."
                      : "First and last name may be changed only once. This is intended to correct an error, not transfer the QR to another person."}
                  </li>

                  <li>
                    {ka
                      ? "სახელისა და გვარის ერთჯერადი ცვლილება უნდა დადასტურდეს კოდური სიტყვით ან ანგარიშის მმართველის რეგისტრირებულ ელფოსტაზე მიღებული კოდით."
                      : "The one-time name change must be verified with the codeword or a code sent to the account manager's registered email."}
                  </li>

                  <li>
                    {ka
                      ? "დაბადების სრული თარიღისა და პირადი ნომრის შევსება სავალდებულოა, თუმცა QR პროფილზე მათი გამოჩენა მომხმარებლის არჩევანია."
                      : "Date of birth and personal identification number are required, but public visibility is optional."}
                  </li>

                  <li>
                    {ka
                      ? "მისამართი და დამატებითი ინფორმაცია ნებაყოფლობითია და მომხმარებელი თავად ირჩევს მათ საჯაროდ გამოჩენას."
                      : "Address and additional information are optional and their public visibility is controlled by the user."}
                  </li>

                  <li>
                    {ka
                      ? "საკონტაქტო პირის სახელი, გვარი და მობილურის ნომერი ნებაყოფლობითია. მომხმარებელი თავად ირჩევს გამოჩნდეს თუ არა ეს ინფორმაცია QR პროფილზე."
                      : "The contact person's first name, last name and mobile number are optional. The user controls whether they are displayed."}
                  </li>

                  <li>
                    {ka
                      ? "ანგარიშის მმართველის სახელი, გვარი, ტელეფონი, ელფოსტა, მისამართი და კოდური სიტყვა QR-ის საჯარო პროფილზე არ გამოჩნდება."
                      : "The account manager's name, phone, email, address and codeword are never displayed on the public QR profile."}
                  </li>

                  <li>
                    {ka
                      ? "არჩეული ქვეყნის მიხედვით QR პროფილზე ყოველთვის გამოჩნდება შესაბამისი გადაუდებელი დახმარების ნომერი — აშშ-ში 911, საქართველოში 112."
                      : "The appropriate emergency number is always displayed based on the selected country — 911 in the United States and 112 in Georgia."}
                  </li>

                  <li>
                    {ka
                      ? "ანგარიშის მმართველს პროფილის მართვის გვერდიდან შეეძლება მაქსიმუმ ორი დამატებითი ადამიანის Emergency პროფილის რეგისტრაცია. თითოეულ ადამიანს უნდა ჰქონდეს საკუთარი უნიკალური QR კოდი."
                      : "The account manager may register up to two additional Emergency profiles from profile management. Each person must have their own unique QR code."}
                  </li>

                  <li>
                    {ka
                      ? "მომხმარებელი პასუხისმგებელია მის მიერ მითითებული ინფორმაციის სისწორეზე."
                      : "The user is responsible for the accuracy of the information provided."}
                  </li>

                  <li>
                    {ka
                      ? "QR RETURN Emergency არ ცვლის გადაუდებელი დახმარების სამსახურს ან პროფესიულ სამედიცინო მომსახურებას."
                      : "QR RETURN Emergency does not replace emergency services or professional medical care."}
                  </li>
                </ol>
              </div>

              <label className="termsConsent">
                <input
                  type="checkbox"
                  checked={
                    termsAccepted
                  }
                  onChange={(event) =>
                    setTermsAccepted(
                      event.target.checked
                    )
                  }
                />

                <div>
                  <strong>
                    {ka
                      ? "წავიკითხე და ვეთანხმები"
                      : "I have read and agree"}
                  </strong>

                  <p>
                    {ka
                      ? "ვეთანხმები QR RETURN Emergency-ის გამოყენების წესებსა და კონფიდენციალურობის პირობებს."
                      : "I agree to the QR RETURN Emergency terms of use and privacy conditions."}
                  </p>
                </div>
              </label>

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <div className="buttons">
                <button
                  type="button"
                  className="backButton"
                  onClick={
                    previousStep
                  }
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="submit"
                  className="saveButton"
                  disabled={
                    saving ||
                    !termsAccepted
                  }
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "ვეთანხმები და პროფილს ვქმნი"
                    : "Agree and create profile"}
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
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (
    value: Lang
  ) => void;
}) {
  return (
    <header className="header">
      <a
        href="/"
        className="brand"
      >
        <div className="logo">
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

function StepIndicator({
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
    <div className="stepIndicator">
      <span
        className={`${active ? "active" : ""} ${
          current ? "current" : ""
        }`}
      >
        {number}
      </span>

      <small>
        {label}
      </small>
    </div>
  );
}

function SectionTitle({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="sectionTitle">
      <b>
        {number}
      </b>

      <div>
        <h2>
          {title}
        </h2>

        <p>
          {description}
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="infoBox">
      {children}
    </div>
  );
}

function RequiredInput({
  label,
  value,
  onChange,
  ka,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  ka: boolean;
  type?: string;
}) {
  return (
    <div className="standardField">
      <label>
        {label} *
      </label>

      <input
        type={type}
        value={value}
        required
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <small className="requiredNote">
        ✓{" "}
        {ka
          ? "სავალდებულო"
          : "Required"}
      </small>
    </div>
  );
}

function RequiredAlwaysVisibleInput({
  label,
  value,
  onChange,
  ka,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  ka: boolean;
}) {
  return (
    <div className="standardField">
      <label>
        {label} *
      </label>

      <input
        value={value}
        required
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <small className="alwaysVisibleNote">
        ✓{" "}
        {ka
          ? "სავალდებულო • QR პროფილზე ყოველთვის გამოჩნდება"
          : "Required • Always visible on QR profile"}
      </small>
    </div>
  );
}

function OptionalInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
}) {
  return (
    <div className="standardField">
      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />
    </div>
  );
}

function VisibilityField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  explanation,
  ka,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  explanation: string;
  ka: boolean;
  required?: boolean;
  type?: string;
}) {
  return (
    <div className="visibilityCard">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
            {required
              ? " *"
              : ""}
          </strong>

          <span>
            {required
              ? ka
                ? "შევსება სავალდებულოა • გამოჩენა თქვენი არჩევანია"
                : "Required • Visibility is your choice"
              : ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </span>
        </div>

        <Switch
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <p className="fieldExplanation">
        {explanation}
      </p>

      <div className="visibilityStatus">
        {ka
          ? "QR პროფილზე გამოჩენა:"
          : "Show on QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </div>
    </div>
  );
}

function VisibilityTextarea({
  label,
  value,
  onChange,
  visible,
  onToggle,
  explanation,
  ka,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  explanation: string;
  ka: boolean;
}) {
  return (
    <div className="visibilityCard">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </span>
        </div>

        <Switch
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <p className="fieldExplanation">
        {explanation}
      </p>

      <div className="visibilityStatus">
        {ka
          ? "QR პროფილზე გამოჩენა:"
          : "Show on QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
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
      className={
        active
          ? "switch active"
          : "switch"
      }
      onClick={onClick}
      aria-pressed={
        active
      }
    >
      <span />
    </button>
  );
}

function ErrorBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="errorBox">
      ⚠ {text}
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
        background: #f7f9fc;
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at top right,
            rgba(21, 94, 239, 0.08),
            transparent 28%
          ),
          #f7f9fc;
        color: #101828;
        font-family: Arial, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 77px;
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
        display: flex;
        padding: 4px;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 10px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #155eef;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 790px;
        margin: auto;
        padding: 44px 0 80px;
      }

      .hero {
        display: flex;
        align-items: flex-start;
        gap: 15px;
      }

      .emergencyIcon {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        display: grid;
        place-items: center;
        border: 1px solid #fecdca;
        border-radius: 18px;
        background: #fff1f0;
        color: #d92d20;
        font-size: 30px;
        font-weight: 900;
      }

      .eyebrow {
        color: #d92d20;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .hero h1 {
        margin: 7px 0;
        font-size: 35px;
        line-height: 1.15;
      }

      .hero p {
        margin: 0;
        color: #667085;
        font-size: 14px;
      }

      .progress {
        margin: 34px 0 24px;
        display: flex;
        align-items: center;
      }

      .stepIndicator {
        min-width: 75px;
        text-align: center;
      }

      .stepIndicator > span {
        width: 36px;
        height: 36px;
        margin: auto;
        display: grid;
        place-items: center;
        border: 1px solid #d0d5dd;
        border-radius: 50%;
        background: white;
        color: #98a2b3;
        font-size: 11px;
        font-weight: 900;
      }

      .stepIndicator > span.active {
        border-color: #155eef;
        color: #155eef;
      }

      .stepIndicator > span.current {
        border-color: #d92d20;
        background: #d92d20;
        color: white;
        box-shadow: 0 0 0 5px rgba(217, 45, 32, 0.08);
      }

      .stepIndicator small {
        display: block;
        margin-top: 7px;
        color: #667085;
        font-size: 10px;
        font-weight: 800;
      }

      .progressLine {
        flex: 1;
        height: 2px;
        margin-bottom: 19px;
        background: #e4e7ec;
      }

      .progressLine.active {
        background: #155eef;
      }

      .card {
        padding: 30px;
        border: 1px solid #e4e7ec;
        border-top: 4px solid #d92d20;
        border-radius: 22px;
        background: white;
        box-shadow: 0 12px 35px rgba(16, 24, 40, 0.06);
      }

      .sectionTitle {
        margin-bottom: 25px;
        display: flex;
        gap: 12px;
      }

      .sectionTitle > b {
        padding-top: 4px;
        color: #d92d20;
        font-size: 11px;
      }

      .sectionTitle h2 {
        margin: 0;
        font-size: 23px;
      }

      .sectionTitle p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .choiceGrid {
        margin-bottom: 22px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .choice {
        min-height: 82px;
        padding: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #d0d5dd;
        border-radius: 13px;
        background: white;
        color: #475467;
        cursor: pointer;
      }

      .choice.active {
        border-color: #155eef;
        background: #f2f7ff;
        color: #155eef;
      }

      .choice span {
        font-size: 25px;
      }

      .infoBox,
      .securityBox,
      .alwaysVisibleBox,
      .emergencyNumber {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 12px;
      }

      .infoBox,
      .securityBox {
        border: 1px solid #d6e4ff;
        background: #f2f7ff;
      }

      .alwaysVisibleBox {
        border: 1px solid #d1fadf;
        background: #ecfdf3;
      }

      .emergencyNumber {
        border: 1px solid #fecdca;
        background: #fff1f0;
      }

      .infoBox p,
      .alwaysVisibleBox p,
      .emergencyNumber p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .securityBox {
        color: #475467;
        font-size: 13px;
        line-height: 1.55;
      }

      .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .standardField {
        margin-bottom: 19px;
      }

      .standardField label {
        display: block;
        margin-bottom: 8px;
        color: #344054;
        font-size: 14px;
        font-weight: 800;
      }

      .standardField input,
      .standardField select,
      .visibilityCard input,
      .visibilityCard textarea {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: white;
        color: #101828;
        outline: none;
      }

      .standardField input,
      .standardField select,
      .visibilityCard input {
        height: 53px;
        padding: 0 13px;
      }

      .visibilityCard textarea {
        min-height: 108px;
        padding: 13px;
        resize: vertical;
      }

      .standardField input:focus,
      .standardField select:focus,
      .visibilityCard input:focus,
      .visibilityCard textarea:focus {
        border-color: #155eef;
        box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.08);
      }

      .requiredNote,
      .alwaysVisibleNote {
        display: block;
        margin-top: 8px;
        color: #16803b;
        font-size: 13px;
        font-weight: 800;
        line-height: 1.45;
      }

      .visibilityCard,
      .contactCard {
        margin-bottom: 20px;
        padding: 17px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: #fafbfc;
      }

      .visibilityHeader {
        margin-bottom: 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .visibilityHeader strong,
      .visibilityHeader span {
        display: block;
      }

      .visibilityHeader strong {
        color: #344054;
        font-size: 14px;
      }

      .visibilityHeader span {
        margin-top: 4px;
        color: #667085;
        font-size: 13px;
        font-weight: 700;
      }

      .fieldExplanation {
        margin: 9px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .visibilityStatus {
        margin-top: 8px;
        color: #667085;
        font-size: 13px;
        font-weight: 700;
      }

      .visibilityStatus b {
        color: #155eef;
      }

      .switch {
        width: 50px;
        height: 29px;
        flex: 0 0 50px;
        padding: 3px;
        border: 0;
        border-radius: 30px;
        background: #cfd4dc;
        cursor: pointer;
      }

      .switch span {
        display: block;
        width: 23px;
        height: 23px;
        border-radius: 50%;
        background: white;
        transition: transform 0.2s ease;
      }

      .switch.active {
        background: #155eef;
      }

      .switch.active span {
        transform: translateX(21px);
      }

      .termsBox {
        max-height: 470px;
        overflow-y: auto;
        padding: 20px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: #f9fafb;
      }

      .termsBox h3 {
        margin-top: 0;
      }

      .termsBox li {
        margin-bottom: 11px;
        color: #475467;
        font-size: 13px;
        line-height: 1.6;
      }

      .termsConsent {
        margin-top: 20px;
        padding: 16px;
        display: flex;
        align-items: flex-start;
        gap: 11px;
        border: 1px solid #d6e4ff;
        border-radius: 13px;
        background: #f2f7ff;
        cursor: pointer;
      }

      .termsConsent input {
        width: 20px;
        height: 20px;
        margin-top: 2px;
        accent-color: #155eef;
      }

      .termsConsent strong {
        color: #344054;
        font-size: 14px;
      }

      .termsConsent p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.5;
      }

      .buttons {
        margin-top: 25px;
        display: flex;
        gap: 10px;
      }

      .primaryButton,
      .backButton,
      .saveButton {
        min-height: 52px;
        padding: 0 20px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
      }

      .primaryButton {
        margin-left: auto;
        border: 0;
        background: #155eef;
        color: white;
      }

      .primaryButton.full {
        width: 100%;
        margin: 10px 0 0;
      }

      .backButton {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .saveButton {
        margin-left: auto;
        border: 0;
        background: #d92d20;
        color: white;
      }

      .saveButton:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .errorBox {
        margin-top: 17px;
        padding: 14px;
        border: 1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 13px;
        font-weight: 700;
      }

      .successPage {
        width: calc(100% - 24px);
        max-width: 650px;
        margin: auto;
        padding: 95px 0;
        text-align: center;
      }

      .successIcon {
        width: 70px;
        height: 70px;
        margin: 0 auto 20px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #ecfdf3;
        color: #16803b;
        font-size: 30px;
        font-weight: 900;
      }

      .successPage h1 {
        margin: 8px 0;
      }

      .successPage > p {
        color: #667085;
      }

      .successButtons {
        margin-top: 24px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .viewButton,
      .manageButton {
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        color: white;
        text-decoration: none;
        font-size: 13px;
        font-weight: 900;
      }

      .viewButton {
        background: #155eef;
      }

      .manageButton {
        background: #d92d20;
      }

      .successNotice {
        margin-top: 22px;
        padding: 16px;
        border: 1px solid #d6e4ff;
        border-radius: 12px;
        background: #f2f7ff;
        text-align: left;
      }

      .successNotice p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      @media (max-width: 620px) {
        .container {
          padding-top: 28px;
        }

        .hero h1 {
          font-size: 27px;
        }

        .card {
          padding: 21px 14px;
        }

        .grid2,
        .choiceGrid {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .choice {
          margin-bottom: 8px;
        }

        input,
        select,
        textarea {
          font-size: 16px !important;
        }

        .buttons {
          display: grid;
          grid-template-columns: 0.9fr 1.5fr;
        }

        .primaryButton,
        .backButton,
        .saveButton {
          width: 100%;
          margin: 0;
          padding: 0 10px;
        }

        .successButtons {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
