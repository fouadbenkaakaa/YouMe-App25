import { useState } from "react";
import { Search, Users, Lock, Globe, Plus } from "lucide-react";
import { MOCK_GROUPS } from "../data/mockData";

const PAGES_DATA = [
  { id: "p1", name: "شركة التقنية السعودية", followers: "٤٥.٢ألف", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80", category: "شركة" },
  { id: "p2", name: "مزرعة الخير", followers: "١٢.٨ألف", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80", category: "زراعة" },
  { id: "p3", name: "ستوديو الإبداع", followers: "٨.٤ألف", image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", category: "فنون" },
];

export default function GroupsPage() {
  const [tab, setTab] = useState<"groups" | "pages">("groups");
  const [joined, setJoined] = useState<Set<string>>(new Set());

  const toggleJoin = (id: string) => {
    const next = new Set(joined);
    next.has(id) ? next.delete(id) : next.add(id);
    setJoined(next);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📋 الصفحات والمجموعات</h1>
        <button className="btn-primary"><Plus size={16} /> إنشاء جديد</button>
      </div>

      <div className="tab-bar">
        <button className={tab === "groups" ? "active" : ""} onClick={() => setTab("groups")}>
          <Users size={16} /> المجموعات
        </button>
        <button className={tab === "pages" ? "active" : ""} onClick={() => setTab("pages")}>
          🏢 الصفحات
        </button>
      </div>

      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <Search size={16} />
        <input type="text" placeholder={tab === "groups" ? "ابحث عن مجموعة..." : "ابحث عن صفحة..."} />
      </div>

      {tab === "groups" && (
        <div className="groups-grid">
          {MOCK_GROUPS.map(group => (
            <div key={group.id} className="group-card">
              <img src={group.image} alt={group.name} className="group-img" />
              <div className="group-card-body">
                <div className="group-privacy-badge">
                  {group.privacy === "عامة" ? <Globe size={13} /> : <Lock size={13} />}
                  {group.privacy}
                </div>
                <h3 className="group-name">{group.name}</h3>
                <p className="group-members"><Users size={13} /> {group.members.toLocaleString("ar-SA")} عضو</p>
                <button
                  className={joined.has(group.id) ? "btn-ghost" : "btn-primary"}
                  onClick={() => toggleJoin(group.id)}
                >
                  {joined.has(group.id) ? "✓ منضم" : "انضمام"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "pages" && (
        <div className="groups-grid">
          {PAGES_DATA.map(page => (
            <div key={page.id} className="group-card">
              <img src={page.image} alt={page.name} className="group-img" />
              <div className="group-card-body">
                <div className="group-privacy-badge"><Globe size={13} /> {page.category}</div>
                <h3 className="group-name">{page.name}</h3>
                <p className="group-members">👥 {page.followers} متابع</p>
                <button
                  className={joined.has(page.id) ? "btn-ghost" : "btn-primary"}
                  onClick={() => toggleJoin(page.id)}
                >
                  {joined.has(page.id) ? "✓ تتابع" : "متابعة"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
