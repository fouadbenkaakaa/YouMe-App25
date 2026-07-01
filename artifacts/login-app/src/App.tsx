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

function Shell() {
  const { isLoggedIn } = useApp();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentPage, setCurrentPage] = useState("home");

  if (!isLoggedIn) {
    return authMode === "login"
      ? <LoginPage switchToRegister={() => setAuthMode("register")} />
      : <RegisterPage switchToLogin={() => setAuthMode("login")} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":         return <HomePage />;
      case "friends":     return <FriendsPage />;
      case "messages":    return <MessagesPage />;
      case "notifications": return <NotificationsPage />;
      case "profile":     return <ProfilePage />;
      case "marketplace": return <MarketplacePage />;
      case "groups":      return <GroupsPage />;
      case "settings":    return <SettingsPage />;
      default:            return <HomePage />;
    }
  };

  return (
    <div className="app-shell">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className={`page-wrapper ${currentPage === "messages" ? "messages-page" : ""}`}>
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
