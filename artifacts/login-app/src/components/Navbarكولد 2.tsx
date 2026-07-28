import "./YouMe_Navbar.css";
import ProfileDrawer from "./ProfileDrawer";
import "./ProfileDrawer.css";
import { useState } from "react";
import {
  Home, Users, MessageCircle, Bell, Search, Sun, Moon,
  ShoppingBag, LayoutGrid, Menu, X, Sparkles, Radio,
  Film, BookOpen, Gamepad2
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

  const go = (page: string) => { setCurrentPage(page); setProfileMenu(false); };

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

          {/* Profile Drawer — القائمة الموحّدة الوحيدة في التطبيق */}
          <ProfileDrawer
            isOpen={profileMenu}
            onClose={() => setProfileMenu(false)}
          />

          {/* صورة البروفايل — عرض فقط، بلا قائمة منسدلة خاصة بها */}
          <div className="profile-avatar-btn" title={user?.name}>
            <img src={user?.avatar} alt={user?.name} />
            <span className="profile-btn-badge">
              <VerificationBadge type={MY_BADGE} size="sm" />
            </span>
          </div>

          {/* زر القائمة — يفتح القائمة الموحّدة (ProfileDrawer) */}
          <button className="icon-btn mobile-menu-btn" onClick={() => setProfileMenu(!profileMenu)} title="القائمة">
            {profileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </nav>
  );
}