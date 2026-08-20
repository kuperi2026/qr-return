"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Settings = {
  phone: string;
  support_email: string;
  whatsapp_number: string;

  show_phone: boolean;
  show_email: boolean;
  show_whatsapp: boolean;

  allow_phone_copy: boolean;
  allow_email_copy: boolean;
};

const defaults: Settings = {
  phone: "",
  support_email: "support@qrreturn.com",
  whatsapp_number: "",

  show_phone: true,
  show_email: true,
  show_whatsapp: false,

  allow_phone_copy: true,
  allow_email_copy: true,
};

export default function AdminContactPage() {
  const [settings, setSettings] =
    useState<Settings>(defaults);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setMessage("");

    const { data, error } =
      await supabase
        .from("contact_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
      setMessage(error.message);
    }

    if (data) {
      setSettings({
        phone: data.phone || "",
        support_email:
          data.support_email || "",
        whatsapp_number:
          data.whatsapp_number || "",

        show_phone:
          data.show_phone ?? true,

        show_email:
          data.show_email ?? true,

        show_whatsapp:
          data.show_whatsapp ?? false,

        allow_phone_copy:
          data.allow_phone_copy ?? true,

        allow_email_copy:
          data.allow_email_copy ?? true,
      });
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    const { error } =
      await supabase
        .from("contact_settings")
        .update({
          ...settings,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", 1);

    if (error) {
      setMessage(
        `შენახვა ვერ მოხერხდა: ${error.message}`
      );
    } else {
      setMessage(
        "Contact Settings შენახულია ✓"
      );
    }

    setSaving(false);
  }

  function update<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <main className="loading">
        Contact Settings იტვირთება...
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <Link
          href="/admin"
          className="back"
        >
          ← Admin Control Center
        </Link>

        <span className="eyebrow">
          QR RETURN ADMIN
        </span>

        <h1>
          Contact Settings
        </h1>

        <p className="intro">
          აქედან მართავთ QR RETURN-ის
          ტელეფონს, Email-ს, WhatsApp-ს
          და მომხმარებლისთვის ხელმისაწვდომ
          საკონტაქტო მოქმედებებს.
        </p>

        <div className="panel">
          <Field
            label="QR RETURN Phone"
            value={settings.phone}
            placeholder="+1 000 000 0000"
            onChange={(value) =>
              update("phone", value)
            }
          />

          <Field
            label="Support Email"
            value={
              settings.support_email
            }
            placeholder="support@qrreturn.com"
            onChange={(value) =>
              update(
                "support_email",
                value
              )
            }
          />

          <Field
            label="WhatsApp Number"
            value={
              settings.whatsapp_number
            }
            placeholder="+1 000 000 0000"
            onChange={(value) =>
              update(
                "whatsapp_number",
                value
              )
            }
          />

          <div className="toggles">
            <Toggle
              title="Show Phone"
              description="საიტზე გამოჩნდეს ტელეფონის ნომერი."
              checked={
                settings.show_phone
              }
              onChange={(value) =>
                update(
                  "show_phone",
                  value
                )
              }
            />

            <Toggle
              title="Direct Call"
              description="Call ღილაკზე დაჭერით ტელეფონმა ნომერი პირდაპირ მოამზადოს დასარეკად."
              checked={
                settings.show_phone
              }
              onChange={(value) =>
                update(
                  "show_phone",
                  value
                )
              }
            />

            <Toggle
              title="Copy Phone"
              description="მომხმარებელს შეეძლოს ნომრის კოპირება."
              checked={
                settings.allow_phone_copy
              }
              onChange={(value) =>
                update(
                  "allow_phone_copy",
                  value
                )
              }
            />

            <Toggle
              title="Show Email"
              description="Support Email გამოჩნდეს."
              checked={
                settings.show_email
              }
              onChange={(value) =>
                update(
                  "show_email",
                  value
                )
              }
            />

            <Toggle
              title="Copy Email"
              description="Email-ის კოპირება."
              checked={
                settings.allow_email_copy
              }
              onChange={(value) =>
                update(
                  "allow_email_copy",
                  value
                )
              }
            />

            <Toggle
              title="WhatsApp"
              description="WhatsApp ღილაკის ჩვენება."
              checked={
                settings.show_whatsapp
              }
              onChange={(value) =>
                update(
                  "show_whatsapp",
                  value
                )
              }
            />
          </div>

          <div className="preview">
            <span>
              CONTACT PREVIEW
            </span>

            <div className="actions">
              {settings.show_phone &&
                settings.phone && (
                  <>
                    <a
                      href={`tel:${settings.phone}`}
                    >
                      ☎ Call
                    </a>

                    {settings.allow_phone_copy && (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            settings.phone
                          )
                        }
                      >
                        Copy Number
                      </button>
                    )}
                  </>
                )}

              {settings.show_email &&
                settings.support_email && (
                  <>
                    <a
                      href={`mailto:${settings.support_email}`}
                    >
                      ✉ Email
                    </a>

                    {settings.allow_email_copy && (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            settings.support_email
                          )
                        }
                      >
                        Copy Email
                      </button>
                    )}
                  </>
                )}

              {settings.show_whatsapp &&
                settings.whatsapp_number && (
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    WhatsApp
                  </a>
                )}
            </div>
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <button
            className="save"
            type="button"
            disabled={saving}
            onClick={() =>
              void saveSettings()
            }
          >
            {saving
              ? "Saving..."
              : "Save Contact Settings"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 48px 0 90px;
          background: #f5f7f8;
        }

        .loading {
          min-height: 100vh;
          display: grid;
          place-items: center;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 900px;
          margin: auto;
        }

        .back {
          display: inline-block;
          margin-bottom: 25px;
          color: #697581;
          text-decoration: none;
          font-size: 9px;
          font-weight: 800;
        }

        .eyebrow {
          color: #c84a50;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 7px 0 0;
          color: #202b37;
          font-size: 42px;
          letter-spacing: -1.8px;
        }

        .intro {
          max-width: 650px;
          color: #7b8691;
          font-size: 10px;
          line-height: 1.7;
        }

        .panel {
          margin-top: 30px;
          padding: 24px;

          display: grid;
          gap: 19px;

          border: 1px solid #e0e5e8;
          border-radius: 16px;
          background: white;
        }

        .toggles {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 10px;
        }

        .preview {
          padding: 17px;
          border-radius: 12px;
          background: #f5f7f8;
        }

        .preview > span {
          color: #929ba4;
          font-size: 7px;
          font-weight: 900;
        }

        .actions {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .actions a,
        .actions button {
          min-height: 36px;
          padding: 0 11px;

          display: flex;
          align-items: center;

          border: 1px solid #dce2e6;
          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;
          cursor: pointer;

          font-size: 8px;
          font-weight: 800;
        }

        .save {
          min-height: 45px;
          border: 0;
          border-radius: 10px;

          color: white;
          background: #202b37;

          cursor: pointer;
          font-weight: 850;
        }

        .message {
          padding: 12px;
          border-radius: 9px;
          background: #f1f7f3;
          color: #37654a;
          font-size: 9px;
        }

        @media(max-width:650px) {
          .toggles {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 6px;
        }

        span {
          color: #56636f;
          font-size: 9px;
          font-weight: 850;
        }

        input {
          height: 44px;
          padding: 0 12px;

          border: 1px solid #dce2e6;
          border-radius: 9px;

          outline: none;
        }
      `}</style>
    </label>
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
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <div>
        <strong>
          {title}
        </strong>

        <span>
          {description}
        </span>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
      />

      <style jsx>{`
        .toggle {
          min-height: 75px;
          padding: 13px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          border: 1px solid #e2e6e9;
          border-radius: 11px;
          background: #fafbfb;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #3d4954;
          font-size: 9px;
        }

        span {
          margin-top: 4px;
          color: #8a949d;
          font-size: 7px;
          line-height: 1.4;
        }

        input {
          width: 18px;
          height: 18px;
        }
      `}</style>
    </label>
  );
}
