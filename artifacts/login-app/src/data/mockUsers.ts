import type { User } from "../context/AppContext";

export const MOCK_USERS: Record<string, User> = {
  "1": {
    id: "1", name: "فؤاد الأحمد", username: "fouad",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4",
    cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
    bio: "مبرمج شغوف بالتقنية والابتكار 💻✨",
    location: "الرياض، المملكة العربية السعودية", work: "مطور برمجيات",
    age: 28, gender: "ذكر", maritalStatus: "أعزب",
    friendsCount: 342, followersCount: 1205, followingCount: 89, postsCount: 87,
    phone: "05xxxxxxxx", email: "fouad@example.com", role: "admin",
  },
  "sara": {
    id: "sara", name: "سارة المنصور", username: "sara_m",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",
    cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    bio: "مصورة ومحبة للطبيعة 🌿📷",
    location: "جدة، المملكة العربية السعودية", work: "مصورة فوتوغرافية",
    age: 25, gender: "أنثى", maritalStatus: "عزباء",
    friendsCount: 512, followersCount: 3420, followingCount: 178, postsCount: 143,
    phone: "", email: "sara@example.com", role: "user",
  },
  "mohammed": {
    id: "mohammed", name: "محمد العمري", username: "m_amri",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
    bio: "مطور برامج • ريادة أعمال • تقنية 🚀",
    location: "الرياض، المملكة العربية السعودية", work: "مدير تقنية",
    age: 31, gender: "ذكر", maritalStatus: "متزوج",
    friendsCount: 876, followersCount: 8900, followingCount: 312, postsCount: 234,
    phone: "", email: "mohammed@example.com", role: "user",
  },
  "noura": {
    id: "noura", name: "نورة الشمري", username: "noura_sh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",
    cover: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    bio: "طاهية ومدوّنة طعام 🍮👩‍🍳",
    location: "الدمام، المملكة العربية السعودية", work: "شيف وصانعة محتوى",
    age: 27, gender: "أنثى", maritalStatus: "متزوجة",
    friendsCount: 430, followersCount: 21300, followingCount: 94, postsCount: 389,
    phone: "", email: "noura@example.com", role: "user",
  },
  "ab": {
    id: "ab", name: "عبدالله القحطاني", username: "ab_q",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4",
    cover: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    bio: "باحث اجتماعي • محلل بيانات 📊",
    location: "مكة المكرمة، المملكة العربية السعودية", work: "باحث",
    age: 34, gender: "ذكر", maritalStatus: "متزوج",
    friendsCount: 290, followersCount: 4500, followingCount: 120, postsCount: 78,
    phone: "", email: "ab@example.com", role: "user",
  },
};

export function getUserById(id: string): User | null {
  return MOCK_USERS[id] ?? null;
}
