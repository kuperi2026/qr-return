"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

type QRRecord = {
  id: string;
  tag_code: string;
  qr_type: string;
  category: string | null;
  status: string;
  owner_id: string | null;
  item_id: number | null;
  emergency_profile_id: string | null;
};

const categoryInfo: Record<
  string,
  {
    icon: string;
    ka: string;
    en: string;
  }
> = {
  dog: {
    icon: "🐶",
    ka: "ძაღლი",
    en: "Dog",
  },

  cat: {
    icon: "🐱",
    ka: "კატა",
    en: "Cat",
  },

  keys: {
    icon: "🔑",
    ka: "გასაღებები",
    en: "Keys",
  },

  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },

  bag: {
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
  },

  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },

  emergency: {
    icon: "🆘",
    ka: "Emergency",
    en: "Emergency",
  },
};

export default function ScanPage() {
  const params = useParams();
  const router = useRouter();

  const rawTag = params?.tag;

  const tag =
    typeof rawTag === "string"
      ? decodeURIComponent(rawTag)
          .trim()
          .toUpperCase()
      : "";

  const [qr, setQr] =
    useState<QRRecord | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [lang, setLang] =
    useState<"ka" | "en">("ka");

  const ka = lang === "ka";

  useEffect(() => {
    if (!tag) {
      setError("QR კოდი ვერ მოიძებნა.");
      setLoading(false);
      return;
    }

    void checkQR();
  }, [tag]);

  async function checkQR() {
    try {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("qr_inventory")
          .select(
            `
            id,
            tag_code,
            qr_type,
            category,
            status,
            owner_id,
            item_id,
            emergency_profile_id
          `
          )
          .eq("tag_code", tag)
          .maybeSingle();

      if (error) {
        console.error(error);

        setError(
          ka
            ? "QR კოდის შემოწმება ვერ მოხერხდა."
            : "Could not verify this QR code."
        );

        setLoading(false);
        return;
      }

      if (!data) {
        const {
          data: existingProfile,
          error: profileError,
        } = await supabase
          .from("item")
          .select("tag_code")
          .ilike("tag_code", tag)
          .maybeSingle();

        if (profileError) {
          console.error(profileError);
        }

        if (existingProfile) {
          router.replace(
            `/profile/${encodeURIComponent(tag)}`
          );
          return;
        }

        setQr({
          id: `test:${tag}`,
          tag_code: tag,
          qr_type: "test",
          category: null,
          status: "unclaimed",
          owner_id: null,
          item_id: null,
          emergency_profile_id: null,
        });

        setLoading(false);
        return;
      }

      const record = data as QRRecord;

      setQr(record);

      /*
       * უკვე გააქტიურებული QR
       */

      if (
        record.status === "claimed" ||
        record.status === "active"
      ) {
        /*
         * Emergency
         */

        if (
          record.qr_type === "emergency" ||
          record.category === "emergency"
        ) {
          router.replace(
            `/emergency/profile/${encodeURIComponent(
              record.tag_code
            )}`
          );

          return;
        }

        /*
         * ნივთი / ცხოველი
         *
         * შემდეგ ეტაპზე აქ პირდაპირ
         * finder profile-ზე გადავიყვანთ.
         */

        router.replace(
          `/profile/${encodeURIComponent(
            record.tag_code
          )}`
        );

        return;
      }

      setLoading(false);
    } catch (err) {
      console.error(err);

      setError(
        ka
          ? "დაფიქსირდა შეცდომა."
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  async function startActivation() {
    if (!qr) return;

    /*
     * ვამოწმებთ არის თუ არა
     * მომხმარებელი შესული.
     */

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    /*
     * თუ შესული არ არის:
     *
     * Login გვერდზე გადავიყვანთ
     * და QR კოდსაც ვინახავთ URL-ში.
     */

    if (!user) {
      router.push(
        `/login?next=${encodeURIComponent(
          `/activate/${qr.tag_code}`
        )}`
      );

      return;
    }

    /*
     * სატესტო კოდი წინასწარ inventory-ში
     * ჩაწერას არ საჭიროებს.
     */
    if (qr.qr_type === "test") {
      router.push(
        `/register?tag_code=${encodeURIComponent(
          qr.tag_code
        )}&test=1`
      );
      return;
    }

    /*
     * რეალური inventory QR გადადის დაცულ
     * claim/activation flow-ზე.
     */
    router.push(
      `/app/activate/${encodeURIComponent(
        qr.tag_code
      )}`
    );
  }

  if (loading) {
    return (
      <>
        <main className="statePage">
          <div className="logo">
            QR
          </div>

          <h1>QR RETURN</h1>

          <p>
            {ka
              ? "QR კოდი მოწმდება..."
              : "Checking QR code..."}
          </p>

          <div className="loader" />
        </main>

        <Styles />
      </>
    );
  }

  if (error || !qr) {
    return (
      <>
        <main className="statePage">
          <div className="logo">
            QR
          </div>

          <span className="eyebrow">
            QR RETURN
          </span>

          <h1>
            {ka
              ? "QR ვერ მოიძებნა"
              : "QR not found"}
          </h1>

          <p>{error}</p>

          <a
            href="/"
            className="homeButton"
          >
            {ka
              ? "მთავარ გვერდზე დაბრუნება"
              : "Back to home"}
          </a>
        </main>

        <Styles />
      </>
    );
  }

  const category =
    qr.category || "unassigned";

  const info =
    categoryInfo[category];

  return (
    <>
      <main className="page">
        <header className="header">
          <a
            href="/"
            className="brand"
          >
            <div className="logo">
              QR
            </div>

            <div>
              <strong>
                QR RETURN
              </strong>

              <span>
                SMART QR SYSTEM
              </span>
            </div>
          </a>

          <div className="language">
            <button
              className={
                lang === "ka"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("ka")
              }
            >
              GEO
            </button>

            <button
              className={
                lang === "en"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLang("en")
              }
            >
              ENG
            </button>
          </div>
        </header>

        <section className="container">
          <div className="activationCard">
            <div className="status">
              <span className="dot" />

              {ka
                ? "QR მზად არის გასააქტიურებლად"
                : "QR ready for activation"}
            </div>

            <div className="categoryIcon">
              {info?.icon || "QR"}
            </div>

            <span className="found">
              QR RETURN
            </span>

            <h1>
              {ka
                ? "გააქტიურეთ თქვენი QR"
                : "Activate your QR"}
            </h1>

            <p className="intro">
              {ka
                ? "ეს QR კოდი ჯერ არ არის მიბმული მომხმარებლის პროფილზე."
                : "This QR code has not yet been linked to a user profile."}
            </p>

            <div className="qrInformation">
              <div>
                <span>
                  {ka
                    ? "QR კოდი"
                    : "QR CODE"}
                </span>

                <strong>
                  {qr.tag_code}
                </strong>
              </div>

              <div>
                <span>
                  {ka
                    ? "პროდუქტი"
                    : "PRODUCT"}
                </span>

                <strong>
                  {info
                    ? ka
                      ? info.ka
                      : info.en
                    : ka
                    ? "ჯერ არ არის მინიჭებული"
                    : "Not assigned"}
                </strong>
              </div>
            </div>

            {category !==
              "unassigned" && (
              <div className="lockedCategory">
                <div className="lockIcon">
                  ✓
                </div>

                <div>
                  <strong>
                    {ka
                      ? "პროდუქტის ტიპი უკვე განსაზღვრულია"
                      : "Product type is already assigned"}
                  </strong>

                  <p>
                    {ka
                      ? `ეს QR განკუთვნილია კატეგორიისთვის: ${
                          info?.ka ||
                          category
                        }.`
                      : `This QR is assigned to: ${
                          info?.en ||
                          category
                        }.`}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={
                startActivation
              }
              className="activateButton"
            >
              {ka
                ? "QR-ის გააქტიურება"
                : "Activate QR"}

              <span>→</span>
            </button>

            <p className="accountNote">
              {ka
                ? "გასააქტიურებლად საჭიროა QR RETURN ანგარიშში შესვლა ან რეგისტრაცია."
                : "Sign in or create a QR RETURN account to activate this QR."}
            </p>
          </div>

          <div className="security">
            <strong>
              QR RETURN
            </strong>

            <p>
              {ka
                ? "თითოეული QR კოდი უნიკალურია და შესაძლებელია მხოლოდ ერთხელ გააქტიურება."
                : "Each QR code is unique and can only be activated once."}
            </p>
          </div>
        </section>
      </main>

      <Styles />
    </>
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
        font-family:
          Arial,
          Helvetica,
          sans-serif;

        background: #f4f7fb;
        color: #1c3048;
      }

      button,
      a {
        font-family: inherit;
      }

      a {
        text-decoration: none;
      }

      .page {
        min-height: 100vh;
      }

      .header {
        height: 68px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 0 24px;

        background: #ffffff;

        border-bottom:
          1px solid #e2e8f0;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .logo {
        width: 40px;
        height: 40px;

        display: grid;
        place-items: center;

        border-radius: 10px;

        background: #1266e9;
        color: white;

        font-size: 12px;
        font-weight: 900;
      }

      .brand strong,
      .brand span {
        display: block;
      }

      .brand strong {
        color: #19324d;

        font-size: 16px;
        font-weight: 900;
      }

      .brand span {
        margin-top: 2px;

        color: #8492a2;

        font-size: 10px;
        font-weight: 800;

        letter-spacing: 0.8px;
      }

      .language {
        display: flex;

        padding: 3px;

        border-radius: 9px;

        background: #eef3f8;
      }

      .language button {
        padding: 7px 10px;

        border: 0;
        border-radius: 7px;

        background: transparent;
        color: #68798b;

        font-size: 11px;
        font-weight: 900;

        cursor: pointer;
      }

      .language button.active {
        background: #1266e9;
        color: white;
      }

      .container {
        width: calc(100% - 24px);
        max-width: 560px;

        margin: 0 auto;

        padding: 34px 0 50px;
      }

      .activationCard {
        padding: 28px;

        border:
          1px solid #dde5ee;

        border-radius: 20px;

        background: white;

        text-align: center;

        box-shadow:
          0 18px 55px
          rgba(
            25,
            49,
            76,
            0.07
          );
      }

      .status {
        width: fit-content;

        display: flex;
        align-items: center;
        gap: 7px;

        margin: 0 auto;

        padding: 7px 11px;

        border-radius: 30px;

        background: #edf7f1;

        color: #29784b;

        font-size: 12px;
        font-weight: 800;
      }

      .dot {
        width: 7px;
        height: 7px;

        border-radius: 50%;

        background: #36a765;
      }

      .categoryIcon {
        width: 74px;
        height: 74px;

        display: grid;
        place-items: center;

        margin:
          22px auto 15px;

        border-radius: 18px;

        background: #edf5ff;

        font-size: 35px;
      }

      .found {
        color: #1266e9;

        font-size: 11px;
        font-weight: 900;

        letter-spacing: 1px;
      }

      .activationCard h1 {
        margin: 7px 0 0;

        color: #1c314a;

        font-size: 27px;
        line-height: 1.2;
      }

      .intro {
        max-width: 410px;

        margin:
          10px auto 0;

        color: #66788b;

        font-size: 14px;
        line-height: 1.6;
      }

      .qrInformation {
        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );

        gap: 9px;

        margin-top: 23px;
      }

      .qrInformation > div {
        padding: 14px;

        border:
          1px solid #e2e8ef;

        border-radius: 11px;

        background: #f9fbfd;

        text-align: left;
      }

      .qrInformation span {
        display: block;

        color: #8492a2;

        font-size: 11px;
        font-weight: 800;

        letter-spacing: 0.5px;
      }

      .qrInformation strong {
        display: block;

        margin-top: 6px;

        color: #243a53;

        font-size: 15px;
      }

      .lockedCategory {
        display: flex;
        align-items: flex-start;
        gap: 11px;

        margin-top: 13px;

        padding: 13px 14px;

        border:
          1px solid #d9e8fb;

        border-radius: 11px;

        background: #f2f7fe;

        text-align: left;
      }

      .lockIcon {
        width: 28px;
        height: 28px;

        display: grid;
        place-items: center;

        flex: 0 0 28px;

        border-radius: 8px;

        background: #1266e9;
        color: white;

        font-size: 13px;
        font-weight: 900;
      }

      .lockedCategory strong {
        color: #28415d;

        font-size: 13px;
      }

      .lockedCategory p {
        margin: 4px 0 0;

        color: #687b8f;

        font-size: 12px;
        line-height: 1.45;
      }

      .activateButton {
        width: 100%;
        min-height: 50px;

        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        margin-top: 18px;

        border: 0;
        border-radius: 11px;

        background: #1266e9;
        color: white;

        font-size: 15px;
        font-weight: 900;

        cursor: pointer;
      }

      .activateButton span {
        font-size: 20px;
      }

      .accountNote {
        margin:
          11px 0 0;

        color: #7d8c9c;

        font-size: 12px;
        line-height: 1.5;
      }

      .security {
        padding: 19px;

        text-align: center;
      }

      .security strong {
        color: #1266e9;

        font-size: 11px;
        font-weight: 900;

        letter-spacing: 1px;
      }

      .security p {
        max-width: 400px;

        margin:
          5px auto 0;

        color: #8492a2;

        font-size: 12px;
        line-height: 1.5;
      }

      .statePage {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 25px;

        background: #f4f7fb;

        text-align: center;
      }

      .statePage .logo {
        margin-bottom: 15px;
      }

      .eyebrow {
        color: #1266e9;

        font-size: 11px;
        font-weight: 900;

        letter-spacing: 1px;
      }

      .statePage h1 {
        margin: 7px 0 0;

        color: #1c314a;

        font-size: 25px;
      }

      .statePage p {
        max-width: 420px;

        color: #697a8c;

        font-size: 14px;
        line-height: 1.55;
      }

      .homeButton {
        margin-top: 10px;

        padding: 11px 16px;

        border-radius: 9px;

        background: #1266e9;
        color: white;

        font-size: 13px;
        font-weight: 800;
      }

      .loader {
        width: 25px;
        height: 25px;

        margin-top: 15px;

        border:
          3px solid #dbe7f6;

        border-top-color:
          #1266e9;

        border-radius: 50%;

        animation:
          spin 0.8s linear
          infinite;
      }

      @keyframes spin {
        to {
          transform:
            rotate(360deg);
        }
      }

      @media (
        max-width: 560px
      ) {
        .header {
          height: 62px;

          padding: 0 14px;
        }

        .logo {
          width: 37px;
          height: 37px;
        }

        .brand strong {
          font-size: 14px;
        }

        .brand span {
          font-size: 9px;
        }

        .container {
          width:
            calc(100% - 16px);

          padding-top: 15px;
        }

        .activationCard {
          padding:
            22px 16px;

          border-radius: 16px;
        }

        .categoryIcon {
          width: 65px;
          height: 65px;

          margin-top: 18px;

          font-size: 30px;
        }

        .activationCard h1 {
          font-size: 23px;
        }

        .intro {
          font-size: 13px;
        }

        .qrInformation {
          grid-template-columns:
            1fr;
        }

        .qrInformation > div {
          padding: 13px;
        }

        .activateButton {
          font-size: 14px;
        }
      }
    `}</style>
  );
}
