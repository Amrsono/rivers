import { create } from 'zustand';
import { Listing, Category, AdminAnalytics, User } from '../types';
import { INITIAL_LISTINGS, MOCK_CATEGORIES, INITIAL_ADMIN_ANALYTICS, MOCK_USERS } from '../mock-data';

export type FilterTab = 'all' | 'bnpl' | 'verified' | 'top_rated';
export type ViewMode = 'discovery' | 'admin';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface RiversStoreState {
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
    get().addNotification('success', `Listing "${newListing.title}" has been published to Rivers!`);
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
  userBalance: 12450.00,
  
  adminAnalytics: INITIAL_ADMIN_ANALYTICS,
  approveVerification: (id) => {
    set((state) => ({
      adminAnalytics: {
        ...state.adminAnalytics,
        userVerificationCount: Math.max(0, state.adminAnalytics.userVerificationCount - 1),
        recentVerifications: state.adminAnalytics.recentVerifications.filter((item) => item.id !== id),
      },
    }));
    get().addNotification('success', 'User identity document approved successfully.');
  },
  rejectVerification: (id) => {
    set((state) => ({
      adminAnalytics: {
        ...state.adminAnalytics,
        recentVerifications: state.adminAnalytics.recentVerifications.filter((item) => item.id !== id),
      },
    }));
    get().addNotification('info', 'Verification request rejected.');
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
