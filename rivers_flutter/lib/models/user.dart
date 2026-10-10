class User {
  final String id;
  final String name;
  final String email;
  final String avatar;
  final double rating;
  final bool isVerified;
  final int trustScore;
  final int salesCount;
  final String location;
  final String joinedDate;
  final String? phone;
  final String? whatsapp;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.avatar,
    required this.rating,
    required this.isVerified,
    required this.trustScore,
    required this.salesCount,
    required this.location,
    required this.joinedDate,
    this.phone,
    this.whatsapp,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      avatar: json['avatar'] ?? '',
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      isVerified: json['isVerified'] ?? false,
      trustScore: json['trustScore'] ?? 0,
      salesCount: json['salesCount'] ?? 0,
      location: json['location'] ?? '',
      joinedDate: json['joinedDate'] ?? '',
      phone: json['phone'],
      whatsapp: json['whatsapp'],
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'avatar': avatar,
        'rating': rating,
        'isVerified': isVerified,
        'trustScore': trustScore,
        'salesCount': salesCount,
        'location': location,
        'joinedDate': joinedDate,
        'phone': phone,
        'whatsapp': whatsapp,
      };
}
