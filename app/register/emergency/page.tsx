"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type Step = 1 | 2 | 3 | 4;
type ManagerType = "self" | "other";

type FormState = {
  tag_code: string;

  first_name: string;
  last_name: string;
  date_of_birth: string;
  country_code: string;

  owner_email: string;
  codeword: string;
  codeword_confirm: string;

  profile_manager_type: ManagerType;
  manager_relationship: string;

  owner_phone: string;

  blood_type: string;
  address: string;

  allergies: string;
  medical_conditions: string;
  medications: string;
  medical_note: string;

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
  show_owner_phone: boolean;

  show_blood_type: boolean;
  show_address: boolean;

  show_allergies: boolean;
  show_medical_conditions: boolean;
  show_medications: boolean;
  show_medical_note: boolean;

  show_second_contact: boolean;
  show_emergency_message: boolean;
};

const BUCKET = "qr-return-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const TERMS_VERSION = "emergency-2026-08-18";

const initialForm: FormState = {
  tag_code: "",

  first_name: "",
  last_name: "",
  date_of_birth: "",
  country_code: "",

  owner_email: "",
  codeword: "",
  codeword_confirm: "",

  profile_manager_type: "self",
  manager_relationship: "",

  owner_phone: "",

  blood_type: "",
  address: "",

  allergies: "",
  medical_conditions: "",
  medications: "",
  medical_note: "",

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
  show_owner_phone: false,

  show_blood_type: true,
  show_address: false,

  show_allergies: true,
  show_medical_conditions: true,
  show_medications: true,
  show_medical_note: true,

  show_second_contact: false,
  show_emergency_message: true,
};

const relationshipOptions = {
  ka: [
    ["", "აირჩიეთ"],
    ["mother", "დედა"],
    ["father", "მამა"],
    ["spouse", "მეუღლე"],
    ["child", "შვილი"],
    ["sister", "და"],
    ["brother", "ძმა"],
    ["relative", "ნათესავი"],
    ["friend", "მეგობარი"],
    ["caregiver", "მომვლელი"],
    ["guardian", "მეურვე"],
    ["other", "სხვა"],
  ],

  en: [
    ["", "Select"],
    ["mother", "Mother"],
    ["father", "Father"],
    ["spouse", "Spouse"],
    ["child", "Child"],
    ["sister", "Sister"],
    ["brother", "Brother"],
    ["relative", "Relative"],
    ["friend", "Friend"],
    ["caregiver", "Caregiver"],
    ["guardian", "Guardian"],
    ["other", "Other"],
  ],
};

const managerRelationshipOptions = {
  ka: [
    ["", "აირჩიეთ"],
    ["parent", "მშობელი"],
    ["child", "შვილი"],
    ["spouse", "მეუღლე"],
    ["sibling", "და / ძმა"],
    ["guardian", "მეურვე"],
    ["caregiver", "მომვლელი"],
    ["relative", "ნათესავი"],
    ["other", "სხვა"],
  ],

  en: [
    ["", "Select"],
    ["parent", "Parent"],
    ["child", "Child"],
    ["spouse", "Spouse"],
    ["sibling", "Sibling"],
    ["guardian", "Guardian"],
    ["caregiver", "Caregiver"],
    ["relative", "Relative"],
    ["other", "Other"],
  ],
};

const countryOptions = [
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

function cleanTag(tag: string) {
  return tag
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function safeExtension(file: File) {
  const ext =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const allowed = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "heic",
    "heif",
  ];

  return allowed.includes(ext) ? ext : "jpg";
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

async function hashCodeword(codeword: string) {
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
        salt,
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

  const hash =
    new Uint8Array(derivedBits);

  return [
    "pbkdf2_sha256",
    iterations.toString(),
    bytesToBase64(salt),
    bytesToBase64(hash),
  ].join("$");
}

async function uploadEmergencyPhoto(
  file: File,
  tagCode: string
) {
  if (!file.type.startsWith("image/")) {
    throw new Error("INVALID_IMAGE_TYPE");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("IMAGE_TOO_LARGE");
  }

  const ext =
    safeExtension(file);

  const unique =
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;

  const path =
    `emergency/${cleanTag(
      tagCode
    )}-${unique}.${ext}`;

  const { error } =
    await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

  if (error) {
    throw error;
  }

  const { data } =
    supabase.storage
      .from(BUCKET)
      .getPublicUrl(path);

  return data.publicUrl;
}

export default function EmergencyRegistrationPage() {
  const [language, setLanguage] =
    useState<Language>("ka");

  const [step, setStep] =
    useState<Step>(1);

  const [form, setForm] =
    useState<FormState>(
      initialForm
    );

  const [
    visibility,
    setVisibility,
  ] =
    useState<VisibilityState>(
      initialVisibility
    );

  const [photo, setPhoto] =
    useState<File | null>(
      null
    );

  const [
    identityLocked,
    setIdentityLocked,
  ] = useState(false);

  const [
    emergencyContactEnabled,
    setEmergencyContactEnabled,
  ] = useState(false);

  const [
    secondContactEnabled,
    setSecondContactEnabled,
  ] = useState(false);

  const [
    emergencyMobileEnabled,
    setEmergencyMobileEnabled,
  ] = useState(false);

  const [
    emergencyWhatsappEnabled,
    setEmergencyWhatsappEnabled,
  ] = useState(false);

  const [
    emergencyLiveChatEnabled,
    setEmergencyLiveChatEnabled,
  ] = useState(false);

  const [
    secondMobileEnabled,
    setSecondMobileEnabled,
  ] = useState(false);

  const [
    secondWhatsappEnabled,
    setSecondWhatsappEnabled,
  ] = useState(false);

  const [
    secondLiveChatEnabled,
    setSecondLiveChatEnabled,
  ] = useState(false);

  const [
    locationSharing,
    setLocationSharing,
  ] = useState(false);

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

  const ka =
    language === "ka";

  const selectedCountry =
    countryOptions.find(
      (country) =>
        country.code ===
        form.country_code
    );

  function updateField(
    field: keyof FormState,
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
    field: keyof VisibilityState
  ) {
    setVisibility(
      (current) => ({
        ...current,
        [field]:
          !current[field],
      })
    );
  }

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validatePhoto() {
    if (!photo) {
      return true;
    }

    if (
      !photo.type.startsWith(
        "image/"
      )
    ) {
      setError(
        ka
          ? "გთხოვთ აირჩიოთ სურათის ფაილი."
          : "Please select an image file."
      );

      return false;
    }

    if (
      photo.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        ka
          ? "ფოტოს ზომა არ უნდა აღემატებოდეს 5 MB-ს."
          : "The image must not exceed 5 MB."
      );

      return false;
    }

    return true;
  }

  function isValidEmail(
    email: string
  ) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }

  async function nextStep() {
    setError("");

    if (step === 1) {
      if (
        !form.tag_code.trim()
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ QR კოდი."
            : "Please enter the QR code."
        );
        return;
      }

      if (
        !form.first_name.trim()
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ სახელი."
            : "Please enter the first name."
        );
        return;
      }

      if (
        !form.last_name.trim()
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ გვარი."
            : "Please enter the last name."
        );
        return;
      }

      if (
        !form.date_of_birth
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ დაბადების სრული თარიღი — დღე, თვე და წელი."
            : "Please enter the complete date of birth."
        );
        return;
      }

      if (
        !form.country_code
      ) {
        setError(
          ka
            ? "გთხოვთ აირჩიოთ ქვეყანა."
            : "Please select a country."
        );
        return;
      }

      if (
        !form.owner_email.trim()
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ მმართველის ელფოსტა."
            : "Please enter the manager email."
        );
        return;
      }

      if (
        !isValidEmail(
          form.owner_email
        )
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ სწორი ელფოსტა."
            : "Please enter a valid email address."
        );
        return;
      }

      if (
        form.profile_manager_type ===
          "other" &&
        !form.manager_relationship
      ) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ თქვენი კავშირი ამ პირთან."
            : "Please select your relationship to this person."
        );
        return;
      }

      if (
        form.codeword.length < 6
      ) {
        setError(
          ka
            ? "კოდური სიტყვა უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს."
            : "The codeword must contain at least 6 characters."
        );
        return;
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
        return;
      }

      if (!validatePhoto()) {
        return;
      }

      setIdentityLocked(true);

      setStep(2);
      goTop();

      return;
    }

    if (step === 2) {
      setStep(3);
      goTop();
      return;
    }

    if (step === 3) {
      if (
        emergencyContactEnabled &&
        emergencyMobileEnabled &&
        !form.emergency_contact_phone.trim()
      ) {
        setError(
          ka
            ? "მობილური დაკავშირების ჩასართავად მიუთითეთ მთავარი საკონტაქტო პირის ტელეფონის ნომერი."
            : "Enter the primary contact phone number to enable mobile calling."
        );
        return;
      }

      if (
        emergencyContactEnabled &&
        emergencyWhatsappEnabled &&
        !form.emergency_contact_phone.trim()
      ) {
        setError(
          ka
            ? "WhatsApp-ის ჩასართავად მიუთითეთ მთავარი საკონტაქტო პირის ტელეფონის ნომერი."
            : "Enter the primary contact phone number to enable WhatsApp."
        );
        return;
      }

      if (
        secondContactEnabled &&
        secondMobileEnabled &&
        !form.second_contact_phone.trim()
      ) {
        setError(
          ka
            ? "მობილური დაკავშირების ჩასართავად მიუთითეთ დამატებითი საკონტაქტო პირის ნომერი."
            : "Enter the second contact phone number to enable mobile calling."
        );
        return;
      }

      if (
        secondContactEnabled &&
        secondWhatsappEnabled &&
        !form.second_contact_phone.trim()
      ) {
        setError(
          ka
            ? "WhatsApp-ის ჩასართავად მიუთითეთ დამატებითი საკონტაქტო პირის ნომერი."
            : "Enter the second contact phone number to enable WhatsApp."
        );
        return;
      }

      setStep(4);
      goTop();
    }
  }

  function previousStep() {
    setError("");

    if (step === 4) {
      setStep(3);
    } else if (step === 3) {
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

    if (step !== 4) {
      await nextStep();
      return;
    }

    if (!termsAccepted) {
      setError(
        ka
          ? "პროფილის შესაქმნელად საჭიროა წესებისა და კონფიდენციალურობის პირობების წაკითხვა და დადასტურება."
          : "You must read and accept the terms and privacy conditions before creating the profile."
      );

      return;
    }

    setSaving(true);
    setError("");

    try {
      const tagCode =
        form.tag_code.trim();

      const {
        data: existing,
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
            : `QR code check failed: ${checkError.message}`
        );

        return;
      }

      if (existing) {
        setError(
          ka
            ? "ეს QR კოდი უკვე რეგისტრირებულია. ერთი Emergency QR შეიძლება ეკუთვნოდეს მხოლოდ ერთ ადამიანს."
            : "This QR code is already registered. One Emergency QR can belong to only one person."
        );

        return;
      }

      let photoUrl:
        | string
        | null = null;

      if (photo) {
        photoUrl =
          await uploadEmergencyPhoto(
            photo,
            tagCode
          );
      }

      const codewordHash =
        await hashCodeword(
          form.codeword
        );

      const payload = {
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

        owner_email:
          normalizeEmail(
            form.owner_email
          ),

        codeword_hash:
          codewordHash,

        profile_manager_type:
          form.profile_manager_type,

        manager_relationship:
          form.profile_manager_type ===
            "other"
            ? form.manager_relationship ||
              null
            : null,

        owner_phone:
          form.owner_phone.trim() ||
          null,

        show_owner_phone:
          visibility.show_owner_phone,

        phone_verified:
          false,

        photo_url:
          photoUrl,

        show_photo:
          visibility.show_photo,

        show_date_of_birth:
          visibility.show_date_of_birth,

        blood_type:
          form.blood_type ||
          null,

        show_blood_type:
          visibility.show_blood_type,

        address:
          form.address.trim() ||
          null,

        show_address:
          visibility.show_address,

        allergies:
          form.allergies.trim() ||
          null,

        show_allergies:
          visibility.show_allergies,

        medical_conditions:
          form.medical_conditions.trim() ||
          null,

        show_medical_conditions:
          visibility.show_medical_conditions,

        medications:
          form.medications.trim() ||
          null,

        show_medications:
          visibility.show_medications,

        medical_note:
          form.medical_note.trim() ||
          null,

        show_medical_note:
          visibility.show_medical_note,

        emergency_contact_enabled:
          emergencyContactEnabled,

        emergency_contact_name:
          emergencyContactEnabled
            ? form.emergency_contact_name.trim() ||
              null
            : null,

        emergency_contact_relationship:
          emergencyContactEnabled
            ? form.emergency_contact_relationship ||
              null
            : null,

        emergency_contact_phone:
          emergencyContactEnabled
            ? form.emergency_contact_phone.trim() ||
              null
            : null,

        emergency_contact_mobile_enabled:
          emergencyContactEnabled
            ? emergencyMobileEnabled
            : false,

        emergency_contact_whatsapp_enabled:
          emergencyContactEnabled
            ? emergencyWhatsappEnabled
            : false,

        emergency_contact_live_chat_enabled:
          emergencyContactEnabled
            ? emergencyLiveChatEnabled
            : false,

        second_contact_enabled:
          secondContactEnabled,

        second_contact_name:
          secondContactEnabled
            ? form.second_contact_name.trim() ||
              null
            : null,

        second_contact_relationship:
          secondContactEnabled
            ? form.second_contact_relationship ||
              null
            : null,

        second_contact_phone:
          secondContactEnabled
            ? form.second_contact_phone.trim() ||
              null
            : null,

        second_contact_mobile_enabled:
          secondContactEnabled
            ? secondMobileEnabled
            : false,

        second_contact_whatsapp_enabled:
          secondContactEnabled
            ? secondWhatsappEnabled
            : false,

        second_contact_live_chat_enabled:
          secondContactEnabled
            ? secondLiveChatEnabled
            : false,

        show_second_contact:
          secondContactEnabled &&
          visibility.show_second_contact,

        emergency_message:
          form.emergency_message.trim() ||
          null,

        show_emergency_message:
          visibility.show_emergency_message,

        location_sharing_enabled:
          locationSharing,

        identity_edit_used:
          false,

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
            : `Profile could not be saved: ${saveError.message}`
        );

        return;
      }

      setSuccess(true);
      goTop();
    } catch (err) {
      console.error(err);

      if (
        err instanceof Error &&
        err.message ===
          "IMAGE_TOO_LARGE"
      ) {
        setError(
          ka
            ? "ფოტოს ზომა არ უნდა აღემატებოდეს 5 MB-ს."
            : "The image must not exceed 5 MB."
        );
      } else if (
        err instanceof Error &&
        err.message ===
          "INVALID_IMAGE_TYPE"
      ) {
        setError(
          ka
            ? "არჩეული ფაილი სურათი არ არის."
            : "The selected file is not an image."
        );
      } else {
        setError(
          ka
            ? "პროფილის შენახვისას დაფიქსირდა შეცდომა."
            : "An error occurred while saving the profile."
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <main className="page">
        <Header
          language={language}
          setLanguage={
            setLanguage
          }
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
              ? `${form.first_name} ${form.last_name}-ის Emergency პროფილი წარმატებით შეინახა.`
              : `${form.first_name} ${form.last_name}'s Emergency profile was saved successfully.`}
          </p>

          <div className="successButtons">
            <a
              href={`/emergency/profile/${encodeURIComponent(
                form.tag_code.trim()
              )}`}
              className="viewButton"
            >
              {ka
                ? "პროფილის ნახვა"
                : "View profile"}
            </a>

            <a
              href="/register/emergency"
              className="additionalButton"
            >
              {ka
                ? "დამატებითი პროფილის რეგისტრაცია"
                : "Register additional profile"}
            </a>

            <a
              href="/"
              className="homeButton"
            >
              {ka
                ? "მთავარ გვერდზე"
                : "Home"}
            </a>
          </div>

          <div className="lockedNotice">
            <strong>
              🔒{" "}
              {ka
                ? "ერთი QR — ერთი ადამიანი"
                : "One QR — one person"}
            </strong>

            <p>
              {ka
                ? "QR კოდი პროფილის შექმნის შემდეგ აღარ შეიცვლება. სახელი და გვარი დაცული მონაცემებია და მათი ერთჯერადი გასწორება შესაძლებელი იქნება პროფილის რედაქტირების დაცული პროცესიდან."
                : "The QR code cannot be changed after the profile is created. First and last name are protected fields and may be corrected once through the protected edit process."}
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
        language={language}
        setLanguage={
          setLanguage
        }
      />

      <section className="content">
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
                ? "Emergency სამაჯურის რეგისტრაცია"
                : "Emergency Bracelet Registration"}
            </h1>

            <p>
              {ka
                ? "ერთი Emergency QR განკუთვნილია ერთი კონკრეტული ადამიანისთვის. შექმენით პროფილი და თავად აკონტროლეთ დამატებითი ინფორმაციის ხილვადობა."
                : "One Emergency QR is intended for one person. Create the profile and control the visibility of optional information."}
            </p>
          </div>
        </div>

        <div className="informationBox">
          <strong>
            {ka
              ? "ერთი QR — ერთი ადამიანი"
              : "One QR — one person"}
          </strong>

          <p>
            {ka
              ? "პროფილის შექმნის შემდეგ QR კოდი აღარ შეიცვლება. სახელი და გვარი დაცული ინფორმაციაა. სამედიცინო და სხვა დამატებითი მონაცემების განახლება მოგვიანებით შესაძლებელი იქნება."
              : "After the profile is created, the QR code cannot be changed. First and last name are protected information. Medical and other optional information can be updated later."}
          </p>
        </div>

        <div className="progress">
          <Progress
            number="1"
            label={
              ka
                ? "პირადი"
                : "Personal"
            }
            active={
              step >= 1
            }
            current={
              step === 1
            }
          />

          <div
            className={
              step >= 2
                ? "line active"
                : "line"
            }
          />

          <Progress
            number="2"
            label={
              ka
                ? "სამედიცინო"
                : "Medical"
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
                ? "line active"
                : "line"
            }
          />

          <Progress
            number="3"
            label={
              ka
                ? "კონტაქტი"
                : "Contacts"
            }
            active={
              step >= 3
            }
            current={
              step === 3
            }
          />

          <div
            className={
              step >= 4
                ? "line active"
                : "line"
            }
          />

          <Progress
            number="4"
            label={
              ka
                ? "წესები"
                : "Terms"
            }
            active={
              step >= 4
            }
            current={
              step === 4
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
              <StepTitle
                number="01"
                title={
                  ka
                    ? "პირადი ინფორმაცია"
                    : "Personal information"
                }
                text={
                  ka
                    ? "მიუთითეთ Emergency პროფილის ძირითადი და მმართველის ინფორმაცია."
                    : "Enter the basic Emergency profile and manager information."
                }
              />

              {identityLocked && (
                <div className="lockedBox">
                  🔒{" "}
                  {ka
                    ? "QR კოდი, სახელი და გვარი ამ რეგისტრაციისთვის დაფიქსირებულია."
                    : "QR code, first name and last name are locked for this registration."}
                </div>
              )}

              <RequiredField
                label={
                  ka
                    ? "QR კოდი"
                    : "QR code"
                }
                value={
                  form.tag_code
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "tag_code",
                    value
                  )
                }
                ka={ka}
                locked={
                  identityLocked
                }
              />

              <div className="grid2">
                <RequiredField
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={
                    form.first_name
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "first_name",
                      value
                    )
                  }
                  ka={ka}
                  locked={
                    identityLocked
                  }
                />

                <RequiredField
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={
                    form.last_name
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "last_name",
                      value
                    )
                  }
                  ka={ka}
                  locked={
                    identityLocked
                  }
                />
              </div>

              <RequiredField
                label={
                  ka
                    ? "დაბადების სრული თარიღი"
                    : "Date of birth"
                }
                type="date"
                value={
                  form.date_of_birth
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "date_of_birth",
                    value
                  )
                }
                ka={ka}
              />

              <div className="visibilityRow">
                <div>
                  <strong>
                    {ka
                      ? "დაბადების თარიღის ჩვენება QR პროფილში"
                      : "Show date of birth in QR profile"}
                  </strong>

                  <span>
                    {ka
                      ? "შევსება სავალდებულოა • ჩვენება თქვენი არჩევანია"
                      : "Required to complete • Visibility is your choice"}
                  </span>
                </div>

                <Switch
                  active={
                    visibility.show_date_of_birth
                  }
                  onClick={() =>
                    toggleVisibility(
                      "show_date_of_birth"
                    )
                  }
                />
              </div>

              <RequiredSelect
                label={
                  ka
                    ? "ქვეყანა"
                    : "Country"
                }
                value={
                  form.country_code
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "country_code",
                    value
                  )
                }
                ka={ka}
                options={[
                  [
                    "",
                    ka
                      ? "აირჩიეთ ქვეყანა"
                      : "Select country",
                  ],
                  ...countryOptions.map(
                    (country) => [
                      country.code,
                      ka
                        ? country.ka
                        : country.en,
                    ]
                  ),
                ]}
              />

              {selectedCountry && (
                <div className="emergencyNumberPreview">
                  🚨{" "}
                  {ka
                    ? `ამ პროფილზე გამოჩნდება გადაუდებელი ნომერი: ${selectedCountry.emergency}`
                    : `This profile will show emergency number: ${selectedCountry.emergency}`}
                </div>
              )}

              <div className="managerBox">
                <strong>
                  {ka
                    ? "ვისთვის ქმნით პროფილს?"
                    : "Who is this profile for?"}
                </strong>

                <div className="choiceGrid">
                  <button
                    type="button"
                    className={
                      form.profile_manager_type ===
                      "self"
                        ? "choice active"
                        : "choice"
                    }
                    onClick={() => {
                      updateField(
                        "profile_manager_type",
                        "self"
                      );

                      updateField(
                        "manager_relationship",
                        ""
                      );
                    }}
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
                      form.profile_manager_type ===
                      "other"
                        ? "choice active"
                        : "choice"
                    }
                    onClick={() =>
                      updateField(
                        "profile_manager_type",
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
              </div>

              {form.profile_manager_type ===
                "other" && (
                <RequiredSelect
                  label={
                    ka
                      ? "თქვენი კავშირი ამ პირთან"
                      : "Your relationship to this person"
                  }
                  value={
                    form.manager_relationship
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "manager_relationship",
                      value
                    )
                  }
                  ka={ka}
                  options={
                    managerRelationshipOptions[
                      language
                    ]
                  }
                />
              )}

              <RequiredField
                label={
                  ka
                    ? "მმართველის ელფოსტა"
                    : "Manager email"
                }
                type="email"
                value={
                  form.owner_email
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "owner_email",
                    value
                  )
                }
                ka={ka}
              />

              <div className="fieldHelp">
                {ka
                  ? "ეს ელფოსტა გამოიყენება პროფილის მართვისა და დაცული მონაცემების აღდგენის/დადასტურებისთვის. ერთი ელფოსტით შესაძლებელია რამდენიმე Emergency პროფილის მართვა."
                  : "This email is used to manage the profile and recover or verify protected changes. One email can manage multiple Emergency profiles."}
              </div>

              <div className="grid2">
                <RequiredSecretField
                  label={
                    ka
                      ? "კოდური სიტყვა"
                      : "Codeword"
                  }
                  value={
                    form.codeword
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "codeword",
                      value
                    )
                  }
                  ka={ka}
                />

                <RequiredSecretField
                  label={
                    ka
                      ? "გაიმეორეთ კოდური სიტყვა"
                      : "Repeat codeword"
                  }
                  value={
                    form.codeword_confirm
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "codeword_confirm",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <div className="securityInfo">
                🔐{" "}
                {ka
                  ? "კოდური სიტყვა დაგჭირდებათ დაცული რედაქტირებისას. თუ დაგავიწყდებათ, აღდგენა შესაძლებელი იქნება მმართველის ელფოსტით."
                  : "The codeword will be used for protected edits. If forgotten, recovery will be available through the manager email."}
              </div>

              <OptionalPhoto
                label={
                  ka
                    ? "ფოტო"
                    : "Photo"
                }
                file={
                  photo
                }
                setFile={
                  setPhoto
                }
                visible={
                  visibility.show_photo
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_photo"
                  )
                }
                ka={ka}
              />

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <button
                type="button"
                className="primaryButton full"
                onClick={() =>
                  void nextStep()
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
              <StepTitle
                number="02"
                title={
                  ka
                    ? "სამედიცინო და დამატებითი ინფორმაცია"
                    : "Medical and additional information"
                }
                text={
                  ka
                    ? "არასავალდებულო მონაცემების შევსებასა და QR პროფილში ჩვენებას თავად აკონტროლებთ."
                    : "You control whether optional information is completed and displayed in the QR profile."
                }
              />

              <OptionalField
                label={
                  ka
                    ? "პირის საკუთარი ტელეფონის ნომერი"
                    : "Person's own phone number"
                }
                type="tel"
                value={
                  form.owner_phone
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "owner_phone",
                    value
                  )
                }
                visible={
                  visibility.show_owner_phone
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_owner_phone"
                  )
                }
                ka={ka}
                note={
                  ka
                    ? "თუ ჩართავთ, პროფილზე ეწერება, რომ ეს ნომერი ეკუთვნის Emergency სამაჯურის მფლობელს."
                    : "If enabled, the profile will clearly state that this number belongs to the Emergency Bracelet wearer."
                }
              />

              <OptionalSelect
                label={
                  ka
                    ? "სისხლის ჯგუფი"
                    : "Blood type"
                }
                value={
                  form.blood_type
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "blood_type",
                    value
                  )
                }
                visible={
                  visibility.show_blood_type
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_blood_type"
                  )
                }
                ka={ka}
                options={[
                  [
                    "",
                    ka
                      ? "აირჩიეთ"
                      : "Select",
                  ],
                  ["A+", "A+"],
                  ["A-", "A-"],
                  ["B+", "B+"],
                  ["B-", "B-"],
                  ["AB+", "AB+"],
                  ["AB-", "AB-"],
                  ["O+", "O+"],
                  ["O-", "O-"],
                ]}
              />

              <OptionalField
                label={
                  ka
                    ? "მისამართი"
                    : "Address"
                }
                value={
                  form.address
                }
                onChange={(
                  value
                ) =>
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
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "ალერგიები"
                    : "Allergies"
                }
                placeholder={
                  ka
                    ? "მაგ: პენიცილინი, თხილი..."
                    : "e.g. Penicillin, nuts..."
                }
                value={
                  form.allergies
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "allergies",
                    value
                  )
                }
                visible={
                  visibility.show_allergies
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_allergies"
                  )
                }
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "სამედიცინო მდგომარეობები"
                    : "Medical conditions"
                }
                placeholder={
                  ka
                    ? "მაგ: დიაბეტი, ეპილეფსია, ასთმა..."
                    : "e.g. Diabetes, epilepsy, asthma..."
                }
                value={
                  form.medical_conditions
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "medical_conditions",
                    value
                  )
                }
                visible={
                  visibility.show_medical_conditions
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_medical_conditions"
                  )
                }
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "მიღებული მედიკამენტები"
                    : "Current medications"
                }
                placeholder={
                  ka
                    ? "მიუთითეთ რეგულარულად მიღებული მედიკამენტები"
                    : "List regularly used medications"
                }
                value={
                  form.medications
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "medications",
                    value
                  )
                }
                visible={
                  visibility.show_medications
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_medications"
                  )
                }
                ka={ka}
              />

              <OptionalTextArea
                label={
                  ka
                    ? "მნიშვნელოვანი სამედიცინო ინფორმაცია"
                    : "Important medical information"
                }
                placeholder={
                  ka
                    ? "სხვა მნიშვნელოვანი ინფორმაცია საგანგებო სიტუაციისთვის"
                    : "Other important information for an emergency"
                }
                value={
                  form.medical_note
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "medical_note",
                    value
                  )
                }
                visible={
                  visibility.show_medical_note
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_medical_note"
                  )
                }
                ka={ka}
              />

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
                  onClick={() =>
                    void nextStep()
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
              <StepTitle
                number="03"
                title={
                  ka
                    ? "საგანგებო კონტაქტები"
                    : "Emergency contacts"
                }
                text={
                  ka
                    ? "საკონტაქტო პირების დამატება არჩევითია. ქვეყნის გადაუდებელი ნომერი 911 ან 112 პროფილზე მაინც ყოველთვის გამოჩნდება."
                    : "Emergency contacts are optional. The country's emergency number, 911 or 112, will still always be shown."
                }
              />

              <div className="emergencyServiceCard">
                <span>
                  🚨
                </span>

                <div>
                  <strong>
                    {selectedCountry
                      ? ka
                        ? `გადაუდებელი დახმარება: ${selectedCountry.emergency}`
                        : `Emergency services: ${selectedCountry.emergency}`
                      : ka
                      ? "გადაუდებელი დახმარება"
                      : "Emergency services"}
                  </strong>

                  <p>
                    {ka
                      ? "ეს ღილაკი QR პროფილზე ყოველთვის იქნება ხელმისაწვდომი."
                      : "This button will always be available on the QR profile."}
                  </p>
                </div>
              </div>

              <ContactSection
                title={
                  ka
                    ? "მთავარი საგანგებო საკონტაქტო პირი"
                    : "Primary emergency contact"
                }
                enabled={
                  emergencyContactEnabled
                }
                setEnabled={
                  setEmergencyContactEnabled
                }
                name={
                  form.emergency_contact_name
                }
                setName={(
                  value
                ) =>
                  updateField(
                    "emergency_contact_name",
                    value
                  )
                }
                relationship={
                  form.emergency_contact_relationship
                }
                setRelationship={(
                  value
                ) =>
                  updateField(
                    "emergency_contact_relationship",
                    value
                  )
                }
                phone={
                  form.emergency_contact_phone
                }
                setPhone={(
                  value
                ) =>
                  updateField(
                    "emergency_contact_phone",
                    value
                  )
                }
                mobile={
                  emergencyMobileEnabled
                }
                setMobile={
                  setEmergencyMobileEnabled
                }
                whatsapp={
                  emergencyWhatsappEnabled
                }
                setWhatsapp={
                  setEmergencyWhatsappEnabled
                }
                liveChat={
                  emergencyLiveChatEnabled
                }
                setLiveChat={
                  setEmergencyLiveChatEnabled
                }
                language={
                  language
                }
              />

              <ContactSection
                title={
                  ka
                    ? "დამატებითი საგანგებო საკონტაქტო პირი"
                    : "Additional emergency contact"
                }
                enabled={
                  secondContactEnabled
                }
                setEnabled={(
                  value
                ) => {
                  setSecondContactEnabled(
                    value
                  );

                  setVisibility(
                    (current) => ({
                      ...current,
                      show_second_contact:
                        value,
                    })
                  );
                }}
                name={
                  form.second_contact_name
                }
                setName={(
                  value
                ) =>
                  updateField(
                    "second_contact_name",
                    value
                  )
                }
                relationship={
                  form.second_contact_relationship
                }
                setRelationship={(
                  value
                ) =>
                  updateField(
                    "second_contact_relationship",
                    value
                  )
                }
                phone={
                  form.second_contact_phone
                }
                setPhone={(
                  value
                ) =>
                  updateField(
                    "second_contact_phone",
                    value
                  )
                }
                mobile={
                  secondMobileEnabled
                }
                setMobile={
                  setSecondMobileEnabled
                }
                whatsapp={
                  secondWhatsappEnabled
                }
                setWhatsapp={
                  setSecondWhatsappEnabled
                }
                liveChat={
                  secondLiveChatEnabled
                }
                setLiveChat={
                  setSecondLiveChatEnabled
                }
                language={
                  language
                }
              />

              <OptionalTextArea
                label={
                  ka
                    ? "დამატებითი Emergency შეტყობინება"
                    : "Additional Emergency message"
                }
                placeholder={
                  ka
                    ? "მაგ: გთხოვთ დაუკავშირდეთ ოჯახის წევრს..."
                    : "e.g. Please contact a family member..."
                }
                value={
                  form.emergency_message
                }
                onChange={(
                  value
                ) =>
                  updateField(
                    "emergency_message",
                    value
                  )
                }
                visible={
                  visibility.show_emergency_message
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_emergency_message"
                  )
                }
                ka={ka}
              />

              <div className="locationCard">
                <div className="locationText">
                  <span className="locationIcon">
                    ⌖
                  </span>

                  <div>
                    <strong>
                      {ka
                        ? "ლოკაციის გაზიარება"
                        : "Location sharing"}
                    </strong>

                    <p>
                      {ka
                        ? "ჩართვის შემთხვევაში QR კოდის დამსკანერებელს შეეძლება თავისი მიმდინარე ლოკაციის გაზიარება."
                        : "When enabled, the person scanning the QR code can share their current location."}
                    </p>
                  </div>
                </div>

                <Switch
                  active={
                    locationSharing
                  }
                  onClick={() =>
                    setLocationSharing(
                      !locationSharing
                    )
                  }
                />
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
                  onClick={() =>
                    void nextStep()
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

          {step === 4 && (
            <>
              <StepTitle
                number="04"
                title={
                  ka
                    ? "წესები და თანხმობა"
                    : "Terms and consent"
                }
                text={
                  ka
                    ? "გთხოვთ პროფილის შექმნამდე გაეცნოთ Emergency პროფილის გამოყენების ძირითად წესებს."
                    : "Please review the main Emergency profile rules before creating the profile."
                }
              />

              <div className="termsBox">
                <h3>
                  {ka
                    ? "QR RETURN Emergency — გამოყენების წესები"
                    : "QR RETURN Emergency — Terms of use"}
                </h3>

                <ol>
                  <li>
                    {ka
                      ? "ერთი Emergency QR კოდი განკუთვნილია მხოლოდ ერთი კონკრეტული ადამიანისთვის."
                      : "One Emergency QR code is intended for one specific person only."}
                  </li>

                  <li>
                    {ka
                      ? "QR კოდი პროფილის შექმნის შემდეგ აღარ იცვლება და სხვა ადამიანზე გადატანა არ შეიძლება."
                      : "The QR code cannot be changed after profile creation and may not be transferred to another person."}
                  </li>

                  <li>
                    {ka
                      ? "სახელი და გვარი დაცული ინფორმაციაა. მათი გასწორება შესაძლებელი იქნება მხოლოდ ერთხელ, დაცული დადასტურების პროცესით."
                      : "First and last name are protected information. They may be corrected only once through a protected verification process."}
                  </li>

                  <li>
                    {ka
                      ? "დაბადების სრული თარიღის მითითება რეგისტრაციისთვის სავალდებულოა."
                      : "A complete date of birth is required for registration."}
                  </li>

                  <li>
                    {ka
                      ? "მომხმარებელი პასუხისმგებელია მის მიერ შეყვანილი სამედიცინო, პირადი და საკონტაქტო ინფორმაციის სისწორეზე."
                      : "The user is responsible for the accuracy of medical, personal and contact information entered."}
                  </li>

                  <li>
                    {ka
                      ? "არასავალდებულო ინფორმაციის QR პროფილში ჩვენებას მომხმარებელი ON/OFF პარამეტრებით აკონტროლებს."
                      : "The user controls visibility of optional information using ON/OFF settings."}
                  </li>

                  <li>
                    {ka
                      ? "ქვეყნის მიხედვით QR პროფილზე ავტომატურად გამოჩნდება შესაბამისი გადაუდებელი ნომერი — აშშ-ში 911, საქართველოში 112."
                      : "The QR profile automatically shows the appropriate emergency number by country — 911 in the United States and 112 in Georgia."}
                  </li>

                  <li>
                    {ka
                      ? "საგანგებო საკონტაქტო პირების დამატება და Mobile, WhatsApp ან Live Chat მეთოდების ჩართვა არჩევითია."
                      : "Adding emergency contacts and enabling Mobile, WhatsApp or Live Chat methods is optional."}
                  </li>

                  <li>
                    {ka
                      ? "ერთი მმართველის ელფოსტას შეიძლება უკავშირდებოდეს რამდენიმე Emergency პროფილი, თუმცა თითოეულ ადამიანს უნდა ჰქონდეს საკუთარი უნიკალური QR კოდი."
                      : "One manager email may manage multiple Emergency profiles, but each person must have their own unique QR code."}
                  </li>

                  <li>
                    {ka
                      ? "„დამატებითი პროფილის რეგისტრაცია“ ქმნის ახალ, დამოუკიდებელ Emergency პროფილს ახალი QR კოდით."
                      : "Registering an additional profile creates a separate Emergency profile with a new QR code."}
                  </li>

                  <li>
                    {ka
                      ? "Emergency პროფილი არ წარმოადგენს პროფესიულ სამედიცინო ჩანაწერს და არ ცვლის გადაუდებელი დახმარების მომსახურებას."
                      : "The Emergency profile is not a professional medical record and does not replace emergency services."}
                  </li>
                </ol>
              </div>

              <label className="termsCheck">
                <input
                  type="checkbox"
                  checked={
                    termsAccepted
                  }
                  onChange={(
                    event
                  ) =>
                    setTermsAccepted(
                      event.target
                        .checked
                    )
                  }
                />

                <span>
                  <strong>
                    {ka
                      ? "წავიკითხე და ვეთანხმები"
                      : "I have read and agree"}
                  </strong>

                  <small>
                    {ka
                      ? "ვეთანხმები Emergency პროფილის გამოყენების წესებსა და კონფიდენციალურობის პირობებს."
                      : "I agree to the Emergency profile terms of use and privacy conditions."}
                  </small>
                </span>
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
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (
    language: Language
  ) => void;
}) {
  const ka =
    language === "ka";

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

      <div className="headerRight">
        <a
          href="/"
          className="headerBack"
        >
          ←{" "}
          {ka
            ? "მთავარ გვერდზე"
            : "Home"}
        </a>

        <div className="languages">
          <button
            type="button"
            className={
              language === "ka"
                ? "selected"
                : ""
            }
            onClick={() =>
              setLanguage(
                "ka"
              )
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              language === "en"
                ? "selected"
                : ""
            }
            onClick={() =>
              setLanguage(
                "en"
              )
            }
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
        className={`circle ${
          active
            ? "active"
            : ""
        } ${
          current
            ? "current"
            : ""
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
      <b>
        {number}
      </b>

      <div>
        <h2>
          {title}
        </h2>

        <p>
          {text}
        </p>
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
  locked = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  ka: boolean;
  type?: string;
  locked?: boolean;
}) {
  return (
    <div className="requiredField">
      <label>
        <strong>
          {label} *
          {locked
            ? " 🔒"
            : ""}
        </strong>

        <input
          type={type}
          value={value}
          required
          readOnly={
            locked
          }
          className={
            locked
              ? "lockedInput"
              : ""
          }
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
        />
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? locked
            ? "სავალდებულო • დაფიქსირებული"
            : "სავალდებულო"
          : locked
          ? "Required • Locked"
          : "Required"}
      </div>
    </div>
  );
}

function RequiredSecretField({
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
    <div className="requiredField">
      <label>
        <strong>
          {label} *
        </strong>

        <input
          type="password"
          autoComplete="new-password"
          value={value}
          required
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
        />
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? "სავალდებულო • მინიმუმ 6 სიმბოლო"
          : "Required • Minimum 6 characters"}
      </div>
    </div>
  );
}

function RequiredSelect({
  label,
  value,
  onChange,
  ka,
  options,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  ka: boolean;
  options: string[][];
}) {
  return (
    <div className="requiredField">
      <label>
        <strong>
          {label} *
        </strong>

        <select
          value={value}
          required
          onChange={(
            event
          ) =>
            onChange(
              event.target.value
            )
          }
        >
          {options.map(
            ([
              optionValue,
              optionLabel,
            ]) => (
              <option
                key={
                  optionValue ||
                  "empty"
                }
                value={
                  optionValue
                }
              >
                {
                  optionLabel
                }
              </option>
            )
          )}
        </select>
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? "სავალდებულო"
          : "Required"}
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
  note,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
  type?: string;
  note?: string;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>
            {label}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი • შევსება თქვენი არჩევანია"
              : "Optional • Completing this field is your choice"}
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
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      />

      <div className="optionalNote">
        {ka
          ? "QR პროფილში ჩვენება:"
          : "Show in QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </div>

      {note && (
        <div className="fieldHelp">
          {note}
        </div>
      )}
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
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
  options: string[][];
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>
            {label}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი • შევსება თქვენი არჩევანია"
              : "Optional • Completing this field is your choice"}
          </span>
        </div>

        <Switch
          active={visible}
          onClick={onToggle}
        />
      </div>

      <select
        value={value}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      >
        {options.map(
          ([
            optionValue,
            optionLabel,
          ]) => (
            <option
              key={
                optionValue ||
                "empty"
              }
              value={
                optionValue
              }
            >
              {
                optionLabel
              }
            </option>
          )
        )}
      </select>

      <div className="optionalNote">
        {ka
          ? "QR პროფილში ჩვენება:"
          : "Show in QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </div>
    </div>
  );
}

function OptionalTextArea({
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggle,
  ka,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>
            {label}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი • შევსება თქვენი არჩევანია"
              : "Optional • Completing this field is your choice"}
          </span>
        </div>

        <Switch
          active={visible}
          onClick={onToggle}
        />
      </div>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(
          event
        ) =>
          onChange(
            event.target.value
          )
        }
      />

      <div className="optionalNote">
        {ka
          ? "QR პროფილში ჩვენება:"
          : "Show in QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
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
  setFile: (
    file: File | null
  ) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
}) {
  return (
    <div className="optionalField">
      <div className="fieldHeader">
        <div>
          <strong>
            {label}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი • დამატება თქვენი არჩევანია"
              : "Optional • Adding a photo is your choice"}
          </span>
        </div>

        <Switch
          active={visible}
          onClick={onToggle}
        />
      </div>

      <label className="photoUpload">
        <input
          type="file"
          accept="image/*"
          onChange={(
            event
          ) =>
            setFile(
              event.target
                .files?.[0] ||
                null
            )
          }
        />

        <div className="photoIcon">
          {file
            ? "✓"
            : "+"}
        </div>

        <div>
          <strong>
            {file
              ? file.name
              : ka
              ? "ფოტოს დამატება"
              : "Add photo"}
          </strong>

          <small>
            {ka
              ? "აირჩიეთ სურათი • მაქსიმუმ 5 MB"
              : "Choose an image • Maximum 5 MB"}
          </small>
        </div>
      </label>

      <div className="optionalNote">
        {ka
          ? "QR პროფილში ჩვენება:"
          : "Show in QR profile:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </div>
    </div>
  );
}

function ContactSection({
  title,
  enabled,
  setEnabled,
  name,
  setName,
  relationship,
  setRelationship,
  phone,
  setPhone,
  mobile,
  setMobile,
  whatsapp,
  setWhatsapp,
  liveChat,
  setLiveChat,
  language,
}: {
  title: string;
  enabled: boolean;
  setEnabled: (
    value: boolean
  ) => void;

  name: string;
  setName: (
    value: string
  ) => void;

  relationship: string;
  setRelationship: (
    value: string
  ) => void;

  phone: string;
  setPhone: (
    value: string
  ) => void;

  mobile: boolean;
  setMobile: (
    value: boolean
  ) => void;

  whatsapp: boolean;
  setWhatsapp: (
    value: boolean
  ) => void;

  liveChat: boolean;
  setLiveChat: (
    value: boolean
  ) => void;

  language: Language;
}) {
  const ka =
    language === "ka";

  return (
    <div
      className={
        enabled
          ? "contactSection enabled"
          : "contactSection"
      }
    >
      <div className="contactSectionHeader">
        <div>
          <strong>
            {title}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </span>
        </div>

        <Switch
          active={enabled}
          onClick={() =>
            setEnabled(
              !enabled
            )
          }
        />
      </div>

      {enabled && (
        <div className="contactContent">
          <label className="simpleLabel">
            <strong>
              {ka
                ? "სახელი და გვარი"
                : "Full name"}
            </strong>

            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event.target
                    .value
                )
              }
            />
          </label>

          <label className="simpleLabel">
            <strong>
              {ka
                ? "თქვენთან კავშირი"
                : "Relationship to person"}
            </strong>

            <select
              value={
                relationship
              }
              onChange={(
                event
              ) =>
                setRelationship(
                  event.target
                    .value
                )
              }
            >
              {relationshipOptions[
                language
              ].map(
                ([
                  optionValue,
                  optionLabel,
                ]) => (
                  <option
                    key={
                      optionValue ||
                      "empty"
                    }
                    value={
                      optionValue
                    }
                  >
                    {
                      optionLabel
                    }
                  </option>
                )
              )}
            </select>
          </label>

          <label className="simpleLabel">
            <strong>
              {ka
                ? "ტელეფონის ნომერი"
                : "Phone number"}
            </strong>

            <input
              type="tel"
              value={phone}
              onChange={(
                event
              ) =>
                setPhone(
                  event.target
                    .value
                )
              }
            />
          </label>

          <div className="contactMethods">
            <strong>
              {ka
                ? "დაკავშირების მეთოდები"
                : "Contact methods"}
            </strong>

            <p>
              {ka
                ? "აირჩიეთ სურვილისამებრ ერთი, რამდენიმე ან არცერთი."
                : "Choose one, several, or none."}
            </p>

            <ContactMethod
              icon="📞"
              title={
                ka
                  ? "მობილური"
                  : "Mobile"
              }
              active={
                mobile
              }
              onClick={() =>
                setMobile(
                  !mobile
                )
              }
            />

            <ContactMethod
              icon="🟢"
              title="WhatsApp"
              active={
                whatsapp
              }
              onClick={() =>
                setWhatsapp(
                  !whatsapp
                )
              }
            />

            <ContactMethod
              icon="💬"
              title="Live Chat"
              active={
                liveChat
              }
              onClick={() =>
                setLiveChat(
                  !liveChat
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ContactMethod({
  icon,
  title,
  active,
  onClick,
}: {
  icon: string;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "contactMethod active"
          : "contactMethod"
      }
      onClick={onClick}
      aria-pressed={
        active
      }
    >
      <span className="contactIcon">
        {icon}
      </span>

      <strong>
        {title}
      </strong>

      <span
        className={
          active
            ? "check active"
            : "check"
        }
      >
        {active
          ? "✓"
          : ""}
      </span>
    </button>
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
      {text}
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
            circle at 100% 0%,
            rgba(21, 94, 239, 0.07),
            transparent 26%
          ),
          #f7f9fc;
        color: #101828;
        font-family:
          Inter,
          Arial,
          sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1080px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom:
          1px solid #e4e9f0;
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
        color: #fff;
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

      .headerRight {
        display: flex;
        align-items: center;
        gap: 13px;
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
        border-radius: 10px;
        background: #edf0f4;
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

      .languages button.selected {
        background: #fff;
        color: #155eef;
      }

      .content {
        width: calc(100% - 24px);
        max-width: 800px;
        margin: auto;
        padding: 44px 0 80px;
      }

      .hero {
        display: flex;
        align-items: flex-start;
        gap: 17px;
      }

      .emergencyIcon {
        width: 62px;
        height: 62px;
        flex: 0 0 62px;
        display: grid;
        place-items: center;
        border:
          1px solid #ffd7d2;
        border-radius: 19px;
        background: #fff1ef;
        color: #d92d20;
        font-size: 32px;
        font-weight: 900;
      }

      .eyebrow {
        color: #d92d20;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 1.7px;
      }

      .hero h1 {
        margin: 7px 0 8px;
        font-size: 37px;
        line-height: 1.13;
        letter-spacing: -1px;
      }

      .hero p {
        max-width: 650px;
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.65;
      }

      .informationBox {
        margin-top: 25px;
        padding: 17px 18px;
        border:
          1px solid #d8e5fb;
        border-left:
          4px solid #155eef;
        border-radius: 14px;
        background: #f2f7ff;
      }

      .informationBox strong {
        color: #344054;
        font-size: 15px;
        font-weight: 850;
      }

      .informationBox p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.6;
      }

      .progress {
        margin: 35px 0 24px;
        display: flex;
        align-items: center;
      }

      .progressItem {
        min-width: 70px;
        text-align: center;
      }

      .circle {
        width: 36px;
        height: 36px;
        margin: auto;
        display: grid;
        place-items: center;
        border:
          1px solid #d4dae2;
        border-radius: 50%;
        background: #fff;
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
        color: #fff;
        box-shadow:
          0 0 0 5px
          rgba(217, 45, 32, 0.08);
      }

      .progressItem small {
        display: block;
        margin-top: 7px;
        color: #667085;
        font-size: 10px;
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
        padding: 30px;
        border:
          1px solid #e2e7ed;
        border-top:
          4px solid #d92d20;
        border-radius: 23px;
        background: #fff;
        box-shadow:
          0 12px 38px
          rgba(16, 24, 40, 0.055);
      }

      .stepTitle {
        margin-bottom: 27px;
        display: flex;
        gap: 13px;
      }

      .stepTitle > b {
        padding-top: 4px;
        color: #d92d20;
        font-size: 12px;
        font-weight: 900;
      }

      .stepTitle h2 {
        margin: 0;
        font-size: 23px;
      }

      .stepTitle p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.55;
      }

      .grid2 {
        display: grid;
        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );
        gap: 14px;
      }

      .requiredField,
      .optionalField {
        margin-bottom: 21px;
      }

      .requiredField label > strong,
      .fieldHeader strong,
      .simpleLabel > strong {
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
      .optionalField textarea,
      .simpleLabel input,
      .simpleLabel select {
        width: 100%;
        border:
          1px solid #d0d5dd;
        border-radius: 12px;
        background: #fff;
        color: #101828;
        outline: none;
      }

      .requiredField input,
      .requiredField select,
      .optionalField input,
      .optionalField select,
      .simpleLabel input,
      .simpleLabel select {
        height: 54px;
        padding: 0 14px;
      }

      .optionalField textarea {
        min-height: 112px;
        padding: 14px;
        resize: vertical;
        line-height: 1.5;
      }

      .requiredField input:focus,
      .requiredField select:focus,
      .optionalField input:focus,
      .optionalField select:focus,
      .optionalField textarea:focus,
      .simpleLabel input:focus,
      .simpleLabel select:focus {
        border-color: #155eef;
        box-shadow:
          0 0 0 3px
          rgba(21, 94, 239, 0.08);
      }

      .lockedInput {
        background:
          #f2f4f7 !important;
        color:
          #667085 !important;
        cursor: not-allowed;
      }

      .requiredNote {
        margin-top: 9px;
        color: #16803b;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 800;
      }

      .fieldHelp {
        margin:
          -10px 0 20px;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .securityInfo {
        margin-bottom: 22px;
        padding: 14px 15px;
        border:
          1px solid #d8e5fb;
        border-radius: 12px;
        background: #f2f7ff;
        color: #475467;
        font-size: 13px;
        line-height: 1.55;
      }

      .lockedBox {
        margin-bottom: 20px;
        padding: 14px;
        border:
          1px solid #d9e5fb;
        border-radius: 12px;
        background: #f2f7ff;
        color: #344054;
        font-size: 13px;
        line-height: 1.5;
        font-weight: 750;
      }

      .visibilityRow {
        margin:
          -8px 0 21px;
        padding: 14px 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        border:
          1px solid #e2e7ed;
        border-radius: 12px;
        background: #f9fafb;
      }

      .visibilityRow strong,
      .visibilityRow span {
        display: block;
      }

      .visibilityRow strong {
        color: #344054;
        font-size: 14px;
      }

      .visibilityRow span {
        margin-top: 4px;
        color: #667085;
        font-size: 13px;
      }

      .emergencyNumberPreview {
        margin:
          -8px 0 22px;
        padding: 13px 15px;
        border:
          1px solid #ffd7d2;
        border-radius: 11px;
        background: #fff5f4;
        color: #b42318;
        font-size: 13px;
        font-weight: 800;
      }

      .managerBox {
        margin-bottom: 21px;
      }

      .managerBox > strong {
        display: block;
        margin-bottom: 9px;
        color: #344054;
        font-size: 15px;
      }

      .choiceGrid {
        display: grid;
        grid-template-columns:
          1fr 1fr;
        gap: 10px;
      }

      .choice {
        min-height: 82px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 10px;
        border:
          1px solid #d0d5dd;
        border-radius: 13px;
        background: #fff;
        color: #475467;
        cursor: pointer;
      }

      .choice.active {
        border-color: #155eef;
        background: #f2f7ff;
        color: #155eef;
      }

      .choice > span {
        font-size: 25px;
      }

      .choice strong {
        text-align: left;
        font-size: 13px;
      }

      .fieldHeader {
        margin-bottom: 9px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .fieldHeader strong {
        margin-bottom: 4px;
      }

      .fieldHeader span {
        display: block;
        color: #667085;
        font-size: 14px;
        line-height: 1.45;
        font-weight: 700;
      }

      .optionalNote {
        margin-top: 9px;
        color: #667085;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 700;
      }

      .optionalNote b {
        color: #155eef;
        font-size: 14px;
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
        background: #fff;
        transition:
          transform 0.2s ease;
      }

      .switch.active {
        background: #155eef;
      }

      .switch.active span {
        transform:
          translateX(21px);
      }

      .photoUpload {
        min-height: 76px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 13px;
        border:
          1px dashed #c7ced8;
        border-radius: 13px;
        background: #fafbfc;
        cursor: pointer;
      }

      .photoUpload input {
        display: none;
      }

      .photoIcon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eaf2ff;
        color: #155eef;
        font-size: 21px;
        font-weight: 900;
      }

      .photoUpload strong,
      .photoUpload small {
        display: block;
      }

      .photoUpload strong {
        color: #344054;
        font-size: 14px;
      }

      .photoUpload small {
        margin-top: 4px;
        color: #98a2b3;
        font-size: 12px;
      }

      .emergencyServiceCard {
        margin-bottom: 22px;
        padding: 17px;
        display: flex;
        align-items: center;
        gap: 12px;
        border:
          1px solid #ffd7d2;
        border-radius: 14px;
        background: #fff5f4;
      }

      .emergencyServiceCard > span {
        font-size: 25px;
      }

      .emergencyServiceCard strong {
        color: #b42318;
        font-size: 15px;
      }

      .emergencyServiceCard p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 13px;
      }

      .contactSection {
        margin-bottom: 18px;
        padding: 18px;
        border:
          1px solid #e2e7ed;
        border-radius: 15px;
        background: #f9fafb;
      }

      .contactSection.enabled {
        border-color: #cdddf9;
        background: #f8fbff;
      }

      .contactSectionHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .contactSectionHeader strong,
      .contactSectionHeader span {
        display: block;
      }

      .contactSectionHeader strong {
        color: #344054;
        font-size: 15px;
      }

      .contactSectionHeader span {
        margin-top: 4px;
        color: #667085;
        font-size: 13px;
      }

      .contactContent {
        margin-top: 20px;
      }

      .simpleLabel {
        display: block;
        margin-bottom: 17px;
      }

      .contactMethods {
        margin-top: 18px;
        padding: 16px;
        border:
          1px solid #e2e7ed;
        border-radius: 13px;
        background: #fff;
      }

      .contactMethods > strong {
        font-size: 14px;
      }

      .contactMethods > p {
        margin: 5px 0 12px;
        color: #667085;
        font-size: 13px;
      }

      .contactMethod {
        width: 100%;
        min-height: 57px;
        margin-top: 8px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 11px;
        border:
          1px solid #dce2e9;
        border-radius: 12px;
        background: #fff;
        cursor: pointer;
      }

      .contactMethod.active {
        border-color: #155eef;
        background: #f3f7fd;
      }

      .contactIcon {
        width: 37px;
        height: 37px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
      }

      .contactMethod strong {
        flex: 1;
        text-align: left;
        color: #344054;
        font-size: 14px;
      }

      .check {
        width: 23px;
        height: 23px;
        display: grid;
        place-items: center;
        border:
          1px solid #cdd4dd;
        border-radius: 7px;
        color: #fff;
      }

      .check.active {
        border-color: #155eef;
        background: #155eef;
      }

      .locationCard {
        margin-top: 24px;
        padding: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border:
          1px solid #d9e5fb;
        border-radius: 15px;
        background: #f4f8ff;
      }

      .locationText {
        display: flex;
        align-items: flex-start;
        gap: 11px;
      }

      .locationIcon {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #e5efff;
        color: #155eef;
        font-size: 18px;
      }

      .locationCard strong {
        color: #344054;
        font-size: 15px;
      }

      .locationCard p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .termsBox {
        max-height: 430px;
        overflow-y: auto;
        padding: 20px;
        border:
          1px solid #e2e7ed;
        border-radius: 15px;
        background: #f9fafb;
      }

      .termsBox h3 {
        margin: 0 0 15px;
        color: #344054;
        font-size: 16px;
      }

      .termsBox ol {
        margin: 0;
        padding-left: 22px;
      }

      .termsBox li {
        margin-bottom: 12px;
        padding-left: 4px;
        color: #475467;
        font-size: 13px;
        line-height: 1.6;
      }

      .termsCheck {
        margin-top: 20px;
        padding: 17px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        border:
          1px solid #d9e5fb;
        border-radius: 14px;
        background: #f2f7ff;
        cursor: pointer;
      }

      .termsCheck input {
        width: 20px;
        height: 20px;
        margin-top: 2px;
        accent-color: #155eef;
      }

      .termsCheck strong,
      .termsCheck small {
        display: block;
      }

      .termsCheck strong {
        color: #344054;
        font-size: 14px;
      }

      .termsCheck small {
        margin-top: 5px;
        color: #667085;
        font-size: 13px;
        line-height: 1.5;
      }

      .buttons {
        margin-top: 27px;
        display: flex;
        gap: 10px;
      }

      .primaryButton,
      .backButton,
      .saveButton {
        min-height: 53px;
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
        color: #fff;
        text-decoration: none;
      }

      .primaryButton.full {
        width: 100%;
        margin-top: 12px;
      }

      .backButton {
        border:
          1px solid #d0d5dd;
        background: #fff;
        color: #475467;
      }

      .saveButton {
        margin-left: auto;
        border: 0;
        background: #d92d20;
        color: #fff;
      }

      .saveButton:disabled {
        opacity: 0.55;
        cursor: not-allowed;
      }

      .errorBox {
        margin-top: 18px;
        padding: 14px 15px;
        border:
          1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 750;
      }

      .successPage {
        width: calc(100% - 24px);
        max-width: 650px;
        margin: auto;
        padding: 100px 0;
        text-align: center;
      }

      .successIcon {
        width: 72px;
        height: 72px;
        margin:
          0 auto 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #e9f8ef;
        color: #16803b;
        font-size: 30px;
        font-weight: 900;
      }

      .successPage h1 {
        margin: 9px 0;
        font-size: 30px;
      }

      .successPage > p {
        margin: 0 0 25px;
        color: #667085;
        line-height: 1.6;
      }

      .successButtons {
        display: grid;
        grid-template-columns:
          1fr 1fr;
        gap: 10px;
      }

      .viewButton,
      .additionalButton,
      .homeButton {
        min-height: 51px;
        padding: 0 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 900;
      }

      .viewButton {
        background: #155eef;
        color: #fff;
      }

      .additionalButton {
        background: #d92d20;
        color: #fff;
      }

      .homeButton {
        grid-column:
          1 / -1;
        border:
          1px solid #d0d5dd;
        background: #fff;
        color: #475467;
      }

      .lockedNotice {
        margin-top: 25px;
        padding: 16px;
        border:
          1px solid #d9e5fb;
        border-radius: 13px;
        background: #f2f7ff;
        text-align: left;
      }

      .lockedNotice strong {
        color: #344054;
        font-size: 14px;
      }

      .lockedNotice p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      @media (
        max-width: 650px
      ) {
        .headerBack {
          display: none;
        }

        .content {
          padding-top: 28px;
        }

        .hero {
          gap: 12px;
        }

        .emergencyIcon {
          width: 52px;
          height: 52px;
          flex-basis: 52px;
          font-size: 27px;
        }

        .hero h1 {
          font-size: 27px;
        }

        .progressItem {
          min-width: 53px;
        }

        .progressItem small {
          font-size: 9px;
        }

        .circle {
          width: 32px;
          height: 32px;
        }

        .card {
          padding: 21px 14px;
          border-radius: 18px;
        }

        .grid2,
        .choiceGrid {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .choice {
          margin-bottom: 8px;
        }

        .requiredField input,
        .requiredField select,
        .optionalField input,
        .optionalField select,
        .optionalField textarea,
        .simpleLabel input,
        .simpleLabel select {
          font-size: 16px;
        }

        .fieldHeader span,
        .optionalNote,
        .requiredNote {
          font-size: 13px;
        }

        .locationCard {
          align-items: flex-start;
        }

        .buttons {
          display: grid;
          grid-template-columns:
            0.9fr 1.5fr;
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

        .homeButton {
          grid-column: auto;
        }
      }
    `}</style>
  );
}
