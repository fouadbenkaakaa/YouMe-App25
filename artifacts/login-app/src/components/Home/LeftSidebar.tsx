// ═══════════════════════════════════════════════════════════════
//  LeftSidebar.tsx
// ═══════════════════════════════════════════════════════════════
import { useApp } from "../../context/AppContext";

const NAV_ITEMS = [
  { icon: "👥", labelKey: "friends", label: "الأصدقاء" },
  { icon: "📺", labelKey: "videos",  label: "الفيديوهات" },
  { icon: "🛒", labelKey: "market",  label: "السوق" },
  { icon: "📋", labelKey: "groups",  label: "المجموعات" },
  { icon: "🔖", labelKey: "saved",   label: "المحفوظات" },
  { icon: "📅", labelKey: "events",  label: "الأحداث" },
];

const SHORTCUTS = [
  { icon: "🏠", label: "الرئيسية" },
  { icon: "🎮", label: "ألعاب" },
  { icon: "📰", label: "الأخبار" },
];

const GROUPS = [
  { icon: "👨‍💻", label: "مطورو YouMe" },
  { icon: "🎨", label: "مصممون عرب" },
];

const PAGES = [
  { icon: "📄", label: "صفحة YouMe الرسمية" },
];

export default function LeftSidebar() {
  const { user, t } = useApp();

  return (
    <>
      {/* ── User Card ───────────────────────────────────────────── */}
      <div className="sidebar-profile">
        <img src={user?.avatar} alt={user?.name} />
        <span>{user?.name}</span>
      </div>

      <div className="sidebar-divider"></div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.labelKey} className="sidebar-nav-item">
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span>{t(item.labelKey) || item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-divider"></div>

      {/* ── Shortcuts ───────────────────────────────────────────── */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">{t("shortcuts") || "الاختصارات"}</div>
        {SHORTCUTS.map((s) => (
          <button key={s.label} className="sidebar-nav-item">
            <span className="sidebar-nav-icon">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-divider"></div>

      {/* ── Groups ──────────────────────────────────────────────── */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">{t("groups") || "المجموعات"}</div>
        {GROUPS.map((g) => (
          <button key={g.label} className="sidebar-nav-item">
            <span className="sidebar-nav-icon">{g.icon}</span>
            <span>{g.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-divider"></div>

      {/* ── Pages ─────────────────────────────────────────────────── */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">{t("pages") || "الصفحات"}</div>
        {PAGES.map((p) => (
          <button key={p.label} className="sidebar-nav-item">
            <span className="sidebar-nav-icon">{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-divider"></div>

      {/* ── Saved ─────────────────────────────────────────────────── */}
      <div className="sidebar-section">
        <button className="sidebar-nav-item">
          <span className="sidebar-nav-icon">🔖</span>
          <span>{t("saved") || "المحفوظات"}</span>
        </button>
      </div>
    </>
  );
}
