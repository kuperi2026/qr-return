"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FormData = {
  tag_code: string;
  item_type: string;
  pet_type: string;
  item_name: string;
  sex: string;
  colour: string;
  date_of_birth: string;
  weight: string;
  photo: string;
  owner_photo: string;
  owner_email: string;
  medical_info: string;
  finder_message: string;
  behaviour_note: string;
  contact_preference: string;
  location_sharing_enabled: boolean;
  owner_message_enabled: boolean;
  description: string;
  lost_message: string;
  lost_at: string;
  lost_seen_location: string;
  brand: string;
  model: string;
  size: string;
  material: string;
  distinctive_features: string;
};

const initialForm: FormData = {
  tag_code: "",
  item_type: "",
  pet_type: "",
  item_name: "",
  sex: "",
  colour: "",
  date_of_birth: "",
  weight: "",
  photo: "",
  owner_photo: "",
  owner_email: "",
  medical_info: "",
  finder_message: "",
  behaviour_note: "",
  contact_preference: "email",
  location_sharing_enabled: true,
  owner_message_enabled: true,
  description: "",
  lost_message: "",
  lost_at: "",
  lost_seen_location: "",
  brand: "",
  model: "",
  size: "",
  material: "",
  distinctive_features: "",
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const isPet = form.item_type === "pet";

  const update = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const chooseType = (
    itemType: string,
    petType = ""
  ) => {
    setForm((prev) => ({
      ...prev,
      item_type: itemType,
      pet_type: petType,
    }));
  };

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      tag_code: form.tag_code || null,
      item_type: form.item_type || null,
      item_name: form.item_name || null,
      owner_id: user?.id || null,

      sex: isPet ? form.sex || null : null,
      colour: isPet ? form.colour || null : null,
      date_of_birth:
        isPet && form.date_of_birth
          ? form.date_of_birth
          : null,
      weight:
        isPet && form.weight
          ? Number(form.weight)
          : null,

      photo: form.photo || null,
      owner_photo: form.owner_photo || null,
      owner_email: form.owner_email || null,

      medical_info:
        isPet ? form.medical_info || null : null,

      finder_message:
        form.finder_message || null,

      behaviour_note:
        isPet ? form.behaviour_note || null : null,

      contact_preference:
        form.contact_preference || null,

      location_sharing_enabled:
        form.location_sharing_enabled,

      owner_message_enabled:
        form.owner_message_enabled,

      description: form.description || null,

      lost_message: form.lost_message || null,
      lost_at: form.lost_at || null,
      lost_seen_location:
        form.lost_seen_location || null,

      brand: !isPet ? form.brand || null : null,
      model: !isPet ? form.model || null : null,
      size: !isPet ? form.size || null : null,
      material:
        !isPet ? form.material || null : null,

      distinctive_features:
        !isPet
          ? form.distinctive_features || null
          : null,

      pet_type: isPet
        ? form.pet_type || null
        : null,

      active: true,
      scan_count: 0,
      last_scanned_at: null,
      last_scan_latitude: null,
      last_scan_longitude: null,
      last_scan_accuracy: null,
    };

    const { error } = await supabase
      .from("items")
      .insert(payload);

    if (error) {
      console.error(error);
      setStatus("Error: " + error.message);
    } else {
      setStatus("Saved successfully");
      setForm(initialForm);
    }

    setSaving(false);
  }

  return (
    <main className="register-page">
      <div className="wrapper">

        <div className="header">
          <span className="small-title">
            QR TAG REGISTRATION
          </span>

          <h1>Register your tag</h1>

          <p>
            Add the information that can help return your
            pet or personal item safely.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* TYPE */}

          <section className="box">
            <div className="section-title">
              <span>01</span>
              <div>
                <h2>What are you registering?</h2>
                <p>
                  Choose the pet or item connected to this tag.
                </p>
              </div>
            </div>

            <div className="type-grid">

              <TypeButton
                icon="🐕"
                text="Dog"
                active={
                  form.item_type === "pet" &&
                  form.pet_type === "dog"
                }
                onClick={() =>
                  chooseType("pet", "dog")
                }
              />

              <TypeButton
                icon="🐈"
                text="Cat"
                active={
                  form.item_type === "pet" &&
                  form.pet_type === "cat"
                }
                onClick={() =>
                  chooseType("pet", "cat")
                }
              />

              <TypeButton
                icon="🔑"
                text="Keys"
                active={form.item_type === "keys"}
                onClick={() => chooseType("keys")}
              />

              <TypeButton
                icon="👛"
                text="Wallet"
                active={form.item_type === "wallet"}
                onClick={() => chooseType("wallet")}
              />

              <TypeButton
                icon="🧳"
                text="Suitcase"
                active={
                  form.item_type === "suitcase"
                }
                onClick={() =>
                  chooseType("suitcase")
                }
              />

              <TypeButton
                icon="🎒"
                text="Bag"
                active={form.item_type === "bag"}
                onClick={() => chooseType("bag")}
              />

            </div>
          </section>

          {/* BASIC INFORMATION */}

          <section className="box">
            <div className="section-title">
              <span>02</span>

              <div>
                <h2>Basic information</h2>
                <p>
                  Add the main identifying information.
                </p>
              </div>
            </div>

            <div className="grid">

              <Input
                label="Tag Code"
                value={form.tag_code}
                placeholder="FM-000001"
                required
                onChange={(v) =>
                  update("tag_code", v)
                }
              />

              <Input
                label={
                  isPet
                    ? "Pet Name"
                    : "Item Name"
                }
                value={form.item_name}
                placeholder={
                  isPet
                    ? "Charlie"
                    : "My travel bag"
                }
                required
                onChange={(v) =>
                  update("item_name", v)
                }
              />

              {isPet && (
                <>
                  <Select
                    label="Sex"
                    value={form.sex}
                    onChange={(v) =>
                      update("sex", v)
                    }
                    options={[
                      ["", "Select"],
                      ["male", "Male"],
                      ["female", "Female"],
                    ]}
                  />

                  <Input
                    label="Colour"
                    value={form.colour}
                    placeholder="Brown / White"
                    onChange={(v) =>
                      update("colour", v)
                    }
                  />

                  <Input
                    label="Date of Birth"
                    type="date"
                    value={form.date_of_birth}
                    onChange={(v) =>
                      update(
                        "date_of_birth",
                        v
                      )
                    }
                  />

                  <Input
                    label="Weight"
                    type="number"
                    value={form.weight}
                    placeholder="Weight"
                    onChange={(v) =>
                      update("weight", v)
                    }
                  />
                </>
              )}

            </div>

            <Textarea
              label="Description"
              value={form.description}
              placeholder="Add a description..."
              onChange={(v) =>
                update("description", v)
              }
            />

          </section>

          {/* PET INFO */}

          {isPet && (
            <section className="box">
              <div className="section-title">
                <span>03</span>

                <div>
                  <h2>Pet information</h2>
                  <p>
                    Health and behaviour details.
                  </p>
                </div>
              </div>

              <Textarea
                label="Medical Information"
                value={form.medical_info}
                placeholder="Medication, allergies, medical conditions..."
                onChange={(v) =>
                  update("medical_info", v)
                }
              />

              <Textarea
                label="Behaviour Note"
                value={form.behaviour_note}
                placeholder="Friendly, shy, afraid of loud sounds..."
                onChange={(v) =>
                  update("behaviour_note", v)
                }
              />
            </section>
          )}

          {/* ITEM INFO */}

          {!isPet && form.item_type && (
            <section className="box">
              <div className="section-title">
                <span>03</span>

                <div>
                  <h2>Item information</h2>
                  <p>
                    Add details that help identify it.
                  </p>
                </div>
              </div>

              <div className="grid">

                <Input
                  label="Brand"
                  value={form.brand}
                  placeholder="Samsonite"
                  onChange={(v) =>
                    update("brand", v)
                  }
                />

                <Input
                  label="Model"
                  value={form.model}
                  placeholder="Model"
                  onChange={(v) =>
                    update("model", v)
                  }
                />

                <Input
                  label="Size"
                  value={form.size}
                  placeholder="Small / Medium / Large"
                  onChange={(v) =>
                    update("size", v)
                  }
                />

                <Input
                  label="Material"
                  value={form.material}
                  placeholder="Leather"
                  onChange={(v) =>
                    update("material", v)
                  }
                />

              </div>

              <Textarea
                label="Distinctive Features"
                value={
                  form.distinctive_features
                }
                placeholder="Stickers, scratches, initials, unique marks..."
                onChange={(v) =>
                  update(
                    "distinctive_features",
                    v
                  )
                }
              />
            </section>
          )}

          {/* PHOTOS */}

          <section className="box">
            <div className="section-title">
              <span>04</span>

              <div>
                <h2>Photos</h2>
                <p>
                  Add photos of the pet/item and owner.
                </p>
              </div>
            </div>

            <div className="grid">

              <Input
                label={
                  isPet
                    ? "Pet Photo"
                    : "Item Photo"
                }
                value={form.photo}
                placeholder="Photo URL"
                onChange={(v) =>
                  update("photo", v)
                }
              />

              <Input
                label="Owner Photo"
                value={form.owner_photo}
                placeholder="Owner photo URL"
                onChange={(v) =>
                  update("owner_photo", v)
                }
              />

            </div>
          </section>

          {/* OWNER */}

          <section className="box">
            <div className="section-title">
              <span>05</span>

              <div>
                <h2>Owner contact</h2>
                <p>
                  Choose how the finder can contact you.
                </p>
              </div>
            </div>

            <div className="grid">

              <Input
                label="Owner Email"
                type="email"
                value={form.owner_email}
                placeholder="name@email.com"
                onChange={(v) =>
                  update("owner_email", v)
                }
              />

              <Select
                label="Contact Preference"
                value={
                  form.contact_preference
                }
                onChange={(v) =>
                  update(
                    "contact_preference",
                    v
                  )
                }
                options={[
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["whatsapp", "WhatsApp"],
                  ["live_chat", "Live Chat"],
                  ["both", "All available options"],
                ]}
              />

            </div>

            <Textarea
              label="Message to Finder"
              value={form.finder_message}
              placeholder="Thank you for finding my pet/item. Please contact me..."
              onChange={(v) =>
                update("finder_message", v)
              }
            />

          </section>

          {/* LOST */}

          <section className="box">
            <div className="section-title">
              <span>06</span>

              <div>
                <h2>Lost information</h2>
                <p>
                  This can be updated if the tag becomes lost.
                </p>
              </div>
            </div>

            <Textarea
              label="Lost Message"
              value={form.lost_message}
              placeholder="This pet/item is currently missing..."
              onChange={(v) =>
                update("lost_message", v)
              }
            />

            <div className="grid">

              <Input
                label="Lost At"
                type="datetime-local"
                value={form.lost_at}
                onChange={(v) =>
                  update("lost_at", v)
                }
              />

              <Input
                label="Last Seen Location"
                value={
                  form.lost_seen_location
                }
                placeholder="Central Park, New York"
                onChange={(v) =>
                  update(
                    "lost_seen_location",
                    v
                  )
                }
              />

            </div>
          </section>

          {/* SETTINGS */}

          <section className="box">

            <div className="section-title">
              <span>07</span>

              <div>
                <h2>Finder permissions</h2>
                <p>
                  Choose what the finder is allowed to do.
                </p>
              </div>
            </div>

            <Toggle
              title="Location Sharing"
              description="Allow the finder to share their current location with you."
              checked={
                form.location_sharing_enabled
              }
              onChange={(v) =>
                update(
                  "location_sharing_enabled",
                  v
                )
              }
            />

            <Toggle
              title="Owner Messages"
              description="Allow the finder to send you a message."
              checked={
                form.owner_message_enabled
              }
              onChange={(v) =>
                update(
                  "owner_message_enabled",
                  v
                )
              }
            />

          </section>

          {status && (
            <div
              className={
                status.startsWith("Error")
                  ? "status error"
                  : "status success"
              }
            >
              {status}
            </div>
          )}

          <button
            className="submit"
            type="submit"
            disabled={
              saving ||
              !form.item_type ||
              !form.tag_code ||
              !form.item_name
            }
          >
            {saving
              ? "Saving..."
              : "Register Tag"}
          </button>

        </form>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f6f7f7;
          color: #17211d;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .register-page {
          min-height: 100vh;
          padding: 55px 20px 90px;
        }

        .wrapper {
          width: 100%;
          max-width: 960px;
          margin: auto;
        }

        .header {
          margin-bottom: 35px;
        }

        .small-title {
          font-size: 12px;
          letter-spacing: 1.5px;
          font-weight: 800;
          color: #4d7566;
        }

        .header h1 {
          font-size: 44px;
          margin: 9px 0 10px;
          letter-spacing: -1.5px;
        }

        .header p {
          max-width: 650px;
          line-height: 1.6;
          color: #6f7975;
        }

        .box {
          background: #fff;
          border: 1px solid #e2e7e5;
          border-radius: 18px;
          padding: 30px;
          margin-bottom: 20px;
        }

        .section-title {
          display: flex;
          gap: 15px;
          margin-bottom: 27px;
        }

        .section-title > span {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #eef4f1;
          color: #3e6c5c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .section-title h2 {
          margin: 0 0 5px;
          font-size: 20px;
        }

        .section-title p {
          margin: 0;
          color: #7a8580;
          font-size: 14px;
        }

        .type-grid {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .type-btn {
          min-height: 70px;
          border: 1px solid #d9e0dd;
          background: white;
          border-radius: 13px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .type-btn.active {
          background: #eff6f2;
          border: 2px solid #4f796a;
          color: #315b4c;
        }

        .type-icon {
          font-size: 24px;
        }

        .grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-bottom: 18px;
        }

        .field {
          width: 100%;
          margin-bottom: 18px;
        }

        .grid .field {
          margin-bottom: 0;
        }

        .field label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .required {
          color: #b84646;
        }

        .field input,
        .field select,
        .field textarea {
          width: 100%;
          border: 1px solid #d7deda;
          background: #fbfcfb;
          border-radius: 11px;
          outline: none;
          font-size: 15px;
        }

        .field input,
        .field select {
          height: 54px;
          padding: 0 15px;
        }

        .field textarea {
          padding: 15px;
          min-height: 115px;
          resize: vertical;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          background: #fff;
          border-color: #5d8576;
          box-shadow:
            0 0 0 3px
            rgba(93, 133, 118, 0.1);
        }

        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 25px;
          padding: 17px 0;
          border-bottom: 1px solid #edf0ef;
        }

        .toggle-row:last-child {
          border-bottom: none;
        }

        .toggle-title {
          font-weight: 700;
          margin-bottom: 5px;
        }

        .toggle-description {
          color: #78827e;
          font-size: 13px;
          line-height: 1.45;
        }

        .switch {
          width: 54px;
          height: 30px;
          border: none;
          border-radius: 30px;
          background: #ccd4d0;
          padding: 0;
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
        }

        .switch span {
          width: 22px;
          height: 22px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 4px;
          left: 4px;
          transition: 0.2s;
        }

        .switch.on {
          background: #477565;
        }

        .switch.on span {
          left: 28px;
        }

        .submit {
          width: 100%;
          height: 60px;
          border: none;
          border-radius: 13px;
          background: #17251f;
          color: white;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .status {
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .success {
          background: #ecf8f1;
          color: #27613e;
        }

        .error {
          background: #fff0f0;
          color: #9b3434;
        }

        @media (max-width: 700px) {
          .register-page {
            padding: 35px 12px 60px;
          }

          .box {
            padding: 21px 16px;
          }

          .header h1 {
            font-size: 35px;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .type-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function TypeButton({
  icon,
  text,
  active,
  onClick,
}: {
  icon: string;
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`type-btn ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span className="type-icon">
        {icon}
      </span>
      {text}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label>
        {label}
        {required && (
          <span className="required"> *</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="field">
      <label>{label}</label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
      >
        {options.map(
          ([value, label]) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

function Toggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="toggle-row">
      <div>
        <div className="toggle-title">
          {title}
        </div>

        <div className="toggle-description">
          {description}
        </div>
      </div>

      <button
        type="button"
        className={`switch ${
          checked ? "on" : ""
        }`}
        onClick={() =>
          onChange(!checked)
        }
      >
        <span />
      </button>
    </div>
  );
}
