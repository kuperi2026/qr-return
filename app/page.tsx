"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import SupportLauncher from "./components/SupportLauncher";
import { supabase } from "@/lib/supabase";

type Language = "ka" | "en";

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

const homepageDefaults: HomepageSettings = {
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
};

const defaultProducts = [
  {
    id: "dog",
    ka: "ძაღლი",
    en: "Dog",
    image:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=88",
    className: "dog",
  },
  {
    id: "cat",
    ka: "კატა",
    en: "Cat",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=88",
    className: "cat",
  },
  {
    id: "keys",
    ka: "სახლის + მანქანის გასაღები",
    en: "Home + Car Keys",
    image: "",
    className: "keys",
  },
  {
    id: "wallet",
    ka: "საფულე",
    en: "Wallet",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=88",
    className: "wallet",
  },
  {
    id: "luggage",
    ka: "ჩემოდანი",
    en: "Luggage",
    image:
      "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=88",
    className: "luggage",
  },
  {
    id: "bag",
    ka: "ჩანთა",
    en: "Bag",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=88",
    className: "bag",
  },
];

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("ka");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [homepage, setHomepage] =
    useState<HomepageSettings>(homepageDefaults);

  const ka = language === "ka";

  /* =========================================================
     LOAD HOMEPAGE SETTINGS
  ========================================================= */

  useEffect(() => {
    async function loadHomepage() {
      const { data, error } = await supabase
        .from("homepage_settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.warn(
          "homepage_settings load error:",
          error.message
        );
        return;
      }

      if (data) {
        setHomepage({
          ...homepageDefaults,
          ...data,
        });
      }
    }

    void loadHomepage();
  }, []);

  /* =========================================================
     AUTH + ADMIN
  ========================================================= */

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        return;
      }

      setIsLoggedIn(true);

      const { data } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(Boolean(data));
    }

    void loadUser();

    const { data } =
      supabase.auth.onAuthStateChange(() => {
        void loadUser();
      });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  /* =========================================================
     PRODUCT SETTINGS
  ========================================================= */

  const products = useMemo(() => {
    return defaultProducts.map((item) => {
      const labels: Record<string, string> = {
        dog: homepage.dog_label,
        cat: homepage.cat_label,
        keys: homepage.keys_label,
        wallet: homepage.wallet_label,
        luggage: homepage.suitcase_label,
        bag: homepage.bag_label,
      };

      const images: Record<string, string> = {
        dog: homepage.dog_image,
        cat: homepage.cat_image,
        keys: homepage.keys_image,
        wallet: homepage.wallet_image,
        luggage: homepage.suitcase_image,
        bag: homepage.bag_image,
      };

      return {
        ...item,
        customLabel: labels[item.id] || item.ka,
        customImage: images[item.id] || item.image,
      };
    });
  }, [homepage]);

  return (
    <main className="page">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="header">
        <a href="/" className="brand">
          <div className="brandIcon">
            <QrIcon />
          </div>

          <div className="brandText">
            <strong>QR RETURN</strong>
            <span>SMART LOST &amp; FOUND</span>
          </div>
        </a>

        <div className="headerRight">
          <nav className="nav">
            {isAdmin && (
              <a href="/admin" className="adminBtn">
                <AdminIcon />
                <span>Admin Panel</span>
              </a>
            )}

            {isLoggedIn ? (
              <a href="/account" className="accountBtn">
                <UserIcon />

                <span>
                  {ka
                    ? "ჩემი ანგარიში"
                    : "My Account"}
                </span>
              </a>
            ) : (
              <>
                <a
                  href="/account/register"
                  className="accountBtn"
                >
                  {ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}
                </a>

                <a href="/login" className="loginBtn">
                  {ka ? "შესვლა" : "Sign In"}
                </a>
              </>
            )}
          </nav>

          <div className="language">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLanguage("ka")}
            >
              GEO
            </button>

            <span />

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================
          PREMIUM HERO
      ====================================================== */}

      <section className="hero">
        <div className="heroGlow glowBlue" />
        <div className="heroGlow glowRed" />

        <div className="heroInner">
          {/* ==================================================
              LEFT — EMERGENCY
          ================================================== */}

          <div className="emergencyColumn">
            <div className="emergencyEyebrow">
              <span className="medicalMark">+</span>

              <span>
                {ka
                  ? homepage.emergency_title
                  : "QR RETURN • EMERGENCY ID"}
              </span>
            </div>

            <h1>
              {ka
                ? homepage.hero_title
                : "When you cannot speak, essential information can still speak for you."}
            </h1>

            <p className="heroLead">
              {ka
                ? homepage.hero_description
                : "Emergency QR lets you decide in advance what a helper should know and who they should contact in an emergency."}
            </p>

            {/* PREMIUM BRACELET */}

            <div className="braceletArea">
              <div className="braceletShadow" />

              <div className="bracelet">
                <div className="strap redStrap">
                  <span className="strapLine" />
                </div>

                <div className="braceletPlate">
                  <div className="plateHeader">
                    <span className="tinyCross">+</span>
                    <span>EMERGENCY QR</span>
                  </div>

                  <div className="plateQr">
                    <QrCode size={62} />
                  </div>

                  <div className="plateBrand">
                    <strong>QR RETURN</strong>
                    <span>SCAN FOR EMERGENCY INFO</span>
                  </div>
                </div>

                <div className="strap blueStrap">
                  <span className="strapLine" />
                </div>
              </div>
            </div>

            {/* EMERGENCY INFO */}

            <div className="emergencyProfile">
              <div className="profileTop">
                <div>
                  <span>EMERGENCY PROFILE</span>

                  <strong>
                    {ka
                      ? "მხოლოდ საჭირო ინფორმაცია."
                      : "Only what matters."}
                  </strong>
                </div>

                <div className="ready">
                  <i />
                  SOS READY
                </div>
              </div>

              <div className="profileGrid">
                <EmergencyItem
                  icon={<PhoneIcon />}
                  title={
                    ka
                      ? "საგანგებო კონტაქტი"
                      : "Emergency Contact"
                  }
                  text={
                    ka
                      ? "თქვენ მიერ არჩეული პირი"
                      : "Your trusted contact"
                  }
                />

                <EmergencyItem
                  icon={<HeartIcon />}
                  title={
                    ka
                      ? "სამედიცინო ინფორმაცია"
                      : "Medical Information"
                  }
                  text={
                    ka
                      ? "მხოლოდ ნებადართული მონაცემები"
                      : "Only approved information"
                  }
                />

                <EmergencyItem
                  icon={<AlertIcon />}
                  title={ka ? "ალერგიები" : "Allergies"}
                  text={
                    ka
                      ? "საჭიროების შემთხვევაში"
                      : "When relevant"
                  }
                />

                <EmergencyItem
                  icon={<ShieldIcon />}
                  title="Privacy Control"
                  text={
                    ka
                      ? "თქვენ აკონტროლებთ მონაცემებს"
                      : "You stay in control"
                  }
                />
              </div>
            </div>

            <p className="emergencyDescription">
              {ka
                ? homepage.emergency_description
                : "Emergency contact, medical information and other essential information you choose to make available."}
            </p>

            <div className="heroActions">
              <a
                href={
                  isLoggedIn
                    ? "/account"
                    : "/account/register"
                }
                className="primaryCta"
              >
                {isLoggedIn
                  ? ka
                    ? "ჩემი ანგარიში"
                    : "My Account"
                  : ka
                    ? "ანგარიშის შექმნა"
                    : "Create Account"}

                <ArrowIcon />
              </a>

              <a href="#video" className="secondaryCta">
                {ka
                  ? "როგორ მუშაობს"
                  : "How it works"}
              </a>
            </div>
          </div>

          {/* ==================================================
              RIGHT — ECOSYSTEM
          ================================================== */}

          <div className="ecosystem">
            <div className="orbit orbitOuter" />
            <div className="orbit orbitInner" />

            {/* PHONE */}

            <div className="phone">
              <div className="phoneNotch" />

              <div className="phoneScreen">
                <div className="phoneHeader">
                  <div className="phoneLogo">
                    <QrIcon />
                  </div>

                  <div>
                    <span>QR RETURN</span>
                    <strong>
                      {ka
                        ? "მპოვნელის გვერდი"
                        : "Finder Access"}
                    </strong>
                  </div>
                </div>

                <div className="phoneStatus">
                  <div className="successCircle">
                    <CheckIcon />
                  </div>

                  <span>SCAN COMPLETE</span>
                </div>

                <div className="phoneCopy">
                  <strong>
                    {ka
                      ? "დაუკავშირდი მფლობელს"
                      : "Contact the owner"}
                  </strong>

                  <p>
                    {ka
                      ? "აირჩიე შენთვის მოსახერხებელი მეთოდი."
                      : "Choose the contact method that works for you."}
                  </p>
                </div>

                <div className="phoneButtons">
                  <button
                    type="button"
                    className="phonePrimary"
                  >
                    <ChatIcon />
                    <span>Live Chat</span>
                  </button>

                  <button type="button">
                    <LocationIcon />

                    <span>
                      {ka ? "ლოკაცია" : "Location"}
                    </span>
                  </button>
                </div>

                <div className="privacy">
                  <ShieldIcon />

                  <span>
                    {ka
                      ? "პირადი მონაცემები დაცულია"
                      : "Private information protected"}
                  </span>
                </div>
              </div>
            </div>

            {/* PRODUCTS */}

            <div className="productOrbit">
              {products.map((item) => (
                <div
                  key={item.id}
                  className={`productBubble ${item.className}`}
                >
                  <div className="productImage">
                    {item.id === "keys" &&
                    !item.customImage ? (
                      <KeysScene />
                    ) : (
                      <img
                        src={item.customImage}
                        alt={
                          ka
                            ? item.customLabel
                            : item.en
                        }
                      />
                    )}

                    <div className="imageShade" />

                    <div
                      className={`miniPhysicalTag ${item.id}`}
                    >
                      <span className="tagHole" />
                      <MiniQr />
                    </div>

                    {item.id === "luggage" && (
                      <span className="airportBadge">
                        AIRPORT
                      </span>
                    )}
                  </div>

                  <strong>
                    {ka
                      ? item.customLabel
                      : item.en}
                  </strong>
                </div>
              ))}
            </div>

            <div className="ecosystemCaption">
              <span>QR RETURN</span>

              <strong>
                {ka
                  ? "ერთი სისტემა. ბევრი გამოყენება."
                  : "One system. Many uses."}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          VIDEO
      ====================================================== */}

      {homepage.video_enabled && (
        <section id="video" className="videoSection">
          <div className="shell">
            <div className="videoLayout">
              <div className="videoCopy">
                <span className="eyebrow">
                  QR RETURN IN ACTION
                </span>

                <h2>
                  {ka
                    ? "ერთი სკანი. პირდაპირი კავშირი."
                    : "One scan. A direct connection."}
                </h2>

                <p>
                  {ka
                    ? "აქ განთავსდება მოკლე რეალური ვიდეო — როგორ ხედავს მპოვნელი QR RETURN-ს, როგორ ასკანერებს და როგორ იწყებს მფლობელთან დაკავშირებას."
                    : "A short real-world video will show how a finder notices QR RETURN, scans it and starts connecting with the owner."}
                </p>
              </div>

              <div className="videoCard">
                <div className="videoBrand">
                  <QrIcon />
                  <span>
                    QR RETURN PRODUCT DEMO
                  </span>
                </div>

                <button
                  type="button"
                  className="playButton"
                >
                  <PlayIcon />
                </button>

                <span className="videoSoon">
                  {ka
                    ? "ვიდეო დაემატება"
                    : "Video coming soon"}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          4 STEPS
      ====================================================== */}

      {homepage.steps_enabled && (
        <section className="stepsSection">
          <div className="shell">
            <div className="sectionHeading">
              <span className="eyebrow">
                FIND → SCAN → CONNECT → RETURN
              </span>

              <h2>
                {ka
                  ? "დაბრუნების გზა ოთხ ნაბიჯში."
                  : "A clear return path in four steps."}
              </h2>
            </div>

            <div className="steps">
              <Step
                number="01"
                icon={<SearchIcon />}
                title={ka ? "იპოვეს" : "Found"}
                text={
                  ka
                    ? "მპოვნელი ხედავს QR RETURN კოდს."
                    : "The finder sees the QR RETURN code."
                }
              />

              <span className="stepLine" />

              <Step
                number="02"
                icon={<ScanIcon />}
                title={
                  ka
                    ? "დაასკანერეს"
                    : "Scanned"
                }
                text={
                  ka
                    ? "აპის ჩამოტვირთვა საჭირო არ არის."
                    : "No app download is required."
                }
              />

              <span className="stepLine" />

              <Step
                number="03"
                icon={<ChatIcon />}
                title={
                  ka
                    ? "დაგიკავშირდნენ"
                    : "Connected"
                }
                text={
                  ka
                    ? "Live Chat, ზარი ან თქვენ მიერ არჩეული მეთოდი."
                    : "Live Chat, call or another contact method."
                }
              />

              <span className="stepLine" />

              <Step
                number="04"
                icon={<ReturnIcon />}
                title={
                  ka
                    ? "დაბრუნდა"
                    : "Returned"
                }
                text={
                  ka
                    ? "მპოვნელთან კავშირის შემდეგ დაბრუნება მარტივდება."
                    : "Once connected, getting it back becomes easier."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          FEATURES
      ====================================================== */}

      {homepage.features_enabled && (
        <section className="featuresSection">
          <div className="shell">
            <div className="featuresHeading">
              <span>
                CONNECTION &amp; CONTROL
              </span>

              <h2>
                {ka
                  ? "რაც საჭიროა — ზედმეტი სირთულის გარეშე."
                  : "What you need — without unnecessary complexity."}
              </h2>
            </div>

            <div className="features">
              <Feature
                number="01"
                icon={<ChatIcon />}
                title="Live Chat"
                text={
                  ka
                    ? "მპოვნელთან პირდაპირი კავშირი პირადი ნომრის გამოჩენის გარეშე."
                    : "Connect directly without displaying your private phone number."
                }
              />

              <Feature
                number="02"
                icon={<LocationIcon />}
                title={
                  ka
                    ? "ლოკაციის გაზიარება"
                    : "Location Sharing"
                }
                text={
                  ka
                    ? "მპოვნელმა შეიძლება ლოკაცია ერთი ღილაკით გაგიზიაროთ."
                    : "The finder can share their location with one tap."
                }
              />

              <Feature
                number="03"
                icon={<RewardIcon />}
                title={
                  ka
                    ? "მპოვნელის ჯილდო"
                    : "Finder Reward"
                }
                text={
                  ka
                    ? "სურვილის შემთხვევაში შესთავაზეთ ჯილდო."
                    : "Optionally offer a reward for a safe return."
                }
              />

              <Feature
                number="04"
                icon={<ShieldIcon />}
                title="Privacy Control"
                text={
                  ka
                    ? "თქვენ წყვეტთ რა ინფორმაცია გამოჩნდება."
                    : "You decide exactly what information is visible."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          RULES
      ====================================================== */}

      {homepage.rules_enabled && (
        <section className="rulesSection">
          <div className="shell">
            <div className="sectionHeading">
              <span className="eyebrow">
                SIMPLE BY DESIGN
              </span>

              <h2>
                {ka
                  ? "მარტივი თქვენთვის. კიდევ უფრო მარტივი მპოვნელისთვის."
                  : "Simple for you. Even simpler for the finder."}
              </h2>
            </div>

            <div className="rules">
              <Rule
                number="01"
                title={
                  ka ? "აპის გარეშე" : "No App"
                }
                text={
                  ka
                    ? "მპოვნელისთვის აპის ჩამოტვირთვა ან რეგისტრაცია საჭირო არ არის."
                    : "The finder does not need to download an app or create an account."
                }
              />

              <Rule
                number="02"
                title={
                  ka
                    ? "თქვენი ინფორმაცია"
                    : "Your Information"
                }
                text={
                  ka
                    ? "თქვენ თავად განსაზღვრავთ რა იქნება ხელმისაწვდომი."
                    : "You decide exactly what information can be shown."
                }
              />

              <Rule
                number="03"
                title={
                  ka
                    ? "ერთი ანგარიში"
                    : "One Account"
                }
                text={
                  ka
                    ? "ცხოველები, ნივთები და Emergency ID ერთ სივრცეში."
                    : "Pets, belongings and Emergency ID in one place."
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          ACCOUNT
      ====================================================== */}

      <section className="accountSection">
        <div className="shell">
          <div className="accountPanel">
            <div className="accountIcon">
              <UserIcon />
            </div>

            <div className="accountCopy">
              <span>ONE OWNER ACCOUNT</span>

              <h2>
                {ka
                  ? "ყველაფერი ერთი ანგარიშიდან."
                  : "Everything from one account."}
              </h2>

              <p>
                {ka
                  ? "მართეთ QR პროფილები, დაკარგვის რეჟიმი, Live Chat და Emergency ID."
                  : "Manage QR profiles, lost mode, Live Chat and Emergency ID."}
              </p>
            </div>

            <a
              href={
                isLoggedIn
                  ? "/account"
                  : "/account/register"
              }
            >
              {isLoggedIn
                ? ka
                  ? "ჩემი ანგარიში"
                  : "My Account"
                : ka
                  ? "ანგარიშის შექმნა"
                  : "Create Account"}

              <ArrowIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONTACT
      ====================================================== */}

      {homepage.contact_enabled && (
        <section className="contactSection">
          <div className="shell contactInner">
            <div>
              <span className="eyebrow">
                CONTACT
              </span>

              <h2>
                {ka
                  ? "დაგვიკავშირდით"
                  : "Contact us"}
              </h2>

              <p>
                {ka
                  ? "კითხვა გაქვთ QR RETURN-ის ან Emergency ID-ის შესახებ? მოგვწერეთ."
                  : "Questions about QR RETURN or Emergency ID? Send us a message."}
              </p>
            </div>

            <a href="mailto:hello@qrreturn.com">
              {ka ? "მოგვწერეთ" : "Email us"}
              <ArrowIcon />
            </a>
          </div>
        </section>
      )}

      {/* ======================================================
          LIVE CHAT — DON'T REMOVE
      ====================================================== */}

      <SupportLauncher language={language} />

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="footerInner">
          <div className="footerBrand">
            <div>
              <QrIcon />
            </div>

            <section>
              <strong>QR RETURN</strong>
              <span>
                SMART LOST &amp; FOUND
              </span>
            </section>
          </div>

          <div className="footerLinks">
            <a href="#video">
              {ka
                ? "როგორ მუშაობს"
                : "How it works"}
            </a>

            <span>Emergency ID</span>

            <span>
              {ka
                ? "კონფიდენციალურობა"
                : "Privacy"}
            </span>

            <span>
              {ka ? "პირობები" : "Terms"}
            </span>
          </div>

          <span className="copyright">
            © 2026 QR RETURN
          </span>
        </div>
      </footer>

      {/* ======================================================
          CSS
      ====================================================== */}

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          background: #f8f8f5;
        }

        .page {
          overflow: hidden;
          color: #18212b;
          background: #f8f8f5;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .shell {
          width: calc(100% - 56px);
          max-width: 1180px;
          margin: auto;
        }

        .eyebrow {
          color: #c84a50;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.7px;
        }

        /* ================= HEADER ================= */

        .header {
          width: calc(100% - 56px);
          max-width: 1280px;
          min-height: 78px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          position: relative;
          z-index: 40;
          border-bottom: 1px solid
            rgba(20, 28, 38, 0.075);
        }

        .brand,
        .headerRight,
        .nav,
        .language {
          display: flex;
          align-items: center;
        }

        .brand {
          gap: 10px;
          text-decoration: none;
        }

        .brandIcon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          color: white;
          background: #202b37;
        }

        .brandIcon :global(svg) {
          width: 20px;
        }

        .brandText strong,
        .brandText span {
          display: block;
        }

        .brandText strong {
          color: #202b37;
          font-size: 17px;
          font-weight: 850;
          letter-spacing: -0.4px;
        }

        .brandText span {
          margin-top: 3px;
          color: #929aa3;
          font-size: 6px;
          font-weight: 850;
          letter-spacing: 1.7px;
        }

        .headerRight {
          gap: 14px;
        }

        .nav {
          gap: 7px;
        }

        .adminBtn,
        .accountBtn,
        .loginBtn {
          min-height: 38px;
          padding: 0 13px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 800;
        }

        .adminBtn {
          color: #9d4044;
          border: 1px solid #ecd8da;
          background: #fff8f8;
        }

        .adminBtn :global(svg),
        .accountBtn :global(svg) {
          width: 13px;
        }

        .accountBtn {
          color: white;
          background: #202b37;
        }

        .loginBtn {
          color: #53606d;
          border: 1px solid #dce0e4;
        }

        .language {
          gap: 7px;
        }

        .language > span {
          width: 1px;
          height: 12px;
          background: #d6dade;
        }

        .language button {
          padding: 0;
          border: 0;
          color: #999fa8;
          background: transparent;
          font-size: 8px;
          font-weight: 900;
          cursor: pointer;
        }

        .language button.active {
          color: #c84a50;
        }

        /* ================= HERO ================= */

        .hero {
          min-height: 760px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 88% 12%,
              rgba(49, 89, 137, 0.07),
              transparent 31%
            ),
            radial-gradient(
              circle at 7% 89%,
              rgba(198, 65, 75, 0.05),
              transparent 25%
            ),
            linear-gradient(
              120deg,
              #fbfaf7 0%,
              #f6f6f3 52%,
              #f1f3f4 100%
            );
        }

        .heroGlow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .glowBlue {
          width: 520px;
          height: 520px;
          top: -280px;
          right: -220px;
          background: rgba(
            43,
            93,
            150,
            0.045
          );
        }

        .glowRed {
          width: 360px;
          height: 360px;
          bottom: -190px;
          left: -180px;
          background: rgba(
            198,
            67,
            76,
            0.04
          );
        }

        .heroInner {
          width: calc(100% - 56px);
          max-width: 1280px;
          min-height: 760px;
          margin: auto;
          display: grid;
          grid-template-columns:
            0.96fr 1.04fr;
          align-items: center;
          gap: 65px;
          position: relative;
          z-index: 2;
        }

        /* ================= EMERGENCY ================= */

        .emergencyColumn {
          max-width: 580px;
        }

        .emergencyEyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #a84248;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 1.3px;
        }

        .medicalMark {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          color: white;
          background: #c94a50;
          font-size: 17px;
        }

        .emergencyColumn h1 {
          max-width: 565px;
          margin: 22px 0 0;
          color: #17212b;
          font-size: clamp(
            37px,
            3.9vw,
            49px
          );
          line-height: 1.07;
          letter-spacing: -2.4px;
          font-weight: 690;
        }

        .heroLead {
          max-width: 535px;
          margin: 18px 0 0;
          color: #68727c;
          font-size: 15px;
          line-height: 1.72;
        }

        /* BRACELET */

        .braceletArea {
          min-height: 180px;
          margin-top: 26px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .braceletShadow {
          width: 370px;
          height: 24px;
          position: absolute;
          left: 50px;
          bottom: 18px;
          border-radius: 50%;
          background: rgba(
            27,
            37,
            49,
            0.09
          );
          filter: blur(13px);
        }

        .bracelet {
          width: 470px;
          height: 120px;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
          transform: rotate(-4deg);
        }

        .strap {
          height: 48px;
          flex: 1;
          position: relative;
          overflow: hidden;
          box-shadow:
            inset 0 1px
            rgba(255, 255, 255, 0.25);
        }

        .redStrap {
          border-radius:
            25px 0 0 25px;
          background:
            linear-gradient(
              180deg,
              #df4a50,
              #bd343b
            );
        }

        .blueStrap {
          border-radius:
            0 25px 25px 0;
          background:
            linear-gradient(
              180deg,
              #2e79bd,
              #155c9c
            );
        }

        .strapLine {
          width: 70%;
          height: 2px;
          position: absolute;
          left: 15%;
          top: 50%;
          border-radius: 99px;
          background: rgba(
            255,
            255,
            255,
            0.18
          );
        }

        .braceletPlate {
          width: 158px;
          height: 118px;
          padding: 10px 12px;
          flex: 0 0 158px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid #b9c0c6;
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f3f4f4
            );
          box-shadow:
            0 18px 34px
              rgba(29, 38, 49, 0.16),
            inset 0 1px white;
        }

        .plateHeader {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #a44045;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.55px;
        }

        .tinyCross {
          width: 16px;
          height: 16px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          color: white;
          background: #c94a50;
          font-size: 11px;
        }

        .plateQr {
          margin-top: 6px;
        }

        .plateBrand {
          margin-top: 4px;
          text-align: center;
        }

        .plateBrand strong,
        .plateBrand span {
          display: block;
        }

        .plateBrand strong {
          color: #27323d;
          font-size: 6px;
          letter-spacing: 0.5px;
        }

        .plateBrand span {
          margin-top: 2px;
          color: #8c949c;
          font-size: 4px;
          letter-spacing: 0.3px;
        }

        /* PROFILE */

        .emergencyProfile {
          padding: 17px;
          border: 1px solid #e0e3e6;
          border-radius: 19px;
          background:
            rgba(
              255,
              255,
              255,
              0.87
            );
          box-shadow:
            0 14px 36px
            rgba(31, 40, 53, 0.045);
          backdrop-filter: blur(14px);
        }

        .profileTop {
          padding-bottom: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .profileTop span,
        .profileTop strong {
          display: block;
        }

        .profileTop > div:first-child span {
          color: #c94a50;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.9px;
        }

        .profileTop > div:first-child strong {
          margin-top: 4px;
          color: #36414d;
          font-size: 12px;
        }

        .ready {
          padding: 6px 8px;
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 999px;
          color: #376b4c;
          background: #edf8f1;
          font-size: 6px;
          font-weight: 900;
        }

        .ready i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2aa76b;
        }

        .profileGrid {
          display: grid;
          grid-template-columns:
            1fr 1fr;
          border-top:
            1px solid #e7eaed;
          border-left:
            1px solid #e7eaed;
        }

        .emergencyDescription {
          max-width: 535px;
          margin: 13px 0 0;
          color: #737d87;
          font-size: 10px;
          line-height: 1.6;
        }

        .heroActions {
          margin-top: 23px;
          display: flex;
          gap: 9px;
        }

        .primaryCta,
        .secondaryCta {
          min-height: 44px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 820;
        }

        .primaryCta {
          color: white;
          background: #202b37;
          box-shadow:
            0 8px 20px
            rgba(32, 43, 55, 0.11);
        }

        .primaryCta :global(svg) {
          width: 12px;
        }

        .secondaryCta {
          color: #4d5865;
          border:
            1px solid #d9dde1;
          background:
            rgba(
              255,
              255,
              255,
              0.62
            );
        }

        /* ================= ECOSYSTEM ================= */

        .ecosystem {
          width: 590px;
          height: 600px;
          margin: auto;
          position: relative;
        }

        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform:
            translate(-50%, -50%);
        }

        .orbitOuter {
          width: 500px;
          height: 500px;
          border:
            1px solid
            rgba(86, 104, 126, 0.11);
        }

        .orbitInner {
          width: 385px;
          height: 385px;
          border:
            1px dashed
            rgba(86, 104, 126, 0.08);
        }

        /* PHONE */

        .phone {
          width: 175px;
          height: 350px;
          padding: 7px;
          position: absolute;
          z-index: 5;
          top: 50%;
          left: 50%;
          border-radius: 29px;
          background:
            linear-gradient(
              145deg,
              #171e26,
              #070b10
            );
          box-shadow:
            0 32px 70px
            rgba(24, 33, 44, 0.2);
          transform:
            translate(-50%, -50%);
        }

        .phoneNotch {
          width: 46px;
          height: 9px;
          position: absolute;
          top: 10px;
          left: 50%;
          z-index: 4;
          border-radius: 99px;
          background: #05080c;
          transform: translateX(-50%);
        }

        .phoneScreen {
          height: 100%;
          padding: 27px 13px 13px;
          border-radius: 23px;
          background:
            linear-gradient(
              180deg,
              #fff,
              #f6f8fa
            );
        }

        .phoneHeader {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .phoneLogo {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: white;
          background: #202b37;
        }

        .phoneLogo :global(svg) {
          width: 15px;
        }

        .phoneHeader span,
        .phoneHeader strong {
          display: block;
        }

        .phoneHeader span {
          color: #c94a50;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.7px;
        }

        .phoneHeader strong {
          margin-top: 2px;
          color: #4a5562;
          font-size: 8px;
        }

        .phoneStatus {
          margin-top: 32px;
          text-align: center;
        }

        .successCircle {
          width: 62px;
          height: 62px;
          margin: auto;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #2b9663;
          background: #edf8f2;
        }

        .successCircle :global(svg) {
          width: 27px;
        }

        .phoneStatus > span {
          display: block;
          margin-top: 9px;
          color: #83909c;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .phoneCopy {
          margin-top: 15px;
          text-align: center;
        }

        .phoneCopy strong {
          display: block;
          color: #27323d;
          font-size: 14px;
          line-height: 1.3;
        }

        .phoneCopy p {
          margin: 6px 0 0;
          color: #7d8793;
          font-size: 8px;
          line-height: 1.5;
        }

        .phoneButtons {
          margin-top: 18px;
          display: grid;
          grid-template-columns:
            1fr 1fr;
          gap: 6px;
        }

        .phoneButtons button {
          min-height: 47px;
          padding: 7px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border:
            1px solid #e0e4e7;
          border-radius: 10px;
          color: #56616d;
          background: white;
          font-size: 7px;
          font-weight: 800;
        }

        .phoneButtons .phonePrimary {
          color: white;
          border-color: #202b37;
          background: #202b37;
        }

        .phoneButtons :global(svg) {
          width: 13px;
        }

        .privacy {
          margin-top: 11px;
          padding-top: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border-top:
            1px solid #e5e8ea;
          color: #838d98;
          font-size: 6px;
        }

        .privacy :global(svg) {
          width: 11px;
          color: #c94a50;
        }

        /* PRODUCTS */

        .productOrbit {
          position: absolute;
          inset: 0;
          animation:
            productMovement
            18s
            ease-in-out
            infinite alternate;
        }

        @keyframes productMovement {
          from {
            transform: rotate(-1.1deg);
          }

          to {
            transform: rotate(1.1deg);
          }
        }

        .productBubble {
          width: 116px;
          position: absolute;
          text-align: center;
        }

        .productImage {
          width: 116px;
          height: 92px;
          position: relative;
          overflow: hidden;
          border:
            4px solid
            rgba(
              255,
              255,
              255,
              0.95
            );
          border-radius: 18px;
          background: #e1e4e7;
          box-shadow:
            0 13px 28px
            rgba(31, 41, 54, 0.11);
        }

        .productImage > img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .imageShade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              transparent 58%,
              rgba(7, 11, 16, 0.13)
            );
        }

        .productBubble > strong {
          display: inline-block;
          max-width: 130px;
          margin-top: 8px;
          padding: 5px 8px;
          border:
            1px solid
            rgba(
              221,
              225,
              228,
              0.92
            );
          border-radius: 999px;
          color: #465260;
          background:
            rgba(
              255,
              255,
              255,
              0.9
            );
          font-size: 8px;
          line-height: 1.3;
          font-weight: 800;
        }

        .miniPhysicalTag {
          width: 26px;
          height: 32px;
          position: absolute;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: white;
          box-shadow:
            0 4px 10px
            rgba(0, 0, 0, 0.13);
          transform: scale(0.72);
        }

        .tagHole {
          width: 7px;
          height: 7px;
          position: absolute;
          top: -5px;
          border:
            1px solid #919ba5;
          border-radius: 50%;
        }

        .miniPhysicalTag.dog,
        .miniPhysicalTag.cat {
          left: 50%;
          bottom: -3px;
          transform:
            translateX(-50%)
            scale(0.7);
        }

        .miniPhysicalTag.keys,
        .miniPhysicalTag.wallet {
          right: 9px;
          bottom: 8px;
        }

        .miniPhysicalTag.luggage {
          top: 12px;
          left: 50%;
          transform:
            translateX(-50%)
            scale(0.72);
        }

        .miniPhysicalTag.bag {
          top: 17px;
          right: 13px;
        }

        .airportBadge {
          position: absolute;
          left: 6px;
          bottom: 6px;
          padding: 4px 5px;
          border-radius: 999px;
          color: #42505f;
          background:
            rgba(
              255,
              255,
              255,
              0.88
            );
          font-size: 5px;
          font-weight: 900;
        }

        .dog {
          top: 25px;
          left: 92px;
        }

        .cat {
          top: 25px;
          right: 88px;
        }

        .keys {
          top: 236px;
          left: 2px;
        }

        .wallet {
          top: 236px;
          right: 2px;
        }

        .luggage {
          left: 93px;
          bottom: 28px;
        }

        .bag {
          right: 88px;
          bottom: 28px;
        }

        .ecosystemCaption {
          position: absolute;
          left: 50%;
          bottom: 0;
          text-align: center;
          transform: translateX(-50%);
        }

        .ecosystemCaption span,
        .ecosystemCaption strong {
          display: block;
        }

        .ecosystemCaption span {
          color: #c94a50;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .ecosystemCaption strong {
          margin-top: 3px;
          color: #6d7782;
          font-size: 8px;
        }

        /* ================= VIDEO ================= */

        .videoSection {
          padding: 90px 0;
          background: #fbfbf9;
        }

        .videoLayout {
          display: grid;
          grid-template-columns:
            0.75fr 1.25fr;
          align-items: center;
          gap: 65px;
        }

        .videoCopy h2,
        .sectionHeading h2 {
          margin: 11px 0 0;
          color: #18222c;
          font-size: clamp(
            32px,
            3.7vw,
            43px
          );
          line-height: 1.07;
          letter-spacing: -2px;
          font-weight: 670;
        }

        .videoCopy p {
          margin: 15px 0 0;
          color: #6d7782;
          font-size: 12px;
          line-height: 1.72;
        }

        .videoCard {
          min-height: 340px;
          position: relative;
          display: grid;
          place-items: center;
          border:
            1px solid #e0e4e7;
          border-radius: 24px;
          background:
            radial-gradient(
              circle at 80% 10%,
              rgba(
                50,
                89,
                140,
                0.055
              ),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #eef1f3,
              #fafaf8
            );
        }

        .videoBrand {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #59646f;
          font-size: 7px;
          font-weight: 900;
        }

        .videoBrand :global(svg) {
          width: 18px;
        }

        .playButton {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          color: white;
          background: #202b37;
          box-shadow:
            0 14px 30px
            rgba(
              32,
              43,
              55,
              0.15
            );
          cursor: pointer;
        }

        .playButton :global(svg) {
          width: 22px;
        }

        .videoSoon {
          position: absolute;
          bottom: 18px;
          color: #8b949e;
          font-size: 8px;
        }

        /* ================= STEPS ================= */

        .stepsSection {
          padding: 90px 0;
          background: #f1f2ef;
        }

        .sectionHeading {
          max-width: 700px;
        }

        .steps {
          margin-top: 44px;
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto
            1fr auto 1fr;
          align-items: start;
        }

        .stepLine {
          width: 55px;
          height: 1px;
          margin: 36px 17px 0;
          background: #d5dade;
        }

        /* ================= FEATURES ================= */

        .featuresSection {
          padding: 88px 0;
          color: white;
          background: #202b37;
        }

        .featuresHeading > span {
          color: #df8c90;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .featuresHeading h2 {
          max-width: 730px;
          margin: 10px 0 0;
          color: white;
          font-size: clamp(
            31px,
            3.6vw,
            42px
          );
          line-height: 1.07;
          letter-spacing: -1.9px;
          font-weight: 650;
        }

        .features {
          margin-top: 40px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          border-top:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        /* ================= RULES ================= */

        .rulesSection {
          padding: 86px 0;
          background: #fafaf8;
        }

        .rules {
          margin-top: 38px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          border-top:
            1px solid #e0e3e6;
          border-bottom:
            1px solid #e0e3e6;
        }

        /* ================= ACCOUNT ================= */

        .accountSection {
          padding: 68px 0;
          background: #f1f2ef;
        }

        .accountPanel {
          padding: 28px;
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 21px;
          border:
            1px solid #dee2e5;
          border-radius: 20px;
          background: white;
        }

        .accountIcon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #202b37;
          background: #eef1f3;
        }

        .accountIcon :global(svg) {
          width: 23px;
        }

        .accountCopy > span {
          color: #c94a50;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .accountCopy h2 {
          margin: 7px 0 0;
          color: #19232d;
          font-size: 31px;
          letter-spacing: -1.6px;
        }

        .accountCopy p {
          margin: 8px 0 0;
          color: #707a85;
          font-size: 10px;
          line-height: 1.6;
        }

        .accountPanel > a {
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #202b37;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }

        .accountPanel > a :global(svg) {
          width: 12px;
        }

        /* ================= CONTACT ================= */

        .contactSection {
          padding: 67px 0;
          background: #eaeae8;
        }

        .contactInner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 45px;
        }

        .contactInner h2 {
          margin: 9px 0 8px;
          color: #19232d;
          font-size: 34px;
          letter-spacing: -1.6px;
        }

        .contactInner p {
          margin: 0;
          color: #707984;
          font-size: 10px;
        }

        .contactInner > a {
          min-height: 41px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 10px;
          color: white;
          background: #202b37;
          text-decoration: none;
          font-size: 9px;
          font-weight: 850;
        }

        .contactInner > a :global(svg) {
          width: 12px;
        }

        /* ================= FOOTER ================= */

        .footer {
          color: white;
          background: #111820;
        }

        .footerInner {
          width: calc(100% - 56px);
          max-width: 1180px;
          min-height: 125px;
          margin: auto;
          padding: 33px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }

        .footerBrand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footerBrand > div {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #c94a50;
        }

        .footerBrand > div :global(svg) {
          width: 18px;
        }

        .footerBrand strong,
        .footerBrand span {
          display: block;
        }

        .footerBrand strong {
          font-size: 12px;
        }

        .footerBrand span {
          margin-top: 3px;
          color: #707a87;
          font-size: 5px;
          font-weight: 900;
        }

        .footerLinks {
          display: flex;
          gap: 21px;
        }

        .footerLinks a,
        .footerLinks span {
          color: #87909b;
          font-size: 8px;
          text-decoration: none;
        }

        .copyright {
          color: #5e6874;
          font-size: 7px;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1080px) {
          .heroInner {
            grid-template-columns: 1fr;
            padding: 60px 0 90px;
          }

          .emergencyColumn {
            max-width: 720px;
          }

          .ecosystem {
            margin-top: 20px;
          }

          .videoLayout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .steps {
            grid-template-columns:
              repeat(2, 1fr);
            gap: 28px;
          }

          .stepLine {
            display: none;
          }

          .features {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .rules {
            grid-template-columns: 1fr;
          }

          .accountPanel {
            grid-template-columns:
              auto 1fr;
          }

          .accountPanel > a {
            grid-column: 1 / -1;
            justify-content: center;
          }

          .contactInner,
          .footerInner {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 650px) {
          .header {
            width: calc(100% - 18px);
            min-height: 70px;
          }

          .brandText span,
          .language {
            display: none;
          }

          .adminBtn span {
            display: none;
          }

          .adminBtn,
          .accountBtn,
          .loginBtn {
            min-height: 35px;
            padding: 0 9px;
            font-size: 8px;
          }

          .heroInner,
          .shell {
            width: calc(100% - 28px);
          }

          .hero {
            min-height: unset;
          }

          .heroInner {
            min-height: unset;
            padding: 46px 0 74px;
          }

          .emergencyColumn h1 {
            font-size: 35px;
            letter-spacing: -1.9px;
          }

          .heroLead {
            font-size: 13px;
          }

          .braceletArea {
            min-height: 155px;
          }

          .bracelet {
            width: 410px;
            transform:
              translateX(-24px)
              rotate(-4deg)
              scale(0.82);
            transform-origin: left center;
          }

          .profileGrid {
            grid-template-columns: 1fr;
          }

          .heroActions {
            flex-direction: column;
          }

          .primaryCta,
          .secondaryCta {
            width: 100%;
          }

          .ecosystem {
            width: 350px;
            height: 600px;
          }

          .orbitOuter {
            width: 330px;
            height: 330px;
          }

          .orbitInner {
            width: 260px;
            height: 260px;
          }

          .phone {
            width: 155px;
            height: 320px;
          }

          .phoneStatus {
            margin-top: 23px;
          }

          .productBubble {
            width: 92px;
          }

          .productImage {
            width: 92px;
            height: 74px;
          }

          .productBubble > strong {
            max-width: 105px;
            font-size: 6px;
          }

          .dog {
            left: 12px;
            top: 40px;
          }

          .cat {
            right: 12px;
            top: 40px;
          }

          .keys {
            left: -5px;
            top: 245px;
          }

          .wallet {
            right: -5px;
            top: 245px;
          }

          .luggage {
            left: 18px;
            bottom: 52px;
          }

          .bag {
            right: 18px;
            bottom: 52px;
          }

          .videoSection,
          .stepsSection,
          .featuresSection,
          .rulesSection {
            padding: 68px 0;
          }

          .videoCopy h2,
          .sectionHeading h2 {
            font-size: 31px;
          }

          .videoCard {
            min-height: 270px;
          }

          .steps,
          .features {
            grid-template-columns: 1fr;
          }

          .footerInner {
            width: calc(100% - 28px);
          }

          .footerLinks {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </main>
  );
}

/* =========================================================
   EMERGENCY ITEM
========================================================= */

function EmergencyItem({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="emergencyItem">
      <div className="itemIcon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>

      <style jsx>{`
        .emergencyItem {
          min-height: 66px;
          padding: 11px;
          display: grid;
          grid-template-columns:
            auto 1fr;
          align-items: center;
          gap: 9px;
          border-right:
            1px solid #e7eaed;
          border-bottom:
            1px solid #e7eaed;
        }

        .itemIcon {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #c94a50;
          background: #fff1f1;
        }

        .itemIcon :global(svg) {
          width: 15px;
        }

        strong,
        span {
          display: block;
        }

        strong {
          color: #3d4854;
          font-size: 10px;
        }

        span {
          margin-top: 3px;
          color: #87909a;
          font-size: 8px;
          line-height: 1.35;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   STEP
========================================================= */

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="step">
      <span>{number}</span>

      <div className="stepIcon">
        {icon}
      </div>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .step > span {
          color: #a9b0b8;
          font-size: 8px;
          font-weight: 900;
        }

        .stepIcon {
          width: 48px;
          height: 48px;
          margin-top: 14px;
          display: grid;
          place-items: center;
          border:
            1px solid #dde1e4;
          border-radius: 13px;
          color: #202b37;
          background: white;
        }

        .stepIcon :global(svg) {
          width: 19px;
        }

        .step > strong {
          display: block;
          margin-top: 17px;
          color: #2d3844;
          font-size: 13px;
        }

        .step p {
          margin: 7px 0 0;
          color: #727c87;
          font-size: 10px;
          line-height: 1.6;
        }
      `}</style>
    </article>
  );
}

/* =========================================================
   FEATURE
========================================================= */

function Feature({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature">
      <div className="featureTop">
        <span>{number}</span>

        <div>{icon}</div>
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      <style jsx>{`
        .feature {
          min-height: 190px;
          padding: 21px 19px;
          border-right:
            1px solid
            rgba(
              255,
              255,
              255,
              0.1
            );
        }

        .feature:last-child {
          border-right: 0;
        }

        .featureTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .featureTop > span {
          color: #697481;
          font-size: 7px;
          font-weight: 900;
        }

        .featureTop > div {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          color: #df8c90;
          background:
            rgba(
              255,
              255,
              255,
              0.06
            );
        }

        .featureTop > div :global(svg) {
          width: 15px;
        }

        h3 {
          margin: 31px 0 0;
          color: white;
          font-size: 13px;
        }

        p {
          margin: 8px 0 0;
          color: #98a1ac;
          font-size: 9px;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .feature {
            border-right: 0;
            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.1
              );
          }
        }
      `}</style>
    </article>
  );
}

/* =========================================================
   RULE
========================================================= */

function Rule({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rule">
      <span>{number}</span>

      <strong>{title}</strong>

      <p>{text}</p>

      <style jsx>{`
        .rule {
          min-height: 155px;
          padding: 22px;
          border-right:
            1px solid #e0e3e6;
        }

        .rule:last-child {
          border-right: 0;
        }

        .rule > span {
          color: #c94a50;
          font-size: 8px;
          font-weight: 900;
        }

        .rule strong {
          display: block;
          margin-top: 27px;
          color: #2c3743;
          font-size: 13px;
        }

        .rule p {
          margin: 8px 0 0;
          color: #707a86;
          font-size: 10px;
          line-height: 1.65;
        }

        @media (max-width: 900px) {
          .rule {
            border-right: 0;
            border-bottom:
              1px solid #e0e3e6;
          }
        }
      `}</style>
    </article>
  );
}

/* =========================================================
   KEYS VISUAL
========================================================= */

function KeysScene() {
  return (
    <div className="keysScene">
      <div className="homeKey">
        <span className="keyCircle" />
        <span className="keyStem" />
        <span className="keyTeeth" />
      </div>

      <div className="carKey">
        <span className="carRing" />

        <div className="fob">
          <span />
          <span />
        </div>
      </div>

      <style jsx>{`
        .keysScene {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(
              145deg,
              #ece4d9,
              #f7f3ed
            );
        }

        .homeKey {
          position: absolute;
          left: 17px;
          top: 27px;
          transform: rotate(-19deg);
        }

        .keyCircle {
          width: 29px;
          height: 29px;
          display: block;
          border:
            7px solid #c1a569;
          border-radius: 50%;
        }

        .keyStem {
          width: 52px;
          height: 8px;
          position: absolute;
          left: 24px;
          top: 11px;
          border-radius: 3px;
          background: #c1a569;
        }

        .keyTeeth {
          width: 17px;
          height: 14px;
          position: absolute;
          left: 65px;
          top: 13px;
          border-right:
            6px solid #c1a569;
          border-bottom:
            6px solid #c1a569;
        }

        .carKey {
          position: absolute;
          right: 20px;
          bottom: 11px;
          transform: rotate(12deg);
        }

        .carRing {
          width: 20px;
          height: 20px;
          position: absolute;
          top: -8px;
          left: 8px;
          border:
            4px solid #9ca4ad;
          border-radius: 50%;
        }

        .fob {
          width: 40px;
          height: 55px;
          padding: 12px 9px;
          display: grid;
          gap: 6px;
          position: relative;
          z-index: 2;
          border-radius: 11px;
          background:
            linear-gradient(
              145deg,
              #606a75,
              #2b3138
            );
          box-shadow:
            0 8px 15px
            rgba(
              24,
              30,
              37,
              0.18
            );
        }

        .fob span {
          height: 7px;
          border-radius: 999px;
          background: #9199a2;
        }
      `}</style>
    </div>
  );
}

/* =========================================================
   ICONS
========================================================= */

function QrIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />

      <path d="M14 14h3v3h3v4h-6z" />
      <path d="M12 4v4M12 12v2M11 18h2M18 12h3" />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.8 19 6v5.3c0 4.6-2.4 7.7-7 9.9-4.6-2.2-7-5.3-7-9.9V6z" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8.7 16c.6-1.8 1.7-2.7 3.3-2.7s2.7.9 3.3 2.7" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c.8-4.1 3.3-6.3 7.5-6.3s6.7 2.2 7.5 6.3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M7 3h3l1 4-2 1.5c1.4 3 3.5 5.1 6.5 6.5L17 13l4 1v3c0 2.2-1.8 4-4 4C9.3 21 3 14.7 3 7a4 4 0 0 1 4-4Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 3 2.8 20h18.4z" />
      <path d="M12 9v5M12 17h.01" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 2.5 19 6v5.3c0 4.7-2.4 7.8-7 10.2-4.6-2.4-7-5.5-7-10.2V6z" />
      <path d="m8.8 12 2.1 2.1 4.5-4.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 5.5h16v11H9l-5 4z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function RewardIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M6 9h12v11H6z" />
      <path d="M4 6h16v3H4z" />
      <path d="M12 6v14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M7 12h10" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M9 7 4 12l5 5" />
      <path d="M5 12h9a5 5 0 0 1 5 5v2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m9 6 9 6-9 6z" />
    </svg>
  );
}

/* =========================================================
   QR VISUAL
========================================================= */

function QrCode({
  size = 64,
}: {
  size?: number;
}) {
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
        width: size,
        height: size,
        display: "grid",
        gridTemplateColumns:
          "repeat(7,1fr)",
        gap: Math.max(
          1.6,
          size / 38
        ),
      }}
    >
      {Array.from({
        length: 49,
      }).map((_, index) => (
        <span
          key={index}
          style={{
            display: "block",
            borderRadius: 1,
            background: dark.includes(
              index
            )
              ? "#17212b"
              : "#dfe4e8",
          }}
        />
      ))}
    </div>
  );
}

function MiniQr() {
  const dark = [
    0, 1, 2, 4, 6,
    7, 8, 10, 12,
    14, 15, 17, 18,
    20, 21, 22, 24,
  ];

  return (
    <div
      style={{
        width: 24,
        height: 24,
        display: "grid",
        gridTemplateColumns:
          "repeat(5,1fr)",
        gap: 1.3,
      }}
    >
      {Array.from({
        length: 25,
      }).map((_, index) => (
        <span
          key={index}
          style={{
            display: "block",
            background: dark.includes(
              index
            )
              ? "#17212b"
              : "#dfe4e8",
          }}
        />
      ))}
    </div>
  );
}
