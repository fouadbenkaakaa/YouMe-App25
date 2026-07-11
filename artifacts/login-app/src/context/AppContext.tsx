import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Lang } from "../i18n/translations";
import { TRANSLATIONS } from "../i18n/translations";

// ──────────────────────────────────────────────
//  UUID Generator for unique user IDs
// ──────────────────────────────────────────────
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ──────────────────────────────────────────────
//  Role architecture
// ──────────────────────────────────────────────
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
  points: number;
  badges: string[];
  rank: string;
  isVerified?: boolean;
  verificationColor?: string;
  // New fields for extended profile
  country?: string;
  city?: string;
  address?: string;
}

// ──────────────────────────────────────────────
//  Default users (fallback when no user exists)
// ──────────────────────────────────────────────
export const ADMIN_USER: User = {
  id: "admin-fouad",
  name: "ADMIN YouMe",
  username: "admin",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=ff6b6b",
  cover: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
  bio: "مدير التطبيق الرئيسي 👑",
  location: "الرياض، المملكة العربية السعودية",
  work: "مدير YouMe",
  age: 35, gender: "ذكر", maritalStatus: "متزوج",
  friendsCount: 999, followersCount: 9999, followingCount: 0, postsCount: 500,
  phone: "05xxxxxxxx", email: "fouadbenkaakaa@gmail.com",
  role: "super_admin",
  points: 99999,
  badges: ["first-win", "organizer", "popular", "ai-master", "speed-king", "legend", "social"],
  rank: "قاهر",
  isVerified: true,
  verificationColor: "#EF4444",
};

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
  points: 2500,
  badges: ["first-win", "organizer"],
  rank: "ذهبي",
  isVerified: true,
  verificationColor: "#3B82F6",
};

// ──────────────────────────────────────────────
//  AppContext Type
// ──────────────────────────────────────────────
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
  updateUser: (updatedUser: User) => void;
  updateCover: (url: string) => void;
  updateAvatar: (url: string) => void;
  navigateTo: (page: string) => void;
  registerNavigate: (fn: (page: string) => void) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;
  followedIds: Set<string>;
  toggleFollow: (id: string) => void;
  addPoints: (points: number) => void;
  addBadge: (badgeId: string) => void;
  updateRank: (rank: string) => void;
  isAdmin: boolean;
  generateNewUserId: () => string;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

// ──────────────────────────────────────────────
//  Helper: safe localStorage read/write
// ──────────────────────────────────────────────
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key} to localStorage:`, e);
  }
}

// ──────────────────────────────────────────────
//  Helper: persist state to localStorage
// ──────────────────────────────────────────────
function usePersist<T>(key: string, initial: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(() => safeGetItem(key, initial));
  const set = useCallback((v: T) => {
    setVal(v);
    safeSetItem(key, v);
  }, [key]);
  return [val, set];
}

// ──────────────────────────────────────────────
//  AppProvider
// ──────────────────────────────────────────────
export function AppProvider({ children }: { children: ReactNode }) {
  // ── Load user from localStorage ──
  const [user, setUser] = useState<User | null>(() => {
    const stored = safeGetItem<User | null>("youme_user", null);
    return stored;
  });

  const [darkMode, setDarkModeRaw] = usePersist<boolean>("atlas_dark", false);
  const [language, setLanguageRaw] = usePersist<Lang>("atlas_lang", "ar");
  const [_navigate, setNavigateFn] = useState<((p: string) => void) | null>(null);
  const [viewingUserId, setViewingUserIdRaw] = useState<string | null>(() =>
    safeGetItem("youme_viewing_user_id", null)
  );
  const [followedIds, setFollowedIdsRaw] = useState<Set<string>>(() =>
    new Set(safeGetItem<string[]>("youme_followed_ids", []))
  );

  // ── Check if user is admin ──
  const isAdmin = user?.role === "super_admin" || user?.role === "admin";

  // ── Apply dark mode class to <html> ──
  useEffect(() => {
    document.documentElement.classList.toggle("dark-mode", darkMode);
    document.documentElement.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  // ── Apply direction to <html> ──
  useEffect(() => {
    const dir = TRANSLATIONS[language].dir;
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  // ── Auto-save user to localStorage whenever user changes ──
  useEffect(() => {
    if (user) {
      safeSetItem("youme_user", user);
    }
  }, [user]);

  // ── Auto-save viewingUserId ──
  useEffect(() => {
    safeSetItem("youme_viewing_user_id", viewingUserId);
  }, [viewingUserId]);

  // ── Auto-save followedIds ──
  useEffect(() => {
    safeSetItem("youme_followed_ids", Array.from(followedIds));
  }, [followedIds]);

  const setDarkMode = useCallback((v: boolean) => setDarkModeRaw(v), [setDarkModeRaw]);
  const setLanguage = useCallback((l: Lang) => setLanguageRaw(l), [setLanguageRaw]);

  const t = useCallback(
    (key: string): string =>
      (TRANSLATIONS[language] as Record<string, string>)[key] ??
      (TRANSLATIONS.ar as Record<string, string>)[key] ??
      key,
    [language]
  );

  // ── Generate new unique user ID ──
  const generateNewUserId = useCallback(() => generateUUID(), []);

  // ── Login: saves user to state + localStorage ──
  const login = useCallback((u: User) => {
    setUser(u);
    safeSetItem("youme_user", u);
  }, []);

  // ── Logout: clears user from state + localStorage ──
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("youme_user");
  }, []);

  // ── ✅ updateUser: update ALL user data at once, save to localStorage ──
  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    safeSetItem("youme_user", updatedUser);
  }, []);

  // ── ✅ updateCover: update state + save to localStorage ──
  const updateCover = useCallback((url: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, cover: url };
      safeSetItem("youme_user", updated);
      return updated;
    });
  }, []);

  // ── ✅ updateAvatar: update state + save to localStorage ──
  const updateAvatar = useCallback((url: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, avatar: url };
      safeSetItem("youme_user", updated);
      return updated;
    });
  }, []);

  // ── Navigation ──
  const registerNavigate = useCallback((fn: (p: string) => void) => setNavigateFn(() => fn), []);
  const navigateTo = useCallback((page: string) => { if (_navigate) _navigate(page); }, [_navigate]);

  // ── ✅ viewingUserId with localStorage persistence ──
  const setViewingUserId = useCallback((id: string | null) => {
    setViewingUserIdRaw(id);
    safeSetItem("youme_viewing_user_id", id);
  }, []);

  // ── ✅ toggleFollow with localStorage persistence ──
  const toggleFollow = useCallback((id: string) => {
    setFollowedIdsRaw((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      safeSetItem("youme_followed_ids", Array.from(next));
      return next;
    });
  }, []);

  // ── ✅ addPoints: update state + save to localStorage ──
  const addPoints = useCallback((points: number) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, points: prev.points + points };
      safeSetItem("youme_user", updated);
      return updated;
    });
  }, []);

  // ── ✅ addBadge: update state + save to localStorage ──
  const addBadge = useCallback((badgeId: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.badges.includes(badgeId)) return prev; // Prevent duplicates
      const updated = { ...prev, badges: [...prev.badges, badgeId] };
      safeSetItem("youme_user", updated);
      return updated;
    });
  }, []);

  // ── ✅ updateRank: update state + save to localStorage ──
  const updateRank = useCallback((rank: string) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, rank };
      safeSetItem("youme_user", updated);
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user && user.id !== "", // Ensure user has valid ID
        darkMode,
        setDarkMode,
        language,
        setLanguage,
        t,
        login,
        logout,
        updateUser,        // ✅ NEW: update all user data
        updateCover,       // ✅ FIXED: saves to localStorage
        updateAvatar,      // ✅ FIXED: saves to localStorage
        navigateTo,
        registerNavigate,
        viewingUserId,
        setViewingUserId,  // ✅ FIXED: saves to localStorage
        followedIds,
        toggleFollow,      // ✅ FIXED: saves to localStorage
        addPoints,         // ✅ FIXED: saves to localStorage
        addBadge,          // ✅ FIXED: saves to localStorage
        updateRank,        // ✅ FIXED: saves to localStorage
        isAdmin,
        generateNewUserId, // ✅ NEW: UUID generator
      }}
    >
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

// ── Export useApp hook ──
export const useApp = () => useContext(AppContext);
