"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  primary_button_text: string;
  secondary_button_text: string;

  hero_font_size: number;
  hero_background: string;

  products_animation_enabled: boolean;

  video_title: string;
  video_description: string;
  video_url: string;

  steps_title: string;

  step_1_title: string;
  step_1_text: string;

  step_2_title: string;
  step_2_text: string;

  step_3_title: string;
  step_3_text: string;

  step_4_title: string;
  step_4_text: string;

  features_title: string;

  feature_1_title: string;
  feature_1_text: string;

  feature_2_title: string;
  feature_2_text: string;

  feature_3_title: string;
  feature_3_text: string;

  feature_4_title: string;
  feature_4_text: string;

  rules_title: string;

  rule_1_title: string;
  rule_1_text: string;

  rule_2_title: string;
  rule_2_text: string;

  rule_3_title: string;
  rule_3_text: string;

  account_title: string;
  account_description: string;

  contact_title: string;
  contact_description: string;
  contact_email: string;

  emergency_profile_enabled: boolean;
  account_section_enabled: boolean;

  emergency_contact_title: string;
  emergency_contact_text: string;

  medical_title: string;
  medical_text: string;

  allergy_title: string;
  allergy_text: string;

  privacy_title: string;
  privacy_text: string;
};

const defaults: HomepageSettings = {
  hero_title:
    "როცა სიტყვის თქმა შეუძლებელია, ინფორმაცია მაინც ხელმისაწვდომია.",

  hero_description:
    "Emergency QR პროფილი გაძლევთ საშუალებას წინასწარ განსაზღვროთ რა უნდა იცოდეს დამხმარემ და ვის დაუკავშირდეს საგანგებო სიტუაციაში.",

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

  primary_button_text: "ანგარიშის შექმნა",
  secondary_button_text: "როგორ მუშაობს",

  hero_font_size: 49,
  hero_background: "#f8f8f5",

  products_animation_enabled: true,

  video_title: "ერთი სკანი. პირდაპირი კავშირი.",

  video_description:
    "აქ განთავსდება მოკლე რეალური ვიდეო — როგორ ხედავს მპოვნელი QR RETURN-ს, როგორ ასკანერებს და როგორ იწყებს მფლობელთან დაკავშირებას.",

  video_url: "",

  steps_title: "დაბრუნების გზა ოთხ ნაბიჯში.",

  step_1_title: "იპოვეს",
  step_1_text: "მპოვნელი ხედავს QR RETURN კოდს.",

  step_2_title: "დაასკანერეს",
  step_2_text: "აპის ჩამოტვირთვა საჭირო არ არის.",

  step_3_title: "დაგიკავშირდნენ",
  step_3_text:
    "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი.",

  step_4_title: "დაბრუნდა",
  step_4_text:
    "მპოვნელთან კავშირის შემდეგ დაბრუნება მარტივდება.",

  features_title:
    "რაც საჭიროა — ზედმეტი სირთულის გარეშე.",

  feature_1_title: "Live Chat",
  feature_1_text:
    "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე.",

  feature_2_title: "ლოკაციის გაზიარება",
  feature_2_text:
    "მპოვნელმა შეიძლება ლოკაცია ერთი ღილაკით გაგიზიაროთ.",

  feature_3_title: "მპოვნელის ჯილდო",
  feature_3_text:
    "სურვილის შემთხვევაში შესთავაზეთ ჯილდო.",

  feature_4_title: "Privacy Control",
  feature_4_text:
    "თქვენ წყვეტთ რა ინფორმაცია გამოჩნდება.",

  rules_title:
    "მარტივი თქვენთვის. კიდევ უფრო მარტივი მპოვნელისთვის.",

  rule_1_title: "აპის გარეშე",
  rule_1_text:
    "მპოვნელისთვის აპის ჩამოტვირთვა ან რეგისტრაცია საჭირო არ არის.",

  rule_2_title: "თქვენი ინფორმაცია",
  rule_2_text:
    "თქვენ თავად განსაზღვრავთ რა იქნება ხელმისაწვდომი.",

  rule_3_title: "ერთი ანგარიში",
  rule_3_text:
    "ცხოველები, ნივთები და Emergency ID ერთ სივრცეში.",

  account_title: "ყველაფერი ერთი ანგარიშიდან.",

  account_description:
    "მართეთ QR პროფილები, დაკარგვის რეჟიმი, Live Chat და Emergency ID.",

  contact_title: "დაგვიკავშირდით",

  contact_description:
    "კითხვა გაქვთ QR RETURN-ის ან Emergency ID-ის შესახებ? მოგვწერეთ.",

  contact_email: "hello@qrreturn.com",

  emergency_profile_enabled: true,
  account_section_enabled: true,

  emergency_contact_title: "საგანგებო კონტაქტი",
  emergency_contact_text: "თქვენ მიერ არჩეული პირი",

  medical_title: "სამედიცინო ინფორმაცია",
  medical_text: "მხოლოდ ნებადართული მონაცემები",

  allergy_title: "ალერგიები",
  allergy_text: "საჭიროების შემთხვევაში",

  privacy_title: "Privacy Control",
  privacy_text: "თქვენ აკონტროლებთ მონაცემებს",
};

export default function WebsiteEditorPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<HomepageSettings>(defaults);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error" | "">("");

  const [authorized, setAuthorized] =
    useState<boolean | null>(null);

  useEffect(() => {
    void initialize();
  }, []);

  async function initialize() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    const { data: admin, error: adminError } =
      await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (adminError || !admin) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    setAuthorized(true);

    const { data, error } = await supabase
      .from("homepage_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      setMessageType("error");
      setMessage(
        `Homepage settings ვერ ჩაიტვირთა: ${error.message}`
      );

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

  function update<K extends keyof HomepageSettings>(
    key: K,
    value: HomepageSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function saveSettings() {
    setSaving(true);
    setMessage("");
    setMessageType("");

    const { error } = await supabase
      .from("homepage_settings")
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      setMessageType("error");
      setMessage(
        `შენახვა ვერ მოხერხდა: ${error.message}`
      );
      setSaving(false);
      return;
    }

    setMessageType("success");
    setMessage(
      "ცვლილებები წარმატებით შეინახა ✓"
    );

    setSaving(false);
  }

  if (loading || authorized === null) {
    return (
      <main className="loadingPage">
        <div className="loader" />

        <strong>
          Website Editor იტვირთება...
        </strong>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;
            display: grid;
            align-content: center;
            justify-items: center;
            gap: 15px;
            background: #f4f6f8;
            color: #1f2933;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .loader {
            width: 38px;
            height: 38px;
            border: 3px solid #dce3ea;
            border-top-color: #225fc7;
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

  if (!authorized) {
    return (
      <main className="denied">
        <div>🔐</div>

        <h1>Admin Access Required</h1>

        <p>
          ამ გვერდზე შესვლა მხოლოდ Admin
          ანგარიშით არის შესაძლებელი.
        </p>

        <a href="/">
          ← QR RETURN-ზე დაბრუნება
        </a>

        <style jsx>{`
          .denied {
            min-height: 100vh;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            background: #f4f6f8;
            color: #26323e;
            font-family:
              Inter,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
          }

          .denied > div {
            font-size: 42px;
          }

          h1 {
            margin: 17px 0 0;
          }

          p {
            max-width: 420px;
            color: #7d8792;
          }

          a {
            margin-top: 15px;
            color: #225fc7;
            font-weight: 800;
            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <header className="topHeader">
        <div className="headerLeft">
          <a href="/admin" className="back">
            ← Admin Control Center
          </a>

          <div className="headerTitle">
            <div className="headerIcon">
              🎨
            </div>

            <div>
              <span>QR RETURN ADMIN</span>
              <h1>Website Editor</h1>

              <p>
                მთავარი გვერდის ტექსტები,
                ფოტოები, სექციები და დიზაინის
                ძირითადი პარამეტრები.
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
            className="saveButton"
            onClick={saveSettings}
            disabled={saving}
          >
            {saving
              ? "ინახება..."
              : "Save Changes"}
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`message ${messageType}`}
        >
          {message}
        </div>
      )}

      <div className="workspace">
        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="sidebar">
          <SidebarGroup title="HOMEPAGE">
            <a href="#hero">01 Hero</a>
            <a href="#emergency">
              02 Emergency ID
            </a>
            <a href="#products">
              03 Products
            </a>
            <a href="#video">
              04 Video
            </a>
            <a href="#steps">
              05 Four Steps
            </a>
            <a href="#features">
              06 Features
            </a>
            <a href="#rules">
              07 Rules
            </a>
            <a href="#account">
              08 Account
            </a>
            <a href="#contact">
              09 Contact
            </a>
            <a href="#visibility">
              10 Visibility
            </a>
          </SidebarGroup>

          <div className="sideDivider" />

          <SidebarGroup title="ADMIN">
            <a href="/admin">
              Dashboard
            </a>

            <a href="/admin/support">
              Support Inbox
            </a>

            <a href="/">
              View Website
            </a>
          </SidebarGroup>
        </aside>

        {/* ===================================================
            EDITOR
        =================================================== */}

        <section className="editor">
          {/* =================================================
              HERO
          ================================================= */}

          <EditorSection
            id="hero"
            number="01"
            eyebrow="FIRST SCREEN"
            title="Hero"
            description="მთავარი ეკრანის სათაური, აღწერა, ღილაკები და ძირითადი ვიზუალური პარამეტრები."
          >
            <TextArea
              label="Main Headline"
              description="მთავარი დიდი სლოგანი."
              value={settings.hero_title}
              onChange={(value) =>
                update("hero_title", value)
              }
              large
            />

            <TextArea
              label="Hero Description"
              description="სათაურის ქვემოთ არსებული ტექსტი."
              value={
                settings.hero_description
              }
              onChange={(value) =>
                update(
                  "hero_description",
                  value
                )
              }
            />

            <div className="twoColumns">
              <Field
                label="Primary Button"
                value={
                  settings.primary_button_text
                }
                onChange={(value) =>
                  update(
                    "primary_button_text",
                    value
                  )
                }
              />

              <Field
                label="Secondary Button"
                value={
                  settings.secondary_button_text
                }
                onChange={(value) =>
                  update(
                    "secondary_button_text",
                    value
                  )
                }
              />
            </div>

            <div className="designGrid">
              <NumberField
                label="Headline Font Size"
                description="Desktop ზომა, px."
                value={
                  settings.hero_font_size
                }
                min={28}
                max={80}
                onChange={(value) =>
                  update(
                    "hero_font_size",
                    value
                  )
                }
              />

              <ColorField
                label="Hero Background"
                value={
                  settings.hero_background
                }
                onChange={(value) =>
                  update(
                    "hero_background",
                    value
                  )
                }
              />

              <Toggle
                title="Product Animation"
                description="6 პროდუქტის მსუბუქი მოძრაობა."
                checked={
                  settings.products_animation_enabled
                }
                onChange={(value) =>
                  update(
                    "products_animation_enabled",
                    value
                  )
                }
              />
            </div>

            <div
              className="heroMiniPreview"
              style={{
                background:
                  settings.hero_background ||
                  "#f8f8f5",
              }}
            >
              <span>
                QR RETURN • EMERGENCY ID
              </span>

              <h3
                style={{
                  fontSize: `${Math.min(
                    settings.hero_font_size *
                      0.45,
                    28
                  )}px`,
                }}
              >
                {settings.hero_title}
              </h3>

              <p>
                {settings.hero_description}
              </p>

              <div>
                <button>
                  {
                    settings.primary_button_text
                  }
                </button>

                <button>
                  {
                    settings.secondary_button_text
                  }
                </button>
              </div>
            </div>
          </EditorSection>

          {/* =================================================
              EMERGENCY
          ================================================= */}

          <EditorSection
            id="emergency"
            number="02"
            eyebrow="EMERGENCY PROFILE"
            title="Emergency ID"
            description="Emergency QR ტექსტები და პროფილის ველები."
          >
            <Field
              label="Emergency Label"
              value={
                settings.emergency_title
              }
              onChange={(value) =>
                update(
                  "emergency_title",
                  value
                )
              }
            />

            <TextArea
              label="Emergency Description"
              value={
                settings.emergency_description
              }
              onChange={(value) =>
                update(
                  "emergency_description",
                  value
                )
              }
            />

            <Toggle
              title="Emergency Profile Card"
              description="Emergency ინფორმაციის ბარათის ჩვენება Hero-ში."
              checked={
                settings.emergency_profile_enabled
              }
              onChange={(value) =>
                update(
                  "emergency_profile_enabled",
                  value
                )
              }
            />

            <div className="emergencyFields">
              <SmallEditorCard
                icon="☎"
                title="Emergency Contact"
              >
                <Field
                  label="Title"
                  value={
                    settings.emergency_contact_title
                  }
                  onChange={(value) =>
                    update(
                      "emergency_contact_title",
                      value
                    )
                  }
                />

                <Field
                  label="Text"
                  value={
                    settings.emergency_contact_text
                  }
                  onChange={(value) =>
                    update(
                      "emergency_contact_text",
                      value
                    )
                  }
                />
              </SmallEditorCard>

              <SmallEditorCard
                icon="♥"
                title="Medical"
              >
                <Field
                  label="Title"
                  value={
                    settings.medical_title
                  }
                  onChange={(value) =>
                    update(
                      "medical_title",
                      value
                    )
                  }
                />

                <Field
                  label="Text"
                  value={
                    settings.medical_text
                  }
                  onChange={(value) =>
                    update(
                      "medical_text",
                      value
                    )
                  }
                />
              </SmallEditorCard>

              <SmallEditorCard
                icon="!"
                title="Allergies"
              >
                <Field
                  label="Title"
                  value={
                    settings.allergy_title
                  }
                  onChange={(value) =>
                    update(
                      "allergy_title",
                      value
                    )
                  }
                />

                <Field
                  label="Text"
                  value={
                    settings.allergy_text
                  }
                  onChange={(value) =>
                    update(
                      "allergy_text",
                      value
                    )
                  }
                />
              </SmallEditorCard>

              <SmallEditorCard
                icon="◈"
                title="Privacy"
              >
                <Field
                  label="Title"
                  value={
                    settings.privacy_title
                  }
                  onChange={(value) =>
                    update(
                      "privacy_title",
                      value
                    )
                  }
                />

                <Field
                  label="Text"
                  value={
                    settings.privacy_text
                  }
                  onChange={(value) =>
                    update(
                      "privacy_text",
                      value
                    )
                  }
                />
              </SmallEditorCard>
            </div>

            <div className="braceletPreview">
              <div className="bracelet">
                <div className="strap red" />

                <div className="plate">
                  <span>
                    + EMERGENCY QR
                  </span>

                  <QrPreview />

                  <strong>
                    QR RETURN
                  </strong>
                </div>

                <div className="strap blue" />
              </div>

              <div className="braceletText">
                <span>PREVIEW</span>

                <h3>
                  {settings.emergency_title}
                </h3>

                <p>
                  {
                    settings.emergency_description
                  }
                </p>
              </div>
            </div>
          </EditorSection>

          {/* =================================================
              PRODUCTS
          ================================================= */}

          <EditorSection
            id="products"
            number="03"
            eyebrow="QR ECOSYSTEM"
            title="6 Products"
            description="ძაღლი, კატა, გასაღები, საფულე, ჩემოდანი და ჩანთა."
          >
            <div className="productsGrid">
              <ProductEditor
                emoji="🐕"
                title="Dog"
                label={settings.dog_label}
                image={settings.dog_image}
                onLabel={(value) =>
                  update(
                    "dog_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "dog_image",
                    value
                  )
                }
              />

              <ProductEditor
                emoji="🐈"
                title="Cat"
                label={settings.cat_label}
                image={settings.cat_image}
                onLabel={(value) =>
                  update(
                    "cat_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "cat_image",
                    value
                  )
                }
              />

              <ProductEditor
                emoji="🔑"
                title="Keys"
                label={settings.keys_label}
                image={settings.keys_image}
                onLabel={(value) =>
                  update(
                    "keys_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "keys_image",
                    value
                  )
                }
              />

              <ProductEditor
                emoji="👛"
                title="Wallet"
                label={
                  settings.wallet_label
                }
                image={
                  settings.wallet_image
                }
                onLabel={(value) =>
                  update(
                    "wallet_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "wallet_image",
                    value
                  )
                }
              />

              <ProductEditor
                emoji="🧳"
                title="Suitcase"
                label={
                  settings.suitcase_label
                }
                image={
                  settings.suitcase_image
                }
                onLabel={(value) =>
                  update(
                    "suitcase_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "suitcase_image",
                    value
                  )
                }
              />

              <ProductEditor
                emoji="🎒"
                title="Bag"
                label={settings.bag_label}
                image={settings.bag_image}
                onLabel={(value) =>
                  update(
                    "bag_label",
                    value
                  )
                }
                onImage={(value) =>
                  update(
                    "bag_image",
                    value
                  )
                }
              />
            </div>

            <div className="hint">
              <strong>
                Photo URL
              </strong>

              <span>
                ფოტოს პირდაპირი URL ჩასვი.
                ცარიელი დატოვების შემთხვევაში
                მთავარი გვერდი გამოიყენებს default
                ფოტოს.
              </span>
            </div>
          </EditorSection>

          {/* =================================================
              VIDEO
          ================================================= */}

          <EditorSection
            id="video"
            number="04"
            eyebrow="MEDIA"
            title="Video Section"
            description="პროდუქტის ვიდეოს ტექსტი და ვიდეოს მისამართი."
          >
            <Toggle
              title="Show Video Section"
              description="Video სექციის ჩვენება მთავარ გვერდზე."
              checked={
                settings.video_enabled
              }
              onChange={(value) =>
                update(
                  "video_enabled",
                  value
                )
              }
            />

            <Field
              label="Video Title"
              value={settings.video_title}
              onChange={(value) =>
                update(
                  "video_title",
                  value
                )
              }
            />

            <TextArea
              label="Video Description"
              value={
                settings.video_description
              }
              onChange={(value) =>
                update(
                  "video_description",
                  value
                )
              }
            />

            <Field
              label="Video URL"
              description="YouTube, Vimeo ან სხვა ვიდეოს URL."
              value={settings.video_url}
              placeholder="https://..."
              onChange={(value) =>
                update("video_url", value)
              }
            />
          </EditorSection>

          {/* =================================================
              STEPS
          ================================================= */}

          <EditorSection
            id="steps"
            number="05"
            eyebrow="FIND → SCAN → CONNECT → RETURN"
            title="Four Steps"
            description="დაბრუნების ოთხივე ნაბიჯის ტექსტები."
          >
            <Toggle
              title="Show Four Steps"
              description="4 Steps სექციის ჩვენება."
              checked={
                settings.steps_enabled
              }
              onChange={(value) =>
                update(
                  "steps_enabled",
                  value
                )
              }
            />

            <Field
              label="Section Title"
              value={settings.steps_title}
              onChange={(value) =>
                update(
                  "steps_title",
                  value
                )
              }
            />

            <div className="fourGrid">
              <MiniContentEditor
                number="01"
                title="Found"
                titleValue={
                  settings.step_1_title
                }
                textValue={
                  settings.step_1_text
                }
                onTitle={(value) =>
                  update(
                    "step_1_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "step_1_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="02"
                title="Scanned"
                titleValue={
                  settings.step_2_title
                }
                textValue={
                  settings.step_2_text
                }
                onTitle={(value) =>
                  update(
                    "step_2_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "step_2_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="03"
                title="Connected"
                titleValue={
                  settings.step_3_title
                }
                textValue={
                  settings.step_3_text
                }
                onTitle={(value) =>
                  update(
                    "step_3_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "step_3_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="04"
                title="Returned"
                titleValue={
                  settings.step_4_title
                }
                textValue={
                  settings.step_4_text
                }
                onTitle={(value) =>
                  update(
                    "step_4_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "step_4_text",
                    value
                  )
                }
              />
            </div>
          </EditorSection>

          {/* =================================================
              FEATURES
          ================================================= */}

          <EditorSection
            id="features"
            number="06"
            eyebrow="CONNECTION & CONTROL"
            title="Features"
            description="Live Chat, Location, Reward და Privacy."
          >
            <Toggle
              title="Show Features"
              description="Features სექციის ჩვენება."
              checked={
                settings.features_enabled
              }
              onChange={(value) =>
                update(
                  "features_enabled",
                  value
                )
              }
            />

            <Field
              label="Section Title"
              value={
                settings.features_title
              }
              onChange={(value) =>
                update(
                  "features_title",
                  value
                )
              }
            />

            <div className="fourGrid">
              <MiniContentEditor
                number="01"
                title="Live Chat"
                titleValue={
                  settings.feature_1_title
                }
                textValue={
                  settings.feature_1_text
                }
                onTitle={(value) =>
                  update(
                    "feature_1_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "feature_1_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="02"
                title="Location"
                titleValue={
                  settings.feature_2_title
                }
                textValue={
                  settings.feature_2_text
                }
                onTitle={(value) =>
                  update(
                    "feature_2_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "feature_2_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="03"
                title="Reward"
                titleValue={
                  settings.feature_3_title
                }
                textValue={
                  settings.feature_3_text
                }
                onTitle={(value) =>
                  update(
                    "feature_3_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "feature_3_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="04"
                title="Privacy"
                titleValue={
                  settings.feature_4_title
                }
                textValue={
                  settings.feature_4_text
                }
                onTitle={(value) =>
                  update(
                    "feature_4_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "feature_4_text",
                    value
                  )
                }
              />
            </div>
          </EditorSection>

          {/* =================================================
              RULES
          ================================================= */}

          <EditorSection
            id="rules"
            number="07"
            eyebrow="SIMPLE BY DESIGN"
            title="Rules"
            description="მთავარი წესების სექციის მართვა."
          >
            <Toggle
              title="Show Rules"
              description="Rules სექციის ჩვენება."
              checked={
                settings.rules_enabled
              }
              onChange={(value) =>
                update(
                  "rules_enabled",
                  value
                )
              }
            />

            <Field
              label="Section Title"
              value={settings.rules_title}
              onChange={(value) =>
                update(
                  "rules_title",
                  value
                )
              }
            />

            <div className="threeGrid">
              <MiniContentEditor
                number="01"
                title="Rule 1"
                titleValue={
                  settings.rule_1_title
                }
                textValue={
                  settings.rule_1_text
                }
                onTitle={(value) =>
                  update(
                    "rule_1_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "rule_1_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="02"
                title="Rule 2"
                titleValue={
                  settings.rule_2_title
                }
                textValue={
                  settings.rule_2_text
                }
                onTitle={(value) =>
                  update(
                    "rule_2_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "rule_2_text",
                    value
                  )
                }
              />

              <MiniContentEditor
                number="03"
                title="Rule 3"
                titleValue={
                  settings.rule_3_title
                }
                textValue={
                  settings.rule_3_text
                }
                onTitle={(value) =>
                  update(
                    "rule_3_title",
                    value
                  )
                }
                onText={(value) =>
                  update(
                    "rule_3_text",
                    value
                  )
                }
              />
            </div>
          </EditorSection>

          {/* =================================================
              ACCOUNT
          ================================================= */}

          <EditorSection
            id="account"
            number="08"
            eyebrow="OWNER ACCOUNT"
            title="Account Section"
            description="მთავარ გვერდზე Account CTA-ის მართვა."
          >
            <Toggle
              title="Show Account Section"
              description="Account CTA-ის ჩვენება."
              checked={
                settings.account_section_enabled
              }
              onChange={(value) =>
                update(
                  "account_section_enabled",
                  value
                )
              }
            />

            <Field
              label="Title"
              value={
                settings.account_title
              }
              onChange={(value) =>
                update(
                  "account_title",
                  value
                )
              }
            />

            <TextArea
              label="Description"
              value={
                settings.account_description
              }
              onChange={(value) =>
                update(
                  "account_description",
                  value
                )
              }
            />
          </EditorSection>

          {/* =================================================
              CONTACT
          ================================================= */}

          <EditorSection
            id="contact"
            number="09"
            eyebrow="CONTACT"
            title="Contact Section"
            description="საკონტაქტო ტექსტი და ელფოსტა."
          >
            <Toggle
              title="Show Contact"
              description="Contact სექციის ჩვენება."
              checked={
                settings.contact_enabled
              }
              onChange={(value) =>
                update(
                  "contact_enabled",
                  value
                )
              }
            />

            <Field
              label="Contact Title"
              value={
                settings.contact_title
              }
              onChange={(value) =>
                update(
                  "contact_title",
                  value
                )
              }
            />

            <TextArea
              label="Contact Description"
              value={
                settings.contact_description
              }
              onChange={(value) =>
                update(
                  "contact_description",
                  value
                )
              }
            />

            <Field
              label="Contact Email"
              type="email"
              value={
                settings.contact_email
              }
              onChange={(value) =>
                update(
                  "contact_email",
                  value
                )
              }
            />
          </EditorSection>

          {/* =================================================
              VISIBILITY
          ================================================= */}

          <EditorSection
            id="visibility"
            number="10"
            eyebrow="PAGE STRUCTURE"
            title="Section Visibility"
            description="ერთი ადგილიდან ჩართე ან გამორთე მთავარი სექციები."
          >
            <div className="visibilityGrid">
              <Toggle
                title="Emergency Profile"
                description="Hero Emergency card."
                checked={
                  settings.emergency_profile_enabled
                }
                onChange={(value) =>
                  update(
                    "emergency_profile_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Video"
                description="Product demo."
                checked={
                  settings.video_enabled
                }
                onChange={(value) =>
                  update(
                    "video_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Four Steps"
                description="Find → Scan → Connect → Return."
                checked={
                  settings.steps_enabled
                }
                onChange={(value) =>
                  update(
                    "steps_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Features"
                description="Live Chat, Location, Reward, Privacy."
                checked={
                  settings.features_enabled
                }
                onChange={(value) =>
                  update(
                    "features_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Rules"
                description="Simple by Design."
                checked={
                  settings.rules_enabled
                }
                onChange={(value) =>
                  update(
                    "rules_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Account"
                description="Owner account CTA."
                checked={
                  settings.account_section_enabled
                }
                onChange={(value) =>
                  update(
                    "account_section_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Contact"
                description="Contact section."
                checked={
                  settings.contact_enabled
                }
                onChange={(value) =>
                  update(
                    "contact_enabled",
                    value
                  )
                }
              />

              <Toggle
                title="Product Motion"
                description="მსუბუქი floating animation."
                checked={
                  settings.products_animation_enabled
                }
                onChange={(value) =>
                  update(
                    "products_animation_enabled",
                    value
                  )
                }
              />
            </div>
          </EditorSection>

          {/* =================================================
              SAVE
          ================================================= */}

          <div className="bottomSave">
            <div>
              <span>
                QR RETURN WEBSITE
              </span>

              <strong>
                მზად ხარ ცვლილებების
                შესანახად?
              </strong>

              <p>
                Save Changes-ის შემდეგ
                მონაცემები Supabase-ში
                შეინახება.
              </p>
            </div>

            <div className="bottomActions">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
              >
                Preview ↗
              </a>

              <button
                type="button"
                onClick={saveSettings}
                disabled={saving}
              >
                {saving
                  ? "ინახება..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          MAIN CSS
      ===================================================== */}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f4f6f8;
        }

        .page {
          min-height: 100vh;
          color: #1d2935;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        /* HEADER */

        .topHeader {
          min-height: 118px;
          padding: 24px 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid
            #e0e5e9;
          background:
            rgba(
              255,
              255,
              255,
              0.96
            );
          backdrop-filter: blur(18px);
        }

        .back {
          display: inline-block;
          margin-bottom: 12px;
          color: #78838f;
          font-size: 11px;
          font-weight: 700;
          text-decoration: none;
        }

        .headerTitle {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .headerIcon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          flex: 0 0 48px;
          border-radius: 14px;
          background: #edf3ff;
          font-size: 21px;
        }

        .headerTitle span {
          color: #2461c9;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .headerTitle h1 {
          margin: 4px 0 0;
          color: #202c38;
          font-size: 25px;
          letter-spacing: -1px;
        }

        .headerTitle p {
          margin: 5px 0 0;
          color: #7a8590;
          font-size: 10px;
        }

        .headerActions {
          display: flex;
          gap: 8px;
        }

        .headerActions a,
        .headerActions button {
          min-height: 42px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 800;
        }

        .previewButton {
          color: #53606d;
          border: 1px solid #dce1e5;
          background: white;
          text-decoration: none;
        }

        .saveButton {
          border: 0;
          color: white;
          background: #225fc7;
          cursor: pointer;
        }

        .saveButton:disabled {
          opacity: 0.6;
          cursor: default;
        }

        /* MESSAGE */

        .message {
          width: calc(100% - 50px);
          max-width: 1180px;
          margin: 17px auto 0;
          padding: 13px 16px;
          border-radius: 11px;
          font-size: 11px;
          font-weight: 750;
        }

        .message.success {
          color: #276442;
          border: 1px solid #c9ead6;
          background: #eef9f2;
        }

        .message.error {
          color: #913a3a;
          border: 1px solid #efcccc;
          background: #fff1f1;
        }

        /* WORKSPACE */

        .workspace {
          width: calc(100% - 50px);
          max-width: 1180px;
          margin: 27px auto 90px;
          display: grid;
          grid-template-columns:
            205px minmax(0, 1fr);
          gap: 26px;
        }

        /* SIDEBAR */

        .sidebar {
          height: fit-content;
          padding: 17px;
          position: sticky;
          top: 143px;
          border: 1px solid #e0e5e9;
          border-radius: 16px;
          background: white;
          box-shadow:
            0 8px 30px
            rgba(31, 44, 57, 0.025);
        }

        .sideDivider {
          height: 1px;
          margin: 14px 0;
          background: #edf0f2;
        }

        /* EDITOR */

        .editor {
          min-width: 0;
        }

        .twoColumns {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 12px;
        }

        .threeGrid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
        }

        .fourGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 12px;
        }

        .designGrid {
          display: grid;
          grid-template-columns:
            1fr 1fr 1fr;
          gap: 12px;
        }

        .productsGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 12px;
        }

        .emergencyFields {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 12px;
        }

        .visibilityGrid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 10px;
        }

        /* HERO PREVIEW */

        .heroMiniPreview {
          padding: 27px;
          overflow: hidden;
          border: 1px solid #e1e5e8;
          border-radius: 15px;
        }

        .heroMiniPreview > span {
          color: #b14349;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .heroMiniPreview h3 {
          max-width: 580px;
          margin: 10px 0 0;
          color: #18232e;
          line-height: 1.08;
          letter-spacing: -1px;
        }

        .heroMiniPreview p {
          max-width: 620px;
          margin: 10px 0 0;
          color: #74808b;
          font-size: 10px;
          line-height: 1.6;
        }

        .heroMiniPreview > div {
          margin-top: 16px;
          display: flex;
          gap: 7px;
        }

        .heroMiniPreview button {
          min-height: 34px;
          padding: 0 11px;
          border-radius: 8px;
          font-size: 8px;
          font-weight: 800;
        }

        .heroMiniPreview button:first-child {
          border: 0;
          color: white;
          background: #202b37;
        }

        .heroMiniPreview button:last-child {
          color: #53606c;
          border: 1px solid #d8dde1;
          background: rgba(
            255,
            255,
            255,
            0.7
          );
        }

        /* BRACELET */

        .braceletPreview {
          padding: 26px;
          display: grid;
          grid-template-columns:
            1fr 1fr;
          align-items: center;
          gap: 35px;
          border: 1px solid #e1e5e8;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #fafafa,
              #f2f4f6
            );
        }

        .bracelet {
          display: flex;
          align-items: center;
        }

        .strap {
          height: 33px;
          flex: 1;
        }

        .strap.red {
          border-radius:
            99px 0 0 99px;
          background:
            linear-gradient(
              180deg,
              #df4c52,
              #bf343b
            );
        }

        .strap.blue {
          border-radius:
            0 99px 99px 0;
          background:
            linear-gradient(
              180deg,
              #317cc0,
              #175e9f
            );
        }

        .plate {
          width: 105px;
          height: 96px;
          flex: 0 0 105px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 3px solid #c2c9cf;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 13px 26px
            rgba(29, 39, 50, 0.12);
        }

        .plate > span {
          color: #af4046;
          font-size: 5px;
          font-weight: 900;
        }

        .plate > strong {
          margin-top: 4px;
          font-size: 5px;
        }

        .braceletText > span {
          color: #225fc7;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .braceletText h3 {
          margin: 8px 0 0;
          color: #2d3945;
          font-size: 17px;
        }

        .braceletText p {
          margin: 8px 0 0;
          color: #79838e;
          font-size: 9px;
          line-height: 1.6;
        }

        /* HINT */

        .hint {
          padding: 12px 14px;
          border: 1px solid #dae5f5;
          border-radius: 10px;
          background: #f4f8fd;
        }

        .hint strong,
        .hint span {
          display: block;
        }

        .hint strong {
          color: #365f93;
          font-size: 9px;
        }

        .hint span {
          margin-top: 4px;
          color: #708399;
          font-size: 8px;
          line-height: 1.55;
        }

        /* BOTTOM SAVE */

        .bottomSave {
          margin-top: 22px;
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border: 1px solid #dce2e6;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f8fafb
            );
        }

        .bottomSave > div:first-child > span {
          color: #225fc7;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .bottomSave strong {
          display: block;
          margin-top: 5px;
          color: #26323e;
          font-size: 15px;
        }

        .bottomSave p {
          margin: 5px 0 0;
          color: #828c96;
          font-size: 9px;
        }

        .bottomActions {
          display: flex;
          gap: 8px;
        }

        .bottomActions a,
        .bottomActions button {
          min-height: 40px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          font-size: 9px;
          font-weight: 800;
        }

        .bottomActions a {
          color: #505c68;
          border: 1px solid #dce1e5;
          background: white;
          text-decoration: none;
        }

        .bottomActions button {
          border: 0;
          color: white;
          background: #225fc7;
          cursor: pointer;
        }

        @media (max-width: 950px) {
          .workspace {
            grid-template-columns: 1fr;
          }

          .sidebar {
            display: none;
          }

          .designGrid,
          .threeGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .topHeader {
            padding: 18px;
            align-items: flex-start;
            flex-direction: column;
          }

          .headerActions {
            width: 100%;
          }

          .headerActions a,
          .headerActions button {
            flex: 1;
          }

          .workspace {
            width: calc(100% - 28px);
          }

          .message {
            width: calc(100% - 28px);
          }

          .twoColumns,
          .fourGrid,
          .productsGrid,
          .emergencyFields,
          .visibilityGrid {
            grid-template-columns: 1fr;
          }

          .braceletPreview {
            grid-template-columns: 1fr;
          }

          .bottomSave {
            align-items: stretch;
            flex-direction: column;
          }

          .bottomActions {
            width: 100%;
          }

          .bottomActions a,
          .bottomActions button {
            flex: 1;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   EDITOR SECTION
========================================================= */

function EditorSection({
  id,
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="box">
      <div className="boxHeader">
        <div className="number">
          {number}
        </div>

        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="boxContent">
        {children}
      </div>

      <style jsx>{`
        .box {
          margin-bottom: 18px;
          scroll-margin-top: 145px;
          overflow: hidden;
          border: 1px solid #dfe4e8;
          border-radius: 17px;
          background: white;
          box-shadow:
            0 8px 30px
            rgba(33, 44, 56, 0.025);
        }

        .boxHeader {
          padding: 20px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid #edf0f2;
        }

        .number {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          flex: 0 0 35px;
          border-radius: 10px;
          color: #225fc7;
          background: #edf3ff;
          font-size: 8px;
          font-weight: 900;
        }

        .boxHeader span {
          color: #225fc7;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        h2 {
          margin: 3px 0 0;
          color: #27333f;
          font-size: 16px;
        }

        p {
          margin: 4px 0 0;
          color: #89939d;
          font-size: 9px;
          line-height: 1.5;
        }

        .boxContent {
          padding: 21px;
          display: grid;
          gap: 14px;
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   SIDEBAR GROUP
========================================================= */

function SidebarGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <span>{title}</span>

      <div>{children}</div>

      <style jsx>{`
        .group > span {
          display: block;
          margin: 4px 8px 9px;
          color: #9ca5ae;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .group > div {
          display: grid;
        }

        .group :global(a) {
          min-height: 37px;
          padding: 0 9px;
          display: flex;
          align-items: center;
          border-radius: 8px;
          color: #56616d;
          font-size: 9px;
          font-weight: 700;
          text-decoration: none;
          transition: 0.15s;
        }

        .group :global(a:hover) {
          color: #225fc7;
          background: #f2f6fb;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  description,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="field">
      <div>
        <strong>{label}</strong>

        {description && (
          <span>{description}</span>
        )}
      </div>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      <style jsx>{`
        .field {
          display: grid;
          gap: 7px;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #525f6b;
          font-size: 9px;
        }

        span {
          margin-top: 3px;
          color: #939ca5;
          font-size: 7px;
        }

        input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          outline: none;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          color: #2d3945;
          background: #fbfcfc;
          font-family: inherit;
          font-size: 10px;
        }

        input:focus {
          border-color: #86aae3;
          background: white;
          box-shadow:
            0 0 0 3px
            rgba(34, 95, 199, 0.06);
        }
      `}</style>
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  description,
  value,
  onChange,
  large = false,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  large?: boolean;
}) {
  return (
    <label className="field">
      <div>
        <strong>{label}</strong>

        {description && (
          <span>{description}</span>
        )}
      </div>

      <textarea
        rows={large ? 4 : 3}
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

        strong,
        span {
          display: block;
        }

        strong {
          color: #525f6b;
          font-size: 9px;
        }

        span {
          margin-top: 3px;
          color: #939ca5;
          font-size: 7px;
        }

        textarea {
          width: 100%;
          padding: 11px 12px;
          resize: vertical;
          outline: none;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          color: #2d3945;
          background: #fbfcfc;
          font-family: inherit;
          font-size: ${large
            ? "12px"
            : "10px"};
          line-height: 1.6;
        }

        textarea:focus {
          border-color: #86aae3;
          background: white;
          box-shadow:
            0 0 0 3px
            rgba(34, 95, 199, 0.06);
        }
      `}</style>
    </label>
  );
}

/* =========================================================
   NUMBER
========================================================= */

function NumberField({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <div>
        <strong>{label}</strong>

        {description && (
          <span>{description}</span>
        )}
      </div>

      <div className="numberRow">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const next = Number(
              event.target.value
            );

            if (!Number.isNaN(next)) {
              onChange(next);
            }
          }}
        />

        <span>px</span>
      </div>

      <style jsx>{`
        .field {
          display: grid;
          gap: 7px;
        }

        .field > div:first-child strong,
        .field > div:first-child span {
          display: block;
        }

        strong {
          color: #525f6b;
          font-size: 9px;
        }

        .field > div:first-child span {
          margin-top: 3px;
          color: #939ca5;
          font-size: 7px;
        }

        .numberRow {
          display: flex;
          align-items: center;
          overflow: hidden;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          background: #fbfcfc;
        }

        input {
          width: 100%;
          height: 40px;
          padding: 0 11px;
          border: 0;
          outline: none;
          color: #2d3945;
          background: transparent;
        }

        .numberRow > span {
          padding: 0 11px;
          color: #89939e;
          font-size: 8px;
        }
      `}</style>
    </label>
  );
}

/* =========================================================
   COLOR
========================================================= */

function ColorField({
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
      <strong>{label}</strong>

      <div className="colorRow">
        <input
          type="color"
          value={
            /^#[0-9A-F]{6}$/i.test(value)
              ? value
              : "#f8f8f5"
          }
          onChange={(event) =>
            onChange(event.target.value)
          }
        />

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      </div>

      <style jsx>{`
        .field {
          display: grid;
          gap: 7px;
        }

        strong {
          color: #525f6b;
          font-size: 9px;
        }

        .colorRow {
          height: 42px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        input[type="color"] {
          width: 45px;
          height: 42px;
          padding: 4px;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          background: white;
          cursor: pointer;
        }

        input[type="text"] {
          min-width: 0;
          height: 42px;
          flex: 1;
          padding: 0 10px;
          border: 1px solid #dce1e5;
          border-radius: 9px;
          outline: none;
          color: #34404c;
          background: #fbfcfc;
          font-size: 9px;
        }
      `}</style>
    </label>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

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
          checked
            ? "switch active"
            : "switch"
        }
        onClick={() =>
          onChange(!checked)
        }
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
          gap: 15px;
          border: 1px solid #e2e6e9;
          border-radius: 10px;
          background: #fbfcfc;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #394550;
          font-size: 10px;
        }

        span {
          margin-top: 4px;
          color: #8c96a0;
          font-size: 8px;
          line-height: 1.35;
        }

        .switch {
          width: 43px;
          height: 24px;
          padding: 3px;
          flex: 0 0 43px;
          border: 0;
          border-radius: 999px;
          background: #ccd3d9;
          cursor: pointer;
          transition: 0.2s;
        }

        .switch i {
          width: 18px;
          height: 18px;
          display: block;
          border-radius: 50%;
          background: white;
          box-shadow:
            0 2px 5px
            rgba(0, 0, 0, 0.14);
          transition: 0.2s;
        }

        .switch.active {
          background: #225fc7;
        }

        .switch.active i {
          transform: translateX(19px);
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   SMALL EDITOR CARD
========================================================= */

function SmallEditorCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <div className="cardTop">
        <div>{icon}</div>
        <strong>{title}</strong>
      </div>

      <div className="cardFields">
        {children}
      </div>

      <style jsx>{`
        .card {
          padding: 14px;
          border: 1px solid #e1e5e8;
          border-radius: 12px;
          background: #fafbfb;
        }

        .cardTop {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cardTop > div {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #b24349;
          background: #fff0f0;
          font-size: 13px;
          font-weight: 900;
        }

        .cardTop strong {
          color: #3b4752;
          font-size: 10px;
        }

        .cardFields {
          display: grid;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   MINI CONTENT EDITOR
========================================================= */

function MiniContentEditor({
  number,
  title,
  titleValue,
  textValue,
  onTitle,
  onText,
}: {
  number: string;
  title: string;
  titleValue: string;
  textValue: string;
  onTitle: (value: string) => void;
  onText: (value: string) => void;
}) {
  return (
    <div className="mini">
      <div className="miniTop">
        <span>{number}</span>
        <strong>{title}</strong>
      </div>

      <Field
        label="Title"
        value={titleValue}
        onChange={onTitle}
      />

      <TextArea
        label="Text"
        value={textValue}
        onChange={onText}
      />

      <style jsx>{`
        .mini {
          padding: 14px;
          display: grid;
          gap: 10px;
          border: 1px solid #e1e5e8;
          border-radius: 12px;
          background: #fafbfb;
        }

        .miniTop {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2px;
        }

        .miniTop > span {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          color: #225fc7;
          background: #edf3ff;
          font-size: 7px;
          font-weight: 900;
        }

        .miniTop strong {
          color: #43505d;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   PRODUCT EDITOR
========================================================= */

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
      <div className="productTop">
        <div>{emoji}</div>

        <section>
          <strong>{title}</strong>
          <span>{label}</span>
        </section>
      </div>

      {image && (
        <div className="preview">
          <img src={image} alt={title} />
        </div>
      )}

      <Field
        label="Display Name"
        value={label}
        onChange={onLabel}
      />

      <Field
        label="Photo URL"
        value={image}
        placeholder="https://..."
        onChange={onImage}
      />

      <style jsx>{`
        .product {
          padding: 15px;
          display: grid;
          gap: 11px;
          border: 1px solid #e1e5e8;
          border-radius: 13px;
          background: #fafbfb;
        }

        .productTop {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .productTop > div {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: white;
          font-size: 18px;
        }

        section strong,
        section span {
          display: block;
        }

        section strong {
          color: #38444f;
          font-size: 11px;
        }

        section span {
          margin-top: 3px;
          color: #929ba4;
          font-size: 7px;
        }

        .preview {
          height: 140px;
          overflow: hidden;
          border-radius: 10px;
          background: #e8ecef;
        }

        .preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   QR PREVIEW
========================================================= */

function QrPreview() {
  const dark = [
    0, 1, 2, 5, 6,
    7, 9, 11, 13,
    14, 16, 18, 20,
    21, 22, 24, 26,
    27, 28, 30, 32,
    34, 35, 36, 38,
    40, 42, 43, 44,
    46, 47, 48,
  ];

  return (
    <div
      style={{
        width: 43,
        height: 43,
        marginTop: 6,
        display: "grid",
        gridTemplateColumns:
          "repeat(7,1fr)",
        gap: 1.25,
      }}
    >
      {Array.from({
        length: 49,
      }).map((_, index) => (
        <span
          key={index}
          style={{
            background: dark.includes(
              index
            )
              ? "#17212b"
              : "#e2e6e9",
          }}
        />
      ))}
    </div>
  );
}
