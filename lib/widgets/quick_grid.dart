import 'package:flutter/material.dart';

class QuickGrid extends StatelessWidget {
  const QuickGrid({super.key});

  @override
  Widget build(BuildContext context) {
    final items = [
      {"icon": Icons.chat, "title": "المراسلات", "color": Colors.blue},
      {"icon": Icons.games, "title": "الألعاب", "color": Colors.purple},
      {"icon": Icons.emoji_events, "title": "البطولات", "color": Colors.orange},
      {"icon": Icons.movie, "title": "الفيديوهات", "color": Colors.red},
      {"icon": Icons.store, "title": "المتجر", "color": Colors.green},
      {"icon": Icons.local_shipping, "title": "التوصيل", "color": Colors.teal},
      {"icon": Icons.smart_toy, "title": "الذكاء", "color": Colors.indigo},
      {"icon": Icons.favorite, "title": "التعارف", "color": Colors.pink},
      {"icon": Icons.groups, "title": "المجتمعات", "color": Colors.cyan},
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 1,
      ),
      itemBuilder: (context, index) {
        final item = items[index];

        return Container(
          decoration: BoxDecoration(
            color: const Color(0xFF1B1F2A),
            borderRadius: BorderRadius.circular(20),
          ),
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: () {},
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 55,
                  height: 55,
                  decoration: BoxDecoration(
                    color: (item["color"] as Color).withOpacity(0.15),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: Icon(
                    item["icon"] as IconData,
                    color: item["color"] as Color,
                    size: 30,
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  item["title"] as String,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}