import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Navigation, 
  Award, 
  ShieldCheck, 
  User, 
  Star, 
  FileText, 
  Play, 
  Square, 
  Check, 
  X, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  CreditCard,
  Phone,
  AlertCircle
} from 'lucide-react';
import { Trainer, Booking, TrainingGoal } from '../../types';
import { store } from '../../services/storage';
import { sound } from '../../services/sound';
import { generateAICoachFeedback, AIAnalysisResult } from '../../services/aiCoach';
import { StarRating, VerifiedBadge, StatusBadge } from '../../components/common/Badge';

export const TrainerPortal: React.FC = () => {
  const trainers = store.getTrainers();
  const currentTrainer = trainers[0]; // Priya Sharma

  const [activeTab, setActiveTab] = useState<'schedule' | 'earnings' | 'availability' | 'profile'>('schedule');
  const [bookings, setBookings] = useState<Booking[]>(store.getBookings());
  
  // Pending incoming booking request simulation
  const [incomingRequest, setIncomingRequest] = useState<{
    id: string;
    customerName: string;
    customerPhone: string;
    vehicle: string;
    experience: string;
    goals: string[];
    distanceKm: number;
    time: string;
    earnings: number;
    expiresInSeconds: number;
  } | null>({
    id: 'req-live-1',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 99880 12345',
    vehicle: 'Tata Nexon EV (Automatic)',
    experience: 'Beginner • Needs Confidence',
    goals: ['Parallel Parking', 'Heavy Traffic & Flyover'],
    distanceKm: 2.8,
    time: 'Today, 04:30 PM',
    earnings: 560,
    expiresInSeconds: 45
  });

  // Active session state
  const [activeBooking, setActiveBooking] = useState<Booking | null>(bookings[0] || null);
  const [sessionNotesInput, setSessionNotesInput] = useState<string>('Customer struggles with reverse parking into tight bays, but lane discipline was very solid.');
  const [selectedPracticedSkills, setSelectedPracticedSkills] = useState<TrainingGoal[]>([
    'PARALLEL_PARKING', 
    'CITY_HEAVY_TRAFFIC', 
    'REVERSE_DRIVING'
  ]);
  const [aiReportGenerated, setAiReportGenerated] = useState<AIAnalysisResult | null>(null);

  // Availability state
  const [weeklyAvailability, setWeeklyAvailability] = useState<Record<string, string[]>>({
    Monday: ['07:00 AM', '08:30 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Tuesday: ['07:00 AM', '08:30 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Wednesday: ['07:00 AM', '08:30 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Thursday: ['07:00 AM', '08:30 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Friday: ['07:00 AM', '08:30 AM', '10:00 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Saturday: ['06:30 AM', '08:00 AM', '09:30 AM', '04:00 PM', '05:30 PM', '07:00 PM'],
    Sunday: ['06:30 AM', '08:00 AM', '09:30 AM', '04:00 PM']
  });

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setBookings(store.getBookings());
    });
    return unsub;
  }, []);

  const handleAcceptRequest = () => {
    sound.playSuccess();
    if (!incomingRequest) return;

    const acceptedBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `DS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'cust-ananya-2',
      customerName: incomingRequest.customerName,
      customerPhone: incomingRequest.customerPhone,
      trainerId: currentTrainer.id,
      trainerName: currentTrainer.name,
      trainerPhone: currentTrainer.phone,
      trainerAvatar: currentTrainer.avatar,
      trainerGender: currentTrainer.gender,
      vehicleCategory: 'CAR',
      vehicleDetails: {
        hasOwnVehicle: true,
        brand: 'Tata',
        model: 'Nexon EV',
        transmission: 'EV',
        fuelType: 'EV'
      },
      experienceLevel: 'ABSOLUTE_BEGINNER',
      goals: ['PARALLEL_PARKING', 'CITY_HEAVY_TRAFFIC'],
      address: {
        id: 'addr-ananya',
        title: 'Home',
        fullAddress: 'Flat 302, Palm Meadows, Whitefield',
        area: 'Whitefield',
        city: 'Bengaluru',
        pincode: '560066',
        locationType: 'CUSTOMER_HOME',
        lat: 12.9698,
        lng: 77.7499
      },
      date: 'Today',
      timeSlot: '04:30 PM',
      durationMinutes: 60,
      genderPreference: 'FEMALE',
      status: 'TRAINER_ACCEPTED',
      pricing: {
        baseAmount: 699,
        peakMultiplier: 1.0,
        platformFee: 30,
        taxesGst: 131.22,
        discountAmount: 0,
        totalAmount: 860,
        trainerEarnings: 560,
        platformCommission: 168.78
      },
      payment: {
        method: 'UPI',
        transactionId: `TXN-${Date.now()}`,
        status: 'PAID'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    store.saveBooking(acceptedBooking);
    setActiveBooking(acceptedBooking);
    setIncomingRequest(null);
    alert('Booking Accepted! Customer has been notified.');
  };

  const handleDeclineRequest = () => {
    sound.playTap();
    setIncomingRequest(null);
  };

  const handleUpdateStatus = (bk: Booking, nextStatus: Booking['status']) => {
    sound.playTap();
    const updated: Booking = { ...bk, status: nextStatus, updatedAt: new Date().toISOString() };
    store.saveBooking(updated);
    setActiveBooking(updated);
  };

  const handleGenerateAiNotes = () => {
    sound.playSuccess();
    const report = generateAICoachFeedback(
      selectedPracticedSkills,
      sessionNotesInput,
      activeBooking?.experienceLevel || 'HAS_LICENCE_NEEDS_PRACTICE',
      activeBooking?.vehicleCategory || 'CAR'
    );
    setAiReportGenerated(report);
  };

  const handleCopyMondayToWeekdays = () => {
    sound.playSuccess();
    const mondaySlots = weeklyAvailability.Monday;
    setWeeklyAvailability({
      ...weeklyAvailability,
      Tuesday: [...mondaySlots],
      Wednesday: [...mondaySlots],
      Thursday: [...mondaySlots],
      Friday: [...mondaySlots]
    });
    alert('Monday availability replicated across all weekdays!');
  };

  const toggleSlot = (day: string, slot: string) => {
    sound.playTap();
    const current = weeklyAvailability[day] || [];
    if (current.includes(slot)) {
      setWeeklyAvailability({
        ...weeklyAvailability,
        [day]: current.filter(s => s !== slot)
      });
    } else {
      setWeeklyAvailability({
        ...weeklyAvailability,
        [day]: [...current, slot].sort()
      });
    }
  };

  return (
    <div className="bg-canvas min-h-[calc(100vh-64px)] pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Top Trainer Header Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={currentTrainer.avatar}
              alt={currentTrainer.name}
              className="w-16 h-16 rounded-2xl object-cover shadow border-2 border-brand-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{currentTrainer.name}</h2>
                <VerifiedBadge size="sm" text="Verified Mentor" />
              </div>
              <p className="text-xs text-slate-500">
                {currentTrainer.city} • {currentTrainer.yearsExperience} yrs exp • {currentTrainer.languages.join(', ')}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={currentTrainer.rating} count={currentTrainer.reviewCount} />
                <span className="text-slate-300">•</span>
                <span className="text-xs font-bold text-emerald-600">
                  {currentTrainer.totalSessions} Sessions Delivered
                </span>
              </div>
            </div>
          </div>

          {/* Quick Earnings Widget */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-right">
              <div className="text-[10px] font-bold uppercase text-emerald-700">Today's Earnings</div>
              <div className="text-2xl font-black text-emerald-700">₹2,450</div>
              <div className="text-[10px] text-emerald-600">4 sessions scheduled</div>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/90 flex items-center justify-between mb-6 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => { sound.playTap(); setActiveTab('schedule'); }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition ${
              activeTab === 'schedule' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Today's Sessions</span>
            {incomingRequest && <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>}
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveTab('earnings'); }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition ${
              activeTab === 'earnings' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Earnings & Payouts (₹58.4k)</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveTab('availability'); }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition ${
              activeTab === 'availability' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Availability Calendar</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveTab('profile'); }}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl transition ${
              activeTab === 'profile' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>KYC & Credentials</span>
          </button>
        </div>

        {/* ----------------- TAB 1: SCHEDULE & LIVE SESSIONS ----------------- */}
        {activeTab === 'schedule' && (
          <div className="space-y-6 max-w-4xl mx-auto">

            {/* LIVE INCOMING BOOKING REQUEST BANNER */}
            {incomingRequest && (
              <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-2xl border-2 border-brand-400/50 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping"></span>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                      NEW DOORSTEP SESSION REQUEST (Expires in {incomingRequest.expiresInSeconds}s)
                    </span>
                  </div>
                  <span className="text-xl font-black text-emerald-400">
                    +₹{incomingRequest.earnings} Net
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-xs">
                  <div>
                    <div className="font-extrabold text-sm text-white">{incomingRequest.customerName}</div>
                    <div className="text-brand-200 mt-0.5">{incomingRequest.vehicle}</div>
                    <div className="text-slate-300 mt-1">📍 {incomingRequest.distanceKm} km away (Whitefield)</div>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-300">Target Skills:</div>
                    <div className="text-white font-medium">{incomingRequest.goals.join(' • ')}</div>
                    <div className="text-amber-300 font-bold mt-1">Slot: {incomingRequest.time}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={handleDeclineRequest}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleAcceptRequest}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs shadow-lg transition flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept & Lock Slot</span>
                  </button>
                </div>
              </div>
            )}

            {/* Active / Current Scheduled Booking Management */}
            {activeBooking && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">Active Practice Session</h3>
                    <p className="text-xs text-slate-500">Booking {activeBooking.bookingNumber} • Doorstep Pickup</p>
                  </div>
                  <StatusBadge status={activeBooking.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer details */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 text-sm">{activeBooking.customerName}</div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-brand-500" />
                      <span>{activeBooking.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
                      <span>{activeBooking.address.fullAddress}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
                      <span>Vehicle:</span>
                      <span className="text-slate-900">{activeBooking.vehicleDetails.brand} {activeBooking.vehicleDetails.model} ({activeBooking.vehicleDetails.transmission})</span>
                    </div>
                  </div>

                  {/* Step Action Controls */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                      Session Lifecycle Actions
                    </h4>

                    {activeBooking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(activeBooking, 'TRAINER_EN_ROUTE')}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>I am En Route to Customer</span>
                      </button>
                    )}

                    {activeBooking.status === 'TRAINER_EN_ROUTE' && (
                      <button
                        onClick={() => handleUpdateStatus(activeBooking, 'TRAINER_ARRIVED')}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>I have Arrived at Doorstep</span>
                      </button>
                    )}

                    {activeBooking.status === 'TRAINER_ARRIVED' && (
                      <button
                        onClick={() => handleUpdateStatus(activeBooking, 'SESSION_STARTED')}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 animate-pulse"
                      >
                        <Play className="w-4 h-4" />
                        <span>Start Practice Session & Timer</span>
                      </button>
                    )}

                    {activeBooking.status === 'SESSION_STARTED' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between">
                          <span>Session Active with Customer</span>
                          <span className="font-mono text-base">00:45:10</span>
                        </div>

                        {/* Skill logging */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Skills Practiced in this Session:
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {['CLUTCH_CONTROL', 'PARALLEL_PARKING', 'CITY_HEAVY_TRAFFIC', 'U_TURNS_TIGHT_TURNS'].map(skill => (
                              <button
                                key={skill}
                                onClick={() => {
                                  if (selectedPracticedSkills.includes(skill as TrainingGoal)) {
                                    setSelectedPracticedSkills(selectedPracticedSkills.filter(s => s !== skill));
                                  } else {
                                    setSelectedPracticedSkills([...selectedPracticedSkills, skill as TrainingGoal]);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                                  selectedPracticedSkills.includes(skill as TrainingGoal)
                                    ? 'bg-brand-500 text-white'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {skill.replace(/_/g, ' ')}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Trainer quick notes input */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Trainer Observations (for AI Coach generation):
                          </label>
                          <textarea
                            value={sessionNotesInput}
                            onChange={(e) => setSessionNotesInput(e.target.value)}
                            rows={2}
                            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                          />
                        </div>

                        <button
                          onClick={handleGenerateAiNotes}
                          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Generate AI Progress Report</span>
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(activeBooking, 'COMPLETED')}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
                        >
                          Finish Session & Collect ₹560 Payout
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI generated report preview */}
                {aiReportGenerated && (
                  <div className="p-4 bg-brand-50/80 rounded-2xl border border-brand-200 space-y-2 text-xs text-slate-800 animate-fade-in">
                    <div className="flex items-center gap-1.5 font-bold text-brand-900">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span>AI Student Evaluation Card</span>
                    </div>
                    <p><strong>Coach Feedback:</strong> {aiReportGenerated.coachInsights}</p>
                    <p><strong>Next Target Drills:</strong> {aiReportGenerated.focusAreasForNextSession.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Today's Queue List */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900">Today's Remaining Schedule</h4>
              <div className="space-y-3">
                {[
                  { time: '10:00 AM', customer: 'Rahul Sharma', vehicle: 'Hyundai Creta', type: 'Car • Beginner' },
                  { time: '12:30 PM', customer: 'Ananya Deshmukh', vehicle: 'Tata Nexon EV', type: 'Automatic • Parking' },
                  { time: '05:00 PM', customer: 'Arjun Nambiar', vehicle: 'Honda Elevate', type: 'Car • Refresher' },
                  { time: '07:00 PM', customer: 'Meera Iyer', vehicle: 'Maruti Baleno', type: 'Highway Practice' }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-brand-50 text-brand-700 rounded-xl font-bold text-xs">
                        {s.time}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">{s.customer}</div>
                        <div className="text-[11px] text-slate-500">{s.vehicle} • {s.type}</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">+₹560</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB 2: EARNINGS & PAYOUTS ----------------- */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Monthly Big Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">This Month Earnings</span>
                <div className="text-3xl font-black text-slate-900">₹58,400</div>
                <div className="text-[11px] text-emerald-600 font-bold">▲ 18% vs last month</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Completed Sessions</span>
                <div className="text-3xl font-black text-slate-900">82 Sessions</div>
                <div className="text-[11px] text-slate-500">Avg ₹712 / session</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase">Next Weekly Payout</span>
                <div className="text-3xl font-black text-brand-600">₹14,850</div>
                <div className="text-[11px] text-slate-500">Auto-transfers this Tuesday</div>
              </div>
            </div>

            {/* Bank details card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900">Direct Bank Transfer Account</h4>
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Bank Name</span>
                  <span className="font-bold text-slate-900">HDFC Bank Ltd</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Account Number</span>
                  <span className="font-bold text-slate-900">•••• •••• 4910</span>
                </div>
                <div>
                  <span className="text-slate-400 block">IFSC Code</span>
                  <span className="font-bold text-slate-900">HDFC0001824</span>
                </div>
                <div>
                  <span className="text-slate-400 block">UPI ID</span>
                  <span className="font-bold text-slate-900">priya@okhdfcbank</span>
                </div>
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="font-extrabold text-base text-slate-900">Recent Weekly Payout Transfers</h4>
              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { date: '29 Sep 2026', ref: 'IMPS-98421098', amount: '₹14,240', status: 'Settled to HDFC' },
                  { date: '22 Sep 2026', ref: 'IMPS-77124981', amount: '₹15,100', status: 'Settled to HDFC' },
                  { date: '15 Sep 2026', ref: 'IMPS-66291044', amount: '₹13,850', status: 'Settled to HDFC' },
                  { date: '08 Sep 2026', ref: 'IMPS-55192837', amount: '₹15,210', status: 'Settled to HDFC' }
                ].map((p, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{p.date} • Ref {p.ref}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{p.status}</div>
                    </div>
                    <span className="font-black text-sm text-slate-900">{p.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: AVAILABILITY SCHEDULER ----------------- */}
        {activeTab === 'availability' && (
          <div className="space-y-6 max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Weekly Availability Scheduler</h3>
                <p className="text-xs text-slate-500 mt-0.5">Toggle the time slots when you are available for doorstep bookings.</p>
              </div>

              <button
                onClick={handleCopyMondayToWeekdays}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Monday to All Weekdays</span>
              </button>
            </div>

            <div className="space-y-4 pt-2">
              {Object.keys(weeklyAvailability).map((day) => {
                const daySlots = weeklyAvailability[day];
                const allPossibleSlots = ['06:30 AM', '07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM', '04:00 PM', '05:30 PM', '07:00 PM'];

                return (
                  <div key={day} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{day}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{daySlots.length} active slots</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {allPossibleSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => toggleSlot(day, slot)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                            daySlots.includes(slot)
                              ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: KYC & CREDENTIALS ----------------- */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="font-black text-xl text-slate-900">Mentor Credentials & KYC Verification</h3>
              <p className="text-xs text-slate-500 mt-0.5">Your documents are audited and validated by DriveSaathi Safety Operations.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-900">Driving Licence (Commercial / Instructor)</div>
                  <div className="text-emerald-700 font-mono">KA0320140019283 (Valid until 2034)</div>
                </div>
                <VerifiedBadge size="sm" text="Verified" />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-900">Government Identity (Aadhaar / Passport)</div>
                  <div className="text-emerald-700 font-mono">XXXX-XXXX-9482 (Aadhaar UIDAI Authenticated)</div>
                </div>
                <VerifiedBadge size="sm" text="Verified" />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-900">Police Background Verification</div>
                  <div className="text-emerald-700 font-mono">Ref BLR-POL-2024-8841 (Clear Record)</div>
                </div>
                <VerifiedBadge size="sm" text="Verified" />
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-extrabold text-emerald-900">First-Aid & Defensive Driving Certification</div>
                  <div className="text-emerald-700">Indian Red Cross + DriveSaathi Level 3 Master Instructor</div>
                </div>
                <VerifiedBadge size="sm" text="Certified" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
