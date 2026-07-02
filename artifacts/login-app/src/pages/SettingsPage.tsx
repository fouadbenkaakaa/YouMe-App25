import { useState } from "react";
import { Shield, Eye, Bell, Lock, UserX, Smartphone, ChevronLeft, Moon, Sun, Palette, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Lang } from "../i18n/translations";

function ToggleRow({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: () => void }) {
  return (
    <div className="settings-row" onClick={onChange}>
      <div>
        <div className="settings-row-label">{label}</div>
        {desc && <div className="settings-row-desc">{desc}</div>}
      </div>
      <div className={`toggle ${value ? "on" : "off"}`}><div className="toggle-thumb" /></div>
    </div>
  );
}

function SelectRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="settings-row">
      <div className="settings-row-label">{label}</div>
      <select value={value} onChange={e => onChange(e.target.value)} className="settings-select">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

const LANG_OPTIONS: { code: Lang; label: string; native: string }[] = [
  { code: "ar", label: "العربية",    native: "عربي" },
  { code: "en", label: "الإنجليزية", native: "English" },
  { code: "fr", label: "الفرنسية",   native: "Français" },
];

export default function SettingsPage() {
  const { darkMode, setDarkMode, language, setLanguage, t } = useApp();
  const [section, setSection] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState({ showPhone: false, showAge: true, showMarital: false, hideLastSeen: false, twoFactor: false });
  const [notifs,  setNotifs]  = useState({ messages: true, friendRequests: true, comments: true, likes: true, mentions: true });
  const [whoCanFriend, setWhoCanFriend] = useState("الجميع");
  const [whoSeesPhone, setWhoSeesPhone] = useState("لا أحد");
  const [accentColor, setAccentColor]   = useState("#7c3aed");

  const COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#e11d48", "#db2777"];

  const SECTIONS = [
    { id: "privacy",      icon: <Shield size={20} />,     label: "الخصوصية",       desc: "تحكم في من يرى معلوماتك" },
    { id: "notifications",icon: <Bell size={20} />,       label: "الإشعارات",      desc: "ضبط تنبيهاتك" },
    { id: "security",     icon: <Lock size={20} />,       label: "الأمان",         desc: "كلمة المرور والحماية" },
    { id: "appearance",   icon: <Palette size={20} />,    label: "المظهر واللغة",  desc: "الوضع الليلي والألوان واللغة" },
    { id: "blocked",      icon: <UserX size={20} />,      label: "المحظورون",      desc: "قائمة المستخدمين المحظورين" },
    { id: "sessions",     icon: <Smartphone size={20} />, label: "الأجهزة النشطة", desc: "إدارة جلسات الدخول" },
  ];

  if (section) return (
    <div className="page-container">
      <button className="back-link" onClick={() => setSection(null)}>
        <ChevronLeft size={18} /> العودة للإعدادات
      </button>

      {section === "privacy" && (
        <div className="settings-section">
          <h2 className="settings-title">🔒 الخصوصية</h2>
          <ToggleRow label="إظهار رقم الهاتف"      value={privacy.showPhone}    onChange={() => setPrivacy(p => ({ ...p, showPhone: !p.showPhone }))} />
          <ToggleRow label="إظهار العمر"            value={privacy.showAge}      onChange={() => setPrivacy(p => ({ ...p, showAge: !p.showAge }))} />
          <ToggleRow label="إظهار الحالة الاجتماعية" value={privacy.showMarital}  onChange={() => setPrivacy(p => ({ ...p, showMarital: !p.showMarital }))} />
          <ToggleRow label="إخفاء آخر ظهور"         value={privacy.hideLastSeen} onChange={() => setPrivacy(p => ({ ...p, hideLastSeen: !p.hideLastSeen }))} />
          <SelectRow label="من يستطيع إرسال طلبات صداقة" options={["الجميع", "أصدقاء الأصدقاء", "لا أحد"]} value={whoCanFriend} onChange={setWhoCanFriend} />
          <SelectRow label="من يرى رقم هاتفي"             options={["لا أحد", "أصدقائي", "الجميع"]}           value={whoSeesPhone} onChange={setWhoSeesPhone} />
        </div>
      )}

      {section === "notifications" && (
        <div className="settings-section">
          <h2 className="settings-title">🔔 الإشعارات</h2>
          <ToggleRow label="إشعارات الرسائل"         value={notifs.messages}      onChange={() => setNotifs(n => ({ ...n, messages: !n.messages }))} />
          <ToggleRow label="طلبات الصداقة"           value={notifs.friendRequests} onChange={() => setNotifs(n => ({ ...n, friendRequests: !n.friendRequests }))} />
          <ToggleRow label="التعليقات على منشوراتي"  value={notifs.comments}       onChange={() => setNotifs(n => ({ ...n, comments: !n.comments }))} />
          <ToggleRow label="الإعجابات الجديدة"       value={notifs.likes}          onChange={() => setNotifs(n => ({ ...n, likes: !n.likes }))} />
          <ToggleRow label="الذكر في المنشورات"      value={notifs.mentions}       onChange={() => setNotifs(n => ({ ...n, mentions: !n.mentions }))} />
        </div>
      )}

      {section === "security" && (
        <div className="settings-section">
          <h2 className="settings-title">🛡️ الأمان</h2>
          <ToggleRow label="المصادقة الثنائية" desc="حماية إضافية لحسابك" value={privacy.twoFactor} onChange={() => setPrivacy(p => ({ ...p, twoFactor: !p.twoFactor }))} />
          <div className="settings-row">
            <div className="settings-row-label">تغيير كلمة المرور</div>
            <button className="btn-ghost-purple">تغيير</button>
          </div>
          <div className="settings-row">
            <div className="settings-row-label">تسجيل الخروج من جميع الأجهزة</div>
            <button className="btn-ghost" style={{ color: "#ef4444" }}>خروج</button>
          </div>
        </div>
      )}

      {section === "appearance" && (
        <div className="settings-section">
          <h2 className="settings-title">🎨 المظهر واللغة</h2>

          {/* Dark mode toggle */}
          <div className="settings-row">
            <div>
              <div className="settings-row-label">{darkMode ? t("darkMode") : t("lightMode")}</div>
              <div className="settings-row-desc">يُحفظ تلقائياً ويبقى بعد إعادة التشغيل</div>
            </div>
            <button className="mode-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <><Sun size={18} /> نهاري</> : <><Moon size={18} /> ليلي</>}
            </button>
          </div>

          {/* Language selector */}
          <div className="settings-row settings-lang-row">
            <div>
              <div className="settings-row-label"><Globe size={15} style={{ display: "inline", marginInlineEnd: 6 }} />{t("language")}</div>
              <div className="settings-row-desc">اللغة المعروضة في التطبيق</div>
            </div>
            <div className="lang-pills">
              {LANG_OPTIONS.map(l => (
                <button
                  key={l.code}
                  className={`lang-pill ${language === l.code ? "active" : ""}`}
                  onClick={() => setLanguage(l.code)}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div className="settings-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
            <div className="settings-row-label">اللون الرئيسي</div>
            <div className="color-picker">
              {COLORS.map(c => (
                <button key={c} className={`color-swatch ${accentColor === c ? "selected" : ""}`}
                  style={{ background: c }} onClick={() => setAccentColor(c)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {section === "blocked" && (
        <div className="settings-section">
          <h2 className="settings-title">🚫 المحظورون</h2>
          <div className="empty-state"><span>✅</span><p>قائمة المحظورين فارغة</p></div>
        </div>
      )}

      {section === "sessions" && (
        <div className="settings-section">
          <h2 className="settings-title">📱 الأجهزة النشطة</h2>
          {[
            { device: "iPhone 14 Pro", location: "الرياض", time: "الآن", current: true },
            { device: "Chrome / Windows", location: "جدة", time: "منذ ٣ ساعات", current: false },
          ].map((s, i) => (
            <div key={i} className="session-item">
              <div>
                <div className="settings-row-label">{s.device} {s.current && <span className="current-badge">الجهاز الحالي</span>}</div>
                <div className="settings-row-desc">{s.location} · {s.time}</div>
              </div>
              {!s.current && <button className="btn-ghost" style={{ color: "#ef4444" }}>إنهاء</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">⚙️ الإعدادات</h1>
      <div className="settings-list">
        {SECTIONS.map(s => (
          <button key={s.id} className="settings-section-btn" onClick={() => setSection(s.id)}>
            <div className="settings-section-icon">{s.icon}</div>
            <div>
              <div className="settings-row-label">{s.label}</div>
              <div className="settings-row-desc">{s.desc}</div>
            </div>
            <ChevronLeft size={18} className="settings-chevron" />
          </button>
        ))}
      </div>
    </div>
  );
}
