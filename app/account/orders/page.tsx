"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type OrderRow = {
  id: string;
  user_id: string | null;

  product_id: string | null;
  product_name: string | null;
  product_type: string | null;
  sku: string | null;

  quantity: number | null;
  unit_price: number | null;

  status: string | null;

  total_amount: number | null;
  currency: string | null;

  shipping_name: string | null;
  shipping_address: string | null;

  tracking_number: string | null;

  created_at: string | null;
  updated_at?: string | null;
};

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

export default function AccountOrdersPage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [orders, setOrders] =
    useState<OrderRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const ka = lang === "ka";

  useEffect(() => {
    void loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } =
        await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        data,
        error: orderError,
      } = await supabase
        .from("orders")
        .select(`
          id,
          user_id,
          product_id,
          product_name,
          product_type,
          sku,
          quantity,
          unit_price,
          status,
          total_amount,
          currency,
          shipping_name,
          shipping_address,
          tracking_number,
          created_at,
          updated_at
        `)
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (orderError) {
        throw orderError;
      }

      setOrders(
        (data || []) as OrderRow[]
      );
    } catch (err) {
      console.error(
        "Orders error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შეკვეთების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load orders."
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders =
    useMemo(() => {
      if (filter === "all") {
        return orders;
      }

      return orders.filter(
        (order) =>
          normalizeStatus(
            order.status
          ) === filter
      );
    }, [
      orders,
      filter,
    ]);

  const counts =
    useMemo(() => {
      return {
        all: orders.length,

        pending:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) === "pending"
          ).length,

        paid:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) === "paid"
          ).length,

        processing:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) === "processing"
          ).length,

        shipped:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) === "shipped"
          ).length,

        delivered:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) === "delivered"
          ).length,
      };
    }, [orders]);

  if (loading) {
    return (
      <main className="loading">
        <div className="icon">
          📦
        </div>

        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "შეკვეთები იტვირთება..."
            : "Loading orders..."}
        </span>

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 8px;

            color: #78838e;

            background: #f5f7f8;
          }

          .icon {
            width: 50px;
            height: 50px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            background: white;

            font-size: 22px;
          }

          strong {
            color: #202b37;
          }

          span {
            font-size: 9px;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <Link
          href="/my-profiles"
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
              ACCOUNT • ORDERS
            </small>
          </span>
        </Link>

        <div className="topActions">
          <Link href="/store">
            {ka
              ? "მაღაზია"
              : "Store"}
          </Link>

          <Link href="/account/messages">
            💬 Live Chat
          </Link>

          <Link href="/account/notifications">
            🔔{" "}
            {ka
              ? "შეტყობინებები"
              : "Notifications"}
          </Link>

          <Link href="/my-profiles">
            {ka
              ? "პროფილები"
              : "Profiles"}
          </Link>

          <div className="langs">
            <button
              type="button"
              className={
                ka
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
              type="button"
              className={
                !ka
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
        </div>
      </header>

      <div className="shell">
        <header className="heading">
          <div>
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              {ka
                ? "ჩემი შეკვეთები"
                : "My Orders"}
            </h1>

            <p>
              {ka
                ? "ნახეთ შეძენილი QR Tag-ები და Sticker-ები, რაოდენობა, მიმდინარე სტატუსი და მიწოდების ინფორმაცია."
                : "View your QR Tags and Stickers, quantity, order status, and shipping information."}
            </p>
          </div>

          <Link
            href="/store"
            className="shopButton"
          >
            +{" "}
            {ka
              ? "ახალი შეკვეთა"
              : "New Order"}
          </Link>
        </header>

        <section className="stats">
          <Stat
            label={
              ka
                ? "ყველა"
                : "All"
            }
            value={counts.all}
          />

          <Stat
            label="Pending"
            value={
              counts.pending
            }
          />

          <Stat
            label="Paid"
            value={
              counts.paid
            }
          />

          <Stat
            label="Processing"
            value={
              counts.processing
            }
          />

          <Stat
            label="Shipped"
            value={
              counts.shipped
            }
          />

          <Stat
            label="Delivered"
            value={
              counts.delivered
            }
          />
        </section>

        <section className="filters">
          <FilterButton
            active={
              filter === "all"
            }
            onClick={() =>
              setFilter("all")
            }
          >
            {ka
              ? "ყველა"
              : "All"}
          </FilterButton>

          <FilterButton
            active={
              filter === "pending"
            }
            onClick={() =>
              setFilter(
                "pending"
              )
            }
          >
            Pending
          </FilterButton>

          <FilterButton
            active={
              filter === "paid"
            }
            onClick={() =>
              setFilter(
                "paid"
              )
            }
          >
            Paid
          </FilterButton>

          <FilterButton
            active={
              filter ===
              "processing"
            }
            onClick={() =>
              setFilter(
                "processing"
              )
            }
          >
            Processing
          </FilterButton>

          <FilterButton
            active={
              filter === "shipped"
            }
            onClick={() =>
              setFilter(
                "shipped"
              )
            }
          >
            Shipped
          </FilterButton>

          <FilterButton
            active={
              filter ===
              "delivered"
            }
            onClick={() =>
              setFilter(
                "delivered"
              )
            }
          >
            Delivered
          </FilterButton>
        </section>

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        {!error &&
          filteredOrders.length ===
            0 && (
            <section className="empty">
              <div>
                📦
              </div>

              <strong>
                {ka
                  ? "შეკვეთები ჯერ არ გაქვთ"
                  : "No orders yet"}
              </strong>

              <p>
                {ka
                  ? "QR Tag ან QR Sticker-ის შეძენის შემდეგ შეკვეთა აქ გამოჩნდება."
                  : "Your QR Tag or QR Sticker orders will appear here."}
              </p>

              <Link href="/store">
                {ka
                  ? "გადადით მაღაზიაში"
                  : "Visit Store"}
              </Link>
            </section>
          )}

        {!error &&
          filteredOrders.length >
            0 && (
            <section className="orders">
              {filteredOrders.map(
                (order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    language={lang}
                  />
                )
              )}
            </section>
          )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          background: #f5f7f8;
        }

        .topbar {
          width:
            calc(
              100% - 36px
            );

          max-width: 1100px;

          min-height: 70px;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

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
          width: 41px;
          height: 41px;

          display: grid;

          place-items: center;

          border-radius: 11px;

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

          font-size: 12px;
        }

        .brand small {
          margin-top: 2px;

          color: #7655f7;

          font-size: 6px;

          font-weight: 900;
        }

        .topActions {
          display: flex;

          align-items: center;

          gap: 5px;
        }

        .topActions
          :global(a) {
          min-height: 32px;

          padding:
            0 9px;

          display: flex;

          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 8px;

          color: #57646f;

          background: white;

          text-decoration: none;

          font-size: 7px;

          font-weight: 850;
        }

        .langs {
          padding: 3px;

          display: flex;

          gap: 2px;

          border-radius: 8px;

          background: #e9edf0;
        }

        .langs button {
          min-width: 34px;
          min-height: 27px;

          border: 0;

          border-radius: 6px;

          color: #7d8791;

          background:
            transparent;

          cursor: pointer;

          font-size: 7px;

          font-weight: 900;
        }

        .langs
          button.active {
          color: #1465e8;

          background: white;
        }

        .shell {
          width:
            calc(
              100% - 40px
            );

          max-width: 1000px;

          margin: 0 auto;

          padding:
            45px 0 90px;
        }

        .heading {
          display: flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap: 25px;
        }

        .eyebrow {
          color: #7655f7;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        h1 {
          margin:
            7px 0 0;

          color: #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          letter-spacing:
            -1.8px;
        }

        .heading p {
          max-width: 650px;

          margin:
            9px 0 0;

          color: #78838e;

          font-size: 9px;

          line-height: 1.7;
        }

        .shopButton {
          min-height: 40px;

          padding:
            0 12px;

          display: flex;

          align-items: center;

          border-radius: 9px;

          color: white;

          background: #202b37;

          text-decoration: none;

          font-size: 8px;

          font-weight: 850;
        }

        .stats {
          margin-top: 28px;

          display: grid;

          grid-template-columns:
            repeat(
              6,
              minmax(
                0,
                1fr
              )
            );

          gap: 8px;
        }

        .filters {
          margin-top: 20px;

          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .orders {
          margin-top: 22px;

          display: grid;

          gap: 12px;
        }

        .error {
          margin-top: 20px;

          padding: 13px;

          border:
            1px solid #efd2d4;

          border-radius: 10px;

          color: #9d4146;

          background: #fff5f5;

          font-size: 8px;
        }

        .empty {
          margin-top: 25px;

          padding:
            60px 20px;

          border:
            1px solid #e0e5e8;

          border-radius: 15px;

          background: white;

          text-align: center;
        }

        .empty div {
          font-size: 32px;
        }

        .empty strong {
          display: block;

          margin-top: 12px;

          color: #3d4954;

          font-size: 12px;
        }

        .empty p {
          margin:
            7px 0 16px;

          color: #89939d;

          font-size: 8px;
        }

        .empty
          :global(a) {
          min-height: 36px;

          padding:
            0 11px;

          display: inline-flex;

          align-items: center;

          border-radius: 8px;

          color: white;

          background: #1465e8;

          text-decoration: none;

          font-size: 8px;

          font-weight: 850;
        }

        @media (
          max-width: 850px
        ) {
          .stats {
            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        @media (
          max-width: 600px
        ) {
          .topbar {
            padding:
              10px 0;

            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .topActions {
            width: 100%;

            flex-wrap: wrap;
          }

          .shell {
            width:
              calc(
                100% - 24px
              );

            padding-top:
              30px;
          }

          .heading {
            align-items:
              stretch;

            flex-direction:
              column;
          }

          .shopButton {
            align-self:
              flex-start;
          }

          .stats {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }
      `}</style>
    </main>
  );
}

function OrderCard({
  order,
  language,
}: {
  order: OrderRow;
  language: Lang;
}) {
  const ka =
    language === "ka";

  const status =
    normalizeStatus(
      order.status
    );

  const currentIndex =
    STATUS_FLOW.indexOf(
      status
    );

  const icon =
    order.product_id ===
    "sticker"
      ? "🔳"
      : "🏷️";

  return (
    <article className="card">
      <div className="cardTop">
        <div className="product">
          <div className="productIcon">
            {icon}
          </div>

          <div className="productText">
            <span>
              QR RETURN ORDER
            </span>

            <h2>
              {order.product_name ||
                (ka
                  ? "QR პროდუქტი"
                  : "QR Product")}
            </h2>

            <p>
              {ka
                ? "შეკვეთა"
                : "Order"}{" "}
              #{order.id}
            </p>
          </div>
        </div>

        <span
          className={`status ${status}`}
        >
          {getStatusLabel(
            status,
            language
          )}
        </span>
      </div>

      <div className="productDetails">
        <Detail
          label={
            ka
              ? "პროდუქტი"
              : "Product"
          }
          value={
            order.product_name ||
            "—"
          }
        />

        <Detail
          label={
            ka
              ? "რაოდენობა"
              : "Quantity"
          }
          value={String(
            order.quantity || 1
          )}
        />

        <Detail
          label={
            ka
              ? "ერთეულის ფასი"
              : "Unit Price"
          }
          value={formatMoney(
            order.unit_price,
            order.currency
          )}
        />

        <Detail
          label="SKU"
          value={
            order.sku || "—"
          }
        />

        <Detail
          label={
            ka
              ? "ჯამი"
              : "Total"
          }
          value={formatMoney(
            order.total_amount,
            order.currency
          )}
        />

        <Detail
          label={
            ka
              ? "შეკვეთის თარიღი"
              : "Order Date"
          }
          value={formatDate(
            order.created_at,
            language
          )}
        />
      </div>

      {status !==
        "cancelled" && (
        <div className="progress">
          {STATUS_FLOW.map(
            (
              step,
              index
            ) => {
              const complete =
                currentIndex >=
                index;

              const active =
                status === step;

              return (
                <div
                  key={step}
                  className="progressItem"
                >
                  <div
                    className={
                      active
                        ? "dot active"
                        : complete
                        ? "dot complete"
                        : "dot"
                    }
                  >
                    {complete &&
                    !active
                      ? "✓"
                      : index +
                        1}
                  </div>

                  <span>
                    {getStatusLabel(
                      step,
                      language
                    )}
                  </span>
                </div>
              );
            }
          )}
        </div>
      )}

      {status ===
        "cancelled" && (
        <div className="cancelled">
          ✕{" "}
          {ka
            ? "ეს შეკვეთა გაუქმებულია."
            : "This order has been cancelled."}
        </div>
      )}

      <div className="shipping">
        <div>
          <span>
            {ka
              ? "მიმღები"
              : "Recipient"}
          </span>

          <strong>
            {order.shipping_name ||
              "—"}
          </strong>
        </div>

        <div>
          <span>
            {ka
              ? "მიწოდების მისამართი"
              : "Shipping Address"}
          </span>

          <strong>
            {order.shipping_address ||
              "—"}
          </strong>
        </div>
      </div>

      {order.tracking_number ? (
        <div className="tracking">
          <div>
            <span>
              TRACKING NUMBER
            </span>

            <strong>
              {
                order.tracking_number
              }
            </strong>
          </div>

          <span className="trackingIcon">
            📦
          </span>
        </div>
      ) : status ===
        "shipped" ? (
        <div className="mailNotice">
          📮{" "}
          {ka
            ? "შეკვეთა გაგზავნილია. Tracking Number ამ გზავნილს არ აქვს."
            : "Your order has been shipped without a tracking number."}
        </div>
      ) : null}

      <style jsx>{`
        .card {
          padding: 18px;

          border:
            1px solid #dfe4e8;

          border-radius: 15px;

          background: white;
        }

        .cardTop {
          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap: 15px;
        }

        .product {
          min-width: 0;

          display: flex;

          align-items:
            center;

          gap: 11px;
        }

        .productIcon {
          width: 50px;
          height: 50px;

          flex: 0 0 50px;

          display: grid;

          place-items: center;

          border-radius: 12px;

          background: #eef4ff;

          font-size: 22px;
        }

        .productText {
          min-width: 0;
        }

        .productText span {
          display: block;

          color: #7655f7;

          font-size: 6px;

          font-weight: 900;

          letter-spacing:
            0.8px;
        }

        .productText h2 {
          margin:
            4px 0 0;

          color: #35414c;

          font-size: 14px;
        }

        .productText p {
          margin:
            4px 0 0;

          overflow: hidden;

          color: #929ca5;

          font-size: 7px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .status {
          flex: 0 0 auto;

          padding:
            6px 9px;

          border-radius:
            999px;

          font-size: 6px;

          font-weight: 900;
        }

        .status.pending {
          color: #9a6700;

          background:
            #fff8e1;
        }

        .status.paid {
          color: #027a48;

          background:
            #ecfdf3;
        }

        .status.processing {
          color: #175cd3;

          background:
            #eff8ff;
        }

        .status.shipped {
          color: #6941c6;

          background:
            #f4f3ff;
        }

        .status.delivered {
          color: #027a48;

          background:
            #ecfdf3;
        }

        .status.cancelled {
          color: #b42318;

          background:
            #fff1f0;
        }

        .productDetails {
          margin-top: 18px;

          padding: 14px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 13px;

          border-radius: 11px;

          background: #f8fafb;
        }

        .progress {
          margin-top: 20px;

          padding:
            17px 4px;

          display: grid;

          grid-template-columns:
            repeat(
              5,
              minmax(
                0,
                1fr
              )
            );

          border-top:
            1px solid #edf0f2;

          border-bottom:
            1px solid #edf0f2;
        }

        .progressItem {
          position: relative;

          display: flex;

          flex-direction:
            column;

          align-items: center;

          gap: 6px;

          color: #84909a;

          font-size: 6px;

          text-align: center;
        }

        .progressItem:not(
            :last-child
          )::after {
          content: "";

          position:
            absolute;

          top: 13px;

          left:
            calc(
              50% + 17px
            );

          width:
            calc(
              100% - 34px
            );

          height: 1px;

          background:
            #dfe4e8;
        }

        .dot {
          position: relative;

          z-index: 2;

          width: 27px;

          height: 27px;

          display: grid;

          place-items:
            center;

          border:
            1px solid #d8dee3;

          border-radius:
            999px;

          color: #929ca5;

          background: white;

          font-size: 7px;

          font-weight: 900;
        }

        .dot.complete {
          color: white;

          border-color:
            #12a86b;

          background:
            #12a86b;
        }

        .dot.active {
          color: white;

          border-color:
            #1465e8;

          background:
            #1465e8;
        }

        .cancelled {
          margin-top: 18px;

          padding: 12px;

          border:
            1px solid #fecdca;

          border-radius: 9px;

          color: #b42318;

          background:
            #fff1f0;

          font-size: 8px;
        }

        .shipping {
          margin-top: 17px;

          display: grid;

          grid-template-columns:
            1fr
            2fr;

          gap: 14px;
        }

        .shipping span,
        .shipping strong {
          display: block;
        }

        .shipping span {
          color: #929ca5;

          font-size: 6px;

          font-weight: 900;
        }

        .shipping strong {
          margin-top: 5px;

          color: #56626d;

          font-size: 8px;

          line-height: 1.5;
        }

        .tracking {
          margin-top: 17px;

          padding: 13px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 10px;

          border:
            1px solid #dfe4e8;

          border-radius: 10px;

          background: #f8fafb;
        }

        .tracking span,
        .tracking strong {
          display: block;
        }

        .tracking span {
          color: #929ca5;

          font-size: 6px;

          font-weight: 900;
        }

        .tracking strong {
          margin-top: 4px;

          color: #35414c;

          font-size: 9px;
        }

        .trackingIcon {
          font-size: 20px;
        }

        .mailNotice {
          margin-top: 17px;

          padding: 12px;

          border:
            1px solid #e0e5e8;

          border-radius: 9px;

          color: #66727d;

          background: #fafbfc;

          font-size: 8px;

          line-height: 1.5;
        }

        @media (
          max-width: 700px
        ) {
          .productDetails {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );
          }

          .shipping {
            grid-template-columns:
              1fr;
          }
        }

        @media (
          max-width: 520px
        ) {
          .cardTop {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .productDetails {
            grid-template-columns:
              1fr;
          }

          .progress {
            overflow-x:
              auto;

            grid-template-columns:
              repeat(
                5,
                85px
              );
          }
        }
      `}</style>
    </article>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="detail">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .detail {
          min-width: 0;
        }

        span {
          display: block;

          color: #929ca5;

          font-size: 6px;

          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 5px;

          overflow: hidden;

          color: #4c5964;

          font-size: 8px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }
      `}</style>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="stat">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .stat {
          min-height: 85px;

          padding: 13px;

          border:
            1px solid #e0e5e8;

          border-radius: 11px;

          background: white;
        }

        span {
          color: #929ca5;

          font-size: 6px;

          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 14px;

          color: #293540;

          font-size: 21px;
        }
      `}</style>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;

  onClick: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={
        active
          ? "filter active"
          : "filter"
      }
      onClick={onClick}
    >
      {children}

      <style jsx>{`
        .filter {
          min-height: 30px;

          padding:
            0 9px;

          border:
            1px solid #dce2e6;

          border-radius:
            999px;

          color: #66727d;

          background: white;

          cursor: pointer;

          font-size: 7px;

          font-weight: 850;
        }

        .active {
          color: white;

          border-color:
            #202b37;

          background:
            #202b37;
        }
      `}</style>
    </button>
  );
}

function normalizeStatus(
  value?: string | null
): OrderStatus {
  const status =
    (
      value ||
      "pending"
    )
      .trim()
      .toLowerCase();

  if (
    status === "paid"
  ) {
    return "paid";
  }

  if (
    status ===
    "processing"
  ) {
    return "processing";
  }

  if (
    status === "shipped"
  ) {
    return "shipped";
  }

  if (
    status ===
    "delivered"
  ) {
    return "delivered";
  }

  if (
    status ===
      "cancelled" ||
    status ===
      "canceled"
  ) {
    return "cancelled";
  }

  return "pending";
}

function getStatusLabel(
  status: OrderStatus,
  language: Lang
) {
  const ka =
    language === "ka";

  if (
    status === "pending"
  ) {
    return ka
      ? "მოლოდინში"
      : "Pending";
  }

  if (
    status === "paid"
  ) {
    return ka
      ? "გადახდილია"
      : "Paid";
  }

  if (
    status ===
    "processing"
  ) {
    return ka
      ? "მუშავდება"
      : "Processing";
  }

  if (
    status === "shipped"
  ) {
    return ka
      ? "გაგზავნილია"
      : "Shipped";
  }

  if (
    status ===
    "delivered"
  ) {
    return ka
      ? "ჩაბარებულია"
      : "Delivered";
  }

  return ka
    ? "გაუქმებულია"
    : "Cancelled";
}

function formatMoney(
  amount: number | null,
  currency: string | null
) {
  if (
    amount === null ||
    amount === undefined
  ) {
    return "—";
  }

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
    return `${amount} ${
      currency || ""
    }`;
  }
}

function formatDate(
  value: string | null,
  language: Lang
) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(
      language === "ka"
        ? "ka-GE"
        : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return value;
  }
}
