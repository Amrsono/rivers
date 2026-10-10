import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../providers/marketplace_provider.dart';
import '../models/listing.dart';
import 'listing_detail_screen.dart';
import 'admin_screen.dart';
import 'post_listing_dialog.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  String _activeFilter = 'ALL'; // ALL, VERIFIED, BNPL

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MarketplaceProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // Top App Bar & Header
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
                child: Column(
                  children: [
                    // Top Strip: Location & Language
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        PopupMenuButton<CountryInfo>(
                          initialValue: provider.selectedCountry,
                          onSelected: (country) => provider.setCountry(country),
                          itemBuilder: (context) => AppConstants.countries
                              .map((c) => PopupMenuItem(
                                    value: c,
                                    child: Text("${c.flag} ${c.nameEn} (${c.currency})"),
                                  ))
                              .toList(),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.cardDark,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: AppColors.cardBorder),
                            ),
                            child: Row(
                              children: [
                                Text(provider.selectedCountry.flag, style: const TextStyle(fontSize: 14)),
                                const SizedBox(width: 4),
                                Text(
                                  provider.selectedCountry.nameEn,
                                  style: const TextStyle(color: AppColors.textLight, fontSize: 12, fontWeight: FontWeight.bold),
                                ),
                                const Icon(Icons.arrow_drop_down, color: AppColors.textMuted, size: 16),
                              ],
                            ),
                          ),
                        ),

                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppColors.cardDark,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.cardBorder),
                              ),
                              child: const Row(
                                children: [
                                  Icon(Icons.favorite, color: AppColors.pinkFavorite, size: 12),
                                  SizedBox(width: 4),
                                  Text("Saved Ads", style: TextStyle(color: AppColors.textLight, fontSize: 11)),
                                  SizedBox(width: 4),
                                  CircleAvatar(
                                    radius: 8,
                                    backgroundColor: AppColors.primaryBlue,
                                    child: Text("2", style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text("EN | عربي", style: TextStyle(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Main Header Row with Logo, Analytics & Post Button
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.primaryBlue.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.primaryBlue),
                          ),
                          child: const Icon(Icons.bolt, color: AppColors.neonCyanLight, size: 20),
                        ),
                        const SizedBox(width: 8),
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "RIVERS",
                              style: TextStyle(
                                color: AppColors.textLight,
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 1.2,
                              ),
                            ),
                            Text(
                              "FLUID P2P MARKETPLACE & ESCROW",
                              style: TextStyle(color: AppColors.neonCyan, fontSize: 8, fontWeight: FontWeight.bold, letterSpacing: 0.8),
                            ),
                          ],
                        ),
                        const Spacer(),
                        ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryBlue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                          onPressed: () {
                            showDialog(
                              context: context,
                              builder: (_) => const PostListingDialog(),
                            );
                          },
                          icon: const Icon(Icons.add_circle_outline, size: 16),
                          label: const Text("+ Post Free Ad", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Search Bar
                    TextField(
                      onChanged: (val) => provider.setSearchQuery(val),
                      style: const TextStyle(color: AppColors.textLight, fontSize: 13),
                      decoration: InputDecoration(
                        hintText: "Search cars, real estate, mobiles, electronics...",
                        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                        prefixIcon: const Icon(Icons.search, color: AppColors.neonCyan, size: 18),
                        filled: true,
                        fillColor: AppColors.cardDark,
                        contentPadding: const EdgeInsets.symmetric(vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: AppColors.cardBorder),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Explore Category Streams Section Header
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: Row(
                  children: [
                    Icon(Icons.auto_awesome, color: AppColors.neonCyan, size: 18),
                    SizedBox(width: 8),
                    Text(
                      "Explore Category Streams",
                      style: TextStyle(color: AppColors.textLight, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),

            // Category Horizontal Scrollable Bar
            SliverToBoxAdapter(
              child: SizedBox(
                height: 90,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  children: [
                    _buildCategoryCard(context, "cat_cars", "Cars & Vehicles", "1240 ads", Icons.directions_car),
                    _buildCategoryCard(context, "cat_realestate", "Real Estate", "890 ads", Icons.apartment),
                    _buildCategoryCard(context, "cat_mobiles", "Mobiles & Electronics", "2150 ads", Icons.smartphone),
                    _buildCategoryCard(context, "cat_home", "Home & Furniture", "670 ads", Icons.chair),
                    _buildCategoryCard(context, "cat_jobs", "Jobs & Services", "430 ads", Icons.work),
                    _buildCategoryCard(context, "cat_fashion", "Fashion & Beauty", "510 ads", Icons.watch),
                  ],
                ),
              ),
            ),

            // Live Listings Feed Header & Filters
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Text(
                          "Live Listings Feed",
                          style: TextStyle(color: AppColors.textLight, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.neonCyan.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.neonCyan.withValues(alpha: 0.5)),
                          ),
                          child: Text(
                            "${provider.listings.length}",
                            style: const TextStyle(color: AppColors.neonCyan, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),

                    // Filter Pills
                    Row(
                      children: [
                        _buildFilterPill("All", 'ALL'),
                        const SizedBox(width: 4),
                        _buildFilterPill("Verified", 'VERIFIED'),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Grid of Listing Cards
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.68,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final item = provider.listings[index];
                    return _buildWebStyleCard(context, item);
                  },
                  childCount: provider.listings.length,
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryCard(BuildContext context, String id, String title, String subtitle, IconData icon) {
    final provider = Provider.of<MarketplaceProvider>(context);
    final isSelected = provider.selectedCategory == id;

    return GestureDetector(
      onTap: () => provider.setCategory(isSelected ? 'ALL' : id),
      child: Container(
        width: 130,
        margin: const EdgeInsets.only(right: 10),
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue.withValues(alpha: 0.3) : AppColors.cardDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.neonCyan : AppColors.cardBorder),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: isSelected ? AppColors.neonCyan : AppColors.neonCyanLight, size: 24),
            const SizedBox(height: 6),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(color: AppColors.textLight, fontSize: 11, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 2),
            Text(subtitle, style: const TextStyle(color: AppColors.textMuted, fontSize: 9)),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterPill(String label, String value) {
    final isSelected = _activeFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _activeFilter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primaryBlue : AppColors.cardDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.primaryBlue : AppColors.cardBorder),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppColors.textMuted,
            fontSize: 10,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildWebStyleCard(BuildContext context, Listing item) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => ListingDetailScreen(listing: item)),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.cardDark,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.cardBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Stack with Badges
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(14)),
                  child: AspectRatio(
                    aspectRatio: 1.25,
                    child: Image.network(
                      item.images.isNotEmpty ? item.images.first : 'https://via.placeholder.com/400',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),

                // Top Left Badges: FEATURED + VERIFIED
                Positioned(
                  top: 8,
                  left: 8,
                  child: Row(
                    children: [
                      if (item.featured ?? true)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          margin: const EdgeInsets.only(right: 4),
                          decoration: BoxDecoration(
                            color: AppColors.amberFeatured,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text("FEATURED", style: TextStyle(color: Colors.black, fontSize: 8, fontWeight: FontWeight.bold)),
                        ),
                      if (item.safetyBadge)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.emeraldVerified,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.shield, color: Colors.white, size: 9),
                              SizedBox(width: 2),
                              Text("VERIFIED", style: TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),

                // Top Right: Photo Count Badge
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.7),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.camera_alt, color: Colors.white, size: 10),
                        const SizedBox(width: 3),
                        Text("${item.images.length}", style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),

                // Bottom Right: Heart Favorite Button
                Positioned(
                  bottom: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.pinkFavorite.withValues(alpha: 0.9),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.favorite, color: Colors.white, size: 14),
                  ),
                ),
              ],
            ),

            // Card Body
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(10.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Price & 0% APR Pill
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              "${item.currency} ${item.price.toStringAsFixed(0)}",
                              style: const TextStyle(
                                color: AppColors.neonCyanLight,
                                fontWeight: FontWeight.w900,
                                fontSize: 15,
                              ),
                            ),
                            if (item.flowFinanceEligible)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: AppColors.neonCyan.withValues(alpha: 0.15),
                                  border: Border.all(color: AppColors.neonCyan.withValues(alpha: 0.4)),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text("0% APR", style: TextStyle(color: AppColors.neonCyan, fontSize: 8, fontWeight: FontWeight.bold)),
                              ),
                          ],
                        ),

                        const SizedBox(height: 4),

                        // Title
                        Text(
                          item.title,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: AppColors.textLight,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            height: 1.2,
                          ),
                        ),
                      ],
                    ),

                    // Specs & Location Footer
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Spec Tag Pills
                        if (item.specs != null && item.specs!.isNotEmpty)
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: item.specs!.entries
                                  .take(3)
                                  .map((e) => Container(
                                        margin: const EdgeInsets.only(right: 4),
                                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: AppColors.pillBg,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          e.value,
                                          style: const TextStyle(color: AppColors.textMuted, fontSize: 9),
                                        ),
                                      ))
                                  .toList(),
                            ),
                          ),

                        const SizedBox(height: 6),

                        // Location & Time Footer
                        Row(
                          children: [
                            const Icon(Icons.location_on, color: AppColors.neonCyan, size: 10),
                            const SizedBox(width: 2),
                            Expanded(
                              child: Text(
                                "${item.location} • Just now",
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(color: AppColors.textMuted, fontSize: 9),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
