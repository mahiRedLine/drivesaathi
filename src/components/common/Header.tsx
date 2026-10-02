import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Bell, 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  Sparkles, 
  UserCheck, 
  LayoutDashboard,
  Globe,
  Check,
  RotateCcw,
  User,
  LogIn,
  LogOut,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { store, AppNotification, DEMO_USERS } from '../../services/storage';
import { UserRole, CityConfig, AuthUser } from '../../types';
import { sound } from '../../services/sound';
import { SosModal } from './SosModal';
import { AuthModal } from '../auth/AuthModal';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  selectedCity: CityConfig;
  onSelectCity: (city: CityConfig) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  selectedCity,
  onSelectCity,
  isMobileFrame,
  onToggleMobileFrame
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(store.getActiveRole());
  const [currentUser, setCurrentUser] = useState<AuthUser>(store.getCurrentUser());
  const [notifications, setNotifications] = useState<AppNotification[]>(store.getNotifications());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalDefaultRole, setAuthModalDefaultRole] = useState<UserRole>('CUSTOMER');

  const cities = store.getCities();

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setActiveRole(store.getActiveRole());
      setCurrentUser(store.getCurrentUser());
      setNotifications(store.getNotifications());
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (role: UserRole, targetView: string) => {
    sound.playTap();
    store.setActiveRole(role);
    onNavigate(targetView);
  };

  const handleOpenAuth = (role: UserRole) => {
    sound.playTap();
    setAuthModalDefaultRole(role);
    setShowAuthModal(true);
    setShowUserMenu(false);
  };

  const handleAuthSuccess = (role: UserRole, targetView: string) => {
    onNavigate(targetView);
  };

  const handleMarkNotificationsRead = () => {
    sound.playTap();
    store.markAllNotificationsRead();
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, earnings, and configurations to factory defaults?')) {
      store.resetAllDataToDefaults();
      window.location.reload();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Top Announcement & Switcher Bar */}
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-500/30 text-brand-300 font-semibold text-[10px]">
              <Sparkles className="w-3 h-3 text-brand-400" />
              VENTURE PROTOTYPE
            </span>
            <span className="hidden sm:inline text-slate-400">
              India's 1st Doorstep Vehicle Training & Mentorship Marketplace
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Demo Sign In Shortcuts */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
              <span>Quick Login:</span>
              <button
                onClick={() => {
                  sound.playSuccess();
                  store.setCurrentUser(DEMO_USERS.CUSTOMER);
                  onNavigate('customer');
                }}
                className="hover:text-white underline font-medium"
              >
                Learner
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  sound.playSuccess();
                  store.setCurrentUser(DEMO_USERS.TRAINER);
                  onNavigate('trainer');
                }}
                className="hover:text-white underline font-medium"
              >
                Trainer
              </button>
              <span>•</span>
              <button
                onClick={() => {
                  sound.playSuccess();
                  store.setCurrentUser(DEMO_USERS.ADMIN);
                  onNavigate('admin');
                }}
                className="hover:text-white underline font-medium"
              >
                Admin
              </button>
            </div>

            {/* Viewport Frame Toggle (Mobile App vs Web) */}
            <button
              onClick={onToggleMobileFrame}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px]"
              title="Toggle Mobile Simulator Frame"
            >
              {isMobileFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-medium">Web View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-brand-400" />
                  <span className="font-medium">App Frame</span>
                </>
              )}
            </button>

            {/* Factory Reset */}
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition text-[11px]"
              title="Reset test data"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div 
            onClick={() => { sound.playTap(); onNavigate('website'); }}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <Car className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                  DriveSaathi
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                  INDIA
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-0.5">
                Your vehicle. Your trainer. Your confidence.
              </p>
            </div>
          </div>

          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityMenu(!showCityMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 bg-slate-50/70 hover:bg-brand-50/50 text-xs font-semibold text-slate-700 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>{selectedCity.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCityMenu && (
              <div className="absolute top-11 left-0 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
                <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Operating City
                </div>
                {cities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      sound.playTap();
                      onSelectCity(c);
                      setShowCityMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span>{c.name}</span>
                    {selectedCity.id === c.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Navigation Pills */}
          <nav className="hidden lg:flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => handleRoleChange('CUSTOMER', 'website')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'website'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Marketing & SEO
            </button>

            <button
              onClick={() => handleRoleChange('CUSTOMER', 'customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'customer'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Customer App
            </button>

            <button
              onClick={() => handleRoleChange('TRAINER', 'trainer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'trainer'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Trainer Portal
            </button>

            <button
              onClick={() => handleRoleChange('SUPER_ADMIN', 'admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentView === 'admin'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Operations
            </button>
          </nav>

          {/* Right Action Icons (Auth, SOS, Notification Bell) */}
          <div className="flex items-center gap-2">
            {/* Quick SOS Trigger Button */}
            <button
              onClick={() => {
                sound.playTap();
                setShowSosModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition shadow-sm"
              title="Emergency SOS & 24x7 Safety Help"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">SOS</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playTap();
                  setShowNotifications(!showNotifications);
                }}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 relative transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-brand-50 text-brand-600 text-[11px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkNotificationsRead}
                        className="text-xs text-brand-600 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`py-2.5 px-2 rounded-lg transition ${
                            !n.read ? 'bg-brand-50/40' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-xs text-slate-800">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  sound.playTap();
                  setShowUserMenu(!showUserMenu);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:border-brand-300 bg-slate-50 hover:bg-brand-50/50 transition"
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-white"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-brand-600 font-semibold leading-none">
                    {currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : currentUser.role === 'TRAINER' ? 'Verified Mentor' : 'Learner'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Account Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-fade-in space-y-3">
                  <div className="pb-2 border-b border-slate-100">
                    <div className="font-extrabold text-xs text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{currentUser.role} Authenticated</span>
                    </div>
                  </div>

                  {/* Switch Account Portals */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      Switch Active Account
                    </div>

                    <button
                      onClick={() => {
                        sound.playSuccess();
                        store.setCurrentUser(DEMO_USERS.CUSTOMER);
                        setShowUserMenu(false);
                        onNavigate('customer');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Learner: Mahesh Sharma</span>
                      {currentUser.role === 'CUSTOMER' && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>

                    <button
                      onClick={() => {
                        sound.playSuccess();
                        store.setCurrentUser(DEMO_USERS.TRAINER);
                        setShowUserMenu(false);
                        onNavigate('trainer');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Trainer: Priya Sharma</span>
                      {currentUser.role === 'TRAINER' && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>

                    <button
                      onClick={() => {
                        sound.playSuccess();
                        store.setCurrentUser(DEMO_USERS.ADMIN);
                        setShowUserMenu(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Super Admin: Operations Hub</span>
                      {currentUser.role === 'SUPER_ADMIN' && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  </div>

                  {/* Open Auth Modal */}
                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <button
                      onClick={() => handleOpenAuth('CUSTOMER')}
                      className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In with Phone OTP</span>
                    </button>
                    <button
                      onClick={() => handleOpenAuth('TRAINER')}
                      className="w-full py-1.5 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-medium text-center"
                    >
                      + Register as New Mentor
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-4 py-2 flex items-center justify-between gap-1 overflow-x-auto text-xs font-semibold text-slate-600">
          <button
            onClick={() => handleRoleChange('CUSTOMER', 'website')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'website' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-200'}`}
          >
            Website
          </button>
          <button
            onClick={() => handleRoleChange('CUSTOMER', 'customer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'customer' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-200'}`}
          >
            Learner App
          </button>
          <button
            onClick={() => handleRoleChange('TRAINER', 'trainer')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'trainer' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-200'}`}
          >
            Trainer Portal
          </button>
          <button
            onClick={() => handleRoleChange('SUPER_ADMIN', 'admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${currentView === 'admin' ? 'bg-brand-500 text-white shadow' : 'hover:bg-slate-200'}`}
          >
            Admin Hub
          </button>
        </div>
      </header>

      {/* Emergency SOS Modal */}
      <SosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
      />

      {/* Unified Multi-Role Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultRole={authModalDefaultRole}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
