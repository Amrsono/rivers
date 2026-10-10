import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/listing.dart';
import '../models/bnpl.dart';
import '../core/constants.dart';
import '../providers/marketplace_provider.dart';
import 'seller_contact_dialog.dart';

class ListingDetailScreen extends StatefulWidget {
  final Listing listing;

  const ListingDetailScreen({super.key, required this.listing});

  @override
  State<ListingDetailScreen> createState() => _ListingDetailScreenState();
}

class _ListingDetailScreenState extends State<ListingDetailScreen> {
  int _currentImageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MarketplaceProvider>(context, listen: false);
    final BNPLBreakdown bnpl = provider.calculateBNPL(widget.listing.price);

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.cardDark,
        elevation: 0,
        title: Text(widget.listing.title, overflow: TextOverflow.ellipsis),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: AppColors.textLight),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.favorite_border, color: AppColors.textLight),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Gallery Header
            Stack(
              children: [
                SizedBox(
                  height: 280,
                  width: double.infinity,
                  child: Image.network(
                    widget.listing.images.isNotEmpty
                        ? widget.listing.images[_currentImageIndex]
                        : 'https://via.placeholder.com/600',
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      "${_currentImageIndex + 1}/${widget.listing.images.length}",
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                )
              ],
            ),

            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Price and Badge Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "${widget.listing.currency} ${widget.listing.price.toStringAsFixed(0)}",
                        style: const TextStyle(
                          color: AppColors.primaryLight,
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.2),
                          border: Border.all(color: AppColors.primaryLight),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          widget.listing.condition.replaceAll('_', ' '),
                          style: const TextStyle(color: AppColors.primaryLight, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),
                  Text(
                    widget.listing.title,
                    style: const TextStyle(color: AppColors.textLight, fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: AppColors.textMuted, size: 16),
                      const SizedBox(width: 4),
                      Text(
                        widget.listing.location,
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 14),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),
                  const Divider(color: Colors.white10),
                  const SizedBox(height: 12),

                  // Rivers Escrow Guarantee Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.cardDark,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primary.withOpacity(0.4)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.shield, color: AppColors.primaryLight),
                            SizedBox(width: 8),
                            Text(
                              "Rivers Escrow Protected",
                              style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 15),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Your funds are held safely in escrow until you inspect and accept the item. 100% buyer protection guaranteed.",
                          style: TextStyle(color: AppColors.textMuted, fontSize: 13),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Flow Finance BNPL Calculator Card
                  if (widget.listing.flowFinanceEligible) ...[
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.cardDark,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.accent.withOpacity(0.4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.bolt, color: AppColors.accent),
                              SizedBox(width: 8),
                              Text(
                                "Flow Finance BNPL (0% Interest)",
                                style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            "Pay only ${widget.listing.currency} ${bnpl.firstPaymentToday.toStringAsFixed(0)} today, then 3 monthly installments of ${widget.listing.currency} ${bnpl.installmentAmount.toStringAsFixed(0)}.",
                            style: const TextStyle(color: AppColors.textMuted, fontSize: 13),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // Description
                  const Text(
                    "Item Description",
                    style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    widget.listing.description,
                    style: const TextStyle(color: AppColors.textMuted, fontSize: 14, height: 1.4),
                  ),
                  const SizedBox(height: 80), // Padding for bottom bar
                ],
              ),
            ),
          ],
        ),
      ),

      // Bottom Bar with Contact & Buy Buttons
      bottomSheet: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        color: AppColors.cardDark,
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.textLight,
                  side: const BorderSide(color: AppColors.primaryLight),
                  minimumSize: const Size(0, 48),
                ),
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => SellerContactDialog(
                      seller: widget.listing.seller,
                      listingTitle: widget.listing.title,
                    ),
                  );
                },
                child: const Text("Contact Seller"),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primaryLight,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(0, 48),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Initiating Rivers Escrow Checkout...")),
                  );
                },
                child: const Text("Buy via Escrow"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
