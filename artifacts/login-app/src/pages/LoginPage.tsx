import { useState } from "react";
import { Phone, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useApp, MOCK_USER } from "../context/AppContext";

interface Props { switchToRegister: () => void; }

export default function LoginPage({ switchToRegister }: Props) {
  const { login } = useApp();
  const [tab, setTab] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if ((identifier === "fouad" || identifier === "05xxxxxxxx" || identifier === "fouad@example.com") && password === "2017") {
        login(MOCK_USER);
      } else {
        setError("بيانات الدخول غير صحيحة. حاول مجدداً.");
        setLoading(false);
      }
    }, 900);
  };

  if (forgotMode) {
    return (
      <div className="auth-bg">
        <div className="auth-card">
          <button className="back-btn" onClick={() => setForgotMode(false)}><ArrowLeft size={20} /></button>
          <div className="auth-logo">و</div>
          <h2 className="auth-title">استعادة كلمة المرور</h2>
          <p className="auth-sub">أدخل بريدك الإلكتروني أو رقم هاتفك لإرسال رابط الاستعادة</p>
          <div className="auth-field">
            <Mail size={18} />
            <input type="text" placeholder="البريد الإلكتروني أو رقم الهاتف" dir="rtl" />
          </div>
          <button className="auth-btn primary">إرسال رابط الاستعادة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">و</div>
        <h1 className="auth-app-name">وصلة</h1>
        <p className="auth-tagline">تواصل مع من تحب</p>

        <div className="auth-tabs">
          <button className={tab === "phone" ? "active" : ""} onClick={() => setTab("phone")}>
            <Phone size={16} /> رقم الهاتف
          </button>
          <button className={tab === "email" ? "active" : ""} onClick={() => setTab("email")}>
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
              onChange={e => setIdentifier(e.target.value)}
              dir="rtl"
              required
            />
          </div>

          <div className="auth-field">
            <Lock size={18} />
            <input
              type={showPass ? "text" : "password"}
              placeholder="كلمة المرور"
              value={password}
              onChange={e => setPassword(e.target.value)}
              dir="rtl"
              required
            />
            <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-btn forgot-link" type="button" onClick={() => setForgotMode(true)}>
            نسيت كلمة المرور؟
          </button>

          <button type="submit" className="auth-btn primary" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : "تسجيل الدخول"}
          </button>

          <div className="auth-divider"><span>أو</span></div>

          <div className="auth-biometric">
            <button type="button" className="auth-btn biometric" disabled>
              <span>🔐</span> تسجيل الدخول بالبصمة (قريباً)
            </button>
          </div>
        </form>

        <div className="auth-hint">
          <span>💡 تلميح: اسم المستخدم <strong>fouad</strong> وكلمة المرور <strong>2017</strong></span>
        </div>

        <div className="auth-switch">
          ليس لديك حساب؟
          <button onClick={switchToRegister}>إنشاء حساب جديد</button>
        </div>
      </div>
    </div>
  );
}
