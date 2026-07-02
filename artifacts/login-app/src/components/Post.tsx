import { useState, useRef } from "react";
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  Globe, Users, Lock, MapPin, Send, Pencil, Trash2, Flag, Check, X,
} from "lucide-react";
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

export default function Post({ post }: { post: any }) {
  const { user, navigateTo, setViewingUserId, t } = useApp();

  const [liked, setLiked]               = useState(post.liked);
  const [likes, setLikes]               = useState(post.likes);
  const [saved, setSaved]               = useState(post.saved);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments]         = useState<Comment[]>(post.commentsList ?? []);
  const [draft, setDraft]               = useState("");
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [editDraft, setEditDraft]       = useState("");
  const [posting, setPosting]           = useState(false);
  const commentsEndRef                  = useRef<HTMLDivElement>(null);

  const toggleLike = () => { setLiked(!liked); setLikes((l: number) => liked ? l - 1 : l + 1); };

  const openComments = () => setShowComments(v => !v);

  /* Navigate to the author's profile */
  const goToUser = (userId: string) => {
    setViewingUserId(userId);
    navigateTo("user-profile");
  };

  /* Send comment — debounced to prevent duplicates */
  const sendComment = () => {
    if (!draft.trim() || !user || posting) return;
    setPosting(true);
    const c: Comment = {
      id: `c-${Date.now()}`,
      userId: user.id,
      author: { name: user.name, username: user.username, avatar: user.avatar },
      text: draft.trim(),
      time: "الآن",
    };
    setComments(prev => [...prev, c]);
    setDraft("");
    setTimeout(() => {
      setPosting(false);
      commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 400);
  };

  /* Edit comment */
  const startEdit = (c: Comment) => { setEditingId(c.id); setEditDraft(c.text); };
  const saveEdit  = (id: string) => {
    if (!editDraft.trim()) return;
    setComments(prev => prev.map(c => c.id === id ? { ...c, text: editDraft.trim() } : c));
    setEditingId(null);
  };

  /* Delete comment */
  const deleteComment = (id: string) => setComments(prev => prev.filter(c => c.id !== id));

  const PrivacyIcon = post.privacy === "عام" ? Globe : post.privacy === "الأصدقاء فقط" ? Users : Lock;

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="post-author">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="post-avatar post-avatar-clickable"
            onClick={() => goToUser(post.userId)}
          />
          <div>
            <div
              className="post-author-name post-author-name-clickable"
              onClick={() => goToUser(post.userId)}
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

      {/* Body */}
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

      {/* Stats */}
      <div className="post-stats">
        <span className="post-stat-likes">
          <span className="like-emoji">❤️</span> {likes.toLocaleString("ar-SA")}
        </span>
        <span className="post-stat-right">
          <button onClick={openComments}>{comments.length} {t("comment")}</button>
          <span>{post.shares} {t("share")}</span>
        </span>
      </div>

      <div className="post-divider" />

      {/* Actions */}
      <div className="post-actions">
        <button className={`post-action-btn ${liked ? "liked" : ""}`} onClick={toggleLike}>
          <Heart size={18} fill={liked ? "#e11d48" : "none"} /> {t("like")}
        </button>
        <button className="post-action-btn" onClick={openComments}>
          <MessageCircle size={18} /> {t("comment")}
        </button>
        <button className="post-action-btn">
          <Share2 size={18} /> {t("share")}
        </button>
        <button className={`post-action-btn ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)}>
          <Bookmark size={18} fill={saved ? "#7c3aed" : "none"} /> {t("save")}
        </button>
      </div>

      {/* Comments panel */}
      {showComments && (
        <div className="post-comments">
          <div className="comments-scroll-area">
            {comments.length === 0 && (
              <div className="comments-empty">{t("noComments")}</div>
            )}

            {comments.map(c => (
              <div key={c.id} className="comment-item">
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  className="comment-avatar comment-avatar-clickable"
                  onClick={() => goToUser(c.userId)}
                />
                <div className="comment-bubble" style={{ flex: 1 }}>
                  {editingId === c.id ? (
                    /* ── Inline edit ── */
                    <div className="comment-edit-row">
                      <input
                        className="comment-edit-input"
                        value={editDraft}
                        autoFocus
                        onChange={e => setEditDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveEdit(c.id); if (e.key === "Escape") setEditingId(null); }}
                      />
                      <button className="comment-edit-save"  onClick={() => saveEdit(c.id)}><Check size={14} /></button>
                      <button className="comment-edit-cancel" onClick={() => setEditingId(null)}><X size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <div className="comment-bubble-top">
                        <span
                          className="comment-name comment-name-clickable"
                          onClick={() => goToUser(c.userId)}
                        >
                          {c.author.name}
                        </span>
                        {/* Own comment actions */}
                        {user && c.userId === user.id && (
                          <div className="comment-own-actions">
                            <button className="comment-action-btn" title={t("editComment")}   onClick={() => startEdit(c)}><Pencil size={12} /></button>
                            <button className="comment-action-btn danger" title={t("deleteComment")} onClick={() => deleteComment(c.id)}><Trash2 size={12} /></button>
                          </div>
                        )}
                        {/* Report button for others' comments */}
                        {user && c.userId !== user.id && (
                          <button className="comment-action-btn" title={t("reportComment")} style={{ marginInlineStart: "auto" }}>
                            <Flag size={12} />
                          </button>
                        )}
                      </div>
                      <span className="comment-text">{c.text}</span>
                      <span className="comment-time">{c.time}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
            <div ref={commentsEndRef} />
          </div>

          {/* Input */}
          <div className="comment-input-wrap">
            <img src={user?.avatar} alt="" className="comment-avatar" />
            <div className="comment-input-box">
              <input
                type="text"
                placeholder={t("writeComment")}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendComment()}
              />
              <button className="comment-send" disabled={!draft.trim() || posting} onClick={sendComment}>
                {posting ? <span className="spinner-xs" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
