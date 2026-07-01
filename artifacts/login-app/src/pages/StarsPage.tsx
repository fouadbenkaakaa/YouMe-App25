import { useState } from "react";
import { Star, Gift, Heart, Zap, Send } from "lucide-react";

const PACKAGES = [
  { id: "p1", stars: 100,  price: 5,   bonus: 0,   popular: false },
  { id: "p2", stars: 500,  price: 22,  bonus: 50,  popular: false },
  { id: "p3", stars: 1000, price: 40,  bonus: 150, popular: true  },
  { id: "p4", stars: 5000, price: 180, bonus: 1000,popular: false },
];

const GIFTS = [
  { id: "g1", emoji: "🌹",  name: "وردة",        cost: 5  },
  { id: "g2", emoji: "❤️",  name: "قلب",         cost: 10 },
  { id: "g3", emoji: "🎁",  name: "هدية",         cost: 25 },
  { id: "g4", emoji: "💎",  name: "ماسة",         cost: 50 },
  { id: "g5", emoji: "🚀",  name: "صاروخ",        cost: 100 },
  { id: "g6", emoji: "👑",  name: "تاج ملكي",     cost: 250 },
  { id: "g7", emoji: "🎊",  name: "حفلة",         cost: 500 },
  { id: "g8", emoji: "🏆",  name: "كأس ذهبي",    cost: 1000 },
];

const CREATORS = [
  { id: "c1", name: "أحمد المزارع",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed&backgroundColor=b6e3f4",  stars: 12400 },
  { id: "c2", name: "نورة الطبخ",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",   stars: 8900  },
  { id: "c3", name: "خالد التقنية", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",  stars: 31200 },
];

const HISTORY = [
  { from: "سارة المنصور", gift: "💎 ماسة",    stars: 50,  time: "منذ 2 ساعة" },
  { from: "محمد العمري",  gift: "👑 تاج ملكي", stars: 250, time: "منذ أمس" },
  { from: "فاطمة الزهراني", gift: "🚀 صاروخ",  stars: 100, time: "منذ يومين" },
];

export default function StarsPage() {
  const [myStars, setMyStars] = useState(380);
  const [tab, setTab] = useState<"buy" | "send" | "received">("buy");
  const [buyModal, setBuyModal] = useState<any>(null);
  const [giftModal, setGiftModal] = useState<any>(null);
  const [giftSent, setGiftSent] = useState(false);

  const handleBuy = (pkg: any) => {
    setMyStars(s => s + pkg.stars + pkg.bonus);
    setBuyModal(null);
  };

  const handleSendGift = (gift: any) => {
    if (myStars >= gift.cost) {
      setMyStars(s => s - gift.cost);
      setGiftSent(true);
      setTimeout(() => { setGiftSent(false); setGiftModal(null); }, 2000);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <h1 className="page-title">⭐ النجوم والهدايا الرقمية</h1>
        <div className="my-stars-badge">
          <Star size={16} style={{ color: "#f59e0b" }} />
          <span>{myStars.toLocaleString("ar")}</span>
          <span>نجمة</span>
        </div>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button className={tab === "buy"      ? "active" : ""} onClick={() => setTab("buy")}><Star size={15} /> شراء نجوم</button>
        <button className={tab === "send"     ? "active" : ""} onClick={() => setTab("send")}><Gift size={15} /> إرسال هدايا</button>
        <button className={tab === "received" ? "active" : ""} onClick={() => setTab("received")}><Heart size={15} /> المستلمة</button>
      </div>

      {tab === "buy" && (
        <>
          <div className="stars-packages-grid">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className={`stars-package ${pkg.popular ? "stars-popular" : ""}`}>
                {pkg.popular && <div className="stars-popular-badge">الأكثر مبيعاً</div>}
                <div className="stars-package-icon">⭐</div>
                <div className="stars-package-amount">{pkg.stars.toLocaleString("ar")}</div>
                <div className="stars-package-label">نجمة</div>
                {pkg.bonus > 0 && <div className="stars-bonus">+ {pkg.bonus} نجمة مجاناً</div>}
                <div className="stars-package-price">{pkg.price} ريال</div>
                <button className="btn-primary" onClick={() => setBuyModal(pkg)}>شراء</button>
              </div>
            ))}
          </div>
          <div className="stars-info-note">
            <Zap size={14} />
            <span>الدفع عبر بريدي موب أو البطاقات البنكية. تُضاف النجوم فوراً بعد التأكيد.</span>
          </div>
        </>
      )}

      {tab === "send" && (
        <>
          <h3 className="section-title">اختر صانع المحتوى</h3>
          <div className="creators-list">
            {CREATORS.map(c => (
              <div key={c.id} className="creator-card">
                <img src={c.avatar} alt={c.name} className="creator-avatar" />
                <div className="creator-info">
                  <div className="creator-name">{c.name}</div>
                  <div className="creator-stars"><Star size={12} style={{ color: "#f59e0b" }} /> {c.stars.toLocaleString("ar")} نجمة مستلمة</div>
                </div>
                <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setGiftModal(c)}><Gift size={14} /> هدية</button>
              </div>
            ))}
          </div>

          <h3 className="section-title">اختر الهدية</h3>
          <div className="gifts-grid">
            {GIFTS.map(g => (
              <div key={g.id} className={`gift-card ${myStars < g.cost ? "disabled" : ""}`}
                onClick={() => myStars >= g.cost && setGiftModal({ ...CREATORS[0], gift: g })}>
                <span className="gift-emoji">{g.emoji}</span>
                <div className="gift-name">{g.name}</div>
                <div className="gift-cost"><Star size={11} style={{ color: "#f59e0b" }} /> {g.cost}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "received" && (
        <div className="received-list">
          {HISTORY.map((h, i) => (
            <div key={i} className="received-item">
              <div className="received-gift-big">{h.gift.split(" ")[0]}</div>
              <div className="received-info">
                <div className="received-from">{h.from} أرسل {h.gift}</div>
                <div className="received-time">{h.time}</div>
              </div>
              <div className="received-stars"><Star size={14} style={{ color: "#f59e0b" }} /> +{h.stars}</div>
            </div>
          ))}
        </div>
      )}

      {/* Buy modal */}
      {buyModal && (
        <div className="checkout-overlay" onClick={() => setBuyModal(null)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <h3>شراء {buyModal.stars} نجمة</h3>
            <div className="checkout-summary">
              <span>{buyModal.stars.toLocaleString("ar")} نجمة {buyModal.bonus > 0 ? `+ ${buyModal.bonus} مجاناً` : ""}</span>
              <strong>{buyModal.price} ريال</strong>
            </div>
            <div className="pay-method-simple">
              <span>📱</span>
              <div>
                <div style={{ fontWeight: 700 }}>بريدي موب</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>سيُرسَل رمز التأكيد لهاتفك</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-ghost" onClick={() => setBuyModal(null)}>إلغاء</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleBuy(buyModal)}>
                تأكيد الشراء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift modal */}
      {giftModal && !giftSent && (
        <div className="checkout-overlay" onClick={() => setGiftModal(null)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <h3>إرسال هدية</h3>
            <div className="gift-send-target">
              <img src={giftModal.avatar} alt={giftModal.name} style={{ width: 50, height: 50, borderRadius: "50%" }} />
              <span style={{ fontWeight: 700 }}>{giftModal.name}</span>
            </div>
            <div className="gifts-grid" style={{ marginTop: 12 }}>
              {GIFTS.map(g => (
                <div key={g.id} className={`gift-card ${myStars < g.cost ? "disabled" : ""}`}
                  onClick={() => myStars >= g.cost && handleSendGift(g)}>
                  <span className="gift-emoji">{g.emoji}</span>
                  <div className="gift-name">{g.name}</div>
                  <div className="gift-cost"><Star size={11} style={{ color: "#f59e0b" }} /> {g.cost}</div>
                </div>
              ))}
            </div>
            <div className="stars-balance-row">
              <Star size={14} style={{ color: "#f59e0b" }} />
              رصيدك: <strong>{myStars}</strong> نجمة
            </div>
          </div>
        </div>
      )}

      {giftSent && (
        <div className="gift-sent-anim">
          <div className="gift-sent-content">🎉 تم إرسال الهدية!</div>
        </div>
      )}
    </div>
  );
}
