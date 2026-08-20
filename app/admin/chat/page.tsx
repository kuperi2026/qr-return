"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ChatThread = {
  id: number;

  item_id?: number | null;

  tag_code?: string | null;

  item_name?: string | null;

  item_type?: string | null;

  pet_type?: string | null;

  owner_id?: string | null;

  owner_email?: string | null;

  finder_session?: string | null;

  finder_name?: string | null;

  finder_phone?: string | null;

  finder_message?: string | null;

  finder_location?: string | null;

  latitude?: number | null;

  longitude?: number | null;

  owner_joined_at?: string | null;

  closed_at?: string | null;

  created_at?: string | null;

  last_message?: string | null;

  last_message_at?: string | null;

  unread_count?: number | null;
};

type ChatMessage = {
  id: number;

  sender_role:
    | "finder"
    | "owner"
    | "admin";

  sender_user_id?: string | null;

  message_text: string;

  created_at: string;

  read_at?: string | null;
};

export default function AdminChatPage() {
  const router = useRouter();

  const [lang, setLang] =
    useState<Lang>("ka");

  const [threads, setThreads] =
    useState<ChatThread[]>([]);

  const [
    selectedThread,
    setSelectedThread,
  ] = useState<ChatThread | null>(
    null
  );

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [text, setText] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" | "open" | "closed"
    >("all");

  const [loading, setLoading] =
    useState(true);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const ka = lang === "ka";

  useEffect(() => {
    void initialize();
  }, []);

  useEffect(() => {
    if (!selectedThread) {
      return;
    }

    void loadMessages(
      selectedThread.id,
      false
    );

    const timer =
      window.setInterval(() => {
        void loadMessages(
          selectedThread.id,
          true
        );
      }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [selectedThread?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  async function initialize() {
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

      await loadThreads();
    } catch (err) {
      console.error(
        "Admin chat initialization error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "Admin Live Chat-ის ჩატვირთვა ვერ მოხერხდა."
          : "Could not load Admin Live Chat."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadThreads() {
    try {
      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "admin_get_chat_threads"
      );

      if (rpcError) {
        throw rpcError;
      }

      const rows =
        (data || []) as ChatThread[];

      setThreads(rows);

      if (selectedThread) {
        const refreshed =
          rows.find(
            (thread) =>
              thread.id ===
              selectedThread.id
          );

        if (refreshed) {
          setSelectedThread(
            refreshed
          );

          return;
        }
      }

      if (
        !selectedThread &&
        rows.length > 0
      ) {
        setSelectedThread(
          rows[0]
        );
      }

      if (
        rows.length === 0
      ) {
        setSelectedThread(
          null
        );
      }
    } catch (err) {
      console.error(
        "Admin threads error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ჩატების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load chat threads."
      );
    }
  }

  async function loadMessages(
    threadId: number,
    silent = false
  ) {
    try {
      if (!silent) {
        setMessagesLoading(
          true
        );
      }

      const {
        data,
        error: rpcError,
      } = await supabase.rpc(
        "admin_get_chat_messages",
        {
          p_chat_session_id:
            threadId,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setMessages(
        (data || []) as ChatMessage[]
      );

      setError("");
    } catch (err) {
      console.error(
        "Admin messages error:",
        err
      );

      if (!silent) {
        setError(
          err instanceof Error
            ? err.message
            : ka
            ? "შეტყობინებების ჩატვირთვა ვერ მოხერხდა."
            : "Could not load messages."
        );
      }
    } finally {
      if (!silent) {
        setMessagesLoading(
          false
        );
      }
    }
  }

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !selectedThread ||
      sending
    ) {
      return;
    }

    const clean =
      text.trim();

    if (!clean) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const {
        error: rpcError,
      } = await supabase.rpc(
        "admin_send_chat_message",
        {
          p_chat_session_id:
            selectedThread.id,

          p_message:
            clean,
        }
      );

      if (rpcError) {
        throw rpcError;
      }

      setText("");

      await loadMessages(
        selectedThread.id,
        true
      );

      await loadThreads();
    } catch (err) {
      console.error(
        "Admin send message error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "შეტყობინების გაგზავნა ვერ მოხერხდა."
          : "Could not send message."
      );
    } finally {
      setSending(false);
    }
  }

  const filteredThreads =
    useMemo(() => {
      const q =
        search
          .trim()
          .toLowerCase();

      return threads.filter(
        (thread) => {
          const statusMatch =
            filter === "all"
              ? true
              : filter === "open"
              ? !thread.closed_at
              : Boolean(
                  thread.closed_at
                );

          const searchable =
            [
              thread.item_name,
              thread.tag_code,
              thread.owner_email,
              thread.finder_name,
              thread.finder_phone,
              thread.last_message,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          const searchMatch =
            !q ||
            searchable.includes(q);

          return (
            statusMatch &&
            searchMatch
          );
        }
      );
    }, [
      threads,
      search,
      filter,
    ]);

  const openCount =
    threads.filter(
      (thread) =>
        !thread.closed_at
    ).length;

  const closedCount =
    threads.filter(
      (thread) =>
        Boolean(
          thread.closed_at
        )
    ).length;

  function formatDate(
    value?: string | null
  ) {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(
        ka
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
      return "";
    }
  }

  function formatTime(
    value: string
  ) {
    try {
      return new Intl.DateTimeFormat(
        ka
          ? "ka-GE"
          : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(
        new Date(value)
      );
    } catch {
      return "";
    }
  }

  if (loading) {
    return (
      <main className="loading">
        <div className="loadingLogo">
          QR
        </div>

        <strong>
          QR RETURN ADMIN
        </strong>

        <span>
          {ka
            ? "Live Chat იტვირთება..."
            : "Loading Live Chat..."}
        </span>

        <style jsx>{`
          .loading {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 8px;

            color: #727d87;

            background: #f5f7f8;
          }

          .loadingLogo {
            width: 52px;
            height: 52px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            color: white;

            background: #202b37;

            font-weight: 900;
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
              ADMIN • LIVE CHAT
            </small>
          </span>
        </Link>

        <nav className="nav">
          <Link href="/admin">
            Dashboard
          </Link>

          <Link href="/admin/items">
            Items
          </Link>

          <Link href="/admin/chat">
            Live Chat
          </Link>

          <Link href="/admin/notifications">
            Notifications
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
        </nav>
      </header>

      <div className="shell">
        <header className="heading">
          <div>
            <span className="eyebrow">
              QR RETURN ADMIN
            </span>

            <h1>
              Live Chat
            </h1>

            <p>
              {ka
                ? "ნახეთ Finder ↔ Owner საუბრები და საჭიროების შემთხვევაში ჩაერთეთ Admin-ის სახელით."
                : "Monitor Finder ↔ Owner conversations and join when Admin assistance is needed."}
            </p>
          </div>

          <button
            type="button"
            className="refresh"
            onClick={() =>
              void loadThreads()
            }
          >
            ↻{" "}
            {ka
              ? "განახლება"
              : "Refresh"}
          </button>
        </header>

        <section className="stats">
          <Stat
            label={
              ka
                ? "ყველა საუბარი"
                : "All Chats"
            }
            value={
              threads.length
            }
          />

          <Stat
            label={
              ka
                ? "აქტიური"
                : "Open"
            }
            value={
              openCount
            }
          />

          <Stat
            label={
              ka
                ? "დახურული"
                : "Closed"
            }
            value={
              closedCount
            }
          />
        </section>

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        <section className="workspace">
          <aside className="sidebar">
            <div className="sidebarTop">
              <div className="search">
                <span>
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder={
                    ka
                      ? "Tag, Owner ან Finder..."
                      : "Tag, Owner or Finder..."
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
                    filter === "open"
                  }
                  onClick={() =>
                    setFilter("open")
                  }
                >
                  ● Open
                </FilterButton>

                <FilterButton
                  active={
                    filter === "closed"
                  }
                  onClick={() =>
                    setFilter("closed")
                  }
                >
                  🔒 Closed
                </FilterButton>
              </div>
            </div>

            <div className="threadList">
              {filteredThreads.length ===
              0 ? (
                <div className="emptyThreads">
                  💬

                  <strong>
                    {ka
                      ? "საუბარი ვერ მოიძებნა"
                      : "No conversations found"}
                  </strong>
                </div>
              ) : (
                filteredThreads.map(
                  (thread) => {
                    const selected =
                      selectedThread?.id ===
                      thread.id;

                    return (
                      <button
                        key={thread.id}
                        type="button"
                        className={
                          selected
                            ? "thread selected"
                            : "thread"
                        }
                        onClick={() =>
                          setSelectedThread(
                            thread
                          )
                        }
                      >
                        <div className="threadIcon">
                          {getTypeIcon(
                            thread
                          )}
                        </div>

                        <div className="threadContent">
                          <div className="threadTitle">
                            <strong>
                              {thread.item_name ||
                                thread.tag_code ||
                                "QR Profile"}
                            </strong>

                            <span
                              className={
                                thread.closed_at
                                  ? "status closed"
                                  : "status open"
                              }
                            >
                              {thread.closed_at
                                ? "Closed"
                                : "Open"}
                            </span>
                          </div>

                          <small>
                            QR:{" "}
                            {thread.tag_code ||
                              "—"}
                          </small>

                          <p>
                            {thread.last_message ||
                              thread.finder_message ||
                              (ka
                                ? "ახალი საუბარი"
                                : "New chat")}
                          </p>

                          <time>
                            {formatDate(
                              thread.last_message_at ||
                                thread.created_at
                            )}
                          </time>
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </aside>

          <section className="chat">
            {!selectedThread ? (
              <div className="noSelection">
                <div>
                  💬
                </div>

                <strong>
                  {ka
                    ? "აირჩიეთ საუბარი"
                    : "Select a conversation"}
                </strong>
              </div>
            ) : (
              <>
                <header className="chatHeader">
                  <div className="identity">
                    <div className="chatIcon">
                      {getTypeIcon(
                        selectedThread
                      )}
                    </div>

                    <div>
                      <span>
                        QR RETURN ADMIN CHAT
                      </span>

                      <h2>
                        {selectedThread.item_name ||
                          selectedThread.tag_code ||
                          "QR Profile"}
                      </h2>

                      <p>
                        QR:{" "}
                        {selectedThread.tag_code ||
                          "—"}
                      </p>
                    </div>
                  </div>

                  <div className="people">
                    <div>
                      <span>
                        OWNER
                      </span>

                      <strong>
                        {selectedThread.owner_email ||
                          selectedThread.owner_id ||
                          "—"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        FINDER
                      </span>

                      <strong>
                        {selectedThread.finder_name ||
                          (ka
                            ? "ანონიმური"
                            : "Anonymous")}
                      </strong>
                    </div>
                  </div>
                </header>

                {selectedThread.finder_phone ||
                (selectedThread.latitude != null &&
                  selectedThread.longitude != null) ? (
                  <div className="contactBar">
                    {selectedThread.finder_phone && (
                      <a
                        href={`tel:${selectedThread.finder_phone}`}
                      >
                        ☎ Finder
                      </a>
                    )}

                    {selectedThread.latitude != null &&
                      selectedThread.longitude != null && (
                        <a
                          href={`https://www.google.com/maps?q=${selectedThread.latitude},${selectedThread.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📍 Map
                        </a>
                      )}
                  </div>
                ) : null}

                {selectedThread.closed_at && (
                  <div className="closedNotice">
                    🔒{" "}
                    {ka
                      ? "ეს საუბარი დახურულია."
                      : "This conversation is closed."}
                  </div>
                )}

                <div className="messages">
                  {messagesLoading ? (
                    <div className="messagesEmpty">
                      {ka
                        ? "იტვირთება..."
                        : "Loading..."}
                    </div>
                  ) : messages.length ===
                    0 ? (
                    <div className="messagesEmpty">
                      💬

                      <strong>
                        {ka
                          ? "შეტყობინებები ჯერ არ არის"
                          : "No messages yet"}
                      </strong>
                    </div>
                  ) : (
                    messages.map(
                      (message) => {
                        const admin =
                          message.sender_role ===
                          "admin";

                        const owner =
                          message.sender_role ===
                          "owner";

                        return (
                          <div
                            key={message.id}
                            className={
                              admin
                                ? "messageRow admin"
                                : owner
                                ? "messageRow owner"
                                : "messageRow finder"
                            }
                          >
                            <span className="sender">
                              {message.sender_role ===
                              "finder"
                                ? "Finder"
                                : message.sender_role ===
                                  "owner"
                                ? "Owner"
                                : "QR RETURN Admin"}
                            </span>

                            <div className="bubble">
                              <p>
                                {
                                  message.message_text
                                }
                              </p>

                              <time>
                                {formatTime(
                                  message.created_at
                                )}
                              </time>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}

                  <div
                    ref={bottomRef}
                  />
                </div>

                <form
                  className="composer"
                  onSubmit={
                    sendMessage
                  }
                >
                  <div className="adminLabel">
                    <span>
                      ADMIN RESPONSE
                    </span>

                    <small>
                      {ka
                        ? "ეს პასუხი გამოჩნდება როგორც QR RETURN Admin."
                        : "This reply will appear as QR RETURN Admin."}
                    </small>
                  </div>

                  <div className="composerRow">
                    <textarea
                      value={text}
                      onChange={(event) =>
                        setText(
                          event.target.value
                        )
                      }
                      maxLength={2000}
                      disabled={
                        sending ||
                        Boolean(
                          selectedThread.closed_at
                        )
                      }
                      placeholder={
                        selectedThread.closed_at
                          ? ka
                            ? "საუბარი დახურულია."
                            : "This chat is closed."
                          : ka
                          ? "დაწერეთ Admin პასუხი..."
                          : "Write an Admin reply..."
                      }
                    />

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !text.trim() ||
                        Boolean(
                          selectedThread.closed_at
                        )
                      }
                    >
                      {sending
                        ? ka
                          ? "იგზავნება..."
                          : "Sending..."
                        : ka
                        ? "გაგზავნა"
                        : "Send"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body {
          color: #202b37;
          background: #f4f6f8;
          font-family: Arial, sans-serif;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100vh;
        }

        .topbar {
          width: calc(100% - 36px);
          max-width: 1280px;
          min-height: 72px;

          margin: auto;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          border-bottom:
            1px solid #dfe4e8;
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

          border-radius: 11px;

          color: white;
          background: #202b37;

          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #202b37;
          font-size: 13px;
        }

        .brand small {
          margin-top: 2px;

          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nav > a {
          min-height: 31px;

          padding: 0 8px;

          display: flex;
          align-items: center;

          border:
            1px solid #dfe4e8;

          border-radius: 7px;

          color: #5b6772;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        .langs {
          padding: 3px;

          display: flex;
          gap: 2px;

          border-radius: 7px;

          background: #e6eaed;
        }

        .langs button {
          min-width: 34px;
          height: 27px;

          border: 0;
          border-radius: 6px;

          color: #7b858f;
          background: transparent;

          cursor: pointer;

          font-size: 7px;
          font-weight: 900;
        }

        .langs button.active {
          color: #202b37;
          background: white;
        }

        .shell {
          width: calc(100% - 36px);
          max-width: 1280px;

          margin: auto;

          padding: 38px 0 70px;
        }

        .heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 20px;
        }

        .eyebrow {
          color: #c84a50;

          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .heading h1 {
          margin: 6px 0 0;

          font-size:
            clamp(
              34px,
              4vw,
              46px
            );

          letter-spacing: -1.7px;
        }

        .heading p {
          max-width: 690px;

          margin: 8px 0 0;

          color: #7c8791;

          font-size: 9px;
          line-height: 1.65;
        }

        .refresh {
          min-height: 38px;

          padding: 0 11px;

          border:
            1px solid #dce2e6;

          border-radius: 8px;

          color: #52606b;
          background: white;

          cursor: pointer;

          font-size: 8px;
          font-weight: 850;
        }

        .stats {
          margin-top: 24px;

          display: grid;

          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );

          gap: 9px;
        }

        .error {
          margin-top: 15px;

          padding: 12px;

          border:
            1px solid #efd2d4;

          border-radius: 9px;

          color: #9d4146;
          background: #fff5f5;

          font-size: 8px;
        }

        .workspace {
          height:
            min(
              720px,
              calc(
                100vh - 260px
              )
            );

          min-height: 570px;

          margin-top: 22px;

          display: grid;

          grid-template-columns:
            350px
            minmax(0, 1fr);

          overflow: hidden;

          border:
            1px solid #dfe4e8;

          border-radius: 17px;

          background: white;

          box-shadow:
            0 18px 45px
            rgba(
              16,
              24,
              40,
              0.05
            );
        }

        .sidebar {
          min-width: 0;

          display: flex;
          flex-direction: column;

          border-right:
            1px solid #e2e6e9;

          background: #fafbfc;
        }

        .sidebarTop {
          padding: 13px;

          border-bottom:
            1px solid #e1e5e8;

          background: white;
        }

        .search {
          min-height: 38px;

          padding: 0 9px;

          display: grid;

          grid-template-columns:
            auto 1fr auto;

          align-items: center;

          gap: 7px;

          border:
            1px solid #dce2e6;

          border-radius: 8px;

          background: #fafbfc;
        }

        .search input {
          width: 100%;

          border: 0;
          outline: 0;

          background: transparent;

          font-size: 8px;
        }

        .search button {
          border: 0;

          color: #8d979f;
          background: transparent;

          cursor: pointer;
        }

        .filters {
          margin-top: 9px;

          display: flex;
          flex-wrap: wrap;

          gap: 5px;
        }

        .threadList {
          flex: 1;

          overflow-y: auto;
        }

        .thread {
          width: 100%;

          padding: 12px;

          display: grid;

          grid-template-columns:
            42px
            minmax(0, 1fr);

          gap: 9px;

          border: 0;

          border-bottom:
            1px solid #e8ecee;

          background: transparent;

          cursor: pointer;

          text-align: left;
        }

        .thread:hover {
          background: #f3f6f8;
        }

        .thread.selected {
          background: #edf2f6;
        }

        .threadIcon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 10px;

          background: white;

          font-size: 18px;
        }

        .threadContent {
          min-width: 0;
        }

        .threadTitle {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 6px;
        }

        .threadTitle strong {
          overflow: hidden;

          color: #34404b;

          font-size: 9px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status {
          padding: 3px 5px;

          border-radius: 999px;

          font-size: 5px;
          font-weight: 900;
        }

        .status.open {
          color: #027a48;
          background: #ecfdf3;
        }

        .status.closed {
          color: #8a4a4f;
          background: #fff1f1;
        }

        .threadContent small {
          display: block;

          margin-top: 3px;

          color: #8a949d;

          font-size: 6px;
        }

        .threadContent p {
          margin: 5px 0 0;

          overflow: hidden;

          color: #8d979f;

          font-size: 7px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .threadContent time {
          display: block;

          margin-top: 4px;

          color: #a0a8af;

          font-size: 6px;
        }

        .emptyThreads {
          padding: 55px 20px;

          display: flex;
          flex-direction: column;

          align-items: center;

          gap: 8px;

          color: #8a949d;

          text-align: center;
        }

        .chat {
          min-width: 0;

          display: flex;
          flex-direction: column;
        }

        .noSelection {
          flex: 1;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 10px;

          color: #8a949d;
        }

        .noSelection div {
          font-size: 35px;
        }

        .chatHeader {
          min-height: 79px;

          padding: 12px 15px;

          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 16px;

          border-bottom:
            1px solid #e2e6e9;
        }

        .identity {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;
        }

        .chatIcon {
          width: 46px;
          height: 46px;

          flex: 0 0 46px;

          display: grid;
          place-items: center;

          border-radius: 11px;

          background: #f0f3f5;

          font-size: 20px;
        }

        .identity span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .identity h2 {
          margin: 3px 0 0;

          font-size: 13px;
        }

        .identity p {
          margin: 3px 0 0;

          color: #8a949d;

          font-size: 7px;
        }

        .people {
          display: flex;

          gap: 6px;
        }

        .people > div {
          max-width: 180px;

          padding: 7px 8px;

          border:
            1px solid #e0e5e8;

          border-radius: 7px;

          background: #fafbfc;
        }

        .people span,
        .people strong {
          display: block;
        }

        .people span {
          color: #929ca5;

          font-size: 5px;
          font-weight: 900;
        }

        .people strong {
          margin-top: 3px;

          overflow: hidden;

          color: #56626d;

          font-size: 7px;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .contactBar {
          padding: 7px 14px;

          display: flex;

          gap: 5px;

          border-bottom:
            1px solid #e3e7ea;

          background: #fafbfc;
        }

        .contactBar a {
          min-height: 29px;

          padding: 0 8px;

          display: flex;
          align-items: center;

          border:
            1px solid #dce2e6;

          border-radius: 6px;

          color: #53606b;
          background: white;

          text-decoration: none;

          font-size: 7px;
          font-weight: 850;
        }

        .closedNotice {
          padding: 8px 14px;

          color: #8c5054;
          background: #fff5f5;

          font-size: 7px;
        }

        .messages {
          flex: 1;

          min-height: 0;

          padding: 17px;

          overflow-y: auto;

          background: #f8fafb;
        }

        .messagesEmpty {
          height: 100%;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 8px;

          color: #8c969f;
        }

        .messageRow {
          margin-bottom: 12px;

          display: flex;
          flex-direction: column;
        }

        .messageRow.finder {
          align-items: flex-start;
        }

        .messageRow.owner {
          align-items: flex-end;
        }

        .messageRow.admin {
          align-items: center;
        }

        .sender {
          margin: 0 5px 4px;

          color: #929ca5;

          font-size: 6px;
          font-weight: 850;
        }

        .bubble {
          max-width: 74%;

          padding: 9px 11px 7px;

          border-radius: 12px;
        }

        .finder .bubble {
          border:
            1px solid #e0e5e8;

          color: #4e5a65;
          background: white;
        }

        .owner .bubble {
          color: white;
          background: #1465e8;
        }

        .admin .bubble {
          border:
            1px solid #e9d4d6;

          color: #773b40;
          background: #fff3f3;
        }

        .bubble p {
          margin: 0;

          font-size: 9px;
          line-height: 1.55;

          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .bubble time {
          display: block;

          margin-top: 4px;

          font-size: 6px;

          text-align: right;

          opacity: 0.7;
        }

        .composer {
          padding: 10px 13px 13px;

          border-top:
            1px solid #e1e5e8;

          background: white;
        }

        .adminLabel {
          margin-bottom: 7px;
        }

        .adminLabel span,
        .adminLabel small {
          display: block;
        }

        .adminLabel span {
          color: #c84a50;

          font-size: 6px;
          font-weight: 900;
        }

        .adminLabel small {
          margin-top: 2px;

          color: #8b959e;

          font-size: 6px;
        }

        .composerRow {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            auto;

          align-items: end;

          gap: 8px;
        }

        .composer textarea {
          width: 100%;

          min-height: 58px;
          max-height: 130px;

          padding: 9px;

          border:
            1px solid #d4dbe0;

          border-radius: 9px;

          outline: 0;

          resize: vertical;

          font-size: 9px;
        }

        .composer button {
          min-width: 90px;
          min-height: 40px;

          padding: 0 11px;

          border: 0;

          border-radius: 8px;

          color: white;
          background: #202b37;

          cursor: pointer;

          font-size: 8px;
          font-weight: 900;
        }

        .composer button:disabled {
          opacity: 0.5;

          cursor: not-allowed;
        }

        @media (
          max-width: 900px
        ) {
          .workspace {
            height: auto;

            grid-template-columns:
              1fr;
          }

          .sidebar {
            max-height: 350px;

            border-right: 0;

            border-bottom:
              1px solid #e2e6e9;
          }

          .chat {
            min-height: 620px;
          }

          .people {
            display: none;
          }
        }

        @media (
          max-width: 650px
        ) {
          .topbar {
            padding: 10px 0;

            align-items: flex-start;
            flex-direction: column;
          }

          .nav {
            width: 100%;

            flex-wrap: wrap;
          }

          .shell {
            width:
              calc(
                100% - 20px
              );

            padding-top: 25px;
          }

          .heading {
            align-items: stretch;
            flex-direction: column;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .chatHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .composerRow {
            grid-template-columns: 1fr;
          }

          .composer button {
            width: 100%;
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
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <style jsx>{`
        .stat {
          min-height: 82px;

          padding: 13px;

          border:
            1px solid #e0e5e8;

          border-radius: 10px;

          background: white;
        }

        span {
          color: #929ca5;

          font-size: 6px;
          font-weight: 900;
        }

        strong {
          display: block;

          margin-top: 13px;

          color: #293540;

          font-size: 20px;
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
          min-height: 28px;

          padding: 0 8px;

          border:
            1px solid #dce2e6;

          border-radius: 999px;

          color: #66727d;
          background: white;

          cursor: pointer;

          font-size: 6px;
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

function getTypeIcon(
  thread: ChatThread
) {
  const type =
    (
      thread.pet_type ||
      thread.item_type ||
      ""
    )
      .trim()
      .toLowerCase();

  if (type === "dog") {
    return "🐶";
  }

  if (type === "cat") {
    return "🐱";
  }

  if (
    type === "key" ||
    type === "keys"
  ) {
    return "🔑";
  }

  if (type === "wallet") {
    return "👛";
  }

  if (type === "bag") {
    return "👜";
  }

  if (type === "suitcase") {
    return "🧳";
  }

  if (type === "emergency") {
    return "🚑";
  }

  return "🏷️";
}
