"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type AdminAccess = {
  admin_record_id: number;
  owner_id: string;
  admin_email: string;

  can_view_profiles: boolean;
  can_edit_profiles: boolean;
  can_manage_lost_mode: boolean;
  can_manage_visibility: boolean;
  can_manage_contacts: boolean;
  can_manage_location: boolean;
  can_manage_additional_contact: boolean;
  can_use_live_chat: boolean;

  active: boolean;
};

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
  behavior_note: string | null;

  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;

  finder_message: string | null;

  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  owner_address: string | null;
  owner_photo: string | null;

  additional_contact_name: string | null;
  additional_contact_phone: string | null;
  additional_contact_email: string | null;

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

  show_finder_message: boolean | null;
  show_additional_contact: boolean | null;

  active: boolean | null;
};

export default function AdminEditProfilePage() {
  const params = useParams();

  const rawId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  const [access, setAccess] =
    useState<AdminAccess | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [itemName, setItemName] = useState("");
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

  const [showFinderMessage, setShowFinderMessage] = useState(true);
  const [showAdditionalContact, setShowAdditionalContact] =
    useState(false);

  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

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
    loadPage();
  }, [rawId]);

  async function loadPage() {
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

      const {
        data: accessData,
        error: accessError,
      } = await supabase.rpc("claim_admin_access");

      if (accessError) {
        throw accessError;
      }

      if (!accessData || accessData.length === 0) {
        throw new Error(
          ka
            ? "Admin წვდომა ვერ მოიძებნა."
            : "Admin access not found."
        );
      }

      const currentAccess = accessData[0] as AdminAccess;

      if (!currentAccess.active) {
        throw new Error(
          ka
            ? "Owner-მა Admin წვდომა გათიშა."
            : "The Owner has disabled Admin access."
        );
      }

      const { data: assignedAccess, error: assignedError } = await supabase
        .from("owner_admin_profile_access")
        .select("can_view_profiles, can_edit_profiles, can_manage_lost_mode, can_manage_visibility, can_manage_contacts, can_manage_location, can_manage_additional_contact, can_use_live_chat")
        .eq("owner_admin_id", currentAccess.admin_record_id)
        .eq("item_id", rawId)
        .maybeSingle();

      if (assignedError) throw assignedError;

      if (!assignedAccess || !currentAccess.can_view_profiles || !assignedAccess.can_view_profiles) {
        throw new Error(
          ka
            ? "QR პროფილების ნახვის უფლება არ გაქვთ."
            : "You do not have permission to view QR profiles."
        );
      }

      const effectiveAccess: AdminAccess = {
        ...currentAccess,
        can_view_profiles: currentAccess.can_view_profiles && assignedAccess.can_view_profiles,
        can_edit_profiles: currentAccess.can_edit_profiles && assignedAccess.can_edit_profiles,
        can_manage_lost_mode: currentAccess.can_manage_lost_mode && assignedAccess.can_manage_lost_mode,
        can_manage_visibility: currentAccess.can_manage_visibility && assignedAccess.can_manage_visibility,
        can_manage_contacts: currentAccess.can_manage_contacts && assignedAccess.can_manage_contacts,
        can_manage_location: currentAccess.can_manage_location && assignedAccess.can_manage_location,
        can_manage_additional_contact: currentAccess.can_manage_additional_contact && assignedAccess.can_manage_additional_contact,
        can_use_live_chat: currentAccess.can_use_live_chat && assignedAccess.can_use_live_chat,
      };

      setAccess(effectiveAccess);

      const {
        data,
        error: profileError,
      } = await supabase
        .from("item")
        .select("*")
        .eq("id", rawId)
        .eq("owner_id", currentAccess.owner_id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!data) {
        throw new Error(
          ka
            ? "პროფილი ვერ მოიძებნა."
            : "Profile not found."
        );
      }

      const p = data as Profile;

      setProfile(p);

      setItemName(p.item_name ?? "");
      setColour(p.colour ?? "");
      setDescription(p.description ?? "");

      setSex(p.sex ?? "");
      setDateOfBirth(p.date_of_birth ?? "");
      setWeight(p.weight ?? "");
      setMedicalInfo(p.medical_info ?? "");
      setBehaviourNote(p.behavior_note ?? "");

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

      setShowFinderMessage(p.show_finder_message !== false);
      setShowAdditionalContact(Boolean(p.show_additional_contact));

      setPhoneEnabled(p.phone_enabled !== false);
      setLiveChatEnabled(p.live_chat_enabled !== false);
      setLocationEnabled(Boolean(p.location_sharing_enabled));

      setLostMode(Boolean(p.active));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "გვერდის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load page."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveChanges(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile || !access) return;

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      /*
        1. BASIC PROFILE DETAILS
      */

      if (access.can_edit_profiles) {
        const payload: Record<string, string> = {
          item_name: itemName,
          colour,
          description,
          finder_message: finderMessage,
        };

        if (isPet) {
          payload.sex = sex;
          payload.date_of_birth = dateOfBirth;
          payload.weight = weight;
          payload.medical_info = medicalInfo;
          payload.behavior_note = behaviourNote;
        } else {
          payload.brand = brand;
          payload.model = model;
          payload.size = size;
          payload.material = material;
          payload.distinctive_features = features;
        }

        const { error } = await supabase.rpc(
          "admin_update_profile_details",
          {
            profile_id: String(profile.id),
            payload,
          }
        );

        if (error) throw error;
      }

      /*
        2. FINDER VISIBILITY
      */

      if (access.can_manage_visibility) {
        const visibilityPayload = {
          show_owner_email: showOwnerEmail,
          show_owner_address: showOwnerAddress,
          show_owner_photo: showOwnerPhoto,

          show_photo: showPhoto,
          show_colour: showColour,
          show_description: showDescription,

          show_sex: showSex,
          show_date_of_birth: showDateOfBirth,
          show_weight: showWeight,
          show_medical_info: showMedicalInfo,
          show_behaviour_note: showBehaviourNote,

          show_brand: showBrand,
          show_model: showModel,
          show_size: showSize,
          show_material: showMaterial,
          show_distinctive_features: showFeatures,

          show_finder_message: showFinderMessage,
        };

        const { error } = await supabase.rpc(
          "admin_update_visibility",
          {
            profile_id: String(profile.id),
            payload: visibilityPayload,
          }
        );

        if (error) throw error;
      }

      /*
        3. ADDITIONAL CONTACT
      */

      if (access.can_manage_additional_contact) {
        const { error } = await supabase.rpc(
          "admin_update_additional_contact",
          {
            profile_id: String(profile.id),
            new_name: additionalName,
            new_phone: additionalPhone,
            new_email: additionalEmail,
            new_visible: showAdditionalContact,
          }
        );

        if (error) throw error;
      }

      /*
        4. CONTACT METHODS
      */

      if (access.can_manage_contacts) {
        const { error } = await supabase.rpc(
          "admin_update_contact_methods",
          {
            profile_id: String(profile.id),
            new_phone_enabled: true,
            new_whatsapp_enabled: false,
            new_live_chat_enabled: liveChatEnabled,
          }
        );

        if (error) throw error;
      }

      /*
        5. LOCATION
      */

      if (access.can_manage_location) {
        const { error } = await supabase.rpc(
          "admin_update_location_setting",
          {
            profile_id: String(profile.id),
            new_location_enabled: locationEnabled,
          }
        );

        if (error) throw error;
      }

      /*
        6. LOST MODE
      */

      if (access.can_manage_lost_mode) {
        const { error } = await supabase.rpc(
          "admin_set_lost_mode",
          {
            profile_id: String(profile.id),
            new_active: lostMode,
          }
        );

        if (error) throw error;
      }

      setSuccess(
        ka
          ? "ცვლილებები წარმატებით შეინახა."
          : "Changes saved successfully."
      );

      await loadPage();
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

  function getType() {
    if (!profile) {
      return {
        icon: "🏷️",
        label: ka ? "QR პროფილი" : "QR Profile",
      };
    }

    if (profile.pet_type === "dog") {
      return {
        icon: "🐶",
        label: ka ? "ძაღლი" : "Dog",
      };
    }

    if (profile.pet_type === "cat") {
      return {
        icon: "🐱",
        label: ka ? "კატა" : "Cat",
      };
    }

    if (profile.item_type === "keys") {
      return {
        icon: "🔑",
        label: ka ? "გასაღები" : "Keys",
      };
    }

    if (profile.item_type === "wallet") {
      return {
        icon: "👛",
        label: ka ? "საფულე" : "Wallet",
      };
    }

    if (profile.item_type === "bag") {
      return {
        icon: "👜",
        label: ka ? "ჩანთა" : "Bag",
      };
    }

    if (profile.item_type === "suitcase") {
      return {
        icon: "🧳",
        label: ka ? "ჩემოდანი" : "Suitcase",
      };
    }

    return {
      icon: "🏷️",
      label: ka ? "QR პროფილი" : "QR Profile",
    };
  }

  if (loading) {
    return (
      <main className="statePage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!profile || !access) {
    return (
      <main className="statePage">
        <div className="stateLogo">QR</div>

        <h1>QR RETURN</h1>

        <div className="errorBox">
          {error ||
            (ka
              ? "პროფილი ვერ მოიძებნა."
              : "Profile not found.")}
        </div>

        <a href="/admin-dashboard">
          ← Admin Dashboard
        </a>
      </main>
    );
  }

  const type = getType();

  return (
    <main className="page">
      <header className="header">
        <a href="/admin-dashboard" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>ADMIN PROFILE EDIT</small>
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
        <a href="/admin-dashboard" className="back">
          ← Admin Dashboard
        </a>

        <div className="heading">
          <div className="typeIcon">
            {type.icon}
          </div>

          <div>
            <div className="eyebrow">
              ADMIN EDIT
            </div>

            <h1>
              {profile.item_name || type.label}
            </h1>

            <div className="lockedType">
              🔒 {type.label}
            </div>

            <p>
              {ka
                ? "პროფილის ტიპის შეცვლა შეუძლებელია."
                : "Profile type cannot be changed."}
            </p>
          </div>
        </div>

        <section className="permissions">
          <PermissionChip
            label={ka ? "ინფორმაციის რედაქტირება" : "Edit details"}
            enabled={access.can_edit_profiles}
          />

          <PermissionChip
            label={ka ? "ხილვადობა" : "Visibility"}
            enabled={access.can_manage_visibility}
          />

          <PermissionChip
            label={ka ? "კონტაქტები" : "Contacts"}
            enabled={access.can_manage_contacts}
          />

          <PermissionChip
            label={ka ? "ლოკაცია" : "Location"}
            enabled={access.can_manage_location}
          />

          <PermissionChip
            label={ka ? "დამატებითი კონტაქტი" : "Additional contact"}
            enabled={access.can_manage_additional_contact}
          />

          <PermissionChip
            label="Lost Mode"
            enabled={access.can_manage_lost_mode}
          />
        </section>

        <form onSubmit={saveChanges}>
          <section
            className={`card ${
              !access.can_edit_profiles ? "disabledCard" : ""
            }`}
          >
            <SectionTitle
              number="01"
              title={
                ka
                  ? "პროფილის ინფორმაცია"
                  : "Profile information"
              }
            />

            {!access.can_edit_profiles && (
              <LockedMessage ka={ka} />
            )}

            <label>
              <span>
                {ka ? "სახელი / პროფილის სახელი" : "Name"}
              </span>

              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                disabled={!access.can_edit_profiles}
              />
            </label>

            <label>
              <span>{ka ? "ფერი" : "Color"}</span>

              <input
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                disabled={!access.can_edit_profiles}
              />
            </label>

            {isPet ? (
              <>
                <div className="twoColumns">
                  <label>
                    <span>{ka ? "სქესი" : "Sex"}</span>

                    <select
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      disabled={!access.can_edit_profiles}
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
                      {ka
                        ? "დაბადების თარიღი"
                        : "Date of birth"}
                    </span>

                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) =>
                        setDateOfBirth(e.target.value)
                      }
                      disabled={!access.can_edit_profiles}
                    />
                  </label>
                </div>

                <label>
                  <span>{ka ? "წონა" : "Weight"}</span>

                  <input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={!access.can_edit_profiles}
                  />
                </label>

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
                    disabled={!access.can_edit_profiles}
                  />
                </label>

                <label>
                  <span>
                    {ka
                      ? "ქცევის ინფორმაცია"
                      : "Behaviour information"}
                  </span>

                  <textarea
                    value={behaviourNote}
                    onChange={(e) =>
                      setBehaviourNote(e.target.value)
                    }
                    disabled={!access.can_edit_profiles}
                  />
                </label>
              </>
            ) : (
              <>
                <div className="twoColumns">
                  <label>
                    <span>{ka ? "ბრენდი" : "Brand"}</span>

                    <input
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      disabled={!access.can_edit_profiles}
                    />
                  </label>

                  <label>
                    <span>{ka ? "მოდელი" : "Model"}</span>

                    <input
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      disabled={!access.can_edit_profiles}
                    />
                  </label>
                </div>

                <div className="twoColumns">
                  <label>
                    <span>{ka ? "ზომა" : "Size"}</span>

                    <input
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      disabled={!access.can_edit_profiles}
                    />
                  </label>

                  <label>
                    <span>{ka ? "მასალა" : "Material"}</span>

                    <input
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      disabled={!access.can_edit_profiles}
                    />
                  </label>
                </div>

                <label>
                  <span>
                    {ka
                      ? "განსაკუთრებული ნიშნები"
                      : "Distinctive features"}
                  </span>

                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    disabled={!access.can_edit_profiles}
                  />
                </label>
              </>
            )}

            <label>
              <span>
                {ka ? "დამატებითი აღწერა" : "Description"}
              </span>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                disabled={!access.can_edit_profiles}
              />
            </label>

            <label>
              <span>
                {ka
                  ? "მპოვნელისთვის შეტყობინება"
                  : "Finder message"}
              </span>

              <textarea
                value={finderMessage}
                onChange={(e) =>
                  setFinderMessage(e.target.value)
                }
                disabled={!access.can_edit_profiles}
              />
            </label>
          </section>

          <section
            className={`card ${
              !access.can_manage_visibility
                ? "disabledCard"
                : ""
            }`}
          >
            <SectionTitle
              number="02"
              title={
                ka
                  ? "მპოვნელისთვის ხილვადობა"
                  : "Finder visibility"
              }
            />

            {!access.can_manage_visibility && (
              <LockedMessage ka={ka} />
            )}

            <div className="lockedRequired">
              🔒{" "}
              {ka
                ? "Owner-ის სახელი, გვარი და მობილური ყოველთვის ჩანს."
                : "Owner name and mobile are always visible."}
            </div>

            <div className="toggleGrid">
              <Toggle
                label={ka ? "Owner Email" : "Owner Email"}
                value={showOwnerEmail}
                setValue={setShowOwnerEmail}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={ka ? "Owner მისამართი" : "Owner address"}
                value={showOwnerAddress}
                setValue={setShowOwnerAddress}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={ka ? "Owner ფოტო" : "Owner photo"}
                value={showOwnerPhoto}
                setValue={setShowOwnerPhoto}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={ka ? "პროფილის ფოტო" : "Profile photo"}
                value={showPhoto}
                setValue={setShowPhoto}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={ka ? "ფერი" : "Color"}
                value={showColour}
                setValue={setShowColour}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={ka ? "აღწერა" : "Description"}
                value={showDescription}
                setValue={setShowDescription}
                disabled={!access.can_manage_visibility}
              />

              <Toggle
                label={
                  ka
                    ? "მპოვნელისთვის შეტყობინება"
                    : "Finder message"
                }
                value={showFinderMessage}
                setValue={setShowFinderMessage}
                disabled={!access.can_manage_visibility}
              />

              {isPet ? (
                <>
                  <Toggle
                    label={ka ? "სქესი" : "Sex"}
                    value={showSex}
                    setValue={setShowSex}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={
                      ka
                        ? "დაბადების თარიღი"
                        : "Date of birth"
                    }
                    value={showDateOfBirth}
                    setValue={setShowDateOfBirth}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={ka ? "წონა" : "Weight"}
                    value={showWeight}
                    setValue={setShowWeight}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={
                      ka
                        ? "სამედიცინო ინფორმაცია"
                        : "Medical info"
                    }
                    value={showMedicalInfo}
                    setValue={setShowMedicalInfo}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={
                      ka
                        ? "ქცევის ინფორმაცია"
                        : "Behaviour info"
                    }
                    value={showBehaviourNote}
                    setValue={setShowBehaviourNote}
                    disabled={!access.can_manage_visibility}
                  />
                </>
              ) : (
                <>
                  <Toggle
                    label={ka ? "ბრენდი" : "Brand"}
                    value={showBrand}
                    setValue={setShowBrand}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={ka ? "მოდელი" : "Model"}
                    value={showModel}
                    setValue={setShowModel}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={ka ? "ზომა" : "Size"}
                    value={showSize}
                    setValue={setShowSize}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={ka ? "მასალა" : "Material"}
                    value={showMaterial}
                    setValue={setShowMaterial}
                    disabled={!access.can_manage_visibility}
                  />

                  <Toggle
                    label={
                      ka
                        ? "განსაკუთრებული ნიშნები"
                        : "Distinctive features"
                    }
                    value={showFeatures}
                    setValue={setShowFeatures}
                    disabled={!access.can_manage_visibility}
                  />
                </>
              )}
            </div>
          </section>

          <section
            className={`card ${
              !access.can_manage_additional_contact
                ? "disabledCard"
                : ""
            }`}
          >
            <SectionTitle
              number="03"
              title={
                ka
                  ? "დამატებითი საკონტაქტო პირი"
                  : "Additional contact"
              }
            />

            {!access.can_manage_additional_contact && (
              <LockedMessage ka={ka} />
            )}

            <Toggle
              label={
                ka
                  ? "მპოვნელისთვის გამოჩნდეს"
                  : "Show to finder"
              }
              value={showAdditionalContact}
              setValue={setShowAdditionalContact}
              disabled={!access.can_manage_additional_contact}
            />

            <label>
              <span>{ka ? "სახელი და გვარი" : "Full name"}</span>

              <input
                value={additionalName}
                onChange={(e) =>
                  setAdditionalName(e.target.value)
                }
                disabled={!access.can_manage_additional_contact}
              />
            </label>

            <label>
              <span>{ka ? "ტელეფონი" : "Phone"}</span>

              <input
                value={additionalPhone}
                onChange={(e) =>
                  setAdditionalPhone(e.target.value)
                }
                disabled={!access.can_manage_additional_contact}
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
                disabled={!access.can_manage_additional_contact}
              />
            </label>
          </section>

          <section
            className={`card ${
              !access.can_manage_contacts ? "disabledCard" : ""
            }`}
          >
            <SectionTitle
              number="04"
              title={
                ka
                  ? "დაკავშირების მეთოდები"
                  : "Contact methods"
              }
            />

            {!access.can_manage_contacts && (
              <LockedMessage ka={ka} />
            )}

            <div className="toggleGrid">
              <Toggle
                label={ka ? "📞 ტელეფონი" : "📞 Phone"}
                value={phoneEnabled}
                setValue={setPhoneEnabled}
                disabled={!access.can_manage_contacts}
              />

              <Toggle
                label="💬 Live Chat"
                value={liveChatEnabled}
                setValue={setLiveChatEnabled}
                disabled={!access.can_manage_contacts}
              />
            </div>
          </section>

          <section
            className={`card ${
              !access.can_manage_location ? "disabledCard" : ""
            }`}
          >
            <SectionTitle
              number="05"
              title={
                ka
                  ? "ლოკაციის გაზიარება"
                  : "Location sharing"
              }
            />

            {!access.can_manage_location && (
              <LockedMessage ka={ka} />
            )}

            <Toggle
              label={
                ka
                  ? "📍 მპოვნელის ლოკაციის გაზიარება"
                  : "📍 Finder location sharing"
              }
              value={locationEnabled}
              setValue={setLocationEnabled}
              disabled={!access.can_manage_location}
            />
          </section>

          <section
            className={`card ${
              !access.can_manage_lost_mode
                ? "disabledCard"
                : ""
            }`}
          >
            <SectionTitle
              number="06"
              title="Lost Mode"
            />

            {!access.can_manage_lost_mode && (
              <LockedMessage ka={ka} />
            )}

            <div
              className={`lostBox ${
                lostMode ? "lost" : ""
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
                    ? "Lost Mode-ის მართვა მხოლოდ Owner-ის ნებართვით შეგიძლიათ."
                    : "Lost Mode can only be changed with Owner permission."}
                </p>
              </div>

              <ToggleSwitch
                value={lostMode}
                setValue={setLostMode}
                disabled={!access.can_manage_lost_mode}
                danger
              />
            </div>
          </section>

          <section className="card">
            <div className="previewHeader">
              <div>
                <SectionTitle
                  number="07"
                  title={
                    ka
                      ? "მპოვნელის ხედვა"
                      : "Finder Preview"
                  }
                />

                <p>
                  {ka
                    ? "ნახეთ მიმდინარე პარამეტრებით რა გამოჩნდება."
                    : "Preview what the finder will see with the current settings."}
                </p>
              </div>

              <button
                type="button"
                className="previewButton"
                onClick={() =>
                  setPreviewOpen((current) => !current)
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
                  {type.icon} {itemName || type.label}
                </h3>

                <div className="previewOwner">
                  <strong>
                    {ka ? "მფლობელი" : "Owner"}
                  </strong>

                  <p>{profile.owner_name}</p>
                  <p>📞 {profile.owner_phone}</p>

                  {showOwnerEmail &&
                    profile.owner_email && (
                      <p>✉️ {profile.owner_email}</p>
                    )}

                  {showOwnerAddress &&
                    profile.owner_address && (
                      <p>📍 {profile.owner_address}</p>
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
                    value={sex}
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

                {!isPet && showFeatures && features && (
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
                    <div className="previewBox">
                      <strong>
                        {ka
                          ? "დამატებითი კონტაქტი"
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
                    {liveChatEnabled && <span>💬 Live Chat</span>}
                    {locationEnabled && <span>📍 Location</span>}
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

          {success && (
            <div className="successBox">
              ✓ {success}
            </div>
          )}

          <div className="actions">
            <a href="/admin-dashboard">
              {ka ? "გაუქმება" : "Cancel"}
            </a>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? ka
                  ? "ინახება..."
                  : "Saving..."
                : ka
                ? "დაშვებული ცვლილებების შენახვა"
                : "Save allowed changes"}
            </button>
          </div>
        </form>
      </section>

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
          padding: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .stateLogo {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          margin-bottom: 10px;
          border-radius: 15px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-weight: 900;
        }

        .statePage h1 {
          color: #1465e8;
        }

        .statePage a {
          margin-top: 15px;
          color: #1465e8;
          text-decoration: none;
          font-weight: 900;
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
          letter-spacing: 1.6px;
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

        .languages .active {
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
          margin: 35px 0 23px;
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .typeIcon {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          display: grid;
          place-items: center;
          border-radius: 19px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 36px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 5px 0;
          font-size: 32px;
        }

        .heading p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 10px;
        }

        .lockedType {
          width: fit-content;
          padding: 6px 9px;
          border-radius: 8px;
          background: #f2f4f7;
          color: #475467;
          font-size: 10px;
          font-weight: 900;
        }

        .permissions {
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .permissionChip {
          padding: 7px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
        }

        .permissionChip.on {
          background: #ecfdf3;
          color: #027a48;
        }

        .permissionChip.off {
          background: #f2f4f7;
          color: #98a2b3;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .card {
          padding: 27px;
          border: 1px solid #e4e7ec;
          border-radius: 20px;
          background: white;
          box-shadow: 0 10px 28px rgba(16, 24, 40, 0.04);
        }

        .disabledCard {
          background: #fafbfc;
        }

        .sectionTitle {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 19px;
        }

        .sectionTitle > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .sectionTitle h2 {
          margin: 0;
          font-size: 20px;
        }

        .lockedMessage,
        .lockedRequired {
          margin-bottom: 15px;
          padding: 11px;
          border-radius: 10px;
          background: #f2f4f7;
          color: #667085;
          font-size: 10px;
          font-weight: 800;
        }

        label {
          display: block;
          margin-top: 17px;
        }

        label > span {
          display: block;
          margin-bottom: 7px;
          color: #475467;
          font-size: 12px;
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
          min-height: 100px;
          padding: 13px;
          resize: vertical;
        }

        input:disabled,
        textarea:disabled,
        select:disabled {
          background: #f2f4f7;
          color: #98a2b3;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .toggleGrid {
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
          background: white;
        }

        .toggleRow > span {
          font-size: 11px;
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

        .switch > span {
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

        .switch.on > span {
          transform: translateX(20px);
        }

        .switch.danger.on {
          background: #d92d20;
        }

        .switch:disabled {
          opacity: 0.55;
          cursor: default;
        }

        .lostBox {
          padding: 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid #abefc6;
          border-radius: 13px;
          background: #ecfdf3;
        }

        .lostBox.lost {
          border-color: #fecdca;
          background: #fff1f0;
        }

        .lostBox strong {
          font-size: 12px;
        }

        .lostBox p {
          margin: 4px 0 0;
          color: #667085;
          font-size: 10px;
        }

        .previewHeader {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .previewHeader p {
          margin: 0;
          color: #667085;
          font-size: 10px;
        }

        .previewButton {
          height: 42px;
          padding: 0 14px;
          border: 0;
          border-radius: 9px;
          background: #1465e8;
          color: white;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .preview {
          margin-top: 20px;
          padding: 18px;
          border-radius: 14px;
          background: #f7f9fc;
        }

        .previewStatus {
          width: fit-content;
          padding: 6px 8px;
          border-radius: 999px;
          font-size: 9px;
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
          margin: 14px 0;
        }

        .previewOwner,
        .previewBox,
        .previewLong,
        .finderMessage {
          margin-top: 11px;
          padding: 12px;
          border-radius: 10px;
          background: white;
        }

        .previewOwner p,
        .previewBox p {
          margin: 5px 0;
          font-size: 10px;
        }

        .previewLine {
          margin-top: 8px;
          padding: 10px 12px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          border-radius: 10px;
          background: white;
        }

        .previewLine span,
        .previewLong span {
          color: #98a2b3;
          font-size: 9px;
          font-weight: 900;
        }

        .previewLine strong {
          font-size: 10px;
        }

        .previewLong p {
          margin: 5px 0 0;
          font-size: 10px;
          line-height: 1.6;
        }

        .finderMessage {
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 11px;
          line-height: 1.6;
        }

        .contactPreview {
          margin-top: 13px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .contactPreview span {
          padding: 7px 9px;
          border-radius: 8px;
          background: #eef4ff;
          color: #1465e8;
          font-size: 9px;
          font-weight: 900;
        }

        .errorBox,
        .successBox {
          padding: 13px;
          border-radius: 10px;
          font-size: 11px;
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
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 10px;
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
          opacity: 0.6;
        }

        @media (max-width: 650px) {
          .twoColumns,
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

function LockedMessage({
  ka,
}: {
  ka: boolean;
}) {
  return (
    <div className="lockedMessage">
      🔒{" "}
      {ka
        ? "Owner-ს ამ ფუნქციის მართვის უფლება თქვენთვის არ აქვს ჩართული."
        : "The Owner has not granted permission for this section."}
    </div>
  );
}

function PermissionChip({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div
      className={`permissionChip ${
        enabled ? "on" : "off"
      }`}
    >
      {enabled ? "✓ " : "🔒 "}
      {label}
    </div>
  );
}

function Toggle({
  label,
  value,
  setValue,
  disabled = false,
}: {
  label: string;
  value: boolean;
  setValue: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="toggleRow">
      <span>{label}</span>

      <ToggleSwitch
        value={value}
        setValue={setValue}
        disabled={disabled}
      />
    </div>
  );
}

function ToggleSwitch({
  value,
  setValue,
  disabled = false,
  danger = false,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      className={`switch ${value ? "on" : ""} ${
        danger ? "danger" : ""
      }`}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          setValue(!value);
        }
      }}
    >
      <span />
    </button>
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
