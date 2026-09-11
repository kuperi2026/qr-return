"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  formatLocationAccuracy,
  getPreciseLocation,
  LocationAccuracyError,
} from "@/lib/geolocation";
import ChatMediaButtons from "@/app/components/chat/ChatMediaButtons";
import ChatMessageMedia from "@/app/components/chat/ChatMessageMedia";
import { parseChatMedia } from "@/lib/chatMedia";

type Lang = "ka" | "en";

type ChatThread = {
  profile_id: string;
  tag_code: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  finder_session: string;
  last_message: string | null;
  last_message_at: string | null;
  message_count: number;
};

type ChatMessage = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
  read_at: string | null;
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

export default function OwnerChatInboxPage() {
  const router = useRouter();

  const [lang, setLang] = useState<Lang>("ka");

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [conversationView, setConversationView] = useState<"all" | "recent">("all");
  const [selected, setSelected] = useState<ChatThread | null>(null);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [locationSending, setLocationSending] =
    useState(false);

  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  useEffect(() => {
    void checkUser();
  }, []);

  useEffect(() => {
    if (!selected) {
      return;
    }

    void loadMessages(selected, false);

    const timer = window.setInterval(() => {
      void loadMessages(selected, true);
    }, 4000);

    return () => {
      window.clearInterval(timer);
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const channel = supabase
      .channel(`owner-thread-${selected.profile_id}-${selected.finder_session}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `item_id=eq.${selected.profile_id}` },
        () => {
          void loadMessages(selected, true);
          void loadThreads();
        }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function checkUser() {
    setLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.push("/login");
      return;
    }

    const requestedSession =
      new URLSearchParams(window.location.search).get("session") || "";

    await loadThreads(requestedSession);
  }

  async function loadThreads(requestedSession = "") {
    setLoading(true);

    const { data, error: rpcError } = await supabase.rpc(
      "owner_get_all_chat_threads"
    );

    if (rpcError) {
      setError(rpcError.message);
      setThreads([]);
    } else {
      const result = (data ?? []) as ChatThread[];

      setThreads(result);

      const requested = requestedSession
        ? result.find(
            (thread) => thread.finder_session === requestedSession
          )
        : null;

      if (requested) {
        setSelected(requested);
        setMobileConversationOpen(true);
      } else if (!selected && result.length > 0) {
        setSelected(result[0]);
      }

      setError("");
    }

    setLoading(false);
  }

  async function loadMessages(
    thread: ChatThread,
    silent = false
  ) {
    if (!silent) {
      setChatLoading(true);
    }

    const { data, error: rpcError } = await supabase.rpc(
      "owner_get_chat_messages_v2",
      {
        p_profile_id: thread.profile_id,
        p_finder_session: thread.finder_session,
      }
    );

    if (rpcError) {
      if (!silent) {
        setError(rpcError.message);
      }
    } else {
      setMessages((data ?? []) as ChatMessage[]);

      if (!silent) {
        setError("");
      }
    }

    if (!silent) {
      setChatLoading(false);
    }
  }

  async function sendMessage(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!selected) {
      return;
    }

    const clean = text.trim();

    if (!clean || sending) {
      return;
    }

    await sendPayload(clean);
  }

  async function sendPayload(clean: string): Promise<boolean> {
    if (!selected || !clean || sending) return false;
    setSending(true); setError("");
    const { error: rpcError } = await supabase.rpc(
      "owner_send_chat_message",
      {
        p_profile_id: selected.profile_id,
        p_finder_session: selected.finder_session,
        p_message: clean,
      }
    );

    if (rpcError) {
      setError(rpcError.message);
    } else {
      setText("");
      setShowEmojis(false);

      await loadMessages(selected, true);
      await loadThreads();
    }

    setSending(false);
    return !rpcError;
  }


  async function shareOwnerLocation() {
    if (
      !selected ||
      locationSending
    ) {
      return;
    }

    setLocationSending(true);
    setError("");

    try {
      const position =
        await getPreciseLocation();

      const {
        latitude,
        longitude,
        accuracy,
      } = position.coords;

      const mapsUrl =
        `https://www.google.com/maps?q=${latitude},${longitude}`;

      const locationMessage = ka
        ? `📍 მფლობელმა ნებაყოფლობით გააზიარა ლოკაცია (სიზუსტე დაახლოებით ${formatLocationAccuracy(
            accuracy
          )} მეტრი): ${mapsUrl}`
        : `📍 The owner voluntarily shared a location (about ${formatLocationAccuracy(
            accuracy
          )} m accuracy): ${mapsUrl}`;

      const { error: rpcError } =
        await supabase.rpc(
          "owner_send_chat_message",
          {
            p_profile_id:
              selected.profile_id,
            p_finder_session:
              selected.finder_session,
            p_message:
              locationMessage,
          }
        );

      if (rpcError) {
        throw rpcError;
      }

      await loadMessages(
        selected,
        true
      );
      await loadThreads();
    } catch (error) {
      console.error(
        "Owner location sharing error:",
        error
      );

      if (
        error instanceof
        LocationAccuracyError
      ) {
        setError(
          ka
            ? "GPS-ის სიზუსტე არასაკმარისია. გადით ღია სივრცეში, ჩართეთ Precise Location და სცადეთ თავიდან."
            : "GPS accuracy is too low. Move outdoors, enable Precise Location, and try again."
        );
      } else if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === 1
      ) {
        setError(
          ka
            ? "ჩართეთ Location და Precise Location ნებართვა ბრაუზერის პარამეტრებში."
            : "Enable Location and Precise Location permission in your browser settings."
        );
      } else {
        setError(
          ka
            ? "ლოკაციის გაზიარება ვერ მოხერხდა."
            : "Could not share location."
        );
      }
    } finally {
      setLocationSending(false);
    }
  }

  function formatDate(value: string | null) {
    if (!value) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat(
        ka ? "ka-GE" : "en-US",
        {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(new Date(value));
    } catch {
      return "";
    }
  }

  function formatTime(value: string) {
    try {
      return new Intl.DateTimeFormat(
        ka ? "ka-GE" : "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ).format(new Date(value));
    } catch {
      return "";
    }
  }

  function getIcon(thread: ChatThread) {
    if (thread.pet_type === "dog") {
      return "🐶";
    }

    if (thread.pet_type === "cat") {
      return "🐱";
    }

    if (thread.item_type === "keys") {
      return "🔑";
    }

    if (thread.item_type === "wallet") {
      return "👛";
    }

    if (thread.item_type === "bag") {
      return "👜";
    }

    if (thread.item_type === "suitcase") {
      return "🧳";
    }

    return "🏷️";
  }

  const selectedTitle = useMemo(() => {
    if (!selected) {
      return "";
    }

    return (
      selected.item_name ||
      selected.tag_code ||
      (ka ? "QR პროფილი" : "QR Profile")
    );
  }, [selected, ka]);

  const visibleThreads = useMemo(() => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return conversationView === "all"
      ? threads
      : threads.filter((thread) => !thread.last_message_at || new Date(thread.last_message_at).getTime() >= cutoff);
  }, [threads, conversationView]);

  if (loading) {
    return (
      <main className="statePage">
        <div className="logo">QR</div>

        <h1>QR RETURN</h1>

        <p>
          {ka
            ? "შეტყობინებები იტვირთება..."
            : "Loading messages..."}
        </p>

        <Styles />
      </main>
    );
  }

  return (
    <main className="page ownerChatPage">
      <header className="header">
        <div className="headerRight">
          <a href="/account" className="accountButton">
            ← {ka ? "ჩემი ანგარიში" : "My Account"}
          </a>

          <div className="languages">
            <button
              type="button"
              className={ka ? "active" : ""}
              onClick={() => setLang("ka")}
            >
              GEO
            </button>

            <button
              type="button"
              className={!ka ? "active" : ""}
              onClick={() => setLang("en")}
            >
              ENG
            </button>
          </div>
        </div>
      </header>

      <section className="container">
        <div className="operatorCard">
          <span className="operatorAvatar">⌁</span>
          <span className="operatorCopy"><strong>პირდაპირი კავშირი</strong><span>უპასუხეთ მპოვნელს უსაფრთხო ჩატში</span></span>
          <span className="onlineDot">● LIVE</span>
        </div>

        <div className="pageTitle">
          <div>
            <span>QR RETURN LIVE CHAT</span>

            <h1>
              {ka
                ? "შეტყობინებები"
                : "Messages"}
            </h1>

            <p>
              {ka
                ? "აქ გამოჩნდება მპოვნელებისგან მიღებული Live Chat შეტყობინებები."
                : "Live Chat messages from finders will appear here."}
            </p>
          </div>

          <button
            type="button"
            className="refresh"
            onClick={() => void loadThreads()}
          >
            ↻ {ka ? "განახლება" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="errorBox">
            ⚠ {error}
          </div>
        )}

        <div className={`inbox ${mobileConversationOpen ? "mobileChatOpen" : ""}`}>
          <aside className="sidebar">
            <div className="sidebarTitle">
              <strong>
                {ka
                  ? "საუბრები"
                  : "Conversations"}
              </strong>

              <span>{threads.length}</span>
            </div>

            <div className="conversationTabs">
              <button type="button" className={conversationView === "all" ? "active" : ""} onClick={() => setConversationView("all")}>ყველა</button>
              <button type="button" className={conversationView === "recent" ? "active" : ""} onClick={() => setConversationView("recent")}>ბოლო 30 დღე</button>
            </div>

            {visibleThreads.length === 0 ? (
              <div className="noThreads">
                <div>💬</div>

                <strong>
                  {ka
                    ? "შეტყობინებები ჯერ არ არის"
                    : "No messages yet"}
                </strong>

                <p>
                  {ka
                    ? "როდესაც მპოვნელი Live Chat-ს გამოიყენებს, საუბარი აქ გამოჩნდება."
                    : "When a finder uses Live Chat, the conversation will appear here."}
                </p>
              </div>
            ) : (
              <div className="threadList">
                {visibleThreads.map((thread) => {
                  const active =
                    selected?.profile_id === thread.profile_id &&
                    selected?.finder_session === thread.finder_session;

                  return (
                    <button
                      key={`${thread.profile_id}-${thread.finder_session}`}
                      type="button"
                      className={`thread ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelected(thread);
                        setMessages([]);
                        setMobileConversationOpen(true);
                      }}
                    >
                      <div className="threadIcon">
                        {getIcon(thread)}
                      </div>

                      <div className="threadBody">
                        <div className="threadTop">
                          <strong>
                            {thread.item_name || thread.tag_code}
                          </strong>

                          <time>
                            {formatDate(thread.last_message_at)}
                          </time>
                        </div>

                        <div className="threadTag">
                          QR · {thread.tag_code}
                        </div>

                        <p>
                          {(thread.last_message && (parseChatMedia(thread.last_message)?.type === "image" ? "📷 ფოტო" : parseChatMedia(thread.last_message)?.type === "audio" ? "🎙️ ხმოვანი შეტყობინება" : thread.last_message)) ||
                            (ka
                              ? "ახალი საუბარი"
                              : "New conversation")}
                        </p>
                        <span className="threadReply" aria-hidden="true">›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="chatPanel">
            {!selected ? (
              <div className="selectChat">
                <div className="selectIcon">💬</div>

                <h2>
                  {ka
                    ? "აირჩიეთ საუბარი"
                    : "Select a conversation"}
                </h2>

                <p>
                  {ka
                    ? "მარცხენა მხარეს აირჩიეთ მპოვნელის შეტყობინება."
                    : "Choose a finder conversation from the left."}
                </p>
              </div>
            ) : (
              <>
                <div className="chatHeader">
                  <button type="button" className="mobileChatBack" onClick={() => setMobileConversationOpen(false)} aria-label="საუბრების სიაში დაბრუნება">‹</button>
                  <div className="chatItemIcon">
                    {getIcon(selected)}
                  </div>

                  <div>
                    <small>
                      {ka
                        ? "მპოვნელთან საუბარი"
                        : "Finder conversation"}
                    </small>

                    <h2>{selectedTitle}</h2>

                    <p>
                      QR · {selected.tag_code}
                    </p>
                  </div>

                  <div className="liveStatus">
                    ● LIVE
                  </div>
                </div>

                <div className="privacyNotice">
                  🔒{" "}
                  {ka
                    ? "მპოვნელის პირადი ანგარიში არ არის საჭირო. საუბარი დაკავშირებულია QR კოდთან და მის ანონიმურ სესიასთან."
                    : "The finder does not need an account. This conversation is linked to the QR code and their anonymous session."}
                </div>

                <div className="messages">
                  {chatLoading ? (
                    <div className="chatState">
                      {ka
                        ? "საუბარი იტვირთება..."
                        : "Loading conversation..."}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chatState">
                      <div>💬</div>

                      <strong>
                        {ka
                          ? "შეტყობინებები ვერ მოიძებნა"
                          : "No messages found"}
                      </strong>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const mine =
                        message.sender_role === "owner" ||
                        message.sender_role === "admin";
                      const locationUrl =
                        getLocationUrl(
                          message.message_text
                        );

                      return (
                        <div
                          key={message.id}
                          className={`messageRow ${
                            mine ? "mine" : "finder"
                          }`}
                        >
                          {!mine && (
                            <div className="sender">
                              {ka
                                ? "მპოვნელი"
                                : "Finder"}
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


                            <div className="messageMeta">
                              <time>{formatTime(message.created_at)}</time>
                              {mine && (
                                <span className={message.read_at ? "seen" : "delivered"}>
                                  {message.read_at
                                    ? ka ? "✓✓ ნანახია" : "✓✓ Seen"
                                    : ka ? "✓ მიწოდებულია" : "✓ Delivered"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={bottomRef} />
                </div>

                <form
                  className="composer"
                  onSubmit={sendMessage}
                >
                  <div className="composerTools">
                    <div className="emojiWrap">
                      <button type="button" className="emojiButton" aria-label="სმაილების არჩევა" aria-expanded={showEmojis} onClick={() => setShowEmojis((value) => !value)}>😊</button>
                      {showEmojis && (
                        <div className="emojiPicker">
                          {CHAT_EMOJIS.map((emoji) => (
                            <button key={emoji} type="button" onClick={() => setText((value) => `${value}${emoji}`)}>{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChatMediaButtons tagCode={selected.tag_code} sessionId={selected.finder_session} disabled={sending} onSend={sendPayload} onError={setError} />
                    <button type="button" className="locationButton" onClick={() => void shareOwnerLocation()} disabled={locationSending || sending} aria-label="ლოკაციის გაზიარება">
                      {locationSending ? "…" : "📍"}
                    </button>
                  </div>

                  <div className="composerInputRow">
                    <textarea
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      maxLength={2000}
                      disabled={sending}
                      placeholder={ka ? "მიწერეთ მპოვნელს..." : "Reply to the finder..."}
                    />
                    <button className="sendButton" type="submit" disabled={sending || !text.trim()} aria-label="შეტყობინების გაგზავნა">
                      {sending ? "…" : "➤"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </section>

      <Styles />
      <style jsx global>{`
        .conversationTabs{margin:0 12px 8px;padding:4px;display:grid;grid-template-columns:1fr 1fr;gap:4px;border-radius:12px;background:#edf3f9}.conversationTabs button{min-height:36px;border:0;border-radius:9px;background:transparent;color:#6a7f93;font:850 10px Inter,Arial;cursor:pointer}.conversationTabs button.active{background:#fff;color:#075dcc;box-shadow:0 3px 9px rgba(23,63,109,.1)}
        body.kompasiAppMode .ownerChatPage .operatorCard{max-width:100%!important;margin-bottom:12px!important;padding:12px 14px!important;border-radius:17px!important;background:#116fd3!important}
        body.kompasiAppMode .ownerChatPage .pageTitle{margin-bottom:14px!important}.ownerChatPage .pageTitle h1{font-size:28px!important}.ownerChatPage .pageTitle p{font-size:11px!important}
        body.kompasiAppMode .ownerChatPage .inbox{min-height:590px!important;border:0!important;border-radius:22px!important;background:#fff!important;box-shadow:0 18px 44px rgba(1,24,58,.28)!important}
        body.kompasiAppMode .ownerChatPage .sidebar{background:#fff!important}.ownerChatPage .sidebarTitle{height:58px!important;padding:0 14px!important}.ownerChatPage .sidebarTitle strong{font-size:16px!important}.ownerChatPage .sidebarTitle span{background:#e7f2ff!important;color:#0a66cc!important}
        body.kompasiAppMode .ownerChatPage .thread{position:relative;min-height:84px!important;padding:12px 48px 12px 12px!important;border-bottom:1px solid #edf1f5!important;background:#fff!important}.ownerChatPage .thread.active{background:#edf5ff!important}.ownerChatPage .threadIcon{width:50px!important;height:50px!important;flex-basis:50px!important;border-radius:50%!important;background:#e8f3ff!important;font-size:23px!important}.ownerChatPage .threadTop strong{font-size:13px!important}.ownerChatPage .thread p{font-size:10px!important}.ownerChatPage .threadReply{top:50%!important;bottom:auto!important;transform:translateY(-50%)!important;border:0!important;border-radius:50%!important;background:#e8f3ff!important;color:#0b6ed8!important;box-shadow:none!important}
        body.kompasiAppMode .ownerChatPage .chatHeader{position:sticky!important;top:0!important;z-index:5!important;min-height:68px!important;background:#fff!important;box-shadow:0 4px 15px rgba(13,61,112,.07)!important}.ownerChatPage .chatItemIcon{border-radius:50%!important}.ownerChatPage .liveStatus{background:#e5f8ef!important}
        body.kompasiAppMode .ownerChatPage .privacyNotice{display:none!important}.ownerChatPage .messages{height:430px!important;background:#f7f9fc!important}.ownerChatPage .bubble{border:0!important;border-radius:18px 18px 18px 5px!important;background:#e9eef4!important;color:#253b50!important;font-size:13px!important}.ownerChatPage .messageRow.mine .bubble{border-radius:18px 18px 5px 18px!important;background:#0b74e5!important;color:#fff!important}
        body.kompasiAppMode .ownerChatPage .composer{position:sticky!important;bottom:0!important;z-index:5!important;padding:9px 10px!important;border-top:1px solid #e7edf4!important;background:#fff!important}.ownerChatPage .composerTools{gap:6px!important}.ownerChatPage .composer .emojiButton,.ownerChatPage .composer .mediaButton,.ownerChatPage .composer .locationButton{width:40px!important;min-height:40px!important;border:0!important;border-radius:50%!important;background:#eaf3ff!important;font-size:19px!important}.ownerChatPage .composer textarea{min-height:48px!important;max-height:110px!important;border:0!important;border-radius:22px!important;background:#f0f3f7!important;padding:13px 15px!important}.ownerChatPage .composer .sendButton{width:48px!important;min-height:48px!important;border-radius:50%!important;background:#0b74e5!important}
        @media(max-width:800px){body.kompasiAppMode .ownerChatPage .container{width:calc(100% - 16px)!important;padding-top:16px!important}.ownerChatPage .operatorCard{margin-bottom:10px!important}.ownerChatPage .operatorCopy strong{font-size:13px!important}.ownerChatPage .operatorCopy span{font-size:9px!important}.ownerChatPage .pageTitle{display:none!important}.ownerChatPage .inbox{min-height:calc(100vh - 118px)!important}.ownerChatPage .threadList{max-height:calc(100vh - 250px)!important;overflow-y:auto!important}.ownerChatPage .inbox.mobileChatOpen .chatPanel{min-height:calc(100vh - 118px)!important}.ownerChatPage .messages{height:calc(100vh - 340px)!important;min-height:250px!important}.ownerChatPage .composer{margin-top:auto!important}}
      `}</style>
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
        font-family: Inter, Arial, sans-serif;
        background:
          radial-gradient(circle at 12% 10%, rgba(104,190,255,.58) 0, rgba(104,190,255,0) 30%),
          radial-gradient(circle at 88% 22%, rgba(48,112,238,.62) 0, rgba(48,112,238,0) 34%),
          linear-gradient(145deg,#07388e 0%,#0b64d8 48%,#052a70 100%);
        background-attachment: fixed;
        color: #101828;
      }

      button,
      textarea {
        font: inherit;
      }

      .page {
        min-height: 100vh;
      }

      .statePage {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .statePage h1 {
        margin: 10px 0 5px;
        color: #1465e8;
      }

      .statePage p {
        color: #667085;
      }

      .header {
        width: calc(100% - 32px);
        max-width: 1180px;
        min-height: 82px;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-bottom: 1px solid rgba(255,255,255,.3);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
      }

      .logo {
        width: 47px;
        height: 47px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(
          135deg,
          #1465e8,
          #7655f7
        );
        color: white;
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
        letter-spacing: 1.5px;
      }

      .headerRight {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .accountButton {
        padding: 9px 12px;
        border-radius: 10px;
        background: white;
        color: #0754bd;
        font-size: 10px;
        font-weight: 800;
        text-decoration: none;
      }

      .languages {
        display: flex;
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

      .operatorCard{position:relative;margin:0 0 16px;padding:14px 15px;display:flex;align-items:center;gap:12px;max-width:480px;overflow:hidden;border:1px solid rgba(255,255,255,.34);border-radius:19px;background:linear-gradient(135deg,#126fe5,#6950d8 58%,#0aa875);color:#fff;box-shadow:0 15px 36px rgba(0,24,74,.3)}.operatorCard:after{content:"";position:absolute;right:-28px;top:-45px;width:120px;height:120px;border:18px solid rgba(255,255,255,.09);border-radius:50%}
      .operatorAvatar{width:50px;height:50px;display:grid;place-items:center;flex:0 0 50px;border:1px solid rgba(255,255,255,.45);border-radius:15px;background:rgba(255,255,255,.17);color:#fff;font-size:28px;font-weight:950;box-shadow:inset 0 1px 0 rgba(255,255,255,.28)}
      .operatorCopy{position:relative;z-index:1;min-width:0;flex:1;color:#fff}.operatorCopy strong{display:block;color:#fff;font-size:15px;line-height:1.2}.operatorCopy span{display:block;margin-top:5px;color:#e1eeff;font-size:10px;font-weight:750}.onlineDot{position:relative;z-index:1;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.16);color:#fff;font-size:8px;font-weight:900}

      .container {
        width: calc(100% - 30px);
        max-width: 1180px;
        margin: auto;
        padding: 36px 0 70px;
      }

      .pageTitle {
        margin-bottom: 22px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
      }

      .pageTitle span {
        color: #c8dcff;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .pageTitle h1 {
        margin: 5px 0;
        color: white;
        font-size: 32px;
      }

      .pageTitle p {
        margin: 0;
        color: rgba(255,255,255,.78);
        font-size: 11px;
      }

      .refresh {
        padding: 10px 13px;
        border: 1px solid #d0d5dd;
        border-radius: 9px;
        background: white;
        color: #344054;
        font-size: 10px;
        font-weight: 900;
        cursor: pointer;
      }

      .errorBox {
        margin-bottom: 14px;
        padding: 11px 13px;
        border: 1px solid #fecdca;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
        font-size: 10px;
      }

      .inbox {
        min-height: 560px;
        display: grid;
        grid-template-columns: 350px 1fr;
        overflow: hidden;
        border: 1px solid #e4e7ec;
        border-radius: 22px;
        background: white;
        box-shadow: 0 20px 55px rgba(16, 24, 40, 0.07);
      }

      .sidebar {
        border-right: 1px solid #e4e7ec;
        background: #fafbfc;
      }

      .sidebarTitle {
        height: 66px;
        padding: 0 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e4e7ec;
      }

      .sidebarTitle strong {
        font-size: 13px;
      }

      .sidebarTitle span {
        min-width: 25px;
        height: 25px;
        padding: 0 7px;
        display: grid;
        place-items: center;
        border-radius: 999px;
        background: #eef4ff;
        color: #1465e8;
        font-size: 9px;
        font-weight: 900;
      }

      .threadList {
        max-height: 584px;
        overflow-y: auto;
      }

      .thread {
        width: 100%;
        padding: 15px;
        display: flex;
        gap: 11px;
        border: 0;
        border-bottom: 1px solid #eaecf0;
        background: transparent;
        text-align: left;
        cursor: pointer;
      }

      .thread:hover {
        background: #f5f8ff;
      }

      .thread.active {
        background: #eef4ff;
      }

      .threadIcon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 12px;
        background: white;
        font-size: 21px;
      }

      .threadBody {
        min-width: 0;
        flex: 1;
      }

      .threadTop {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .threadTop strong {
        overflow: hidden;
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .threadTop time {
        flex: 0 0 auto;
        color: #98a2b3;
        font-size: 7px;
      }

      .threadTag {
        margin-top: 3px;
        color: #1465e8;
        font-size: 8px;
        font-weight: 800;
      }

      .thread p {
        margin: 5px 0 0;
        overflow: hidden;
        color: #667085;
        font-size: 9px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .threadReply{position:absolute;right:12px;bottom:12px;width:29px;height:29px;display:grid;place-items:center;border:1px solid #cfe0f2;border-radius:10px;background:#fff;color:#1761bd;font-size:21px;font-weight:900;box-shadow:0 4px 10px rgba(23,63,109,.08)}

      .noThreads {
        padding: 70px 25px;
        text-align: center;
        color: #667085;
      }

      .noThreads > div {
        margin-bottom: 12px;
        font-size: 35px;
      }

      .noThreads strong {
        color: #344054;
        font-size: 12px;
      }

      .noThreads p {
        font-size: 9px;
        line-height: 1.6;
      }

      .chatPanel {
        min-width: 0;
        display: flex;
        flex-direction: column;
      }

      .selectChat {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
      }

      .selectIcon {
        font-size: 45px;
      }

      .selectChat h2 {
        margin: 13px 0 5px;
      }

      .selectChat p {
        color: #667085;
        font-size: 10px;
      }

      .chatHeader {
        min-height: 78px;
        padding: 12px 18px;
        display: flex;
        align-items: center;
        gap: 11px;
        border-bottom: 1px solid #e4e7ec;
      }

      .mobileChatBack{display:none;width:38px;height:38px;place-items:center;flex:0 0 38px;border:1px solid #d7e4f3;border-radius:11px;background:#f2f7fd;color:#1761bd;font-size:26px;font-weight:900}

      .chatItemIcon {
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background: #eef4ff;
        font-size: 23px;
      }

      .chatHeader > div:nth-child(2) {
        min-width: 0;
        flex: 1;
      }

      .chatHeader small {
        color: #7655f7;
        font-size: 8px;
        font-weight: 900;
      }

      .chatHeader h2 {
        margin: 3px 0;
        overflow: hidden;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .chatHeader p {
        margin: 0;
        color: #98a2b3;
        font-size: 8px;
      }

      .liveStatus {
        padding: 7px 9px;
        border-radius: 999px;
        background: #ecfdf3;
        color: #027a48;
        font-size: 8px;
        font-weight: 900;
      }

      .privacyNotice {
        margin: 13px 17px 0;
        padding: 10px 11px;
        border: 1px solid #dbe7ff;
        border-radius: 10px;
        background: #f5f9ff;
        color: #667085;
        font-size: 9px;
        line-height: 1.5;
      }

      .messages {
        height: 390px;
        padding: 18px;
        overflow-y: auto;
        background: #fafbfc;
      }

      .chatState {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #667085;
        text-align: center;
        font-size: 10px;
      }

      .chatState > div {
        font-size: 32px;
      }

      .messageRow {
        margin-bottom: 11px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .messageRow.mine {
        align-items: flex-end;
      }

      .sender {
        margin: 0 0 4px 5px;
        color: #98a2b3;
        font-size: 8px;
        font-weight: 800;
      }

      .bubble {
        max-width: 78%;
        padding: 10px 11px 7px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        background: white;
        color: #344054;
        font-size: 11px;
        line-height: 1.5;
        white-space: pre-wrap;
      }

      .messageRow.mine .bubble {
        border: 0;
        background: #1465e8;
        color: white;
      }

      .messageMeta {
        margin-top: 5px;
        display: flex;
        gap: 7px;
        align-items: center;
        justify-content: flex-end;
        font-size: 11px;
        opacity: .84;
      }

      .messageMeta time { font-size: 11px; }
      .seen { color: #c4e2ff; font-weight: 800; }
      .delivered { color: rgba(255,255,255,.8); font-weight: 750; }

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
        font-size: 7px;
        text-align: right;
        opacity: 0.7;
      }

      .composer {
        position: relative;
        padding: 13px 17px;
        display: grid;
        gap: 9px;
        border-top: 1px solid #e4e7ec;
        background:linear-gradient(145deg,#fff,#f5f9ff);
      }

      .composerTools{display:flex;align-items:center;gap:8px}.composerInputRow{display:flex;align-items:flex-end;gap:9px}

      .emojiWrap{position:relative;flex:0 0 auto}.composer .emojiButton,.composer .mediaButton{width:46px;min-height:46px;padding:0;border:1px solid #cbdcf7;background:#eef4ff;color:#1266e9;font-size:24px}.emojiPicker{position:absolute;left:0;bottom:54px;z-index:20;width:336px;max-width:calc(100vw - 40px);max-height:260px;overflow:auto;padding:12px;display:grid;grid-template-columns:repeat(8,1fr);gap:7px;border:1px solid #d8e2ef;border-radius:16px;background:#fff;box-shadow:0 16px 42px rgba(0,24,58,.2)}.composer .emojiPicker button{min-height:38px;padding:0;border:0;background:transparent;color:inherit;font-size:25px}.chatMediaInput{display:none}.composer .mediaButton.recording{background:#fee4e2;color:#d92d20;animation:pulse 1s infinite}.chatMediaImage{display:block;max-width:min(300px,65vw);max-height:320px;border-radius:12px;object-fit:cover}.chatMediaAudio{width:min(290px,65vw);height:40px}.chatMediaLink{display:block}@keyframes pulse{50%{opacity:.55}}

      .composer textarea {
        min-height: 66px;
        max-height: 150px;
        flex: 1;
        padding: 11px;
        border: 1px solid #d0d5dd;
        border-radius: 10px;
        outline: none;
        resize: vertical;
        font-size: 16px;
      }

      .composer textarea:focus {
        border-color: #1465e8;
      }

      .composer button {
        min-height: 43px;
        padding: 0 16px;
        border: 0;
        border-radius: 9px;
        background: #1465e8;
        color: white;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
      }

      .composer .locationButton {
        width:46px;
        min-height:46px;
        padding:0;
        border: 1px solid #cbdcf7;
        background: #eef4ff;
        color: #1266e9;
      }
      .composer .sendButton{width:50px;min-height:50px;padding:0;flex:0 0 50px;border-radius:14px;background:linear-gradient(135deg,#0b74e5,#13a66b);font-size:20px;box-shadow:0 8px 18px rgba(4,70,117,.22)}

      .composer button:disabled {
        opacity: 0.5;
        cursor: default;
      }

      @media (max-width: 800px) {
        .header {
          padding: 12px 0;
          align-items: flex-start;
        }

        .headerRight {
          align-items: flex-end;
          flex-direction: column-reverse;
        }

        .accountButton {
          display: none;
        }

        .pageTitle {
          align-items: flex-start;
          flex-direction: column;
        }

        .inbox {
          grid-template-columns: 1fr;
        }

        .inbox .chatPanel{display:none}.inbox.mobileChatOpen .sidebar{display:none}.inbox.mobileChatOpen .chatPanel{display:flex}.inbox.mobileChatOpen .mobileChatBack{display:grid}

        .sidebar {
          border-right: 0;
          border-bottom: 1px solid #e4e7ec;
        }

        .threadList {
          max-height:none;
        }
        .thread{position:relative;min-height:92px;padding:14px 50px 14px 14px}.threadReply{right:12px;bottom:12px}

        .messages {
          height: 420px;
        }
      }

      @media (max-width: 520px) {
        .container {
          width: calc(100% - 16px);
          padding-top: 25px;
        }

        .brand strong {
          font-size: 16px;
        }

        .pageTitle h1 {
          font-size: 27px;
        }

        .inbox {
          border-radius: 16px;
        }

        .chatHeader {
          padding: 11px;
        }

        .privacyNotice {
          margin: 10px 10px 0;
        }

        .messages {
          height: 390px;
          padding: 12px;
        }

        .composer {
          padding: 10px;
          gap:8px;
        }

        .composerTools{width:100%;overflow:visible}.composerInputRow{width:100%}.composerInputRow textarea{min-width:0;min-height:52px}.composer .sendButton{width:50px}

        .bubble {
          max-width: 88%;
        }
      }
      @media (orientation:landscape) and (max-height:560px){.ownerChatPage .operatorCard{display:none}.ownerChatPage .container{padding-top:12px!important}.ownerChatPage .pageTitle{margin-bottom:10px}.ownerChatPage .messages{height:230px}.composer{grid-template-columns:auto minmax(0,1fr);align-items:end}.composerTools{align-self:end}.composerInputRow{min-width:0}}
    `}</style>
  );
}
