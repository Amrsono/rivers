import 'package:flutter/material.dart';
import '../models/user.dart';
import '../core/constants.dart';

class SellerContactDialog extends StatelessWidget {
  final User seller;
  final String listingTitle;

  const SellerContactDialog({
    super.key,
    required this.seller,
    required this.listingTitle,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.cardDark,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundImage: NetworkImage(seller.avatar),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            seller.name,
                            style: const TextStyle(
                              color: AppColors.textLight,
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          if (seller.isVerified) ...[
                            const SizedBox(width: 4),
                            const Icon(Icons.verified, color: AppColors.primaryLight, size: 16),
                          ],
                        ],
                      ),
                      Text(
                        "Trust Score: ${seller.trustScore}% • ${seller.salesCount} Sales",
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: AppColors.textMuted),
                )
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: Colors.white10),
            const SizedBox(height: 12),
            const Text(
              "Escrow Protected Communication",
              style: TextStyle(color: AppColors.primaryLight, fontWeight: FontWeight.bold, fontSize: 13),
            ),
            const SizedBox(height: 4),
            const Text(
              "Never share passwords, banking PINs, or wire money directly. Payments made via Rivers Escrow are 100% money-back guaranteed.",
              style: TextStyle(color: AppColors.textMuted, fontSize: 12),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF25D366), // WhatsApp Green
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Opening WhatsApp contact for ${seller.name}...")),
                );
              },
              icon: const Icon(Icons.chat),
              label: Text("WhatsApp (${seller.whatsapp ?? 'Direct'})"),
            ),
            const SizedBox(height: 10),
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.textLight,
                side: const BorderSide(color: Colors.white24),
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Calling seller at ${seller.phone ?? 'Direct Phone'}")),
                );
              },
              icon: const Icon(Icons.phone),
              label: Text("Phone Call (${seller.phone ?? 'Call Seller'})"),
            ),
          ],
        ),
      ),
    );
  }
}
