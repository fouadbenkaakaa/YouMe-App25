import 'package:flutter/material.dart';

class PostCard extends StatelessWidget {
  const PostCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF161922),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // رأس المنشور
          ListTile(
            leading: const CircleAvatar(
              backgroundImage: NetworkImage(
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
              ),
            ),
            title: const Text(
              "سارة المنصور",
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: const Text(
              "منذ ساعتين",
              style: TextStyle(color: Colors.grey),
            ),
            trailing: IconButton(
              icon: const Icon(Icons.more_horiz),
              onPressed: () {},
            ),
          ),

          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              "أجمل الأشياء في الحياة ليست الأشياء التي نملكها، بل اللحظات التي نصنعها مع من نحب 💜",
            ),
          ),

          const SizedBox(height: 12),

          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900",
              height: 220,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),

          const Padding(
            padding: EdgeInsets.all(14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("❤️ 128"),
                Text("12 تعليق • 12 مشاركة"),
              ],
            ),
          ),

          const Divider(height: 1),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _Action(Icons.favorite_border, "إعجاب"),
              _Action(Icons.chat_bubble_outline, "تعليق"),
              _Action(Icons.share_outlined, "مشاركة"),
              _Action(Icons.bookmark_border, "حفظ"),
            ],
          ),
        ],
      ),
    );
  }
}

class _Action extends StatelessWidget {
  final IconData icon;
  final String text;

  const _Action(this.icon, this.text);

  @override
  Widget build(BuildContext context) {
    return TextButton.icon(
      onPressed: () {},
      icon: Icon(icon, size: 18),
      label: Text(text),
    );
  }
}