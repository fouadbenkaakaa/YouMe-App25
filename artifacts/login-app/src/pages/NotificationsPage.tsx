import { useState } from "react";
import { Heart, UserPlus, MessageCircle, AtSign, Share2, Check } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "../data/mockData";

const iconMap: Record<string, any> = {
  like: { icon: Heart, color: "#e11d48", bg: "#fee2e2" },
  friend: { icon: UserPlus, color: "#7c3aed", bg: "#ede9fe" },
  comment: { icon: MessageCircle, color: "#2563eb", bg: "#dbeafe" },
  mention: { icon: AtSign, color: "#d97706", bg: "#fef3c7" },
  share: { icon: Share2, color: "#059669", bg: "#d1fae5" },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 الإشعارات</h1>
          {unreadCount > 0 && <span className="unread-label">{unreadCount} غير مقروء</span>}
        </div>
        <button className="btn-ghost-purple" onClick={markAllRead}>
          <Check size={16} /> تحديد الكل كمقروء
        </button>
      </div>

      <div className="notif-list">
        {notifs.map(notif => {
          const { icon: Icon, color, bg } = iconMap[notif.type] || iconMap.like;
          return (
            <div key={notif.id} className={`notif-item ${!notif.read ? "unread" : ""}`}
              onClick={() => setNotifs(n => n.map(x => x.id === notif.id ? { ...x, read: true } : x))}>
              <div className="notif-avatar-wrap">
                <img src={notif.avatar} alt={notif.user} />
                <span className="notif-type-icon" style={{ background: bg, color }}>
                  <Icon size={12} />
                </span>
              </div>
              <div className="notif-content">
                <p className="notif-text">
                  <strong>{notif.user}</strong> {notif.text}
                </p>
                <span className="notif-time">{notif.time}</span>
              </div>
              {!notif.read && <span className="notif-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
