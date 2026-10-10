import 'package:dio/dio.dart';
import '../models/listing.dart';
import '../models/user.dart';
import '../core/constants.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: AppConstants.apiBaseUrl,
    connectTimeout: const Duration(seconds: 5),
    receiveTimeout: const Duration(seconds: 5),
  ));

  static final sampleUser1 = User(
    id: 'usr_1',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@rivers.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    isVerified: true,
    trustScore: 99,
    salesCount: 142,
    location: 'Amman, Abdoun',
    joinedDate: 'March 2024',
    phone: '+962 7 9123 4567',
    whatsapp: '+962791234567',
  );

  static final sampleUser2 = User(
    id: 'usr_2',
    name: 'Kareem Hassan',
    email: 'kareem.h@rivers.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.88,
    isVerified: true,
    trustScore: 97,
    salesCount: 89,
    location: 'Dubai, Marina',
    joinedDate: 'January 2025',
    phone: '+971 50 987 6543',
    whatsapp: '+971509876543',
  );

  static final List<Listing> sampleListings = [
    Listing(
      id: 'lst_101',
      title: 'Toyota Camry 2024 Hybrid Full Option - Mint Condition',
      titleAr: 'تويوتا كامري 2024 هايبرد فل كامل بحالة الوكالة',
      description: 'Toyota Camry Hybrid model 2024, full option with panoramic sunroof, leather seats, 12.3" infotainment screen, radar cruise control, and 360-degree cameras. Original paint, zero accidents, agency warranty active.',
      price: 26500,
      currency: 'JOD',
      condition: 'LIKE_NEW',
      categoryId: 'cat_cars',
      categoryName: 'Cars & Vehicles',
      subCategory: 'Sedans',
      images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Amman, Abdoun',
      city: 'Amman',
      district: 'Abdoun',
      country: 'JO',
      sellerId: 'usr_1',
      seller: sampleUser1,
      safetyBadge: true,
      flowFinanceEligible: true,
      status: 'ACTIVE',
      tags: ['Toyota', 'Camry', 'Hybrid', '2024'],
      viewCount: 1840,
      createdAt: '2026-10-08T10:15:00Z',
      featured: true,
      specs: {'Year': '2024', 'Mileage': '12,500 km', 'Fuel': 'Hybrid'},
    ),
    Listing(
      id: 'lst_102',
      title: 'iPhone 16 Pro Max 512GB Desert Titanium - Sealed',
      titleAr: 'آيفون 16 برو ماكس 512 جيجا تيتانيوم صحراوي كفالة رسمية',
      description: 'Brand new factory sealed Apple iPhone 16 Pro Max 512GB in Desert Titanium. Comes with 1-year official Apple local agency warranty.',
      price: 1050,
      currency: 'JOD',
      condition: 'NEW',
      categoryId: 'cat_mobiles',
      categoryName: 'Mobiles & Electronics',
      subCategory: 'Smartphones',
      images: [
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Amman, Seventh Circle',
      city: 'Amman',
      district: '7th Circle',
      country: 'JO',
      sellerId: 'usr_1',
      seller: sampleUser1,
      safetyBadge: true,
      flowFinanceEligible: true,
      status: 'ACTIVE',
      tags: ['Apple', 'iPhone 16', 'Pro Max', 'Sealed'],
      viewCount: 3200,
      createdAt: '2026-10-08T08:30:00Z',
      featured: true,
    ),
    Listing(
      id: 'lst_103',
      title: 'Luxury 3BR Apartment For Rent in Abdoun with Terrace',
      titleAr: 'شقة فاخرة مفروشة 3 نوم للإيجار في عبدون مع تراس',
      description: '220 sqm luxury modern apartment featuring 3 master bedrooms, spacious living hall, modern fitted Italian kitchen, central heating, and private security.',
      price: 14000,
      currency: 'JOD',
      condition: 'LIKE_NEW',
      categoryId: 'cat_realestate',
      categoryName: 'Real Estate',
      subCategory: 'Apartments for Rent',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Amman, Abdoun',
      city: 'Amman',
      district: 'Abdoun',
      country: 'JO',
      sellerId: 'usr_2',
      seller: sampleUser2,
      safetyBadge: true,
      flowFinanceEligible: false,
      status: 'ACTIVE',
      tags: ['Apartment', 'Rent', 'Luxury', 'Abdoun'],
      viewCount: 950,
      createdAt: '2026-10-07T14:20:00Z',
      featured: true,
    ),
    Listing(
      id: 'lst_104',
      title: 'Rolex Submariner Date 41mm Oystersteel (126610LN)',
      titleAr: 'ساعة رولكس سبمارينر 41 ملم أصلية مع البوكس والضمان',
      description: 'Rolex Submariner Date 41mm with black dial and Cerachrom bezel. Full set with original box, warranty card dated 2025, and all links.',
      price: 13800,
      currency: 'USD',
      condition: 'EXCELLENT',
      categoryId: 'cat_fashion',
      categoryName: 'Fashion & Beauty',
      subCategory: 'Luxury Watches',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Dubai, DIFC',
      city: 'Dubai',
      district: 'DIFC',
      country: 'AE',
      sellerId: 'usr_2',
      seller: sampleUser2,
      safetyBadge: true,
      flowFinanceEligible: true,
      status: 'ACTIVE',
      tags: ['Rolex', 'Submariner', 'LuxuryWatch'],
      viewCount: 2100,
      createdAt: '2026-10-06T11:00:00Z',
      featured: true,
    ),
    Listing(
      id: 'lst_105',
      title: 'Porsche Taycan 4S 2023 - Clean Title, Under Warranty',
      titleAr: 'بورش تايكان 4S موديل 2023 - كفالة الشركة',
      description: 'Fully optioned Performance Battery Plus (93.4 kWh), Head-up display, Sport Chrono Package.',
      price: 68500,
      currency: 'JOD',
      condition: 'EXCELLENT',
      categoryId: 'cat_cars',
      categoryName: 'Cars & Vehicles',
      subCategory: 'Electric Vehicles',
      images: [
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Amman, Abdoun',
      city: 'Amman',
      district: 'Abdoun',
      country: 'JO',
      sellerId: 'usr_1',
      seller: sampleUser1,
      safetyBadge: true,
      flowFinanceEligible: true,
      status: 'ACTIVE',
      tags: ['Porsche', 'EV', 'Electric', 'Luxury'],
      viewCount: 1420,
      createdAt: '2026-03-28T10:30:00Z',
      featured: true,
    ),
  ];

  Future<List<Listing>> fetchListings() async {
    try {
      final response = await _dio.get('/listings');
      if (response.statusCode == 200 && response.data != null) {
        final List data = response.data['listings'] ?? response.data;
        return data.map((json) => Listing.fromJson(json)).toList();
      }
    } catch (e) {
      // Offline fallback
    }
    return sampleListings;
  }
}
