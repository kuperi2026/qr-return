"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ChatThread = {
  profile_id: string;
  tag_code: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  finder_session: string;
  last_message: string | null;
  last_message_at: string | null;
  message_count: number;
};

type ChatMessage = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
};

export default function OwnerChatInboxPage() {
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("ka");

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selected, setSelected] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  useEffect(() => {
    void checkUser();
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }

    void loadMessages(selected, false);

    const timer = window.setInterval(() => {
      void loadMessages(selected, true);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function checkUser() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    await loadThreads();
  }

  async function loadThreads() {
    setLoading(true);

    const { data, error: rpcError } = await supabase.rpc(
      "owner_get_all_chat_threads"
    );

    if (rpcError) {
      setError(rpcError.message);
      setThreads([]);
    } else {
      const result = (data ?? []) as ChatThread[];

      setThreads(result);

      if (!selected && result.length > 0) {
        setSelected(result[0]);
      }

      setError("");
    }

    setLoading(false);
  }

  async function loadMessages(
    thread: ChatThread,
    silent = false
  ) {
    if (!silent) {
      setChatLoading(true);
    }

    const { data, error: rpcError } = await supabase.rpc(
      "owner_get_chat_messages",
      {
        p_profile_id: thread.profile_id,
        p_finder_session: thread.finder_session,
      }
    );

    if (rpcError) {
      if (!silent) {
        setError(rpcError.message);
      }
    } else {
      setMessages((data ?? []) as ChatMessage[]);

      if (!silent) {
        setError("");
      }
    }

    if (!silent) {
      setChatLoading(false);
    }
  }

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selected) {
      return;
    }

    const clean = text.trim();

    if (!clean || sending) {
      return;
    }

    setSending(true);
    setError("");

    const { error: rpcError } = await supabase.rpc(
      "owner_send_chat_message",
      {
        p_profile_id: selected.profile_id,
        p_finder_session: selected.finder_session,
        p_message: clean,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setText("");

      await loadMessages(selected, true);
      await loadThreads();
    }

    setSending(false);
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(
        ka ? "ka-GE" : "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(new Date(value));
    } catch {
      return "";
    }
  }

  function formatTime(value: string) {
    try {
      return new Intl.DateTimeFormat(
        ka ? "ka-GE" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(new Date(value));
    } catch {
      return "";
    }
  }

  function getIcon(thread: ChatThread) {
    if (thread.pet_type === "dog") {
      return "🐶";
    }

    if (thread.pet_type === "cat") {
      return "🐱";
    }

    if (thread.item_type === "keys") {
      return "🔑";
    }

    if (thread.item_type === "wallet") {
      return "👛";
    }

    if (thread.item_type === "bag") {
      return "👜";
    }

    if (thread.item_type === "suitcase") {
      return "🧳";
    }

    return "🏷️";
  }

  const selectedTitle = useMemo(() => {
    if (!selected) {
      return "";
    }

    return (
      selected.item_name ||
      selected.tag_code ||
      (ka ? "QR პროფილი" : "QR Profile")
    );
  }, [selected, ka]);

  if (loading) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <h1>QR RETURN</h1>

        <p>
          {ka
            ? "შეტყობინებები იტვირთება..."
            : "Loading messages..."}
        </p>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <a href="/account" className="brand">
          <div className="logo">QR</div>

          <div>
            <strong>QR RETURN</strong>
            <small>OWNER INBOX</small>
          </div>
        </a>

        <div className="headerRight">
          <a href="/account" className="accountButton">
            ← {ka ? "ჩემი ანგარიში" : "My Account"}
          </a>

          <div className="languages">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="container">
        <div className="pageTitle">
          <div>
            <span>QR RETURN LIVE CHAT</span>

            <h1>
              {ka
                ? "შეტყობინებები"
                : "Messages"}
            </h1>

            <p>
              {ka
                ? "აქ გამოჩნდება მპოვნელებისგან მიღებული Live Chat შეტყობინებები."
                : "Live Chat messages from finders will appear here."}
            </p>
          </div>

          <button
            type="button"
            className="refresh"
            onClick={() => void loadThreads()}
          >
            ↻ {ka ? "განახლება" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="errorBox">
            ⚠ {error}
          </div>
        )}

        <div className="inbox">
          <aside className="sidebar">
            <div className="sidebarTitle">
              <strong>
                {ka
                  ? "საუბრები"
                  : "Conversations"}
              </strong>

              <span>{threads.length}</span>
            </div>

            {threads.length === 0 ? (
              <div className="noThreads">
                <div>💬</div>

                <strong>
                  {ka
                    ? "შეტყობინებები ჯერ არ არის"
                    : "No messages yet"}
                </strong>

                <p>
                  {ka
                    ? "როდესაც მპოვნელი Live Chat-ს გამოიყენებს, საუბარი აქ გამოჩნდება."
                    : "When a finder uses Live Chat, the conversation will appear here."}
                </p>
              </div>
            ) : (
              <div className="threadList">
                {threads.map((thread) => {
                  const active =
                    selected?.profile_id === thread.profile_id &&
                    selected?.finder_session === thread.finder_session;

                  return (
                    <button
                      key={`${thread.profile_id}-${thread.finder_session}`}
                      type="button"
                      className={`thread ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelected(thread);
                        setMessages([]);
                      }}
                    >
                      <div className="threadIcon">
                        {getIcon(thread)}
                      </div>

                      <div className="threadBody">
                        <div className="threadTop">
                          <strong>
                            {thread.item_name || thread.tag_code}
                          </strong>

                          <time>
                            {formatDate(thread.last_message_at)}
                          </time>
                        </div>

                        <div className="threadTag">
                          QR · {thread.tag_code}
                        </div>

                        <p>
                          {thread.last_message ||
                            (ka
                              ? "ახალი საუბარი"
                              : "New conversation")}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="chatPanel">
            {!selected ? (
              <div className="selectChat">
                <div className="selectIcon">💬</div>

                <h2>
                  {ka
                    ? "აირჩიეთ საუბარი"
                    : "Select a conversation"}
                </h2>

                <p>
                  {ka
                    ? "მარცხენა მხარეს აირჩიეთ მპოვნელის შეტყობინება."
                    : "Choose a finder conversation from the left."}
                </p>
              </div>
            ) : (
              <>
                <div className="chatHeader">
                  <div className="chatItemIcon">
                    {getIcon(selected)}
                  </div>

                  <div>
                    <small>
                      {ka
                        ? "მპოვნელთან საუბარი"
                        : "Finder conversation"}
                    </small>

                    <h2>{selectedTitle}</h2>

                    <p>
                      QR · {selected.tag_code}
                    </p>
                  </div>

                  <div className="liveStatus">
                    ● LIVE
                  </div>
                </div>

                <div className="privacyNotice">
                  🔒{" "}
                  {ka
                    ? "მპოვნელის პირადი ანგარიში არ არის საჭირო. საუბარი დაკავშირებულია QR კოდთან და მის ანონიმურ სესიასთან."
                    : "The finder does not need an account. This conversation is linked to the QR code and their anonymous session."}
                </div>

                <div className="messages">
                  {chatLoading ? (
                    <div className="chatState">
                      {ka
                        ? "საუბარი იტვირთება..."
                        : "Loading conversation..."}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chatState">
                      <div>💬</div>

                      <strong>
                        {ka
                          ? "შეტყობინებები ვერ მოიძებნა"
                          : "No messages found"}
                      </strong>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const mine =
                        message.sender_role === "owner" ||
                        message.sender_role === "admin";

                      return (
                        <div
                          key={message.id}
                          className={`messageRow ${
                            mine ? "mine" : "finder"
                          }`}
                        >
                          {!mine && (
                            <div className="sender">
                              {ka
                                ? "მპოვნელი"
                                : "Finder"}
                            </div>
                          )}

                          <div className="bubble">
                            <div>
                              {message.message_text}
                            </div>

                            <time>
                              {formatTime(message.created_at)}
                            </time>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={bottomRef} />
                </div>

                <form
                  className="composer"
                  onSubmit={sendMessage}
                >
                  <textarea
                    value={text}
                    onChange={(event) =>
                      setText(event.target.value)
                    }
                    maxLength={2000}
                    disabled={sending}
                    placeholder={
                      ka
                        ? "მიწერეთ მპოვნელს..."
                        : "Reply to the finder..."
                    }
                  />

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !text.trim()
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
        </div>
      </section>

      <Styles />
    </main>
  );
}

function Styles() {
  return (
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
        font-family: Inter, Arial, sans-serif;
        background: #f7f9fc;
        color: #101828;
      }

      button,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
      }

      .statePage {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .statePage h1 {
        margin: 10px 0 5px;
        color: #1465e8;
      }

      .statePage p {
        color: #667085;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1180px;
        min-height: 82px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 47px;
        height: 47px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-weight: 900;
      }

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 19px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 2px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .accountButton {
        color: #667085;
        font-size: 10px;
        font-weight: 800;
        text-decoration: none;
      }

      .languages {
        display: flex;
        padding: 4px;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #1465e8;
      }

      .container {
        width: calc(100% - 30px);
        max-width: 1180px;
        margin: auto;
        padding: 36px 0 70px;
      }

      .pageTitle {
        margin-bottom: 22px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
      }

      .pageTitle span {
        color: #7655f7;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .pageTitle h1 {
        margin: 5px 0;
        font-size: 32px;
      }

      .pageTitle p {
        margin: 0;
        color: #667085;
        font-size: 11px;
      }

      .refresh {
        padding: 10px 13px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        background: white;
        color: #344054;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .errorBox {
        margin-bottom: 14px;
        padding: 11px 13px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 10px;
      }

      .inbox {
        min-height: 650px;
        display: grid;
        grid-template-columns: 350px 1fr;
        overflow: hidden;
        border: 1px solid #e4e7ec;
        border-radius: 22px;
        background: white;
        box-shadow: 0 20px 55px rgba(16, 24, 40, 0.07);
      }

      .sidebar {
        border-right: 1px solid #e4e7ec;
        background: #fafbfc;
      }

      .sidebarTitle {
        height: 66px;
        padding: 0 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .sidebarTitle strong {
        font-size: 13px;
      }

      .sidebarTitle span {
        min-width: 25px;
        height: 25px;
        padding: 0 7px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
      }

      .threadList {
        max-height: 584px;
        overflow-y: auto;
      }

      .thread {
        width: 100%;
        padding: 15px;
        display: flex;
        gap: 11px;
        border: 0;
        border-bottom: 1px solid #eaecf0;
        background: transparent;
        text-align: left;
        cursor: pointer;
      }

      .thread:hover {
        background: #f5f8ff;
      }

      .thread.active {
        background: #eef4ff;
      }

      .threadIcon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: white;
        font-size: 21px;
      }

      .threadBody {
        min-width: 0;
        flex: 1;
      }

      .threadTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .threadTop strong {
        overflow: hidden;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .threadTop time {
        flex: 0 0 auto;
        color: #98a2b3;
        font-size: 7px;
      }

      .threadTag {
        margin-top: 3px;
        color: #1465e8;
        font-size: 8px;
        font-weight: 800;
      }

      .thread p {
        margin: 5px 0 0;
        overflow: hidden;
        color: #667085;
        font-size: 9px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .noThreads {
        padding: 70px 25px;
        text-align: center;
        color: #667085;
      }

      .noThreads > div {
        margin-bottom: 12px;
        font-size: 35px;
      }

      .noThreads strong {
        color: #344054;
        font-size: 12px;
      }

      .noThreads p {
        font-size: 9px;
        line-height: 1.6;
      }

      .chatPanel {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .selectChat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
      }

      .selectIcon {
        font-size: 45px;
      }

      .selectChat h2 {
        margin: 13px 0 5px;
      }

      .selectChat p {
        color: #667085;
        font-size: 10px;
      }

      .chatHeader {
        min-height: 78px;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        gap: 11px;
        border-bottom: 1px solid #e4e7ec;
      }

      .chatItemIcon {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #eef4ff;
        font-size: 23px;
      }

      .chatHeader > div:nth-child(2) {
        min-width: 0;
        flex: 1;
      }

      .chatHeader small {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
      }

      .chatHeader h2 {
        margin: 3px 0;
        overflow: hidden;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .chatHeader p {
        margin: 0;
        color: #98a2b3;
        font-size: 8px;
      }

      .liveStatus {
        padding: 7px 9px;
        border-radius: 999px;
        background: #ecfdf3;
        color: #027a48;
        font-size: 8px;
        font-weight: 900;
      }

      .privacyNotice {
        margin: 13px 17px 0;
        padding: 10px 11px;
        border: 1px solid #dbe7ff;
        border-radius: 10px;
        background: #f5f9ff;
        color: #667085;
        font-size: 9px;
        line-height: 1.5;
      }

      .messages {
        height: 455px;
        padding: 18px;
        overflow-y: auto;
        background: #fafbfc;
      }

      .chatState {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #667085;
        text-align: center;
        font-size: 10px;
      }

      .chatState > div {
        font-size: 32px;
      }

      .messageRow {
        margin-bottom: 11px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .messageRow.mine {
        align-items: flex-end;
      }

      .sender {
        margin: 0 0 4px 5px;
        color: #98a2b3;
        font-size: 8px;
        font-weight: 800;
      }

      .bubble {
        max-width: 78%;
        padding: 10px 11px 7px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: white;
        color: #344054;
        font-size: 11px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .messageRow.mine .bubble {
        border: 0;
        background: #1465e8;
        color: white;
      }

      .bubble time {
        display: block;
        margin-top: 5px;
        font-size: 7px;
        text-align: right;
        opacity: 0.7;
      }

      .composer {
        padding: 13px 17px;
        display: flex;
        align-items: flex-end;
        gap: 9px;
        border-top: 1px solid #e4e7ec;
      }

      .composer textarea {
        min-height: 66px;
        max-height: 150px;
        flex: 1;
        padding: 11px;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        outline: none;
        resize: vertical;
      }

      .composer textarea:focus {
        border-color: #1465e8;
      }

      .composer button {
        min-height: 43px;
        padding: 0 16px;
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .composer button:disabled {
        opacity: 0.5;
        cursor: default;
      }

      @media (max-width: 800px) {
        .header {
          padding: 12px 0;
          align-items: flex-start;
        }

        .headerRight {
          align-items: flex-end;
          flex-direction: column-reverse;
        }

        .accountButton {
          display: none;
        }

        .pageTitle {
          align-items: flex-start;
          flex-direction: column;
        }

        .inbox {
          grid-template-columns: 1fr;
        }

        .sidebar {
          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .threadList {
          max-height: 250px;
        }

        .messages {
          height: 420px;
        }
      }

      @media (max-width: 520px) {
        .container {
          width: calc(100% - 16px);
          padding-top: 25px;
        }

        .brand strong {
          font-size: 16px;
        }

        .pageTitle h1 {
          font-size: 27px;
        }

        .inbox {
          border-radius: 16px;
        }

        .chatHeader {
          padding: 11px;
        }

        .privacyNotice {
          margin: 10px 10px 0;
        }

        .messages {
          height: 390px;
          padding: 12px;
        }

        .composer {
          padding: 10px;
          align-items: stretch;
          flex-direction: column;
        }

        .composer button {
          width: 100%;
        }

        .bubble {
          max-width: 88%;
        }
      }
    `}</style>
  );
}
