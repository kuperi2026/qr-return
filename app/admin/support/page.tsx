"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type Conversation = {
  id: string;
  user_id: string;
  status: "open" | "closed";
  auto_welcome_sent: boolean;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: number;
  conversation_id: string;
  sender: "user" | "support" | "auto";
  message: string | null;
  attachment_path: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_at: string;
};

type ConversationView = Conversation & {
  lastMessage: Message | null;
};

function shortUserId(value: string) {
  if (!value) return "Guest";

  return `Guest • ${value.slice(0, 8)}`;
}

function formatDate(value: string, lang: Lang) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    lang === "ka" ? "ka-GE" : "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
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

    void context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      880,
      context.currentTime
    );

    gain.gain.setValueAtTime(
      0.11,
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
    // browser may block sound before user interaction
  }
}

export default function AdminSupportPage() {
  const [lang, setLang] =
    useState<Lang>("ka");

  const [adminChecked, setAdminChecked] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [conversations, setConversations] =
    useState<ConversationView[]>([]);

  const [selectedId, setSelectedId] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [reply, setReply] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  const [soundEnabled, setSoundEnabled] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  const selectedConversation =
    useMemo(
      () =>
        conversations.find(
          (item) =>
            item.id === selectedId
        ) || null,
      [conversations, selectedId]
    );

  const newCount =
    conversations.filter(
      (conversation) =>
        conversation.lastMessage?.sender ===
        "user"
    ).length;

  /*
    ==============================================
    ADMIN CHECK
    ==============================================
  */

  useEffect(() => {
    async function checkAdmin() {
      setLoading(true);
      setError("");

      const {
        data: userData,
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !userData.user
      ) {
        setAdminChecked(true);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const {
        data: adminRecord,
        error: adminError,
      } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq(
          "user_id",
          userData.user.id
        )
        .maybeSingle();

      if (adminError) {
        setError(
          adminError.message
        );

        setAdminChecked(true);
        setLoading(false);
        return;
      }

      const allowed =
        Boolean(adminRecord);

      setIsAdmin(allowed);
      setAdminChecked(true);

      if (!allowed) {
        setLoading(false);
        return;
      }

      await loadConversations();

      setLoading(false);
    }

    void checkAdmin();
  }, []);

  /*
    ==============================================
    LOAD ALL CONVERSATIONS
    ==============================================
  */

  async function loadConversations() {
    const {
      data: conversationData,
      error: conversationError,
    } = await supabase
      .from(
        "support_conversations"
      )
      .select(`
        id,
        user_id,
        status,
        auto_welcome_sent,
        created_at,
        updated_at
      `)
      .order(
        "updated_at",
        {
          ascending: false,
        }
      );

    if (conversationError) {
      setError(
        conversationError.message
      );

      return;
    }

    const {
      data: messageData,
      error: messageError,
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
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(3000);

    if (messageError) {
      setError(
        messageError.message
      );

      return;
    }

    const rows =
      (messageData || []) as Message[];

    const lastMap =
      new Map<string, Message>();

    for (const message of rows) {
      if (
        !lastMap.has(
          message.conversation_id
        )
      ) {
        lastMap.set(
          message.conversation_id,
          message
        );
      }
    }

    const view =
      (
        conversationData || []
      ).map(
        (conversation) => ({
          ...(conversation as Conversation),

          lastMessage:
            lastMap.get(
              conversation.id
            ) || null,
        })
      );

    view.sort((a, b) => {
      const aDate =
        a.lastMessage?.created_at ||
        a.updated_at;

      const bDate =
        b.lastMessage?.created_at ||
        b.updated_at;

      return (
        new Date(bDate).getTime() -
        new Date(aDate).getTime()
      );
    });

    setConversations(view);

    if (
      !selectedId &&
      view.length > 0
    ) {
      setSelectedId(
        view[0].id
      );
    }
  }

  /*
    ==============================================
    LOAD SELECTED CHAT
    ==============================================
  */

  useEffect(() => {
    if (
      !selectedId ||
      !isAdmin
    ) {
      setMessages([]);
      return;
    }

    let active = true;

    async function loadMessages() {
      const {
        data,
        error: loadError,
      } = await supabase
        .from(
          "support_messages"
        )
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
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

      if (!active) {
        return;
      }

      if (loadError) {
        setError(
          loadError.message
        );

        return;
      }

      setMessages(
        (data || []) as Message[]
      );
    }

    void loadMessages();

    return () => {
      active = false;
    };
  }, [selectedId, isAdmin]);

  /*
    ==============================================
    REALTIME
    ==============================================
  */

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const channel = supabase
      .channel(
        "admin-support-inbox"
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
            payload.new as Message;

          if (
            next.sender ===
            "user"
          ) {
            if (soundEnabled) {
              playNotificationSound();
            }
          }

          /*
            თუ გახსნილი ჩატის მესიჯია,
            პირდაპირ იქაც ვამატებთ.
          */

          if (
            next.conversation_id ===
            selectedId
          ) {
            setMessages(
              (current) => {
                const exists =
                  current.some(
                    (message) =>
                      message.id ===
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

          /*
            Inbox-ს თავიდან ვტვირთავთ,
            რომ ბოლო შეტყობინება ზედა
            ნაწილში გადავიდეს.
          */

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

  /*
    ==============================================
    SEND ADMIN REPLY
    ==============================================
  */

  async function sendReply(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const clean =
      reply.trim();

    if (
      !clean ||
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
        .from(
          "support_messages"
        )
        .insert({
          conversation_id:
            selectedId,

          sender: "support",

          message: clean,
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
        setError(
          sendError.message
        );

        return;
      }

      if (data) {
        const next =
          data as Message;

        setMessages(
          (current) => {
            const exists =
              current.some(
                (message) =>
                  message.id ===
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

      setReply("");

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

      await loadConversations();
    } finally {
      setSending(false);
    }
  }

  /*
    ==============================================
    CLOSE / REOPEN CONVERSATION
    ==============================================
  */

  async function toggleStatus() {
    if (!selectedConversation) {
      return;
    }

    const nextStatus =
      selectedConversation.status ===
      "open"
        ? "closed"
        : "open";

    const {
      error: statusError,
    } = await supabase
      .from(
        "support_conversations"
      )
      .update({
        status: nextStatus,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        selectedConversation.id
      );

    if (statusError) {
      setError(
        statusError.message
      );

      return;
    }

    await loadConversations();
  }

  /*
    ==============================================
    STATES
    ==============================================
  */

  if (
    loading ||
    !adminChecked
  ) {
    return (
      <main className="statePage">
        <div className="loader" />

        <strong>
          {ka
            ? "Admin Support იტვირთება..."
            : "Loading Admin Support..."}
        </strong>

        <Styles />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="statePage">
        <div className="lock">
          🔒
        </div>

        <h1>
          {ka
            ? "Admin წვდომაა საჭირო"
            : "Admin access required"}
        </h1>

        <p>
          {ka
            ? "ამ გვერდის ნახვა მხოლოდ QR RETURN ადმინისტრატორს შეუძლია."
            : "Only a QR RETURN administrator can access this page."}
        </p>

        <a href="/login">
          {ka
            ? "Admin ანგარიშით შესვლა"
            : "Sign in as Admin"}
        </a>

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
                ? "sound enabled"
                : "sound"
            }
            onClick={() => {
              setSoundEnabled(true);
              playNotificationSound();
            }}
          >
            {soundEnabled
              ? "🔔"
              : "🔕"}

            <span>
              {ka
                ? "ხმა"
                : "Sound"}
            </span>
          </button>

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
        </div>
      </header>

      <section className="dashboard">
        <aside className="inbox">
          <div className="inboxHeader">
            <div>
              <span className="eyebrow">
                SUPPORT INBOX
              </span>

              <h1>
                {ka
                  ? "შეტყობინებები"
                  : "Messages"}
              </h1>
            </div>

            {newCount > 0 && (
              <div className="newBadge">
                {newCount}
              </div>
            )}
          </div>

          {conversations.length ===
          0 ? (
            <div className="emptyInbox">
              <div>💬</div>

              <strong>
                {ka
                  ? "შეტყობინებები ჯერ არ არის"
                  : "No conversations yet"}
              </strong>
            </div>
          ) : (
            <div className="conversationList">
              {conversations.map(
                (conversation) => {
                  const active =
                    conversation.id ===
                    selectedId;

                  const incoming =
                    conversation
                      .lastMessage
                      ?.sender ===
                    "user";

                  return (
                    <button
                      type="button"
                      key={
                        conversation.id
                      }
                      className={
                        active
                          ? "conversation active"
                          : "conversation"
                      }
                      onClick={() =>
                        setSelectedId(
                          conversation.id
                        )
                      }
                    >
                      <div className="avatar">
                        👤

                        {incoming && (
                          <i />
                        )}
                      </div>

                      <div className="conversationCopy">
                        <div className="conversationTop">
                          <strong>
                            {shortUserId(
                              conversation.user_id
                            )}
                          </strong>

                          <time>
                            {conversation.lastMessage
                              ? formatDate(
                                  conversation
                                    .lastMessage
                                    .created_at,
                                  lang
                                )
                              : ""}
                          </time>
                        </div>

                        <p>
                          {conversation.lastMessage
                            ?.message ||
                            conversation.lastMessage
                              ?.attachment_name ||
                            (ka
                              ? "ახალი საუბარი"
                              : "New conversation")}
                        </p>

                        <div className="conversationMeta">
                          {conversation.status ===
                          "open"
                            ? ka
                              ? "🟢 ღია"
                              : "🟢 Open"
                            : ka
                            ? "⚪ დახურული"
                            : "⚪ Closed"}

                          {incoming && (
                            <span>
                              {ka
                                ? "ახალი"
                                : "New"}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}
        </aside>

        <section className="chatPanel">
          {!selectedConversation ? (
            <div className="selectChat">
              <div>💬</div>

              <h2>
                {ka
                  ? "აირჩიეთ საუბარი"
                  : "Select a conversation"}
              </h2>
            </div>
          ) : (
            <>
              <header className="chatHeader">
                <div className="userIdentity">
                  <div className="userAvatar">
                    👤
                  </div>

                  <div>
                    <strong>
                      {shortUserId(
                        selectedConversation.user_id
                      )}
                    </strong>

                    <span>
                      {selectedConversation.status ===
                      "open"
                        ? ka
                          ? "🟢 აქტიური საუბარი"
                          : "🟢 Active conversation"
                        : ka
                        ? "⚪ საუბარი დახურულია"
                        : "⚪ Conversation closed"}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="statusButton"
                  onClick={
                    toggleStatus
                  }
                >
                  {selectedConversation.status ===
                  "open"
                    ? ka
                      ? "დახურვა"
                      : "Close"
                    : ka
                    ? "ხელახლა გახსნა"
                    : "Reopen"}
                </button>
              </header>

              <div className="messages">
                {messages.length ===
                  0 && (
                  <div className="noMessages">
                    {ka
                      ? "საუბარი ჯერ ცარიელია."
                      : "No messages in this conversation yet."}
                  </div>
                )}

                {messages.map(
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
                              ? "AUTO"
                              : ka
                              ? "მომხმარებელი"
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
                            {formatDate(
                              message.created_at,
                              lang
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
              </div>

              {error && (
                <div className="errorBox">
                  ⚠ {error}
                </div>
              )}

              <form
                className="composer"
                onSubmit={sendReply}
              >
                <textarea
                  value={reply}
                  maxLength={2000}
                  placeholder={
                    selectedConversation.status ===
                    "closed"
                      ? ka
                        ? "საუბარი დახურულია..."
                        : "Conversation is closed..."
                      : ka
                      ? "დაწერეთ პასუხი..."
                      : "Write a reply..."
                  }
                  disabled={
                    selectedConversation.status ===
                    "closed"
                  }
                  onChange={(
                    event
                  ) =>
                    setReply(
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
                        reply.trim() &&
                        !sending &&
                        selectedConversation.status ===
                          "open"
                      ) {
                        event.currentTarget.form?.requestSubmit();
                      }
                    }
                  }}
                />

                <div className="composerBottom">
                  <span>
                    {ka
                      ? "Enter — გაგზავნა • Shift + Enter — ახალი ხაზი"
                      : "Enter — send • Shift + Enter — new line"}
                  </span>

                  <button
                    type="submit"
                    disabled={
                      !reply.trim() ||
                      sending ||
                      selectedConversation.status ===
                        "closed"
                    }
                  >
                    {sending
                      ? "..."
                      : ka
                      ? "გაგზავნა ➜"
                      : "Send ➜"}
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
    let alive = true;

    async function loadUrl() {
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
        alive &&
        !error &&
        data?.signedUrl
      ) {
        setUrl(
          data.signedUrl
        );
      }
    }

    void loadUrl();

    return () => {
      alive = false;
    };
  }, [path]);

  if (!url) {
    return (
      <div className="attachmentLoading">
        📎 {name}
      </div>
    );
  }

  const image =
    Boolean(
      type?.startsWith(
        "image/"
      )
    );

  if (image) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="imageAttachment"
      >
        <img
          src={url}
          alt={name}
        />

        <span>
          🔍{" "}
          {ka
            ? "ფოტოს გახსნა"
            : "Open image"}
        </span>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fileAttachment"
    >
      📎 {name}

      <span>
        {ka
          ? "გახსნა"
          : "Open"}
      </span>
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
        background: #f5f7fb;
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
        background: #f5f7fb;
      }

      .topHeader {
        min-height: 74px;
        padding: 0 24px;
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
        width: 43px;
        height: 43px;
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

      .brand strong,
      .brand small {
        display: block;
      }

      .brand strong {
        color: #1465e8;
        font-size: 17px;
        font-weight: 900;
      }

      .brand small {
        margin-top: 2px;
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.8px;
      }

      .headerActions,
      .languages {
        display: flex;
        align-items: center;
      }

      .headerActions {
        gap: 9px;
      }

      .languages {
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

      .sound {
        min-height: 38px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        border: 1px solid #e4e7ec;
        border-radius: 9px;
        background: white;
        color: #667085;
        font-size: 9px;
        cursor: pointer;
      }

      .sound.enabled {
        border-color: #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .dashboard {
        height: calc(100vh - 74px);
        display: grid;
        grid-template-columns: 350px minmax(0, 1fr);
      }

      .inbox {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-right: 1px solid #e4e7ec;
        background: white;
      }

      .inboxHeader {
        min-height: 105px;
        padding: 21px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eaecf0;
      }

      .eyebrow {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .inboxHeader h1 {
        margin: 5px 0 0;
        font-size: 24px;
      }

      .newBadge {
        min-width: 29px;
        height: 29px;
        padding: 0 8px;
        display: grid;
        place-items: center;
        border-radius: 20px;
        background: #d92d20;
        color: white;
        font-size: 10px;
        font-weight: 900;
      }

      .conversationList {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .conversation {
        width: 100%;
        margin-bottom: 5px;
        padding: 11px;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 0;
        border-radius: 12px;
        background: transparent;
        color: inherit;
        text-align: left;
        cursor: pointer;
      }

      .conversation:hover {
        background: #f7f8fc;
      }

      .conversation.active {
        background: #f2f0ff;
      }

      .avatar {
        width: 43px;
        height: 43px;
        flex: 0 0 43px;
        position: relative;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eef4ff;
        font-size: 19px;
      }

      .avatar i {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 10px;
        height: 10px;
        border: 2px solid white;
        border-radius: 50%;
        background: #d92d20;
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
        color: #344054;
        font-size: 11px;
      }

      .conversationTop time {
        color: #98a2b3;
        font-size: 7px;
        white-space: nowrap;
      }

      .conversation p {
        margin: 5px 0;
        overflow: hidden;
        color: #667085;
        font-size: 9px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .conversationMeta {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #98a2b3;
        font-size: 7px;
      }

      .conversationMeta span {
        padding: 2px 5px;
        border-radius: 5px;
        background: #fff1f0;
        color: #d92d20;
        font-weight: 900;
      }

      .emptyInbox {
        flex: 1;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 7px;
        color: #98a2b3;
        text-align: center;
      }

      .emptyInbox > div {
        font-size: 35px;
      }

      .chatPanel {
        min-width: 0;
        display: flex;
        flex-direction: column;
        background: #fafbff;
      }

      .chatHeader {
        min-height: 76px;
        padding: 13px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
        background: white;
      }

      .userIdentity {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .userAvatar {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: #eef4ff;
        font-size: 20px;
      }

      .userIdentity strong,
      .userIdentity span {
        display: block;
      }

      .userIdentity strong {
        color: #344054;
        font-size: 12px;
      }

      .userIdentity span {
        margin-top: 4px;
        color: #667085;
        font-size: 8px;
      }

      .statusButton {
        padding: 8px 11px;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        background: white;
        color: #475467;
        font-size: 8px;
        font-weight: 800;
        cursor: pointer;
      }

      .messages {
        flex: 1;
        padding: 22px;
        overflow-y: auto;
      }

      .messageRow {
        margin-bottom: 9px;
        display: flex;
      }

      .messageRow.mine {
        justify-content: flex-end;
      }

      .bubble {
        max-width: 67%;
        padding: 10px 12px;
        border: 1px solid #e4e7ec;
        border-radius: 5px 14px 14px 14px;
        background: white;
        color: #344054;
      }

      .bubble.mine {
        border-color: #1465e8;
        border-radius: 14px 5px 14px 14px;
        background: #1465e8;
        color: white;
      }

      .sender {
        margin-bottom: 5px;
        color: #667085;
        font-size: 7px;
        font-weight: 900;
      }

      .bubble.mine .sender {
        color: rgba(255,255,255,.75);
      }

      .messageText {
        font-size: 11px;
        line-height: 1.5;
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
        color: rgba(255,255,255,.65);
      }

      .imageAttachment {
        margin-top: 8px;
        display: block;
        color: inherit;
        text-decoration: none;
      }

      .imageAttachment img {
        width: 180px;
        max-width: 100%;
        max-height: 160px;
        display: block;
        object-fit: cover;
        border-radius: 9px;
      }

      .imageAttachment span {
        margin-top: 4px;
        display: block;
        font-size: 8px;
        font-weight: 800;
      }

      .fileAttachment {
        margin-top: 8px;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        border-radius: 8px;
        background: rgba(242,244,247,.9);
        color: #344054;
        font-size: 9px;
        font-weight: 800;
        text-decoration: none;
      }

      .fileAttachment span {
        color: #1465e8;
      }

      .attachmentLoading {
        margin-top: 7px;
        font-size: 8px;
      }

      .composer {
        padding: 12px 15px;
        border-top: 1px solid #e4e7ec;
        background: white;
      }

      .composer textarea {
        width: 100%;
        min-height: 64px;
        max-height: 120px;
        padding: 9px;
        border: 1px solid #e4e7ec;
        border-radius: 10px;
        outline: none;
        resize: none;
        font-size: 11px;
      }

      .composerBottom {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .composerBottom span {
        color: #98a2b3;
        font-size: 7px;
      }

      .composerBottom button {
        min-height: 37px;
        padding: 0 15px;
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
      }

      .composerBottom button:disabled {
        opacity: .4;
        cursor: not-allowed;
      }

      .errorBox {
        margin: 7px 15px;
        padding: 8px;
        border: 1px solid #fecdca;
        border-radius: 8px;
        background: #fff1f0;
        color: #b42318;
        font-size: 8px;
      }

      .selectChat,
      .noMessages {
        flex: 1;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 5px;
        color: #98a2b3;
        text-align: center;
      }

      .selectChat > div {
        font-size: 38px;
      }

      .selectChat h2 {
        margin: 0;
        color: #667085;
        font-size: 15px;
      }

      .statePage {
        min-height: 100vh;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #f5f7fb;
        color: #344054;
        font-family: Inter, Arial, sans-serif;
        text-align: center;
      }

      .statePage p {
        max-width: 420px;
        color: #667085;
        font-size: 11px;
        line-height: 1.5;
      }

      .statePage a {
        margin-top: 10px;
        padding: 10px 14px;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
      }

      .lock {
        font-size: 40px;
      }

      .loader {
        width: 35px;
        height: 35px;
        margin-bottom: 10px;
        border: 3px solid #e4e7ec;
        border-top-color: #1465e8;
        border-radius: 50%;
        animation: spin .8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 800px) {
        .dashboard {
          height: auto;
          min-height: calc(100vh - 74px);
          grid-template-columns: 1fr;
        }

        .inbox {
          max-height: 330px;
          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .chatPanel {
          min-height: 600px;
        }

        .bubble {
          max-width: 84%;
        }
      }
    `}</style>
  );
}
