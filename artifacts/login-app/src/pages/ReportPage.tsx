import { useState } from "react";
import { Flag, ChevronLeft, Check, AlertTriangle, Shield, Clock, X } from "lucide-react";

const REPORT_TYPES = [
  { id: "impersonation",  label: "انتحال هوية",        icon: "🎭", desc: "الحساب ينتحل هوية شخص أو جهة موثقة" },
  { id: "spam",           label: "بريد مزعج / احتيال", icon: "🚫", desc: "رسائل مزعجة أو محتوى احتيالي" },
  { id: "harmful",        label: "محتوى ضار",           icon: "⚠️", desc: "محتوى عنيف أو مسيء أو بذيء" },
  { id: "fake",           label: "حساب مزيف",           icon: "🤖", desc: "حساب وهمي أو مزيف" },
  { id: "harassment",     label: "تحرش / تنمر",         icon: "😡", desc: "تحرش أو تنمر أو تهديد" },
  { id: "ip",             label: "انتهاك حقوق الملكية", icon: "©️", desc: "سرقة محتوى محمي بحقوق الملكية" },
  { id: "terrorism",      label: "محتوى إرهابي",        icon: "🚨", desc: "ترويج للإرهاب أو التطرف" },
  { id: "other",          label: "أخرى",                icon: "📝", desc: "سبب آخر لم يُذكر" },
];

const MY_REPORTS = [
  { id: "r1", type: "انتحال هوية",   target: "@ahmed_fake",   status: "pending",  date: "2026-06-28" },
  { id: "r2", type: "محتوى ضار",     target: "منشور #4521",   status: "resolved", date: "2026-06-20" },
  { id: "r3", type: "بريد مزعج",    target: "@spammer99",    status: "rejected", date: "2026-06-15" },
];

const STATUS_CFG = {
  pending:  { label: "قيد المراجعة",  color: "#f59e0b", bg: "#fef3c7", icon: <Clock size={13} /> },
  resolved: { label: "تم المعالجة",   color: "#22c55e", bg: "#dcfce7", icon: <Check size={13} /> },
  rejected: { label: "مرفوض",         color: "#ef4444", bg: "#fee2e2", icon: <X    size={13} /> },
};

export default function ReportPage() {
  const [tab, setTab] = useState<"new" | "mine">("new");
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [targetInput, setTargetInput] = useState("");
  const [details, setDetails] = useState("");
  const [evidence, setEvidence] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => { setSubmitted(true); };

  const reset = () => { setStep(1); setSelectedType(""); setTargetInput(""); setDetails(""); setEvidence(false); setSubmitted(false); };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🚨 نظام الإبلاغ</h1>
      </div>

      <div className="tab-bar" style={{ marginBottom: 20 }}>
        <button className={tab === "new" ? "active" : ""} onClick={() => setTab("new")}><Flag size={15} /> إبلاغ جديد</button>
        <button className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}><Shield size={15} /> بلاغاتي</button>
      </div>

      {tab === "new" && (
        <div className="report-wrap">
          {submitted ? (
            <div className="report-success">
              <div className="report-success-icon">✅</div>
              <h2>تم إرسال بلاغك</h2>
              <p>سيتم مراجعة بلاغك خلال 24–72 ساعة. شكراً لمساهمتك في جعل Atlas Social بيئة آمنة.</p>
              <div className="report-ref">رقم البلاغ: <strong>#RPT-{Math.floor(Math.random()*90000)+10000}</strong></div>
              <button className="btn-primary" onClick={reset}>إبلاغ آخر</button>
            </div>
          ) : (
            <>
              {/* Step bar */}
              <div className="report-steps">
                {["نوع الإبلاغ", "التفاصيل", "الإرسال"].map((s, i) => (
                  <div key={i} className={`report-step ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
                    <div className="report-step-dot">{step > i + 1 ? <Check size={12} /> : i + 1}</div>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {/* Step 1: Type */}
              {step === 1 && (
                <div className="report-card">
                  <h3>ما سبب إبلاغك؟</h3>
                  <div className="report-types-grid">
                    {REPORT_TYPES.map(t => (
                      <div key={t.id}
                        className={`report-type-card ${selectedType === t.id ? "selected" : ""}`}
                        onClick={() => setSelectedType(t.id)}>
                        <span className="report-type-icon">{t.icon}</span>
                        <span className="report-type-label">{t.label}</span>
                        <span className="report-type-desc">{t.desc}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ marginTop: 16 }} disabled={!selectedType}
                    onClick={() => setStep(2)}>
                    التالي <ChevronLeft size={16} />
                  </button>
                </div>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <div className="report-card">
                  <h3>تفاصيل البلاغ</h3>
                  <div className="report-field">
                    <label>الحساب أو المنشور المُبلَّغ عنه *</label>
                    <input type="text" placeholder="مثال: @username أو رابط المنشور"
                      value={targetInput} onChange={e => setTargetInput(e.target.value)} />
                  </div>
                  <div className="report-field">
                    <label>تفاصيل إضافية</label>
                    <textarea rows={4} placeholder="اشرح باختصار ما حدث..."
                      value={details} onChange={e => setDetails(e.target.value)} />
                  </div>
                  <div className="report-field">
                    <label className="report-check-label">
                      <input type="checkbox" checked={evidence} onChange={e => setEvidence(e.target.checked)} />
                      <span>لدي أدلة (صور / لقطات شاشة) يمكنني إضافتها لاحقاً</span>
                    </label>
                  </div>
                  <div className="report-privacy-note">
                    <AlertTriangle size={14} />
                    تحذير: الإبلاغ الكاذب أو المتكرر قد يؤدي لتقييد حسابك.
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-ghost" onClick={() => setStep(1)}>رجوع</button>
                    <button className="btn-primary" disabled={!targetInput.trim()} onClick={() => setStep(3)}>
                      التالي <ChevronLeft size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Review & submit */}
              {step === 3 && (
                <div className="report-card">
                  <h3>مراجعة وإرسال البلاغ</h3>
                  <div className="report-review">
                    <div className="review-row">
                      <span>نوع البلاغ</span>
                      <strong>{REPORT_TYPES.find(t => t.id === selectedType)?.label}</strong>
                    </div>
                    <div className="review-row">
                      <span>المُبلَّغ عنه</span>
                      <strong>{targetInput}</strong>
                    </div>
                    {details && (
                      <div className="review-row">
                        <span>التفاصيل</span>
                        <strong>{details}</strong>
                      </div>
                    )}
                  </div>
                  <div className="report-terms">
                    <Shield size={15} />
                    <span>بإرسال هذا البلاغ أؤكد أن المعلومات صحيحة وأن بلاغي مقدم بحسن نية.</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <button className="btn-ghost" onClick={() => setStep(2)}>رجوع</button>
                    <button className="btn-danger" onClick={handleSubmit}><Flag size={16} /> إرسال البلاغ</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "mine" && (
        <div className="my-reports-list">
          {MY_REPORTS.length === 0 ? (
            <div className="empty-state"><span>📋</span><p>لا توجد بلاغات سابقة</p></div>
          ) : (
            MY_REPORTS.map(r => {
              const cfg = STATUS_CFG[r.status as keyof typeof STATUS_CFG];
              return (
                <div key={r.id} className="my-report-item">
                  <div className="my-report-icon"><Flag size={18} /></div>
                  <div className="my-report-info">
                    <div className="my-report-type">{r.type}</div>
                    <div className="my-report-target">{r.target}</div>
                    <div className="my-report-date">{r.date}</div>
                  </div>
                  <div className="my-report-status" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.icon} {cfg.label}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
