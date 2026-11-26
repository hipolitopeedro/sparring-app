import 'package:flutter/material.dart';

class SparRingColors {
  static const Color bgMain = Color(0xFF111111);
  static const Color bgSurface = Color(0xFF171717);
  static const Color bgElevated = Color(0xFF1E1E1E);
  static const Color borderGrid = Color(0xFF262626);
  static const Color borderStrong = Color(0xFF383838);
  static const Color accentOrange = Color(0xFFFF5500);
  static const Color accentRed = Color(0xFFD91E2A);
  static const Color accentGreen = Color(0xFF22C55E);
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFA3A3A3);
  static const Color textMuted = Color(0xFF737373);
}

ThemeData buildSparRingTheme() {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: SparRingColors.bgMain,
    colorScheme: const ColorScheme.dark(
      primary: SparRingColors.accentOrange,
      secondary: SparRingColors.accentOrange,
      surface: SparRingColors.bgSurface,
      error: SparRingColors.accentRed,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: SparRingColors.bgMain,
      foregroundColor: SparRingColors.textPrimary,
      elevation: 0,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        color: SparRingColors.textPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w800,
        letterSpacing: 0.8,
      ),
    ),
    cardTheme: CardThemeData(
      color: SparRingColors.bgSurface,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(2),
        side: const BorderSide(color: SparRingColors.borderGrid),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: SparRingColors.bgMain,
      labelStyle: const TextStyle(color: SparRingColors.textSecondary, fontSize: 13),
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      enabledBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.zero,
        borderSide: BorderSide(color: SparRingColors.borderStrong),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.zero,
        borderSide: BorderSide(color: SparRingColors.accentOrange, width: 1.5),
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: SparRingColors.accentOrange,
        foregroundColor: Colors.white,
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w800,
          letterSpacing: 0.8,
          fontSize: 12,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: SparRingColors.textPrimary,
        side: const BorderSide(color: SparRingColors.borderStrong),
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        textStyle: const TextStyle(
          fontWeight: FontWeight.w700,
          letterSpacing: 0.6,
          fontSize: 12,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: SparRingColors.bgMain,
      selectedItemColor: SparRingColors.accentOrange,
      unselectedItemColor: SparRingColors.textMuted,
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
      unselectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
    ),
  );
}
