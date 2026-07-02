import { useState } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Briefcase, Flag, CreditCard,
  Settings, Search, Plus, Check, X, Clock, AlertTriangle, Eye, Ban,
  Edit3, Trash2, Star, TrendingUp, Package, Car, Store, Bell,
  ChevronDown, ChevronUp, UserPlus, RefreshCw, Filter, Download,
  MessageSquare, FileText, Shield, Crown, Zap
} from "lucide-react";

/* ──────────── Role Architecture ──────────── */
type AdminRole = "super_admin" | "admin" | "moderator" | "verification_manager" | "operator" | "support";

const ADMIN_ROLES: Record<AdminRole, { label: string; color: string; bg: string; desc: string }> = {
  super_admin:          { label: "Super Admin",          color: "#7c3aed", bg: "#ede9fe", desc: "صلاحيات كاملة غير محدودة" },
  admin:                { label: "مدير عام",              color: "#2563eb", bg: "#dbeafe", desc: "إدارة المنصة بالكامل" },
  moderator:            { label: "Moderator",             color: "#059669", bg: "#d1fae5", desc: "مراجعة المحتوى والبلاغات" },
  verification_manager: { label: "Verification Manager",  color: "#d97706", bg: "#fef3c7", desc: "إدارة طلبات التحقق" },
  operator:             { label: "متعامل",                color: "#0891b2", bg: "#cffafe", desc: "عمليات الخدمات" },
  support:              { label: "دعم فني",               color: "#6b7280", bg: "#f3f4f6", desc: "دعم المستخدمين" },
};

const ROLE_ICON: Record<AdminRole, any> = {
  super_admin: Crown, admin: Shield, moderator: Flag,
  verification_manager: ShieldCheck, operator: Zap, support: Users,
};

/* ──────────── Stats ──────────── */
const STATS = [
  { label: "المستخدمون",       value: "124,830", icon: Users,      trend: "+3.2%",  color: "#3b82f6" },
  { label: "المنشورات اليوم",  value: "8,412",   icon: TrendingUp, trend: "+12%",   color: "#22c55e" },
  { label: "المتاجر النشطة",   value: "3,210",   icon: Store,      trend: "+5.1%",  color: "#f59e0b" },
  { label: "طلبات التوصيل",   value: "1,847",   icon: Package,    trend: "+18%",   color: "#a855f7" },
  { label: "رحلات النقل",     value: "924",     icon: Car,        trend: "+7%",    color: "#ef4444" },
  { label: "البلاغات المفتوحة", value: "47",     icon: Flag,       trend: "-8%",    color: "#6b7280" },
];

/* ──────────── Team ──────────── */
type LegacyRole = "admin" | "supervisor" | "operator" | "support";

interface TeamMember {
  id: string; name: string; username: string; email: string;
  role: AdminRole; status: "active" | "inactive" | "suspended";
  joinedAt: string; avatar: string; permissions: string[];
}

const ALL_PERMISSIONS = [
  "إدارة المستخدمين", "مراجعة البلاغات", "طلبات التحقق",
  "إدارة المتاجر", "إدارة المدفوعات", "عرض الإحصائيات",
  "تعديل الإعدادات", "إدارة الإعلانات", "تعليق الحسابات",
  "إدارة الأدوار (قريباً)", "منع المستخدمين (قريباً)",
];

const INIT_TEAM: TeamMember[] = [
  { id: "t1", name: "فؤاد الأحمد",   username: "fouad",      email: "fouad@atlas.social",  role: "super_admin",          status: "active",   joinedAt: "2024-01-01", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4",   permissions: ALL_PERMISSIONS },
  { id: "t2", name: "سارة المنصور",  username: "sara_m",     email: "sara@atlas.social",   role: "verification_manager", status: "active",   joinedAt: "2025-03-12", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",    permissions: ["طلبات التحقق", "إدارة المستخدمين"] },
  { id: "t3", name: "خالد الزهراني", username: "khaled_z",   email: "khaled@atlas.social", role: "moderator",            status: "active",   joinedAt: "2025-06-01", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",  permissions: ["مراجعة البلاغات", "إدارة المستخدمين"] },
  { id: "t4", name: "نورة الشمري",   username: "noura_sh",   email: "noura@atlas.social",  role: "operator",             status: "active",   joinedAt: "2025-09-14", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",   permissions: ["إدارة المتاجر", "عرض الإحصائيات"] },
  { id: "t5", name: "محمد العمري",   username: "mohammed_a", email: "m.amri@atlas.social", role: "support",              status: "inactive", joinedAt: "2025-11-02", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", permissions: ["مراجعة البلاغات"] },
];

/* ──────────── Verification ──────────── */
type VerifyStatus = "pending" | "approved" | "rejected" | "more-info";
interface VerifyReq { id: string; name: string; type: string; badge: string; date: string; status: VerifyStatus; avatar: string; }

const INIT_VERIFY: VerifyReq[] = [
  { id: "v1", name: "طارق المحمدي",     type: "شخصية عامة",  badge: "🔵", date: "2026-07-01", status: "pending",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarek&backgroundColor=b6e3f4" },
  { id: "v2", name: "متجر الإلكترونيات", type: "متجر رسمي",  badge: "🟢", date: "2026-06-30", status: "pending",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elec&backgroundColor=d1d4f9" },
  { id: "v3", name: "بلدية الرياض",     type: "جهة حكومية",  badge: "🟡", date: "2026-06-28", status: "approved",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gov&backgroundColor=ffdfbf" },
  { id: "v4", name: "جمعية الخير",      type: "جمعية خيرية", badge: "🟣", date: "2026-06-25", status: "rejected",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charity&backgroundColor=c0aede" },
];

/* ──────────── Reports ──────────── */
interface Report { id: string; type: string; target: string; reporter: string; date: string; status: "open" | "resolved" | "dismissed"; }
const INIT_REPORTS: Report[] = [
  { id: "r1", type: "انتحال هوية",  target: "@fake_celebrity", reporter: "أحمد",  date: "2026-07-01", status: "open" },
  { id: "r2", type: "محتوى ضار",    target: "منشور #8812",    reporter: "فاطمة", date: "2026-06-30", status: "open" },
  { id: "r3", type: "بريد مزعج",   target: "@spammer88",      reporter: "عمر",   date: "2026-06-29", status: "resolved" },
  { id: "r4", type: "تحرش / تنمر", target: "@harasser2",      reporter: "منى",   date: "2026-06-28", status: "dismissed" },
];

/* ──────────── Platform Users ──────────── */
interface PlatformUser {
  id: string; name: string; username: string;
  status: "active" | "warned" | "suspended" | "banned";
  verified: string | null; joinedAt: string; posts: number;
  avatar: string; suspendedUntil?: string;
}
const INIT_USERS: PlatformUser[] = [
  { id: "u1", name: "سارة المنصور",    username: "sara_m",    status: "active",    verified: "🔵", joinedAt: "2025-02-10", posts: 234, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara2&backgroundColor=ffdfbf" },
  { id: "u2", name: "محمد البلوي",     username: "m_balawi",  status: "warned",    verified: null, joinedAt: "2025-07-18", posts: 12,  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moha&backgroundColor=d1d4f9" },
  { id: "u3", name: "نورة الشمري",     username: "noura_sh2", status: "active",    verified: "🟢", joinedAt: "2025-11-01", posts: 580, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura2&backgroundColor=c0aede" },
  { id: "u4", name: "فهد الدوسري",     username: "fahd_d",    status: "suspended", verified: null, joinedAt: "2024-09-05", posts: 3,   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd&backgroundColor=b6e3f4", suspendedUntil: "2026-07-10" },
  { id: "u5", name: "عمر الشريف",      username: "omar_s",    status: "banned",    verified: null, joinedAt: "2024-03-15", posts: 1,   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar&backgroundColor=c0aede" },
];

/* ──────────── Moderation ──────────── */
interface ModPost { id: string; author: string; text: string; reports: number; date: string; status: "active" | "hidden" | "deleted"; }
const INIT_MOD_POSTS: ModPost[] = [
  { id: "mp1", author: "عمر الشريف",   text: "محتوى مخالف للشروط...",          reports: 12, date: "2026-07-01", status: "active" },
  { id: "mp2", author: "فهد الدوسري",  text: "رسائل بريد مزعج متكررة ...",     reports: 5,  date: "2026-06-30", status: "active" },
  { id: "mp3", author: "مجهول",        text: "صور غير لائقة تم الإبلاغ عنها", reports: 28, date: "2026-06-29", status: "hidden" },
];

interface ModComment { id: string; author: string; postId: string; text: string; reports: number; date: string; status: "active" | "hidden" | "deleted"; }
const INIT_MOD_COMMENTS: ModComment[] = [
  { id: "mc1", author: "محمد البلوي", postId: "#1234", text: "تعليق يحتوي على خطاب كراهية ...", reports: 8, date: "2026-07-01", status: "active" },
  { id: "mc2", author: "مجهول",      postId: "#8812", text: "إعلان تجاري غير مرخص ...",         reports: 3, date: "2026-06-30", status: "hidden" },
];

/* ──────────── Feature Flags ──────────── */
interface Feature { id: string; name: string; desc: string; enabled: boolean; tag?: string; }
const INIT_FEATURES: Feature[] = [
  { id: "f1",  name: "فيديو TikTok", desc: "فيديوهات بأسلوب TikTok",   enabled: false, tag: "قريباً" },
  { id: "f2",  name: "البث المباشر", desc: "بث مباشر للمستخدمين",       enabled: false, tag: "قريباً" },
  { id: "f3",  name: "شارات التحقق", desc: "شارات التوثيق الرسمية",     enabled: false, tag: "قريباً" },
  { id: "f4",  name: "السوق",        desc: "سوق البيع والشراء",          enabled: false, tag: "قريباً" },
  { id: "f5",  name: "Atlas Delivery", desc: "خدمة التوصيل",            enabled: false, tag: "قريباً" },
  { id: "f6",  name: "Atlas Ride",   desc: "خدمة نقل الركاب",           enabled: false, tag: "قريباً" },
  { id: "f7",  name: "اشتراكات بريميوم", desc: "الباقات المدفوعة",      enabled: false, tag: "قريباً" },
  { id: "f8",  name: "النجوم والهدايا", desc: "نظام النجوم الافتراضية",  enabled: false, tag: "قريباً" },
  { id: "f9",  name: "المساعد الذكي", desc: "مساعد AI مدمج",            enabled: false, tag: "قريباً" },
];

/* ──────────── Status config ──────────── */
const STATUS_USER_CFG = {
  active:    { label: "نشط",    color: "#22c55e", bg: "#dcfce7" },
  warned:    { label: "منذر",   color: "#f59e0b", bg: "#fef3c7" },
  suspended: { label: "موقوف", color: "#f97316", bg: "#ffedd5" },
  banned:    { label: "محظور", color: "#ef4444", bg: "#fee2e2" },
};
const STATUS_REPORT_CFG = {
  open:      { label: "مفتوح",  color: "#f59e0b", bg: "#fef3c7" },
  resolved:  { label: "محلول",  color: "#22c55e", bg: "#dcfce7" },
  dismissed: { label: "مُغلق", color: "#6b7280", bg: "#f3f4f6" },
};
const VERIFY_CFG: Record<VerifyStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "قيد المراجعة",   color: "#f59e0b", bg: "#fef3c7" },
  approved:   { label: "موافق",          color: "#22c55e", bg: "#dcfce7" },
  rejected:   { label: "مرفوض",          color: "#ef4444", bg: "#fee2e2" },
  "more-info": { label: "معلومات إضافية", color: "#f97316", bg: "#ffedd5" },
};

/* ──────────── Add Member Modal ──────────── */
function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: TeamMember) => void }) {
  const [form, setForm] = useState({ name: "", username: "", email: "", role: "moderator" as AdminRole, permissions: [] as string[] });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const togglePerm = (p: string) => set("permissions", form.permissions.includes(p) ? form.permissions.filter(x => x !== p) : [...form.permissions, p]);

  const defaultPerms: Record<AdminRole, string[]> = {
    super_admin:          ALL_PERMISSIONS,
    admin:                ALL_PERMISSIONS,
    moderator:            ["مراجعة البلاغات", "إدارة المستخدمين"],
    verification_manager: ["طلبات التحقق", "إدارة المستخدمين"],
    operator:             ["إدارة المتاجر", "عرض الإحصائيات"],
    support:              ["مراجعة البلاغات"],
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <h3>➕ إضافة عضو فريق جديد</h3>
        <div className="store-form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="store-field">
            <label>الاسم الكامل *</label>
            <input type="text" placeholder="الاسم" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="store-field">
            <label>اسم المستخدم *</label>
            <input type="text" placeholder="username" value={form.username} onChange={e => set("username", e.target.value)} />
          </div>
          <div className="store-field full">
            <label>البريد الإلكتروني *</label>
            <input type="email" placeholder="email@atlas.social" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="store-field full">
            <label>الدور</label>
            <div className="radio-options" style={{ flexWrap: "wrap", gap: 8 }}>
              {(Object.keys(ADMIN_ROLES) as AdminRole[]).map(r => {
                const cfg = ADMIN_ROLES[r];
                const Icon = ROLE_ICON[r];
                return (
                  <label
                    key={r}
                    className={`radio-opt-sm ${form.role === r ? "selected" : ""}`}
                    onClick={() => setForm(f => ({ ...f, role: r, permissions: defaultPerms[r] }))}
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <Icon size={13} /> {cfg.label}
                  </label>
                );
              })}
            </div>
            {form.role && (
              <div className="role-desc-hint">{ADMIN_ROLES[form.role].desc}</div>
            )}
          </div>
          <div className="store-field full">
            <label>الصلاحيات</label>
            <div className="hobbies-picker">
              {ALL_PERMISSIONS.map(p => (
                <label key={p} className={`hobby-chip ${form.permissions.includes(p) ? "selected" : ""}`} onClick={() => togglePerm(p)}>{p}</label>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" style={{ flex: 1 }} disabled={!form.name || !form.username || !form.email} onClick={() => {
            onAdd({ id: "t" + Date.now(), ...form, status: "active", joinedAt: new Date().toISOString().slice(0, 10), avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}&backgroundColor=b6e3f4` });
            onClose();
          }}>
            <UserPlus size={16} /> إضافة العضو
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Suspend Modal ──────────── */
function SuspendModal({ user, onClose, onApply }: { user: PlatformUser; onClose: () => void; onApply: (id: string, until: string) => void }) {
  const [days, setDays] = useState(7);
  const until = new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <h3>⏸️ تعليق مؤقت: {user.name}</h3>
        <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 16 }}>اختر مدة التعليق</p>
        <div className="radio-options" style={{ flexWrap: "wrap" }}>
          {[1, 3, 7, 14, 30].map(d => (
            <label key={d} className={`radio-opt-sm ${days === d ? "selected" : ""}`} onClick={() => setDays(d)}>{d} يوم</label>
          ))}
        </div>
        <div className="admin-stat-card" style={{ marginTop: 12, padding: "10px 14px" }}>
          <span style={{ fontSize: 13, color: "var(--text2)" }}>ينتهي التعليق في:</span>
          <strong style={{ fontSize: 14 }}>{until}</strong>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button className="btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" style={{ flex: 1, background: "#f97316" }} onClick={() => { onApply(user.id, until); onClose(); }}>
            تعليق الحساب
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Main ──────────── */
type AdminTab = "overview" | "users" | "team" | "verification" | "reports" | "moderation" | "features" | "settings";

const TABS: { id: AdminTab; icon: any; label: string }[] = [
  { id: "overview",     icon: LayoutDashboard, label: "نظرة عامة" },
  { id: "users",        icon: Users,           label: "المستخدمون" },
  { id: "moderation",   icon: MessageSquare,   label: "الإشراف" },
  { id: "team",         icon: Briefcase,       label: "الفريق" },
  { id: "verification", icon: ShieldCheck,     label: "التحقق" },
  { id: "reports",      icon: Flag,            label: "البلاغات" },
  { id: "features",     icon: Zap,             label: "الميزات" },
  { id: "settings",     icon: Settings,        label: "الإعدادات" },
];

export default function AdminPage() {
  const [tab, setTab]           = useState<AdminTab>("overview");
  const [team, setTeam]         = useState<TeamMember[]>(INIT_TEAM);
  const [verifyReqs, setVerify] = useState<VerifyReq[]>(INIT_VERIFY);
  const [reports, setReports]   = useState<Report[]>(INIT_REPORTS);
  const [platUsers, setPlatUsers] = useState<PlatformUser[]>(INIT_USERS);
  const [modPosts, setModPosts]   = useState<ModPost[]>(INIT_MOD_POSTS);
  const [modComments, setModComments] = useState<ModComment[]>(INIT_MOD_COMMENTS);
  const [features, setFeatures]   = useState<Feature[]>(INIT_FEATURES);
  const [showAddMember, setShowAddMember] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState<PlatformUser | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [modTab, setModTab]        = useState<"posts" | "comments">("posts");

  const updateVerify = (id: string, status: VerifyStatus) =>
    setVerify(vrs => vrs.map(v => v.id === id ? { ...v, status } : v));
  const updateReport = (id: string, status: Report["status"]) =>
    setReports(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  const updateUserStatus = (id: string, status: PlatformUser["status"]) =>
    setPlatUsers(us => us.map(u => u.id === id ? { ...u, status } : u));
  const applySuspend = (id: string, until: string) =>
    setPlatUsers(us => us.map(u => u.id === id ? { ...u, status: "suspended", suspendedUntil: until } : u));
  const toggleFeature = (id: string) =>
    setFeatures(fs => fs.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));

  const filteredUsers = platUsers.filter(u =>
    u.name.includes(userSearch) || u.username.includes(userSearch)
  );

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-logo" style={{ width: 32, height: 32, fontSize: 14 }}>A</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>Atlas Social</div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>لوحة الإدارة</div>
          </div>
        </div>
        <nav className="admin-nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div style={{ fontSize: 11, color: "var(--text2)", textAlign: "center" }}>
            Atlas Social Admin v2.0
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div>
            <h2 className="admin-section-title">📊 نظرة عامة على المنصة</h2>
            <div className="admin-stats-grid">
              {STATS.map(s => (
                <div key={s.label} className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ color: s.color }}><s.icon size={22} /></div>
                  <div className="admin-stat-value">{s.value}</div>
                  <div className="admin-stat-label">{s.label}</div>
                  <div className="admin-stat-trend" style={{ color: s.trend.startsWith("+") ? "#22c55e" : "#ef4444" }}>
                    {s.trend}
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-two-cols">
              {/* Recent reports */}
              <div className="admin-card">
                <div className="admin-card-header"><Flag size={16} /> آخر البلاغات</div>
                {reports.filter(r => r.status === "open").slice(0, 3).map(r => (
                  <div key={r.id} className="admin-list-item">
                    <div>
                      <div className="admin-item-name">{r.type}</div>
                      <div className="admin-item-sub">{r.target} · {r.date}</div>
                    </div>
                    <button className="btn-ghost-purple" style={{ fontSize: 12 }} onClick={() => setTab("reports")}>
                      مراجعة
                    </button>
                  </div>
                ))}
              </div>

              {/* Pending verification */}
              <div className="admin-card">
                <div className="admin-card-header"><ShieldCheck size={16} /> طلبات التحقق المعلقة</div>
                {verifyReqs.filter(v => v.status === "pending").map(v => (
                  <div key={v.id} className="admin-list-item">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={v.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} />
                      <div>
                        <div className="admin-item-name">{v.name}</div>
                        <div className="admin-item-sub">{v.type} {v.badge}</div>
                      </div>
                    </div>
                    <button className="btn-ghost-purple" style={{ fontSize: 12 }} onClick={() => setTab("verification")}>
                      مراجعة
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Users ── */}
        {tab === "users" && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">👥 إدارة المستخدمين</h2>
              <div className="admin-search-box">
                <Search size={15} />
                <input type="text" placeholder="بحث..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              </div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المستخدم</th><th>اسم المستخدم</th><th>الحالة</th>
                    <th>التحقق</th><th>المنشورات</th><th>الانضمام</th><th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const cfg = STATUS_USER_CFG[u.status];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <img src={u.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                              {u.suspendedUntil && <div style={{ fontSize: 11, color: "#f97316" }}>حتى {u.suspendedUntil}</div>}
                            </div>
                          </div>
                        </td>
                        <td><code style={{ fontSize: 12 }}>@{u.username}</code></td>
                        <td>
                          <span className="admin-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                        </td>
                        <td style={{ fontSize: 18 }}>{u.verified ?? "—"}</td>
                        <td>{u.posts}</td>
                        <td style={{ fontSize: 12, color: "var(--text2)" }}>{u.joinedAt}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {u.status !== "warned" && u.status !== "banned" && (
                              <button className="admin-action-btn warn" onClick={() => updateUserStatus(u.id, "warned")} title="تحذير">
                                <AlertTriangle size={13} />
                              </button>
                            )}
                            {u.status !== "suspended" && u.status !== "banned" && (
                              <button className="admin-action-btn suspend" onClick={() => setSuspendTarget(u)} title="تعليق مؤقت">
                                <Clock size={13} />
                              </button>
                            )}
                            {u.status !== "banned" && (
                              <button className="admin-action-btn ban" onClick={() => updateUserStatus(u.id, "banned")} title="حظر نهائي">
                                <Ban size={13} />
                              </button>
                            )}
                            {(u.status === "warned" || u.status === "suspended" || u.status === "banned") && (
                              <button className="admin-action-btn unban" onClick={() => updateUserStatus(u.id, "active")} title="رفع الحظر">
                                <Check size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Moderation (posts + comments) ── */}
        {tab === "moderation" && (
          <div>
            <h2 className="admin-section-title">🛡️ إشراف المحتوى</h2>
            <div className="tab-bar" style={{ marginBottom: 20 }}>
              <button className={modTab === "posts" ? "active" : ""} onClick={() => setModTab("posts")}>
                <FileText size={15} /> المنشورات المبلغ عنها
              </button>
              <button className={modTab === "comments" ? "active" : ""} onClick={() => setModTab("comments")}>
                <MessageSquare size={15} /> التعليقات المبلغ عنها
              </button>
            </div>

            {modTab === "posts" && (
              <div className="admin-mod-list">
                {modPosts.map(p => (
                  <div key={p.id} className="admin-mod-card">
                    <div className="admin-mod-header">
                      <div>
                        <span className="admin-item-name">{p.author}</span>
                        <span className="admin-item-sub"> · {p.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span className="mod-report-badge"><Flag size={11} /> {p.reports} بلاغ</span>
                        <span className="admin-badge" style={{
                          color: p.status === "active" ? "#f59e0b" : p.status === "hidden" ? "#3b82f6" : "#ef4444",
                          background: p.status === "active" ? "#fef3c7" : p.status === "hidden" ? "#dbeafe" : "#fee2e2",
                        }}>
                          {p.status === "active" ? "نشط" : p.status === "hidden" ? "مخفي" : "محذوف"}
                        </span>
                      </div>
                    </div>
                    <p className="admin-mod-text">{p.text}</p>
                    <div className="admin-mod-actions">
                      {p.status !== "hidden" && (
                        <button className="admin-action-btn warn" onClick={() => setModPosts(ps => ps.map(pp => pp.id === p.id ? { ...pp, status: "hidden" } : pp))}>
                          <Eye size={13} /> إخفاء
                        </button>
                      )}
                      {p.status === "hidden" && (
                        <button className="admin-action-btn unban" onClick={() => setModPosts(ps => ps.map(pp => pp.id === p.id ? { ...pp, status: "active" } : pp))}>
                          <Check size={13} /> إظهار
                        </button>
                      )}
                      {p.status !== "deleted" && (
                        <button className="admin-action-btn ban" onClick={() => setModPosts(ps => ps.map(pp => pp.id === p.id ? { ...pp, status: "deleted" } : pp))}>
                          <Trash2 size={13} /> حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {modTab === "comments" && (
              <div className="admin-mod-list">
                {modComments.map(c => (
                  <div key={c.id} className="admin-mod-card">
                    <div className="admin-mod-header">
                      <div>
                        <span className="admin-item-name">{c.author}</span>
                        <span className="admin-item-sub"> على {c.postId} · {c.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span className="mod-report-badge"><Flag size={11} /> {c.reports} بلاغ</span>
                        <span className="admin-badge" style={{
                          color: c.status === "active" ? "#f59e0b" : c.status === "hidden" ? "#3b82f6" : "#ef4444",
                          background: c.status === "active" ? "#fef3c7" : c.status === "hidden" ? "#dbeafe" : "#fee2e2",
                        }}>
                          {c.status === "active" ? "نشط" : c.status === "hidden" ? "مخفي" : "محذوف"}
                        </span>
                      </div>
                    </div>
                    <p className="admin-mod-text">{c.text}</p>
                    <div className="admin-mod-actions">
                      {c.status !== "hidden" && (
                        <button className="admin-action-btn warn" onClick={() => setModComments(cs => cs.map(cc => cc.id === c.id ? { ...cc, status: "hidden" } : cc))}>
                          <Eye size={13} /> إخفاء
                        </button>
                      )}
                      {c.status === "hidden" && (
                        <button className="admin-action-btn unban" onClick={() => setModComments(cs => cs.map(cc => cc.id === c.id ? { ...cc, status: "active" } : cc))}>
                          <Check size={13} /> إظهار
                        </button>
                      )}
                      {c.status !== "deleted" && (
                        <button className="admin-action-btn ban" onClick={() => setModComments(cs => cs.map(cc => cc.id === c.id ? { ...cc, status: "deleted" } : cc))}>
                          <Trash2 size={13} /> حذف
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Team ── */}
        {tab === "team" && (
          <div>
            <div className="admin-section-header">
              <h2 className="admin-section-title">👔 فريق الإدارة</h2>
              <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowAddMember(true)}>
                <Plus size={15} /> إضافة عضو
              </button>
            </div>

            {/* Role architecture info */}
            <div className="admin-roles-grid">
              {(Object.entries(ADMIN_ROLES) as [AdminRole, typeof ADMIN_ROLES[AdminRole]][]).map(([key, cfg]) => {
                const Icon = ROLE_ICON[key];
                return (
                  <div key={key} className="admin-role-card" style={{ borderColor: cfg.color + "44" }}>
                    <div className="admin-role-icon" style={{ color: cfg.color, background: cfg.bg }}>
                      <Icon size={18} />
                    </div>
                    <div className="admin-role-name">{cfg.label}</div>
                    <div className="admin-role-desc">{cfg.desc}</div>
                    <div className="admin-role-count">
                      {team.filter(m => m.role === key).length} عضو
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="admin-table-wrap" style={{ marginTop: 20 }}>
              <table className="admin-table">
                <thead>
                  <tr><th>العضو</th><th>الدور</th><th>الحالة</th><th>الانضمام</th><th>الصلاحيات</th><th>إجراءات</th></tr>
                </thead>
                <tbody>
                  {team.map(m => {
                    const roleCfg = ADMIN_ROLES[m.role] ?? ADMIN_ROLES.support;
                    const Icon = ROLE_ICON[m.role] ?? Users;
                    return (
                      <tr key={m.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <img src={m.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{m.name}</div>
                              <div style={{ fontSize: 11, color: "var(--text2)" }}>@{m.username}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="admin-badge" style={{ color: roleCfg.color, background: roleCfg.bg, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Icon size={11} /> {roleCfg.label}
                          </span>
                        </td>
                        <td>
                          <span className="admin-badge" style={{
                            color: m.status === "active" ? "#22c55e" : m.status === "inactive" ? "#6b7280" : "#ef4444",
                            background: m.status === "active" ? "#dcfce7" : m.status === "inactive" ? "#f3f4f6" : "#fee2e2",
                          }}>
                            {m.status === "active" ? "نشط" : m.status === "inactive" ? "غير نشط" : "موقوف"}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--text2)" }}>{m.joinedAt}</td>
                        <td style={{ fontSize: 12, color: "var(--text2)" }}>{m.permissions.length} صلاحية</td>
                        <td>
                          <button className="admin-action-btn ban" onClick={() => setTeam(t => t.filter(x => x.id !== m.id))} title="إزالة">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Verification ── */}
        {tab === "verification" && (
          <div>
            <h2 className="admin-section-title">🛡️ طلبات التحقق الرسمي</h2>
            <div className="admin-verify-list">
              {verifyReqs.map(v => {
                const cfg = VERIFY_CFG[v.status];
                return (
                  <div key={v.id} className="admin-verify-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <img src={v.avatar} alt="" style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700 }}>{v.name} {v.badge}</div>
                        <div style={{ fontSize: 13, color: "var(--text2)" }}>{v.type} · {v.date}</div>
                        <span className="admin-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                      </div>
                    </div>
                    {v.status === "pending" && (
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button className="admin-action-btn unban" onClick={() => updateVerify(v.id, "approved")} title="قبول">
                          <Check size={14} /> قبول
                        </button>
                        <button className="admin-action-btn warn" onClick={() => updateVerify(v.id, "more-info")} title="معلومات">
                          <Clock size={14} />
                        </button>
                        <button className="admin-action-btn ban" onClick={() => updateVerify(v.id, "rejected")} title="رفض">
                          <X size={14} /> رفض
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Reports ── */}
        {tab === "reports" && (
          <div>
            <h2 className="admin-section-title">🚨 البلاغات والمخالفات</h2>
            <div className="admin-verify-list">
              {reports.map(r => {
                const cfg = STATUS_REPORT_CFG[r.status];
                return (
                  <div key={r.id} className="admin-verify-card">
                    <div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontWeight: 700 }}>{r.type}</span>
                        <span className="admin-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>
                        الهدف: {r.target} · المبلِّغ: {r.reporter} · {r.date}
                      </div>
                    </div>
                    {r.status === "open" && (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button className="admin-action-btn unban" onClick={() => updateReport(r.id, "resolved")}>
                          <Check size={13} /> حلّ
                        </button>
                        <button className="admin-action-btn warn" onClick={() => updateReport(r.id, "dismissed")}>
                          <X size={13} /> إغلاق
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Feature Flags ── */}
        {tab === "features" && (
          <div>
            <h2 className="admin-section-title">⚡ إدارة الميزات</h2>
            <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 20 }}>
              الميزات التالية معطّلة حالياً. يمكن تفعيلها عند الجاهزية.
            </p>
            <div className="admin-features-list">
              {features.map(f => (
                <div key={f.id} className="admin-feature-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                      {f.name}
                      {f.tag && <span className="coming-soon-badge">{f.tag}</span>}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>{f.desc}</div>
                  </div>
                  <div
                    className={`toggle ${f.enabled ? "on" : "off"}`}
                    onClick={() => toggleFeature(f.id)}
                    style={{ flexShrink: 0 }}
                  >
                    <div className="toggle-thumb" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {tab === "settings" && (
          <div>
            <h2 className="admin-section-title">⚙️ إعدادات المنصة</h2>
            <div className="admin-card" style={{ maxWidth: 600 }}>
              {[
                { label: "اسم المنصة", value: "Atlas Social" },
                { label: "البريد الرسمي", value: "admin@atlas.social" },
                { label: "نسخة النظام", value: "2.0.0-beta" },
                { label: "بيئة التشغيل", value: "تطوير (Mock Data)" },
              ].map(s => (
                <div key={s.label} className="settings-row">
                  <div className="settings-row-label">{s.label}</div>
                  <code style={{ fontSize: 12, background: "var(--surface2)", padding: "3px 8px", borderRadius: 6 }}>{s.value}</code>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Modals */}
      {showAddMember && <AddMemberModal onClose={() => setShowAddMember(false)} onAdd={m => setTeam(t => [...t, m])} />}
      {suspendTarget && <SuspendModal user={suspendTarget} onClose={() => setSuspendTarget(null)} onApply={applySuspend} />}
    </div>
  );
}
