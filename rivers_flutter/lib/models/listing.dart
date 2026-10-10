import 'user.dart';

class Listing {
  final String id;
  final String title;
  final String? titleAr;
  final String description;
  final double price;
  final String currency;
  final String condition; // NEW, LIKE_NEW, EXCELLENT, GOOD, FAIR
  final String categoryId;
  final String? categoryName;
  final String? subCategory;
  final List<String> images;
  final String location;
  final String? city;
  final String? district;
  final String? country; // JO, SA, AE, EG, IQ, KW, OM
  final String sellerId;
  final User seller;
  final bool safetyBadge;
  final bool flowFinanceEligible;
  final String status; // ACTIVE, RESERVED, SOLD, ARCHIVED
  final List<String> tags;
  final int viewCount;
  final String createdAt;
  final Map<String, String>? specs;
  final bool? featured;

  Listing({
    required this.id,
    required this.title,
    this.titleAr,
    required this.description,
    required this.price,
    required this.currency,
    required this.condition,
    required this.categoryId,
    this.categoryName,
    this.subCategory,
    required this.images,
    required this.location,
    this.city,
    this.district,
    this.country,
    required this.sellerId,
    required this.seller,
    required this.safetyBadge,
    required this.flowFinanceEligible,
    required this.status,
    required this.tags,
    required this.viewCount,
    required this.createdAt,
    this.specs,
    this.featured,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      titleAr: json['titleAr'],
      description: json['description'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'USD',
      condition: json['condition'] ?? 'GOOD',
      categoryId: json['categoryId'] ?? '',
      categoryName: json['categoryName'],
      subCategory: json['subCategory'],
      images: List<String>.from(json['images'] ?? []),
      location: json['location'] ?? '',
      city: json['city'],
      district: json['district'],
      country: json['country'],
      sellerId: json['sellerId'] ?? '',
      seller: User.fromJson(json['seller'] ?? {}),
      safetyBadge: json['safetyBadge'] ?? false,
      flowFinanceEligible: json['flowFinanceEligible'] ?? false,
      status: json['status'] ?? 'ACTIVE',
      tags: List<String>.from(json['tags'] ?? []),
      viewCount: json['viewCount'] ?? 0,
      createdAt: json['createdAt'] ?? '',
      specs: json['specs'] != null ? Map<String, String>.from(json['specs']) : null,
      featured: json['featured'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'titleAr': titleAr,
        'description': description,
        'price': price,
        'currency': currency,
        'condition': condition,
        'categoryId': categoryId,
        'categoryName': categoryName,
        'subCategory': subCategory,
        'images': images,
        'location': location,
        'city': city,
        'district': district,
        'country': country,
        'sellerId': sellerId,
        'seller': seller.toJson(),
        'safetyBadge': safetyBadge,
        'flowFinanceEligible': flowFinanceEligible,
        'status': status,
        'tags': tags,
        'viewCount': viewCount,
        'createdAt': createdAt,
        'specs': specs,
        'featured': featured,
      };
}
