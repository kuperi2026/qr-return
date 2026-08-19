"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const allowedTypes = [
  "dog",
  "cat",
  "keys",
  "wallet",
  "bag",
  "suitcase",
] as const;

type ProfileType = (typeof allowedTypes)[number];
type Lang = "ka" | "en";

const config: Record<
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

export default function RegisterProfilePage() {
  const params = useParams();

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const profileType = allowedTypes.includes(rawType as ProfileType)
    ? (rawType as ProfileType)
    : null;

  const [lang, setLang] = useState<Lang>("ka");

  const [itemName, setItemName] = useState("");
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

  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  const ka = lang === "ka";
  const isPet = profileType === "dog" || profileType === "cat";

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setChecking(false);
    }

    checkUser();
  }, []);

  async function uploadPhoto(userId: string) {
    if (!photoFile) return null;

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

    if (!profileType) {
      setError(
        ka
          ? "პროფილის ტიპი არასწორია."
          : "Invalid profile type."
      );
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
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const photoUrl = await uploadPhoto(user.id);

      const tagCode =
        "QR-" +
        crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();

      const row: Record<string, unknown> = {
        owner_id: user.id,
        owner_email: user.email ?? "",
        owner_phone: user.user_metadata?.phone ?? "",

        tag_code: tagCode,

        item_name: itemName.trim(),
        colour: colour.trim() || null,
        description: description.trim() || null,
        finder_message: finderMessage.trim() || null,
        photo: photoUrl,

        active: false,

        item_type: isPet ? "pet" : profileType,
        pet_type: isPet ? profileType : null,
      };

      if (isPet) {
        row.sex = sex || null;
        row.date_of_birth = dateOfBirth || null;
        row.weight = weight || null;
        row.medical_info = medicalInfo.trim() || null;
        row.behaviour_note = behaviourNote.trim() || null;
      } else {
        row.brand = brand.trim() || null;
        row.model = model.trim() || null;
        row.size = size.trim() || null;
        row.material = material.trim() || null;
        row.distinctive_features = features.trim() || null;
      }

      const { error: insertError } = await supabase
        .from("item")
        .insert(row);

      if (insertError) {
        throw insertError;
      }

      window.location.href = "/my-profiles";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილის შენახვა ვერ მოხერხდა."
          : "Could not save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <main className="loadingPage">
        {ka ? "იტვირთება..." : "Loading..."}
      </main>
    );
  }

  if (!profileType) {
    return (
      <main className="loadingPage">
        {ka
          ? "პროფილის ტიპი ვერ მოიძებნა."
          : "Profile type not found."}
      </main>
    );
  }

  const current = config[profileType];

  return (
    <main className="page">
      <header className="header">
        <a href="/my-profiles" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>NEW PROFILE</small>
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
        <a href="/add-profile" className="back">
          ← {ka ? "კატეგორიის არჩევა" : "Choose category"}
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
                ? `${current.ka} — ახალი პროფილი`
                : `New ${current.en} profile`}
            </h1>

            <p>
              {ka
                ? "შეავსეთ პროფილის ინფორმაცია. ამ პროფილის ტიპს შემდეგ ვეღარ შეცვლით."
                : "Enter the profile details. This profile type cannot be changed later."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="form">
          <section className="card">
            <h2>
              {ka
                ? "ძირითადი ინფორმაცია"
                : "Basic information"}
            </h2>

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
                type="text"
                value={itemName}
                onChange={(e) =>
                  setItemName(e.target.value)
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
              <span>{ka ? "ფოტო" : "Photo"}</span>

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
                type="text"
                value={colour}
                onChange={(e) =>
                  setColour(e.target.value)
                }
              />
            </label>

            <label>
              <span>{ka ? "აღწერა" : "Description"}</span>

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
                  type="text"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  placeholder={ka ? "მაგ. 8 კგ" : "e.g. 8 kg"}
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
                    type="text"
                    value={brand}
                    onChange={(e) =>
                      setBrand(e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>{ka ? "მოდელი" : "Model"}</span>

                  <input
                    type="text"
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
                    type="text"
                    value={size}
                    onChange={(e) =>
                      setSize(e.target.value)
                    }
                  />
                </label>

                <label>
                  <span>{ka ? "მასალა" : "Material"}</span>

                  <input
                    type="text"
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
              {ka ? "მპოვნელისთვის" : "For the finder"}
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
                placeholder={
                  ka
                    ? "მაგ. გთხოვთ დამიკავშირდეთ. დიდი მადლობა!"
                    : "e.g. Please contact me. Thank you!"
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
                ? "პროფილის შექმნა"
                : "Create profile"}
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
          font-family: Inter, Arial, sans-serif;
          color: #667085;
          background: #f7f9fc;
        }

        .page {
          min-height: 100vh;
          color: #101828;
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(
              circle at 8% 15%,
              rgba(20, 101, 232, 0.08),
              transparent 27%
            ),
            radial-gradient(
              circle at 93% 10%,
              rgba(118, 85, 247, 0.09),
              transparent 28%
            ),
            #f7f9fc;
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
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 14px;
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
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 11px;
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
          font-size: 40px;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .heading h1 {
          margin: 6px 0;
          font-size: 35px;
        }

        .heading p {
          margin: 0;
          color: #667085;
          font-size: 13px;
          line-height: 1.5;
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
          box-shadow:
            0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .errorBox {
          padding: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 13px;
        }

        .errorBox strong {
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d92d20;
          color: white;
          font-size: 10px;
        }

        .actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
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
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .actions button:disabled {
          opacity: 0.65;
        }

        @media (max-width: 600px) {
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .heading h1 {
            font-size: 29px;
          }

          .card {
            padding: 22px;
          }
        }
      `}</style>
    </main>
  );
}
