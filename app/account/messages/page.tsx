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

  item_id?: string | number | null;

  tag_code?: string | null;

  item_name?: string | null;

  item_type?: string | null;

  pet_type?: string | null;

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

export default function OwnerMessagesPage() {
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

  const [search, setSearch] =
    useState("");

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const ka =
    lang === "ka";

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
      window.clearInterval(
        timer
      );
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
        "Owner chat initialization error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : ka
          ? "ჩატების ჩატვირთვა ვერ მოხერხდა."
          : "Could not load chats."
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
        "owner_get_all_chat_threads"
      );

      if (rpcError) {
        throw rpcError;
      }

      const rows =
        (data || []) as ChatThread[];

      setThreads(rows);

      if (
        !selectedThread &&
        rows.length > 0
      ) {
        setSelectedThread(
          rows[0]
        );
      } else if (
        selectedThread
      ) {
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
        }
      }
    } catch (err) {
      console.error(
        "Owner threads error:",
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
        "owner_get_chat_messages",
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
        "Owner messages error:",
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
        "owner_send_chat_message",
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
        "Owner send message error:",
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

      if (!q) {
        return threads;
      }

      return threads.filter(
        (thread) => {
          const text = [
            thread.item_name,
            thread.tag_code,
            thread.finder_name,
            thread.finder_phone,
            thread.last_message,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return text.includes(q);
        }
      );
    }, [
      threads,
      search,
    ]);

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
      <main className="loadingPage">
        <div className="loadingLogo">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <span>
          {ka
            ? "Live Chat იტვირთება..."
            : "Loading Live Chat..."}
        </span>

        <style jsx>{`
          .loadingPage {
            min-height: 100vh;

            display: flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;

            gap: 8px;

            background: #f5f7f8;

            color: #667085;
          }

          .loadingLogo {
            width: 50px;
            height: 50px;

            display: grid;
            place-items: center;

            border-radius: 14px;

            color: white;
            background: #1465e8;

            font-weight: 900;
          }

          strong {
            color: #1465e8;
          }

          span {
            font-size: 10px;
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
              OWNER LIVE CHAT
            </small>
          </span>
        </Link>

        <div className="topRight">
          <Link
            href="/account/notifications"
            className="topLink"
          >
            🔔{" "}
            {ka
              ? "შეტყობინებები"
              : "Notifications"}
          </Link>

          <Link
            href="/my-profiles"
            className="topLink"
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
        <section className="heading">
          <div>
            <span className="eyebrow">
              QR RETURN ACCOUNT
            </span>

            <h1>
              {ka
                ? "Live Chat"
                : "Live Chat"}
            </h1>

            <p>
              {ka
                ? "ნახეთ მპოვნელების შეტყობინებები და უპასუხეთ პირდაპირ თქვენი QR RETURN ანგარიშიდან."
                : "View finder messages and reply directly from your QR RETURN account."}
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
        </section>

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        <section className="chatLayout">

          {/* THREADS */}

          <aside className="sidebar">
            <div className="sidebarTop">
              <div>
                <strong>
                  {ka
                    ? "საუბრები"
                    : "Conversations"}
                </strong>

                <span>
                  {threads.length}
                </span>
              </div>

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
                      ? "ჩატის ძებნა..."
                      : "Search chats..."
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
            </div>

            <div className="threadList">
              {filteredThreads.length ===
              0 ? (
                <div className="noThreads">
                  <span>
                    💬
                  </span>

                  <strong>
                    {ka
                      ? "ჩატი ჯერ არ არის"
                      : "No chats yet"}
                  </strong>

                  <p>
                    {ka
                      ? "როდესაც მპოვნელი Live Chat-ს გამოიყენებს, საუბარი აქ გამოჩნდება."
                      : "When a finder uses Live Chat, the conversation will appear here."}
                  </p>
                </div>
              ) : (
                filteredThreads.map(
                  (thread) => {
                    const selected =
                      selectedThread?.id ===
                      thread.id;

                    return (
                      <button
                        key={
                          thread.id
                        }
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
                                (ka
                                  ? "QR პროფილი"
                                  : "QR Profile")}
                            </strong>

                            {thread.unread_count &&
                            thread.unread_count >
                              0 ? (
                              <span className="unread">
                                {
                                  thread.unread_count
                                }
                              </span>
                            ) : null}
                          </div>

                          <small>
                            {thread.finder_name ||
                              (ka
                                ? "ანონიმური მპოვნელი"
                                : "Anonymous Finder")}
                          </small>

                          <p>
                            {thread.last_message ||
                              thread.finder_message ||
                              (ka
                                ? "ახალი საუბარი"
                                : "New conversation")}
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

          {/* CHAT */}

          <section className="chat">
            {!selectedThread ? (
              <div className="selectChat">
                <div>
                  💬
                </div>

                <strong>
                  {ka
                    ? "აირჩიეთ საუბარი"
                    : "Select a conversation"}
                </strong>

                <p>
                  {ka
                    ? "მარცხენა მხარეს აირჩიეთ მპოვნელის Live Chat."
                    : "Choose a finder Live Chat from the left."}
                </p>
              </div>
            ) : (
              <>
                <header className="chatHeader">
                  <div className="chatIdentity">
                    <div className="chatIcon">
                      {getTypeIcon(
                        selectedThread
                      )}
                    </div>

                    <div>
                      <span>
                        QR RETURN LIVE CHAT
                      </span>

                      <h2>
                        {selectedThread.item_name ||
                          selectedThread.tag_code ||
                          "QR Profile"}
                      </h2>

                      <p>
                        {ka
                          ? "მპოვნელი: "
                          : "Finder: "}

                        {selectedThread.finder_name ||
                          (ka
                            ? "ანონიმური"
                            : "Anonymous")}
                      </p>
                    </div>
                  </div>

                  <div className="chatActions">
                    {selectedThread.finder_phone && (
                      <a
                        href={`tel:${selectedThread.finder_phone}`}
                      >
                        ☎{" "}
                        {ka
                          ? "დარეკვა"
                          : "Call"}
                      </a>
                    )}

                    {selectedThread.latitude != null &&
                      selectedThread.longitude != null && (
                        <a
                          href={`https://www.google.com/maps?q=${selectedThread.latitude},${selectedThread.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📍{" "}
                          {ka
                            ? "რუკა"
                            : "Map"}
                        </a>
                      )}
                  </div>
                </header>

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
                        ? "შეტყობინებები იტვირთება..."
                        : "Loading messages..."}
                    </div>
                  ) : messages.length ===
                    0 ? (
                    <div className="messagesEmpty">
                      <div>
                        💬
                      </div>

                      <strong>
                        {ka
                          ? "შეტყობინებები ჯერ არ არის"
                          : "No messages yet"}
                      </strong>
                    </div>
                  ) : (
                    messages.map(
                      (message) => {
                        const mine =
                          message.sender_role ===
                            "owner" ||
                          message.sender_role ===
                            "admin";

                        return (
                          <div
                            key={
                              message.id
                            }
                            className={
                              mine
                                ? "messageRow mine"
                                : "messageRow theirs"
                            }
                          >
                            {!mine && (
                              <span className="sender">
                                {ka
                                  ? "მპოვნელი"
                                  : "Finder"}
                              </span>
                            )}

                            {message.sender_role ===
                              "admin" && (
                              <span className="sender">
                                QR RETURN Admin
                              </span>
                            )}

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
                          ? "ეს საუბარი დახურულია."
                          : "This conversation is closed."
                        : ka
                        ? "უპასუხეთ მპოვნელს..."
                        : "Reply to the finder..."
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
          background: #f5f7f8;

          color: #202b37;

          font-family:
            Arial,
            sans-serif;
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
          width:
            calc(100% - 36px);

          max-width:
            1180px;

          min-height:
            72px;

          margin:
            auto;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            18px;

          border-bottom:
            1px solid #e0e5e8;
        }

        .brand {
          display:
            flex;

          align-items:
            center;

          gap:
            9px;

          text-decoration:
            none;
        }

        .logo {
          width:
            43px;

          height:
            43px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            12px;

          color:
            white;

          background:
            #1465e8;

          font-weight:
            900;
        }

        .brand strong,
        .brand small {
          display:
            block;
        }

        .brand strong {
          color:
            #1465e8;

          font-size:
            13px;
        }

        .brand small {
          margin-top:
            2px;

          color:
            #7655f7;

          font-size:
            6px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .topRight {
          display:
            flex;

          align-items:
            center;

          gap:
            6px;
        }

        .topLink {
          min-height:
            32px;

          padding:
            0 9px;

          display:
            flex;

          align-items:
            center;

          border:
            1px solid #dfe4e8;

          border-radius:
            8px;

          color:
            #586571;

          background:
            white;

          text-decoration:
            none;

          font-size:
            7px;

          font-weight:
            850;
        }

        .langs {
          padding:
            3px;

          display:
            flex;

          gap:
            2px;

          border-radius:
            8px;

          background:
            #e9edf0;
        }

        .langs button {
          min-width:
            35px;

          min-height:
            27px;

          border:
            0;

          border-radius:
            6px;

          color:
            #79848e;

          background:
            transparent;

          cursor:
            pointer;

          font-size:
            7px;

          font-weight:
            900;
        }

        .langs button.active {
          color:
            #1465e8;

          background:
            white;
        }

        .shell {
          width:
            calc(100% - 36px);

          max-width:
            1180px;

          margin:
            0 auto;

          padding:
            38px 0 70px;
        }

        .heading {
          display:
            flex;

          align-items:
            flex-end;

          justify-content:
            space-between;

          gap:
            20px;
        }

        .eyebrow {
          color:
            #7655f7;

          font-size:
            7px;

          font-weight:
            900;

          letter-spacing:
            1px;
        }

        .heading h1 {
          margin:
            6px 0 0;

          color:
            #202b37;

          font-size:
            clamp(
              33px,
              4vw,
              45px
            );

          letter-spacing:
            -1.5px;
        }

        .heading p {
          max-width:
            670px;

          margin:
            8px 0 0;

          color:
            #7c8791;

          font-size:
            9px;

          line-height:
            1.65;
        }

        .refresh {
          min-height:
            38px;

          padding:
            0 11px;

          border:
            1px solid #dce2e6;

          border-radius:
            8px;

          color:
            #53606b;

          background:
            white;

          cursor:
            pointer;

          font-size:
            8px;

          font-weight:
            850;
        }

        .error {
          margin-top:
            16px;

          padding:
            12px;

          border:
            1px solid #efd2d4;

          border-radius:
            10px;

          color:
            #9d4146;

          background:
            #fff4f4;

          font-size:
            8px;
        }

        .chatLayout {
          height:
            min(
              720px,
              calc(
                100vh - 220px
              )
            );

          min-height:
            560px;

          margin-top:
            25px;

          display:
            grid;

          grid-template-columns:
            330px
            minmax(
              0,
              1fr
            );

          overflow:
            hidden;

          border:
            1px solid #dfe4e8;

          border-radius:
            18px;

          background:
            white;

          box-shadow:
            0 18px 50px
            rgba(
              16,
              24,
              40,
              0.06
            );
        }

        .sidebar {
          min-width:
            0;

          display:
            flex;

          flex-direction:
            column;

          border-right:
            1px solid #e2e6e9;

          background:
            #fafbfc;
        }

        .sidebarTop {
          padding:
            15px;

          border-bottom:
            1px solid #e3e7ea;

          background:
            white;
        }

        .sidebarTop >
          div:first-child {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;
        }

        .sidebarTop strong {
          color:
            #35414c;

          font-size:
            11px;
        }

        .sidebarTop >
          div:first-child
          span {
          min-width:
            22px;

          height:
            22px;

          padding:
            0 6px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            999px;

          color:
            #1465e8;

          background:
            #eef4ff;

          font-size:
            7px;

          font-weight:
            900;
        }

        .search {
          min-height:
            38px;

          margin-top:
            11px;

          padding:
            0 9px;

          display:
            grid;

          grid-template-columns:
            auto
            1fr
            auto;

          align-items:
            center;

          gap:
            6px;

          border:
            1px solid #dde2e6;

          border-radius:
            9px;

          background:
            #f9fafb;
        }

        .search > span {
          color:
            #8d979f;
        }

        .search input {
          width:
            100%;

          border:
            0;

          outline:
            0;

          background:
            transparent;

          font-size:
            8px;
        }

        .search button {
          border:
            0;

          color:
            #89939c;

          background:
            transparent;

          cursor:
            pointer;

          font-size:
            14px;
        }

        .threadList {
          flex:
            1;

          overflow-y:
            auto;
        }

        .thread {
          width:
            100%;

          padding:
            13px 12px;

          display:
            grid;

          grid-template-columns:
            43px
            minmax(
              0,
              1fr
            );

          gap:
            9px;

          border:
            0;

          border-bottom:
            1px solid #e9ecee;

          background:
            transparent;

          cursor:
            pointer;

          text-align:
            left;
        }

        .thread:hover {
          background:
            #f4f7fb;
        }

        .thread.selected {
          background:
            #eef4ff;
        }

        .threadIcon {
          width:
            43px;

          height:
            43px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            11px;

          background:
            white;

          font-size:
            19px;
        }

        .threadContent {
          min-width:
            0;
        }

        .threadTitle {
          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            7px;
        }

        .threadTitle strong {
          overflow:
            hidden;

          color:
            #35414c;

          font-size:
            9px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .unread {
          min-width:
            18px;

          height:
            18px;

          padding:
            0 4px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            999px;

          color:
            white;

          background:
            #c84a50;

          font-size:
            5px;

          font-weight:
            900;
        }

        .threadContent small {
          display:
            block;

          margin-top:
            3px;

          color:
            #7e8992;

          font-size:
            7px;
        }

        .threadContent p {
          margin:
            5px 0 0;

          overflow:
            hidden;

          color:
            #929ba4;

          font-size:
            7px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .threadContent time {
          display:
            block;

          margin-top:
            5px;

          color:
            #a0a8af;

          font-size:
            6px;
        }

        .noThreads {
          padding:
            55px 20px;

          text-align:
            center;
        }

        .noThreads > span {
          font-size:
            27px;
        }

        .noThreads strong {
          display:
            block;

          margin-top:
            10px;

          color:
            #4c5964;

          font-size:
            10px;
        }

        .noThreads p {
          margin:
            6px 0 0;

          color:
            #8a959e;

          font-size:
            7px;

          line-height:
            1.6;
        }

        .chat {
          min-width:
            0;

          display:
            flex;

          flex-direction:
            column;
        }

        .selectChat {
          flex:
            1;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          padding:
            30px;

          color:
            #808b95;

          text-align:
            center;
        }

        .selectChat div {
          font-size:
            38px;
        }

        .selectChat strong {
          margin-top:
            12px;

          color:
            #4e5a65;

          font-size:
            12px;
        }

        .selectChat p {
          margin:
            6px 0 0;

          font-size:
            8px;
        }

        .chatHeader {
          min-height:
            77px;

          padding:
            12px 16px;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            15px;

          border-bottom:
            1px solid #e4e7ea;
        }

        .chatIdentity {
          min-width:
            0;

          display:
            flex;

          align-items:
            center;

          gap:
            10px;
        }

        .chatIcon {
          width:
            46px;

          height:
            46px;

          flex:
            0 0 46px;

          display:
            grid;

          place-items:
            center;

          border-radius:
            12px;

          background:
            #eef4ff;

          font-size:
            21px;
        }

        .chatIdentity span {
          color:
            #7655f7;

          font-size:
            6px;

          font-weight:
            900;
        }

        .chatIdentity h2 {
          margin:
            3px 0 0;

          overflow:
            hidden;

          color:
            #34404b;

          font-size:
            13px;

          text-overflow:
            ellipsis;

          white-space:
            nowrap;
        }

        .chatIdentity p {
          margin:
            3px 0 0;

          color:
            #8a949d;

          font-size:
            7px;
        }

        .chatActions {
          display:
            flex;

          flex-wrap:
            wrap;

          gap:
            5px;
        }

        .chatActions a {
          min-height:
            31px;

          padding:
            0 8px;

          display:
            flex;

          align-items:
            center;

          border:
            1px solid #dce2e6;

          border-radius:
            7px;

          color:
            #52606b;

          background:
            white;

          text-decoration:
            none;

          font-size:
            7px;

          font-weight:
            850;
        }

        .closedNotice {
          padding:
            8px 14px;

          color:
            #8b5558;

          background:
            #fff6f6;

          border-bottom:
            1px solid #efdada;

          font-size:
            7px;
        }

        .messages {
          flex:
            1;

          min-height:
            0;

          padding:
            18px;

          overflow-y:
            auto;

          background:
            #f9fafb;
        }

        .messagesEmpty {
          height:
            100%;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            center;

          justify-content:
            center;

          gap:
            8px;

          color:
            #8b959e;

          font-size:
            8px;

          text-align:
            center;
        }

        .messagesEmpty div {
          font-size:
            30px;
        }

        .messagesEmpty strong {
          color:
            #55616c;

          font-size:
            10px;
        }

        .messageRow {
          margin-bottom:
            12px;

          display:
            flex;

          flex-direction:
            column;

          align-items:
            flex-start;
        }

        .messageRow.mine {
          align-items:
            flex-end;
        }

        .sender {
          margin:
            0 0 4px 5px;

          color:
            #909aa3;

          font-size:
            6px;

          font-weight:
            850;
        }

        .bubble {
          max-width:
            76%;

          padding:
            10px 11px 7px;

          border:
            1px solid #e0e5e8;

          border-radius:
            13px;

          color:
            #4b5762;

          background:
            white;
        }

        .mine .bubble {
          border:
            0;

          color:
            white;

          background:
            #1465e8;
        }

        .bubble p {
          margin:
            0;

          font-size:
            9px;

          line-height:
            1.55;

          white-space:
            pre-wrap;

          overflow-wrap:
            anywhere;
        }

        .bubble time {
          display:
            block;

          margin-top:
            5px;

          font-size:
            6px;

          text-align:
            right;

          opacity:
            0.7;
        }

        .composer {
          padding:
            12px 14px;

          display:
            grid;

          grid-template-columns:
            minmax(
              0,
              1fr
            )
            auto;

          align-items:
            end;

          gap:
            8px;

          border-top:
            1px solid #e2e6e9;

          background:
            white;
        }

        .composer textarea {
          width:
            100%;

          min-height:
            61px;

          max-height:
            140px;

          padding:
            10px;

          border:
            1px solid #d5dce1;

          border-radius:
            10px;

          outline:
            0;

          resize:
            vertical;

          font-size:
            9px;
        }

        .composer textarea:focus {
          border-color:
            #9fbce8;

          box-shadow:
            0 0 0 3px
            rgba(
              20,
              101,
              232,
              0.08
            );
        }

        .composer button {
          min-width:
            90px;

          min-height:
            41px;

          padding:
            0 12px;

          border:
            0;

          border-radius:
            9px;

          color:
            white;

          background:
            #1465e8;

          cursor:
            pointer;

          font-size:
            8px;

          font-weight:
            900;
        }

        .composer button:disabled {
          opacity:
            0.5;

          cursor:
            not-allowed;
        }

        @media (
          max-width:
            820px
        ) {
          .chatLayout {
            height:
              auto;

            min-height:
              0;

            grid-template-columns:
              1fr;
          }

          .sidebar {
            max-height:
              330px;

            border-right:
              0;

            border-bottom:
              1px solid #e1e5e8;
          }

          .chat {
            min-height:
              600px;
          }
        }

        @media (
          max-width:
            600px
        ) {
          .topbar {
            width:
              calc(
                100% - 20px
              );

            padding:
              10px 0;

            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .topRight {
            width:
              100%;

            flex-wrap:
              wrap;
          }

          .shell {
            width:
              calc(
                100% - 20px
              );

            padding-top:
              25px;
          }

          .heading {
            align-items:
              stretch;

            flex-direction:
              column;
          }

          .refresh {
            align-self:
              flex-start;
          }

          .chatHeader {
            align-items:
              flex-start;

            flex-direction:
              column;
          }

          .bubble {
            max-width:
              88%;
          }

          .composer {
            grid-template-columns:
              1fr;
          }

          .composer button {
            width:
              100%;
          }
        }
      `}</style>
    </main>
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

  if (
    type === "wallet"
  ) {
    return "👛";
  }

  if (
    type === "bag"
  ) {
    return "👜";
  }

  if (
    type === "suitcase"
  ) {
    return "🧳";
  }

  if (
    type === "emergency"
  ) {
    return "🚑";
  }

  return "🏷️";
}
