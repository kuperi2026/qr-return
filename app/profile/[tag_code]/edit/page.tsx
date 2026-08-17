"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  tag_code: string;
  item_type: string;
  item_name: string | null;
  colour: string | null;
  sex: string | null;
  date_of_birth: string | null;
  weight: number | null;
  medical_info: string | null;
  brand: string | null;
  model: string | null;
  size: string | null;
  material: string | null;
  distinctive_features: string | null;
  description: string | null;
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  finder_message: string | null;
  contact_preference: string | null;
  location_sharing_enabled: boolean | null;
};

type FormState = {
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
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  finder_message: string;
  contact_preference: string;
};

const emptyForm: FormState = {
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
  owner_name: "",
  owner_phone: "",
  owner_email: "",
  finder_message: "",
  contact_preference: "both",
};

export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();

  const rawTag = params?.tag_code;

  const tagCode = Array.isArray(rawTag)
    ? rawTag[0]
    : typeof rawTag === "string"
    ? rawTag
    : "";

  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [locationSharingEnabled, setLocationSharingEnabled] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!tagCode) {
        setError("QR კოდი ვერ მოიძებნა.");
        setLoading(false);
        return;
      }

      const decodedTag = decodeURIComponent(tagCode);

      const { data, error: fetchError } = await supabase
        .from("item")
        .select("*")
        .eq("tag_code", decodedTag)
        .maybeSingle();

      if (fetchError) {
        console.error(fetchError);
        setError(
          `პროფილის ჩატვირთვა ვერ მოხერხდა: ${fetchError.message}`
        );
        setLoading(false);
        return;
      }

      if (!data) {
        setError("ამ QR კოდზე პროფილი არ მოიძებნა.");
        setLoading(false);
        return;
      }

      const current = data as Profile;

      setProfile(current);

      setForm({
        item_name: current.item_name || "",
        colour: current.colour || "",
        sex: current.sex || "",
        date_of_birth: current.date_of_birth || "",
        weight:
          current.weight !== null && current.weight !== undefined
            ? String(current.weight)
            : "",
        medical_info: current.medical_info || "",
        brand: current.brand || "",
        model: current.model || "",
        size: current.size || "",
        material: current.material || "",
        distinctive_features: current.distinctive_features || "",
        description: current.description || "",
        owner_name: current.owner_name || "",
        owner_phone: current.owner_phone || "",
        owner_email: current.owner_email || "",
        finder_message: current.finder_message || "",
        contact_preference: current.contact_preference || "both",
      });

      setLocationSharingEnabled(
        Boolean(current.location_sharing_enabled)
      );

      setLoading(false);
    }

    loadProfile();
  }, [tagCode]);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!profile) return;

    if (!form.item_name.trim()) {
      setError("სახელი ან ნივთის დასახელება სავალდებულოა.");
      return;
    }

    if (!form.owner_phone.trim()) {
      setError("მფლობელის ტელეფონის ნომერი სავალდებულოა.");
      return;
    }

    if (!form.owner_email.trim()) {
      setError("მფლობელის ელფოსტა სავალდებულოა.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const isPet =
      profile.item_type === "dog" ||
      profile.item_type === "cat";

    const finderMessage = form.finder_message.trim();

    const payload = {
      item_name: form.item_name.trim(),
      colour: form.colour.trim() || null,

      sex: isPet ? form.sex || null : null,

      date_of_birth:
        isPet ? form.date_of_birth || null : null,

      weight:
        isPet && form.weight.trim()
          ? Number(form.weight)
          : null,

      medical_info:
        isPet
          ? form.medical_info.trim() || null
          : null,

      brand:
        !isPet
          ? form.brand.trim() || null
          : null,

      model:
        !isPet
          ? form.model.trim() || null
          : null,

      size:
        !isPet
          ? form.size.trim() || null
          : null,

      material:
        !isPet
          ? form.material.trim() || null
          : null,

      distinctive_features:
        !isPet
          ? form.distinctive_features.trim() || null
          : null,

      description:
        form.description.trim() || null,

      owner_name:
        form.owner_name.trim() || null,

      owner_phone:
        form.owner_phone.trim(),

      owner_email:
        form.owner_email.trim(),

      finder_message:
        finderMessage || null,

      owner_message_enabled:
        finderMessage.length > 0,

      contact_preference:
        form.contact_preference,

      location_sharing_enabled:
        locationSharingEnabled,
    };

    const { error: updateError } = await supabase
      .from("item")
      .update(payload)
      .eq("tag_code", profile.tag_code);

    if (updateError) {
      console.error(updateError);

      setError(
        `ცვლილებების შენახვა ვერ მოხერხდა: ${updateError.message}`
      );

      setSaving(false);
      return;
    }

    setSuccess("ცვლილებები წარმატებით შეინახა.");
    setSaving(false);

    setTimeout(() => {
      router.push(
        `/profile/${encodeURIComponent(profile.tag_code)}`
      );
    }, 700);
  }

  if (loading) {
    return (
      <>
        <main className="centerPage">
          <div className="logo centerLogo">QR</div>
          <h1>QR RETURN</h1>
          <p>პროფილი იტვირთება...</p>
        </main>

        <Styles />
      </>
    );
  }

  if (error && !profile) {
    return (
      <>
        <main className="centerPage">
          <div className="logo centerLogo">QR</div>

          <h1>QR RETURN</h1>

          <div className="errorBox">
            {error}
          </div>

          <a href="/" className="homeButton">
            მთავარ გვერდზე დაბრუნება
          </a>
        </main>

        <Styles />
      </>
    );
  }

  if (!profile) {
    return null;
  }

  const isPet =
    profile.item_type === "dog" ||
    profile.item_type === "cat";

  return (
    <>
      <main className="page">
        <header className="header">
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>EDIT PROFILE</small>
            </div>
          </a>

          <a
            href={`/profile/${encodeURIComponent(
              profile.tag_code
            )}`}
            className="backLink"
          >
            ← პროფილზე დაბრუნება
          </a>
        </header>

        <div className="container">
          <form
            className="card"
            onSubmit={handleSubmit}
          >
            <div className="top">
              <div className="eyebrow">
                EDIT PROFILE
              </div>

              <h1>
                პროფილის რედაქტირება
              </h1>

              <p>
                QR კოდი:{" "}
                <strong>{profile.tag_code}</strong>
              </p>

              <div className="locked">
                🔒 QR კოდი და კატეგორია არ იცვლება
              </div>
            </div>

            <section className="section">
              <h2>
                {isPet
                  ? "ცხოველის ინფორმაცია"
                  : "ნივთის ინფორმაცია"}
              </h2>

              <Field
                label={
                  isPet
                    ? "სახელი"
                    : "ნივთის დასახელება"
                }
                value={form.item_name}
                onChange={(value) =>
                  updateField("item_name", value)
                }
                required
              />

              <div className="grid">
                <Field
                  label="ფერი"
                  value={form.colour}
                  onChange={(value) =>
                    updateField("colour", value)
                  }
                />

                {isPet ? (
                  <SelectField
                    label="სქესი"
                    value={form.sex}
                    onChange={(value) =>
                      updateField("sex", value)
                    }
                    options={[
                      {
                        value: "",
                        label: "აირჩიეთ",
                      },
                      {
                        value: "male",
                        label: "მამრობითი",
                      },
                      {
                        value: "female",
                        label: "მდედრობითი",
                      },
                    ]}
                  />
                ) : (
                  <Field
                    label="ბრენდი"
                    value={form.brand}
                    onChange={(value) =>
                      updateField("brand", value)
                    }
                  />
                )}
              </div>

              {isPet ? (
                <>
                  <div className="grid">
                    <Field
                      label="დაბადების თარიღი"
                      type="date"
                      value={form.date_of_birth}
                      onChange={(value) =>
                        updateField(
                          "date_of_birth",
                          value
                        )
                      }
                    />

                    <Field
                      label="წონა"
                      type="number"
                      value={form.weight}
                      onChange={(value) =>
                        updateField("weight", value)
                      }
                    />
                  </div>

                  <TextArea
                    label="სამედიცინო ინფორმაცია"
                    value={form.medical_info}
                    onChange={(value) =>
                      updateField(
                        "medical_info",
                        value
                      )
                    }
                  />
                </>
              ) : (
                <>
                  <div className="grid">
                    <Field
                      label="მოდელი"
                      value={form.model}
                      onChange={(value) =>
                        updateField("model", value)
                      }
                    />

                    <Field
                      label="ზომა"
                      value={form.size}
                      onChange={(value) =>
                        updateField("size", value)
                      }
                    />
                  </div>

                  <Field
                    label="მასალა"
                    value={form.material}
                    onChange={(value) =>
                      updateField("material", value)
                    }
                  />

                  <TextArea
                    label="განმასხვავებელი ნიშნები"
                    value={form.distinctive_features}
                    onChange={(value) =>
                      updateField(
                        "distinctive_features",
                        value
                      )
                    }
                  />
                </>
              )}

              <TextArea
                label="დამატებითი აღწერა"
                value={form.description}
                onChange={(value) =>
                  updateField("description", value)
                }
              />
            </section>

            <section className="section">
              <h2>მფლობელის ინფორმაცია</h2>

              <Field
                label="სახელი და გვარი"
                value={form.owner_name}
                onChange={(value) =>
                  updateField("owner_name", value)
                }
              />

              <Field
                label="ტელეფონი"
                type="tel"
                value={form.owner_phone}
                onChange={(value) =>
                  updateField("owner_phone", value)
                }
                required
              />

              <Field
                label="ელფოსტა"
                type="email"
                value={form.owner_email}
                onChange={(value) =>
                  updateField("owner_email", value)
                }
                required
              />

              <SelectField
                label="დაკავშირების მეთოდი"
                value={form.contact_preference}
                onChange={(value) =>
                  updateField(
                    "contact_preference",
                    value
                  )
                }
                options={[
                  {
                    value: "both",
                    label: "Live Chat და ტელეფონი",
                  },
                  {
                    value: "chat",
                    label: "Live Chat",
                  },
                  {
                    value: "phone",
                    label: "ტელეფონი",
                  },
                ]}
              />
            </section>

            <section className="section">
              <h2>მპოვნელისთვის</h2>

              <TextArea
                label="შეტყობინება მპოვნელისთვის"
                value={form.finder_message}
                onChange={(value) =>
                  updateField(
                    "finder_message",
                    value
                  )
                }
              />

              <div className="locationCard">
                <div>
                  <strong>
                    ლოკაციის გაზიარება
                  </strong>

                  <p>
                    თუ ჩართულია, მპოვნელს
                    შეეძლება თავისი მიმდინარე
                    მდებარეობის გაზიარება.
                  </p>
                </div>

                <button
                  type="button"
                  className={
                    locationSharingEnabled
                      ? "switch active"
                      : "switch"
                  }
                  onClick={() =>
                    setLocationSharingEnabled(
                      !locationSharingEnabled
                    )
                  }
                >
                  <span />
                </button>
              </div>
            </section>

            {error && (
              <div className="errorBox">
                {error}
              </div>
            )}

            {success && (
              <div className="successBox">
                {success}
              </div>
            )}

            <div className="actions">
              <a
                href={`/profile/${encodeURIComponent(
                  profile.tag_code
                )}`}
                className="cancelButton"
              >
                გაუქმება
              </a>

              <button
                type="submit"
                className="saveButton"
                disabled={saving}
              >
                {saving
                  ? "ინახება..."
                  : "ცვლილებების შენახვა"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Styles />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option.value || "empty"}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
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

      .page {
        min-height: 100vh;
        color: #101828;
        font-family: Arial, Helvetica, sans-serif;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1050px;
        min-height: 78px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e7ebf0;
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
        margin-top: 2px;
        color: #98a2b3;
        font-size: 7px;
        letter-spacing: 2px;
      }

      .backLink {
        color: #475467;
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 760px;
        margin: auto;
        padding: 45px 0 80px;
      }

      .card {
        padding: 28px;
        border: 1px solid #e1e6ec;
        border-radius: 24px;
        background: white;
      }

      .top h1 {
        margin: 8px 0;
        font-size: 34px;
      }

      .top p {
        color: #667085;
        font-size: 12px;
      }

      .eyebrow {
        color: #1465e8;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .locked {
        width: fit-content;
        margin-top: 12px;
        padding: 8px 11px;
        border-radius: 10px;
        background: #f2f4f7;
        color: #667085;
        font-size: 10px;
        font-weight: 700;
      }

      .section {
        margin-top: 30px;
        padding-top: 25px;
        border-top: 1px solid #edf0f3;
      }

      .section h2 {
        margin: 0 0 18px;
        font-size: 18px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .field {
        display: block;
        margin-bottom: 16px;
      }

      .field > span {
        display: block;
        margin-bottom: 7px;
        color: #344054;
        font-size: 11px;
        font-weight: 800;
      }

      .field input,
      .field select,
      .field textarea {
        width: 100%;
        border: 1px solid #d5dae1;
        border-radius: 12px;
        background: white;
        color: #101828;
        outline: none;
      }

      .field input,
      .field select {
        height: 53px;
        padding: 0 14px;
      }

      .field textarea {
        min-height: 105px;
        padding: 14px;
        resize: vertical;
      }

      .field input:focus,
      .field select:focus,
      .field textarea:focus {
        border-color: #1465e8;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      .locationCard {
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
        max-width: 520px;
        margin: 5px 0 0;
        color: #7b8492;
        font-size: 10px;
        line-height: 1.5;
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

      .errorBox,
      .successBox {
        margin-top: 18px;
        padding: 14px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
      }

      .errorBox {
        background: #fff1f1;
        color: #b42318;
      }

      .successBox {
        background: #ecfdf3;
        color: #027a48;
      }

      .actions {
        margin-top: 28px;
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 10px;
      }

      .cancelButton,
      .saveButton,
      .homeButton {
        min-height: 54px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 900;
        text-decoration: none;
      }

      .cancelButton {
        border: 1px solid #d5dae1;
        background: white;
        color: #475467;
      }

      .saveButton {
        border: 0;
        background: #1465e8;
        color: white;
        cursor: pointer;
      }

      .saveButton:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .centerPage {
        width: calc(100% - 24px);
        max-width: 500px;
        margin: auto;
        padding-top: 130px;
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
      }

      .centerLogo {
        margin: auto;
      }

      .centerPage h1 {
        color: #1465e8;
      }

      .centerPage p {
        color: #667085;
      }

      .homeButton {
        margin-top: 20px;
        background: #1465e8;
        color: white;
      }

      @media (max-width: 600px) {
        .header {
          min-height: 70px;
        }

        .backLink {
          display: none;
        }

        .container {
          padding-top: 25px;
        }

        .card {
          padding: 18px 14px;
          border-radius: 18px;
        }

        .top h1 {
          font-size: 27px;
        }

        .grid {
          grid-template-columns: 1fr;
          gap: 0;
        }

        .field input,
        .field select,
        .field textarea {
          font-size: 16px;
        }

        .actions {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
