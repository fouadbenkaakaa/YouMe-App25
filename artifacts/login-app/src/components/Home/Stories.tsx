// ═══════════════════════════════════════════════════════════════
//  Stories.tsx
// ═══════════════════════════════════════════════════════════════
import { Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { MOCK_STORIES } from "../../data/mockData";

export default function Stories() {
  const { user } = useApp();

  return (
    <div className="stories-bar">
      {/* Add Story */}
      <div className="story-add">
        <div className="story-add-img">
          <img src={user?.avatar} alt="" />
          <div className="story-add-plus">
            <Plus size={14} />
          </div>
        </div>
        <span>إضافة قصة</span>
      </div>

      {/* Story List */}
      {MOCK_STORIES.map((story) => (
        <div key={story.id} className="story-item">
          <div className="story-img-wrap">
            <img src={story.image} alt={story.name} className="story-bg" />
            <img src={story.avatar} alt={story.name} className="story-avatar-s" />
          </div>
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
}