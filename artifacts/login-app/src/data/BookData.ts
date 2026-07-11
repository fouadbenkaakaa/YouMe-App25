export interface Book {
  id: string;
  title: string;
  author: string;
  category: "ديني" | "ثقافي" | "تاريخي" | "علمي" | "أدبي" | "تنمية ذاتية";
  description: string;
  cover: string;
  pages: number;
}

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "الرحيق المختوم",
    author: "صفي الرحمن المباركفوري",
    category: "ديني",
    description: "سيرة النبي محمد صلى الله عليه وسلم",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200",
    pages: 600
  },
  {
    id: "2",
    title: "تاريخ العرب",
    author: "فيليب حتي",
    category: "تاريخي",
    description: "تاريخ العرب من الجاهلية إلى العصر الحديث",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    pages: 800
  },
  {
    id: "3",
    title: "فن اللامبالاة",
    author: "مارك مانسون",
    category: "تنمية ذاتية",
    description: "دليل عيش حياة غير مبالية",
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200",
    pages: 250
  },
  {
    id: "4",
    title: "الأمين",
    author: "أحمد خالد مصطفى",
    category: "أدبي",
    description: "رواية خيال علمي عربية",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200",
    pages: 350
  },
  {
    id: "5",
    title: "العقل البشري",
    author: "ستيفن بينكر",
    category: "علمي",
    description: "كيف يعمل العقل البشري",
    cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=200",
    pages: 500
  },
  {
    id: "6",
    title: "مقدمة ابن خلدون",
    author: "ابن خلدون",
    category: "تاريخي",
    description: "كتاب في علم الاجتماع والتاريخ",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200",
    pages: 400
  }
];

export const CATEGORIES = [
  { id: "all", name: "الكل" },
  { id: "ديني", name: "ديني" },
  { id: "ثقافي", name: "ثقافي" },
  { id: "تاريخي", name: "تاريخي" },
  { id: "علمي", name: "علمي" },
  { id: "أدبي", name: "أدبي" },
  { id: "تنمية ذاتية", name: "تنمية ذاتية" }
];