import { useState, useRef, useEffect } from "react";
import {
  Send, Phone, Video, MoreHorizontal, Image, Mic, Smile,
  Search, ArrowRight, Check, CheckCheck, Users, X, Plus,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_CONVERSATIONS } from "../data/mockData";

interface Message {
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
  status?: "sent" | "delivered" | "read";
}

/* ─── seed per-conversation histories ─── */
const SEED_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", from: "other", text: "أهلاً فؤاد! كيف حالك؟ 😊", time: "٢:٣٠م", status: "read" },
    { id: "m2", from: "me",    text: "أهلاً سارة! بخير والحمد لله 🙌", time: "٢:٣١م", status: "read" },
    { id: "m3", from: "other", text: "شاهدت مشروعك الجديد، يبدو رائعاً 🚀", time: "٢:٣٢م", status: "read" },
    { id: "m4", from: "me",    text: "شكراً جزيلاً! استغرق مني وقتاً طويلاً 💪", time: "٢:٣٣م", status: "read" },
    { id: "m5", from: "other", text: "كيف يمكنني الاطلاع عليه؟", time: "٢:٣٤م", status: "read" },
    { id: "m6", from: "me",    text: "سأرسل لكِ الرابط قريباً 😊", time: "٢:٣٥م", status: "read" },
    { id: "m7", from: "other", text: "كيف حالك اليوم؟ 😊", time: "٣:١٠م", status: "delivered" },
  ],
  c2: [
    { id: "m1", from: "other", text: "أهلاً! شاهدت مشروعك، رائع جداً 🎉", time: "أمس ١١:٠٠ص", status: "read" },
    { id: "m2", from: "me",    text: "شكراً محمد! أسعدني ذلك", time: "أمس ١١:٣٠ص", status: "read" },
    { id: "m3", from: "other", text: "متى موعد الإطلاق؟", time: "أمس ١١:٣١ص", status: "read" },
    { id: "m4", from: "me",    text: "قريباً إن شاء الله 🙏", time: "أمس ١٢:٠٠م", status: "read" },
  ],
  c3: [
    { id: "m1", from: "other", text: "أهلاً بالجميع! 👋", time: "اليوم ٩:٠٠ص", status: "read" },
    { id: "m2", from: "other", text: "نورة: موعد الغداء الساعة ٢؟", time: "اليوم ١:٠٠م", status: "read" },
    { id: "m3", from: "me",    text: "تمام! سأكون هناك 🍽️", time: "اليوم ١:٠٥م", status: "delivered" },
  ],
  c4: [
    { id: "m1", from: "other", text: "أرسلت لكِ الوصفة 🍮", time: "منذ ساعتين", status: "read" },
    { id: "m2", from: "me",    text: "وصلت! شكراً نورة 🙏", time: "منذ ساعة", status: "read" },
  ],
  c5: [
    { id: "m1", from: "me",    text: "شكراً على المساعدة!", time: "أمس", status: "read" },
    { id: "m2", from: "other", text: "شكراً جزيلاً! العفو دائماً 🤝", time: "أمس", status: "read" },
  ],
};

export default function MessagesPage() {
  const { user } = useApp();
  const [search, setSearch]             = useState("");
  const [activeId, setActiveId]         = useState<string | null>(null);
  const [showChat, setShowChat]         = useState(false); // mobile: show chat pane
  const [allMessages, setAllMessages]   = useState<Record<string, Message[]>>(SEED_MESSAGES);
  const [draft, setDraft]               = useState("");
  const [typing, setTyping]             = useState(false);
  const [showEmojiHint, setShowEmojiHint] = useState(false);
  const messagesEndRef                  = useRef<HTMLDivElement>(null);
  const inputRef                        = useRef<HTMLInputElement>(null);

  const filteredConvs = MOCK_CONVERSATIONS.filter(c =>
    c.name.includes(search) || c.lastMsg.includes(search)
  );

  const activeConv = MOCK_CONVERSATIONS.find(c => c.id === activeId) ?? null;
  const messages   = activeId ? (allMessages[activeId] ?? []) : [];

  const scrollToBottom = () =>
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 60);

  useEffect(() => { scrollToBottom(); }, [messages.length]);

  const openConv = (id: string) => {
    setActiveId(id);
    setShowChat(true);
    setDraft("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const sendMessage = () => {
    if (!draft.trim() || !activeId) return;
    const msg: Message = {
      id: `m-${Date.now()}`,
      from: "me",
      text: draft.trim(),
      time: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };
    setAllMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }));
    setDraft("");
    // simulate "delivered" after 800ms
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).map(m => m.id === msg.id ? { ...m, status: "delivered" } : m),
      }));
    }, 800);
    // simulate reply + typing indicator after 2s
    const conv = MOCK_CONVERSATIONS.find(c => c.id === activeId);
    if (conv && !conv.isGroup) {
      setTimeout(() => setTyping(true), 1200);
      setTimeout(() => {
        setTyping(false);
        const reply: Message = {
          id: `m-${Date.now()}-reply`,
          from: "other",
          text: ["شكراً لك! 🙏", "فهمت، شكراً 😊", "إن شاء الله 🤝", "تمام! 👍", "رائع! 🎉"][Math.floor(Math.random() * 5)],
          time: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }),
          status: "read",
        };
        setAllMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }));
      }, 2800);
    }
  };

  const EMOJIS = ["😊", "❤️", "🔥", "👍", "🎉", "😂", "🙏", "✨", "🚀", "💜"];

  return (
    <div className="messages-layout">
      {/* ── Conversations sidebar ── */}
      <div className={`conversations-list ${showChat ? "mobile-hidden" : ""}`}>
        <div className="conv-header">
          <h2>💬 الرسائل</h2>
          <button className="icon-btn" title="رسالة جديدة"><Plus size={20} /></button>
        </div>
        <div className="conv-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="بحث في المحادثات..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="icon-btn" onClick={() => setSearch("")}><X size={14} /></button>}
        </div>

        {filteredConvs.length === 0 && (
          <div className="empty-state" style={{ padding: "40px 0" }}>
            <span>🔍</span><p>لا نتائج</p>
          </div>
        )}

        {filteredConvs.map(conv => (
          <div
            key={conv.id}
            className={`conv-item ${activeId === conv.id ? "active" : ""}`}
            onClick={() => openConv(conv.id)}
          >
            <div className="conv-avatar-wrap">
              {(conv as any).isGroup
                ? <div className="conv-group-icon"><Users size={20} /></div>
                : <img src={conv.avatar} alt={conv.name} />}
              {conv.online && !((conv as any).isGroup) && <span className="conv-online-dot" />}
            </div>
            <div className="conv-info">
              <div className="conv-name-row">
                <span className="conv-name">{conv.name}</span>
                <span className="conv-time">{conv.time}</span>
              </div>
              <div className="conv-last-msg-row">
                <span className="conv-last-msg">{conv.lastMsg}</span>
                {conv.unread > 0 && <span className="conv-unread">{conv.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Chat area ── */}
      <div className={`chat-area ${!showChat && !activeConv ? "chat-empty-state-wrap" : ""} ${!showChat ? "mobile-hidden-chat" : ""}`}>
        {!activeConv ? (
          <div className="chat-empty-state">
            <div style={{ fontSize: 52 }}>💬</div>
            <h3>اختر محادثة</h3>
            <p>اختر محادثة من القائمة لبدء الدردشة</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="chat-header">
              <div className="chat-header-info">
                {/* Mobile back button */}
                <button
                  className="chat-back-btn"
                  onClick={() => { setShowChat(false); setActiveId(null); }}
                  title="العودة"
                >
                  <ArrowRight size={20} />
                </button>
                <div className="chat-avatar-wrap">
                  {(activeConv as any).isGroup
                    ? <div className="conv-group-icon sm"><Users size={18} /></div>
                    : <img src={activeConv.avatar} alt={activeConv.name} />}
                  {activeConv.online && !((activeConv as any).isGroup) && <span className="conv-online-dot" />}
                </div>
                <div>
                  <div className="chat-name">{activeConv.name}</div>
                  <div className="chat-status">
                    {typing
                      ? <span className="typing-indicator">يكتب الآن<span className="typing-dots"><span /><span /><span /></span></span>
                      : activeConv.online
                        ? "نشط الآن"
                        : "آخر ظهور منذ ساعة"}
                  </div>
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="chat-action-btn" title="مكالمة صوتية"><Phone size={20} /></button>
                <button className="chat-action-btn" title="مكالمة فيديو"><Video size={20} /></button>
                <button className="chat-action-btn"><MoreHorizontal size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              <div className="chat-date-divider">اليوم</div>
              {messages.map(msg => (
                <div key={msg.id} className={`msg-row ${msg.from === "me" ? "mine" : "theirs"}`}>
                  {msg.from !== "me" && (
                    <img src={activeConv.avatar} alt="" className="msg-avatar" />
                  )}
                  <div className={`msg-bubble ${msg.from === "me" ? "mine" : "theirs"}`}>
                    <span className="msg-text">{msg.text}</span>
                    <div className="msg-footer">
                      <span className="msg-time">{msg.time}</span>
                      {msg.from === "me" && (
                        <span className="msg-status" title={msg.status}>
                          {msg.status === "read"      ? <CheckCheck size={13} style={{ color: "#7c3aed" }} />
                           : msg.status === "delivered" ? <CheckCheck size={13} />
                           : <Check size={13} />}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="msg-row theirs">
                  <img src={activeConv.avatar} alt="" className="msg-avatar" />
                  <div className="msg-bubble theirs typing-bubble">
                    <span className="typing-dots"><span /><span /><span /></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Emoji quick bar */}
            {showEmojiHint && (
              <div className="emoji-quick-bar">
                {EMOJIS.map(e => (
                  <button key={e} className="emoji-quick-btn" onClick={() => { setDraft(d => d + e); setShowEmojiHint(false); inputRef.current?.focus(); }}>
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div className="chat-input-bar">
              <div className="chat-input-side">
                <button className="chat-action-btn" title="صورة"><Image size={20} /></button>
                <button className="chat-action-btn" title="صوت"><Mic size={20} /></button>
                <button className="chat-action-btn" title="إيموجي" onClick={() => setShowEmojiHint(v => !v)}>
                  <Smile size={20} />
                </button>
              </div>
              <div className="chat-input-box">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="اكتب رسالة..."
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
              </div>
              <button
                className={`send-btn ${draft.trim() ? "active" : ""}`}
                onClick={sendMessage}
                disabled={!draft.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
