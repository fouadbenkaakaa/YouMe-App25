import { createContext, useContext, useState, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  cover: string;
  bio: string;
  location: string;
  work: string;
  age: number;
  gender: string;
  maritalStatus: string;
  friendsCount: number;
  followersCount: number;
  postsCount: number;
  phone: string;
  email: string;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  updateCover: (url: string) => void;
  updateAvatar: (url: string) => void;
  navigateTo: (page: string) => void;
  registerNavigate: (fn: (page: string) => void) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const MOCK_USER: User = {
  id: "1",
  name: "فؤاد الأحمد",
  username: "fouad",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4",
  cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  bio: "مبرمج شغوف بالتقنية والابتكار 💻✨",
  location: "الرياض، المملكة العربية السعودية",
  work: "مطور برمجيات في شركة التقنية",
  age: 28,
  gender: "ذكر",
  maritalStatus: "أعزب",
  friendsCount: 342,
  followersCount: 1205,
  postsCount: 87,
  phone: "05xxxxxxxx",
  email: "fouad@example.com",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [_navigate, setNavigateFn] = useState<((page: string) => void) | null>(null);

  const login  = (u: User) => setUser(u);
  const logout = () => setUser(null);

  const updateCover  = (url: string) => setUser(u => u ? { ...u, cover:  url } : u);
  const updateAvatar = (url: string) => setUser(u => u ? { ...u, avatar: url } : u);

  // Components call this once to register the navigation handler from Shell
  const registerNavigate = (fn: (page: string) => void) =>
    setNavigateFn(() => fn);

  const navigateTo = (page: string) => {
    if (_navigate) _navigate(page);
  };

  return (
    <AppContext.Provider value={{
      user, isLoggedIn: !!user, darkMode, setDarkMode,
      login, logout, updateCover, updateAvatar, navigateTo, registerNavigate,
    }}>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
