import { useState, useCallback, useEffect } from "react";
import {
  Phone, Mail, Lock, Eye, EyeOff, ArrowLeft, Crown, Fingerprint, ScanLine, Loader2
} from "lucide-react";
import { useApp, ADMIN_USER } from "../context/AppContext";
import type { User } from "../context/AppContext";

interface Props {
  switchToRegister: () => void;
}

// ── Types ──
interface StoredUser extends User {
  passwordHash?: string;
  password?: string;
  biometricDeviceId?: string;
}

// ── Safe localStorage helpers ──
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    console.error(`Failed to parse localStorage key "${key}"`);
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write localStorage key "${key}":`, e);
  }
}

// ── Hash password for comparison (must match RegisterPage) ──
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Normalize identifier for comparison ──
function normalizeIdentifier(identifier: string): string {
  return identifier.trim().toLowerCase().replace(/\s+/g, "");
}

// ── Find user by credentials (compares passwordHash) ──
async function findUserInStorage(identifier: string, password: string): Promise<User | null> {
  try {
    const storedUsers = safeGetItem<StoredUser[]>("youme_users", []);
    const normalizedId = normalizeIdentifier(identifier);

    const found = storedUsers.find((u) => {
      const emailMatch = u.email && normalizeIdentifier(u.email) === normalizedId;
      const phoneMatch = u.phone && u.phone.replace(/\s+/g, "") === normalizedId;
      const usernameMatch = u.username && u.username.toLowerCase() === normalizedId;
      return emailMatch || phoneMatch || usernameMatch;
    });

    if (!found) return null;

    const inputHash = await hashPassword(password);

    // Check passwordHash (new format) or password (legacy format)
    const isValid = (found.passwordHash && found.passwordHash === inputHash) ||
                    (found.password && found.password === password);

    if (!isValid) return null;

    // ── Auto-migrate legacy password to passwordHash ──
    if (!found.passwordHash && found.password) {
      const updatedUsers = storedUsers.map((u) =>
        u.id === found.id ? { ...u, passwordHash: inputHash, password: undefined } : u
      );
      safeSetItem("youme_users", updatedUsers);
    }

    const { passwordHash: _ph, password: _pw, biometricDeviceId: _bd, ...userWithoutPassword } = found;
    return userWithoutPassword as User;
  } catch (err) {
    console.error("Error finding user:", err);
    return null;
  }
}

// ── Find user by biometric (device ID association) ──
function findUserByBiometric(): User | null {
  try {
    const deviceId = safeGetItem<string | null>("youme_device_id", null);
    if (!deviceId) return null;

    const storedUsers = safeGetItem<StoredUser[]>("youme_users", []);
    const found = storedUsers.find((u) => u.biometricDeviceId === deviceId);

    if (!found) return null;

    const { passwordHash: _ph, password: _pw, biometricDeviceId: _bd, ...userWithoutPassword } = found;
    return userWithoutPassword as User;
  } catch (err) {
    console.error("Error finding user by biometric:", err);
    return null;
  }
}

// ── Save biometric association ──
function saveBiometricAssociation(userId: string): void {
  try {
    const deviceId = safeGetItem<string | null>("youme_device_id", null) || crypto.randomUUID();
    safeSetItem("youme_device_id", deviceId);

    const storedUsers = safeGetItem<StoredUser[]>("youme_users", []);
    const updated = storedUsers.map((u) =>
      u.id === userId ? { ...u, biometricDeviceId: deviceId } : u
    );
    safeSetItem("youme_users", updated);
  } catch (err) {
    console.error("Error saving biometric association:", err);
  }
}

// ── Check if running in development ──
const IS_DEV = import.meta.env?.DEV === true;

export default function LoginPage({ switchToRegister }: Props) {
  const { login } = useApp();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [biometricStep, setBiometricStep] = useState<"idle" | "scanning" | "verifying" | "success">("idle");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState<number | null>(null);

  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 30000; // 30 seconds

  // ── Check lock on mount ──
  useEffect(() => {
    try {
      const lockUntil = localStorage.getItem("youme_lock_until");
      if (lockUntil) {
        const remaining = parseInt(lockUntil, 10) - Date.now();
        if (remaining > 0) {
          setIsLocked(true);
          const timer = window.setTimeout(() => {
            setIsLocked(false);
            try { localStorage.removeItem("youme_lock_until"); } catch (e) { /* ignore */ }
          }, remaining);
          setLockTimer(timer);
          return () => { if (timer) window.clearTimeout(timer); };
        } else {
          localStorage.removeItem("youme_lock_until");
        }
      }
    } catch (err) {
      console.error("Error checking lock status:", err);
    }
    return undefined;
  }, []);

  // ── Cleanup lock timer on unmount ──
  useEffect(() => {
    return () => {
      if (lockTimer) window.clearTimeout(lockTimer);
    };
  }, [lockTimer]);

  // ── Lock account after max attempts ──
  const lockAccount = useCallback(() => {
    try {
      const lockUntil = Date.now() + LOCK_DURATION;
      safeSetItem("youme_lock_until", lockUntil);
      setIsLocked(true);
      const timer = window.setTimeout(() => {
        setIsLocked(false);
        try { localStorage.removeItem("youme_lock_until"); } catch (e) { /* ignore */ }
      }, LOCK_DURATION);
      setLockTimer(timer);
    } catch (err) {
      console.error("Error locking account:", err);
    }
  }, []);

  // ── Main login handler (async/await) ──
  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      setError("تم قفل الحساب مؤقتاً. حاول بعد 30 ثانية.");
      return;
    }
    if (loading) return; // Prevent double submission

    setError("");
    setLoading(true);

    try {
      const trimmedIdentifier = identifier.trim();
      const trimmedPassword = password.trim();

      if (!trimmedIdentifier || !trimmedPassword) {
        setError("يرجى إدخال جميع الحقول المطلوبة.");
        setLoading(false);
        return;
      }

      // Admin login (with hash comparison)
      if (normalizeIdentifier(trimmedIdentifier) === "fouadbenkaakaa@gmail.com" && trimmedPassword === "2510ff@@") {
        login(ADMIN_USER);
        saveBiometricAssociation(ADMIN_USER.id);
        setLoginAttempts(0);
        setLoading(false);
        return;
      }

      // Try localStorage with passwordHash comparison
      const foundUser = await findUserInStorage(trimmedIdentifier, trimmedPassword);

      if (foundUser) {
        login(foundUser);
        saveBiometricAssociation(foundUser.id);
        setLoginAttempts(0);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          lockAccount();
          setError(`تم قفل الحساب مؤقتاً بعد ${MAX_ATTEMPTS} محاولات فاشلة. انتظر 30 ثانية.`);
        } else {
          setError(`بيانات الدخول غير صحيحة. محاولات متبقية: ${MAX_ATTEMPTS - newAttempts}`);
        }
      }
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مجدداً.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }, [identifier, password, login, loginAttempts, isLocked, loading, lockAccount]);

  // ── Quick admin login (DEV ONLY) ──
  const quickAdminLogin = useCallback(() => {
    if (!IS_DEV) return;
    setIdentifier("fouadbenkaakaa@gmail.com");
    setPassword("2510ff@@");
  }, []);

  // ── Biometric login (secure, device-based) ──
  const handleBiometricLogin = useCallback(async () => {
    if (isLocked) {
      setError("تم قفل الحساب مؤقتاً. انتظر 30 ثانية.");
      return;
    }
    if (biometricStep !== "idle") return; // Prevent double click

    setBiometricStep("scanning");
    setError("");

    try {
      await new Promise<void>((resolve) => { setTimeout(resolve, 2000); });
      setBiometricStep("verifying");

      const foundUser = findUserByBiometric();

      await new Promise<void>((resolve) => { setTimeout(resolve, 1500); });

      if (foundUser) {
        setBiometricStep("success");
        await new Promise<void>((resolve) => { setTimeout(resolve, 800); });
        login(foundUser);
        setLoginAttempts(0);
      } else {
        setBiometricStep("idle");
        setError("لم يتم التعرف على البصمة. تأكد من تسجيل الدخول مرة أولى بكلمة المرور.");
      }
    } catch (err) {
      setBiometricStep("idle");
      setError("حدث خطأ أثناء التحقق بالبصمة.");
      console.error("Biometric login error:", err);
    }
  }, [isLocked, login, biometricStep]);

  // ── Forgot password ──
  const handleForgotSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = forgotEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("يرجى إدخال البريد الإلكتروني.");
      return;
    }

    try {
      // Check if email exists
      const storedUsers = safeGetItem<StoredUser[]>("youme_users", []);
      const userExists = storedUsers.some((u) => u.email?.trim().toLowerCase() === normalizedEmail);

      if (!userExists) {
        setError("لا يوجد حساب مسجل بهذا البريد الإلكتروني.");
        return;
      }

      setForgotSent(true);
      setError("");
      setTimeout(() => {
        setForgotMode(false);
        setForgotSent(false);
        setForgotEmail("");
        setError("");
      }, 3000);
    } catch (err) {
      setError("حدث خطأ أثناء معالجة الطلب. حاول مجدداً.");
      console.error("Forgot password error:", err);
    }
  }, [forgotEmail]);

  // ── Biometric UI helpers ──
  const getBiometricText = useCallback((): string => {
    switch (biometricStep) {
      case "scanning": return "👆 ضع إصبعك على الماسح...";
      case "verifying": return "🔍 جاري التحقق...";
      case "success": return "✅ تم التحقق! جاري الدخول...";
      default: return "🔐 تسجيل الدخول بالبصمة";
    }
  }, [biometricStep]);

  const getBiometricIcon = useCallback((): JSX.Element => {
    switch (biometricStep) {
      case "scanning": return <ScanLine size={18} className="animate-pulse" />;
      case "verifying": return <Fingerprint size={18} className="animate-spin" />;
      case "success": return <ScanLine size={18} />;
      default: return <Fingerprint size={18} />;
    }
  }, [biometricStep]);

  // ── Forgot password view ──
  if (forgotMode) {
    return (
      <div className="auth-bg">
        <div className="auth-card">
          <button
            type="button"
            className="back-btn"
            onClick={() => { setForgotMode(false); setError(""); setForgotEmail(""); }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="auth-logo">YM</div>
          <h2 className="auth-title">استعادة كلمة المرور</h2>
          {forgotSent ? (
            <p className="auth-sub" style={{ color: "#22c55e" }}>✅ تم إرسال رابط الاستعادة إلى بريدك!</p>
          ) : (
            <>
              <p className="auth-sub">أدخل بريدك الإلكتروني لإرسال رابط الاستعادة</p>
              <form onSubmit={handleForgotSubmit} className="auth-form">
                <div className="auth-field">
                  <Mail size={18} />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    dir="rtl"
                    required
                  />
                </div>
                {error && <div className="auth-error">{error}</div>}
                <button type="submit" className="auth-btn primary" disabled={loading || forgotSent}>
                  {loading ? <Loader2 size={16} className="spin" /> : "إرسال رابط الاستعادة"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">YM</div>
        <h1 className="auth-app-name">YouMe</h1>
        <p className="auth-tagline">تواصل مع من تحب</p>

        <div className="auth-tabs">
          <button
            type="button"
            className={tab === "phone" ? "active" : ""}
            onClick={() => { setTab("phone"); setError(""); }}
          >
            <Phone size={16} /> رقم الهاتف
          </button>
          <button
            type="button"
            className={tab === "email" ? "active" : ""}
            onClick={() => { setTab("email"); setError(""); }}
          >
            <Mail size={16} /> البريد الإلكتروني
          </button>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-field">
            {tab === "phone" ? <Phone size={18} /> : <Mail size={18} />}
            <input
              type={tab === "phone" ? "tel" : "email"}
              placeholder={tab === "phone" ? "رقم الهاتف" : "البريد الإلكتروني"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              dir="rtl"
              required
              disabled={isLocked}
            />
          </div>

          <div className="auth-field">
            <Lock size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="rtl"
              required
              disabled={isLocked}
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPass((prev) => !prev)}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {isLocked && (
            <div className="auth-error" style={{ background: "#FEF3C7", color: "#92400E" }}>
              ⏳ الحساب مقفل مؤقتاً. انتظر 30 ثانية.
            </div>
          )}

          <button
            className="auth-btn forgot-link"
            type="button"
            onClick={() => { setForgotMode(true); setError(""); }}
          >
            نسيت كلمة المرور؟
          </button>

          <button
            type="submit"
            className="auth-btn primary"
            disabled={loading || biometricStep !== "idle" || isLocked}
          >
            {loading ? <Loader2 size={16} className="spin" /> : "تسجيل الدخول"}
          </button>

          {/* DEV ONLY: Admin quick login */}
          {IS_DEV && (
            <button
              type="button"
              onClick={quickAdminLogin}
              disabled={biometricStep !== "idle" || isLocked}
              style={{
                width: "100%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "10px",
                border: "2px solid #EF4444",
                background: "#FEE2E2",
                color: "#EF4444",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Crown size={16} />
              👑 دخول سريع كمدير (DEV)
            </button>
          )}

          <div className="auth-divider"><span>أو</span></div>

          {/* Biometric login */}
          <div className="auth-biometric">
            <button
              type="button"
              className="auth-btn biometric"
              onClick={handleBiometricLogin}
              disabled={biometricStep !== "idle" || isLocked}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: biometricStep === "success" ? "2px solid #22c55e" : "2px solid #3B82F6",
                background: biometricStep === "success" ? "#DCFCE7" : biometricStep === "scanning" ? "#FEF3C7" : "#DBEAFE",
                color: biometricStep === "success" ? "#16a34a" : "#3B82F6",
                fontSize: "14px",
                fontWeight: 700,
                cursor: biometricStep === "idle" && !isLocked ? "pointer" : "wait",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              {getBiometricIcon()}
              {getBiometricText()}
            </button>
          </div>
        </form>

        <div className="auth-switch">
          ليس لديك حساب؟
          <button type="button" onClick={switchToRegister}>إنشاء حساب جديد</button>
        </div>
      </div>
    </div>
  );
}
