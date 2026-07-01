import { useState } from "react";
import { Package, Truck, Star, TrendingUp, Clock, CheckCircle, MapPin, Plus, Shield } from "lucide-react";

const VEHICLE_TYPES = ["سيارة", "دراجة نارية", "شاحنة صغيرة", "دراجة هوائية"];

const ACTIVE_ORDERS = [
  { id: "D001", from: "متجر الطازج",      to: "حي النزهة",      status: "pickup",   time: "8 دقائق",  earnings: 18 },
  { id: "D002", from: "مطبخ أم الخير",    to: "حي الروضة",      status: "delivery",  time: "14 دقيقة", earnings: 24 },
  { id: "D003", from: "بقالة الحارة",     to: "حي السلام",      status: "new",      time: "—",        earnings: 12 },
];

const TRIP_HISTORY = [
  { date: "2026-07-01", orders: 8, earnings: 162, rating: 4.9 },
  { date: "2026-06-30", orders: 6, earnings: 118, rating: 4.8 },
  { date: "2026-06-29", orders: 11, earnings: 214, rating: 5.0 },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:      { label: "طلب جديد",         color: "#3b82f6" },
  pickup:   { label: "في الطريق للاستلام", color: "#f59e0b" },
  delivery: { label: "جارٍ التوصيل",     color: "#7c3aed" },
  done:     { label: "مكتمل",            color: "#22c55e" },
};

export default function AtlasDeliveryPage() {
  const [tab, setTab] = useState<"dashboard" | "register" | "history">("dashboard");
  const [isRegistered, setIsRegistered] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", vehicle: "", idUploaded: false, licUploaded: false });
  const [online, setOnline] = useState(false);

  const setF = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📦 ATLAS DELIVERY</h1>
          <div className="atlas-sub">خدمة التوصيل الذكي</div>
        </div>
        {isRegistered && (
          <button
            className={`online-toggle ${online ? "online" : "offline"}`}
            onClick={() => setOnline(!online)}>
            <span className={`online-dot ${online ? "on" : "off"}`} />
            {online ? "متصل" : "غير متصل"}
          </button>
        )}
      </div>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button className={tab === "dashboard" ? "active" : ""} onClick={() => setTab("dashboard")}><TrendingUp size={15} /> لوحة القيادة</button>
        <button className={tab === "register"  ? "active" : ""} onClick={() => setTab("register")}><Truck size={15} /> تسجيل كعامل</button>
        <button className={tab === "history"   ? "active" : ""} onClick={() => setTab("history")}><Clock size={15} /> سجل الرحلات</button>
      </div>

      {tab === "dashboard" && (
        <>
          {!isRegistered ? (
            <div className="delivery-cta">
              <div style={{ fontSize: 64 }}>🚚</div>
              <h2>انضم إلى أسطول ATLAS DELIVERY</h2>
              <p>اعمل بحريتك واكسب حتى <strong>90%</strong> من قيمة كل توصيل</p>
              <div className="delivery-benefits">
                <span>🕐 ساعات عمل مرنة</span>
                <span>💰 دفع فوري عبر بريدي موب</span>
                <span>⭐ نظام تقييم شفاف</span>
                <span>🛡️ شارة "عامل موثوق"</span>
              </div>
              <button className="btn-primary btn-lg" onClick={() => setTab("register")}>سجّل الآن</button>
            </div>
          ) : (
            <>
              <div className="delivery-stats-row">
                <div className="delivery-stat">
                  <TrendingUp size={20} />
                  <span className="dstat-val">494 ريال</span>
                  <span className="dstat-lbl">أرباح هذا الشهر</span>
                </div>
                <div className="delivery-stat">
                  <Package size={20} />
                  <span className="dstat-val">25</span>
                  <span className="dstat-lbl">توصيل اليوم</span>
                </div>
                <div className="delivery-stat">
                  <Star size={20} />
                  <span className="dstat-val">4.9</span>
                  <span className="dstat-lbl">تقييمك</span>
                </div>
                <div className="delivery-stat">
                  <CheckCircle size={20} />
                  <span className="dstat-val">1,043</span>
                  <span className="dstat-lbl">توصيلات ناجحة</span>
                </div>
              </div>

              <div className="section-title" style={{ marginTop: 20 }}>الطلبات النشطة</div>
              <div className="orders-list">
                {ACTIVE_ORDERS.map(o => {
                  const st = STATUS_LABELS[o.status];
                  return (
                    <div key={o.id} className="order-item">
                      <div className="order-id">#{o.id}</div>
                      <div className="order-route">
                        <span><MapPin size={12} /> {o.from}</span>
                        <span className="order-arrow">→</span>
                        <span><MapPin size={12} /> {o.to}</span>
                      </div>
                      <div className="order-time"><Clock size={12} /> {o.time}</div>
                      <div className="order-status" style={{ color: st.color }}>{st.label}</div>
                      <div className="order-earnings">+{o.earnings} ريال</div>
                      {o.status === "new" && (
                        <button className="btn-primary" style={{ fontSize: 12 }} onClick={() => {}}>قبول</button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="commission-note">
                <Shield size={14} />
                <span>Atlas Social تحصل على <strong>10%</strong> فقط من كل توصيل — 90% لك مباشرة</span>
              </div>
            </>
          )}
        </>
      )}

      {tab === "register" && (
        <div className="register-driver-form">
          <h2 className="settings-title">📝 تسجيل كعامل توصيل</h2>
          <div className="store-form-grid">
            <div className="store-field">
              <label>الاسم الكامل *</label>
              <input type="text" placeholder="اسمك كما في الهوية" value={form.name} onChange={e => setF("name", e.target.value)} />
            </div>
            <div className="store-field">
              <label>رقم الهاتف *</label>
              <input type="text" placeholder="05xxxxxxxx" value={form.phone} onChange={e => setF("phone", e.target.value)} />
            </div>
            <div className="store-field">
              <label>وسيلة النقل *</label>
              <select value={form.vehicle} onChange={e => setF("vehicle", e.target.value)}>
                <option value="">اختر وسيلة نقلك</option>
                {VEHICLE_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <div className="docs-upload-list" style={{ marginTop: 16 }}>
            <div className={`doc-upload-item ${form.idUploaded ? "uploaded" : ""}`}>
              <div className="doc-upload-left">🪪 بطاقة الهوية الوطنية</div>
              {form.idUploaded
                ? <div className="doc-uploaded-badge"><CheckCircle size={14} /> تم الرفع</div>
                : <button className="doc-upload-btn" onClick={() => setF("idUploaded", true)}>📤 رفع</button>}
            </div>
            <div className={`doc-upload-item ${form.licUploaded ? "uploaded" : ""}`}>
              <div className="doc-upload-left">📄 الوثائق القانونية المحلية</div>
              {form.licUploaded
                ? <div className="doc-uploaded-badge"><CheckCircle size={14} /> تم الرفع</div>
                : <button className="doc-upload-btn" onClick={() => setF("licUploaded", true)}>📤 رفع</button>}
            </div>
          </div>

          <div className="trusted-badge-info">
            <span>📦</span>
            <div>
              <strong>شارة "عامل التوصيل الموثوق"</strong>
              <p>تُمنح بعد 1000 توصيل ناجح + تقييم مرتفع + التحقق الرسمي</p>
            </div>
          </div>

          <button className="btn-primary" style={{ marginTop: 16 }}
            disabled={!form.name || !form.phone || !form.vehicle || !form.idUploaded || !form.licUploaded}
            onClick={() => { setIsRegistered(true); setTab("dashboard"); }}>
            <Truck size={16} /> إرسال طلب التسجيل
          </button>
        </div>
      )}

      {tab === "history" && (
        <div>
          <div className="section-title">سجل الرحلات</div>
          {TRIP_HISTORY.map((t, i) => (
            <div key={i} className="trip-history-item">
              <div className="trip-date">{t.date}</div>
              <div className="trip-orders"><Package size={14} /> {t.orders} طلبات</div>
              <div className="trip-earnings" style={{ color: "#22c55e", fontWeight: 700 }}>+{t.earnings} ريال</div>
              <div className="trip-rating"><Star size={13} style={{ color: "#f59e0b" }} /> {t.rating}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
