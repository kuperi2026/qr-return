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

type NotificationMetadata = {
  latitude?: number | null;
  longitude?: number | null;

  tag_code?: string | null;

  finder_session?: string | null;

  item_id?: number | string | null;

  source?: string | null;

  event?: string | null;

  profile_type?: string | null;
};

type NotificationRow = {
  id: string;

  user_id: string | null;

  type: string;

  title: string;

  message: string | null;

  item_id: string | null;

  order_id?: string | null;

  read: boolean;

  metadata: NotificationMetadata | null;

  created_at: string;
};

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

  const [
    filter,
    setFilter,
  ] = useState<
    | "all"
    | "unread"
    | "scan"
    | "location"
    | "chat"
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
        error: loadError,
      } = await supabase
        .from("notifications")
        .select(`
          id,
          user_id,
          type,
          title,
          message,
          item_id,
          order_id,
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
            ascending: false,
          }
        );

      if (loadError) {
        throw loadError;
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
      error: updateError,
    } = await supabase
      .from("notifications")
      .update({
        read: true,
      })
      .eq(
        "id",
        id
      );

    if (updateError) {
      console.error(
        "Mark read error:",
        updateError
      );

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
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return;
    }

    const {
      error: updateError,
    } = await supabase
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

    if (updateError) {
      console.error(
        "Mark all read error:",
        updateError
      );

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

  async function openChat(
    notification:
      NotificationRow
  ) {
    if (
      !notification.read
    ) {
      await markRead(
        notification.id
      );
    }

    const session =
      notification.metadata
        ?.finder_session;

    if (session) {
      router.push(
        `/account/messages?session=${encodeURIComponent(
          session
        )}`
      );

      return;
    }

    router.push(
      "/account/messages"
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

          if (
            filter ===
            "chat"
          ) {
            return (
              notification.type ===
              "chat"
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

  const scanCount =
    notifications.filter(
      (item) =>
        item.type === "scan"
    ).length;

  const locationCount =
    notifications.filter(
      (item) =>
        item.type ===
        "location"
    ).length;

  const chatCount =
    notifications.filter(
      (item) =>
        item.type === "chat"
    ).length;

  if (loading) {
    return (
      <main className="loading">
        <div className="loadingIcon">
          🔔
        </div>

        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "შეტყობინებები იტვირთება..."
            : "Loading notifications..."}
        </span>

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 8px;

            color: #737f8a;

            background: #f5f7f8;
          }

          .loadingIcon {
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
              NOTIFICATIONS
            </small>
          </span>
        </Link>

        <div className="topActions">
          <Link
            href="/account/messages"
          >
            💬 Live Chat
          </Link>

          <Link
            href="/my-profiles"
          >
            {ka
              ? "ჩემი პროფილები"
              : "My Profiles"}
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
                ? "შეტყობინებები"
                : "Notifications"}
            </h1>

            <p>
              {ka
                ? "QR Scan, ლოკაციის გაზიარება და Live Chat-ის ახალი შეტყობინებები ერთ ადგილას."
                : "QR scans, shared locations, and new Live Chat messages in one place."}
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
              ✓{" "}
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
              scanCount
            }
          />

          <Stat
            label="LOCATIONS"
            value={
              locationCount
            }
          />

          <Stat
            label="LIVE CHAT"
            value={
              chatCount
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
          </FilterButton>

          <FilterButton
            active={
              filter ===
              "scan"
            }
            onClick={() =>
              setFilter("scan")
            }
          >
            📱 Scan
          </FilterButton>

          <FilterButton
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
          </FilterButton>

          <FilterButton
            active={
              filter ===
              "chat"
            }
            onClick={() =>
              setFilter("chat")
            }
          >
            💬 Live Chat
          </FilterButton>
        </section>

        {error && (
          <div className="error">
            ⚠ {error}
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
                  ? "როდესაც QR დაასკანერდება, ლოკაცია გაზიარდება ან მპოვნელი Live Chat-ში მოგწერთ, ინფორმაცია აქ გამოჩნდება."
                  : "QR scans, shared locations, and finder Live Chat messages will appear here."}
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
                    onOpenChat={
                      openChat
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
            1px solid
            #e0e5e8;
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
            1px solid
            #dfe4e8;

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

          max-width: 900px;

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

          letter-spacing:
            1.2px;
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

        .markAll {
          min-height: 39px;

          padding:
            0 11px;

          flex: 0 0 auto;

          border:
            1px solid
            #dce2e6;

          border-radius: 9px;

          color: #53606c;

          background: white;

          cursor: pointer;

          font-size: 7px;

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
          margin-top: 21px;

          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .list {
          margin-top: 20px;

          display: grid;

          gap: 9px;
        }

        .error {
          margin-top: 20px;

          padding: 13px;

          border:
            1px solid
            #efd2d4;

          border-radius: 10px;

          color: #9d4146;

          background: #fff5f5;

          font-size: 8px;
        }

        .empty {
          margin-top: 25px;

          padding:
            55px 20px;

          border:
            1px solid
            #e0e5e8;

          border-radius: 15px;

          background: white;

          text-align: center;
        }

        .empty div {
          font-size: 30px;
        }

        .empty strong {
          display: block;

          margin-top: 12px;

          color: #3d4954;

          font-size: 12px;
        }

        .empty p {
          max-width: 500px;

          margin:
            7px auto 0;

          color: #89939d;

          font-size: 8px;

          line-height: 1.6;
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

          .markAll {
            align-self:
              flex-start;
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
  onOpenChat,
}: {
  notification:
    NotificationRow;

  language: Lang;

  onRead: (
    id: string
  ) => Promise<void>;

  onOpenChat: (
    notification:
      NotificationRow
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

  const isChat =
    notification.type ===
    "chat";

  async function handleCardClick() {
    if (
      isChat
    ) {
      await onOpenChat(
        notification
      );

      return;
    }

    if (
      !notification.read
    ) {
      await onRead(
        notification.id
      );
    }
  }

  return (
    <article
      className={
        notification.read
          ? "card"
          : "card unread"
      }
      onClick={() =>
        void handleCardClick()
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
              {getTypeLabel(
                notification.type
              )}
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
            {formatNotificationDate(
              notification.created_at,
              language
            )}
          </small>

          <div className="actions">
            {isChat && (
              <button
                type="button"
                className="chatButton"
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  void onOpenChat(
                    notification
                  );
                }}
              >
                💬{" "}
                {ka
                  ? "Live Chat-ის გახსნა"
                  : "Open Live Chat"}
              </button>
            )}

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(
                  event
                ) =>
                  event.stopPropagation()
                }
              >
                📍{" "}
                {ka
                  ? "რუკაზე ნახვა"
                  : "Open Map"}
              </a>
            )}

            {!isChat &&
              notification.item_id && (
                <Link
                  href="/my-profiles"
                  onClick={(
                    event
                  ) =>
                    event.stopPropagation()
                  }
                >
                  {ka
                    ? "პროფილები"
                    : "Profiles"}{" "}
                  →
                </Link>
              )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card {
          padding: 15px;

          display: grid;

          grid-template-columns:
            auto
            minmax(
              0,
              1fr
            );

          gap: 12px;

          border:
            1px solid
            #e0e5e8;

          border-radius: 12px;

          background: white;

          cursor: pointer;
        }

        .unread {
          border-left:
            3px solid
            #c84a50;

          background:
            #fffdfd;
        }

        .icon {
          width: 42px;
          height: 42px;

          display: grid;

          place-items:
            center;

          border-radius: 11px;

          background:
            #f1f4f6;

          font-size: 18px;
        }

        .content {
          min-width: 0;
        }

        .top {
          display: flex;

          align-items:
            flex-start;

          justify-content:
            space-between;

          gap: 15px;
        }

        .top span,
        .top strong {
          display: block;
        }

        .top span {
          color: #7655f7;

          font-size: 6px;

          font-weight: 900;

          letter-spacing:
            0.7px;
        }

        .top strong {
          margin-top: 4px;

          color: #35414c;

          font-size: 11px;
        }

        i {
          padding:
            4px 6px;

          border-radius:
            999px;

          color: white;

          background:
            #c84a50;

          font-size: 5px;

          font-style:
            normal;

          font-weight: 900;
        }

        p {
          margin:
            7px 0 0;

          color: #737e89;

          font-size: 9px;

          line-height: 1.6;

          white-space:
            pre-wrap;

          overflow-wrap:
            anywhere;
        }

        .bottom {
          margin-top: 11px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          flex-wrap: wrap;

          gap: 8px;
        }

        small {
          color: #969fa8;

          font-size: 7px;
        }

        .actions {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .actions
          :global(a),
        .chatButton {
          min-height: 30px;

          padding:
            0 8px;

          display: flex;

          align-items: center;

          border:
            1px solid
            #dce2e6;

          border-radius: 7px;

          color: #53606c;

          background: white;

          text-decoration: none;

          font-size: 7px;

          font-weight: 850;
        }

        .chatButton {
          color: white;

          border-color:
            #1465e8;

          background:
            #1465e8;

          cursor: pointer;
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
          min-height: 88px;

          padding: 13px;

          border:
            1px solid
            #e0e5e8;

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
          min-height: 31px;

          padding:
            0 10px;

          border:
            1px solid
            #dce2e6;

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

function getIcon(
  type: string
) {
  if (type === "scan") {
    return "📱";
  }

  if (
    type === "location"
  ) {
    return "📍";
  }

  if (type === "chat") {
    return "💬";
  }

  if (type === "order") {
    return "🛒";
  }

  if (
    type === "support"
  ) {
    return "🎧";
  }

  return "🔔";
}

function getTypeLabel(
  type: string
) {
  if (type === "scan") {
    return "QR SCAN";
  }

  if (
    type === "location"
  ) {
    return "LOCATION";
  }

  if (type === "chat") {
    return "LIVE CHAT";
  }

  if (type === "order") {
    return "ORDER";
  }

  if (
    type === "support"
  ) {
    return "SUPPORT";
  }

  return "QR RETURN";
}

function formatNotificationDate(
  value: string,
  language: Lang
) {
  try {
    return new Intl.DateTimeFormat(
      language === "ka"
        ? "ka-GE"
        : "en-US",
      {
        month: "short",
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
