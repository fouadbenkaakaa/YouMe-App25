export const MOCK_POSTS = [
  {
    id: "1",
    userId: "sara",
    author: { name: "سارة المنصور", username: "sara_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf", location: "جدة" },
    time: "منذ ٣ دقائق",
    text: "يوم رائع في جدة! الطقس جميل جداً اليوم 🌤️ أتمنى لكم جميعاً يوماً مشرقاً وسعيداً 💜",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    likes: 124,
    shares: 7,
    privacy: "عام",
    liked: false,
    saved: false,
    commentsList: [
      { id: "c1", userId: "fouad", author: { name: "فؤاد الأحمد", username: "fouad", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4" }, text: "صور جميلة جداً! 😍", time: "منذ دقيقة" },
      { id: "c2", userId: "mohammed", author: { name: "محمد العمري", username: "m_amri", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9" }, text: "جدة دائماً تبهر! 🌊", time: "منذ دقيقتين" },
    ],
  },
  {
    id: "2",
    userId: "mohammed",
    author: { name: "محمد العمري", username: "m_amri", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", location: "الرياض" },
    time: "منذ ٢٥ دقيقة",
    text: "انتهيت للتو من مشروع جديد! شهور من العمل الدؤوب والآن أرى النتيجة. لا يوجد شيء يعوض إحساس الإنجاز 🚀💪\n\nشكراً لكل من دعمني في هذه الرحلة!",
    image: null,
    likes: 89,
    shares: 12,
    privacy: "الأصدقاء فقط",
    liked: true,
    saved: false,
    commentsList: [
      { id: "c3", userId: "sara", author: { name: "سارة المنصور", username: "sara_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" }, text: "جميل جداً! شكراً للمشاركة 😊", time: "منذ ١٠ دقائق" },
      { id: "c4", userId: "noura", author: { name: "نورة الشمري", username: "noura_sh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede" }, text: "رائع! استمر في التميز 💪", time: "منذ ٢٠ دقيقة" },
    ],
  },
  {
    id: "3",
    userId: "noura",
    author: { name: "نورة الشمري", username: "noura_sh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede", location: "الدمام" },
    time: "منذ ساعة",
    text: "وصفة اليوم: كنافة بالقشطة 🍮✨\n- ٥٠٠غ كنافة\n- ٢ كوب قشطة\n- ١ كوب سكر\n- ماء ورد\n\nجربوها وقولوا لي رأيكم! 😄",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80",
    likes: 215,
    shares: 45,
    privacy: "عام",
    liked: false,
    saved: true,
    commentsList: [
      { id: "c5", userId: "fouad", author: { name: "فؤاد الأحمد", username: "fouad", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4" }, text: "وصفة رائعة سأجربها! 🍮", time: "منذ ٣٠ دقيقة" },
      { id: "c6", userId: "sara", author: { name: "سارة المنصور", username: "sara_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" }, text: "أحلى كنافة جربتها! ❤️", time: "منذ ٤٥ دقيقة" },
      { id: "c7", userId: "ab", author: { name: "عبدالله القحطاني", username: "ab_q", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4" }, text: "مشكورة على الوصفة 🙏", time: "منذ ساعة" },
    ],
  },
  {
    id: "4",
    userId: "ab",
    author: { name: "عبدالله القحطاني", username: "ab_q", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4", location: "مكة المكرمة" },
    time: "منذ ٣ ساعات",
    text: "استطلاع: ما هو تطبيق التواصل الاجتماعي المفضل لديك؟",
    image: null,
    isPoll: true,
    pollOptions: [
      { text: "تويتر/X", votes: 145, percent: 42 },
      { text: "إنستغرام", votes: 98, percent: 28 },
      { text: "سناب شات", votes: 67, percent: 19 },
      { text: "أخرى", votes: 38, percent: 11 },
    ],
    likes: 78,
    shares: 5,
    privacy: "عام",
    liked: false,
    saved: false,
    commentsList: [
      { id: "c8", userId: "mohammed", author: { name: "محمد العمري", username: "m_amri", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9" }, text: "Atlas Social بالطبع 😄", time: "منذ ساعتين" },
    ],
  },
  {
    id: "5",
    userId: "1",
    author: { name: "فؤاد الأحمد", username: "fouad", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fouad&backgroundColor=b6e3f4", location: "الرياض" },
    time: "منذ ٤ ساعات",
    text: "أعمل على مشروع جديد لمنصة Atlas Social 🚀 الفكرة ستغير طريقة تواصل الناس في العالم العربي. ترقبوا الإعلان! 💜✨",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
    likes: 312,
    shares: 28,
    privacy: "عام",
    liked: false,
    saved: false,
    commentsList: [
      { id: "c9", userId: "sara", author: { name: "سارة المنصور", username: "sara_m", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf" }, text: "متحمسة لرؤية المشروع! 🎉", time: "منذ ٣ ساعات" },
      { id: "c10", userId: "noura", author: { name: "نورة الشمري", username: "noura_sh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede" }, text: "ترقبوا مني أيضاً 😄", time: "منذ ساعتين" },
    ],
  },
];

export const MOCK_FRIENDS_REQUESTS = [
  { id: "r1", name: "خالد الزهراني",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",  mutual: 12 },
  { id: "r2", name: "ريم العتيبي",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reem&backgroundColor=d1d4f9",    mutual: 7  },
  { id: "r3", name: "فيصل الدوسري",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=faisal&backgroundColor=c0aede",  mutual: 3  },
];

export const MOCK_SUGGESTIONS = [
  { id: "s1", name: "لمياء السلمي",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lamia&backgroundColor=b6e3f4",    mutual: 24 },
  { id: "s2", name: "طارق الغامدي",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tarek&backgroundColor=ffdfbf",   mutual: 16 },
  { id: "s3", name: "هند المطيري",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hind&backgroundColor=d1d4f9",    mutual: 9  },
  { id: "s4", name: "يوسف البلوي",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yousuf&backgroundColor=c0aede",  mutual: 5  },
];

export const MOCK_CONVERSATIONS = [
  { id: "c1", name: "سارة المنصور",       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",     lastMsg: "كيف حالك اليوم؟ 😊",      time: "٣د",  unread: 2, online: true  },
  { id: "c2", name: "محمد العمري",        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", lastMsg: "شاهدت مشروعك، رائع!",     time: "١٥د", unread: 0, online: true  },
  { id: "c3", name: "مجموعة الأصدقاء 🎉", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=group1&backgroundColor=c0aede",   lastMsg: "نورة: موعد الغداء؟",      time: "١س",  unread: 5, online: false, isGroup: true },
  { id: "c4", name: "نورة الشمري",        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",    lastMsg: "أرسلت لك الوصفة 🍮",      time: "٢س",  unread: 0, online: false },
  { id: "c5", name: "عبدالله القحطاني",   avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4", lastMsg: "شكراً جزيلاً!",           time: "أمس", unread: 0, online: false },
];

export const MOCK_MESSAGES = [
  { id: "m1", from: "other", text: "أهلاً فؤاد! كيف حالك؟ 😊",                                                    time: "٢:٣٠م" },
  { id: "m2", from: "me",    text: "أهلاً سارة! بخير والحمد لله، وأنتِ؟",                                         time: "٢:٣١م" },
  { id: "m3", from: "other", text: "بخير جداً شكراً! شاهدت منشورك الأخير عن المشروع، يبدو رائعاً جداً 🚀",       time: "٢:٣٢م" },
  { id: "m4", from: "me",    text: "شكراً جزيلاً! استغرق مني وقتاً طويلاً لكنه يستحق 💪",                         time: "٢:٣٣م" },
  { id: "m5", from: "other", text: "كيف يمكنني الاطلاع عليه؟",                                                    time: "٢:٣٤م" },
  { id: "m6", from: "me",    text: "سأرسل لكِ الرابط قريباً إن شاء الله 😊",                                      time: "٢:٣٥م" },
  { id: "m7", from: "other", text: "ممتاز! أنتظر 🎉",                                                             time: "٢:٣٦م" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", type: "like",    user: "سارة المنصور",     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",     text: "أعجبها منشورك",                      time: "منذ ٥ دقائق",   read: false },
  { id: "n2", type: "friend",  user: "خالد الزهراني",    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",   text: "أرسل لك طلب صداقة",                  time: "منذ ٢٠ دقيقة",  read: false },
  { id: "n3", type: "comment", user: "محمد العمري",      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", text: "علّق على منشورك: \"رائع جداً! 🎉\"",  time: "منذ ساعة",      read: false },
  { id: "n4", type: "mention", user: "نورة الشمري",      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",    text: "ذكرتك في منشور",                      time: "منذ ٣ ساعات",   read: true  },
  { id: "n5", type: "like",    user: "عبدالله القحطاني", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=abdullah&backgroundColor=b6e3f4", text: "أعجبه تعليقك",                        time: "منذ ٥ ساعات",   read: true  },
  { id: "n6", type: "share",   user: "لمياء السلمي",     avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lamia&backgroundColor=b6e3f4",    text: "شاركت منشورك",                        time: "أمس",           read: true  },
];

export const MOCK_MARKET_ITEMS = [
  { id: "mk1", category: "حيوانات",      title: "كلب هاسكي للبيع",          price: "٢٥٠٠ ريال",       location: "الرياض",  image: "https://images.unsplash.com/photo-1546421845-6471bdcf3edf?w=400&q=80",  seller: "طارق الغامدي"  },
  { id: "mk2", category: "سيارات",       title: "تويوتا كامري ٢٠٢٢",        price: "٩٥٠٠٠ ريال",     location: "جدة",     image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80", seller: "فيصل الدوسري" },
  { id: "mk3", category: "عقارات",       title: "شقة للإيجار - ٣ غرف",       price: "٣٥٠٠٠ ريال/سنة", location: "الدمام",  image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",  seller: "ريم العتيبي"   },
  { id: "mk4", category: "معدات زراعية", title: "جرار زراعي للبيع",          price: "١٨٠٠٠ ريال",     location: "القصيم",  image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80", seller: "يوسف البلوي"  },
  { id: "mk5", category: "وظائف",        title: "مطلوب مهندس برمجيات",       price: "١٢٠٠٠ ريال/شهر", location: "الرياض",  image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80", seller: "شركة التقنية" },
  { id: "mk6", category: "سيارات",       title: "هوندا سيفيك ٢٠٢١",         price: "٧٢٠٠٠ ريال",     location: "الرياض",  image: "https://images.unsplash.com/photo-1596982847761-fb54e8a5cbda?w=400&q=80", seller: "خالد الزهراني" },
];

export const MOCK_GROUPS = [
  { id: "g1", name: "عشاق التقنية 💻",   members: 15420, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80", type: "عامة", privacy: "عامة" },
  { id: "g2", name: "مزارعو المملكة 🌾", members: 8930,  image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80", type: "عامة", privacy: "خاصة" },
  { id: "g3", name: "هواة التصوير 📸",   members: 23100, image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80", type: "عامة", privacy: "عامة" },
  { id: "g4", name: "الطبخ العربي 👩‍🍳",  members: 45600, image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&q=80", type: "عامة", privacy: "عامة" },
];

export const MOCK_STORIES = [
  { id: "st1", name: "سارة",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sara&backgroundColor=ffdfbf",     image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80" },
  { id: "st2", name: "محمد",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed&backgroundColor=d1d4f9", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=200&q=80" },
  { id: "st3", name: "نورة",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noura&backgroundColor=c0aede",    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80" },
  { id: "st4", name: "خالد",  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=khaled&backgroundColor=ffdfbf",   image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80" },
];
