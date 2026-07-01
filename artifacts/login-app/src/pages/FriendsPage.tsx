import { useState } from "react";
import { UserPlus, UserX, UserCheck, Search } from "lucide-react";
import { MOCK_FRIENDS_REQUESTS, MOCK_SUGGESTIONS } from "../data/mockData";

export default function FriendsPage() {
  const [requests, setRequests] = useState(MOCK_FRIENDS_REQUESTS);
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [tab, setTab] = useState<"requests" | "suggestions" | "friends">("requests");

  const acceptRequest = (id: string) => setRequests(r => r.filter(x => x.id !== id));
  const rejectRequest = (id: string) => setRequests(r => r.filter(x => x.id !== id));
  const addFriend = (id: string) => setSuggestions(s => s.filter(x => x.id !== id));

  const FRIENDS_LIST = [
    { id: "f1", name: "سارة المنصور", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf", mutual: 15, online: true },
    { id: "f2", name: "محمد العمري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", mutual: 8, online: true },
    { id: "f3", name: "نورة الشمري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede", mutual: 22, online: false },
    { id: "f4", name: "عبدالله القحطاني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4", mutual: 11, online: false },
    { id: "f5", name: "لمياء السلمي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lamia&backgroundColor=b6e3f4", mutual: 6, online: true },
    { id: "f6", name: "طارق الغامدي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarek&backgroundColor=ffdfbf", mutual: 3, online: false },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👥 الأصدقاء</h1>
        <div className="search-bar">
          <Search size={16} />
          <input type="text" placeholder="ابحث عن أصدقاء..." />
        </div>
      </div>

      <div className="tab-bar">
        <button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>
          طلبات الصداقة {requests.length > 0 && <span className="tab-badge">{requests.length}</span>}
        </button>
        <button className={tab === "suggestions" ? "active" : ""} onClick={() => setTab("suggestions")}>
          اقتراحات
        </button>
        <button className={tab === "friends" ? "active" : ""} onClick={() => setTab("friends")}>
          أصدقائي
        </button>
      </div>

      {tab === "requests" && (
        <div className="friends-grid">
          {requests.length === 0 ? (
            <div className="empty-state">
              <span>🎉</span>
              <p>لا توجد طلبات صداقة جديدة</p>
            </div>
          ) : requests.map(req => (
            <div key={req.id} className="friend-card">
              <img src={req.avatar} alt={req.name} className="friend-card-avatar" />
              <div className="friend-card-name">{req.name}</div>
              <div className="friend-card-mutual">{req.mutual} صديق مشترك</div>
              <div className="friend-card-actions">
                <button className="btn-primary" onClick={() => acceptRequest(req.id)}>
                  <UserCheck size={15} /> قبول
                </button>
                <button className="btn-ghost" onClick={() => rejectRequest(req.id)}>
                  <UserX size={15} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "suggestions" && (
        <div className="friends-grid">
          {suggestions.map(sug => (
            <div key={sug.id} className="friend-card">
              <img src={sug.avatar} alt={sug.name} className="friend-card-avatar" />
              <div className="friend-card-name">{sug.name}</div>
              <div className="friend-card-mutual">{sug.mutual} صديق مشترك</div>
              <div className="friend-card-actions">
                <button className="btn-primary" onClick={() => addFriend(sug.id)}>
                  <UserPlus size={15} /> إضافة صديق
                </button>
                <button className="btn-ghost" onClick={() => addFriend(sug.id)}>تجاهل</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "friends" && (
        <div className="friends-grid">
          {FRIENDS_LIST.map(f => (
            <div key={f.id} className="friend-card">
              <div className="friend-avatar-wrap">
                <img src={f.avatar} alt={f.name} className="friend-card-avatar" />
                {f.online && <span className="friend-online-dot" />}
              </div>
              <div className="friend-card-name">{f.name}</div>
              <div className="friend-card-mutual">{f.mutual} صديق مشترك</div>
              <div className="friend-card-actions">
                <button className="btn-ghost-purple">💬 رسالة</button>
                <button className="btn-ghost">إزالة</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
