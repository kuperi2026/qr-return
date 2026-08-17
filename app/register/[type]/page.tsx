"use client";

import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";
type Step = 1 | 2 | 3;

type CategoryKey =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "suitcase"
  | "bag";

type FormState = {
  tag_code: string;
  item_name: string;
  colour: string;

  sex: string;
  date_of_birth: string;
  weight: string;
  medical_info: string;

  brand: string;
  model: string;
  size: string;
  material: string;
  distinctive_features: string;
  description: string;

  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  owner_email: string;

  additional_contact_name: string;
  additional_contact_phone: string;
  additional_contact_email: string;

  finder_message: string;
  lost_seen_location: string;
};

type VisibilityState = {
  show_colour: boolean;
  show_sex: boolean;
  show_date_of_birth: boolean;
  show_weight: boolean;
  show_medical_info: boolean;

  show_brand: boolean;
  show_model: boolean;
  show_size: boolean;
  show_material: boolean;
  show_distinctive_features: boolean;
  show_description: boolean;

  show_photo: boolean;
  show_owner_photo: boolean;

  show_owner_email: boolean;
  show_additional_contact: boolean;

  show_finder_message: boolean;
  show_lost_seen_location: boolean;
};

const BUCKET = "qr-return-images";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const categories = {
  dog: {
    icon: "🐕",
    ka: "ძაღლი",
    en: "Dog",
    itemType: "dog",
    petType: "dog",
    isPet: true,
  },

  cat: {
    icon: "🐈",
    ka: "კატა",
    en: "Cat",
    itemType: "cat",
    petType: "cat",
    isPet: true,
  },

  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
    itemType: "key",
    petType: null,
    isPet: false,
  },

  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
    itemType: "wallet",
    petType: null,
    isPet: false,
  },

  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
    itemType: "suitcase",
    petType: null,
    isPet: false,
  },

  bag: {
    icon: "🎒",
    ka: "ჩანთა",
    en: "Bag",
    itemType: "bag",
    petType: null,
    isPet: false,
  },
} as const;

const initialForm: FormState = {
  tag_code: "",
  item_name: "",
  colour: "",

  sex: "",
  date_of_birth: "",
  weight: "",
  medical_info: "",

  brand: "",
  model: "",
  size: "",
  material: "",
  distinctive_features: "",
  description: "",

  owner_first_name: "",
  owner_last_name: "",
  owner_phone: "",
  owner_email: "",

  additional_contact_name: "",
  additional_contact_phone: "",
  additional_contact_email: "",

  finder_message: "",
  lost_seen_location: "",
};

const initialVisibility: VisibilityState = {
  show_colour: true,
  show_sex: true,
  show_date_of_birth: false,
  show_weight: false,
  show_medical_info: false,

  show_brand: true,
  show_model: true,
  show_size: false,
  show_material: false,
  show_distinctive_features: true,
  show_description: true,

  show_photo: true,
  show_owner_photo: false,

  show_owner_email: false,
  show_additional_contact: false,

  show_finder_message: true,
  show_lost_seen_location: true,
};

function cleanTag(tag: string) {
  return tag.trim().replace(/[^a-zA-Z0-9_-]/g, "-");
}

function safeExtension(file: File) {
  const ext =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

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

async function uploadImage(
  file: File,
  folder: "items" | "owners",
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

  const path = `${folder}/${cleanTag(
    tagCode
  )}-${unique}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

export default function RegistrationPage() {
  const params = useParams();

  const rawType = Array.isArray(params?.type)
    ? params.type[0]
    : params?.type;

  const type: CategoryKey =
    typeof rawType === "string" &&
    rawType in categories
      ? (rawType as CategoryKey)
      : "dog";

  const category = categories[type];

  const [language, setLanguage] =
    useState<Language>("ka");

  const [step, setStep] = useState<Step>(1);

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [visibility, setVisibility] =
    useState<VisibilityState>(
      initialVisibility
    );

  const [showExtraProfile, setShowExtraProfile] =
    useState(false);

  const [showExtraContact, setShowExtraContact] =
    useState(false);

  const [phoneEnabled, setPhoneEnabled] =
    useState(true);

  const [whatsappEnabled, setWhatsappEnabled] =
    useState(false);

  const [liveChatEnabled, setLiveChatEnabled] =
    useState(true);

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  const [itemPhoto, setItemPhoto] =
    useState<File | null>(null);

  const [ownerPhoto, setOwnerPhoto] =
    useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const ka = language === "ka";

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

  function validateImage(file: File | null) {
    if (!file) {
      return true;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        ka
          ? "გთხოვთ აირჩიოთ სურათის ფაილი."
          : "Please select an image file."
      );

      return false;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError(
        ka
          ? "ფოტოს ზომა არ უნდა აღემატებოდეს 5 MB-ს."
          : "The image must not exceed 5 MB."
      );

      return false;
    }

    return true;
  }

  function nextStep() {
    setError("");

    if (step === 1) {
      if (!form.tag_code.trim()) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ QR კოდი."
            : "Please enter the QR code."
        );

        return;
      }

      if (!form.item_name.trim()) {
        setError(
          ka
            ? category.isPet
              ? "გთხოვთ მიუთითოთ ცხოველის სახელი."
              : "გთხოვთ მიუთითოთ ნივთის დასახელება."
            : category.isPet
            ? "Please enter the pet name."
            : "Please enter the item name."
        );

        return;
      }

      if (!validateImage(itemPhoto)) {
        return;
      }

      setStep(2);
      goTop();
      return;
    }

    if (step === 2) {
      if (!form.owner_first_name.trim()) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ მფლობელის სახელი."
            : "Please enter the owner's first name."
        );

        return;
      }

      if (!form.owner_last_name.trim()) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ მფლობელის გვარი."
            : "Please enter the owner's last name."
        );

        return;
      }

      if (!form.owner_phone.trim()) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ მობილურის ნომერი."
            : "Please enter the phone number."
        );

        return;
      }

      if (!form.owner_email.trim()) {
        setError(
          ka
            ? "გთხოვთ მიუთითოთ ელფოსტა."
            : "Please enter the email."
        );

        return;
      }

      if (
        !phoneEnabled &&
        !whatsappEnabled &&
        !liveChatEnabled
      ) {
        setError(
          ka
            ? "აირჩიეთ დაკავშირების მინიმუმ ერთი მეთოდი."
            : "Choose at least one contact method."
        );

        return;
      }

      if (!validateImage(ownerPhoto)) {
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

    setSaving(true);
    setError("");

    try {
      if (
        !validateImage(itemPhoto) ||
        !validateImage(ownerPhoto)
      ) {
        return;
      }

      const tagCode = form.tag_code.trim();

      const {
        data: existing,
        error: checkError,
      } = await supabase
        .from("item")
        .select("tag_code")
        .eq("tag_code", tagCode)
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
            ? "ეს QR კოდი უკვე რეგისტრირებულია."
            : "This QR code is already registered."
        );

        return;
      }

      let photoUrl: string | null = null;
      let ownerPhotoUrl: string | null = null;

      if (itemPhoto) {
        photoUrl = await uploadImage(
          itemPhoto,
          "items",
          tagCode
        );
      }

      if (ownerPhoto) {
        ownerPhotoUrl = await uploadImage(
          ownerPhoto,
          "owners",
          tagCode
        );
      }

      const ownerName = [
        form.owner_first_name.trim(),
        form.owner_last_name.trim(),
      ]
        .filter(Boolean)
        .join(" ");

      const finderMessage =
        form.finder_message.trim();

      const weightValue =
        form.weight.trim() !== ""
          ? Number(form.weight)
          : null;

      if (
        weightValue !== null &&
        Number.isNaN(weightValue)
      ) {
        setError(
          ka
            ? "წონა სწორად მიუთითეთ."
            : "Please enter a valid weight."
        );

        return;
      }

      const payload = {
        tag_code: tagCode,

        item_type: category.itemType,
        pet_type: category.petType,

        /*
         * ALWAYS VISIBLE:
         * item type + item/pet name
         */
        item_name: form.item_name.trim(),

        /*
         * OPTIONAL + VISIBILITY CONTROL
         */
        colour:
          form.colour.trim() || null,

        sex: category.isPet
          ? form.sex || null
          : null,

        date_of_birth: category.isPet
          ? form.date_of_birth || null
          : null,

        weight: category.isPet
          ? weightValue
          : null,

        medical_info: category.isPet
          ? form.medical_info.trim() || null
          : null,

        brand: !category.isPet
          ? form.brand.trim() || null
          : null,

        model: !category.isPet
          ? form.model.trim() || null
          : null,

        size: !category.isPet
          ? form.size.trim() || null
          : null,

        material: !category.isPet
          ? form.material.trim() || null
          : null,

        distinctive_features: !category.isPet
          ? form.distinctive_features.trim() || null
          : null,

        description:
          form.description.trim() || null,

        photo_url: photoUrl,
        owner_photo_url: ownerPhotoUrl,

        /*
         * OWNER NAME + PHONE:
         * REQUIRED AND ALWAYS VISIBLE
         */
        owner_name: ownerName,
        owner_phone: form.owner_phone.trim(),

        /*
         * EMAIL:
         * REQUIRED TO COMPLETE REGISTRATION,
         * BUT VISIBILITY IS USER'S CHOICE
         */
        owner_email: form.owner_email.trim(),

        additional_contact_name:
          form.additional_contact_name.trim() ||
          null,

        additional_contact_phone:
          form.additional_contact_phone.trim() ||
          null,

        additional_contact_email:
          form.additional_contact_email.trim() ||
          null,

        finder_message:
          finderMessage || null,

        owner_message_enabled:
          finderMessage.length > 0,

        lost_seen_location:
          form.lost_seen_location.trim() ||
          null,

        /*
         * CONTACT METHODS:
         * ONE OR MORE
         */
        phone_enabled: phoneEnabled,
        whatsapp_enabled: whatsappEnabled,
        live_chat_enabled: liveChatEnabled,

        location_sharing_enabled:
          locationSharingEnabled,

        /*
         * IMPORTANT:
         * PHONE IS ALWAYS VISIBLE.
         */
        show_owner_phone: true,

        /*
         * Optional visibility values
         */
        ...visibility,

        active: true,
      };

      const { error: saveError } =
        await supabase
          .from("item")
          .insert(payload);

      if (saveError) {
        console.error(saveError);

        setError(
          ka
            ? `შენახვა ვერ მოხერხდა: ${saveError.message}`
            : `Save failed: ${saveError.message}`
        );

        return;
      }

      setSuccess(true);
      goTop();
    } catch (err) {
      console.error(err);

      setError(
        ka
          ? "ინფორმაციის შენახვისას დაფიქსირდა შეცდომა."
          : "An error occurred while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  if (success) {
    return (
      <main className="page">
        <Header
          ka={ka}
          language={language}
          setLanguage={setLanguage}
        />

        <section className="successPage">
          <div className="successIcon">
            ✓
          </div>

          <div className="eyebrow">
            QR RETURN
          </div>

          <h1>
            {ka
              ? "პროფილი წარმატებით შეიქმნა"
              : "Profile created successfully"}
          </h1>

          <p>
            {ka
              ? "QR კოდი და პროფილის ინფორმაცია წარმატებით შეინახა."
              : "The QR code and profile information were saved successfully."}
          </p>

          <a
            href={`/profile/${encodeURIComponent(
              form.tag_code.trim()
            )}`}
            className="mainButton successButton"
          >
            {ka
              ? "პროფილის ნახვა"
              : "View profile"}
          </a>
        </section>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <Header
        ka={ka}
        language={language}
        setLanguage={setLanguage}
      />

      <section className="content">
        <div className="intro">
          <div className="categoryIcon">
            {category.icon}
          </div>

          <div>
            <div className="eyebrow">
              QR RETURN
            </div>

            <h1>
              {ka
                ? "პროფილის შექმნა"
                : "Create profile"}
            </h1>

            <p>
              {ka
                ? `კატეგორია: ${category.ka}`
                : `Category: ${category.en}`}
            </p>
          </div>
        </div>

        {/* IMPORTANT USER EXPLANATION */}
        <div className="privacyNotice">
          <div className="privacyIcon">
            ℹ️
          </div>

          <div>
            <strong>
              {ka
                ? "რა გამოჩნდება QR კოდის დასკანერებისას?"
                : "What will be visible after scanning the QR code?"}
            </strong>

            <p>
              {ka
                ? "დაკარგულის ტიპი, ნივთის ან ცხოველის სახელი, მფლობელის სახელი და გვარი და მობილურის ნომერი ყოველთვის ხილული იქნება, რათა მპოვნელმა შეძლოს დაკარგულის იდენტიფიცირება და თქვენთან დაკავშირება. სხვა ინფორმაციის ხილვადობას თავად აკონტროლებთ."
                : "The lost item or pet type, its name, the owner's full name and phone number are always visible so the finder can identify it and contact you. You control the visibility of other information."}
            </p>
          </div>
        </div>

        <div className="progress">
          <Progress
            number="1"
            label={
              ka ? "პროფილი" : "Profile"
            }
            active={step >= 1}
            current={step === 1}
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
              ka ? "მფლობელი" : "Owner"
            }
            active={step >= 2}
            current={step === 2}
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
              ka ? "დასრულება" : "Finish"
            }
            active={step >= 3}
            current={step === 3}
          />
        </div>

        <form
          className="card"
          onSubmit={handleSubmit}
        >
          {step === 1 && (
            <>
              <StepTitle
                number="01"
                title={
                  category.isPet
                    ? ka
                      ? "ცხოველის ინფორმაცია"
                      : "Pet information"
                    : ka
                    ? "ნივთის ინფორმაცია"
                    : "Item information"
                }
                text={
                  ka
                    ? "ძირითადი ინფორმაცია მპოვნელისთვის."
                    : "Basic information for the finder."
                }
              />

              <Field
                label={
                  ka
                    ? "QR კოდი"
                    : "QR code"
                }
                value={form.tag_code}
                onChange={(value) =>
                  updateField(
                    "tag_code",
                    value
                  )
                }
                placeholder="მაგ: 324242"
                required
              />

              <AlwaysVisibleField
                label={
                  category.isPet
                    ? ka
                      ? "ცხოველის სახელი"
                      : "Pet name"
                    : ka
                    ? "ნივთის დასახელება"
                    : "Item name"
                }
                value={form.item_name}
                onChange={(value) =>
                  updateField(
                    "item_name",
                    value
                  )
                }
                ka={ka}
              />

              <OptionalField
                label={
                  ka
                    ? "ფერი"
                    : "Colour"
                }
                value={form.colour}
                onChange={(value) =>
                  updateField(
                    "colour",
                    value
                  )
                }
                visible={
                  visibility.show_colour
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_colour"
                  )
                }
                ka={ka}
              />

              <PhotoField
                label={
                  category.isPet
                    ? ka
                      ? "ცხოველის ფოტო"
                      : "Pet photo"
                    : ka
                    ? "ნივთის ფოტო"
                    : "Item photo"
                }
                file={itemPhoto}
                setFile={setItemPhoto}
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

              {category.isPet ? (
                <OptionalSelect
                  label={
                    ka
                      ? "სქესი"
                      : "Sex"
                  }
                  value={form.sex}
                  onChange={(value) =>
                    updateField(
                      "sex",
                      value
                    )
                  }
                  visible={
                    visibility.show_sex
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_sex"
                    )
                  }
                  ka={ka}
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
              ) : (
                <OptionalField
                  label={
                    ka
                      ? "ბრენდი"
                      : "Brand"
                  }
                  value={form.brand}
                  onChange={(value) =>
                    updateField(
                      "brand",
                      value
                    )
                  }
                  visible={
                    visibility.show_brand
                  }
                  onToggle={() =>
                    toggleVisibility(
                      "show_brand"
                    )
                  }
                  ka={ka}
                />
              )}

              <button
                type="button"
                className="optionalButton"
                onClick={() =>
                  setShowExtraProfile(
                    !showExtraProfile
                  )
                }
              >
                {showExtraProfile
                  ? "−"
                  : "+"}{" "}
                {ka
                  ? "დამატებითი ინფორმაცია"
                  : "Additional information"}
              </button>

              {showExtraProfile && (
                <div className="optionalPanel">
                  {category.isPet ? (
                    <>
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
                        ka={ka}
                      />

                      <OptionalField
                        label={
                          ka
                            ? "წონა"
                            : "Weight"
                        }
                        type="number"
                        value={
                          form.weight
                        }
                        onChange={(value) =>
                          updateField(
                            "weight",
                            value
                          )
                        }
                        visible={
                          visibility.show_weight
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_weight"
                          )
                        }
                        ka={ka}
                      />

                      <OptionalTextArea
                        label={
                          ka
                            ? "სამედიცინო ინფორმაცია"
                            : "Medical information"
                        }
                        value={
                          form.medical_info
                        }
                        onChange={(value) =>
                          updateField(
                            "medical_info",
                            value
                          )
                        }
                        visible={
                          visibility.show_medical_info
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_medical_info"
                          )
                        }
                        ka={ka}
                      />
                    </>
                  ) : (
                    <>
                      <OptionalField
                        label={
                          ka
                            ? "მოდელი"
                            : "Model"
                        }
                        value={form.model}
                        onChange={(value) =>
                          updateField(
                            "model",
                            value
                          )
                        }
                        visible={
                          visibility.show_model
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_model"
                          )
                        }
                        ka={ka}
                      />

                      <OptionalField
                        label={
                          ka
                            ? "ზომა"
                            : "Size"
                        }
                        value={form.size}
                        onChange={(value) =>
                          updateField(
                            "size",
                            value
                          )
                        }
                        visible={
                          visibility.show_size
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_size"
                          )
                        }
                        ka={ka}
                      />

                      <OptionalField
                        label={
                          ka
                            ? "მასალა"
                            : "Material"
                        }
                        value={form.material}
                        onChange={(value) =>
                          updateField(
                            "material",
                            value
                          )
                        }
                        visible={
                          visibility.show_material
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_material"
                          )
                        }
                        ka={ka}
                      />

                      <OptionalTextArea
                        label={
                          ka
                            ? "განმასხვავებელი ნიშნები"
                            : "Distinctive features"
                        }
                        value={
                          form.distinctive_features
                        }
                        onChange={(value) =>
                          updateField(
                            "distinctive_features",
                            value
                          )
                        }
                        visible={
                          visibility.show_distinctive_features
                        }
                        onToggle={() =>
                          toggleVisibility(
                            "show_distinctive_features"
                          )
                        }
                        ka={ka}
                      />
                    </>
                  )}

                  <OptionalTextArea
                    label={
                      ka
                        ? "დამატებითი აღწერა"
                        : "Additional description"
                    }
                    value={
                      form.description
                    }
                    onChange={(value) =>
                      updateField(
                        "description",
                        value
                      )
                    }
                    visible={
                      visibility.show_description
                    }
                    onToggle={() =>
                      toggleVisibility(
                        "show_description"
                      )
                    }
                    ka={ka}
                  />
                </div>
              )}

              {error && (
                <ErrorBox text={error} />
              )}

              <button
                type="button"
                className="mainButton full"
                onClick={nextStep}
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
                    ? "მფლობელის ინფორმაცია"
                    : "Owner information"
                }
                text={
                  ka
                    ? "თქვენი სახელი, გვარი და მობილურის ნომერი მპოვნელისთვის ყოველთვის ხილული იქნება."
                    : "Your full name and phone number will always be visible to the finder."
                }
              />

              <div className="importantNotice">
                <strong>
                  {ka
                    ? "სავალდებულო და ყოველთვის ხილული"
                    : "Required and always visible"}
                </strong>

                <p>
                  {ka
                    ? "სახელი, გვარი და მობილურის ნომერი საჭიროა, რათა მპოვნელმა შეძლოს თქვენთან დაკავშირება."
                    : "Your name and phone number are required so the finder can contact you."}
                </p>
              </div>

              <div className="grid2">
                <AlwaysVisibleField
                  label={
                    ka
                      ? "სახელი"
                      : "First name"
                  }
                  value={
                    form.owner_first_name
                  }
                  onChange={(value) =>
                    updateField(
                      "owner_first_name",
                      value
                    )
                  }
                  ka={ka}
                />

                <AlwaysVisibleField
                  label={
                    ka
                      ? "გვარი"
                      : "Last name"
                  }
                  value={
                    form.owner_last_name
                  }
                  onChange={(value) =>
                    updateField(
                      "owner_last_name",
                      value
                    )
                  }
                  ka={ka}
                />
              </div>

              <AlwaysVisibleField
                label={
                  ka
                    ? "მობილურის ნომერი"
                    : "Phone number"
                }
                type="tel"
                value={
                  form.owner_phone
                }
                onChange={(value) =>
                  updateField(
                    "owner_phone",
                    value
                  )
                }
                ka={ka}
              />

              <RequiredOptionalVisibilityField
                label={
                  ka
                    ? "ელფოსტა"
                    : "Email"
                }
                type="email"
                value={
                  form.owner_email
                }
                onChange={(value) =>
                  updateField(
                    "owner_email",
                    value
                  )
                }
                visible={
                  visibility.show_owner_email
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_owner_email"
                  )
                }
                ka={ka}
              />

              <PhotoField
                label={
                  ka
                    ? "მფლობელის ფოტო"
                    : "Owner photo"
                }
                file={ownerPhoto}
                setFile={setOwnerPhoto}
                visible={
                  visibility.show_owner_photo
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_owner_photo"
                  )
                }
                ka={ka}
              />

              <div className="contactBox">
                <strong>
                  {ka
                    ? "როგორ შეუძლია მპოვნელმა დაგიკავშირდეთ?"
                    : "How can the finder contact you?"}
                </strong>

                <p>
                  {ka
                    ? "აირჩიეთ მინიმუმ ერთი. შეგიძლიათ მონიშნოთ ერთი, ორი ან სამივე."
                    : "Choose at least one. You can select one, two, or all three."}
                </p>

                <ContactMethod
                  icon="📞"
                  title={
                    ka
                      ? "მობილური"
                      : "Phone"
                  }
                  active={
                    phoneEnabled
                  }
                  onClick={() =>
                    setPhoneEnabled(
                      !phoneEnabled
                    )
                  }
                />

                <ContactMethod
                  icon="🟢"
                  title="WhatsApp"
                  active={
                    whatsappEnabled
                  }
                  onClick={() =>
                    setWhatsappEnabled(
                      !whatsappEnabled
                    )
                  }
                />

                <ContactMethod
                  icon="💬"
                  title="Live Chat"
                  active={
                    liveChatEnabled
                  }
                  onClick={() =>
                    setLiveChatEnabled(
                      !liveChatEnabled
                    )
                  }
                />
              </div>

              <button
                type="button"
                className="optionalButton"
                onClick={() =>
                  setShowExtraContact(
                    !showExtraContact
                  )
                }
              >
                {showExtraContact
                  ? "−"
                  : "+"}{" "}
                {ka
                  ? "დამატებითი საკონტაქტო პირი"
                  : "Additional contact person"}
              </button>

              {showExtraContact && (
                <div className="optionalPanel">
                  <div className="visibilityHeader">
                    <div>
                      <strong>
                        {ka
                          ? "დამატებითი პირის ჩვენება"
                          : "Show additional contact"}
                      </strong>

                      <small className="optionalLabel">
                        {ka
                          ? "ნებაყოფლობითი"
                          : "Optional"}
                      </small>
                    </div>

                    <VisibilityToggle
                      active={
                        visibility.show_additional_contact
                      }
                      onClick={() =>
                        toggleVisibility(
                          "show_additional_contact"
                        )
                      }
                    />
                  </div>

                  <Field
                    label={
                      ka
                        ? "სახელი და გვარი"
                        : "Full name"
                    }
                    value={
                      form.additional_contact_name
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_name",
                        value
                      )
                    }
                  />

                  <Field
                    label={
                      ka
                        ? "ტელეფონი"
                        : "Phone"
                    }
                    type="tel"
                    value={
                      form.additional_contact_phone
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_phone",
                        value
                      )
                    }
                  />

                  <Field
                    label={
                      ka
                        ? "ელფოსტა"
                        : "Email"
                    }
                    type="email"
                    value={
                      form.additional_contact_email
                    }
                    onChange={(value) =>
                      updateField(
                        "additional_contact_email",
                        value
                      )
                    }
                  />
                </div>
              )}

              {error && (
                <ErrorBox text={error} />
              )}

              <div className="buttons">
                <button
                  type="button"
                  className="backButton"
                  onClick={previousStep}
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="button"
                  className="mainButton"
                  onClick={nextStep}
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
                    ? "ინფორმაცია მპოვნელისთვის"
                    : "Information for the finder"
                }
                text={
                  ka
                    ? "დაასრულეთ პროფილის შექმნა."
                    : "Finish creating your profile."
                }
              />

              <OptionalTextArea
                label={
                  ka
                    ? "შეტყობინება მპოვნელისთვის"
                    : "Message for the finder"
                }
                value={
                  form.finder_message
                }
                onChange={(value) =>
                  updateField(
                    "finder_message",
                    value
                  )
                }
                visible={
                  visibility.show_finder_message
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_finder_message"
                  )
                }
                ka={ka}
              />

              <OptionalField
                label={
                  ka
                    ? "ბოლო ნანახი ადგილი"
                    : "Last seen location"
                }
                value={
                  form.lost_seen_location
                }
                onChange={(value) =>
                  updateField(
                    "lost_seen_location",
                    value
                  )
                }
                visible={
                  visibility.show_lost_seen_location
                }
                onToggle={() =>
                  toggleVisibility(
                    "show_lost_seen_location"
                  )
                }
                ka={ka}
              />

              <div className="locationCard">
                <div>
                  <strong>
                    {ka
                      ? "ლოკაციის გაზიარება"
                      : "Location sharing"}
                  </strong>

                  <p>
                    {ka
                      ? "თუ ჩართავთ, მპოვნელს სურვილის შემთხვევაში შეეძლება თავისი მიმდინარე ლოკაციის გამოგზავნა."
                      : "If enabled, the finder may choose to send their current location."}
                  </p>
                </div>

                <VisibilityToggle
                  active={
                    locationSharingEnabled
                  }
                  onClick={() =>
                    setLocationSharingEnabled(
                      !locationSharingEnabled
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
                  onClick={previousStep}
                >
                  ←{" "}
                  {ka
                    ? "უკან"
                    : "Back"}
                </button>

                <button
                  type="submit"
                  className="mainButton"
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
  ka,
  language,
  setLanguage,
}: {
  ka: boolean;
  language: Language;
  setLanguage: (value: Language) => void;
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
            SMART LOST & FOUND
          </small>
        </div>
      </a>

      <div className="headerRight">
        <a
          href="/register"
          className="headerBack"
        >
          ← {ka ? "უკან" : "Back"}
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
              setLanguage("ka")
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
              setLanguage("en")
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
        className={[
          "circle",
          active ? "active" : "",
          current ? "current" : "",
        ].join(" ")}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="field">
      <span>
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function AlwaysVisibleField({
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
    <div className="requiredVisibleField">
      <label>
        <span>
          {label} *
        </span>

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
      </label>

      <div className="alwaysVisibleBadge">
        ✓{" "}
        {ka
          ? "სავალდებულო • მპოვნელისთვის ხილული"
          : "Required • Visible to finder"}
      </div>
    </div>
  );
}

function RequiredOptionalVisibilityField({
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
    <div className="visibilityField">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label} *
          </strong>

          <small className="requiredFillLabel">
            {ka
              ? "შევსება სავალდებულოა • ჩვენება თქვენი არჩევანია"
              : "Required to complete • Visibility is your choice"}
          </small>
        </div>

        <VisibilityToggle
          active={visible}
          onClick={onToggle}
        />
      </div>

      <input
        type={type}
        required
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
      />

      <small>
        {ka
          ? "მპოვნელისთვის:"
          : "For finder:"}{" "}
        <b>
          {visible
            ? ka
              ? "ხილული"
              : "Visible"
            : ka
            ? "დამალული"
            : "Hidden"}
        </b>
      </small>
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
    <div className="visibilityField">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
          </strong>

          <small className="optionalLabel">
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </small>
        </div>

        <VisibilityToggle
          active={visible}
          onClick={onToggle}
        />
      </div>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <small>
        {ka
          ? "მპოვნელისთვის ჩვენება:"
          : "Show to finder:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
    </div>
  );
}

function OptionalSelect({
  label,
  value,
  onChange,
  visible,
  onToggle,
  options,
  ka,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  options: {
    value: string;
    label: string;
  }[];
  ka: boolean;
}) {
  return (
    <div className="visibilityField">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
          </strong>

          <small className="optionalLabel">
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </small>
        </div>

        <VisibilityToggle
          active={visible}
          onClick={onToggle}
        />
      </div>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={
              option.value || "empty"
            }
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      <small>
        {ka
          ? "მპოვნელისთვის ჩვენება:"
          : "Show to finder:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
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
    <div className="visibilityField">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
          </strong>

          <small className="optionalLabel">
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </small>
        </div>

        <VisibilityToggle
          active={visible}
          onClick={onToggle}
        />
      </div>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <small>
        {ka
          ? "მპოვნელისთვის ჩვენება:"
          : "Show to finder:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
    </div>
  );
}

function PhotoField({
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
    <div className="photoBox">
      <div className="visibilityHeader">
        <div>
          <strong>
            {label}
          </strong>

          <small className="optionalLabel">
            {ka
              ? "ნებაყოფლობითი"
              : "Optional"}
          </small>
        </div>

        <VisibilityToggle
          active={visible}
          onClick={onToggle}
        />
      </div>

      <label className="photo">
        <input
          type="file"
          accept="image/*"
          onChange={(event) =>
            setFile(
              event.target.files?.[0] ||
                null
            )
          }
        />

        <b>
          {file ? "✓" : "+"}
        </b>

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
              ? "მაქსიმუმ 5 MB"
              : "Maximum 5 MB"}
          </small>
        </div>
      </label>

      <small className="visibilityStatus">
        {ka
          ? "მპოვნელისთვის ჩვენება:"
          : "Show to finder:"}{" "}
        <b>
          {visible
            ? "ON"
            : "OFF"}
        </b>
      </small>
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
        {active ? "✓" : ""}
      </span>
    </button>
  );
}

function VisibilityToggle({
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
      aria-pressed={active}
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
    <div className="error">
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
        font-family:
          Inter,
          Arial,
          sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e8ecf1;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #1465e8;
        color: white;
        font-size: 12px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #1465e8;
        font-size: 20px;
      }

      .brand small {
        display: block;
        color: #98a2b3;
        font-size: 7px;
        letter-spacing: 2px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .headerBack {
        color: #475467;
        text-decoration: none;
        font-size: 12px;
        font-weight: 700;
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
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages .selected {
        background: white;
        color: #1465e8;
      }

      .content {
        width: calc(100% - 24px);
        max-width: 760px;
        margin: auto;
        padding: 45px 0 80px;
      }

      .intro {
        display: flex;
        gap: 16px;
      }

      .categoryIcon {
        width: 58px;
        height: 58px;
        flex: 0 0 58px;
        display: grid;
        place-items: center;
        border-radius: 18px;
        background: #eaf2ff;
        font-size: 31px;
      }

      .eyebrow {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .intro h1 {
        margin: 7px 0;
        font-size: 40px;
      }

      .intro p {
        margin: 0;
        color: #667085;
        font-size: 13px;
      }

      .privacyNotice {
        margin-top: 24px;
        padding: 17px;
        display: flex;
        gap: 12px;
        border: 1px solid #d9e6fb;
        border-radius: 15px;
        background: #f2f7ff;
      }

      .privacyIcon {
        width: 35px;
        height: 35px;
        flex: 0 0 35px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: white;
      }

      .privacyNotice strong {
        color: #344054;
        font-size: 12px;
      }

      .privacyNotice p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.55;
      }

      .importantNotice {
        margin-bottom: 18px;
        padding: 15px;
        border-radius: 13px;
        background: #f2f7ff;
      }

      .importantNotice strong {
        color: #1465e8;
        font-size: 11px;
      }

      .importantNotice p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
      }

      .progress {
        margin: 34px 0 24px;
        display: flex;
        align-items: center;
      }

      .progressItem {
        min-width: 72px;
        text-align: center;
      }

      .circle {
        width: 34px;
        height: 34px;
        margin: auto;
        display: grid;
        place-items: center;
        border: 1px solid #d4dae2;
        border-radius: 50%;
        background: white;
        color: #98a2b3;
        font-size: 10px;
        font-weight: 900;
      }

      .circle.active {
        border-color: #1465e8;
        color: #1465e8;
      }

      .circle.current {
        background: #1465e8;
        color: white;
      }

      .progressItem small {
        display: block;
        margin-top: 6px;
        color: #7b8492;
        font-size: 9px;
        font-weight: 800;
      }

      .line {
        flex: 1;
        height: 1px;
        margin-bottom: 20px;
        background: #dce1e8;
      }

      .line.active {
        background: #1465e8;
      }

      .card {
        padding: 28px;
        border: 1px solid #e2e7ed;
        border-radius: 23px;
        background: white;
      }

      .stepTitle {
        margin-bottom: 26px;
        display: flex;
        gap: 13px;
      }

      .stepTitle > b {
        color: #1465e8;
        font-size: 10px;
      }

      .stepTitle h2 {
        margin: 0;
        font-size: 22px;
      }

      .stepTitle p {
        margin: 6px 0 0;
        color: #7b8492;
        font-size: 12px;
        line-height: 1.5;
      }

      .grid2 {
        display: grid;
        grid-template-columns:
          repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .field,
      .visibilityField,
      .requiredVisibleField {
        display: block;
        margin-bottom: 16px;
      }

      .field > span,
      .requiredVisibleField label > span,
      .visibilityHeader strong {
        display: block;
        color: #344054;
        font-size: 14px;
        font-weight: 800;
      }

      .field > span,
      .requiredVisibleField label > span {
        margin-bottom: 7px;
      }

      .field input,
      .requiredVisibleField input,
      .visibilityField input,
      .visibilityField select,
      .visibilityField textarea {
        width: 100%;
        border: 1px solid #d5dae1;
        border-radius: 12px;
        background: white;
        outline: none;
      }

      .field input,
      .requiredVisibleField input,
      .visibilityField input,
      .visibilityField select {
        height: 54px;
        padding: 0 14px;
      }

      .visibilityField textarea {
        min-height: 105px;
        padding: 14px;
        resize: vertical;
      }

      .alwaysVisibleBadge {
        margin-top: 6px;
        color: #16803b;
        font-size: 9px;
        font-weight: 800;
      }

      .visibilityHeader {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .visibilityField > small,
      .visibilityStatus {
        display: block;
        margin-top: 6px;
        color: #98a2b3;
        font-size: 10px;
      }

      .visibilityField > small b,
      .visibilityStatus b {
        color: #1465e8;
      }

      .optionalLabel,
      .requiredFillLabel {
        display: block;
        margin-top: 3px;
        color: #98a2b3;
        font-size: 9px;
        font-weight: 500;
      }

      .requiredFillLabel {
        color: #667085;
      }

      .photoBox {
        margin-bottom: 16px;
        padding: 15px;
        border: 1px dashed #c7ced8;
        border-radius: 14px;
        background: #fafbfc;
      }

      .photo {
        min-height: 65px;
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
      }

      .photo input {
        display: none;
      }

      .photo > b {
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;
        border-radius: 11px;
        background: #eaf2ff;
        color: #1465e8;
        font-size: 20px;
      }

      .photo strong,
      .photo small {
        display: block;
      }

      .photo strong {
        font-size: 12px;
      }

      .photo small {
        margin-top: 4px;
        color: #8a94a3;
        font-size: 10px;
      }

      .optionalButton {
        width: 100%;
        min-height: 50px;
        padding: 0 14px;
        border: 1px solid #e0e5eb;
        border-radius: 12px;
        background: #f8fafc;
        color: #344054;
        text-align: left;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }

      .optionalPanel {
        margin-top: 13px;
        padding: 18px;
        border-radius: 14px;
        background: #f8fafc;
      }

      .contactBox {
        margin: 20px 0;
        padding: 18px;
        border: 1px solid #e0e5eb;
        border-radius: 15px;
        background: #f8fafc;
      }

      .contactBox > strong {
        font-size: 14px;
      }

      .contactBox > p {
        margin: 5px 0 12px;
        color: #7b8492;
        font-size: 10px;
      }

      .contactMethod {
        width: 100%;
        min-height: 60px;
        margin-top: 9px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #dce2e9;
        border-radius: 12px;
        background: white;
        cursor: pointer;
      }

      .contactMethod.active {
        border-color: #1465e8;
        background: #f3f7fd;
      }

      .contactIcon {
        width: 38px;
        height: 38px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #eef4ff;
      }

      .contactMethod strong {
        flex: 1;
        text-align: left;
        color: #344054;
        font-size: 13px;
      }

      .check {
        width: 23px;
        height: 23px;
        display: grid;
        place-items: center;
        border: 1px solid #cdd4dd;
        border-radius: 7px;
        color: white;
      }

      .check.active {
        border-color: #1465e8;
        background: #1465e8;
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
        background: #1465e8;
      }

      .switch.active span {
        transform: translateX(21px);
      }

      .locationCard {
        margin-top: 15px;
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border: 1px solid #e0e5eb;
        border-radius: 14px;
        background: #f9fafb;
      }

      .locationCard strong {
        font-size: 13px;
      }

      .locationCard p {
        margin: 5px 0 0;
        color: #7b8492;
        font-size: 10px;
        line-height: 1.5;
      }

      .buttons {
        margin-top: 25px;
        display: flex;
        gap: 10px;
      }

      .mainButton,
      .backButton {
        min-height: 52px;
        padding: 0 20px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      .mainButton {
        margin-left: auto;
        border: 0;
        background: #1465e8;
        color: white;
      }

      .mainButton.full {
        width: 100%;
        margin-top: 25px;
      }

      .backButton {
        border: 1px solid #d5dae1;
        background: white;
        color: #475467;
      }

      .mainButton:disabled {
        opacity: 0.6;
      }

      .error {
        margin-top: 17px;
        padding: 13px;
        border-radius: 11px;
        background: #fff1f1;
        color: #b42318;
        font-size: 11px;
        font-weight: 700;
      }

      .successPage {
        width: calc(100% - 24px);
        max-width: 580px;
        margin: auto;
        padding: 110px 0;
        text-align: center;
      }

      .successIcon {
        width: 68px;
        height: 68px;
        margin: 0 auto 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #e9f8ef;
        color: #16803b;
        font-size: 28px;
        font-weight: 900;
      }

      .successButton {
        margin-top: 25px;
        display: inline-flex;
        align-items: center;
        text-decoration: none;
      }

      @media (max-width: 600px) {
        .headerBack {
          display: none;
        }

        .content {
          padding-top: 28px;
        }

        .intro h1 {
          font-size: 29px;
        }

        .grid2 {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .card {
          padding: 20px 14px;
        }

        .field input,
        .requiredVisibleField input,
        .visibilityField input,
        .visibilityField select,
        .visibilityField textarea {
          font-size: 16px;
        }

        .buttons {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
        }

        .mainButton,
        .backButton {
          width: 100%;
          margin: 0;
        }
      }
    `}</style>
  );
}
