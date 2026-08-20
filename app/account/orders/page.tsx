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

  status: string | null;

  total_amount: number | null;

  currency: string | null;

  shipping_name: string | null;

  shipping_address: string | null;

  tracking_number: string | null;

  created_at: string | null;

  updated_at?: string | null;
};

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

  const pendingCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.status
        ) === "pending"
    ).length;

  const processingCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.status
        ) === "processing"
    ).length;

  const shippedCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.status
        ) === "shipped"
    ).length;

  const deliveredCount =
    orders.filter(
      (order) =>
        normalizeStatus(
          order.status
        ) === "delivered"
    ).length;

  if (loading) {
    return (
      <main className="loading">
        <div className="icon">
          🛒
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
          <Link href="/my-profiles">
            {ka
              ? "ჩემი პროფილები"
              : "My Profiles"}
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
                ? "ნახეთ QR Tag, Sticker და სხვა QR RETURN პროდუქციის შეკვეთების სტატუსი."
                : "Track your QR Tag, Sticker, and other QR RETURN product orders."}
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
                : "Total"
            }
            value={
              orders.length
            }
          />

          <Stat
            label={
              ka
                ? "მოლოდინში"
                : "Pending"
            }
            value={
              pendingCount
            }
          />

          <Stat
            label={
              ka
                ? "მუშავდება"
                : "Processing"
            }
            value={
              processingCount
            }
          />

          <Stat
            label={
              ka
                ? "გაგზავნილი"
                : "Shipped"
            }
            value={
              shippedCount
            }
          />

          <Stat
            label={
              ka
                ? "ჩაბარებული"
                : "Delivered"
            }
            value={
              deliveredCount
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
                🛒
              </div>

              <strong>
                {ka
                  ? "შეკვეთები ჯერ არ გაქვთ"
                  : "No orders yet"}
              </strong>

              <p>
                {ka
                  ? "QR Tag ან Sticker-ის შეძენის შემდეგ შეკვეთა აქ გამოჩნდება."
                  : "Your QR Tag or Sticker orders will appear here."}
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

          padding: 0 9px;

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

          background: transparent;

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
          align-items: flex-end;
          justify-content: space-between;

          gap: 25px;
        }

        .eyebrow {
          color: #7655f7;

          font-size: 7px;

          font-weight: 900;

          letter-spacing: 1px;
        }

        h1 {
          margin: 7px 0 0;

          color: #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          letter-spacing: -1.8px;
        }

        .heading p {
          max-width: 650px;

          margin: 9px 0 0;

          color: #78838e;

          font-size: 9px;

          line-height: 1.7;
        }

        .shopButton {
          min-height: 40px;

          padding: 0 12px;

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
              5,
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

          gap: 10px;
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

          padding: 60px 20px;

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
          margin: 7px 0 16px;

          color: #89939d;

          font-size: 8px;
        }

        .empty
          :global(a) {
          min-height: 36px;

          padding: 0 11px;

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
          max-width: 780px
        ) {
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

        @media (
          max-width: 600px
        ) {
          .topbar {
            padding: 10px 0;

            align-items: flex-start;

            flex-direction: column;
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

            padding-top: 30px;
          }

          .heading {
            align-items: stretch;

            flex-direction: column;
          }

          .shopButton {
            align-self: flex-start;
          }

          .stats {
            grid-template-columns:
              1fr;
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

  return (
    <article className="card">
      <div className="main">
        <div className="icon">
          🛒
        </div>

        <div className="info">
          <span className="orderId">
            ORDER
          </span>

          <strong>
            #
            {order.id}
          </strong>

          <p>
            {formatDate(
              order.created_at,
              language
            )}
          </p>
        </div>
      </div>

      <div className="details">
        <div>
          <span>
            {ka
              ? "სტატუსი"
              : "Status"}
          </span>

          <strong
            className={`status ${status}`}
          >
            {getStatusLabel(
              status,
              language
            )}
          </strong>
        </div>

        <div>
          <span>
            {ka
              ? "თანხა"
              : "Total"}
          </span>

          <strong>
            {formatMoney(
              order.total_amount,
              order.currency
            )}
          </strong>
        </div>

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
      </div>

      {order.shipping_address && (
        <div className="address">
          📍{" "}
          {order.shipping_address}
        </div>
      )}

      {order.tracking_number && (
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
        </div>
      )}

      <style jsx>{`
        .card {
          padding: 15px;

          display: grid;

          grid-template-columns:
            190px
            minmax(
              0,
              1fr
            );

          gap: 18px;

          border:
            1px solid #e0e5e8;

          border-radius: 13px;

          background: white;
        }

        .main {
          display: flex;

          align-items: center;

          gap: 11px;
        }

        .icon {
          width: 45px;
          height: 45px;

          flex: 0 0 45px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #eef4ff;

          font-size: 20px;
        }

        .info {
          min-width: 0;
        }

        .orderId {
          display: block;

          color: #7655f7;

          font-size: 6px;

          font-weight: 900;
        }

        .info strong {
          display: block;

          margin-top: 3px;

          overflow: hidden;

          color: #35414c;

          font-size: 9px;

          text-overflow: ellipsis;

          white-space: nowrap;
        }

        .info p {
          margin: 4px 0 0;

          color: #929ca5;

          font-size: 7px;
        }

        .details {
          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(
                0,
                1fr
              )
            );

          gap: 10px;
        }

        .details span,
        .details strong {
          display: block;
        }

        .details span {
          color: #959fa8;

          font-size: 6px;

          font-weight: 900;
        }

        .details strong {
          margin-top: 5px;

          color: #4f5b66;

          font-size: 8px;
        }

        .status {
          width: fit-content;

          padding: 5px 7px;

          border-radius: 999px;
        }

        .status.pending {
          color: #9a6700;

          background: #fff8e1;
        }

        .status.processing {
          color: #175cd3;

          background: #eff8ff;
        }

        .status.shipped {
          color: #6941c6;

          background: #f4f3ff;
        }

        .status.delivered {
          color: #027a48;

          background: #ecfdf3;
        }

        .status.cancelled {
          color: #b42318;

          background: #fff1f0;
        }

        .address,
        .tracking {
          grid-column:
            1 / -1;

          padding-top: 11px;

          border-top:
            1px solid #edf0f2;
        }

        .address {
          color: #6e7984;

          font-size: 7px;
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

          font-size: 8px;
        }

        @media (
          max-width: 700px
        ) {
          .card {
            grid-template-columns:
              1fr;
          }

          .details {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </article>
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
      onClick={
        onClick
      }
    >
      {children}

      <style jsx>{`
        .filter {
          min-height: 30px;

          padding: 0 9px;

          border:
            1px solid #dce2e6;

          border-radius: 999px;

          color: #66727d;

          background: white;

          cursor: pointer;

          font-size: 7px;

          font-weight: 850;
        }

        .active {
          color: white;

          border-color: #202b37;

          background: #202b37;
        }
      `}</style>
    </button>
  );
}

function normalizeStatus(
  value?: string | null
) {
  const status =
    (
      value ||
      "pending"
    )
      .trim()
      .toLowerCase();

  if (
    status === "processing"
  ) {
    return "processing";
  }

  if (
    status === "shipped"
  ) {
    return "shipped";
  }

  if (
    status === "delivered"
  ) {
    return "delivered";
  }

  if (
    status === "cancelled" ||
    status === "canceled"
  ) {
    return "cancelled";
  }

  return "pending";
}

function getStatusLabel(
  status: string,
  language: Lang
) {
  const ka =
    language === "ka";

  if (
    status === "processing"
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
    status === "delivered"
  ) {
    return ka
      ? "ჩაბარებულია"
      : "Delivered";
  }

  if (
    status === "cancelled"
  ) {
    return ka
      ? "გაუქმებულია"
      : "Cancelled";
  }

  return ka
    ? "მოლოდინში"
    : "Pending";
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
    ).format(
      amount
    );
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
