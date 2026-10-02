import React, { useState } from 'react';
import { 
  Car, 
  Bike, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Users, 
  Award, 
  Zap, 
  ChevronRight,
  Compass,
  Phone,
  HelpCircle,
  Heart,
  TrendingUp,
  Sliders,
  DollarSign,
  Headphones
} from 'lucide-react';
import { CityConfig, VehicleCategory } from '../../types';
import { store } from '../../services/storage';
import { sound } from '../../services/sound';
import { StarRating, VerifiedBadge } from '../../components/common/Badge';
import { SupportModal } from '../../components/common/SupportModal';

interface MarketingWebsiteProps {
  onStartBooking: (category?: VehicleCategory) => void;
  onSelectTrainer: (trainerId: string) => void;
  selectedCity: CityConfig;
}

export const MarketingWebsite: React.FC<MarketingWebsiteProps> = ({
  onStartBooking,
  onSelectTrainer,
  selectedCity
}) => {
  const trainers = store.getTrainers();
  const packages = store.getPackages();

  // Interactive Hero Estimator state
  const [heroCategory, setHeroCategory] = useState<VehicleCategory>('CAR');
  const [heroTransmission, setHeroTransmission] = useState<string>('AUTOMATIC');
  const [heroArea, setHeroArea] = useState<string>(selectedCity.popularAreas[0] || 'Indiranagar');

  // Interactive Mentor Earnings Calculator state
  const [mentorSessionsPerDay, setMentorSessionsPerDay] = useState<number>(4);
  const mentorMonthlyProjected = mentorSessionsPerDay * 560 * 26; // 26 working days @ ₹560 net per session

  const [showSupportModal, setShowSupportModal] = useState<boolean>(false);

  const cityTrainers = trainers.slice(0, 3);

  const handleBookCategory = (cat: VehicleCategory) => {
    sound.playTap();
    onStartBooking(cat);
  };

  return (
    <div className="bg-canvas min-h-screen font-sans selection:bg-brand-500 selection:text-white">
      
      {/* ---------------- 1. HERO SECTION & LIVE MATCHER ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/20 to-canvas pt-10 pb-16 sm:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Headline & Fast Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-sm">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Verified Male & Female Mentors • Doorstep Pickup</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Learn to drive. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                  Practice at your pace.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Overcome road anxiety in your own vehicle. Book background-verified, patient mentors who travel to your home or neighborhood practice area across <strong className="text-slate-900">{selectedCity.name}</strong>.
              </p>

              {/* 4 Category Quick Launch Cards */}
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center lg:text-left">
                  Choose what you want to practice:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0">
                  <button
                    onClick={() => handleBookCategory('CAR')}
                    className="p-3 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-400 shadow-sm transition text-left group"
                  >
                    <div className="text-2xl mb-1">🚗</div>
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600">Car Driving</div>
                    <div className="text-[10px] text-slate-500">From ₹599/hr</div>
                  </button>

                  <button
                    onClick={() => handleBookCategory('MOTORCYCLE')}
                    className="p-3 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-400 shadow-sm transition text-left group"
                  >
                    <div className="text-2xl mb-1">🏍️</div>
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600">Bike & Gear</div>
                    <div className="text-[10px] text-slate-500">From ₹499/hr</div>
                  </button>

                  <button
                    onClick={() => handleBookCategory('SCOOTER')}
                    className="p-3 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-400 shadow-sm transition text-left group"
                  >
                    <div className="text-2xl mb-1">🛵</div>
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600">Scooter</div>
                    <div className="text-[10px] text-slate-500">From ₹499/hr</div>
                  </button>

                  <button
                    onClick={() => handleBookCategory('REFRESHER_CAR')}
                    className="p-3 rounded-2xl bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-400 shadow-sm transition text-left group"
                  >
                    <div className="text-2xl mb-1">🅿️</div>
                    <div className="font-extrabold text-xs text-slate-900 group-hover:text-brand-600">Parking & Gap</div>
                    <div className="text-[10px] text-slate-500">From ₹599/hr</div>
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 justify-center lg:justify-start">
                <button
                  onClick={() => handleBookCategory('CAR')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <span>Book Doorstep Mentor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { sound.playTap(); setShowSupportModal(true); }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Headphones className="w-4 h-4 text-brand-600" />
                  <span>24×7 Help Desk</span>
                </button>
              </div>
            </div>

            {/* Right Live Estimator Widget */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                {/* Decorative glow */}
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-brand-400/20 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-6 -left-6 w-72 h-72 bg-emerald-400/20 rounded-full filter blur-3xl"></div>

                {/* Main Showcase & Live Estimator Card */}
                <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="font-black text-sm text-slate-900">Instant Match & Quote</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      48 Mentors Online
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Vehicle Type</label>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <button
                          onClick={() => setHeroCategory('CAR')}
                          className={`py-2 rounded-xl font-bold transition border ${heroCategory === 'CAR' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        >
                          🚗 Car
                        </button>
                        <button
                          onClick={() => setHeroCategory('MOTORCYCLE')}
                          className={`py-2 rounded-xl font-bold transition border ${heroCategory === 'MOTORCYCLE' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        >
                          🏍️ Bike
                        </button>
                        <button
                          onClick={() => setHeroCategory('SCOOTER')}
                          className={`py-2 rounded-xl font-bold transition border ${heroCategory === 'SCOOTER' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                        >
                          🛵 Scooter
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Transmission</label>
                        <select
                          value={heroTransmission}
                          onChange={(e) => setHeroTransmission(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="AUTOMATIC">Automatic (AT/CVT/DCT)</option>
                          <option value="MANUAL">Manual</option>
                          <option value="EV">Electric Vehicle (EV)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Area</label>
                        <select
                          value={heroArea}
                          onChange={(e) => setHeroArea(e.target.value)}
                          className="w-full p-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                        >
                          {selectedCity.popularAreas.map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Calculated estimate badge */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Estimated Rate in {heroArea}</div>
                        <div className="text-base font-black text-slate-900">
                          {heroCategory === 'CAR' ? '₹599 / 60 min' : '₹499 / 60 min'}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                        Doorstep Included
                      </span>
                    </div>

                    <button
                      onClick={() => handleBookCategory(heroCategory)}
                      className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                    >
                      <span>Find Mentors in {heroArea}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 2. WOMEN DRIVING CONFIDENCE & GENDER AWARE SECTION ---------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                <Heart className="w-3.5 h-3.5 text-purple-600" />
                <span>Comfort & Safety First</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Learn with someone you're 100% comfortable with.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose a verified female mentor or male mentor based entirely on your personal preference. Our trainers specialize in calm, non-judgmental guidance for nervous first-timers, homemakers, working professionals, and new car owners.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Female Mentors:</strong> Largest network of verified female driving mentors in India.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Zero Judgment:</strong> Learn at your own pace without impatience or stress.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>100% Police & Background Verified:</strong> Government ID, driving licence, and address audited.</span>
                </li>
              </ul>

              <div className="pt-2">
                <button
                  onClick={() => handleBookCategory('CAR')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center gap-2"
                >
                  <span>Explore Female Mentors in {selectedCity.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-canvas p-5 rounded-3xl border border-slate-200 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                  alt="Priya Sharma"
                  className="w-14 h-14 rounded-2xl object-cover shadow bg-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Priya Sharma</h4>
                  <p className="text-[11px] text-slate-500">8 yrs exp • 1,240+ sessions • Bengaluru</p>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "My focus is creating a calm, safe environment where beginners never feel rushed. In 3 sessions, my students master Bangalore traffic and reverse parking."
                </p>
                <div className="pt-1">
                  <VerifiedBadge size="sm" text="Police Verified Mentor" />
                </div>
              </div>

              <div className="bg-canvas p-5 rounded-3xl border border-slate-200 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
                  alt="Anjali Menon"
                  className="w-14 h-14 rounded-2xl object-cover shadow bg-slate-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Anjali Menon</h4>
                  <p className="text-[11px] text-slate-500">7 yrs exp • 910+ sessions • EV Specialist</p>
                </div>
                <p className="text-xs text-slate-600 italic">
                  "Whether it's your first automatic car or electric vehicle, we start in quiet residential lanes before conquering flyovers and roundabouts."
                </p>
                <div className="pt-1">
                  <VerifiedBadge size="sm" text="Certified EV Instructor" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- 3. MENTOR EARNINGS CALCULATOR ---------------- */}
      <section className="py-16 bg-canvas border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-brand-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 font-bold text-xs border border-brand-400/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Become a Verified Mentor</span>
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Turn your driving skills into ₹65,000+ per month.
                </h3>
                <p className="text-xs sm:text-sm text-brand-100 max-w-xl">
                  Set your own hours, choose your service radius, and get direct weekly bank payouts with DriveSaathi's mentor partner network.
                </p>

                {/* Interactive Slider */}
                <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3 max-w-lg mx-auto lg:mx-0">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">Daily Practice Sessions:</span>
                    <span className="font-black text-amber-300 text-sm">{mentorSessionsPerDay} Sessions / Day</span>
                  </div>

                  <input
                    type="range"
                    min={2}
                    max={6}
                    step={1}
                    value={mentorSessionsPerDay}
                    onChange={(e) => setMentorSessionsPerDay(Number(e.target.value))}
                    className="w-full accent-brand-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>2 Sessions (~2h/day)</span>
                    <span>4 Sessions (Part-time)</span>
                    <span>6 Sessions (Full-time)</span>
                  </div>
                </div>
              </div>

              {/* Projected Monthly Earnings Box */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 text-slate-900 shadow-2xl text-center space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Projected Monthly Earnings
                </span>
                <div className="text-4xl font-black text-slate-900">
                  ₹{mentorMonthlyProjected.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500">
                  Based on {mentorSessionsPerDay} completed sessions/day @ ₹560 net per session + weekly Tuesday bank transfer.
                </p>

                <button
                  onClick={() => { sound.playTap(); onStartBooking('CAR'); }}
                  className="w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <span>Register as a Mentor Today</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. REAL STUDENT TESTIMONIALS ---------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">Real Learner Stories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              From Nervous to Confident Drivers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "I had a driving licence for 4 years but was terrified of taking my Hyundai Creta into Whitefield peak traffic. Priya Sharma helped me overcome my fear in just 3 doorstep sessions. Parallel parking is now second nature!"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                  MS
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">Mahesh Sharma</div>
                  <div className="text-[10px] text-slate-400">Software Architect • Creta Automatic</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Having a female mentor who understood that I just bought a brand new Tata Nexon EV made a world of difference. She explained one-pedal driving and regen braking so simply!"
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center">
                  AD
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">Ananya Deshmukh</div>
                  <div className="text-[10px] text-slate-400">Marketing Lead • Nexon EV</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Rahul helped me master the heavy clutch and slow-speed balance of my Royal Enfield Classic 350. His slope start technique prevented any rollback on flyovers."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
                  AK
                </div>
                <div>
                  <div className="font-extrabold text-xs text-slate-900">Arjun Kumar</div>
                  <div className="text-[10px] text-slate-400">Student • Classic 350 Gear Bike</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Center Modal */}
      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
};
