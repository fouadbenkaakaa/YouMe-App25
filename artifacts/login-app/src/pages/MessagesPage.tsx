import { useState } from "react";
import { Send, Phone, Video, MoreHorizontal, Image, Mic, Smile, Search } from "lucide-react";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "../data/mockData";

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(MOCK_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMsg, setNewMsg] = useState("");

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    setMessages(m => [...m, { id: Date.now().toString(), from: "me", text: newMsg, time: new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" }) }]);
    setNewMsg("");
  };

  return (
    <div className="messages-layout">
      <div className="conversations-list">
        <div className="conv-header">
          <h2>الرسائل</h2>
          <div className="conv-search">
            <Search size={15} />
            <input type="text" placeholder="بحث..." />
          </div>
        </div>
        {MOCK_CONVERSATIONS.map(conv => (
          <div
            key={conv.id}
            className={`conv-item ${activeConv.id === conv.id ? "active" : ""}`}
            onClick={() => setActiveConv(conv)}
          >
            <div className="conv-avatar-wrap">
              <img src={conv.avatar} alt={conv.name} />
              {conv.online && <span className="conv-online-dot" />}
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

      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar-wrap">
              <img src={activeConv.avatar} alt={activeConv.name} />
              {activeConv.online && <span className="conv-online-dot" />}
            </div>
            <div>
              <div className="chat-name">{activeConv.name}</div>
              <div className="chat-status">{activeConv.online ? "نشط الآن" : "آخر ظهور منذ ساعة"}</div>
            </div>
          </div>
          <div className="chat-header-actions">
            <button className="chat-action-btn"><Phone size={20} /></button>
            <button className="chat-action-btn"><Video size={20} /></button>
            <button className="chat-action-btn"><MoreHorizontal size={20} /></button>
          </div>
        </div>

        <div className="chat-messages">
          <div className="chat-date-divider">اليوم</div>
          {messages.map(msg => (
            <div key={msg.id} className={`msg-row ${msg.from === "me" ? "mine" : "theirs"}`}>
              {msg.from !== "me" && (
                <img src={activeConv.avatar} alt="" className="msg-avatar" />
              )}
              <div className={`msg-bubble ${msg.from === "me" ? "mine" : "theirs"}`}>
                <span>{msg.text}</span>
                <span className="msg-time">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-bar">
          <div className="chat-input-actions">
            <button className="chat-action-btn"><Image size={20} /></button>
            <button className="chat-action-btn"><Mic size={20} /></button>
            <button className="chat-action-btn"><Smile size={20} /></button>
          </div>
          <input
            type="text"
            placeholder="اكتب رسالة..."
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMsg()}
          />
          <button className={`send-btn ${newMsg.trim() ? "active" : ""}`} onClick={sendMsg}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
