import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Globe, Users, Lock, MapPin, Send } from "lucide-react";

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const privacyIcon = post.privacy === "عام" ? Globe : post.privacy === "الأصدقاء فقط" ? Users : Lock;
  const PrivacyIcon = privacyIcon;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <img src={post.author.avatar} alt={post.author.name} className="post-avatar" />
          <div>
            <div className="post-author-name">{post.author.name}</div>
            <div className="post-meta">
              <span>{post.time}</span>
              {post.author.location && (
                <span className="post-location"><MapPin size={11} /> {post.author.location}</span>
              )}
              <span className="post-privacy"><PrivacyIcon size={12} /></span>
            </div>
          </div>
        </div>
        <button className="post-more"><MoreHorizontal size={20} /></button>
      </div>

      {post.text && <p className="post-text">{post.text}</p>}

      {post.image && (
        <div className="post-image-wrap">
          <img src={post.image} alt="منشور" className="post-image" />
        </div>
      )}

      {post.isPoll && (
        <div className="post-poll">
          {post.pollOptions.map((opt: any, i: number) => (
            <div key={i} className="poll-option">
              <div className="poll-bar" style={{ width: `${opt.percent}%` }} />
              <span className="poll-text">{opt.text}</span>
              <span className="poll-percent">{opt.percent}%</span>
            </div>
          ))}
          <div className="poll-total">{post.pollOptions.reduce((s: number, o: any) => s + o.votes, 0)} صوت</div>
        </div>
      )}

      <div className="post-stats">
        <span className="post-stat-likes">
          <span className="like-emoji">❤️</span> {likes.toLocaleString("ar-SA")}
        </span>
        <span className="post-stat-right">
          <button onClick={() => setShowComments(!showComments)}>{post.comments} تعليق</button>
          <span>{post.shares} مشاركة</span>
        </span>
      </div>

      <div className="post-divider" />

      <div className="post-actions">
        <button className={`post-action-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
          <Heart size={18} fill={liked ? "#e11d48" : "none"} /> إعجاب
        </button>
        <button className="post-action-btn" onClick={() => setShowComments(!showComments)}>
          <MessageCircle size={18} /> تعليق
        </button>
        <button className="post-action-btn">
          <Share2 size={18} /> مشاركة
        </button>
        <button className={`post-action-btn ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)}>
          <Bookmark size={18} fill={saved ? "#7c3aed" : "none"} /> حفظ
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <div className="comment-input-wrap">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4" alt="" className="comment-avatar" />
            <div className="comment-input-box">
              <input
                type="text"
                placeholder="اكتب تعليقاً..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button className="comment-send" onClick={() => setComment("")}><Send size={16} /></button>
            </div>
          </div>
          <div className="comment-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" alt="" className="comment-avatar" />
            <div className="comment-bubble">
              <span className="comment-name">سارة المنصور</span>
              <span className="comment-text">جميل جداً! شكراً للمشاركة 😊</span>
            </div>
          </div>
          <div className="comment-item">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9" alt="" className="comment-avatar" />
            <div className="comment-bubble">
              <span className="comment-name">محمد العمري</span>
              <span className="comment-text">رائع! استمر في التميز 💪</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
