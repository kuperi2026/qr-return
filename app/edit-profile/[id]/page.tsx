"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Profile = {
  id: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  photo: string | null;
  colour: string | null;
  description: string | null;
  finder_message: string | null;
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
  active: boolean | null;
  tag_code: string | null;
};

export default function EditProfilePage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [lang, setLang] = useState<Lang>("ka");

  const [profile, setProfile] = useState<Profile | null>(null);

  const [itemName, setItemName] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [colour, setColour] = useState("");
  const [description, setDescription] = useState("");
  const [finderMessage, setFinderMessage] = useState("");

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

  const [active, setActive] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const ka = lang === "ka";

  const isPet =
    profile?.item_type === "pet" ||
    profile?.pet_type === "dog" ||
    profile?.pet_type === "cat";

  useEffect(() => {
    loadProfile();
  }, [id]);

  async function loadProfile() {
    if (!id) return;

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

      const { data, error: profileError } = await supabase
        .from("item")
        .select(`
          id,
          item_name,
          item_type,
          pet_type,
          photo,
          colour,
          description,
          finder_message,
          sex,
          date_of_birth,
          weight,
          medical_info,
          behaviour_note,
          brand,
          model,
          size,
          material,
          distinctive_features,
          active,
          tag_code
        `)
        .eq("id", id)
        .eq("owner_id", user.id)
        .single();

      if (profileError || !data) {
        throw new Error(
          ka
            ? "პროფილი ვერ მოიძებნა."
            : "Profile not found."
        );
      }

      const p = data as Profile;

      setProfile(p);

      setItemName(p.item_name ?? "");
      setPhoto(p.photo ?? "");
      setColour(p.colour ?? "");
      setDescription(p.description ?? "");
      setFinderMessage(p.finder_message ?? "");

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

      setActive(Boolean(p.active));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილი ვერ ჩაიტვირთა."
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

    const { error: uploadError } = await supabase.storage
      .from("qr-return-images")
      .upload(path, photoFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("qr-return-images")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!itemName.trim()) {
      setError(
        ka
          ? "პროფილის სახელი სავალდებულოა."
          : "Profile name is required."
      );
      return;
    }

    if (!profile || !id) return;

    setSaving(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const photoUrl = await uploadPhoto(user.id);

      const updates: Record<string, unknown> = {
        item_name: itemName.trim(),
        photo: photoUrl,
        colour: colour.trim() || null,
        description: description.trim() || null,
        finder_message: finderMessage.trim() || null,
        active,
      };

      if (isPet) {
        updates.sex = sex || null;
        updates.date_of_birth = dateOfBirth || null;
        updates.weight = weight.trim() || null;
        updates.medical_info = medicalInfo.trim() || null;
        updates.behaviour_note = behaviourNote.trim() || null;
      } else {
        updates.brand = brand.trim() || null;
        updates.model = model.trim() || null;
        updates.size = size.trim() || null;
        updates.material = material.trim() || null;
        updates.distinctive_features =
          features.trim() || null;
      }

      /*
        IMPORTANT:
        item_type და pet_type აქ საერთოდ არ იგზავნება.
        ამიტომ მომხმარებელი პროფილის კატეგორიას ვერ ცვლის.
      */

      const { error: updateError } = await supabase
        .from("item")
        .update(updates)
        .eq("id", id)
        .eq("owner_id", user.id);

      if (updateError) {
        throw updateError;
      }

      setPhoto(photoUrl ?? "");

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

  function profileTypeName() {
    if (!profile) return "";

    if (profile.pet_type === "dog") {
      return ka ? "ძაღლი" : "Dog";
    }

    if (profile.pet_type === "cat") {
      return ka ? "კატა" : "Cat";
    }

    if (profile.item_type === "keys") {
      return ka ? "გასაღები" : "Keys";
    }

    if (profile.item_type === "wallet") {
      return ka ? "საფულე" : "Wallet";
    }

    if (profile.item_type === "bag") {
      return ka ? "ჩანთა" : "Bag";
    }

    if (profile.item_type === "suitcase") {
      return ka ? "ჩემოდანი" : "Suitcase";
    }

    return ka ? "პროფილი" : "Profile";
  }

  function profileIcon() {
    if (!profile) return "🏷️";

    if (profile.pet_type === "dog") return "🐶";
    if (profile.pet_type === "cat") return "🐱";
    if (profile.item_type === "keys") return "🔑";
    if (profile.item_type === "wallet") return "👛";
    if (profile.item_type === "bag") return "👜";
    if (profile.item_type === "suitcase") return "🧳";

    return "🏷️";
  }

  if (loading) {
    return (
      <main className="loadingPage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="loadingPage">
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
        <a href="/my-profiles" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>EDIT PROFILE</small>
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
        <a href="/my-profiles" className="back">
          ← {ka ? "ჩემი პროფილები" : "My profiles"}
        </a>

        <div className="heading">
          <div className="profileIcon">
            {profileIcon()}
          </div>

          <div className="headingText">
            <div className="eyebrow">
              {ka ? "პროფილის რედაქტირება" : "EDIT PROFILE"}
            </div>

            <h1>{itemName || profileTypeName()}</h1>

            <div className="lockedType">
              🔒 {profileTypeName()}
              <span>
                {ka
                  ? "პროფილის ტიპი არ იცვლება"
                  : "Profile type cannot be changed"}
              </span>
            </div>

            {profile.tag_code && (
              <div className="qrCode">
                QR · {profile.tag_code}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSave} className="form">
          <section className="card">
            <h2>
              {ka
                ? "ძირითადი ინფორმაცია"
                : "Basic information"}
            </h2>

            {photo && (
              <div className="currentPhoto">
                <img src={photo} alt={itemName} />
              </div>
            )}

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
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
                }
                required
              />
            </label>

            <label>
              <span>
                {ka ? "ფოტოს შეცვლა" : "Change photo"}
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotoFile(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </label>

            <label>
              <span>{ka ? "ფერი" : "Color"}</span>

              <input
                value={colour}
                onChange={(e) =>
                  setColour(e.target.value)
                }
              />
            </label>

            <label>
              <span>
                {ka ? "აღწერა" : "Description"}
              </span>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </label>
          </section>

          {isPet ? (
            <section className="card">
              <h2>
                {ka
                  ? "ცხოველის ინფორმაცია"
                  : "Pet information"}
              </h2>

              <div className="twoColumns">
                <label>
                  <span>{ka ? "სქესი" : "Sex"}</span>

                  <select
                    value={sex}
                    onChange={(e) =>
                      setSex(e.target.value)
                    }
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
                  />
                </label>
              </div>

              <label>
                <span>{ka ? "წონა" : "Weight"}</span>

                <input
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
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
                />
              </label>

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
            </section>
          ) : (
            <section className="card">
              <h2>
                {ka
                  ? "ნივთის ინფორმაცია"
                  : "Item information"}
              </h2>

              <div className="twoColumns">
                <label>
                  <span>{ka ? "ბრენდი" : "Brand"}</span>

                  <input
                    value={brand}
                    onChange={(e) =>
                      setBrand(e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>{ka ? "მოდელი" : "Model"}</span>

                  <input
                    value={model}
                    onChange={(e) =>
                      setModel(e.target.value)
                    }
                  />
                </label>
              </div>

              <div className="twoColumns">
                <label>
                  <span>{ka ? "ზომა" : "Size"}</span>

                  <input
                    value={size}
                    onChange={(e) =>
                      setSize(e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>
                    {ka ? "მასალა" : "Material"}
                  </span>

                  <input
                    value={material}
                    onChange={(e) =>
                      setMaterial(e.target.value)
                    }
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
                  onChange={(e) =>
                    setFeatures(e.target.value)
                  }
                />
              </label>
            </section>
          )}

          <section className="card">
            <h2>
              {ka
                ? "დაკარგვის რეჟიმი"
                : "Lost mode"}
            </h2>

            <div
              className={`lostMode ${
                active ? "isLost" : ""
              }`}
            >
              <div>
                <strong>
                  {active
                    ? ka
                      ? "დაკარგულად მონიშნულია"
                      : "Marked as lost"
                    : ka
                    ? "უსაფრთხოდ არის"
                    : "Marked as safe"}
                </strong>

                <p>
                  {ka
                    ? "ჩართეთ მხოლოდ მაშინ, როდესაც ეს ცხოველი ან ნივთი დაკარგულია."
                    : "Turn this on only when this pet or item is lost."}
                </p>
              </div>

              <button
                type="button"
                className={`toggle ${
                  active ? "on" : ""
                }`}
                onClick={() =>
                  setActive((current) => !current)
                }
              >
                <span />
              </button>
            </div>
          </section>

          <section className="card">
            <h2>
              {ka
                ? "მპოვნელისთვის"
                : "For the finder"}
            </h2>

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
              />
            </label>
          </section>

          {error && (
            <div className="errorBox">
              <strong>!</strong>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="successBox">
              ✓ {success}
            </div>
          )}

          <div className="actions">
            <a href="/my-profiles">
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
                ? "ცვლილებების შენახვა"
                : "Save changes"}
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
        }

        input,
        textarea,
        select,
        button {
          font: inherit;
        }

        .loadingPage {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          text-align: center;
          font-family: Inter, Arial, sans-serif;
          color: #667085;
          background: #f7f9fc;
        }

        .page {
          min-height: 100vh;
          font-family: Inter, Arial, sans-serif;
          color: #101828;
          background: #f7f9fc;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 1180px;
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
          background: linear-gradient(135deg,#1465e8,#7655f7);
          color: white;
          font-weight: 900;
        }

        .brand strong {
          display: block;
          color: #1465e8;
          font-size: 21px;
          font-weight: 900;
        }

        .brand small {
          display: block;
          margin-top: 3px;
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .languages {
          padding: 4px;
          display: flex;
          background: #eaecf0;
          border-radius: 10px;
        }

        .languages button {
          padding: 8px 11px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          font-size: 11px;
          font-weight: 900;
        }

        .languages .active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 36px);
          max-width: 820px;
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

        .profileIcon {
          width: 76px;
          height: 76px;
          flex: 0 0 76px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          background: linear-gradient(135deg,#eef4ff,#f0edff);
          font-size: 40px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 5px 0 9px;
          font-size: 34px;
        }

        .lockedType {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
          color: #475467;
          font-size: 13px;
          font-weight: 900;
        }

        .lockedType span {
          color: #98a2b3;
          font-size: 11px;
          font-weight: 700;
        }

        .qrCode {
          margin-top: 7px;
          color: #98a2b3;
          font-size: 11px;
        }

        .form {
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
          margin: 0 0 25px;
          font-size: 21px;
        }

        .currentPhoto {
          width: 120px;
          height: 120px;
          margin-bottom: 22px;
          overflow: hidden;
          border-radius: 18px;
          background: #eef4ff;
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

        label:first-of-type {
          margin-top: 0;
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

        input:focus,
        textarea:focus,
        select:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20,101,232,.08);
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .lostMode {
          padding: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid #d1fadf;
          border-radius: 14px;
          background: #f6fef9;
        }

        .lostMode.isLost {
          border-color: #fecdca;
          background: #fff6f5;
        }

        .lostMode strong {
          font-size: 14px;
        }

        .lostMode p {
          margin: 5px 0 0;
          color: #667085;
          font-size: 12px;
        }

        .toggle {
          width: 50px;
          height: 28px;
          flex: 0 0 50px;
          padding: 3px;
          border: 0;
          border-radius: 999px;
          background: #d0d5dd;
          cursor: pointer;
        }

        .toggle span {
          width: 22px;
          height: 22px;
          display: block;
          border-radius: 50%;
          background: white;
          transition: transform .2s ease;
        }

        .toggle.on {
          background: #d92d20;
        }

        .toggle.on span {
          transform: translateX(22px);
        }

        .errorBox {
          padding: 13px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 13px;
        }

        .successBox {
          padding: 13px;
          border: 1px solid #abefc6;
          border-radius: 10px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 13px;
          font-weight: 800;
        }

        .actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 12px;
        }

        .actions a {
          padding: 14px 18px;
          color: #667085;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .actions button {
          min-height: 50px;
          padding: 0 22px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(135deg,#1465e8,#7655f7);
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .actions button:disabled {
          opacity: .65;
        }

        @media(max-width:600px) {
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .heading h1 {
            font-size: 28px;
          }

          .card {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  );
}
