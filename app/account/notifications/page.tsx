"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  read: boolean;

  metadata: Record<
    string,
    unknown
  > | null;

  created_at: string;
};

type Lang =
  | "ka"
  | "en";

export default function AccountNotificationsPage() {
  const router =
    useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [
    notifications,
    setNotifications,
  ] = useState<
    NotificationRow[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" |
      "unread" |
      "scan" |
      "location"
    >("all");

  const ka =
    lang === "ka";

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
        error,
      } =
        await supabase
          .from("notifications")
          .select(`
            id,
            user_id,
            type,
            title,
            message,
            item_id,
            read,
            metadata,
            created_at
          `)
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          );

      if (error) {
        throw error;
      }

      setNotifications(
        (data || []) as NotificationRow[]
      );
    } catch (err) {
      console.error(
        "Account notifications error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შეტყობინებების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  async function markRead(
    id: string
  ) {
    const {
      error,
    } =
      await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq(
          "id",
          id
        );

    if (error) {
      console.error(error);
      return;
    }

    setNotifications(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  read: true,
                }
              : item
        )
    );
  }

  async function markAllRead() {
    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const {
      error,
    } =
      await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "read",
          false
        );

    if (error) {
      console.error(error);
      return;
    }

    setNotifications(
      (current) =>
        current.map(
          (item) => ({
            ...item,
            read: true,
          })
        )
    );
  }

  const filtered =
    useMemo(() => {
      return notifications.filter(
        (notification) => {
          if (
            filter ===
            "unread"
          ) {
            return (
              !notification.read
            );
          }

          if (
            filter ===
            "scan"
          ) {
            return (
              notification.type ===
              "scan"
            );
          }

          if (
            filter ===
            "location"
          ) {
            return (
              notification.type ===
              "location"
            );
          }

          return true;
        }
      );
    }, [
      notifications,
      filter,
    ]);

  const unreadCount =
    notifications.filter(
      (item) =>
        !item.read
    ).length;

  if (loading) {
    return (
      <main className="loading">
        {ka
          ? "შეტყობინებები იტვირთება..."
          : "Loading notifications..."}

        <style jsx>{`
          .loading {
            min-height:
              100vh;

            display:
              grid;

            place-items:
              center;

            color:
              #697581;

            background:
              #f5f7f8;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="language">
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

      <div className="shell">
        <Link
          href="/my-profiles"
          className="back"
        >
          ←{" "}
          {ka
            ? "ჩემი პროფილები"
            : "My Profiles"}
        </Link>

        <header className="header">
          <div>
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              {ka
                ? "შეტყობინებები"
                : "Notifications"}
            </h1>

            <p>
              {ka
                ? "აქ გამოჩნდება QR Scan, Emergency Location და სხვა მნიშვნელოვანი მოვლენები."
                : "QR scans, Emergency locations, and other important events appear here."}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              className="markAll"
              onClick={() =>
                void markAllRead()
              }
            >
              {ka
                ? "ყველას წაკითხულად მონიშვნა"
                : "Mark all read"}
            </button>
          )}
        </header>

        <section className="stats">
          <Stat
            label={
              ka
                ? "ყველა"
                : "Total"
            }
            value={
              notifications.length
            }
          />

          <Stat
            label={
              ka
                ? "წაუკითხავი"
                : "Unread"
            }
            value={
              unreadCount
            }
          />

          <Stat
            label="QR SCANS"
            value={
              notifications.filter(
                (item) =>
                  item.type ===
                  "scan"
              ).length
            }
          />

          <Stat
            label="LOCATIONS"
            value={
              notifications.filter(
                (item) =>
                  item.type ===
                  "location"
              ).length
            }
          />
        </section>

        <section className="filters">
          <Filter
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
          </Filter>

          <Filter
            active={
              filter ===
              "unread"
            }
            onClick={() =>
              setFilter(
                "unread"
              )
            }
          >
            {ka
              ? "წაუკითხავი"
              : "Unread"}
          </Filter>

          <Filter
            active={
              filter === "scan"
            }
            onClick={() =>
              setFilter("scan")
            }
          >
            📱 Scan
          </Filter>

          <Filter
            active={
              filter ===
              "location"
            }
            onClick={() =>
              setFilter(
                "location"
              )
            }
          >
            📍 Location
          </Filter>
        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!error &&
          filtered.length ===
            0 && (
            <section className="empty">
              <div>
                🔔
              </div>

              <strong>
                {ka
                  ? "შეტყობინებები ჯერ არ არის"
                  : "No notifications yet"}
              </strong>

              <p>
                {ka
                  ? "როდესაც თქვენი QR დაასკანერდება ან ლოკაცია გაზიარდება, ინფორმაცია აქ გამოჩნდება."
                  : "When your QR is scanned or a location is shared, it will appear here."}
              </p>
            </section>
          )}

        {!error &&
          filtered.length >
            0 && (
            <section className="list">
              {filtered.map(
                (
                  notification
                ) => (
                  <NotificationCard
                    key={
                      notification.id
                    }
                    notification={
                      notification
                    }
                    language={
                      lang
                    }
                    onRead={
                      markRead
                    }
                  />
                )
              )}
            </section>
          )}
      </div>

      <style jsx>{`
        .page {
          min-height:
            100vh;

          padding:
            45px 0 90px;

          position:
            relative;

          background:
            #f5f7f8;
        }

        .shell {
          width:
            calc(
              100% - 40px
            );

          max-width:
            900px;

          margin:
            0 auto;
        }

        .language {
          position:
            fixed;

          top:
            18px;

          right:
            20px;

          z-index:
            20;

          display:
            flex;

          gap:
            4px;

          padding:
            4px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            999px;

          background:
            white;
        }

        .language button {
          min-width:
            38px;

          height:
            27px;

          border:
            0;

          border-radius:
            999px;

          color:
            #89939d;

          background:
            transparent;

          cursor:
            pointer;

          font-size:
            7px;

          font-weight:
            900;
        }

        .language
          button.active {
          color:
            white;

          background:
            #202b37;
        }

        .back {
          display:
            inline-block;

          margin-bottom:
            25px;

          color:
            #697581;

          text-decoration:
            none;

          font-size:
            9px;

          font-weight:
            800;
        }

        .header {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            25px;
        }

        .eyebrow {
          color:
            #c84a50;

          font-size:
            8px;

          font-weight:
            900;

          letter-spacing:
            1.4px;
        }

        h1 {
          margin:
            7px 0 0;

          color:
            #202b37;

          font-size:
            clamp(
              35px,
              4vw,
              46px
            );

          letter-spacing:
            -1.8px;
        }

        .header p {
          max-width:
            650px;

          margin:
            9px 0 0;

          color:
            #78838e;

          font-size:
            10px;

          line-height:
            1.7;
        }

        .markAll {
          min-height:
            40px;

          padding:
            0 12px;

          border:
            1px solid
            #dce2e6;

          border-radius:
            9px;

          color:
            #53606c;

          background:
            white;

          cursor:
            pointer;

          font-size:
            8px;

          font-weight:
            850;
        }

        .stats {
          margin-top:
            30px;

          display:
            grid;

          grid-template-columns:
            repeat(
              4,
              minmax(
                0,
                1fr
              )
            );

          gap:
            9px;
        }

        .filters {
          margin-top:
            22px;

          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            6px;
        }

        .list {
          margin-top:
            22px;

          display:
            grid;

          gap:
            9px;
        }

        .error {
          margin-top:
            20px;

          padding:
            14px;

          border:
            1px solid
            #edd3d5;

          border-radius:
            10px;

          color:
            #9d3f45;

          background:
            #fff5f5;

          font-size:
            9px;
        }

        .empty {
          margin-top:
            25px;

          padding:
            55px 20px;

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
          display:
            block;

          margin-top:
            12px;

          color:
            #3d4954;

          font-size:
            12px;
        }

        .empty p {
          max-width:
            500px;

          margin:
            7px auto 0;

          color:
            #89939d;

          font-size:
            9px;

          line-height:
            1.6;
        }

        @media (
          max-width:
            700px
        ) {
          .header {
            align-items:
              stretch;

            flex-direction:
              column;
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

        @media (
          max-width:
            480px
        ) {
          .shell {
            width:
              calc(
                100% - 24px
              );
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

function NotificationCard({
  notification,
  language,
  onRead,
}: {
  notification:
    NotificationRow;

  language: Lang;

  onRead: (
    id: string
  ) => Promise<void>;
}) {
  const ka =
    language === "ka";

  const metadata =
    notification.metadata ||
    {};

  const latitude =
    typeof metadata.latitude ===
    "number"
      ? metadata.latitude
      : null;

  const longitude =
    typeof metadata.longitude ===
    "number"
      ? metadata.longitude
      : null;

  const mapUrl =
    latitude !== null &&
    longitude !== null
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

  return (
    <article
      className={
        notification.read
          ? "card"
          : "card unread"
      }
      onClick={() => {
        if (
          !notification.read
        ) {
          void onRead(
            notification.id
          );
        }
      }}
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

          {!notification.read && (
            <i>
              NEW
            </i>
          )}
        </div>

        {notification.message && (
          <p>
            {
              notification.message
            }
          </p>
        )}

        <div className="bottom">
          <small>
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </small>

          <div className="actions">
            {notification.item_id && (
              <Link
                href="/my-profiles"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {ka
                  ? "პროფილი"
                  : "Profile"}
                {" →"}
              </Link>
            )}

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                📍{" "}
                {ka
                  ? "რუკაზე ნახვა"
                  : "Open Map"}
              </a>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          padding:
            15px;

          display:
            grid;

          grid-template-columns:
            auto
            minmax(
              0,
              1fr
            );

          gap:
            12px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            12px;

          background:
            white;

          cursor:
            pointer;
        }

        .unread {
          border-left:
            3px solid
            #c84a50;

          background:
            #fffdfd;
        }

        .icon {
          width:
            42px;

          height:
            42px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            #f1f4f6;

          font-size:
            18px;
        }

        .content {
          min-width:
            0;
        }

        .top {
          display:
            flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          gap:
            15px;
        }

        .top span,
        .top strong {
          display:
            block;
        }

        .top span {
          color:
            #c84a50;

          font-size:
            6px;

          font-weight:
            900;

          letter-spacing:
            0.7px;
        }

        .top strong {
          margin-top:
            4px;

          color:
            #35414c;

          font-size:
            11px;
        }

        i {
          padding:
            4px 6px;

          border-radius:
            999px;

          color:
            white;

          background:
            #c84a50;

          font-size:
            5px;

          font-style:
            normal;

          font-weight:
            900;
        }

        p {
          margin:
            7px 0 0;

          color:
            #737e89;

          font-size:
            9px;

          line-height:
            1.6;
        }

        .bottom {
          margin-top:
            11px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          flex-wrap:
            wrap;

          gap:
            8px;
        }

        small {
          color:
            #969fa8;

          font-size:
            7px;
        }

        .actions {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            6px;
        }

        .actions
          :global(a) {
          min-height:
            29px;

          padding:
            0 8px;

          display:
            flex;

          align-items:
            center;

          border:
            1px solid
            #dce2e6;

          border-radius:
            7px;

          color:
            #53606c;

          background:
            white;

          text-decoration:
            none;

          font-size:
            7px;

          font-weight:
            850;
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
          min-height:
            91px;

          padding:
            14px;

          border:
            1px solid
            #e0e5e8;

          border-radius:
            12px;

          background:
            white;
        }

        span {
          color:
            #959fa8;

          font-size:
            7px;

          font-weight:
            900;
        }

        strong {
          display:
            block;

          margin-top:
            15px;

          color:
            #293540;

          font-size:
            22px;
        }
      `}</style>
    </div>
  );
}

function Filter({
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
          min-height:
            31px;

          padding:
            0 10px;

          border:
            1px solid
            #dce2e6;

          border-radius:
            999px;

          color:
            #66727d;

          background:
            white;

          cursor:
            pointer;

          font-size:
            7px;

          font-weight:
            850;
        }

        .active {
          color:
            white;

          border-color:
            #202b37;

          background:
            #202b37;
        }
      `}</style>
    </button>
  );
}

function getIcon(
  type: string
) {
  const icons:
    Record<
      string,
      string
    > = {
      scan: "📱",
      location: "📍",
      chat: "💬",
      support: "🎧",
      order: "🛒",
      system: "🔔",
    };

  return (
    icons[type] ||
    "🔔"
  );
}
