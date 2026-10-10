import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/marketplace_provider.dart';

class ExploreScreen extends StatelessWidget {
  const ExploreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MarketplaceProvider>(context);

    final categories = [
      {'id': 'cat_cars', 'name': 'Cars & Vehicles', 'nameAr': 'سيارات ومركبات', 'icon': Icons.directions_car, 'count': '1,240'},
      {'id': 'cat_realestate', 'name': 'Real Estate', 'nameAr': 'عقارات للإيجار والبيع', 'icon': Icons.apartment, 'count': '890'},
      {'id': 'cat_mobiles', 'name': 'Mobiles & Electronics', 'nameAr': 'موبايل وإلكترونيات', 'icon': Icons.smartphone, 'count': '2,150'},
      {'id': 'cat_fashion', 'name': 'Fashion & Luxury', 'nameAr': 'أزياء وساعات فاخرة', 'icon': Icons.watch, 'count': '510'},
      {'id': 'cat_home', 'name': 'Home & Furniture', 'nameAr': 'أثاث ومستلزمات منزلية', 'icon': Icons.chair, 'count': '670'},
      {'id': 'cat_jobs', 'name': 'Jobs & Services', 'nameAr': 'وظائف وخدمات', 'icon': Icons.work, 'count': '430'},
    ];

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.cardDark,
        title: const Text("Explore Categories"),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text(
            "Browse All Market Sectors",
            style: TextStyle(color: AppColors.textLight, fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final cat = categories[index];
              return InkWell(
                onTap: () {
                  provider.setCategory(cat['id'] as String);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Filtered by ${cat['name']}")),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.cardDark,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(cat['icon'] as IconData, color: AppColors.primaryLight, size: 32),
                      const SizedBox(height: 8),
                      Text(
                        cat['name'] as String,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "${cat['count']} items",
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
