// ═══════════════════════════════════════════════════════════════
//  PostsList.tsx
// ═══════════════════════════════════════════════════════════════
import Post from "../../components/Post";

interface PostData {
  id: string;
  // ... other fields matching your Post component props
  [key: string]: unknown;
}

interface PostsListProps {
  posts: PostData[];
}

export default function PostsList({ posts }: PostsListProps) {
  return (
    <div className="posts-list">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}