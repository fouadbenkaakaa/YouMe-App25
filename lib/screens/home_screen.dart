import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text(
          "TEST HOME SCREEN",
          style: TextStyle(fontSize: 40, color: Colors.red),
        ),
      ),
    );
  }
}