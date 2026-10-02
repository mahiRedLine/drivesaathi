import React, { useState } from 'react';
import { Trainer, UserAddress } from '../../types';
import { Navigation, MapPin, Shield, ZoomIn, ZoomOut, Compass, Car, Bike, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  centerAddress?: UserAddress;
  trainers?: Trainer[];
  selectedTrainerId?: string;
  onSelectTrainer?: (trainer: Trainer) => void;
  showRoute?: boolean;
  activeEnRouteTrainer?: Trainer;
  heightClass?: string;
  interactive?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  centerAddress,
  trainers = [],
  selectedTrainerId,
  onSelectTrainer,
  showRoute = false,
  activeEnRouteTrainer,
  heightClass = 'h-[320px] md:h-[420px]',
  interactive = true
}) => {
  const [zoom, setZoom] = useState(1);
  const [hoveredTrainer, setHoveredTrainer] = useState<Trainer | null>(null);

  // Approximate relative coordinate mapping inside vector container (0 to 100%)
  const userX = 52;
  const userY = 56;

  return (
    <div className={`relative w-full ${heightClass} bg-slate-900 rounded-card overflow-hidden border border-slate-700/60 shadow-inner select-none font-sans`}>
      {/* Dynamic Grid Background representing modern vector street tiles */}
      <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" viewBox="0 0 800 500" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.8" />
          </pattern>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#3157E8" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="#0F172A" />
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />

        {/* Arterial Highway Lines */}
        <path d="M 0 120 Q 200 180 500 160 T 800 240" fill="none" stroke="#334155" strokeWidth="4" />
        <path d="M 120 0 Q 240 220 320 400 T 480 500" fill="none" stroke="#334155" strokeWidth="4" />
        <path d="M 0 350 C 250 300 450 420 800 380" fill="none" stroke="#1E293B" strokeWidth="6" />
        
        {/* Ring Road */}
        <circle cx="400" cy="275" r="140" fill="none" stroke="#1E293B" strokeWidth="3" strokeDasharray="8 6" />

        {/* If route is active, draw animated path from trainer to user */}
        {showRoute && (
          <>
            <path
              d="M 224 140 Q 320 160 416 280"
              fill="none"
              stroke="url(#route-gradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
            {/* Moving vehicle beacon along path */}
            <circle cx="320" cy="190" r="6" fill="#38BDF8" className="animate-ping" />
          </>
        )}
      </svg>

      {/* Safety Service Radius Circle around Customer */}
      <div 
        className="absolute rounded-full border border-brand-400/40 bg-brand-500/10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        style={{
          left: `${userX}%`,
          top: `${userY}%`,
          width: `${240 * zoom}px`,
          height: `${240 * zoom}px`,
        }}
      >
        <span className="absolute bottom-2 right-4 text-[10px] font-mono text-brand-300/70">
          5 km Service Radius
        </span>
      </div>

      {/* Customer Location Pin */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
        style={{ left: `${userX}%`, top: `${userY}%` }}
      >
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-brand-400 opacity-75"></span>
          <div className="relative p-2.5 bg-brand-500 text-white rounded-full shadow-lg border-2 border-white">
            <MapPin className="w-5 h-5 fill-white" />
          </div>
        </div>

        {/* Customer Address Tooltip */}
        <div className="absolute top-11 left-1/2 transform -translate-x-1/2 bg-slate-900/95 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-30 pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold">{centerAddress ? centerAddress.area : 'Your Practice Location'}</span>
        </div>
      </div>

      {/* Active En-Route Trainer Moving Marker */}
      {showRoute && activeEnRouteTrainer && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-25 transition-all duration-1000"
          style={{ left: '28%', top: '28%' }}
        >
          <div className="relative flex flex-col items-center">
            <div className="p-2 bg-purple-600 text-white rounded-full shadow-2xl border-2 border-white animate-bounce">
              <Car className="w-5 h-5" />
            </div>
            <div className="mt-1 bg-purple-950/90 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap">
              {activeEnRouteTrainer.name} (8 min away)
            </div>
          </div>
        </div>
      )}

      {/* Nearby Trainer Pins */}
      {trainers.map((trainer, idx) => {
        // Pre-computed relative coordinates around city center
        const offsets = [
          { x: 30, y: 35 }, // Indiranagar
          { x: 70, y: 68 }, // HSR
          { x: 62, y: 38 }, // Koramangala
          { x: 38, y: 72 }, // Jayanagar
          { x: 78, y: 25 }, // Whitefield
          { x: 24, y: 55 }  // Malleshwaram
        ];
        const pos = offsets[idx % offsets.length];
        const isSelected = selectedTrainerId === trainer.id;

        return (
          <div
            key={trainer.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-15 transition-transform duration-300 ${
              interactive ? 'cursor-pointer hover:scale-110 hover:z-30' : ''
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            onClick={() => onSelectTrainer && onSelectTrainer(trainer)}
            onMouseEnter={() => setHoveredTrainer(trainer)}
            onMouseLeave={() => setHoveredTrainer(null)}
          >
            <div className="relative flex flex-col items-center">
              <div
                className={`relative w-10 h-10 rounded-full p-0.5 shadow-xl border-2 transition-all ${
                  isSelected
                    ? 'border-emerald-400 ring-4 ring-emerald-400/40 scale-110'
                    : 'border-white bg-slate-800'
                }`}
              >
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute -bottom-1 -right-1 bg-brand-500 text-white p-0.5 rounded-full border border-white">
                  {trainer.vehicleExpertise.categories.includes('CAR') ? (
                    <Car className="w-2.5 h-2.5" />
                  ) : (
                    <Bike className="w-2.5 h-2.5" />
                  )}
                </span>
              </div>

              {/* Mini Price & Rating Tag */}
              <div className="mt-1 bg-slate-900/90 text-white border border-slate-700/80 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1 shadow">
                <span className="text-amber-400">★ {trainer.rating.toFixed(1)}</span>
                <span className="text-slate-400">•</span>
                <span>₹{trainer.baseHourlyRate}</span>
              </div>

              {/* Hover Card */}
              {(hoveredTrainer?.id === trainer.id || isSelected) && (
                <div className="absolute bottom-16 bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 w-52 text-left z-40 animate-fade-in pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{trainer.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                      {trainer.gender === 'FEMALE' ? 'Female Trainer' : 'Male Trainer'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{trainer.bio}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{trainer.yearsExperience} yrs exp</span>
                    <span className="text-emerald-400 font-semibold">{trainer.totalSessions}+ sessions</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Map Overlay Controls */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <Compass className="w-4 h-4 text-brand-400 animate-spin-slow" />
          <span className="text-xs font-semibold text-slate-200">
            {centerAddress ? centerAddress.city : 'Bengaluru Metro'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
            Live GPS Active
          </span>
        </div>
      </div>

      {/* Zoom / Re-center buttons */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.2, 1.6))}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 shadow-md transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.8))}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 shadow-md transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Safety & Privacy Shield Note */}
      <div className="absolute bottom-3 left-3 right-3 z-25 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Doorstep pickup with real-time encrypted GPS route</span>
        </div>
        <span className="text-slate-500 hidden sm:inline">Exact address kept private until trainer assignment</span>
      </div>
    </div>
  );
};
