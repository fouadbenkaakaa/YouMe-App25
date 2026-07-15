// ═══════════════════════════════════════════════════════════════
//  HomePage.tsx — Page Orchestrator (Permanent Version)
// ═══════════════════════════════════════════════════════════════
//  Responsibility: Layout composition ONLY.
//  No UI logic, no markup details, no state management.
//  Any new page section = add a component below. Do NOT modify structure.
// ═══════════════════════════════════════════════════════════════

// ─── 1. React Core ───────────────────────────────────────────
import { useState } from "react";

// ─── 2. Third-Party ────────────────────────────────────────────
// (none currently)

// ─── 3. Context ────────────────────────────────────────────────
import { useApp } from "../context/AppContext";

// ─── 4. Page Sections ──────────────────────────────────────────
//    Left Sidebar
import LeftSidebar from "../components/Home/LeftSidebar";

//    Main Feed
import Header from "../components/Home/Header";
import Stories from "../components/Home/Stories";
import CreatePost from "../components/Home/CreatePost";
import FeedFilter from "../components/Home/FeedFilter";
import PostsList from "../components/Home/PostsList";

//    Right Sidebar
import RightSidebar from "../components/Home/RightSidebar";

// ─── 5. Data ─────────────────────────────────────────────────────
import { MOCK_POSTS } from "../data/mockData";

// ═══════════════════════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════════════════════
interface PostData {
  id: string;
  userId: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    location: string;
  };
  time: string;
  text: string;
  image: string | null;
  likes: number;
  shares: number;
  privacy: string;
  liked: boolean;
  saved: boolean;
  commentsList: unknown[];
}

// ═══════════════════════════════════════════════════════════════
//  Component
// ═══════════════════════════════════════════════════════════════
export default function HomePage() {
  // ── Hooks ─────────────────────────────────────────────────────
  const { user } = useApp();
  const [posts, setPosts] = useState<PostData[]>(MOCK_POSTS);

  // ── Handlers ──────────────────────────────────────────────────
  const handleAddPost = (post: PostData) => {
    setPosts((prev) => [post, ...prev]);
  };

  // ═══════════════════════════════════════════════════════════════
  //  Layout
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="home-layout">
      {/* ═══════════════════════════════════════════════════════
          LEFT SIDEBAR
          UserCard | Navigation | Shortcuts | Groups | Pages | Saved
      ═══════════════════════════════════════════════════════ */}
      <aside className="home-sidebar left">
        <LeftSidebar />
      </aside>

      {/* ═══════════════════════════════════════════════════════
          MAIN FEED
          Header → Stories → CreatePost → FeedFilter → PostsList
      ═══════════════════════════════════════════════════════ */}
      <main className="home-feed">
        <Header />
        <Stories />
        <CreatePost user={user} onPost={handleAddPost} />
        <FeedFilter />
        <PostsList posts={posts} />
      </main>

      {/* ═══════════════════════════════════════════════════════
          RIGHT SIDEBAR
          Weather → Level → Shortcuts → Trending → Contacts
          (Extensible: add new cards below without touching structure)
      ═══════════════════════════════════════════════════════ */}
      <aside className="home-sidebar right">
        <RightSidebar />
      </aside>
    </div>
  );
}