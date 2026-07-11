import { useState, useRef, useCallback } from "react";
import {
  User as UserIcon, Phone, Mail, Lock, Eye, EyeOff, Camera,
  ArrowLeft, ArrowRight, Loader2, ShieldCheck
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { User } from "../context/AppContext";

interface Props { switchToLogin: () => void; }

// ──────────────────────────────────────────────
//  ⚠️ SECURITY WARNING
//  The following hashPassword function uses SHA-256
//  which is NOT suitable for production password storage.
//  Use bcrypt, Argon2, or a proper auth service in production.
//  This is for demo/localStorage-only purposes only.
// ──────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── Safe localStorage helpers ──
function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored) as T;
  } catch { return fallback; }
}

function safeSetItem(key: string, value: unknown): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error(e); }
}

// ── Validation helpers ──
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^05\d{8}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MIN_AGE = 13;
const MAX_AGE = 120;
const MAX_IMAGE_SIZE_MB = 5;

function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) return null;
  if (!EMAIL_REGEX.test(trimmed)) return "البريد الإلكتروني غير صالح";
  return null;
}

function validatePhone(phone: string): string | null {
  const cleaned = phone.trim().replace(/\s+/g, "");
  if (!cleaned) return null;
  if (!PHONE_REGEX.test(cleaned)) return "رقم الهاتف يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "كلمة المرور مطلوبة";
  if (password.length < MIN_PASSWORD_LENGTH) return `كلمة المرور يجب أن تكون ${MIN_PASSWORD_LENGTH} أحرف على الأقل`;
  if (password.length > MAX_PASSWORD_LENGTH) return "كلمة المرور طويلة جداً";
  if (!/[A-Za-z]/.test(password)) return "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل";
  if (!/\d/.test(password)) return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
  return null;
}

function validateAge(birthdate: string): string | null {
  if (!birthdate) return "تاريخ الميلاد مطلوب";
  const birth = new Date(birthdate);
  const now = new Date();
  if (birth > now) return "تاريخ الميلاد لا يمكن أن يكون في المستقبل";
  const age = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < MIN_AGE) return `يجب أن يكون عمرك ${MIN_AGE} سنة على الأقل`;
  if (age > MAX_AGE) return "تاريخ الميلاد غير صالح";
  return null;
}

function checkDuplicate(email: string, phone: string, username: string): string | null {
  const storedUsers = safeGetItem<(User & { passwordHash: string })[]>("youme_users", []);
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim().replace(/\s+/g, "");

  if (normalizedEmail && storedUsers.some((u) => u.email?.trim().toLowerCase() === normalizedEmail)) {
    return "البريد الإلكتروني مستخدم بالفعل";
  }
  if (normalizedPhone && storedUsers.some((u) => u.phone?.trim().replace(/\s+/g, "") === normalizedPhone)) {
    return "رقم الهاتف مستخدم بالفعل";
  }
  if (storedUsers.some((u) => u.username === username)) {
    return "اسم المستخدم مستخدم بالفعل";
  }
  return null;
}

// ── Compress image before saving ──
function compressImage(file: File, maxWidth: number = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas not supported")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Generate unique username ──
function generateUniqueUsername(baseName: string): string {
  const clean = baseName.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, "");
  const storedUsers = safeGetItem<(User & { passwordHash: string })[]>("youme_users", []);
  let username = clean || "user";
  let counter = 1;
  while (storedUsers.some((u) => u.username === username)) {
    username = `${clean}_${counter}`;
    counter++;
  }
  return username;
}

// ── UUID Generator ──
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function RegisterPage({ switchToLogin }: Props) {
  const { login } = useApp();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "", confirmPass: "",
    birthdate: "", gender: "", marital: "", country: "", city: "",
    address: "", job: "", bio: ""
  });

  const updateField = useCallback((key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => { const ne = { ...e }; delete ne[key]; return ne; });
  }, []);

  const calcAge = useCallback(() => {
    if (!form.birthdate) return 0;
    const diff = Date.now() - new Date(form.birthdate).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  }, [form.birthdate]);

  // ── Validate Step 1 ──
  const validateStep1 = useCallback((): boolean => {
    const e: Record<string, string> = {};
    const fullName = form.fullName.trim();
    if (!fullName) e.fullName = "الاسم الكامل مطلوب";
    else if (fullName.length < 2) e.fullName = "الاسم قصير جداً";

    const phone = form.phone.trim().replace(/\s+/g, "");
    const email = form.email.trim().toLowerCase();
    if (!phone && !email) {
      e.phone = "رقم الهاتف أو البريد الإلكتروني مطلوب";
    } else {
      const phoneErr = validatePhone(phone);
      if (phoneErr) e.phone = phoneErr;
      const emailErr = validateEmail(email);
      if (emailErr) e.email = emailErr;
    }

    const passErr = validatePassword(form.password);
    if (passErr) e.password = passErr;
    if (form.password !== form.confirmPass) e.confirmPass = "كلمتا المرور غير متطابقتين";

    const ageErr = validateAge(form.birthdate);
    if (ageErr) e.birthdate = ageErr;
    if (!form.gender) e.gender = "الجنس مطلوب";

    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form]);

  // ── Validate all steps + duplicates ──
  const validateAll = useCallback((): boolean => {
    if (!validateStep1()) return false;
    const username = generateUniqueUsername(form.fullName.trim());
    const dupErr = checkDuplicate(
      form.email.trim().toLowerCase(),
      form.phone.trim().replace(/\s+/g, ""),
      username
    );
    if (dupErr) {
      setGeneralError(dupErr);
      return false;
    }
    return true;
  }, [form, validateStep1]);

  // ── Handle next step ──
  const handleNext = useCallback(() => {
    setGeneralError("");
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  }, [step, validateStep1]);

  // ── Handle avatar upload with validation ──
  const handleAvatar = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((e) => ({ ...e, avatar: "الملف يجب أن يكون صورة" }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((e) => ({ ...e, avatar: `حجم الصورة يجب أن يكون أقل من ${MAX_IMAGE_SIZE_MB} ميجا` }));
      return;
    }

    try {
      const compressed = await compressImage(file, 400);
      setAvatarPreview(compressed);
      setErrors((e) => { const ne = { ...e }; delete ne.avatar; return ne; });
    } catch (err) {
      setErrors((e) => ({ ...e, avatar: "فشل في معالجة الصورة" }));
      console.error(err);
    }

    if (fileRef.current) fileRef.current.value = "";
  }, []);

  // ── Main submit handler (async/await) ──
  const handleSubmit = useCallback(async () => {
    if (loading) return;
    if (!validateAll()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const age = calcAge() || 18;
      const userId = generateUUID();
      const username = generateUniqueUsername(form.fullName.trim());

      // Hash password (SHA-256 for demo only - NOT production secure)
      const passwordHash = await hashPassword(form.password);

      const newUser: User = {
        id: userId,
        name: form.fullName.trim() || "مستخدم جديد",
        username,
        avatar: avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4`,
        cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
        bio: form.bio.trim() || "مرحبا! أنا جديد هنا 👋",
        location: (form.city && form.country) 
          ? `${form.city.trim()}، ${form.country.trim()}` 
          : form.city.trim() || form.country.trim() || "غير محدد",
        work: form.job.trim() || "غير محدد",
        age,
        gender: form.gender || "غير محدد",
        maritalStatus: form.marital || "غير محدد",
        friendsCount: 0,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        phone: form.phone.trim().replace(/\s+/g, "") || "",
        email: form.email.trim().toLowerCase() || "",
        role: "user",
        points: 0,
        badges: ["newcomer"],
        rank: "مبتدئ",
        isVerified: false,
        country: form.country.trim() || "",
        city: form.city.trim() || "",
        address: form.address.trim() || "",
      };

      // Save user with hashed password
      const userWithHash = { ...newUser, passwordHash };

      // Save to localStorage
      const existingUsers = safeGetItem<(User & { passwordHash: string })[]>("youme_users", []);
      const updatedUsers = [...existingUsers, userWithHash];
      safeSetItem("youme_users", updatedUsers);
      safeSetItem("youme_user", newUser);

      // Save biometric association
      const deviceId = generateUUID();
      safeSetItem("youme_device_id", deviceId);
      const usersWithBio = updatedUsers.map((u) =>
        u.id === userId ? { ...u, biometricDeviceId: deviceId } : u
      );
      safeSetItem("youme_users", usersWithBio);

      // Auto-login
      login(newUser);

    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل في إنشاء الحساب";
      setGeneralError(message);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }, [form, avatarPreview, calcAge, login, loading, validateAll]);

  const getStepTitle = () => {
    switch (step) {
      case 1: return "المعلومات الأساسية";
      case 2: return "معلومات إضافية";
      case 3: return "الصورة والنبذة";
      default: return "";
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card register-card">
        <div className="auth-logo">و</div>
        <h2 className="auth-title">إنشاء حساب جديد</h2>
        <p className="auth-sub">{getStepTitle()}</p>

        <div className="register-steps">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-dot ${step >= s ? "active" : ""} ${step === s ? "current" : ""}`}>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {generalError && (
          <div className="auth-error" style={{ marginBottom: 12 }}>
            ⚠️ {generalError}
          </div>
        )}

        {step === 1 && (
          <div className="auth-form">
            <div className="auth-field">
              <UserIcon size={18} />
              <input
                type="text"
                placeholder="الاسم الكامل *"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}

            <div className="auth-field">
              <Phone size={18} />
              <input
                type="tel"
                placeholder="رقم الهاتف (05xxxxxxxx)"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>
            {errors.phone && <div className="field-error">{errors.phone}</div>}

            <div className="auth-field">
              <Mail size={18} />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>
            {errors.email && <div className="field-error">{errors.email}</div>}

            <div className="auth-field">
              <Lock size={18} />
              <input
                type={showPass ? "text" : "password"}
                placeholder={`كلمة المرور * (${MIN_PASSWORD_LENGTH}+ أحرف، حرف ورقم)`}
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}

            <div className="auth-field">
              <Lock size={18} />
              <input
                type="password"
                placeholder="تأكيد كلمة المرور *"
                value={form.confirmPass}
                onChange={(e) => updateField("confirmPass", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>
            {errors.confirmPass && <div className="field-error">{errors.confirmPass}</div>}

            <div className="birth-row">
              <div className="auth-field flex-1">
                <input
                  type="date"
                  placeholder="تاريخ الميلاد"
                  value={form.birthdate}
                  onChange={(e) => updateField("birthdate", e.target.value)}
                  dir="rtl"
                  disabled={loading}
                />
              </div>
              {form.birthdate && (
                <div className="age-badge">العمر: {calcAge()} سنة</div>
              )}
            </div>
            {errors.birthdate && <div className="field-error">{errors.birthdate}</div>}

            <div className="radio-group">
              <label className="radio-label">الجنس:</label>
              <div className="radio-options">
                {["ذكر", "أنثى"].map((g) => (
                  <label key={g} className={`radio-opt ${form.gender === g ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={() => updateField("gender", g)}
                      hidden
                      disabled={loading}
                    />
                    {g === "ذكر" ? "👨 ذكر" : "👩 أنثى"}
                  </label>
                ))}
              </div>
            </div>
            {errors.gender && <div className="field-error">{errors.gender}</div>}
          </div>
        )}

        {step === 2 && (
          <div className="auth-form">
            <div className="radio-group">
              <label className="radio-label">الحالة الاجتماعية:</label>
              <div className="radio-options wrap">
                {["أعزب", "متزوج", "مطلق", "أرمل"].map((m) => (
                  <label key={m} className={`radio-opt ${form.marital === m ? "selected" : ""}`}>
                    <input
                      type="radio"
                      name="marital"
                      value={m}
                      checked={form.marital === m}
                      onChange={() => updateField("marital", m)}
                      hidden
                      disabled={loading}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <span>🌍</span>
              <input
                type="text"
                placeholder="الدولة"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <span>🏙️</span>
              <input
                type="text"
                placeholder="المدينة"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <span>📍</span>
              <input
                type="text"
                placeholder="مكان السكن الحالي"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <span>💼</span>
              <input
                type="text"
                placeholder="المهنة"
                value={form.job}
                onChange={(e) => updateField("job", e.target.value)}
                dir="rtl"
                disabled={loading}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="auth-form">
            <div className="avatar-upload" onClick={() => !loading && fileRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="الصورة الشخصية" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={32} />
                  <span>أضف صورة شخصية</span>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatar}
                disabled={loading}
              />
            </div>
            {errors.avatar && <div className="field-error">{errors.avatar}</div>}

            <div className="auth-field textarea-field">
              <textarea
                placeholder="نبذة تعريفية قصيرة عنك..."
                value={form.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                rows={4}
                dir="rtl"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="register-nav">
          {step > 1 && (
            <button className="auth-btn secondary" onClick={() => setStep((s) => s - 1)} disabled={loading}>
              <ArrowRight size={16} /> السابق
            </button>
          )}
          {step < 3 ? (
            <button className="auth-btn primary" onClick={handleNext} disabled={loading}>
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button className="auth-btn primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <><Loader2 size={16} className="spin" /> جاري الإنشاء...</>
              ) : (
                <>إنشاء الحساب <ShieldCheck size={16} /></>
              )}
            </button>
          )}
        </div>

        <div className="auth-switch">
          لديك حساب بالفعل؟
          <button onClick={switchToLogin} disabled={loading}>تسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}
