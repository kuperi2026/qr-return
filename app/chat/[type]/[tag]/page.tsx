"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";
type SenderType = "finder" | "owner";

type Message = {
  id: number;
  profile_type: string;
  tag_code: string;
  sender_type: SenderType;
  sender_session: string;
  message: string;
  created_at: string;
};

const allowedTypes = [
  "emergency",
  "dog",
  "cat",
  "suitcase",
  "bag",
  "wallet",
  "key",
];

function normalizeTag(value: string) {
  return value.trim().toUpperCase();
}

function getOrCreateSession() {
  const key = "qr-return-chat-session";

  const existing = localStorage.getItem(key);

  if (existing) {
    return existing;
  }

  const session =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(key, session);

  return session;
}

function categoryName(type: string, lang: Lang) {
  const names: Record<string, [string, string]> = {
    emergency: ["Emergency სამაჯური", "Emergency Bracelet"],
    dog: ["ძაღლი", "Dog"],
    cat: ["კატა", "Cat"],
    suitcase: ["ჩემოდანი", "Suitcase"],
    bag: ["ჩანთა", "Bag"],
    wallet: ["საფულე", "Wallet"],
    key: ["გასაღები", "Key"],
  };

  const item = names[type];

  if (!item) {
    return lang === "ka" ? "პროფილი" : "Profile";
  }

  return lang === "ka" ? item[0] : item[1];
}

function categoryIcon(type: string) {
  const icons: Record<string, string> = {
    emergency: "✚",
    dog: "🐕",
    cat: "🐈",
    suitcase: "🧳",
    bag: "👜",
    wallet: "👛",
    key: "🔑",
  };

  return icons[type] || "QR";
}

export default function LiveChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const rawType = params?.type;
  const rawTag = params?.tag;

  const profileType =
    typeof rawType === "string"
      ? rawType.trim().toLowerCase()
      : "";

  const tagCode =
    typeof rawTag === "string"
      ? normalizeTag(decodeURIComponent(rawTag))
      : "";

  const requestedRole = searchParams.get("role");

  const senderType: SenderType =
    requestedRole === "owner" ? "owner" : "finder";

  const [lang, setLang] = useState<Lang>("ka");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  const validChat =
    allowedTypes.includes(profileType) && Boolean(tagCode);

  const title = useMemo(
    () => categoryName(profileType, lang),
    [profileType, lang]
  );

  useEffect(() => {
    setSessionId(getOrCreateSession());
  }, []);

  useEffect(() => {
    if (!validChat) {
      setLoading(false);

      setError(
        ka
          ? "ჩატის მისამართი არასწორია."
          : "Invalid chat address."
      );

      return;
    }

    let alive = true;

    async function loadMessages() {
      setLoading(true);
      setError("");

      const { data, error: loadError } = await supabase
        .from("live_chat_messages")
        .select(`
          id,
          profile_type,
          tag_code,
          sender_type,
          sender_session,
          message,
          created_at
        `)
        .eq("profile_type", profileType)
        .eq("tag_code", tagCode)
        .order("created_at", {
          ascending: true,
        })
        .limit(200);

      if (!alive) {
        return;
      }

      if (loadError) {
        setError(
          ka
            ? `ჩატის გახსნა ვერ მოხერხდა: ${loadError.message}`
            : `Could not open chat: ${loadError.message}`
        );

        setLoading(false);
        return;
      }

      setMessages((data || []) as Message[]);
      setLoading(false);
    }

    void loadMessages();

    const channel = supabase
      .channel(`chat-${profileType}-${tagCode}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_chat_messages",
          filter: `tag_code=eq.${tagCode}`,
        },
        (payload) => {
          const next = payload.new as Message;

          if (next.profile_type !== profileType) {
            return;
          }

          setMessages((current) => {
            const exists = current.some(
              (message) => message.id === next.id
            );

            if (exists) {
              return current;
            }

            return [...current, next];
          });
        }
      )
      .subscribe();

    return () => {
      alive = false;
      void supabase.removeChannel(channel);
    };
  }, [profileType, tagCode, validChat, ka]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const message = text.trim();

    if (!message || !sessionId || !validChat || sending) {
      return;
    }

    if (message.length > 2000) {
      setError(
        ka
          ? "შეტყობინება მაქსიმუმ 2000 სიმბოლო შეიძლება იყოს."
          : "Message cannot exceed 2000 characters."
      );

      return;
    }

    setSending(true);
    setError("");

    try {
      const { error: sendError } = await supabase
        .from("live_chat_messages")
        .insert({
          profile_type: profileType,
          tag_code: tagCode,
          sender_type: senderType,
          sender_session: sessionId,
          message,
        });

      if (sendError) {
        setError(
          ka
            ? `შეტყობინება ვერ გაიგზავნა: ${sendError.message}`
            : `Could not send message: ${sendError.message}`
        );

        return;
      }

      setText("");
    } finally {
      setSending(false);
    }
  }

  if (!validChat) {
    return (
      <main className="page">
        <Header lang={lang} setLang={setLang} />

        <section className="statePage">
          <div className="errorIcon">!</div>

          <h1>
            {ka
              ? "ჩატი ვერ გაიხსნა"
              : "Chat unavailable"}
          </h1>

          <p>{error}</p>
        </section>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <Header lang={lang} setLang={setLang} />

      <section className="chatPage">
        <header className="chatHeader">
          <div className="categoryIcon">
            {categoryIcon(profileType)}
          </div>

          <div>
            <div className="eyebrow">
              QR RETURN • LIVE CHAT
            </div>

            <h1>{title}</h1>

            <p>
              QR: <strong>{tagCode}</strong>
            </p>
          </div>

          <div className="online">
            <span />
            Live
          </div>
        </header>

        <div className="chatNotice">
          <strong>
            💬{" "}
            {senderType === "owner"
              ? ka
                ? "თქვენ პასუხობთ როგორც პროფილის მმართველი"
                : "You are replying as the profile manager"
              : ka
              ? "დაუკავშირდით QR პროფილის მმართველს"
              : "Contact the QR profile manager"}
          </strong>

          <p>
            {ka
              ? "ჩატი განკუთვნილია QR პროფილის მმართველსა და მპოვნელს შორის კომუნიკაციისთვის."
              : "This chat is for communication between the QR profile manager and finder."}
          </p>
        </div>

        <section className="messages">
          {loading && (
            <div className="loading">
              <div className="loader" />

              <span>
                {ka
                  ? "ჩატი იტვირთება..."
                  : "Loading chat..."}
              </span>
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="empty">
              <div className="emptyIcon">💬</div>

              <strong>
                {ka
                  ? "ჩატი ჯერ ცარიელია"
                  : "No messages yet"}
              </strong>

              <p>
                {ka
                  ? "დაწერეთ პირველი შეტყობინება."
                  : "Send the first message."}
              </p>
            </div>
          )}

          {messages.map((message) => {
            const mine =
              message.sender_session === sessionId;

            return (
              <div
                key={message.id}
                className={
                  mine
                    ? "messageRow mine"
                    : "messageRow"
                }
              >
                <div
                  className={
                    mine
                      ? "bubble mine"
                      : "bubble"
                  }
                >
                  <div className="sender">
                    {message.sender_type === "owner"
                      ? ka
                        ? "პროფილის მმართველი"
                        : "Profile manager"
                      : ka
                      ? "მპოვნელი"
                      : "Finder"}
                  </div>

                  <div className="messageText">
                    {message.message}
                  </div>

                  <time>
                    {new Date(
                      message.created_at
                    ).toLocaleTimeString(
                      ka ? "ka-GE" : "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </time>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </section>

        {error && (
          <div className="errorBox">
            ⚠ {error}
          </div>
        )}

        <form
          className="composer"
          onSubmit={sendMessage}
        >
          <textarea
            value={text}
            maxLength={2000}
            placeholder={
              ka
                ? "დაწერეთ შეტყობინება..."
                : "Write a message..."
            }
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();

                if (!sending && text.trim()) {
                  event.currentTarget.form?.requestSubmit();
                }
              }
            }}
          />

          <div className="composerBottom">
            <div className="keyboardHint">
              {ka
                ? "Enter — გაგზავნა • Shift + Enter — ახალი ხაზი"
                : "Enter — send • Shift + Enter — new line"}
            </div>

            <button
              type="submit"
              disabled={sending || !text.trim()}
            >
              {sending
                ? ka
                  ? "იგზავნება..."
                  : "Sending..."
                : ka
                ? "გაგზავნა ➜"
                : "Send ➜"}
            </button>
          </div>
        </form>

        <div className="privacyNote">
          🔒{" "}
          {ka
            ? "არ გააზიაროთ პაროლები ან საბანკო ინფორმაცია."
            : "Do not share passwords or banking information."}
        </div>

        <footer className="footer">
          <strong>QR RETURN</strong>
          <span>Live Chat</span>
        </footer>
      </section>

      <Styles />
    </main>
  );
}

function Header({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  return (
    <header className="topHeader">
      <a href="/" className="brand">
        <div className="logo">QR</div>

        <div>
          <strong>QR RETURN</strong>
          <small>LIVE CHAT</small>
        </div>
      </a>

      <div className="languages">
        <button
          type="button"
          className={lang === "ka" ? "active" : ""}
          onClick={() => setLang("ka")}
        >
          GEO
        </button>

        <button
          type="button"
          className={lang === "en" ? "active" : ""}
          onClick={() => setLang("en")}
        >
          ENG
        </button>
      </div>
    </header>
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
        background: #f5f7fa;
      }

      button,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at top right,
            rgba(21, 94, 239, 0.08),
            transparent 27%
          ),
          #f5f7fa;
        color: #101828;
        font-family: Arial, Helvetica, sans-serif;
      }

      .topHeader {
        width: calc(100% - 28px);
        max-width: 760px;
        min-height: 74px;
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
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #155eef;
        color: white;
        font-size: 11px;
        font-weight: 900;
      }

      .brand strong {
        display: block;
        color: #155eef;
        font-size: 18px;
        font-weight: 900;
      }

      .brand small {
        display: block;
        margin-top: 2px;
        color: #d92d20;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .languages {
        padding: 4px;
        display: flex;
        border-radius: 9px;
        background: #eaecf0;
      }

      .languages button {
        padding: 7px 9px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #667085;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .languages button.active {
        background: white;
        color: #155eef;
      }

      .chatPage {
        width: calc(100% - 24px);
        max-width: 680px;
        margin: auto;
        padding: 30px 0 60px;
      }

      .chatHeader {
        padding: 18px;
        display: flex;
        align-items: center;
        gap: 13px;
        border: 1px solid #e4e7ec;
        border-radius: 17px;
        background: white;
      }

      .categoryIcon {
        width: 52px;
        height: 52px;
        flex: 0 0 52px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: #f2f7ff;
        font-size: 25px;
      }

      .eyebrow {
        color: #d92d20;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .chatHeader h1 {
        margin: 5px 0 2px;
        font-size: 19px;
      }

      .chatHeader p {
        margin: 0;
        color: #667085;
        font-size: 11px;
      }

      .online {
        margin-left: auto;
        display: flex;
        align-items: center;
        gap: 6px;
        color: #067647;
        font-size: 11px;
        font-weight: 800;
      }

      .online span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #12b76a;
      }

      .chatNotice {
        margin-top: 12px;
        padding: 14px;
        border: 1px solid #d6e4ff;
        border-radius: 13px;
        background: #f2f7ff;
      }

      .chatNotice strong {
        color: #344054;
        font-size: 12px;
      }

      .chatNotice p {
        margin: 5px 0 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.5;
      }

      .messages {
        min-height: 420px;
        max-height: 58vh;
        margin-top: 12px;
        padding: 18px 13px;
        overflow-y: auto;
        border: 1px solid #e4e7ec;
        border-radius: 17px;
        background: white;
      }

      .messageRow {
        margin-bottom: 11px;
        display: flex;
      }

      .messageRow.mine {
        justify-content: flex-end;
      }

      .bubble {
        max-width: 78%;
        padding: 10px 12px;
        border: 1px solid #e4e7ec;
        border-radius: 5px 15px 15px 15px;
        background: #f7f8fa;
      }

      .bubble.mine {
        border-color: #155eef;
        border-radius: 15px 5px 15px 15px;
        background: #155eef;
        color: white;
      }

      .sender {
        margin-bottom: 5px;
        color: #667085;
        font-size: 9px;
        font-weight: 900;
      }

      .bubble.mine .sender {
        color: rgba(255, 255, 255, 0.75);
      }

      .messageText {
        font-size: 13px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .bubble time {
        margin-top: 6px;
        display: block;
        color: #98a2b3;
        font-size: 9px;
        text-align: right;
      }

      .bubble.mine time {
        color: rgba(255, 255, 255, 0.7);
      }

      .empty,
      .loading {
        min-height: 340px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .emptyIcon {
        margin-bottom: 10px;
        font-size: 36px;
      }

      .empty strong {
        color: #344054;
        font-size: 14px;
      }

      .empty p,
      .loading span {
        margin: 5px 0 0;
        color: #98a2b3;
        font-size: 11px;
      }

      .loader {
        width: 33px;
        height: 33px;
        margin-bottom: 10px;
        border: 3px solid #e4e7ec;
        border-top-color: #155eef;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .composer {
        margin-top: 12px;
        padding: 12px;
        border: 1px solid #e4e7ec;
        border-radius: 16px;
        background: white;
      }

      .composer textarea {
        width: 100%;
        min-height: 80px;
        padding: 11px;
        border: 0;
        outline: none;
        resize: none;
        color: #101828;
        font-size: 14px;
      }

      .composerBottom {
        padding-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        border-top: 1px solid #f2f4f7;
      }

      .keyboardHint {
        color: #98a2b3;
        font-size: 9px;
        line-height: 1.4;
      }

      .composerBottom button {
        min-height: 41px;
        flex-shrink: 0;
        padding: 0 17px;
        border: 0;
        border-radius: 10px;
        background: #155eef;
        color: white;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }

      .composerBottom button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .errorBox {
        margin-top: 11px;
        padding: 12px;
        border: 1px solid #fecdca;
        border-radius: 11px;
        background: #fff1f0;
        color: #b42318;
        font-size: 11px;
      }

      .privacyNote {
        margin-top: 12px;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
        text-align: center;
      }

      .footer {
        padding-top: 25px;
        text-align: center;
      }

      .footer strong,
      .footer span {
        display: block;
      }

      .footer strong {
        color: #155eef;
        font-size: 12px;
      }

      .footer span {
        margin-top: 3px;
        color: #98a2b3;
        font-size: 9px;
      }

      .statePage {
        width: calc(100% - 24px);
        max-width: 500px;
        margin: auto;
        padding: 120px 0;
        text-align: center;
      }

      .errorIcon {
        width: 58px;
        height: 58px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: #fff1f0;
        color: #d92d20;
        font-size: 25px;
        font-weight: 900;
      }

      @media (max-width: 560px) {
        .chatPage {
          padding-top: 20px;
        }

        .messages {
          min-height: 380px;
          max-height: 55vh;
        }

        .bubble {
          max-width: 88%;
        }

        .composerBottom {
          align-items: flex-end;
        }

        .keyboardHint {
          max-width: 180px;
        }
      }
    `}</style>
  );
}
