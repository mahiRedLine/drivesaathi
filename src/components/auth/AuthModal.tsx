import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Car, 
  UserCheck, 
  LayoutDashboard, 
  Sparkles, 
  ArrowRight, 
  Check, 
  KeyRound, 
  Smartphone,
  Award,
  AlertCircle,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';
import { UserRole, AuthUser } from '../../types';
import { store, DEMO_USERS } from '../../services/storage';
import { sound } from '../../services/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess: (role: UserRole, targetView: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'CUSTOMER',
  onSuccess
}) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(defaultRole);
  const [authMethod, setAuthMethod] = useState<'PHONE_OTP' | 'GOOGLE' | 'MAGIC_LINK' | 'TRAINER_CREDS' | 'ADMIN_2FA'>('PHONE_OTP');

  // Customer Phone OTP State
  const [customerPhone, setCustomerPhone] = useState<string>('9886041209');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['4', '2', '9', '6', '1', '0']);
  const [resendTimer, setResendTimer] = useState<number>(28);

  // Magic Link Email State
  const [magicLinkEmail, setMagicLinkEmail] = useState<string>('mahesh.sharma@example.com');
  const [magicLinkSent, setMagicLinkSent] = useState<boolean>(false);

  // Google OAuth Simulator State
  const [showGooglePicker, setShowGooglePicker] = useState<boolean>(false);

  // Trainer State (Login vs Register)
  const [trainerMode, setTrainerMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [trainerPhoneOrEmail, setTrainerPhoneOrEmail] = useState<string>('priya.sharma@drivesaathi.in');
  const [trainerPassword, setTrainerPassword] = useState<string>('••••••••••••');
  // Trainer Registration Form
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regLicence, setRegLicence] = useState<string>('');
  const [regCity, setRegCity] = useState<string>('Bengaluru');

  // Admin State
  const [adminEmail, setAdminEmail] = useState<string>('ops.admin@drivesaathi.in');
  const [adminPassword, setAdminPassword] = useState<string>('••••••••••••');
  const [admin2FaCode, setAdmin2FaCode] = useState<string>('842109');

  useEffect(() => {
    if (defaultRole) {
      setSelectedRoleTab(defaultRole);
      if (defaultRole === 'TRAINER') setAuthMethod('TRAINER_CREDS');
      else if (defaultRole === 'ADMIN' || defaultRole === 'SUPER_ADMIN') setAuthMethod('ADMIN_2FA');
      else setAuthMethod('PHONE_OTP');
    }
  }, [defaultRole]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isOtpSent && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpSent, resendTimer]);

  if (!isOpen) return null;

  const handleSendCustomerOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTap();
    setIsOtpSent(true);
    setResendTimer(28);
  };

  const handleVerifyCustomerOtp = () => {
    sound.playSuccess();
    const user: AuthUser = {
      ...DEMO_USERS.CUSTOMER,
      phone: `+91 ${customerPhone}`
    };
    store.setCurrentUser(user);
    onSuccess('CUSTOMER', 'customer');
    onClose();
  };

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playTap();
    setMagicLinkSent(true);
  };

  const handleOpenMagicLink = () => {
    sound.playSuccess();
    const user: AuthUser = {
      ...DEMO_USERS.CUSTOMER,
      email: magicLinkEmail,
      name: magicLinkEmail.split('@')[0].replace('.', ' ').toUpperCase()
    };
    store.setCurrentUser(user);
    onSuccess('CUSTOMER', 'customer');
    onClose();
  };

  const handleGoogleSelect = (name: string, email: string) => {
    sound.playSuccess();
    const user: AuthUser = {
      ...DEMO_USERS.CUSTOMER,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    };
    store.setCurrentUser(user);
    onSuccess('CUSTOMER', 'customer');
    onClose();
  };

  const handleTrainerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    store.setCurrentUser(DEMO_USERS.TRAINER);
    onSuccess('TRAINER', 'trainer');
    onClose();
  };

  const handleTrainerRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim()) {
      alert('Please fill in required fields.');
      return;
    }
    sound.playSuccess();
    const newTrainerUser: AuthUser = {
      id: `tr-${Date.now()}`,
      name: regName,
      email: `${regName.toLowerCase().replace(/\s+/g, '')}@drivesaathi.in`,
      phone: `+91 ${regPhone}`,
      role: 'TRAINER',
      city: regCity,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isKycVerified: false
    };
    store.setCurrentUser(newTrainerUser);
    onSuccess('TRAINER', 'trainer');
    onClose();
    alert('Mentor application registered! KYC documents queued for Operations audit.');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    store.setCurrentUser(DEMO_USERS.ADMIN);
    onSuccess('SUPER_ADMIN', 'admin');
    onClose();
  };

  const handleQuickDemoLogin = (role: 'CUSTOMER' | 'TRAINER' | 'ADMIN') => {
    sound.playSuccess();
    const targetUser = DEMO_USERS[role];
    store.setCurrentUser(targetUser);
    const viewMap = {
      CUSTOMER: 'customer',
      TRAINER: 'trainer',
      ADMIN: 'admin'
    };
    onSuccess(targetUser.role, viewMap[role]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-white rounded-modal shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">

        {/* Header Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">DriveSaathi Access Portal</h3>
              <p className="text-xs text-slate-400">Secure 1-Click Verification & Sign In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-100 p-1.5 flex items-center gap-1 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => { sound.playTap(); setSelectedRoleTab('CUSTOMER'); setAuthMethod('PHONE_OTP'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRoleTab === 'CUSTOMER'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Learner</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setSelectedRoleTab('TRAINER'); setAuthMethod('TRAINER_CREDS'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRoleTab === 'TRAINER'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Mentor</span>
          </button>

          <button
            onClick={() => { sound.playTap(); setSelectedRoleTab('ADMIN'); setAuthMethod('ADMIN_2FA'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRoleTab === 'ADMIN' || selectedRoleTab === 'SUPER_ADMIN'
                ? 'bg-white text-brand-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {/* ---------------- 1. CUSTOMER AUTHENTICATION (PHONE OTP, GOOGLE, MAGIC LINK) ---------------- */}
          {selectedRoleTab === 'CUSTOMER' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Auth Method Toggle Pills */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                <button
                  onClick={() => setAuthMethod('PHONE_OTP')}
                  className={`flex-1 py-1.5 rounded-lg transition ${authMethod === 'PHONE_OTP' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  ⚡ Mobile OTP
                </button>
                <button
                  onClick={() => setAuthMethod('MAGIC_LINK')}
                  className={`flex-1 py-1.5 rounded-lg transition ${authMethod === 'MAGIC_LINK' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  ✉️ Magic Link
                </button>
                <button
                  onClick={() => setAuthMethod('GOOGLE')}
                  className={`flex-1 py-1.5 rounded-lg transition ${authMethod === 'GOOGLE' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
                >
                  🌐 Google
                </button>
              </div>

              {/* A. PHONE OTP FLOW */}
              {authMethod === 'PHONE_OTP' && (
                <div className="space-y-3">
                  {!isOtpSent ? (
                    <form onSubmit={handleSendCustomerOtp} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                        <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                          <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-xs font-bold text-slate-600">
                            🇮🇳 +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="98860 41209"
                            className="flex-1 p-2.5 text-xs font-bold text-slate-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                      >
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-brand-50 rounded-xl border border-brand-200 text-xs text-brand-900 flex items-center justify-between">
                        <span>Code sent to <strong>+91 {customerPhone}</strong></span>
                        <button onClick={() => setIsOtpSent(false)} className="text-brand-700 underline font-bold">
                          Edit
                        </button>
                      </div>

                      {/* 6 Box Input */}
                      <div className="flex justify-between gap-1.5 py-1">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={digit}
                            readOnly
                            className="w-10 h-11 text-center text-lg font-black bg-slate-50 border-2 border-brand-400 rounded-xl text-slate-900 shadow-sm"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Resend in {resendTimer}s</span>
                        <button
                          onClick={() => setResendTimer(28)}
                          disabled={resendTimer > 0}
                          className="text-brand-600 font-bold hover:underline disabled:text-slate-400"
                        >
                          Resend Code
                        </button>
                      </div>

                      <button
                        onClick={handleVerifyCustomerOtp}
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-lg transition"
                      >
                        Verify & Sign In
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* B. MAGIC LINK EMAIL FLOW */}
              {authMethod === 'MAGIC_LINK' && (
                <div className="space-y-3">
                  {!magicLinkSent ? (
                    <form onSubmit={handleSendMagicLink} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Your Email Address</label>
                        <div className="flex items-center rounded-xl border border-slate-200 p-2.5 focus-within:border-brand-500">
                          <Mail className="w-4 h-4 text-slate-400 mr-2" />
                          <input
                            type="email"
                            value={magicLinkEmail}
                            onChange={(e) => setMagicLinkEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full text-xs font-semibold text-slate-900 focus:outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">We will email you a password-free magic login link.</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Send Passwordless Magic Link</span>
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-3 text-center py-2 animate-fade-in">
                      <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-black text-sm text-slate-900">Check Your Inbox!</h5>
                        <p className="text-xs text-slate-500 mt-0.5">We sent an instant login link to <strong>{magicLinkEmail}</strong>.</p>
                      </div>

                      <button
                        onClick={handleOpenMagicLink}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Simulate 1-Click Magic Link Login</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* C. GOOGLE OAUTH FLOW */}
              {authMethod === 'GOOGLE' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow border border-slate-200 font-bold text-slate-800">
                      G
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">Sign in with Google Account</h5>
                      <p className="text-[11px] text-slate-500">Pick an account to continue with DriveSaathi</p>
                    </div>

                    <div className="space-y-1.5 pt-2 text-left">
                      <button
                        onClick={() => handleGoogleSelect('Mahesh Sharma', 'mahesh.sharma@gmail.com')}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-400 text-xs flex items-center gap-2.5 transition shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                          MS
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">Mahesh Sharma</div>
                          <div className="text-[10px] text-slate-400 truncate">mahesh.sharma@gmail.com</div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleGoogleSelect('Pooja Patel', 'pooja.patel@gmail.com')}
                        className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-400 text-xs flex items-center gap-2.5 transition shadow-sm"
                      >
                        <div className="w-7 h-7 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center">
                          PP
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 text-xs truncate">Pooja Patel</div>
                          <div className="text-[10px] text-slate-400 truncate">pooja.patel@gmail.com</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant 1-Click Demo Shortcut */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleQuickDemoLogin('CUSTOMER')}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-between transition shadow"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Demo Learner: Mahesh Sharma</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zero-Signup Frictionless reassurance */}
              <p className="text-[11px] text-slate-400 text-center">
                ✨ <strong>No Signup Required:</strong> Start booking right away; your profile is created on-the-fly during session confirmation.
              </p>
            </div>
          )}

          {/* ---------------- 2. TRAINER AUTHENTICATION & KYC REGISTRATION ---------------- */}
          {selectedRoleTab === 'TRAINER' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {trainerMode === 'LOGIN' ? 'Trainer Partner Login' : 'Register as Driving Mentor'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {trainerMode === 'LOGIN' ? 'Access your session schedule & weekly payouts' : 'Earn up to ₹65,000/month with flexible hours'}
                  </p>
                </div>
                <button
                  onClick={() => setTrainerMode(trainerMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                  className="text-xs font-bold text-brand-600 underline"
                >
                  {trainerMode === 'LOGIN' ? '+ Register' : 'Sign In'}
                </button>
              </div>

              {trainerMode === 'LOGIN' ? (
                <form onSubmit={handleTrainerLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Trainer Email / Mobile</label>
                    <input
                      type="text"
                      value={trainerPhoneOrEmail}
                      onChange={(e) => setTrainerPhoneOrEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={trainerPassword}
                      onChange={(e) => setTrainerPassword(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow"
                  >
                    Sign In to Trainer Portal
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('TRAINER')}
                    className="w-full py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-between transition shadow"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Instant Demo Mentor: Priya Sharma</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleTrainerRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Ramesh Patil"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <select
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                      >
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Driving Licence Number</label>
                    <input
                      type="text"
                      value={regLicence}
                      onChange={(e) => setRegLicence(e.target.value)}
                      placeholder="KA0120180099482"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
                  >
                    Submit Mentor KYC Application
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ---------------- 3. SUPER ADMIN AUTHENTICATION ---------------- */}
          {(selectedRoleTab === 'ADMIN' || selectedRoleTab === 'SUPER_ADMIN') && (
            <form onSubmit={handleAdminLogin} className="space-y-3 animate-fade-in">
              <div>
                <h4 className="font-extrabold text-base text-slate-900">Admin Control Center</h4>
                <p className="text-xs text-slate-500">Restricted to compliance, safety dispatch & operations staff.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">2FA Security Token</label>
                <input
                  type="text"
                  value={admin2FaCode}
                  onChange={(e) => setAdmin2FaCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow"
              >
                Authenticate & Open Operations Hub
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="w-full py-2.5 px-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs font-bold flex items-center justify-between transition shadow"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Instant 1-Click Super Admin Access</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

        </div>

        {/* Footer Guarantee */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit Encrypted Security Protocol</span>
          </span>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  );
};
