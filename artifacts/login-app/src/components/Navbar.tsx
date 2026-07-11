import "./YouMe_Navbar.css";
import { useState } from "react";
import {
  Home, Users, MessageCircle, Bell, Search, User, Sun, Moon,
  ShoppingBag, LayoutGrid, LogOut, Menu, X, Sparkles, Radio,
  Store, Film, ShieldCheck, Flag, CreditCard, Star, Truck, Car,
  BookOpen,
  Gamepad2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import VerificationBadge from "./VerificationBadge";
import type { BadgeType } from "./VerificationBadge";

const MY_BADGE: BadgeType = "blue";

/* ═══════════════════════════════════════════════════════════
   YouMe Brand Logo — SVG Component
   ═══════════════════════════════════════════════════════════ */
function YouMeLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="youmeGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <filter id="youmeGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#youmeGrad)" filter="url(#youmeGlow)" />
      <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">
        YM
      </text>
    </svg>
  );
}

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { user, darkMode, setDarkMode, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);

  const navItems = [
    { id: "home",          icon: Home,          label: "الرئيسية" },
    { id: "friends",       icon: Users,         label: "الأصدقاء" },
    { id: "messages",      icon: MessageCircle, label: "الرسائل",   badge: 7 },
    { id: "notifications", icon: Bell,          label: "الإشعارات", badge: 3 },
    { id: "reels",         icon: Film,          label: "الريلز" },
    { id: "live",          icon: Radio,         label: "مباشر" },
    { id: "groups",        icon: LayoutGrid,    label: "المجموعات" },
    { id: "marketplace",   icon: ShoppingBag,   label: "السوق" },
    { id: "books",         icon: BookOpen,      label: "كتب" },
    { id: "games",         icon: Gamepad2,      label: "ألعاب" },
  ];

  const go = (page: string) => { setCurrentPage(page); setMenuOpen(false); setProfileMenu(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* ── Brand ── */}
        <div className="navbar-brand" onClick={() => go("home")}>
          <div className="brand-logo"><YouMeLogo /></div>
          <span className="brand-name">YouMe</span>
        </div>

        {/* ── Search ── */}
        <div className="navbar-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="ابحث في YouMe..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go("smart-search")}
          />
        </div>

        {/* ── Nav Items ── */}
        <div className="navbar-items">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => go(item.id)}
              title={item.label}
            >
              <item.icon size={22} />
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="navbar-actions">
          {/* YouAI Button */}
          <button className="nav-ai-btn" onClick={() => go("ai-assistant")} title="YouAI - المساعد الذكي">
            <Sparkles size={16} />
            <span>YouAI</span>
          </button>

          {/* Dark Mode Toggle */}
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "وضع النهار" : "وضع الليل"}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-dropdown-wrap">
            <button className="profile-avatar-btn" onClick={() => setProfileMenu(!profileMenu)} title="الملف الشخصي">
              <img src={user?.avatar} alt={user?.name} />
              <span className="profile-btn-badge"><VerificationBadge type={MY_BADGE} size="sm" /></span>
            </button>

            <div className={`profile-dropdown ${profileMenu ? "open" : ""}`}>
              <div className="dropdown-header" onClick={() => go("profile")}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img src={user?.avatar} alt={user?.name} />
                  <span style={{ position: "absolute", bottom: -2, right: -2 }}>
                    <VerificationBadge type={MY_BADGE} size="sm" />
                  </span>
                </div>
                <div>
                  <div className="dropdown-name">{user?.name}</div>
                  <div className="dropdown-sub">عرض ملفك الشخصي</div>
                </div>
              </div>

              <div className="dropdown-divider" />

              {/* Navigation shortcuts */}
              <button className="dropdown-item" onClick={() => go("smart-search")}>
                <Search size={16} style={{ color: "#7C3AED" }} /> البحث الذكي
              </button>
              <button className="dropdown-item" onClick={() => go("store")}>
                <Store size={16} style={{ color: "#F59E0B" }} /> متجري
              </button>
              <button className="dropdown-item" onClick={() => go("map-market")}>
                <span style={{ fontSize: 16, color: "#10B981" }}>🗺️</span> خريطة السوق
              </button>
              <button className="dropdown-item" onClick={() => go("ai-assistant")}>
                <Sparkles size={16} style={{ color: "#7C3AED" }} /> المساعد الذكي
              </button>

              <div className="dropdown-divider" />
              <div className="dropdown-section-label">الخدمات</div>
              <button className="dropdown-item" onClick={() => go("payments")}>
                <CreditCard size={16} style={{ color: "#10B981" }} /> الاشتراكات والمدفوعات
              </button>
              <button className="dropdown-item" onClick={() => go("stars")}>
                <Star size={16} style={{ color: "#FBBF24" }} /> النجوم والهدايا
              </button>
              <button className="dropdown-item" onClick={() => go("delivery")}>
                <Truck size={16} style={{ color: "#3B82F6" }} /> YouMe Delivery
              </button>
              <button className="dropdown-item" onClick={() => go("ride")}>
                <Car size={16} style={{ color: "#EF4444" }} /> YouMe Ride
              </button>

              <div className="dropdown-divider" />
              <div className="dropdown-section-label">الحساب</div>
              <button className="dropdown-item verify-item" onClick={() => go("verification")}>
                <ShieldCheck size={16} style={{ color: "#3B82F6" }} /> التحقق الرسمي <VerificationBadge type={MY_BADGE} size="sm" />
              </button>
              <button className="dropdown-item" onClick={() => go("report")}>
                <Flag size={16} style={{ color: "#EF4444" }} /> الإبلاغ عن مخالفة
              </button>
              <button className="dropdown-item" onClick={() => go("settings")}>
                <User size={16} style={{ color: "#8B5CF6" }} /> الإعدادات والخصوصية
              </button>
              <button className="dropdown-item" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={16} style={{ color: "#F59E0B" }} /> : <Moon size={16} style={{ color: "#6366F1" }} />}
                {darkMode ? "وضع النهار" : "وضع الليل"}
              </button>

              <div className="dropdown-divider" />
              <button className="dropdown-item logout" onClick={logout}>
                <LogOut size={16} /> تسجيل الخروج
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} title="القائمة">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Nav Menu ── */}
      <div className={`mobile-nav-menu ${menuOpen ? "open" : ""}`}>
        {navItems.map(item => (
          <button key={item.id} className={`mobile-nav-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => go(item.id)}>
            <item.icon size={20} />
            <span>{item.label}</span>
            {item.badge && <span className="mobile-badge">{item.badge}</span>}
          </button>
        ))}
        <button className="mobile-nav-item" onClick={() => go("smart-search")}><Search size={20} /><span>البحث الذكي</span></button>
        <button className="mobile-nav-item" onClick={() => go("ai-assistant")}><Sparkles size={20} /><span>المساعد الذكي</span></button>
        <button className="mobile-nav-item" onClick={() => go("store")}><Store size={20} /><span>متجري</span></button>
        <button className="mobile-nav-item" onClick={() => go("map-market")}><span>🗺️</span><span>خريطة السوق</span></button>
        <button className="mobile-nav-item" onClick={() => go("payments")}><CreditCard size={20} /><span>المدفوعات</span></button>
        <button className="mobile-nav-item" onClick={() => go("stars")}><Star size={20} /><span>النجوم والهدايا</span></button>
        <button className="mobile-nav-item" onClick={() => go("delivery")}><Truck size={20} /><span>YouMe Delivery</span></button>
        <button className="mobile-nav-item" onClick={() => go("ride")}><Car size={20} /><span>YouMe Ride</span></button>
        <button className="mobile-nav-item" onClick={() => go("verification")}><ShieldCheck size={20} /><span>التحقق الرسمي</span></button>
        <button className="mobile-nav-item" onClick={() => go("report")}><Flag size={20} /><span>إبلاغ</span></button>
      </div>
    </nav>
  );
}
