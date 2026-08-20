"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type ChatSettings = {
  enabled: boolean;

  support_title: string;
  support_subtitle: string;

  welcome_message: string;
  offline_message: string;

  auto_reply_enabled: boolean;
  auto_reply_text: string;

  allow_images: boolean;
  allow_files: boolean;

  show_on_homepage: boolean;
  show_on_finder_page: boolean;
  show_on_account: boolean;
};

const defaults: ChatSettings = {
  enabled: true,

  support_title: "QR RETURN Support",
  support_subtitle: "როგორ შეგვიძლია დაგეხმაროთ?",

  welcome_message:
    "გამარჯობა! მოგვწერეთ და დაგეხმარებით.",

  offline_message:
    "ამჟამად Support ოფლაინია. დატოვეთ შეტყობინება და დაგიკავშირდებით.",

  auto_reply_enabled: true,

  auto_reply_text:
    "მადლობა შეტყობინებისთვის. QR RETURN Support მალე გიპასუხებთ.",

  allow_images: true,
  allow_files: true,

  show_on_homepage: true,
  show_on_finder_page: true,
  show_on_account: true,
};

export default function AdminChatSettingsPage() {
  const [settings, setSettings] =
    useState<ChatSettings>(defaults);

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
        .from("chat_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
      setMessage(error.message);
    }

    if (data) {
      setSettings({
        enabled:
          data.enabled ?? true,

        support_title:
          data.support_title ||
          defaults.support_title,

        support_subtitle:
          data.support_subtitle ||
          defaults.support_subtitle,

        welcome_message:
          data.welcome_message ||
          defaults.welcome_message,

        offline_message:
          data.offline_message ||
          defaults.offline_message,

        auto_reply_enabled:
          data.auto_reply_enabled ?? true,

        auto_reply_text:
          data.auto_reply_text ||
          defaults.auto_reply_text,

        allow_images:
          data.allow_images ?? true,

        allow_files:
          data.allow_files ?? true,

        show_on_homepage:
          data.show_on_homepage ?? true,

        show_on_finder_page:
          data.show_on_finder_page ?? true,

        show_on_account:
          data.show_on_account ?? true,
      });
    }

    setLoading(false);
  }

  function update<K extends keyof ChatSettings>(
    key: K,
    value: ChatSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    const { error } =
      await supabase
        .from("chat_settings")
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
        "Live Chat Settings შენახულია ✓"
      );
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <main className="loading">
        Live Chat Settings იტვირთება...
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
          Live Chat Settings
        </h1>

        <p className="intro">
          მართეთ Support Chat-ის ტექსტები,
          ავტომატური პასუხები, ფოტოები,
          ფაილები და სად გამოჩნდეს Live Chat.
        </p>

        <div className="panel">
          <Toggle
            title="Live Chat Enabled"
            description="QR RETURN Live Chat-ის ჩართვა ან გამორთვა."
            checked={settings.enabled}
            onChange={(value) =>
              update("enabled", value)
            }
          />

          <Field
            label="Support Title"
            value={settings.support_title}
            onChange={(value) =>
              update(
                "support_title",
                value
              )
            }
          />

          <Field
            label="Support Subtitle"
            value={
              settings.support_subtitle
            }
            onChange={(value) =>
              update(
                "support_subtitle",
                value
              )
            }
          />

          <TextArea
            label="Welcome Message"
            value={
              settings.welcome_message
            }
            onChange={(value) =>
              update(
                "welcome_message",
                value
              )
            }
          />

          <TextArea
            label="Offline Message"
            value={
              settings.offline_message
            }
            onChange={(value) =>
              update(
                "offline_message",
                value
              )
            }
          />

          <Toggle
            title="Automatic Reply"
            description="ახალ შეტყობინებაზე ავტომატური პასუხის გაგზავნა."
            checked={
              settings.auto_reply_enabled
            }
            onChange={(value) =>
              update(
                "auto_reply_enabled",
                value
              )
            }
          />

          <TextArea
            label="Automatic Reply Text"
            value={
              settings.auto_reply_text
            }
            onChange={(value) =>
              update(
                "auto_reply_text",
                value
              )
            }
          />

          <div className="toggles">
            <Toggle
              title="Allow Images"
              description="Chat-ში ფოტოების ატვირთვა."
              checked={
                settings.allow_images
              }
              onChange={(value) =>
                update(
                  "allow_images",
                  value
                )
              }
            />

            <Toggle
              title="Allow Files"
              description="Chat-ში ფაილების ატვირთვა."
              checked={
                settings.allow_files
              }
              onChange={(value) =>
                update(
                  "allow_files",
                  value
                )
              }
            />

            <Toggle
              title="Homepage"
              description="Live Chat მთავარ გვერდზე გამოჩნდეს."
              checked={
                settings.show_on_homepage
              }
              onChange={(value) =>
                update(
                  "show_on_homepage",
                  value
                )
              }
            />

            <Toggle
              title="Finder Page"
              description="Live Chat QR Finder გვერდზე გამოჩნდეს."
              checked={
                settings.show_on_finder_page
              }
              onChange={(value) =>
                update(
                  "show_on_finder_page",
                  value
                )
              }
            />

            <Toggle
              title="User Account"
              description="Live Chat მომხმარებლის ანგარიშშიც გამოჩნდეს."
              checked={
                settings.show_on_account
              }
              onChange={(value) =>
                update(
                  "show_on_account",
                  value
                )
              }
            />
          </div>

          <div className="preview">
            <span>
              CHAT PREVIEW
            </span>

            <div className="chatCard">
              <strong>
                {settings.support_title}
              </strong>

              <small>
                {settings.support_subtitle}
              </small>

              <p>
                {settings.welcome_message}
              </p>
            </div>
          </div>

          {message && (
            <div className="message">
              {message}
            </div>
          )}

          <button
            type="button"
            className="save"
            disabled={saving}
            onClick={() =>
              void saveSettings()
            }
          >
            {saving
              ? "Saving..."
              : "Save Live Chat Settings"}
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
          gap: 18px;

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

        .chatCard {
          margin-top: 12px;
          padding: 14px;
          border-radius: 11px;
          background: white;
        }

        .chatCard strong,
        .chatCard small {
          display: block;
        }

        .chatCard strong {
          color: #35414c;
          font-size: 11px;
        }

        .chatCard small {
          margin-top: 4px;
          color: #8b959e;
          font-size: 8px;
        }

        .chatCard p {
          margin: 12px 0 0;
          color: #697581;
          font-size: 9px;
          line-height: 1.6;
        }

        .message {
          padding: 12px;
          border-radius: 9px;
          background: #f1f7f3;
          color: #37654a;
          font-size: 9px;
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
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        value={value}
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
        rows={4}
        value={value}
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

        textarea {
          padding: 11px 12px;
          border: 1px solid #dce2e6;
          border-radius: 9px;
          outline: none;
          resize: vertical;
          font-family: inherit;
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
        <strong>{title}</strong>
        <span>{description}</span>
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
          min-height: 74px;
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
