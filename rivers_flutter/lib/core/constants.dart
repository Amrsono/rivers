import 'package:flutter/material.dart';

class AppColors {
  static const Color primary = Color(0xFF0F766E); // Teal 700
  static const Color primaryLight = Color(0xFF14B8A6); // Teal 500
  static const Color accent = Color(0xFF0284C7); // Sky 600
  static const Color bgDark = Color(0xFF0F172A); // Slate 900
  static const Color cardDark = Color(0xFF1E293B); // Slate 800
  static const Color textLight = Color(0xFFF8FAFC);
  static const Color textMuted = Color(0xFF94A3B8);
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
    CountryInfo(code: 'JO', nameEn: 'Jordan', nameAr: 'الأردن', flag: '🇯🇴', currency: 'JOD'),
    CountryInfo(code: 'SA', nameEn: 'Saudi Arabia', nameAr: 'السعودية', flag: '🇸🇦', currency: 'SAR'),
    CountryInfo(code: 'AE', nameEn: 'UAE', nameAr: 'الإمارات', flag: '🇦🇪', currency: 'AED'),
    CountryInfo(code: 'EG', nameEn: 'Egypt', nameAr: 'مصر', flag: '🇪🇬', currency: 'EGP'),
    CountryInfo(code: 'IQ', nameEn: 'Iraq', nameAr: 'العراق', flag: '🇮🇶', currency: 'IQD'),
    CountryInfo(code: 'KW', nameEn: 'Kuwait', nameAr: 'الكويت', flag: '🇰🇼', currency: 'KWD'),
    CountryInfo(code: 'OM', nameEn: 'Oman', nameAr: 'عُمان', flag: '🇴🇲', currency: 'OMR'),
  ];
}
