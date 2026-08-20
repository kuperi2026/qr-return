"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type NotificationRow = {
  id: string;
  user_id: string | null;

  type: string;

  title: string;
  message: string | null;

  item_id: string | null;
  order_id: string | null;

  read: boolean;

  metadata: Record<string, unknown>;

  created_at: string;
};

const filters = [
  "all",
  "unread",
  "scan",
  "chat",
  "location",
  "order",
  "support",
  "system",
];

export default function AdminNotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] =
    useState<NotificationRow[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  useEffect(() => {
    void loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      const {
        data: admin,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) {
        throw adminError;
      }

      if (!admin) {
        setError("Admin Access Required");
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(500);

      if (error) {
        throw error;
      }

      setNotifications(
        (data || []) as NotificationRow[]
      );
    } catch (err) {
      console.error(
        "Notifications error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Notifications-ის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markRead(
    id: string,
    read: boolean
  ) {
    const { error } =
      await supabase
        .from("notifications")
        .update({
          read,
        })
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read,
            }
          : item
      )
    );
  }

  async function markAllRead() {
    const { error } =
      await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq("read", false);

    if (error) {
      alert(error.message);
      return;
    }

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  }

  async function removeNotification(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Delete this notification?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setNotifications((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  const filtered =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return notifications.filter(
        (notification) => {
          const filterMatch =
            filter === "all"
              ? true
              : filter === "unread"
              ? !notification.read
              : notification.type === filter;

          const text = [
            notification.title,
            notification.message,
            notification.type,
            notification.user_id,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          const searchMatch =
            !q ||
            text.includes(q);

          return (
            filterMatch &&
            searchMatch
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  const unreadCount =
    notifications.filter(
      (item) => !item.read
    ).length;

  if (loading) {
    return (
      <main className="state">
        Notifications იტვირთება...

        <style jsx>{`
          .state {
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: #f5f7f8;
            color: #697581;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="shell">
        <header>
          <div>
            <Link
              href="/admin"
              className="back"
            >
              ← Admin Control Center
            </Link>

            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>
              Notifications
            </h1>

            <p>
              QR Scan, Chat, Location,
              Orders, Support და სისტემური
              მოვლენები ერთ სივრცეში.
            </p>
          </div>

          <div className="headerActions">
            <button
              type="button"
              onClick={() =>
                void loadNotifications()
              }
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={() =>
                void markAllRead()
              }
            >
              Mark all read
            </button>
          </div>
        </header>

        <section className="stats">
          <Stat
            label="TOTAL"
            value={
              notifications.length
            }
          />

          <Stat
            label="UNREAD"
            value={unreadCount}
          />

          <Stat
            label="SCANS"
            value={
              notifications.filter(
                (n) =>
                  n.type === "scan"
              ).length
            }
          />

          <Stat
            label="ORDERS"
            value={
              notifications.filter(
                (n) =>
                  n.type === "order"
              ).length
            }
          />
        </section>

        <section className="controls">
          <div className="search">
            <SearchIcon />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search notifications..."
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                ×
              </button>
            )}
          </div>

          <div className="filters">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  filter === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!error && (
          <>
            <div className="resultHeader">
              <span>
                RESULTS
              </span>

              <strong>
                {filtered.length}
              </strong>
            </div>

            {filtered.length === 0 ? (
              <div className="empty">
                Notifications ჯერ არ არის.
              </div>
            ) : (
              <div className="list">
                {filtered.map(
                  (notification) => (
                    <NotificationCard
                      key={
                        notification.id
                      }
                      notification={
                        notification
                      }
                      onRead={
                        markRead
                      }
                      onDelete={
                        removeNotification
                      }
                    />
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 48px 0 90px;
          background: #f5f7f8;
        }

        .shell {
          width: calc(100% - 40px);
          max-width: 1120px;
          margin: auto;
        }

        header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
        }

        .back {
          display: inline-block;
          margin-bottom: 22px;
          color: #697581;
          font-size: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .eyebrow {
          display: block;
          color: #c84a50;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 7px 0 0;
          color: #202b37;
          font-size: 44px;
          letter-spacing: -1.8px;
        }

        header p {
          max-width: 600px;
          margin: 8px 0 0;
          color: #7c8792;
          font-size: 10px;
          line-height: 1.65;
        }

        .headerActions {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .headerActions button {
          min-height: 39px;
          padding: 0 12px;
          border: 1px solid #dce2e6;
          border-radius: 9px;
          background: white;
          cursor: pointer;
          font-size: 8px;
          font-weight: 850;
        }

        .stats {
          margin-top: 30px;
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 10px;
        }

        .controls {
          margin-top: 22px;
          display: grid;
          gap: 11px;
        }

        .search {
          min-height: 50px;
          padding: 0 14px;
          display: grid;
          grid-template-columns:
            auto 1fr auto;
          align-items: center;
          gap: 10px;
          border: 1px solid #dfe4e8;
          border-radius: 12px;
          background: white;
        }

        .search input {
          border: 0;
          outline: 0;
          background: transparent;
        }

        .search button {
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 18px;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .filters button {
          min-height: 30px;
          padding: 0 10px;
          border: 1px solid #dce2e6;
          border-radius: 999px;
          background: white;
          cursor: pointer;
          font-size: 7px;
          font-weight: 850;
          text-transform: capitalize;
        }

        .filters button.active {
          color: white;
          border-color: #202b37;
          background: #202b37;
        }

        .resultHeader {
          margin-top: 29px;
          padding-bottom: 9px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #dfe4e8;
        }

        .resultHeader span {
          color: #98a1a9;
          font-size: 7px;
          font-weight: 900;
        }

        .resultHeader strong {
          color: #53606c;
          font-size: 9px;
        }

        .list {
          margin-top: 12px;
          display: grid;
          gap: 9px;
        }

        .error,
        .empty {
          margin-top: 20px;
          padding: 25px;
          border: 1px solid #e0e5e8;
          border-radius: 13px;
          background: white;
        }

        .error {
          color: #9c4045;
        }

        .empty {
          color: #7b8691;
          text-align: center;
        }

        @media(max-width:700px) {
          header {
            align-items: stretch;
            flex-direction: column;
          }

          .stats {
            grid-template-columns:
              repeat(2, 1fr);
          }
        }
      `}</style>
    </main>
  );
}

function NotificationCard({
  notification,
  onRead,
  onDelete,
}: {
  notification: NotificationRow;

  onRead: (
    id: string,
    read: boolean
  ) => Promise<void>;

  onDelete: (
    id: string
  ) => Promise<void>;
}) {
  return (
    <article
      className={
        notification.read
          ? "card"
          : "card unread"
      }
    >
      <div className="icon">
        {getIcon(
          notification.type
        )}
      </div>

      <div className="content">
        <div className="top">
          <div>
            <span>
              {notification.type.toUpperCase()}
            </span>

            <strong>
              {notification.title}
            </strong>
          </div>

          <small>
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </small>
        </div>

        {notification.message && (
          <p>
            {notification.message}
          </p>
        )}

        <div className="actions">
          <button
            type="button"
            onClick={() =>
              void onRead(
                notification.id,
                !notification.read
              )
            }
          >
            {notification.read
              ? "Mark unread"
              : "Mark read"}
          </button>

          {notification.item_id && (
            <Link
              href="/admin/items"
            >
              QR Profile →
            </Link>
          )}

          {notification.order_id && (
            <Link
              href="/admin/orders"
            >
              Order →
            </Link>
          )}

          <button
            type="button"
            className="delete"
            onClick={() =>
              void onDelete(
                notification.id
              )
            }
          >
            Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        .card {
          padding: 15px;
          display: grid;
          grid-template-columns:
            auto 1fr;
          gap: 12px;
          border: 1px solid #e0e5e8;
          border-radius: 12px;
          background: white;
        }

        .unread {
          border-left:
            3px solid #c84a50;
        }

        .icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f1f4f6;
          font-size: 17px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        .top span,
        .top strong {
          display: block;
        }

        .top span {
          color: #c84a50;
          font-size: 6px;
          font-weight: 900;
        }

        .top strong {
          margin-top: 4px;
          color: #35414c;
          font-size: 11px;
        }

        small {
          color: #969fa8;
          font-size: 7px;
        }

        p {
          margin: 7px 0 0;
          color: #737e89;
          font-size: 9px;
          line-height: 1.6;
        }

        .actions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .actions button,
        .actions :global(a) {
          min-height: 30px;
          padding: 0 9px;
          display: flex;
          align-items: center;
          border: 1px solid #dce2e6;
          border-radius: 7px;
          color: #53606c;
          background: white;
          cursor: pointer;
          text-decoration: none;
          font-size: 7px;
          font-weight: 800;
        }

        .delete {
          color: #a33f45 !important;
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
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .stat {
          min-height: 92px;
          padding: 14px;
          border: 1px solid #e0e5e8;
          border-radius: 12px;
          background: white;
        }

        span {
          color: #959fa8;
          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;
          margin-top: 15px;
          color: #293540;
          font-size: 22px;
        }
      `}</style>
    </div>
  );
}

function getIcon(
  type: string
) {
  const icons: Record<
    string,
    string
  > = {
    scan: "📱",
    chat: "💬",
    location: "📍",
    order: "🛒",
    support: "🎧",
    system: "⚙️",
  };

  return icons[type] || "🔔";
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="6"
      />

      <path d="m15 15 5 5" />
    </svg>
  );
}
