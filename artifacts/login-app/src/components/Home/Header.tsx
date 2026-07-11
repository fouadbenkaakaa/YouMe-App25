import { Bell, Search, MessageCircle, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Header() {
  const { user } = useApp();

  return (
    <div className="header-card">
      <div>
        <h2>👋 مرحباً {user?.name}</h2>
        <p>نتمنى لك يوماً سعيداً في YouMe</p>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Bell size={20} />
        <Search size={20} />
        <MessageCircle size={20} />
        <Settings size={20} />
      </div>
    </div>
  );
}