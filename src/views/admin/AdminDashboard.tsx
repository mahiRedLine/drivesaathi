import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  SlidersHorizontal, 
  Tag, 
  TrendingUp, 
  MapPin, 
  Check, 
  X, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  Filter, 
  ShieldCheck, 
  FileText, 
  ChevronRight,
  Plus,
  Compass,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { 
  Trainer, 
  Booking, 
  SafetyIncident, 
  PricingRuleConfig, 
  Coupon, 
  CityConfig,
  BookingStatus
} from '../../types';
import { store } from '../../services/storage';
import { sound } from '../../services/sound';
import { calculateCancellationRefund } from '../../services/stateMachine';
import { InteractiveMap } from '../../components/map/InteractiveMap';
import { StatusBadge, VerifiedBadge, StarRating } from '../../components/common/Badge';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'trainers' | 'bookings' | 'safety' | 'pricing' | 'coupons' | 'analytics'>('overview');

  const [trainers, setTrainers] = useState<Trainer[]>(store.getTrainers());
  const [bookings, setBookings] = useState<Booking[]>(store.getBookings());
  const [incidents, setIncidents] = useState<SafetyIncident[]>(store.getSafetyIncidents());
  const [pricingConfig, setPricingConfig] = useState<PricingRuleConfig>(store.getPricingConfig());
  const [coupons, setCoupons] = useState<Coupon[]>(store.getCoupons());

  // Modals
  const [verifyingTrainer, setVerifyingTrainer] = useState<Trainer | null>(null);
  const [selectedBookingForAction, setSelectedBookingForAction] = useState<Booking | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(null);

  // New Coupon state
  const [newCouponCode, setNewCouponCode] = useState<string>('');
  const [newCouponValue, setNewCouponValue] = useState<number>(200);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState<number>(500);

  // Search & Filters
  const [trainerSearch, setTrainerSearch] = useState<string>('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setTrainers(store.getTrainers());
      setBookings(store.getBookings());
      setIncidents(store.getSafetyIncidents());
      setPricingConfig(store.getPricingConfig());
      setCoupons(store.getCoupons());
    });
    return unsub;
  }, []);

  const handleApproveTrainer = (tr: Trainer) => {
    sound.playSuccess();
    const updated: Trainer = {
      ...tr,
      verifiedStatus: {
        ...tr.verifiedStatus,
        verificationStatus: 'APPROVED',
        isIdentityVerified: true,
        isLicenceVerified: true,
        isAddressVerified: true,
        isBackgroundVerified: true
      }
    };
    store.updateTrainer(updated);
    setVerifyingTrainer(null);
    alert(`Mentor ${tr.name} has been APPROVED and activated for marketplace bookings.`);
  };

  const handleRejectTrainer = (tr: Trainer) => {
    sound.playTap();
    const updated: Trainer = {
      ...tr,
      verifiedStatus: {
        ...tr.verifiedStatus,
        verificationStatus: 'REJECTED'
      }
    };
    store.updateTrainer(updated);
    setVerifyingTrainer(null);
  };

  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    sound.playTap();
    const target = bookings.find(b => b.id === bookingId);
    if (target) {
      const updated: Booking = { ...target, status: newStatus, updatedAt: new Date().toISOString() };
      store.saveBooking(updated);
      setSelectedBookingForAction(null);
    }
  };

  const handleSavePricingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    store.updatePricingConfig(pricingConfig);
    alert('Marketplace pricing matrix, surge rules, and commission rates updated successfully!');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    sound.playSuccess();
    store.saveCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountType: 'FIXED',
      value: newCouponValue,
      minOrderValue: newCouponMinOrder,
      description: `₹${newCouponValue} discount on orders above ₹${newCouponMinOrder}`,
      expiryDate: '2026-12-31',
      active: true
    });
    setNewCouponCode('');
  };

  // KPI calculations
  const totalGMV = bookings.reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 2480000);
  const platformRevenue = Math.round(totalGMV * 0.20);
  const openIncidentsCount = incidents.filter(i => i.status === 'OPEN').length;

  const filteredTrainers = trainers.filter(t => 
    t.name.toLowerCase().includes(trainerSearch.toLowerCase()) || 
    t.city.toLowerCase().includes(trainerSearch.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    if (bookingFilterStatus === 'ALL') return true;
    return b.status === bookingFilterStatus;
  });

  return (
    <div className="bg-canvas min-h-[calc(100vh-64px)] pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* Top Control Center Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Super Admin Operations Center</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                Live Production Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Marketplace liquidity, mentor compliance KYC, dynamic surge pricing, and 24x7 safety escalation desk.
            </p>
          </div>

          {openIncidentsCount > 0 && (
            <button
              onClick={() => { sound.playTap(); setActiveSection('safety'); }}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{openIncidentsCount} Active SOS Alert</span>
            </button>
          )}
        </div>

        {/* Main Admin Navigation Bar */}
        <div className="bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/90 flex items-center justify-between mb-6 overflow-x-auto text-xs font-bold text-slate-600">
          <button
            onClick={() => { sound.playTap(); setActiveSection('overview'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'overview' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('trainers'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'trainers' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Trainers & KYC ({trainers.length})</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('bookings'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'bookings' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings & State Control</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('safety'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'safety' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span>24×7 Safety Center</span>
            {openIncidentsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('pricing'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'pricing' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Pricing & Commission Rules</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('coupons'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'coupons' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons & Promos</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setActiveSection('analytics'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition whitespace-nowrap ${
              activeSection === 'analytics' ? 'bg-slate-900 text-white shadow' : 'hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Demand Analytics</span>
          </button>
        </div>

        {/* ----------------- SECTION 1: OVERVIEW & KPIS ----------------- */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Top 6 KPI Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total GMV</span>
                <div className="text-xl font-black text-slate-900">₹{(totalGMV / 100000).toFixed(1)}L</div>
                <div className="text-[10px] font-bold text-emerald-600">▲ 24% vs last month</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Net Platform Rev</span>
                <div className="text-xl font-black text-brand-600">₹{(platformRevenue / 100000).toFixed(1)}L</div>
                <div className="text-[10px] text-slate-500">20% marketplace take</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Bookings</span>
                <div className="text-xl font-black text-slate-900">3,842</div>
                <div className="text-[10px] text-slate-500">3,521 Completed</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Active Mentors</span>
                <div className="text-xl font-black text-slate-900">421</div>
                <div className="text-[10px] text-emerald-600 font-semibold">100% Police Verified</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Cancellation Rate</span>
                <div className="text-xl font-black text-emerald-600">1.8%</div>
                <div className="text-[10px] text-slate-500">Industry lowest</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Average Rating</span>
                <div className="text-xl font-black text-amber-500">4.92 ★</div>
                <div className="text-[10px] text-slate-500">Based on 1,480 reviews</div>
              </div>
            </div>

            {/* Live Sessions Real-Time Radar Map */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Live Active Practice Sessions Radar</h3>
                  <p className="text-xs text-slate-500">Real-time GPS tracking of mentors currently coaching students.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  ● 3 Active in Bangalore
                </span>
              </div>

              <InteractiveMap
                centerAddress={store.getSavedAddresses()[0]}
                trainers={trainers}
                showRoute={true}
                activeEnRouteTrainer={trainers[0]}
                heightClass="h-72 sm:h-96"
              />
            </div>
          </div>
        )}

        {/* ----------------- SECTION 2: TRAINER MANAGEMENT & KYC VERIFICATION ----------------- */}
        {activeSection === 'trainers' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Trainer Network & KYC Verification</h3>
                <p className="text-xs text-slate-500 mt-0.5">Audit driving licences, police background checks, and mentor certifications.</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={trainerSearch}
                  onChange={(e) => setTrainerSearch(e.target.value)}
                  placeholder="Search by mentor or city..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Trainers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Mentor</th>
                    <th className="py-3 px-4">Gender</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Vehicles</th>
                    <th className="py-3 px-4">Rating / Sessions</th>
                    <th className="py-3 px-4">KYC Status</th>
                    <th className="py-3 px-4 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTrainers.map(tr => (
                    <tr key={tr.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <img src={tr.avatar} alt={tr.name} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <div>{tr.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{tr.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {tr.gender === 'FEMALE' ? 'Female' : 'Male'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{tr.city}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {tr.vehicleExpertise.categories.join(', ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tr.rating.toFixed(1)} ★</div>
                        <div className="text-[10px] text-slate-400">{tr.totalSessions} sessions</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">
                          {tr.verifiedStatus.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => { sound.playTap(); setVerifyingTrainer(tr); }}
                          className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs"
                        >
                          Audit KYC
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- SECTION 3: BOOKINGS & STATE MACHINE CONTROL ----------------- */}
        {activeSection === 'bookings' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-xl text-slate-900">Bookings & Lifecycle State Machine</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control live state transitions, disputes, and policy-based refunds.</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                {['ALL', 'CONFIRMED', 'SESSION_STARTED', 'COMPLETED'].map(st => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg transition ${bookingFilterStatus === st ? 'bg-white text-slate-900 shadow' : ''}`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Booking Ref</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Mentor</th>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map(bk => (
                    <tr key={bk.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{bk.bookingNumber}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{bk.customerName}</div>
                        <div className="text-[10px] text-slate-400">{bk.address.area}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-brand-700">{bk.trainerName || 'Unassigned'}</td>
                      <td className="py-3 px-4">{bk.vehicleDetails.brand} {bk.vehicleDetails.model}</td>
                      <td className="py-3 px-4 font-medium">{bk.date} @ {bk.timeSlot}</td>
                      <td className="py-3 px-4"><StatusBadge status={bk.status} /></td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{bk.pricing.totalAmount}</td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <button
                          onClick={() => { sound.playTap(); setSelectedBookingForAction(bk); }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs"
                        >
                          Manage State
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- SECTION 4: 24x7 SAFETY CENTER ----------------- */}
        {activeSection === 'safety' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900">Central Safety Desk & SOS Escalations</h3>
                  <p className="text-xs text-slate-500">Live emergency triggers, location telemetry, and rapid police escalation.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {incidents.map(inc => (
                <div
                  key={inc.id}
                  className={`p-5 rounded-2xl border-2 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    inc.status === 'OPEN'
                      ? 'border-red-500 bg-red-50/40 shadow-md'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{inc.type}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.severity === 'CRITICAL' ? 'bg-red-600 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {inc.severity} SEVERITY
                      </span>
                      <span className="text-xs font-semibold text-slate-500">({inc.status})</span>
                    </div>

                    <p className="text-xs text-slate-700">{inc.details}</p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1">
                      Customer: <strong>{inc.customerName}</strong> • Mentor: <strong>{inc.trainerName}</strong> • Location: <strong>{inc.location.area}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        store.updateSafetyIncident({
                          ...inc,
                          status: 'RESOLVED',
                          actionTakenNotes: 'Customer verified safe via safety callback.'
                        });
                        alert('Incident resolved and closed.');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Verify Safe & Close
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- SECTION 5: PRICING ENGINE & BUSINESS RULES ----------------- */}
        {activeSection === 'pricing' && (
          <form onSubmit={handleSavePricingConfig} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-black text-xl text-slate-900">Pricing Engine & Marketplace Matrix Config</h3>
              <p className="text-xs text-slate-500 mt-0.5">Control base hourly rates, commission split, peak surge multipliers, and taxes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Hourly Rate: Car (₹)</label>
                <input
                  type="number"
                  value={pricingConfig.baseHourlyRateCar}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, baseHourlyRateCar: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Hourly Rate: Motorcycle (₹)</label>
                <input
                  type="number"
                  value={pricingConfig.baseHourlyRateBike}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, baseHourlyRateBike: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Hourly Rate: Scooter (₹)</label>
                <input
                  type="number"
                  value={pricingConfig.baseHourlyRateScooter}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, baseHourlyRateScooter: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trainer Commission Share (%)</label>
                <input
                  type="number"
                  step="0.05"
                  value={pricingConfig.trainerCommissionPercent}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, trainerCommissionPercent: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
                <span className="text-[10px] text-slate-400">0.80 = 80% to Trainer, 20% to Platform</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Platform Booking Fee (₹)</label>
                <input
                  type="number"
                  value={pricingConfig.platformFee}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, platformFee: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Peak Hour Surge Multiplier</label>
                <input
                  type="number"
                  step="0.05"
                  value={pricingConfig.peakHourMultiplier}
                  onChange={(e) => setPricingConfig({ ...pricingConfig, peakHourMultiplier: Number(e.target.value) })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md transition"
            >
              Save & Apply Marketplace Rules
            </button>
          </form>
        )}

        {/* ----------------- SECTION 6: COUPONS & PROMOTIONS ----------------- */}
        {activeSection === 'coupons' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
            <div>
              <h3 className="font-black text-xl text-slate-900">Promo Coupons & Referral Discounter</h3>
              <p className="text-xs text-slate-500 mt-0.5">Create and manage marketing vouchers for customer acquisition.</p>
            </div>

            {/* Create form */}
            <form onSubmit={handleCreateCoupon} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="e.g. MONSOON300"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase"
                />
              </div>

              <div className="w-28">
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount (₹)</label>
                <input
                  type="number"
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div className="w-36">
                <label className="block text-xs font-bold text-slate-700 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  value={newCouponMinOrder}
                  onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow"
              >
                + Create Coupon
              </button>
            </form>

            <div className="divide-y divide-slate-100 text-xs">
              {coupons.map(c => (
                <div key={c.code} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-brand-700 text-sm">{c.code}</span>
                    <p className="text-slate-500 mt-0.5">{c.description} • Min order: ₹{c.minOrderValue}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- SECTION 7: ANALYTICS ----------------- */}
        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Demand Pie */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900">Vehicle Category Demand</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>🚗 Cars (Manual & Automatic)</span>
                      <span>62%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>🏍️ Motorcycles & Gear Bikes</span>
                      <span>24%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>🛵 Automatic Scooters & EVs</span>
                      <span>14%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender Preference Trends */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900">Customer Gender Preference</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>✨ No Preference</span>
                      <span>48%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>👩 Female Mentor Preferred</span>
                      <span>42%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>👨 Male Mentor Preferred</span>
                      <span>10%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Repeat Practice Rates */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-extrabold text-sm text-slate-900">Learner Retention & Packages</h4>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Average Sessions / Learner</span>
                    <span className="font-black text-slate-900 text-sm">4.2 Sessions</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Package Conversion Rate</span>
                    <span className="font-black text-brand-600 text-sm">38.4%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl flex justify-between items-center">
                    <span className="font-semibold text-slate-600">Customer Referral Velocity</span>
                    <span className="font-black text-emerald-600 text-sm">1.8 invites / user</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* KYC AUDIT MODAL */}
      {verifyingTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-modal shadow-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img src={verifyingTrainer.avatar} alt={verifyingTrainer.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="font-black text-base text-slate-900">{verifyingTrainer.name}</h3>
                  <p className="text-xs text-slate-500">{verifyingTrainer.city} • {verifyingTrainer.yearsExperience} yrs exp</p>
                </div>
              </div>
              <button onClick={() => setVerifyingTrainer(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border flex justify-between">
                <span className="text-slate-500">Commercial / Driving Licence:</span>
                <span className="font-mono font-bold text-slate-900">{verifyingTrainer.documents.drivingLicenceNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border flex justify-between">
                <span className="text-slate-500">Aadhaar Govt ID:</span>
                <span className="font-mono font-bold text-slate-900">{verifyingTrainer.documents.aadhaarOrGovtId}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border flex justify-between">
                <span className="text-slate-500">Police Verification Reference:</span>
                <span className="font-mono font-bold text-slate-900">{verifyingTrainer.documents.policeVerificationRef}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleRejectTrainer(verifyingTrainer)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApproveTrainer(verifyingTrainer)}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
              >
                Approve & Verify Mentor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE BOOKING STATE MACHINE MODAL */}
      {selectedBookingForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-modal shadow-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Manage Booking {selectedBookingForAction.bookingNumber}</h3>
              <button onClick={() => setSelectedBookingForAction(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={selectedBookingForAction.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold">{selectedBookingForAction.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Mentor:</span>
                <span className="font-bold">{selectedBookingForAction.trainerName || 'None'}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold text-slate-700">Force State Transition:</span>
              <div className="grid grid-cols-2 gap-2">
                {(['CONFIRMED', 'TRAINER_ACCEPTED', 'SESSION_STARTED', 'COMPLETED', 'CANCELLED_BY_CUSTOMER', 'REFUNDED'] as BookingStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateBookingStatus(selectedBookingForAction.id, st)}
                    className="p-2 bg-slate-50 hover:bg-brand-50 border hover:border-brand-300 rounded-lg text-[11px] font-bold text-slate-800 text-center"
                  >
                    Set {st.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
