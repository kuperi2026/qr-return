"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  user_id: string;
  status: "open" | "closed";
  auto_welcome_sent: boolean;
  created_at: string;
  updated_at: string;
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

type ConversationPreview = Conversation & {
  last_message: string;
  last_sender: "user" | "support" | "auto" | null;
  last_message_at: string;
};

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ka-GE", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function playNotificationSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();

    if (context.state === "suspended") {
      void context.resume();
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      880,
      context.currentTime
    );

    gain.gain.setValueAtTime(
      0.12,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.22
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(
      context.currentTime + 0.22
    );
  } catch {
    // Browser may block audio before user interaction.
  }
}

export default function AdminSupportPage() {
  const [conversations, setConversations] =
    useState<ConversationPreview[]>([]);

  const [selectedId, setSelectedId] =
    useState<string>("");

  const [messages, setMessages] =
    useState<SupportMessage[]>([]);

  const [text, setText] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [messagesLoading, setMessagesLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [soundEnabled, setSoundEnabled] =
    useState(false);

  const [newCount, setNewCount] =
    useState(0);

  const [isAdmin, setIsAdmin] =
    useState<boolean | null>(null);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const selectedConversation =
    useMemo(
      () =>
        conversations.find(
          (conversation) =>
            conversation.id ===
            selectedId
        ) || null,
      [conversations, selectedId]
    );

  useEffect(() => {
    async function checkAdmin() {
      setLoading(true);
      setError("");

      const {
        data: userData,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        setError(
          userError.message
        );
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const user =
        userData.user;

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const {
        data: adminRow,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError) {
        setError(
          adminError.message
        );
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(
        Boolean(adminRow)
      );

      setLoading(false);
    }

    void checkAdmin();
  }, []);

  async function loadConversations() {
    if (!isAdmin) {
      return;
    }

    setLoading(true);
    setError("");

    const {
      data: conversationData,
      error: conversationError,
    } = await supabase
      .from("support_conversations")
      .select(`
        id,
        user_id,
        status,
        auto_welcome_sent,
        created_at,
        updated_at
      `)
      .order("updated_at", {
        ascending: false,
      });

    if (conversationError) {
      setError(
        conversationError.message
      );
      setLoading(false);
      return;
    }

    const rows =
      (conversationData ||
        []) as Conversation[];

    const previews:
      ConversationPreview[] =
      [];

    for (const conversation of rows) {
      const {
        data: lastMessageData,
      } = await supabase
        .from("support_messages")
        .select(`
          sender,
          message,
          created_at
        `)
        .eq(
          "conversation_id",
          conversation.id
        )
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      previews.push({
        ...conversation,
        last_message:
          lastMessageData?.message ||
          "",
        last_sender:
          (lastMessageData?.sender ||
            null) as
            | "user"
            | "support"
            | "auto"
            | null,
        last_message_at:
          lastMessageData?.created_at ||
          conversation.updated_at,
      });
    }

    previews.sort(
      (a, b) =>
        new Date(
          b.last_message_at
        ).getTime() -
        new Date(
          a.last_message_at
        ).getTime()
    );

    setConversations(
      previews
    );

    if (
      previews.length > 0 &&
      !selectedId
    ) {
      setSelectedId(
        previews[0].id
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) {
      void loadConversations();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedId || !isAdmin) {
      return;
    }

    async function loadMessages() {
      setMessagesLoading(true);
      setError("");

      const {
        data,
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
          selectedId
        )
        .order("created_at", {
          ascending: true,
        });

      if (messagesError) {
        setError(
          messagesError.message
        );
        setMessagesLoading(false);
        return;
      }

      setMessages(
        (data ||
          []) as SupportMessage[]
      );

      setMessagesLoading(false);
    }

    void loadMessages();
  }, [selectedId, isAdmin]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const channel = supabase
      .channel(
        "admin-support-live"
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table:
            "support_messages",
        },
        (payload) => {
          const next =
            payload.new as SupportMessage;

          if (
            next.sender === "user"
          ) {
            setNewCount(
              (current) =>
                current + 1
            );

            if (soundEnabled) {
              playNotificationSound();
            }
          }

          if (
            next.conversation_id ===
            selectedId
          ) {
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

          void loadConversations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(
        channel
      );
    };
  }, [
    isAdmin,
    selectedId,
    soundEnabled,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanText =
      text.trim();

    if (
      !cleanText ||
      !selectedId ||
      sending
    ) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const {
        data,
        error: sendError,
      } = await supabase
        .from("support_messages")
        .insert({
          conversation_id:
            selectedId,
          sender: "support",
          message:
            cleanText,
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

      if (data) {
        const next =
          data as SupportMessage;

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

      await supabase
        .from(
          "support_conversations"
        )
        .update({
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          selectedId
        );

      setText("");

      await loadConversations();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : String(err);

      setError(
        `პასუხი ვერ გაიგზავნა: ${message}`
      );
    } finally {
      setSending(false);
    }
  }

  function enableSound() {
    setSoundEnabled(true);
    playNotificationSound();
  }

  if (loading && isAdmin === null) {
    return (
      <main className="statePage">
        <div className="loader" />
        <strong>
          Admin იტვირთება...
        </strong>

        <Styles />
      </main>
    );
  }

  if (isAdmin === false) {
    return (
      <main className="statePage">
        <div className="lockIcon">
          🔒
        </div>

        <h1>
          Admin Access
        </h1>

        <p>
          ამ გვერდზე წვდომა მხოლოდ
          QR RETURN Admin-ს აქვს.
        </p>

        <a
          href="/login"
          className="loginLink"
        >
          შესვლა
        </a>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <Styles />
      </main>
    );
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
              ADMIN SUPPORT
            </small>
          </div>
        </a>

        <div className="headerActions">
          <button
            type="button"
            className={
              soundEnabled
                ? "soundButton active"
                : "soundButton"
            }
            onClick={
              enableSound
            }
          >
            {soundEnabled
              ? "🔔"
              : "🔕"}

            {soundEnabled
              ? " ხმა ჩართულია"
              : " ხმის ჩართვა"}
          </button>

          {newCount > 0 && (
            <div className="newBadge">
              {newCount} ახალი
            </div>
          )}
        </div>
      </header>

      <section className="adminLayout">
        <aside className="sidebar">
          <div className="sidebarTitle">
            <div>
              <span>
                SUPPORT INBOX
              </span>

              <h1>
                შეტყობინებები
              </h1>
            </div>

            <button
              type="button"
              className="refresh"
              onClick={() =>
                void loadConversations()
              }
            >
              ↻
            </button>
          </div>

          {conversations.length ===
            0 && (
            <div className="emptySidebar">
              ჯერ არავის მოუწერია.
            </div>
          )}

          <div className="conversationList">
            {conversations.map(
              (conversation) => {
                const selected =
                  conversation.id ===
                  selectedId;

                const fromUser =
                  conversation.last_sender ===
                  "user";

                return (
                  <button
                    key={
                      conversation.id
                    }
                    type="button"
                    className={
                      selected
                        ? "conversation selected"
                        : "conversation"
                    }
                    onClick={() => {
                      setSelectedId(
                        conversation.id
                      );

                      setNewCount(0);
                    }}
                  >
                    <div className="avatar">
                      👤
                    </div>

                    <div className="conversationCopy">
                      <div className="conversationTop">
                        <strong>
                          Guest
                        </strong>

                        <time>
                          {formatDateTime(
                            conversation.last_message_at
                          )}
                        </time>
                      </div>

                      <div className="conversationId">
                        {conversation.user_id.slice(
                          0,
                          8
                        )}
                      </div>

                      <p>
                        {fromUser
                          ? "● "
                          : ""}

                        {conversation.last_message ||
                          "ახალი საუბარი"}
                      </p>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </aside>

        <section className="chatPanel">
          {!selectedConversation ? (
            <div className="emptyChat">
              <div>
                💬
              </div>

              <h2>
                აირჩიეთ საუბარი
              </h2>
            </div>
          ) : (
            <>
              <header className="chatHeader">
                <div>
                  <strong>
                    Support Conversation
                  </strong>

                  <span>
                    User:{" "}
                    {selectedConversation.user_id}
                  </span>
                </div>

                <div
                  className={
                    selectedConversation.status ===
                    "open"
                      ? "status open"
                      : "status"
                  }
                >
                  ●{" "}
                  {selectedConversation.status}
                </div>
              </header>

              <div className="messages">
                {messagesLoading && (
                  <div className="loadingMessages">
                    <div className="loader" />
                  </div>
                )}

                {!messagesLoading &&
                  messages.map(
                    (message) => {
                      const mine =
                        message.sender ===
                        "support";

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
                            <div className="sender">
                              {message.sender ===
                              "support"
                                ? "QR RETURN"
                                : message.sender ===
                                  "auto"
                                ? "Auto Reply"
                                : "User"}
                            </div>

                            {message.message && (
                              <div className="messageText">
                                {
                                  message.message
                                }
                              </div>
                            )}

                            {message.attachment_path && (
                              <AdminAttachment
                                path={
                                  message.attachment_path
                                }
                                name={
                                  message.attachment_name ||
                                  "ფაილი"
                                }
                                type={
                                  message.attachment_type
                                }
                              />
                            )}

                            <time>
                              {formatDateTime(
                                message.created_at
                              )}
                            </time>
                          </div>
                        </div>
                      );
                    }
                  )}

                <div ref={bottomRef} />
              </div>

              {error && (
                <div className="error">
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
                  value={text}
                  placeholder="დაწერეთ პასუხი..."
                  maxLength={2000}
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
                        !sending &&
                        text.trim()
                      ) {
                        event.currentTarget.form?.requestSubmit();
                      }
                    }
                  }}
                />

                <div className="composerBottom">
                  <span>
                    Enter — გაგზავნა
                  </span>

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !text.trim()
                    }
                  >
                    {sending
                      ? "იგზავნება..."
                      : "გაგზავნა ➜"}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
      </section>

      <Styles />
    </main>
  );
}

function AdminAttachment({
  path,
  name,
  type,
}: {
  path: string;
  name: string;
  type: string | null;
}) {
  const [url, setUrl] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadUrl() {
      const {
        data,
      } = await supabase.storage
        .from(
          "support-attachments"
        )
        .createSignedUrl(
          path,
          3600
        );

      if (
        active &&
        data?.signedUrl
      ) {
        setUrl(
          data.signedUrl
        );
      }
    }

    void loadUrl();

    return () => {
      active = false;
    };
  }, [path]);

  if (!url) {
    return (
      <div className="fileLoading">
        📎 {name}
      </div>
    );
  }

  if (
    type?.startsWith("image/")
  ) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="imageLink"
      >
        <img
          src={url}
          alt={name}
        />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fileLink"
    >
      📎 {name} — გახსნა
    </a>
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
        background: #f4f6fa;
      }

      button,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
        color: #101828;
        font-family:
          Inter,
          Arial,
          sans-serif;
      }

      .topHeader {
        min-height: 72px;
        padding: 0 22px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 1px solid #e4e7ec;
        background: white;
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

        background: #1465e8;
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
        font-size: 17px;
      }

      .brand small {
        margin-top: 2px;
        color: #667085;
        font-size: 8px;
        letter-spacing: 1.5px;
      }

      .headerActions {
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .soundButton {
        padding: 9px 11px;

        border: 1px solid #d0d5dd;
        border-radius: 9px;

        background: white;
        color: #475467;

        font-size: 10px;
        font-weight: 800;

        cursor: pointer;
      }

      .soundButton.active {
        border-color: #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .newBadge {
        padding: 7px 10px;

        border-radius: 20px;

        background: #d92d20;
        color: white;

        font-size: 10px;
        font-weight: 900;
      }

      .adminLayout {
        height: calc(100vh - 72px);

        display: grid;
        grid-template-columns:
          350px 1fr;
      }

      .sidebar {
        overflow-y: auto;

        border-right: 1px solid #e4e7ec;

        background: white;
      }

      .sidebarTitle {
        position: sticky;
        top: 0;
        z-index: 2;

        padding: 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 1px solid #eaecf0;

        background: white;
      }

      .sidebarTitle span {
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .sidebarTitle h1 {
        margin: 5px 0 0;
        font-size: 21px;
      }

      .refresh {
        width: 35px;
        height: 35px;

        border: 0;
        border-radius: 9px;

        background: #f2f4f7;

        color: #475467;
        font-size: 18px;

        cursor: pointer;
      }

      .conversationList {
        padding: 10px;
      }

      .conversation {
        width: 100%;

        padding: 12px;

        display: flex;
        align-items: center;

        gap: 10px;

        border: 0;
        border-radius: 12px;

        background: transparent;

        text-align: left;

        cursor: pointer;
      }

      .conversation:hover {
        background: #f7f9fc;
      }

      .conversation.selected {
        background: #eef4ff;
      }

      .avatar {
        width: 43px;
        height: 43px;
        flex: 0 0 43px;

        display: grid;
        place-items: center;

        border-radius: 12px;

        background: #f2f4f7;

        font-size: 20px;
      }

      .conversationCopy {
        min-width: 0;
        flex: 1;
      }

      .conversationTop {
        display: flex;
        justify-content: space-between;
        gap: 7px;
      }

      .conversationTop strong {
        font-size: 12px;
      }

      .conversationTop time {
        color: #98a2b3;
        font-size: 8px;
        white-space: nowrap;
      }

      .conversationId {
        margin-top: 2px;

        color: #1465e8;

        font-size: 8px;
        font-weight: 800;
      }

      .conversation p {
        margin: 5px 0 0;

        overflow: hidden;

        color: #667085;

        font-size: 10px;

        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .emptySidebar {
        padding: 35px 20px;

        color: #98a2b3;

        font-size: 11px;

        text-align: center;
      }

      .chatPanel {
        min-width: 0;

        display: flex;
        flex-direction: column;

        background: #f8fafc;
      }

      .chatHeader {
        min-height: 70px;

        padding: 15px 20px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        border-bottom: 1px solid #e4e7ec;

        background: white;
      }

      .chatHeader strong,
      .chatHeader span {
        display: block;
      }

      .chatHeader strong {
        font-size: 14px;
      }

      .chatHeader span {
        margin-top: 4px;

        color: #667085;

        font-size: 9px;
      }

      .status {
        color: #667085;

        font-size: 9px;
        font-weight: 800;
      }

      .status.open {
        color: #067647;
      }

      .messages {
        flex: 1;

        padding: 20px;

        overflow-y: auto;
      }

      .messageRow {
        margin-bottom: 10px;

        display: flex;
      }

      .messageRow.mine {
        justify-content: flex-end;
      }

      .bubble {
        max-width: 65%;

        padding: 10px 12px;

        border: 1px solid #e4e7ec;
        border-radius:
          5px 14px 14px 14px;

        background: white;

        color: #344054;

        font-size: 12px;
        line-height: 1.5;
      }

      .bubble.mine {
        border-color: #1465e8;
        border-radius:
          14px 5px 14px 14px;

        background: #1465e8;

        color: white;
      }

      .sender {
        margin-bottom: 5px;

        color: #667085;

        font-size: 8px;
        font-weight: 900;
      }

      .bubble.mine .sender {
        color: rgba(
          255,
          255,
          255,
          0.72
        );
      }

      .messageText {
        white-space: pre-wrap;
        word-break: break-word;
      }

      .bubble time {
        margin-top: 6px;

        display: block;

        color: #98a2b3;

        font-size: 7px;

        text-align: right;
      }

      .bubble.mine time {
        color: rgba(
          255,
          255,
          255,
          0.68
        );
      }

      .imageLink {
        margin-top: 8px;
        display: block;
      }

      .imageLink img {
        width: 100%;
        max-width: 320px;
        max-height: 260px;

        object-fit: cover;

        border-radius: 9px;
      }

      .fileLink,
      .fileLoading {
        margin-top: 8px;

        display: block;

        color: inherit;

        font-size: 10px;
      }

      .composer {
        padding: 12px;

        border-top: 1px solid #e4e7ec;

        background: white;
      }

      .composer textarea {
        width: 100%;
        min-height: 70px;
        max-height: 120px;

        padding: 10px;

        border: 1px solid #e4e7ec;
        border-radius: 10px;

        outline: none;
        resize: none;

        font-size: 12px;
      }

      .composerBottom {
        margin-top: 8px;

        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .composerBottom span {
        color: #98a2b3;

        font-size: 8px;
      }

      .composerBottom button {
        min-height: 39px;

        padding: 0 16px;

        border: 0;
        border-radius: 9px;

        background: #1465e8;
        color: white;

        font-size: 10px;
        font-weight: 900;

        cursor: pointer;
      }

      .composerBottom button:disabled {
        opacity: 0.4;
      }

      .error {
        margin: 10px 12px;

        padding: 10px;

        border: 1px solid #fecdca;
        border-radius: 9px;

        background: #fff1f0;
        color: #b42318;

        font-size: 10px;
      }

      .emptyChat {
        flex: 1;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        color: #98a2b3;
      }

      .emptyChat > div {
        font-size: 40px;
      }

      .emptyChat h2 {
        margin-top: 10px;
        font-size: 15px;
      }

      .loadingMessages {
        min-height: 200px;

        display: grid;
        place-items: center;
      }

      .statePage {
        min-height: 100vh;

        display: flex;
        flex-direction: column;

        align-items: center;
        justify-content: center;

        background: #f6f8fc;

        font-family:
          Inter,
          Arial,
          sans-serif;

        text-align: center;
      }

      .lockIcon {
        font-size: 42px;
      }

      .statePage h1 {
        margin: 12px 0 5px;
      }

      .statePage p {
        color: #667085;
        font-size: 12px;
      }

      .loginLink {
        margin-top: 15px;

        padding: 10px 15px;

        border-radius: 9px;

        background: #1465e8;
        color: white;

        text-decoration: none;

        font-size: 11px;
        font-weight: 900;
      }

      .loader {
        width: 32px;
        height: 32px;

        margin-bottom: 10px;

        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;

        border-radius: 50%;

        animation:
          spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 850px) {
        .adminLayout {
          grid-template-columns: 1fr;
          height: auto;
        }

        .sidebar {
          max-height: 40vh;

          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .chatPanel {
          min-height: 60vh;
        }

        .bubble {
          max-width: 85%;
        }
      }
    `}</style>
  );
}
