import 'package:flutter/material.dart';

class BottomNav extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const BottomNav({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      backgroundColor: const Color(0xFF161922),
      selectedItemColor: Colors.purple,
      unselectedItemColor: Colors.grey,
      type: BottomNavigationBarType.fixed,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_rounded),
          label: "الرئيسية",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.search_rounded),
          label: "بحث",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.add_circle_rounded),
          label: "إضافة",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.notifications_rounded),
          label: "الإشعارات",
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_rounded),
          label: "حسابي",
        ),
      ],
    );
  }
}