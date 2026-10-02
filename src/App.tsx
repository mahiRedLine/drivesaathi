import React, { useState, useEffect } from 'react';
import { store } from './services/storage';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MarketingWebsite } from './views/website/MarketingWebsite';
import { CustomerApp } from './views/customer/CustomerApp';
import { TrainerPortal } from './views/trainer/TrainerPortal';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { CityConfig, VehicleCategory } from './types';
import { sound } from './services/sound';

export const App: React.FC = () => {
  const cities = store.getCities();
  const [selectedCity, setSelectedCity] = useState<CityConfig>(cities[0]); // Bengaluru
  const [currentView, setCurrentView] = useState<string>(store.getActiveView());
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [initialBookingCategory, setInitialBookingCategory] = useState<VehicleCategory>('CAR');
  const [initialBookingTrainerId, setInitialBookingTrainerId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      // Synchronize view if needed
    });

    // Simulated WebSocket background event after 30s to demonstrate live push notification
    const timer = setTimeout(() => {
      store.addNotification({
        id: `notif-live-${Date.now()}`,
        title: 'Mentor Traffic Update 🚗',
        message: 'Priya Sharma is 8 minutes away with live GPS radar tracking.',
        timestamp: 'Just now',
        read: false,
        type: 'TRAINER'
      });
    }, 25000);

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  const handleNavigate = (view: string, subView?: string) => {
    sound.playTap();
    if (view === 'customer' && subView) {
      if (subView === 'vehicle') setInitialBookingCategory('CAR');
    }
    if (view === 'website' && subView?.startsWith('city-')) {
      const cityId = subView.replace('city-', '');
      const matched = cities.find(c => c.id === cityId);
      if (matched) setSelectedCity(matched);
      view = 'website';
    }
    setCurrentView(view);
    store.setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartBookingFromWebsite = (category?: VehicleCategory) => {
    if (category) setInitialBookingCategory(category);
    setInitialBookingTrainerId(undefined);
    handleNavigate('customer');
  };

  const handleSelectTrainerFromWebsite = (trainerId: string) => {
    setInitialBookingTrainerId(trainerId);
    handleNavigate('customer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-content-primary">
      {/* Global Navbar Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedCity={selectedCity}
        onSelectCity={(city) => setSelectedCity(city)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {isMobileFrame ? (
          <div className="py-6 px-4 bg-slate-900/10 min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="mobile-simulator-bezel shadow-2xl animate-fade-in">
              {/* Dynamic Island Notch */}
              <div className="mobile-simulator-island">
                <span className="text-[10px] font-mono text-white/90 font-bold">09:41</span>
                <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700"></div>
                <div className="flex items-center gap-1 text-[9px] text-white/90 font-mono">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mobile Viewport Content Area */}
              <div className="pt-12 pb-2 flex-1 overflow-y-auto no-scrollbar">
                {(currentView === 'website' || currentView === 'marketing') && (
                  <MarketingWebsite
                    selectedCity={selectedCity}
                    onStartBooking={handleStartBookingFromWebsite}
                    onSelectTrainer={handleSelectTrainerFromWebsite}
                  />
                )}
                {currentView === 'customer' && (
                  <CustomerApp
                    selectedCity={selectedCity}
                    initialCategory={initialBookingCategory}
                    initialTrainerId={initialBookingTrainerId}
                    onNavigateToTrainerPortal={() => handleNavigate('trainer')}
                    isMobileFrame={true}
                  />
                )}
                {currentView === 'trainer' && <TrainerPortal />}
                {currentView === 'admin' && <AdminDashboard />}
              </div>

              {/* iOS Home Bar Indicator */}
              <div className="mobile-home-indicator"></div>
            </div>
          </div>
        ) : (
          <>
            {(currentView === 'website' || currentView === 'marketing') && (
              <MarketingWebsite
                selectedCity={selectedCity}
                onStartBooking={handleStartBookingFromWebsite}
                onSelectTrainer={handleSelectTrainerFromWebsite}
              />
            )}
            {currentView === 'customer' && (
              <CustomerApp
                selectedCity={selectedCity}
                initialCategory={initialBookingCategory}
                initialTrainerId={initialBookingTrainerId}
                onNavigateToTrainerPortal={() => handleNavigate('trainer')}
              />
            )}
            {currentView === 'trainer' && <TrainerPortal />}
            {currentView === 'admin' && <AdminDashboard />}
          </>
        )}
      </main>

      {/* Global Footer (shown on website & desktop views) */}
      {(currentView === 'website' || currentView === 'marketing') && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};
