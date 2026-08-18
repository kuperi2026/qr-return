"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  language: "ka" | "en";
};

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

function isImageType(type: string | null) {
  return Boolean(type?.startsWith("image/"));
}

export default function SupportLauncher({
  language,
}: Props) {
  const ka = language === "ka";

  const [open, setOpen] = useState(false);

  const [conversation, setConversation] =
    useState<SupportConversation | null>(null);

  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [userId, setUserId] = useState("");

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(false);

  const [error, setError] = useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || ready) {
      return;
    }

    let cancelled = false;

    async function startSupport() {
      setLoading(true);
      setReady(false);
      setError("");

      try {
        let {
          data: userData,
          error: userError,
        } = await supabase.auth.getUser();

        if (!userData.user) {
          const {
            data: anonymousData,
            error: anonymousError,
          } = await supabase.auth.signInAnonymously();

          if (anonymousError) {
            throw new Error(
              anonymousError.message
            );
          }

          if (!anonymousData.user) {
            throw new Error(
              ka
                ? "Anonymous მომხმარებელი ვერ შეიქმნა."
                : "Anonymous user could not be created."
            );
          }

          const result =
            await supabase.auth.getUser();

          userData = result.data;
          userError = result.error;
        }

        if (userError) {
          throw new Error(
            userError.message
          );
        }

        const user =
          userData.user;

        if (!user) {
          throw new Error(
            ka
              ? "Support მომხმარებელი ვერ მოიძებნა."
              : "Support user could not be found."
          );
        }

        if (cancelled) {
          return;
        }

        setUserId(user.id);

        const {
          data: existingConversation,
          error: findError,
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

        if (findError) {
          throw new Error(
            findError.message
          );
        }

        let currentConversation:
          SupportConversation;

        if (existingConversation) {
          currentConversation =
            existingConversation as SupportConversation;
        } else {
          const {
            data: createdConversation,
            error: createError,
          } = await supabase
            .from("support_conversations")
            .insert({
              user_id: user.id,
              status: "open",
            })
            .select(`
              id,
              user_id,
              status,
              auto_welcome_sent
            `)
            .single();

          if (createError) {
            throw new Error(
              createError.message
            );
          }

          if (!createdConversation) {
            throw new Error(
              ka
                ? "Support საუბარი ვერ შეიქმნა."
                : "Support conversation could not be created."
            );
          }

          currentConversation =
            createdConversation as SupportConversation;
        }

        if (cancelled) {
          return;
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
          throw new Error(
            messagesError.message
          );
        }

        if (cancelled) {
          return;
        }

        setMessages(
          (messageData ||
            []) as SupportMessage[]
        );

        setReady(true);
      } catch (err) {
        console.error(
          "Support initialization error:",
          err
        );

        const message =
          err instanceof Error
            ? err.message
            : String(err);

        if (!cancelled) {
          setError(
            ka
              ? `ჩატის გახსნა ვერ მოხერხდა: ${message}`
              : `Could not open chat: ${message}`
          );

          setReady(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void startSupport();

    return () => {
      cancelled = true;
    };
  }, [open, ready, ka]);

  useEffect(() => {
    if (!conversation?.id) {
      return;
    }

    const channel = supabase
      .channel(
        `support-widget-${conversation.id}`
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter:
            `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const next =
            payload.new as SupportMessage;

          setMessages(
            (current) => {
              const alreadyExists =
                current.some(
                  (item) =>
                    item.id ===
                    next.id
                );

              if (alreadyExists) {
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
  }, [conversation?.id]);

  useEffect(() => {
    if (!open) {
      return;
    }

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, open]);

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

  async function sendAutomaticWelcome(
    currentConversation:
      SupportConversation
  ) {
    if (
      currentConversation.auto_welcome_sent
    ) {
      return;
    }

    const {
      data: updatedConversation,
      error: updateError,
    } = await supabase
      .from("support_conversations")
      .update({
        auto_welcome_sent: true,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        currentConversation.id
      )
      .eq(
        "auto_welcome_sent",
        false
      )
      .select(`
        id,
        user_id,
        status,
        auto_welcome_sent
      `)
      .maybeSingle();

    if (updateError) {
      console.error(
        updateError
      );

      return;
    }

    if (!updatedConversation) {
      return;
    }

    const {
      error: welcomeError,
    } = await supabase
      .from("support_messages")
      .insert({
        conversation_id:
          currentConversation.id,

        sender: "auto",

        message: ka
          ? KA_WELCOME
          : EN_WELCOME,
      });

    if (welcomeError) {
      console.error(
        welcomeError
      );

      return;
    }

    setConversation(
      (current) =>
        current
          ? {
              ...current,
              auto_welcome_sent:
                true,
            }
          : current
    );
  }

  async function sendMessage(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!ready) {
      setError(
        ka
          ? "ჩატი ჯერ იტვირთება. სცადეთ რამდენიმე წამში."
          : "Chat is still loading. Please try again in a moment."
      );

      return;
    }

    if (!conversation) {
      setError(
        ka
          ? "Support საუბარი ვერ მოიძებნა."
          : "Support conversation was not found."
      );

      return;
    }

    if (!userId) {
      setError(
        ka
          ? "მომხმარებელი ვერ მოიძებნა."
          : "User was not found."
      );

      return;
    }

    if (sending) {
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
          throw new Error(
            ka
              ? `ფაილის ატვირთვა ვერ მოხერხდა: ${uploadError.message}`
              : `Could not upload file: ${uploadError.message}`
          );
        }
      }

      const {
        data: insertedMessage,
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
        })
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
        .single();

      if (sendError) {
        throw new Error(
          sendError.message
        );
      }

      if (insertedMessage) {
        const next =
          insertedMessage as SupportMessage;

        setMessages(
          (current) => {
            const exists =
              current.some(
                (item) =>
                  item.id ===
                  next.id
              );

            return exists
              ? current
              : [
                  ...current,
                  next,
                ];
          }
        );
      }

      setText("");
      setFile(null);

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      await sendAutomaticWelcome(
        conversation
      );
    } catch (err) {
      console.error(
        "Support send error:",
        err
      );

      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(
        ka
          ? `შეტყობინება ვერ გაიგზავნა: ${message}`
          : `Message could not be sent: ${message}`
      );
    } finally {
      setSending(false);
    }
  }

  function retryChat() {
    setConversation(null);
    setMessages([]);
    setUserId("");
    setReady(false);
    setError("");
  }

  return (
    <>
      {open && (
        <section className="supportWindow">
          <header className="chatHeader">
            <div className="agentSmall">
              <span className="girl">
                👩‍💻
              </span>

              <span className="headset">
                🎧
              </span>

              <i />
            </div>

            <div className="headerCopy">
              <strong>
                QR RETURN
              </strong>

              <span>
                <i
                  className={
                    ready
                      ? "statusDot ready"
                      : "statusDot"
                  }
                />

                {ready
                  ? ka
                    ? "Support • მზადაა"
                    : "Support • Ready"
                  : ka
                  ? "Support • დაკავშირება..."
                  : "Support • Connecting..."}
              </span>
            </div>

            <button
              type="button"
              className="close"
              onClick={() =>
                setOpen(false)
              }
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="messages">
            {loading && (
              <div className="loading">
                <div className="loader" />

                <span>
                  {ka
                    ? "Live Chat იტვირთება..."
                    : "Loading Live Chat..."}
                </span>
              </div>
            )}

            {!loading &&
              ready &&
              messages.length ===
                0 && (
                <div className="welcome">
                  <div className="welcomeAgent">
                    👩‍💻🎧
                  </div>

                  <strong>
                    {ka
                      ? "მოგესალმებით 👋"
                      : "Hello 👋"}
                  </strong>

                  <p>
                    {ka
                      ? "როგორ შეგვიძლია დაგეხმაროთ?"
                      : "How can we help you?"}
                  </p>
                </div>
              )}

            {!loading &&
              !ready &&
              error && (
                <div className="loadError">
                  <strong>
                    {ka
                      ? "ჩატი ვერ დაუკავშირდა"
                      : "Chat could not connect"}
                  </strong>

                  <button
                    type="button"
                    onClick={
                      retryChat
                    }
                  >
                    {ka
                      ? "სცადეთ თავიდან"
                      : "Try again"}
                  </button>
                </div>
              )}

            {messages.map(
              (message) => {
                const mine =
                  message.sender ===
                  "user";

                return (
                  <div
                    key={
                      message.id
                    }
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
                      <div className="senderLabel">
                        {message.sender ===
                        "user"
                          ? ka
                            ? "თქვენ"
                            : "You"
                          : message.sender ===
                            "auto"
                          ? "QR RETURN"
                          : ka
                          ? "ჩვენი წარმომადგენელი"
                          : "Support"}
                      </div>

                      {message.message && (
                        <div className="messageText">
                          {
                            message.message
                          }
                        </div>
                      )}

                      {message.attachment_path && (
                        <AttachmentPreview
                          path={
                            message.attachment_path
                          }
                          name={
                            message.attachment_name ||
                            (ka
                              ? "ფაილი"
                              : "File")
                          }
                          type={
                            message.attachment_type
                          }
                          ka={ka}
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
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                );
              }
            )}

            <div ref={bottomRef} />
          </div>

          {error && ready && (
            <div className="errorBox">
              ⚠ {error}
            </div>
          )}

          {file && (
            <div className="filePreview">
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
              disabled={!ready}
              placeholder={
                loading
                  ? ka
                    ? "ჩატი იტვირთება..."
                    : "Loading chat..."
                  : ka
                  ? "დაწერეთ შეტყობინება..."
                  : "Write a message..."
              }
              onChange={(event) =>
                setText(
                  event.target.value
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
                    ready &&
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
              <input
                ref={fileInputRef}
                id="support-widget-file"
                type="file"
                hidden
                disabled={!ready}
                accept="image/*,.pdf,.txt,.doc,.docx"
                onChange={selectFile}
              />

              <label
                htmlFor="support-widget-file"
                className={
                  ready
                    ? "attach"
                    : "attach disabled"
                }
                title={
                  ka
                    ? "ფოტო ან ფაილი"
                    : "Photo or file"
                }
              >
                📎
              </label>

              <div className="sendArea">
                {!ready && (
                  <span className="connectingText">
                    {ka
                      ? "დაკავშირება..."
                      : "Connecting..."}
                  </span>
                )}

                <button
                  type="submit"
                  className="send"
                  disabled={
                    !ready ||
                    sending ||
                    (!text.trim() &&
                      !file)
                  }
                  title={
                    ka
                      ? "გაგზავნა"
                      : "Send"
                  }
                >
                  {sending
                    ? "•••"
                    : "➜"}
                </button>
              </div>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className="supportLauncher"
        onClick={() =>
          setOpen(
            (current) =>
              !current
          )
        }
      >
        <div className="agent">
          <div className="face">
            👩‍💻
          </div>

          <div className="launcherHeadset">
            🎧
          </div>

          <span className="onlineDot" />
        </div>

        <div className="copy">
          <strong>
            Live Chat
          </strong>

          <span>
            {ka
              ? "დაგვიკავშირდით"
              : "Chat with us"}
          </span>
        </div>

        <div className="arrow">
          {open ? "×" : "›"}
        </div>
      </button>

      <style jsx>{`
        .supportLauncher {
          position: fixed;
          z-index: 9999;
          right: 22px;
          bottom: 125px;

          min-width: 190px;

          padding:
            10px 14px 10px 10px;

          display: flex;
          align-items: center;

          gap: 11px;

          border:
            1px solid
            rgba(
              92,
              79,
              220,
              0.2
            );

          border-radius: 17px;

          background:
            linear-gradient(
              135deg,
              rgba(
                255,
                255,
                255,
                0.98
              ),
              rgba(
                242,
                240,
                255,
                0.98
              )
            );

          box-shadow:
            0 14px 35px
            rgba(
              49,
              42,
              120,
              0.18
            );

          color: #101828;

          cursor: pointer;
        }

        .agent {
          width: 50px;
          height: 50px;

          flex: 0 0 50px;

          position: relative;

          display: grid;
          place-items: center;

          border-radius: 14px;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #ede9fe
            );
        }

        .face {
          font-size: 27px;
        }

        .launcherHeadset {
          position: absolute;

          right: -4px;
          top: -6px;

          font-size: 15px;
        }

        .onlineDot {
          position: absolute;

          right: 1px;
          bottom: 1px;

          width: 11px;
          height: 11px;

          border:
            2px solid white;

          border-radius: 50%;

          background: #12b76a;
        }

        .copy {
          flex: 1;

          text-align: left;
        }

        .copy strong,
        .copy span {
          display: block;
        }

        .copy strong {
          color: #4f46e5;

          font-size: 15px;
          font-weight: 900;
        }

        .copy span {
          margin-top: 4px;

          color: #667085;

          font-size: 11px;
          font-weight: 700;
        }

        .arrow {
          color: #7655f7;

          font-size: 22px;
        }

        .supportWindow {
          position: fixed;

          z-index: 10000;

          right: 22px;
          bottom: 195px;

          width: 350px;
          height: 480px;

          display: flex;
          flex-direction: column;

          overflow: hidden;

          border:
            1px solid #e4e7ec;

          border-radius: 19px;

          background: white;

          box-shadow:
            0 22px 60px
            rgba(
              25,
              30,
              70,
              0.22
            );
        }

        .chatHeader {
          min-height: 72px;

          padding: 13px 15px;

          display: flex;
          align-items: center;

          gap: 11px;

          border-bottom:
            1px solid #eaecf0;

          background:
            linear-gradient(
              135deg,
              #ffffff,
              #f4f3ff
            );
        }

        .agentSmall {
          width: 48px;
          height: 48px;

          position: relative;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #dbeafe,
              #ede9fe
            );
        }

        .girl {
          font-size: 25px;
        }

        .headset {
          position: absolute;

          right: -3px;
          top: -5px;

          font-size: 14px;
        }

        .agentSmall > i {
          position: absolute;

          right: 1px;
          bottom: 1px;

          width: 10px;
          height: 10px;

          border:
            2px solid white;

          border-radius: 50%;

          background: #12b76a;
        }

        .headerCopy {
          flex: 1;
        }

        .headerCopy strong,
        .headerCopy span {
          display: block;
        }

        .headerCopy strong {
          color: #1465e8;

          font-size: 15px;
          font-weight: 900;
        }

        .headerCopy span {
          margin-top: 4px;

          color: #475467;

          font-size: 11px;
          font-weight: 700;
        }

        .statusDot {
          width: 7px;
          height: 7px;

          margin-right: 5px;

          display: inline-block;

          border-radius: 50%;

          background: #f79009;
        }

        .statusDot.ready {
          background: #12b76a;
        }

        .close {
          width: 34px;
          height: 34px;

          border: 0;

          border-radius: 8px;

          background: #f2f4f7;

          color: #667085;

          font-size: 20px;

          cursor: pointer;
        }

        .messages {
          flex: 1;

          padding: 15px;

          overflow-y: auto;

          background:
            linear-gradient(
              180deg,
              #fafbff,
              #ffffff
            );
        }

        .welcome {
          margin-top: 40px;

          text-align: center;
        }

        .welcomeAgent {
          margin-bottom: 10px;

          font-size: 36px;
        }

        .welcome strong {
          font-size: 16px;
        }

        .welcome p {
          margin: 5px 0 0;

          color: #667085;

          font-size: 12px;
        }

        .loading {
          min-height: 250px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 11px;

          color: #667085;

          font-size: 12px;
        }

        .loader {
          width: 30px;
          height: 30px;

          border:
            3px solid #e4e7ec;

          border-top-color:
            #1465e8;

          border-radius: 50%;

          animation:
            spin 0.8s
            linear infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        .loadError {
          min-height: 220px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          gap: 10px;

          color: #b42318;

          text-align: center;
        }

        .loadError strong {
          font-size: 12px;
        }

        .loadError button {
          padding:
            9px 13px;

          border: 0;

          border-radius: 8px;

          background: #1465e8;

          color: white;

          font-size: 10px;

          cursor: pointer;
        }

        .messageRow {
          margin-bottom: 10px;

          display: flex;
        }

        .messageRow.mine {
          justify-content:
            flex-end;
        }

        .bubble {
          max-width: 82%;

          padding: 10px 12px;

          border:
            1px solid #e4e7ec;

          border-radius:
            6px
            14px
            14px
            14px;

          background: white;

          color: #344054;

          font-size: 13px;

          line-height: 1.5;
        }

        .bubble.mine {
          border-color:
            #5b5ce2;

          border-radius:
            14px
            6px
            14px
            14px;

          background:
            linear-gradient(
              135deg,
              #1465e8,
              #6c55e8
            );

          color: white;
        }

        .senderLabel {
          margin-bottom: 5px;

          color: #667085;

          font-size: 9px;

          font-weight: 800;
        }

        .bubble.mine
          .senderLabel {
          color:
            rgba(
              255,
              255,
              255,
              0.75
            );
        }

        .messageText {
          white-space:
            pre-wrap;

          word-break:
            break-word;
        }

        .bubble time {
          margin-top: 6px;

          display: block;

          color: #98a2b3;

          font-size: 8px;

          text-align: right;
        }

        .bubble.mine time {
          color:
            rgba(
              255,
              255,
              255,
              0.7
            );
        }

        .attachmentPreview {
          margin-top: 9px;
        }

        .attachmentImage {
          display: block;

          width: 100%;
          max-height: 180px;

          object-fit: cover;

          border-radius: 10px;

          cursor: pointer;

          border: 1px solid rgba(0, 0, 0, 0.08);
        }

        .fileCard {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 8px;

          padding: 9px 10px;

          border-radius: 9px;

          background: rgba(
            255,
            255,
            255,
            0.16
          );

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.18
            );
        }

        .bubble:not(.mine)
          .fileCard {
          background: #f8fafc;

          border-color:
            #e4e7ec;
        }

        .fileCard span {
          min-width: 0;

          overflow: hidden;

          text-overflow: ellipsis;

          white-space: nowrap;

          font-size: 10px;
        }

        .fileCard a {
          flex: 0 0 auto;

          color: inherit;

          font-size: 10px;

          font-weight: 800;

          text-decoration: underline;
        }

        .errorBox {
          margin:
            7px 10px;

          padding: 9px;

          border:
            1px solid #fecdca;

          border-radius: 8px;

          background: #fff1f0;

          color: #b42318;

          font-size: 10px;
        }

        .filePreview {
          margin:
            6px 10px 0;

          padding:
            8px 10px;

          display: flex;

          align-items: center;

          justify-content:
            space-between;

          border-radius: 8px;

          background: #f4f3ff;

          color: #5925dc;

          font-size: 10px;
        }

        .filePreview button {
          border: 0;

          background:
            transparent;

          color: #5925dc;

          cursor: pointer;
        }

        .composer {
          padding: 10px;

          border-top:
            1px solid #eaecf0;

          background: white;
        }

        .composer textarea {
          width: 100%;

          min-height: 58px;
          max-height: 100px;

          padding: 9px;

          border: 0;

          outline: none;

          resize: none;

          color: #101828;

          font-size: 13px;
        }

        .composer textarea:disabled {
          background: white;

          color: #98a2b3;
        }

        .composerBottom {
          display: flex;

          align-items: center;

          justify-content:
            space-between;

          gap: 8px;
        }

        .attach {
          width: 36px;
          height: 36px;

          display: grid;
          place-items: center;

          border-radius: 8px;

          background: #f2f4f7;

          cursor: pointer;

          font-size: 17px;
        }

        .attach.disabled {
          opacity: 0.4;

          pointer-events: none;
        }

        .sendArea {
          display: flex;

          align-items: center;

          gap: 8px;
        }

        .connectingText {
          color: #98a2b3;

          font-size: 9px;
        }

        .send {
          width: 44px;
          height: 38px;

          border: 0;

          border-radius: 9px;

          background: #1465e8;

          color: white;

          font-size: 18px;

          font-weight: 900;

          cursor: pointer;
        }

        .send:disabled {
          opacity: 0.35;

          cursor:
            not-allowed;
        }

        @media (
          max-width: 600px
        ) {
          .supportLauncher {
            right: 12px;

            bottom: 130px;

            min-width: 170px;
          }

          .supportWindow {
            right: 12px;

            bottom: 200px;

            width:
              calc(
                100vw - 24px
              );

            max-width: 350px;

            height: 460px;
          }
        }
      `}</style>
    </>
  );
}

function AttachmentPreview({
  path,
  name,
  type,
  ka,
}: {
  path: string;
  name: string;
  type: string | null;
  ka: boolean;
}) {
  const [url, setUrl] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadSignedUrl() {
      const {
        data,
        error,
      } = await supabase.storage
        .from(
          "support-attachments"
        )
        .createSignedUrl(
          path,
          60 * 60
        );

      if (
        !active
      ) {
        return;
      }

      if (
        error ||
        !data?.signedUrl
      ) {
        setUrl("");
        return;
      }

      setUrl(
        data.signedUrl
      );
    }

    void loadSignedUrl();

    return () => {
      active = false;
    };
  }, [path]);

  if (!url) {
    return (
      <div className="attachmentPreview">
        <div className="fileCard">
          <span>
            📎 {name}
          </span>

          <span>
            {ka
              ? "იტვირთება..."
              : "Loading..."}
          </span>
        </div>
      </div>
    );
  }

  if (
    isImageType(type)
  ) {
    return (
      <div className="attachmentPreview">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          title={
            ka
              ? "ფოტოს გახსნა"
              : "Open image"
          }
        >
          <img
            src={url}
            alt={name}
            className="attachmentImage"
          />
        </a>
      </div>
    );
  }

  return (
    <div className="attachmentPreview">
      <div className="fileCard">
        <span>
          📎 {name}
        </span>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {ka
            ? "გახსნა"
            : "Open"}
        </a>
      </div>
    </div>
  );
}
