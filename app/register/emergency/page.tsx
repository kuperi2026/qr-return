"use client";

import { FormEvent, ReactNode, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type RegisterFor = "self" | "other";

type Screen =
  | "choice"
  | "self"
  | "manager"
  | "wearer"
  | "terms"
  | "success"
  | "manage-find"
  | "manage-verify"
  | "manage-edit"
  | "additional";

type VerifyMethod = "codeword" | "email";

type FormData = {
  register_for: RegisterFor;

  manager_first_name: string;
  manager_last_name: string;
  manager_phone: string;
  manager_email: string;
  manager_address: string;
  manager_relationship: string;

  codeword: string;
  codeword_confirm: string;

  tag_code: string;

  first_name: string;
  last_name: string;

  date_of_birth: string;
  country_code: string;
  personal_number: string;

  address: string;

  chronic_conditions: string;
  additional_info: string;

  contact_first_name: string;
  contact_last_name: string;
  contact_relationship: string;
  contact_phone: string;

  contact_mobile_enabled: boolean;
  contact_whatsapp_enabled: boolean;
  contact_live_chat_enabled: boolean;
};

type Visibility = {
  show_date_of_birth: boolean;
  show_personal_number: boolean;
  show_address: boolean;
  show_chronic_conditions: boolean;
  show_additional_info: boolean;
  show_contact: boolean;
};

type ManagedRow = {
  tag_code: string;

  first_name: string;
  last_name: string;

  date_of_birth: string | null;
  country_code: string | null;
  personal_number: string | null;

  address: string | null;
  medical_conditions: string | null;
  additional_info: string | null;

  show_date_of_birth: boolean;
  show_personal_number: boolean;
  show_address: boolean;
  show_medical_conditions: boolean;
  show_additional_info: boolean;

  emergency_contact_enabled: boolean;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone: string | null;
  show_emergency_contact: boolean;

  emergency_contact_mobile_enabled: boolean;
  emergency_contact_whatsapp_enabled: boolean;
  emergency_contact_live_chat_enabled: boolean;

  owner_email: string | null;
  owner_phone: string | null;

  manager_first_name: string | null;
  manager_last_name: string | null;
  manager_address: string | null;
  manager_relationship: string | null;

  codeword_hash: string | null;

  identity_edit_used: boolean;
};

const TERMS_VERSION = "emergency-v4";

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

const relationshipOptions = {
  ka: [
    ["", "აირჩიეთ"],
    ["spouse", "მეუღლე"],
    ["mother", "დედა"],
    ["father", "მამა"],
    ["child", "შვილი"],
    ["sister", "და"],
    ["brother", "ძმა"],
    ["grandparent", "ბებია / ბაბუა"],
    ["grandchild", "შვილიშვილი"],
    ["guardian", "მეურვე"],
    ["caregiver", "მომვლელი"],
    ["relative", "ნათესავი"],
    ["friend", "მეგობარი"],
    ["other", "სხვა"],
  ],
  en: [
    ["", "Select"],
    ["spouse", "Spouse"],
    ["mother", "Mother"],
    ["father", "Father"],
    ["child", "Child"],
    ["sister", "Sister"],
    ["brother", "Brother"],
    ["grandparent", "Grandparent"],
    ["grandchild", "Grandchild"],
    ["guardian", "Guardian"],
    ["caregiver", "Caregiver"],
    ["relative", "Relative"],
    ["friend", "Friend"],
    ["other", "Other"],
  ],
};

const initialForm: FormData = {
  register_for: "self",

  manager_first_name: "",
  manager_last_name: "",
  manager_phone: "",
  manager_email: "",
  manager_address: "",
  manager_relationship: "",

  codeword: "",
  codeword_confirm: "",

  tag_code: "",

  first_name: "",
  last_name: "",

  date_of_birth: "",
  country_code: "",
  personal_number: "",

  address: "",

  chronic_conditions: "",
  additional_info: "",

  contact_first_name: "",
  contact_last_name: "",
  contact_relationship: "",
  contact_phone: "",

  contact_mobile_enabled: false,
  contact_whatsapp_enabled: false,
  contact_live_chat_enabled: false,
};

const initialVisibility: Visibility = {
  show_date_of_birth: false,
  show_personal_number: false,
  show_address: false,
  show_chronic_conditions: false,
  show_additional_info: false,
  show_contact: true,
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeTag(value: string) {
  return value.trim().toUpperCase();
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function bytesToBase64(bytes: Uint8Array) {
  let result = "";

  for (let i = 0; i < bytes.length; i += 1) {
    result += String.fromCharCode(bytes[i]);
  }

  return btoa(result);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const result = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    result[i] = binary.charCodeAt(i);
  }

  return result;
}

async function createCodewordHash(codeword: string) {
  const encoder = new TextEncoder();

  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const iterations = 210000;

  const material =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(codeword),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

  const bits =
    await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations,
        hash: "SHA-256",
      },
      material,
      256
    );

  return [
    "pbkdf2_sha256",
    iterations.toString(),
    bytesToBase64(salt),
    bytesToBase64(
      new Uint8Array(bits)
    ),
  ].join("$");
}

async function verifyCodeword(
  codeword: string,
  storedHash: string
) {
  try {
    const parts = storedHash.split("$");

    if (
      parts.length !== 4 ||
      parts[0] !== "pbkdf2_sha256"
    ) {
      return false;
    }

    const iterations = Number(parts[1]);

    const salt =
      base64ToBytes(parts[2]);

    const expected =
      base64ToBytes(parts[3]);

    const encoder =
      new TextEncoder();

    const material =
      await crypto.subtle.importKey(
        "raw",
        encoder.encode(codeword),
        "PBKDF2",
        false,
        ["deriveBits"]
      );

    const bits =
      await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt,
          iterations,
          hash: "SHA-256",
        },
        material,
        expected.length * 8
      );

    const actual =
      new Uint8Array(bits);

    if (
      actual.length !==
      expected.length
    ) {
      return false;
    }

    let difference = 0;

    for (
      let i = 0;
      i < actual.length;
      i += 1
    ) {
      difference |=
        actual[i] ^ expected[i];
    }

    return difference === 0;
  } catch {
    return false;
  }
}

function splitName(
  fullName: string | null
) {
  if (!fullName) {
    return {
      first: "",
      last: "",
    };
  }

  const parts =
    fullName
      .trim()
      .split(/\s+/);

  if (parts.length === 1) {
    return {
      first: parts[0],
      last: "",
    };
  }

  return {
    first: parts[0],
    last: parts
      .slice(1)
      .join(" "),
  };
}

export default function EmergencyPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [screen, setScreen] =
    useState<Screen>("choice");

  const [form, setForm] =
    useState<FormData>(
      initialForm
    );

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

  const [error, setError] =
    useState("");

  const [notice, setNotice] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [
    createdTag,
    setCreatedTag,
  ] = useState("");

  /*
   * PROFILE MANAGEMENT
   */

  const [
    manageTag,
    setManageTag,
  ] = useState("");

  const [
    managedRow,
    setManagedRow,
  ] =
    useState<ManagedRow | null>(
      null
    );

  const [
    verifyMethod,
    setVerifyMethod,
  ] =
    useState<VerifyMethod>(
      "codeword"
    );

  const [
    verifyCodewordInput,
    setVerifyCodewordInput,
  ] = useState("");

  const [
    emailOtp,
    setEmailOtp,
  ] = useState("");

  const [
    otpSent,
    setOtpSent,
  ] = useState(false);

  const [
    managerVerified,
    setManagerVerified,
  ] = useState(false);

  const [
    identityEditUnlocked,
    setIdentityEditUnlocked,
  ] = useState(false);

  const [
    originalFirstName,
    setOriginalFirstName,
  ] = useState("");

  const [
    originalLastName,
    setOriginalLastName,
  ] = useState("");

  const [
    managerHashForAdditional,
    setManagerHashForAdditional,
  ] =
    useState<string | null>(
      null
    );

  const [
    profileCount,
    setProfileCount,
  ] = useState(0);

  const ka = lang === "ka";

  const selectedCountry =
    countries.find(
      (item) =>
        item.code ===
        form.country_code
    );

  const contactExists =
    Boolean(
      form.contact_first_name.trim() ||
      form.contact_last_name.trim() ||
      form.contact_phone.trim()
    );

  function update(
    field: keyof FormData,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  function toggleVisibility(
    field: keyof Visibility
  ) {
    setVisibility(
      (current) => ({
        ...current,
        [field]:
          !current[field],
      })
    );
  }

  function resetMessages() {
    setError("");
    setNotice("");
  }

  function goTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetRegistration() {
    setForm(initialForm);
    setVisibility(
      initialVisibility
    );
    setTermsAccepted(false);
    setError("");
    setNotice("");
    setCreatedTag("");
  }

  function startSelf() {
    resetRegistration();

    setForm({
      ...initialForm,
      register_for: "self",
    });

    setScreen("self");
    goTop();
  }

  function startOther() {
    resetRegistration();

    setForm({
      ...initialForm,
      register_for: "other",
    });

    setScreen("manager");
    goTop();
  }

  function goHome() {
    resetRegistration();

    setManagedRow(null);
    setManagerVerified(false);
    setManageTag("");
    setVerifyCodewordInput("");
    setEmailOtp("");
    setOtpSent(false);
    setIdentityEditUnlocked(false);
    setScreen("choice");

    goTop();
  }

  function validateManager() {
    if (
      !form.manager_first_name.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ მმართველის სახელი."
          : "Enter the manager's first name."
      );
      return false;
    }

    if (
      !form.manager_last_name.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ მმართველის გვარი."
          : "Enter the manager's last name."
      );
      return false;
    }

    if (
      !form.manager_phone.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ მმართველის მობილურის ნომერი."
          : "Enter the manager's mobile number."
      );
      return false;
    }

    if (
      !form.manager_email.trim()
    ) {
      setError(
        ka
          ? "შეიყვანეთ მმართველის ელფოსტა."
          : "Enter the manager's email."
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
          ? "შეიყვანეთ მმართველის მისამართი."
          : "Enter the manager's address."
      );
      return false;
    }

    if (
      form.register_for ===
        "other" &&
      !form.manager_relationship
    ) {
      setError(
        ka
          ? "მიუთითეთ, ვინ ხართ სამაჯურის მფლობელისთვის."
          : "Select your relationship to the bracelet wearer."
      );
      return false;
    }

    if (
      form.codeword.length < 6
    ) {
      setError(
        ka
          ? "კოდური სიტყვა უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს."
          : "Codeword must contain at least 6 characters."
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
          : "Codewords do not match."
      );
      return false;
    }

    return true;
  }

  function validateWearer() {
    if (!form.tag_code.trim()) {
      setError(
        ka
          ? "QR კოდი სავალდებულოა."
          : "QR code is required."
      );
      return false;
    }

    if (!form.first_name.trim()) {
      setError(
        ka
          ? "სამაჯურის მფლობელის სახელი სავალდებულოა."
          : "Wearer's first name is required."
      );
      return false;
    }

    if (!form.last_name.trim()) {
      setError(
        ka
          ? "სამაჯურის მფლობელის გვარი სავალდებულოა."
          : "Wearer's last name is required."
      );
      return false;
    }

    if (!form.date_of_birth) {
      setError(
        ka
          ? "დაბადების სრული თარიღი სავალდებულოა."
          : "Date of birth is required."
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
          ? "პირადი/საიდენტიფიკაციო ნომერი სავალდებულოა."
          : "Personal identification number is required."
      );
      return false;
    }

    if (
      form.contact_mobile_enabled &&
      !form.contact_phone.trim()
    ) {
      setError(
        ka
          ? "მობილური ზარის ჩასართავად მიუთითეთ საკონტაქტო პირის ნომერი."
          : "Enter a contact phone number to enable mobile calling."
      );
      return false;
    }

    if (
      form.contact_whatsapp_enabled &&
      !form.contact_phone.trim()
    ) {
      setError(
        ka
          ? "WhatsApp-ის ჩასართავად მიუთითეთ საკონტაქტო პირის ნომერი."
          : "Enter a contact phone number to enable WhatsApp."
      );
      return false;
    }

    return true;
  }

  function selfToTerms() {
    resetMessages();

    if (!validateManager()) {
      return;
    }

    if (!validateWearer()) {
      return;
    }

    setScreen("terms");
    goTop();
  }

  function managerToWearer() {
    resetMessages();

    if (!validateManager()) {
      return;
    }

    setScreen("wearer");
    goTop();
  }

  function wearerToTerms() {
    resetMessages();

    if (!validateWearer()) {
      return;
    }

    setScreen("terms");
    goTop();
  }

  async function saveNewProfile(
    existingHash?: string
  ) {
    if (!termsAccepted &&
        screen === "terms") {
      setError(
        ka
          ? "პროფილის შესაქმნელად უნდა დაეთანხმოთ წესებს."
          : "You must accept the terms."
      );
      return;
    }

    if (!validateWearer()) {
      return;
    }

    setSaving(true);
    resetMessages();

    try {
      const tag =
        normalizeTag(
          form.tag_code
        );

      const {
        data: existingTag,
        error: tagError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .select("tag_code")
        .eq("tag_code", tag)
        .maybeSingle();

      if (tagError) {
        setError(
          ka
            ? `QR კოდის შემოწმება ვერ მოხერხდა: ${tagError.message}`
            : `QR check failed: ${tagError.message}`
        );
        return;
      }

      if (existingTag) {
        setError(
          ka
            ? "ეს QR კოდი უკვე რეგისტრირებულია. ერთი QR მხოლოდ ერთ ადამიანს ეკუთვნის."
            : "This QR code is already registered. One QR can belong to only one person."
        );
        return;
      }

      let codewordHash =
        existingHash || null;

      if (!codewordHash) {
        if (!validateManager()) {
          return;
        }

        codewordHash =
          await createCodewordHash(
            form.codeword
          );
      }

      const contactName = [
        form.contact_first_name.trim(),
        form.contact_last_name.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const payload = {
        /*
         * PROFILE MANAGER — PRIVATE UI DATA
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

        manager_relationship:
          form.manager_relationship ||
          null,

        codeword_hash:
          codewordHash,

        /*
         * BRACELET WEARER
         */

        tag_code: tag,

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

        medical_conditions:
          form.chronic_conditions.trim() ||
          null,

        additional_info:
          form.additional_info.trim() ||
          null,

        /*
         * VISIBILITY
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

        show_medical_conditions:
          Boolean(
            form.chronic_conditions.trim()
          ) &&
          visibility.show_chronic_conditions,

        show_additional_info:
          Boolean(
            form.additional_info.trim()
          ) &&
          visibility.show_additional_info,

        /*
         * CONTACT PERSON
         */

        emergency_contact_enabled:
          contactExists,

        emergency_contact_name:
          contactExists
            ? contactName || null
            : null,

        emergency_contact_relationship:
          contactExists
            ? form.contact_relationship ||
              null
            : null,

        emergency_contact_phone:
          contactExists
            ? form.contact_phone.trim() ||
              null
            : null,

        show_emergency_contact:
          contactExists
            ? visibility.show_contact
            : false,

        emergency_contact_mobile_enabled:
          contactExists
            ? form.contact_mobile_enabled
            : false,

        emergency_contact_whatsapp_enabled:
          contactExists
            ? form.contact_whatsapp_enabled
            : false,

        emergency_contact_live_chat_enabled:
          contactExists
            ? form.contact_live_chat_enabled
            : false,

        /*
         * NAME EDIT
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

        active: true,
      };

      const {
        error: saveError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .insert(payload);

      if (saveError) {
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

      setCreatedTag(tag);
      setScreen("success");
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

  /*
   * ========================================================
   * PROFILE MANAGEMENT
   * ========================================================
   */

  async function findProfile() {
    resetMessages();

    const tag =
      normalizeTag(manageTag);

    if (!tag) {
      setError(
        ka
          ? "შეიყვანეთ QR კოდი."
          : "Enter the QR code."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data,
        error: findError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .select(`
          tag_code,
          first_name,
          last_name,
          date_of_birth,
          country_code,
          personal_number,
          address,
          medical_conditions,
          additional_info,
          show_date_of_birth,
          show_personal_number,
          show_address,
          show_medical_conditions,
          show_additional_info,
          emergency_contact_enabled,
          emergency_contact_name,
          emergency_contact_relationship,
          emergency_contact_phone,
          show_emergency_contact,
          emergency_contact_mobile_enabled,
          emergency_contact_whatsapp_enabled,
          emergency_contact_live_chat_enabled,
          owner_email,
          owner_phone,
          manager_first_name,
          manager_last_name,
          manager_address,
          manager_relationship,
          codeword_hash,
          identity_edit_used
        `)
        .eq("tag_code", tag)
        .maybeSingle();

      if (findError) {
        setError(
          ka
            ? `პროფილის მოძებნა ვერ მოხერხდა: ${findError.message}`
            : `Could not find profile: ${findError.message}`
        );
        return;
      }

      if (!data) {
        setError(
          ka
            ? "ამ QR კოდით Emergency პროფილი ვერ მოიძებნა."
            : "No Emergency profile was found for this QR code."
        );
        return;
      }

      setManagedRow(
        data as ManagedRow
      );

      setVerifyCodewordInput("");
      setEmailOtp("");
      setOtpSent(false);
      setVerifyMethod("codeword");
      setScreen("manage-verify");
      goTop();
    } finally {
      setSaving(false);
    }
  }

  async function verifyWithCodeword() {
    resetMessages();

    if (
      !managedRow?.codeword_hash
    ) {
      setError(
        ka
          ? "ამ პროფილის კოდური სიტყვა ვერ მოიძებნა."
          : "No codeword was found for this profile."
      );
      return;
    }

    if (
      !verifyCodewordInput
    ) {
      setError(
        ka
          ? "შეიყვანეთ კოდური სიტყვა."
          : "Enter the codeword."
      );
      return;
    }

    setSaving(true);

    try {
      const ok =
        await verifyCodeword(
          verifyCodewordInput,
          managedRow.codeword_hash
        );

      if (!ok) {
        setError(
          ka
            ? "კოდური სიტყვა არასწორია."
            : "Incorrect codeword."
        );
        return;
      }

      await openManageEditor();
    } finally {
      setSaving(false);
    }
  }

  async function sendEmailCode() {
    resetMessages();

    const email =
      managedRow?.owner_email;

    if (!email) {
      setError(
        ka
          ? "პროფილზე მმართველის ელფოსტა არ არის მითითებული."
          : "No manager email is registered for this profile."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        error: otpError,
      } =
        await supabase.auth
          .signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
            },
          });

      if (otpError) {
        setError(
          ka
            ? `კოდის გაგზავნა ვერ მოხერხდა: ${otpError.message}`
            : `Could not send code: ${otpError.message}`
        );
        return;
      }

      setOtpSent(true);

      setNotice(
        ka
          ? `დადასტურების კოდი გაიგზავნა ელფოსტაზე ${email}.`
          : `A verification code was sent to ${email}.`
      );
    } finally {
      setSaving(false);
    }
  }

  async function verifyEmailCode() {
    resetMessages();

    const email =
      managedRow?.owner_email;

    if (!email) {
      setError(
        ka
          ? "ელფოსტა ვერ მოიძებნა."
          : "Email not found."
      );
      return;
    }

    if (!emailOtp.trim()) {
      setError(
        ka
          ? "შეიყვანეთ ელფოსტაზე მიღებული კოდი."
          : "Enter the code received by email."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        error: otpError,
      } =
        await supabase.auth
          .verifyOtp({
            email,
            token: emailOtp.trim(),
            type: "email",
          });

      if (otpError) {
        setError(
          ka
            ? `კოდი არასწორია ან ვადა გაუვიდა: ${otpError.message}`
            : `The code is invalid or expired: ${otpError.message}`
        );
        return;
      }

      await openManageEditor();
    } finally {
      setSaving(false);
    }
  }

  async function openManageEditor() {
    if (!managedRow) {
      return;
    }

    const contact =
      splitName(
        managedRow
          .emergency_contact_name
      );

    setManagerVerified(true);

    setOriginalFirstName(
      managedRow.first_name
    );

    setOriginalLastName(
      managedRow.last_name
    );

    setManagerHashForAdditional(
      managedRow.codeword_hash
    );

    setForm({
      ...initialForm,

      register_for: "other",

      manager_first_name:
        managedRow
          .manager_first_name ||
        "",

      manager_last_name:
        managedRow
          .manager_last_name ||
        "",

      manager_phone:
        managedRow.owner_phone ||
        "",

      manager_email:
        managedRow.owner_email ||
        "",

      manager_address:
        managedRow
          .manager_address ||
        "",

      manager_relationship:
        managedRow
          .manager_relationship ||
        "",

      tag_code:
        managedRow.tag_code,

      first_name:
        managedRow.first_name,

      last_name:
        managedRow.last_name,

      date_of_birth:
        managedRow
          .date_of_birth ||
        "",

      country_code:
        managedRow
          .country_code ||
        "",

      personal_number:
        managedRow
          .personal_number ||
        "",

      address:
        managedRow.address ||
        "",

      chronic_conditions:
        managedRow
          .medical_conditions ||
        "",

      additional_info:
        managedRow
          .additional_info ||
        "",

      contact_first_name:
        contact.first,

      contact_last_name:
        contact.last,

      contact_relationship:
        managedRow
          .emergency_contact_relationship ||
        "",

      contact_phone:
        managedRow
          .emergency_contact_phone ||
        "",

      contact_mobile_enabled:
        Boolean(
          managedRow
            .emergency_contact_mobile_enabled
        ),

      contact_whatsapp_enabled:
        Boolean(
          managedRow
            .emergency_contact_whatsapp_enabled
        ),

      contact_live_chat_enabled:
        Boolean(
          managedRow
            .emergency_contact_live_chat_enabled
        ),
    });

    setVisibility({
      show_date_of_birth:
        Boolean(
          managedRow
            .show_date_of_birth
        ),

      show_personal_number:
        Boolean(
          managedRow
            .show_personal_number
        ),

      show_address:
        Boolean(
          managedRow
            .show_address
        ),

      show_chronic_conditions:
        Boolean(
          managedRow
            .show_medical_conditions
        ),

      show_additional_info:
        Boolean(
          managedRow
            .show_additional_info
        ),

      show_contact:
        Boolean(
          managedRow
            .show_emergency_contact
        ),
    });

    setIdentityEditUnlocked(
      false
    );

    const {
      count,
    } = await supabase
      .from(
        "emergency_profiles"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "owner_email",
        managedRow.owner_email
      );

    setProfileCount(
      count || 0
    );

    setScreen("manage-edit");
    goTop();
  }

  async function saveProfileEdit() {
    if (
      !managedRow ||
      !managerVerified
    ) {
      return;
    }

    resetMessages();

    if (!validateWearer()) {
      return;
    }

    const firstChanged =
      form.first_name.trim() !==
      originalFirstName.trim();

    const lastChanged =
      form.last_name.trim() !==
      originalLastName.trim();

    const nameChanged =
      firstChanged ||
      lastChanged;

    if (
      nameChanged &&
      managedRow.identity_edit_used
    ) {
      setError(
        ka
          ? "სახელის/გვარის ერთჯერადი ცვლილების უფლება უკვე გამოყენებულია."
          : "The one-time name correction has already been used."
      );
      return;
    }

    if (
      nameChanged &&
      !identityEditUnlocked
    ) {
      setError(
        ka
          ? "სახელის ან გვარის შესაცვლელად ჯერ დააჭირეთ „სახელის/გვარის ერთჯერადი ცვლილება“."
          : "Use the one-time name correction option before changing the name."
      );
      return;
    }

    setSaving(true);

    try {
      const contactName = [
        form.contact_first_name.trim(),
        form.contact_last_name.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const updatePayload = {
        /*
         * QR კოდი შეგნებულად საერთოდ არ იგზავნება UPDATE-ში.
         */

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

        medical_conditions:
          form.chronic_conditions.trim() ||
          null,

        additional_info:
          form.additional_info.trim() ||
          null,

        show_date_of_birth:
          visibility.show_date_of_birth,

        show_personal_number:
          visibility.show_personal_number,

        show_address:
          Boolean(
            form.address.trim()
          ) &&
          visibility.show_address,

        show_medical_conditions:
          Boolean(
            form.chronic_conditions.trim()
          ) &&
          visibility.show_chronic_conditions,

        show_additional_info:
          Boolean(
            form.additional_info.trim()
          ) &&
          visibility.show_additional_info,

        emergency_contact_enabled:
          contactExists,

        emergency_contact_name:
          contactExists
            ? contactName || null
            : null,

        emergency_contact_relationship:
          contactExists
            ? form.contact_relationship ||
              null
            : null,

        emergency_contact_phone:
          contactExists
            ? form.contact_phone.trim() ||
              null
            : null,

        show_emergency_contact:
          contactExists
            ? visibility.show_contact
            : false,

        emergency_contact_mobile_enabled:
          contactExists
            ? form.contact_mobile_enabled
            : false,

        emergency_contact_whatsapp_enabled:
          contactExists
            ? form.contact_whatsapp_enabled
            : false,

        emergency_contact_live_chat_enabled:
          contactExists
            ? form.contact_live_chat_enabled
            : false,

        ...(nameChanged
          ? {
              identity_edit_used:
                true,
              identity_updated_at:
                new Date().toISOString(),
            }
          : {}),
      };

      const {
        error: updateError,
      } = await supabase
        .from(
          "emergency_profiles"
        )
        .update(updatePayload)
        .eq(
          "tag_code",
          managedRow.tag_code
        );

      if (updateError) {
        setError(
          ka
            ? `პროფილის განახლება ვერ მოხერხდა: ${updateError.message}`
            : `Could not update profile: ${updateError.message}`
        );
        return;
      }

      setNotice(
        ka
          ? "პროფილი წარმატებით განახლდა."
          : "Profile updated successfully."
      );

      if (nameChanged) {
        setManagedRow({
          ...managedRow,
          first_name:
            form.first_name.trim(),
          last_name:
            form.last_name.trim(),
          identity_edit_used:
            true,
        });

        setOriginalFirstName(
          form.first_name.trim()
        );

        setOriginalLastName(
          form.last_name.trim()
        );

        setIdentityEditUnlocked(
          false
        );
      }
    } finally {
      setSaving(false);
    }
  }

  function startAdditionalProfile() {
    resetMessages();

    if (!managedRow) {
      return;
    }

    if (profileCount >= 3) {
      setError(
        ka
          ? "ამ მმართველზე უკვე რეგისტრირებულია მაქსიმალური რაოდენობა — 3 Emergency პროფილი."
          : "This manager already has the maximum of 3 Emergency profiles."
      );
      return;
    }

    setForm({
      ...initialForm,

      register_for: "other",

      manager_first_name:
        managedRow
          .manager_first_name ||
        "",

      manager_last_name:
        managedRow
          .manager_last_name ||
        "",

      manager_phone:
        managedRow.owner_phone ||
        "",

      manager_email:
        managedRow.owner_email ||
        "",

      manager_address:
        managedRow
          .manager_address ||
        "",

      /*
       * ახალი ადამიანის მიმართ კავშირი თავიდან უნდა აირჩიოს.
       */
      manager_relationship: "",
    });

    setVisibility(
      initialVisibility
    );

    setScreen("additional");
    goTop();
  }

  async function saveAdditionalProfile() {
    resetMessages();

    if (!managedRow) {
      return;
    }

    if (!managerHashForAdditional) {
      setError(
        ka
          ? "მმართველის დაცული მონაცემები ვერ მოიძებნა."
          : "Manager verification data was not found."
      );
      return;
    }

    if (
      !form.manager_relationship
    ) {
      setError(
        ka
          ? "მიუთითეთ თქვენი კავშირი ახალ პირთან."
          : "Select your relationship to the new person."
      );
      return;
    }

    if (!validateWearer()) {
      return;
    }

    const {
      count,
    } = await supabase
      .from(
        "emergency_profiles"
      )
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "owner_email",
        managedRow.owner_email
      );

    if ((count || 0) >= 3) {
      setError(
        ka
          ? "დამატებითი პროფილის შექმნა აღარ შეიძლება. ერთ მმართველს მაქსიმუმ 3 Emergency პროფილი შეუძლია."
          : "No more profiles can be added. One manager may manage up to 3 Emergency profiles."
      );
      return;
    }

    await saveNewProfile(
      managerHashForAdditional
    );
  }

  /*
   * ========================================================
   * PUBLIC UI
   * ========================================================
   */

  return (
    <main className="page">
      <Header
        lang={lang}
        setLang={setLang}
        onHome={goHome}
      />

      <section className="container">
        {screen !== "success" && (
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
                  ? "Emergency სამაჯური"
                  : "Emergency Bracelet"}
              </h1>

              <p>
                {ka
                  ? "ერთი QR კოდი — ერთი კონკრეტული ადამიანი."
                  : "One QR code — one specific person."}
              </p>
            </div>
          </div>
        )}

        {screen === "choice" && (
          <ChoiceScreen
            ka={ka}
            onSelf={startSelf}
            onOther={startOther}
            onManage={() => {
              resetMessages();
              setScreen(
                "manage-find"
              );
              goTop();
            }}
          />
        )}

        {screen === "self" && (
          <div className="card">
            <SectionTitle
              number="01"
              title={
                ka
                  ? "საკუთარი Emergency პროფილი"
                  : "Your Emergency profile"
              }
              description={
                ka
                  ? "ცალკე მმართველის ფორმა არ გჭირდება — თქვენ თვითონ ხართ ანგარიშის მმართველიც და სამაჯურის მფლობელიც."
                  : "No separate manager form is needed — you are both the account manager and the bracelet wearer."
              }
            />

            <InfoBox>
              <strong>
                {ka
                  ? "ანგარიშის ინფორმაცია"
                  : "Account information"}
              </strong>

              <p>
                {ka
                  ? "ელფოსტა, ტელეფონი და კოდური სიტყვა საჯარო QR პროფილზე არ გამოჩნდება."
                  : "Email, phone and codeword will not appear on the public QR profile."}
              </p>
            </InfoBox>

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
                onChange={(v) => {
                  update(
                    "first_name",
                    v
                  );
                  update(
                    "manager_first_name",
                    v
                  );
                }}
                note={
                  ka
                    ? "სავალდებულო • QR პროფილზე ყოველთვის გამოჩნდება"
                    : "Required • Always visible"
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
                onChange={(v) => {
                  update(
                    "last_name",
                    v
                  );
                  update(
                    "manager_last_name",
                    v
                  );
                }}
                note={
                  ka
                    ? "სავალდებულო • QR პროფილზე ყოველთვის გამოჩნდება"
                    : "Required • Always visible"
                }
              />
            </div>

            <RequiredField
              label={
                ka
                  ? "მობილურის ნომერი"
                  : "Mobile number"
              }
              type="tel"
              value={
                form.manager_phone
              }
              onChange={(v) =>
                update(
                  "manager_phone",
                  v
                )
              }
            />

            <RequiredField
              label={
                ka
                  ? "ელფოსტა"
                  : "Email"
              }
              type="email"
              value={
                form.manager_email
              }
              onChange={(v) =>
                update(
                  "manager_email",
                  v
                )
              }
            />

            <RequiredField
              label={
                ka
                  ? "მისამართი"
                  : "Address"
              }
              value={
                form.manager_address
              }
              onChange={(v) => {
                update(
                  "manager_address",
                  v
                );
                update(
                  "address",
                  v
                );
              }}
            />

            <div className="grid2">
              <RequiredField
                label={
                  ka
                    ? "კოდური სიტყვა"
                    : "Codeword"
                }
                type="password"
                value={
                  form.codeword
                }
                onChange={(v) =>
                  update(
                    "codeword",
                    v
                  )
                }
              />

              <RequiredField
                label={
                  ka
                    ? "გაიმეორეთ კოდური სიტყვა"
                    : "Repeat codeword"
                }
                type="password"
                value={
                  form.codeword_confirm
                }
                onChange={(v) =>
                  update(
                    "codeword_confirm",
                    v
                  )
                }
              />
            </div>

            <WearerFields
              ka={ka}
              lang={lang}
              form={form}
              update={update}
              visibility={visibility}
              toggleVisibility={
                toggleVisibility
              }
              selectedCountry={
                selectedCountry
              }
              hideNameFields
            />

            {error && (
              <ErrorBox text={error} />
            )}

            <div className="buttons">
              <button
                type="button"
                className="backButton"
                onClick={goHome}
              >
                ←{" "}
                {ka
                  ? "უკან"
                  : "Back"}
              </button>

              <button
                type="button"
                className="primaryButton"
                onClick={selfToTerms}
              >
                {ka
                  ? "შემდეგი"
                  : "Next"}{" "}
                →
              </button>
            </div>
          </div>
        )}

        {screen === "manager" && (
          <div className="card">
            <SectionTitle
              number="01"
              title={
                ka
                  ? "ანგარიშის მმართველი"
                  : "Account manager"
              }
              description={
                ka
                  ? "ეს არის ადამიანი, ვინც სხვის Emergency პროფილს ქმნის და შემდგომ მართავს."
                  : "This is the person creating and managing another person's Emergency profile."
              }
            />

            <InfoBox>
              <strong>
                {ka
                  ? "ეს ინფორმაცია საჯაროდ არ გამოჩნდება"
                  : "This information stays private"}
              </strong>

              <p>
                {ka
                  ? "მმართველის მონაცემები გამოიყენება მხოლოდ პროფილის მართვისა და რედაქტირების დასადასტურებლად."
                  : "Manager information is used only to manage and verify profile edits."}
              </p>
            </InfoBox>

            <div className="grid2">
              <RequiredField
                label={
                  ka
                    ? "სახელი"
                    : "First name"
                }
                value={
                  form.manager_first_name
                }
                onChange={(v) =>
                  update(
                    "manager_first_name",
                    v
                  )
                }
              />

              <RequiredField
                label={
                  ka
                    ? "გვარი"
                    : "Last name"
                }
                value={
                  form.manager_last_name
                }
                onChange={(v) =>
                  update(
                    "manager_last_name",
                    v
                  )
                }
              />
            </div>

            <RequiredField
              label={
                ka
                  ? "მობილურის ნომერი"
                  : "Mobile number"
              }
              type="tel"
              value={
                form.manager_phone
              }
              onChange={(v) =>
                update(
                  "manager_phone",
                  v
                )
              }
            />

            <RequiredField
              label={
                ka
                  ? "ელფოსტა"
                  : "Email"
              }
              type="email"
              value={
                form.manager_email
              }
              onChange={(v) =>
                update(
                  "manager_email",
                  v
                )
              }
            />

            <RequiredField
              label={
                ka
                  ? "მისამართი"
                  : "Address"
              }
              value={
                form.manager_address
              }
              onChange={(v) =>
                update(
                  "manager_address",
                  v
                )
              }
            />

            <SelectField
              label={
                ka
                  ? "ვინ ხართ სამაჯურის მფლობელისთვის?"
                  : "What is your relationship to the wearer?"
              }
              value={
                form.manager_relationship
              }
              onChange={(v) =>
                update(
                  "manager_relationship",
                  v
                )
              }
              options={
                relationshipOptions[
                  lang
                ]
              }
              required
            />

            <div className="grid2">
              <RequiredField
                label={
                  ka
                    ? "კოდური სიტყვა"
                    : "Codeword"
                }
                type="password"
                value={
                  form.codeword
                }
                onChange={(v) =>
                  update(
                    "codeword",
                    v
                  )
                }
              />

              <RequiredField
                label={
                  ka
                    ? "გაიმეორეთ კოდური სიტყვა"
                    : "Repeat codeword"
                }
                type="password"
                value={
                  form.codeword_confirm
                }
                onChange={(v) =>
                  update(
                    "codeword_confirm",
                    v
                  )
                }
              />
            </div>

            {error && (
              <ErrorBox text={error} />
            )}

            <div className="buttons">
              <button
                type="button"
                className="backButton"
                onClick={goHome}
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
                  managerToWearer
                }
              >
                {ka
                  ? "შემდეგი"
                  : "Next"}{" "}
                →
              </button>
            </div>
          </div>
        )}

        {screen === "wearer" && (
          <div className="card">
            <SectionTitle
              number="02"
              title={
                ka
                  ? "სამაჯურის მფლობელი"
                  : "Bracelet wearer"
              }
              description={
                ka
                  ? "ახლა შეიყვანეთ იმ ადამიანის მონაცემები, ვინც რეალურად ატარებს Emergency სამაჯურს."
                  : "Now enter the details of the person who will actually wear the Emergency bracelet."
              }
            />

            <WearerFields
              ka={ka}
              lang={lang}
              form={form}
              update={update}
              visibility={visibility}
              toggleVisibility={
                toggleVisibility
              }
              selectedCountry={
                selectedCountry
              }
            />

            {error && (
              <ErrorBox text={error} />
            )}

            <div className="buttons">
              <button
                type="button"
                className="backButton"
                onClick={() => {
                  setScreen(
                    "manager"
                  );
                  goTop();
                }}
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
                  wearerToTerms
                }
              >
                {ka
                  ? "შემდეგი"
                  : "Next"}{" "}
                →
              </button>
            </div>
          </div>
        )}

        {screen === "terms" && (
          <div className="card">
            <SectionTitle
              number="03"
              title={
                ka
                  ? "წესები და თანხმობა"
                  : "Terms and consent"
              }
              description={
                ka
                  ? "პროფილის შექმნამდე გაეცანით ძირითად წესებს."
                  : "Review the main rules before creating the profile."
              }
            />

            <Terms ka={ka} />

            <label className="termsConsent">
              <input
                type="checkbox"
                checked={
                  termsAccepted
                }
                onChange={(e) =>
                  setTermsAccepted(
                    e.target.checked
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
                    : "I agree to the QR RETURN Emergency terms and privacy conditions."}
                </p>
              </div>
            </label>

            {error && (
              <ErrorBox text={error} />
            )}

            <div className="buttons">
              <button
                type="button"
                className="backButton"
                onClick={() => {
                  setScreen(
                    form.register_for ===
                      "self"
                      ? "self"
                      : "wearer"
                  );
                  goTop();
                }}
              >
                ←{" "}
                {ka
                  ? "უკან"
                  : "Back"}
              </button>

              <button
                type="button"
                className="saveButton"
                disabled={
                  saving ||
                  !termsAccepted
                }
                onClick={() =>
                  void saveNewProfile()
                }
              >
                {saving
                  ? ka
                    ? "ინახება..."
                    : "Saving..."
                  : ka
                  ? "ვეთანხმები და ვქმნი პროფილს"
                  : "Agree and create profile"}
              </button>
            </div>
          </div>
        )}

        {screen === "success" && (
          <div className="successPage">
            <div className="successIcon">
              ✓
            </div>

            <div className="eyebrow">
              QR RETURN • EMERGENCY ID
            </div>

            <h1>
              {ka
                ? "პროფილი წარმატებით შეიქმნა"
                : "Profile created successfully"}
            </h1>

            <p>
              {ka
                ? `${form.first_name} ${form.last_name}-ის Emergency პროფილი შენახულია.`
                : `${form.first_name} ${form.last_name}'s Emergency profile has been saved.`}
            </p>

            <div className="successButtons">
              <button
                type="button"
                className="manageMainButton"
                onClick={() => {
                  setManageTag(
                    createdTag
                  );
                  setScreen(
                    "manage-find"
                  );
                  goTop();
                }}
              >
                {ka
                  ? "პროფილის მართვა"
                  : "Manage profile"}
              </button>

              <button
                type="button"
                className="homeButton"
                onClick={goHome}
              >
                {ka
                  ? "მთავარ გვერდზე"
                  : "Home"}
              </button>
            </div>

            <InfoBox>
              <strong>
                🔒{" "}
                {ka
                  ? "ერთი QR — ერთი ადამიანი"
                  : "One QR — one person"}
              </strong>

              <p>
                {ka
                  ? "პროფილის მმართველს შემდგომ შეუძლია მაქსიმუმ კიდევ ორი ადამიანის დამატება, მაგრამ თითოეულს თავისი უნიკალური QR კოდი სჭირდება."
                  : "The manager may later add up to two additional people, but each person needs their own unique QR code."}
              </p>
            </InfoBox>
          </div>
        )}

        {screen === "manage-find" && (
          <div className="card">
            <SectionTitle
              number="01"
              title={
                ka
                  ? "პროფილის მართვა"
                  : "Manage profile"
              }
              description={
                ka
                  ? "შეიყვანეთ იმ Emergency პროფილის QR კოდი, რომლის რედაქტირებაც გსურთ."
                  : "Enter the QR code of the Emergency profile you want to manage."
              }
            />

            <RequiredField
              label={
                ka
                  ? "QR კოდი"
                  : "QR code"
              }
              value={manageTag}
              onChange={
                setManageTag
              }
            />

            {error && (
              <ErrorBox text={error} />
            )}

            <div className="buttons">
              <button
                type="button"
                className="backButton"
                onClick={goHome}
              >
                ←{" "}
                {ka
                  ? "უკან"
                  : "Back"}
              </button>

              <button
                type="button"
                className="primaryButton"
                disabled={saving}
                onClick={() =>
                  void findProfile()
                }
              >
                {saving
                  ? ka
                    ? "იძებნება..."
                    : "Searching..."
                  : ka
                  ? "პროფილის მოძებნა"
                  : "Find profile"}
              </button>
            </div>
          </div>
        )}

        {screen ===
          "manage-verify" &&
          managedRow && (
            <div className="card">
              <SectionTitle
                number="02"
                title={
                  ka
                    ? "დაადასტურეთ პროფილის მართვის უფლება"
                    : "Verify profile management"
                }
                description={`${managedRow.first_name} ${managedRow.last_name} • ${managedRow.tag_code}`}
              />

              <div className="verifyChoices">
                <button
                  type="button"
                  className={
                    verifyMethod ===
                    "codeword"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setVerifyMethod(
                      "codeword"
                    )
                  }
                >
                  <span>🔐</span>
                  <strong>
                    {ka
                      ? "კოდური სიტყვა"
                      : "Codeword"}
                  </strong>
                </button>

                <button
                  type="button"
                  className={
                    verifyMethod ===
                    "email"
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    setVerifyMethod(
                      "email"
                    )
                  }
                >
                  <span>✉️</span>
                  <strong>
                    {ka
                      ? "ელფოსტის კოდი"
                      : "Email code"}
                  </strong>
                </button>
              </div>

              {verifyMethod ===
                "codeword" && (
                <>
                  <RequiredField
                    label={
                      ka
                        ? "კოდური სიტყვა"
                        : "Codeword"
                    }
                    type="password"
                    value={
                      verifyCodewordInput
                    }
                    onChange={
                      setVerifyCodewordInput
                    }
                  />

                  <button
                    type="button"
                    className="primaryButton full"
                    disabled={saving}
                    onClick={() =>
                      void verifyWithCodeword()
                    }
                  >
                    {ka
                      ? "დადასტურება"
                      : "Verify"}
                  </button>
                </>
              )}

              {verifyMethod ===
                "email" && (
                <>
                  <InfoBox>
                    <strong>
                      {ka
                        ? "დადასტურება ელფოსტით"
                        : "Verify by email"}
                    </strong>

                    <p>
                      {ka
                        ? `კოდი გაიგზავნება რეგისტრირებულ ელფოსტაზე: ${managedRow.owner_email || "—"}`
                        : `A code will be sent to: ${managedRow.owner_email || "—"}`}
                    </p>
                  </InfoBox>

                  {!otpSent && (
                    <button
                      type="button"
                      className="primaryButton full"
                      disabled={saving}
                      onClick={() =>
                        void sendEmailCode()
                      }
                    >
                      {ka
                        ? "კოდის გაგზავნა"
                        : "Send code"}
                    </button>
                  )}

                  {otpSent && (
                    <>
                      <RequiredField
                        label={
                          ka
                            ? "ელფოსტაზე მიღებული კოდი"
                            : "Email verification code"
                        }
                        value={emailOtp}
                        onChange={
                          setEmailOtp
                        }
                      />

                      <button
                        type="button"
                        className="primaryButton full"
                        disabled={saving}
                        onClick={() =>
                          void verifyEmailCode()
                        }
                      >
                        {ka
                          ? "კოდის დადასტურება"
                          : "Verify code"}
                      </button>
                    </>
                  )}
                </>
              )}

              {notice && (
                <NoticeBox
                  text={notice}
                />
              )}

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <button
                type="button"
                className="textButton"
                onClick={() => {
                  setScreen(
                    "manage-find"
                  );
                  resetMessages();
                }}
              >
                ←{" "}
                {ka
                  ? "სხვა QR კოდის შეყვანა"
                  : "Use another QR code"}
              </button>
            </div>
          )}

        {screen ===
          "manage-edit" &&
          managedRow && (
            <div className="card">
              <SectionTitle
                number="03"
                title={
                  ka
                    ? "Emergency პროფილის რედაქტირება"
                    : "Edit Emergency profile"
                }
                description={`${managedRow.tag_code} • ${profileCount}/3 ${
                  ka
                    ? "პროფილი ამ მმართველზე"
                    : "profiles for this manager"
                }`}
              />

              <div className="lockedQr">
                <strong>
                  🔒 QR CODE
                </strong>

                <span>
                  {
                    managedRow.tag_code
                  }
                </span>

                <p>
                  {ka
                    ? "QR კოდი რეგისტრაციის შემდეგ აღარ იცვლება."
                    : "The QR code cannot be changed after registration."}
                </p>
              </div>

              <div className="identityCard">
                <div className="identityHeader">
                  <div>
                    <strong>
                      {ka
                        ? "სახელი და გვარი"
                        : "First and last name"}
                    </strong>

                    <span>
                      {managedRow.identity_edit_used
                        ? ka
                          ? "ერთჯერადი ცვლილება უკვე გამოყენებულია"
                          : "One-time correction already used"
                        : ka
                        ? "ერთჯერადი ცვლილება ხელმისაწვდომია"
                        : "One-time correction available"}
                    </span>
                  </div>

                  {!managedRow.identity_edit_used &&
                    !identityEditUnlocked && (
                      <button
                        type="button"
                        className="smallButton"
                        onClick={() =>
                          setIdentityEditUnlocked(
                            true
                          )
                        }
                      >
                        {ka
                          ? "შეცვლა ერთხელ"
                          : "Correct once"}
                      </button>
                    )}
                </div>

                <div className="grid2">
                  <LockedOrEditable
                    label={
                      ka
                        ? "სახელი"
                        : "First name"
                    }
                    value={
                      form.first_name
                    }
                    onChange={(v) =>
                      update(
                        "first_name",
                        v
                      )
                    }
                    editable={
                      identityEditUnlocked &&
                      !managedRow.identity_edit_used
                    }
                  />

                  <LockedOrEditable
                    label={
                      ka
                        ? "გვარი"
                        : "Last name"
                    }
                    value={
                      form.last_name
                    }
                    onChange={(v) =>
                      update(
                        "last_name",
                        v
                      )
                    }
                    editable={
                      identityEditUnlocked &&
                      !managedRow.identity_edit_used
                    }
                  />
                </div>

                {identityEditUnlocked &&
                  !managedRow.identity_edit_used && (
                    <p className="warningText">
                      {ka
                        ? "⚠️ ეს არის სახელისა და გვარის ერთადერთი ცვლილება ამ QR პროფილზე."
                        : "⚠️ This is the only name correction allowed for this QR profile."}
                    </p>
                  )}
              </div>

              <WearerFields
                ka={ka}
                lang={lang}
                form={form}
                update={update}
                visibility={visibility}
                toggleVisibility={
                  toggleVisibility
                }
                selectedCountry={
                  selectedCountry
                }
                hideQr
                hideNameFields
              />

              {notice && (
                <NoticeBox
                  text={notice}
                />
              )}

              {error && (
                <ErrorBox
                  text={error}
                />
              )}

              <div className="managementActions">
                <button
                  type="button"
                  className="saveButton"
                  disabled={saving}
                  onClick={() =>
                    void saveProfileEdit()
                  }
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "ცვლილებების შენახვა"
                    : "Save changes"}
                </button>

                <button
                  type="button"
                  className="addProfileButton"
                  onClick={
                    startAdditionalProfile
                  }
                >
                  +{" "}
                  {ka
                    ? "დამატებითი პროფილის რეგისტრაცია"
                    : "Register additional profile"}
                </button>
              </div>

              <div className="profileLimitBox">
                <strong>
                  {ka
                    ? `მმართველზე რეგისტრირებულია ${profileCount} / 3 პროფილი`
                    : `${profileCount} / 3 profiles registered`}
                </strong>

                <p>
                  {ka
                    ? "შეგიძლიათ დაამატოთ მაქსიმუმ ორი დამატებითი ადამიანი — მაგალითად მეუღლე, დედა, მამა ან შვილი. თითოეულს ახალი QR კოდი სჭირდება."
                    : "You may add up to two additional people, such as a spouse, parent or child. Each needs a new QR code."}
                </p>
              </div>

              <button
                type="button"
                className="textButton"
                onClick={goHome}
              >
                ←{" "}
                {ka
                  ? "დასრულება"
                  : "Finish"}
              </button>
            </div>
          )}

        {screen ===
          "additional" &&
          managedRow && (
            <div className="card">
              <SectionTitle
                number="04"
                title={
                  ka
                    ? "დამატებითი პროფილის რეგისტრაცია"
                    : "Register additional profile"
                }
                description={
                  ka
                    ? "მმართველის მონაცემები უკვე დადასტურებულია. შეიყვანეთ მხოლოდ ახალი ადამიანის ინფორმაცია."
                    : "The manager is already verified. Enter only the new person's information."
                }
              />

              <InfoBox>
                <strong>
                  {ka
                    ? "იგივე ანგარიშის მმართველი"
                    : "Same account manager"}
                </strong>

                <p>
                  {`${form.manager_first_name} ${form.manager_last_name} • ${form.manager_email}`}
                </p>
              </InfoBox>

              <SelectField
                label={
                  ka
                    ? "ვინ არის ეს ახალი პირი თქვენთვის?"
                    : "What is your relationship to this new person?"
                }
                value={
                  form.manager_relationship
                }
                onChange={(v) =>
                  update(
                    "manager_relationship",
                    v
                  )
                }
                options={
                  relationshipOptions[
                    lang
                  ]
                }
                required
              />

              <WearerFields
                ka={ka}
                lang={lang}
                form={form}
                update={update}
                visibility={visibility}
                toggleVisibility={
                  toggleVisibility
                }
                selectedCountry={
                  selectedCountry
                }
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
                  onClick={() => {
                    void openManageEditor();
                  }}
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="button"
                  className="saveButton"
                  disabled={saving}
                  onClick={() =>
                    void saveAdditionalProfile()
                  }
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "დამატებითი პროფილის შექმნა"
                    : "Create additional profile"}
                </button>
              </div>
            </div>
          )}
      </section>

      <Styles />
    </main>
  );
}

/*
 * ========================================================
 * REUSABLE UI
 * ========================================================
 */

function Header({
  lang,
  setLang,
  onHome,
}: {
  lang: Lang;
  setLang: (
    lang: Lang
  ) => void;
  onHome: () => void;
}) {
  return (
    <header className="header">
      <button
        type="button"
        className="brand"
        onClick={onHome}
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
      </button>

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

function ChoiceScreen({
  ka,
  onSelf,
  onOther,
  onManage,
}: {
  ka: boolean;
  onSelf: () => void;
  onOther: () => void;
  onManage: () => void;
}) {
  return (
    <div className="card choiceCard">
      <SectionTitle
        number="01"
        title={
          ka
            ? "ვისთვის ქმნით პროფილს?"
            : "Who is this profile for?"
        }
        description={
          ka
            ? "აირჩიეთ მხოლოდ ერთი ვარიანტი და შემდეგ გაიხსნება შესაბამისი რეგისტრაციის ფორმა."
            : "Choose one option and the appropriate registration form will open."
        }
      />

      <div className="bigChoices">
        <button
          type="button"
          className="bigChoice"
          onClick={onSelf}
        >
          <span>👤</span>

          <div>
            <strong>
              {ka
                ? "საკუთარი თავისთვის"
                : "For myself"}
            </strong>

            <small>
              {ka
                ? "თქვენ თვითონ ხართ პროფილის მმართველიც და სამაჯურის მფლობელიც."
                : "You are both the account manager and bracelet wearer."}
            </small>
          </div>
        </button>

        <button
          type="button"
          className="bigChoice"
          onClick={onOther}
        >
          <span>👥</span>

          <div>
            <strong>
              {ka
                ? "სხვა პირისთვის"
                : "For another person"}
            </strong>

            <small>
              {ka
                ? "მაგალითად: მეუღლე, მშობელი, შვილი ან სხვა ადამიანი."
                : "For example: spouse, parent, child or another person."}
            </small>
          </div>
        </button>
      </div>

      <div className="existingProfile">
        <span>
          {ka
            ? "უკვე გაქვთ Emergency პროფილი?"
            : "Already have an Emergency profile?"}
        </span>

        <button
          type="button"
          onClick={onManage}
        >
          {ka
            ? "პროფილის რედაქტირება / მართვა"
            : "Edit / manage profile"}
        </button>
      </div>
    </div>
  );
}

function WearerFields({
  ka,
  lang,
  form,
  update,
  visibility,
  toggleVisibility,
  selectedCountry,
  hideQr = false,
  hideNameFields = false,
}: {
  ka: boolean;
  lang: Lang;
  form: FormData;
  update: (
    field: keyof FormData,
    value: string | boolean
  ) => void;
  visibility: Visibility;
  toggleVisibility: (
    field: keyof Visibility
  ) => void;
  selectedCountry:
    | (typeof countries)[number]
    | undefined;
  hideQr?: boolean;
  hideNameFields?: boolean;
}) {
  return (
    <>
      {!hideQr && (
        <RequiredField
          label={
            ka
              ? "QR კოდი"
              : "QR code"
          }
          value={
            form.tag_code
          }
          onChange={(v) =>
            update(
              "tag_code",
              v
            )
          }
        />
      )}

      {!hideNameFields && (
        <>
          <InfoBox>
            <strong>
              {ka
                ? "სახელი და გვარი"
                : "First and last name"}
            </strong>

            <p>
              {ka
                ? "სახელი და გვარი სავალდებულოა და QR პროფილზე ყოველთვის გამოჩნდება."
                : "First and last name are required and always visible on the QR profile."}
            </p>
          </InfoBox>

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
              onChange={(v) =>
                update(
                  "first_name",
                  v
                )
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
              onChange={(v) =>
                update(
                  "last_name",
                  v
                )
              }
            />
          </div>
        </>
      )}

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
        onChange={(v) =>
          update(
            "date_of_birth",
            v
          )
        }
        active={
          visibility.show_date_of_birth
        }
        onToggle={() =>
          toggleVisibility(
            "show_date_of_birth"
          )
        }
        text={
          ka
            ? "შევსება სავალდებულოა. თქვენ წყვეტთ, გამოჩნდეს თუ არა QR პროფილზე."
            : "Required. You decide whether it appears on the QR profile."
        }
        ka={ka}
      />

      <SelectField
        label={
          ka
            ? "ქვეყანა"
            : "Country"
        }
        value={
          form.country_code
        }
        onChange={(v) =>
          update(
            "country_code",
            v
          )
        }
        options={[
          [
            "",
            ka
              ? "აირჩიეთ ქვეყანა"
              : "Select country",
          ],
          ...countries.map(
            (item) => [
              item.code,
              ka
                ? item.ka
                : item.en,
            ]
          ),
        ]}
        required
      />

      {selectedCountry && (
        <div className="emergencyBox">
          <strong>
            🚨{" "}
            {ka
              ? `გადაუდებელი დახმარება — ${selectedCountry.emergency}`
              : `Emergency services — ${selectedCountry.emergency}`}
          </strong>

          <p>
            {ka
              ? `${selectedCountry.emergency} QR პროფილზე ყოველთვის გამოჩნდება არჩეული ქვეყნის მიხედვით.`
              : `${selectedCountry.emergency} will always be displayed based on the selected country.`}
          </p>
        </div>
      )}

      <VisibilityField
        label={
          ka
            ? "პირადი / საიდენტიფიკაციო ნომერი"
            : "Personal identification number"
        }
        required
        value={
          form.personal_number
        }
        onChange={(v) =>
          update(
            "personal_number",
            v
          )
        }
        active={
          visibility.show_personal_number
        }
        onToggle={() =>
          toggleVisibility(
            "show_personal_number"
          )
        }
        text={
          ka
            ? "შევსება სავალდებულოა. საჯაროდ ჩვენება საწყისად გამორთულია."
            : "Required. Public visibility is off by default."
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
        onChange={(v) =>
          update(
            "address",
            v
          )
        }
        active={
          visibility.show_address
        }
        onToggle={() =>
          toggleVisibility(
            "show_address"
          )
        }
        text={
          ka
            ? "ნებაყოფლობითია. თუ შეავსებთ, თავად ირჩევთ გამოჩნდეს თუ არა."
            : "Optional. If entered, you decide whether it is displayed."
        }
        ka={ka}
      />

      <VisibilityTextarea
        label={
          ka
            ? "ქრონიკული დაავადებები"
            : "Chronic conditions"
        }
        value={
          form.chronic_conditions
        }
        onChange={(v) =>
          update(
            "chronic_conditions",
            v
          )
        }
        active={
          visibility.show_chronic_conditions
        }
        onToggle={() =>
          toggleVisibility(
            "show_chronic_conditions"
          )
        }
        text={
          ka
            ? "ნებაყოფლობითია. მიუთითეთ მხოლოდ ინფორმაცია, რომელიც შეიძლება მნიშვნელოვანი იყოს საგანგებო სიტუაციაში."
            : "Optional. Enter information that may be important in an emergency."
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
        onChange={(v) =>
          update(
            "additional_info",
            v
          )
        }
        active={
          visibility.show_additional_info
        }
        onToggle={() =>
          toggleVisibility(
            "show_additional_info"
          )
        }
        text={
          ka
            ? "ნებაყოფლობითი ველია. თქვენ ირჩევთ გამოჩნდეს თუ არა QR პროფილზე."
            : "Optional. You decide whether it appears on the QR profile."
        }
        ka={ka}
      />

      <ContactCard
        ka={ka}
        lang={lang}
        form={form}
        update={update}
        active={
          visibility.show_contact
        }
        onToggle={() =>
          toggleVisibility(
            "show_contact"
          )
        }
      />
    </>
  );
}

function ContactCard({
  ka,
  lang,
  form,
  update,
  active,
  onToggle,
}: {
  ka: boolean;
  lang: Lang;
  form: FormData;
  update: (
    field: keyof FormData,
    value: string | boolean
  ) => void;
  active: boolean;
  onToggle: () => void;
}) {
  return (
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
          active={active}
          onClick={onToggle}
        />
      </div>

      <p className="fieldHelp">
        {ka
          ? "თუ დაამატებთ საკონტაქტო პირს, მიუთითეთ ვინ არის ის სამაჯურის მფლობელისთვის და თავად აირჩიეთ დაკავშირების მეთოდები."
          : "If you add a contact person, specify their relationship to the wearer and choose the available contact methods."}
      </p>

      <div className="grid2">
        <OptionalField
          label={
            ka
              ? "სახელი"
              : "First name"
          }
          value={
            form.contact_first_name
          }
          onChange={(v) =>
            update(
              "contact_first_name",
              v
            )
          }
        />

        <OptionalField
          label={
            ka
              ? "გვარი"
              : "Last name"
          }
          value={
            form.contact_last_name
          }
          onChange={(v) =>
            update(
              "contact_last_name",
              v
            )
          }
        />
      </div>

      <SelectField
        label={
          ka
            ? "ვინ არის ეს პირი სამაჯურის მფლობელისთვის?"
            : "Relationship to the bracelet wearer"
        }
        value={
          form.contact_relationship
        }
        onChange={(v) =>
          update(
            "contact_relationship",
            v
          )
        }
        options={
          relationshipOptions[
            lang
          ]
        }
      />

      <OptionalField
        label={
          ka
            ? "მობილურის ნომერი"
            : "Mobile number"
        }
        type="tel"
        value={
          form.contact_phone
        }
        onChange={(v) =>
          update(
            "contact_phone",
            v
          )
        }
      />

      <div className="contactMethods">
        <strong>
          {ka
            ? "დაკავშირების მეთოდები"
            : "Contact methods"}
        </strong>

        <p>
          {ka
            ? "ყველა არჩევითია. შეგიძლიათ ჩართოთ ერთი, რამდენიმე ან არცერთი."
            : "All are optional. Choose one, several, or none."}
        </p>

        <ContactMethod
          icon="📞"
          label={
            ka
              ? "ტელეფონით დარეკვა"
              : "Phone call"
          }
          active={
            form.contact_mobile_enabled
          }
          onClick={() =>
            update(
              "contact_mobile_enabled",
              !form.contact_mobile_enabled
            )
          }
        />

        <ContactMethod
          icon="🟢"
          label="WhatsApp"
          active={
            form.contact_whatsapp_enabled
          }
          onClick={() =>
            update(
              "contact_whatsapp_enabled",
              !form.contact_whatsapp_enabled
            )
          }
        />

        <ContactMethod
          icon="💬"
          label="Live Chat"
          active={
            form.contact_live_chat_enabled
          }
          onClick={() =>
            update(
              "contact_live_chat_enabled",
              !form.contact_live_chat_enabled
            )
          }
        />
      </div>

      <div className="visibilityStatus">
        {ka
          ? "QR პროფილზე საკონტაქტო პირის გამოჩენა:"
          : "Show contact person on QR profile:"}{" "}
        <b>
          {active
            ? "ON"
            : "OFF"}
        </b>
      </div>
    </div>
  );
}

function Terms({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <div className="termsBox">
      <h3>
        QR RETURN Emergency
      </h3>

      <ol>
        <li>
          {ka
            ? "ერთი Emergency QR კოდი განკუთვნილია მხოლოდ ერთი კონკრეტული ადამიანისთვის."
            : "One Emergency QR code is intended for one specific person."}
        </li>

        <li>
          {ka
            ? "QR კოდი რეგისტრაციის შემდეგ აღარ იცვლება და სხვა ადამიანზე გადატანა შეუძლებელია."
            : "The QR code cannot be changed or transferred after registration."}
        </li>

        <li>
          {ka
            ? "სამაჯურის მფლობელის სახელი და გვარი სავალდებულოა და QR პროფილზე ყოველთვის გამოჩნდება."
            : "The wearer's first and last name are required and always visible."}
        </li>

        <li>
          {ka
            ? "სახელისა და გვარის შეცვლა შესაძლებელია მხოლოდ ერთხელ, შეცდომის გასასწორებლად."
            : "First and last name may be corrected only once."}
        </li>

        <li>
          {ka
            ? "პროფილის რედაქტირების უფლება დასტურდება კოდური სიტყვით ან მმართველის რეგისტრირებულ ელფოსტაზე მიღებული კოდით."
            : "Profile editing is verified with the codeword or a code sent to the manager's registered email."}
        </li>

        <li>
          {ka
            ? "დაბადების თარიღისა და პირადი ნომრის შევსება სავალდებულოა, მაგრამ მათი საჯაროდ ჩვენება მომხმარებლის არჩევანია."
            : "Date of birth and personal ID are required, but public visibility is optional."}
        </li>

        <li>
          {ka
            ? "მისამართი, ქრონიკული დაავადებები, დამატებითი ინფორმაცია და საკონტაქტო პირი ნებაყოფლობითია."
            : "Address, chronic conditions, additional information and contact person are optional."}
        </li>

        <li>
          {ka
            ? "საკონტაქტო პირთან დაკავშირების Phone, WhatsApp და Live Chat მეთოდები არჩევითია."
            : "Phone, WhatsApp and Live Chat contact methods are optional."}
        </li>

        <li>
          {ka
            ? "ანგარიშის მმართველის პირადი მონაცემები QR-ის საჯარო პროფილზე არ გამოჩნდება."
            : "The account manager's private data is not displayed publicly."}
        </li>

        <li>
          {ka
            ? "არჩეული ქვეყნის მიხედვით QR პროფილზე ყოველთვის გამოჩნდება 911 აშშ-ში ან 112 საქართველოში."
            : "The QR profile always displays 911 in the United States or 112 in Georgia."}
        </li>

        <li>
          {ka
            ? "ერთ ანგარიშის მმართველს შეუძლია ერთი ძირითადი და მაქსიმუმ ორი დამატებითი Emergency პროფილის მართვა. თითოეულ ადამიანს თავისი QR სჭირდება."
            : "One manager may manage one primary and up to two additional Emergency profiles. Each person needs their own QR."}
        </li>

        <li>
          {ka
            ? "მომხმარებელი პასუხისმგებელია შეყვანილი ინფორმაციის სისწორეზე."
            : "The user is responsible for the accuracy of the information provided."}
        </li>
      </ol>
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

function RequiredField({
  label,
  value,
  onChange,
  type = "text",
  note,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  type?: string;
  note?: string;
}) {
  return (
    <div className="field">
      <label>
        {label} *
      </label>

      <input
        type={type}
        value={value}
        required
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

      <small className="requiredNote">
        ✓{" "}
        {note ||
          "სავალდებულო"}
      </small>
    </div>
  );
}

function OptionalField({
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
    <div className="field">
      <label>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  options: string[][];
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required
          ? " *"
          : ""}
      </label>

      <select
        value={value}
        required={required}
        onChange={(e) =>
          onChange(
            e.target.value
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
    </div>
  );
}

function VisibilityField({
  label,
  value,
  onChange,
  active,
  onToggle,
  text,
  ka,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  active: boolean;
  onToggle: () => void;
  text: string;
  ka: boolean;
  type?: string;
  required?: boolean;
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
          active={active}
          onClick={onToggle}
        />
      </div>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

      <p className="fieldHelp">
        {text}
      </p>

      <div className="visibilityStatus">
        {ka
          ? "QR პროფილზე გამოჩენა:"
          : "Show on QR profile:"}{" "}
        <b>
          {active
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
  active,
  onToggle,
  text,
  ka,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  active: boolean;
  onToggle: () => void;
  text: string;
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
          active={active}
          onClick={onToggle}
        />
      </div>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />

      <p className="fieldHelp">
        {text}
      </p>

      <div className="visibilityStatus">
        {ka
          ? "QR პროფილზე გამოჩენა:"
          : "Show on QR profile:"}{" "}
        <b>
          {active
            ? "ON"
            : "OFF"}
        </b>
      </div>
    </div>
  );
}

function ContactMethod({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
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
    >
      <span>
        {icon}
      </span>

      <strong>
        {label}
      </strong>

      <b>
        {active
          ? "✓"
          : ""}
      </b>
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
    >
      <span />
    </button>
  );
}

function LockedOrEditable({
  label,
  value,
  onChange,
  editable,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  editable: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label}
      </label>

      <input
        value={value}
        readOnly={!editable}
        className={
          editable
            ? ""
            : "lockedInput"
        }
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </div>
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

function NoticeBox({
  text,
}: {
  text: string;
}) {
  return (
    <div className="noticeBox">
      ✓ {text}
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
        padding: 0;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 0;
        background: transparent;
        cursor: pointer;
        text-align: left;
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
        padding: 4px;
        display: flex;
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
        margin-bottom: 30px;
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

      .card {
        padding: 30px;
        border: 1px solid #e4e7ec;
        border-top: 4px solid #d92d20;
        border-radius: 22px;
        background: white;
        box-shadow: 0 12px 35px rgba(16, 24, 40, 0.06);
      }

      .choiceCard {
        margin-top: 8px;
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

      .bigChoices {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .bigChoice {
        min-height: 125px;
        padding: 18px;
        display: flex;
        align-items: flex-start;
        gap: 13px;
        border: 1px solid #d0d5dd;
        border-radius: 16px;
        background: white;
        cursor: pointer;
        text-align: left;
      }

      .bigChoice:hover {
        border-color: #155eef;
        background: #f6f9ff;
      }

      .bigChoice > span {
        font-size: 30px;
      }

      .bigChoice strong,
      .bigChoice small {
        display: block;
      }

      .bigChoice strong {
        margin-bottom: 7px;
        color: #101828;
        font-size: 15px;
      }

      .bigChoice small {
        color: #667085;
        font-size: 12px;
        line-height: 1.5;
      }

      .existingProfile {
        margin-top: 20px;
        padding-top: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-top: 1px solid #eaecf0;
      }

      .existingProfile span {
        color: #667085;
        font-size: 13px;
      }

      .existingProfile button,
      .textButton {
        padding: 0;
        border: 0;
        background: transparent;
        color: #155eef;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
      }

      .infoBox,
      .emergencyBox,
      .profileLimitBox {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 12px;
      }

      .infoBox,
      .profileLimitBox {
        border: 1px solid #d6e4ff;
        background: #f2f7ff;
      }

      .emergencyBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
      }

      .infoBox strong,
      .emergencyBox strong,
      .profileLimitBox strong {
        color: #344054;
        font-size: 14px;
      }

      .infoBox p,
      .emergencyBox p,
      .profileLimitBox p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .grid2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .field {
        margin-bottom: 19px;
      }

      .field label {
        display: block;
        margin-bottom: 8px;
        color: #344054;
        font-size: 14px;
        font-weight: 800;
      }

      .field input,
      .field select,
      .visibilityCard input,
      .visibilityCard textarea {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: white;
        color: #101828;
        outline: none;
      }

      .field input,
      .field select,
      .visibilityCard input {
        height: 53px;
        padding: 0 13px;
      }

      .visibilityCard textarea {
        min-height: 108px;
        padding: 13px;
        resize: vertical;
      }

      .field input:focus,
      .field select:focus,
      .visibilityCard input:focus,
      .visibilityCard textarea:focus {
        border-color: #155eef;
        box-shadow: 0 0 0 3px rgba(21, 94, 239, 0.08);
      }

      .requiredNote {
        display: block;
        margin-top: 8px;
        color: #16803b;
        font-size: 13px;
        font-weight: 800;
      }

      .visibilityCard,
      .contactCard,
      .identityCard {
        margin-bottom: 20px;
        padding: 17px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: #fafbfc;
      }

      .visibilityHeader,
      .identityHeader {
        margin-bottom: 11px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .visibilityHeader strong,
      .visibilityHeader span,
      .identityHeader strong,
      .identityHeader span {
        display: block;
      }

      .visibilityHeader strong,
      .identityHeader strong {
        color: #344054;
        font-size: 14px;
      }

      .visibilityHeader span,
      .identityHeader span {
        margin-top: 4px;
        color: #667085;
        font-size: 12px;
      }

      .fieldHelp {
        margin: 9px 0;
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

      .contactMethods {
        margin-top: 15px;
        padding: 15px;
        border: 1px solid #e4e7ec;
        border-radius: 12px;
        background: white;
      }

      .contactMethods > p {
        margin: 5px 0 11px;
        color: #667085;
        font-size: 12px;
      }

      .contactMethod {
        width: 100%;
        min-height: 52px;
        margin-top: 8px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: white;
        cursor: pointer;
      }

      .contactMethod.active {
        border-color: #155eef;
        background: #f2f7ff;
      }

      .contactMethod > span {
        font-size: 19px;
      }

      .contactMethod > strong {
        flex: 1;
        text-align: left;
        color: #344054;
      }

      .contactMethod > b {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        border-radius: 6px;
        background: #155eef;
        color: white;
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

      .buttons,
      .managementActions,
      .successButtons {
        margin-top: 25px;
        display: flex;
        gap: 10px;
      }

      .primaryButton,
      .backButton,
      .saveButton,
      .manageMainButton,
      .homeButton,
      .addProfileButton {
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

      .backButton,
      .homeButton {
        border: 1px solid #d0d5dd;
        background: white;
        color: #475467;
      }

      .saveButton,
      .manageMainButton {
        border: 0;
        background: #d92d20;
        color: white;
      }

      .addProfileButton {
        flex: 1;
        border: 0;
        background: #155eef;
        color: white;
      }

      .saveButton:disabled,
      .primaryButton:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .verifyChoices {
        margin-bottom: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .choice {
        min-height: 72px;
        padding: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: white;
        cursor: pointer;
      }

      .choice.active {
        border-color: #155eef;
        background: #f2f7ff;
        color: #155eef;
      }

      .choice span {
        font-size: 22px;
      }

      .lockedQr {
        margin-bottom: 20px;
        padding: 16px;
        border: 1px solid #e4e7ec;
        border-radius: 13px;
        background: #f2f4f7;
      }

      .lockedQr strong,
      .lockedQr span,
      .lockedQr p {
        display: block;
      }

      .lockedQr span {
        margin-top: 7px;
        font-size: 20px;
        font-weight: 900;
      }

      .lockedQr p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 12px;
      }

      .lockedInput {
        background: #f2f4f7 !important;
        color: #667085 !important;
      }

      .smallButton {
        padding: 8px 11px;
        border: 0;
        border-radius: 8px;
        background: #d92d20;
        color: white;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }

      .warningText {
        margin: 0;
        color: #b42318;
        font-size: 12px;
        line-height: 1.5;
      }

      .errorBox,
      .noticeBox {
        margin-top: 17px;
        padding: 14px;
        border-radius: 11px;
        font-size: 13px;
        font-weight: 700;
      }

      .errorBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .noticeBox {
        border: 1px solid #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .successPage {
        width: 100%;
        max-width: 620px;
        margin: auto;
        padding: 55px 0;
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
        .bigChoices,
        .verifyChoices {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .bigChoice,
        .choice {
          margin-bottom: 9px;
        }

        .existingProfile {
          align-items: flex-start;
          flex-direction: column;
        }

        input,
        select,
        textarea {
          font-size: 16px !important;
        }

        .buttons,
        .managementActions,
        .successButtons {
          display: grid;
          grid-template-columns: 1fr;
        }

        .primaryButton {
          margin-left: 0;
        }

        .saveButton,
        .addProfileButton,
        .manageMainButton,
        .homeButton {
          width: 100%;
        }
      }
    `}</style>
  );
}
