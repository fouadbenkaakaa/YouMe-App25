import { useState } from "react";
import { Image, Video, MapPin, BarChart2, Globe, Users, Lock, ChevronDown, Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import Post from "../components/Post";
import { MOCK_POSTS, MOCK_STORIES } from "../data/mockData";

export default function HomePage() {
  const { user } = useApp();
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState("");
  const [privacy, setPrivacy] = useState("عام");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      author: { name: user!.name, avatar: user!.avatar, location: "" },
      time: "الآن",
      text: newPost,
      image: null,
      likes: 0,
      comments: 0,
      shares: 0,
      privacy,
      liked: false,
      saved: false,
    };
    setPosts([post as any, ...posts]);
    setNewPost("");
  };

  return (
    <div className="home-layout">
      <aside className="home-sidebar left">
        <div className="sidebar-profile" >
          <img src={user?.avatar} alt={user?.name} />
          <span>{user?.name}</span>
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          {[
            { icon: "👥", label: "الأصدقاء" },
            { icon: "📺", label: "الفيديوهات" },
            { icon: "🛒", label: "السوق" },
            { icon: "📋", label: "المجموعات" },
            { icon: "🔖", label: "المحفوظات" },
            { icon: "📅", label: "الأحداث" },
            { icon: "🎮", label: "الألعاب" },
          ].map(item => (
            <button key={item.label} className="sidebar-nav-item">
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="home-feed">
        <div className="stories-bar">
          <div className="story-add">
            <div className="story-add-img">
              <img src={user?.avatar} alt="" />
              <div className="story-add-plus"><Plus size={14} /></div>
            </div>
            <span>إضافة قصة</span>
          </div>
          {MOCK_STORIES.map(story => (
            <div key={story.id} className="story-item">
              <div className="story-img-wrap">
                <img src={story.image} alt={story.name} className="story-bg" />
                <img src={story.avatar} alt={story.name} className="story-avatar-s" />
              </div>
              <span>{story.name}</span>
            </div>
          ))}
        </div>

        <div className="post-composer">
          <img src={user?.avatar} alt={user?.name} className="composer-avatar" />
          <div className="composer-body">
            <div className="composer-input-wrap">
              <input
                type="text"
                placeholder={`ما الذي يدور في ذهنك يا ${user?.name?.split(" ")[0]}؟`}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handlePost()}
              />
            </div>
            <div className="composer-footer">
              <div className="composer-actions">
                <button className="composer-action"><Image size={18} style={{color:"#45bd62"}} /> صورة/فيديو</button>
                <button className="composer-action"><MapPin size={18} style={{color:"#f7b928"}} /> الموقع</button>
                <button className="composer-action"><BarChart2 size={18} style={{color:"#e4476b"}} /> استطلاع</button>
              </div>
              <div className="composer-right">
                <div className="privacy-select" onClick={() => setShowPrivacy(!showPrivacy)}>
                  {privacy === "عام" ? <Globe size={14} /> : privacy === "الأصدقاء فقط" ? <Users size={14} /> : <Lock size={14} />}
                  <span>{privacy}</span>
                  <ChevronDown size={12} />
                  {showPrivacy && (
                    <div className="privacy-dropdown">
                      {["عام", "الأصدقاء فقط", "أنا فقط"].map(p => (
                        <button key={p} onClick={() => { setPrivacy(p); setShowPrivacy(false); }}>{p}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="composer-submit" onClick={handlePost} disabled={!newPost.trim()}>نشر</button>
              </div>
            </div>
          </div>
        </div>

        <div className="posts-list">
          {posts.map(post => <Post key={post.id} post={post} />)}
        </div>
      </main>

      <aside className="home-sidebar right">
        <div className="sidebar-section-title">🔴 الأصدقاء النشطون</div>
        {[
          { name: "سارة المنصور", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" },
          { name: "محمد العمري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9" },
          { name: "نورة الشمري", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede" },
          { name: "خالد الزهراني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf" },
          { name: "ريم العتيبي", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reem&backgroundColor=d1d4f9" },
        ].map(f => (
          <div key={f.name} className="active-friend">
            <div className="active-friend-avatar">
              <img src={f.avatar} alt={f.name} />
              <span className="online-dot" />
            </div>
            <span>{f.name}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}
