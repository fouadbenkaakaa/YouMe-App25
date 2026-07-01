import { useState } from "react";
import { Search, Sliders, X, User, MapPin, Briefcase, Heart, Globe, Sparkles } from "lucide-react";

const MOCK_RESULTS = [
  { id: "u1", name: "أحمد الحربي", age: 32, gender: "ذكر", marital: "أعزب", country: "أستراليا", city: "سيدني", job: "مزارع", hobbies: ["زراعة", "صيد"], lang: ["عربية", "إنجليزية"], match: 92, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed&backgroundColor=b6e3f4" },
  { id: "u2", name: "فاطمة الزهراني", age: 28, gender: "أنثى", marital: "أعزبة", country: "كندا", city: "تورنتو", job: "مدرسة", hobbies: ["قراءة", "طبخ"], lang: ["عربية", "فرنسية"], match: 87, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima&backgroundColor=ffdfbf" },
  { id: "u3", name: "يوسف العتيبي", age: 35, gender: "ذكر", marital: "متزوج", country: "أستراليا", city: "ملبورن", job: "مزارع", hobbies: ["زراعة", "رياضة"], lang: ["عربية", "إنجليزية"], match: 78, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousuf2&backgroundColor=d1d4f9" },
  { id: "u4", name: "مريم الشهري", age: 30, gender: "أنثى", marital: "مطلقة", country: "فرنسا", city: "باريس", job: "طبيبة", hobbies: ["سفر", "فن"], lang: ["عربية", "فرنسية", "إنجليزية"], match: 65, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mariam&backgroundColor=c0aede" },
  { id: "u5", name: "عمر البلوي", age: 38, gender: "ذكر", marital: "متزوج", country: "أستراليا", city: "بريسبان", job: "مزارع", hobbies: ["زراعة", "صيد", "رياضة"], lang: ["عربية"], match: 81, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omar&backgroundColor=b6e3f4" },
  { id: "u6", name: "هدى المطيري", age: 26, gender: "أنثى", marital: "أعزبة", country: "بريطانيا", city: "لندن", job: "مهندسة", hobbies: ["تقنية", "قراءة"], lang: ["عربية", "إنجليزية"], match: 70, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=huda&backgroundColor=ffdfbf" },
];

const COUNTRIES = ["الكل", "أستراليا", "كندا", "فرنسا", "بريطانيا", "المملكة العربية السعودية", "الإمارات"];
const PROFESSIONS = ["الكل", "مزارع", "مدرس", "طبيب", "مهندس", "محامي", "موظف", "رجل أعمال"];
const HOBBIES_LIST = ["زراعة", "صيد", "قراءة", "طبخ", "رياضة", "سفر", "فن", "موسيقى", "تقنية"];
const LANGUAGES = ["عربية", "إنجليزية", "فرنسية", "ألمانية", "إسبانية", "تركية"];

export default function SmartSearchPage() {
  const [query, setQuery] = useState("");
  const [nlpQuery, setNlpQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState(MOCK_RESULTS);
  const [searched, setSearched] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  const [filters, setFilters] = useState({
    gender: "الكل", minAge: 18, maxAge: 60,
    marital: "الكل", country: "الكل",
    job: "الكل", hobbies: [] as string[], language: "الكل",
  });

  const setFilter = (k: string, v: any) => setFilters(f => ({ ...f, [k]: v }));

  const toggleHobby = (h: string) => setFilters(f => ({
    ...f,
    hobbies: f.hobbies.includes(h) ? f.hobbies.filter(x => x !== h) : [...f.hobbies, h],
  }));

  const handleSearch = () => {
    let r = MOCK_RESULTS;
    if (filters.gender !== "الكل") r = r.filter(u => u.gender === filters.gender);
    if (filters.country !== "الكل") r = r.filter(u => u.country === filters.country);
    if (filters.marital !== "الكل") r = r.filter(u => u.marital.startsWith(filters.marital));
    if (filters.job !== "الكل") r = r.filter(u => u.job === filters.job);
    if (filters.hobbies.length > 0) r = r.filter(u => filters.hobbies.some(h => u.hobbies.includes(h)));
    r = r.filter(u => u.age >= filters.minAge && u.age <= filters.maxAge);
    setResults(r);
    setSearched(true);
  };

  const handleNLP = () => {
    if (!nlpQuery.trim()) return;
    setAiProcessing(true);
    setTimeout(() => {
      setAiProcessing(false);
      // Simulate AI parsing
      if (nlpQuery.includes("مزارع") || nlpQuery.includes("زراع")) {
        setFilter("job", "مزارع");
      }
      if (nlpQuery.includes("أستراليا")) setFilter("country", "أستراليا");
      if (nlpQuery.includes("متزوج")) setFilter("marital", "متزوج");
      const minMatch = nlpQuery.match(/(\d+)/);
      const maxMatch = nlpQuery.match(/و(\d+)/);
      if (minMatch) setFilter("minAge", parseInt(minMatch[1]));
      if (maxMatch) setFilter("maxAge", parseInt(maxMatch[1]));
      handleSearch();
      setShowFilters(true);
    }, 1500);
  };

  const matchColor = (pct: number) => pct >= 85 ? "#22c55e" : pct >= 70 ? "#f59e0b" : "#6b7280";

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🔍 البحث الذكي</h1>
      </div>

      {/* NLP Search */}
      <div className="nlp-search-box">
        <div className="nlp-badge"><Sparkles size={14} /> مدعوم بالذكاء الاصطناعي</div>
        <p className="nlp-hint">اكتب ما تبحث عنه بلغتك الطبيعية</p>
        <div className="nlp-input-row">
          <input
            className="nlp-input"
            type="text"
            placeholder='مثال: "ابحث عن مزارعين من أستراليا بين 30 و40 سنة ومتزوجين"'
            value={nlpQuery}
            onChange={e => setNlpQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleNLP()}
            dir="rtl"
          />
          <button className="nlp-btn" onClick={handleNLP} disabled={aiProcessing}>
            {aiProcessing ? <span className="spinner-sm" style={{ borderTopColor: "#fff" }} /> : <Sparkles size={18} />}
            {aiProcessing ? "جارٍ التحليل..." : "تحليل بالذكاء"}
          </button>
        </div>
      </div>

      {/* Regular Search */}
      <div className="search-bar" style={{ marginBottom: "12px" }}>
        <Search size={16} />
        <input type="text" placeholder="ابحث بالاسم..." value={query} onChange={e => setQuery(e.target.value)} style={{ flex: 1 }} />
        <button className="filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
          <Sliders size={16} /> فلاتر متقدمة
          {showFilters && <X size={14} />}
        </button>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-grid">
            <div className="filter-group">
              <label>الجنس</label>
              <div className="radio-options">
                {["الكل", "ذكر", "أنثى"].map(g => (
                  <label key={g} className={`radio-opt-sm ${filters.gender === g ? "selected" : ""}`}
                    onClick={() => setFilter("gender", g)}>{g}</label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>العمر: {filters.minAge} – {filters.maxAge}</label>
              <div className="age-range">
                <input type="range" min={18} max={80} value={filters.minAge}
                  onChange={e => setFilter("minAge", +e.target.value)} />
                <input type="range" min={18} max={80} value={filters.maxAge}
                  onChange={e => setFilter("maxAge", +e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label>الحالة الاجتماعية</label>
              <div className="radio-options">
                {["الكل", "أعزب", "متزوج", "مطلق", "أرمل"].map(m => (
                  <label key={m} className={`radio-opt-sm ${filters.marital === m ? "selected" : ""}`}
                    onClick={() => setFilter("marital", m)}>{m}</label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>الدولة</label>
              <select className="filter-select" value={filters.country} onChange={e => setFilter("country", e.target.value)}>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>المهنة</label>
              <select className="filter-select" value={filters.job} onChange={e => setFilter("job", e.target.value)}>
                {PROFESSIONS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>اللغة</label>
              <select className="filter-select" value={filters.language} onChange={e => setFilter("language", e.target.value)}>
                {["الكل", ...LANGUAGES].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="filter-group">
            <label>الهوايات</label>
            <div className="hobbies-picker">
              {HOBBIES_LIST.map(h => (
                <label key={h} className={`hobby-chip ${filters.hobbies.includes(h) ? "selected" : ""}`}
                  onClick={() => toggleHobby(h)}>{h}</label>
              ))}
            </div>
          </div>

          <button className="btn-primary" style={{ width: "100%" }} onClick={handleSearch}>
            <Search size={16} /> بحث
          </button>
        </div>
      )}

      {searched && (
        <div className="search-results-header">
          {results.length} نتيجة {filters.country !== "الكل" ? `من ${filters.country}` : ""}
        </div>
      )}

      <div className="search-results-grid">
        {(searched ? results : MOCK_RESULTS).map(user => (
          <div key={user.id} className="search-result-card">
            <div className="match-badge" style={{ background: matchColor(user.match) }}>
              {user.match}% توافق
            </div>
            <img src={user.avatar} alt={user.name} className="result-avatar" />
            <div className="result-name">{user.name}</div>
            <div className="result-tags">
              <span><User size={12} /> {user.age} سنة · {user.gender}</span>
              <span><MapPin size={12} /> {user.city}، {user.country}</span>
              <span><Briefcase size={12} /> {user.job}</span>
              <span><Globe size={12} /> {user.lang.join("، ")}</span>
            </div>
            <div className="result-hobbies">
              {user.hobbies.map(h => <span key={h} className="hobby-tag">{h}</span>)}
            </div>
            <div className="result-actions">
              <button className="btn-primary" style={{ fontSize: "13px" }}>إضافة صديق</button>
              <button className="btn-ghost" style={{ fontSize: "13px" }}>💬 رسالة</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
