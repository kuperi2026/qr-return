"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type FormData = {
  tagCode: string;
  itemName: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  colour: string;
  sex: string;
  dateOfBirth: string;
  weight: string;
  medicalInfo: string;
  finderMessage: string;
  contactPreference: string;
  description: string;
  brand: string;
  model: string;
  size: string;
  material: string;
  distinctiveFeatures: string;
};

const TYPE_CONFIG: Record<
  string,
  {
    icon: string;
    ka: string;
    en: string;
    itemType: string;
    petType: string | null;
    isPet: boolean;
  }
> = {
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
};

const TEXT = {
  ka: {
    brandSub: "SCAN • CONNECT • RETURN",
    back: "მთავარზე დაბრუნება",
    eyebrow: "პროფილის შექმნა",
    title: "დაარეგისტრირე",
    subtitle:
      "შეავსე ინფორმაცია, რომელიც დაგვეხმარება ნივთის ან ცხოველის უსაფრთხოდ დაბრუნებაში.",
    step1: "ძირითადი",
    step2: "დეტალები",
    step3: "კონტაქტი",
    step4: "მზადაა",
    section1: "ძირითადი ინფორმაცია",
    section1Sub: "QR კოდი და მთავარი მონაცემები",
    section2: "დამატებითი დეტალები",
    section2Sub: "ეს ინფორმაცია მპოვნელს ამოცნობაში დაეხმარება",
    section3: "მფლობელი და კონტაქტი",
    section3Sub: "როგორ დაგიკავშირდეს მპოვნელი",
    tag: "QR Tag Code",
    tagHint: "ჩაწერე QR ტეგზე დაბეჭდილი უნიკალური კოდი.",
    itemNamePet: "ცხოველის სახელი",
    itemNameItem: "ნივთის სახელი",
    ownerName: "მფლობელის სახელი",
    ownerPhone: "ტელეფონის ნომერი",
    ownerEmail: "ელფოსტა",
    colour: "ფერი",
    sex: "სქესი",
    male: "მამრობითი",
    female: "მდედრობითი",
    select: "აირჩიე",
    dob: "დაბადების თარიღი",
    weight: "წონა",
    medical: "სამედიცინო ინფორმაცია",
    medicalPlaceholder:
      "მაგ. ალერგია, მედიკამენტი, განსაკუთრებული საჭიროება...",
    finderMessage: "შეტყობინება მპოვნელისთვის",
    finderPlaceholder:
      "მაგ. გთხოვთ დამიკავშირდეთ. ცხოველი მეგობრულია...",
    contactPreference: "სასურველი დაკავშირების მეთოდი",
    phone: "ტელეფონი",
    email: "ელფოსტა",
    both: "ტელეფონი და ელფოსტა",
    description: "აღწერა",
    descriptionPlaceholder:
      "მოკლე აღწერა, რომელიც ნივთის ამოცნობაში დაეხმარება...",
    brand: "ბრენდი",
    model: "მოდელი",
    size: "ზომა",
    material: "მასალა",
    distinctive: "განმასხვავებელი ნიშნები",
    distinctivePlaceholder:
      "ნაკაწრი, სტიკერი, ინიციალები ან სხვა ნიშანი...",
    photo: "ფოტო",
    photoSub: "დაამატე ფოტო უკეთესი ამოცნობისთვის",
    choosePhoto: "ფოტოს არჩევა",
    changePhoto: "ფოტოს შეცვლა",
    remove: "წაშლა",
    location: "ლოკაციის გაზიარება",
    locationSub:
      "თუ ჩართულია, მპოვნელს შეუძლია თავისი მდებარეობა გაგიზიაროს.",
    ownerMessage: "მფლობელის შეტყობინება",
    ownerMessageSub:
      "მპოვნელისთვის გამოჩნდება შენ მიერ დაწერილი შეტყობინება.",
    active: "ტეგის გააქტიურება",
    activeSub: "აქტიური ტეგი მზად იქნება სკანირებისთვის.",
    save: "პროფილის შენახვა",
    saving: "ინახება...",
    required: "სავალდებულო",
    successTitle: "პროფილი წარმატებით შეიქმნა",
    successText:
      "QR ტეგი დაკავშირებულია შენს პროფილთან და მზადაა გამოყენებისთვის.",
    registerAnother: "სხვა ნივთის რეგისტრაცია",
    home: "მთავარ გვერდზე დაბრუნება",
    errorRequired:
      "შეავსე ყველა სავალდებულო ველი.",
    errorTag:
      "QR Tag Code სავალდებულოა.",
    errorSave:
      "შენახვა ვერ მოხერხდა.",
    photoReady: "ფოტო არჩეულია",
    petDetails: "ცხოველის დეტალები",
    itemDetails: "ნივთის დეტალები",
  },

  en: {
    brandSub: "SCAN • CONNECT • RETURN",
    back: "Back to home",
    eyebrow: "CREATE PROFILE",
    title: "Register your",
    subtitle:
      "Add the information that can help return your pet or item safely.",
    step1: "Basic",
    step2: "Details",
    step3: "Contact",
    step4: "Ready",
    section1: "Basic information",
    section1Sub: "QR code and primary details",
    section2: "Additional details",
    section2Sub:
      "This information can help the finder identify it",
    section3: "Owner & contact",
    section3Sub: "Choose how a finder can reach you",
    tag: "QR Tag Code",
    tagHint: "Enter the unique code printed on the QR tag.",
    itemNamePet: "Pet name",
    itemNameItem: "Item name",
    ownerName: "Owner name",
    ownerPhone: "Phone number",
    ownerEmail: "Email",
    colour: "Color",
    sex: "Sex",
    male: "Male",
    female: "Female",
    select: "Select",
    dob: "Date of birth",
    weight: "Weight",
    medical: "Medical information",
    medicalPlaceholder:
      "Allergies, medication, special needs...",
    finderMessage: "Message for finder",
    finderPlaceholder:
      "Please contact me. My pet is friendly...",
    contactPreference: "Preferred contact method",
    phone: "Phone",
    email: "Email",
    both: "Phone and email",
    description: "Description",
    descriptionPlaceholder:
      "Add a short description that can help identify the item...",
    brand: "Brand",
    model: "Model",
    size: "Size",
    material: "Material",
    distinctive: "Distinctive features",
    distinctivePlaceholder:
      "Scratch, sticker, initials or another unique feature...",
    photo: "Photo",
    photoSub: "Add a photo for easier identification",
    choosePhoto: "Choose photo",
    changePhoto: "Change photo",
    remove: "Remove",
    location: "Location sharing",
    locationSub:
      "When enabled, a finder can share their current location with you.",
    ownerMessage: "Owner message",
    ownerMessageSub:
      "Your finder message will be visible to the person who scans the tag.",
    active: "Activate tag",
    activeSub: "An active tag will be ready for scanning.",
    save: "Save profile",
    saving: "Saving...",
    required: "Required",
    successTitle: "Profile created successfully",
    successText:
      "Your QR tag is now connected to this profile and ready to use.",
    registerAnother: "Register another item",
    home: "Return to home",
    errorRequired:
      "Please complete all required fields.",
    errorTag: "QR Tag Code is required.",
    errorSave: "Could not save the profile.",
    photoReady: "Photo selected",
    petDetails: "Pet details",
    itemDetails: "Item details",
  },
};

const INITIAL_FORM: FormData = {
  tagCode: "",
  itemName: "",
  ownerName: "",
  ownerPhone: "",
  ownerEmail: "",
  colour: "",
  sex: "",
  dateOfBirth: "",
  weight: "",
  medicalInfo: "",
  finderMessage: "",
  contactPreference: "both",
  description: "",
  brand: "",
  model: "",
  size: "",
  material: "",
  distinctiveFeatures: "",
};

export default function RegisterTypePage() {
  const params = useParams();

  const rawType = Array.isArray(params?.type)
    ? params.type[0]
    : params?.type;

  const type =
    typeof rawType === "string"
      ? rawType.toLowerCase()
      : "dog";

  const config =
    TYPE_CONFIG[type] ?? TYPE_CONFIG.dog;

  const [lang, setLang] = useState<Lang>("ka");
  const [form, setForm] =
    useState<FormData>(INITIAL_FORM);

  const [locationSharing, setLocationSharing] =
    useState(true);

  const [ownerMessageEnabled, setOwnerMessageEnabled] =
    useState(true);

  const [active, setActive] =
    useState(true);

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const t = TEXT[lang];

  const typeLabel =
    lang === "ka"
      ? config.ka
      : config.en;

  const completion = useMemo(() => {
    let score = 0;

    if (form.tagCode.trim()) score += 1;
    if (form.itemName.trim()) score += 1;
    if (form.ownerPhone.trim()) score += 1;
    if (form.ownerEmail.trim()) score += 1;

    return score;
  }, [form]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

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

  function handlePhoto(
    file: File | null
  ) {
    if (!file) return;

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(file);
    setPhotoPreview(
      URL.createObjectURL(file)
    );
  }

  function removePhoto() {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoFile(null);
    setPhotoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function uploadPhoto(
    tagCode: string
  ) {
    if (!photoFile) {
      return null;
    }

    const safeTag = tagCode
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    const extension =
      photoFile.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const filePath =
      `items/${safeTag}-${Date.now()}.${extension}`;

    const { error: uploadError } =
      await supabase.storage
        .from("item-photos")
        .upload(
          filePath,
          photoFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from("item-photos")
        .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanTag =
      form.tagCode.trim();

    const cleanItemName =
      form.itemName.trim();

    const cleanPhone =
      form.ownerPhone.trim();

    const cleanEmail =
      form.ownerEmail.trim();

    if (!cleanTag) {
      setError(t.errorTag);
      return;
    }

    if (
      !cleanItemName ||
      !cleanPhone ||
      !cleanEmail
    ) {
      setError(
        t.errorRequired
      );
      return;
    }

    setSaving(true);

    try {
      let photoUrl: string | null =
        null;

      if (photoFile) {
        photoUrl =
          await uploadPhoto(
            cleanTag
          );
      }

      const weightValue =
        config.isPet &&
        form.weight.trim() !== ""
          ? Number(
              form.weight
            )
          : null;

      if (
        weightValue !== null &&
        Number.isNaN(
          weightValue
        )
      ) {
        throw new Error(
          lang === "ka"
            ? "წონა სწორად ჩაწერე."
            : "Enter a valid weight."
        );
      }

      const payload = {
        tag_code: cleanTag,

        item_type:
          config.itemType,

        pet_type:
          config.petType,

        item_name:
          cleanItemName,

        owner_phone:
          cleanPhone,

        owner_email:
          cleanEmail,

        colour:
          form.colour.trim() ||
          null,

        sex:
          config.isPet
            ? form.sex || null
            : null,

        date_of_birth:
          config.isPet
            ? form.dateOfBirth ||
              null
            : null,

        weight:
          weightValue,

        medical_info:
          config.isPet
            ? form.medicalInfo.trim() ||
              null
            : null,

        finder_message:
          form.finderMessage.trim() ||
          null,

        contact_preference:
          form.contactPreference ||
          "both",

        location_sharing_enabled:
          locationSharing,

        owner_message_enabled:
          ownerMessageEnabled,

        description:
          form.description.trim() ||
          null,

        brand:
          !config.isPet
            ? form.brand.trim() ||
              null
            : null,

        model:
          !config.isPet
            ? form.model.trim() ||
              null
            : null,

        size:
          !config.isPet
            ? form.size.trim() ||
              null
            : null,

        material:
          !config.isPet
            ? form.material.trim() ||
              null
            : null,

        distinctive_features:
          !config.isPet
            ? form.distinctiveFeatures.trim() ||
              null
            : null,

        active,

        lost_at: null,

        lost_message: null,

        scan_count: 0,

        last_scanned_at: null,

        last_scan_latitude: null,

        last_scan_longitude: null,

        last_scan_accuracy: null,

        photo_url:
          photoUrl,

        owner_name:
          form.ownerName.trim() ||
          null,
      };

      const {
        error: insertError,
      } = await supabase
        .from("item")
        .insert([
          payload,
        ]);

      if (insertError) {
        throw insertError;
      }

      setSaved(true);
    } catch (err: any) {
      console.error(
        "SAVE ERROR:",
        err
      );

      let message =
        err?.message ||
        t.errorSave;

      if (
        message
          .toLowerCase()
          .includes(
            "duplicate"
          )
      ) {
        message =
          lang === "ka"
            ? "ეს QR Tag Code უკვე გამოყენებულია. გამოიყენე სხვა კოდი."
            : "This QR Tag Code is already in use.";
      }

      setError(
        message
      );
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <>
        <main className="successPage">
          <div className="successCard">
            <div className="successIcon">
              ✓
            </div>

            <div className="successMini">
              QR RETURN
            </div>

            <h1>
              {
                t.successTitle
              }
            </h1>

            <p>
              {
                t.successText
              }
            </p>

            <div className="savedTag">
              <span>
                QR TAG
              </span>

              <strong>
                {
                  form.tagCode
                }
              </strong>
            </div>

            <div className="successActions">
              <button
                type="button"
                className="primaryButton"
                onClick={() => {
                  setSaved(
                    false
                  );

                  setForm(
                    INITIAL_FORM
                  );

                  setPhotoFile(
                    null
                  );

                  setPhotoPreview(
                    ""
                  );
                }}
              >
                {
                  t.registerAnother
                }
              </button>

              <a
                href="/"
                className="secondaryButton"
              >
                {t.home}
              </a>
            </div>
          </div>
        </main>

        <Styles />
      </>
    );
  }

  return (
    <>
      <main className="page">
        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <div className="brandMark">
              QR
            </div>

            <div className="brandText">
              <strong>
                QR RETURN
              </strong>

              <small>
                {
                  t.brandSub
                }
              </small>
            </div>
          </a>

          <div className="headerRight">
            <div className="languageSwitch">
              <button
                type="button"
                className={
                  lang ===
                  "ka"
                    ? "langActive"
                    : ""
                }
                onClick={() =>
                  setLang(
                    "ka"
                  )
                }
              >
                ქარ
              </button>

              <button
                type="button"
                className={
                  lang ===
                  "en"
                    ? "langActive"
                    : ""
                }
                onClick={() =>
                  setLang(
                    "en"
                  )
                }
              >
                ENG
              </button>
            </div>

            <a
              href="/"
              className="backLink"
            >
              ← {t.back}
            </a>
          </div>
        </header>

        <section className="hero">
          <div className="heroInner">
            <div className="heroCopy">
              <div className="eyebrow">
                {
                  t.eyebrow
                }
              </div>

              <h1>
                {t.title}{" "}
                <span>
                  {typeLabel}
                </span>
              </h1>

              <p>
                {
                  t.subtitle
                }
              </p>
            </div>

            <div className="typeBadge">
              <div className="typeIcon">
                {
                  config.icon
                }
              </div>

              <div>
                <small>
                  CATEGORY
                </small>

                <strong>
                  {
                    typeLabel
                  }
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="progressWrap">
          <div className="progressTop">
            <span>
              PROFILE
              COMPLETION
            </span>

            <strong>
              {
                completion
              }
              /4
            </strong>
          </div>

          <div className="progressBar">
            <div
              className="progressFill"
              style={{
                width: `${
                  (
                    completion /
                    4
                  ) * 100
                }%`,
              }}
            />
          </div>

          <div className="steps">
            <div>
              01{" "}
              <span>
                {
                  t.step1
                }
              </span>
            </div>

            <div>
              02{" "}
              <span>
                {
                  t.step2
                }
              </span>
            </div>

            <div>
              03{" "}
              <span>
                {
                  t.step3
                }
              </span>
            </div>

            <div>
              04{" "}
              <span>
                {
                  t.step4
                }
              </span>
            </div>
          </div>
        </section>

        <form
          className="form"
          onSubmit={
            handleSubmit
          }
        >
          <section className="formSection">
            <div className="sectionHeader">
              <div className="sectionNumber">
                01
              </div>

              <div>
                <h2>
                  {
                    t.section1
                  }
                </h2>

                <p>
                  {
                    t.section1Sub
                  }
                </p>
              </div>
            </div>

            <div className="sectionBody">
              <div className="field full">
                <label>
                  {t.tag}{" "}
                  <b>*</b>
                </label>

                <div className="tagInputWrap">
                  <div className="qrMini">
                    ▦
                  </div>

                  <input
                    value={
                      form.tagCode
                    }
                    onChange={(
                      e
                    ) =>
                      updateField(
                        "tagCode",
                        e.target
                          .value
                      )
                    }
                    placeholder="QR-000000"
                    autoCapitalize="characters"
                  />
                </div>

                <small className="hint">
                  {
                    t.tagHint
                  }
                </small>
              </div>

              <div className="twoColumns">
                <div className="field">
                  <label>
                    {config.isPet
                      ? t.itemNamePet
                      : t.itemNameItem}{" "}
                    <b>
                      *
                    </b>
                  </label>

                  <input
                    value={
                      form.itemName
                    }
                    onChange={(
                      e
                    ) =>
                      updateField(
                        "itemName",
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                <div className="field">
                  <label>
                    {
                      t.colour
                    }
                  </label>

                  <input
                    value={
                      form.colour
                    }
                    onChange={(
                      e
                    ) =>
                      updateField(
                        "colour",
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              <div className="photoBlock">
                <div className="photoCopy">
                  <div className="photoTitle">
                    {
                      t.photo
                    }
                  </div>

                  <p>
                    {
                      t.photoSub
                    }
                  </p>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(
                      e
                    ) =>
                      handlePhoto(
                        e.target
                          .files?.[0] ??
                          null
                      )
                    }
                  />

                  <div className="photoButtons">
                    <button
                      type="button"
                      className="uploadButton"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      {photoFile
                        ? t.changePhoto
                        : t.choosePhoto}
                    </button>

                    {photoFile && (
                      <button
                        type="button"
                        className="removeButton"
                        onClick={
                          removePhoto
                        }
                      >
                        {
                          t.remove
                        }
                      </button>
                    )}
                  </div>
                </div>

                <div className="photoPreview">
                  {photoPreview ? (
                    <img
                      src={
                        photoPreview
                      }
                      alt="Preview"
                    />
                  ) : (
                    <div className="photoPlaceholder">
                      <span>
                        {
                          config.icon
                        }
                      </span>

                      <small>
                        PHOTO
                      </small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionHeader">
              <div className="sectionNumber">
                02
              </div>

              <div>
                <h2>
                  {config.isPet
                    ? t.petDetails
                    : t.itemDetails}
                </h2>

                <p>
                  {
                    t.section2Sub
                  }
                </p>
              </div>
            </div>

            <div className="sectionBody">
              {config.isPet ? (
                <>
                  <div className="twoColumns">
                    <div className="field">
                      <label>
                        {
                          t.sex
                        }
                      </label>

                      <select
                        value={
                          form.sex
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "sex",
                            e.target
                              .value
                          )
                        }
                      >
                        <option value="">
                          {
                            t.select
                          }
                        </option>

                        <option value="male">
                          {
                            t.male
                          }
                        </option>

                        <option value="female">
                          {
                            t.female
                          }
                        </option>
                      </select>
                    </div>

                    <div className="field">
                      <label>
                        {
                          t.dob
                        }
                      </label>

                      <input
                        type="date"
                        value={
                          form.dateOfBirth
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "dateOfBirth",
                            e.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      {
                        t.weight
                      }
                    </label>

                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={
                        form.weight
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "weight",
                          e.target
                            .value
                        )
                      }
                    />
                  </div>

                  <div className="field">
                    <label>
                      {
                        t.medical
                      }
                    </label>

                    <textarea
                      value={
                        form.medicalInfo
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "medicalInfo",
                          e.target
                            .value
                        )
                      }
                      placeholder={
                        t.medicalPlaceholder
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="twoColumns">
                    <div className="field">
                      <label>
                        {
                          t.brand
                        }
                      </label>

                      <input
                        value={
                          form.brand
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "brand",
                            e.target
                              .value
                          )
                        }
                      />
                    </div>

                    <div className="field">
                      <label>
                        {
                          t.model
                        }
                      </label>

                      <input
                        value={
                          form.model
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "model",
                            e.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="twoColumns">
                    <div className="field">
                      <label>
                        {
                          t.size
                        }
                      </label>

                      <input
                        value={
                          form.size
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "size",
                            e.target
                              .value
                          )
                        }
                      />
                    </div>

                    <div className="field">
                      <label>
                        {
                          t.material
                        }
                      </label>

                      <input
                        value={
                          form.material
                        }
                        onChange={(
                          e
                        ) =>
                          updateField(
                            "material",
                            e.target
                              .value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      {
                        t.distinctive
                      }
                    </label>

                    <textarea
                      value={
                        form.distinctiveFeatures
                      }
                      onChange={(
                        e
                      ) =>
                        updateField(
                          "distinctiveFeatures",
                          e.target
                            .value
                        )
                      }
                      placeholder={
                        t.distinctivePlaceholder
                      }
                    />
                  </div>
                </>
              )}

              <div className="field">
                <label>
                  {
                    t.description
                  }
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(
                    e
                  ) =>
                    updateField(
                      "description",
                      e.target
                        .value
                    )
                  }
                  placeholder={
                    t.descriptionPlaceholder
                  }
                />
              </div>
            </div>
          </section>

          <section className="formSection">
            <div className="sectionHeader">
              <div className="sectionNumber">
                03
              </div>

              <div>
                <h2>
                  {
                    t.section3
                  }
                </h2>

                <p>
                  {
                    t.section3Sub
                  }
                </p>
              </div>
            </div>

            <div className="sectionBody">
              <div className="field">
                <label>
                  {
                    t.ownerName
                  }
                </label>

                <input
                  value={
                    form.ownerName
                  }
                  onChange={(
                    e
                  ) =>
                    updateField(
                      "ownerName",
                      e.target
                        .value
                    )
                  }
                />
              </div>

              <div className="twoColumns">
                <div className="field">
                  <label>
                    {
                      t.ownerPhone
                    }{" "}
                    <b>
                      *
                    </b>
                  </label>

                  <input
                    type="tel"
                    value={
                      form.ownerPhone
                    }
                    onChange={(
                      e
                    ) =>
                      updateField(
                        "ownerPhone",
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                <div className="field">
                  <label>
                    {
                      t.ownerEmail
                    }{" "}
                    <b>
                      *
                    </b>
                  </label>

                  <input
                    type="email"
                    value={
                      form.ownerEmail
                    }
                    onChange={(
                      e
                    ) =>
                      updateField(
                        "ownerEmail",
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label>
                  {
                    t.contactPreference
                  }
                </label>

                <select
                  value={
                    form.contactPreference
                  }
                  onChange={(
                    e
                  ) =>
                    updateField(
                      "contactPreference",
                      e.target
                        .value
                    )
                  }
                >
                  <option value="both">
                    {
                      t.both
                    }
                  </option>

                  <option value="phone">
                    {
                      t.phone
                    }
                  </option>

                  <option value="email">
                    {
                      t.email
                    }
                  </option>
                </select>
              </div>

              <div className="field">
                <label>
                  {
                    t.finderMessage
                  }
                </label>

                <textarea
                  value={
                    form.finderMessage
                  }
                  onChange={(
                    e
                  ) =>
                    updateField(
                      "finderMessage",
                      e.target
                        .value
                    )
                  }
                  placeholder={
                    t.finderPlaceholder
                  }
                />
              </div>

              <div className="settings">
                <ToggleRow
                  title={
                    t.location
                  }
                  subtitle={
                    t.locationSub
                  }
                  checked={
                    locationSharing
                  }
                  onChange={() =>
                    setLocationSharing(
                      (
                        value
                      ) =>
                        !value
                    )
                  }
                />

                <ToggleRow
                  title={
                    t.ownerMessage
                  }
                  subtitle={
                    t.ownerMessageSub
                  }
                  checked={
                    ownerMessageEnabled
                  }
                  onChange={() =>
                    setOwnerMessageEnabled(
                      (
                        value
                      ) =>
                        !value
                    )
                  }
                />

                <ToggleRow
                  title={
                    t.active
                  }
                  subtitle={
                    t.activeSub
                  }
                  checked={
                    active
                  }
                  onChange={() =>
                    setActive(
                      (
                        value
                      ) =>
                        !value
                    )
                  }
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="errorBox">
              <strong>
                !
              </strong>

              <span>
                {
                  error
                }
              </span>
            </div>
          )}

          <div className="submitArea">
            <div className="submitNote">
              <span>
                🔒
              </span>

              <p>
                {lang ===
                "ka"
                  ? "შენი ინფორმაცია ინახება უსაფრთხოდ."
                  : "Your information is stored securely."}
              </p>
            </div>

            <button
              type="submit"
              className="submitButton"
              disabled={
                saving
              }
            >
              <span>
                {saving
                  ? t.saving
                  : t.save}
              </span>

              {!saving && (
                <b>
                  →
                </b>
              )}
            </button>
          </div>
        </form>

        <footer className="footer">
          <div>
            <strong>
              QR RETURN
            </strong>

            <span>
              •
            </span>

            <small>
              LOST &
              FOUND
              PLATFORM
            </small>
          </div>

          <p>
            © 2026 QR
            Return
          </p>
        </footer>
      </main>

      <Styles />
    </>
  );
}

function ToggleRow({
  title,
  subtitle,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="toggleRow">
      <div>
        <strong>
          {title}
        </strong>

        <p>
          {
            subtitle
          }
        </p>
      </div>

      <button
        type="button"
        className={
          checked
            ? "toggle active"
            : "toggle"
        }
        onClick={
          onChange
        }
        aria-pressed={
          checked
        }
      >
        <span />
      </button>
    </div>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #f7f8fa;
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }

      button,
      a {
        -webkit-tap-highlight-color: transparent;
      }

      .page {
        min-height: 100vh;
        color: #111827;
        font-family: Arial, Helvetica, sans-serif;
      }

      .header {
        width: calc(100% - 40px);
        max-width: 1180px;
        min-height: 82px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e6e8ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 11px;
        color: inherit;
        text-decoration: none;
      }

      .brandMark {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #0e63e9;
        color: white;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: -0.5px;
        box-shadow: 0 7px 18px rgba(14, 99, 233, 0.2);
      }

      .brandText strong {
        display: block;
        color: #0e63e9;
        font-size: 21px;
        font-weight: 900;
        letter-spacing: -0.7px;
      }

      .brandText small {
        display: block;
        margin-top: 2px;
        color: #9aa1ac;
        font-size: 7px;
        font-weight: 700;
        letter-spacing: 2.2px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .languageSwitch {
        padding: 3px;
        display: flex;
        border: 1px solid #dde1e6;
        border-radius: 10px;
        background: #fff;
      }

      .languageSwitch button {
        min-width: 43px;
        height: 30px;
        padding: 0 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #858d98;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languageSwitch .langActive {
        background: #111827;
        color: white;
      }

      .backLink {
        color: #5e6672;
        font-size: 11px;
        font-weight: 800;
        text-decoration: none;
      }

      .hero {
        padding: 54px 20px 34px;
      }

      .heroInner {
        width: 100%;
        max-width: 920px;
        margin: 0 auto;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 30px;
      }

      .heroCopy {
        max-width: 620px;
      }

      .eyebrow {
        margin-bottom: 12px;
        color: #0e63e9;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 2.8px;
      }

      .hero h1 {
        margin: 0;
        color: #111827;
        font-size: clamp(38px, 6vw, 66px);
        font-weight: 900;
        line-height: 0.98;
        letter-spacing: -3px;
      }

      .hero h1 span {
        color: #0e63e9;
      }

      .hero p {
        max-width: 560px;
        margin: 18px 0 0;
        color: #747d89;
        font-size: 13px;
        line-height: 1.7;
      }

      .typeBadge {
        min-width: 170px;
        padding: 13px 15px;
        display: flex;
        align-items: center;
        gap: 11px;
        border: 1px solid #e1e5ea;
        border-radius: 16px;
        background: #fff;
        box-shadow: 0 8px 25px rgba(17, 24, 39, 0.04);
      }

      .typeIcon {
        width: 46px;
        height: 46px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eef4ff;
        font-size: 24px;
      }

      .typeBadge small {
        display: block;
        color: #a0a7b1;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .typeBadge strong {
        display: block;
        margin-top: 4px;
        color: #1d2633;
        font-size: 12px;
      }

      .progressWrap {
        width: calc(100% - 40px);
        max-width: 920px;
        margin: 0 auto 24px;
      }

      .progressTop {
        margin-bottom: 7px;
        display: flex;
        justify-content: space-between;
        color: #9199a4;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .progressTop strong {
        color: #0e63e9;
        font-size: 8px;
      }

      .progressBar {
        height: 3px;
        overflow: hidden;
        border-radius: 20px;
        background: #e5e8ed;
      }

      .progressFill {
        height: 100%;
        border-radius: inherit;
        background: #0e63e9;
        transition: width 0.25s ease;
      }

      .steps {
        margin-top: 9px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        color: #b0b6bf;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 0.8px;
      }

      .steps div:nth-child(2),
      .steps div:nth-child(3) {
        text-align: center;
      }

      .steps div:last-child {
        text-align: right;
      }

      .steps span {
        color: #747d89;
      }

      .form {
        width: calc(100% - 40px);
        max-width: 920px;
        margin: 0 auto;
      }

      .formSection {
        margin-bottom: 18px;
        overflow: hidden;
        border: 1px solid #e0e4e9;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 12px 35px rgba(17, 24, 39, 0.035);
      }

      .sectionHeader {
        padding: 20px 23px;
        display: flex;
        align-items: center;
        gap: 13px;
        border-bottom: 1px solid #edf0f3;
        background: #fbfcfd;
      }

      .sectionNumber {
        width: 34px;
        height: 34px;
        display: grid;
        place-items: center;
        border-radius: 10px;
        background: #0e63e9;
        color: white;
        font-size: 9px;
        font-weight: 900;
      }

      .sectionHeader h2 {
        margin: 0;
        color: #1b2430;
        font-size: 15px;
        font-weight: 900;
      }

      .sectionHeader p {
        margin: 3px 0 0;
        color: #9aa1ab;
        font-size: 9px;
      }

      .sectionBody {
        padding: 24px;
      }

      .twoColumns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .field {
        margin-bottom: 17px;
      }

      .field:last-child {
        margin-bottom: 0;
      }

      .field label {
        display: block;
        margin-bottom: 7px;
        color: #404957;
        font-size: 9px;
        font-weight: 900;
      }

      .field label b {
        color: #0e63e9;
      }

      .field input,
      .field select,
      .field textarea {
        width: 100%;
        border: 1px solid #dce1e6;
        border-radius: 11px;
        background: #fff;
        color: #111827;
        outline: none;
        transition: 0.18s ease;
      }

      .field input,
      .field select {
        height: 49px;
        padding: 0 13px;
        font-size: 11px;
      }

      .field textarea {
        min-height: 100px;
        padding: 13px;
        font-size: 11px;
        line-height: 1.55;
        resize: vertical;
      }

      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        border-color: #0e63e9;
        box-shadow: 0 0 0 3px rgba(14, 99, 233, 0.07);
      }

      .field input::placeholder,
      .field textarea::placeholder {
        color: #b3bac3;
      }

      .hint {
        display: block;
        margin-top: 6px;
        color: #9ba3ad;
        font-size: 8px;
      }

      .tagInputWrap {
        display: flex;
        align-items: center;
        border: 1px solid #dce1e6;
        border-radius: 11px;
        background: #fff;
        transition: 0.18s ease;
      }

      .tagInputWrap:focus-within {
        border-color: #0e63e9;
        box-shadow: 0 0 0 3px rgba(14, 99, 233, 0.07);
      }

      .tagInputWrap input {
        border: 0;
        box-shadow: none !important;
      }

      .qrMini {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        border-right: 1px solid #edf0f3;
        color: #0e63e9;
        font-size: 20px;
        font-weight: 900;
      }

      .photoBlock {
        margin-top: 4px;
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 1px dashed #ccd3db;
        border-radius: 14px;
        background: #fafbfc;
      }

      .photoTitle {
        color: #26303d;
        font-size: 11px;
        font-weight: 900;
      }

      .photoCopy p {
        margin: 5px 0 13px;
        color: #959da8;
        font-size: 9px;
      }

      .photoButtons {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .uploadButton,
      .removeButton {
        height: 35px;
        padding: 0 13px;
        border-radius: 9px;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .uploadButton {
        border: 0;
        background: #111827;
        color: white;
      }

      .removeButton {
        border: 1px solid #dfe3e8;
        background: white;
        color: #7b8490;
      }

      .photoPreview {
        width: 88px;
        height: 88px;
        flex: 0 0 88px;
        overflow: hidden;
        border-radius: 15px;
        background: #eef3fa;
      }

      .photoPreview img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .photoPlaceholder {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 4px;
      }

      .photoPlaceholder span {
        font-size: 30px;
      }

      .photoPlaceholder small {
        color: #a1a9b3;
        font-size: 6px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .settings {
        margin-top: 8px;
        overflow: hidden;
        border: 1px solid #e2e6eb;
        border-radius: 14px;
      }

      .toggleRow {
        min-height: 70px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        border-bottom: 1px solid #edf0f3;
      }

      .toggleRow:last-child {
        border-bottom: 0;
      }

      .toggleRow strong {
        display: block;
        color: #303a47;
        font-size: 10px;
      }

      .toggleRow p {
        max-width: 560px;
        margin: 4px 0 0;
        color: #9aa2ac;
        font-size: 8px;
        line-height: 1.45;
      }

      .toggle {
        width: 44px;
        height: 25px;
        flex: 0 0 44px;
        padding: 3px;
        border: 0;
        border-radius: 20px;
        background: #cbd1d8;
        cursor: pointer;
        transition: 0.2s ease;
      }

      .toggle span {
        display: block;
        width: 19px;
        height: 19px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
        transition: 0.2s ease;
      }

      .toggle.active {
        background: #0e63e9;
      }

      .toggle.active span {
        transform: translateX(19px);
      }

      .errorBox {
        margin: 0 0 18px;
        padding: 13px 15px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #ffd4d4;
        border-radius: 12px;
        background: #fff5f5;
        color: #b42318;
        font-size: 10px;
        font-weight: 700;
      }

      .errorBox strong {
        width: 22px;
        height: 22px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #b42318;
        color: white;
        font-size: 11px;
      }

      .submitArea {
        margin: 25px 0 65px;
        padding: 18px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 1px solid #e0e4e9;
        border-radius: 17px;
        background: #fff;
      }

      .submitNote {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .submitNote span {
        font-size: 16px;
      }

      .submitNote p {
        margin: 0;
        color: #9199a4;
        font-size: 9px;
      }

      .submitButton {
        min-width: 210px;
        height: 50px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        border: 0;
        border-radius: 12px;
        background: #0e63e9;
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 9px 24px rgba(14, 99, 233, 0.18);
      }

      .submitButton b {
        font-size: 18px;
      }

      .submitButton:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      .footer {
        width: calc(100% - 40px);
        max-width: 1180px;
        min-height: 75px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #e2e5e9;
        color: #9aa2ac;
      }

      .footer div {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .footer strong {
        color: #0e63e9;
        font-size: 10px;
      }

      .footer span,
      .footer small,
      .footer p {
        font-size: 7px;
        letter-spacing: 1px;
      }

      .successPage {
        min-height: 100vh;
        padding: 30px 20px;
        display: grid;
        place-items: center;
        background: #f7f8fa;
        font-family: Arial, Helvetica, sans-serif;
      }

      .successCard {
        width: 100%;
        max-width: 500px;
        padding: 46px 35px;
        border: 1px solid #e0e4e9;
        border-radius: 24px;
        background: white;
        text-align: center;
        box-shadow: 0 18px 55px rgba(17, 24, 39, 0.06);
      }

      .successIcon {
        width: 64px;
        height: 64px;
        margin: 0 auto 17px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #0e63e9;
        color: white;
        font-size: 28px;
        font-weight: 900;
      }

      .successMini {
        color: #0e63e9;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 2.4px;
      }

      .successCard h1 {
        margin: 10px 0;
        color: #17202c;
        font-size: 27px;
        line-height: 1.1;
      }

      .successCard > p {
        max-width: 380px;
        margin: 0 auto;
        color: #858e9a;
        font-size: 11px;
        line-height: 1.6;
      }

      .savedTag {
        margin: 25px 0;
        padding: 15px;
        border-radius: 13px;
        background: #f5f8fd;
      }

      .savedTag span {
        display: block;
        color: #9ba3ad;
        font-size: 7px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .savedTag strong {
        display: block;
        margin-top: 5px;
        color: #0e63e9;
        font-size: 19px;
        letter-spacing: 1px;
      }

      .successActions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .primaryButton,
      .secondaryButton {
        min-height: 46px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        font-size: 9px;
        font-weight: 900;
        text-decoration: none;
        cursor: pointer;
      }

      .primaryButton {
        border: 0;
        background: #0e63e9;
        color: white;
      }

      .secondaryButton {
        border: 1px solid #dce1e6;
        background: white;
        color: #56606d;
      }

      @media (max-width: 700px) {
        .header {
          width: calc(100% - 28px);
          min-height: 72px;
        }

        .brandText strong {
          font-size: 17px;
        }

        .brandText small {
          font-size: 5px;
          letter-spacing: 1.5px;
        }

        .backLink {
          display: none;
        }

        .headerRight {
          gap: 8px;
        }

        .hero {
          padding: 38px 14px 26px;
        }

        .heroInner {
          display: block;
        }

        .hero h1 {
          font-size: 42px;
          letter-spacing: -2px;
        }

        .hero p {
          font-size: 11px;
        }

        .typeBadge {
          width: fit-content;
          margin-top: 20px;
        }

        .progressWrap,
        .form {
          width: calc(100% - 28px);
        }

        .steps span {
          display: none;
        }

        .sectionHeader {
          padding: 17px;
        }

        .sectionBody {
          padding: 17px;
        }

        .twoColumns {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .field input,
        .field select,
        .field textarea {
          font-size: 16px;
        }

        .photoBlock {
          align-items: flex-start;
        }

        .photoPreview {
          width: 74px;
          height: 74px;
          flex-basis: 74px;
        }

        .toggleRow {
          padding: 13px;
        }

        .submitArea {
          padding: 14px;
          display: block;
        }

        .submitNote {
          margin-bottom: 13px;
        }

        .submitButton {
          width: 100%;
          min-width: 0;
        }

        .footer {
          width: calc(100% - 28px);
        }

        .successActions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
