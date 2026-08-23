"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  useParams,
} from "next/navigation";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(
        supabaseUrl,
        supabaseKey
      )
    : null;

type ChatMessage = {
  id: number;
  profile_type: string | null;
  tag_code: string;
  sender_type: string;
  sender_session: string | null;
  message: string;
  created_at: string;
};

export default function EmergencyLiveChatPage() {
  const params =
    useParams();

  const tagCode =
    decodeURIComponent(
      String(
        params?.tagCode || ""
      )
    )
      .trim()
      .toUpperCase();

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([]);

  const [
    newMessage,
    setNewMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    sending,
    setSending,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    senderType,
    setSenderType,
  ] = useState<
    "finder" | "owner"
  >("finder");

  const finderSession =
    useMemo(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return "";
      }

      const key =
        `qr-return-emergency-chat-${tagCode}`;

      const existing =
        window.localStorage.getItem(
          key
        );

      if (existing) {
        return existing;
      }

      const session =
        typeof crypto !==
          "undefined" &&
        "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      window.localStorage.setItem(
        key,
        session
      );

      return session;
    }, [tagCode]);

  useEffect(() => {
    if (!tagCode) {
      return;
    }

    initializeChat();
  }, [tagCode]);

  async function initializeChat() {
    if (!supabase) {
      setErrorMessage(
        "Supabase configuration is missing."
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: authData,
      } =
        await supabase.auth.getUser();

      if (authData.user) {
        const {
          data: owner,
        } =
          await supabase
            .from(
              "owner_accounts"
            )
            .select(
              "user_id"
            )
            .eq(
              "user_id",
              authData.user.id
            )
            .maybeSingle();

        if (owner) {
          setSenderType(
            "owner"
          );
        }
      }

      await loadMessages();
    } catch (error) {
      console.error(
        "CHAT INITIALIZATION ERROR:",
        error
      );

      setErrorMessage(
        "Live Chat-ის ჩატვირთვა ვერ მოხერხდა."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    if (!supabase) {
      return;
    }

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "live_chat_messages"
        )
        .select(
          `
          id,
          profile_type,
          tag_code,
          sender_type,
          sender_session,
          message,
          created_at
          `
        )
        .eq(
          "profile_type",
          "emergency"
        )
        .eq(
          "tag_code",
          tagCode
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {
      throw error;
    }

    setMessages(
      (data || []) as ChatMessage[]
    );
  }

  useEffect(() => {
    if (
      !supabase ||
      !tagCode
    ) {
      return;
    }

    const channel =
      supabase
        .channel(
          `emergency-chat-${tagCode}`
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table:
              "live_chat_messages",
            filter:
              `tag_code=eq.${tagCode}`,
          },
          (payload) => {
            const message =
              payload.new as ChatMessage;

            if (
              message.profile_type !==
              "emergency"
            ) {
              return;
            }

            setMessages(
              (current) => {
                const exists =
                  current.some(
                    (item) =>
                      item.id ===
                      message.id
                  );

                if (exists) {
                  return current;
                }

                return [
                  ...current,
                  message,
                ];
              }
            );
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [tagCode]);

  async function sendMessage() {
    if (
      !supabase ||
      sending
    ) {
      return;
    }

    const text =
      newMessage.trim();

    if (!text) {
      return;
    }

    try {
      setSending(true);
      setErrorMessage("");

      const {
        data,
        error,
      } =
        await supabase
          .from(
            "live_chat_messages"
          )
          .insert({
            profile_type:
              "emergency",

            tag_code:
              tagCode,

            sender_type:
              senderType,

            sender_session:
              finderSession ||
              null,

            message:
              text,
          })
          .select(
            `
            id,
            profile_type,
            tag_code,
            sender_type,
            sender_session,
            message,
            created_at
            `
          )
          .single();

      if (error) {
        throw error;
      }

      setNewMessage("");

      setMessages(
        (current) => {
          const exists =
            current.some(
              (item) =>
                item.id ===
                data.id
            );

          if (exists) {
            return current;
          }

          return [
            ...current,
            data as ChatMessage,
          ];
        }
      );
    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );

      setErrorMessage(
        "შეტყობინების გაგზავნა ვერ მოხერხდა."
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(
    event:
      React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  return (
    <main className="page">
      <header className="header">
        <a
          href="/"
          className="brand"
        >
          <div className="logo">
            QR
          </div>

          <div>
            <strong>
              QR RETURN
            </strong>

            <span>
              EMERGENCY LIVE CHAT
            </span>
          </div>
        </a>

        <div className="secure">
          LIVE
        </div>
      </header>

      <section className="chatCard">
        <div className="chatHeader">
          <div className="emergencyIcon">
            +
          </div>

          <div>
            <span className="eyebrow">
              EMERGENCY PROFILE
            </span>

            <h1>
              Live Chat
            </h1>

            <p>
              QR: {tagCode}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="error">
            {errorMessage}
          </div>
        )}

        <div className="messages">
          {loading ? (
            <div className="empty">
              <strong>
                იტვირთება...
              </strong>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty">
              <div className="emptyIcon">
                💬
              </div>

              <strong>
                დაიწყეთ საუბარი
              </strong>

              <p>
                დაწერეთ შეტყობინება
                პროფილის მფლობელთან
                დასაკავშირებლად.
              </p>
            </div>
          ) : (
            messages.map(
              (item) => {
                const mine =
                  item.sender_type ===
                  senderType;

                return (
                  <div
                    key={
                      item.id
                    }
                    className={
                      mine
                        ? "messageRow mine"
                        : "messageRow"
                    }
                  >
                    <div className="messageLabel">
                      {item.sender_type ===
                      "owner"
                        ? "OWNER"
                        : "FINDER"}
                    </div>

                    <div className="bubble">
                      {item.message}

                      <span>
                        {new Date(
                          item.created_at
                        ).toLocaleTimeString(
                          [],
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                );
              }
            )
          )}
        </div>

        <div className="composer">
          <textarea
            value={
              newMessage
            }
            onChange={
              (event) =>
                setNewMessage(
                  event.target.value
                )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder="დაწერეთ შეტყობინება..."
            maxLength={1000}
          />

          <button
            type="button"
            onClick={
              sendMessage
            }
            disabled={
              sending ||
              !newMessage.trim()
            }
          >
            {sending
              ? "..."
              : "გაგზავნა"}
          </button>
        </div>

        <div className="footerNote">
          QR RETURN • Emergency Live Chat
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 0 18px 35px;
          background: #0747c9;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Arial,
            sans-serif;
        }

        .header {
          width: 100%;
          max-width: 800px;
          height: 72px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom:
            1px solid
            rgba(
              255,
              255,
              255,
              .2
            );
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          text-decoration: none;
        }

        .logo {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: white;
          color: #0747c9;
          font-size: 13px;
          font-weight: 950;
        }

        .brand strong,
        .brand span {
          display: block;
        }

        .brand span {
          margin-top: 2px;
          color:
            rgba(
              255,
              255,
              255,
              .7
            );
          font-size: 9px;
        }

        .secure {
          padding: 7px 11px;
          border-radius: 999px;
          background:
            rgba(
              255,
              255,
              255,
              .13
            );
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .chatCard {
          width: 100%;
          max-width: 700px;
          margin: 25px auto 0;
          overflow: hidden;
          border-radius: 20px;
          background: white;
          box-shadow:
            0 24px 55px
            rgba(
              0,
              20,
              70,
              .24
            );
        }

        .chatHeader {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 13px;
          border-bottom:
            1px solid #e3eaf2;
        }

        .emergencyIcon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #0747c9;
          color: white;
          font-size: 28px;
          font-weight: 900;
        }

        .eyebrow {
          color: #0747c9;
          font-size: 9px;
          font-weight: 900;
        }

        h1 {
          margin: 2px 0 0;
          color: #203a55;
          font-size: 23px;
        }

        .chatHeader p {
          margin: 3px 0 0;
          color: #7a8b9c;
          font-size: 11px;
        }

        .error {
          margin: 12px 15px 0;
          padding: 10px 12px;
          border-radius: 9px;
          background: #fff1f1;
          color: #b42318;
          font-size: 12px;
          font-weight: 700;
        }

        .messages {
          height: 430px;
          padding: 18px;
          overflow-y: auto;
          background: #f6f8fb;
        }

        .empty {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #63788e;
        }

        .emptyIcon {
          margin-bottom: 9px;
          font-size: 35px;
        }

        .empty strong {
          color: #304a65;
          font-size: 17px;
        }

        .empty p {
          max-width: 310px;
          margin: 5px 0 0;
          font-size: 12px;
          line-height: 1.5;
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

        .messageLabel {
          margin: 0 5px 4px;
          color: #8b9aab;
          font-size: 8px;
          font-weight: 900;
        }

        .bubble {
          max-width: 78%;
          padding: 10px 12px;
          border-radius:
            13px 13px 13px 3px;
          background: white;
          color: #344d66;
          font-size: 13px;
          line-height: 1.45;
        }

        .mine .bubble {
          border-radius:
            13px 13px 3px 13px;
          background: #0747c9;
          color: white;
        }

        .bubble span {
          display: block;
          margin-top: 5px;
          text-align: right;
          opacity: .6;
          font-size: 8px;
        }

        .composer {
          padding: 13px;
          display: grid;
          grid-template-columns:
            1fr auto;
          gap: 9px;
          border-top:
            1px solid #e1e8ef;
          background: white;
        }

        .composer textarea {
          min-height: 48px;
          max-height: 120px;
          padding: 12px;
          resize: none;
          border:
            1.5px solid #d6e0ea;
          border-radius: 10px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
        }

        .composer button {
          min-width: 100px;
          padding: 0 17px;
          border: 0;
          border-radius: 10px;
          background: #0747c9;
          color: white;
          font-weight: 850;
          cursor: pointer;
        }

        .composer button:disabled {
          opacity: .45;
          cursor: not-allowed;
        }

        .footerNote {
          padding: 9px;
          border-top:
            1px solid #eef2f6;
          color: #9aa7b4;
          text-align: center;
          font-size: 8px;
        }

        @media (
          max-width: 600px
        ) {
          .page {
            padding:
              0 10px 20px;
          }

          .chatCard {
            margin-top: 15px;
            border-radius: 15px;
          }

          .messages {
            height: 60vh;
            min-height: 350px;
          }

          .composer {
            grid-template-columns:
              1fr;
          }

          .composer button {
            height: 45px;
          }
        }
      `}</style>
    </main>
  );
}
