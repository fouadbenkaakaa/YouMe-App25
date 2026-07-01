import { useState } from "react";
import { Search, MapPin, Tag, Plus } from "lucide-react";
import { MOCK_MARKET_ITEMS } from "../data/mockData";

const CATEGORIES = ["الكل", "حيوانات", "سيارات", "عقارات", "معدات زراعية", "وظائف"];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = MOCK_MARKET_ITEMS.filter(item =>
    (activeCategory === "الكل" || item.category === activeCategory) &&
    (item.title.includes(search) || item.category.includes(search))
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🛒 السوق الإلكتروني</h1>
        <button className="btn-primary"><Plus size={16} /> إضافة إعلان</button>
      </div>

      <div className="market-search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="ابحث في السوق..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="categories-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="market-grid">
        {filtered.map(item => (
          <div key={item.id} className="market-card">
            <div className="market-img-wrap">
              <img src={item.image} alt={item.title} className="market-img" />
              <span className="market-category-badge">
                <Tag size={11} /> {item.category}
              </span>
            </div>
            <div className="market-card-body">
              <h3 className="market-title">{item.title}</h3>
              <div className="market-price">{item.price}</div>
              <div className="market-meta">
                <span><MapPin size={13} /> {item.location}</span>
                <span>البائع: {item.seller}</span>
              </div>
              <div className="market-actions">
                <button className="btn-primary">💬 تواصل مع البائع</button>
                <button className="btn-ghost">🔖 حفظ</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <span>🔍</span>
          <p>لا توجد نتائج مطابقة</p>
        </div>
      )}
    </div>
  );
}
