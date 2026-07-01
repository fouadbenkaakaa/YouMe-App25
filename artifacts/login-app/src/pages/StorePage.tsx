import { useState } from "react";
import { Store, Star, Package, Users, Eye, Plus, MapPin, Clock, CreditCard, Truck, Edit3 } from "lucide-react";
import { useApp } from "../context/AppContext";

const STORE_PRODUCTS = [
  { id: "p1", name: "منتج طازج من المزرعة", price: "45 ريال", stock: 23, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80" },
  { id: "p2", name: "تمر المدينة الفاخر", price: "120 ريال", stock: 50, img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=300&q=80" },
  { id: "p3", name: "عسل طبيعي أصيل", price: "85 ريال", stock: 12, img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300&q=80" },
];

const OTHER_STORES = [
  { id: "s1", name: "متجر الطازج", owner: "محمد العمري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", rating: 4.8, followers: 234, products: 18, category: "طعام وشراب" },
  { id: "s2", name: "إلكترونيات الخليج", owner: "خالد الزهراني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf", rating: 4.6, followers: 520, products: 45, category: "إلكترونيات" },
  { id: "s3", name: "مزرعة الخير", owner: "يوسف البلوي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousuf&backgroundColor=c0aede", rating: 4.9, followers: 189, products: 12, category: "زراعة ومواشي" },
];

export default function StorePage() {
  const { user } = useApp();
  const [tab, setTab] = useState<"my" | "browse">("my");
  const [hasStore, setHasStore] = useState(false);
  const [creating, setCreating] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: "", description: "", category: "", location: "", hours: "", payment: "", shipping: ""
  });

  const set = (k: string, v: string) => setStoreForm(f => ({ ...f, [k]: v }));

  const createStore = () => {
    setHasStore(true);
    setCreating(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 1000 }}>
      <div className="page-header">
        <h1 className="page-title">🏪 المتاجر الشخصية</h1>
      </div>

      <div className="tab-bar">
        <button className={tab === "my" ? "active" : ""} onClick={() => setTab("my")}>
          <Store size={16} /> متجري
        </button>
        <button className={tab === "browse" ? "active" : ""} onClick={() => setTab("browse")}>
          <Package size={16} /> استعراض المتاجر
        </button>
      </div>

      {tab === "my" && (
        <>
          {!hasStore && !creating ? (
            <div className="store-create-prompt">
              <div className="store-prompt-icon">🏪</div>
              <h2>أنشئ متجرك الخاص</h2>
              <p>افتح متجرك وابدأ البيع لملايين المستخدمين حول العالم</p>
              <div className="store-features">
                {["🛒 بيع منتجاتك", "📊 إحصائيات مفصلة", "💳 دفع آمن", "🚚 إدارة الشحن"].map(f => (
                  <span key={f} className="store-feature-tag">{f}</span>
                ))}
              </div>
              <button className="btn-primary" style={{ padding: "14px 32px", fontSize: "16px" }}
                onClick={() => setCreating(true)}>
                <Plus size={18} /> إنشاء متجر مجاني
              </button>
            </div>
          ) : creating ? (
            <div className="store-create-form">
              <h2 className="settings-title">⚙️ إعداد متجرك</h2>
              <div className="store-form-grid">
                <div className="store-field">
                  <label>اسم المتجر *</label>
                  <input type="text" placeholder="مثال: متجر الطازج" value={storeForm.name} onChange={e => set("name", e.target.value)} />
                </div>
                <div className="store-field">
                  <label>التصنيف *</label>
                  <select value={storeForm.category} onChange={e => set("category", e.target.value)}>
                    <option value="">اختر تصنيفاً</option>
                    {["طعام وشراب", "إلكترونيات", "ملابس", "زراعة ومواشي", "خدمات", "كتب", "أخرى"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="store-field full">
                  <label>وصف المتجر</label>
                  <textarea placeholder="اكتب وصفاً قصيراً لمتجرك..." rows={3} value={storeForm.description} onChange={e => set("description", e.target.value)} />
                </div>
                <div className="store-field">
                  <label><MapPin size={14} /> الموقع</label>
                  <input type="text" placeholder="المدينة، الدولة" value={storeForm.location} onChange={e => set("location", e.target.value)} />
                </div>
                <div className="store-field">
                  <label><Clock size={14} /> ساعات العمل</label>
                  <input type="text" placeholder="9 صباحاً - 9 مساءً" value={storeForm.hours} onChange={e => set("hours", e.target.value)} />
                </div>
                <div className="store-field">
                  <label><CreditCard size={14} /> وسائل الدفع</label>
                  <input type="text" placeholder="تحويل، مدى، فيزا..." value={storeForm.payment} onChange={e => set("payment", e.target.value)} />
                </div>
                <div className="store-field">
                  <label><Truck size={14} /> خدمات الشحن</label>
                  <input type="text" placeholder="توصيل، استلام..." value={storeForm.shipping} onChange={e => set("shipping", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button className="btn-primary" onClick={createStore}><Store size={16} /> إنشاء المتجر</button>
                <button className="btn-ghost" onClick={() => setCreating(false)}>إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="my-store">
              <div className="store-header-card">
                <div className="store-cover" style={{ background: "linear-gradient(135deg,#4c1d95,#7c3aed)" }}>
                  <div className="store-logo-wrap">
                    <img src={user?.avatar} alt="" className="store-logo" />
                  </div>
                </div>
                <div className="store-info">
                  <div>
                    <h2 className="store-name">متجر {user?.name?.split(" ")[0]}</h2>
                    <div className="store-meta-row">
                      <span><MapPin size={13} /> {user?.location}</span>
                      <span><Clock size={13} /> 9ص - 9م</span>
                      <span><Star size={13} /> 4.9 (32 تقييم)</span>
                    </div>
                  </div>
                  <button className="btn-ghost"><Edit3 size={15} /> تعديل المتجر</button>
                </div>
              </div>

              <div className="store-stats-row">
                <div className="store-stat-card">
                  <Eye size={20} />
                  <span className="stat-val">1,240</span>
                  <span className="stat-lbl">زائر</span>
                </div>
                <div className="store-stat-card">
                  <Package size={20} />
                  <span className="stat-val">12</span>
                  <span className="stat-lbl">طلب</span>
                </div>
                <div className="store-stat-card">
                  <Users size={20} />
                  <span className="stat-val">87</span>
                  <span className="stat-lbl">متابع</span>
                </div>
                <div className="store-stat-card">
                  <Star size={20} />
                  <span className="stat-val">4.9</span>
                  <span className="stat-lbl">تقييم</span>
                </div>
              </div>

              <div className="store-products-header">
                <h3>منتجاتي</h3>
                <button className="btn-primary" style={{ fontSize: "13px" }}><Plus size={14} /> إضافة منتج</button>
              </div>

              <div className="store-products-grid">
                {STORE_PRODUCTS.map(p => (
                  <div key={p.id} className="store-product-card">
                    <img src={p.img} alt={p.name} className="store-product-img" />
                    <div className="store-product-body">
                      <div className="store-product-name">{p.name}</div>
                      <div className="store-product-price">{p.price}</div>
                      <div className="store-product-stock">المخزون: {p.stock}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn-ghost" style={{ fontSize: "12px", flex: 1 }}><Edit3 size={12} /></button>
                        <button className="btn-primary" style={{ fontSize: "12px", flex: 1 }}>عرض</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "browse" && (
        <div className="stores-browse-grid">
          {OTHER_STORES.map(store => (
            <div key={store.id} className="browse-store-card">
              <div className="browse-store-cover" style={{ background: `linear-gradient(135deg, #4c1d95, #7c3aed)` }}>
                <img src={store.avatar} alt={store.owner} className="browse-store-logo" />
              </div>
              <div className="browse-store-body">
                <h3 className="browse-store-name">{store.name}</h3>
                <p className="browse-store-owner">بواسطة {store.owner}</p>
                <span className="store-cat-badge">{store.category}</span>
                <div className="browse-store-stats">
                  <span><Star size={13} style={{ color: "#f59e0b" }} /> {store.rating}</span>
                  <span><Users size={13} /> {store.followers} متابع</span>
                  <span><Package size={13} /> {store.products} منتج</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-primary" style={{ flex: 1, fontSize: "13px" }}>زيارة المتجر</button>
                  <button className="btn-ghost" style={{ fontSize: "13px" }}>متابعة</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
