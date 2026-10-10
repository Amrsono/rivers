import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/marketplace_provider.dart';
import '../models/listing.dart';
import 'listing_detail_screen.dart';
import 'admin_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MarketplaceProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.cardDark,
        elevation: 0,
        title: Row(
          children: [
            const Icon(Icons.waves, color: AppColors.primaryLight, size: 28),
            const SizedBox(width: 8),
            const Text(
              "RIVERS",
              style: TextStyle(
                fontWeight: FontWeight.w900,
                letterSpacing: 1.5,
                color: AppColors.textLight,
              ),
            ),
            const Spacer(),
            // MENA Country Selector
            PopupMenuButton<CountryInfo>(
              initialValue: provider.selectedCountry,
              onSelected: (country) => provider.setCountry(country),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white10,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Text(provider.selectedCountry.flag, style: const TextStyle(fontSize: 16)),
                    const SizedBox(width: 4),
                    Text(
                      provider.selectedCountry.code,
                      style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                    const Icon(Icons.arrow_drop_down, color: AppColors.textMuted, size: 18),
                  ],
                ),
              ),
              itemBuilder: (context) => AppConstants.countries
                  .map((c) => PopupMenuItem(
                        value: c,
                        child: Text("${c.flag} ${c.nameEn} (${c.currency})"),
                      ))
                  .toList(),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.admin_panel_settings, color: AppColors.primaryLight),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const AdminScreen()),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Search & Category Bar
          Container(
            color: AppColors.cardDark,
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => provider.setSearchQuery(val),
                  style: const TextStyle(color: AppColors.textLight),
                  decoration: InputDecoration(
                    hintText: "Search cars, electronics, real estate...",
                    hintStyle: const TextStyle(color: AppColors.textMuted),
                    prefixIcon: const Icon(Icons.search, color: AppColors.textMuted),
                    filled: true,
                    fillColor: AppColors.bgDark,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                // Category Pills
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildCategoryChip(context, "ALL", "All Items"),
                      _buildCategoryChip(context, "cat_cars", "Cars"),
                      _buildCategoryChip(context, "cat_mobiles", "Electronics"),
                      _buildCategoryChip(context, "cat_realestate", "Real Estate"),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Escrow Guarantee Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppColors.primary.withOpacity(0.2),
            child: const Row(
              children: [
                Icon(Icons.shield_outlined, color: AppColors.primaryLight, size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    "All purchases backed by Rivers Escrow Guarantee & 0% BNPL.",
                    style: TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),

          // Listing Grid
          Expanded(
            child: provider.isLoading
                ? const Center(child: CircularProgressIndicator(color: AppColors.primaryLight))
                : provider.listings.isEmpty
                    ? const Center(
                        child: Text("No listings found matching your search.",
                            style: TextStyle(color: AppColors.textMuted)),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.all(16),
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          childAspectRatio: 0.72,
                          crossAxisSpacing: 12,
                          mainAxisSpacing: 12,
                        ),
                        itemCount: provider.listings.length,
                        itemBuilder: (context, index) {
                          final item = provider.listings[index];
                          return _buildListingCard(context, item);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(BuildContext context, String id, String label) {
    final provider = Provider.of<MarketplaceProvider>(context);
    final isSelected = provider.selectedCategory == id;

    return Padding(
      padding: const EdgeInsets.only(right: 8.0),
      child: ChoiceChip(
        label: Text(label),
        selected: isSelected,
        selectedColor: AppColors.primaryLight,
        backgroundColor: AppColors.bgDark,
        labelStyle: TextStyle(
          color: isSelected ? Colors.white : AppColors.textMuted,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        onSelected: (_) => provider.setCategory(id),
      ),
    );
  }

  Widget _buildListingCard(BuildContext context, Listing item) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ListingDetailScreen(listing: item),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image with Badges
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
                  child: AspectRatio(
                    aspectRatio: 1.3,
                    child: Image.network(
                      item.images.isNotEmpty ? item.images.first : 'https://via.placeholder.com/400',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                if (item.safetyBadge)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.shield, color: Colors.white, size: 12),
                          SizedBox(width: 2),
                          Text("Escrow", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "${item.currency} ${item.price.toStringAsFixed(0)}",
                    style: const TextStyle(
                      color: AppColors.primaryLight,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: AppColors.textLight,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: AppColors.textMuted, size: 12),
                      const SizedBox(width: 2),
                      Expanded(
                        child: Text(
                          item.location,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
