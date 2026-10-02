import React from 'react';
import { Car, ShieldCheck, Heart, ArrowRight, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/sound';

interface FooterProps {
  onNavigate: (view: string, subView?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-800">
      {/* Top Banner: Join as a Trainer */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-950 py-10 px-4 sm:px-6 lg:px-8 border-b border-brand-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400/20 text-brand-300 font-bold text-xs border border-brand-400/30">
              <Award className="w-3.5 h-3.5" />
              EARN UP TO ₹65,000 / MONTH
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Turn your driving experience into a fulfilling career.
            </h3>
            <p className="text-sm text-brand-100 max-w-2xl">
              Join India's most respected community of verified male and female driving mentors. Flexible hours, verified customers, transparent payouts, and full insurance support.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onNavigate('trainer');
            }}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-brand-50 text-brand-900 font-bold text-sm shadow-xl flex items-center gap-2 transition transform hover:scale-105"
          >
            <span>Become a Verified Trainer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Safety Mission */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">DriveSaathi</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            India's premier home-based vehicle training & road confidence marketplace. Connecting eager learners with verified, patient mentors to practice in their own vehicles.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Background & Police Verified Mentors</span>
          </div>
        </div>

        {/* Col 2: Training Categories */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3">Popular Programs</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><button onClick={() => onNavigate('customer', 'vehicle')} className="hover:text-white transition">Car Driving Practice (Manual & Auto)</button></li>
            <li><button onClick={() => onNavigate('customer', 'vehicle')} className="hover:text-white transition">Two-Wheeler & Gear Bike Riding</button></li>
            <li><button onClick={() => onNavigate('customer', 'vehicle')} className="hover:text-white transition">Automatic Scooter Bootcamp</button></li>
            <li><button onClick={() => onNavigate('customer', 'packages')} className="hover:text-white transition">Reverse & Parallel Parking Mastery</button></li>
            <li><button onClick={() => onNavigate('customer', 'packages')} className="hover:text-white transition">Highway & Expressways Confidence</button></li>
            <li><button onClick={() => onNavigate('customer', 'packages')} className="hover:text-white transition">New Car / Electric Vehicle (EV) Orientation</button></li>
            <li><button onClick={() => onNavigate('customer', 'packages')} className="hover:text-white transition">Women Driving Mentorship Program</button></li>
          </ul>
        </div>

        {/* Col 3: Dynamic City Pages (SEO) */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3">Operating Cities</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><button onClick={() => onNavigate('website', 'city-bengaluru')} className="hover:text-white transition">Driving Trainers in Bengaluru</button></li>
            <li><button onClick={() => onNavigate('website', 'city-mumbai')} className="hover:text-white transition">Driving Mentors in Mumbai</button></li>
            <li><button onClick={() => onNavigate('website', 'city-delhi-ncr')} className="hover:text-white transition">Driving Trainers in Delhi NCR</button></li>
            <li><button onClick={() => onNavigate('website', 'city-hyderabad')} className="hover:text-white transition">Driving Coaches in Hyderabad</button></li>
            <li><button onClick={() => onNavigate('website', 'city-pune')} className="hover:text-white transition">Driving Trainers in Pune</button></li>
            <li><button onClick={() => onNavigate('website', 'city-chennai')} className="hover:text-white transition">Driving Trainers in Chennai</button></li>
            <li><span className="text-slate-600">Ahmedabad, Kolkata, Jaipur (Launching Soon)</span></li>
          </ul>
        </div>

        {/* Col 4: Trust & Support */}
        <div>
          <h4 className="font-bold text-sm text-white mb-3">Safety & Trust</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Female Trainer Preferred Choice</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Transparent Per-Minute Pricing</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free 6-Hour Cancellation Policy</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dual Review & Private Safety Audit</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Live GPS Session Tracking</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-brand-400" />
              <span>24×7 Safety Desk: 1800-200-8899</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-brand-400" />
              <span>care@drivesaathi.in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 DriveSaathi Technologies Private Limited. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Marketplace</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Safety Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
