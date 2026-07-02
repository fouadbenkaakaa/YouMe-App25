import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Lang } from "../i18n/translations";
import { TRANSLATIONS } from "../i18n/translations";

/* ──────────────────────────────
   Role architecture (future-ready, not enforced yet)
   ────────────────────────────── */
export type UserRole = "super_admin" | "admin" | "moderator" | "verification_manager" | "user";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "مدير عام",
  moderator: "مشرف",
  verification_manager: "مدير التحقق",
  user: "مستخدم",
};

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
  followingCount: number;
  postsCount: number;
  phone: string;
  email: string;
  role: UserRole;
}

interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: (key: string) => string;
  login: (user: User) => void;
  logout: () => void;
  updateCover: (url: string) => void;
  updateAvatar: (url: string) => void;
  navigateTo: (page: string) => void;
  registerNavigate: (fn: (page: string) => void) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  followedIds: Set<string>;
  toggleFollow: (id: string) => void;
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
  age: 28, gender: "ذكر", maritalStatus: "أعزب",
  friendsCount: 342, followersCount: 1205, followingCount: 89, postsCount: 87,
  phone: "05xxxxxxxx", email: "fouad@example.com",
  role: "admin",
};

/* Persist to localStorage with a key */
function usePersist<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch { return initial; }
  });
  const set = (v: T) => { setVal(v); localStorage.setItem(key, JSON.stringify(v)); };
  return [val, set];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkModeRaw] = usePersist<boolean>("atlas_dark", false);
  const [language, setLanguageRaw] = usePersist<Lang>("atlas_lang", "ar");
  const [_navigate, setNavigateFn] = useState<((p: string) => void) | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  /* Apply dark mode class to <html> */
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode",  darkMode);
    document.documentElement.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  /* Apply direction to <html> */
  useEffect(() => {
    const dir = TRANSLATIONS[language].dir;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const setDarkMode  = (v: boolean) => setDarkModeRaw(v);
  const setLanguage  = (l: Lang)    => setLanguageRaw(l);

  const t = (key: string): string =>
    (TRANSLATIONS[language] as any)[key] ?? (TRANSLATIONS.ar as any)[key] ?? key;

  const login        = (u: User)    => setUser(u);
  const logout       = ()           => setUser(null);
  const updateCover  = (url: string) => setUser(u => u ? { ...u, cover:  url } : u);
  const updateAvatar = (url: string) => setUser(u => u ? { ...u, avatar: url } : u);

  const registerNavigate = (fn: (p: string) => void) => setNavigateFn(() => fn);
  const navigateTo       = (page: string) => { if (_navigate) _navigate(page); };

  const toggleFollow = (id: string) =>
    setFollowedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <AppContext.Provider value={{
      user, isLoggedIn: !!user, darkMode, setDarkMode, language, setLanguage, t,
      login, logout, updateCover, updateAvatar, navigateTo, registerNavigate,
      viewingUserId, setViewingUserId, followedIds, toggleFollow,
    }}>
      {/* Wrapper div keeps existing CSS selectors working */}
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
