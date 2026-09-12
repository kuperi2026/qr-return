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

  order_id?: string | null;

  status?: string | null;

  tracking_number?: string | null;

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

  metadata:
    | NotificationMetadata
    | null;

  created_at: string;
};

type Filter =
  | "all"
  | "unread"
  | "scan"
  | "location"
  | "chat"
  | "order";

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
    useState<Filter>("all");
  const [showFilters, setShowFilters] = useState(false);

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
        "Mark notification read error:",
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
    try {
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
        throw updateError;
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
    } catch (err) {
      console.error(
        "Mark all notifications read error:",
        err
      );
    }
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

    const finderSession =
      notification.metadata
        ?.finder_session;

    if (finderSession) {
      router.push(
        `/account/chat?session=${encodeURIComponent(
          finderSession
        )}`
      );

      return;
    }

    router.push(
      "/account/chat"
    );
  }

  async function openOrder(
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

    router.push(
      "/account/orders"
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

          if (
            filter ===
            "order"
          ) {
            return (
              notification.type ===
              "order"
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
        item.type ===
        "scan"
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
        item.type ===
        "chat"
    ).length;

  const orderCount =
    notifications.filter(
      (item) =>
        item.type ===
        "order"
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
    <main className="page accountNotificationsPage">
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
          <Link href="/account/chat">
            💬 Live Chat
          </Link>

          <Link href="/account/orders">
            🛒{" "}
            {ka
              ? "შეკვეთები"
              : "Orders"}
          </Link>

          <Link href="/my-profiles">
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
        <section className="notificationHero">
          <div className="heroTop"><span className="heroBell">♢</span><div><small>KOMPASI SIGNALS</small><h1>{ka ? "სიახლეები" : "Notifications"}</h1></div><span className="unreadBadge"><b>{unreadCount}</b><small>{ka ? "ახალი" : "NEW"}</small></span></div>
          <p>{unreadCount ? (ka ? "თქვენს QR სივრცეში ახალი აქტივობა დაფიქსირდა." : "New activity was detected in your QR space.") : (ka ? "ყველა შეტყობინება წაკითხულია — მნიშვნელოვანი არაფერი გამოგრჩენიათ." : "Everything is read — you haven't missed anything important.")}</p>
          <div className="heroActions">
            <button type="button" onClick={() => setShowFilters((value) => !value)}><span>☷</span>{ka ? "სიახლეების გაფილტვრა" : "Filter activity"}<b>{showFilters ? "⌃" : "⌄"}</b></button>
            {unreadCount > 0 && <button type="button" onClick={() => void markAllRead()}>✓ {ka ? "ყველას წაკითხვა" : "Mark all read"}</button>}
          </div>
        </section>

        {showFilters && <section className="filters">
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

          <FilterButton
            active={
              filter ===
              "order"
            }
            onClick={() =>
              setFilter("order")
            }
          >
            🛒 Orders
          </FilterButton>
        </section>}

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
                  ? "QR Scan, ლოკაცია, Live Chat ან შეკვეთის სტატუსის ცვლილება აქ გამოჩნდება."
                  : "QR scans, shared locations, Live Chat messages, and order updates will appear here."}
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
                    onOpenOrder={
                      openOrder
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

          max-width: 950px;

          margin:
            0 auto;

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
            1px solid #dce2e6;

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
              6,
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
            1px solid #efd2d4;

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
            1px solid #e0e5e8;

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

          .markAll {
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
      <style jsx global>{`
        body.kompasiAppMode .accountNotificationsPage{background:radial-gradient(circle at 82% 2%,rgba(42,139,231,.35),transparent 28%),linear-gradient(180deg,#073f7b 0,#0a4c8a 265px,#eef5fb 265px)!important;font-family:"Noto Sans Georgian","Sylfaen",Inter,Arial,sans-serif}
        body.kompasiAppMode .accountNotificationsPage .topbar{border-color:rgba(255,255,255,.25)!important}body.kompasiAppMode .accountNotificationsPage .brand strong,body.kompasiAppMode .accountNotificationsPage .brand small{color:#fff!important}body.kompasiAppMode .accountNotificationsPage .topActions>a{display:none!important}
        body.kompasiAppMode .accountNotificationsPage .shell{width:calc(100% - 24px)!important;max-width:520px!important;padding:20px 0 110px!important}.notificationHero{position:relative;overflow:hidden;padding:19px 17px 16px;border:1px solid rgba(255,255,255,.28);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.08));color:#fff;box-shadow:0 20px 45px rgba(1,24,58,.28),inset 0 1px 0 rgba(255,255,255,.25);backdrop-filter:blur(14px)}.notificationHero:after{content:"";position:absolute;right:-42px;top:-58px;width:150px;height:150px;border:24px solid rgba(255,255,255,.07);border-radius:50%}.heroTop{position:relative;z-index:1;display:flex;align-items:center;gap:11px}.heroBell{width:47px;height:47px;display:grid;place-items:center;flex:0 0 47px;border:1px solid rgba(255,255,255,.35);border-radius:15px;background:rgba(255,255,255,.15);font-size:23px}.heroTop>div{min-width:0;flex:1}.heroTop small{color:#bfe0ff;font-size:8px;font-weight:900;letter-spacing:1.2px}.heroTop h1{margin:3px 0 0;color:#fff;font-size:25px;letter-spacing:-.4px}.unreadBadge{position:relative;z-index:1;min-width:58px;padding:8px 9px;border-radius:14px;background:#fff;color:#0a4c8a;text-align:center;box-shadow:0 7px 17px rgba(1,25,58,.18)}.unreadBadge b,.unreadBadge small{display:block}.unreadBadge b{font-size:20px}.unreadBadge small{margin-top:1px;color:#69849e;font-size:7px}.notificationHero>p{position:relative;z-index:1;margin:14px 0 0;color:#d9ecff;font-size:11px;line-height:1.5}.heroActions{position:relative;z-index:1;margin-top:14px;display:flex;gap:7px}.heroActions button{min-height:40px;padding:0 11px;display:flex;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,255,255,.32);border-radius:11px;background:rgba(255,255,255,.13);color:#fff;font-size:9px;font-weight:900}.heroActions button:first-child{flex:1;justify-content:flex-start}.heroActions button:first-child b{margin-left:auto}.heroActions button:last-child{background:#fff;color:#0b5db8}body.kompasiAppMode .accountNotificationsPage .stats{display:none!important}body.kompasiAppMode .accountNotificationsPage .filters{margin-top:9px!important;padding:7px!important;flex-wrap:nowrap!important;overflow-x:auto!important;border:1px solid #dbe7f2!important;border-radius:14px!important;background:#fff!important;box-shadow:0 9px 22px rgba(3,38,82,.1)!important;scrollbar-width:none}body.kompasiAppMode .accountNotificationsPage .filters button{flex:0 0 auto!important;min-height:36px!important;border:0!important;background:#f0f5fa!important;color:#526b82!important;font-size:9px!important}body.kompasiAppMode .accountNotificationsPage .filters button.active{background:#0b6fd3!important;color:#fff!important}
        body.kompasiAppMode .accountNotificationsPage .list{margin-top:12px!important;gap:8px!important}body.kompasiAppMode .accountNotificationsPage .list .card{padding:13px!important;border:1px solid #dce7f1!important;border-radius:17px!important;background:#fff!important;box-shadow:0 7px 20px rgba(17,61,105,.07)!important}body.kompasiAppMode .accountNotificationsPage .list .unread{border-color:#acd2f6!important;background:linear-gradient(135deg,#fff,#f4f9ff)!important;box-shadow:0 9px 23px rgba(10,89,171,.11)!important}body.kompasiAppMode .accountNotificationsPage .list .icon{border-radius:14px!important;box-shadow:inset 0 0 0 1px rgba(35,89,145,.08)!important}body.kompasiAppMode .accountNotificationsPage .list .type-chat .icon{background:#e7f2ff!important}body.kompasiAppMode .accountNotificationsPage .list .type-location .icon{background:#e6f8ef!important}body.kompasiAppMode .accountNotificationsPage .list .type-scan .icon{background:#efeaff!important}body.kompasiAppMode .accountNotificationsPage .list .type-order .icon{background:#fff0ea!important}body.kompasiAppMode .accountNotificationsPage .list .top strong{color:#183953!important;font-size:12px!important}body.kompasiAppMode .accountNotificationsPage .list .top span{color:#2874bf!important;font-size:7px!important}body.kompasiAppMode .accountNotificationsPage .list .cardState>i{background:#0b74d9!important}body.kompasiAppMode .accountNotificationsPage .list .cardState>b{background:#edf4fb!important;color:#1761bd!important}
        @media(max-width:600px){body.kompasiAppMode .accountNotificationsPage .topbar{width:calc(100% - 24px)!important}.accountNotificationsPage .heading{gap:10px!important}.accountNotificationsPage .markAll{border-color:rgba(255,255,255,.35)!important;background:rgba(255,255,255,.14)!important;color:#fff!important}}
      `}</style>
    </main>
  );
}

function NotificationCard({
  notification,
  language,
  onRead,
  onOpenChat,
  onOpenOrder,
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

  onOpenOrder: (
    notification:
      NotificationRow
  ) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
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

  const isOrder =
    notification.type ===
    "order";

  async function handleCardClick() {
    if (
      !notification.read
    ) {
      await onRead(
        notification.id
      );
    }
    setExpanded((value) => !value);
  }

  return (
    <article
      className={
        notification.read
          ? `card type-${notification.type}`
          : `card unread type-${notification.type}`
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

          <div className="cardState">{!notification.read && <i>NEW</i>}<b>{expanded ? "⌃" : "⌄"}</b></div>
        </div>

        {expanded && notification.message && (
          <p>
            {
              notification.message
            }
          </p>
        )}

        {expanded && isOrder &&
          metadata.status && (
            <div className="orderStatus">
              <span>
                STATUS
              </span>

              <strong>
                {String(
                  metadata.status
                ).toUpperCase()}
              </strong>
            </div>
          )}

        {expanded && isOrder &&
          metadata.tracking_number && (
            <div className="tracking">
              <span>
                TRACKING
              </span>

              <strong>
                {
                  metadata.tracking_number
                }
              </strong>
            </div>
          )}

        <div className={`bottom ${expanded ? "expanded" : ""}`}>
          <small>
            {formatNotificationDate(
              notification.created_at,
              language
            )}
          </small>

          {expanded && <div className="actions">
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

            {isOrder && (
              <button
                type="button"
                className="orderButton"
                onClick={(
                  event
                ) => {
                  event.stopPropagation();

                  void onOpenOrder(
                    notification
                  );
                }}
              >
                🛒{" "}
                {ka
                  ? "შეკვეთის ნახვა"
                  : "View Order"}
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
              !isOrder &&
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
          </div>}
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
            1px solid #e0e5e8;

          border-radius: 12px;

          background: white;

          cursor: pointer;
          min-height: 74px;
        }

        .unread {
          border-left:
            3px solid #c84a50;

          background: #fffdfd;
        }

        .icon {
          width: 42px;
          height: 42px;

          display: grid;

          place-items: center;

          border-radius: 11px;

          background: #f1f4f6;

          font-size: 18px;
        }

        .type-chat .icon{background:#e7f2ff;color:#0967cf}.type-location .icon{background:#e7f8f0;color:#078457}.type-scan .icon{background:#f0ebff;color:#6848c7}.type-order .icon{background:#fff0ea;color:#c45d34}

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

          background: #c84a50;

          font-size: 5px;

          font-style:
            normal;

          font-weight: 900;
        }

        .cardState{display:flex;align-items:center;gap:7px}.cardState>b{width:24px;height:24px;display:grid;place-items:center;border-radius:8px;background:#edf4fb;color:#1761bd;font-size:13px}

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

        .orderStatus,
        .tracking {
          margin-top: 9px;

          padding: 8px 9px;

          border-radius: 8px;

          background: #f7f9fb;
        }

        .orderStatus span,
        .orderStatus strong,
        .tracking span,
        .tracking strong {
          display: block;
        }

        .orderStatus span,
        .tracking span {
          color: #929ca5;

          font-size: 5px;

          font-weight: 900;
        }

        .orderStatus strong,
        .tracking strong {
          margin-top: 3px;

          color: #4e5a65;

          font-size: 7px;
        }

        .bottom {
          margin-top: 6px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          flex-wrap: wrap;

          gap: 8px;
        }

        .bottom.expanded{margin-top:11px}

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
        .chatButton,
        .orderButton {
          min-height: 30px;

          padding:
            0 8px;

          display: flex;

          align-items: center;

          border:
            1px solid #dce2e6;

          border-radius: 7px;

          color: #53606c;

          background: white;

          text-decoration: none;

          font-size: 7px;

          font-weight: 850;
        }

        .chatButton {
          color: white;

          border-color: #1465e8;

          background: #1465e8;

          cursor: pointer;
        }

        .orderButton {
          color: white;

          border-color: #202b37;

          background: #202b37;

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
          min-height: 31px;

          padding:
            0 10px;

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

function getIcon(
  type: string
) {
  if (
    type === "scan"
  ) {
    return "📱";
  }

  if (
    type === "location"
  ) {
    return "📍";
  }

  if (
    type === "chat"
  ) {
    return "💬";
  }

  if (
    type === "order"
  ) {
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
  if (
    type === "scan"
  ) {
    return "QR SCAN";
  }

  if (
    type === "location"
  ) {
    return "LOCATION";
  }

  if (
    type === "chat"
  ) {
    return "LIVE CHAT";
  }

  if (
    type === "order"
  ) {
    return "ORDER UPDATE";
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
