import 'package:flutter/material.dart';

class StoriesWidget extends StatelessWidget {
  const StoriesWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final stories = [
      {"name": "قصتك", "add": true},
      {"name": "سارة"},
      {"name": "محمد"},
      {"name": "نورة"},
      {"name": "علي"},
      {"name": "ريم"},
    ];

    return SizedBox(
      height: 110,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: stories.length,
        itemBuilder: (context, index) {
          final story = stories[index];

          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Column(
              children: [
                Container(
                  width: 70,
                  height: 70,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: story["add"] == true
                        ? null
                        : const LinearGradient(
                            colors: [
                              Colors.purple,
                              Colors.pink,
                            ],
                          ),
                  ),
                  padding: const EdgeInsets.all(3),
                  child: Container(
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: Color(0xFF161922),
                    ),
                    child: story["add"] == true
                        ? const Icon(
                            Icons.add,
                            color: Colors.white,
                            size: 30,
                          )
                        : const CircleAvatar(
                            backgroundImage: NetworkImage(
                              "https://images.unsplash.com/photo-1500648767791-00dcc994a43?w=300",
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  story["name"].toString(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}