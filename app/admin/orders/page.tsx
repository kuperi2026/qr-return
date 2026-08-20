"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  product_id: string;
  quantity: number;

  first_name: string;
  last_name: string;

  phone: string;
  secondary_phone: string | null;
  email: string | null;

  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state_region: string;
  postal_code: string;
  country: string;

  note: string | null;

  status: string;
  payment_status: string;
  tracking_number: string | null;

  created_at: string;
};

const statuses = [
  "pending",
  "confirmed",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [savingId, setSavingId] =
    useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError("");

    const { data, error } =
      await supabase
        .from("orders")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    setOrders(
      (data || []) as Order[]
    );

    setLoading(false);
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    setSavingId(id);

    const { error } =
      await supabase
        .from("orders")
        .update({
          status,
        })
        .eq("id", id);

    if (error) {
      alert(error.message);
      setSavingId(null);
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
      )
    );

    setSavingId(null);
  }

  async function updateTracking(
    id: string,
    trackingNumber: string
  ) {
    setSavingId(id);

    const { error } =
      await supabase
        .from("orders")
        .update({
          tracking_number:
            trackingNumber.trim() ||
            null,
        })
        .eq("id", id);

    if (error) {
      alert(error.message);
    }

    setSavingId(null);
  }

  if (loading) {
    return (
      <main className="state">
        Loading orders...
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <header>
          <div>
            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>
              Orders
            </h1>

            <p>
              Manage QR RETURN
              customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
          >
            Refresh
          </button>
        </header>

        <div className="stats">
          <Stat
            label="TOTAL"
            value={orders.length}
          />

          <Stat
            label="PENDING"
            value={
              orders.filter(
                (o) =>
                  o.status ===
                  "pending"
              ).length
            }
          />

          <Stat
            label="PROCESSING"
            value={
              orders.filter(
                (o) =>
                  o.status ===
                  "processing"
              ).length
            }
          />

          <Stat
            label="SHIPPED"
            value={
              orders.filter(
                (o) =>
                  o.status ===
                  "shipped"
              ).length
            }
          />
        </div>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty">
            <strong>
              No orders yet
            </strong>

            <p>
              New customer orders
              will appear here.
            </p>
          </div>
        ) : (
          <div className="orders">
            {orders.map(
              (order) => (
                <article
                  key={order.id}
                  className="order"
                >
                  <div className="top">
                    <div>
                      <span className="orderId">
                        ORDER
                      </span>

                      <strong>
                        {order.first_name}{" "}
                        {order.last_name}
                      </strong>

                      <small>
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </small>
                    </div>

                    <select
                      value={
                        order.status
                      }
                      disabled={
                        savingId ===
                        order.id
                      }
                      onChange={(
                        event
                      ) =>
                        updateStatus(
                          order.id,
                          event.target
                            .value
                        )
                      }
                    >
                      {statuses.map(
                        (status) => (
                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="grid">
                    <Info
                      label="PRODUCT"
                      value={`${order.product_id} × ${order.quantity}`}
                    />

                    <Info
                      label="PHONE"
                      value={
                        order.phone
                      }
                    />

                    <Info
                      label="ADDITIONAL PHONE"
                      value={
                        order.secondary_phone ||
                        "—"
                      }
                    />

                    <Info
                      label="EMAIL"
                      value={
                        order.email ||
                        "—"
                      }
                    />

                    <Info
                      label="PAYMENT"
                      value={
                        order.payment_status
                      }
                    />

                    <Info
                      label="COUNTRY"
                      value={
                        order.country
                      }
                    />
                  </div>

                  <div className="address">
                    <span>
                      SHIPPING ADDRESS
                    </span>

                    <strong>
                      {
                        order.address_line_1
                      }

                      {order.address_line_2
                        ? `, ${order.address_line_2}`
                        : ""}

                      <br />

                      {order.city},{" "}
                      {
                        order.state_region
                      }{" "}
                      {
                        order.postal_code
                      }

                      <br />

                      {order.country}
                    </strong>
                  </div>

                  {order.note && (
                    <div className="note">
                      <span>
                        CUSTOMER NOTE
                      </span>

                      <p>
                        {order.note}
                      </p>
                    </div>
                  )}

                  <div className="tracking">
                    <label>
                      <span>
                        TRACKING NUMBER
                      </span>

                      <input
                        defaultValue={
                          order.tracking_number ||
                          ""
                        }
                        placeholder="Enter tracking number"
                        onBlur={(
                          event
                        ) =>
                          updateTracking(
                            order.id,
                            event.target
                              .value
                          )
                        }
                      />
                    </label>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 55px 0 90px;
          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1150px;
          margin: 0 auto;
        }

        header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .eyebrow {
          color: #c84a50;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 7px 0 0;
          color: #202b37;
          font-size: 40px;
          letter-spacing: -1.8px;
        }

        header p {
          margin: 7px 0 0;
          color: #7b8690;
          font-size: 10px;
        }

        header button {
          height: 39px;
          padding: 0 14px;
          border: 0;
          border-radius: 9px;
          color: white;
          background: #202b37;
          cursor: pointer;
          font-weight: 800;
        }

        .stats {
          margin-top: 30px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 10px;
        }

        .orders {
          margin-top: 22px;
          display: grid;
          gap: 14px;
        }

        .order {
          padding: 20px;
          border: 1px solid #e0e5e8;
          border-radius: 15px;
          background: white;
        }

        .top {
          display: flex;
          justify-content:
            space-between;
          gap: 20px;
          padding-bottom: 16px;
          border-bottom:
            1px solid #e7eaed;
        }

        .orderId {
          display: block;
          color: #c84a50;
          font-size: 7px;
          font-weight: 900;
        }

        .top strong {
          display: block;
          margin-top: 5px;
          color: #303c47;
          font-size: 15px;
        }

        .top small {
          display: block;
          margin-top: 4px;
          color: #9aa2aa;
          font-size: 8px;
        }

        select {
          height: 36px;
          padding: 0 10px;
          border: 1px solid #dce2e6;
          border-radius: 8px;
          background: white;
          font-size: 9px;
        }

        .grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 17px;
        }

        .address,
        .note,
        .tracking {
          margin-top: 18px;
          padding-top: 15px;
          border-top:
            1px solid #eceeef;
        }

        .address span,
        .note span,
        .tracking span {
          display: block;
          color: #9aa2aa;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.6px;
        }

        .address strong {
          display: block;
          margin-top: 6px;
          color: #505c67;
          font-size: 9px;
          line-height: 1.7;
        }

        .note p {
          margin: 6px 0 0;
          color: #68737e;
          font-size: 9px;
          line-height: 1.6;
        }

        .tracking input {
          width: 100%;
          max-width: 350px;
          height: 39px;
          margin-top: 7px;
          padding: 0 10px;
          border: 1px solid #dce2e6;
          border-radius: 8px;
          outline: 0;
        }

        .empty,
        .error {
          margin-top: 25px;
          padding: 30px;
          border-radius: 14px;
          background: white;
          text-align: center;
        }

        .error {
          color: #a63838;
        }

        .state {
          padding: 80px;
          text-align: center;
        }

        @media (max-width: 750px) {
          .stats,
          .grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }

        @media (max-width: 520px) {
          .stats,
          .grid {
            grid-template-columns:
              1fr;
          }

          header {
            align-items: stretch;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
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
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .stat {
          padding: 16px;
          border: 1px solid #e0e5e8;
          border-radius: 12px;
          background: white;
        }

        span {
          color: #969fa8;
          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;
          margin-top: 7px;
          color: #293540;
          font-size: 22px;
        }
      `}</style>
    </div>
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
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        span {
          display: block;
          color: #9aa2aa;
          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;
          margin-top: 5px;
          color: #505c67;
          font-size: 9px;
          overflow-wrap: anywhere;
        }
      `}</style>
    </div>
  );
}
