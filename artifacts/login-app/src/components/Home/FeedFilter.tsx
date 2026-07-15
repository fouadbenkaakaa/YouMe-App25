// ═══════════════════════════════════════════════════════════════
//  FeedFilter.tsx
// ═══════════════════════════════════════════════════════════════
import { useState } from "react";
import { useApp } from "../../context/AppContext";

const FILTERS = [
  { key: "all",      label: "الكل" },
  { key: "friends",  label: "الأصدقاء" },
  { key: "groups",   label: "المجموعات" },
  { key: "pages",    label: "الصفحات" },
  { key: "saved",    label: "المحفوظات" },
];

export default function FeedFilter() {
  const { t } = useApp();
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="feed-filter">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={`feed-filter-btn${activeFilter === f.key ? " active" : ""}`}
          onClick={() => setActiveFilter(f.key)}
        >
          {t(f.key) || f.label}
        </button>
      ))}
    </div>
  );
}
