"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Profile = {
  id: string;
  owner_id: string;

  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;

  tag_code: string | null;

  photo: string | null;
  colour: string | null;
  description: string | null;

  sex: string | null;
  date_of_birth: string | null;
  weight: string | null;
  medical_info: string | null;
  behaviour_note: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;

  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  owner_address: string | null;
  owner_photo: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

  finder_message: string | null;

  phone_enabled: boolean | null;
  whatsapp_enabled: boolean | null;
  live_chat_enabled: boolean | null;
  location_sharing_enabled: boolean | null;

  show_owner_name: boolean | null;
  show_owner_phone: boolean | null;
  show_owner_email: boolean | null;
  show_owner_address: boolean | null;
  show_owner_photo: boolean | null;

  show_photo: boolean | null;
  show_colour: boolean | null;
  show_description: boolean | null;

  show_sex: boolean | null;
  show_date_of_birth: boolean | null;
  show_weight: boolean | null;
  show_medical_info: boolean | null;
  show_behaviour_note: boolean | null;

  show_brand: boolean | null;
  show_model: boolean | null;
  show_size: boolean | null;
  show_material: boolean | null;
  show_distinctive_features: boolean | null;

  show_additional_contact: boolean | null;
  show_finder_message: boolean | null;

  active: boolean | null;
};

export default function EditProfilePage() {
  const params = useParams();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [lang, setLang] = useState<Lang>("ka");

  const ka = lang === "ka";

  const [profile, setProfile] = useState<Profile | null>(null);

  const [itemName, setItemName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [colour, setColour] = useState("");
  const [description, setDescription] = useState("");

  const [sex, setSex] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [weight, setWeight] = useState("");
  const [medicalInfo, setMedicalInfo] = useState("");
  const [behaviourNote, setBehaviourNote] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const [material, setMaterial] = useState("");
  const [features, setFeatures] = useState("");

  const [finderMessage, setFinderMessage] = useState("");

  const [additionalName, setAdditionalName] = useState("");
  const [additionalPhone, setAdditionalPhone] = useState("");
  const [additionalEmail, setAdditionalEmail] = useState("");

  const [showOwnerEmail, setShowOwnerEmail] = useState(false);
  const [showOwnerAddress, setShowOwnerAddress] = useState(false);
  const [showOwnerPhoto, setShowOwnerPhoto] = useState(false);

  const [showPhoto, setShowPhoto] = useState(true);
  const [showColour, setShowColour] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const [showSex, setShowSex] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showMedicalInfo, setShowMedicalInfo] = useState(true);
  const [showBehaviourNote, setShowBehaviourNote] = useState(true);

  const [showBrand, setShowBrand] = useState(true);
  const [showModel, setShowModel] = useState(true);
  const [showSize, setShowSize] = useState(true);
  const [showMaterial, setShowMaterial] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);

  const [showAdditionalContact, setShowAdditionalContact] =
    useState(false);

  const [showFinderMessage, setShowFinderMessage] =
    useState(true);

  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [locationSharingEnabled, setLocationSharingEnabled] =
    useState(false);

  const [lostMode, setLostMode] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isPet = useMemo(() => {
    if (!profile) return false;

    return (
      profile.item_type === "pet" ||
      profile.pet_type === "dog" ||
      profile.pet_type === "cat"
    );
  }, [profile]);

  useEffect(() => {
    loadProfile();
  }, [rawId]);

  async function loadProfile() {
    if (!rawId) return;

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("item")
        .select("*")
        .eq("id", rawId)
        .eq("owner_id", user.id)
        .single();

      if (error) throw error;

      const p = data as Profile;

      setProfile(p);

      setItemName(p.item_name ?? "");
      setPhoto(p.photo ?? "");
      setColour(p.colour ?? "");
      setDescription(p.description ?? "");

      setSex(p.sex ?? "");
      setDateOfBirth(p.date_of_birth ?? "");
      setWeight(p.weight ?? "");
      setMedicalInfo(p.medical_info ?? "");
      setBehaviourNote(p.behaviour_note ?? "");

      setBrand(p.brand ?? "");
      setModel(p.model ?? "");
      setSize(p.size ?? "");
      setMaterial(p.material ?? "");
      setFeatures(p.distinctive_features ?? "");

      setFinderMessage(p.finder_message ?? "");

      setAdditionalName(p.additional_contact_name ?? "");
      setAdditionalPhone(p.additional_contact_phone ?? "");
      setAdditionalEmail(p.additional_contact_email ?? "");

      setShowOwnerEmail(Boolean(p.show_owner_email));
      setShowOwnerAddress(Boolean(p.show_owner_address));
      setShowOwnerPhoto(Boolean(p.show_owner_photo));

      setShowPhoto(p.show_photo !== false);
      setShowColour(p.show_colour !== false);
      setShowDescription(p.show_description !== false);

      setShowSex(p.show_sex !== false);
      setShowDateOfBirth(p.show_date_of_birth !== false);
      setShowWeight(p.show_weight !== false);
      setShowMedicalInfo(p.show_medical_info !== false);
      setShowBehaviourNote(p.show_behaviour_note !== false);

      setShowBrand(p.show_brand !== false);
      setShowModel(p.show_model !== false);
      setShowSize(p.show_size !== false);
      setShowMaterial(p.show_material !== false);
      setShowFeatures(p.show_distinctive_features !== false);

      setShowAdditionalContact(Boolean(p.show_additional_contact));
      setShowFinderMessage(p.show_finder_message !== false);

      setPhoneEnabled(p.phone_enabled !== false);
      setWhatsappEnabled(Boolean(p.whatsapp_enabled));
      setLiveChatEnabled(p.live_chat_enabled !== false);
      setLocationSharingEnabled(Boolean(p.location_sharing_enabled));

      setLostMode(Boolean(p.active));
    } catch (err) {
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

  async function uploadPhoto(userId: string) {
    if (!photoFile) {
      return photo || null;
    }

    const safeName = photoFile.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "-"
    );

    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("qr-return-images")
      .upload(path, photoFile);

    if (error) throw error;

    const { data } = supabase.storage
      .from("qr-return-images")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile || !rawId) return;

    if (!itemName.trim()) {
      setError(
        ka
          ? "პროფილის სახელი სავალდებულოა."
          : "Profile name is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const newPhoto = await uploadPhoto(user.id);

      const updates: Record<string, unknown> = {
        item_name: itemName.trim(),

        photo: newPhoto,

        colour: colour.trim() || null,

        description: description.trim() || null,

        finder_message: finderMessage.trim() || null,

        additional_contact_name:
          additionalName.trim() || null,

        additional_contact_phone:
          additionalPhone.trim() || null,

        additional_contact_email:
          additionalEmail.trim() || null,

        phone_enabled: phoneEnabled,

        whatsapp_enabled: whatsappEnabled,

        live_chat_enabled: liveChatEnabled,

        location_sharing_enabled:
          locationSharingEnabled,

        show_owner_name: true,

        show_owner_phone: true,

        show_owner_email: showOwnerEmail,

        show_owner_address: showOwnerAddress,

        show_owner_photo: showOwnerPhoto,

        show_photo: showPhoto,

        show_colour: showColour,

        show_description: showDescription,

        show_additional_contact:
          showAdditionalContact,

        show_finder_message:
          showFinderMessage,

        active: lostMode,
      };

      if (isPet) {
        updates.sex = sex || null;

        updates.date_of_birth =
          dateOfBirth || null;

        updates.weight =
          weight.trim() || null;

        updates.medical_info =
          medicalInfo.trim() || null;

        updates.behaviour_note =
          behaviourNote.trim() || null;

        updates.show_sex =
          showSex;

        updates.show_date_of_birth =
          showDateOfBirth;

        updates.show_weight =
          showWeight;

        updates.show_medical_info =
          showMedicalInfo;

        updates.show_behaviour_note =
          showBehaviourNote;
      } else {
        updates.brand =
          brand.trim() || null;

        updates.model =
          model.trim() || null;

        updates.size =
          size.trim() || null;

        updates.material =
          material.trim() || null;

        updates.distinctive_features =
          features.trim() || null;

        updates.show_brand =
          showBrand;

        updates.show_model =
          showModel;

        updates.show_size =
          showSize;

        updates.show_material =
          showMaterial;

        updates.show_distinctive_features =
          showFeatures;
      }

      /*
        IMPORTANT:
        item_type და pet_type აქ საერთოდ არ იცვლება.
        ამიტომ Dog დარჩება Dog-ად,
        Cat დარჩება Cat-ად,
        Wallet დარჩება Wallet-ად და ა.შ.
      */

      const { error } = await supabase
        .from("item")
        .update(updates)
        .eq("id", rawId)
        .eq("owner_id", user.id);

      if (error) throw error;

      setPhoto(newPhoto ?? "");

      setSuccess(
        ka
          ? "ცვლილებები წარმატებით შეინახა."
          : "Changes saved successfully."
      );
    } catch (err) {
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

  function getTypeInfo() {
    if (!profile) {
      return {
        icon: "🏷️",
        ka: "QR პროფილი",
        en: "QR Profile",
      };
    }

    if (profile.pet_type === "dog") {
      return {
        icon: "🐶",
        ka: "ძაღლი",
        en: "Dog",
      };
    }

    if (profile.pet_type === "cat") {
      return {
        icon: "🐱",
        ka: "კატა",
        en: "Cat",
      };
    }

    if (profile.item_type === "keys") {
      return {
        icon: "🔑",
        ka: "გასაღები",
        en: "Keys",
      };
    }

    if (profile.item_type === "wallet") {
      return {
        icon: "👛",
        ka: "საფულე",
        en: "Wallet",
      };
    }

    if (profile.item_type === "bag") {
      return {
        icon: "👜",
        ka: "ჩანთა",
        en: "Bag",
      };
    }

    if (profile.item_type === "suitcase") {
      return {
        icon: "🧳",
        ka: "ჩემოდანი",
        en: "Suitcase",
      };
    }

    return {
      icon: "🏷️",
      ka: "QR პროფილი",
      en: "QR Profile",
    };
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="statePage">
        {error ||
          (ka
            ? "პროფილი ვერ მოიძებნა."
            : "Profile not found.")}
      </main>
    );
  }

  const type = getTypeInfo();

  return (
    <main className="page">
      <header className="header">
        <a href="/account" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>EDIT QR PROFILE</small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={ka ? "active" : ""}
            onClick={() => setLang("ka")}
          >
            GEO
          </button>

          <button
            type="button"
            className={!ka ? "active" : ""}
            onClick={() => setLang("en")}
          >
            ENG
          </button>
        </div>
      </header>

      <section className="container">
        <a href="/account" className="back">
          ← {ka ? "მფლობელის პროფილი" : "Owner profile"}
        </a>

        <div className="heading">
          <div className="typeIcon">{type.icon}</div>

          <div>
            <div className="eyebrow">
              {ka ? "პროფილის რედაქტირება" : "EDIT PROFILE"}
            </div>

            <h1>{itemName || (ka ? type.ka : type.en)}</h1>

            <div className="lockedType">
              🔒 {ka ? type.ka : type.en}

              <span>
                {ka
                  ? "პროფილის ტიპი აღარ იცვლება"
                  : "Profile type cannot be changed"}
              </span>
            </div>

            {profile.tag_code && (
              <div className="tagCode">
                QR · {profile.tag_code}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={saveProfile}>
          <section className="card">
            <SectionTitle
              number="01"
              title={ka ? "მფლობელის ინფორმაცია" : "Owner information"}
            />

            <div className="ownerBox">
              {profile.owner_photo ? (
                <img src={profile.owner_photo} alt="" />
              ) : (
                <div className="ownerPlaceholder">👤</div>
              )}

              <div>
                <strong>
                  {profile.owner_name || (ka ? "მფლობელი" : "Owner")}
                </strong>

                <p>📞 {profile.owner_phone}</p>

                {profile.owner_email && (
                  <p>✉️ {profile.owner_email}</p>
                )}

                {profile.owner_address && (
                  <p>📍 {profile.owner_address}</p>
                )}
              </div>
            </div>

            <div className="toggleGrid">
              <Toggle
                label={ka ? "სახელი და გვარი" : "Name"}
                value
                locked
              />

              <Toggle
                label={ka ? "მობილური" : "Mobile"}
                value
                locked
              />

              <Toggle
                label={ka ? "ელფოსტა" : "Email"}
                value={showOwnerEmail}
                setValue={setShowOwnerEmail}
              />

              <Toggle
                label={ka ? "მისამართი" : "Address"}
                value={showOwnerAddress}
                setValue={setShowOwnerAddress}
              />

              <Toggle
                label={ka ? "მფლობელის ფოტო" : "Owner photo"}
                value={showOwnerPhoto}
                setValue={setShowOwnerPhoto}
              />
            </div>
          </section>

          <section className="card">
            <SectionTitle
              number="02"
              title={
                ka
                  ? `${type.ka} — ინფორმაცია`
                  : `${type.en} information`
              }
            />

            {photo && (
              <div className="currentPhoto">
                <img src={photo} alt={itemName} />
              </div>
            )}

            <label>
              <span>{ka ? "სახელი / პროფილის სახელი" : "Name"} *</span>

              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </label>

            <label>
              <span>{ka ? "ფოტოს შეცვლა" : "Change photo"}</span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] ?? null)
                }
              />
            </label>

            <Toggle
              label={ka ? "ფოტო გამოჩნდეს" : "Show photo"}
              value={showPhoto}
              setValue={setShowPhoto}
            />

            <label>
              <span>{ka ? "ფერი" : "Color"}</span>

              <input
                value={colour}
                onChange={(e) => setColour(e.target.value)}
              />
            </label>

            <Toggle
              label={ka ? "ფერი გამოჩნდეს" : "Show color"}
              value={showColour}
              setValue={setShowColour}
            />

            {isPet ? (
              <>
                <div className="two">
                  <label>
                    <span>{ka ? "სქესი" : "Sex"}</span>

                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                    >
                      <option value="">
                        {ka ? "აირჩიეთ" : "Select"}
                      </option>

                      <option value="male">
                        {ka ? "მამრობითი" : "Male"}
                      </option>

                      <option value="female">
                        {ka ? "მდედრობითი" : "Female"}
                      </option>
                    </select>
                  </label>

                  <label>
                    <span>
                      {ka ? "დაბადების თარიღი" : "Date of birth"}
                    </span>

                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) =>
                        setDateOfBirth(e.target.value)
                      }
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={ka ? "სქესი გამოჩნდეს" : "Show sex"}
                    value={showSex}
                    setValue={setShowSex}
                  />

                  <Toggle
                    label={
                      ka
                        ? "დაბადების თარიღი გამოჩნდეს"
                        : "Show birth date"
                    }
                    value={showDateOfBirth}
                    setValue={setShowDateOfBirth}
                  />
                </div>

                <label>
                  <span>{ka ? "წონა" : "Weight"}</span>

                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </label>

                <Toggle
                  label={ka ? "წონა გამოჩნდეს" : "Show weight"}
                  value={showWeight}
                  setValue={setShowWeight}
                />

                <label>
                  <span>
                    {ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical information"}
                  </span>

                  <textarea
                    value={medicalInfo}
                    onChange={(e) =>
                      setMedicalInfo(e.target.value)
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "სამედიცინო ინფორმაცია გამოჩნდეს"
                      : "Show medical information"
                  }
                  value={showMedicalInfo}
                  setValue={setShowMedicalInfo}
                />

                <label>
                  <span>
                    {ka
                      ? "ქცევის შესახებ ინფორმაცია"
                      : "Behaviour information"}
                  </span>

                  <textarea
                    value={behaviourNote}
                    onChange={(e) =>
                      setBehaviourNote(e.target.value)
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "ქცევის ინფორმაცია გამოჩნდეს"
                      : "Show behaviour information"
                  }
                  value={showBehaviourNote}
                  setValue={setShowBehaviourNote}
                />
              </>
            ) : (
              <>
                <div className="two">
                  <label>
                    <span>{ka ? "ბრენდი" : "Brand"}</span>

                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>{ka ? "მოდელი" : "Model"}</span>

                    <input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={ka ? "ბრენდი გამოჩნდეს" : "Show brand"}
                    value={showBrand}
                    setValue={setShowBrand}
                  />

                  <Toggle
                    label={ka ? "მოდელი გამოჩნდეს" : "Show model"}
                    value={showModel}
                    setValue={setShowModel}
                  />
                </div>

                <div className="two">
                  <label>
                    <span>{ka ? "ზომა" : "Size"}</span>

                    <input
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                    />
                  </label>

                  <label>
                    <span>{ka ? "მასალა" : "Material"}</span>

                    <input
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                    />
                  </label>
                </div>

                <div className="toggleGrid">
                  <Toggle
                    label={ka ? "ზომა გამოჩნდეს" : "Show size"}
                    value={showSize}
                    setValue={setShowSize}
                  />

                  <Toggle
                    label={ka ? "მასალა გამოჩნდეს" : "Show material"}
                    value={showMaterial}
                    setValue={setShowMaterial}
                  />
                </div>

                <label>
                  <span>
                    {ka
                      ? "განსაკუთრებული ნიშნები"
                      : "Distinctive features"}
                  </span>

                  <textarea
                    value={features}
                    onChange={(e) =>
                      setFeatures(e.target.value)
                    }
                  />
                </label>

                <Toggle
                  label={
                    ka
                      ? "განსაკუთრებული ნიშნები გამოჩნდეს"
                      : "Show distinctive features"
                  }
                  value={showFeatures}
                  setValue={setShowFeatures}
                />
              </>
            )}

            <label>
              <span>{ka ? "დამატებითი აღწერა" : "Description"}</span>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </label>

            <Toggle
              label={ka ? "აღწერა გამოჩნდეს" : "Show description"}
              value={showDescription}
              setValue={setShowDescription}
            />
          </section>

          <section className="card">
            <SectionTitle
              number="03"
              title={
                ka
                  ? "დამატებითი საკონტაქტო პირი"
                  : "Additional contact"
              }
            />

            <p className="sectionDescription">
              {ka
                ? "ეს ადამიანი მხოლოდ მპოვნელისთვის დამატებითი კონტაქტია და Account Admin არ არის."
                : "This person is an additional finder contact, not an Account Admin."}
            </p>

            <Toggle
              label={
                ka
                  ? "დამატებითი კონტაქტი გამოჩნდეს"
                  : "Show additional contact"
              }
              value={showAdditionalContact}
              setValue={setShowAdditionalContact}
            />

            <label>
              <span>{ka ? "სახელი და გვარი" : "Full name"}</span>

              <input
                value={additionalName}
                onChange={(e) =>
                  setAdditionalName(e.target.value)
                }
              />
            </label>

            <label>
              <span>{ka ? "ტელეფონი" : "Phone"}</span>

              <input
                type="tel"
                value={additionalPhone}
                onChange={(e) =>
                  setAdditionalPhone(e.target.value)
                }
              />
            </label>

            <label>
              <span>{ka ? "ელფოსტა" : "Email"}</span>

              <input
                type="email"
                value={additionalEmail}
                onChange={(e) =>
                  setAdditionalEmail(e.target.value)
                }
              />
            </label>
          </section>

          <section className="card">
            <SectionTitle
              number="04"
              title={
                ka
                  ? "დაკავშირების მეთოდები"
                  : "Contact methods"
              }
            />

            <div className="toggleGrid">
              <Toggle
                label={ka ? "📞 ტელეფონი" : "📞 Phone"}
                value={phoneEnabled}
                setValue={setPhoneEnabled}
              />

              <Toggle
                label="💬 WhatsApp"
                value={whatsappEnabled}
                setValue={setWhatsappEnabled}
              />

              <Toggle
                label="💬 Live Chat"
                value={liveChatEnabled}
                setValue={setLiveChatEnabled}
              />

              <Toggle
                label={
                  ka
                    ? "📍 ლოკაციის გაზიარება"
                    : "📍 Location sharing"
                }
                value={locationSharingEnabled}
                setValue={setLocationSharingEnabled}
              />
            </div>
          </section>

          <section className="card">
            <SectionTitle
              number="05"
              title={
                ka
                  ? "მპოვნელისთვის შეტყობინება"
                  : "Finder message"
              }
            />

            <Toggle
              label={
                ka
                  ? "შეტყობინება გამოჩნდეს"
                  : "Show finder message"
              }
              value={showFinderMessage}
              setValue={setShowFinderMessage}
            />

            <textarea
              className="standaloneTextarea"
              value={finderMessage}
              onChange={(e) =>
                setFinderMessage(e.target.value)
              }
            />
          </section>

          <section className="card">
            <SectionTitle number="06" title="Lost Mode" />

            <div className={`lostBox ${lostMode ? "lost" : ""}`}>
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
                    ? "Lost Mode-ის ჩართვისას აქტიურდება მპოვნელისთვის არჩეული საკონტაქტო ინფორმაცია."
                    : "Lost Mode activates the contact information selected for the finder."}
                </p>
              </div>

              <button
                type="button"
                className={`switch ${
                  lostMode ? "on danger" : ""
                }`}
                onClick={() =>
                  setLostMode((value) => !value)
                }
              >
                <span />
              </button>
            </div>
          </section>

          <section className="card">
            <div className="previewHeader">
              <div>
                <SectionTitle
                  number="07"
                  title={
                    ka ? "მპოვნელის ხედვა" : "Finder Preview"
                  }
                />

                <p>
                  {ka
                    ? "აქ ზუსტად ნახავთ, რა გამოუჩნდება მპოვნელს."
                    : "See exactly what the finder will see."}
                </p>
              </div>

              <button
                type="button"
                className="previewButton"
                onClick={() =>
                  setPreviewOpen((value) => !value)
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
                    lostMode ? "previewLost" : "previewSafe"
                  }`}
                >
                  {lostMode ? "🚨 LOST" : "✓ SAFE"}
                </div>

                <h3>
                  {type.icon} {itemName || (ka ? type.ka : type.en)}
                </h3>

                <div className="previewOwner">
                  <strong>
                    {ka ? "მფლობელი" : "Owner"}
                  </strong>

                  <p>{profile.owner_name}</p>
                  <p>📞 {profile.owner_phone}</p>

                  {showOwnerEmail && profile.owner_email && (
                    <p>✉️ {profile.owner_email}</p>
                  )}

                  {showOwnerAddress &&
                    profile.owner_address && (
                      <p>📍 {profile.owner_address}</p>
                    )}

                  {showOwnerPhoto &&
                    profile.owner_photo && (
                      <img
                        src={profile.owner_photo}
                        alt=""
                        className="previewOwnerPhoto"
                      />
                    )}
                </div>

                {showColour && colour && (
                  <PreviewLine
                    label={ka ? "ფერი" : "Color"}
                    value={colour}
                  />
                )}

                {isPet && showSex && sex && (
                  <PreviewLine
                    label={ka ? "სქესი" : "Sex"}
                    value={
                      sex === "male"
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
                      value={dateOfBirth}
                    />
                  )}

                {isPet && showWeight && weight && (
                  <PreviewLine
                    label={ka ? "წონა" : "Weight"}
                    value={weight}
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
                      value={medicalInfo}
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
                      value={behaviourNote}
                    />
                  )}

                {!isPet && showBrand && brand && (
                  <PreviewLine
                    label={ka ? "ბრენდი" : "Brand"}
                    value={brand}
                  />
                )}

                {!isPet && showModel && model && (
                  <PreviewLine
                    label={ka ? "მოდელი" : "Model"}
                    value={model}
                  />
                )}

                {!isPet && showSize && size && (
                  <PreviewLine
                    label={ka ? "ზომა" : "Size"}
                    value={size}
                  />
                )}

                {!isPet && showMaterial && material && (
                  <PreviewLine
                    label={ka ? "მასალა" : "Material"}
                    value={material}
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
                      value={features}
                    />
                  )}

                {showDescription && description && (
                  <PreviewLong
                    label={ka ? "აღწერა" : "Description"}
                    value={description}
                  />
                )}

                {showFinderMessage && finderMessage && (
                  <div className="finderMessage">
                    “{finderMessage}”
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
                        <p>👤 {additionalName}</p>
                      )}

                      {additionalPhone && (
                        <p>📞 {additionalPhone}</p>
                      )}

                      {additionalEmail && (
                        <p>✉️ {additionalEmail}</p>
                      )}
                    </div>
                  )}

                {lostMode && (
                  <div className="contactPreview">
                    {phoneEnabled && <span>📞 Phone</span>}
                    {whatsappEnabled && <span>💬 WhatsApp</span>}
                    {liveChatEnabled && <span>💬 Live Chat</span>}
                    {locationSharingEnabled && (
                      <span>📍 Location</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>

          {error && <div className="errorBox">{error}</div>}

          {success && (
            <div className="successBox">{success}</div>
          )}

          <div className="actions">
            <a href="/account">
              {ka ? "გაუქმება" : "Cancel"}
            </a>

            <button type="submit" disabled={saving}>
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "ცვლილებების შენახვა"
                : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      <Styles />
    </main>
  );
}

function SectionTitle({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="sectionTitle">
      <span>{number}</span>
      <h2>{title}</h2>
    </div>
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
  setValue?: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="toggleRow">
      <span>{label}</span>

      <button
        type="button"
        className={`switch ${value ? "on" : ""} ${
          locked ? "locked" : ""
        }`}
        disabled={locked}
        onClick={() => {
          if (!locked && setValue) {
            setValue(!value);
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
      <span>{label}</span>
      <strong>{value}</strong>
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
      <span>{label}</span>
      <p>{value}</p>
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
      }

      .statePage {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 30px;
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1000px;
        min-height: 86px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        background: linear-gradient(135deg, #1465e8, #7655f7);
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
        background: linear-gradient(135deg, #eef4ff, #f0edff);
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

      .lockedType {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 7px;
        color: #475467;
        font-size: 12px;
        font-weight: 900;
      }

      .lockedType span {
        color: #98a2b3;
        font-size: 10px;
        font-weight: 700;
      }

      .tagCode {
        margin-top: 7px;
        color: #98a2b3;
        font-size: 10px;
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

      .sectionTitle {
        display: flex;
        align-items: center;
        gap: 9px;
        margin-bottom: 20px;
      }

      .sectionTitle > span {
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

      .sectionTitle h2 {
        margin: 0;
        font-size: 21px;
      }

      .sectionDescription {
        margin: -8px 0 18px;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .ownerBox {
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 14px;
        border-radius: 14px;
        background: #f7f9fc;
      }

      .ownerBox img,
      .ownerPlaceholder {
        width: 60px;
        height: 60px;
        flex: 0 0 60px;
        border-radius: 15px;
      }

      .ownerBox img {
        object-fit: cover;
      }

      .ownerPlaceholder {
        display: grid;
        place-items: center;
        background: #eef4ff;
        font-size: 26px;
      }

      .ownerBox p {
        margin: 3px 0;
        color: #667085;
        font-size: 11px;
      }

      .currentPhoto {
        width: 130px;
        height: 130px;
        margin-bottom: 20px;
        overflow: hidden;
        border-radius: 18px;
      }

      .currentPhoto img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .previewHeader p {
        margin: 0;
        color: #667085;
        font-size: 11px;
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
        font-size: 11px;
      }

      .previewLong p {
        margin: 5px 0 0;
        font-size: 11px;
        line-height: 1.6;
      }

      .finderMessage {
        background: linear-gradient(135deg, #eef4ff, #f1edff);
        font-size: 12px;
        line-height: 1.6;
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

      .errorBox,
      .successBox {
        padding: 13px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 800;
      }

      .errorBox {
        border: 1px solid #fecdca;
        background: #fff1f0;
        color: #b42318;
      }

      .successBox {
        border: 1px solid #abefc6;
        background: #ecfdf3;
        color: #027a48;
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
        background: linear-gradient(135deg, #1465e8, #7655f7);
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
      }
    `}</style>
  );
}
