import { Home, Users, MessageCircle, Bell, Video, Search, User, Sun, Moon, ShoppingBag, LayoutGrid, LogOut, Menu, X } from "lucide-react";
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
    { id: "home", icon: Home, label: "الرئيسية" },
    { id: "friends", icon: Users, label: "الأصدقاء" },
    { id: "messages", icon: MessageCircle, label: "الرسائل", badge: 7 },
    { id: "notifications", icon: Bell, label: "الإشعارات", badge: 3 },
    { id: "videos", icon: Video, label: "الفيديوهات" },
    { id: "groups", icon: LayoutGrid, label: "المجموعات" },
    { id: "marketplace", icon: ShoppingBag, label: "السوق" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => setCurrentPage("home")}>
          <div className="brand-logo">و</div>
          <span className="brand-name">وصلة</span>
        </div>

        <div className="navbar-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="ابحث في وصلة..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="navbar-items">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => setCurrentPage(item.id)}
              title={item.label}
            >
              <item.icon size={22} />
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setDarkMode(!darkMode)} title={darkMode ? "وضع النهار" : "وضع الليل"}>
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="profile-dropdown-wrap">
            <button className="profile-avatar-btn" onClick={() => setProfileMenu(!profileMenu)}>
              <img src={user?.avatar} alt={user?.name} />
            </button>
            {profileMenu && (
              <div className="profile-dropdown">
                <div className="dropdown-header" onClick={() => { setCurrentPage("profile"); setProfileMenu(false); }}>
                  <img src={user?.avatar} alt={user?.name} />
                  <div>
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-sub">عرض ملفك الشخصي</div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => { setCurrentPage("settings"); setProfileMenu(false); }}>
                  <User size={16} /> الإعدادات والخصوصية
                </button>
                <button className="dropdown-item" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                  {darkMode ? "وضع النهار" : "وضع الليل"}
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={logout}>
                  <LogOut size={16} /> تسجيل الخروج
                </button>
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
              onClick={() => { setCurrentPage(item.id); setMenuOpen(false); }}>
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge && <span className="mobile-badge">{item.badge}</span>}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
