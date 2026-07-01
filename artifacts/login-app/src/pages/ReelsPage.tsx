import { useState, useRef } from "react";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, MoreHorizontal, Music, UserPlus } from "lucide-react";

const REELS = [
  {
    id: "r1",
    user: "سارة المنصور",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",
    desc: "منظر رائع من قمة الجبل! 🏔️✨ #سفر #طبيعة #مغامرة",
    audio: "أغنية: عيون القلب - فيروز",
    likes: 24500,
    comments: 1230,
    shares: 890,
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    emoji: "🏔️",
    liked: false,
  },
  {
    id: "r2",
    user: "محمد العمري",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9",
    desc: "تعلم طريقة جديدة لزراعة الطماطم في المنزل 🍅🌱 #زراعة #ديكور",
    audio: "صوت الطبيعة",
    likes: 8900,
    comments: 445,
    shares: 230,
    bg: "linear-gradient(135deg, #134e4a 0%, #065f46 50%, #064e3b 100%)",
    emoji: "🌱",
    liked: true,
  },
  {
    id: "r3",
    user: "نورة الشمري",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",
    desc: "وصفة الكنافة السريعة في 5 دقائق! 🍮😍 #طبخ #حلويات",
    audio: "موسيقى مطبخ - خاص",
    likes: 56000,
    comments: 3400,
    shares: 12000,
    bg: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)",
    emoji: "🍮",
    liked: false,
  },
  {
    id: "r4",
    user: "خالد الزهراني",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",
    desc: "أفضل لقطة في حياتي 📸🌅 #تصوير #غروب #الرياض",
    audio: "مقطوعة: نسيم الصحراء",
    likes: 18200,
    comments: 760,
    shares: 3400,
    bg: "linear-gradient(135deg, #1c1917 0%, #292524 50%, #44403c 100%)",
    emoji: "🌅",
    liked: false,
  },
];

function formatNum(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function ReelsPage() {
  const [current, setCurrent] = useState(0);
  const [reels, setReels] = useState(REELS);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: string) => {
    setReels(r => r.map(x => x.id === id
      ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 }
      : x
    ));
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    setCurrent(Math.round(scrollTop / clientHeight));
  };

  const reel = reels[current];

  return (
    <div className="reels-container" ref={containerRef} onScroll={handleScroll}>
      {reels.map((r, i) => (
        <div key={r.id} className="reel-item" style={{ background: r.bg }}>
          {/* Big emoji as placeholder for video */}
          <div className="reel-video-placeholder" onClick={() => setPaused(!paused)}>
            <div className="reel-emoji-big">{r.emoji}</div>
            {paused && i === current && (
              <div className="reel-pause-overlay"><Play size={48} fill="white" /></div>
            )}
          </div>

          {/* Top bar */}
          <div className="reel-top-bar">
            <div className="reels-title">📽️ الريلز</div>
            <div className="reel-top-actions">
              <button className="reel-icon-btn" onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
              <button className="reel-icon-btn"><MoreHorizontal size={22} /></button>
            </div>
          </div>

          {/* Side actions */}
          <div className="reel-side-actions">
            <div className="reel-action-item">
              <button className={`reel-action-btn ${r.liked ? "liked" : ""}`} onClick={() => toggleLike(r.id)}>
                <Heart size={28} fill={r.liked ? "#e11d48" : "none"} />
              </button>
              <span>{formatNum(r.likes)}</span>
            </div>
            <div className="reel-action-item">
              <button className="reel-action-btn"><MessageCircle size={28} /></button>
              <span>{formatNum(r.comments)}</span>
            </div>
            <div className="reel-action-item">
              <button className="reel-action-btn"><Share2 size={28} /></button>
              <span>{formatNum(r.shares)}</span>
            </div>
            <div className="reel-action-item">
              <button className="reel-action-btn"><UserPlus size={24} /></button>
              <span>تابع</span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="reel-bottom">
            <div className="reel-user-row">
              <img src={r.avatar} alt={r.user} className="reel-user-avatar" />
              <span className="reel-user-name">{r.user}</span>
              <button className="reel-follow-btn">متابعة</button>
            </div>
            <p className="reel-desc">{r.desc}</p>
            <div className="reel-audio">
              <Music size={14} className="reel-music-icon" />
              <span className="reel-audio-scroll">{r.audio}</span>
            </div>
          </div>

          {/* Progress dots */}
          <div className="reel-progress-dots">
            {reels.map((_, idx) => (
              <div key={idx} className={`reel-dot ${idx === current ? "active" : ""}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
