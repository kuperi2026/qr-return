"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import AccountHeader from "@/components/account/AccountHeader";
import ProfileCard, {
  type ProfileCardItem,
} from "@/components/account/ProfileCard";

type ItemRow = {
  id: string;

  owner_id: string | null;

  tag_code: string | null;

  item_type: string | null;
  pet_type: string | null;

  item_name: string | null;

  photo: string | null;

  active: boolean | null;

  scan_count: number | null;

  lost_message: string | null;
  lost_seen_location: string | null;

  created_at?: string | null;
};

type Lang = "ka" | "en";

export default function MyProfilesPage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [userId, setUserId] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [items, setItems] =
    useState<ItemRow[]>([]);

  const [
    notificationCount,
    setNotificationCount,
  ] = useState(0);

  const [
    unreadChatCount,
    setUnreadChatCount,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const ka = lang === "ka";

  useEffect(() => {
    void loadAccount();
  }, []);

  async function loadAccount() {
    try {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setEmail(user.email || "");

      const {
        count: unreadCount,
        error: notificationError,
      } = await supabase
        .from("notifications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("read", false);

      if (notificationError) {
        console.error(
          "Unread notification count error:",
          notificationError
        );
      } else {
        setNotificationCount(
          unreadCount || 0
        );
      }

      try {
        const {
          data: chatThreads,
          error: chatError,
        } = await supabase.rpc(
          "owner_get_all_chat_threads"
        );

        if (chatError) {
          console.error(
            "Unread chat count error:",
            chatError
          );
        } else {
          const rows =
            (chatThreads || []) as Array<{
              unread_count?: number | null;
            }>;

          const totalUnread =
            rows.reduce(
              (sum, row) =>
                sum +
                (row.unread_count || 0),
              0
            );

          setUnreadChatCount(
            totalUnread
          );
        }
      } catch (chatCountError) {
        console.error(
          "Unread chat count failed:",
          chatCountError
        );
      }

      const {
        data,
        error,
      } = await supabase
        .from("item")
        .select(`
          id,
          owner_id,
          tag_code,
          item_type,
          pet_type,
          item_name,
          photo,
          active,
          scan_count,
          lost_message,
          lost_seen_location,
          created_at
        `)
        .eq("owner_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      setItems(
        (data || []) as ItemRow[]
      );
    } catch (err) {
      console.error(
        "My Profiles error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "პროფილების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load profiles."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();

    window.location.href =
      "/login";
  }

  const filteredItems =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return items.filter(
        (item) => {
          const type =
            getProfileType(item);

          const filterMatch =
            filter === "all"
              ? true
              : filter === "emergency"
              ? type === "emergency"
              : filter === "return"
              ? Boolean(
                  item.lost_message ||
                    item
                      .lost_seen_location
                )
              : type === filter;

          const text = [
            item.tag_code,
            item.item_name,
            item.item_type,
            item.pet_type,
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
      items,
      search,
      filter,
    ]);

  const emergencyCount =
    items.filter(
      (item) =>
        getProfileType(item) ===
        "emergency"
    ).length;

  const returnCount =
    items.filter((item) =>
      Boolean(
        item.lost_message ||
          item.lost_seen_location
      )
    ).length;

  if (loading) {
    return (
      <main className="loading">
        {ka
          ? "QR პროფილები იტვირთება..."
          : "Loading QR profiles..."}

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: grid;
            place-items: center;

            color: #687481;
            background: #f5f7f8;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <AccountHeader
        email={email}
        notificationCount={
          notificationCount
        }
        onLogout={() =>
          void handleLogout()
        }
      />

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
        <header className="hero">
          <div>
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              {ka
                ? "ჩემი QR პროფილები"
                : "My QR Profiles"}
            </h1>

            <p>
              {ka
                ? "მართეთ თქვენი ნივთები, შინაური ცხოველები და Emergency ID ერთი ანგარიშიდან."
                : "Manage your belongings, pets, and Emergency ID from one account."}
            </p>
          </div>

          <div className="addArea">
            <Link
              href="/account/register"
              className="addButton"
            >
              +{" "}
              {ka
                ? "QR პროფილის დამატება"
                : "Add QR Profile"}
            </Link>

            <Link
              href="/emergency/register"
              className="emergencyButton"
            >
              + Emergency ID
            </Link>
          </div>
        </header>

        <section className="stats">
          <Stat
            label={
              ka
                ? "ყველა პროფილი"
                : "All Profiles"
            }
            value={items.length}
          />

          <Stat
            label={
              ka
                ? "აქტიური"
                : "Active"
            }
            value={
              items.filter(
                (item) =>
                  item.active === true
              ).length
            }
          />

          <Stat
            label="Emergency ID"
            value={emergencyCount}
          />

          <Stat
            label="Return Cases"
            value={returnCount}
          />
        </section>

        <section className="toolbar">
          <div className="searchBox">
            <SearchIcon />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                ka
                  ? "მოძებნეთ სახელი ან Tag Code..."
                  : "Search name or Tag Code..."
              }
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
                filter === "dog"
              }
              onClick={() =>
                setFilter("dog")
              }
            >
              🐕{" "}
              {ka
                ? "ძაღლი"
                : "Dog"}
            </FilterButton>

            <FilterButton
              active={
                filter === "cat"
              }
              onClick={() =>
                setFilter("cat")
              }
            >
              🐈{" "}
              {ka
                ? "კატა"
                : "Cat"}
            </FilterButton>

            <FilterButton
              active={
                filter ===
                "emergency"
              }
              onClick={() =>
                setFilter(
                  "emergency"
                )
              }
            >
              🚑 Emergency
            </FilterButton>

            <FilterButton
              active={
                filter === "return"
              }
              onClick={() =>
                setFilter("return")
              }
            >
              📍 Return Cases
            </FilterButton>
          </div>
        </section>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!error &&
          filteredItems.length === 0 && (
            <section className="empty">
              <div className="emptyIcon">
                <QRIcon />
              </div>

              <h2>
                {items.length === 0
                  ? ka
                    ? "ჯერ QR პროფილი არ გაქვთ"
                    : "You don't have a QR profile yet"
                  : ka
                  ? "პროფილი ვერ მოიძებნა"
                  : "No matching profile"}
              </h2>

              <p>
                {items.length === 0
                  ? ka
                    ? "დაარეგისტრირეთ თქვენი პირველი ნივთი, შინაური ცხოველი ან Emergency ID."
                    : "Register your first item, pet, or Emergency ID."
                  : ka
                  ? "შეცვალეთ ძებნა ან ფილტრი."
                  : "Try another search or filter."}
              </p>

              {items.length === 0 && (
                <div className="emptyActions">
                  <Link href="/account/register">
                    {ka
                      ? "QR პროფილის შექმნა"
                      : "Create QR Profile"}
                  </Link>

                  <Link href="/emergency/register">
                    Emergency ID
                  </Link>
                </div>
              )}
            </section>
          )}

        {!error &&
          filteredItems.length > 0 && (
            <section className="profiles">
              {filteredItems.map(
                (item) => {
                  const type =
                    getProfileType(
                      item
                    );

                  const profile:
                    ProfileCardItem = {
                      id: item.id,

                      tagCode:
                        item.tag_code,

                      type:
                        item.item_type,

                      petType:
                        item.pet_type,

                      name:
                        item.item_name,

                      photo:
                        item.photo,

                      active:
                        item.active,

                      scanCount:
                        item.scan_count,

                      lostMessage:
                        item.lost_message,

                      lostLocation:
                        item
                          .lost_seen_location,
                    };

                  if (
                    type ===
                    "emergency"
                  ) {
                    return (
                      <EmergencyProfileCard
                        key={item.id}
                        item={item}
                        language={
                          lang
                        }
                      />
                    );
                  }

                  return (
                    <ProfileCard
                      key={item.id}
                      item={
                        profile
                      }
                    />
                  );
                }
              )}
            </section>
          )}

        <section className="quickActions">
          <div>
            <span>
              QR RETURN ACCOUNT
            </span>

            <h2>
              {ka
                ? "სწრაფი მოქმედებები"
                : "Quick Actions"}
            </h2>
          </div>

          <div className="quickGrid">
            <QuickLink
              href="/account/register"
              icon="🏷️"
              title={
                ka
                  ? "ახალი QR"
                  : "New QR"
              }
            />

            <QuickLink
              href="/emergency/register"
              icon="🚑"
              title="Emergency ID"
            />

            <QuickLink
              href="/account/notifications"
              icon="🔔"
              title={
                notificationCount > 0
                  ? ka
                    ? `შეტყობინებები (${notificationCount})`
                    : `Notifications (${notificationCount})`
                  : ka
                  ? "შეტყობინებები"
                  : "Notifications"
              }
            />

            <QuickLink
              href="/account/messages"
              icon="💬"
              title={
                unreadChatCount > 0
                  ? ka
                    ? `Live Chat (${unreadChatCount})`
                    : `Messages (${unreadChatCount})`
                  : "Live Chat"
              }
            />

            <QuickLink
              href="/account"
              icon="👤"
              title={
                ka
                  ? "ანგარიში"
                  : "Account"
              }
            />

            <QuickLink
              href="/"
              icon="⌂"
              title={
                ka
                  ? "მთავარი"
                  : "Home"
              }
            />
          </div>
        </section>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;

          position: relative;

          background: #f5f7f8;
        }

        .shell {
          width:
            calc(100% - 40px);

          max-width: 1180px;

          margin: 0 auto;

          padding:
            52px 0 90px;
        }

        .language {
          position: absolute;

          top: 82px;
          right: 22px;

          display: flex;

          gap: 4px;

          padding: 4px;

          border:
            1px solid #e0e5e8;

          border-radius: 999px;

          background: white;
        }

        .language button {
          min-width: 38px;
          height: 27px;

          border: 0;
          border-radius: 999px;

          color: #89939d;
          background: transparent;

          cursor: pointer;

          font-size: 7px;
          font-weight: 900;
        }

        .language
          button.active {
          color: white;
          background: #202b37;
        }

        .hero {
          display: flex;

          align-items: flex-end;
          justify-content:
            space-between;

          gap: 30px;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        h1 {
          margin: 8px 0 0;

          color: #202b37;

          font-size:
            clamp(
              36px,
              4vw,
              48px
            );

          font-weight: 760;
          letter-spacing: -2px;
        }

        .hero p {
          max-width: 650px;

          margin: 10px 0 0;

          color: #78838e;

          font-size: 10px;
          line-height: 1.7;
        }

        .addArea {
          display: flex;

          flex-wrap: wrap;

          gap: 7px;
        }

        .addArea :global(a) {
          min-height: 42px;

          padding: 0 13px;

          display: flex;
          align-items: center;

          border-radius: 9px;

          text-decoration: none;

          font-size: 8px;
          font-weight: 850;
        }

        .addButton {
          color: white;
          background: #202b37;
        }

        .emergencyButton {
          color: #a13f45;

          border:
            1px solid #ecd4d6;

          background: #fff6f6;
        }

        .stats {
          margin-top: 32px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 10px;
        }

        .toolbar {
          margin-top: 25px;

          display: grid;

          gap: 11px;
        }

        .searchBox {
          min-height: 50px;

          padding: 0 14px;

          display: grid;

          grid-template-columns:
            auto
            minmax(0, 1fr)
            auto;

          align-items: center;

          gap: 10px;

          border:
            1px solid #dfe4e8;

          border-radius: 12px;

          background: white;
        }

        .searchBox
          :global(svg) {
          width: 17px;
          height: 17px;

          color: #8d969f;
        }

        .searchBox input {
          width: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          font-size: 10px;
        }

        .searchBox button {
          border: 0;

          color: #8d969f;
          background: transparent;

          cursor: pointer;

          font-size: 18px;
        }

        .filters {
          display: flex;

          flex-wrap: wrap;

          gap: 6px;
        }

        .profiles {
          margin-top: 30px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 13px;
        }

        .error {
          margin-top: 25px;

          padding: 15px;

          border:
            1px solid #eed3d5;

          border-radius: 11px;

          color: #9c4045;
          background: #fff6f6;

          font-size: 9px;
        }

        .empty {
          margin-top: 30px;

          padding: 65px 20px;

          border:
            1px solid #e0e5e8;

          border-radius: 16px;

          background: white;

          text-align: center;
        }

        .emptyIcon {
          width: 55px;
          height: 55px;

          margin: auto;

          display: grid;
          place-items: center;

          border-radius: 14px;

          color: #7d8791;
          background: #f0f3f5;
        }

        .emptyIcon
          :global(svg) {
          width: 24px;
        }

        .empty h2 {
          margin: 15px 0 0;

          color: #35414c;

          font-size: 16px;
        }

        .empty p {
          margin: 7px 0 0;

          color: #89939d;

          font-size: 9px;
        }

        .emptyActions {
          margin-top: 18px;

          display: flex;
          justify-content: center;

          flex-wrap: wrap;

          gap: 7px;
        }

        .emptyActions
          :global(a) {
          min-height: 37px;

          padding: 0 11px;

          display: flex;
          align-items: center;

          border:
            1px solid #dce2e6;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 8px;
          font-weight: 850;
        }

        .quickActions {
          margin-top: 50px;
          padding-top: 27px;

          border-top:
            1px solid #dfe4e8;
        }

        .quickActions > div:first-child
          span {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
        }

        .quickActions h2 {
          margin: 5px 0 0;

          color: #35414c;

          font-size: 18px;
        }

        .quickGrid {
          margin-top: 15px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        @media (
          max-width: 900px
        ) {
          .profiles {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }

          .stats,
          .quickGrid {
            grid-template-columns:
              repeat(
                2,
                minmax(0, 1fr)
              );
          }
        }

        @media (
          max-width: 600px
        ) {
          .shell {
            width:
              calc(100% - 24px);

            padding-top: 40px;
          }

          .language {
            top: 75px;
            right: 10px;
          }

          .hero {
            align-items: stretch;
            flex-direction: column;
          }

          .addArea {
            display: grid;
          }

          .profiles,
          .stats,
          .quickGrid {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </main>
  );
}

function EmergencyProfileCard({
  item,
  language,
}: {
  item: ItemRow;
  language: Lang;
}) {
  const ka =
    language === "ka";

  return (
    <article className="card">
      <div className="visual">
        {item.photo ? (
          <img
            src={item.photo}
            alt="Emergency ID"
          />
        ) : (
          <div className="placeholder">
            🚑
          </div>
        )}

        <span className="badge">
          EMERGENCY ID
        </span>
      </div>

      <div className="content">
        <span className="type">
          QR RETURN EMERGENCY
        </span>

        <h3>
          {item.item_name ||
            "Emergency ID"}
        </h3>

        <div className="stats">
          <div>
            <span>
              SCANS
            </span>

            <strong>
              {item.scan_count || 0}
            </strong>
          </div>

          <div>
            <span>
              STATUS
            </span>

            <strong>
              {item.active
                ? "ACTIVE"
                : "INACTIVE"}
            </strong>
          </div>
        </div>

        <div className="actions">
          <Link
            href={`/emergency/edit/${item.id}`}
          >
            {ka
              ? "რედაქტირება"
              : "Edit"}
          </Link>

          {item.tag_code && (
            <Link
              href={`/profile/${item.tag_code}`}
              target="_blank"
            >
              Emergency View ↗
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;

          border:
            1px solid #ead7d9;

          border-radius: 15px;

          background: white;
        }

        .visual {
          height: 170px;

          position: relative;

          overflow: hidden;

          background:
            linear-gradient(
              145deg,
              #fff3f3,
              #f8f9f8
            );
        }

        .visual img {
          width: 100%;
          height: 100%;

          object-fit: cover;
        }

        .placeholder {
          width: 100%;
          height: 100%;

          display: grid;
          place-items: center;

          font-size: 43px;
        }

        .badge {
          position: absolute;

          right: 10px;
          bottom: 10px;

          padding: 6px 8px;

          border-radius: 999px;

          color: white;
          background: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .content {
          padding: 15px;
        }

        .type {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        h3 {
          margin: 5px 0 0;

          color: #303c47;

          font-size: 13px;
        }

        .stats {
          margin-top: 16px;
          padding-top: 12px;

          display: grid;
          grid-template-columns:
            repeat(
              2,
              minmax(0, 1fr)
            );

          gap: 10px;

          border-top:
            1px solid #eee4e5;
        }

        .stats span,
        .stats strong {
          display: block;
        }

        .stats span {
          color: #9aa2aa;

          font-size: 6px;
          font-weight: 900;
        }

        .stats strong {
          margin-top: 4px;

          color: #56626d;

          font-size: 8px;
        }

        .actions {
          margin-top: 15px;

          display: flex;
          flex-wrap: wrap;

          gap: 6px;
        }

        .actions :global(a) {
          min-height: 33px;

          padding: 0 10px;

          display: flex;
          align-items: center;

          border:
            1px solid #dfdfe2;

          border-radius: 8px;

          color: #53606c;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
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
          min-height: 94px;

          padding: 15px;

          border:
            1px solid #e0e5e8;

          border-radius: 12px;

          background: white;
        }

        span {
          color: #929ca5;

          font-size: 7px;
          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 16px;

          color: #293540;

          font-size: 23px;
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
          min-height: 31px;

          padding: 0 10px;

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

function QuickLink({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="quick"
    >
      <span>
        {icon}
      </span>

      <strong>
        {title}
      </strong>

      <i>
        →
      </i>

      <style jsx>{`
        .quick {
          min-height: 80px;

          padding: 14px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 9px;

          border:
            1px solid #e0e5e8;

          border-radius: 11px;

          color: #35414c;
          background: white;

          text-decoration: none;
        }

        span {
          font-size: 18px;
        }

        strong {
          font-size: 9px;
        }

        i {
          color: #929ca5;

          font-size: 13px;
          font-style: normal;
        }
      `}</style>
    </Link>
  );
}

function getProfileType(
  item: ItemRow
) {
  if (
    item.item_type ===
    "emergency"
  ) {
    return "emergency";
  }

  if (
    item.item_type ===
    "pet"
  ) {
    return (
      item.pet_type ||
      "pet"
    );
  }

  return (
    item.item_type ||
    item.pet_type ||
    "other"
  );
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

function QRIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="3"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        rx="1"
      />

      <rect
        x="3"
        y="15"
        width="6"
        height="6"
        rx="1"
      />

      <path d="M14 14h3v3h3v4h-6z" />
    </svg>
  );
}
