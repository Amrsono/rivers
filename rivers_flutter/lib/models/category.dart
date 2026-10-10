class SubCategory {
  final String id;
  final String nameEn;
  final String nameAr;

  SubCategory({
    required this.id,
    required this.nameEn,
    required this.nameAr,
  });

  factory SubCategory.fromJson(Map<String, dynamic> json) {
    return SubCategory(
      id: json['id'] ?? '',
      nameEn: json['nameEn'] ?? '',
      nameAr: json['nameAr'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'nameEn': nameEn,
        'nameAr': nameAr,
      };
}

class Category {
  final String id;
  final String name;
  final String? nameAr;
  final String slug;
  final String icon;
  final String description;
  final String? descriptionAr;
  final int itemCount;
  final List<SubCategory>? subcategories;

  Category({
    required this.id,
    required this.name,
    this.nameAr,
    required this.slug,
    required this.icon,
    required this.description,
    this.descriptionAr,
    required this.itemCount,
    this.subcategories,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      nameAr: json['nameAr'],
      slug: json['slug'] ?? '',
      icon: json['icon'] ?? '',
      description: json['description'] ?? '',
      descriptionAr: json['descriptionAr'],
      itemCount: json['itemCount'] ?? 0,
      subcategories: json['subcategories'] != null
          ? (json['subcategories'] as List)
              .map((e) => SubCategory.fromJson(e))
              .toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'nameAr': nameAr,
        'slug': slug,
        'icon': icon,
        'description': description,
        'descriptionAr': descriptionAr,
        'itemCount': itemCount,
        'subcategories': subcategories?.map((e) => e.toJson()).toList(),
      };
}
