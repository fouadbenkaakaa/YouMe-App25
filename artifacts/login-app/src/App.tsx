import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import FriendsPage from "./pages/FriendsPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import MarketplacePage from "./pages/MarketplacePage";
import GroupsPage from "./pages/GroupsPage";
import SettingsPage from "./pages/SettingsPage";
import SmartSearchPage from "./pages/SmartSearchPage";
import ReelsPage from "./pages/ReelsPage";
import LivePage from "./pages/LivePage";
import AIAssistantPage from "./pages/AIAssistantPage";
import MapMarketPage from "./pages/MapMarketPage";
import StorePage from "./pages/StorePage";

function Shell() {
  const { isLoggedIn } = useApp();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentPage, setCurrentPage] = useState("home");

  if (!isLoggedIn) {
    return authMode === "login"
      ? <LoginPage switchToRegister={() => setAuthMode("register")} />
      : <RegisterPage switchToLogin={() => setAuthMode("login")} />;
  }

  const isFullScreen = currentPage === "messages" || currentPage === "reels" || currentPage === "live" || currentPage === "ai-assistant";

  const renderPage = () => {
    switch (currentPage) {
      case "home":          return <HomePage />;
      case "friends":       return <FriendsPage />;
      case "messages":      return <MessagesPage />;
      case "notifications": return <NotificationsPage />;
      case "reels":         return <ReelsPage />;
      case "live":          return <LivePage />;
      case "profile":       return <ProfilePage />;
      case "marketplace":   return <MarketplacePage />;
      case "map-market":    return <MapMarketPage />;
      case "groups":        return <GroupsPage />;
      case "settings":      return <SettingsPage />;
      case "smart-search":  return <SmartSearchPage />;
      case "ai-assistant":  return <AIAssistantPage />;
      case "store":         return <StorePage />;
      default:              return <HomePage />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className={`page-wrapper ${isFullScreen ? "fullscreen-page" : ""}`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
