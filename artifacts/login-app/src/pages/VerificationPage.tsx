import { useState } from "react";
import { ShieldCheck, Upload, Check, Clock, X, AlertCircle, ChevronLeft, ChevronRight, FileText, Phone, Mail, Lock, Star, Search, MapPin, ShoppingBag, BarChart2 } from "lucide-react";
import VerificationBadge, { BadgeType, BADGE_CONFIG } from "../components/VerificationBadge";

type AccountType = "personal" | "company" | "store" | "government" | "charity";
type VerifyStatus = "none" | "pending" | "approved" | "rejected" | "more-info";

const ACCOUNT_TYPES: { id: AccountType; label: string; desc: string; badge: BadgeType; docs: string[] }[] = [
  {
    id: "personal",
    label: "شخصي / مشهور",
    desc: "الشخصيات العامة، المشاهير، صناع المحتوى",
    badge: "blue",
    docs: ["بطاقة الهوية الوطنية أو جواز السفر", "صورة شخصية حديثة", "رقم هاتف موثق", "بريد إلكتروني موثق"],
  },
  {
    id: "company",
    label: "شركة / علامة تجارية",
    desc: "الشركات الرسمية والعلامات التجارية",
    badge: "green",
    docs: ["السجل التجاري", "عنوان النشاط التجاري", "رقم الهاتف الرسمي", "البريد الإلكتروني الرسمي", "الموقع الإلكتروني (اختياري)"],
  },
  {
    id: "store",
    label: "متجر رسمي",
    desc: "المتاجر والتجار الرسميون",
    badge: "green",
    docs: ["السجل التجاري", "وثائق ضريبية", "رقم الهاتف الرسمي", "موقع المتجر الإلكتروني (اختياري)"],
  },
  {
    id: "government",
    label: "جهة حكومية",
    desc: "الجهات الحكومية والمؤسسات الرسمية والبلديات",
    badge: "gold",
    docs: ["خطاب رسمي من الجهة", "رقم السجل الحكومي", "بريد إلكتروني حكومي رسمي", "موقع الجهة الإلكتروني"],
  },
  {
    id: "charity",
    label: "جمعية / منظمة خيرية",
    desc: "الجمعيات والمنظمات غير الربحية",
    badge: "purple",
    docs: ["وثيقة تسجيل الجمعية", "رقم الترخيص الرسمي", "بريد إلكتروني رسمي", "عنوان المقر"],
  },
];

const BENEFITS = [
  { icon: ShieldCheck, text: "شارة التحقق الرسمية على ملفك الشخصي" },
  { icon: Search, text: "أولوية في نتائج البحث الذكي" },
  { icon: ShoppingBag, text: "أولوية في Atlas Market وظهور أفضل" },
  { icon: MapPin, text: "ظهور مميز في خريطة السوق" },
  { icon: BarChart2, text: "أدوات إحصائية متقدمة" },
  { icon: Star, text: "حماية من انتحال الهوية" },
];

const STATUS_DISPLAY: Record<VerifyStatus, { label: string; icon: JSX.Element; color: string; bg: string; desc: string }> = {
  none:      { label: "لم يبدأ",              icon: <ShieldCheck size={20} />, color: "#6b7280", bg: "#f3f4f6", desc: "لم تتقدم بطلب توثيق بعد." },
  pending:   { label: "قيد المراجعة",         icon: <Clock size={20} />,       color: "#f59e0b", bg: "#fef3c7", desc: "طلبك قيد المراجعة من قِبل الفريق. سيستغرق ذلك 1-3 أيام عمل." },
  approved:  { label: "تم التحقق",            icon: <Check size={20} />,       color: "#22c55e", bg: "#dcfce7", desc: "تهانينا! حسابك موثق رسمياً." },
  rejected:  { label: "مرفوض",                icon: <X size={20} />,           color: "#ef4444", bg: "#fee2e2", desc: "تم رفض طلبك. يمكنك التقدم مجدداً مع وثائق صحيحة." },
  "more-info": { label: "يحتاج معلومات إضافية", icon: <AlertCircle size={20} />, color: "#f97316", bg: "#ffedd5", desc: "يرجى تزويدنا بمعلومات إضافية أو وثائق أوضح." },
};

export default function VerificationPage() {
  const [step, setStep] = useState(0); // 0=intro, 1=type, 2=docs, 3=terms, 4=submitted
  const [selectedType, setSelectedType] = useState<AccountType | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [simulatedStatus, setSimulatedStatus] = useState<VerifyStatus>("none");

  const typeConfig = ACCOUNT_TYPES.find(t => t.id === selectedType);

  const handleUpload = (docName: string) => {
    setUploadedDocs(d => ({ ...d, [docName]: true }));
  };

  const allDocsUploaded = typeConfig
    ? typeConfig.docs.every(d => uploadedDocs[d])
    : false;

  const handleSubmit = () => {
    setStep(4);
    setSimulatedStatus("pending");
  };

  if (step === 4) {
    const status = STATUS_DISPLAY[simulatedStatus];
    return (
      <div className="page-container">
        <div className="verify-submitted-card">
          <div className="verify-status-icon" style={{ background: status.bg, color: status.color }}>
            {status.icon}
          </div>
          <h2 style={{ color: status.color }}>{status.label}</h2>
          <p>{status.desc}</p>

          {simulatedStatus === "pending" && (
            <div className="verify-timeline">
              {[
                { label: "استلام الطلب", done: true },
                { label: "مراجعة الوثائق", done: false },
                { label: "القرار النهائي", done: false },
              ].map((step, i) => (
                <div key={i} className={`verify-timeline-step ${step.done ? "done" : ""}`}>
                  <div className="timeline-dot">{step.done ? <Check size={12} /> : i + 1}</div>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <button className="btn-primary" onClick={() => { setStep(0); setSimulatedStatus("none"); setUploadedDocs({}); setAgreedTerms(false); setSelectedType(null); }}>
              العودة
            </button>
            {/* Simulate different statuses for demo */}
            <div className="verify-demo-btns">
              <span style={{ fontSize: 12, color: "#6b7280" }}>محاكاة للعرض:</span>
              {(["pending", "approved", "rejected", "more-info"] as VerifyStatus[]).map(s => (
                <button key={s} className="verify-sim-btn" style={{ background: STATUS_DISPLAY[s].bg, color: STATUS_DISPLAY[s].color }}
                  onClick={() => setSimulatedStatus(s)}>
                  {STATUS_DISPLAY[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="verify-page-wrap">
        {/* Header */}
        <div className="verify-hero">
          <div className="verify-hero-icon"><ShieldCheck size={36} /></div>
          <h1>التحقق الرسمي</h1>
          <p>احصل على شارة التحقق لزيادة الثقة وحماية هويتك</p>
        </div>

        {/* Step indicator */}
        {step > 0 && (
          <div className="verify-steps-bar">
            {["نوع الحساب", "الوثائق", "الشروط"].map((s, i) => (
              <div key={i} className={`verify-step-item ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
                <div className="verify-step-dot">{step > i + 1 ? <Check size={14} /> : i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 0: Intro */}
        {step === 0 && (
          <div className="verify-intro">
            {/* Badge types */}
            <div className="badge-types-grid">
              {(["blue","green","gold","purple","gray"] as BadgeType[]).map(b => {
                if (!b) return null;
                const cfg = BADGE_CONFIG[b];
                return (
                  <div key={b} className="badge-type-card">
                    <VerificationBadge type={b} size="lg" />
                    <div className="badge-type-label" style={{ color: cfg.bg }}>{cfg.label}</div>
                    <div className="badge-type-desc">
                      {b === "blue"   && "المشاهير وصناع المحتوى"}
                      {b === "green"  && "الشركات والمتاجر الرسمية"}
                      {b === "gold"   && "الجهات الحكومية الرسمية"}
                      {b === "purple" && "الجمعيات والمنظمات"}
                      {b === "gray"   && "التحقق الأساسي"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="verify-benefits">
              <h3>مزايا الحسابات الموثقة</h3>
              <div className="benefits-grid">
                {BENEFITS.map((b, i) => (
                  <div key={i} className="benefit-item">
                    <div className="benefit-icon"><b.icon size={18} /></div>
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Basic verification */}
            <div className="basic-verify-card">
              <div className="basic-verify-title">التحقق الأساسي ⚪</div>
              <p>أكمل التحقق الأساسي بتفعيل رقم هاتفك وبريدك الإلكتروني والمصادقة الثنائية.</p>
              <div className="basic-verify-items">
                <div className="basic-item done"><Phone size={15} /> رقم الهاتف <Check size={14} /></div>
                <div className="basic-item done"><Mail size={15} /> البريد الإلكتروني <Check size={14} /></div>
                <div className="basic-item"><Lock size={15} /> المصادقة الثنائية</div>
              </div>
            </div>

            <button className="btn-primary btn-lg" onClick={() => setStep(1)}>
              طلب التحقق الرسمي <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* Step 1: Account type */}
        {step === 1 && (
          <div className="verify-step-content">
            <h2 className="verify-step-title">اختر نوع حسابك</h2>
            <div className="account-types-list">
              {ACCOUNT_TYPES.map(t => (
                <div key={t.id}
                  className={`account-type-card ${selectedType === t.id ? "selected" : ""}`}
                  onClick={() => setSelectedType(t.id)}>
                  <div className="account-type-left">
                    <VerificationBadge type={t.badge} size="md" />
                    <div>
                      <div className="account-type-name">{t.label}</div>
                      <div className="account-type-desc">{t.desc}</div>
                    </div>
                  </div>
                  <div className={`account-type-radio ${selectedType === t.id ? "selected" : ""}`} />
                </div>
              ))}
            </div>
            <div className="verify-nav-row">
              <button className="btn-ghost" onClick={() => setStep(0)}><ChevronRight size={16} /> رجوع</button>
              <button className="btn-primary" disabled={!selectedType} onClick={() => setStep(2)}>
                التالي <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Upload documents */}
        {step === 2 && typeConfig && (
          <div className="verify-step-content">
            <h2 className="verify-step-title">رفع المستندات المطلوبة</h2>
            <p className="verify-step-sub">للحصول على <VerificationBadge type={typeConfig.badge} size="sm" showLabel /></p>
            <div className="docs-upload-list">
              {typeConfig.docs.map(doc => (
                <div key={doc} className={`doc-upload-item ${uploadedDocs[doc] ? "uploaded" : ""}`}>
                  <div className="doc-upload-left">
                    <FileText size={18} />
                    <span>{doc}</span>
                  </div>
                  {uploadedDocs[doc]
                    ? <div className="doc-uploaded-badge"><Check size={14} /> تم الرفع</div>
                    : <button className="doc-upload-btn" onClick={() => handleUpload(doc)}>
                        <Upload size={14} /> رفع الملف
                      </button>
                  }
                </div>
              ))}
            </div>
            <div className="verify-privacy-note">
              <Lock size={14} />
              <span>جميع المستندات مشفرة ولا تُعرض للمستخدمين — تُستخدم فقط للتحقق</span>
            </div>
            <div className="verify-nav-row">
              <button className="btn-ghost" onClick={() => setStep(1)}><ChevronRight size={16} /> رجوع</button>
              <button className="btn-primary" disabled={!allDocsUploaded} onClick={() => setStep(3)}>
                التالي <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Terms */}
        {step === 3 && (
          <div className="verify-step-content">
            <h2 className="verify-step-title">الموافقة على الشروط</h2>
            <div className="terms-box">
              <h4>شروط التحقق الرسمي</h4>
              <ul>
                <li>الوثائق المقدمة يجب أن تكون حقيقية وغير مزورة.</li>
                <li>استخدام وثائق مزورة يؤدي إلى إيقاف الحساب نهائياً.</li>
                <li>لا يجوز بيع الحسابات الموثقة أو نقل ملكيتها.</li>
                <li>تخضع الحسابات الموثقة لمراجعات دورية.</li>
                <li>تُحذف وثائقك بعد انتهاء التحقق وفق القوانين المحلية.</li>
                <li>Atlas Social تحتفظ بحق سحب الشارة عند انتهاك الشروط.</li>
              </ul>
            </div>
            <div className="terms-warning">
              <AlertCircle size={16} />
              <span>مكافحة التزوير: يُعدّ انتحال هوية الآخرين جريمة يعاقب عليها القانون.</span>
            </div>
            <label className="terms-agree-row">
              <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} />
              <span>أوافق على شروط وأحكام التحقق الرسمي في Atlas Social</span>
            </label>
            <div className="verify-nav-row">
              <button className="btn-ghost" onClick={() => setStep(2)}><ChevronRight size={16} /> رجوع</button>
              <button className="btn-primary" disabled={!agreedTerms} onClick={handleSubmit}>
                إرسال الطلب <ShieldCheck size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
