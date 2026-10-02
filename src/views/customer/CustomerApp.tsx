import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Car, 
  Bike, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  ArrowRight, 
  Check, 
  ChevronLeft, 
  Sparkles, 
  MessageSquare, 
  User, 
  Wallet, 
  Phone, 
  Share2, 
  AlertOctagon, 
  Tag, 
  Compass, 
  CheckCircle2, 
  Search, 
  Send,
  Plus,
  Play,
  RotateCcw
} from 'lucide-react';
import { 
  VehicleCategory, 
  TransmissionType, 
  FuelType, 
  ExperienceLevel, 
  TrainingGoal, 
  GenderPreference, 
  Trainer, 
  Booking, 
  UserAddress,
  Coupon,
  CityConfig
} from '../../types';
import { store, ChatMessage } from '../../services/storage';
import { sound } from '../../services/sound';
import { rankTrainersForCustomer } from '../../services/matchingEngine';
import { calculateDynamicPrice } from '../../services/pricingEngine';
import { generateAICoachFeedback, AIAnalysisResult } from '../../services/aiCoach';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { StarRating, VerifiedBadge, StatusBadge } from '../../components/common/Badge';
import { SosModal } from '../../components/common/SosModal';

interface CustomerAppProps {
  selectedCity: CityConfig;
  initialCategory?: VehicleCategory;
  initialTrainerId?: string;
  onNavigateToTrainerPortal?: () => void;
  isMobileFrame?: boolean;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({
  selectedCity,
  initialCategory = 'CAR',
  initialTrainerId,
  isMobileFrame = false
}) => {
  // Navigation Tabs: 'home' | 'book' | 'bookings' | 'messages' | 'profile' | 'packages'
  const [activeTab, setActiveTab] = useState<'home' | 'book' | 'bookings' | 'messages' | 'profile' | 'packages'>('home');

  // Booking Flow Steps: 1 to 8
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [category, setCategory] = useState<VehicleCategory>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('Hyundai');
  const [selectedModel, setSelectedModel] = useState<string>('Creta');
  const [transmission, setTransmission] = useState<TransmissionType>('AUTOMATIC');
  const [fuelType, setFuelType] = useState<FuelType>('PETROL');
  const [hasOwnVehicle, setHasOwnVehicle] = useState<boolean>(true);

  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('HAS_LICENCE_NEEDS_PRACTICE');
  const [selectedGoals, setSelectedGoals] = useState<TrainingGoal[]>(['PARALLEL_PARKING', 'CITY_HEAVY_TRAFFIC', 'REVERSE_DRIVING']);

  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(store.getSavedAddresses()[0]);
  const [genderPref, setGenderPref] = useState<GenderPreference>('NO_PREFERENCE');

  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM');
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(store.getCoupons()[0]); // DRIVESAFE200
  const [couponInput, setCouponInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CREDIT_CARD' | 'WALLET'>('UPI');

  const [trainers, setTrainers] = useState<Trainer[]>(store.getTrainers());
  const [bookings, setBookings] = useState<Booking[]>(store.getBookings());
  const [activeLiveBooking, setActiveLiveBooking] = useState<Booking | null>(bookings[0] || null);

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');

  // Live Session Simulation
  const [sessionSeconds, setSessionSeconds] = useState<number>(872); // 14 min 32 sec
  const [isSessionTimerRunning, setIsSessionTimerRunning] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [ratingStars, setRatingStars] = useState<number>(5);
  const [ratingFeedback, setRatingFeedback] = useState<string>('');
  const [privateSafetyNotes, setPrivateSafetyNotes] = useState<string>('');
  const [completedAiReport, setCompletedAiReport] = useState<AIAnalysisResult | null>(null);

  // Chat state
  const [chatMessageText, setChatMessageText] = useState<string>('');
  const [chatList, setChatList] = useState<ChatMessage[]>([]);

  const wallet = store.getWallet();
  const pricingConfig = store.getPricingConfig();

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTrainers(store.getTrainers());
      setBookings(store.getBookings());
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (initialTrainerId) {
      const found = trainers.find(t => t.id === initialTrainerId);
      if (found) {
        setSelectedTrainer(found);
        setActiveTab('book');
        setBookingStep(6);
      }
    }
  }, [initialTrainerId, trainers]);

  useEffect(() => {
    if (activeLiveBooking) {
      setChatList(store.getChatMessages(activeLiveBooking.id));
    }
  }, [activeLiveBooking]);

  // Session Stopwatch effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isSessionTimerRunning) {
      interval = setInterval(() => {
        setSessionSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionTimerRunning]);

  // Ranked Trainers calculation via Matching Engine
  const rankedTrainers = rankTrainersForCustomer(trainers, {
    vehicleCategory: category,
    transmission,
    customerLat: selectedAddress.lat,
    customerLng: selectedAddress.lng,
    genderPreference: genderPref,
    requiredSkills: selectedGoals,
    preferredSlot: selectedSlot,
    isEv: fuelType === 'EV'
  }).filter(st => {
    if (genderFilter === 'FEMALE') return st.trainer.gender === 'FEMALE';
    if (genderFilter === 'MALE') return st.trainer.gender === 'MALE';
    return true;
  });

  // Dynamic Price Breakdown
  const priceBreakdown = calculateDynamicPrice({
    vehicleCategory: category,
    durationMinutes: selectedDuration,
    trainerBaseRate: selectedTrainer?.baseHourlyRate,
    isPeakHour: selectedSlot.includes('07:00 PM') || selectedSlot.includes('08:00 AM'),
    isWeekend: selectedDate.includes('Sat') || selectedDate.includes('Sun'),
    coupon: appliedCoupon,
    pricingConfig
  });

  const handleGoalToggle = (goal: TrainingGoal) => {
    sound.playTap();
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleApplyCoupon = (code: string) => {
    sound.playTap();
    const found = store.getCoupons().find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (found) {
      setAppliedCoupon(found);
      sound.playSuccess();
    } else {
      alert('Invalid coupon code.');
    }
  };

  const handleConfirmAndPay = () => {
    sound.playSuccess();
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `DS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'cust-mahesh-1',
      customerName: 'Mahesh Sharma',
      customerPhone: '+91 98860 41209',
      trainerId: selectedTrainer?.id,
      trainerName: selectedTrainer?.name,
      trainerPhone: selectedTrainer?.phone,
      trainerAvatar: selectedTrainer?.avatar,
      trainerGender: selectedTrainer?.gender,
      vehicleCategory: category,
      vehicleDetails: {
        hasOwnVehicle,
        brand: selectedBrand,
        model: selectedModel,
        transmission,
        fuelType
      },
      experienceLevel,
      goals: selectedGoals,
      address: selectedAddress,
      date: selectedDate,
      timeSlot: selectedSlot,
      durationMinutes: selectedDuration,
      genderPreference: genderPref,
      status: 'CONFIRMED',
      pricing: {
        baseAmount: priceBreakdown.baseAmount,
        peakMultiplier: 1.0,
        platformFee: priceBreakdown.platformFee,
        taxesGst: priceBreakdown.taxesGst,
        discountAmount: priceBreakdown.discountAmount,
        couponCode: priceBreakdown.couponCode,
        totalAmount: priceBreakdown.totalAmountPayable,
        trainerEarnings: priceBreakdown.trainerEarnings,
        platformCommission: priceBreakdown.platformCommission
      },
      payment: {
        method: paymentMethod,
        transactionId: `TXN-${Date.now()}`,
        status: 'PAID',
        paidAt: new Date().toISOString()
      },
      sessionTracking: {
        sharedWithContact: {
          name: 'Anita Sharma (Spouse)',
          phone: '+91 98860 41210'
        }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveBooking(newBooking);
    setActiveLiveBooking(newBooking);
    setBookingStep(8); // Confirmation
    store.addWalletTransaction(100, 'DrivePoints Earned for Session Booking', 'CREDIT', 'DRIVE_POINTS_REWARD');
  };

  const handleStartSession = (bk: Booking) => {
    sound.playTap();
    const updated: Booking = {
      ...bk,
      status: 'SESSION_STARTED',
      sessionTracking: {
        ...bk.sessionTracking,
        startedAt: new Date().toISOString()
      }
    };
    store.saveBooking(updated);
    setActiveLiveBooking(updated);
    setIsSessionTimerRunning(true);
  };

  const handleEndSession = (bk: Booking) => {
    sound.playSuccess();
    setIsSessionTimerRunning(false);

    const aiReport = generateAICoachFeedback(
      bk.goals,
      'Mahesh drove very calmly through Indiranagar 100ft road. Reverse parking into 45-degree angle showed 85% accuracy. Needs one more drill on bumper gap judgement.',
      bk.experienceLevel,
      bk.vehicleCategory
    );
    setCompletedAiReport(aiReport);

    const updated: Booking = {
      ...bk,
      status: 'RATING_PENDING',
      sessionTracking: {
        ...bk.sessionTracking,
        completedAt: new Date().toISOString(),
        actualDurationSeconds: sessionSeconds,
        practicedSkills: bk.goals,
        trainerNotes: 'Great road awareness and smooth steering. Mastered 2nd and 3rd gear shifting.',
        aiProgressFeedback: aiReport.coachInsights,
        aiNextRecommendation: aiReport.nextRecommendedPackageOrSession
      }
    };
    store.saveBooking(updated);
    setActiveLiveBooking(updated);
    setShowRatingModal(true);
  };

  const handleSendChat = () => {
    if (!chatMessageText.trim() || !activeLiveBooking) return;
    sound.playTap();
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId: activeLiveBooking.id,
      senderRole: 'CUSTOMER',
      senderName: 'Mahesh',
      text: chatMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    store.sendChatMessage(newMsg);
    setChatList([...chatList, newMsg]);
    setChatMessageText('');
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const carBrands = ['Maruti Suzuki', 'Hyundai', 'Tata Motors', 'Mahindra', 'Toyota', 'Honda', 'Kia', 'Volkswagen', 'Skoda', 'MG', 'BMW'];
  const bikeBrands = ['Royal Enfield', 'TVS', 'Honda', 'Bajaj', 'Yamaha', 'Ather Energy', 'Ola Electric'];

  return (
    <div className={`bg-canvas ${isMobileFrame ? 'min-h-full pb-16' : 'min-h-[calc(100vh-64px)] pb-24'} font-sans flex flex-col justify-between`}>
      <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 pt-2 sm:pt-6">

        {/* Desktop Top Sub-Navbar (Hidden when in Mobile Simulator Frame or small mobile screens) */}
        {!isMobileFrame && (
          <div className="hidden sm:flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/90 items-center justify-between mb-6 text-xs font-bold text-slate-600">
            <button
              onClick={() => { sound.playTap(); setActiveTab('home'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'home' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => { sound.playTap(); setActiveTab('book'); setBookingStep(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'book' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Book Mentor</span>
            </button>

            <button
              onClick={() => { sound.playTap(); setActiveTab('bookings'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'bookings' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>My Sessions</span>
            </button>

            <button
              onClick={() => { sound.playTap(); setActiveTab('packages'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'packages' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Packages</span>
            </button>

            <button
              onClick={() => { sound.playTap(); setActiveTab('messages'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'messages' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => { sound.playTap(); setActiveTab('profile'); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                activeTab === 'profile' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile (₹{wallet.balance})</span>
            </button>
          </div>
        )}

        {/* ----------------- TAB 1: CUSTOMER HOME ----------------- */}
        {activeTab === 'home' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header greeting */}
            <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-brand-200 text-[10px] sm:text-xs font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>Doorstep Mentorship • {selectedCity.name}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Good morning, Mahesh 👋
                </h2>
                <p className="text-[11px] sm:text-xs text-brand-100 max-w-sm">
                  Practice in your own car or bike with verified, patient mentors.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => { sound.playTap(); setActiveTab('book'); setCategory('CAR'); setBookingStep(1); }}
                    className="px-3.5 py-2 bg-white hover:bg-brand-50 text-brand-900 font-extrabold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <span>Book Mentor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <div className="px-2.5 py-1.5 rounded-xl bg-white/10 text-[10px] text-amber-300 font-bold">
                    {wallet.drivePoints} DrivePoints
                  </div>
                </div>
              </div>
            </div>

            {/* Active Upcoming Session Card */}
            {activeLiveBooking && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-500">
                      Next Doorstep Practice
                    </span>
                  </div>
                  <StatusBadge status={activeLiveBooking.status} />
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={activeLiveBooking.trainerAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'}
                    alt="Trainer"
                    className="w-12 h-12 rounded-xl object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1 truncate">
                      <span>{activeLiveBooking.trainerName || 'Priya Sharma'}</span>
                      <VerifiedBadge size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {activeLiveBooking.vehicleDetails.brand} {activeLiveBooking.vehicleDetails.model} ({activeLiveBooking.vehicleDetails.transmission})
                    </div>
                    <div className="text-[11px] text-brand-600 font-bold mt-0.5">
                      📅 {activeLiveBooking.date} @ {activeLiveBooking.timeSlot}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleStartSession(activeLiveBooking)}
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition text-center"
                  >
                    Start Session
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setActiveTab('messages'); }}
                    className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center"
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}

            {/* Categories List (Clean Vertical Full-Width on Mobile) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm text-slate-900">What do you want to learn?</h3>
                <span className="text-[11px] text-brand-600 font-bold cursor-pointer" onClick={() => setActiveTab('book')}>
                  View all →
                </span>
              </div>

              <div className={`space-y-2 ${isMobileFrame ? '' : 'sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0'}`}>
                {[
                  { id: 'CAR', title: 'Car Driving Practice', sub: 'Manual, Automatic & EV. Beginner to pro.', emoji: '🚗', rate: '₹599/hr' },
                  { id: 'MOTORCYCLE', title: 'Bike & Gear Riding', sub: 'Clutch friction zone & balance.', emoji: '🏍️', rate: '₹499/hr' },
                  { id: 'SCOOTER', title: 'Automatic Scooter', sub: 'Activa, Jupiter & EV balance.', emoji: '🛵', rate: '₹499/hr' },
                  { id: 'REFRESHER_CAR', title: 'Parking & Refresher', sub: 'Reverse, parallel & highway boost.', emoji: '🅿️', rate: '₹599/hr' }
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => { sound.playTap(); setCategory(item.id as VehicleCategory); setBookingStep(1); setActiveTab('book'); }}
                    className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-400 transition cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{item.sub}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-brand-600 whitespace-nowrap bg-brand-50 px-2 py-1 rounded-lg">
                      {item.rate}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: STEP-BY-STEP BOOKING FLOW ----------------- */}
        {activeTab === 'book' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 animate-fade-in">

            {/* Mobile Step Header */}
            <div className="space-y-1.5 pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Step {bookingStep} of 7</span>
                <span className="text-brand-600 font-extrabold">
                  {bookingStep === 1 && 'Vehicle Category'}
                  {bookingStep === 2 && 'Vehicle Model'}
                  {bookingStep === 3 && 'Experience & Goals'}
                  {bookingStep === 4 && 'Location & Preference'}
                  {bookingStep === 5 && 'Mentor Matches'}
                  {bookingStep === 6 && 'Profile & Time Slot'}
                  {bookingStep === 7 && 'Summary & Pay'}
                  {bookingStep === 8 && 'Confirmed! 🎉'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${(bookingStep / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* STEP 1: CHOOSE VEHICLE CATEGORY (Clean Spacious Vertical Cards) */}
            {bookingStep === 1 && (
              <div className="space-y-3 animate-fade-in">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">What do you want to learn?</h3>
                  <p className="text-[11px] text-slate-500">Select your vehicle category for 1-on-1 doorstep practice.</p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'CAR', label: 'Car Driving', sub: 'Manual, Automatic (AT/CVT/DCT), EV', emoji: '🚗', rate: '₹599 / hr' },
                    { id: 'MOTORCYCLE', label: 'Motorcycle & Gear Bike', sub: 'Royal Enfield, Apache, Pulsar', emoji: '🏍️', rate: '₹499 / hr' },
                    { id: 'SCOOTER', label: 'Automatic Scooter', sub: 'Activa, Jupiter, Ather, Ola EV', emoji: '🛵', rate: '₹499 / hr' },
                    { id: 'REFRESHER_CAR', label: 'Refresher / Parking Focus', sub: 'Reverse, parallel, highway boost', emoji: '🚙', rate: '₹599 / hr' }
                  ].map(c => (
                    <div
                      key={c.id}
                      onClick={() => { sound.playTap(); setCategory(c.id as VehicleCategory); }}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-center justify-between gap-3 ${
                        category === c.id
                          ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-3xl flex-shrink-0">{c.emoji}</span>
                        <div className="min-w-0">
                          <h4 className="font-black text-xs text-slate-900 truncate">{c.label}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{c.sub}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] font-black text-brand-600 bg-white px-2 py-1 rounded-lg border border-brand-200">
                          {c.rate}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${category === c.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
                          {category === c.id && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => { sound.playTap(); setBookingStep(2); }}
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Next: Vehicle Model</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: EXACT VEHICLE DETAILS */}
            {bookingStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">Tell us about your vehicle</h3>
                    <p className="text-[11px] text-slate-500">We pair you with a trainer experienced in your exact model.</p>
                  </div>
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-0.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                </div>

                {/* Own Vehicle Toggle */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-800 block truncate">Using your own vehicle?</span>
                    <span className="text-[10px] text-slate-500 block truncate">Builds 3x faster muscle memory.</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setHasOwnVehicle(true)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        hasOwnVehicle ? 'bg-brand-500 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      Yes, Mine
                    </button>
                    <button
                      onClick={() => setHasOwnVehicle(false)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        !hasOwnVehicle ? 'bg-brand-500 text-white' : 'bg-white border text-slate-700'
                      }`}
                    >
                      Need Trainer Car
                    </button>
                  </div>
                </div>

                {/* Brand selection horizontal scroller */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Select Brand</label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {(category === 'CAR' || category === 'REFRESHER_CAR' ? carBrands : bikeBrands).map(b => (
                      <button
                        key={b}
                        onClick={() => { sound.playTap(); setSelectedBrand(b); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                          selectedBrand === b
                            ? 'bg-slate-900 text-white shadow'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model and Transmission */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Model Name</label>
                    <input
                      type="text"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      placeholder="e.g. Creta, Swift, Nexon, Classic 350"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Transmission Type</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as TransmissionType)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-brand-500 bg-white"
                    >
                      <option value="AUTOMATIC">Automatic (AT / DCT / CVT)</option>
                      <option value="MANUAL">Manual (Clutch & Gear)</option>
                      <option value="AMT">AMT (Automated Manual)</option>
                      <option value="EV">Electric Vehicle (EV Single Pedal)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setBookingStep(3); }}
                    className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Experience & Goals</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EXPERIENCE LEVEL & GOAL CHECKLIST */}
            {bookingStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Experience & Practice Goals</h3>
                  <p className="text-[11px] text-slate-500">Pick your level and skills you want to master.</p>
                </div>

                {/* Experience selector */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">How comfortable are you?</label>
                  {[
                    { id: 'ABSOLUTE_BEGINNER', title: "I'm starting from zero", desc: 'Never driven before.' },
                    { id: 'LEARNERS_LICENCE', title: 'I know the basics', desc: 'Can start and move but need practice.' },
                    { id: 'HAS_LICENCE_NEEDS_PRACTICE', title: 'I have licence, need confidence', desc: 'Family members get impatient teaching.' },
                    { id: 'LONG_GAP_REFRESHER', title: "Haven't driven in years", desc: 'Need a calm refresher on real roads.' }
                  ].map(exp => (
                    <div
                      key={exp.id}
                      onClick={() => { sound.playTap(); setExperienceLevel(exp.id as ExperienceLevel); }}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        experienceLevel === exp.id
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{exp.title}</div>
                        <div className="text-[10px] text-slate-500">{exp.desc}</div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${experienceLevel === exp.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
                        {experienceLevel === exp.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Goals checklist */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Select target skills ({selectedGoals.length} selected)
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'STARTING_STOPPING', label: 'Starting & Braking' },
                      { id: 'CLUTCH_CONTROL', label: 'Clutch Control' },
                      { id: 'STEERING_LANE_DISCIPLINE', label: 'Steering & Lane' },
                      { id: 'U_TURNS_TIGHT_TURNS', label: 'U-Turns & Corners' },
                      { id: 'REVERSE_DRIVING', label: 'Reverse Driving' },
                      { id: 'PARALLEL_PARKING', label: 'Parallel Parking' },
                      { id: 'ANGULAR_PERPENDICULAR_PARKING', label: 'Basement Parking' },
                      { id: 'CITY_HEAVY_TRAFFIC', label: 'Heavy City Traffic' },
                      { id: 'HILL_START_INCLINE', label: 'Flyover & Slopes' },
                      { id: 'HIGHWAY_LANE_MERGE', label: 'Highway Speeds' }
                    ].map(g => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleGoalToggle(g.id as TrainingGoal)}
                        className={`p-2 rounded-xl text-left text-[11px] font-semibold border flex items-center justify-between transition ${
                          selectedGoals.includes(g.id as TrainingGoal)
                            ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{g.label}</span>
                        {selectedGoals.includes(g.id as TrainingGoal) && <Check className="w-3 h-3 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setBookingStep(2)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setBookingStep(4); }}
                    className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Next: Location & Gender</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION & GENDER PREFERENCE */}
            {bookingStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Pickup & Comfort Preference</h3>
                  <p className="text-[11px] text-slate-500">Doorstep location and trainer comfort preferences.</p>
                </div>

                {/* Address selection */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">Practice Address</label>
                  {store.getSavedAddresses().map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => { sound.playTap(); setSelectedAddress(addr); }}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                        selectedAddress.id === addr.id
                          ? 'border-brand-500 bg-brand-50/50 shadow-sm ring-1 ring-brand-500'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate">{addr.title} ({addr.area})</div>
                          <div className="text-[10px] text-slate-500 truncate">{addr.fullAddress}</div>
                        </div>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedAddress.id === addr.id ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300'}`}>
                        {selectedAddress.id === addr.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Gender preference cards */}
                <div className="space-y-2 pt-1">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Who would you feel most comfortable learning with?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'FEMALE', label: 'Female Mentor', emoji: '👩' },
                      { id: 'MALE', label: 'Male Mentor', emoji: '👨' },
                      { id: 'NO_PREFERENCE', label: 'No Preference', emoji: '✨' }
                    ].map(pref => (
                      <div
                        key={pref.id}
                        onClick={() => { sound.playTap(); setGenderPref(pref.id as GenderPreference); }}
                        className={`p-3 rounded-2xl border-2 transition cursor-pointer text-center ${
                          genderPref === pref.id
                            ? 'border-brand-500 bg-brand-50/60 shadow-md ring-1 ring-brand-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-0.5">{pref.emoji}</div>
                        <div className="font-extrabold text-[11px] text-slate-900 leading-tight">{pref.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setBookingStep(3)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setBookingStep(5); }}
                    className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Match Mentors</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: MATCHING ENGINE RESULTS */}
            {bookingStep === 5 && (
              <div className="space-y-3.5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">Best Matches for You</h3>
                    <p className="text-[10px] text-slate-500">Matched for {selectedModel} in {selectedAddress.area}</p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-bold text-slate-600">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-2.5 py-1 rounded-md transition ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                    >
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-2.5 py-1 rounded-md transition ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                    >
                      Radar
                    </button>
                  </div>
                </div>

                {viewMode === 'map' && (
                  <InteractiveMap
                    centerAddress={selectedAddress}
                    trainers={rankedTrainers.map(st => st.trainer)}
                    selectedTrainerId={selectedTrainer?.id}
                    onSelectTrainer={(tr) => {
                      setSelectedTrainer(tr);
                      setBookingStep(6);
                    }}
                    heightClass="h-56 sm:h-72"
                  />
                )}

                {/* Trainer cards list */}
                <div className="space-y-2.5">
                  {rankedTrainers.map(match => {
                    const tr = match.trainer;
                    return (
                      <div
                        key={tr.id}
                        className="bg-canvas rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img src={tr.avatar} alt={tr.name} className="w-11 h-11 rounded-xl object-cover shadow-sm flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1 truncate">
                                <span>{tr.name}</span>
                                <VerifiedBadge size="sm" />
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                <StarRating rating={tr.rating} count={tr.reviewCount} />
                                <span>•</span>
                                <span>{match.distanceKm} km</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <span className="font-black text-xs text-slate-900 block">₹{tr.baseHourlyRate} <span className="font-normal text-[10px] text-slate-400">/ 60m</span></span>
                            <button
                              onClick={() => {
                                sound.playTap();
                                setSelectedTrainer(tr);
                                setBookingStep(6);
                              }}
                              className="mt-1 px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-[11px] rounded-lg shadow-sm"
                            >
                              Book
                            </button>
                          </div>
                        </div>

                        {/* Match reasons */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {match.matchReasons.map((reason, idx) => (
                            <span key={idx} className="text-[9px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-bold">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setBookingStep(4)}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Back to Location
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: TRAINER PROFILE & AVAILABILITY SLOTS */}
            {bookingStep === 6 && selectedTrainer && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setBookingStep(5)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-0.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Mentors
                  </button>
                  <VerifiedBadge size="sm" text="Police Verified" />
                </div>

                {/* Trainer Card Header */}
                <div className="bg-canvas rounded-2xl p-3.5 border border-slate-200 flex items-center gap-3">
                  <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-14 h-14 rounded-xl object-cover shadow flex-shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-black text-xs text-slate-900 truncate">{selectedTrainer.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600 font-semibold mt-0.5">
                      <StarRating rating={selectedTrainer.rating} count={selectedTrainer.reviewCount} />
                      <span>•</span>
                      <span>{selectedTrainer.yearsExperience} yrs exp</span>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{selectedTrainer.bio}</p>
                  </div>
                </div>

                {/* Duration Pills */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Session Duration</label>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { mins: 30, price: Math.round(selectedTrainer.baseHourlyRate * 0.5) },
                      { mins: 60, price: selectedTrainer.baseHourlyRate, popular: true },
                      { mins: 90, price: Math.round(selectedTrainer.baseHourlyRate * 1.5) },
                      { mins: 120, price: Math.round(selectedTrainer.baseHourlyRate * 2) }
                    ].map(dur => (
                      <button
                        key={dur.mins}
                        onClick={() => { sound.playTap(); setSelectedDuration(dur.mins); }}
                        className={`p-2 rounded-xl border transition ${
                          selectedDuration === dur.mins
                            ? 'border-brand-500 bg-brand-50/60 shadow-sm ring-1 ring-brand-500'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-extrabold text-xs text-slate-900">{dur.mins}m</div>
                        <div className="text-[10px] font-bold text-brand-600">₹{dur.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">Choose Date & Time</label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {['Today', 'Tomorrow', 'Saturday, 10 Oct', 'Sunday, 11 Oct'].map(d => (
                      <button
                        key={d}
                        onClick={() => { sound.playTap(); setSelectedDate(d); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                          selectedDate === d ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {selectedTrainer.availability.slots.slice(0, 6).map(s => (
                      <button
                        key={s}
                        onClick={() => { sound.playTap(); setSelectedSlot(s); }}
                        className={`p-2 rounded-xl text-[11px] font-bold border text-center transition ${
                          selectedSlot === s
                            ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setBookingStep(5)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setBookingStep(7); }}
                    className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: SUMMARY & PAYMENT */}
            {bookingStep === 7 && selectedTrainer && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Session Checkout</h3>
                  <p className="text-[11px] text-slate-500">Review and confirm your doorstep session.</p>
                </div>

                <div className="bg-canvas rounded-2xl p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200">
                    <img src={selectedTrainer.avatar} alt={selectedTrainer.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">{selectedTrainer.name}</div>
                      <div className="text-[10px] text-slate-500">Scheduled: {selectedDate} @ {selectedSlot} ({selectedDuration}m)</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <span className="font-bold">{selectedBrand} {selectedModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-bold">{selectedAddress.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Session Fee:</span>
                      <span>₹{priceBreakdown.rawSessionAmount}</span>
                    </div>
                    {priceBreakdown.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Coupon Discount:</span>
                        <span>- ₹{priceBreakdown.discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>GST (18%) + Platform Fee:</span>
                      <span>₹{Math.round(priceBreakdown.taxesGst + priceBreakdown.platformFee)}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-black text-slate-900">
                    <span className="text-xs">Total Payable:</span>
                    <span className="text-xl text-brand-600">₹{priceBreakdown.totalAmountPayable}</span>
                  </div>
                </div>

                {/* Payment method */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-700">Payment Option</label>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        paymentMethod === 'UPI' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200'
                      }`}
                    >
                      ⚡ UPI
                    </button>
                    <button
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        paymentMethod === 'CREDIT_CARD' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200'
                      }`}
                    >
                      💳 Card
                    </button>
                    <button
                      onClick={() => setPaymentMethod('WALLET')}
                      className={`p-2 rounded-xl border text-xs font-bold transition ${
                        paymentMethod === 'WALLET' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200'
                      }`}
                    >
                      👛 Wallet (₹{wallet.balance})
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleConfirmAndPay}
                  className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Pay ₹{priceBreakdown.totalAmountPayable} & Confirm Booking</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 8: CONFIRMED CELEBRATION */}
            {bookingStep === 8 && (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow">
                  🎉
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">You're Booked!</h3>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto mt-0.5">
                    {selectedTrainer?.name} will meet you on <strong>{selectedDate} at {selectedSlot}</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs max-w-xs mx-auto space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking Ref:</span>
                    <span className="font-mono font-bold">DS-2026-4296</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reward:</span>
                    <span className="font-bold text-emerald-600">+100 DrivePoints</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center pt-2">
                  <button
                    onClick={() => { sound.playTap(); setActiveTab('bookings'); }}
                    className="px-5 py-2.5 bg-brand-500 text-white font-bold text-xs rounded-xl shadow"
                  >
                    View in My Sessions
                  </button>
                  <button
                    onClick={() => { sound.playTap(); setActiveTab('home'); }}
                    className="px-4 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl"
                  >
                    Home
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ----------------- TAB 3: MY SESSIONS ----------------- */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900">My Practice Sessions</h3>
              <button
                onClick={() => { sound.playTap(); setActiveTab('book'); setBookingStep(1); }}
                className="px-3 py-1.5 bg-brand-500 text-white font-bold text-xs rounded-xl shadow"
              >
                + Book New
              </button>
            </div>

            {/* Live Stopwatch Cockpit if session active */}
            {activeLiveBooking && activeLiveBooking.status === 'SESSION_STARTED' && (
              <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-700 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Session
                  </span>
                  <button
                    onClick={() => { sound.playSosAlert(); setShowSosModal(true); }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] rounded-full shadow"
                  >
                    🚨 SOS Help
                  </button>
                </div>

                <div className="text-center py-2 bg-slate-950/80 rounded-xl border border-slate-800">
                  <div className="text-3xl font-mono font-black text-white">{formatSeconds(sessionSeconds)}</div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Mentor: {activeLiveBooking.trainerName}</p>
                </div>

                <button
                  onClick={() => handleEndSession(activeLiveBooking)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
                >
                  Complete Session & View AI Report
                </button>
              </div>
            )}

            {/* Bookings items */}
            <div className="space-y-2.5">
              {bookings.map(bk => (
                <div key={bk.id} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] text-slate-500">{bk.bookingNumber}</span>
                    <StatusBadge status={bk.status} />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 truncate">{bk.trainerName || 'Priya Sharma'}</div>
                      <div className="text-[10px] text-slate-500">{bk.vehicleDetails.brand} {bk.vehicleDetails.model} • {bk.date} @ {bk.timeSlot}</div>
                    </div>
                    <span className="font-black text-xs text-slate-900 flex-shrink-0">₹{bk.pricing.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: PACKAGES ----------------- */}
        {activeTab === 'packages' && (
          <div className="space-y-3.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900">Multi-Session Programs</h3>
            <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
              {store.getPackages().map(pkg => (
                <div key={pkg.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-2">
                  <div>
                    {pkg.badge && (
                      <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[9px] font-bold inline-block mb-1">
                        {pkg.badge}
                      </span>
                    )}
                    <h4 className="font-black text-xs text-slate-900">{pkg.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{pkg.tagline}</p>
                    <div className="my-2 font-black text-sm text-slate-900">
                      ₹{pkg.price} <span className="text-[10px] font-normal text-slate-400 line-through">₹{pkg.originalPrice}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { sound.playTap(); setCategory(pkg.vehicleCategory); setBookingStep(1); setActiveTab('book'); }}
                    className="w-full py-2 bg-brand-500 text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Enroll in Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: CHAT ----------------- */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[480px]">
            <div className="bg-slate-900 p-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80" alt="Priya" className="w-8 h-8 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-xs">Priya Sharma</div>
                  <div className="text-[9px] text-emerald-400">Online • Mentor</div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-50">
              {chatList.map(m => (
                <div key={m.id} className={`flex flex-col ${m.senderRole === 'CUSTOMER' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-2.5 rounded-2xl text-xs ${m.senderRole === 'CUSTOMER' ? 'bg-brand-500 text-white rounded-br-none' : 'bg-white text-slate-900 border rounded-bl-none'}`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">{m.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatMessageText}
                onChange={(e) => setChatMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Message your mentor..."
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
              />
              <button onClick={handleSendChat} className="p-2 bg-brand-500 text-white rounded-xl shadow">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ----------------- TAB 6: PROFILE & WALLET ----------------- */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-500 text-white font-black text-lg flex items-center justify-center">
                  MS
                </div>
                <div>
                  <h3 className="font-black text-xs text-slate-900">Mahesh Sharma</h3>
                  <p className="text-[10px] text-slate-500">+91 98860 41209</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Wallet</span>
                <span className="font-black text-base text-slate-900">₹{wallet.balance}</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs">Invite a Friend, Get ₹200</h4>
                <p className="text-[10px] text-brand-100">Both get ₹200 wallet credit!</p>
              </div>
              <button
                onClick={() => {
                  sound.playSuccess();
                  alert('Referral link copied: https://drivesaathi.in/invite?code=MAHESH200');
                }}
                className="px-3 py-1.5 bg-white text-brand-900 font-bold text-xs rounded-xl shadow"
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- NATIVE MOBILE BOTTOM NAVIGATION BAR ----------------- */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-sheet">
        <button
          onClick={() => { sound.playTap(); setActiveTab('home'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'home' ? 'text-brand-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Car className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => { sound.playTap(); setActiveTab('book'); setBookingStep(1); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'book' ? 'text-brand-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Book</span>
        </button>

        <button
          onClick={() => { sound.playTap(); setActiveTab('bookings'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition relative ${
            activeTab === 'bookings' ? 'text-brand-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Sessions</span>
          {bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'SESSION_STARTED').length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        <button
          onClick={() => { sound.playTap(); setActiveTab('messages'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'messages' ? 'text-brand-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Chat</span>
        </button>

        <button
          onClick={() => { sound.playTap(); setActiveTab('profile'); }}
          className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition ${
            activeTab === 'profile' ? 'text-brand-600 font-extrabold' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>

      {/* SOS Modal */}
      <SosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
        activeBooking={activeLiveBooking}
      />
    </div>
  );
};
