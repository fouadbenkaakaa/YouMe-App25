import { Home, Users, MessageCircle, Bell, Video, Search, User, Sun, Moon, ShoppingBag, LayoutGrid, LogOut, Menu, X, Sparkles, Radio, Store, Film } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useState } from "react";

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
    { id: "home",          icon: Home,           label: "الرئيسية" },
    { id: "friends",       icon: Users,          label: "الأصدقاء" },
    { id: "messages",      icon: MessageCircle,  label: "الرسائل",  badge: 7 },
    { id: "notifications", icon: Bell,           label: "الإشعارات", badge: 3 },
    { id: "reels",         icon: Film,           label: "الريلز" },
    { id: "live",          icon: Radio,          label: "مباشر" },
    { id: "groups",        icon: LayoutGrid,     label: "المجموعات" },
    { id: "marketplace",   icon: ShoppingBag,    label: "السوق" },
  ];

  const go = (page: string) => { setCurrentPage(page); setMenuOpen(false); setProfileMenu(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => go("home")}>
          <div className="brand-logo">A</div>
          <span className="brand-name">Atlas Social</span>
        </div>

        <div className="navbar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="ابحث في Atlas Social..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && go("smart-search")}
          />
        </div>

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

        <div className="navbar-actions">
          <button className="nav-ai-btn" onClick={() => go("ai-assistant")} title="المساعد الذكي">
            <Sparkles size={18} /> AI
          </button>

          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "وضع النهار" : "وضع الليل"}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="profile-dropdown-wrap">
            <button className="profile-avatar-btn" onClick={() => setProfileMenu(!profileMenu)}>
              <img src={user?.avatar} alt={user?.name} />
            </button>
            {profileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header" onClick={() => go("profile")}>
                  <img src={user?.avatar} alt={user?.name} />
                  <div>
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-sub">عرض ملفك الشخصي</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => go("smart-search")}><Search size={16} /> البحث الذكي</button>
                <button className="dropdown-item" onClick={() => go("store")}><Store size={16} /> متجري</button>
                <button className="dropdown-item" onClick={() => go("map-market")}><span>🗺️</span> خريطة السوق</button>
                <button className="dropdown-item" onClick={() => go("ai-assistant")}><Sparkles size={16} /> المساعد الذكي</button>
                <button className="dropdown-item" onClick={() => go("settings")}><User size={16} /> الإعدادات والخصوصية</button>
                <button className="dropdown-item" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  {darkMode ? "وضع النهار" : "وضع الليل"}
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={logout}><LogOut size={16} /> تسجيل الخروج</button>
              </div>
            )}
          </div>

          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-nav-menu">
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
        </div>
      )}
    </nav>
  );
}
