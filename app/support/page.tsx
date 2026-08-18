"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type SupportConversation = {
  id: string;
  user_id: string;
  status: "open" | "closed";
  auto_welcome_sent: boolean;
};

type SupportMessage = {
  id: number;
  conversation_id: string;
  sender: "user" | "support" | "auto";
  message: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_at: string;
};

const SUPPORT_EMAIL = "hello@qrreturn.com";
const SUPPORT_PHONE = "";

const KA_WELCOME =
  "მოგესალმებით! 👋 მადლობა, რომ დაგვიკავშირდით. ჩვენი წარმომადგენელი მალე გიპასუხებთ.";

const EN_WELCOME =
  "Hello! 👋 Thank you for contacting us. One of our representatives will respond shortly.";

function safeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "_")
    .slice(-120);
}

export default function SupportPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [conversation, setConversation] =
    useState<SupportConversation | null>(null);

  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [userId, setUserId] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  useEffect(() => {
    async function startSupport() {
      setLoading(true);
      setError("");

      let { data: sessionData } =
        await supabase.auth.getSession();

      if (!sessionData.session) {
        const {
          data,
          error: anonymousError,
        } =
          await supabase.auth.signInAnonymously();

        if (anonymousError) {
          setError(
            `Support authentication failed: ${anonymousError.message}`
          );

          setLoading(false);
          return;
        }

        sessionData = {
          session: data.session,
        };
      }

      const user =
        sessionData.session?.user;

      if (!user) {
        setError(
          ka
            ? "Support Chat-ის გახსნა ვერ მოხერხდა."
            : "Could not open Support Chat."
        );

        setLoading(false);
        return;
      }

      setUserId(user.id);

      const {
        data: existingConversation,
        error: conversationError,
      } = await supabase
        .from("support_conversations")
        .select(`
          id,
          user_id,
          status,
          auto_welcome_sent
        `)
        .eq("user_id", user.id)
        .eq("status", "open")
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (conversationError) {
        setError(
          conversationError.message
        );

        setLoading(false);
        return;
      }

      let currentConversation:
        SupportConversation;

      if (existingConversation) {
        currentConversation =
          existingConversation as SupportConversation;
      } else {
        const {
          data: created,
          error: createError,
        } = await supabase
          .from("support_conversations")
          .insert({
            user_id: user.id,
          })
          .select(`
            id,
            user_id,
            status,
            auto_welcome_sent
          `)
          .single();

        if (
          createError ||
          !created
        ) {
          setError(
            createError?.message ||
              "Could not create support conversation."
          );

          setLoading(false);
          return;
        }

        currentConversation =
          created as SupportConversation;
      }

      setConversation(
        currentConversation
      );

      const {
        data: messageData,
        error: messagesError,
      } = await supabase
        .from("support_messages")
        .select(`
          id,
          conversation_id,
          sender,
          message,
          attachment_path,
          attachment_name,
          attachment_type,
          created_at
        `)
        .eq(
          "conversation_id",
          currentConversation.id
        )
        .order("created_at", {
          ascending: true,
        });

      if (messagesError) {
        setError(
          messagesError.message
        );

        setLoading(false);
        return;
      }

      setMessages(
        (messageData ||
          []) as SupportMessage[]
      );

      setLoading(false);
    }

    void startSupport();
  }, []);

  useEffect(() => {
    if (!conversation) {
      return;
    }

    const channel = supabase
      .channel(
        `support-${conversation.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table:
            "support_messages",
          filter:
            `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const next =
            payload.new as SupportMessage;

          setMessages(
            (current) => {
              const exists =
                current.some(
                  (item) =>
                    item.id ===
                    next.id
                );

              if (exists) {
                return current;
              }

              return [
                ...current,
                next,
              ];
            }
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [conversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  function selectFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selected =
      event.target.files?.[0];

    if (!selected) {
      return;
    }

    if (
      selected.size >
      5 * 1024 * 1024
    ) {
      setError(
        ka
          ? "ფაილის მაქსიმალური ზომაა 5 MB."
          : "Maximum file size is 5 MB."
      );

      event.target.value = "";
      return;
    }

    setFile(selected);
    setError("");
  }

  async function maybeSendAutomaticWelcome(
    current:
      SupportConversation
  ) {
    if (
      current.auto_welcome_sent
    ) {
      return;
    }

    const {
      data: updated,
      error: updateError,
    } = await supabase
      .from(
        "support_conversations"
      )
      .update({
        auto_welcome_sent: true,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", current.id)
      .eq(
        "auto_welcome_sent",
        false
      )
      .select("id")
      .maybeSingle();

    if (
      updateError ||
      !updated
    ) {
      return;
    }

    const {
      error: welcomeError,
    } = await supabase
      .from("support_messages")
      .insert({
        conversation_id:
          current.id,
        sender: "auto",
        message: ka
          ? KA_WELCOME
          : EN_WELCOME,
      });

    if (welcomeError) {
      console.error(
        welcomeError
      );
    }

    setConversation({
      ...current,
      auto_welcome_sent: true,
    });
  }

  async function sendMessage(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      sending ||
      !conversation ||
      !userId
    ) {
      return;
    }

    const cleanText =
      text.trim();

    if (
      !cleanText &&
      !file
    ) {
      return;
    }

    setSending(true);
    setError("");

    try {
      let attachmentPath:
        string | null = null;

      if (file) {
        const fileName =
          `${Date.now()}-${safeFileName(
            file.name
          )}`;

        attachmentPath =
          `${userId}/${conversation.id}/${fileName}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(
            "support-attachments"
          )
          .upload(
            attachmentPath,
            file,
            {
              cacheControl:
                "3600",
              upsert: false,
              contentType:
                file.type ||
                undefined,
            }
          );

        if (uploadError) {
          setError(
            ka
              ? `ფაილი ვერ აიტვირთა: ${uploadError.message}`
              : `Could not upload file: ${uploadError.message}`
          );

          return;
        }
      }

      const {
        error: sendError,
      } = await supabase
        .from("support_messages")
        .insert({
          conversation_id:
            conversation.id,

          sender: "user",

          message:
            cleanText ||
            null,

          attachment_path:
            attachmentPath,

          attachment_name:
            file?.name ||
            null,

          attachment_type:
            file?.type ||
            null,
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
      setFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      await maybeSendAutomaticWelcome(
        conversation
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="page">
      <header className="topHeader">
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

            <small>
              SUPPORT
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

      <section className="supportPage">
        <div className="agentCard">
          <SupportAgent />

          <div>
            <div className="online">
              <i />

              QR RETURN SUPPORT
            </div>

            <h1>
              {ka
                ? "დაგვიკავშირდით Live Chat-ის საშუალებით"
                : "Contact us via Live Chat"}
            </h1>

            <p>
              {ka
                ? "მოგვწერეთ და ჩვენი წარმომადგენელი დაგეხმარებათ."
                : "Send us a message and our representative will assist you."}
            </p>
          </div>
        </div>

        <section className="chat">
          <div className="chatHead">
            <div>
              <strong>
                💬 Live Chat
              </strong>

              <span>
                <i />

                Support
              </span>
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              ✉️
            </a>
          </div>

          <div className="messages">
            {loading && (
              <div className="loading">
                <div className="loader" />

                <span>
                  {ka
                    ? "იტვირთება..."
                    : "Loading..."}
                </span>
              </div>
            )}

            {!loading &&
              messages.length ===
                0 && (
                <div className="empty">
                  <div>👋</div>

                  <strong>
                    {ka
                      ? "მოგესალმებით!"
                      : "Hello!"}
                  </strong>

                  <p>
                    {ka
                      ? "რით შეგვიძლია დაგეხმაროთ?"
                      : "How can we help you?"}
                  </p>
                </div>
              )}

            {messages.map(
              (message) => (
                <MessageBubble
                  key={message.id}
                  message={
                    message
                  }
                  ka={ka}
                />
              )
            )}

            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="error">
              ⚠ {error}
            </div>
          )}

          {file && (
            <div className="selectedFile">
              <span>
                📎 {file.name}
              </span>

              <button
                type="button"
                onClick={() => {
                  setFile(null);

                  if (
                    fileInputRef.current
                  ) {
                    fileInputRef.current.value =
                      "";
                  }
                }}
              >
                ×
              </button>
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
              onChange={(e) =>
                setText(
                  e.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key ===
                    "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent
                    .isComposing
                ) {
                  event.preventDefault();

                  if (
                    !sending &&
                    (text.trim() ||
                      file)
                  ) {
                    event.currentTarget.form?.requestSubmit();
                  }
                }
              }}
            />

            <div className="composerBottom">
              <div>
                <input
                  ref={
                    fileInputRef
                  }
                  id="support-file"
                  type="file"
                  hidden
                  accept="image/*,.pdf,.txt,.doc,.docx"
                  onChange={
                    selectFile
                  }
                />

                <label
                  htmlFor="support-file"
                  className="attach"
                >
                  📎{" "}
                  {ka
                    ? "ფოტო / ფაილი"
                    : "Photo / file"}
                </label>
              </div>

              <button
                type="submit"
                className="send"
                disabled={
                  sending ||
                  (!text.trim() &&
                    !file)
                }
              >
                {sending
                  ? "..."
                  : ka
                  ? "გაგზავნა ➜"
                  : "Send ➜"}
              </button>
            </div>

            <small>
              {ka
                ? "Enter — გაგზავნა • Shift + Enter — ახალი ხაზი"
                : "Enter — send • Shift + Enter — new line"}
            </small>
          </form>

          <div className="directContact">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              ✉️ {SUPPORT_EMAIL}
            </a>

            {SUPPORT_PHONE && (
              <a
                href={`tel:${SUPPORT_PHONE}`}
              >
                📞 {SUPPORT_PHONE}
              </a>
            )}
          </div>
        </section>
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
          background: #f6f8fc;
        }

        button,
        textarea {
          font: inherit;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 90% 5%,
              rgba(90, 68, 255, 0.11),
              transparent 26%
            ),
            #f6f8fc;
          color: #101828;
          font-family:
            Inter,
            Arial,
            sans-serif;
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
          background: linear-gradient(
            135deg,
            #1465e8,
            #7655f7
          );
          color: white;
          font-size: 11px;
          font-weight: 900;
        }

        .brand strong {
          display: block;
          color: #1465e8;
          font-size: 18px;
          font-weight: 900;
        }

        .brand small {
          display: block;
          margin-top: 2px;
          color: #7b61ff;
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
          color: #1465e8;
        }

        .supportPage {
          width: calc(100% - 24px);
          max-width: 680px;
          margin: auto;
          padding: 30px 0 70px;
        }

        .agentCard {
          padding: 19px;
          display: flex;
          align-items: center;
          gap: 17px;
          border: 1px solid #dedcff;
          border-radius: 20px;
          background: linear-gradient(
            135deg,
            #ffffff,
            #f5f3ff
          );
          box-shadow: 0 16px 45px rgba(65, 50, 130, 0.08);
        }

        .agentSvg {
          width: 90px;
          height: 90px;
          flex: 0 0 90px;
        }

        .online {
          color: #7655f7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .online i {
          width: 7px;
          height: 7px;
          margin-right: 5px;
          display: inline-block;
          border-radius: 50%;
          background: #12b76a;
        }

        .agentCard h1 {
          margin: 7px 0 5px;
          font-size: 20px;
          line-height: 1.2;
        }

        .agentCard p {
          margin: 0;
          color: #667085;
          font-size: 12px;
          line-height: 1.5;
        }

        .chat {
          margin-top: 13px;
          overflow: hidden;
          border: 1px solid #e4e7ec;
          border-radius: 19px;
          background: white;
          box-shadow: 0 14px 40px rgba(16, 24, 40, 0.05);
        }

        .chatHead {
          min-height: 67px;
          padding: 14px 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eaecf0;
        }

        .chatHead strong {
          display: block;
          font-size: 15px;
        }

        .chatHead span {
          margin-top: 4px;
          display: block;
          color: #667085;
          font-size: 10px;
        }

        .chatHead span i {
          width: 7px;
          height: 7px;
          margin-right: 5px;
          display: inline-block;
          border-radius: 50%;
          background: #12b76a;
        }

        .chatHead > a {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f2f4f7;
          text-decoration: none;
        }

        .messages {
          min-height: 360px;
          max-height: 52vh;
          padding: 17px;
          overflow-y: auto;
          background: linear-gradient(
            180deg,
            #fbfcff,
            #ffffff
          );
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
          background: white;
        }

        .bubble.mine {
          border-color: #5d55eb;
          border-radius: 15px 5px 15px 15px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #6f55ee
          );
          color: white;
        }

        .sender {
          margin-bottom: 5px;
          color: #667085;
          font-size: 9px;
          font-weight: 900;
        }

        .bubble.mine .sender {
          color: rgba(255, 255, 255, 0.72);
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
          font-size: 8px;
          text-align: right;
        }

        .bubble.mine time {
          color: rgba(255, 255, 255, 0.65);
        }

        .attachment {
          margin-top: 8px;
        }

        .attachment a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: inherit;
          font-size: 11px;
          font-weight: 800;
        }

        .empty,
        .loading {
          min-height: 310px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty > div {
          font-size: 37px;
        }

        .empty strong {
          margin-top: 10px;
          font-size: 15px;
        }

        .empty p {
          margin: 4px 0 0;
          color: #98a2b3;
          font-size: 11px;
        }

        .loader {
          width: 33px;
          height: 33px;
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

        .selectedFile {
          margin: 10px 12px 0;
          padding: 9px 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          background: #f4f3ff;
          color: #5925dc;
          font-size: 10px;
          font-weight: 700;
        }

        .selectedFile button {
          border: 0;
          background: transparent;
          color: #5925dc;
          font-size: 18px;
          cursor: pointer;
        }

        .composer {
          margin: 12px;
          padding: 11px;
          border: 1px solid #e4e7ec;
          border-radius: 14px;
          background: #ffffff;
        }

        .composer textarea {
          width: 100%;
          min-height: 76px;
          padding: 8px;
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
          gap: 10px;
          border-top: 1px solid #f2f4f7;
        }

        .attach {
          color: #475467;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .send {
          min-height: 40px;
          padding: 0 17px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(
            135deg,
            #1465e8,
            #6e55ef
          );
          color: white;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .send:disabled {
          opacity: 0.5;
        }

        .composer small {
          margin-top: 8px;
          display: block;
          color: #98a2b3;
          font-size: 8px;
        }

        .directContact {
          padding: 0 15px 15px;
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .directContact a {
          color: #1465e8;
          font-size: 10px;
          font-weight: 800;
          text-decoration: none;
        }

        .error {
          margin: 10px 12px;
          padding: 11px;
          border: 1px solid #fecdca;
          border-radius: 10px;
          background: #fff1f0;
          color: #b42318;
          font-size: 10px;
        }

        @media (max-width: 560px) {
          .supportPage {
            padding-top: 19px;
          }

          .agentSvg {
            width: 72px;
            height: 72px;
            flex-basis: 72px;
          }

          .agentCard h1 {
            font-size: 17px;
          }

          .messages {
            min-height: 350px;
          }

          .bubble {
            max-width: 88%;
          }
        }
      `}</style>
    </main>
  );
}

function MessageBubble({
  message,
  ka,
}: {
  message: SupportMessage;
  ka: boolean;
}) {
  const mine =
    message.sender === "user";

  return (
    <div
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
          {message.sender === "user"
            ? ka
              ? "თქვენ"
              : "You"
            : message.sender === "auto"
            ? "QR RETURN"
            : ka
            ? "ჩვენი წარმომადგენელი"
            : "Support representative"}
        </div>

        {message.message && (
          <div className="messageText">
            {message.message}
          </div>
        )}

        {message.attachment_path && (
          <AttachmentLink
            path={
              message.attachment_path
            }
            name={
              message.attachment_name ||
              (ka
                ? "ფაილი"
                : "File")
            }
          />
        )}

        <time>
          {new Date(
            message.created_at
          ).toLocaleTimeString(
            ka
              ? "ka-GE"
              : "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </time>
      </div>
    </div>
  );
}

function AttachmentLink({
  path,
  name,
}: {
  path: string;
  name: string;
}) {
  const [url, setUrl] =
    useState("");

  useEffect(() => {
    async function createUrl() {
      const { data } =
        await supabase.storage
          .from(
            "support-attachments"
          )
          .createSignedUrl(
            path,
            3600
          );

      if (data?.signedUrl) {
        setUrl(
          data.signedUrl
        );
      }
    }

    void createUrl();
  }, [path]);

  if (!url) {
    return (
      <div className="attachment">
        📎 {name}
      </div>
    );
  }

  return (
    <div className="attachment">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        📎 {name}
      </a>
    </div>
  );
}

function SupportAgent() {
  return (
    <svg
      className="agentSvg"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="agentBg"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#dbeafe"
          />
          <stop
            offset="1"
            stopColor="#ede9fe"
          />
        </linearGradient>

        <linearGradient
          id="shirt"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0"
            stopColor="#1465e8"
          />
          <stop
            offset="1"
            stopColor="#7655f7"
          />
        </linearGradient>
      </defs>

      <circle
        cx="60"
        cy="60"
        r="57"
        fill="url(#agentBg)"
      />

      <path
        d="M28 105c3-23 17-34 32-34s29 11 32 34"
        fill="url(#shirt)"
      />

      <ellipse
        cx="60"
        cy="52"
        rx="23"
        ry="27"
        fill="#f4c7a5"
      />

      <path
        d="M36 55c-2-24 10-35 25-35 18 0 29 13 25 38-4-7-8-12-13-16-9 7-20 10-37 13z"
        fill="#38291f"
      />

      <circle
        cx="52"
        cy="53"
        r="2"
        fill="#35251f"
      />

      <circle
        cx="68"
        cy="53"
        r="2"
        fill="#35251f"
      />

      <path
        d="M54 63c4 3 8 3 12 0"
        fill="none"
        stroke="#a55f5c"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M37 52c0-18 10-30 23-30s23 12 23 30"
        fill="none"
        stroke="#1465e8"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <rect
        x="30"
        y="48"
        width="10"
        height="20"
        rx="5"
        fill="#1465e8"
      />

      <rect
        x="80"
        y="48"
        width="10"
        height="20"
        rx="5"
        fill="#1465e8"
      />

      <path
        d="M86 65c1 8-5 12-13 12"
        fill="none"
        stroke="#1465e8"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle
        cx="72"
        cy="77"
        r="3"
        fill="#1465e8"
      />

      <rect
        x="35"
        y="85"
        width="50"
        height="24"
        rx="4"
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth="2"
      />

      <circle
        cx="60"
        cy="96"
        r="4"
        fill="#1465e8"
        opacity=".8"
      />
    </svg>
  );
}
