import 'package:flutter/material.dart';
import 'data/sparring_store.dart';
import 'screens/academy_shell.dart';
import 'screens/auth_screen.dart';
import 'screens/fighter_shell.dart';
import 'theme/sparring_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  final store = SparRingStore();
  store.initFromDisk();
  runApp(SparRingMobileApp(store: store));
}

class SparRingMobileApp extends StatelessWidget {
  final SparRingStore store;

  const SparRingMobileApp({super.key, required this.store});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SparRing',
      debugShowCheckedModeBanner: false,
      theme: buildSparRingTheme(),
      home: AnimatedBuilder(
        animation: store,
        builder: (context, _) {
          if (!store.isAuthenticated) {
            return AuthScreen(store: store);
          }
          if (store.userRole == 'academy') {
            return AcademyShell(store: store);
          }
          return FighterShell(store: store);
        },
      ),
    );
  }
}
