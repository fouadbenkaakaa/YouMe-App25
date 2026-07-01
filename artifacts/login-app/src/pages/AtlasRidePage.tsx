import { useState } from "react";
import { MapPin, Navigation, Clock, Star, Shield, Phone, Car, Share2, AlertTriangle, Check } from "lucide-react";

const CAR_TYPES = [
  { id: "economy",  label: "اقتصادي",  icon: "🚗",  base: 8,  desc: "سيارة عادية مريحة" },
  { id: "comfort",  label: "مريح",     icon: "🚙",  base: 15, desc: "سيارة أكبر وأكثر راحة" },
  { id: "premium",  label: "فاخر",     icon: "🚘",  base: 30, desc: "سيارة فاخرة مع سائق محترف" },
  { id: "family",   label: "عائلي",    icon: "🚐",  base: 20, desc: "مركبة كبيرة للعائلة" },
];

const SAVED_PLACES = [
  { id: "h", label: "المنزل",  icon: "🏠", addr: "حي النزهة، الرياض" },
  { id: "w", label: "العمل",   icon: "🏢", addr: "حي العليا، الرياض" },
];

const MOCK_DRIVER = {
  name: "محمد العصيمي",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=driver&backgroundColor=b6e3f4",
  car: "تويوتا كامري أبيض",
  plate: "أ ب ج 1234",
  rating: 4.9,
  trips: 847,
  eta: 4,
};

export default function AtlasRidePage() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [carType, setCarType] = useState("economy");
  const [rideState, setRideState] = useState<"idle" | "searching" | "matched" | "picked" | "done">("idle");
  const [tab, setTab] = useState<"ride" | "register">("ride");
  const [driverForm, setDriverForm] = useState({
    name: "", phone: "", idUploaded: false, licUploaded: false,
    insUploaded: false, carModel: "", carYear: "", carColor: "",
  });
  const [df, setDf] = useState((k: string, v: any) => {});

  const setDF = (k: string, v: any) => setDriverForm(f => ({ ...f, [k]: v }));

  const selectedCar = CAR_TYPES.find(c => c.id === carType)!;
  const estimatedPrice = (() => {
    const dist = pickup && destination ? Math.floor(Math.random() * 15 + 5) : 0;
    return Math.floor(dist * selectedCar.base / 5);
  })();

  const requestRide = () => {
    if (!pickup || !destination) return;
    setRideState("searching");
    setTimeout(() => setRideState("matched"), 2500);
    setTimeout(() => setRideState("picked"), 6000);
  };

  const endRide = () => setRideState("done");

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">🚕 ATLAS RIDE</h1>
          <div className="atlas-sub">خدمة النقل الذكي</div>
        </div>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button className={tab === "ride"     ? "active" : ""} onClick={() => setTab("ride")}><Car size={15} /> طلب رحلة</button>
        <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}><Shield size={15} /> تسجيل كسائق</button>
      </div>

      {tab === "ride" && (
        <>
          {rideState === "idle" && (
            <>
              {/* Saved places */}
              <div className="saved-places">
                {SAVED_PLACES.map(p => (
                  <button key={p.id} className="saved-place-btn" onClick={() => setDestination(p.addr)}>
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>

              {/* Location inputs */}
              <div className="ride-inputs">
                <div className="ride-input-wrap">
                  <div className="ride-dot pickup-dot" />
                  <input type="text" placeholder="نقطة الانطلاق" value={pickup}
                    onChange={e => setPickup(e.target.value)} />
                  <button className="ride-locate-btn" onClick={() => setPickup("موقعي الحالي 📍")}>
                    <Navigation size={16} />
                  </button>
                </div>
                <div className="ride-input-sep" />
                <div className="ride-input-wrap">
                  <div className="ride-dot dest-dot" />
                  <input type="text" placeholder="الوجهة" value={destination}
                    onChange={e => setDestination(e.target.value)} />
                </div>
              </div>

              {/* Car type */}
              <div className="car-types-list">
                {CAR_TYPES.map(c => (
                  <div key={c.id}
                    className={`car-type-card ${carType === c.id ? "selected" : ""}`}
                    onClick={() => setCarType(c.id)}>
                    <span className="car-type-icon">{c.icon}</span>
                    <div className="car-type-info">
                      <div className="car-type-name">{c.label}</div>
                      <div className="car-type-desc">{c.desc}</div>
                    </div>
                    <div className="car-type-price">
                      {pickup && destination ? `~${Math.floor(c.base * 3)} ريال` : `${c.base}+ ريال`}
                    </div>
                    <div className={`car-type-radio ${carType === c.id ? "selected" : ""}`} />
                  </div>
                ))}
              </div>

              {/* Price estimate */}
              {pickup && destination && (
                <div className="price-estimate">
                  <Clock size={14} /> وقت الوصول المتوقع: <strong>~{MOCK_DRIVER.eta + 2} دقيقة</strong>
                  <span style={{ margin: "0 12px" }}>|</span>
                  <Navigation size={14} /> السعر المتوقع: <strong>~{estimatedPrice || 25} ريال</strong>
                </div>
              )}

              <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16 }}
                disabled={!pickup || !destination}
                onClick={requestRide}>
                <Car size={18} /> طلب رحلة الآن
              </button>
            </>
          )}

          {rideState === "searching" && (
            <div className="ride-searching">
              <div className="ride-spinner" />
              <h3>جارٍ البحث عن سائق قريب...</h3>
              <p>يُرجى الانتظار قليلاً</p>
              <button className="btn-ghost" onClick={() => setRideState("idle")}>إلغاء</button>
            </div>
          )}

          {(rideState === "matched" || rideState === "picked") && (
            <div className="ride-matched">
              <div className={`ride-status-banner ${rideState === "picked" ? "picked" : "matched"}`}>
                {rideState === "matched" ? "🚗 السائق في الطريق إليك" : "✅ أنت في السيارة — رحلة ممتعة!"}
              </div>

              <div className="driver-card">
                <img src={MOCK_DRIVER.avatar} alt={MOCK_DRIVER.name} className="driver-avatar" />
                <div className="driver-info">
                  <div className="driver-name">{MOCK_DRIVER.name}</div>
                  <div className="driver-rating"><Star size={13} style={{ color: "#f59e0b" }} /> {MOCK_DRIVER.rating} · {MOCK_DRIVER.trips} رحلة</div>
                  <div className="driver-car">{MOCK_DRIVER.car} · {MOCK_DRIVER.plate}</div>
                </div>
                <div className="driver-actions">
                  <button className="driver-action-btn"><Phone size={18} /></button>
                  <button className="driver-action-btn"><Share2 size={18} /></button>
                </div>
              </div>

              <div className="ride-route-display">
                <div className="route-point pickup"><div className="dot" /> {pickup}</div>
                <div className="route-line" />
                <div className="route-point dest"><div className="dot" /> {destination}</div>
              </div>

              <div className="ride-safety">
                <AlertTriangle size={14} />
                <span>زر الطوارئ متاح دائماً للاتصال بالدعم الفوري</span>
                <button className="sos-btn">🆘 SOS</button>
              </div>

              {rideState === "picked" && (
                <button className="btn-danger" style={{ width: "100%" }} onClick={endRide}>
                  إنهاء الرحلة وتقييم السائق
                </button>
              )}
            </div>
          )}

          {rideState === "done" && (
            <div className="ride-done">
              <div style={{ fontSize: 64 }}>🎉</div>
              <h2>وصلت بسلامة!</h2>
              <p>قيّم سائقك لمساعدة المستخدمين الآخرين</p>
              <div className="rating-stars">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className="rating-star">⭐</button>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setRideState("idle")}>إنهاء وعودة للرئيسية</button>
            </div>
          )}
        </>
      )}

      {tab === "register" && (
        <div className="register-driver-form">
          <h2 className="settings-title">🚕 تسجيل كسائق ATLAS RIDE</h2>
          <div className="store-form-grid">
            <div className="store-field">
              <label>الاسم الكامل *</label>
              <input type="text" placeholder="اسمك كما في الهوية" value={driverForm.name} onChange={e => setDF("name", e.target.value)} />
            </div>
            <div className="store-field">
              <label>رقم الهاتف *</label>
              <input type="text" placeholder="05xxxxxxxx" value={driverForm.phone} onChange={e => setDF("phone", e.target.value)} />
            </div>
            <div className="store-field">
              <label>موديل السيارة</label>
              <input type="text" placeholder="مثال: تويوتا كامري" value={driverForm.carModel} onChange={e => setDF("carModel", e.target.value)} />
            </div>
            <div className="store-field">
              <label>سنة الصنع</label>
              <input type="text" placeholder="2020" value={driverForm.carYear} onChange={e => setDF("carYear", e.target.value)} />
            </div>
            <div className="store-field">
              <label>لون السيارة</label>
              <input type="text" placeholder="أبيض" value={driverForm.carColor} onChange={e => setDF("carColor", e.target.value)} />
            </div>
          </div>

          <div className="docs-upload-list" style={{ marginTop: 16 }}>
            {[
              { key: "idUploaded",  label: "🪪 بطاقة الهوية الوطنية" },
              { key: "licUploaded", label: "🚗 رخصة السياقة" },
              { key: "insUploaded", label: "📋 بطاقة التأمين" },
            ].map(doc => (
              <div key={doc.key} className={`doc-upload-item ${driverForm[doc.key as keyof typeof driverForm] ? "uploaded" : ""}`}>
                <div className="doc-upload-left">{doc.label}</div>
                {driverForm[doc.key as keyof typeof driverForm]
                  ? <div className="doc-uploaded-badge"><Check size={14} /> تم الرفع</div>
                  : <button className="doc-upload-btn" onClick={() => setDF(doc.key, true)}>📤 رفع</button>}
              </div>
            ))}
          </div>

          <div className="trusted-badge-info">
            <span>🚕</span>
            <div>
              <strong>شارة "السائق الموثوق"</strong>
              <p>تُمنح بعد 500 رحلة ناجحة + تقييم 4.9/5 + التحقق الرسمي</p>
            </div>
          </div>

          <div className="commission-note" style={{ marginTop: 12 }}>
            <Shield size={14} />
            <span>Atlas Social تحصل على نسبة محددة فقط — الباقي يُحوَّل إليك مباشرة عبر بريدي موب</span>
          </div>

          <button className="btn-primary" style={{ marginTop: 16, width: "100%" }}>
            <Car size={16} /> إرسال طلب التسجيل كسائق
          </button>
        </div>
      )}
    </div>
  );
}
