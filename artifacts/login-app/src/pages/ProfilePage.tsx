import { useState } from "react";
import { Edit3, MapPin, Briefcase, Calendar, Users, UserCheck, FileText, Camera } from "lucide-react";
import { useApp } from "../context/AppContext";
import { MOCK_POSTS } from "../data/mockData";
import Post from "../components/Post";

export default function ProfilePage() {
  const { user } = useApp();
  const [tab, setTab] = useState<"posts" | "about" | "friends" | "photos">("posts");

  return (
    <div className="profile-page">
      <div className="profile-cover-wrap">
        <img src={user?.cover} alt="غلاف" className="profile-cover" />
        <button className="change-cover-btn"><Camera size={16} /> تغيير صورة الغلاف</button>
      </div>

      <div className="profile-info-bar">
        <div className="profile-avatar-wrap">
          <img src={user?.avatar} alt={user?.name} className="profile-avatar-lg" />
          <button className="change-avatar-btn"><Camera size={14} /></button>
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-bio">{user?.bio}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-num">{user?.postsCount}</span>
              <span className="stat-label">منشور</span>
            </div>
            <div className="profile-stat">
              <span className="stat-num">{user?.friendsCount}</span>
              <span className="stat-label">صديق</span>
            </div>
            <div className="profile-stat">
              <span className="stat-num">{user?.followersCount.toLocaleString("ar")}</span>
              <span className="stat-label">متابع</span>
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="btn-primary"><Edit3 size={16} /> تعديل الملف الشخصي</button>
        </div>
      </div>

      <div className="tab-bar profile-tabs">
        {[
          { id: "posts", label: "المنشورات" },
          { id: "about", label: "معلومات عني" },
          { id: "friends", label: "الأصدقاء" },
          { id: "photos", label: "الصور" },
        ].map(t => (
          <button key={t.id} className={tab === t.id ? "active" : ""} onClick={() => setTab(t.id as any)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="profile-content">
        {tab === "posts" && (
          <div className="profile-posts-layout">
            <div className="profile-sidebar-info">
              <div className="info-card">
                <h3 className="info-card-title">نبذة عني</h3>
                <p className="info-card-bio">{user?.bio}</p>
                <div className="info-card-items">
                  <div className="info-item"><MapPin size={16} /> يسكن في {user?.location}</div>
                  <div className="info-item"><Briefcase size={16} /> {user?.work}</div>
                  <div className="info-item"><Calendar size={16} /> العمر: {user?.age} سنة</div>
                  <div className="info-item"><Users size={16} /> {user?.gender}</div>
                  <div className="info-item"><UserCheck size={16} /> {user?.maritalStatus}</div>
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card-title">الأصدقاء</h3>
                <div className="mini-friends">
                  {Array.from({ length: 6 }, (_, i) => (
                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=f${i}&backgroundColor=b6e3f4`} alt="" className="mini-friend-avatar" />
                  ))}
                </div>
                <div className="info-card-bio">{user?.friendsCount} صديق</div>
              </div>
            </div>
            <div className="profile-posts-list">
              {MOCK_POSTS.slice(0, 2).map(post => (
                <Post key={post.id} post={{ ...post, author: { ...post.author, name: user!.name, avatar: user!.avatar } }} />
              ))}
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className="about-page">
            <div className="about-section">
              <h3>📋 المعلومات الشخصية</h3>
              <div className="about-grid">
                <div className="about-item"><span>الاسم الكامل</span><strong>{user?.name}</strong></div>
                <div className="about-item"><span>العمر</span><strong>{user?.age} سنة</strong></div>
                <div className="about-item"><span>الجنس</span><strong>{user?.gender}</strong></div>
                <div className="about-item"><span>الحالة الاجتماعية</span><strong>{user?.maritalStatus}</strong></div>
                <div className="about-item"><span>مكان السكن</span><strong>{user?.location}</strong></div>
                <div className="about-item"><span>العمل</span><strong>{user?.work}</strong></div>
              </div>
            </div>
            <div className="about-section">
              <h3>📞 معلومات الاتصال</h3>
              <div className="about-grid">
                <div className="about-item"><span>رقم الهاتف</span><strong>مخفي 🔒</strong></div>
                <div className="about-item"><span>البريد الإلكتروني</span><strong>{user?.email}</strong></div>
              </div>
            </div>
          </div>
        )}

        {tab === "friends" && (
          <div className="friends-grid">
            {Array.from({ length: 6 }, (_, i) => {
              const names = ["سارة المنصور", "محمد العمري", "نورة الشمري", "عبدالله القحطاني", "لمياء السلمي", "طارق الغامدي"];
              const seeds = ["sara", "mohammed", "noura", "abdullah", "lamia", "tarek"];
              const bgs = ["ffdfbf", "d1d4f9", "c0aede", "b6e3f4", "b6e3f4", "ffdfbf"];
              return (
                <div key={i} className="friend-card">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seeds[i]}&backgroundColor=${bgs[i]}`} alt={names[i]} className="friend-card-avatar" />
                  <div className="friend-card-name">{names[i]}</div>
                  <button className="btn-ghost-purple">💬 مراسلة</button>
                </div>
              );
            })}
          </div>
        )}

        {tab === "photos" && (
          <div className="photos-grid">
            {[
              "photo-1506905925346-21bda4d32df4",
              "photo-1477959858617-67f85cf4f1df",
              "photo-1504674900247-0877df9cc836",
              "photo-1540575467063-178a50c2df87",
              "photo-1571115177098-24ec42ed204d",
              "photo-1558618666-fcd25c85cd64",
            ].map((p, i) => (
              <img key={i} src={`https://images.unsplash.com/${p}?w=300&q=80`} alt="" className="photo-thumb" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
