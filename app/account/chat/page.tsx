"use client";

import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatLocationAccuracy } from "@/lib/geolocation";
import ChatMediaButtons from "@/app/components/chat/ChatMediaButtons";
import ChatMessageMedia from "@/app/components/chat/ChatMessageMedia";
import { parseChatMedia } from "@/lib/chatMedia";

type Lang = "ka" | "en";
type ChatTheme = "blue" | "ocean" | "violet" | "red";

type ChatThread = {
  profile_id: string;
  tag_code: string;
  item_name: string | null;
  item_type: string | null;
  pet_type: string | null;
  finder_session: string;
  last_message: string | null;
  last_message_at: string | null;
  finder_last_active: string | null;
  message_count: number;
};

type ChatMessage = {
  id: number;
  sender_role: "finder" | "owner" | "admin";
  message_text: string;
  created_at: string;
  read_at: string | null;
  edited_at: string | null;
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
  const [chatTheme, setChatTheme] = useState<ChatTheme>("blue");
  const [themeOpen, setThemeOpen] = useState(false);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selected, setSelected] = useState<ChatThread | null>(null);
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [locationSending, setLocationSending] = useState(false);
  const [automationOpen, setAutomationOpen] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [automationMessage, setAutomationMessage] = useState("მოგესალმებით! ახლა შეიძლება მაშინვე ვერ გიპასუხოთ. გთხოვთ, მოკლედ მომწეროთ რა იპოვეთ და სად — პასუხს მალე დაგიბრუნებთ.");
  const [automationSaving, setAutomationSaving] = useState(false);

  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const followBottomRef = useRef(true);
  const selectedKeyRef = useRef("");
  const messageRequestRef = useRef(0);
  selectedKeyRef.current = selected ? `${selected.profile_id}:${selected.finder_session}` : "";
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const ka = lang === "ka";

  useEffect(() => {
    void checkUser();
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("kompasi-chat-theme") as ChatTheme | null;
    if (saved && ["blue", "ocean", "violet", "red"].includes(saved)) setChatTheme(saved);
  }, []);

  function chooseTheme(theme: ChatTheme) {
    setChatTheme(theme);
    window.localStorage.setItem("kompasi-chat-theme", theme);
  }

  useEffect(() => {
    document.body.classList.add("kompasiChatOpen");
    return () => {
      document.body.classList.remove("kompasiChatOpen");
      document.body.classList.remove("kompasiKeyboardOpen");
    };
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
          void loadThreads("", true);
        }
      )
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [selected]);

  useLayoutEffect(() => {
    const container = messagesRef.current;
    if (container && followBottomRef.current) container.scrollTop = container.scrollHeight;
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

    await Promise.all([loadThreads(requestedSession), loadAutomation()]);
  }

  async function loadAutomation() {
    const { data } = await supabase.rpc("owner_get_chat_automation");
    const setting = Array.isArray(data) ? data[0] : null;
    if (setting) { setAutomationEnabled(Boolean(setting.enabled)); setAutomationMessage(setting.welcome_message || automationMessage); }
  }

  async function saveAutomation() {
    setAutomationSaving(true); setError("");
    const { error: automationError } = await supabase.rpc("owner_update_chat_automation", { p_enabled: automationEnabled, p_welcome_message: automationMessage.trim() });
    if (automationError) setError(automationError.message); else setAutomationOpen(false);
    setAutomationSaving(false);
  }

  async function loadThreads(requestedSession = "", silent = false) {
    if (!silent) setLoading(true);

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
      } else {
        setSelected(current => current || result[0] || null);
      }

      setError("");
    }

    if (!silent) setLoading(false);
  }

  async function loadMessages(
    thread: ChatThread,
    silent = false
  ) {
    const request = ++messageRequestRef.current;
    const threadKey = `${thread.profile_id}:${thread.finder_session}`;
    if (!silent) {
      followBottomRef.current = true;
      setChatLoading(true);
    }

    const { data, error: rpcError } = await supabase.rpc(
      "owner_get_chat_messages_v2",
      {
        p_profile_id: thread.profile_id,
        p_finder_session: thread.finder_session,
      }
    );

    if (request !== messageRequestRef.current || threadKey !== selectedKeyRef.current) return;

    if (rpcError) {
      if (!silent) {
        setError(rpcError.message);
      }
    } else {
      const nextMessages = (data ?? []) as ChatMessage[];
      setMessages(current => JSON.stringify(current) === JSON.stringify(nextMessages) ? current : nextMessages);

      if (!silent) {
        setError("");
      }
    }

    setChatLoading(false);
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

  async function saveEdit() {
    if (!editingId || !text.trim() || sending) return;
    setSending(true); setError("");
    const { error: editError } = await supabase.rpc("owner_edit_chat_message", { p_message_id: editingId, p_message: text.trim() });
    if (editError) setError(editError.message);
    else { setEditingId(null); setText(""); if (selected) await loadMessages(selected, true); }
    setSending(false);
  }

  async function deleteMessage(messageId: number) {
    if (!window.confirm(ka ? "წავშალოთ ეს შეტყობინება? აღდგენა შეუძლებელი იქნება." : "Delete this message? This cannot be undone.")) return;
    const { error: deleteError } = await supabase.rpc("owner_delete_chat_message", { p_message_id: messageId });
    if (deleteError) { setError(deleteError.message); return; }
    if (editingId === messageId) { setEditingId(null); setText(""); }
    setMessages((current) => current.filter((message) => message.id !== messageId));
    await loadThreads();
  }

  async function deleteConversation() {
    if (!selected || !window.confirm(ka ? "წავშალოთ ეს საუბარი? აღდგენა შეუძლებელი იქნება." : "Delete this conversation? This cannot be undone.")) return;
    const { error: deleteError } = await supabase.rpc("owner_delete_chat_thread", { p_profile_id: selected.profile_id, p_finder_session: selected.finder_session });
    if (deleteError) { setError(deleteError.message); return; }
    setSelected(null); setMessages([]); setMobileConversationOpen(false); await loadThreads();
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

      followBottomRef.current = true;
      await loadMessages(selected, true);
      await loadThreads("", true);
    }

    setSending(false);
    return !rpcError;
  }

  async function shareOwnerLocation() {
    if (!selected || locationSending || sending) return;
    setLocationSending(true); setError("");
    try {
      if (!navigator.geolocation) throw new Error("unsupported");
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 60000,
        });
      });
      const { latitude, longitude, accuracy } = position.coords;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const message = ka
        ? `📍 მდებარეობა გაზიარებულია (სიზუსტე დაახლოებით ${formatLocationAccuracy(accuracy)} მ): ${mapsUrl}`
        : `📍 Location shared (about ${formatLocationAccuracy(accuracy)} m accuracy): ${mapsUrl}`;
      await sendPayload(message);
    } catch (locationError) {
      const denied = typeof locationError === "object" && locationError !== null && "code" in locationError && locationError.code === 1;
      const message = denied
        ? (ka ? "ლოკაციის ნებართვა საჭიროა." : "Location permission is required.")
        : (ka ? "ლოკაცია ვერ განისაზღვრა." : "Location could not be determined.");
      setError(message); window.alert(message);
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

  const visibleThreads = threads;

  if (loading) {
    return (
      <main className="ownerInboxPage statePage">
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
    <main className={`page ownerInboxPage theme-${chatTheme}`}>
      <header className="header">
        <div className="headerRight">
          <a href="/my-profiles" className="accountButton">
            ← {ka ? "ჩემი პროფილები" : "My profiles"}
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
        <div className="pageTitle">
          <div>

            <h1>
              {ka
                ? "შეტყობინებები"
                : "Messages"}
            </h1>

            <p>
              {ka
                ? "მიმოწერა თქვენი QR პროფილების მპოვნელებთან."
                : "Conversations with people who found your QR profiles."}
            </p>
          </div>

          <button
            type="button"
            className="refresh"
            onClick={() => void loadThreads("", true)}
          >
            ↻ {ka ? "განახლება" : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="errorBox" role="alert">
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

            <section className={`aiReception ${automationOpen ? "open" : ""}`}>
              <button type="button" className="aiReceptionHead" aria-expanded={automationOpen} onClick={() => setAutomationOpen((value) => !value)}>
                <span className="aiSpark">✦</span><span><strong>ავტომატური პასუხი</strong><small>{automationEnabled ? "აქტიურია · პირველ შეტყობინებაზე პასუხობს" : "გამორთულია"}</small></span><em>{automationOpen ? "⌃" : "⌄"}</em>
              </button>
              {automationOpen && <div className="aiReceptionBody">
                <label className="automationSwitch"><span><b>ავტომატური პირველი პასუხი</b><small>მპოვნელი პასუხს მიიღებს მაშინაც, როცა აპში არ ხართ.</small></span><input type="checkbox" checked={automationEnabled} onChange={(event) => setAutomationEnabled(event.target.checked)} /></label>
                <div className="aiLanguage"><span>პასუხის ენა</span><div><button type="button" onClick={() => setAutomationMessage("მოგესალმებით! ახლა შეიძლება მაშინვე ვერ გიპასუხოთ. გთხოვთ, მოკლედ მომწეროთ რა იპოვეთ და სად — პასუხს მალე დაგიბრუნებთ.")}>ქართული</button><button type="button" onClick={() => setAutomationMessage("Hello! I may not be able to reply immediately. Please tell me briefly what you found and where — I will get back to you soon.")}>English</button></div></div>
                <label className="automationText"><span>მისალმების ტექსტი</span><textarea value={automationMessage} onChange={(event) => setAutomationMessage(event.target.value)} maxLength={500} /></label>
                <button type="button" className="saveAutomation" onClick={() => void saveAutomation()} disabled={automationSaving || automationMessage.trim().length < 10}>{automationSaving ? "ინახება…" : "AI მისალმების შენახვა"}</button>
                <p>✦ იგზავნება მხოლოდ ერთხელ — ახალი საუბრის პირველ შეტყობინებაზე.</p>
              </div>}
            </section>

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
                      aria-current={active ? "true" : undefined}
                      onClick={() => {
                        setSelected(thread);
                        if (!active) setChatLoading(true);
                        if (!active) setMessages([]);
                        setText("");
                        setEditingId(null);
                        setShowEmojis(false);
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
                          <small>{thread.finder_last_active ? `${ka ? "აქტიური:" : "Active:"} ${formatDate(thread.finder_last_active)}` : ""}</small>

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

                  <div className="chatIdentity">
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
                    {selected.finder_last_active ? `${ka ? "აქტიური:" : "Active:"} ${formatDate(selected.finder_last_active)}` : (ka ? "მპოვნელი" : "Finder")}
                  </div>
                  <button type="button" className="deleteChat" onClick={() => void deleteConversation()} aria-label={ka ? "ჩათის წაშლა" : "Delete chat"}>⌫</button>
                </div>

                <div className="privacyNotice">
                  🔒{" "}
                  {ka
                    ? "მპოვნელის პირადი ანგარიში არ არის საჭირო. საუბარი დაკავშირებულია QR კოდთან და მის ანონიმურ სესიასთან."
                    : "The finder does not need an account. This conversation is linked to the QR code and their anonymous session."}
                </div>

                <div className="messages" ref={messagesRef} onScroll={(event) => {
                  const element = event.currentTarget;
                  followBottomRef.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
                }}>
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


                          </div>
                          <div className="messageFooter">
                            <div className="messageMeta">
                              <time>{formatDate(message.created_at)}</time>
                              {mine && (
                                <span className={message.read_at ? "seen" : "delivered"}>
                                  {message.read_at
                                    ? `${ka ? "✓✓ წაიკითხა" : "✓✓ Read"} · ${formatDate(message.read_at)}`
                                    : ka ? "✓ მიწოდებულია" : "✓ Delivered"}
                                </span>
                              )}
                            </div>
                            {mine && <><button type="button" className="editMessage" aria-label={ka ? "შეტყობინების რედაქტირება" : "Edit message"} title={ka ? "რედაქტირება" : "Edit"} onClick={() => { setEditingId(message.id); setText(message.message_text); }}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l11-11-4-4L4 16v4Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="m13.5 6.5 4 4" fill="none" stroke="currentColor" strokeWidth="2"/></svg></button><button type="button" className="deleteMessage" aria-label={ka ? "შეტყობინების წაშლა" : "Delete message"} title={ka ? "წაშლა" : "Delete"} onClick={() => void deleteMessage(message.id)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button></>}
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={bottomRef} />
                </div>

                <form
                  className="composer"
                  onSubmit={(event) => { if (editingId) { event.preventDefault(); void saveEdit(); } else void sendMessage(event); }}
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
                    <div className={`compactThemePicker ${themeOpen ? "open" : ""}`}>
                      <button type="button" className={`themeToggle ${chatTheme}`} onClick={() => setThemeOpen((value) => !value)} aria-label={ka ? "ჩათის ფერის შეცვლა" : "Change chat color"} />
                      {themeOpen && <div className="themeOptions">
                        {(["blue", "ocean", "violet", "red"] as ChatTheme[]).map((theme) => <button key={theme} type="button" className={theme} onClick={() => { chooseTheme(theme); setThemeOpen(false); }} aria-label={theme} />)}
                      </div>}
                    </div>
                    <button type="button" className="locationButton" onClick={() => void shareOwnerLocation()} disabled={locationSending || sending} aria-label={ka ? "ლოკაციის გაზიარება" : "Share location"} title={ka ? "ლოკაციის გაზიარება" : "Share location"}>{locationSending ? "…" : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.5" fill="currentColor"/></svg>}</button>
                  </div>

                  <div className="composerInputRow">
                    <textarea
                      aria-label={ka ? "შეტყობინება" : "Message"}
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                      rows={1}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          event.currentTarget.form?.requestSubmit();
                        }
                      }}
                      maxLength={2000}
                      disabled={sending}
                      placeholder={editingId ? (ka ? "შეცვალეთ შეტყობინება..." : "Edit message...") : (ka ? "მიწერეთ მპოვნელს..." : "Reply to the finder...")}
                    />
                    {editingId && <button type="button" className="cancelEdit" onClick={() => { setEditingId(null); setText(""); }}>×</button>}
                    <button className="sendButton" type="submit" disabled={sending || !text.trim()} aria-label="შეტყობინების გაგზავნა">
                      {sending ? "…" : editingId ? "✓" : "➤"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </section>

      <Styles />

    </main>
  );
}

function Styles() {
  return <style jsx global>{`
    .ownerInboxPage { --accent:#1465d9; --tint:#edf4ff; background:#f3f6fa; color:#18334d; min-height:100dvh; padding:20px 24px 32px; }
    .ownerInboxPage.theme-ocean { --accent:#087a58; --tint:#e5f6ef; }
    .ownerInboxPage.theme-violet { --accent:#7254c7; --tint:#f0ebfc; }
    .ownerInboxPage.theme-red { --accent:#bd252c; --tint:#fceeee; }
    .ownerInboxPage *, .ownerInboxPage *::before, .ownerInboxPage *::after { box-sizing:border-box; }
    .ownerInboxPage :is(button,textarea) { font:inherit; }
    .ownerInboxPage button { cursor:pointer; }
    .ownerInboxPage button:disabled { opacity:.5; cursor:default; }
    .ownerInboxPage :is(button,a,textarea):focus-visible { outline:3px solid #79aef2; outline-offset:3px; }
    .ownerInboxPage .header,.ownerInboxPage .container { max-width:1240px; margin:auto; width:100%; }
    .ownerInboxPage .headerRight { display:flex; justify-content:space-between; align-items:center; gap:12px; }
    .ownerInboxPage .accountButton { color:var(--accent); font-size:14px; text-decoration:none; font-weight:600; }
    .ownerInboxPage .languages { display:flex; padding:3px; border:1px solid #dce5ef; border-radius:10px; background:white; }
    .ownerInboxPage .languages button { padding:7px 10px; border:0; border-radius:7px; background:transparent; color:#617389; font-size:12px; }
    .ownerInboxPage .languages .active { background:var(--tint); color:var(--accent); }
    .ownerInboxPage .pageTitle { display:flex; justify-content:space-between; align-items:center; gap:16px; margin:22px 0 18px; }
    .ownerInboxPage .pageTitle h1 { margin:0 0 6px; font-size:28px; line-height:1.35; }
    .ownerInboxPage .pageTitle p { margin:0; font-size:14px; color:#617389; }
    .ownerInboxPage .refresh { padding:10px 14px; border:1px solid #dce5ef; border-radius:10px; background:#fff; color:#34516f; font-size:13px; white-space:nowrap; }
    .ownerInboxPage .errorBox { padding:12px; margin-bottom:12px; border:1px solid #fecaca; border-radius:10px; background:#fff1f2; color:#a52235; overflow-wrap:anywhere; }
    .ownerInboxPage .inbox { display:grid; grid-template-columns:320px minmax(0,1fr); height:clamp(520px,calc(100dvh - 215px),820px); overflow:hidden; background:#fff; border:1px solid #dce5ef; border-radius:18px; box-shadow:0 8px 30px #17365308; }
    .ownerInboxPage .sidebar { min-width:0; min-height:0; display:flex; flex-direction:column; border-right:1px solid #e3eaf2; background:#fff; }
    .ownerInboxPage .sidebarTitle { display:flex; justify-content:space-between; align-items:center; min-height:68px; padding:16px 18px; border-bottom:1px solid #e3eaf2; }
    .ownerInboxPage .sidebarTitle strong { font-size:16px; }
    .ownerInboxPage .sidebarTitle>span { padding:4px 9px; border-radius:20px; background:var(--tint); color:var(--accent); font-size:12px; }
    .ownerInboxPage .threadList { flex:1; min-height:0; overflow:auto; }
    .ownerInboxPage .thread { position:relative; display:flex; gap:12px; padding:18px 30px 18px 16px; width:100%; border:0; border-bottom:1px solid #edf1f6; border-left:3px solid transparent; background:white; text-align:left; color:inherit; }
    .ownerInboxPage .thread:hover { background:#f8faff; }
    .ownerInboxPage .thread.active { background:var(--tint); border-left-color:var(--accent); }
    .ownerInboxPage .threadIcon,.ownerInboxPage .chatItemIcon { display:grid; place-items:center; width:42px; height:42px; flex:0 0 42px; border-radius:12px; background:var(--tint); font-size:23px; }
    .ownerInboxPage .threadBody { min-width:0; flex:1; }
    .ownerInboxPage .threadTop { display:flex; flex-direction:column; gap:4px; }
    .ownerInboxPage .threadTop strong { font-size:15px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .ownerInboxPage .threadTop small { display:none; }
    .ownerInboxPage .threadTop time { font-size:11px; color:#748399; }
    .ownerInboxPage .threadTag { margin-top:5px; color:var(--accent); font-size:11px; }
    .ownerInboxPage .thread p { margin:6px 0 0; font-size:13px; color:#617389; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .ownerInboxPage .threadReply { position:absolute; right:12px; top:50%; color:#7a8da3; }
    .ownerInboxPage .aiReception { order:3; flex-shrink:0; border-top:1px solid #e3eaf2; background:#f9fbfe; max-height:65%; overflow:auto; }
    .ownerInboxPage .aiReceptionHead { display:flex; align-items:center; gap:10px; width:100%; border:0; background:transparent; padding:14px 16px; text-align:left; color:inherit; }
    .ownerInboxPage .aiReceptionHead>span:nth-child(2) { flex:1; }
    .ownerInboxPage .aiReceptionHead strong,.ownerInboxPage .aiReceptionHead small { display:block; }
    .ownerInboxPage .aiReceptionHead strong { font-size:13px; }
    .ownerInboxPage .aiReceptionHead small { margin-top:4px; font-size:11px; color:#617389; }
    .ownerInboxPage .aiSpark { color:var(--accent); }
    .ownerInboxPage .aiReceptionBody { padding:0 16px 16px; font-size:12px; }
    .ownerInboxPage .automationSwitch { display:flex; align-items:center; gap:10px; }
    .ownerInboxPage .automationSwitch small { display:block; margin-top:5px; color:#617389; line-height:1.5; }
    .ownerInboxPage .automationSwitch input { width:20px; height:20px; accent-color:var(--accent); }
    .ownerInboxPage .aiLanguage { margin:12px 0; }
    .ownerInboxPage .aiLanguage button { padding:6px 9px; margin:6px 6px 0 0; border:1px solid #dce5ef; border-radius:6px; background:white; color:var(--accent); }
    .ownerInboxPage .automationText textarea { display:block; width:100%; min-height:100px; margin-top:6px; padding:10px; border:1px solid #dce5ef; border-radius:8px; resize:vertical; font-size:14px; }
    .ownerInboxPage .saveAutomation { width:100%; margin-top:10px; padding:10px; border:0; border-radius:8px; background:var(--accent); color:white; }
    .ownerInboxPage .aiReceptionBody>p { color:#617389; line-height:1.5; }
    .ownerInboxPage .chatPanel { display:flex; flex-direction:column; min-height:0; min-width:0; }
    .ownerInboxPage .chatHeader { display:flex; align-items:center; gap:12px; flex-shrink:0; padding:14px 18px; border-bottom:1px solid #e3eaf2; }
    .ownerInboxPage .chatIdentity { min-width:0; flex:1; }
    .ownerInboxPage .chatIdentity small { font-size:11px; color:#617389; }
    .ownerInboxPage .chatIdentity h2 { margin:3px 0; font-size:17px; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
    .ownerInboxPage .chatIdentity p { margin:0; font-size:11px; color:#617389; }
    .ownerInboxPage .liveStatus { max-width:125px; color:#617389; font-size:11px; line-height:1.5; }
    .ownerInboxPage .deleteChat,.ownerInboxPage .mobileChatBack { width:36px; height:36px; flex-shrink:0; border:1px solid #dce5ef; border-radius:9px; background:white; color:#617389; font-size:22px; }
    .ownerInboxPage .mobileChatBack { display:none; }
    .ownerInboxPage .privacyNotice { padding:9px 18px; font-size:11px; line-height:1.5; color:#6c7e93; background:#f9fbfe; }
    .ownerInboxPage .messages { flex:1; min-height:0; overflow:auto; overscroll-behavior:contain; padding:22px; background:#f6f8fc; }
    .ownerInboxPage .messageRow { display:flex; flex-direction:column; align-items:flex-start; margin-bottom:18px; }
    .ownerInboxPage .messageRow.mine { align-items:flex-end; }
    .ownerInboxPage .sender { margin:0 0 5px 4px; font-size:11px; color:#617389; }
    .ownerInboxPage .bubble { max-width:85%; padding:11px 14px; border:1px solid #e3eaf2; border-radius:15px 15px 15px 4px; background:white; font-size:15px; line-height:1.65; white-space:pre-wrap; overflow-wrap:anywhere; }
    .ownerInboxPage .mine .bubble { background:var(--accent); border-color:var(--accent); color:white; border-radius:15px 15px 4px 15px; }
    .ownerInboxPage .messageFooter,.ownerInboxPage .messageMeta { display:flex; align-items:center; flex-wrap:wrap; gap:6px; }
    .ownerInboxPage .messageFooter { max-width:95%; margin-top:5px; }
    .ownerInboxPage .messageMeta { color:#6c7e93; font-size:10px; }
    .ownerInboxPage .seen { color:var(--accent); }
    .ownerInboxPage .editMessage,.ownerInboxPage .deleteMessage { padding:6px; border:0; background:transparent; color:#6c7e93; }
    .ownerInboxPage .editMessage svg,.ownerInboxPage .deleteMessage svg { width:14px; height:14px; display:block; }
    .ownerInboxPage .locationLink { display:block; color:inherit; font-size:13px; margin-top:8px; }
    .ownerInboxPage .composer { position:relative; flex-shrink:0; display:grid; gap:8px; padding:12px 16px; border-top:1px solid #e3eaf2; background:#fff; }
    .ownerInboxPage .composerTools,.ownerInboxPage .composerInputRow { display:flex; align-items:center; gap:8px; min-width:0; }
    .ownerInboxPage .composerTools { flex-wrap:wrap; }
    .ownerInboxPage .composer textarea { flex:1; width:0; min-width:0; min-height:48px; max-height:110px; padding:12px 14px; border:1px solid #dce5ef; border-radius:12px; background:#f8faff; color:#18334d; font-size:16px; resize:vertical; }
    .ownerInboxPage .emojiButton,.ownerInboxPage .mediaButton,.ownerInboxPage .locationButton,.ownerInboxPage .cancelEdit { width:36px; height:36px; padding:0; border:0; border-radius:9px; background:var(--tint); color:var(--accent); font-size:20px; }
    .ownerInboxPage .locationButton svg { width:20px; height:20px; }
    .ownerInboxPage .sendButton { width:48px; height:48px; flex:0 0 48px; border:0; border-radius:12px; background:var(--accent); color:white; font-size:21px; }
    .ownerInboxPage .emojiWrap,.ownerInboxPage .compactThemePicker { position:relative; }
    .ownerInboxPage .emojiPicker { position:absolute; bottom:44px; left:0; z-index:10; display:grid; grid-template-columns:repeat(6,1fr); width:270px; max-width:calc(100vw - 60px); max-height:230px; overflow:auto; padding:8px; border:1px solid #dce5ef; border-radius:12px; background:white; box-shadow:0 8px 30px #17365322; }
    .ownerInboxPage .emojiPicker button { border:0; background:white; padding:6px; font-size:23px; }
    .ownerInboxPage .compactThemePicker button { display:block; width:28px; height:28px; border:3px solid white; border-radius:50%; box-shadow:0 0 0 1px #dce5ef; }
    .ownerInboxPage .compactThemePicker .blue { background:#1465d9; }.ownerInboxPage .compactThemePicker .ocean { background:#087a58; }.ownerInboxPage .compactThemePicker .violet { background:#7254c7; }.ownerInboxPage .compactThemePicker .red { background:#bd252c; }
    .ownerInboxPage .themeOptions { position:absolute; bottom:40px; display:grid; gap:8px; padding:8px; border:1px solid #dce5ef; background:white; border-radius:12px; z-index:10; }
    .ownerInboxPage .chatMediaInput { display:none; }
    .ownerInboxPage .chatMediaImage { display:block; max-width:min(300px,55vw); max-height:300px; object-fit:contain; border-radius:8px; }
    .ownerInboxPage .chatMediaAudio { max-width:100%; width:260px; }
    .ownerInboxPage .selectChat,.ownerInboxPage .chatState,.ownerInboxPage .noThreads { display:flex; flex:1; flex-direction:column; align-items:center; justify-content:center; padding:28px; text-align:center; color:#617389; font-size:14px; line-height:1.7; }
    .ownerInboxPage .selectChat h2 { font-size:20px; color:#18334d; margin:12px 0 0; }
    .ownerInboxPage .selectIcon,.ownerInboxPage .noThreads>div { font-size:32px; }
    .ownerInboxPage.statePage { display:flex; align-items:center; justify-content:center; flex-direction:column; }
    .ownerInboxPage.statePage .logo { color:var(--accent); font-size:30px; font-weight:700; }
    @media(max-width:800px) {
      .ownerInboxPage { padding:12px; }
      .ownerInboxPage .pageTitle { margin:16px 0 12px; }
      .ownerInboxPage .pageTitle h1 { font-size:23px; }
      .ownerInboxPage .pageTitle p { display:none; }
      .ownerInboxPage .inbox { grid-template-columns:minmax(0,1fr); height:calc(var(--kompasi-visible-height,100dvh) - 170px); min-height:340px; border-radius:12px; }
      body.kompasiAppMode .ownerInboxPage .inbox { height:calc(var(--kompasi-visible-height,100dvh) - 250px); }
      .ownerInboxPage .sidebar { border-right:0; }
      .ownerInboxPage .chatPanel { display:none; }
      .ownerInboxPage .mobileChatOpen .sidebar { display:none; }
      .ownerInboxPage .mobileChatOpen .chatPanel { display:flex; }
      .ownerInboxPage .mobileChatBack { display:block; }
      .ownerInboxPage .chatHeader { padding:10px; gap:8px; }
      .ownerInboxPage .chatItemIcon { display:none; }
      .ownerInboxPage .liveStatus { max-width:90px; font-size:10px; }
      .ownerInboxPage .privacyNotice { display:none; }
      .ownerInboxPage .messages { padding:14px; }
      .ownerInboxPage .composer { padding:10px; }
      .ownerInboxPage .bubble { max-width:92%; }
      .ownerInboxPage .noThreads { padding:18px; }
    }
  `}</style>;
}
