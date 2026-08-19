"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type HomepageSettings = {
  hero_title: string;
  hero_description: string;

  emergency_title: string;
  emergency_description: string;

  dog_label: string;
  cat_label: string;
  keys_label: string;
  wallet_label: string;
  suitcase_label: string;
  bag_label: string;

  dog_image: string;
  cat_image: string;
  keys_image: string;
  wallet_image: string;
  suitcase_image: string;
  bag_image: string;

  video_enabled: boolean;
  steps_enabled: boolean;
  features_enabled: boolean;
  rules_enabled: boolean;
  contact_enabled: boolean;
};

const defaults: HomepageSettings = {
  hero_title:
    "როცა სიტყვის თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია.",

  hero_description:
    "Emergency QR გაძლევთ საშუალებას წინასწარ განსაზღვროთ რა ინფორმაცია უნდა ნახოს დამხმარემ საგანგებო სიტუაციაში.",

  emergency_title: "QR RETURN • EMERGENCY ID",

  emergency_description:
    "საგანგებო კონტაქტი, სამედიცინო ინფორმაცია, ალერგიები და თქვენ მიერ ნებადართული სხვა მნიშვნელოვანი მონაცემები.",

  dog_label: "ძაღლი",
  cat_label: "კატა",
  keys_label: "სახლის + მანქანის გასაღები",
  wallet_label: "საფულე",
  suitcase_label: "ჩემოდანი",
  bag_label: "ჩანთა",

  dog_image: "",
  cat_image: "",
  keys_image: "",
  wallet_image: "",
  suitcase_image: "",
  bag_image: "",

  video_enabled: true,
  steps_enabled: true,
  features_enabled: true,
  rules_enabled: true,
  contact_enabled: true,
};

export default function WebsiteEditorPage() {
  const [settings, setSettings] =
    useState<HomepageSettings>(defaults);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.warn(error.message);
      setSettings(defaults);
      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        ...defaults,
        ...data,
      });
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("homepage_settings")
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setMessage(
        `შენახვა ვერ მოხერხდა: ${error.message}`
      );
      setSaving(false);
      return;
    }

    setMessage("ცვლილებები წარმატებით შეინახა ✓");
    setSaving(false);
  }

  function update<K extends keyof HomepageSettings>(
    key: K,
    value: HomepageSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="spinner" />
        <strong>Website Editor იტვირთება...</strong>

        <style jsx>{`
          .loading {
            min-height: 100vh;
            display: grid;
            place-items: center;
            align-content: center;
            gap: 16px;
            background: #f4f6f8;
            color: #17212b;
            font-family: Arial, sans-serif;
          }

          .spinner {
            width: 34px;
            height: 34px;
            border: 3px solid #dde3e8;
            border-top-color: #1f63d3;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <a href="/admin" className="back">
            ← Admin Control Center
          </a>

          <div className="titleRow">
            <div className="icon">🎨</div>

            <div>
              <span className="eyebrow">
                QR RETURN ADMIN
              </span>

              <h1>Website Editor</h1>

              <p>
                მთავარი გვერდის ტექსტები,
                ფოტოები და სექციები.
              </p>
            </div>
          </div>
        </div>

        <div className="headerActions">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="previewButton"
          >
            Preview ↗
          </a>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="saveButton"
          >
            {saving ? "ინახება..." : "Save Changes"}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={
            message.includes("ვერ")
              ? "message error"
              : "message success"
          }
        >
          {message}
        </div>
      )}

      <div className="layout">
        <aside className="sidebar">
          <span className="sidebarTitle">
            HOMEPAGE
          </span>

          <a href="#hero">01 Hero</a>
          <a href="#emergency">02 Emergency</a>
          <a href="#products">03 Products</a>
          <a href="#sections">04 Sections</a>

          <div className="sidebarDivider" />

          <a href="/admin">
            ← Admin Dashboard
          </a>
        </aside>

        <section className="editor">
          <EditorSection
            id="hero"
            number="01"
            title="Hero"
            description="მთავარი ეკრანის ტექსტები."
          >
            <TextArea
              label="Main Headline"
              value={settings.hero_title}
              onChange={(value) =>
                update("hero_title", value)
              }
              large
            />

            <TextArea
              label="Description"
              value={settings.hero_description}
              onChange={(value) =>
                update("hero_description", value)
              }
            />
          </EditorSection>

          <EditorSection
            id="emergency"
            number="02"
            title="Emergency ID"
            description="Emergency ნაწილის ტექსტები."
          >
            <Field
              label="Emergency Label"
              value={settings.emergency_title}
              onChange={(value) =>
                update("emergency_title", value)
              }
            />

            <TextArea
              label="Emergency Description"
              value={settings.emergency_description}
              onChange={(value) =>
                update(
                  "emergency_description",
                  value
                )
              }
            />

            <div className="emergencyPreview">
              <div className="bracelet">
                <div className="redStrap" />

                <div className="plate">
                  <span>+ EMERGENCY QR</span>

                  <div className="qr">
                    <QrVisual />
                  </div>

                  <strong>QR RETURN</strong>
                </div>

                <div className="blueStrap" />
              </div>

              <div>
                <span className="previewLabel">
                  LIVE PREVIEW
                </span>

                <h3>{settings.emergency_title}</h3>

                <p>
                  {settings.emergency_description}
                </p>
              </div>
            </div>
          </EditorSection>

          <EditorSection
            id="products"
            number="03"
            title="Products"
            description="ექვსი ძირითადი კატეგორიის ფოტო და სახელი."
          >
            <div className="productsGrid">
              <ProductEditor
                emoji="🐕"
                title="Dog"
                label={settings.dog_label}
                image={settings.dog_image}
                onLabel={(value) =>
                  update("dog_label", value)
                }
                onImage={(value) =>
                  update("dog_image", value)
                }
              />

              <ProductEditor
                emoji="🐈"
                title="Cat"
                label={settings.cat_label}
                image={settings.cat_image}
                onLabel={(value) =>
                  update("cat_label", value)
                }
                onImage={(value) =>
                  update("cat_image", value)
                }
              />

              <ProductEditor
                emoji="🔑"
                title="Keys"
                label={settings.keys_label}
                image={settings.keys_image}
                onLabel={(value) =>
                  update("keys_label", value)
                }
                onImage={(value) =>
                  update("keys_image", value)
                }
              />

              <ProductEditor
                emoji="👛"
                title="Wallet"
                label={settings.wallet_label}
                image={settings.wallet_image}
                onLabel={(value) =>
                  update("wallet_label", value)
                }
                onImage={(value) =>
                  update("wallet_image", value)
                }
              />

              <ProductEditor
                emoji="🧳"
                title="Suitcase"
                label={settings.suitcase_label}
                image={settings.suitcase_image}
                onLabel={(value) =>
                  update("suitcase_label", value)
                }
                onImage={(value) =>
                  update("suitcase_image", value)
                }
              />

              <ProductEditor
                emoji="🎒"
                title="Bag"
                label={settings.bag_label}
                image={settings.bag_image}
                onLabel={(value) =>
                  update("bag_label", value)
                }
                onImage={(value) =>
                  update("bag_image", value)
                }
              />
            </div>
          </EditorSection>

          <EditorSection
            id="sections"
            number="04"
            title="Sections"
            description="მთავარი გვერდის სექციების ჩართვა და გამორთვა."
          >
            <Toggle
              title="Video"
              description="პროდუქტის ვიდეოს სექცია."
              checked={settings.video_enabled}
              onChange={(value) =>
                update("video_enabled", value)
              }
            />

            <Toggle
              title="4 Steps"
              description="Find → Scan → Connect → Return"
              checked={settings.steps_enabled}
              onChange={(value) =>
                update("steps_enabled", value)
              }
            />

            <Toggle
              title="Features"
              description="Live Chat, Location, Reward, Privacy."
              checked={settings.features_enabled}
              onChange={(value) =>
                update("features_enabled", value)
              }
            />

            <Toggle
              title="Rules"
              description="მთავარი წესების სექცია."
              checked={settings.rules_enabled}
              onChange={(value) =>
                update("rules_enabled", value)
              }
            />

            <Toggle
              title="Contact"
              description="საკონტაქტო სექცია."
              checked={settings.contact_enabled}
              onChange={(value) =>
                update("contact_enabled", value)
              }
            />
          </EditorSection>

          <div className="bottomSave">
            <div>
              <strong>Homepage Settings</strong>

              <span>
                ცვლილებების დასრულების შემდეგ
                დააჭირეთ Save Changes.
              </span>
            </div>

            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? "ინახება..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(body) {
          margin: 0;
          background: #f4f6f8;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        .page {
          min-height: 100vh;
          color: #17212b;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .header {
          min-height: 116px;
          padding: 24px 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          position: sticky;
          top: 0;
          z-index: 30;
          border-bottom: 1px solid #e1e5e9;
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(18px);
        }

        .back {
          display: inline-block;
          margin-bottom: 13px;
          color: #7b8590;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
        }

        .titleRow {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #edf3ff;
          font-size: 20px;
        }

        .eyebrow {
          color: #1f63d3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        h1 {
          margin: 4px 0 0;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .titleRow p {
          margin: 5px 0 0;
          color: #7b8590;
          font-size: 10px;
        }

        .headerActions {
          display: flex;
          gap: 8px;
        }

        .previewButton,
        .saveButton {
          min-height: 41px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
        }

        .previewButton {
          color: #505b67;
          border: 1px solid #dce1e5;
          background: white;
        }

        .saveButton {
          border: 0;
          color: white;
          background: #1f63d3;
          cursor: pointer;
        }

        .message {
          max-width: 1160px;
          margin: 18px auto 0;
          padding: 13px 16px;
          border-radius: 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .success {
          color: #21613d;
          border: 1px solid #caead7;
          background: #eef9f2;
        }

        .error {
          color: #8e3232;
          border: 1px solid #f0cccc;
          background: #fff0f0;
        }

        .layout {
          width: calc(100% - 50px);
          max-width: 1160px;
          margin: 28px auto 80px;
          display: grid;
          grid-template-columns: 190px 1fr;
          gap: 26px;
        }

        .sidebar {
          height: fit-content;
          padding: 17px;
          position: sticky;
          top: 142px;
          border: 1px solid #e0e4e8;
          border-radius: 15px;
          background: white;
        }

        .sidebarTitle {
          display: block;
          margin: 4px 8px 9px;
          color: #a1a8b0;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.1px;
        }

        .sidebar a {
          min-height: 37px;
          padding: 0 9px;
          display: flex;
          align-items: center;
          border-radius: 8px;
          color: #57616d;
          text-decoration: none;
          font-size: 9px;
          font-weight: 700;
        }

        .sidebar a:hover {
          color: #1f63d3;
          background: #f2f6fb;
        }

        .sidebarDivider {
          height: 1px;
          margin: 13px 0;
          background: #edf0f2;
        }

        .editor {
          min-width: 0;
        }

        .productsGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .emergencyPreview {
          margin-top: 10px;
          padding: 25px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 30px;
          border: 1px solid #e2e6e9;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #fafafa,
            #f1f4f6
          );
        }

        .bracelet {
          display: flex;
          align-items: center;
        }

        .redStrap,
        .blueStrap {
          height: 31px;
          flex: 1;
        }

        .redStrap {
          border-radius: 99px 0 0 99px;
          background: #d6454b;
        }

        .blueStrap {
          border-radius: 0 99px 99px 0;
          background: #2167a8;
        }

        .plate {
          width: 103px;
          min-width: 103px;
          height: 94px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 3px solid #c4cbd1;
          border-radius: 17px;
          background: white;
          box-shadow: 0 12px 25px rgba(25,35,47,.12);
        }

        .plate > span {
          color: #b33c42;
          font-size: 5px;
          font-weight: 900;
        }

        .qr {
          margin-top: 6px;
        }

        .plate strong {
          margin-top: 4px;
          font-size: 5px;
        }

        .previewLabel {
          color: #1f63d3;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .emergencyPreview h3 {
          margin: 8px 0 0;
          color: #27323d;
          font-size: 17px;
          line-height: 1.35;
        }

        .emergencyPreview p {
          margin: 9px 0 0;
          color: #78828d;
          font-size: 9px;
          line-height: 1.6;
        }

        .bottomSave {
          margin-top: 20px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid #dce1e5;
          border-radius: 14px;
          background: white;
        }

        .bottomSave strong,
        .bottomSave span {
          display: block;
        }

        .bottomSave strong {
          font-size: 12px;
        }

        .bottomSave span {
          margin-top: 4px;
          color: #87909a;
          font-size: 9px;
        }

        .bottomSave button {
          min-height: 40px;
          padding: 0 15px;
          border: 0;
          border-radius: 9px;
          color: white;
          background: #1f63d3;
          font-size: 9px;
          font-weight: 800;
          cursor: pointer;
        }

        @media (max-width: 800px) {
          .header {
            padding: 18px;
            align-items: flex-start;
            flex-direction: column;
          }

          .headerActions {
            width: 100%;
          }

          .previewButton,
          .saveButton {
            flex: 1;
          }

          .layout {
            width: calc(100% - 28px);
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .productsGrid {
            grid-template-columns: 1fr;
          }

          .emergencyPreview {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

function EditorSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section">
      <div className="sectionHeader">
        <span>{number}</span>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="content">{children}</div>

      <style jsx>{`
        .section {
          margin-bottom: 18px;
          scroll-margin-top: 145px;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 16px;
          background: white;
        }

        .sectionHeader {
          padding: 19px 21px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-bottom: 1px solid #edf0f2;
        }

        .sectionHeader > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #1f63d3;
          background: #eef4ff;
          font-size: 8px;
          font-weight: 900;
        }

        h2 {
          margin: 0;
          color: #27323d;
          font-size: 15px;
        }

        p {
          margin: 4px 0 0;
          color: #89929c;
          font-size: 9px;
        }

        .content {
          padding: 20px;
          display: grid;
          gap: 14px;
        }
      `}</style>
    </section>
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
          gap: 7px;
        }

        span {
          color: #56616d;
          font-size: 9px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          outline: none;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          color: #27323d;
          background: #fbfcfc;
          font-size: 11px;
        }

        input:focus {
          border-color: #8bb1ef;
          background: white;
        }
      `}</style>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  large = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  large?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <textarea
        value={value}
        rows={large ? 4 : 3}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 7px;
        }

        span {
          color: #56616d;
          font-size: 9px;
          font-weight: 800;
        }

        textarea {
          width: 100%;
          padding: 11px 12px;
          resize: vertical;
          outline: none;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          color: #27323d;
          background: #fbfcfc;
          font-family: inherit;
          font-size: ${large ? "13px" : "11px"};
          line-height: 1.6;
        }

        textarea:focus {
          border-color: #8bb1ef;
          background: white;
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
    <div className="toggleRow">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>

      <button
        type="button"
        className={
          checked ? "toggle active" : "toggle"
        }
        onClick={() => onChange(!checked)}
      >
        <i />
      </button>

      <style jsx>{`
        .toggleRow {
          min-height: 58px;
          padding: 11px 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border: 1px solid #e3e7ea;
          border-radius: 10px;
          background: #fbfcfc;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #35404b;
          font-size: 10px;
        }

        span {
          margin-top: 4px;
          color: #8a939d;
          font-size: 8px;
        }

        .toggle {
          width: 42px;
          height: 23px;
          padding: 3px;
          flex: 0 0 auto;
          border: 0;
          border-radius: 99px;
          background: #cdd3d9;
          cursor: pointer;
        }

        .toggle i {
          width: 17px;
          height: 17px;
          display: block;
          border-radius: 50%;
          background: white;
          transition: 0.2s;
        }

        .toggle.active {
          background: #1f63d3;
        }

        .toggle.active i {
          transform: translateX(19px);
        }
      `}</style>
    </div>
  );
}

function ProductEditor({
  emoji,
  title,
  label,
  image,
  onLabel,
  onImage,
}: {
  emoji: string;
  title: string;
  label: string;
  image: string;
  onLabel: (value: string) => void;
  onImage: (value: string) => void;
}) {
  return (
    <div className="product">
      <div className="productHeader">
        <div>{emoji}</div>
        <strong>{title}</strong>
      </div>

      {image && (
        <div className="imagePreview">
          <img src={image} alt={title} />
        </div>
      )}

      <label>
        <span>სახელი</span>

        <input
          value={label}
          onChange={(event) =>
            onLabel(event.target.value)
          }
        />
      </label>

      <label>
        <span>Photo URL</span>

        <input
          value={image}
          placeholder="https://..."
          onChange={(event) =>
            onImage(event.target.value)
          }
        />
      </label>

      <style jsx>{`
        .product {
          padding: 15px;
          border: 1px solid #e1e5e8;
          border-radius: 12px;
          background: #fafbfb;
        }

        .productHeader {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 13px;
        }

        .productHeader > div {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: white;
          font-size: 17px;
        }

        .productHeader strong {
          color: #36414c;
          font-size: 11px;
        }

        .imagePreview {
          height: 120px;
          margin-bottom: 12px;
          overflow: hidden;
          border-radius: 9px;
          background: #e9edf0;
        }

        .imagePreview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        label {
          display: grid;
          gap: 5px;
          margin-top: 9px;
        }

        label span {
          color: #747e89;
          font-size: 8px;
          font-weight: 800;
        }

        input {
          width: 100%;
          height: 37px;
          padding: 0 10px;
          outline: none;
          border: 1px solid #dce1e5;
          border-radius: 8px;
          color: #34404b;
          background: white;
          font-size: 9px;
        }
      `}</style>
    </div>
  );
}

function QrVisual() {
  const dark = [
    0, 1, 2, 4, 6,
    7, 9, 11, 13,
    14, 15, 17, 19,
    21, 23, 24, 26,
    28, 29, 30, 32,
    34, 36, 38, 40,
    42, 43, 44, 46,
    48,
  ];

  return (
    <div
      style={{
        width: 42,
        height: 42,
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        gap: 1.2,
      }}
    >
      {Array.from({ length: 49 }).map(
        (_, index) => (
          <span
            key={index}
            style={{
              background: dark.includes(index)
                ? "#17212b"
                : "#e2e6e9",
            }}
          />
        )
      )}
    </div>
  );
}
