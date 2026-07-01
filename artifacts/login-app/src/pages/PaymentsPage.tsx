import { useState } from "react";
import { Check, CreditCard, Star, Zap, Building2, Crown, ChevronDown, ChevronUp } from "lucide-react";

const PLANS = [
  {
    id: "free", name: "مجاني", nameEn: "Free",
    price: { monthly: 0, yearly: 0 },
    color: "#6b7280", icon: "🆓",
    features: ["منشورات غير محدودة", "رسائل خاصة", "متجر أساسي (5 منتجات)", "100 MB مساحة تخزين"],
    missing: ["أدوات إحصائية متقدمة", "أولوية في البحث", "إعلانات مدفوعة", "شارة خاصة"],
  },
  {
    id: "plus", name: "بلَس", nameEn: "Plus",
    price: { monthly: 29, yearly: 290 },
    color: "#3b82f6", icon: "⚡",
    badge: "الأكثر شعبية",
    features: ["كل مزايا المجاني", "1 GB مساحة تخزين", "أدوات إحصائية أساسية", "متجر موسع (50 منتج)", "شارة خاصة بلَس", "أولوية في البحث"],
    missing: ["إحصائيات متقدمة", "إعلانات مدفوعة", "متجر غير محدود"],
  },
  {
    id: "premium", name: "بريميوم", nameEn: "Premium",
    price: { monthly: 79, yearly: 790 },
    color: "#7c3aed", icon: "👑",
    badge: "موصى به",
    features: ["كل مزايا بلَس", "10 GB مساحة", "إحصائيات متقدمة كاملة", "متجر غير محدود", "إعلانات مدفوعة", "شارة بريميوم الذهبية", "دعم فني مخصص", "خاصية الأرباح الممتدة"],
    missing: [],
  },
  {
    id: "business", name: "الأعمال", nameEn: "Business",
    price: { monthly: 199, yearly: 1990 },
    color: "#f59e0b", icon: "🏢",
    features: ["كل مزايا بريميوم", "100 GB مساحة", "حسابات متعددة (5)", "لوحة تحكم للأعمال", "API للتكامل", "تقارير مخصصة", "دعم فني أولوية 24/7", "شارة الأعمال الرسمية"],
    missing: [],
  },
];

const PAYMENT_METHODS = [
  { id: "baridimob", name: "بريدي موب", logo: "📱", desc: "الوسيلة الأساسية — تحويل فوري" },
  { id: "card",      name: "بطاقة بنكية", logo: "💳", desc: "فيزا / ماستركارد / مدى" },
  { id: "wallet",    name: "محفظة إلكترونية", logo: "👛", desc: "قريباً — PayPal وغيرها" },
];

export default function PaymentsPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [current, setCurrent] = useState("free");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("baridimob");
  const [showHistory, setShowHistory] = useState(false);

  const HISTORY = [
    { date: "2026-06-01", desc: "اشتراك بلَس — شهري",      amount: "29 ريال",  status: "ناجح" },
    { date: "2026-05-01", desc: "اشتراك بلَس — شهري",      amount: "29 ريال",  status: "ناجح" },
    { date: "2026-04-15", desc: "شراء 500 نجمة",            amount: "12 ريال",  status: "ناجح" },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 1000 }}>
      <div className="page-header">
        <h1 className="page-title">💳 المدفوعات والاشتراكات</h1>
      </div>

      {/* Billing toggle */}
      <div className="billing-toggle">
        <button className={billing === "monthly" ? "active" : ""} onClick={() => setBilling("monthly")}>شهري</button>
        <button className={billing === "yearly" ? "active" : ""} onClick={() => setBilling("yearly")}>
          سنوي <span className="save-badge">وفّر 17%</span>
        </button>
      </div>

      {/* Plans grid */}
      <div className="plans-grid">
        {PLANS.map(plan => {
          const price = billing === "monthly" ? plan.price.monthly : plan.price.yearly;
          const isCurrent = current === plan.id;
          return (
            <div key={plan.id}
              className={`plan-card ${plan.id === "premium" ? "plan-featured" : ""} ${isCurrent ? "plan-current" : ""}`}
              style={{ "--plan-color": plan.color } as any}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              {isCurrent && <div className="plan-current-badge">اشتراكي الحالي</div>}

              <div className="plan-header">
                <span className="plan-icon">{plan.icon}</span>
                <div>
                  <div className="plan-name">{plan.name}</div>
                  <div className="plan-name-en">{plan.nameEn}</div>
                </div>
              </div>

              <div className="plan-price">
                {price === 0
                  ? <span className="plan-free-label">مجاناً</span>
                  : <><span className="plan-amount">{price}</span><span className="plan-currency"> ريال / {billing === "monthly" ? "شهر" : "سنة"}</span></>
                }
              </div>

              <ul className="plan-features">
                {plan.features.map(f => (
                  <li key={f} className="plan-feature"><Check size={14} /> {f}</li>
                ))}
                {plan.missing?.map(f => (
                  <li key={f} className="plan-feature missing"><span>✗</span> {f}</li>
                ))}
              </ul>

              <button
                className={`plan-btn ${isCurrent ? "plan-btn-current" : "btn-primary"}`}
                style={!isCurrent ? { background: plan.color } : {}}
                disabled={isCurrent}
                onClick={() => setSelectedPlan(plan.id)}>
                {isCurrent ? "اشتراكك الحالي" : plan.id === "free" ? "تخفيض للمجاني" : `اشترك الآن`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout modal */}
      {selectedPlan && selectedPlan !== "free" && (() => {
        const plan = PLANS.find(p => p.id === selectedPlan)!;
        const price = billing === "monthly" ? plan.price.monthly : plan.price.yearly;
        return (
          <div className="checkout-overlay" onClick={() => setSelectedPlan(null)}>
            <div className="checkout-modal" onClick={e => e.stopPropagation()}>
              <h3>إتمام الاشتراك في {plan.name}</h3>
              <div className="checkout-summary">
                <span>{plan.name} — {billing === "monthly" ? "شهري" : "سنوي"}</span>
                <strong>{price} ريال</strong>
              </div>
              <div className="checkout-methods">
                <label className="checkout-methods-label">طريقة الدفع</label>
                {PAYMENT_METHODS.map(m => (
                  <div key={m.id}
                    className={`payment-method-row ${payMethod === m.id ? "selected" : ""} ${m.id === "wallet" ? "disabled" : ""}`}
                    onClick={() => m.id !== "wallet" && setPayMethod(m.id)}>
                    <span className="pay-logo">{m.logo}</span>
                    <div>
                      <div className="pay-name">{m.name}</div>
                      <div className="pay-desc">{m.desc}</div>
                    </div>
                    <div className={`pay-radio ${payMethod === m.id ? "selected" : ""}`} />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={() => setSelectedPlan(null)}>إلغاء</button>
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedPlan(null); setCurrent(plan.id); }}>
                  ادفع {price} ريال
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Payment history */}
      <div className="billing-history-card">
        <button className="billing-history-toggle" onClick={() => setShowHistory(!showHistory)}>
          <span><CreditCard size={16} /> سجل المدفوعات</span>
          {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showHistory && (
          <div className="billing-history-list">
            {HISTORY.map((h, i) => (
              <div key={i} className="billing-history-row">
                <div className="billing-history-info">
                  <div className="billing-history-desc">{h.desc}</div>
                  <div className="billing-history-date">{h.date}</div>
                </div>
                <div style={{ display: "flex", align: "center", gap: 12, alignItems: "center" }}>
                  <span className="billing-history-amount">{h.amount}</span>
                  <span className="billing-history-status">{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
