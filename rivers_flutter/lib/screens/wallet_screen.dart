import 'package:flutter/material.dart';
import '../core/constants.dart';

class WalletScreen extends StatelessWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        backgroundColor: AppColors.cardDark,
        title: const Text("Flow Finance & Escrow Wallet"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppColors.primary, AppColors.accent],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Escrow Protected Balance", style: TextStyle(color: Colors.white70, fontSize: 13)),
                      Icon(Icons.shield, color: Colors.white),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    "\$12,450.00",
                    style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.primary,
                          ),
                          onPressed: () {},
                          icon: const Icon(Icons.add),
                          label: const Text("Add Funds"),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white54),
                          ),
                          onPressed: () {},
                          icon: const Icon(Icons.arrow_upward),
                          label: const Text("Withdraw"),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),
            const Text(
              "Active Installments (Flow Finance)",
              style: TextStyle(color: AppColors.textLight, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            _buildInstallmentCard(
              title: "Porsche Taycan 4S 2023",
              total: "JOD 68,500",
              nextDue: "JOD 17,125 due in 12 days",
              progress: 0.25,
            ),
            _buildInstallmentCard(
              title: "MacBook Pro 16\" M3 Max",
              total: "USD 3,100",
              nextDue: "USD 775 due in 24 days",
              progress: 0.50,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInstallmentCard({
    required String title,
    required String total,
    required String nextDue,
    required double progress,
  }) {
    return Card(
      color: AppColors.cardDark,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(title, style: const TextStyle(color: AppColors.textLight, fontWeight: FontWeight.bold, fontSize: 15)),
                Text(total, style: const TextStyle(color: AppColors.primaryLight, fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 8),
            Text(nextDue, style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
            const SizedBox(height: 12),
            LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white10,
              color: AppColors.primaryLight,
              minHeight: 6,
            ),
          ],
        ),
      ),
    );
  }
}
