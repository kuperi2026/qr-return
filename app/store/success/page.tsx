"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  order_number: string | null;

  status: string | null;
  payment_status: string | null;
  payment_provider: string | null;

  product_name: string | null;
  product_sku: string | null;

  quantity: number | null;

  subtotal: number | null;
  total: number | null;

  payment_amount: number | null;
  payment_currency: string | null;

  shipping_name: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;

  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;

  paid_at: string | null;
  created_at: string | null;
};

function SuccessContent() {
  const searchParams = useSearchParams();

  const [lang, setLang] =
    useState<"ka" | "en">("ka");

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const ka = lang === "ka";

  const orderId =
    searchParams.get("order");

  const provider =
    searchParams.get("provider");

  const stripeSession =
    searchParams.get("session_id");

  useEffect(() => {
    if (!orderId) {
      setError(
        "Order ID is missing."
      );

      setLoading(false);

      return;
    }

    void loadOrder();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  async function loadOrder() {
    try {
      setLoading(true);
      setError("");

      /*
       * =====================================
       * AUTH
       * =====================================
       */

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        throw new Error(
          ka
            ? "შეკვეთის სანახავად ანგარიშში უნდა შეხვიდეთ."
            : "You must be signed in to view this order."
        );
      }

      /*
       * =====================================
       * LOAD ORDER
       * =====================================
       *
       * user_id check means another user
       * cannot simply change ?order=...
       * and see somebody else's order.
       */

      const {
        data,
        error: orderError,
      } =
        await supabase
          .from("orders")
          .select(`
            id,
            order_number,
            status,
            payment_status,
            payment_provider,
            product_name,
            product_sku,
            quantity,
            subtotal,
            total,
            payment_amount,
            payment_currency,
            shipping_name,
            shipping_email,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_zip,
            shipping_country,
            paid_at,
            created_at
          `)
          .eq("id", orderId)
          .eq("user_id", user.id)
          .maybeSingle();

      if (orderError) {
        throw orderError;
      }

      if (!data) {
        throw new Error(
          ka
            ? "შეკვეთა ვერ მოიძებნა."
            : "Order not found."
        );
      }

      setOrder(data as Order);
    } catch (err) {
      console.error(
        "Success page order error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შეკვეთის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load order."
      );
    } finally {
      setLoading(false);
    }
  }

  function money(
    value: number | null,
    currency?: string | null
  ) {
    const amount =
      Number(value || 0);

    try {
      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",

          currency:
            currency ||
            "USD",
        }
      ).format(amount);
    } catch {
      return `${amount.toFixed(
        2
      )} ${currency || "USD"}`;
    }
  }

  function providerName(
    value?: string | null
  ) {
    switch (
      (
        value ||
        provider ||
        ""
      ).toLowerCase()
    ) {
      case "stripe":
        return "Card / Stripe";

      case "tbc":
        return "TBC Bank";

      case "bog":
        return "Bank of Georgia";

      default:
        return ka
          ? "ონლაინ გადახდა"
          : "Online payment";
    }
  }

  function formatDate(
    value?: string | null
  ) {
    if (!value) {
      return "—";
    }

    try {
      return new Intl.DateTimeFormat(
        ka ? "ka-GE" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(
        new Date(value)
      );
    } catch {
      return value;
    }
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="qr">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <p>
          {ka
            ? "შეკვეთის სტატუსი მოწმდება..."
            : "Checking your order..."}
        </p>

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            background: #f5f7f8;
            color: #7b8791;
          }

          .qr {
            width: 58px;
            height: 58px;

            display: grid;
            place-items: center;

            border-radius: 16px;

            color: white;

            background: linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

            font-weight: 900;
          }

          strong {
            margin-top: 10px;

            color: #27333e;
          }

          p {
            font-size: 10px;
          }
        `}</style>
      </main>
    );
  }

  const paid =
    order?.payment_status
      ?.toLowerCase() ===
    "paid";

  const failed =
    order?.payment_status
      ?.toLowerCase() ===
    "failed";

  return (
    <main className="page">
      <header>
        <Link
          href="/"
          className="brand"
        >
          <span className="logo">
            QR
          </span>

          <span>
            <strong>
              QR RETURN
            </strong>

            <small>
              SECURE RETURN
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

      <div className="container">
        {error ? (
          <section className="messageCard errorCard">
            <div className="statusIcon errorIcon">
              !
            </div>

            <span className="eyebrow">
              QR RETURN
            </span>

            <h1>
              {ka
                ? "შეკვეთის ჩვენება ვერ მოხერხდა"
                : "Could Not Load Order"}
            </h1>

            <p>{error}</p>

            <Link
              href="/store"
              className="primary"
            >
              {ka
                ? "მაღაზიაში დაბრუნება"
                : "Return to Store"}
            </Link>
          </section>
        ) : (
          <>
            <section className="messageCard">
              <div
                className={
                  paid
                    ? "statusIcon paidIcon"
                    : failed
                    ? "statusIcon errorIcon"
                    : "statusIcon pendingIcon"
                }
              >
                {paid
                  ? "✓"
                  : failed
                  ? "×"
                  : "⌛"}
              </div>

              <span className="eyebrow">
                {paid
                  ? ka
                    ? "გადახდა წარმატებულია"
                    : "PAYMENT SUCCESSFUL"
                  : failed
                  ? ka
                    ? "გადახდა ვერ შესრულდა"
                    : "PAYMENT FAILED"
                  : ka
                  ? "გადახდა მოწმდება"
                  : "PAYMENT PROCESSING"}
              </span>

              <h1>
                {paid
                  ? ka
                    ? "მადლობა შეკვეთისთვის!"
                    : "Thank You for Your Order!"
                  : failed
                  ? ka
                    ? "გადახდა ვერ დასრულდა"
                    : "Payment Was Not Completed"
                  : ka
                  ? "შეკვეთა მიღებულია"
                  : "Order Received"}
              </h1>

              <p>
                {paid
                  ? ka
                    ? "თქვენი გადახდა დადასტურებულია და შეკვეთა QR RETURN-ის სისტემაში ჩაიწერა."
                    : "Your payment has been confirmed and your order is now registered with QR RETURN."
                  : failed
                  ? ka
                    ? "შეკვეთა არსებობს, მაგრამ გადახდა წარმატებით არ დასრულებულა."
                    : "Your order exists, but the payment was not completed successfully."
                  : ka
                  ? "ბანკისგან გადახდის საბოლოო დადასტურებას ველოდებით. სტატუსი შეიძლება რამდენიმე წამში განახლდეს."
                  : "We are waiting for final confirmation from the payment provider. The status may update within a few seconds."}
              </p>

              {order?.order_number && (
                <div className="orderNumber">
                  <span>
                    {ka
                      ? "შეკვეთის ნომერი"
                      : "ORDER NUMBER"}
                  </span>

                  <strong>
                    {
                      order.order_number
                    }
                  </strong>
                </div>
              )}
            </section>

            {order && (
              <div className="grid">
                <section className="card">
                  <span className="cardTitle">
                    01 ·{" "}
                    {ka
                      ? "შეკვეთა"
                      : "ORDER"}
                  </span>

                  <div className="product">
                    <div className="productIcon">
                      ◈
                    </div>

                    <div>
                      <strong>
                        {order.product_name ||
                          "QR RETURN Product"}
                      </strong>

                      {order.product_sku && (
                        <small>
                          SKU:{" "}
                          {
                            order.product_sku
                          }
                        </small>
                      )}
                    </div>

                    <div className="qty">
                      ×{" "}
                      {order.quantity ||
                        1}
                    </div>
                  </div>

                  <div className="divider" />

                  <Row
                    label={
                      ka
                        ? "პროდუქტი"
                        : "Subtotal"
                    }
                    value={money(
                      order.subtotal,
                      order.payment_currency
                    )}
                  />

                  <Row
                    label={
                      ka
                        ? "გადახდის მეთოდი"
                        : "Payment Method"
                    }
                    value={providerName(
                      order.payment_provider
                    )}
                  />

                  <Row
                    label={
                      ka
                        ? "სტატუსი"
                        : "Status"
                    }
                    value={
                      paid
                        ? ka
                          ? "გადახდილია"
                          : "Paid"
                        : failed
                        ? ka
                          ? "ვერ შესრულდა"
                          : "Failed"
                        : ka
                        ? "მუშავდება"
                        : "Processing"
                    }
                  />

                  <div className="divider" />

                  <div className="total">
                    <span>
                      {ka
                        ? "სულ"
                        : "Total"}
                    </span>

                    <strong>
                      {money(
                        order.payment_amount ??
                          order.total,
                        order.payment_currency
                      )}
                    </strong>
                  </div>
                </section>

                <section className="card">
                  <span className="cardTitle">
                    02 ·{" "}
                    {ka
                      ? "მიწოდება"
                      : "SHIPPING"}
                  </span>

                  <div className="shipping">
                    <strong>
                      {order.shipping_name ||
                        "—"}
                    </strong>

                    <span>
                      {order.shipping_address ||
                        "—"}
                    </span>

                    <span>
                      {[
                        order.shipping_city,
                        order.shipping_state,
                        order.shipping_zip,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>

                    <span>
                      {order.shipping_country ||
                        "—"}
                    </span>

                    {order.shipping_phone && (
                      <span>
                        {
                          order.shipping_phone
                        }
                      </span>
                    )}

                    {order.shipping_email && (
                      <span>
                        {
                          order.shipping_email
                        }
                      </span>
                    )}
                  </div>

                  <div className="divider" />

                  <Row
                    label={
                      ka
                        ? "შეკვეთის თარიღი"
                        : "Order Date"
                    }
                    value={formatDate(
                      order.created_at
                    )}
                  />

                  {paid &&
                    order.paid_at && (
                      <Row
                        label={
                          ka
                            ? "გადახდის თარიღი"
                            : "Payment Date"
                        }
                        value={formatDate(
                          order.paid_at
                        )}
                      />
                    )}
                </section>
              </div>
            )}

            <div className="actions">
              <Link
                href="/store"
                className="primary"
              >
                {ka
                  ? "მაღაზიაში დაბრუნება"
                  : "Continue Shopping"}
                <span>→</span>
              </Link>

              <Link
                href="/dashboard"
                className="secondary"
              >
                {ka
                  ? "ჩემი ანგარიში"
                  : "My Account"}
              </Link>
            </div>

            {stripeSession && (
              <small className="reference">
                Payment reference:{" "}
                {stripeSession}
              </small>
            )}
          </>
        )}
      </div>

      <footer>
        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
            : "Never lose what matters."}
        </span>
      </footer>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f5f7f8;
          color: #27333e;
        }

        header {
          width: calc(100% - 40px);
          max-width: 1050px;
          min-height: 72px;
          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-bottom: 1px solid #dfe5e9;
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

          background: linear-gradient(
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

          border-radius: 8px;

          background: #e9edf0;
        }

        .langs button {
          min-width: 35px;
          height: 27px;

          border: 0;
          border-radius: 6px;

          background: transparent;
          color: #7d8791;

          cursor: pointer;

          font-size: 7px;
          font-weight: 900;
        }

        .langs button.active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 40px);
          max-width: 900px;

          margin: auto;

          padding: 55px 0 80px;
        }

        .messageCard {
          padding: 45px 30px;

          border: 1px solid #dfe5e9;
          border-radius: 20px;

          background: white;

          text-align: center;
        }

        .statusIcon {
          width: 65px;
          height: 65px;

          margin: auto;

          display: grid;
          place-items: center;

          border-radius: 50%;

          font-size: 27px;
          font-weight: 900;
        }

        .paidIcon {
          color: #167a53;
          background: #e6f8ef;
        }

        .pendingIcon {
          color: #8b6810;
          background: #fff4d6;
        }

        .errorIcon {
          color: #a93f45;
          background: #ffeded;
        }

        .eyebrow {
          display: block;

          margin-top: 18px;

          color: #7655f7;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.3px;
        }

        .messageCard h1 {
          margin: 8px 0 0;

          font-size: 34px;
          letter-spacing: -1px;
        }

        .messageCard p {
          max-width: 570px;

          margin: 10px auto 0;

          color: #7a858e;

          font-size: 9px;
          line-height: 1.7;
        }

        .orderNumber {
          display: inline-flex;
          flex-direction: column;

          margin-top: 22px;
          padding: 12px 20px;

          border-radius: 10px;

          background: #f5f7fa;
        }

        .orderNumber span {
          color: #8d969e;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .orderNumber strong {
          margin-top: 3px;

          color: #1465e8;

          font-size: 13px;
        }

        .grid {
          margin-top: 16px;

          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 16px;
        }

        .card {
          padding: 22px;

          border: 1px solid #dfe5e9;
          border-radius: 16px;

          background: white;
        }

        .cardTitle {
          color: #7655f7;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .product {
          margin-top: 18px;

          display: grid;
          grid-template-columns:
            46px
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;
        }

        .productIcon {
          width: 46px;
          height: 46px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          color: #1465e8;
          background: #eef4ff;

          font-size: 20px;
        }

        .product strong,
        .product small {
          display: block;
        }

        .product strong {
          font-size: 9px;
        }

        .product small {
          margin-top: 3px;

          color: #939ca4;

          font-size: 6px;
        }

        .qty {
          color: #7c8790;

          font-size: 8px;
          font-weight: 800;
        }

        .divider {
          height: 1px;

          margin: 17px 0;

          background: #e8ecef;
        }

        .total {
          display: flex;
          align-items: center;
          justify-content: space-between;

          font-size: 10px;
          font-weight: 900;
        }

        .total strong {
          color: #1465e8;
          font-size: 18px;
        }

        .shipping {
          margin-top: 18px;

          display: flex;
          flex-direction: column;

          gap: 5px;
        }

        .shipping strong {
          font-size: 10px;
        }

        .shipping span {
          color: #7b8790;
          font-size: 8px;
        }

        .actions {
          margin-top: 22px;

          display: flex;
          justify-content: center;

          gap: 8px;
        }

        .primary,
        .secondary {
          min-height: 43px;

          padding: 0 17px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 20px;

          border-radius: 9px;

          text-decoration: none;

          font-size: 8px;
          font-weight: 900;
        }

        .primary {
          color: white;

          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
        }

        .secondary {
          color: #54616c;

          border: 1px solid #dce2e6;

          background: white;
        }

        .reference {
          display: block;

          margin-top: 15px;

          color: #a0a8ae;

          text-align: center;

          font-size: 6px;
        }

        .errorCard
          .primary {
          margin-top: 20px;
        }

        footer {
          width: calc(100% - 40px);
          max-width: 1050px;

          min-height: 90px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-top: 1px solid #dfe5e9;
        }

        footer strong {
          color: #1465e8;
          font-size: 11px;
        }

        footer span {
          color: #8c969e;
          font-size: 7px;
        }

        @media (
          max-width: 700px
        ) {
          .container {
            width:
              calc(100% - 24px);
          }

          .grid {
            grid-template-columns:
              1fr;
          }

          .messageCard {
            padding:
              35px 18px;
          }

          .messageCard h1 {
            font-size: 27px;
          }

          .actions {
            flex-direction:
              column;
          }

          .primary,
          .secondary {
            width: 100%;
            box-sizing:
              border-box;
          }

          footer {
            width:
              calc(100% - 24px);

            padding: 20px 0;

            flex-direction:
              column;

            align-items:
              flex-start;

            gap: 6px;
          }
        }
      `}</style>
    </main>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="row">
      <span>{label}</span>

      <strong>{value}</strong>

      <style jsx>{`
        .row {
          margin-top: 10px;

          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 15px;

          color: #74808a;

          font-size: 8px;
        }

        strong {
          color: #36424d;

          text-align: right;
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight:
              "100vh",

            display:
              "grid",

            placeItems:
              "center",

            background:
              "#f5f7f8",
          }}
        >
          Loading...
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
