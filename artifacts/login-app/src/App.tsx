import { useState } from "react";

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (username === "fouad" && password === "2017") {
        onLogin();
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="rgba(255,255,255,0.15)" />
            <path d="M24 12C20.686 12 18 14.686 18 18C18 21.314 20.686 24 24 24C27.314 24 30 21.314 30 18C30 14.686 27.314 12 24 12Z" fill="white"/>
            <path d="M14 36C14 31.582 18.477 28 24 28C29.523 28 34 31.582 34 36" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="login-title">تسجيل الدخول</h1>
        <p className="login-subtitle">أهلاً بك، يرجى إدخال بياناتك</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">اسم المستخدم</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                className="login-input"
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">كلمة المرور</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type="password"
                className="login-input"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="rtl"
              />
            </div>
          </div>

          {error && (
            <div className="error-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner" />
            ) : (
              "دخول"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function WelcomePage({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <div className="welcome-animation">
          <div className="confetti-circle c1" />
          <div className="confetti-circle c2" />
          <div className="confetti-circle c3" />
          <div className="check-icon">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="26" fill="rgba(255,255,255,0.2)" />
              <path d="M14 26L22 34L38 18" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="welcome-title">أهلاً وسهلاً يا فؤاد! 🎉</h1>
        <p className="welcome-msg">
          تم تسجيل دخولك بنجاح. يسعدنا وجودك معنا!
        </p>

        <div className="welcome-badge">
          <span className="badge-dot" />
          متصل الآن
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn
    ? <WelcomePage onLogout={() => setLoggedIn(false)} />
    : <LoginPage onLogin={() => setLoggedIn(true)} />;
}
