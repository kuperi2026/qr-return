"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type ProfileType =
  | "dog"
  | "cat"
  | "keys"
  | "wallet"
  | "bag"
  | "suitcase";

type Owner = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string | null;
  photo: string | null;
};

const allowedTypes: ProfileType[] = [
  "dog",
  "cat",
  "keys",
  "wallet",
  "bag",
  "suitcase",
];

const typeConfig: Record<
  ProfileType,
  {
    icon: string;
    ka: string;
    en: string;
  }
> = {
  dog: {
    icon: "🐶",
    ka: "ძაღლი",
    en: "Dog",
  },

  cat: {
    icon: "🐱",
    ka: "კატა",
    en: "Cat",
  },

  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
  },

  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },

  bag: {
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
  },

  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },
};

export default function RegisterItemPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const profileType = allowedTypes.includes(
    rawType as ProfileType
  )
    ? (rawType as ProfileType)
    : null;

  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  const [owner, setOwner] =
    useState<Owner | null>(null);

  const [itemName, setItemName] =
    useState("");

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [colour, setColour] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [sex, setSex] =
    useState("");

  const [dateOfBirth, setDateOfBirth] =
    useState("");

  const [weight, setWeight] =
    useState("");

  const [medicalInfo, setMedicalInfo] =
    useState("");

  const [behaviourNote, setBehaviourNote] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [size, setSize] =
    useState("");

  const [material, setMaterial] =
    useState("");

  const [features, setFeatures] =
    useState("");

  const [finderMessage, setFinderMessage] =
    useState("");

  const [additionalName, setAdditionalName] =
    useState("");

  const [additionalPhone, setAdditionalPhone] =
    useState("");

  const [additionalEmail, setAdditionalEmail] =
    useState("");

  // OWNER VISIBILITY

  const [showOwnerName] =
    useState(true);

  const [showOwnerPhone] =
    useState(true);

  const [
    showOwnerEmail,
    setShowOwnerEmail,
  ] = useState(false);

  const [
    showOwnerAddress,
    setShowOwnerAddress,
  ] = useState(false);

  const [
    showOwnerPhoto,
    setShowOwnerPhoto,
  ] = useState(false);

  // PROFILE VISIBILITY

  const [
    showPhoto,
    setShowPhoto,
  ] = useState(true);

  const [
    showColour,
    setShowColour,
  ] = useState(true);

  const [
    showSex,
    setShowSex,
  ] = useState(true);

  const [
    showDateOfBirth,
    setShowDateOfBirth,
  ] = useState(true);

  const [
    showWeight,
    setShowWeight,
  ] = useState(true);

  const [
    showMedicalInfo,
    setShowMedicalInfo,
  ] = useState(true);

  const [
    showBehaviourNote,
    setShowBehaviourNote,
  ] = useState(true);

  const [
    showBrand,
    setShowBrand,
  ] = useState(true);

  const [
    showModel,
    setShowModel,
  ] = useState(true);

  const [
    showSize,
    setShowSize,
  ] = useState(true);

  const [
    showMaterial,
    setShowMaterial,
  ] = useState(true);

  const [
    showFeatures,
    setShowFeatures,
  ] = useState(true);

  const [
    showDescription,
    setShowDescription,
  ] = useState(true);

  const [
    showFinderMessage,
    setShowFinderMessage,
  ] = useState(true);

  const [
    showAdditionalContact,
    setShowAdditionalContact,
  ] = useState(false);

  // CONTACT METHODS

  const [
    phoneEnabled,
    setPhoneEnabled,
  ] = useState(true);

  const [
    whatsappEnabled,
    setWhatsappEnabled,
  ] = useState(false);

  const [
    liveChatEnabled,
    setLiveChatEnabled,
  ] = useState(true);

  const [
    locationSharingEnabled,
    setLocationSharingEnabled,
  ] = useState(false);

  // LOST MODE

  const [
    lostMode,
    setLostMode,
  ] = useState(false);

  // PREVIEW

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const isPet =
    profileType === "dog" ||
    profileType === "cat";

  const current = useMemo(() => {
    if (!profileType) {
      return null;
    }

    return typeConfig[profileType];
  }, [profileType]);

  useEffect(() => {
    loadOwner();
  }, []);

  async function loadOwner() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href =
          "/login";

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("owner_accounts")
        .select(
          `
          user_id,
          first_name,
          last_name,
          email,
          phone,
          address,
          photo
          `
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      setOwner(
        data as Owner
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "მფლობელის პროფილი ვერ ჩაიტვირთა."
          : "Could not load owner profile."
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadPhoto(
    userId: string
  ) {
    if (!photoFile) {
      return null;
    }

    const safeName =
      photoFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const path =
      `${userId}/${Date.now()}-${safeName}`;

    const {
      error,
    } = await supabase.storage
      .from("qr-return-images")
      .upload(
        path,
        photoFile
      );

    if (error) {
      throw error;
    }

    const {
      data,
    } = supabase.storage
      .from("qr-return-images")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function saveProfile(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      !profileType ||
      !owner
    ) {
      return;
    }

    if (!itemName.trim()) {
      setError(
        ka
          ? "პროფილის სახელი სავალდებულოა."
          : "Profile name is required."
      );

      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        window.location.href =
          "/login";

        return;
      }

      const photo =
        await uploadPhoto(
          user.id
        );

      const tagCode =
        "QR-" +
        crypto.randomUUID()
          .replace(
            /-/g,
            ""
          )
          .slice(
            0,
            12
          )
          .toUpperCase();

      const row: Record<
        string,
        unknown
      > = {
        owner_id:
          user.id,

        owner_name:
          `${owner.first_name} ${owner.last_name}`.trim(),

        owner_email:
          owner.email,

        owner_phone:
          owner.phone,

        owner_address:
          owner.address,

        owner_photo:
          owner.photo,

        item_name:
          itemName.trim(),

        item_type:
          isPet
            ? "pet"
            : profileType,

        pet_type:
          isPet
            ? profileType
            : null,

        tag_code:
          tagCode,

        photo,

        colour:
          colour.trim() ||
          null,

        description:
          description.trim() ||
          null,

        finder_message:
          finderMessage.trim() ||
          null,

        additional_contact_name:
          additionalName.trim() ||
          null,

        additional_contact_phone:
          additionalPhone.trim() ||
          null,

        additional_contact_email:
          additionalEmail.trim() ||
          null,

        phone_enabled:
          phoneEnabled,

        whatsapp_enabled:
          whatsappEnabled,

        live_chat_enabled:
          liveChatEnabled,

        location_sharing_enabled:
          locationSharingEnabled,

        show_owner_name:
          true,

        show_owner_phone:
          true,

        show_owner_email:
          showOwnerEmail,

        show_owner_address:
          showOwnerAddress,

        show_owner_photo:
          showOwnerPhoto,

        show_photo:
          showPhoto,

        show_colour:
          showColour,

        show_description:
          showDescription,

        show_additional_contact:
          showAdditionalContact,

        show_finder_message:
          showFinderMessage,

        active:
          lostMode,
      };

      if (isPet) {
        row.sex =
          sex || null;

        row.date_of_birth =
          dateOfBirth || null;

        row.weight =
          weight.trim() || null;

        row.medical_info =
          medicalInfo.trim() ||
          null;

        row.behaviour_note =
          behaviourNote.trim() ||
          null;

        row.show_sex =
          showSex;

        row.show_date_of_birth =
          showDateOfBirth;

        row.show_weight =
          showWeight;

        row.show_medical_info =
          showMedicalInfo;

        row.show_behaviour_note =
          showBehaviourNote;
      } else {
        row.brand =
          brand.trim() ||
          null;

        row.model =
          model.trim() ||
          null;

        row.size =
          size.trim() ||
          null;

        row.material =
          material.trim() ||
          null;

        row.distinctive_features =
          features.trim() ||
          null;

        row.show_brand =
          showBrand;

        row.show_model =
          showModel;

        row.show_size =
          showSize;

        row.show_material =
          showMaterial;

        row.show_distinctive_features =
          showFeatures;
      }

      const {
        error:
          insertError,
      } =
        await supabase
          .from("item")
          .insert(row);

      if (insertError) {
        throw insertError;
      }

      window.location.href =
        "/account";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილის შექმნა ვერ მოხერხდა."
          : "Could not create profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka
          ? "იტვირთება..."
          : "Loading..."}
      </main>
    );
  }

  if (
    !profileType ||
    !current ||
    !owner
  ) {
    return (
      <main className="statePage">
        {error ||
          (ka
            ? "პროფილი ვერ მოიძებნა."
            : "Profile not found.")}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a
          href="/account"
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
              NEW QR PROFILE
            </small>
          </div>
        </a>

        <div className="languages">
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
      </header>

      <section className="container">
        <a
          href="/add-profile"
          className="back"
        >
          ←{" "}
          {ka
            ? "კატეგორიების არჩევა"
            : "Choose category"}
        </a>

        <div className="heading">
          <div className="typeIcon">
            {current.icon}
          </div>

          <div>
            <div className="eyebrow">
              QR RETURN PROFILE
            </div>

            <h1>
              {ka
                ? `${current.ka} — რეგისტრაცია`
                : `Register ${current.en}`}
            </h1>

            <p>
              {ka
                ? "შეავსეთ ინფორმაცია და თავად გადაწყვიტეთ, რა გამოუჩნდება მპოვნელს."
                : "Enter the information and choose exactly what the finder can see."}
            </p>
          </div>
        </div>

        <form onSubmit={saveProfile}>
          {/* OWNER */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  01
                </span>

                <h2>
                  {ka
                    ? "მფლობელის ინფორმაცია"
                    : "Owner information"}
                </h2>
              </div>

              <p>
                {ka
                  ? "სახელი, გვარი და მობილური სავალდებულოდ გამოჩნდება მპოვნელისთვის."
                  : "Owner name and mobile phone are always shown to the finder."}
              </p>
            </div>

            <div className="ownerPreview">
              <div className="ownerAvatar">
                {owner.photo ? (
                  <img
                    src={
                      owner.photo
                    }
                    alt=""
                  />
                ) : (
                  "👤"
                )}
              </div>

              <div>
                <strong>
                  {
                    owner.first_name
                  }{" "}
                  {
                    owner.last_name
                  }
                </strong>

                <p>
                  📞{" "}
                  {owner.phone}
                </p>

                <p>
                  ✉️{" "}
                  {owner.email}
                </p>

                {owner.address && (
                  <p>
                    📍{" "}
                    {
                      owner.address
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="toggleGrid">
              <Toggle
                label={
                  ka
                    ? "სახელი და გვარი"
                    : "Name"
                }
                value={
                  showOwnerName
                }
                locked
              />

              <Toggle
                label={
                  ka
                    ? "მობილური"
                    : "Mobile"
                }
                value={
                  showOwnerPhone
                }
                locked
              />

              <Toggle
                label={
                  ka
                    ? "ელფოსტა"
                    : "Email"
                }
                value={
                  showOwnerEmail
                }
                setValue={
                  setShowOwnerEmail
                }
              />

              <Toggle
                label={
                  ka
                    ? "მისამართი"
                    : "Address"
                }
                value={
                  showOwnerAddress
                }
                setValue={
                  setShowOwnerAddress
                }
              />

              <Toggle
                label={
                  ka
                    ? "მფლობელის ფოტო"
                    : "Owner photo"
                }
                value={
                  showOwnerPhoto
                }
                setValue={
                  setShowOwnerPhoto
                }
              />
            </div>

            <div className="lockedNote">
              🔒{" "}
              {ka
                ? "სახელი, გვარი და მობილური გამორთვა შეუძლებელია."
                : "Name and mobile cannot be hidden."}
            </div>
          </section>

          {/* PROFILE */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  02
                </span>

                <h2>
                  {ka
                    ? `${current.ka} — ინფორმაცია`
                    : `${current.en} information`}
                </h2>
              </div>
            </div>

            <label>
              <span>
                {isPet
                  ? ka
                    ? "სახელი"
                    : "Name"
                  : ka
                  ? "პროფილის სახელი"
                  : "Profile name"}{" "}
                *
              </span>

              <input
                value={
                  itemName
                }
                onChange={(e) =>
                  setItemName(
                    e.target.value
                  )
                }
                placeholder={
                  isPet
                    ? ka
                      ? "მაგ. Toby"
                      : "e.g. Toby"
                    : ka
                    ? "მაგ. ჩემი შავი ჩემოდანი"
                    : "e.g. My black suitcase"
                }
                required
              />
            </label>

            <label>
              <span>
                {ka
                  ? "ფოტო"
                  : "Photo"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotoFile(
                    e.target
                      .files?.[0] ??
                      null
                  )
                }
              />
            </label>

            <Toggle
              label={
                ka
                  ? "ფოტო გამოჩნდეს"
                  : "Show photo"
              }
              value={
                showPhoto
              }
              setValue={
                setShowPhoto
              }
            />

            <label>
              <span>
                {ka
                  ? "ფერი"
                  : "Color"}
              </span>

              <input
                value={
                  colour
                }
                onChange={(e) =>
                  setColour(
                    e.target.value
                  )
                }
              />
            </label>

            <Toggle
              label={
                ka
                  ? "ფერი გამოჩნდეს"
                  : "Show color"
              }
              value={
                showColour
              }
              setValue={
                setShowColour
              }
            />

            {isPet ? (
              <>
                <div className="two">
                  <label>
                    <span>
                      {ka
                        ? "სქესი"
                        : "Sex"}
                    </span>

                    <select
                      value={
                        sex
                      }
                      onChange={(
                        e
                      ) =>
                        setSex(
                          e.target
                            .value
                        )
                      }
                    >
                      <option value="">
                        {ka
                          ? "აირჩიეთ"
                          : "Select"}
                      </option>

                      <option value="male">
                        {ka
                          ? "მამრობითი"
                          : "Male"}
                      </option>

                      <option value="female">
                        {ka
                          ? "მდედრობითი"
                          : "Female"}
                      </option>
                    </select>
                  </label>

                  <label>
                    <span>
                      {ka
                        ? "დაბადების თარიღი"
                        : "Date of birth"}
                    </span>

                    <input
                      type="date"
                      value={
                        dateOfBirth
                      }
                      onChange={(
                        e
                      ) =>
                        setDateOfBirth(
                          e.target
                            .value
                        )
                      }
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={
                      ka
                        ? "სქესი გამოჩნდეს"
                        : "Show sex"
                    }
                    value={
                      showSex
                    }
                    setValue={
                      setShowSex
                    }
                  />

                  <Toggle
                    label={
                      ka
                        ? "დაბადების თარიღი გამოჩნდეს"
                        : "Show birth date"
                    }
                    value={
                      showDateOfBirth
                    }
                    setValue={
                      setShowDateOfBirth
                    }
                  />
                </div>

                <label>
                  <span>
                    {ka
                      ? "წონა"
                      : "Weight"}
                  </span>

                  <input
                    value={
                      weight
                    }
                    onChange={(
                      e
                    ) =>
                      setWeight(
                        e.target
                          .value
                      )
                    }
                    placeholder={
                      ka
                        ? "მაგ. 8 კგ"
                        : "e.g. 8 kg"
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "წონა გამოჩნდეს"
                      : "Show weight"
                  }
                  value={
                    showWeight
                  }
                  setValue={
                    setShowWeight
                  }
                />

                <label>
                  <span>
                    {ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical information"}
                  </span>

                  <textarea
                    value={
                      medicalInfo
                    }
                    onChange={(
                      e
                    ) =>
                      setMedicalInfo(
                        e.target
                          .value
                      )
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "სამედიცინო ინფორმაცია გამოჩნდეს"
                      : "Show medical information"
                  }
                  value={
                    showMedicalInfo
                  }
                  setValue={
                    setShowMedicalInfo
                  }
                />

                <label>
                  <span>
                    {ka
                      ? "ქცევის შესახებ ინფორმაცია"
                      : "Behaviour information"}
                  </span>

                  <textarea
                    value={
                      behaviourNote
                    }
                    onChange={(
                      e
                    ) =>
                      setBehaviourNote(
                        e.target
                          .value
                      )
                    }
                    placeholder={
                      ka
                        ? "მაგ. მეგობრულია, მაგრამ შეიძლება შეშინებული იყოს."
                        : "e.g. Friendly, but may be scared."
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "ქცევის ინფორმაცია გამოჩნდეს"
                      : "Show behaviour information"
                  }
                  value={
                    showBehaviourNote
                  }
                  setValue={
                    setShowBehaviourNote
                  }
                />
              </>
            ) : (
              <>
                <div className="two">
                  <label>
                    <span>
                      {ka
                        ? "ბრენდი"
                        : "Brand"}
                    </span>

                    <input
                      value={
                        brand
                      }
                      onChange={(
                        e
                      ) =>
                        setBrand(
                          e.target
                            .value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>
                      {ka
                        ? "მოდელი"
                        : "Model"}
                    </span>

                    <input
                      value={
                        model
                      }
                      onChange={(
                        e
                      ) =>
                        setModel(
                          e.target
                            .value
                        )
                      }
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={
                      ka
                        ? "ბრენდი გამოჩნდეს"
                        : "Show brand"
                    }
                    value={
                      showBrand
                    }
                    setValue={
                      setShowBrand
                    }
                  />

                  <Toggle
                    label={
                      ka
                        ? "მოდელი გამოჩნდეს"
                        : "Show model"
                    }
                    value={
                      showModel
                    }
                    setValue={
                      setShowModel
                    }
                  />
                </div>

                <div className="two">
                  <label>
                    <span>
                      {ka
                        ? "ზომა"
                        : "Size"}
                    </span>

                    <input
                      value={
                        size
                      }
                      onChange={(
                        e
                      ) =>
                        setSize(
                          e.target
                            .value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>
                      {ka
                        ? "მასალა"
                        : "Material"}
                    </span>

                    <input
                      value={
                        material
                      }
                      onChange={(
                        e
                      ) =>
                        setMaterial(
                          e.target
                            .value
                        )
                      }
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={
                      ka
                        ? "ზომა გამოჩნდეს"
                        : "Show size"
                    }
                    value={
                      showSize
                    }
                    setValue={
                      setShowSize
                    }
                  />

                  <Toggle
                    label={
                      ka
                        ? "მასალა გამოჩნდეს"
                        : "Show material"
                    }
                    value={
                      showMaterial
                    }
                    setValue={
                      setShowMaterial
                    }
                  />
                </div>

                <label>
                  <span>
                    {ka
                      ? "განსაკუთრებული ნიშნები"
                      : "Distinctive features"}
                  </span>

                  <textarea
                    value={
                      features
                    }
                    onChange={(
                      e
                    ) =>
                      setFeatures(
                        e.target
                          .value
                      )
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "განსაკუთრებული ნიშნები გამოჩნდეს"
                      : "Show distinctive features"
                  }
                  value={
                    showFeatures
                  }
                  setValue={
                    setShowFeatures
                  }
                />
              </>
            )}

            <label>
              <span>
                {ka
                  ? "დამატებითი აღწერა"
                  : "Additional description"}
              </span>

              <textarea
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />
            </label>

            <Toggle
              label={
                ka
                  ? "აღწერა გამოჩნდეს"
                  : "Show description"
              }
              value={
                showDescription
              }
              setValue={
                setShowDescription
              }
            />
          </section>

          {/* ADDITIONAL CONTACT */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  03
                </span>

                <h2>
                  {ka
                    ? "დამატებითი საკონტაქტო პირი"
                    : "Additional contact"}
                </h2>
              </div>

              <p>
                {ka
                  ? "ეს არ არის Account Admin. ეს არის ადამიანი, ვისაც მპოვნელმა შეიძლება დაუკავშირდეს."
                  : "This is not the Account Admin. This is another person a finder may contact."}
              </p>
            </div>

            <Toggle
              label={
                ka
                  ? "დამატებითი საკონტაქტო პირი გამოჩნდეს"
                  : "Show additional contact"
              }
              value={
                showAdditionalContact
              }
              setValue={
                setShowAdditionalContact
              }
            />

            <label>
              <span>
                {ka
                  ? "სახელი და გვარი"
                  : "Full name"}
              </span>

              <input
                value={
                  additionalName
                }
                onChange={(e) =>
                  setAdditionalName(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                {ka
                  ? "ტელეფონი"
                  : "Phone"}
              </span>

              <input
                type="tel"
                value={
                  additionalPhone
                }
                onChange={(e) =>
                  setAdditionalPhone(
                    e.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                {ka
                  ? "ელფოსტა"
                  : "Email"}
              </span>

              <input
                type="email"
                value={
                  additionalEmail
                }
                onChange={(e) =>
                  setAdditionalEmail(
                    e.target.value
                  )
                }
              />
            </label>
          </section>

          {/* CONTACT METHODS */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  04
                </span>

                <h2>
                  {ka
                    ? "დაკავშირების მეთოდები"
                    : "Contact methods"}
                </h2>
              </div>

              <p>
                {ka
                  ? "თითოეული მეთოდი შეგიძლიათ დამოუკიდებლად ჩართოთ ან გამორთოთ."
                  : "Each contact method can be enabled or disabled separately."}
              </p>
            </div>

            <div className="toggleGrid">
              <Toggle
                label={
                  ka
                    ? "📞 ტელეფონი"
                    : "📞 Phone"
                }
                value={
                  phoneEnabled
                }
                setValue={
                  setPhoneEnabled
                }
              />

              <Toggle
                label="💬 WhatsApp"
                value={
                  whatsappEnabled
                }
                setValue={
                  setWhatsappEnabled
                }
              />

              <Toggle
                label="💬 Live Chat"
                value={
                  liveChatEnabled
                }
                setValue={
                  setLiveChatEnabled
                }
              />

              <Toggle
                label={
                  ka
                    ? "📍 ლოკაციის გაზიარება"
                    : "📍 Location sharing"
                }
                value={
                  locationSharingEnabled
                }
                setValue={
                  setLocationSharingEnabled
                }
              />
            </div>
          </section>

          {/* FINDER MESSAGE */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  05
                </span>

                <h2>
                  {ka
                    ? "მპოვნელისთვის შეტყობინება"
                    : "Finder message"}
                </h2>
              </div>
            </div>

            <Toggle
              label={
                ka
                  ? "შეტყობინება გამოჩნდეს"
                  : "Show finder message"
              }
              value={
                showFinderMessage
              }
              setValue={
                setShowFinderMessage
              }
            />

            <textarea
              className="standaloneTextarea"
              value={
                finderMessage
              }
              onChange={(e) =>
                setFinderMessage(
                  e.target.value
                )
              }
              placeholder={
                ka
                  ? "მაგ. გთხოვთ დამიკავშირდეთ. დიდი მადლობა!"
                  : "e.g. Please contact me. Thank you!"
              }
            />
          </section>

          {/* LOST MODE */}

          <section className="card">
            <div className="sectionHeading">
              <div>
                <span className="sectionNumber">
                  06
                </span>

                <h2>
                  Lost Mode
                </h2>
              </div>
            </div>

            <div
              className={`lostBox ${
                lostMode
                  ? "lost"
                  : ""
              }`}
            >
              <div>
                <strong>
                  {lostMode
                    ? ka
                      ? "დაკარგულად მონიშნულია"
                      : "Marked as lost"
                    : ka
                    ? "უსაფრთხოდ არის"
                    : "Marked as safe"}
                </strong>

                <p>
                  {ka
                    ? "Lost Mode-ის ჩართვისას მპოვნელისთვის აქტიურდება თქვენს მიერ არჩეული საკონტაქტო ინფორმაცია."
                    : "When Lost Mode is enabled, your selected finder contact information becomes active."}
                </p>
              </div>

              <button
                type="button"
                className={`switch ${
                  lostMode
                    ? "on danger"
                    : ""
                }`}
                onClick={() =>
                  setLostMode(
                    (value) =>
                      !value
                  )
                }
              >
                <span />
              </button>
            </div>
          </section>

          {/* PREVIEW */}

          <section className="card">
            <div className="previewHeader">
              <div>
                <span className="sectionNumber">
                  07
                </span>

                <h2>
                  {ka
                    ? "მპოვნელის ხედვა"
                    : "Finder Preview"}
                </h2>

                <p>
                  {ka
                    ? "ნახეთ რას დაინახავს ადამიანი QR კოდის დასკანერებისას."
                    : "Preview what a finder will see after scanning the QR code."}
                </p>
              </div>

              <button
                type="button"
                className="previewButton"
                onClick={() =>
                  setPreviewOpen(
                    (value) =>
                      !value
                  )
                }
              >
                👁{" "}
                {previewOpen
                  ? ka
                    ? "დახურვა"
                    : "Close"
                  : ka
                  ? "ნახვა"
                  : "Preview"}
              </button>
            </div>

            {previewOpen && (
              <div className="preview">
                <div
                  className={`previewStatus ${
                    lostMode
                      ? "previewLost"
                      : "previewSafe"
                  }`}
                >
                  {lostMode
                    ? "🚨 LOST"
                    : "✓ SAFE"}
                </div>

                <h3>
                  {current.icon}{" "}
                  {itemName ||
                    (ka
                      ? current.ka
                      : current.en)}
                </h3>

                <div className="previewOwner">
                  <strong>
                    {ka
                      ? "მფლობელი"
                      : "Owner"}
                  </strong>

                  <p>
                    {
                      owner.first_name
                    }{" "}
                    {
                      owner.last_name
                    }
                  </p>

                  <p>
                    📞{" "}
                    {owner.phone}
                  </p>

                  {showOwnerEmail && (
                    <p>
                      ✉️{" "}
                      {
                        owner.email
                      }
                    </p>
                  )}

                  {showOwnerAddress &&
                    owner.address && (
                      <p>
                        📍{" "}
                        {
                          owner.address
                        }
                      </p>
                    )}

                  {showOwnerPhoto &&
                    owner.photo && (
                      <img
                        className="previewOwnerPhoto"
                        src={
                          owner.photo
                        }
                        alt=""
                      />
                    )}
                </div>

                {showColour &&
                  colour && (
                    <PreviewLine
                      label={
                        ka
                          ? "ფერი"
                          : "Color"
                      }
                      value={
                        colour
                      }
                    />
                  )}

                {isPet &&
                  showSex &&
                  sex && (
                    <PreviewLine
                      label={
                        ka
                          ? "სქესი"
                          : "Sex"
                      }
                      value={
                        sex ===
                        "male"
                          ? ka
                            ? "მამრობითი"
                            : "Male"
                          : ka
                          ? "მდედრობითი"
                          : "Female"
                      }
                    />
                  )}

                {isPet &&
                  showDateOfBirth &&
                  dateOfBirth && (
                    <PreviewLine
                      label={
                        ka
                          ? "დაბადების თარიღი"
                          : "Date of birth"
                      }
                      value={
                        dateOfBirth
                      }
                    />
                  )}

                {isPet &&
                  showWeight &&
                  weight && (
                    <PreviewLine
                      label={
                        ka
                          ? "წონა"
                          : "Weight"
                      }
                      value={
                        weight
                      }
                    />
                  )}

                {isPet &&
                  showMedicalInfo &&
                  medicalInfo && (
                    <PreviewLong
                      label={
                        ka
                          ? "სამედიცინო ინფორმაცია"
                          : "Medical information"
                      }
                      value={
                        medicalInfo
                      }
                    />
                  )}

                {isPet &&
                  showBehaviourNote &&
                  behaviourNote && (
                    <PreviewLong
                      label={
                        ka
                          ? "ქცევის ინფორმაცია"
                          : "Behaviour information"
                      }
                      value={
                        behaviourNote
                      }
                    />
                  )}

                {!isPet &&
                  showBrand &&
                  brand && (
                    <PreviewLine
                      label={
                        ka
                          ? "ბრენდი"
                          : "Brand"
                      }
                      value={
                        brand
                      }
                    />
                  )}

                {!isPet &&
                  showModel &&
                  model && (
                    <PreviewLine
                      label={
                        ka
                          ? "მოდელი"
                          : "Model"
                      }
                      value={
                        model
                      }
                    />
                  )}

                {!isPet &&
                  showSize &&
                  size && (
                    <PreviewLine
                      label={
                        ka
                          ? "ზომა"
                          : "Size"
                      }
                      value={
                        size
                      }
                    />
                  )}

                {!isPet &&
                  showMaterial &&
                  material && (
                    <PreviewLine
                      label={
                        ka
                          ? "მასალა"
                          : "Material"
                      }
                      value={
                        material
                      }
                    />
                  )}

                {!isPet &&
                  showFeatures &&
                  features && (
                    <PreviewLong
                      label={
                        ka
                          ? "განსაკუთრებული ნიშნები"
                          : "Distinctive features"
                      }
                      value={
                        features
                      }
                    />
                  )}

                {showDescription &&
                  description && (
                    <PreviewLong
                      label={
                        ka
                          ? "აღწერა"
                          : "Description"
                      }
                      value={
                        description
                      }
                    />
                  )}

                {showFinderMessage &&
                  finderMessage && (
                    <div className="finderMessage">
                      “
                      {
                        finderMessage
                      }
                      ”
                    </div>
                  )}

                {showAdditionalContact &&
                  (additionalName ||
                    additionalPhone ||
                    additionalEmail) && (
                    <div className="additionalPreview">
                      <strong>
                        {ka
                          ? "დამატებითი საკონტაქტო პირი"
                          : "Additional contact"}
                      </strong>

                      {additionalName && (
                        <p>
                          👤{" "}
                          {
                            additionalName
                          }
                        </p>
                      )}

                      {additionalPhone && (
                        <p>
                          📞{" "}
                          {
                            additionalPhone
                          }
                        </p>
                      )}

                      {additionalEmail && (
                        <p>
                          ✉️{" "}
                          {
                            additionalEmail
                          }
                        </p>
                      )}
                    </div>
                  )}

                {lostMode && (
                  <div className="contactPreview">
                    {phoneEnabled && (
                      <span>
                        📞 Phone
                      </span>
                    )}

                    {whatsappEnabled && (
                      <span>
                        💬 WhatsApp
                      </span>
                    )}

                    {liveChatEnabled && (
                      <span>
                        💬 Live Chat
                      </span>
                    )}

                    {locationSharingEnabled && (
                      <span>
                        📍 Location
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {error && (
            <div className="errorBox">
              {error}
            </div>
          )}

          <div className="actions">
            <a href="/account">
              {ka
                ? "გაუქმება"
                : "Cancel"}
            </a>

            <button
              type="submit"
              disabled={
                saving
              }
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "QR პროფილის შექმნა"
                : "Create QR profile"}
            </button>
          </div>
        </form>
      </section>

      <Styles />
    </main>
  );
}

function Toggle({
  label,
  value,
  setValue,
  locked = false,
}: {
  label: string;
  value: boolean;
  setValue?: (
    value: boolean
  ) => void;
  locked?: boolean;
}) {
  return (
    <div className="toggleRow">
      <span>
        {label}
      </span>

      <button
        type="button"
        className={`switch ${
          value
            ? "on"
            : ""
        } ${
          locked
            ? "locked"
            : ""
        }`}
        disabled={
          locked
        }
        onClick={() => {
          if (
            !locked &&
            setValue
          ) {
            setValue(
              !value
            );
          }
        }}
      >
        <span />
      </button>
    </div>
  );
}

function PreviewLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="previewLine">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function PreviewLong({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="previewLong">
      <span>
        {label}
      </span>

      <p>
        {value}
      </p>
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
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      input,
      textarea,
      select,
      button {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 8% 10%,
            rgba(20, 101, 232, 0.07),
            transparent 28%
          ),
          radial-gradient(
            circle at 94% 8%,
            rgba(118, 85, 247, 0.07),
            transparent 28%
          ),
          #f7f9fc;
      }

      .statePage {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 30px;
        text-align: center;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1000px;
        min-height: 86px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .logo {
        width: 50px;
        height: 50px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 21px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 3px;
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 10px;
        background: #eaecf0;
      }

      .languages button {
        padding: 8px 10px;
        border: 0;
        border-radius: 8px;
        background: transparent;
        color: #667085;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .container {
        width: calc(100% - 36px);
        max-width: 850px;
        margin: auto;
        padding: 50px 0 90px;
      }

      .back {
        color: #667085;
        font-size: 13px;
        font-weight: 800;
        text-decoration: none;
      }

      .heading {
        margin: 35px 0;
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .typeIcon {
        width: 76px;
        height: 76px;
        flex: 0 0 76px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f0edff
        );
        font-size: 39px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .heading h1 {
        margin: 6px 0;
        font-size: 34px;
      }

      .heading p {
        margin: 0;
        color: #667085;
        font-size: 13px;
        line-height: 1.6;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .card {
        padding: 28px;
        border: 1px solid #e4e7ec;
        border-radius: 20px;
        background: white;
        box-shadow: 0 10px 28px rgba(16, 24, 40, 0.04);
      }

      .sectionHeading {
        margin-bottom: 22px;
      }

      .sectionHeading > div {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .sectionNumber {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
      }

      .sectionHeading h2,
      .previewHeader h2 {
        margin: 0;
        font-size: 21px;
      }

      .sectionHeading > p,
      .previewHeader p {
        margin: 8px 0 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      label {
        display: block;
        margin-top: 18px;
      }

      label > span {
        display: block;
        margin-bottom: 7px;
        color: #475467;
        font-size: 13px;
        font-weight: 800;
      }

      input,
      textarea,
      select {
        width: 100%;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        background: white;
        outline: none;
      }

      input,
      select {
        height: 50px;
        padding: 0 13px;
      }

      textarea {
        min-height: 105px;
        padding: 13px;
        resize: vertical;
      }

      .standaloneTextarea {
        margin-top: 15px;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: #84adff;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      .two {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .ownerPreview {
        display: flex;
        gap: 14px;
        align-items: center;
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 14px;
        background: #f7f9fc;
      }

      .ownerAvatar {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        display: grid;
        place-items: center;
        overflow: hidden;
        border-radius: 15px;
        background: #eef4ff;
        font-size: 25px;
      }

      .ownerAvatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ownerPreview p {
        margin: 3px 0;
        color: #667085;
        font-size: 11px;
      }

      .toggleGrid {
        margin-top: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .toggleRow {
        min-height: 49px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid #eaecf0;
        border-radius: 11px;
        background: #fff;
      }

      .toggleRow > span {
        color: #344054;
        font-size: 12px;
        font-weight: 800;
      }

      .switch {
        width: 46px;
        height: 26px;
        flex: 0 0 46px;
        padding: 3px;
        border: 0;
        border-radius: 999px;
        background: #d0d5dd;
        cursor: pointer;
      }

      .switch span {
        width: 20px;
        height: 20px;
        display: block;
        border-radius: 50%;
        background: white;
        transition: transform 0.2s ease;
      }

      .switch.on {
        background: #1465e8;
      }

      .switch.on span {
        transform: translateX(20px);
      }

      .switch.danger.on {
        background: #d92d20;
      }

      .switch.locked {
        opacity: 0.75;
        cursor: default;
      }

      .lockedNote {
        margin-top: 13px;
        padding: 11px;
        border-radius: 10px;
        background: #f2f4f7;
        color: #667085;
        font-size: 10px;
      }

      .lostBox {
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        border: 1px solid #abefc6;
        border-radius: 14px;
        background: #ecfdf3;
      }

      .lostBox.lost {
        border-color: #fecdca;
        background: #fff1f0;
      }

      .lostBox strong {
        font-size: 13px;
      }

      .lostBox p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.5;
      }

      .previewHeader {
        display: flex;
        justify-content: space-between;
        gap: 20px;
      }

      .previewHeader > div > .sectionNumber {
        margin-bottom: 10px;
      }

      .previewButton {
        height: 42px;
        padding: 0 15px;
        border: 0;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }

      .preview {
        margin-top: 20px;
        padding: 20px;
        border: 1px solid #e4e7ec;
        border-radius: 15px;
        background: #f7f9fc;
      }

      .previewStatus {
        width: fit-content;
        padding: 6px 9px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 900;
      }

      .previewSafe {
        background: #ecfdf3;
        color: #027a48;
      }

      .previewLost {
        background: #fff1f0;
        color: #b42318;
      }

      .preview h3 {
        margin: 15px 0;
        font-size: 23px;
      }

      .previewOwner,
      .additionalPreview,
      .finderMessage,
      .previewLong {
        margin-top: 13px;
        padding: 13px;
        border-radius: 11px;
        background: white;
      }

      .previewOwner p,
      .additionalPreview p {
        margin: 5px 0;
        color: #475467;
        font-size: 11px;
      }

      .previewOwnerPhoto {
        width: 60px;
        height: 60px;
        margin-top: 8px;
        object-fit: cover;
        border-radius: 12px;
      }

      .previewLine {
        margin-top: 9px;
        padding: 11px 13px;
        display: flex;
        justify-content: space-between;
        gap: 15px;
        border-radius: 10px;
        background: white;
      }

      .previewLine span,
      .previewLong span {
        color: #98a2b3;
        font-size: 10px;
        font-weight: 800;
      }

      .previewLine strong {
        color: #344054;
        font-size: 11px;
      }

      .previewLong p {
        margin: 5px 0 0;
        color: #475467;
        font-size: 11px;
        line-height: 1.6;
      }

      .finderMessage {
        color: #344054;
        font-size: 12px;
        line-height: 1.6;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f1edff
        );
      }

      .contactPreview {
        margin-top: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .contactPreview span {
        padding: 8px 10px;
        border-radius: 8px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 10px;
        font-weight: 800;
      }

      .errorBox {
        padding: 13px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 12px;
      }

      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }

      .actions a,
      .actions button {
        min-height: 48px;
        padding: 0 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .actions a {
        color: #667085;
      }

      .actions button {
        border: 0;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        cursor: pointer;
      }

      .actions button:disabled {
        opacity: 0.65;
      }

      @media (max-width: 650px) {
        .two,
        .toggleGrid {
          grid-template-columns: 1fr;
        }

        .previewHeader {
          flex-direction: column;
        }

        .previewButton {
          width: 100%;
        }

        .card {
          padding: 21px;
        }

        .heading h1 {
          font-size: 28px;
        }
      }
    `}</style>
  );
}
