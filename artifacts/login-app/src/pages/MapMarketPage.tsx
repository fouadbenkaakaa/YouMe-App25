import { useState } from "react";
import { MapPin, Search, Sliders, Tag, Navigation } from "lucide-react";

const MAP_ITEMS = [
  { id: "m1", title: "تويوتا هايلوكس 2022", category: "سيارات", price: "95,000 ريال", lat: 24.7, lng: 46.7, dist: 2.3, seller: "طارق الغامدي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarek&backgroundColor=ffdfbf", color: "#3b82f6" },
  { id: "m2", title: "جرار زراعي جون ديري", category: "معدات زراعية", price: "45,000 ريال", lat: 24.75, lng: 46.65, dist: 4.1, seller: "يوسف البلوي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousuf&backgroundColor=c0aede", color: "#22c55e" },
  { id: "m3", title: "شقة للإيجار 3 غرف", category: "عقارات", price: "35,000 ريال/سنة", lat: 24.68, lng: 46.72, dist: 6.8, seller: "ريم العتيبي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reem&backgroundColor=d1d4f9", color: "#f59e0b" },
  { id: "m4", title: "كلب هاسكي للبيع", category: "حيوانات", price: "2,500 ريال", lat: 24.72, lng: 46.68, dist: 3.5, seller: "فيصل الدوسري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=faisal&backgroundColor=b6e3f4", color: "#a855f7" },
  { id: "m5", title: "ماك بوك برو 2023", category: "إلكترونيات", price: "8,500 ريال", lat: 24.73, lng: 46.74, dist: 1.2, seller: "لمياء السلمي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lamia&backgroundColor=ffdfbf", color: "#ef4444" },
  { id: "m6", title: "أغنام للبيع (10 رؤوس)", category: "حيوانات", price: "15,000 ريال", lat: 24.66, lng: 46.66, dist: 9.2, seller: "عبدالله الحربي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ab&backgroundColor=b6e3f4", color: "#a855f7" },
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

const CAT_ICONS: Record<string, string> = {
  "سيارات": "🚗", "معدات زراعية": "🚜", "عقارات": "🏠",
  "حيوانات": "🐾", "إلكترونيات": "💻", "ملابس": "👕",
};

export default function MapMarketPage() {
  const [radius, setRadius] = useState(10);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", ...Array.from(new Set(MAP_ITEMS.map(i => i.category)))];

  const filtered = MAP_ITEMS.filter(item =>
    item.dist <= radius &&
    (activeCategory === "الكل" || item.category === activeCategory) &&
    (item.title.includes(query) || item.category.includes(query) || query === "")
  );

  // Simulate NLP query
  const handleNLPSearch = () => {
    if (query.includes("جرار") || query.includes("زراع")) setActiveCategory("معدات زراعية");
    else if (query.includes("مواش") || query.includes("أغنام") || query.includes("حيوان")) setActiveCategory("حيوانات");
    else if (query.includes("سيارة") || query.includes("سيارات")) setActiveCategory("سيارات");
    else if (query.includes("عقار") || query.includes("شقة")) setActiveCategory("عقارات");
  };

  return (
    <div className="page-container" style={{ maxWidth: 1100 }}>
      <div className="page-header">
        <h1 className="page-title">🗺️ خريطة السوق الذكية</h1>
      </div>

      {/* NLP search */}
      <div className="map-nlp-search">
        <Search size={16} />
        <input
          type="text"
          placeholder='مثال: "اعرض لي الجرارات الزراعية القريبة مني" أو "مواشي ضمن 50 كم"'
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleNLPSearch()}
        />
        <button className="btn-primary" style={{ fontSize: "13px" }} onClick={handleNLPSearch}>
          🤖 بحث ذكي
        </button>
      </div>

      {/* Radius picker */}
      <div className="radius-picker">
        <Navigation size={16} />
        <span>نصف قطر البحث:</span>
        {RADIUS_OPTIONS.map(r => (
          <button key={r} className={`radius-btn ${radius === r ? "active" : ""}`} onClick={() => setRadius(r)}>
            {r} كم
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="categories-bar">
        {categories.map(cat => (
          <button key={cat} className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}>
            {CAT_ICONS[cat] || ""} {cat}
          </button>
        ))}
      </div>

      <div className="map-layout">
        {/* Fake interactive map */}
        <div className="fake-map">
          <div className="map-bg">
            {/* Grid lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="map-grid-h" style={{ top: `${(i + 1) * 14}%` }} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="map-grid-v" style={{ left: `${(i + 1) * 14}%` }} />
            ))}

            {/* Your location */}
            <div className="map-you-pin">
              <div className="map-you-dot" />
              <div className="map-radius-circle" style={{ width: `${radius * 3}%`, height: `${radius * 3}%` }} />
              <span className="map-you-label">موقعك</span>
            </div>

            {/* Item pins */}
            {filtered.map((item, i) => {
              const positions = [
                { top: "25%", left: "60%" }, { top: "55%", left: "35%" },
                { top: "70%", left: "65%" }, { top: "35%", left: "25%" },
                { top: "45%", left: "75%" }, { top: "65%", left: "20%" },
              ];
              const pos = positions[i % positions.length];
              return (
                <button key={item.id} className="map-pin"
                  style={{ top: pos.top, left: pos.left, background: item.color }}
                  onClick={() => setSelected(item === selected ? null : item)}>
                  <span>{CAT_ICONS[item.category] || "📦"}</span>
                  {selected?.id === item.id && (
                    <div className="map-popup">
                      <strong>{item.title}</strong>
                      <span>{item.price}</span>
                      <span><MapPin size={11} /> {item.dist} كم</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="map-attribution">© OpenStreetMap</div>
        </div>

        {/* Results list */}
        <div className="map-results-list">
          <div className="map-results-count">
            <MapPin size={15} /> {filtered.length} إعلان ضمن {radius} كم
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <p>لا توجد نتائج في هذا النطاق</p>
            </div>
          ) : (
            filtered.sort((a, b) => a.dist - b.dist).map(item => (
              <div key={item.id}
                className={`map-result-item ${selected?.id === item.id ? "selected" : ""}`}
                onClick={() => setSelected(item === selected ? null : item)}>
                <div className="map-item-cat-icon" style={{ background: item.color }}>
                  {CAT_ICONS[item.category] || "📦"}
                </div>
                <div className="map-item-info">
                  <div className="map-item-title">{item.title}</div>
                  <div className="map-item-price">{item.price}</div>
                  <div className="map-item-meta">
                    <span><MapPin size={11} /> {item.dist} كم</span>
                    <span className="map-item-cat-badge">
                      <Tag size={11} /> {item.category}
                    </span>
                  </div>
                </div>
                <div className="map-item-seller">
                  <img src={item.avatar} alt={item.seller} className="map-seller-avatar" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
