import 'package:flutter/material.dart';
import '../core/constants.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.cardDark,
        title: const Text("Admin & Verification Console"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // KPI Summary Cards
            Row(
              children: [
                _buildStatCard("Active Listings", "1,240", AppColors.primaryLight),
                const SizedBox(width: 12),
                _buildStatCard("Escrow Vol", "\$482.5K", AppColors.accent),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildStatCard("BNPL Volume", "\$128.0K", AppColors.badgeGold),
                const SizedBox(width: 12),
                _buildStatCard("Trust Score", "98.4%", AppColors.success),
              ],
            ),

            const SizedBox(height: 24),
            const Text(
              "Identity Verification Queue",
              style: TextStyle(color: AppColors.textLight, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            _buildQueueItem(
              name: "Youssef Nabil",
              docType: "National ID (Jordan)",
              time: "10 mins ago",
              context: context,
            ),
            _buildQueueItem(
              name: "Amira Al-Sabah",
              docType: "Commercial License (UAE)",
              time: "25 mins ago",
              context: context,
            ),
            _buildQueueItem(
              name: "Fahad Mansoor",
              docType: "Passport (Saudi Arabia)",
              time: "1 hour ago",
              context: context,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.cardDark,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
            const SizedBox(height: 6),
            Text(
              value,
              style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQueueItem({
    required String name,
    required String docType,
    required String time,
    required BuildContext context,
  }) {
    return Card(
      color: AppColors.cardDark,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: const CircleAvatar(
          backgroundColor: AppColors.primary,
          child: Icon(Icons.person, color: Colors.white),
        ),
        title: Text(name, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold)),
        subtitle: Text("$docType • $time", style: const TextStyle(color: AppColors.textMuted, fontSize: 12)),
        trailing: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primaryLight,
            foregroundColor: Colors.white,
          ),
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text("Approved verification for $name")),
            );
          },
          child: const Text("Approve"),
        ),
      ),
    );
  }
}
