import 'package:flutter/material.dart';

class AppColors {
  // Web App Matched Color System
  static const Color bgDark = Color(0xFF070B14); // Deepest dark slate
  static const Color cardDark = Color(0xFF0F172A); // Glass card background
  static const Color cardBorder = Color(0xFF1E293B); // Subtle card border
  static const Color primaryBlue = Color(0xFF0368FF); // Brand blue
  static const Color primary = Color(0xFF0368FF); // Alias for primaryBlue
  static const Color primaryLight = Color(0xFF06B6D4); // Neon cyan / primary light
  static const Color accent = Color(0xFF06B6D4); // Alias for neonCyan
  static const Color neonCyan = Color(0xFF06B6D4); // Neon cyan accent
  static const Color neonCyanLight = Color(0xFF22D3EE);
  static const Color emeraldVerified = Color(0xFF10B981); // Emerald verified pill
  static const Color amberFeatured = Color(0xFFF59E0B); // Gold featured pill
  static const Color pinkFavorite = Color(0xFFEC4899); // Heart pink
  static const Color textLight = Color(0xFFF8FAFC);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color pillBg = Color(0xFF1E293B);
  static const Color success = Color(0xFF10B981);
  static const Color badgeGold = Color(0xFFF59E0B);
}

class CountryInfo {
  final String code;
  final String nameEn;
  final String nameAr;
  final String flag;
  final String currency;

  const CountryInfo({
    required this.code,
    required this.nameEn,
    required this.nameAr,
    required this.flag,
    required this.currency,
  });
}

class AppConstants {
  static const String apiBaseUrl = "http://localhost:3000/api";

  static const List<CountryInfo> countries = [
    CountryInfo(code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', currency: 'EGP'),
    CountryInfo(code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', currency: 'JOD'),
    CountryInfo(code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', currency: 'SAR'),
    CountryInfo(code: 'AE', nameEn: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', currency: 'AED'),
    CountryInfo(code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', currency: 'IQD'),
    CountryInfo(code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', currency: 'KWD'),
    CountryInfo(code: 'OM', nameEn: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', currency: 'OMR'),
  ];
}
