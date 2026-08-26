"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type QRInventory = {
  id: string;
  tag_code: string;
  qr_type: "unassigned" | "item" | "pet" | "emergency";
  category:
    | "dog"
    | "cat"
    | "keys"
    | "wallet"
    | "bag"
    | "suitcase"
    | "emergency"
    | null;
  status: string;
  owner_id: string | null;
};

export default function ActivateQRPage() {
  const params = useParams<{ tag_code: string }>();
  const router = useRouter();

  const rawTag = params?.tag_code || "";

  const tagCode = decodeURIComponent(rawTag)
    .trim()
    .toUpperCase();

  const [qr, setQr] = useState<QRInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQR() {
      if (!tagCode) {
        setError("QR კოდი ვერ მოიძებნა.");
        setLoading(false);
        return;
      }

      const { data, error: qrError } = await supabase
        .from("qr_inventory")
        .select(
          "id, tag_code, qr_type, category, status, owner_id"
        )
        .eq("tag_code", tagCode)
        .maybeSingle();

      if (qrError) {
        console.error(qrError);
        setError("QR კოდის შემოწმება ვერ მოხერხდა.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError(
          "ეს QR კოდი QR RETURN-ის სისტემაში არ არსებობს."
        );
        setLoading(false);
        return;
      }

      setQr(data as QRInventory);
      setLoading(false);
    }

    void loadQR();
  }, [tagCode]);

  async function activateQR() {
    if (!qr) return;

    setActivating(true);
    setError("");

    /*
     * 1. ვამოწმებთ, შესულია თუ არა მომხმარებელი.
     */
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(userError);
    }

    /*
     * თუ მომხმარებელი არ არის შესული,
     * Login-ზე გადავიყვანთ და activation URL-ს
     * next პარამეტრად შევინახავთ.
     */
    if (!user) {
      const returnUrl =
        `/activate/${encodeURIComponent(tagCode)}`;

      router.push(
        `/login?next=${encodeURIComponent(returnUrl)}`
      );

      return;
    }

    /*
     * 2. თუ QR უკვე გააქტიურებულია,
     * მეორე მომხმარებელი ვეღარ მიითვისებს.
     */
    if (
      qr.status !== "unclaimed" ||
      qr.owner_id
    ) {
      setError(
        "ეს QR კოდი უკვე გააქტიურებულია."
      );

      setActivating(false);
      return;
    }

    /*
     * 3. QR-ს ვაბამთ მიმდინარე მომხმარებელზე.
     *
     * სტატუსს დროებით claimed ვხდით.
     * პროფილის შევსება შემდეგ ეტაპზე დასრულდება.
     */
    const { data: claimedQR, error: claimError } =
      await supabase
        .from("qr_inventory")
        .update({
          owner_id: user.id,
          status: "claimed",
          claimed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", qr.id)
        .eq("status", "unclaimed")
        .is("owner_id", null)
        .select(
          "id, tag_code, qr_type, category, status, owner_id"
        )
        .maybeSingle();

    if (claimError) {
      console.error(claimError);

      setError(
        "QR კოდის გააქტიურება ვერ მოხერხდა."
      );

      setActivating(false);
      return;
    }

    /*
     * ეს განსაკუთრებით მნიშვნელოვანია:
     * ერთდროულად ორმა ადამიანმა რომ სცადოს
     * ერთი QR-ის გააქტიურება, მხოლოდ ერთმა
     * უნდა შეძლოს.
     */
    if (!claimedQR) {
      setError(
        "ეს QR კოდი უკვე გააქტიურებულია ან აღარ არის ხელმისაწვდომი."
      );

      setActivating(false);
      return;
    }

    /*
     * 4. კატეგორიის მიხედვით მომხმარებელი
     * შესაბამის რეგისტრაციის გვერდზე მიდის.
     */

    const nextUrl = getRegistrationUrl(
      claimedQR.category,
      claimedQR.tag_code
    );

    router.push(nextUrl);
  }

  if (loading) {
    return (
      <>
        <main className="center">
          <div className="logo">QR</div>

          <h1>QR RETURN</h1>

          <p>QR კოდი მოწმდება...</p>
        </main>

        <Styles />
      </>
    );
  }

  if (error && !qr) {
    return (
      <>
        <main className="center">
          <div className="logo">QR</div>

          <h1>QR ვერ მოიძებნა</h1>

          <p>{error}</p>

          <a href="/">QR RETURN</a>
        </main>

        <Styles />
      </>
    );
  }

  if (!qr) return null;

  const alreadyClaimed =
    qr.status !== "unclaimed" ||
    Boolean(qr.owner_id);

  return (
    <>
      <main className="page">
        <header>
          <a href="/" className="brand">
            <div className="logo">QR</div>

            <div>
              <strong>QR RETURN</strong>
              <small>QR ACTIVATION</small>
            </div>
          </a>
        </header>

        <section className="wrapper">
          <div className="card">
            <div className="icon">
              {getCategoryIcon(qr.category)}
            </div>

            <span className="eyebrow">
              QR ACTIVATION
            </span>

            <h1>
              {alreadyClaimed
                ? "QR უკვე გააქტიურებულია"
                : "გაააქტიურეთ თქვენი QR"}
            </h1>

            {!alreadyClaimed ? (
              <p className="description">
                ეს QR RETURN-ის ნამდვილი,
                რეგისტრაციისთვის მზად QR კოდია.
                გააქტიურების შემდეგ იგი თქვენს
                ანგარიშსა და პროფილს მიებმება.
              </p>
            ) : (
              <p className="description">
                ეს QR კოდი უკვე დაკავშირებულია
                QR RETURN-ის ანგარიშთან.
              </p>
            )}

            <div className="details">
              <div>
                <span>QR კოდი</span>
                <strong>{qr.tag_code}</strong>
              </div>

              <div>
                <span>კატეგორია</span>

                <strong>
                  {getCategoryName(qr.category)}
                </strong>
              </div>

              <div>
                <span>სტატუსი</span>

                <strong
                  className={
                    alreadyClaimed
                      ? "claimed"
                      : "available"
                  }
                >
                  {alreadyClaimed
                    ? "გააქტიურებულია"
                    : "გასააქტიურებელია"}
                </strong>
              </div>
            </div>

            {error && (
              <div className="error">
                {error}
              </div>
            )}

            {!alreadyClaimed && (
              <>
                <button
                  type="button"
                  onClick={activateQR}
                  disabled={activating}
                  className="activate"
                >
                  {activating
                    ? "აქტივაცია მიმდინარეობს..."
                    : "QR-ის გააქტიურება"}
                </button>

                <p className="note">
                  გასააქტიურებლად საჭიროა
                  QR RETURN-ის ანგარიში.
                </p>
              </>
            )}

            {alreadyClaimed && (
              <a
                href={`/scan/${encodeURIComponent(
                  qr.tag_code
                )}`}
                className="openProfile"
              >
                პროფილის გახსნა
              </a>
            )}
          </div>

          <p className="footer">
            QR RETURN • Never lose what matters.
          </p>
        </section>
      </main>

      <Styles />
    </>
  );
}

function getRegistrationUrl(
  category: QRInventory["category"],
  tagCode: string
) {
  const tag =
    encodeURIComponent(tagCode);

  /*
   * Emergency-ს უკვე თავისი
   * რეგისტრაციის route აქვს.
   */
  if (category === "emergency") {
    return `/register/emergency?tag_code=${tag}`;
  }

  /*
   * შემდეგ ეტაპზე ამ route-ს შენს
   * არსებულ pet/item registration flow-ს
   * ზუსტად მივაბამთ.
   */
  return `/register?tag_code=${tag}&category=${encodeURIComponent(
    category || ""
  )}`;
}

function getCategoryName(
  category: QRInventory["category"]
) {
  switch (category) {
    case "dog":
      return "ძაღლი";

    case "cat":
      return "კატა";

    case "keys":
      return "გასაღებები";

    case "wallet":
      return "საფულე";

    case "bag":
      return "ჩანთა";

    case "suitcase":
      return "ჩემოდანი";

    case "emergency":
      return "Emergency";

    default:
      return "QR RETURN";
  }
}

function getCategoryIcon(
  category: QRInventory["category"]
) {
  switch (category) {
    case "dog":
      return "🐶";

    case "cat":
      return "🐱";

    case "keys":
      return "🔑";

    case "wallet":
      return "👛";

    case "bag":
      return "👜";

    case "suitcase":
      return "🧳";

    case "emergency":
      return "🆘";

    default:
      return "QR";
  }
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
        color: #1d3149;
      }

      a {
        text-decoration: none;
      }

      .page {
        min-height: 100vh;
      }

      header {
        height: 68px;

        display: flex;
        align-items: center;

        padding: 0 24px;

        background: #ffffff;
        border-bottom: 1px solid #e1e8f0;
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
        color: #ffffff;

        font-size: 12px;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1d3149;

        font-size: 16px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 2px;

        color: #77889a;

        font-size: 11px;
        font-weight: 800;

        letter-spacing: 0.8px;
      }

      .wrapper {
        width: calc(100% - 24px);
        max-width: 520px;

        margin: 0 auto;

        padding: 45px 0;
      }

      .card {
        padding: 30px;

        border: 1px solid #dfe7f0;
        border-radius: 20px;

        background: #ffffff;

        box-shadow:
          0 18px 55px
          rgba(28, 54, 84, 0.07);

        text-align: center;
      }

      .icon {
        width: 72px;
        height: 72px;

        display: grid;
        place-items: center;

        margin: 0 auto 17px;

        border-radius: 18px;

        background: #edf5ff;

        font-size: 34px;
      }

      .eyebrow {
        color: #1266e9;

        font-size: 12px;
        font-weight: 900;

        letter-spacing: 1px;
      }

      .card h1 {
        margin: 8px 0 0;

        color: #1c3048;

        font-size: 25px;
        line-height: 1.2;
      }

      .description {
        max-width: 410px;

        margin: 12px auto 0;

        color: #64768a;

        font-size: 14px;
        line-height: 1.6;
      }

      .details {
        margin-top: 24px;

        overflow: hidden;

        border: 1px solid #e1e8f0;
        border-radius: 13px;

        text-align: left;
      }

      .details > div {
        min-height: 55px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        gap: 15px;

        padding: 11px 14px;

        border-bottom: 1px solid #e9eef4;
      }

      .details > div:last-child {
        border-bottom: 0;
      }

      .details span {
        color: #718296;

        font-size: 13px;
        font-weight: 700;
      }

      .details strong {
        color: #263c55;

        font-size: 14px;
      }

      .details .available {
        color: #1266e9;
      }

      .details .claimed {
        color: #526477;
      }

      .activate,
      .openProfile {
        width: 100%;
        min-height: 50px;

        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: 20px;

        border: 0;
        border-radius: 11px;

        background: #1266e9;
        color: #ffffff;

        font-family: inherit;
        font-size: 15px;
        font-weight: 900;

        cursor: pointer;
      }

      .activate:disabled {
        opacity: 0.65;
        cursor: wait;
      }

      .note {
        margin: 11px 0 0;

        color: #8795a4;

        font-size: 12px;
      }

      .error {
        margin-top: 16px;
        padding: 12px;

        border-radius: 10px;

        background: #fff3f3;
        color: #a33c3c;

        font-size: 13px;
        line-height: 1.5;
      }

      .footer {
        margin: 17px 0 0;

        color: #8795a4;

        font-size: 12px;
        font-weight: 700;

        text-align: center;
      }

      .center {
        min-height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 25px;

        background: #f4f7fb;

        text-align: center;
      }

      .center .logo {
        margin-bottom: 14px;
      }

      .center h1 {
        margin: 0;

        color: #1d3149;

        font-size: 25px;
      }

      .center p {
        max-width: 420px;

        color: #6e7f92;

        font-size: 14px;
        line-height: 1.55;
      }

      .center a {
        margin-top: 8px;

        color: #1266e9;

        font-size: 14px;
        font-weight: 800;
      }

      @media (max-width: 560px) {
        header {
          height: 62px;
          padding: 0 14px;
        }

        .wrapper {
          padding: 20px 0 35px;
        }

        .card {
          padding: 22px 17px;

          border-radius: 16px;
        }

        .icon {
          width: 62px;
          height: 62px;

          font-size: 29px;
        }

        .card h1 {
          font-size: 22px;
        }

        .description {
          font-size: 14px;
        }

        .details > div {
          min-height: 52px;
        }

        .details span,
        .details strong {
          font-size: 13px;
        }

        .activate,
        .openProfile {
          min-height: 48px;

          font-size: 14px;
        }
      }
    `}</style>
  );
}
