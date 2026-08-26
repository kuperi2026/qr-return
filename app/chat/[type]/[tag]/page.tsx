"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ChatMessage = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
};

function getLocationUrl(
  value: string
) {
  return (
    value.match(
      /https:\/\/www\.google\.com\/maps\?q=[^\s]+/
    )?.[0] || ""
  );
}

const typeMap: Record<
  string,
  {
    icon: string;
    ka: string;
    en: string;
  }
> = {
  dog: {
    icon: "🐶",
    ka: "ძაღლი",
    en: "Dog",
  },

  cat: {
    icon: "🐱",
    ka: "კატა",
    en: "Cat",
  },

  key: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Key",
  },

  keys: {
    icon: "🔑",
    ka: "გასაღები",
    en: "Keys",
  },

  wallet: {
    icon: "👛",
    ka: "საფულე",
    en: "Wallet",
  },

  bag: {
    icon: "👜",
    ka: "ჩანთა",
    en: "Bag",
  },

  suitcase: {
    icon: "🧳",
    ka: "ჩემოდანი",
    en: "Suitcase",
  },
};

function makeSessionId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export default function FinderLiveChatPage() {
  const params = useParams();

  const [lang, setLang] = useState<Lang>("ka");

  const [sessionId, setSessionId] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [closed, setClosed] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const rawType =
    Array.isArray(params.type)
      ? params.type[0]
      : params.type;

  const rawTag =
    Array.isArray(params.tag)
      ? params.tag[0]
      : params.tag;

  const profileType =
    typeof rawType === "string"
      ? rawType
          .trim()
          .toLowerCase()
      : "";

  const tagCode =
    typeof rawTag === "string"
      ? decodeURIComponent(
          rawTag
        )
          .trim()
          .toUpperCase()
      : "";

  const ka = lang === "ka";

  const category = useMemo(
    () =>
      typeMap[profileType] ?? {
        icon: "🏷️",
        ka: "QR პროფილი",
        en: "QR Profile",
      },
    [profileType]
  );

  useEffect(() => {
    if (!tagCode) {
      setError(
        ka
          ? "QR კოდი ვერ მოიძებნა."
          : "QR code not found."
      );

      setLoading(false);
      return;
    }

    const key =
      `qr-return-chat-${profileType}-${tagCode}`;

    let id =
      window.localStorage.getItem(
        key
      );

    if (!id) {
      id = makeSessionId();

      window.localStorage.setItem(
        key,
        id
      );
    }

    setSessionId(id);
  }, [
    tagCode,
    profileType,
    ka,
  ]);

  async function loadMessages(
    silent = false
  ) {
    if (
      !tagCode ||
      !sessionId
    ) {
      return;
    }

    if (!silent) {
      setLoading(true);
    }

    const {
      data,
      error: rpcError,
    } =
      await supabase.rpc(
        "finder_get_chat_messages",
        {
          p_tag_code:
            tagCode,

          p_finder_session:
            sessionId,
        }
      );

    if (rpcError) {
      if (!silent) {
        setError(
          rpcError.message
        );
      }
    } else {
      setMessages(
        (data ?? []) as ChatMessage[]
      );

      setError("");
    }

    if (!silent) {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    void loadMessages(false);

    const timer =
      window.setInterval(
        () => {
          void loadMessages(
            true
          );
        },
        4000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    sessionId,
    tagCode,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const clean =
      text.trim();

    if (
      !clean ||
      !sessionId ||
      sending
    ) {
      return;
    }

    setSending(true);
    setError("");

    const {
      error: rpcError,
    } =
      await supabase.rpc(
        "finder_send_chat_message",
        {
          p_tag_code:
            tagCode,

          p_finder_session:
            sessionId,

          p_message:
            clean,
        }
      );

    if (rpcError) {
      const message =
        rpcError.message || "";

      setError(message);

      const lower =
        message.toLowerCase();

      if (
        lower.includes(
          "lost mode"
        ) ||
        lower.includes(
          "disabled"
        )
      ) {
        setClosed(true);
      }
    } else {
      setText("");

      await loadMessages(
        true
      );
    }

    setSending(false);
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

  return (
    <main className="page">
      <header className="topbar">
        <a
          className="brand"
          href={`/profile/${encodeURIComponent(
            tagCode
          )}`}
        >
          <span className="logo">
            QR
          </span>

          <span>
            <strong>
              QR RETURN
            </strong>

            <small>
              LIVE CHAT
            </small>
          </span>
        </a>

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
      </header>

      <section className="wrap">
        <a
          className="back"
          href={`/profile/${encodeURIComponent(
            tagCode
          )}`}
        >
          ←{" "}
          {ka
            ? "QR პროფილზე დაბრუნება"
            : "Back to QR profile"}
        </a>

        <div className="card">
          <div className="chatHead">
            <div className="icon">
              {category.icon}
            </div>

            <div className="title">
              <small>
                QR RETURN • LIVE CHAT
              </small>

              <h1>
                {ka
                  ? category.ka
                  : category.en}
              </h1>

              <p>
                QR: {tagCode}
              </p>
            </div>

            {!closed && (
              <span className="live">
                ● Live
              </span>
            )}
          </div>

          <div className="notice">
            🔒{" "}
            {ka
              ? "ანგარიში არ გჭირდებათ. ეს ჩათი ამ QR კოდთან და თქვენს ანონიმურ სესიასთან არის დაკავშირებული."
              : "No account is required. This chat is linked to this QR code and your anonymous session."}
          </div>

          {closed ? (
            <div className="closed">
              <div className="big">
                🔒
              </div>

              <h2>
                {ka
                  ? "Live Chat ამჟამად მიუწვდომელია"
                  : "Live Chat is currently unavailable"}
              </h2>

              <p>
                {ka
                  ? "მფლობელმა შესაძლოა გამორთო Live Chat ან Lost Mode."
                  : "The Owner may have disabled Live Chat or Lost Mode."}
              </p>
            </div>
          ) : (
            <>
              <div className="messages">
                {loading ? (
                  <div className="empty">
                    {ka
                      ? "ჩატი იტვირთება..."
                      : "Loading chat..."}
                  </div>
                ) : messages.length ===
                  0 ? (
                  <div className="empty">
                    <div className="big">
                      💬
                    </div>

                    <strong>
                      {ka
                        ? "მიწერეთ მფლობელს"
                        : "Message the Owner"}
                    </strong>

                    <p>
                      {ka
                        ? "უთხარით სად იპოვეთ ნივთი ან ცხოველი."
                        : "Tell the Owner where you found the item or pet."}
                    </p>
                  </div>
                ) : (
                  messages.map(
                    (message) => {
                      const mine =
                        message.sender_role ===
                        "finder";
                      const locationUrl =
                        getLocationUrl(
                          message.message_text
                        );

                      return (
                        <div
                          key={
                            message.id
                          }
                          className={`row ${
                            mine
                              ? "mine"
                              : "theirs"
                          }`}
                        >
                          {!mine && (
                            <div className="sender">
                              {message.sender_role ===
                              "admin"
                                ? "Admin"
                                : ka
                                ? "მფლობელი"
                                : "Owner"}
                            </div>
                          )}

                          <div className="bubble">
                            <div>
                              {
                                message.message_text
                              }
                            </div>

                            {locationUrl && (
                              <a
                                className="locationLink"
                                href={locationUrl}
                                target="_blank"
                                rel="noreferrer"
                              >
                                📍 {ka
                                  ? "რუკაზე გახსნა"
                                  : "Open map"} ↗
                              </a>
                            )}


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
                  ref={
                    bottomRef
                  }
                />
              </div>

              {error && (
                <div className="error">
                  ⚠ {error}
                </div>
              )}

              <form
                onSubmit={
                  sendMessage
                }
                className="composer"
              >
                <textarea
                  value={text}
                  onChange={(
                    event
                  ) =>
                    setText(
                      event.target
                        .value
                    )
                  }
                  maxLength={
                    2000
                  }
                  placeholder={
                    ka
                      ? "დაწერეთ შეტყობინება..."
                      : "Write a message..."
                  }
                  disabled={
                    sending
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
        </div>
      </section>

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
          font-family: Arial, sans-serif;
          background: #f7f9fc;
          color: #101828;
        }

        .page {
          min-height: 100vh;
        }

        .topbar {
          width: calc(100% - 28px);
          max-width: 760px;
          min-height: 78px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e4e7ec;
        }

        .brand {
          display: flex;
          gap: 10px;
          align-items: center;
          text-decoration: none;
        }

        .logo {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #1465e8;
          color: white;
          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;
        }

        .brand small {
          margin-top: 2px;
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
        }

        .langs {
          display: flex;
          gap: 4px;
          padding: 4px;
          border-radius: 9px;
          background: #eaecf0;
        }

        .langs button {
          padding: 7px 9px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          font-weight: 900;
          cursor: pointer;
        }

        .langs button.active {
          background: white;
          color: #1465e8;
        }

        .wrap {
          width: calc(100% - 24px);
          max-width: 700px;
          margin: auto;
          padding: 30px 0 60px;
        }

        .back {
          display: inline-block;
          margin-bottom: 15px;
          color: #667085;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
        }

        .card {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 22px;
          background: white;
          box-shadow: 0 20px 55px rgba(16, 24, 40, 0.08);
        }

        .chatHead {
          padding: 18px;
          display: flex;
          gap: 13px;
          align-items: center;
          border-bottom: 1px solid #e4e7ec;
        }

        .icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #eef4ff;
          font-size: 28px;
        }

        .title {
          flex: 1;
        }

        .title small {
          color: #7655f7;
          font-weight: 900;
          font-size: 8px;
        }

        .title h1 {
          margin: 4px 0 2px;
          font-size: 20px;
        }

        .title p {
          margin: 0;
          color: #667085;
          font-size: 10px;
        }

        .live {
          padding: 7px 9px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 9px;
          font-weight: 900;
        }

        .notice {
          margin: 16px 18px 0;
          padding: 12px;
          border: 1px solid #dbe7ff;
          border-radius: 12px;
          background: #f5f9ff;
          color: #475467;
          font-size: 10px;
          line-height: 1.5;
        }

        .messages {
          height: min(54vh, 500px);
          min-height: 350px;
          padding: 20px 18px;
          overflow-y: auto;
          background: #fafbfc;
        }

        .empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          color: #667085;
        }

        .big {
          font-size: 34px;
        }

        .row {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .row.mine {
          align-items: flex-end;
        }

        .sender {
          margin: 0 0 4px 5px;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 800;
        }

        .bubble {
          max-width: 80%;
          padding: 11px 12px 7px;
          border: 1px solid #e4e7ec;
          border-radius: 15px;
          background: white;
          line-height: 1.5;
        }

        .mine .bubble {
          border: 0;
          background: #1465e8;
          color: white;
        }

        .locationLink {
          display: inline-flex;
          margin-top: 8px;
          padding: 7px 9px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.2);
          color: inherit;
          font-size: 9px;
          font-weight: 900;
          text-decoration: none;
        }

        .bubble time {
          display: block;
          margin-top: 5px;
          font-size: 8px;
          text-align: right;
          opacity: 0.7;
        }

        .error {
          margin: 0 18px 10px;
          padding: 10px;
          border-radius: 9px;
          background: #fff1f0;
          color: #b42318;
          font-size: 10px;
        }

        .composer {
          padding: 14px 18px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
          border-top: 1px solid #e4e7ec;
        }

        .composer textarea {
          flex: 1;
          min-height: 70px;
          padding: 12px;
          border: 1px solid #d0d5dd;
          border-radius: 11px;
          resize: vertical;
        }

        .composer button {
          min-height: 44px;
          padding: 0 16px;
          border: 0;
          border-radius: 10px;
          background: #1465e8;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        .composer button:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .closed {
          padding: 60px 24px;
          text-align: center;
        }

        .closed p {
          color: #667085;
        }

        @media (max-width: 600px) {
          .chatHead {
            flex-wrap: wrap;
          }

          .composer {
            flex-direction: column;
            align-items: stretch;
          }

          .composer button {
            width: 100%;
          }

          .bubble {
            max-width: 88%;
          }
        }
      `}</style>
    </main>
  );
}
