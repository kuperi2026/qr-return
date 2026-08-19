"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Message = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
};

const allowedTypes = [
  "dog",
  "cat",
  "key",
  "wallet",
  "bag",
  "suitcase",
];

function normalizeTag(value: string) {
  return value.trim().toUpperCase();
}

function categoryInfo(type: string) {
  const items: Record<
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

  return (
    items[type] ?? {
      icon: "🏷️",
      ka: "QR პროფილი",
      en: "QR Profile",
    }
  );
}

function createSessionId() {
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

  const rawType = Array.isArray(params.type)
    ? params.type[0]
    : params.type;

  const rawTag = Array.isArray(params.tag)
    ? params.tag[0]
    : params.tag;

  const profileType =
    typeof rawType === "string"
      ? rawType.trim().toLowerCase()
      : "";

  const tagCode =
    typeof rawTag === "string"
      ? normalizeTag(
          decodeURIComponent(rawTag)
        )
      : "";

  const [lang, setLang] =
    useState<Lang>("ka");

  const [sessionId, setSessionId] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [chatUnavailable, setChatUnavailable] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  const validRoute =
    allowedTypes.includes(profileType) &&
    Boolean(tagCode);

  const category =
    categoryInfo(profileType);

  /*
    თითო QR პროფილს Finder-ისთვის
    თავისი ანონიმური session აქვს.
  */

  useEffect(() => {
    if (!validRoute) {
      setLoading(false);

      setError(
        ka
          ? "ჩატის მისამართი არასწორია."
          : "Invalid chat address."
      );

      return;
    }

    const storageKey =
      `qr-return-chat-${profileType}-${tagCode}`;

    let existing =
      window.localStorage.getItem(
        storageKey
      );

    if (!existing) {
      existing =
        createSessionId();

      window.localStorage.setItem(
        storageKey,
        existing
      );
    }

    setSessionId(existing);
  }, [
    profileType,
    tagCode,
    validRoute,
    ka,
  ]);

  /*
    შეტყობინებების მიღება მხოლოდ RPC-ით.
    Finder სხვა Finder-ის session-ს ვერ ხედავს.
  */

  const loadMessages =
    useCallback(
      async (
        currentSession: string,
        silent = false
      ) => {
        if (
          !tagCode ||
          !currentSession
        ) {
          return;
        }

        if (!silent) {
          setLoading(true);
        }

        try {
          const {
            data,
            error: loadError,
          } =
            await supabase.rpc(
              "finder_get_chat_messages",
              {
                p_tag_code:
                  tagCode,

                p_finder_session:
                  currentSession,
              }
            );

          if (loadError) {
            throw loadError;
          }

          setMessages(
            (data ?? []) as Message[]
          );

          setChatUnavailable(
            false
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "";

          if (!silent) {
            setError(
              message ||
                (ka
                  ? "Live Chat-ის ჩატვირთვა ვერ მოხერხდა."
                  : "Could not load Live Chat.")
            );
          }
        } finally {
          if (!silent) {
            setLoading(false);
          }
        }
      },
      [tagCode, ka]
    );

  /*
    პირველი ჩატვირთვა.
  */

  useEffect(() => {
    if (
      !validRoute ||
      !sessionId
    ) {
      return;
    }

    void loadMessages(
      sessionId
    );
  }, [
    validRoute,
    sessionId,
    loadMessages,
  ]);

  /*
    პასუხების ავტომატური განახლება.
    ყოველ 4 წამში.
  */

  useEffect(() => {
    if (
      !validRoute ||
      !sessionId ||
      chatUnavailable
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          void loadMessages(
            sessionId,
            true
          );
        },
        4000
      );

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [
    validRoute,
    sessionId,
    chatUnavailable,
    loadMessages,
  ]);

  /*
    ახალი შეტყობინებისას ქვემოთ ჩასვლა.
  */

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

    const cleanText =
      text.trim();

    if (
      !cleanText ||
      !sessionId ||
      !tagCode ||
      sending
    ) {
      return;
    }

    if (
      cleanText.length > 2000
    ) {
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
      const {
        error: sendError,
      } =
        await supabase.rpc(
          "finder_send_chat_message",
          {
            p_tag_code:
              tagCode,

            p_finder_session:
              sessionId,

            p_message:
              cleanText,
          }
        );

      if (sendError) {
        throw sendError;
      }

      setText("");

      await loadMessages(
        sessionId,
        true
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "";

      const lower =
        message.toLowerCase();

      if (
        lower.includes(
          "lost mode"
        ) ||
        lower.includes(
          "live chat is disabled"
        )
      ) {
        setChatUnavailable(
          true
        );
      }

      setError(
        message ||
          (ka
            ? "შეტყობინების გაგზავნა ვერ მოხერხდა."
            : "Could not send message.")
      );
    } finally {
      setSending(false);
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

  if (!validRoute) {
    return (
      <main className="statePage">
        <div className="stateLogo">
          QR
        </div>

        <h1>
          QR RETURN
        </h1>

        <div className="errorBox">
          {error ||
            (ka
              ? "ჩატის მისამართი არასწორია."
              : "Invalid chat address.")}
        </div>

        <a
          href="/"
          className="stateLink"
        >
          ←{" "}
          {ka
            ? "მთავარ გვერდზე დაბრუნება"
            : "Back to home"}
        </a>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topHeader">
        <a
          href={`/profile/${encodeURIComponent(
            tagCode
          )}`}
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <small>
              LIVE CHAT
            </small>
          </div>
        </a>

        <div className="languages">
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

      <section className="chatPage">
        <a
          href={`/profile/${encodeURIComponent(
            tagCode
          )}`}
          className="back"
        >
          ←{" "}
          {ka
            ? "QR პროფილზე დაბრუნება"
            : "Back to QR profile"}
        </a>

        <div className="chatCard">
          <header className="chatHeader">
            <div className="categoryIcon">
              {category.icon}
            </div>

            <div className="chatIdentity">
              <div className="eyebrow">
                QR RETURN • LIVE CHAT
              </div>

              <h1>
                {ka
                  ? category.ka
                  : category.en}
              </h1>

              <p>
                QR:{" "}
                <strong>
                  {tagCode}
                </strong>
              </p>
            </div>

            {!chatUnavailable && (
              <div className="online">
                <span />
                Live
              </div>
            )}
          </header>

          <div className="privacyNotice">
            <div className="privacyIcon">
              🔒
            </div>

            <div>
              <strong>
                {ka
                  ? "ანგარიში არ გჭირდებათ"
                  : "No account required"}
              </strong>

              <p>
                {ka
                  ? "თქვენი საუბარი დაკავშირებულია ამ QR კოდთან და მხოლოდ ამ მოწყობილობაზე შექმნილ ანონიმურ სესიასთან."
                  : "Your conversation is linked to this QR code and an anonymous session stored on this device."}
              </p>
            </div>
          </div>

          {chatUnavailable ? (
            <section className="unavailable">
              <div className="unavailableIcon">
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

              <a
                href={`/profile/${encodeURIComponent(
                  tagCode
                )}`}
              >
                {ka
                  ? "QR პროფილზე დაბრუნება"
                  : "Back to QR profile"}{" "}
                →
              </a>
            </section>
          ) : (
            <>
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

                {!loading &&
                  messages.length ===
                    0 && (
                    <div className="empty">
                      <div className="emptyIcon">
                        💬
                      </div>

                      <strong>
                        {ka
                          ? "მიწერეთ მფლობელს"
                          : "Message the Owner"}
                      </strong>

                      <p>
                        {ka
                          ? "უთხარით სად იპოვეთ ნივთი ან ცხოველი, ან დაუსვით კითხვა."
                          : "Tell the Owner where you found the item or pet, or ask a question."}
                      </p>
                    </div>
                  )}

                {!loading &&
                  messages.map(
                    (message) => {
                      const mine =
                        message.sender_role ===
                        "finder";

                      return (
                        <div
                          key={
                            message.id
                          }
                          className={`messageRow ${
                            mine
                              ? "mine"
                              : "theirs"
                          }`}
                        >
                          {!mine && (
                            <div className="senderLabel">
                              {message.sender_role ===
                              "admin"
                                ? ka
                                  ? "Admin"
                                  : "Admin"
                                : ka
                                ? "მფლობელი"
                                : "Owner"}
                            </div>
                          )}

                          <div className="bubble">
                            <div className="messageText">
                              {
                                message.message_text
                              }
                            </div>

                            <time>
                              {formatTime(
                                message.created_at
                              )}
                            </time>
                          </div>
                        </div>
                      );
                    }
                  )}

                <div
                  ref={
                    bottomRef
                  }
                />
              </section>

              {error && (
                <div className="inlineError">
                  ⚠ {error}
                </div>
              )}

              <form
                className="composer"
                onSubmit={
                  sendMessage
                }
              >
                <textarea
                  value={
                    text
                  }
                  maxLength={
                    2000
                  }
                  placeholder={
                    ka
                      ? "დაწერეთ შეტყობინება..."
                      : "Write a message..."
                  }
                  onChange={(
                    event
                  ) =>
                    setText(
                      event.target
                        .value
                    )
                  }
                  onKeyDown={(
                    event
                  ) => {
                    if (
                      event.key ===
                        "Enter" &&
                      !event.shiftKey &&
                      !event
                        .nativeEvent
                        .isComposing
                    ) {
                      event.preventDefault();

                      if (
                        !sending &&
                        text.trim()
                      ) {
                        event.currentTarget.form?.requestSubmit();
                      }
                    }
                  }
                  disabled={
                    sending
                  }
                />

                <div className="composerBottom">
                  <div className="composerMeta">
                    <span>
                      {ka
                        ? "Enter — გაგზავნა • Shift + Enter — ახალი ხაზი"
                        : "Enter — send • Shift + Enter — new line"}
                    </span>

                    <small>
                      {text.length}
                      /2000
                    </small>
                  </div>

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
                      ? "გაგზავნა ➜"
                      : "Send ➜"}
                  </button>
                </div>
              </form>

              <div className="refreshNote">
                {ka
                  ? "პასუხები ავტომატურად განახლდება."
                  : "Replies refresh automatically."}
              </div>
            </>
          )}

          <footer className="footer">
            <div>
              <strong>
                QR RETURN
              </strong>

              <span>
                {ka
                  ? "დაკარგვა არ ნიშნავს დამშვიდობებას."
                  : "Never lose what matters."}
              </span>
            </div>

            <span>
              🔒 Live Chat
            </span>
          </footer>
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
        background: #f7f9fc;
        color: #101828;
        font-family: Inter, Arial, sans-serif;
      }

      textarea,
      button {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        background:
          radial-gradient(
            circle at 8% 10%,
            rgba(20, 101, 232, 0.08),
            transparent 28%
          ),
          radial-gradient(
            circle at 94% 8%,
            rgba(118, 85, 247, 0.08),
            transparent 28%
          ),
          #f7f9fc;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        background: #f7f9fc;
      }

      .stateLogo {
        width: 54px;
        height: 54px;
        display: grid;
        place-items: center;
        margin-bottom: 10px;
        border-radius: 15px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-weight: 900;
      }

      .statePage h1 {
        margin: 0 0 15px;
        color: #1465e8;
      }

      .stateLink {
        margin-top: 15px;
        color: #1465e8;
        font-size: 11px;
        font-weight: 900;
        text-decoration: none;
      }

      .topHeader {
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
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-size: 11px;
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
        letter-spacing: 1.8px;
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
        color: #1465e8;
      }

      .chatPage {
        width: calc(100% - 24px);
        max-width: 700px;
        margin: auto;
        padding: 30px 0 60px;
      }

      .back {
        display: inline-block;
        margin-bottom: 15px;
        color: #667085;
        font-size: 10px;
        font-weight: 800;
        text-decoration: none;
      }

      .chatCard {
        overflow: hidden;
        border: 1px solid #e4e7ec;
        border-radius: 22px;
        background: white;
        box-shadow: 0 20px 55px rgba(16, 24, 40, 0.08);
      }

      .chatHeader {
        padding: 19px;
        display: flex;
        align-items: center;
        gap: 13px;
        border-bottom: 1px solid #e4e7ec;
      }

      .categoryIcon {
        width: 55px;
        height: 55px;
        flex: 0 0 55px;
        display: grid;
        place-items: center;
        border-radius: 15px;
        background: linear-gradient(
          135deg,
          #eef4ff,
          #f0edff
        );
        font-size: 27px;
      }

      .chatIdentity {
        flex: 1;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .chatIdentity h1 {
        margin: 4px 0 2px;
        font-size: 20px;
      }

      .chatIdentity p {
        margin: 0;
        color: #667085;
        font-size: 10px;
      }

      .online {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 7px 9px;
        border-radius: 999px;
        background: #ecfdf3;
        color: #027a48;
        font-size: 9px;
        font-weight: 900;
      }

      .online span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #12b76a;
      }

      .privacyNotice {
        margin: 16px 18px 0;
        padding: 12px;
        display: flex;
        gap: 10px;
        border: 1px solid #dbe7ff;
        border-radius: 12px;
        background: #f5f9ff;
      }

      .privacyIcon {
        width: 32px;
        height: 32px;
        flex: 0 0 32px;
        display: grid;
        place-items: center;
        border-radius: 9px;
        background: white;
      }

      .privacyNotice strong {
        font-size: 10px;
      }

      .privacyNotice p {
        margin: 3px 0 0;
        color: #667085;
        font-size: 9px;
        line-height: 1.5;
      }

      .messages {
        height: min(54vh, 500px);
        min-height: 350px;
        padding: 20px 18px;
        overflow-y: auto;
        background: #fafbfc;
      }

      .loading,
      .empty {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #667085;
      }

      .loader {
        width: 25px;
        height: 25px;
        margin-bottom: 9px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .emptyIcon {
        width: 55px;
        height: 55px;
        display: grid;
        place-items: center;
        margin-bottom: 11px;
        border-radius: 15px;
        background: #eef4ff;
        font-size: 25px;
      }

      .empty strong {
        font-size: 13px;
      }

      .empty p {
        max-width: 340px;
        margin: 5px 0 0;
        font-size: 10px;
        line-height: 1.55;
      }

      .messageRow {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .messageRow.mine {
        align-items: flex-end;
      }

      .senderLabel {
        margin: 0 0 4px 5px;
        color: #98a2b3;
        font-size: 8px;
        font-weight: 800;
      }

      .bubble {
        max-width: min(80%, 430px);
        padding: 11px 12px 7px;
        border: 1px solid #e4e7ec;
        border-radius: 15px 15px 15px 5px;
        background: white;
        color: #344054;
      }

      .mine .bubble {
        border: 0;
        border-radius: 15px 15px 5px 15px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
      }

      .messageText {
        font-size: 11px;
        line-height: 1.55;
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }

      .bubble time {
        display: block;
        margin-top: 5px;
        font-size: 7px;
        text-align: right;
        opacity: 0.65;
      }

      .inlineError {
        margin: 0 18px 10px;
        padding: 9px 11px;
        border-radius: 9px;
        background: #fff1f0;
        color: #b42318;
        font-size: 9px;
      }

      .composer {
        padding: 14px 18px 8px;
        border-top: 1px solid #e4e7ec;
        background: white;
      }

      .composer textarea {
        width: 100%;
        min-height: 70px;
        max-height: 150px;
        padding: 12px;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        outline: none;
        resize: vertical;
      }

      .composer textarea:focus {
        border-color: #84adff;
        box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
      }

      .composerBottom {
        margin-top: 9px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .composerMeta {
        display: flex;
        flex-direction: column;
        gap: 3px;
        color: #98a2b3;
        font-size: 8px;
      }

      .composerMeta small {
        font-size: 8px;
      }

      .composer button {
        min-height: 42px;
        padding: 0 14px;
        border: 0;
        border-radius: 9px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .composer button:disabled {
        opacity: 0.5;
        cursor: default;
      }

      .refreshNote {
        padding: 0 18px 13px;
        color: #98a2b3;
        font-size: 8px;
        text-align: right;
      }

      .unavailable {
        padding: 65px 25px;
        text-align: center;
      }

      .unavailableIcon {
        width: 62px;
        height: 62px;
        margin: auto;
        display: grid;
        place-items: center;
        border-radius: 17px;
        background: #f2f4f7;
        font-size: 28px;
      }

      .unavailable h2 {
        margin: 14px 0 7px;
        font-size: 19px;
      }

      .unavailable p {
        margin: auto;
        max-width: 380px;
        color: #667085;
        font-size: 10px;
        line-height: 1.6;
      }

      .unavailable a {
        margin-top: 17px;
        display: inline-flex;
        padding: 10px 13px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .footer {
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-top: 1px solid #eaecf0;
        background: white;
      }

      .footer strong,
      .footer span {
        display: block;
      }

      .footer strong {
        color: #1465e8;
        font-size: 11px;
      }

      .footer div span,
      .footer > span {
        margin-top: 2px;
        color: #98a2b3;
        font-size: 8px;
      }

      .errorBox {
        padding: 12px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 10px;
      }

      @media (max-width: 600px) {
        .chatHeader {
          align-items: flex-start;
          flex-wrap: wrap;
        }

        .online {
          margin-left: 68px;
        }

        .messages {
          height: 52vh;
          min-height: 320px;
        }

        .bubble {
          max-width: 88%;
        }

        .composerBottom {
          align-items: stretch;
          flex-direction: column;
        }

        .composer button {
          width: 100%;
        }
      }
    `}</style>
  );
}
