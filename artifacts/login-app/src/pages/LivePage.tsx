import { useState } from "react";
import { Radio, Eye, Heart, MessageCircle, Share2, Mic, MicOff, Camera, CameraOff, PhoneOff, Users, Send } from "lucide-react";

const LIVE_STREAMS = [
  { id: "l1", user: "أحمد المزارع", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed&backgroundColor=b6e3f4", title: "جولة في المزرعة الخضراء 🌾", viewers: 1240, likes: 3400, bg: "linear-gradient(135deg,#134e4a,#065f46)", emoji: "🌾" },
  { id: "l2", user: "نورة الطبخ", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede", title: "تعليم الطبخ المغربي مباشر 🍲", viewers: 890, likes: 1800, bg: "linear-gradient(135deg,#451a03,#92400e)", emoji: "🍲" },
  { id: "l3", user: "خالد التقنية", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf", title: "نقاش حول مستقبل الذكاء الاصطناعي 🤖", viewers: 2100, likes: 5600, bg: "linear-gradient(135deg,#1e1b4b,#312e81)", emoji: "🤖" },
  { id: "l4", user: "سارة الرياضة", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf", title: "تمارين الصباح المباشرة 💪", viewers: 560, likes: 900, bg: "linear-gradient(135deg,#0c4a6e,#075985)", emoji: "💪" },
];

const CHAT_MSGS = [
  { user: "محمد", text: "رائع جداً! 🔥", color: "#f59e0b" },
  { user: "فاطمة", text: "تسلم يديك", color: "#ec4899" },
  { user: "خالد", text: "ممكن تشرح أكثر؟", color: "#3b82f6" },
  { user: "هند", text: "❤️❤️❤️", color: "#22c55e" },
  { user: "عبدالله", text: "بارك الله فيك", color: "#a855f7" },
];

function formatK(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;
}

export default function LivePage() {
  const [activeLive, setActiveLive] = useState<any>(null);
  const [myLive, setMyLive] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMsgs, setChatMsgs] = useState(CHAT_MSGS);
  const [liked, setLiked] = useState(false);

  if (myLive) {
    return (
      <div className="live-broadcast">
        <div className="live-bg-placeholder" style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)" }}>
          <div className="live-cam-placeholder">
            {camOn ? <Camera size={64} color="rgba(255,255,255,0.3)" /> : <CameraOff size={64} color="rgba(255,255,255,0.3)" />}
            <span>بثّك المباشر</span>
          </div>
        </div>
        <div className="live-overlay">
          <div className="live-top">
            <div className="live-badge-red">🔴 مباشر</div>
            <div className="live-viewers"><Eye size={16} /> 0 مشاهد</div>
            <button className="live-end-btn" onClick={() => setMyLive(false)}><PhoneOff size={18} /> إنهاء</button>
          </div>
          <div className="live-chat-area">
            {chatMsgs.slice(-4).map((m, i) => (
              <div key={i} className="live-chat-msg">
                <span style={{ color: m.color, fontWeight: 700 }}>{m.user}:</span>
                <span> {m.text}</span>
              </div>
            ))}
          </div>
          <div className="live-input-row">
            <button className="live-ctrl-btn" onClick={() => setMicOn(!micOn)}>{micOn ? <Mic size={20} /> : <MicOff size={20} />}</button>
            <button className="live-ctrl-btn" onClick={() => setCamOn(!camOn)}>{camOn ? <Camera size={20} /> : <CameraOff size={20} />}</button>
            <input className="live-chat-input" placeholder="رد على التعليقات..." value={chatMsg}
              onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && setChatMsg("")} />
            <button className="live-send-btn"><Send size={16} /></button>
          </div>
        </div>
      </div>
    );
  }

  if (activeLive) {
    return (
      <div className="live-broadcast">
        <div className="live-bg-placeholder" style={{ background: activeLive.bg }}>
          <div className="live-cam-placeholder">
            <div style={{ fontSize: 72 }}>{activeLive.emoji}</div>
            <span style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>{activeLive.title}</span>
          </div>
        </div>
        <div className="live-overlay">
          <div className="live-top">
            <div className="live-user-info">
              <img src={activeLive.avatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #ef4444" }} />
              <span style={{ color: "#fff", fontWeight: 700 }}>{activeLive.user}</span>
              <div className="live-badge-red">🔴 مباشر</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div className="live-viewers"><Eye size={15} /> {formatK(activeLive.viewers)}</div>
              <button className="live-end-btn" onClick={() => setActiveLive(null)}>✕ خروج</button>
            </div>
          </div>
          <div className="live-chat-area">
            {chatMsgs.map((m, i) => (
              <div key={i} className="live-chat-msg">
                <span style={{ color: m.color, fontWeight: 700 }}>{m.user}:</span>
                <span> {m.text}</span>
              </div>
            ))}
          </div>
          <div className="live-bottom-actions">
            <button className={`live-action ${liked ? "liked-live" : ""}`} onClick={() => setLiked(!liked)}>
              <Heart size={24} fill={liked ? "#e11d48" : "none"} /> {formatK(activeLive.likes + (liked ? 1 : 0))}
            </button>
            <button className="live-action"><MessageCircle size={24} /> {chatMsgs.length}</button>
            <button className="live-action"><Share2 size={24} /> مشاركة</button>
            <div className="live-input-row">
              <input className="live-chat-input" placeholder="تعليق مباشر..." value={chatMsg}
                onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && chatMsg.trim()) {
                    setChatMsgs(m => [...m, { user: "أنت", text: chatMsg, color: "#7c3aed" }]);
                    setChatMsg("");
                  }
                }} />
              <button className="live-send-btn" onClick={() => {
                if (chatMsg.trim()) { setChatMsgs(m => [...m, { user: "أنت", text: chatMsg, color: "#7c3aed" }]); setChatMsg(""); }
              }}><Send size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🔴 البث المباشر</h1>
        <button className="btn-primary" onClick={() => setMyLive(true)}>
          <Radio size={16} /> ابدأ بثاً مباشراً
        </button>
      </div>

      <div className="live-grid">
        {LIVE_STREAMS.map(stream => (
          <div key={stream.id} className="live-card" onClick={() => setActiveLive(stream)}>
            <div className="live-card-preview" style={{ background: stream.bg }}>
              <div style={{ fontSize: 48 }}>{stream.emoji}</div>
              <div className="live-red-dot"><span>🔴</span> مباشر</div>
              <div className="live-viewers-badge"><Eye size={13} /> {formatK(stream.viewers)}</div>
            </div>
            <div className="live-card-body">
              <div className="live-card-user">
                <img src={stream.avatar} alt={stream.user} className="live-avatar" />
                <span className="live-user-name">{stream.user}</span>
              </div>
              <p className="live-card-title">{stream.title}</p>
              <div className="live-card-stats">
                <span><Heart size={13} /> {formatK(stream.likes)}</span>
                <span><Users size={13} /> {formatK(stream.viewers)} مشاهد</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
