"use client";

import {
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Lang = "ka" | "en";

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();

  const [lang, setLang] =
    useState<Lang>("ka");

  const ka = lang === "ka";

  const orderId =
    searchParams.get("order");

  return (
    <main className="page">
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="logo">
            QR
          </span>

          <span>
            <strong>
              QR RETURN
            </strong>

            <small>
              ORDER CONFIRMATION
            </small>
          </span>
        </Link>

        <div className="langs">
          <button
            type="button"
            className={
              ka ? "active" : ""
            }
            onClick={() =>
              setLang("ka")
            }
          >
            GEO
          </button>

          <button
            type="button"
            className={
              !ka ? "active" : ""
            }
            onClick={() =>
              setLang("en")
            }
          >
            ENG
          </button>
        </div>
      </header>

      <div className="shell">
        <section className="successCard">
          <div className="successIcon">
            <span>✓</span>
          </div>

          <span className="eyebrow">
            QR RETURN
          </span>

          <h1>
            {ka
              ? "შეკვეთა მიღებულია!"
              : "Order received!"}
          </h1>

          <p className="intro">
            {ka
              ? "თქვენი შეკვეთა წარმატებით შეიქმნა. მისი სტატუსის ნახვა ნებისმიერ დროს შეგიძლიათ თქვენს QR RETURN ანგარიშში."
              : "Your order was created successfully. You can check its status anytime from your QR RETURN account."}
          </p>

          {orderId ? (
            <div className="orderBox">
              <span>
                {ka
                  ? "შეკვეთის ნომერი"
                  : "ORDER NUMBER"}
              </span>

              <strong>
                #{orderId}
              </strong>
            </div>
          ) : (
            <div className="orderBox">
              <span>
                {ka
                  ? "შეკვეთის სტატუსი"
                  : "ORDER STATUS"}
              </span>

              <strong>
                {ka
                  ? "მიღებულია"
                  : "Received"}
              </strong>
            </div>
          )}

          <div className="status">
            <div className="statusIcon">
              01
            </div>

            <div>
              <span>
                {ka
                  ? "მიმდინარე სტატუსი"
                  : "CURRENT STATUS"}
              </span>

              <strong>
                {ka
                  ? "მოლოდინში"
                  : "Pending"}
              </strong>

              <p>
                {ka
                  ? "თქვენი შეკვეთა მიღებულია და დამუშავებას ელოდება."
                  : "Your order has been received and is waiting to be processed."}
              </p>
            </div>
          </div>

          <div className="actions">
            <Link
              href="/account/orders"
              className="primary"
            >
              <span>
                {ka
                  ? "ჩემი შეკვეთები"
                  : "My Orders"}
              </span>

              <span>→</span>
            </Link>

            <Link
              href="/my-profiles"
              className="secondary"
            >
              {ka
                ? "ჩემი პროფილები"
                : "My Profiles"}
            </Link>
          </div>

          <div className="divider" />

          <div className="next">
            <span className="nextLabel">
              {ka
                ? "რა ხდება შემდეგ?"
                : "WHAT HAPPENS NEXT?"}
            </span>

            <div className="steps">
              <Step
                number="01"
                title={
                  ka
                    ? "შეკვეთა მიღებულია"
                    : "Order Received"
                }
                text={
                  ka
                    ? "თქვენი შეკვეთა უკვე QR RETURN სისტემაშია."
                    : "Your order is now in the QR RETURN system."
                }
              />

              <Step
                number="02"
                title={
                  ka
                    ? "დამუშავება"
                    : "Processing"
                }
                text={
                  ka
                    ? "შეკვეთას მოვამზადებთ გასაგზავნად."
                    : "Your order will be prepared for shipping."
                }
              />

              <Step
                number="03"
                title={
                  ka
                    ? "გაგზავნა"
                    : "Shipping"
                }
                text={
                  ka
                    ? "გაგზავნის შემდეგ Tracking Number გამოჩნდება თქვენს ანგარიშში."
                    : "Once shipped, the tracking number will appear in your account."
                }
              />
            </div>
          </div>

          <div className="help">
            <span>?</span>

            <div>
              <strong>
                {ka
                  ? "გჭირდებათ დახმარება?"
                  : "Need help?"}
              </strong>

              <p>
                {ka
                  ? "შეკვეთასთან დაკავშირებული ინფორმაცია შეგიძლიათ ნახოთ My Orders გვერდზე."
                  : "You can find your order information on the My Orders page."}
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          color: #202b37;

          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(
                20,
                101,
                232,
                0.08
              ),
              transparent 35%
            ),
            #f5f7f8;
        }

        .topbar {
          width:
            calc(
              100% - 36px
            );

          max-width: 1000px;

          min-height: 72px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;

          border-bottom:
            1px solid #e0e5e8;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 9px;

          text-decoration: none;
        }

        .logo {
          width: 43px;
          height: 43px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          font-size: 11px;

          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;

          font-size: 13px;
        }

        .brand small {
          margin-top: 2px;

          color: #7655f7;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .langs {
          padding: 3px;

          display: flex;

          gap: 2px;

          border-radius: 8px;

          background: #e9edf0;
        }

        .langs button {
          min-width: 36px;
          min-height: 28px;

          border: 0;

          border-radius: 6px;

          color: #7d8791;

          background: transparent;

          cursor: pointer;

          font-size: 7px;

          font-weight: 900;
        }

        .langs button.active {
          color: #1465e8;

          background: white;
        }

        .shell {
          width:
            calc(
              100% - 30px
            );

          max-width: 720px;

          margin: auto;

          padding:
            65px 0 100px;
        }

        .successCard {
          padding: 45px;

          border:
            1px solid #dfe4e8;

          border-radius: 22px;

          background: white;

          box-shadow:
            0 25px 70px
            rgba(
              16,
              24,
              40,
              0.08
            );

          text-align: center;
        }

        .successIcon {
          width: 74px;
          height: 74px;

          margin:
            0 auto 22px;

          display: grid;
          place-items: center;

          border-radius: 999px;

          background: #ecfdf3;
        }

        .successIcon span {
          width: 48px;
          height: 48px;

          display: grid;
          place-items: center;

          border-radius: 999px;

          color: white;

          background: #12a86b;

          font-size: 24px;

          font-weight: 900;
        }

        .eyebrow {
          color: #7655f7;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1.3px;
        }

        h1 {
          margin: 8px 0 0;

          color: #202b37;

          font-size:
            clamp(
              35px,
              6vw,
              48px
            );

          letter-spacing: -2px;
        }

        .intro {
          max-width: 520px;

          margin:
            13px auto 0;

          color: #7c8791;

          font-size: 9px;

          line-height: 1.7;
        }

        .orderBox {
          max-width: 330px;

          margin:
            25px auto 0;

          padding: 15px;

          border:
            1px solid #dce3e8;

          border-radius: 12px;

          background: #f8fafb;
        }

        .orderBox span,
        .orderBox strong {
          display: block;
        }

        .orderBox span {
          color: #8a949d;

          font-size: 6px;

          font-weight: 900;

          letter-spacing: 0.8px;
        }

        .orderBox strong {
          margin-top: 7px;

          color: #202b37;

          font-size: 14px;

          overflow-wrap: anywhere;
        }

        .status {
          margin-top: 24px;

          padding: 15px;

          display: grid;

          grid-template-columns:
            42px
            minmax(0, 1fr);

          gap: 12px;

          border:
            1px solid #dfe4e8;

          border-radius: 12px;

          background: #fafbfc;

          text-align: left;
        }

        .statusIcon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1465e8;

          background: #eaf2ff;

          font-size: 8px;

          font-weight: 900;
        }

        .status span {
          color: #929ca5;

          font-size: 6px;

          font-weight: 900;
        }

        .status strong {
          display: block;

          margin-top: 3px;

          color: #9a6700;

          font-size: 10px;
        }

        .status p {
          margin: 4px 0 0;

          color: #87919a;

          font-size: 7px;

          line-height: 1.5;
        }

        .actions {
          margin-top: 23px;

          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 8px;
        }

        .actions :global(a) {
          min-height: 46px;

          padding: 0 13px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 10px;

          text-decoration: none;

          font-size: 8px;

          font-weight: 900;
        }

        .actions
          :global(.primary) {
          justify-content: space-between;

          color: white;

          background: #1465e8;
        }

        .actions
          :global(.secondary) {
          color: #4f5b66;

          border:
            1px solid #dce2e6;

          background: white;
        }

        .divider {
          margin: 34px 0;

          border-top:
            1px solid #e8ecef;
        }

        .nextLabel {
          color: #7655f7;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        .steps {
          margin-top: 16px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 9px;
        }

        .help {
          margin-top: 25px;

          padding: 14px;

          display: flex;

          align-items: center;

          gap: 10px;

          border:
            1px solid #e1e5e8;

          border-radius: 11px;

          background: #f8fafb;

          text-align: left;
        }

        .help > span {
          width: 34px;
          height: 34px;

          flex:
            0 0 34px;

          display: grid;
          place-items: center;

          border-radius: 999px;

          color: #7655f7;

          background: #f0edff;

          font-size: 12px;

          font-weight: 900;
        }

        .help strong {
          color: #45515c;

          font-size: 8px;
        }

        .help p {
          margin: 3px 0 0;

          color: #89939c;

          font-size: 7px;

          line-height: 1.5;
        }

        @media (
          max-width: 600px
        ) {
          .shell {
            padding-top: 35px;
          }

          .successCard {
            padding: 30px 18px;
          }

          .actions {
            grid-template-columns:
              1fr;
          }

          .steps {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </main>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className="step">
      <span>{number}</span>

      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>

      <style jsx>{`
        .step {
          min-height: 130px;

          padding: 14px;

          border:
            1px solid #e1e5e8;

          border-radius: 11px;

          background: #fafbfc;

          text-align: left;
        }

        span {
          color: #1465e8;

          font-size: 7px;

          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 18px;

          color: #45515c;

          font-size: 8px;
        }

        p {
          margin: 6px 0 0;

          color: #8a949d;

          font-size: 7px;

          line-height: 1.55;
        }
      `}</style>
    </article>
  );
}

function SuccessLoading() {
  return (
    <main className="loading">
      <div>
        QR
      </div>

      <strong>
        QR RETURN
      </strong>

      <span>
        Loading...
      </span>

      <style jsx>{`
        .loading {
          min-height: 100vh;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 8px;

          color: #7d8791;

          background: #f5f7f8;
        }

        .loading div {
          width: 52px;
          height: 52px;

          display: grid;
          place-items: center;

          border-radius: 14px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          font-weight: 900;
        }

        .loading strong {
          color: #202b37;
        }

        .loading span {
          font-size: 8px;
        }
      `}</style>
    </main>
  );
}
