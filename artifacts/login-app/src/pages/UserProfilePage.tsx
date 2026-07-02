import { useState } from "react";
import { Edit3, MapPin, Briefcase, Calendar, Users, UserCheck, Camera, MessageCircle, UserPlus, UserMinus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getUserById } from "../data/mockUsers";
import { MOCK_POSTS } from "../data/mockData";
import Post from "../components/Post";
import VerificationBadge from "../components/VerificationBadge";
import type { BadgeType } from "../components/VerificationBadge";

const BADGE_MAP: Record<string, BadgeType> = {
  sara: "gray", mohammed: "blue", noura: "gray", ab: "green", "1": "blue",
};

const COVER_PRESETS = [
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
];

export default function UserProfilePage() {
  const { user: currentUser, viewingUserId, navigateTo, followedIds, toggleFollow, t, updateCover, updateAvatar } = useApp();
  const [tab, setTab] = useState<"posts" | "about">("posts");
  const [showCoverModal, setShowCoverModal] = useState(false);

  const profileUser = viewingUserId ? getUserById(viewingUserId) : null;
  if (!profileUser) {
    return (
      <div className="page-container">
        <div className="empty-state"><span>😕</span><p>المستخدم غير موجود</p></div>
      </div>
    );
  }

  const isOwn = currentUser?.id === profileUser.id;
  const isFollowing = followedIds.has(profileUser.id);
  const badge = BADGE_MAP[profileUser.id] ?? null;

  // Posts authored by this user
  const userPosts = MOCK_POSTS.filter(p => p.userId === profileUser.id);

  const handleCoverPreset = (url: string) => {
    if (isOwn) updateCover(url);
    setShowCoverModal(false);
  };

  return (
    <div className="profile-page">
      {/* Cover */}
      <div className="profile-cover-wrap">
        <img src={profileUser.cover} alt="غلاف" className="profile-cover" />
        {isOwn && (
          <button className="change-cover-btn" onClick={() => setShowCoverModal(true)}>
            <Camera size={16} /> {t("changeCover")}
          </button>
        )}
      </div>

      {/* Cover picker */}
      {showCoverModal && (
        <div className="checkout-overlay" onClick={() => setShowCoverModal(false)}>
          <div className="checkout-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <h3>🖼️ {t("changeCover")}</h3>
            <div className="cover-presets-grid">
              {COVER_PRESETS.map(url => (
                <img key={url} src={url} alt="" className="cover-preset-thumb" onClick={() => handleCoverPreset(url)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info bar */}
      <div className="profile-info-bar">
        <div className="profile-avatar-wrap">
          <img src={profileUser.avatar} alt={profileUser.name} className="profile-avatar-lg" />
          {isOwn && (
            <button className="change-avatar-btn" onClick={() => {}}>
              <Camera size={14} />
            </button>
          )}
        </div>

        <div className="profile-details">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h1 className="profile-name">{profileUser.name}</h1>
            {badge && <VerificationBadge type={badge} size="lg" showLabel />}
          </div>
          <p className="profile-bio">{profileUser.bio}</p>
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-num">{userPosts.length}</span>
              <span className="stat-label">{t("posts")}</span>
            </div>
            <div className="profile-stat">
              <span className="stat-num">{profileUser.followersCount.toLocaleString("ar")}</span>
              <span className="stat-label">{t("followers")}</span>
            </div>
            <div className="profile-stat">
              <span className="stat-num">{profileUser.followingCount}</span>
              <span className="stat-label">{t("following")}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isOwn ? (
            <button className="btn-primary"><Edit3 size={16} /> {t("editProfile")}</button>
          ) : (
            <>
              <button
                className={isFollowing ? "btn-ghost-purple" : "btn-primary"}
                onClick={() => toggleFollow(profileUser.id)}
              >
                {isFollowing
                  ? <><UserMinus size={16} /> {t("unfollow")}</>
                  : <><UserPlus size={16} /> {t("follow")}</>}
              </button>
              <button className="btn-ghost-purple" onClick={() => navigateTo("messages")}>
                <MessageCircle size={16} /> {t("message")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar profile-tabs">
        <button className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>المنشورات</button>
        <button className={tab === "about" ? "active" : ""} onClick={() => setTab("about")}>معلومات</button>
      </div>

      {/* Content */}
      <div className="profile-content">
        {tab === "posts" && (
          <div className="profile-posts-list" style={{ maxWidth: 600, margin: "0 auto" }}>
            {userPosts.length === 0
              ? <div className="empty-state"><span>📝</span><p>لا توجد منشورات بعد</p></div>
              : userPosts.map(p => <Post key={p.id} post={p} />)
            }
          </div>
        )}

        {tab === "about" && (
          <div className="about-page">
            <div className="about-section">
              <h3>📋 المعلومات الشخصية</h3>
              <div className="about-grid">
                <div className="about-item"><span>الاسم</span><strong>{profileUser.name}</strong></div>
                <div className="about-item"><span>@</span><strong>{profileUser.username}</strong></div>
                <div className="about-item"><span>العمر</span><strong>{profileUser.age} سنة</strong></div>
                <div className="about-item"><span>الجنس</span><strong>{profileUser.gender}</strong></div>
                <div className="about-item"><span>السكن</span><strong>{profileUser.location}</strong></div>
                <div className="about-item"><span>العمل</span><strong>{profileUser.work}</strong></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
