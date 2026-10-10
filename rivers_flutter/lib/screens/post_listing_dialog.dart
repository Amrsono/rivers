import 'package:flutter/material.dart';
import '../core/constants.dart';

class PostListingDialog extends StatefulWidget {
  const PostListingDialog({super.key});

  @override
  State<PostListingDialog> createState() => _PostListingDialogState();
}

class _PostListingDialogState extends State<PostListingDialog> {
  final _titleController = TextEditingController();
  final _priceController = TextEditingController();
  final _descriptionController = TextEditingController();
  String _selectedCategory = 'cat_cars';
  String _selectedCondition = 'LIKE_NEW';

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.cardDark,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Row(
                  children: [
                    Icon(Icons.add_circle, color: AppColors.primaryLight),
                    SizedBox(width: 8),
                    Text(
                      "Post New Ad",
                      style: TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 18),
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: AppColors.textMuted),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Title Input
            const Text("Ad Title", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 4),
            TextField(
              controller: _titleController,
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                hintText: "e.g. Toyota Camry 2024 or iPhone 16 Pro",
                hintStyle: const TextStyle(color: Colors.white30),
                filled: true,
                fillColor: AppColors.bgDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 12),

            // Category Selector
            const Text("Category", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 4),
            DropdownButtonFormField<String>(
              value: _selectedCategory,
              dropdownColor: AppColors.cardDark,
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                filled: true,
                fillColor: AppColors.bgDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
              items: const [
                DropdownMenuItem(value: 'cat_cars', child: Text("Cars & Vehicles")),
                DropdownMenuItem(value: 'cat_mobiles', child: Text("Mobiles & Electronics")),
                DropdownMenuItem(value: 'cat_realestate', child: Text("Real Estate")),
                DropdownMenuItem(value: 'cat_fashion', child: Text("Fashion & Luxury")),
              ],
              onChanged: (val) => setState(() => _selectedCategory = val!),
            ),
            const SizedBox(height: 12),

            // Price Input
            const Text("Price (Local Currency)", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 4),
            TextField(
              controller: _priceController,
              keyboardType: TextInputType.number,
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                hintText: "e.g. 1500",
                hintStyle: const TextStyle(color: Colors.white30),
                filled: true,
                fillColor: AppColors.bgDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 12),

            // Description Input
            const Text("Description", style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 4),
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              style: const TextStyle(color: AppColors.textLight),
              decoration: InputDecoration(
                hintText: "Describe item condition, features, warranty...",
                hintStyle: const TextStyle(color: Colors.white30),
                filled: true,
                fillColor: AppColors.bgDark,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
              ),
            ),
            const SizedBox(height: 20),

            // Submit Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryLight,
                foregroundColor: Colors.white,
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                if (_titleController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text("Please enter an ad title.")),
                  );
                  return;
                }
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text("Ad '${_titleController.text}' published successfully with Rivers Escrow!")),
                );
              },
              child: const Text("Publish Ad", style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
