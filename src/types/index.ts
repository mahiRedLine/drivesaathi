// Core Type Definitions for DriveSaathi Marketplace

export type UserRole = 'CUSTOMER' | 'TRAINER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  isKycVerified?: boolean;
}

export type GenderPreference = 'NO_PREFERENCE' | 'FEMALE' | 'MALE';
export type Gender = 'FEMALE' | 'MALE' | 'OTHER';

export type VehicleCategory = 'CAR' | 'MOTORCYCLE' | 'SCOOTER' | 'REFRESHER_CAR';
export type TransmissionType = 'MANUAL' | 'AUTOMATIC' | 'AMT' | 'DCT' | 'CVT' | 'EV';
export type FuelType = 'PETROL' | 'DIESEL' | 'CNG' | 'EV' | 'HYBRID';

export interface VehicleModel {
  id: string;
  brand: string;
  model: string;
  category: VehicleCategory;
  transmissions: TransmissionType[];
  fuelTypes: FuelType[];
  popular?: boolean;
  ccOrBattery?: string;
  image?: string;
}

export type ExperienceLevel = 
  | 'ABSOLUTE_BEGINNER'
  | 'LEARNERS_LICENCE'
  | 'HAS_LICENCE_NEEDS_PRACTICE'
  | 'LONG_GAP_REFRESHER'
  | 'NEW_VEHICLE_OWNER'
  | 'SPECIFIC_SKILL_FOCUS';

export type TrainingGoal = 
  | 'STARTING_STOPPING'
  | 'CLUTCH_CONTROL'
  | 'GEAR_SHIFTING'
  | 'STEERING_LANE_DISCIPLINE'
  | 'U_TURNS_TIGHT_TURNS'
  | 'REVERSE_DRIVING'
  | 'PARALLEL_PARKING'
  | 'ANGULAR_PERPENDICULAR_PARKING'
  | 'CITY_HEAVY_TRAFFIC'
  | 'HILL_START_INCLINE'
  | 'HIGHWAY_LANE_MERGE'
  | 'NIGHT_DRIVING'
  | 'EV_REGEN_DRIVING'
  | 'FLYOVER_CONGESTION'
  | 'NEW_CAR_CONTROLS_ADAS';

export type LocationType = 
  | 'CUSTOMER_HOME'
  | 'RESIDENTIAL_AREA'
  | 'EMPTY_PARKING_GROUND'
  | 'PRIVATE_DRIVING_GROUND'
  | 'PUBLIC_SAFE_AREA';

export interface UserAddress {
  id: string;
  title: string; // 'Home', 'Work', 'Practice Ground'
  fullAddress: string;
  area: string;
  city: string;
  pincode: string;
  locationType: LocationType;
  lat: number;
  lng: number;
}

export interface Trainer {
  id: string;
  name: string;
  gender: Gender;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  yearsExperience: number;
  totalSessions: number;
  rating: number;
  reviewCount: number;
  cancellationRate: number; // e.g. 0.02 (2%)
  baseHourlyRate: number;
  city: string;
  serviceRadiusKm: number;
  lat: number;
  lng: number;
  languages: string[];
  vehicleExpertise: {
    categories: VehicleCategory[];
    transmissions: TransmissionType[];
    electricVehicleExpert: boolean;
  };
  skills: TrainingGoal[];
  verifiedStatus: {
    isIdentityVerified: boolean;
    isLicenceVerified: boolean;
    isAddressVerified: boolean;
    isBackgroundVerified: boolean;
    isFirstAidCertified: boolean;
    verificationStatus: 'APPROVED' | 'UNDER_REVIEW' | 'PENDING' | 'REJECTED';
  };
  documents: {
    drivingLicenceNumber: string;
    aadhaarOrGovtId: string;
    policeVerificationRef: string;
  };
  availability: {
    daysOfWeek: number[]; // 0 = Sun, 1 = Mon ...
    slots: string[]; // '07:00', '08:30', '10:00', '16:00', '17:30', '19:00'
  };
  bankDetails: {
    accountHolder: string;
    accountNumberMasked: string;
    ifsc: string;
    upiId: string;
  };
}

export type BookingStatus =
  | 'DRAFT'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'TRAINER_ASSIGNED'
  | 'TRAINER_ACCEPTED'
  | 'TRAINER_EN_ROUTE'
  | 'TRAINER_ARRIVED'
  | 'SESSION_STARTED'
  | 'SESSION_COMPLETED'
  | 'RATING_PENDING'
  | 'COMPLETED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_TRAINER'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED'
  | 'NO_SHOW';

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  trainerId?: string;
  trainerName?: string;
  trainerPhone?: string;
  trainerAvatar?: string;
  trainerGender?: Gender;
  vehicleCategory: VehicleCategory;
  vehicleDetails: {
    hasOwnVehicle: boolean;
    brand: string;
    model: string;
    transmission: TransmissionType;
    fuelType: FuelType;
  };
  experienceLevel: ExperienceLevel;
  goals: TrainingGoal[];
  address: UserAddress;
  date: string; // YYYY-MM-DD
  timeSlot: string; // '10:00 AM'
  durationMinutes: number; // 30, 45, 60, 90, 120
  genderPreference: GenderPreference;
  status: BookingStatus;
  pricing: {
    baseAmount: number;
    peakMultiplier: number;
    platformFee: number;
    taxesGst: number;
    discountAmount: number;
    couponCode?: string;
    totalAmount: number;
    trainerEarnings: number;
    platformCommission: number;
  };
  payment: {
    method: 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET';
    transactionId: string;
    status: 'PENDING' | 'PAID' | 'REFUNDED';
    paidAt?: string;
  };
  sessionTracking?: {
    startedAt?: string;
    completedAt?: string;
    actualDurationSeconds?: number;
    practicedSkills?: TrainingGoal[];
    trainerNotes?: string;
    aiProgressFeedback?: string;
    aiNextRecommendation?: string;
    sharedWithContact?: {
      name: string;
      phone: string;
    };
    sosTriggered?: boolean;
  };
  review?: {
    rating: number; // 1 to 5
    comment: string;
    punctual: boolean;
    respectful: boolean;
    patient: boolean;
    feltSafe: boolean;
    privateSafetyFeedback?: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TrainingPackage {
  id: string;
  name: string;
  badge?: string;
  tagline: string;
  description: string;
  vehicleCategory: VehicleCategory;
  sessionCount: number;
  sessionDurationMinutes: number;
  price: number;
  originalPrice: number;
  features: string[];
  popular?: boolean;
}

export interface CityConfig {
  id: string;
  name: string;
  state: string;
  active: boolean;
  baseRatePerHour: number;
  activeTrainersCount: number;
  lat: number;
  lng: number;
  popularAreas: string[];
}

export interface PricingRuleConfig {
  baseHourlyRateCar: number;
  baseHourlyRateBike: number;
  baseHourlyRateScooter: number;
  platformFee: number;
  gstTaxRate: number; // 0.18 (18%)
  trainerCommissionPercent: number; // 0.80 (80%)
  peakHourMultiplier: number; // 1.15
  weekendMultiplier: number; // 1.10
  cancellationRefundWindowHours: number; // 6 hours
  freeCancellationFeePercent: number; // 0% if > 6h, 50% if 2-6h, 100% if < 2h
}

export interface SafetyIncident {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  trainerId?: string;
  trainerName?: string;
  type: 'SOS_TRIGGERED' | 'UNSAFE_DRIVING' | 'HARASSMENT' | 'LOCATION_DEVIATION' | 'NO_SHOW_EMERGENCY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'INVESTIGATING' | 'ESCALATED_POLICE' | 'RESOLVED';
  reportedAt: string;
  details: string;
  location: { lat: number; lng: number; area: string };
  actionTakenNotes?: string;
}

export interface WalletState {
  balance: number;
  drivePoints: number;
  transactions: {
    id: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    description: string;
    date: string;
    source: 'REFERRAL' | 'REFUND' | 'PROMO' | 'BOOKING_PAYMENT' | 'DRIVE_POINTS_REWARD';
  }[];
}

export interface Coupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  value: number; // 20% or ₹200
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
  active: boolean;
}
