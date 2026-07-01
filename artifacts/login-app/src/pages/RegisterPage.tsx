import { useState, useRef } from "react";
import { User, Phone, Mail, Lock, Eye, EyeOff, Camera, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp, MOCK_USER } from "../context/AppContext";

interface Props { switchToLogin: () => void; }

export default function RegisterPage({ switchToLogin }: Props) {
  const { login } = useApp();
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", password: "", confirmPass: "",
    birthdate: "", gender: "", marital: "", country: "", city: "",
    address: "", job: "", bio: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const calcAge = () => {
    if (!form.birthdate) return "";
    const diff = Date.now() - new Date(form.birthdate).getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "الاسم الكامل مطلوب";
    if (!form.phone && !form.email) e.phone = "رقم الهاتف أو البريد الإلكتروني مطلوب";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    if (form.password !== form.confirmPass) e.confirmPass = "كلمتا المرور غير متطابقتين";
    if (!form.birthdate) e.birthdate = "تاريخ الميلاد مطلوب";
    if (!form.gender) e.gender = "الجنس مطلوب";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = () => {
    login({ ...MOCK_USER, name: form.fullName || MOCK_USER.name });
  };

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card register-card">
        <div className="auth-logo">و</div>
        <h2 className="auth-title">إنشاء حساب جديد</h2>

        <div className="register-steps">
          {[1, 2, 3].map(s => (
            <div key={s} className={`step-dot ${step >= s ? "active" : ""}`}>
              <span>{s}</span>
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="auth-form">
            <div className="auth-field">
              <User size={18} />
              <input type="text" placeholder="الاسم الكامل *" value={form.fullName} onChange={e => set("fullName", e.target.value)} dir="rtl" />
            </div>
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}

            <div className="auth-field">
              <Phone size={18} />
              <input type="tel" placeholder="رقم الهاتف" value={form.phone} onChange={e => set("phone", e.target.value)} dir="rtl" />
            </div>

            <div className="auth-field">
              <Mail size={18} />
              <input type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => set("email", e.target.value)} dir="rtl" />
            </div>
            {errors.phone && <div className="field-error">{errors.phone}</div>}

            <div className="auth-field">
              <Lock size={18} />
              <input type={showPass ? "text" : "password"} placeholder="كلمة المرور *" value={form.password} onChange={e => set("password", e.target.value)} dir="rtl" />
              <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}

            <div className="auth-field">
              <Lock size={18} />
              <input type="password" placeholder="تأكيد كلمة المرور *" value={form.confirmPass} onChange={e => set("confirmPass", e.target.value)} dir="rtl" />
            </div>
            {errors.confirmPass && <div className="field-error">{errors.confirmPass}</div>}

            <div className="birth-row">
              <div className="auth-field flex-1">
                <input type="date" placeholder="تاريخ الميلاد" value={form.birthdate} onChange={e => set("birthdate", e.target.value)} dir="rtl" />
              </div>
              {form.birthdate && (
                <div className="age-badge">العمر: {calcAge()} سنة</div>
              )}
            </div>
            {errors.birthdate && <div className="field-error">{errors.birthdate}</div>}

            <div className="radio-group">
              <label className="radio-label">الجنس:</label>
              <div className="radio-options">
                {["ذكر", "أنثى"].map(g => (
                  <label key={g} className={`radio-opt ${form.gender === g ? "selected" : ""}`}>
                    <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => set("gender", g)} hidden />
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
                {["أعزب", "متزوج", "مطلق", "أرمل"].map(m => (
                  <label key={m} className={`radio-opt ${form.marital === m ? "selected" : ""}`}>
                    <input type="radio" name="marital" value={m} checked={form.marital === m} onChange={() => set("marital", m)} hidden />
                    {m}
                  </label>
                ))}
              </div>
            </div>

            <div className="auth-field">
              <span>🌍</span>
              <input type="text" placeholder="الدولة" value={form.country} onChange={e => set("country", e.target.value)} dir="rtl" />
            </div>

            <div className="auth-field">
              <span>🏙️</span>
              <input type="text" placeholder="المدينة" value={form.city} onChange={e => set("city", e.target.value)} dir="rtl" />
            </div>

            <div className="auth-field">
              <span>📍</span>
              <input type="text" placeholder="مكان السكن الحالي" value={form.address} onChange={e => set("address", e.target.value)} dir="rtl" />
            </div>

            <div className="auth-field">
              <span>💼</span>
              <input type="text" placeholder="المهنة" value={form.job} onChange={e => set("job", e.target.value)} dir="rtl" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="auth-form">
            <div className="avatar-upload" onClick={() => fileRef.current?.click()}>
              {avatarPreview ? (
                <img src={avatarPreview} alt="الصورة الشخصية" className="avatar-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={32} />
                  <span>أضف صورة شخصية</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatar} />
            </div>

            <div className="auth-field textarea-field">
              <textarea
                placeholder="نبذة تعريفية قصيرة عنك..."
                value={form.bio}
                onChange={e => set("bio", e.target.value)}
                rows={4}
                dir="rtl"
              />
            </div>
          </div>
        )}

        <div className="register-nav">
          {step > 1 && (
            <button className="auth-btn secondary" onClick={() => setStep(s => s - 1)}>
              <ArrowRight size={16} /> السابق
            </button>
          )}
          {step < 3 ? (
            <button className="auth-btn primary" onClick={handleNext}>
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button className="auth-btn primary" onClick={handleSubmit}>
              إنشاء الحساب ✨
            </button>
          )}
        </div>

        <div className="auth-switch">
          لديك حساب بالفعل؟
          <button onClick={switchToLogin}>تسجيل الدخول</button>
        </div>
      </div>
    </div>
  );
}
