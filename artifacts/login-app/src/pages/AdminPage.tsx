import { useState } from "react";
import {
  LayoutDashboard, Users, ShieldCheck, Briefcase, Flag, CreditCard,
  Settings, Search, Plus, Check, X, Clock, AlertTriangle, Eye, Ban,
  Edit3, Trash2, Star, TrendingUp, Package, Car, Store, Bell,
  ChevronDown, ChevronUp, UserPlus, RefreshCw, Filter, Download
} from "lucide-react";

/* ──────────── Mock data ──────────── */
const STATS = [
  { label: "المستخدمون",     value: "124,830", icon: Users,         trend: "+3.2%",  color: "#3b82f6" },
  { label: "المنشورات اليوم", value: "8,412",   icon: TrendingUp,    trend: "+12%",   color: "#22c55e" },
  { label: "المتاجر النشطة",  value: "3,210",   icon: Store,         trend: "+5.1%",  color: "#f59e0b" },
  { label: "طلبات التوصيل",  value: "1,847",   icon: Package,       trend: "+18%",   color: "#a855f7" },
  { label: "رحلات النقل",    value: "924",     icon: Car,           trend: "+7%",    color: "#ef4444" },
  { label: "البلاغات المفتوحة", value: "47",   icon: Flag,          trend: "-8%",    color: "#6b7280" },
];

type Role = "admin" | "supervisor" | "operator" | "support";

interface TeamMember {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  joinedAt: string;
  avatar: string;
  permissions: string[];
}

const ROLES: Record<Role, { label: string; color: string; bg: string }> = {
  admin:      { label: "مدير عام",   color: "#7c3aed", bg: "#ede9fe" },
  supervisor: { label: "مشرف",       color: "#3b82f6", bg: "#dbeafe" },
  operator:   { label: "متعامل",     color: "#22c55e", bg: "#dcfce7" },
  support:    { label: "دعم فني",    color: "#f59e0b", bg: "#fef3c7" },
};

const ALL_PERMISSIONS = [
  "إدارة المستخدمين", "مراجعة البلاغات", "طلبات التحقق",
  "إدارة المتاجر", "إدارة المدفوعات", "عرض الإحصائيات",
  "تعديل الإعدادات", "إدارة الإعلانات", "تعليق الحسابات",
];

const INIT_TEAM: TeamMember[] = [
  { id: "t1", name: "فؤاد الأحمد",     username: "fouad",       email: "fouad@atlas.social",    role: "admin",      status: "active",   joinedAt: "2024-01-01", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4",   permissions: ALL_PERMISSIONS },
  { id: "t2", name: "سارة المنصور",    username: "sara_m",      email: "sara@atlas.social",     role: "supervisor", status: "active",   joinedAt: "2025-03-12", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",    permissions: ["مراجعة البلاغات", "طلبات التحقق", "إدارة المستخدمين"] },
  { id: "t3", name: "خالد الزهراني",   username: "khaled_z",    email: "khaled@atlas.social",   role: "supervisor", status: "active",   joinedAt: "2025-06-01", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",  permissions: ["مراجعة البلاغات", "إدارة المتاجر"] },
  { id: "t4", name: "نورة الشمري",     username: "noura_sh",    email: "noura@atlas.social",    role: "operator",   status: "active",   joinedAt: "2025-09-14", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",   permissions: ["إدارة المتاجر", "عرض الإحصائيات"] },
  { id: "t5", name: "محمد العمري",     username: "mohammed_a",  email: "m.amri@atlas.social",   role: "support",    status: "inactive", joinedAt: "2025-11-02", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", permissions: ["مراجعة البلاغات"] },
];

type VerifyReqStatus = "pending" | "approved" | "rejected" | "more-info";
interface VerifyReq { id: string; name: string; type: string; badge: string; date: string; status: VerifyReqStatus; avatar: string; }
const VERIFY_REQS: VerifyReq[] = [
  { id: "v1", name: "طارق المحمدي",    type: "شخصية عامة",  badge: "🔵", date: "2026-07-01", status: "pending",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarek&backgroundColor=b6e3f4" },
  { id: "v2", name: "متجر الإلكترونيات", type: "متجر رسمي", badge: "🟢", date: "2026-06-30", status: "pending",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elec&backgroundColor=d1d4f9" },
  { id: "v3", name: "بلدية الرياض",    type: "جهة حكومية",  badge: "🟡", date: "2026-06-28", status: "approved",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gov&backgroundColor=ffdfbf" },
  { id: "v4", name: "جمعية الخير",     type: "جمعية خيرية",  badge: "🟣", date: "2026-06-25", status: "rejected",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=charity&backgroundColor=c0aede" },
];

interface Report { id: string; type: string; target: string; reporter: string; date: string; status: "open" | "resolved" | "dismissed"; }
const REPORTS: Report[] = [
  { id: "r1", type: "انتحال هوية",   target: "@fake_celebrity",  reporter: "أحمد",  date: "2026-07-01", status: "open" },
  { id: "r2", type: "محتوى ضار",     target: "منشور #8812",      reporter: "فاطمة", date: "2026-06-30", status: "open" },
  { id: "r3", type: "بريد مزعج",    target: "@spammer88",        reporter: "عمر",   date: "2026-06-29", status: "resolved" },
  { id: "r4", type: "تحرش / تنمر",  target: "@harasser2",        reporter: "منى",   date: "2026-06-28", status: "dismissed" },
];

interface PlatformUser { id: string; name: string; username: string; status: "active" | "warned" | "suspended"; verified: string | null; joinedAt: string; posts: number; avatar: string; }
const PLATFORM_USERS: PlatformUser[] = [
  { id: "u1", name: "سارة المنصور",    username: "sara_m",    status: "active",    verified: "🔵", joinedAt: "2025-02-10", posts: 234,  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara2&backgroundColor=ffdfbf" },
  { id: "u2", name: "محمد البلوي",     username: "m_balawi",  status: "warned",    verified: null,  joinedAt: "2025-07-18", posts: 12,   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=moha&backgroundColor=d1d4f9" },
  { id: "u3", name: "نورة الشمري",     username: "noura_sh2", status: "active",    verified: "🟢", joinedAt: "2025-11-01", posts: 580,  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura2&backgroundColor=c0aede" },
  { id: "u4", name: "فهد الدوسري",     username: "fahd_d",    status: "suspended", verified: null,  joinedAt: "2024-09-05", posts: 3,    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fahd&backgroundColor=b6e3f4" },
];

const STATUS_USER_CFG = {
  active:    { label: "نشط",     color: "#22c55e", bg: "#dcfce7" },
  warned:    { label: "منذر",    color: "#f59e0b", bg: "#fef3c7" },
  suspended: { label: "موقوف",   color: "#ef4444", bg: "#fee2e2" },
};
const STATUS_REPORT_CFG = {
  open:      { label: "مفتوح",   color: "#f59e0b", bg: "#fef3c7" },
  resolved:  { label: "محلول",   color: "#22c55e", bg: "#dcfce7" },
  dismissed: { label: "مُغلق",   color: "#6b7280", bg: "#f3f4f6" },
};
const STATUS_VERIFY_CFG: Record<VerifyReqStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "قيد المراجعة",    color: "#f59e0b", bg: "#fef3c7" },
  approved:   { label: "موافق عليه",      color: "#22c55e", bg: "#dcfce7" },
  rejected:   { label: "مرفوض",           color: "#ef4444", bg: "#fee2e2" },
  "more-info": { label: "يحتاج معلومات", color: "#f97316", bg: "#ffedd5" },
};

/* ──────────── Add Member Modal ──────────── */
function AddMemberModal({ onClose, onAdd }: { onClose: () => void; onAdd: (m: TeamMember) => void }) {
  const [form, setForm] = useState({ name: "", username: "", email: "", role: "supervisor" as Role, permissions: [] as string[] });
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const togglePerm = (p: string) => set("permissions", form.permissions.includes(p) ? form.permissions.filter(x => x !== p) : [...form.permissions, p]);

  const defaultPerms: Record<Role, string[]> = {
    admin:      ALL_PERMISSIONS,
    supervisor: ["مراجعة البلاغات", "طلبات التحقق", "إدارة المستخدمين"],
    operator:   ["إدارة المتاجر", "عرض الإحصائيات"],
    support:    ["مراجعة البلاغات"],
  };

  const handleRoleChange = (r: Role) => setForm(f => ({ ...f, role: r, permissions: defaultPerms[r] }));

  const handleSubmit = () => {
    if (!form.name || !form.username || !form.email) return;
    onAdd({
      id: "t" + Date.now(),
      name: form.name, username: form.username, email: form.email,
      role: form.role, status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}&backgroundColor=b6e3f4`,
      permissions: form.permissions,
    });
    onClose();
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
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
            <div className="radio-options" style={{ flexWrap: "wrap" }}>
              {(Object.keys(ROLES) as Role[]).map(r => (
                <label key={r} className={`radio-opt-sm ${form.role === r ? "selected" : ""}`} onClick={() => handleRoleChange(r)}>
                  {ROLES[r].label}
                </label>
              ))}
            </div>
          </div>
          <div className="store-field full">
            <label>الصلاحيات</label>
            <div className="hobbies-picker">
              {ALL_PERMISSIONS.map(p => (
                <label key={p} className={`hobby-chip ${form.permissions.includes(p) ? "selected" : ""}`}
                  onClick={() => togglePerm(p)}>{p}</label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={onClose}>إلغاء</button>
          <button className="btn-primary" style={{ flex: 1 }} disabled={!form.name || !form.username || !form.email} onClick={handleSubmit}>
            <UserPlus size={16} /> إضافة العضو
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────── Main Admin Page ──────────── */
type AdminTab = "overview" | "users" | "team" | "verification" | "reports" | "payments" | "settings";

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const [team, setTeam] = useState<TeamMember[]>(INIT_TEAM);
  const [verifyReqs, setVerifyReqs] = useState(VERIFY_REQS);
  const [reports, setReports] = useState(REPORTS);
  const [platUsers, setPlatUsers] = useState(PLATFORM_USERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const handleVerify = (id: string, status: VerifyReqStatus) =>
    setVerifyReqs(v => v.map(r => r.id === id ? { ...r, status } : r));

  const handleReport = (id: string, status: "resolved" | "dismissed") =>
    setReports(r => r.map(x => x.id === id ? { ...x, status } : x));

  const handleUserAction = (id: string, action: "warn" | "suspend" | "activate") => {
    const map = { warn: "warned", suspend: "suspended", activate: "active" } as const;
    setPlatUsers(u => u.map(x => x.id === id ? { ...x, status: map[action] } : x));
  };

  const handleDeleteMember = (id: string) => setTeam(t => t.filter(m => m.id !== id));

  const filteredTeam = team.filter(m =>
    (roleFilter === "all" || m.role === roleFilter) &&
    (m.name.includes(search) || m.username.includes(search) || m.email.includes(search))
  );

  const TAB_ITEMS: { id: AdminTab; icon: any; label: string; badge?: number }[] = [
    { id: "overview",     icon: LayoutDashboard, label: "نظرة عامة" },
    { id: "users",        icon: Users,           label: "المستخدمون",         badge: platUsers.length },
    { id: "team",         icon: Briefcase,       label: "فريق الإدارة",       badge: team.length },
    { id: "verification", icon: ShieldCheck,     label: "طلبات التحقق",       badge: verifyReqs.filter(r => r.status === "pending").length },
    { id: "reports",      icon: Flag,            label: "البلاغات",           badge: reports.filter(r => r.status === "open").length },
    { id: "payments",     icon: CreditCard,      label: "المدفوعات" },
    { id: "settings",     icon: Settings,        label: "الإعدادات" },
  ];

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="brand-logo" style={{ background: "#ef4444" }}>⚙</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14 }}>Atlas Admin</div>
            <div style={{ fontSize: 11, color: "var(--text2)" }}>لوحة التحكم</div>
          </div>
        </div>
        <nav className="admin-nav">
          {TAB_ITEMS.map(item => (
            <button key={item.id}
              className={`admin-nav-item ${tab === item.id ? "active" : ""}`}
              onClick={() => setTab(item.id)}>
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && <span className="admin-nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-version">v2.0 · Atlas Social</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>📊 نظرة عامة على المنصة</h2>
              <button className="admin-refresh-btn"><RefreshCw size={16} /> تحديث</button>
            </div>

            <div className="admin-stats-grid">
              {STATS.map((s, i) => (
                <div key={i} className="admin-stat-card" style={{ "--stat-color": s.color } as any}>
                  <div className="admin-stat-icon" style={{ background: s.color + "22", color: s.color }}>
                    <s.icon size={22} />
                  </div>
                  <div className="admin-stat-info">
                    <div className="admin-stat-value">{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                  <div className={`admin-stat-trend ${s.trend.startsWith("+") ? "up" : "down"}`}>{s.trend}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="admin-quick-actions">
              <h3>إجراءات سريعة</h3>
              <div className="admin-quick-grid">
                <button className="admin-quick-btn" onClick={() => setTab("verification")}>
                  <ShieldCheck size={20} />
                  <span>مراجعة التحقق</span>
                  <span className="admin-quick-badge">{verifyReqs.filter(r => r.status === "pending").length}</span>
                </button>
                <button className="admin-quick-btn" onClick={() => setTab("reports")}>
                  <Flag size={20} />
                  <span>مراجعة البلاغات</span>
                  <span className="admin-quick-badge">{reports.filter(r => r.status === "open").length}</span>
                </button>
                <button className="admin-quick-btn" onClick={() => { setTab("team"); setShowAddModal(true); }}>
                  <UserPlus size={20} />
                  <span>إضافة مشرف</span>
                </button>
                <button className="admin-quick-btn" onClick={() => setTab("users")}>
                  <Users size={20} />
                  <span>إدارة المستخدمين</span>
                </button>
              </div>
            </div>

            {/* Recent activity */}
            <div className="admin-recent">
              <h3>آخر النشاطات</h3>
              {[
                { icon: "✅", text: "تم قبول طلب التحقق لـ بلدية الرياض",        time: "منذ ساعة" },
                { icon: "🚨", text: "بلاغ جديد: انتحال هوية @fake_celebrity",    time: "منذ 2 ساعة" },
                { icon: "👤", text: "مستخدم جديد: سارة المنصور انضمت للمنصة",    time: "منذ 3 ساعات" },
                { icon: "💳", text: "اشتراك بريميوم جديد من طارق المحمدي",        time: "منذ 4 ساعات" },
                { icon: "🏪", text: "متجر جديد: إلكترونيات الخليج",              time: "منذ 5 ساعات" },
              ].map((a, i) => (
                <div key={i} className="admin-activity-item">
                  <span className="activity-icon">{a.icon}</span>
                  <span className="activity-text">{a.text}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Platform Users ── */}
        {tab === "users" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>👥 إدارة المستخدمين</h2>
              <button className="admin-export-btn"><Download size={15} /> تصدير</button>
            </div>
            <div className="admin-search-bar">
              <Search size={16} />
              <input placeholder="ابحث بالاسم أو المستخدم..." />
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>المستخدم</th>
                    <th>الحالة</th>
                    <th>التحقق</th>
                    <th>المنشورات</th>
                    <th>تاريخ الانضمام</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {platUsers.map(u => {
                    const st = STATUS_USER_CFG[u.status];
                    return (
                      <tr key={u.id}>
                        <td>
                          <div className="admin-user-cell">
                            <img src={u.avatar} alt={u.name} className="admin-user-avatar" />
                            <div>
                              <div className="admin-user-name">{u.name}</div>
                              <div className="admin-user-uname">@{u.username}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="admin-badge" style={{ color: st.color, background: st.bg }}>{st.label}</span></td>
                        <td>{u.verified || <span style={{ color: "var(--text3)" }}>—</span>}</td>
                        <td style={{ fontWeight: 700 }}>{u.posts.toLocaleString("ar")}</td>
                        <td style={{ fontSize: 12, color: "var(--text2)" }}>{u.joinedAt}</td>
                        <td>
                          <div className="admin-actions-row">
                            <button className="admin-action-btn" title="عرض" onClick={() => {}}><Eye size={15} /></button>
                            {u.status !== "warned"    && <button className="admin-action-btn warn"    title="إنذار"   onClick={() => handleUserAction(u.id, "warn")}><AlertTriangle size={15} /></button>}
                            {u.status !== "suspended" && <button className="admin-action-btn danger"  title="تعليق"   onClick={() => handleUserAction(u.id, "suspend")}><Ban size={15} /></button>}
                            {u.status !== "active"    && <button className="admin-action-btn success" title="تفعيل"   onClick={() => handleUserAction(u.id, "activate")}><Check size={15} /></button>}
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

        {/* ── Team Management ── */}
        {tab === "team" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>👔 فريق الإدارة</h2>
              <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                <UserPlus size={16} /> إضافة عضو
              </button>
            </div>

            {/* Filter bar */}
            <div className="admin-filter-bar">
              <div className="admin-search-bar" style={{ flex: 1 }}>
                <Search size={16} />
                <input placeholder="ابحث بالاسم أو الإيميل..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="admin-role-filter">
                {(["all", "admin", "supervisor", "operator", "support"] as const).map(r => (
                  <button key={r}
                    className={`admin-role-btn ${roleFilter === r ? "active" : ""}`}
                    onClick={() => setRoleFilter(r)}>
                    {r === "all" ? "الكل" : ROLES[r].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="team-members-list">
              {filteredTeam.map(member => {
                const role = ROLES[member.role];
                const isExpanded = expandedMember === member.id;
                return (
                  <div key={member.id} className="team-member-card">
                    <div className="team-member-main" onClick={() => setExpandedMember(isExpanded ? null : member.id)}>
                      <img src={member.avatar} alt={member.name} className="team-member-avatar" />
                      <div className="team-member-info">
                        <div className="team-member-name">{member.name}</div>
                        <div className="team-member-meta">@{member.username} · {member.email}</div>
                        <div className="team-member-join">انضم: {member.joinedAt}</div>
                      </div>
                      <div className="team-member-right">
                        <span className="admin-badge" style={{ color: role.color, background: role.bg }}>{role.label}</span>
                        <span className={`team-status-dot ${member.status}`} title={member.status} />
                        {member.id !== "t1" && (
                          <button className="admin-action-btn danger" onClick={e => { e.stopPropagation(); handleDeleteMember(member.id); }}><Trash2 size={15} /></button>
                        )}
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="team-member-expand">
                        <div className="team-permissions-title">الصلاحيات الممنوحة:</div>
                        <div className="team-permissions-list">
                          {member.permissions.map(p => (
                            <span key={p} className="perm-chip active">{p}</span>
                          ))}
                          {ALL_PERMISSIONS.filter(p => !member.permissions.includes(p)).map(p => (
                            <span key={p} className="perm-chip">{p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Roles legend */}
            <div className="roles-legend">
              <h4>دليل الأدوار والصلاحيات</h4>
              <div className="roles-legend-grid">
                {(Object.entries(ROLES) as [Role, any][]).map(([id, r]) => (
                  <div key={id} className="role-legend-item">
                    <span className="admin-badge" style={{ color: r.color, background: r.bg }}>{r.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text2)" }}>
                      {id === "admin"      && "صلاحيات كاملة على كل المنصة"}
                      {id === "supervisor" && "مراجعة البلاغات والتحقق وإدارة المستخدمين"}
                      {id === "operator"   && "إدارة المتاجر وعرض الإحصائيات"}
                      {id === "support"    && "الدعم الفني ومراجعة البلاغات"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Verification Requests ── */}
        {tab === "verification" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>✅ طلبات التحقق الرسمي</h2>
            </div>
            <div className="verify-requests-list">
              {verifyReqs.map(req => {
                const cfg = STATUS_VERIFY_CFG[req.status];
                return (
                  <div key={req.id} className="verify-req-card">
                    <img src={req.avatar} alt={req.name} className="admin-user-avatar" />
                    <div style={{ flex: 1 }}>
                      <div className="admin-user-name">{req.name}</div>
                      <div className="admin-user-uname">{req.badge} {req.type} · {req.date}</div>
                    </div>
                    <span className="admin-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                    {req.status === "pending" && (
                      <div className="admin-actions-row">
                        <button className="admin-action-btn success" title="قبول"    onClick={() => handleVerify(req.id, "approved")}><Check size={16} /></button>
                        <button className="admin-action-btn"        title="أكثر"     onClick={() => handleVerify(req.id, "more-info")}><AlertTriangle size={16} /></button>
                        <button className="admin-action-btn danger" title="رفض"      onClick={() => handleVerify(req.id, "rejected")}><X size={16} /></button>
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
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>🚨 إدارة البلاغات</h2>
            </div>
            <div className="verify-requests-list">
              {reports.map(r => {
                const cfg = STATUS_REPORT_CFG[r.status];
                return (
                  <div key={r.id} className="verify-req-card">
                    <div className="report-admin-icon"><Flag size={18} /></div>
                    <div style={{ flex: 1 }}>
                      <div className="admin-user-name">{r.type}</div>
                      <div className="admin-user-uname">{r.target} · أبلغ عنه: {r.reporter} · {r.date}</div>
                    </div>
                    <span className="admin-badge" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                    {r.status === "open" && (
                      <div className="admin-actions-row">
                        <button className="admin-action-btn success" title="حل"    onClick={() => handleReport(r.id, "resolved")}><Check size={16} /></button>
                        <button className="admin-action-btn"        title="رفض"    onClick={() => handleReport(r.id, "dismissed")}><X size={16} /></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Payments ── */}
        {tab === "payments" && (
          <div className="admin-section">
            <div className="admin-section-header"><h2>💳 نظرة مالية</h2></div>
            <div className="admin-stats-grid">
              {[
                { label: "الإيرادات هذا الشهر",  value: "42,840 ريال",  color: "#22c55e" },
                { label: "الاشتراكات النشطة",     value: "3,214",        color: "#3b82f6" },
                { label: "مبيعات النجوم",          value: "8,920 ريال",   color: "#f59e0b" },
                { label: "عمولة التوصيل",          value: "12,480 ريال",  color: "#a855f7" },
                { label: "عمولة النقل",            value: "6,340 ريال",   color: "#ef4444" },
                { label: "إجمالي السنة",           value: "384,200 ريال", color: "#7c3aed" },
              ].map((s, i) => (
                <div key={i} className="admin-stat-card">
                  <div className="admin-stat-icon" style={{ background: s.color + "22", color: s.color }}>
                    <CreditCard size={22} />
                  </div>
                  <div className="admin-stat-info">
                    <div className="admin-stat-value" style={{ fontSize: 18 }}>{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Settings ── */}
        {tab === "settings" && (
          <div className="admin-section">
            <div className="admin-section-header"><h2>⚙️ إعدادات المنصة</h2></div>
            <div className="admin-settings-list">
              {[
                { label: "السماح بالتسجيل الجديد",         default: true },
                { label: "تفعيل نظام التحقق",               default: true },
                { label: "تفعيل ATLAS DELIVERY",             default: true },
                { label: "تفعيل ATLAS RIDE",                 default: true },
                { label: "تفعيل النجوم والهدايا",            default: true },
                { label: "وضع الصيانة",                      default: false },
                { label: "تفعيل إشعارات البريد الإلكتروني", default: true },
                { label: "السماح بالإعلانات المدفوعة",       default: true },
              ].map((s, i) => (
                <div key={i} className="admin-setting-row">
                  <span>{s.label}</span>
                  <div className={`admin-toggle ${s.default ? "on" : "off"}`}>
                    <div className="admin-toggle-knob" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add member modal */}
      {showAddModal && <AddMemberModal onClose={() => setShowAddModal(false)} onAdd={m => setTeam(t => [...t, m])} />}
    </div>
  );
}
