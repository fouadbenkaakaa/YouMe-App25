// ═══════════════════════════════════════════════════════════════
//  CreatePost.tsx
// ═══════════════════════════════════════════════════════════════
import { useState, useCallback } from "react";
import { Image, MapPin, BarChart2, Globe, Users, Lock, ChevronDown } from "lucide-react";
import { useApp } from "../../context/AppContext";

interface User {
id: string;
name: string;
username: string;
avatar: string;
}

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
image: null;
likes: number;
shares: number;
privacy: string;
liked: boolean;
saved: boolean;
commentsList: unknown[];
}

interface CreatePostProps {
user: User | null;
onPost: (post: PostData) => void;
}

const PRIVACY_OPTIONS = ["عام", "الأصدقاء فقط", "أنا فقط"];

const COMPOSER_ACTIONS = [
{ icon: Image,     label: "صورة/فيديو", color: "#45bd62" },
{ icon: MapPin,    label: "الموقع",     color: "#f7b928" },
{ icon: BarChart2, label: "استطلاع",    color: "#e4476b" },
];

function PrivacyIcon({ privacy }: { privacy: string }) {
if (privacy === "عام") return <Globe size={14} />;
if (privacy === "الأصدقاء فقط") return <Users size={14} />;
return <Lock size={14} />;
}

export default function CreatePost({ user, onPost }: CreatePostProps) {
const { t } = useApp();
const [newPost, setNewPost] = useState("");
const [privacy, setPrivacy] = useState("عام");
const [showPrivacy, setShowPrivacy] = useState(false);
const [publishing, setPublishing] = useState(false);

const handlePost = useCallback(() => {
if (!newPost.trim() || publishing || !user) return;

setPublishing(true);  

setTimeout(() => {  
  const post: PostData = {  
    id: Date.now().toString(),  
    userId: user.id,  
    author: {  
      name: user.name,  
      username: user.username,  
      avatar: user.avatar,  
      location: "",  
    },  
    time: "الآن",  
    text: newPost.trim(),  
    image: null,  
    likes: 0,  
    shares: 0,  
    privacy,  
    liked: false,  
    saved: false,  
    commentsList: [],  
  };  

  onPost(post);  
  setNewPost("");  
  setPublishing(false);  
}, 700);

}, [newPost, publishing, user, privacy, onPost]);

const handleKeyDown = useCallback(
(e: React.KeyboardEvent<HTMLInputElement>) => {
if (e.key === "Enter") handlePost();
},
[handlePost]
);

const firstName = user?.name?.split(" ")[0] ?? "";

return (
<div className="post-composer">
<img src={user?.avatar} alt={user?.name} className="composer-avatar" />

<div className="composer-body">  
    {/* Input */}  
    <div className="composer-input-wrap">  
      <input  
        type="text"  
        placeholder={`${t("whatsOnYourMind")} يا ${firstName}؟`}  
        value={newPost}  
        onChange={(e) => setNewPost(e.target.value)}  
        onKeyDown={handleKeyDown}  
        disabled={publishing}  
      />  
    </div>  

    {/* Footer */}  
    <div className="composer-footer">  
      {/* Actions */}  
      <div className="composer-actions">  
        {COMPOSER_ACTIONS.map((action) => (  
          <button key={action.label} className="composer-action">  
            <action.icon size={18} className="composer-action-icon" style={{ color: action.color }} />  
            <span>{action.label}</span>  
          </button>  
        ))}  
      </div>  

      {/* Right Side: Privacy + Submit */}  
      <div className="composer-right">  
        {/* Privacy Selector */}  
        <div  
          className="privacy-select"  
          onClick={() => setShowPrivacy((prev) => !prev)}  
        >  
          <PrivacyIcon privacy={privacy} />  
          <span>{privacy}</span>  
          <ChevronDown size={12} />  

          {showPrivacy && (  
            <div className="privacy-dropdown">  
              {PRIVACY_OPTIONS.map((p) => (  
                <button  
                  key={p}  
                  onClick={() => {  
                    setPrivacy(p);  
                    setShowPrivacy(false);  
                  }}  
                >  
                  {p}  
                </button>  
              ))}  
            </div>  
          )}  
        </div>  

        {/* Submit */}  
        <button  
          className="composer-submit"  
          onClick={handlePost}  
          disabled={!newPost.trim() || publishing}  
        >  
          {publishing ? (  
            <>  
              <span className="spinner-xs" />  
              <span>{t("publishing")}</span>  
            </>  
          ) : (  
            t("publish")  
          )}  
        </button>  
      </div>  
    </div>  
  </div>  
</div>

);
}