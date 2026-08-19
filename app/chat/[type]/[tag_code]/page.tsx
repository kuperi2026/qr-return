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

type Profile = {
  id: string;
  tag_code: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  photo: string | null;
  active: boolean | null;
  live_chat_enabled: boolean | null;
};

export default function FinderChatPage() {
  const params = useParams();

  const rawTag = Array.isArray(params.tag_code)
    ? params.tag_code[0]
    : params.tag_code;

  const tagCode =
    typeof rawTag === "string"
      ? decodeURIComponent(rawTag)
      : "";

  const [lang, setLang] = useState<Lang>("ka");

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [finderSession, setFinderSession] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [chatClosed, setChatClosed] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  const getOrCreateFinderSession =
    useCallback(() => {
      if (!tagCode) {
        return "";
      }

      const key =
        `qr-return-finder-session-${tagCode}`;

      let existing =
        window.localStorage.getItem(key);

      if (!existing) {
        existing =
          crypto.randomUUID();

        window.localStorage.setItem(
          key,
          existing
        );
      }

      return existing;
    }, [tagCode]);

  const loadMessages =
    useCallback(
      async (
        session: string,
        silent = false
      ) => {
        if (
          !tagCode ||
          !session
        ) {
          return;
        }

        try {
          const {
            data,
            error: messagesError,
          } =
            await supabase.rpc(
              "finder_get_chat_messages",
              {
                p_tag_code:
                  tagCode,
                p_finder_session:
                  session,
              }
            );

          if (messagesError) {
            throw messagesError;
          }

          setMessages(
            (data ?? []) as Message[]
          );
        } catch (err) {
          if (!silent) {
            setError(
              err instanceof Error
                ? err.message
                : ka
                ? "შეტყობინებების ჩატვირთვა ვერ მოხერხდა."
                : "Could not load messages."
            );
          }
        }
      },
      [tagCode, ka]
    );

  useEffect(() => {
    async function initializeChat() {
      if (!tagCode) {
        setError(
          ka
            ? "QR კოდი ვერ მოიძებნა."
            : "QR code not found."
        );

        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const {
          data,
          error: profileError,
        } =
          await supabase
            .from("item")
            .select(
              `
              id,
              tag_code,
              item_name,
              item_type,
              pet_type,
              photo,
              active,
              live_chat_enabled
              `
            )
            .eq(
              "tag_code",
              tagCode
            )
            .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!data) {
          throw new Error(
            ka
              ? "ამ QR კოდზე პროფილი ვერ მოიძებნა."
              : "No profile was found for this QR code."
          );
        }

        const currentProfile =
          data as Profile;

        setProfile(
          currentProfile
        );

        if (
          !currentProfile.active ||
          !currentProfile.live_chat_enabled
        ) {
          setChatClosed(true);
          return;
        }

        const session =
          getOrCreateFinderSession();

        if (!session) {
          throw new Error(
            ka
              ? "ჩათის სესიის შექმნა ვერ მოხერხდა."
              : "Could not create chat session."
          );
        }

        setFinderSession(
          session
        );

        await loadMessages(
          session
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : ka
            ? "Live Chat-ის გახსნა ვერ მოხერხდა."
            : "Could not open Live Chat."
        );
      } finally {
        setLoading(false);
      }
    }

    initializeChat();
  }, [
    tagCode,
    getOrCreateFinderSession,
    loadMessages,
    ka,
  ]);

  useEffect(() => {
    if (
      !finderSession ||
      chatClosed
    ) {
      return;
    }

    const timer =
      window.setInterval(
        () => {
          loadMessages(
            finderSession,
            true
          );
        },
        4000
      );

    return () =>
      window.clearInterval(
        timer
      );
  }, [
    finderSession,
    chatClosed,
    loadMessages,
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

    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      !finderSession ||
      !tagCode
    ) {
      return;
    }

    if (
      cleanMessage.length >
      2000
    ) {
      setError(
        ka
          ? "შეტყობინება ძალიან გრძელია."
          : "Message is too long."
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
              finderSession,

            p_message:
              cleanMessage,
          }
        );

      if (sendError) {
        throw sendError;
      }

      setMessage("");

      await loadMessages(
        finderSession
      );
    } catch (err) {
      const text =
        err instanceof Error
          ? err.message
          : "";

      if (
        text
          .toLowerCase()
          .includes(
            "lost mode"
          ) ||
        text
          .toLowerCase()
          .includes(
            "disabled"
          )
      ) {
        setChatClosed(true);
      }

      setError(
        text ||
          (ka
            ? "შეტყობინების გაგზავნა ვერ მოხერხდა."
            : "Could not send message.")
      );
    } finally {
      setSending(false);
    }
  }

  function typeInfo() {
    if (
      profile?.pet_type ===
      "dog"
    ) {
      return {
        icon: "🐶",
        ka: "ძაღლი",
        en: "Dog",
      };
    }

    if (
      profile?.pet_type ===
      "cat"
    ) {
      return {
        icon: "🐱",
        ka: "კატა",
        en: "Cat",
      };
    }

    if (
      profile?.item_type ===
      "keys"
    ) {
      return {
        icon: "🔑",
        ka: "გასაღები",
        en: "Keys",
      };
    }

    if (
      profile?.item_type ===
      "wallet"
    ) {
      return {
        icon: "👛",
        ka: "საფულე",
        en: "Wallet",
      };
    }

    if (
      profile?.item_type ===
      "bag"
    ) {
      return {
        icon: "👜",
        ka: "ჩანთა",
        en: "Bag",
      };
    }

    if (
      profile?.item_type ===
      "suitcase"
    ) {
      return {
        icon: "🧳",
        ka: "ჩემოდანი",
        en: "Suitcase",
      };
    }

    return {
      icon: "🏷️",
      ka: "QR პროფილი",
      en: "QR Profile",
    };
  }

  function formatTime(
    date: string
  ) {
    try {
      return new Intl.DateTimeFormat(
        ka
          ? "ka-GE"
          : "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      ).format(
        new Date(date)
      );
    } catch {
      return "";
    }
  }

  if (loading) {
    return (
      <main className="statePage">
        <div className="logo">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <p>
          {ka
            ? "Live Chat იტვირთება..."
            : "Loading Live Chat..."}
        </p>
      </main>
    );
  }

  if (
    !profile ||
    error &&
      !finderSession
  ) {
    return (
      <main className="statePage">
        <div className="logo">
          QR
        </div>

        <strong>
          QR RETURN
        </strong>

        <div className="errorBox">
          {error ||
            (ka
              ? "პროფილი ვერ მოიძებნა."
              : "Profile not found.")}
        </div>

        {tagCode && (
          <a
            href={`/profile/${encodeURIComponent(
              tagCode
            )}`}
            className="backButton"
          >
            ←{" "}
            {ka
              ? "QR პროფილზე დაბრუნება"
              : "Back to QR profile"}
          </a>
        )}
      </main>
    );
  }

  const type =
    typeInfo();

  return (
    <main className="page">
      <header className="header">
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

      <section className="container">
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
          <div className="chatHeader">
            <div className="profileIdentity">
              <div className="profilePhoto">
                {profile.photo ? (
                  <img
                    src={
                      profile.photo
                    }
                    alt=""
                  />
                ) : (
                  <span>
                    {type.icon}
                  </span>
                )}
              </div>

              <div>
                <div className="eyebrow">
                  QR RETURN LIVE CHAT
                </div>

                <h1>
                  {profile.item_name ||
                    (ka
                      ? type.ka
                      : type.en)}
                </h1>

                <p>
                  {type.icon}{" "}
                  {ka
                    ? type.ka
                    : type.en}
                </p>
              </div>
            </div>

            {!chatClosed && (
              <div className="onlineBadge">
                <span />
                Live Chat
              </div>
            )}
          </div>

          {chatClosed ? (
            <div className="closedState">
              <div className="closedIcon">
                🔒
              </div>

              <h2>
                {ka
                  ? "Live Chat ამჟამად მიუწვდომელია"
                  : "Live Chat is currently unavailable"}
              </h2>

              <p>
                {ka
                  ? "მფლობელს ამ პროფილზე Lost Mode ან Live Chat გამორთული აქვს."
                  : "The Owner has disabled Lost Mode or Live Chat for this profile."}
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
            </div>
          ) : (
            <>
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
                      ? "თქვენი ჩათი დაკავშირებულია მხოლოდ ამ QR პროფილთან და ამ მოწყობილობაზე შექმნილ ანონიმურ სესიასთან."
                      : "Your conversation is linked only to this QR profile and an anonymous session created on this device."}
                  </p>
                </div>
              </div>

              <div className="messages">
                {messages.length ===
                0 ? (
                  <div className="emptyMessages">
                    <div>
                      💬
                    </div>

                    <h3>
                      {ka
                        ? "მიწერეთ მფლობელს"
                        : "Message the owner"}
                    </h3>

                    <p>
                      {ka
                        ? "უთხარით სად იპოვეთ ნივთი ან ცხოველი, ან დაუსვით კითხვა."
                        : "Tell the owner where you found the item or pet, or ask a question."}
                    </p>
                  </div>
                ) : (
                  messages.map(
                    (
                      chatMessage
                    ) => {
                      const mine =
                        chatMessage.sender_role ===
                        "finder";

                      return (
                        <div
                          key={
                            chatMessage.id
                          }
                          className={`messageRow ${
                            mine
                              ? "mine"
                              : "theirs"
                          }`}
                        >
                          {!mine && (
                            <div className="sender">
                              {chatMessage.sender_role ===
                              "admin"
                                ? "QR RETURN Admin"
                                : ka
                                ? "მფლობელი"
                                : "Owner"}
                            </div>
                          )}

                          <div className="bubble">
                            <p>
                              {
                                chatMessage.message_text
                              }
                            </p>

                            <span>
                              {formatTime(
                                chatMessage.created_at
                              )}
                            </span>
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
                <div className="inlineError">
                  {error}
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
                    message
                  }
                  onChange={(
                    e
                  ) =>
                    setMessage(
                      e.target
                        .value
                    )
                  }
                  placeholder={
                    ka
                      ? "დაწერეთ შეტყობინება..."
                      : "Write a message..."
                  }
                  maxLength={
                    2000
                  }
                  rows={1}
                  disabled={
                    sending
                  }
                />

                <button
                  type="submit"
                  disabled={
                    sending ||
                    !message.trim()
                  }
                >
                  {sending
                    ? "..."
                    : ka
                    ? "გაგზავნა"
                    : "Send"}

                  {!sending && (
                    <span>
                      ↑
                    </span>
                  )}
                </button>
              </form>

              <div className="composerFooter">
                <span>
                  {
                    message.length
                  }
                  /2000
                </span>

                <span>
                  {ka
                    ? "პასუხები ავტომატურად განახლდება."
                    : "Replies refresh automatically."}
                </span>
              </div>
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
          color: #667085;
        }

        .statePage .logo {
          margin-bottom: 11px;
        }

        .statePage > strong {
          color: #1465e8;
          font-size: 21px;
        }

        .statePage p {
          font-size: 11px;
        }

        .backButton {
          margin-top: 15px;
          color: #1465e8;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
        }

        .header {
          width: calc(100% - 36px);
          max-width: 850px;
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
          gap: 11px;
          text-decoration: none;
        }

        .logo {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 13px;
          font-weight: 900;
        }

        .brand strong,
        .brand small {
          display: block;
        }

        .brand strong {
          color: #1465e8;
          font-size: 20px;
          font-weight: 900;
        }

        .brand small {
          margin-top: 2px;
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .languages {
          padding: 4px;
          display: flex;
          border-radius: 10px;
          background: #eaecf0;
        }

        .languages button {
          padding: 8px 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #667085;
          font-size: 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .languages .active {
          background: white;
          color: #1465e8;
        }

        .container {
          width: calc(100% - 24px);
          max-width: 720px;
          margin: auto;
          padding: 35px 0 65px;
        }

        .back {
          display: inline-block;
          margin-bottom: 19px;
          color: #667085;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
        }

        .chatCard {
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 24px;
          background: white;
          box-shadow: 0 22px 60px rgba(16, 24, 40, 0.08);
        }

        .chatHeader {
          padding: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-bottom: 1px solid #eaecf0;
        }

        .profileIdentity {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .profilePhoto {
          width: 61px;
          height: 61px;
          flex: 0 0 61px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          background: linear-gradient(
            135deg,
            #eef4ff,
            #f0edff
          );
          font-size: 28px;
        }

        .profilePhoto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .eyebrow {
          color: #7655f7;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .profileIdentity h1 {
          margin: 4px 0;
          font-size: 21px;
        }

        .profileIdentity p {
          margin: 0;
          color: #667085;
          font-size: 10px;
        }

        .onlineBadge {
          padding: 7px 9px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-radius: 999px;
          background: #ecfdf3;
          color: #027a48;
          font-size: 9px;
          font-weight: 900;
        }

        .onlineBadge > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #12b76a;
        }

        .privacyNotice {
          margin: 18px 20px 0;
          padding: 12px;
          display: flex;
          gap: 10px;
          border: 1px solid #dbe7ff;
          border-radius: 12px;
          background: #f5f9ff;
        }

        .privacyIcon {
          width: 33px;
          height: 33px;
          flex: 0 0 33px;
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
          height: min(53vh, 500px);
          min-height: 340px;
          padding: 22px 20px;
          overflow-y: auto;
          background: #fafbfc;
        }

        .emptyMessages {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #667085;
        }

        .emptyMessages > div {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #eef4ff;
          font-size: 25px;
        }

        .emptyMessages h3 {
          margin: 12px 0 5px;
          color: #344054;
          font-size: 15px;
        }

        .emptyMessages p {
          max-width: 330px;
          margin: 0;
          font-size: 10px;
          line-height: 1.55;
        }

        .messageRow {
          margin-bottom: 13px;
          display: flex;
          flex-direction: column;
        }

        .messageRow.mine {
          align-items: flex-end;
        }

        .messageRow.theirs {
          align-items: flex-start;
        }

        .sender {
          margin: 0 0 4px 5px;
          color: #98a2b3;
          font-size: 8px;
          font-weight: 800;
        }

        .bubble {
          max-width: min(78%, 430px);
          padding: 11px 12px 7px;
          border-radius: 15px;
        }

        .mine .bubble {
          border-bottom-right-radius: 5px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
        }

        .theirs .bubble {
          border: 1px solid #e4e7ec;
          border-bottom-left-radius: 5px;
          background: white;
          color: #344054;
        }

        .bubble p {
          margin: 0;
          font-size: 11px;
          line-height: 1.55;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        .bubble > span {
          margin-top: 5px;
          display: block;
          font-size: 7px;
          text-align: right;
          opacity: 0.65;
        }

        .inlineError {
          margin: 0 20px 10px;
          padding: 9px 11px;
          border-radius: 9px;
          background: #fff1f0;
          color: #b42318;
          font-size: 9px;
        }

        .composer {
          padding: 15px 18px 8px;
          display: flex;
          align-items: flex-end;
          gap: 9px;
          border-top: 1px solid #eaecf0;
          background: white;
        }

        .composer textarea {
          flex: 1;
          min-height: 47px;
          max-height: 130px;
          padding: 13px;
          border: 1px solid #d0d5dd;
          border-radius: 12px;
          outline: none;
          resize: vertical;
        }

        .composer textarea:focus {
          border-color: #84adff;
          box-shadow: 0 0 0 3px rgba(20, 101, 232, 0.08);
        }

        .composer button {
          min-height: 47px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 0;
          border-radius: 11px;
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

        .composerFooter {
          padding: 0 19px 13px;
          display: flex;
          justify-content: space-between;
          color: #98a2b3;
          font-size: 8px;
        }

        .closedState {
          padding: 75px 25px;
          text-align: center;
        }

        .closedIcon {
          width: 65px;
          height: 65px;
          margin: auto;
          display: grid;
          place-items: center;
          border-radius: 18px;
          background: #f2f4f7;
          font-size: 29px;
        }

        .closedState h2 {
          margin: 15px 0 7px;
          font-size: 20px;
        }

        .closedState p {
          max-width: 430px;
          margin: auto;
          color: #667085;
          font-size: 10px;
          line-height: 1.6;
        }

        .closedState a {
          margin-top: 18px;
          display: inline-flex;
          padding: 11px 14px;
          border-radius: 9px;
          background: #1465e8;
          color: white;
          font-size: 10px;
          font-weight: 900;
          text-decoration: none;
        }

        .errorBox {
          margin-top: 14px;
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
            flex-direction: column;
          }

          .onlineBadge {
            margin-left: 74px;
          }

          .messages {
            height: 52vh;
            min-height: 320px;
          }

          .bubble {
            max-width: 87%;
          }

          .composer button {
            padding: 0 12px;
          }
        }
      `}</style>
    </main>
  );
}
