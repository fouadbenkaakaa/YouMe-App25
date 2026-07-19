import { useEffect } from "react";
import {
  X, User, MessageCircle, Users, Flag, ShoppingBag, Gamepad2,
  Sparkles, Search, Calendar, Star, Truck, Car, Settings, Globe,
  Moon, Sun, HelpCircle, LogOut, ChevronLeft, Home, Zap, Plus
} from "lucide-react";
import { useApp } from "../context/AppContext";
import VerificationBadge from "./VerificationBadge";
import type { BadgeType } from "./VerificationBadge";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ isOpen, onClose }: ProfileDrawerProps) {
  const { user, logout, setCurrentPage, darkMode, setDarkMode } = useApp();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const go = (page: string) => {
    setCurrentPage(page);
    onClose();
  };

  const MY_BADGE: BadgeType = "blue";

  const services = [
    { icon: Users, label: "الأصدقاء", color: "#3B82F6", badge: null },
    { icon: MessageCircle, label: "الرسائل", color: "#8B5CF6", badge: "7", badgeColor: "#EF4444" },
    { icon: Users, label: "المجموعات", color: "#10B981", badge: null },
    { icon: Flag, label: "الصفحات", color: "#F59E0B", badge: null },
    { icon: ShoppingBag, label: "السوق", color: "#EC4899", badge: null },
    { icon: Gamepad2, label: "الألعاب", color: "#6366F1", badge: null },
    { icon: Sparkles, label: "YouAI", color: "#7C3AED", badge: "جديد", badgeColor: "#10B981" },
    { icon: Search, label: "البحث الذكي", color: "#06B6D4", badge: null },
    { icon: Calendar, label: "الأحداث", color: "#F97316", badge: null },
    { icon: Star, label: "النجوم والهدايا", color: "#FBBF24", badge: null },
    { icon: Truck, label: "YouMe Delivery", color: "#3B82F6", badge: "جديد", badgeColor: "#10B981" },
    { icon: Car, label: "YouMe Ride", color: "#EF4444", badge: "قريباُ", badgeColor: "#6366F1" },
  ];

  const settings = [
    { icon: Settings, label: "الإعدادات", action: () => go("settings") },
    { icon: Globe, label: "اللغة", action: () => {}, value: "العربية" },
    { icon: darkMode ? Sun : Moon, label: darkMode ? "وضع النهار" : "وضع الليل", action: () => setDarkMode(!darkMode), isSwitch: true },
    { icon: HelpCircle, label: "المساعدة والدعم", action: () => go("support") },
  ];

  return (
    <>
      <div className={`ympd-backdrop${isOpen ? " ympd-open" : ""}`} onClick={onClose} />

      <div className={`ympd-drawer${isOpen ? " ympd-open" : ""}`} dir="rtl">
        <button className="ympd-close-btn" onClick={onClose}><X size={20} /></button>

        {/* Section 1: Account Card */}
        <div className="ympd-header">
          <div className="ympd-header-bg" />
          <div className="ympd-user">
            <div className="ympd-avatar-wrap">
              <img src={user?.avatar || "/default-avatar.png"} alt={user?.name || "User"} className="ympd-avatar" />
              <div className="ympd-online-dot" />
            </div>
            <div className="ympd-user-info">
              <div className="ympd-name-row">
                <span className="ympd-name">{user?.name || "Fouad"}</span>
                <VerificationBadge type={MY_BADGE} size="sm" />
              </div>
              <span className="ympd-handle">@{user?.username || "fouad"}</span>
              <div className="ympd-level-badge-wrap">
                <span className="ympd-level-num">16</span>
                <span className="ympd-level-text">المستوى</span>
              </div>
            </div>
          </div>
          <div className="ympd-stats-row">
            <div className="ympd-stat-box"><span className="ympd-stat-value">128</span><span className="ympd-stat-label">الأصدقاء</span></div>
            <div className="ympd-stat-divider" />
            <div className="ympd-stat-box"><span className="ympd-stat-value">54</span><span className="ympd-stat-label">المتابعين</span></div>
            <div className="ympd-stat-divider" />
            <div className="ympd-stat-box"><span className="ympd-stat-value">72</span><span className="ympd-stat-label">المتابَعون</span></div>
          </div>
          <button className="ympd-view-profile-btn" onClick={() => go("profile")}>
            <User size={18} /> عرض ملفي الشخصي
          </button>
        </div>

        {/* Section 2: Services Grid */}
        <div className="ympd-section">
          <div className="ympd-section-title">
            <Sparkles size={14} style={{ color: "#A855F7" }} /> الخدمات الرئيسية
          </div>
          <div className="ympd-services-grid">
            {services.map((s, i) => (
              <button key={i} className="ympd-service-card" onClick={() => go(s.label)}>
                <div className="ympd-service-icon-wrap" style={{ color: s.color }}>
                  <s.icon size={24} />
                  {s.badge && <span className="ympd-service-badge" style={{ background: s.badgeColor }}>{s.badge}</span>}
                </div>
                <span className="ympd-service-label">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 3: Settings */}
        <div className="ympd-section">
          <div className="ympd-section-title">
            <Settings size={14} style={{ color: "#A855F7" }} /> الإعدادات والخيارات
          </div>
          <div className="ympd-settings-list">
            {settings.map((s, i) => (
              <button key={i} className="ympd-setting-row" onClick={s.action}>
                <div className="ympd-setting-icon-box"><s.icon size={18} /></div>
                <span className="ympd-setting-label">{s.label}</span>
                {s.isSwitch ? (
                  <div className={`ympd-toggle-switch${darkMode ? " ympd-active" : ""}`}><div className="ympd-toggle-thumb" /></div>
                ) : s.value ? (
                  <span className="ympd-setting-value">{s.value}</span>
                ) : (
                  <ChevronLeft size={16} className="ympd-setting-arrow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Logout */}
        <button className="ympd-logout-btn" onClick={logout}>
          <LogOut size={18} /> تسجيل الخروج
        </button>

        {/* Bottom Nav */}
        <div className="ympd-bottom-nav">
          <button className="ympd-nav-item ympd-nav-active" onClick={() => go("home")}><Home size={20} /><span>الرئيسية</span></button>
          <button className="ympd-nav-item" onClick={() => go("groups")}><Users size={20} /><span>المجموعات</span></button>
          <button className="ympd-nav-plus-btn" onClick={() => go("create")}><Plus size={24} /></button>
          <button className="ympd-nav-item" onClick={() => go("activity")}><Zap size={20} /><span>النشاط</span></button>
          <button className="ympd-nav-item" onClick={() => go("profile")}><User size={20} /><span>الملف</span></button>
        </div>
      </div>
    </>
  );
}
