import { create } from 'zustand';
import { Listing, Category, AdminAnalytics, User } from '../types';
import { INITIAL_LISTINGS, MOCK_CATEGORIES, INITIAL_ADMIN_ANALYTICS, MOCK_USERS } from '../mock-data';
import { Language, translations } from '../i18n/translations';

export type FilterTab = 'all' | 'bnpl' | 'verified' | 'top_rated';
export type ViewMode = 'discovery' | 'admin';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface RiversStoreState {
  // i18n Language & Direction
  language: Language;
  setLanguage: (lang: Language) => void;
  numLocale: string;
  formatNumber: (amount: number) => string;
  formatPrice: (amount: number, compact?: boolean) => string;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;

  // Navigation & View State
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;

  // Search & Category Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string; // 'all' or category ID
  setSelectedCategory: (categoryId: string) => void;
  activeFilterTab: FilterTab;
  setActiveFilterTab: (tab: FilterTab) => void;

  // Listings Data
  listings: Listing[];
  addListing: (newListing: Listing) => void;

  // Modals & User Journeys
  activeListingDetail: Listing | null;
  openListingDetail: (listing: Listing) => void;
  closeListingDetail: () => void;

  isListingCreatorOpen: boolean;
  openListingCreator: () => void;
  closeListingCreator: () => void;

  activeBNPLCheckout: Listing | null;
  openBNPLCheckout: (listing: Listing) => void;
  closeBNPLCheckout: () => void;

  // Current User & Balance
  currentUser: User;
  userBalance: number;

  // Admin Analytics State
  adminAnalytics: AdminAnalytics;
  approveVerification: (id: string) => void;
  rejectVerification: (id: string) => void;

  // Toast Notifications
  notifications: ToastNotification[];
  addNotification: (type: ToastNotification['type'], message: string) => void;
  removeNotification: (id: string) => void;
}

export const useRiversStore = create<RiversStoreState>((set, get) => ({
  language: 'en',
  numLocale: 'en-US',
  formatNumber: (amount) => {
    const lang = get().language;
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
    return new Intl.NumberFormat(locale).format(amount);
  },
  formatPrice: (amount, compact = false) => {
    const lang = get().language;
    const locale = lang === 'ar' ? 'ar-EG' : 'en-US';

    if (compact) {
      if (amount >= 1_000_000_000) {
        const val = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount / 1_000_000_000);
        return lang === 'ar' ? `${val} مليار ج.م` : `EGP ${val}B`;
      }
      if (amount >= 1_000_000) {
        const val = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount / 1_000_000);
        return lang === 'ar' ? `${val} مليون ج.م` : `EGP ${val}M`;
      }
      if (amount >= 1_000) {
        const val = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(amount / 1_000);
        return lang === 'ar' ? `${val}K ج.م` : `EGP ${val}K`;
      }
    }

    const formattedNum = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount);
    return lang === 'ar' ? `${formattedNum} ج.م` : `EGP ${formattedNum}`;
  },
  setLanguage: (lang) => {
    set({ language: lang, numLocale: lang === 'ar' ? 'ar-EG' : 'en-US' });
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    }
  },
  t: (key, params) => {
    const lang = get().language || 'en';
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        text = text.replace(new RegExp(`\\$\\{${paramKey}\\}`, 'g'), String(value));
      });
    }
    return text;
  },

  activeView: 'discovery',
  setActiveView: (view) => set({ activeView: view }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedCategory: 'all',
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  activeFilterTab: 'all',
  setActiveFilterTab: (tab) => set({ activeFilterTab: tab }),

  listings: INITIAL_LISTINGS,
  addListing: (newListing) => {
    set((state) => ({
      listings: [newListing, ...state.listings],
      adminAnalytics: {
        ...state.adminAnalytics,
        activeListings: state.adminAnalytics.activeListings + 1,
      },
    }));
    const msg = get().t('listingPublishedSuccess', { title: newListing.title });
    get().addNotification('success', msg);
  },

  activeListingDetail: null,
  openListingDetail: (listing) => set({ activeListingDetail: listing }),
  closeListingDetail: () => set({ activeListingDetail: null }),

  isListingCreatorOpen: false,
  openListingCreator: () => set({ isListingCreatorOpen: true }),
  closeListingCreator: () => set({ isListingCreatorOpen: false }),

  activeBNPLCheckout: null,
  openBNPLCheckout: (listing) => set({ activeBNPLCheckout: listing }),
  closeBNPLCheckout: () => set({ activeBNPLCheckout: null }),

  currentUser: MOCK_USERS.usr_1,
  userBalance: 622500.0,

  adminAnalytics: INITIAL_ADMIN_ANALYTICS,
  approveVerification: (id) => {
    set((state) => ({
      adminAnalytics: {
        ...state.adminAnalytics,
        userVerificationCount: Math.max(0, state.adminAnalytics.userVerificationCount - 1),
        recentVerifications: state.adminAnalytics.recentVerifications.filter((item) => item.id !== id),
      },
    }));
    get().addNotification('success', get().t('userApprovedSuccess'));
  },
  rejectVerification: (id) => {
    set((state) => ({
      adminAnalytics: {
        ...state.adminAnalytics,
        recentVerifications: state.adminAnalytics.recentVerifications.filter((item) => item.id !== id),
      },
    }));
    get().addNotification('info', get().t('verificationRejectedInfo'));
  },

  notifications: [],
  addNotification: (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
