import 'package:flutter/foundation.dart';
import '../models/listing.dart';
import '../models/bnpl.dart';
import '../core/constants.dart';
import '../services/api_service.dart';

class MarketplaceProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<Listing> _allListings = [];
  List<Listing> _filteredListings = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedCategory = 'ALL';
  CountryInfo _selectedCountry = AppConstants.countries.first; // Default JO

  List<Listing> get listings => _filteredListings;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;
  CountryInfo get selectedCountry => _selectedCountry;

  MarketplaceProvider() {
    loadListings();
  }

  Future<void> loadListings() async {
    _isLoading = true;
    notifyListeners();

    _allListings = await _apiService.fetchListings();
    _applyFilters();

    _isLoading = false;
    notifyListeners();
  }

  void setCountry(CountryInfo country) {
    _selectedCountry = country;
    _applyFilters();
    notifyListeners();
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    _applyFilters();
    notifyListeners();
  }

  void setCategory(String categoryId) {
    _selectedCategory = categoryId;
    _applyFilters();
    notifyListeners();
  }

  void _applyFilters() {
    _filteredListings = _allListings.where((item) {
      final matchesSearch = _searchQuery.isEmpty ||
          item.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          (item.description.toLowerCase().contains(_searchQuery.toLowerCase()));

      final matchesCategory = _selectedCategory == 'ALL' ||
          item.categoryId == _selectedCategory;

      return matchesSearch && matchesCategory;
    }).toList();
  }

  /// Calculates BNPL 4-month breakdown for Rivers Flow Finance
  BNPLBreakdown calculateBNPL(double price) {
    final int count = 4;
    final double installmentAmount = (price / count);
    final double firstPayment = installmentAmount;
    final double serviceFee = 0.0; // 0% interest

    final List<InstallmentDetail> schedule = List.generate(count, (index) {
      final date = DateTime.now().add(Duration(days: index * 30));
      return InstallmentDetail(
        dueDate: "${date.day}/${date.month}/${date.year}",
        amount: installmentAmount,
        status: index == 0 ? 'PAID' : 'UPCOMING',
        installmentIndex: index + 1,
      );
    });

    return BNPLBreakdown(
      totalPrice: price,
      installmentCount: count,
      installmentAmount: installmentAmount,
      frequency: 'Monthly',
      firstPaymentToday: firstPayment,
      serviceFee: serviceFee,
      schedule: schedule,
    );
  }
}
