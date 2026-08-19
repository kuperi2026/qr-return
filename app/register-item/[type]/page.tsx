"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type ProfileType = "dog" | "cat" | "keys" | "wallet" | "bag" | "suitcase";

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
  { icon: string; ka: string; en: string }
> = {
  dog: { icon: "🐶", ka: "ძაღლი", en: "Dog" },
  cat: { icon: "🐱", ka: "კატა", en: "Cat" },
  keys: { icon: "🔑", ka: "გასაღები", en: "Keys" },
  wallet: { icon: "👛", ka: "საფულე", en: "Wallet" },
  bag: { icon: "👜", ka: "ჩანთა", en: "Bag" },
  suitcase: { icon: "🧳", ka: "ჩემოდანი", en: "Suitcase" },
};

export default function RegisterItemPage() {
  const params = useParams();

  const rawType = Array.isArray(params.type) ? params.type[0] : params.type;
  const profileType = allowedTypes.includes(rawType as ProfileType)
    ? (rawType as ProfileType)
    : null;

  const [lang, setLang] = useState<Lang>("ka");
  const ka = lang === "ka";

  const [owner, setOwner] = useState<Owner | null>(null);

  const [itemName, setItemName] = useState("");
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

  const [showOwnerName, setShowOwnerName] = useState(true);
  const [showOwnerPhone, setShowOwnerPhone] = useState(true);
  const [showOwnerEmail, setShowOwnerEmail] = useState(false);
  const [showOwnerAddress, setShowOwnerAddress] = useState(false);
  const [showOwnerPhoto, setShowOwnerPhoto] = useState(false);

  const [showPhoto, setShowPhoto] = useState(true);
  const [showColour, setShowColour] = useState(true);
  const [showSex, setShowSex] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);
  const [showWeight, setShowWeight] = useState(true);
  const [showMedicalInfo, setShowMedicalInfo] = useState(true);

  const [showBrand, setShowBrand] = useState(true);
  const [showModel, setShowModel] = useState(true);
  const [showSize, setShowSize] = useState(true);
  const [showMaterial, setShowMaterial] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const [showFinderMessage, setShowFinderMessage] = useState(true);
  const [showAdditionalContact, setShowAdditionalContact] = useState(false);

  const [phoneEnabled, setPhoneEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [liveChatEnabled, setLiveChatEnabled] = useState(true);
  const [locationSharingEnabled, setLocationSharingEnabled] = useState(false);

  const [lostMode, setLostMode] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isPet = profileType === "dog" || profileType === "cat";

  const current = useMemo(() => {
    if (!profileType) return null;
    return typeConfig[profileType];
  }, [profileType]);

  useEffect(() => {
    loadOwner();
  }, []);

  async function loadOwner() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("owner_accounts")
        .select("user_id, first_name, last_name, email, phone, address, photo")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setOwner(data as Owner);
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

  async function uploadPhoto(userId: string) {
    if (!photoFile) return null;

    const safeName = photoFile.name.replace(/[^a-zA-Z0-9._-]/g, "-");
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

    if (!profileType || !owner) return;

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

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const photo = await uploadPhoto(user.id);

      const tagCode =
        "QR-" +
        crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();

      const row: Record<string, unknown> = {
        owner_id: user.id,
        owner_name: `${owner.first_name} ${owner.last_name}`.trim(),
        owner_email: owner.email,
        owner_phone: owner.phone,
        owner_photo: owner.photo,

        item_name: itemName.trim(),
        item_type: isPet ? "pet" : profileType,
        pet_type: isPet ? profileType : null,

        tag_code: tagCode,
        photo,
        colour: colour.trim() || null,
        description: description.trim() || null,
        finder_message: finderMessage.trim() || null,

        additional_contact_name: additionalName.trim() || null,
        additional_contact_phone: additionalPhone.trim() || null,
        additional_contact_email: additionalEmail.trim() || null,

        phone_enabled: phoneEnabled,
        whatsapp_enabled: whatsappEnabled,
        live_chat_enabled: liveChatEnabled,
        location_sharing_enabled: locationSharingEnabled,

        show_photo: showPhoto,
        show_colour: showColour,
        show_description: showDescription,

        show_owner_photo: showOwnerPhoto,
        show_owner_phone: showOwnerPhone,
        show_owner_email: showOwnerEmail,
        show_additional_contact: showAdditionalContact,
        show_finder_message: showFinderMessage,

        active: lostMode,
      };

      if (isPet) {
        row.sex = sex || null;
        row.date_of_birth = dateOfBirth || null;
        row.weight = weight.trim() || null;
        row.medical_info = medicalInfo.trim() || null;
        row.behaviour_note = behaviourNote.trim() || null;

        row.show_sex = showSex;
        row.show_date_of_birth = showDateOfBirth;
        row.show_weight = showWeight;
        row.show_medical_info = showMedicalInfo;
      } else {
        row.brand = brand.trim() || null;
        row.model = model.trim() || null;
        row.size = size.trim() || null;
        row.material = material.trim() || null;
        row.distinctive_features = features.trim() || null;

        row.show_brand = showBrand;
        row.show_model = showModel;
        row.show_size = showSize;
        row.show_material = showMaterial;
        row.show_distinctive_features = showFeatures;
      }

      const { error } = await supabase.from("item").insert(row);

      if (error) throw error;

      window.location.href = "/account";
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
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!profileType || !current || !owner) {
    return (
      <main className="statePage">
        {error || (ka ? "პროფილი ვერ მოიძებნა." : "Profile not found.")}
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/account" className="brand">
          <div className="logo">QR</div>
          <div>
            <strong>QR RETURN</strong>
            <small>NEW QR PROFILE</small>
          </div>
        </a>

        <div className="languages">
          <button
            className={ka ? "active" : ""}
            onClick={() => setLang("ka")}
          >
            GEO
          </button>
          <button
            className={!ka ? "active" : ""}
            onClick={() => setLang("en")}
          >
            ENG
          </button>
        </div>
      </header>

      <section className="container">
        <a href="/add-profile" className="back">
          ← {ka ? "კატეგორიების არჩევა" : "Choose category"}
        </a>

        <div className="heading">
          <div className="typeIcon">{current.icon}</div>
          <div>
            <div className="eyebrow">QR RETURN PROFILE</div>
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
          <section className="card">
            <h2>{ka ? "მფლობელი" : "Owner"}</h2>

            <div className="ownerPreview">
              <div className="ownerAvatar">
                {owner.photo ? <img src={owner.photo} alt="" /> : "👤"}
              </div>

              <div>
                <strong>
                  {owner.first_name} {owner.last_name}
                </strong>
                <p>{owner.phone}</p>
                <p>{owner.email}</p>
              </div>
            </div>

            <div className="toggleGrid">
              <Toggle
                label={ka ? "სახელი და გვარი" : "Name"}
                value={showOwnerName}
                setValue={setShowOwnerName}
                locked
              />

              <Toggle
                label={ka ? "მობილური" : "Mobile"}
                value={showOwnerPhone}
                setValue={setShowOwnerPhone}
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

            <div className="lockedNote">
              🔒{" "}
              {ka
                ? "სახელი, გვარი და მობილური მპოვნელისთვის სავალდებულოდ გამოჩნდება."
                : "Owner name and mobile are always visible to the finder."}
            </div>
          </section>

          <section className="card">
            <h2>
              {ka
                ? `${current.ka} — ინფორმაცია`
                : `${current.en} information`}
            </h2>

            <label>
              <span>{ka ? "სახელი / პროფილის სახელი" : "Name"} *</span>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </label>

            <label>
              <span>{ka ? "ფოტო" : "Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
            </label>

            <Toggle
              label={ka ? "ფოტო გამოჩნდეს" : "Show photo"}
              value={showPhoto}
              setValue={setShowPhoto}
            />

            <label>
              <span>{ka ? "ფერი" : "Color"}</span>
              <input value={colour} onChange={(e) => setColour(e.target.value)} />
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
                    <select value={sex} onChange={(e) => setSex(e.target.value)}>
                      <option value="">{ka ? "აირჩიეთ" : "Select"}</option>
                      <option value="male">{ka ? "მამრობითი" : "Male"}</option>
                      <option value="female">{ka ? "მდედრობითი" : "Female"}</option>
                    </select>
                  </label>

                  <label>
                    <span>{ka ? "დაბადების თარიღი" : "Date of birth"}</span>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
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
                    label={ka ? "დაბადების თარიღი გამოჩნდეს" : "Show birth date"}
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
                  <span>{ka ? "სამედიცინო ინფორმაცია" : "Medical information"}</span>
                  <textarea
                    value={medicalInfo}
                    onChange={(e) => setMedicalInfo(e.target.value)}
                  />
                </label>

                <Toggle
                  label={ka ? "სამედიცინო ინფორმაცია გამოჩნდეს" : "Show medical info"}
                  value={showMedicalInfo}
                  setValue={setShowMedicalInfo}
                />

                <label>
                  <span>{ka ? "ქცევის ინფორმაცია" : "Behaviour information"}</span>
                  <textarea
                    value={behaviourNote}
                    onChange={(e) => setBehaviourNote(e.target.value)}
                  />
                </label>
              </>
            ) : (
              <>
                <div className="two">
                  <label>
                    <span>{ka ? "ბრენდი" : "Brand"}</span>
                    <input value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </label>

                  <label>
                    <span>{ka ? "მოდელი" : "Model"}</span>
                    <input value={model} onChange={(e) => setModel(e.target.value)} />
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
                    <input value={size} onChange={(e) => setSize(e.target.value)} />
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
                  <span>{ka ? "განსაკუთრებული ნიშნები" : "Distinctive features"}</span>
                  <textarea
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                  />
                </label>

                <Toggle
                  label={ka ? "განსაკუთრებული ნიშნები გამოჩნდეს" : "Show features"}
                  value={showFeatures}
                  setValue={setShowFeatures}
                />
              </>
            )}

            <label>
              <span>{ka ? "აღწერა" : "Description"}</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <Toggle
              label={ka ? "აღწერა გამოჩნდეს" : "Show description"}
              value={showDescription}
              setValue={setShowDescription}
            />
          </section>

          <section className="card">
            <h2>{ka ? "დამატებითი საკონტაქტო პირი" : "Additional contact"}</h2>

            <Toggle
              label={
                ka
                  ? "მპოვნელმა დამატებითი კონტაქტი დაინახოს"
                  : "Show additional contact"
              }
              value={showAdditionalContact}
              setValue={setShowAdditionalContact}
            />

            <label>
              <span>{ka ? "სახელი და გვარი" : "Full name"}</span>
              <input
                value={additionalName}
                onChange={(e) => setAdditionalName(e.target.value)}
              />
            </label>

            <label>
              <span>{ka ? "ტელეფონი" : "Phone"}</span>
              <input
                value={additionalPhone}
                onChange={(e) => setAdditionalPhone(e.target.value)}
              />
            </label>

            <label>
              <span>{ka ? "ელფოსტა" : "Email"}</span>
              <input
                type="email"
                value={additionalEmail}
                onChange={(e) => setAdditionalEmail(e.target.value)}
              />
            </label>
          </section>

          <section className="card">
            <h2>{ka ? "დაკავშირების მეთოდები" : "Contact methods"}</h2>

            <div className="toggleGrid">
              <Toggle
                label={ka ? "ტელეფონი" : "Phone"}
                value={phoneEnabled}
                setValue={setPhoneEnabled}
              />

              <Toggle
                label="WhatsApp"
                value={whatsappEnabled}
                setValue={setWhatsappEnabled}
              />

              <Toggle
                label="Live Chat"
                value={liveChatEnabled}
                setValue={setLiveChatEnabled}
              />

              <Toggle
                label={ka ? "ლოკაციის გაზიარება" : "Location sharing"}
                value={locationSharingEnabled}
                setValue={setLocationSharingEnabled}
              />
            </div>
          </section>

          <section className="card">
            <h2>{ka ? "მპოვნელისთვის შეტყობინება" : "Finder message"}</h2>

            <Toggle
              label={ka ? "შეტყობინება გამოჩნდეს" : "Show finder message"}
              value={showFinderMessage}
              setValue={setShowFinderMessage}
            />

            <textarea
              value={finderMessage}
              onChange={(e) => setFinderMessage(e.target.value)}
              placeholder={
                ka
                  ? "მაგ. გთხოვთ დამიკავშირდეთ. დიდი მადლობა!"
                  : "e.g. Please contact me. Thank you!"
              }
            />
          </section>

          <section className="card">
            <h2>Lost Mode</h2>

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
                    ? "Lost Mode-ის ჩართვისას მპოვნელისთვის აქტიურდება თქვენს მიერ არჩეული საკონტაქტო ინფორმაცია."
                    : "When Lost Mode is enabled, your selected finder information becomes active."}
                </p>
              </div>

              <button
                type="button"
                className={`switch ${lostMode ? "on danger" : ""}`}
                onClick={() => setLostMode((v) => !v)}
              >
                <span />
              </button>
            </div>
          </section>

          <section className="card">
            <div className="previewHeader">
              <div>
                <h2>{ka ? "მპოვნელის ხედვა" : "Finder Preview"}</h2>
                <p>
                  {ka
                    ? "ნახეთ ზუსტად, რას დაინახავს ადამიანი QR კოდის დასკანერებისას."
                    : "Preview exactly what a finder will see after scanning the QR code."}
                </p>
              </div>

              <button
                type="button"
                className="previewButton"
                onClick={() => setPreviewOpen((v) => !v)}
              >
                👁 {ka ? "ნახვა" : "Preview"}
              </button>
            </div>

            {previewOpen && (
              <div className="preview">
                <div className="previewStatus">
                  {lostMode ? "🚨 LOST" : "✓ SAFE"}
                </div>

                <h3>
                  {current.icon} {itemName || current[ka ? "ka" : "en"]}
                </h3>

                <div className="previewOwner">
                  <strong>{ka ? "მფლობელი" : "Owner"}</strong>

                  {showOwnerName && (
                    <p>
                      {owner.first_name} {owner.last_name}
                    </p>
                  )}

                  {showOwnerPhone && <p>📞 {owner.phone}</p>}

                  {showOwnerEmail && <p>✉️ {owner.email}</p>}

                  {showOwnerAddress && owner.address && (
                    <p>📍 {owner.address}</p>
                  )}
                </div>

                {showColour && colour && <p>{ka ? "ფერი:" : "Color:"} {colour}</p>}

                {isPet && showSex && sex && (
                  <p>{ka ? "სქესი:" : "Sex:"} {sex}</p>
                )}

                {isPet && showMedicalInfo && medicalInfo && (
                  <p>{medicalInfo}</p>
                )}

                {!isPet && showBrand && brand && (
                  <p>{ka ? "ბრენდი:" : "Brand:"} {brand}</p>
                )}

                {!isPet && showFeatures && features && (
                  <p>{features}</p>
                )}

                {showDescription && description && <p>{description}</p>}

                {showFinderMessage && finderMessage && (
                  <div className="finderMessage">
                    “{finderMessage}”
                  </div>
                )}

                {showAdditionalContact && additionalName && (
                  <div className="additionalPreview">
                    <strong>
                      {ka ? "დამატებითი კონტაქტი" : "Additional contact"}
                    </strong>
                    <p>{additionalName}</p>
                    {additionalPhone && <p>📞 {additionalPhone}</p>}
                    {additionalEmail && <p>✉️ {additionalEmail}</p>}
                  </div>
                )}

                <div className="contactPreview">
                  {phoneEnabled && <span>📞 Phone</span>}
                  {whatsappEnabled && <span>💬 WhatsApp</span>}
                  {liveChatEnabled && <span>💬 Live Chat</span>}
                  {locationSharingEnabled && <span>📍 Location</span>}
                </div>
              </div>
            )}
          </section>

          {error && <div className="errorBox">{error}</div>}

          <div className="actions">
            <a href="/account">{ka ? "გაუქმება" : "Cancel"}</a>

            <button type="submit" disabled={saving}>
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
  setValue: (value: boolean) => void;
  locked?: boolean;
}) {
  return (
    <div className="toggleRow">
      <span>{label}</span>

      <button
        type="button"
        className={`switch ${value ? "on" : ""} ${locked ? "locked" : ""}`}
        onClick={() => {
          if (!locked) setValue(!value);
        }}
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

      body {
        margin: 0;
        background: #f7f9fc;
        font-family: Inter, Arial, sans-serif;
        color: #101828;
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
      }

      .header {
        width: calc(100% - 36px);
        max-width: 1000px;
        height: 86px;
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
        background: linear-gradient(135deg, #1465e8, #7655f7);
        color: white;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #1465e8;
        font-size: 21px;
      }

      .brand small {
        color: #7655f7;
        font-size: 9px;
        letter-spacing: 1.5px;
      }

      .languages {
        display: flex;
        gap: 4px;
      }

      .languages button {
        border: 0;
        padding: 8px;
        border-radius: 8px;
        background: #eaecf0;
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
        text-decoration: none;
        font-size: 13px;
      }

      .heading {
        margin: 35px 0;
        display: flex;
        gap: 18px;
        align-items: center;
      }

      .typeIcon {
        width: 75px;
        height: 75px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: #eef4ff;
        font-size: 38px;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 10px;
        font-weight: 900;
      }

      .heading h1 {
        margin: 6px 0;
      }

      .heading p {
        margin: 0;
        color: #667085;
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
      }

      .card h2 {
        margin-top: 0;
      }

      label {
        display: block;
        margin-top: 18px;
      }

      label span {
        display: block;
        margin-bottom: 7px;
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
      }

      input,
      select {
        height: 50px;
        padding: 0 13px;
      }

      textarea {
        min-height: 100px;
        padding: 13px;
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
      }

      .ownerAvatar {
        width: 60px;
        height: 60px;
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
        font-size: 12px;
      }

      .toggleGrid {
        margin-top: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .toggleRow {
        min-height: 48px;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border: 1px solid #eaecf0;
        border-radius: 11px;
      }

      .toggleRow > span {
        font-size: 12px;
        font-weight: 800;
      }

      .switch {
        width: 46px;
        height: 26px;
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
        transition: 0.2s;
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
        opacity: 0.8;
        cursor: default;
      }

      .lockedNote {
        margin-top: 13px;
        color: #667085;
        font-size: 11px;
      }

      .lostBox {
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 13px;
        background: #ecfdf3;
      }

      .lostBox.lost {
        background: #fff1f0;
      }

      .lostBox p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 11px;
      }

      .previewHeader {
        display: flex;
        justify-content: space-between;
        gap: 20px;
      }

      .previewHeader p {
        color: #667085;
        font-size: 12px;
      }

      .previewButton {
        height: 42px;
        padding: 0 15px;
        border: 0;
        border-radius: 10px;
        background: #1465e8;
        color: white;
        font-weight: 900;
      }

      .preview {
        margin-top: 20px;
        padding: 20px;
        border-radius: 15px;
        background: #f7f9fc;
      }

      .previewStatus {
        font-size: 11px;
        font-weight: 900;
      }

      .previewOwner,
      .additionalPreview,
      .finderMessage {
        margin-top: 15px;
        padding: 13px;
        border-radius: 11px;
        background: white;
      }

      .preview p {
        margin: 5px 0;
        font-size: 12px;
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
        font-size: 11px;
        font-weight: 800;
      }

      .errorBox {
        padding: 13px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
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
        border-radius: 10px;
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
      }

      @media (max-width: 650px) {
        .two,
        .toggleGrid {
          grid-template-columns: 1fr;
        }

        .previewHeader {
          flex-direction: column;
        }

        .card {
          padding: 21px;
        }
      }
    `}</style>
  );
}
