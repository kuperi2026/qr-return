"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Lang = "ka" | "en";

type ChatRow = {
  profile_type: string;
  tag_code: string;
  message: string;
  sender_type: "finder" | "owner";
  created_at: string;
};

type Conversation = {
  profile_type: string;
  tag_code: string;
  last_message: string;
  last_sender: "finder" | "owner";
  last_message_at: string;
};

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
    return lang === "ka" ? "QR პროფილი" : "QR Profile";
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

function formatTime(value: string, lang: Lang) {
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
      (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

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
    oscillator.stop(context.currentTime + 0.22);
  } catch {
    // Browser may block audio before user interaction.
  }
}

export default function InboxPage() {
  const [lang, setLang] = useState<Lang>("ka");

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [soundEnabled, setSoundEnabled] =
    useState(false);

  const [newMessages, setNewMessages] =
    useState(0);

  const ka = lang === "ka";

  async function loadConversations() {
    setLoading(true);
    setError("");

    const { data, error: loadError } =
      await supabase
        .from("live_chat_messages")
        .select(`
          profile_type,
          tag_code,
          message,
          sender_type,
          created_at
        `)
        .order("created_at", {
          ascending: false,
        })
        .limit(500);

    if (loadError) {
      setError(
        ka
          ? `შეტყობინებების ჩატვირთვა ვერ მოხერხდა: ${loadError.message}`
          : `Could not load messages: ${loadError.message}`
      );

      setLoading(false);
      return;
    }

    const rows = (data || []) as ChatRow[];

    const unique = new Map<
      string,
      Conversation
    >();

    for (const row of rows) {
      const key =
        `${row.profile_type}:${row.tag_code}`;

      if (!unique.has(key)) {
        unique.set(key, {
          profile_type: row.profile_type,
          tag_code: row.tag_code,
          last_message: row.message,
          last_sender: row.sender_type,
          last_message_at: row.created_at,
        });
      }
    }

    setConversations(
      Array.from(unique.values())
    );

    setLoading(false);
  }

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("owner-inbox-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "live_chat_messages",
        },
        (payload) => {
          const message =
            payload.new as ChatRow;

          /*
            მხოლოდ მპოვნელის ახალი შეტყობინება
            ითვლება ახალ შეტყობინებად.
          */
          if (message.sender_type === "finder") {
            setNewMessages(
              (current) => current + 1
            );

            if (soundEnabled) {
              playNotificationSound();
            }
          }

          setConversations((current) => {
            const key =
              `${message.profile_type}:${message.tag_code}`;

            const filtered =
              current.filter(
                (conversation) =>
                  `${conversation.profile_type}:${conversation.tag_code}` !==
                  key
              );

            return [
              {
                profile_type:
                  message.profile_type,
                tag_code:
                  message.tag_code,
                last_message:
                  message.message,
                last_sender:
                  message.sender_type,
                last_message_at:
                  message.created_at,
              },
              ...filtered,
            ];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [soundEnabled]);

  function enableSound() {
    setSoundEnabled(true);

    /*
      ეს პატარა ხმა ბრაუზერს აძლევს
      მომხმარებლის ნებართვის კონტექსტს.
    */
    playNotificationSound();
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

            <small>
              MY ACCOUNT
            </small>
          </div>
        </a>

        <div className="languages">
          <button
            type="button"
            className={
              lang === "ka"
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
              lang === "en"
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
        <div className="pageTop">
          <div>
            <div className="eyebrow">
              QR RETURN
            </div>

            <h1>
              💬{" "}
              {ka
                ? "შეტყობინებები"
                : "Messages"}

              {newMessages > 0 && (
                <span className="badge">
                  {newMessages}
                </span>
              )}
            </h1>

            <p>
              {ka
                ? "აქ გამოჩნდება თქვენი QR პროფილებიდან მიღებული Live Chat შეტყობინებები."
                : "Live Chat messages from your QR profiles appear here."}
            </p>
          </div>

          <button
            type="button"
            className={
              soundEnabled
                ? "soundButton enabled"
                : "soundButton"
            }
            onClick={enableSound}
          >
            {soundEnabled
              ? "🔔"
              : "🔕"}

            <span>
              {soundEnabled
                ? ka
                  ? "ხმა ჩართულია"
                  : "Sound on"
                : ka
                ? "ხმის ჩართვა"
                : "Enable sound"}
            </span>
          </button>
        </div>

        {!soundEnabled && (
          <div className="soundNotice">
            <span>🔔</span>

            <div>
              <strong>
                {ka
                  ? "ჩართეთ შეტყობინების ხმა"
                  : "Enable notification sound"}
              </strong>

              <p>
                {ka
                  ? "ბრაუზერის წესების გამო ხმის გასააქტიურებლად საჭიროა ერთხელ დააჭიროთ „ხმის ჩართვას“."
                  : "Browsers require one interaction before notification sounds can play."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="error">
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className="state">
            <div className="loader" />

            <strong>
              {ka
                ? "იტვირთება..."
                : "Loading..."}
            </strong>
          </div>
        ) : conversations.length === 0 ? (
          <div className="empty">
            <div className="emptyIcon">
              💬
            </div>

            <h2>
              {ka
                ? "შეტყობინებები ჯერ არ არის"
                : "No messages yet"}
            </h2>

            <p>
              {ka
                ? "როდესაც ვინმე თქვენს QR პროფილზე Live Chat-იდან მოგწერთ, საუბარი აქ გამოჩნდება."
                : "When someone messages one of your QR profiles, the conversation will appear here."}
            </p>
          </div>
        ) : (
          <div className="conversationList">
            {conversations.map(
              (conversation) => (
                <a
                  key={`${conversation.profile_type}-${conversation.tag_code}`}
                  className="conversation"
                  href={`/chat/${conversation.profile_type}/${encodeURIComponent(
                    conversation.tag_code
                  )}?role=owner`}
                  onClick={() =>
                    setNewMessages(0)
                  }
                >
                  <div className="icon">
                    {categoryIcon(
                      conversation.profile_type
                    )}
                  </div>

                  <div className="conversationContent">
                    <div className="conversationTop">
                      <strong>
                        {categoryName(
                          conversation.profile_type,
                          lang
                        )}
                      </strong>

                      <time>
                        {formatTime(
                          conversation.last_message_at,
                          lang
                        )}
                      </time>
                    </div>

                    <div className="qr">
                      QR:{" "}
                      {
                        conversation.tag_code
                      }
                    </div>

                    <p>
                      {conversation.last_sender ===
                      "finder"
                        ? "● "
                        : ""}

                      {
                        conversation.last_message
                      }
                    </p>
                  </div>

                  <div className="arrow">
                    ›
                  </div>
                </a>
              )
            )}
          </div>
        )}

        <div className="bottomActions">
          <a href="/">
            ←{" "}
            {ka
              ? "მთავარი გვერდი"
              : "Home"}
          </a>
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
        background: #f5f7fa;
      }

      button {
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

      .header {
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
        color: #667085;
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

      .container {
        width: calc(100% - 24px);
        max-width: 680px;
        margin: auto;
        padding: 38px 0 70px;
      }

      .pageTop {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
      }

      .eyebrow {
        color: #155eef;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .pageTop h1 {
        margin: 7px 0;
        display: flex;
        align-items: center;
        gap: 9px;
        font-size: 30px;
      }

      .pageTop p {
        max-width: 450px;
        margin: 0;
        color: #667085;
        font-size: 12px;
        line-height: 1.55;
      }

      .badge {
        min-width: 24px;
        height: 24px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        background: #d92d20;
        color: white;
        font-size: 11px;
      }

      .soundButton {
        min-width: 118px;
        min-height: 48px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        border: 1px solid #d0d5dd;
        border-radius: 11px;
        background: white;
        color: #475467;
        font-size: 10px;
        font-weight: 800;
        cursor: pointer;
      }

      .soundButton.enabled {
        border-color: #abefc6;
        background: #ecfdf3;
        color: #067647;
      }

      .soundNotice {
        margin-top: 22px;
        padding: 14px;
        display: flex;
        align-items: flex-start;
        gap: 10px;
        border: 1px solid #fedf89;
        border-radius: 13px;
        background: #fffaeb;
      }

      .soundNotice > span {
        font-size: 20px;
      }

      .soundNotice strong {
        color: #344054;
        font-size: 12px;
      }

      .soundNotice p {
        margin: 4px 0 0;
        color: #667085;
        font-size: 10px;
        line-height: 1.5;
      }

      .conversationList {
        margin-top: 22px;
        display: flex;
        flex-direction: column;
        gap: 9px;
      }

      .conversation {
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 12px;
        border: 1px solid #e4e7ec;
        border-radius: 15px;
        background: white;
        color: inherit;
        text-decoration: none;
        transition:
          transform 0.15s ease,
          border-color 0.15s ease;
      }

      .conversation:hover {
        transform: translateY(-1px);
        border-color: #b2ccff;
      }

      .icon {
        width: 49px;
        height: 49px;
        flex: 0 0 49px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #f2f7ff;
        font-size: 23px;
      }

      .conversationContent {
        min-width: 0;
        flex: 1;
      }

      .conversationTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .conversationTop strong {
        color: #344054;
        font-size: 13px;
      }

      .conversationTop time {
        color: #98a2b3;
        font-size: 9px;
        white-space: nowrap;
      }

      .qr {
        margin-top: 3px;
        color: #155eef;
        font-size: 9px;
        font-weight: 800;
      }

      .conversation p {
        margin: 6px 0 0;
        overflow: hidden;
        color: #667085;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .arrow {
        color: #98a2b3;
        font-size: 25px;
      }

      .empty,
      .state {
        min-height: 350px;
        margin-top: 22px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 1px solid #e4e7ec;
        border-radius: 17px;
        background: white;
        text-align: center;
      }

      .emptyIcon {
        font-size: 40px;
      }

      .empty h2 {
        margin: 12px 0 5px;
        font-size: 17px;
      }

      .empty p {
        max-width: 390px;
        margin: 0;
        color: #667085;
        font-size: 11px;
        line-height: 1.55;
      }

      .loader {
        width: 34px;
        height: 34px;
        margin-bottom: 11px;
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

      .error {
        margin-top: 20px;
        padding: 13px;
        border: 1px solid #fecdca;
        border-radius: 12px;
        background: #fff1f0;
        color: #b42318;
        font-size: 11px;
      }

      .bottomActions {
        margin-top: 25px;
        text-align: center;
      }

      .bottomActions a {
        color: #155eef;
        font-size: 11px;
        font-weight: 800;
        text-decoration: none;
      }

      @media (max-width: 560px) {
        .pageTop {
          flex-direction: column;
        }

        .soundButton {
          width: 100%;
        }

        .conversation {
          padding: 13px;
        }

        .conversationTop {
          align-items: flex-start;
        }
      }
    `}</style>
  );
}
