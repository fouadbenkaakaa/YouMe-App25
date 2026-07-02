import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Globe, Users, Lock, MapPin, Send, X } from "lucide-react";
import { useApp } from "../context/AppContext";

interface CommentAuthor {
  name: string;
  username: string;
  avatar: string;
}

interface Comment {
  id: string;
  userId: string;
  author: CommentAuthor;
  text: string;
  time: string;
}

interface PostProps {
  post: any;
}

export default function Post({ post }: PostProps) {
  const { user, navigateTo } = useApp();

  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.commentsList ?? []);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes((l: number) => liked ? l - 1 : l + 1);
  };

  const openComments = () => {
    setShowComments(v => {
      if (!v) {
        // scroll input into view after render
        setTimeout(() => inputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 120);
      }
      return !v;
    });
  };

  const sendComment = () => {
    if (!draft.trim() || !user) return;
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      author: { name: user.name, username: user.username, avatar: user.avatar },
      text: draft.trim(),
      time: "الآن",
    };
    setComments(prev => [...prev, newComment]);
    setDraft("");
    // scroll to bottom of comments
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendComment();
  };

  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo("profile");
  };

  const PrivacyIcon = post.privacy === "عام" ? Globe : post.privacy === "الأصدقاء فقط" ? Users : Lock;

  return (
    <div className="post-card">
      {/* ── Header ── */}
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="post-avatar post-avatar-clickable"
            onClick={goToProfile}
          />
          <div>
            <div
              className="post-author-name post-author-name-clickable"
              onClick={goToProfile}
            >
              {post.author.name}
            </div>
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

      {/* ── Body ── */}
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

      {/* ── Stats ── */}
      <div className="post-stats">
        <span className="post-stat-likes">
          <span className="like-emoji">❤️</span> {likes.toLocaleString("ar-SA")}
        </span>
        <span className="post-stat-right">
          <button onClick={openComments}>
            {comments.length} تعليق
          </button>
          <span>{post.shares} مشاركة</span>
        </span>
      </div>

      <div className="post-divider" />

      {/* ── Actions ── */}
      <div className="post-actions">
        <button className={`post-action-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
          <Heart size={18} fill={liked ? "#e11d48" : "none"} /> إعجاب
        </button>
        <button className="post-action-btn" onClick={openComments}>
          <MessageCircle size={18} /> تعليق
        </button>
        <button className="post-action-btn">
          <Share2 size={18} /> مشاركة
        </button>
        <button className={`post-action-btn ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)}>
          <Bookmark size={18} fill={saved ? "#7c3aed" : "none"} /> حفظ
        </button>
      </div>

      {/* ── Comments Panel ── */}
      {showComments && (
        <div className="post-comments">
          {/* Existing comments */}
          <div className="comments-scroll-area">
            {comments.length === 0 && (
              <div className="comments-empty">كن أول من يعلق ✨</div>
            )}
            {comments.map(c => (
              <div key={c.id} className="comment-item">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  className="comment-avatar comment-avatar-clickable"
                  onClick={goToProfile}
                />
                <div className="comment-bubble">
                  <span
                    className="comment-name comment-name-clickable"
                    onClick={goToProfile}
                  >
                    {c.author.name}
                  </span>
                  <span className="comment-text">{c.text}</span>
                  <span className="comment-time">{c.time}</span>
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Write a comment */}
          <div className="comment-input-wrap" ref={inputRef as any}>
            <img
              src={user?.avatar}
              alt={user?.name}
              className="comment-avatar"
            />
            <div className="comment-input-box">
              <input
                type="text"
                placeholder="اكتب تعليقاً..."
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="comment-send"
                disabled={!draft.trim()}
                onClick={sendComment}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
