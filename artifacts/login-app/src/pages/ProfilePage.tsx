import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  Edit3, MapPin, Briefcase, Calendar, Users, UserCheck,
  Camera, ShieldCheck, X, Save, SkipForward, Loader2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";
import Post from "../components/Post";
import VerificationBadge from "../components/VerificationBadge";
import type { BadgeType } from "../components/VerificationBadge";

// ──────────────────────────────────────────────
//  Supabase client (lazy import)
// ──────────────────────────────────────────────
let supabaseClient: ReturnType<typeof import("@supabase/supabase-js").createClient> | null = null;

try {
  const { createClient } = require("@supabase/supabase-js");
  const url = import.meta.env?.VITE_SUPABASE_URL || "";
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
  if (url && key) {
    supabaseClient = createClient(url, key);
  }
} catch {
  // Supabase not installed — falls back to localStorage
}

const MY_BADGE: BadgeType = "blue";

// ── Default fallback images ──
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4";
const DEFAULT_COVER = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80";

// ── Preset covers ──
const PRESET_COVERS = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
];

// ── Friend list (stable data) ──
const FRIENDS_LIST = [
  { name: "سارة المنصور", seed: "sara", bg: "ffdfbf", badge: "gray" as BadgeType },
  { name: "محمد العمري", seed: "mohammed", bg: "d1d4f9", badge: "blue" as BadgeType },
  { name: "نورة الشمري", seed: "noura", bg: "c0aede", badge: null },
  { name: "عبدالله القحطاني", seed: "ab", bg: "b6e3f4", badge: "green" as BadgeType },
  { name: "لمياء السلمي", seed: "lamia", bg: "b6e3f4", badge: null },
  { name: "طارق الغامدي", seed: "tarek", bg: "ffdfbf", badge: "gray" as BadgeType },
];

const PHOTOS_LIST = [
  "photo-1506905925346-21bda4d32df4",
  "photo-1477959858617-67f85cf4f1df",
  "photo-1504674900247-0877df9cc836",
  "photo-1540575467063-178a50c2df87",
  "photo-1571115177098-24ec42ed204d",
  "photo-1558618666-fcd25c85cd64",
];

// ──────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────
interface EditFormData {
  name: string;
  username: string;
  bio: string;
  location: string;
  work: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  maritalStatus: string;
  country: string;
  city: string;
  address: string;
}

interface ValidationResult {
  valid: boolean;
  message: string;
}

// ──────────────────────────────────────────────
//  Validation helpers
// ──────────────────────────────────────────────
function validateName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, message: "الاسم الكامل مطلوب" };
  if (trimmed.length < 2) return { valid: false, message: "الاسم يجب أن يكون حرفين على الأقل" };
  return { valid: true, message: "" };
}

function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) return { valid: false, message: "البريد الإلكتروني مطلوب" };
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  if (!emailRegex.test(trimmed)) return { valid: false, message: "البريد الإلكتروني غير صالح" };
  return { valid: true, message: "" };
}

function validateAge(age: number): ValidationResult {
  if (Number.isNaN(age) || age < 1) return { valid: false, message: "العمر يجب أن يكون 1 سنة على الأقل" };
  if (age > 120) return { valid: false, message: "العمر يجب أن يكون 120 سنة كحد أقصى" };
  return { valid: true, message: "" };
}

function validateStep1(form: EditFormData): ValidationResult {
  let result = validateName(form.name);
  if (!result.valid) return result;
  result = validateEmail(form.email);
  if (!result.valid) return result;
  result = validateAge(form.age);
  if (!result.valid) return result;
  return { valid: true, message: "" };
}

// ──────────────────────────────────────────────
//  Supabase helpers
// ──────────────────────────────────────────────
async function uploadImageToSupabase(
  file: File,
  bucket: string,
  folder: string,
  userId: string
): Promise<string | null> {
  if (!supabaseClient) return null;

  const ext = file.name.split(".").pop() || "png";
  const fileName = `${folder}/${userId}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseClient.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: true });

  if (uploadError) {
    console.error("Upload error:", uploadError.message);
    return null;
  }

  const { data: urlData } = supabaseClient.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return urlData?.publicUrl ?? null;
}

// ──────────────────────────────────────────────
//  Component
// ──────────────────────────────────────────────
export default function ProfilePage({ setCurrentPage }: { setCurrentPage?: (p: string) => void }) {
  const app = useApp();
  const { user, updateCover, updateAvatar } = app;
  // Requirement #3: Use updateUser if available, otherwise fall back to login for backward compatibility
  const updateUser = app.updateUser ?? app.login;

  const [tab, setTab] = useState<"posts" | "about" | "friends" | "photos">("posts");
  const [showCoverOptions, setShowCoverOptions] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStep, setEditStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ── Edit form state ──
  const [editForm, setEditForm] = useState<EditFormData>({
    name: "", username: "", bio: "", location: "", work: "",
    phone: "", email: "", age: 18, gender: "", maritalStatus: "",
    country: "", city: "", address: "",
  });

  // ── Requirement #4: Full sync between user and editForm ──
  useEffect(() => {
    if (showEditModal && user) {
      setEditForm({
        name: user.name ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        location: user.location ?? "",
        work: user.work ?? "",
        phone: user.phone ?? "",
        email: user.email ?? "",
        age: user.age ?? 18,
        gender: user.gender ?? "",
        maritalStatus: user.maritalStatus ?? "",
        country: (user as Record<string, unknown>).country as string ?? "",
        city: (user as Record<string, unknown>).city as string ?? "",
        address: (user as Record<string, unknown>).address as string ?? "",
      });
      setEditStep(1);
      setErrorMsg("");
    }
  }, [showEditModal, user]);

  // ── Requirement #1: Dynamic user.id instead of hardcoded "1" ──
  const myPosts = useMemo(
    () => MOCK_POSTS.filter((p) => p.userId === (user?.id ?? "")),
    [user?.id]
  );

  // ── Requirement #15: Memoized callbacks ──
  const handleTabChange = useCallback((newTab: "posts" | "about" | "friends" | "photos") => {
    setTab(newTab);
  }, []);

  const openEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setErrorMsg("");
  }, []);

  const goToVerification = useCallback(() => {
    setCurrentPage?.("verification");
  }, [setCurrentPage]);

  // ── Requirement #2: Permanent image upload via Supabase ──
  const handleCoverFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      setUploadingImage(true);
      setErrorMsg("");

      try {
        const supabaseUrl = await uploadImageToSupabase(file, "covers", "profile-covers", user.id);
        if (supabaseUrl) {
          updateCover(supabaseUrl);
        } else {
          // Fallback: base64 for localStorage persistence
          const reader = new FileReader();
          reader.onload = () => updateCover(reader.result as string);
          reader.onerror = () => setErrorMsg("فشل في قراءة صورة الغلاف");
          reader.readAsDataURL(file);
        }
      } catch (err) {
        setErrorMsg("حدث خطأ أثناء رفع صورة الغلاف");
        console.error(err);
      } finally {
        setUploadingImage(false);
        // Requirement #13: Reset input
        if (coverInputRef.current) coverInputRef.current.value = "";
      }
    },
    [user, updateCover]
  );

  const handleAvatarFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user) return;

      setUploadingImage(true);
      setErrorMsg("");

      try {
        const supabaseUrl = await uploadImageToSupabase(file, "avatars", "profile-avatars", user.id);
        if (supabaseUrl) {
          updateAvatar(supabaseUrl);
        } else {
          const reader = new FileReader();
          reader.onload = () => updateAvatar(reader.result as string);
          reader.onerror = () => setErrorMsg("فشل في قراءة الصورة الشخصية");
          reader.readAsDataURL(file);
        }
      } catch (err) {
        setErrorMsg("حدث خطأ أثناء رفع الصورة الشخصية");
        console.error(err);
      } finally {
        setUploadingImage(false);
        if (avatarInputRef.current) avatarInputRef.current.value = "";
      }
    },
    [user, updateAvatar]
  );

  // ── Field updater ──
  const updateField = useCallback(<K extends keyof EditFormData>(field: K, value: EditFormData[K]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  // ── Requirement #11: Async handleSaveEdit without setTimeout ──
  const handleSaveEdit = useCallback(async () => {
    if (!user) return;

    // Requirement #6: Validation
    const validation = validateStep1(editForm);
    if (!validation.valid) {
      setErrorMsg(validation.message);
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const updatedUser = {
        ...user,
        name: editForm.name.trim(),
        username: editForm.username.trim(),
        bio: editForm.bio.trim(),
        location: editForm.location.trim(),
        work: editForm.work.trim(),
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
        age: editForm.age,
        gender: editForm.gender,
        maritalStatus: editForm.maritalStatus,
        // Requirement #10: Save new fields
        country: editForm.country.trim(),
        city: editForm.city.trim(),
        address: editForm.address.trim(),
      };

      // Requirement #3: Use updateUser() instead of login()
      updateUser(updatedUser);

      // Persist to localStorage as fallback
      localStorage.setItem("youme_user", JSON.stringify(updatedUser));

      setShowEditModal(false);
    } catch (err) {
      // Requirement #12: Error handling
      const message = err instanceof Error ? err.message : "فشل في حفظ التعديلات";
      setErrorMsg(message);
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }, [user, editForm, updateUser]);

  // ── Skip optional info ──
  const handleSkip = useCallback(async () => {
    await handleSaveEdit();
  }, [handleSaveEdit]);

  // ── Requirement #5: Safe values with defaults ──
  const safeUser = useMemo(() => ({
    name: user?.name ?? "",
    username: user?.username ?? "",
    avatar: user?.avatar ?? DEFAULT_AVATAR,
    cover: user?.cover ?? DEFAULT_COVER,
    bio: user?.bio ?? "",
    location: user?.location ?? "",
    work: user?.work ?? "",
    age: user?.age ?? 0,
    gender: user?.gender ?? "",
    maritalStatus: user?.maritalStatus ?? "",
    friendsCount: user?.friendsCount ?? 0,
    followersCount: user?.followersCount ?? 0,
    followingCount: user?.followingCount ?? 0,
    postsCount: user?.postsCount ?? 0,
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    points: user?.points ?? 0,
    badges: user?.badges ?? [],
    rank: user?.rank ?? "",
    isVerified: user?.isVerified ?? false,
    verificationColor: user?.verificationColor ?? "",
  }), [user]);

  // ── Requirement #14: Safe image URLs ──
  const avatarSrc = safeUser.avatar || DEFAULT_AVATAR;
  const coverSrc = safeUser.cover || DEFAULT_COVER;

  // ── Requirement #9: Input styles with explicit color ──
  const inputStyle: React.CSSProperties = {
    color: "#000",
    background: "transparent",
    border: "none",
    outline: "none",
    width: "100%",
    fontSize: 14,
    fontFamily: "inherit",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text2)",
    marginBottom: -6,
    display: "block",
  };

  return (
    <div className="profile-page">
      {/* ═══════════════════════════════════════════
          COVER PHOTO
          ═══════════════════════════════════════════ */}
      <div className="profile-cover-wrap">
        <img src={coverSrc} alt="غلاف" className="profile-cover" />
        <button
          className="change-cover-btn"
          onClick={() => setShowCoverOptions(true)}
          disabled={uploadingImage}
        >
          {uploadingImage ? <Loader2 size={16} className="spin" /> : <Camera size={16} />}
          {" "}تغيير صورة الغلاف
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleCoverFile}
        />
      </div>

      {/* Cover picker modal */}
      {showCoverOptions && (
        <div className="checkout-overlay" onClick={() => setShowCoverOptions(false)}>
          <div className="checkout-modal" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <h3>🖼️ تغيير صورة الغلاف</h3>
            <div className="cover-presets-grid">
              {PRESET_COVERS.map((url) => (
                <img
                  key={url}
                  src={url}
                  alt="غلاف"
                  className="cover-preset-thumb"
                  onClick={() => {
                    updateCover(url);
                    setShowCoverOptions(false);
                  }}
                />
              ))}
            </div>
            <div className="cover-upload-row">
              <span style={{ fontSize: 13, color: "var(--text2)" }}>أو ارفع صورة من جهازك:</span>
              <button
                className="btn-primary"
                style={{ fontSize: 13 }}
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader2 size={14} className="spin" /> : <Camera size={14} />}
                {" "}رفع صورة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          INFO BAR
          ═══════════════════════════════════════════ */}
      <div className="profile-info-bar">
        <div className="profile-avatar-wrap">
          <img src={avatarSrc} alt={safeUser.name} className="profile-avatar-lg" />
          <button
            className="change-avatar-btn"
            title="تغيير الصورة الشخصية"
            onClick={() => avatarInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? <Loader2 size={14} className="spin" /> : <Camera size={14} />}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarFile}
          />
        </div>

        <div className="profile-details">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h1 className="profile-name">{safeUser.name}</h1>
            <VerificationBadge type={MY_BADGE} size="lg" showLabel />
          </div>
          <p className="profile-bio">{safeUser.bio}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-num">{myPosts.length}</span>
              <span className="stat-label">منشور</span>
            </div>
            <div className="profile-stat">
              <span className="stat-num">{safeUser.friendsCount}</span>
              <span className="stat-label">صديق</span>
            </div>
            <div className="profile-stat">
              {/* Requirement #5: Safe toLocaleString */}
              <span className="stat-num">{(safeUser.followersCount ?? 0).toLocaleString("ar")}</span>
              <span className="stat-label">متابع</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary" onClick={openEditModal}>
            <Edit3 size={16} /> تعديل الملف الشخصي
          </button>
          <button className="btn-verify-profile" onClick={goToVerification}>
            <ShieldCheck size={16} /> طلب التحقق الرسمي
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TABS
          ═══════════════════════════════════════════ */}
      <div className="tab-bar profile-tabs">
        {[
          { id: "posts" as const, label: "المنشورات" },
          { id: "about" as const, label: "معلومات عني" },
          { id: "friends" as const, label: "الأصدقاء" },
          { id: "photos" as const, label: "الصور" },
        ].map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => handleTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════
          CONTENT
          ═══════════════════════════════════════════ */}
      <div className="profile-content">
        {/* ── Posts Tab ── */}
        {tab === "posts" && (
          <div className="profile-posts-layout">
            <div className="profile-sidebar-info">
              <div className="info-card">
                <h3 className="info-card-title">نبذة عني</h3>
                <p className="info-card-bio">{safeUser.bio}</p>
                <div className="info-card-items">
                  <div className="info-item">
                    <MapPin size={16} /> يسكن في {safeUser.location || "غير محدد"}
                  </div>
                  <div className="info-item">
                    <Briefcase size={16} /> {safeUser.work || "غير محدد"}
                  </div>
                  <div className="info-item">
                    <Calendar size={16} /> العمر: {safeUser.age || "غير محدد"} سنة
                  </div>
                  <div className="info-item">
                    <Users size={16} /> {safeUser.gender || "غير محدد"}
                  </div>
                  <div className="info-item">
                    <UserCheck size={16} /> {safeUser.maritalStatus || "غير محدد"}
                  </div>
                </div>
                <div className="profile-badge-info">
                  <VerificationBadge type={MY_BADGE} size="md" />
                  <div>
                    <div className="badge-info-label">حساب موثق رسمياً</div>
                    <div className="badge-info-sub">شخصية عامة · Atlas Social</div>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card-title">الأصدقاء</h3>
                <div className="mini-friends">
                  {Array.from({ length: 6 }, (_, i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=f${i}&backgroundColor=b6e3f4`}
                      alt=""
                      className="mini-friend-avatar"
                    />
                  ))}
                </div>
                <div className="info-card-bio">{safeUser.friendsCount} صديق</div>
              </div>
            </div>

            <div className="profile-posts-list">
              {myPosts.length === 0 ? (
                <div className="empty-state">
                  <span>📝</span>
                  <p>لا توجد منشورات بعد</p>
                </div>
              ) : (
                myPosts.map((post) => <Post key={post.id} post={post} />)
              )}
            </div>
          </div>
        )}

        {/* ── About Tab ── */}
        {tab === "about" && (
          <div className="about-page">
            <div className="about-section">
              <h3>📋 المعلومات الشخصية</h3>
              <div className="about-grid">
                <div className="about-item">
                  <span>الاسم الكامل</span>
                  <strong>{safeUser.name || "غير محدد"}</strong>
                </div>
                <div className="about-item">
                  <span>العمر</span>
                  <strong>{safeUser.age ? `${safeUser.age} سنة` : "غير محدد"}</strong>
                </div>
                <div className="about-item">
                  <span>الجنس</span>
                  <strong>{safeUser.gender || "غير محدد"}</strong>
                </div>
                <div className="about-item">
                  <span>الحالة الاجتماعية</span>
                  <strong>{safeUser.maritalStatus || "غير محدد"}</strong>
                </div>
                <div className="about-item">
                  <span>مكان السكن</span>
                  <strong>{safeUser.location || "غير محدد"}</strong>
                </div>
                <div className="about-item">
                  <span>العمل</span>
                  <strong>{safeUser.work || "غير محدد"}</strong>
                </div>
              </div>
            </div>
            <div className="about-section">
              <h3>📞 معلومات الاتصال</h3>
              <div className="about-grid">
                <div className="about-item">
                  <span>رقم الهاتف</span>
                  <strong>مخفي 🔒</strong>
                </div>
                <div className="about-item">
                  <span>البريد الإلكتروني</span>
                  <strong>{safeUser.email || "غير محدد"}</strong>
                </div>
              </div>
            </div>
            <div className="about-section">
              <h3>🛡️ التحقق والشارات</h3>
              <div className="verify-about-card">
                <VerificationBadge type={MY_BADGE} size="lg" showLabel />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>حساب موثق · شخصية عامة</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>
                    تم التحقق من هذا الحساب بواسطة Atlas Social
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Friends Tab ── */}
        {tab === "friends" && (
          <div className="friends-grid">
            {FRIENDS_LIST.map((f, i) => (
              <div key={i} className="friend-card">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.seed}&backgroundColor=${f.bg}`}
                  alt={f.name}
                  className="friend-card-avatar"
                />
                <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                  <div className="friend-card-name">{f.name}</div>
                  <VerificationBadge type={f.badge} size="sm" />
                </div>
                <button className="btn-ghost-purple">💬 مراسلة</button>
              </div>
            ))}
          </div>
        )}

        {/* ── Photos Tab ── */}
        {tab === "photos" && (
          <div className="photos-grid">
            {PHOTOS_LIST.map((p, i) => (
              <img
                key={i}
                src={`https://images.unsplash.com/${p}?w=300&q=80`}
                alt=""
                className="photo-thumb"
              />
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          EDIT MODAL
          ═══════════════════════════════════════════ */}
      {showEditModal && (
        <div className="checkout-overlay" onClick={closeEditModal}>
          <div
            className="checkout-modal"
            style={{ maxWidth: 500, maxHeight: "85vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3>
                {editStep === 1 ? "✏️ تعديل الملف الشخصي" : "📋 معلومات إضافية (اختياري)"}
              </h3>
              <button
                onClick={closeEditModal}
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-label="إغلاق"
              >
                <X size={24} />
              </button>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, justifyContent: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 6,
                  borderRadius: 3,
                  background: editStep >= 1 ? "#8B5CF6" : "#E5E7EB",
                }}
              />
              <div
                style={{
                  width: 40,
                  height: 6,
                  borderRadius: 3,
                  background: editStep >= 2 ? "#8B5CF6" : "#E5E7EB",
                }}
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#EF4444",
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 13,
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            {/* ── STEP 1: Essential Info ── */}
            {editStep === 1 && (
              <div className="auth-form" style={{ gap: 12 }}>
                {/* Name */}
                <label htmlFor="edit-name" style={labelStyle}>الاسم الكامل *</label>
                <div className="auth-field">
                  <span>👤</span>
                  <input
                    id="edit-name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={editForm.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                    aria-required="true"
                  />
                </div>

                {/* Username */}
                <label htmlFor="edit-username" style={labelStyle}>اسم المستخدم</label>
                <div className="auth-field">
                  <span>@</span>
                  <input
                    id="edit-username"
                    type="text"
                    placeholder="@username"
                    value={editForm.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* Email */}
                <label htmlFor="edit-email" style={labelStyle}>البريد الإلكتروني *</label>
                <div className="auth-field">
                  <span>✉️</span>
                  <input
                    id="edit-email"
                    type="email"
                    placeholder="example@email.com"
                    value={editForm.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                    aria-required="true"
                  />
                </div>

                {/* Bio */}
                <label htmlFor="edit-bio" style={labelStyle}>نبذة عنك</label>
                <div className="auth-field">
                  <span>📝</span>
                  <textarea
                    id="edit-bio"
                    placeholder="اكتب نبذة قصيرة عنك..."
                    value={editForm.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    rows={3}
                    dir="rtl"
                    style={textareaStyle}
                  />
                </div>

                {/* Age */}
                <label htmlFor="edit-age" style={labelStyle}>العمر *</label>
                <div className="auth-field">
                  <span>🔢</span>
                  <input
                    id="edit-age"
                    type="number"
                    min={1}
                    max={120}
                    placeholder="العمر"
                    value={editForm.age || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const num = val === "" ? 0 : Math.min(120, Math.max(0, parseInt(val, 10) || 0));
                      updateField("age", num);
                    }}
                    dir="rtl"
                    style={inputStyle}
                    aria-required="true"
                  />
                </div>

                {/* Gender */}
                <label htmlFor="edit-gender" style={labelStyle}>الجنس</label>
                <div className="auth-field">
                  <span>⚧</span>
                  <select
                    id="edit-gender"
                    value={editForm.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    dir="rtl"
                    style={{ ...inputStyle, appearance: "auto" }}
                  >
                    <option value="">اختر الجنس</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── STEP 2: Optional Info ── */}
            {editStep === 2 && (
              <div className="auth-form" style={{ gap: 12 }}>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text2)",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  📝 هذه المعلومات اختيارية — يمكنك تخطيها
                </p>

                {/* Marital Status */}
                <label htmlFor="edit-marital" style={labelStyle}>الحالة الاجتماعية</label>
                <div className="auth-field">
                  <span>💍</span>
                  <select
                    id="edit-marital"
                    value={editForm.maritalStatus}
                    onChange={(e) => updateField("maritalStatus", e.target.value)}
                    dir="rtl"
                    style={{ ...inputStyle, appearance: "auto" }}
                  >
                    <option value="">اختر الحالة الاجتماعية</option>
                    <option value="أعزب">أعزب</option>
                    <option value="متزوج">متزوج</option>
                    <option value="مطلق">مطلق</option>
                    <option value="أرمل">أرمل</option>
                  </select>
                </div>

                {/* Country */}
                <label htmlFor="edit-country" style={labelStyle}>الدولة</label>
                <div className="auth-field">
                  <span>🌍</span>
                  <input
                    id="edit-country"
                    type="text"
                    placeholder="الدولة"
                    value={editForm.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* City */}
                <label htmlFor="edit-city" style={labelStyle}>المدينة</label>
                <div className="auth-field">
                  <span>🏙️</span>
                  <input
                    id="edit-city"
                    type="text"
                    placeholder="المدينة"
                    value={editForm.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* Location */}
                <label htmlFor="edit-location" style={labelStyle}>مكان السكن</label>
                <div className="auth-field">
                  <MapPin size={18} />
                  <input
                    id="edit-location"
                    type="text"
                    placeholder="مكان السكن الحالي"
                    value={editForm.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* Work */}
                <label htmlFor="edit-work" style={labelStyle}>العمل</label>
                <div className="auth-field">
                  <Briefcase size={18} />
                  <input
                    id="edit-work"
                    type="text"
                    placeholder="المهنة / العمل"
                    value={editForm.work}
                    onChange={(e) => updateField("work", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* Phone */}
                <label htmlFor="edit-phone" style={labelStyle}>رقم الهاتف</label>
                <div className="auth-field">
                  <span>📞</span>
                  <input
                    id="edit-phone"
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={editForm.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>

                {/* Address */}
                <label htmlFor="edit-address" style={labelStyle}>العنوان التفصيلي</label>
                <div className="auth-field">
                  <span>📍</span>
                  <input
                    id="edit-address"
                    type="text"
                    placeholder="العنوان الكامل"
                    value={editForm.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    dir="rtl"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              {editStep === 1 ? (
                <>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, minWidth: 120 }}
                    onClick={() => {
                      const result = validateStep1(editForm);
                      if (!result.valid) {
                        setErrorMsg(result.message);
                        return;
                      }
                      setEditStep(2);
                      setErrorMsg("");
                    }}
                    disabled={saving}
                  >
                    التالي →
                  </button>
                  <button
                    className="btn-ghost"
                    style={{ flex: 1, minWidth: 120 }}
                    onClick={closeEditModal}
                    disabled={saving}
                  >
                    <X size={16} /> إلغاء
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-primary"
                    style={{ flex: 1, minWidth: 120 }}
                    onClick={handleSaveEdit}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="spin" /> جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save size={16} /> حفظ
                      </>
                    )}
                  </button>
                  <button
                    className="btn-ghost"
                    style={{ flex: 1, minWidth: 120, color: "#8B5CF6", borderColor: "#8B5CF6" }}
                    onClick={handleSkip}
                    disabled={saving}
                  >
                    <SkipForward size={16} /> تخطي
                  </button>
                  <button
                    className="btn-ghost"
                    style={{ flex: 1, minWidth: 120 }}
                    onClick={() => {
                      setEditStep(1);
                      setErrorMsg("");
                    }}
                    disabled={saving}
                  >
                    ← السابق
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
