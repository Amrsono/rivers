class InstallmentDetail {
  final String dueDate;
  final double amount;
  final String status; // 'UPCOMING' | 'PAID'
  final int installmentIndex;

  InstallmentDetail({
    required this.dueDate,
    required this.amount,
    required this.status,
    required this.installmentIndex,
  });

  factory InstallmentDetail.fromJson(Map<String, dynamic> json) {
    return InstallmentDetail(
      dueDate: json['dueDate'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'UPCOMING',
      installmentIndex: json['installmentIndex'] ?? 1,
    );
  }

  Map<String, dynamic> toJson() => {
        'dueDate': dueDate,
        'amount': amount,
        'status': status,
        'installmentIndex': installmentIndex,
      };
}

class BNPLBreakdown {
  final double totalPrice;
  final int installmentCount;
  final double installmentAmount;
  final String frequency;
  final double firstPaymentToday;
  final double serviceFee;
  final List<InstallmentDetail> schedule;

  BNPLBreakdown({
    required this.totalPrice,
    required this.installmentCount,
    required this.installmentAmount,
    required this.frequency,
    required this.firstPaymentToday,
    required this.serviceFee,
    required this.schedule,
  });

  factory BNPLBreakdown.fromJson(Map<String, dynamic> json) {
    return BNPLBreakdown(
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
      installmentCount: json['installmentCount'] ?? 4,
      installmentAmount: (json['installmentAmount'] as num?)?.toDouble() ?? 0.0,
      frequency: json['frequency'] ?? 'Monthly',
      firstPaymentToday: (json['firstPaymentToday'] as num?)?.toDouble() ?? 0.0,
      serviceFee: (json['serviceFee'] as num?)?.toDouble() ?? 0.0,
      schedule: (json['schedule'] as List? ?? [])
          .map((e) => InstallmentDetail.fromJson(e))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() => {
        'totalPrice': totalPrice,
        'installmentCount': installmentCount,
        'installmentAmount': installmentAmount,
        'frequency': frequency,
        'firstPaymentToday': firstPaymentToday,
        'serviceFee': serviceFee,
        'schedule': schedule.map((e) => e.toJson()).toList(),
      };
}
