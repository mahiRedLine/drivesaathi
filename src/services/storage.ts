import { 
  UserRole, 
  Trainer, 
  Booking, 
  TrainingPackage, 
  PricingRuleConfig, 
  CityConfig, 
  VehicleModel, 
  Coupon, 
  SafetyIncident,
  WalletState,
  UserAddress,
  AuthUser
} from '../types';
import { 
  POPULAR_CITIES, 
  VEHICLE_DATABASE, 
  MOCK_TRAINERS, 
  TRAINING_PACKAGES, 
  DEFAULT_PRICING_CONFIG, 
  AVAILABLE_COUPONS, 
  INITIAL_BOOKINGS, 
  INITIAL_SAFETY_INCIDENTS 
} from '../data/mockData';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'BOOKING' | 'SAFETY' | 'TRAINER' | 'PAYMENT' | 'OFFER';
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderRole: 'CUSTOMER' | 'TRAINER' | 'SYSTEM';
  senderName: string;
  text: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  ROLE: 'drivesaathi_active_role',
  CURRENT_USER: 'drivesaathi_current_user_v1',
  TRAINERS: 'drivesaathi_trainers_v1',
  BOOKINGS: 'drivesaathi_bookings_v1',
  PACKAGES: 'drivesaathi_packages_v1',
  PRICING_CONFIG: 'drivesaathi_pricing_config_v1',
  CITIES: 'drivesaathi_cities_v1',
  VEHICLES: 'drivesaathi_vehicles_v1',
  COUPONS: 'drivesaathi_coupons_v1',
  INCIDENTS: 'drivesaathi_incidents_v1',
  WALLET: 'drivesaathi_wallet_v1',
  NOTIFICATIONS: 'drivesaathi_notifications_v1',
  CHAT_MESSAGES: 'drivesaathi_chat_messages_v1',
  SAVED_ADDRESSES: 'drivesaathi_addresses_v1',
  ACTIVE_VIEW: 'drivesaathi_active_view'
};

export const DEMO_USERS: Record<'CUSTOMER' | 'TRAINER' | 'ADMIN', AuthUser> = {
  CUSTOMER: {
    id: 'cust-mahesh-1',
    name: 'Mahesh Sharma',
    email: 'mahesh.sharma@example.com',
    phone: '+91 98860 41209',
    role: 'CUSTOMER',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isKycVerified: true
  },
  TRAINER: {
    id: 'tr-priya-sharma',
    name: 'Priya Sharma',
    email: 'priya.sharma@drivesaathi.in',
    phone: '+91 98450 12849',
    role: 'TRAINER',
    city: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isKycVerified: true
  },
  ADMIN: {
    id: 'admin-super-1',
    name: 'Operations Super Admin',
    email: 'ops.admin@drivesaathi.in',
    phone: '+91 99000 88888',
    role: 'SUPER_ADMIN',
    city: 'Headquarters (Bengaluru)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isKycVerified: true
  }
};

class StoreService {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // --- Current User Session & Auth ---
  getCurrentUser(): AuthUser {
    if (typeof window === 'undefined') return DEMO_USERS.CUSTOMER;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS.CUSTOMER));
      return DEMO_USERS.CUSTOMER;
    }
    return JSON.parse(data);
  }

  setCurrentUser(user: AuthUser | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      this.setActiveRole('CUSTOMER');
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      this.setActiveRole(user.role);
    }
    this.notify();
  }

  // --- Active Role & Navigation View ---
  getActiveRole(): UserRole {
    if (typeof window === 'undefined') return 'CUSTOMER';
    const role = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (role as UserRole) || 'CUSTOMER';
  }

  setActiveRole(role: UserRole) {
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
    this.notify();
  }

  getActiveView(): string {
    if (typeof window === 'undefined') return 'website';
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_VIEW) || 'website';
  }

  setActiveView(view: string) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_VIEW, view);
    this.notify();
  }

  // --- Trainers ---
  getTrainers(): Trainer[] {
    if (typeof window === 'undefined') return MOCK_TRAINERS;
    const data = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(MOCK_TRAINERS));
      return MOCK_TRAINERS;
    }
    return JSON.parse(data);
  }

  updateTrainer(updated: Trainer) {
    const list = this.getTrainers().map(t => t.id === updated.id ? updated : t);
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(list));
    this.notify();
  }

  addTrainer(trainer: Trainer) {
    const list = [trainer, ...this.getTrainers()];
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(list));
    this.notify();
  }

  // --- Bookings ---
  getBookings(): Booking[] {
    if (typeof window === 'undefined') return INITIAL_BOOKINGS;
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(data);
  }

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find(b => b.id === id);
  }

  saveBooking(booking: Booking) {
    const existing = this.getBookings();
    const index = existing.findIndex(b => b.id === booking.id);
    let updated: Booking[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = booking;
    } else {
      updated = [booking, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
    this.notify();
  }

  // --- Pricing Config ---
  getPricingConfig(): PricingRuleConfig {
    if (typeof window === 'undefined') return DEFAULT_PRICING_CONFIG;
    const data = localStorage.getItem(STORAGE_KEYS.PRICING_CONFIG);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRICING_CONFIG, JSON.stringify(DEFAULT_PRICING_CONFIG));
      return DEFAULT_PRICING_CONFIG;
    }
    return JSON.parse(data);
  }

  updatePricingConfig(config: PricingRuleConfig) {
    localStorage.setItem(STORAGE_KEYS.PRICING_CONFIG, JSON.stringify(config));
    this.notify();
  }

  // --- Packages ---
  getPackages(): TrainingPackage[] {
    if (typeof window === 'undefined') return TRAINING_PACKAGES;
    const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(TRAINING_PACKAGES));
      return TRAINING_PACKAGES;
    }
    return JSON.parse(data);
  }

  savePackage(pkg: TrainingPackage) {
    const list = this.getPackages();
    const idx = list.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      list[idx] = pkg;
    } else {
      list.push(pkg);
    }
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    this.notify();
  }

  // --- Cities ---
  getCities(): CityConfig[] {
    if (typeof window === 'undefined') return POPULAR_CITIES;
    const data = localStorage.getItem(STORAGE_KEYS.CITIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(POPULAR_CITIES));
      return POPULAR_CITIES;
    }
    return JSON.parse(data);
  }

  // --- Vehicles ---
  getVehicles(): VehicleModel[] {
    if (typeof window === 'undefined') return VEHICLE_DATABASE;
    const data = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(VEHICLE_DATABASE));
      return VEHICLE_DATABASE;
    }
    return JSON.parse(data);
  }

  // --- Coupons ---
  getCoupons(): Coupon[] {
    if (typeof window === 'undefined') return AVAILABLE_COUPONS;
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(AVAILABLE_COUPONS));
      return AVAILABLE_COUPONS;
    }
    return JSON.parse(data);
  }

  saveCoupon(coupon: Coupon) {
    const list = this.getCoupons().filter(c => c.code !== coupon.code);
    list.unshift(coupon);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(list));
    this.notify();
  }

  // --- Safety Incidents ---
  getSafetyIncidents(): SafetyIncident[] {
    if (typeof window === 'undefined') return INITIAL_SAFETY_INCIDENTS;
    const data = localStorage.getItem(STORAGE_KEYS.INCIDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(INITIAL_SAFETY_INCIDENTS));
      return INITIAL_SAFETY_INCIDENTS;
    }
    return JSON.parse(data);
  }

  reportSafetyIncident(incident: SafetyIncident) {
    const list = [incident, ...this.getSafetyIncidents()];
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: `🚨 EMERGENCY ALERT: ${incident.type}`,
      message: `Emergency SOS triggered by ${incident.customerName}. Location: ${incident.location.area}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'SAFETY'
    });
    this.notify();
  }

  updateSafetyIncident(updated: SafetyIncident) {
    const list = this.getSafetyIncidents().map(inc => inc.id === updated.id ? updated : inc);
    localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(list));
    this.notify();
  }

  // --- Wallet & DrivePoints ---
  getWallet(): WalletState {
    const initialWallet: WalletState = {
      balance: 450,
      drivePoints: 320,
      transactions: [
        {
          id: 'wt-1',
          type: 'CREDIT',
          amount: 200,
          description: 'Welcome Sign-up Bonus',
          date: '2026-09-25',
          source: 'PROMO'
        },
        {
          id: 'wt-2',
          type: 'CREDIT',
          amount: 250,
          description: 'Referral reward from Anita',
          date: '2026-09-28',
          source: 'REFERRAL'
        }
      ]
    };
    if (typeof window === 'undefined') return initialWallet;
    const data = localStorage.getItem(STORAGE_KEYS.WALLET);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(initialWallet));
      return initialWallet;
    }
    return JSON.parse(data);
  }

  updateWallet(wallet: WalletState) {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet));
    this.notify();
  }

  addWalletTransaction(amount: number, description: string, type: 'CREDIT' | 'DEBIT', source: WalletState['transactions'][0]['source']) {
    const current = this.getWallet();
    const newBalance = type === 'CREDIT' ? current.balance + amount : current.balance - amount;
    const updated: WalletState = {
      ...current,
      balance: Math.max(0, newBalance),
      transactions: [
        {
          id: `wt-${Date.now()}`,
          type,
          amount,
          description,
          date: new Date().toISOString().split('T')[0],
          source
        },
        ...current.transactions
      ]
    };
    this.updateWallet(updated);
  }

  // --- Notifications ---
  getNotifications(): AppNotification[] {
    const initial: AppNotification[] = [
      {
        id: 'notif-init-1',
        title: 'Tomorrow Session Reminder',
        message: 'Priya Sharma will meet you at 10:00 AM for Car Driving practice.',
        timestamp: '10m ago',
        read: false,
        type: 'BOOKING'
      },
      {
        id: 'notif-init-2',
        title: 'DrivePoints Earned! 🎉',
        message: 'You earned 100 DrivePoints for completing your last practice session.',
        timestamp: '1d ago',
        read: true,
        type: 'OFFER'
      }
    ];
    if (typeof window === 'undefined') return initial;
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  }

  addNotification(n: AppNotification) {
    const list = [n, ...this.getNotifications()];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  markAllNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  // --- Chat Messages ---
  getChatMessages(bookingId: string): ChatMessage[] {
    const initialChats: ChatMessage[] = [
      {
        id: 'msg-1',
        bookingId: 'bk-1001',
        senderRole: 'TRAINER',
        senderName: 'Priya Sharma',
        text: 'Hello Mahesh! Looking forward to our session tomorrow. Please keep your Creta parked near the apartment gate.',
        timestamp: '06:15 PM'
      },
      {
        id: 'msg-2',
        bookingId: 'bk-1001',
        senderRole: 'CUSTOMER',
        senderName: 'Mahesh Sharma',
        text: 'Sure Priya! Looking forward to practicing parallel parking.',
        timestamp: '06:20 PM'
      }
    ];
    if (typeof window === 'undefined') return initialChats;
    const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    let all: ChatMessage[] = initialChats;
    if (data) {
      all = JSON.parse(data);
    } else {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(initialChats));
    }
    return all.filter(m => m.bookingId === bookingId);
  }

  sendChatMessage(msg: ChatMessage) {
    const current = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)
      ? JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)!)
      : [];
    const updated = [...current, msg];
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(updated));
    this.notify();
  }

  // --- Saved Addresses ---
  getSavedAddresses(): UserAddress[] {
    const defaults: UserAddress[] = [
      {
        id: 'addr-home-1',
        title: 'Home',
        fullAddress: 'Apartment 402, Prestige Ozone, Whitefield Main Road',
        area: 'Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        locationType: 'CUSTOMER_HOME',
        lat: 12.9698,
        lng: 77.7499
      },
      {
        id: 'addr-ground-2',
        title: 'Practice Ground',
        fullAddress: 'BBMP Play Ground & Safe Practice Arena, HSR 4th Sector',
        area: 'HSR Layout',
        city: 'Bengaluru',
        pincode: '560102',
        locationType: 'PUBLIC_SAFE_AREA',
        lat: 12.9121,
        lng: 77.6446
      }
    ];
    if (typeof window === 'undefined') return defaults;
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(data);
  }

  saveAddress(addr: UserAddress) {
    const list = this.getSavedAddresses();
    const idx = list.findIndex(a => a.id === addr.id);
    if (idx >= 0) {
      list[idx] = addr;
    } else {
      list.push(addr);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(list));
    this.notify();
  }

  resetAllDataToDefaults() {
    localStorage.clear();
    this.notify();
  }
}

export const store = new StoreService();
