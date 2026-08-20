"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<OrderRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [
    savingId,
    setSavingId,
  ] = useState<string | null>(
    null
  );

  const [
    trackingDrafts,
    setTrackingDrafts,
  ] = useState<
    Record<string, string>
  >({});

  const loadOrders =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const {
            data,
            error: ordersError,
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
            .order(
              "created_at",
              {
                ascending: false,
              }
            );

          if (ordersError) {
            throw ordersError;
          }

          const rows =
            (data ||
              []) as OrderRow[];

          setOrders(rows);

          const drafts:
            Record<
              string,
              string
            > = {};

          rows.forEach(
            (order) => {
              drafts[
                order.id
              ] =
                order.tracking_number ||
                "";
            }
          );

          setTrackingDrafts(
            drafts
          );
        } catch (err) {
          console.error(
            "Admin orders load error:",
            err
          );

          setError(
            err instanceof Error
              ? err.message
              : "Orders could not be loaded."
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const filteredOrders =
    useMemo(() => {
      if (
        filter === "all"
      ) {
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
        all:
          orders.length,

        pending:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) ===
              "pending"
          ).length,

        paid:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) ===
              "paid"
          ).length,

        processing:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) ===
              "processing"
          ).length,

        shipped:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) ===
              "shipped"
          ).length,

        delivered:
          orders.filter(
            (order) =>
              normalizeStatus(
                order.status
              ) ===
              "delivered"
          ).length,
      };
    }, [orders]);

  async function updateStatus(
    orderId: string,
    newStatus:
      OrderStatus
  ) {
    try {
      setSavingId(
        orderId
      );

      setError("");

      const payload: {
        status: OrderStatus;
        tracking_number?:
          | string
          | null;
      } = {
        status:
          newStatus,
      };

      if (
        newStatus ===
        "shipped"
      ) {
        const tracking =
          trackingDrafts[
            orderId
          ]?.trim() || "";

        payload.tracking_number =
          tracking || null;
      }

      const {
        error: updateError,
      } = await supabase
        .from("orders")
        .update(payload)
        .eq(
          "id",
          orderId
        );

      if (updateError) {
        throw updateError;
      }

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    status:
                      newStatus,

                    tracking_number:
                      newStatus ===
                      "shipped"
                        ? trackingDrafts[
                            orderId
                          ]?.trim() ||
                          null
                        : order.tracking_number,
                  }
                : order
          )
      );
    } catch (err) {
      console.error(
        "Order status update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Order status could not be updated."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function saveTracking(
    orderId: string
  ) {
    try {
      setSavingId(
        orderId
      );

      setError("");

      const tracking =
        trackingDrafts[
          orderId
        ]?.trim() || "";

      const {
        error: updateError,
      } = await supabase
        .from("orders")
        .update({
          tracking_number:
            tracking ||
            null,
        })
        .eq(
          "id",
          orderId
        );

      if (updateError) {
        throw updateError;
      }

      setOrders(
        (current) =>
          current.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    tracking_number:
                      tracking ||
                      null,
                  }
                : order
          )
      );
    } catch (err) {
      console.error(
        "Tracking update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Tracking number could not be saved."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="page">
      <header className="topbar">
        <Link
          href="/admin"
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
              ADMIN • ORDERS
            </small>
          </span>
        </Link>

        <nav className="nav">
          <Link href="/admin">
            Dashboard
          </Link>

          <Link href="/admin/chat">
            Live Chat
          </Link>

          <Link href="/store">
            Store
          </Link>

          <button
            type="button"
            onClick={() =>
              void loadOrders()
            }
          >
            ↻ Refresh
          </button>
        </nav>
      </header>

      <div className="shell">
        <section className="heading">
          <span className="eyebrow">
            ORDER MANAGEMENT
          </span>

          <h1>
            Orders
          </h1>

          <p>
            Manage QR RETURN
            products, quantities,
            shipping and order
            status.
          </p>
        </section>

        <section className="stats">
          <Stat
            label="All Orders"
            value={
              counts.all
            }
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
              filter ===
              "all"
            }
            onClick={() =>
              setFilter(
                "all"
              )
            }
          >
            All
          </FilterButton>

          <FilterButton
            active={
              filter ===
              "pending"
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
              "paid"
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
              filter ===
              "shipped"
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

        {loading ? (
          <section className="empty">
            <div>
              ⌛
            </div>

            <strong>
              Loading orders...
            </strong>
          </section>
        ) : filteredOrders.length ===
          0 ? (
          <section className="empty">
            <div>
              📦
            </div>

            <strong>
              No orders found
            </strong>

            <p>
              New customer
              orders will
              appear here.
            </p>
          </section>
        ) : (
          <section className="orders">
            {filteredOrders.map(
              (order) => (
                <OrderCard
                  key={
                    order.id
                  }
                  order={
                    order
                  }
                  saving={
                    savingId ===
                    order.id
                  }
                  tracking={
                    trackingDrafts[
                      order.id
                    ] || ""
                  }
                  setTracking={(
                    value
                  ) =>
                    setTrackingDrafts(
                      (
                        current
                      ) => ({
                        ...current,
                        [order.id]:
                          value,
                      })
                    )
                  }
                  onStatusChange={(
                    status
                  ) =>
                    void updateStatus(
                      order.id,
                      status
                    )
                  }
                  onSaveTracking={() =>
                    void saveTracking(
                      order.id
                    )
                  }
                />
              )
            )}
          </section>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          color: #202b37;

          background:
            #f5f7f8;
        }

        .topbar {
          width:
            calc(
              100% - 36px
            );

          max-width:
            1180px;

          min-height:
            72px;

          margin: auto;

          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap: 15px;

          border-bottom:
            1px solid
            #e0e5e8;
        }

        .brand {
          display: flex;

          align-items:
            center;

          gap: 9px;

          text-decoration:
            none;
        }

        .logo {
          width: 43px;

          height: 43px;

          display: grid;

          place-items:
            center;

          border-radius:
            12px;

          color: white;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #7655f7
            );

          font-size:
            11px;

          font-weight:
            900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;

          font-size:
            13px;
        }

        .brand small {
          margin-top:
            2px;

          color: #7655f7;

          font-size:
            6px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .nav {
          display: flex;

          align-items:
            center;

          gap: 5px;
        }

        .nav :global(a),
        .nav button {
          min-height:
            32px;

          padding:
            0 9px;

          display: flex;

          align-items:
            center;

          border:
            1px solid
            #dfe4e8;

          border-radius:
            8px;

          color: #57646f;

          background:
            white;

          text-decoration:
            none;

          font-size:
            7px;

          font-weight:
            850;

          cursor: pointer;
        }

        .shell {
          width:
            calc(
              100% - 40px
            );

          max-width:
            1100px;

          margin: auto;

          padding:
            48px 0 90px;
        }

        .eyebrow {
          color: #7655f7;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            1.2px;
        }

        .heading h1 {
          margin:
            7px 0 0;

          font-size:
            clamp(
              38px,
              5vw,
              54px
            );

          letter-spacing:
            -2px;
        }

        .heading p {
          margin:
            9px 0 0;

          color: #7c8791;

          font-size:
            9px;
        }

        .stats {
          margin-top:
            28px;

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
          margin-top:
            20px;

          display: flex;

          flex-wrap:
            wrap;

          gap: 6px;
        }

        .orders {
          margin-top:
            22px;

          display: grid;

          gap: 12px;
        }

        .error {
          margin-top:
            18px;

          padding:
            13px;

          border:
            1px solid
            #efd2d4;

          border-radius:
            10px;

          color: #9d4146;

          background:
            #fff5f5;

          font-size:
            8px;
        }

        .empty {
          margin-top:
            25px;

          padding:
            65px 20px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            15px;

          background:
            white;

          text-align:
            center;
        }

        .empty div {
          font-size:
            30px;
        }

        .empty strong {
          display: block;

          margin-top:
            10px;

          color: #44515c;

          font-size:
            11px;
        }

        .empty p {
          margin:
            6px 0 0;

          color: #8c969f;

          font-size:
            8px;
        }

        @media (
          max-width:
            900px
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
          max-width:
            600px
        ) {
          .topbar {
            padding:
              10px 0;

            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .nav {
            width: 100%;

            flex-wrap:
              wrap;
          }

          .shell {
            width:
              calc(
                100% - 24px
              );

            padding-top:
              32px;
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
  saving,
  tracking,
  setTracking,
  onStatusChange,
  onSaveTracking,
}: {
  order: OrderRow;

  saving: boolean;

  tracking: string;

  setTracking: (
    value: string
  ) => void;

  onStatusChange: (
    status:
      OrderStatus
  ) => void;

  onSaveTracking:
    () => void;
}) {
  const status =
    normalizeStatus(
      order.status
    );

  const currentIndex =
    STATUS_ORDER.indexOf(
      status
    );

  const icon =
    order.product_id ===
    "sticker"
      ? "🔳"
      : "🏷️";

  return (
    <article className="card">
      <div className="cardHeader">
        <div className="orderTitle">
          <div className="productIcon">
            {icon}
          </div>

          <div>
            <span>
              ORDER
            </span>

            <strong>
              #{order.id}
            </strong>

            <p>
              {formatDate(
                order.created_at
              )}
            </p>
          </div>
        </div>

        <span
          className={`status ${status}`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <div className="productBox">
        <div className="productName">
          <span>
            PRODUCT
          </span>

          <strong>
            {order.product_name ||
              "QR Product"}
          </strong>

          <small>
            {order.product_type ||
              "—"}
          </small>
        </div>

        <Info
          label="SKU"
          value={
            order.sku ||
            "—"
          }
        />

        <Info
          label="QUANTITY"
          value={String(
            order.quantity ||
              1
          )}
        />

        <Info
          label="UNIT PRICE"
          value={formatMoney(
            order.unit_price,
            order.currency
          )}
        />

        <Info
          label="TOTAL"
          value={formatMoney(
            order.total_amount,
            order.currency
          )}
        />
      </div>

      <div className="customerGrid">
        <Info
          label="CUSTOMER"
          value={
            order.shipping_name ||
            "—"
          }
        />

        <Info
          label="USER ID"
          value={
            order.user_id ||
            "—"
          }
        />

        <Info
          label="ORDER DATE"
          value={formatDate(
            order.created_at
          )}
        />
      </div>

      <div className="address">
        <span>
          SHIPPING ADDRESS
        </span>

        <strong>
          {order.shipping_address ||
            "—"}
        </strong>
      </div>

      {status !==
        "cancelled" && (
        <div className="progress">
          {STATUS_ORDER.map(
            (
              step,
              index
            ) => {
              const completed =
                currentIndex >=
                index;

              const active =
                status ===
                step;

              return (
                <div
                  key={step}
                  className="progressItem"
                >
                  <div
                    className={
                      active
                        ? "dot active"
                        : completed
                        ? "dot complete"
                        : "dot"
                    }
                  >
                    {completed &&
                    !active
                      ? "✓"
                      : index +
                        1}
                  </div>

                  <span>
                    {step}
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
          ✕ ORDER CANCELLED
        </div>
      )}

      <div className="shipping">
        <div className="tracking">
          <label>
            TRACKING NUMBER
          </label>

          <div className="trackingRow">
            <input
              value={
                tracking
              }
              onChange={(
                event
              ) =>
                setTracking(
                  event.target
                    .value
                )
              }
              placeholder="Optional"
            />

            <button
              type="button"
              disabled={
                saving
              }
              onClick={
                onSaveTracking
              }
            >
              Save
            </button>
          </div>

          <small>
            Leave blank if
            you ship by mail
            without tracking.
          </small>
        </div>

        <div className="actions">
          <label>
            CHANGE STATUS
          </label>

          <select
            value={status}
            disabled={
              saving
            }
            onChange={(
              event
            ) =>
              onStatusChange(
                event.target
                  .value as OrderStatus
              )
            }
          >
            <option value="pending">
              Pending
            </option>

            <option value="paid">
              Paid
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <button
            type="button"
            className="shipButton"
            disabled={
              saving ||
              status ===
                "shipped" ||
              status ===
                "delivered"
            }
            onClick={() =>
              onStatusChange(
                "shipped"
              )
            }
          >
            {saving
              ? "Saving..."
              : "Mark as Shipped"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .card {
          padding: 18px;

          border:
            1px solid
            #dfe4e8;

          border-radius:
            14px;

          background:
            white;
        }

        .cardHeader {
          display: flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap: 15px;
        }

        .orderTitle {
          display: flex;

          align-items:
            center;

          gap: 11px;

          min-width: 0;
        }

        .productIcon {
          width: 48px;

          height: 48px;

          flex:
            0 0 48px;

          display: grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            #eef4ff;

          font-size:
            21px;
        }

        .orderTitle span {
          color: #7655f7;

          font-size:
            6px;

          font-weight:
            900;
        }

        .orderTitle strong {
          display: block;

          margin-top:
            3px;

          overflow:
            hidden;

          color: #35414c;

          font-size:
            9px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .orderTitle p {
          margin:
            4px 0 0;

          color: #929ca5;

          font-size:
            7px;
        }

        .status {
          padding:
            6px 9px;

          border-radius:
            999px;

          font-size:
            6px;

          font-weight:
            900;
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

        .productBox {
          margin-top:
            17px;

          padding: 14px;

          display: grid;

          grid-template-columns:
            1.5fr
            repeat(
              4,
              minmax(
                0,
                1fr
              )
            );

          gap: 12px;

          border-radius:
            11px;

          background:
            #f2f6ff;
        }

        .productName {
          min-width: 0;
        }

        .productName span,
        .productName strong,
        .productName small {
          display: block;
        }

        .productName span {
          color: #7f8c97;

          font-size:
            6px;

          font-weight:
            900;
        }

        .productName strong {
          margin-top:
            5px;

          color: #35414c;

          font-size:
            9px;
        }

        .productName small {
          margin-top:
            4px;

          overflow:
            hidden;

          color: #8e98a1;

          font-size:
            6px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .customerGrid {
          margin-top:
            12px;

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

          gap: 12px;

          border-radius:
            10px;

          background:
            #f8fafb;
        }

        .address {
          margin-top:
            14px;
        }

        .address span,
        .address strong {
          display: block;
        }

        .address span {
          color: #929ca5;

          font-size:
            6px;

          font-weight:
            900;
        }

        .address strong {
          margin-top:
            5px;

          color: #56626d;

          font-size:
            8px;

          line-height:
            1.5;
        }

        .progress {
          margin-top:
            20px;

          padding:
            17px 5px;

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
            1px solid
            #edf0f2;

          border-bottom:
            1px solid
            #edf0f2;
        }

        .progressItem {
          position:
            relative;

          display: flex;

          flex-direction:
            column;

          align-items:
            center;

          gap: 6px;

          color: #929ca5;

          font-size:
            6px;

          text-transform:
            capitalize;
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
              50% + 16px
            );

          width:
            calc(
              100% - 32px
            );

          height: 1px;

          background:
            #dfe4e8;
        }

        .dot {
          position:
            relative;

          z-index: 2;

          width: 27px;

          height: 27px;

          display: grid;

          place-items:
            center;

          border:
            1px solid
            #d8dee3;

          border-radius:
            999px;

          color: #929ca5;

          background:
            white;

          font-size:
            7px;

          font-weight:
            900;
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
          margin-top:
            17px;

          padding:
            12px;

          border:
            1px solid
            #fecdca;

          border-radius:
            9px;

          color: #b42318;

          background:
            #fff1f0;

          font-size:
            8px;

          font-weight:
            900;
        }

        .shipping {
          margin-top:
            17px;

          display: grid;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            290px;

          gap: 20px;
        }

        .tracking label,
        .actions label {
          display: block;

          margin-bottom:
            6px;

          color: #929ca5;

          font-size:
            6px;

          font-weight:
            900;
        }

        .trackingRow {
          display: grid;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            auto;

          gap: 6px;
        }

        .trackingRow input,
        .actions select {
          width: 100%;

          min-height:
            38px;

          padding:
            0 10px;

          border:
            1px solid
            #d7dde2;

          border-radius:
            8px;

          outline: none;

          color: #44515c;

          background:
            white;

          font-size:
            8px;
        }

        .trackingRow button {
          min-height:
            38px;

          padding:
            0 12px;

          border: 0;

          border-radius:
            8px;

          color: white;

          background:
            #202b37;

          cursor: pointer;

          font-size:
            7px;

          font-weight:
            900;
        }

        .tracking small {
          display: block;

          margin-top:
            5px;

          color: #969fa7;

          font-size:
            6px;
        }

        .actions {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          align-items:
            end;

          gap: 6px;
        }

        .actions label {
          grid-column:
            1 / -1;

          margin-bottom:
            0;
        }

        .shipButton {
          min-height:
            38px;

          padding:
            0 9px;

          border: 0;

          border-radius:
            8px;

          color: white;

          background:
            #1465e8;

          cursor: pointer;

          font-size:
            7px;

          font-weight:
            900;
        }

        button:disabled,
        select:disabled {
          opacity: 0.55;

          cursor:
            not-allowed;
        }

        @media (
          max-width:
            900px
        ) {
          .productBox {
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
          max-width:
            750px
        ) {
          .customerGrid {
            grid-template-columns:
              1fr;
          }

          .shipping {
            grid-template-columns:
              1fr;
          }
        }

        @media (
          max-width:
            520px
        ) {
          .cardHeader {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .productBox {
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

          .actions {
            grid-template-columns:
              1fr;
          }

          .actions label {
            grid-column:
              auto;
          }
        }
      `}</style>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="info">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .info {
          min-width: 0;
        }

        span {
          display: block;

          color: #929ca5;

          font-size:
            6px;

          font-weight:
            900;
        }

        strong {
          display: block;

          margin-top:
            5px;

          overflow:
            hidden;

          color: #4c5964;

          font-size:
            8px;

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
          min-height:
            82px;

          padding:
            13px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            11px;

          background:
            white;
        }

        span {
          color: #929ca5;

          font-size:
            6px;

          font-weight:
            900;
        }

        strong {
          display: block;

          margin-top:
            13px;

          color: #293540;

          font-size:
            20px;
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

  onClick:
    () => void;

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
          min-height:
            31px;

          padding:
            0 10px;

          border:
            1px solid
            #dce2e6;

          border-radius:
            999px;

          color: #66727d;

          background:
            white;

          cursor: pointer;

          font-size:
            7px;

          font-weight:
            850;
        }

        .filter.active {
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
  value?:
    | string
    | null
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
    status ===
    "shipped"
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

function formatMoney(
  amount:
    | number
    | null,
  currency:
    | string
    | null
) {
  if (
    amount === null ||
    amount ===
      undefined
  ) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      "en-US",
      {
        style:
          "currency",

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
  value:
    | string
    | null
) {
  if (!value) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        year:
          "numeric",

        month:
          "short",

        day:
          "numeric",

        hour:
          "numeric",

        minute:
          "2-digit",
      }
    ).format(
      new Date(value)
    );
  } catch {
    return value;
  }
}
