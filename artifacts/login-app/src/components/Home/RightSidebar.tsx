// ═══════════════════════════════════════════════════════════════
//  RightSidebar.tsx
// ═══════════════════════════════════════════════════════════════
import WeatherCard from "./WeatherCard";
import LevelCard from "./LevelCard";
import IconGrid from "./IconGrid";

const TRENDING = [
{ tag: "#YouMe_تطبيق", posts: "12.5K" },
{ tag: "#تطوير_الويب", posts: "8.2K" },
{ tag: "#React", posts: "45K" },
];

const CONTACTS = [
{ name: "سارة المنصور",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" },
{ name: "محمد العمري",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9" },
{ name: "نورة الشمري",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede" },
{ name: "خالد الزهراني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf" },
{ name: "ريم العتيبي",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reem&backgroundColor=d1d4f9" },
];

export default function RightSidebar() {
return (
<>
{/* ── Weather Card ────────────────────────────────────────── */}
<WeatherCard />

{/* ── Level Card ──────────────────────────────────────────── */}  
 <LevelCard />  

 {/* ── Shortcuts (IconGrid) ────────────────────────────────── */}  
 <IconGrid />  

 {/* ── Trending ──────────────────────────────────────────────── */}  
 <div className="sidebar-section">  
   <div className="sidebar-section-title">🔥 الأكثر تداولاً</div>  
   {TRENDING.map((t) => (  
     <div key={t.tag} className="trending-item">  
       <span className="trending-tag">{t.tag}</span>  
       <span className="trending-count">{t.posts} منشور</span>  
     </div>  
   ))}  
 </div>  

 {/* ── Contacts (Active Friends) ─────────────────────────────── */}  
 <div className="sidebar-section">  
   <div className="sidebar-section-title">🔴 الأصدقاء النشطون</div>  
   {CONTACTS.map((c) => (  
     <div key={c.name} className="active-friend">  
       <div className="active-friend-avatar">  
         <img src={c.avatar} alt={c.name} />  
         <span className="online-dot" />  
       </div>  
       <span>{c.name}</span>  
     </div>  
   ))}  
 </div>

</>
);
}