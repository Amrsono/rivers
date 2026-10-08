export type ItemCondition = 'NEW' | 'LIKE_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';
export type ListingStatus = 'ACTIVE' | 'RESERVED' | 'SOLD' | 'ARCHIVED';
export type PaymentMethod = 'ESCROW_P2P' | 'RIVERS_FLOW_BNPL';
export type OrderStatus = 'PENDING' | 'IN_ESCROW' | 'COMPLETED' | 'CANCELLED';

export type CountryCode = 'JO' | 'SA' | 'AE' | 'EG' | 'IQ' | 'KW' | 'OM';

export interface CountryInfo {
  code: CountryCode;
  nameEn: string;
  nameAr: string;
  flag: string;
  currency: string;
  cities: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  isVerified: boolean;
  trustScore: number;
  salesCount: number;
  location: string;
  joinedDate: string;
  phone?: string;
  whatsapp?: string;
}

export interface SubCategory {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  icon: string;
  description: string;
  descriptionAr?: string;
  itemCount: number;
  subcategories?: SubCategory[];
}

export interface Listing {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  price: number;
  currency: string;
  condition: ItemCondition;
  categoryId: string;
  categoryName?: string;
  subCategory?: string;
  images: string[];
  location: string;
  city?: string;
  district?: string;
  country?: CountryCode;
  sellerId: string;
  seller: User;
  safetyBadge: boolean;
  flowFinanceEligible: boolean;
  status: ListingStatus;
  tags: string[];
  viewCount: number;
  createdAt: string;
  specs?: Record<string, string>;
  featured?: boolean;
}

export interface InstallmentDetail {
  dueDate: string;
  amount: number;
  status: 'UPCOMING' | 'PAID';
  installmentIndex: number;
}

export interface BNPLBreakdown {
  totalPrice: number;
  installmentCount: number;
  installmentAmount: number;
  frequency: string;
  firstPaymentToday: number;
  serviceFee: number; // 0 for interest-free
  schedule: InstallmentDetail[];
}

export interface VerificationQueueItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  documentType: 'ID_CARD' | 'PASSPORT' | 'BUSINESS_LICENSE';
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface AdminAnalytics {
  activeListings: number;
  totalMarketplaceGmv: number;
  escrowVolume: number;
  userVerificationCount: number;
  dailyTrafficCount: number;
  bnplFinancedVolume: number;
  gmvGrowthPercent: number;
  trafficSpikeData: { time: string; visitors: number; orders: number }[];
  categoryBreakdown: { category: string; count: number; value: number }[];
  recentVerifications: VerificationQueueItem[];
}

