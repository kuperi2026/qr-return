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

const initialForm: FormState = {
  tag_code: "",
  first_name: "",
  last_name: "",
  date_of_birth: "",
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
    ["other", "Other"],
  ],
};

function cleanTag(tag: string) {
  return tag
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-");
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

  return allowed.includes(ext)
    ? ext
    : "jpg";
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

  const ext = safeExtension(file);

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

  const [
    photo,
    setPhoto,
  ] =
    useState<File | null>(
      null
    );

  const [
    locationSharing,
    setLocationSharing,
  ] = useState(false);

  const [
    identityLocked,
    setIdentityLocked,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState(false);

  const ka =
    language === "ka";

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
        !validatePhoto()
      ) {
        return;
      }

      /*
       * პირველი ნაბიჯის დასრულების შემდეგ
       * QR კოდი, სახელი და გვარი იკეტება.
       */
      setIdentityLocked(true);

      setStep(2);
      goTop();

      return;
    }

    if (step === 2) {
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
      await nextStep();
      return;
    }

    if (
      !form.emergency_contact_name.trim()
    ) {
      setError(
        ka
          ? "გთხოვთ მიუთითოთ საგანგებო საკონტაქტო პირის სახელი და გვარი."
          : "Please enter the emergency contact's full name."
      );

      return;
    }

    if (
      !form.emergency_contact_relationship
    ) {
      setError(
        ka
          ? "გთხოვთ მიუთითოთ, ვინ არის საგანგებო საკონტაქტო პირი თქვენთვის."
          : "Please select the emergency contact's relationship to you."
      );

      return;
    }

    if (
      !form.emergency_contact_phone.trim()
    ) {
      setError(
        ka
          ? "გთხოვთ მიუთითოთ საგანგებო საკონტაქტო პირის ტელეფონის ნომერი."
          : "Please enter the emergency contact's phone number."
      );

      return;
    }

    if (
      !validatePhoto()
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const tagCode =
        form.tag_code.trim();

      /*
       * ვამოწმებთ QR უკვე რეგისტრირებულია თუ არა.
       */
      const {
        data: existing,
        error: checkError,
      } = await supabase
        .from("emergency_profiles")
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
            ? "ეს QR კოდი უკვე რეგისტრირებულია. არსებული პროფილის შესაცვლელად გამოიყენეთ რედაქტირება."
            : "This QR code is already registered. Use Edit to update the existing profile."
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

      const payload = {
        /*
         * ეს სამი მნიშვნელობა პროფილის შექმნის შემდეგ
         * Supabase-ის trigger-ითაც დაცულია.
         */
        tag_code:
          tagCode,

        first_name:
          form.first_name.trim(),

        last_name:
          form.last_name.trim(),

        photo_url:
          photoUrl,

        date_of_birth:
          form.date_of_birth ||
          null,

        blood_type:
          form.blood_type ||
          null,

        address:
          form.address.trim() ||
          null,

        allergies:
          form.allergies.trim() ||
          null,

        medical_conditions:
          form.medical_conditions.trim() ||
          null,

        medications:
          form.medications.trim() ||
          null,

        medical_note:
          form.medical_note.trim() ||
          null,

        emergency_contact_name:
          form.emergency_contact_name.trim(),

        emergency_contact_relationship:
          form.emergency_contact_relationship,

        emergency_contact_phone:
          form.emergency_contact_phone.trim(),

        second_contact_name:
          form.second_contact_name.trim() ||
          null,

        second_contact_relationship:
          form.second_contact_relationship ||
          null,

        second_contact_phone:
          form.second_contact_phone.trim() ||
          null,

        emergency_message:
          form.emergency_message.trim() ||
          null,

        location_sharing_enabled:
          locationSharing,

        show_photo:
          visibility.show_photo,

        show_date_of_birth:
          visibility.show_date_of_birth,

        show_blood_type:
          visibility.show_blood_type,

        show_address:
          visibility.show_address,

        show_allergies:
          visibility.show_allergies,

        show_medical_conditions:
          visibility.show_medical_conditions,

        show_medications:
          visibility.show_medications,

        show_medical_note:
          visibility.show_medical_note,

        show_second_contact:
          visibility.show_second_contact,

        show_emergency_message:
          visibility.show_emergency_message,

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
          language={
            language
          }
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
              ? "თქვენი Emergency ინფორმაცია წარმატებით შეინახა."
              : "Your Emergency information was saved successfully."}
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
              href="/"
              className="homeButton"
            >
              {ka
                ? "მთავარ გვერდზე"
                : "Home"}
            </a>
          </div>

          <div className="identityLockedNotice">
            <strong>
              🔒{" "}
              {ka
                ? "პიროვნება დაფიქსირებულია"
                : "Identity locked"}
            </strong>

            <p>
              {ka
                ? `${form.first_name} ${form.last_name} — ამ Emergency პროფილზე QR კოდი, სახელი და გვარი აღარ შეიცვლება.`
                : `${form.first_name} ${form.last_name} — the QR code, first name and last name cannot be changed on this Emergency profile.`}
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
        language={
          language
        }
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
                ? "შექმენით პირადი Emergency პროფილი. არასავალდებულო ინფორმაციის შევსებასა და ხილვადობას თავად აკონტროლებთ."
                : "Create your Emergency profile. You control whether optional information is completed and displayed."}
            </p>
          </div>
        </div>

        <div className="informationBox">
          <strong>
            {ka
              ? "თქვენ აკონტროლებთ თქვენს ინფორმაციას"
              : "You control your information"}
          </strong>

          <p>
            {ka
              ? "სავალდებულო ინფორმაცია აუცილებლად უნდა შეივსოს და ყოველთვის გამოჩნდება. დანარჩენი ინფორმაციის შევსებაც და QR პროფილში ჩვენებაც თქვენი არჩევანია."
              : "Required information must be completed and is always visible. Completing and displaying other information is your choice."}
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
                : "Contact"
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
              <StepTitle
                number="01"
                title={
                  ka
                    ? "პირადი ინფორმაცია"
                    : "Personal information"
                }
                text={
                  ka
                    ? "Emergency პროფილის ძირითადი ინფორმაცია."
                    : "Basic information for your Emergency profile."
                }
              />

              {identityLocked && (
                <div className="lockedBox">
                  🔒{" "}
                  {ka
                    ? "QR კოდი, სახელი და გვარი დაფიქსირებულია ამ რეგისტრაციისთვის."
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

              <OptionalField
                label={
                  ka
                    ? "დაბადების თარიღი"
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
                visible={
                  visibility.show_date_of_birth
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_date_of_birth"
                  )
                }
                ka={ka}
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

              {error && (
                <ErrorBox
                  text={
                    error
                  }
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
                    ? "სამედიცინო ინფორმაცია"
                    : "Medical information"
                }
                text={
                  ka
                    ? "მიუთითეთ ინფორმაცია, რომელიც საგანგებო სიტუაციაში შეიძლება მნიშვნელოვანი იყოს."
                    : "Add information that may be important in an emergency."
                }
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
                  text={
                    error
                  }
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
                    ? "საგანგებო საკონტაქტო პირი"
                    : "Emergency contact"
                }
                text={
                  ka
                    ? "მიუთითეთ პირი, რომელსაც საგანგებო სიტუაციაში უნდა დაუკავშირდნენ."
                    : "Add the person who should be contacted in an emergency."
                }
              />

              <div className="requiredContactBox">
                <div className="requiredContactTitle">
                  <span>
                    ☎
                  </span>

                  <div>
                    <strong>
                      {ka
                        ? "მთავარი საგანგებო საკონტაქტო პირი"
                        : "Primary emergency contact"}
                    </strong>

                    <p>
                      {ka
                        ? "ეს ინფორმაცია ყოველთვის გამოჩნდება QR კოდის დასკანერებისას."
                        : "This information is always visible when the QR code is scanned."}
                    </p>
                  </div>
                </div>

                <RequiredField
                  label={
                    ka
                      ? "სახელი და გვარი"
                      : "Full name"
                  }
                  value={
                    form.emergency_contact_name
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "emergency_contact_name",
                      value
                    )
                  }
                  ka={ka}
                />

                <RequiredRelationship
                  label={
                    ka
                      ? "თქვენთან კავშირი"
                      : "Relationship to you"
                  }
                  value={
                    form.emergency_contact_relationship
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "emergency_contact_relationship",
                      value
                    )
                  }
                  language={
                    language
                  }
                />

                <RequiredField
                  label={
                    ka
                      ? "ტელეფონის ნომერი"
                      : "Phone number"
                  }
                  type="tel"
                  value={
                    form.emergency_contact_phone
                  }
                  onChange={(
                    value
                  ) =>
                    updateField(
                      "emergency_contact_phone",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <div className="sectionDivider" />

              <OptionalContactSection
                form={
                  form
                }
                updateField={
                  updateField
                }
                visible={
                  visibility.show_second_contact
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_second_contact"
                  )
                }
                language={
                  language
                }
              />

              <OptionalTextArea
                label={
                  ka
                    ? "დამატებითი შეტყობინება"
                    : "Additional emergency message"
                }
                placeholder={
                  ka
                    ? "მაგ: გთხოვთ დაუკავშირდეთ ჩემს ოჯახის წევრს..."
                    : "e.g. Please contact my family member..."
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
                        ? "ჩართვის შემთხვევაში QR კოდის დამსკანერებელს შეეძლება თავისი მიმდინარე ლოკაციის თქვენთვის გაზიარება."
                        : "When enabled, the person scanning the QR code can share their current location with you."}
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

              <div className="disclaimer">
                <strong>
                  {ka
                    ? "მნიშვნელოვანი ინფორმაცია"
                    : "Important"}
                </strong>

                <p>
                  {ka
                    ? "Emergency პროფილში მითითებულ ინფორმაციას მომხმარებელი თავად ავსებს. პროფილი არ ცვლის პროფესიულ სამედიცინო ჩანაწერს ან გადაუდებელი დახმარების მომსახურებას."
                    : "Information in the Emergency profile is provided by the user. The profile does not replace professional medical records or emergency services."}
                </p>
              </div>

              {error && (
                <ErrorBox
                  text={
                    error
                  }
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
                    saving
                  }
                >
                  {saving
                    ? ka
                      ? "ინახება..."
                      : "Saving..."
                    : ka
                    ? "Emergency პროფილის შენახვა"
                    : "Save Emergency profile"}
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
            SMART LOST & FOUND
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
            ? "უკან"
            : "Back"}
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
          type={
            type
          }
          value={
            value
          }
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
              event
                .target
                .value
            )
          }
        />
      </label>

      <div className="requiredNote">
        ✓{" "}
        {ka
          ? locked
            ? "სავალდებულო • ყოველთვის ხილული • დაფიქსირებული"
            : "სავალდებულო • ყოველთვის ხილული"
          : locked
          ? "Required • Always visible • Locked"
          : "Required • Always visible"}
      </div>
    </div>
  );
}

function RequiredRelationship({
  label,
  value,
  onChange,
  language,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  language: Language;
}) {
  const ka =
    language === "ka";

  return (
    <div className="requiredField">
      <label>
        <strong>
          {label} *
        </strong>

        <select
          value={
            value
          }
          required
          onChange={(
            event
          ) =>
            onChange(
              event
                .target
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
  onChange: (
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  ka: boolean;
  type?: string;
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
        type={
          type
        }
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event
              .target
              .value
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
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <textarea
        value={
          value
        }
        placeholder={
          placeholder
        }
        onChange={(
          event
        ) =>
          onChange(
            event
              .target
              .value
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
          active={
            visible
          }
          onClick={
            onToggle
          }
        />
      </div>

      <select
        value={
          value
        }
        onChange={(
          event
        ) =>
          onChange(
            event
              .target
              .value
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
          active={
            visible
          }
          onClick={
            onToggle
          }
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
              event
                .target
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
              ? "აირჩიეთ სურათი მოწყობილობიდან • მაქსიმუმ 5 MB"
              : "Choose an image from your device • Maximum 5 MB"}
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

function OptionalContactSection({
  form,
  updateField,
  visible,
  onToggle,
  language,
}: {
  form: FormState;
  updateField: (
    field: keyof FormState,
    value: string
  ) => void;
  visible: boolean;
  onToggle: () => void;
  language: Language;
}) {
  const ka =
    language === "ka";

  return (
    <div className="optionalContactBox">
      <div className="fieldHeader">
        <div>
          <strong>
            {ka
              ? "მეორე საგანგებო საკონტაქტო პირი"
              : "Second emergency contact"}
          </strong>

          <span>
            {ka
              ? "ნებაყოფლობითი • დამატება თქვენი არჩევანია"
              : "Optional • Adding this contact is your choice"}
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

      <label className="simpleLabel">
        <strong>
          {ka
            ? "სახელი და გვარი"
            : "Full name"}
        </strong>

        <input
          value={
            form.second_contact_name
          }
          onChange={(
            event
          ) =>
            updateField(
              "second_contact_name",
              event
                .target
                .value
            )
          }
        />
      </label>

      <label className="simpleLabel">
        <strong>
          {ka
            ? "თქვენთან კავშირი"
            : "Relationship to you"}
        </strong>

        <select
          value={
            form.second_contact_relationship
          }
          onChange={(
            event
          ) =>
            updateField(
              "second_contact_relationship",
              event
                .target
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
          value={
            form.second_contact_phone
          }
          onChange={(
            event
          ) =>
            updateField(
              "second_contact_phone",
              event
                .target
                .value
            )
          }
        />
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
      onClick={
        onClick
      }
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
            rgba(21, 94, 239, 0.06),
            transparent 25%
          ),
          #f7f9fc;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1080px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e9f0;
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
        color: #ffffff;
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
        color: #98a2b3;
        font-size: 8px;
        font-weight: 800;
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
        background: #ffffff;
        color: #155eef;
        box-shadow: 0 1px 3px rgba(16, 24, 40, 0.08);
      }

      .content {
        width: calc(100% - 24px);
        max-width: 780px;
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
        border: 1px solid #ffd7d2;
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
        color: #101828;
        font-size: 37px;
        line-height: 1.13;
        letter-spacing: -1px;
      }

      .hero p {
        max-width: 620px;
        margin: 0;
        color: #667085;
        font-size: 14px;
        line-height: 1.65;
      }

      .informationBox {
        margin-top: 25px;
        padding: 17px 18px;
        border: 1px solid #d8e5fb;
        border-left: 4px solid #155eef;
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
        min-width: 80px;
        text-align: center;
      }

      .circle {
        width: 36px;
        height: 36px;
        margin: auto;
        display: grid;
        place-items: center;
        border: 1px solid #d4dae2;
        border-radius: 50%;
        background: #ffffff;
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
        color: #ffffff;
        box-shadow: 0 0 0 5px rgba(217, 45, 32, 0.08);
      }

      .progressItem small {
        display: block;
        margin-top: 7px;
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
        padding: 30px;
        border: 1px solid #e2e7ed;
        border-top: 4px solid #d92d20;
        border-radius: 23px;
        background: #ffffff;
        box-shadow: 0 12px 38px rgba(16, 24, 40, 0.055);
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
        color: #101828;
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
        grid-template-columns: repeat(2, minmax(0, 1fr));
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
        border: 1px solid #d0d5dd;
        border-radius: 12px;
        background: #ffffff;
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

      .lockedInput {
        background: #f2f4f7 !important;
        color: #667085 !important;
        cursor: not-allowed;
      }

      .requiredNote {
        margin-top: 9px;
        color: #16803b;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 800;
      }

      .lockedBox {
        margin-bottom: 20px;
        padding: 14px;
        border: 1px solid #d9e5fb;
        border-radius: 12px;
        background: #f2f7ff;
        color: #344054;
        font-size: 13px;
        line-height: 1.5;
        font-weight: 750;
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
        background: #ffffff;
        transition: transform 0.2s ease;
      }

      .switch.active {
        background: #155eef;
      }

      .switch.active span {
        transform: translateX(21px);
      }

      .photoUpload {
        min-height: 76px;
        padding: 13px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px dashed #c7ced8;
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

      .requiredContactBox {
        margin-bottom: 24px;
        padding: 20px;
        border: 1px solid #ffd6d1;
        border-radius: 16px;
        background: #fffafa;
      }

      .requiredContactTitle {
        margin-bottom: 20px;
        display: flex;
        align-items: flex-start;
        gap: 11px;
      }

      .requiredContactTitle > span {
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #fff0ee;
        color: #d92d20;
        font-size: 18px;
      }

      .requiredContactTitle strong {
        color: #344054;
        font-size: 15px;
      }

      .requiredContactTitle p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.5;
      }

      .sectionDivider {
        height: 1px;
        margin: 28px 0;
        background: #eaecf0;
      }

      .optionalContactBox {
        margin-bottom: 22px;
        padding: 19px;
        border: 1px solid #e2e7ed;
        border-radius: 15px;
        background: #f9fafb;
      }

      .simpleLabel {
        display: block;
        margin-top: 16px;
      }

      .locationCard {
        margin-top: 24px;
        padding: 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border: 1px solid #d9e5fb;
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
        max-width: 510px;
        margin: 5px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      .disclaimer {
        margin-top: 20px;
        padding: 15px 16px;
        border: 1px solid #eaecf0;
        border-radius: 12px;
        background: #f9fafb;
      }

      .disclaimer strong {
        color: #475467;
        font-size: 13px;
      }

      .disclaimer p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.6;
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
        color: #ffffff;
        text-decoration: none;
      }

      .primaryButton.full {
        width: 100%;
        margin-top: 12px;
      }

      .backButton {
        border: 1px solid #d0d5dd;
        background: #ffffff;
        color: #475467;
      }

      .saveButton {
        margin-left: auto;
        border: 0;
        background: #d92d20;
        color: #ffffff;
      }

      .saveButton:disabled {
        opacity: 0.6;
      }

      .errorBox {
        margin-top: 18px;
        padding: 14px 15px;
        border: 1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 750;
      }

      .successPage {
        width: calc(100% - 24px);
        max-width: 620px;
        margin: auto;
        padding: 100px 0;
        text-align: center;
      }

      .successIcon {
        width: 72px;
        height: 72px;
        margin: 0 auto 22px;
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
      }

      .successButtons {
        display: flex;
        justify-content: center;
        gap: 10px;
      }

      .viewButton,
      .homeButton {
        min-height: 50px;
        padding: 0 20px;
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
        color: #ffffff;
      }

      .homeButton {
        border: 1px solid #d0d5dd;
        background: #ffffff;
        color: #475467;
      }

      .identityLockedNotice {
        margin-top: 25px;
        padding: 16px;
        border: 1px solid #d9e5fb;
        border-radius: 13px;
        background: #f2f7ff;
        text-align: left;
      }

      .identityLockedNotice strong {
        color: #344054;
        font-size: 14px;
      }

      .identityLockedNotice p {
        margin: 6px 0 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.55;
      }

      @media (max-width: 600px) {
        .headerBack {
          display: none;
        }

        .content {
          padding-top: 28px;
        }

        .hero h1 {
          font-size: 27px;
        }

        .grid2 {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .card {
          padding: 21px 14px;
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

        .requiredNote,
        .fieldHeader span,
        .optionalNote {
          font-size: 13px;
        }

        .buttons {
          display: grid;
          grid-template-columns: 0.9fr 1.4fr;
        }

        .primaryButton,
        .backButton,
        .saveButton {
          width: 100%;
          margin: 0;
          padding: 0 10px;
        }

        .successButtons {
          flex-direction: column;
        }

        .viewButton,
        .homeButton {
          width: 100%;
        }
      }
    `}</style>
  );
}
