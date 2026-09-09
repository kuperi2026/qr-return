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
import { getFinderSession } from "@/lib/finderSession";
import ChatMediaButtons from "@/app/components/chat/ChatMediaButtons";
import ChatMessageMedia from "@/app/components/chat/ChatMessageMedia";

type Lang = "ka" | "en";

type ChatMessage = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
};

const CHAT_EMOJIS = ["😀","😃","😄","😁","😊","🙂","😉","😍","🥰","😘","😇","🤗","🤔","😢","😭","😮","😅","😂","🤣","🙏","❤️","🧡","💛","💚","💙","💜","👍","👎","👏","🙌","👋","🤝","💪","✅","❗","❓","🎉","🚨","📍","🏠","🚗","🔑","🐶","🐱","🐾","📞","💬","✨"];

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
  parking: {
    icon: "🚘",
    ka: "ავტომობილი",
    en: "Vehicle",
  },

  emergency: {
    icon: "🩺",
    ka: "Emergency პროფილი",
    en: "Emergency profile",
  },

  pet: {
    icon: "🐾",
    ka: "ცხოველი",
    en: "Pet",
  },
};

export default function FinderLiveChatPage() {
  const params = useParams();

  const [lang, setLang] = useState<Lang>("ka");

  const [sessionId, setSessionId] =
    useState("");

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [text, setText] =
    useState("");

  const [showEmojis, setShowEmojis] =
    useState(false);

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

    setSessionId(getFinderSession(tagCode));
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

    await sendPayload(clean);
  }

  async function sendPayload(clean: string): Promise<boolean> {
    if (!clean || !sessionId || sending) return false;
    setSending(true); setError("");
    const { error: rpcError } = await supabase.rpc(
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
    return !rpcError;
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
          href={`/scan/${encodeURIComponent(
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
              დაცული ჩატი
            </small>
          </span>
        </a>

        <span className="secureBadge">🔒 უსაფრთხო კავშირი</span>
      </header>

      <section className="wrap">
        <a
          className="back"
          href={`/scan/${encodeURIComponent(
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
                QR RETURN • დაცული ჩატი
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
                ● კავშირზეა
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
                  ? "ჩატი ამჟამად მიუწვდომელია"
                  : "Live Chat is currently unavailable"}
              </h2>

              <p>
                {ka
                  ? "მფლობელმა შესაძლოა გამორთო ჩატი ან დაკარგვის რეჟიმი."
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
                                ? "ადმინისტრატორი"
                                : ka
                                ? "მფლობელი"
                                : "Owner"}
                            </div>
                          )}

                          <div className="bubble">
                            <ChatMessageMedia message={message.message_text} />

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
                <div className="emojiWrap">
                  <button
                    type="button"
                    className="emojiButton"
                    aria-label="სმაილების არჩევა"
                    aria-expanded={showEmojis}
                    onClick={() => setShowEmojis((value) => !value)}
                  >
                    😊
                  </button>

                  {showEmojis && (
                    <div className="emojiPicker">
                      {CHAT_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setText((value) => `${value}${emoji}`);
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <ChatMediaButtons tagCode={tagCode} sessionId={sessionId} disabled={sending} onSend={sendPayload} onError={setError} />

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
          background:
            radial-gradient(circle at 21% 17%,rgba(78,166,238,.3),transparent 30%),
            linear-gradient(180deg,#0a4c8a 0%,#063b72 100%);
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
          border-bottom: 1px solid rgba(255,255,255,.22);
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
          color: #ffffff;
        }

        .brand small {
          margin-top: 2px;
          color: rgba(255,255,255,.72);
          font-size: 10px;
          font-weight: 900;
        }

        .secureBadge{padding:9px 12px;border:1px solid rgba(255,255,255,.25);border-radius:10px;color:#fff;background:rgba(255,255,255,.1);font-size:12px;font-weight:850}

        .wrap {
          width: calc(100% - 24px);
          max-width: 700px;
          margin: auto;
          padding: 30px 0 60px;
        }

        .back {
          display: inline-block;
          margin-bottom: 15px;
          color: #ffffff;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
        }

        .card {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 22px;
          background: white;
          box-shadow: 0 24px 65px rgba(0,24,58,.28);
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
          position: relative;
          padding: 14px 18px;
          display: flex;
          gap: 10px;
          align-items: flex-end;
          border-top: 1px solid #e4e7ec;
        }

        .emojiWrap{position:relative;flex:0 0 auto}.composer .emojiButton,.composer .mediaButton{width:48px;min-height:48px;padding:0;border:1px solid #d6e2f5;background:#f1f6ff;color:#1d4ed8;font-size:24px}.emojiPicker{position:absolute;left:0;bottom:56px;z-index:20;width:336px;max-width:calc(100vw - 40px);max-height:260px;overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(8,1fr);gap:7px;border:1px solid #d8e2ef;border-radius:16px;background:#fff;box-shadow:0 16px 42px rgba(0,24,58,.2)}.composer .emojiPicker button{min-height:38px;padding:0;border:0;background:transparent;color:inherit;font-size:25px}.composer .emojiPicker button:hover{background:#edf5ff}.chatMediaInput{display:none}.composer .mediaButton.recording{background:#fee4e2;color:#d92d20;animation:pulse 1s infinite}.chatMediaImage{display:block;max-width:min(290px,65vw);max-height:300px;border-radius:12px;object-fit:cover}.chatMediaAudio{width:min(280px,65vw);height:40px}.chatMediaLink{display:block}@keyframes pulse{50%{opacity:.55}}

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

        .title small{font-size:12px}.title h1{font-size:24px}.title p{font-size:13px}.live{font-size:12px}.notice{font-size:14px}.sender{font-size:12px}.bubble{font-size:16px}.locationLink{font-size:13px}.bubble time{font-size:11px}.error{font-size:14px}.composer textarea{font-size:16px}.composer button{font-size:15px}

        @media (max-width: 600px) {
          .page{min-height:100dvh}.topbar{min-height:64px}.secureBadge{padding:7px 8px;font-size:10px}.wrap{width:100%;padding:12px 0 0}.back{margin:0 14px 10px;font-size:13px}.card{min-height:calc(100dvh - 86px);display:flex;flex-direction:column;border-left:0;border-right:0;border-bottom:0;border-radius:18px 18px 0 0}.chatHead{padding:14px 16px}.icon{width:48px;height:48px;flex:0 0 48px}.notice{margin:12px 14px 0;font-size:12px}.messages{height:auto;min-height:280px;flex:1;padding:16px 14px}.composer{position:sticky;bottom:0;padding:12px 14px max(12px,env(safe-area-inset-bottom));background:#fff}.composer textarea{min-height:54px;max-height:120px;resize:none}.composer button{min-height:50px}.bubble{max-width:90%;font-size:15px}
          .chatHead {
            flex-wrap: wrap;
          }

          .composer{display:grid;grid-template-columns:48px 48px 48px minmax(0,1fr);align-items:end}.composer>button[type="submit"]{grid-column:1/-1;width:100%}.emojiPicker{left:0;grid-template-columns:repeat(6,1fr);width:300px}

          .bubble {
            max-width: 88%;
          }
        }
      `}</style>
    </main>
  );
}
