import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, Share2, Check, X, MapPin, Radio, BellRing } from 'lucide-react';
import { store } from '../../services/storage';
import { sound } from '../../services/sound';
import { Booking } from '../../types';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBooking?: Booking | null;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, activeBooking }) => {
  const [sosSent, setSosSent] = useState(false);
  const [sharedWithContact, setSharedWithContact] = useState(false);

  if (!isOpen) return null;

  const handleTriggerEmergencyAlert = () => {
    sound.playSosAlert();
    setSosSent(true);

    // Register high-priority incident into Central Operations Hub
    store.reportSafetyIncident({
      id: `inc-${Date.now()}`,
      bookingId: activeBooking ? activeBooking.id : 'general-sos',
      customerId: activeBooking ? activeBooking.customerId : 'cust-current',
      customerName: activeBooking ? activeBooking.customerName : 'Mahesh Sharma',
      trainerId: activeBooking?.trainerId,
      trainerName: activeBooking?.trainerName,
      type: 'SOS_TRIGGERED',
      severity: 'CRITICAL',
      status: 'OPEN',
      reportedAt: new Date().toISOString(),
      details: `SOS triggered by customer during active session. Immediate phone callback initiated. Trainer: ${activeBooking?.trainerName || 'Assigned Mentor'}`,
      location: {
        lat: activeBooking?.address.lat || 12.9716,
        lng: activeBooking?.address.lng || 77.5946,
        area: activeBooking?.address.area || 'Bengaluru Active Region'
      }
    });
  };

  const handleShareTrip = () => {
    sound.playTap();
    setSharedWithContact(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-modal shadow-2xl overflow-hidden border border-red-100">
        {/* Header Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-full">
              <AlertOctagon className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">DriveSaathi 24×7 Safety Shield</h3>
              <p className="text-xs text-red-100 mt-0.5">Emergency Assistance & Rapid Response Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Status Alert if SOS already broadcast */}
          {sosSent ? (
            <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 flex items-start gap-3 animate-pulse">
              <Radio className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900 text-sm">Emergency Alert Broadcast Active!</h4>
                <p className="text-xs text-red-700 mt-1">
                  Our central emergency dispatch team has been notified. A safety specialist is calling your registered phone right now (+91 98860 41209).
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-brand-600 flex-shrink-0" />
              <span>
                Your session is GPS-monitored. Triggering the SOS button alerts our 24×7 Safety Response Desk and provides immediate escalation options.
              </span>
            </div>
          )}

          {/* Action 1: Big SOS Trigger */}
          <div className="text-center py-2">
            {!sosSent ? (
              <button
                onClick={handleTriggerEmergencyAlert}
                className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-base rounded-2xl shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-3 transition transform active:scale-95"
              >
                <BellRing className="w-6 h-6 animate-pulse" />
                TRIGGER RAPID EMERGENCY SOS
              </button>
            ) : (
              <div className="py-3 px-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Safety Operations Center Alerted (Ref #INC-{Date.now().toString().slice(-4)})
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Direct Call to Police */}
            <a
              href="tel:112"
              onClick={() => sound.playTap()}
              className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl flex items-center gap-3 transition shadow-md group"
            >
              <div className="p-2 bg-red-500/20 text-red-400 rounded-lg group-hover:bg-red-500 group-hover:text-white transition">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-slate-100">National Emergency (112)</div>
                <div className="text-[10px] text-slate-400">Police & Medical Response</div>
              </div>
            </a>

            {/* Direct Call to DriveSaathi Hotline */}
            <a
              href="tel:18002008899"
              onClick={() => sound.playTap()}
              className="p-3.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-900 rounded-xl flex items-center gap-3 transition shadow-sm group"
            >
              <div className="p-2 bg-brand-500 text-white rounded-lg">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-xs text-brand-900">24×7 Safety Desk</div>
                <div className="text-[10px] text-brand-600">Priority Human Specialist</div>
              </div>
            </a>
          </div>

          {/* Share Live Session with Family */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-brand-500" />
                  Share Live Practice Session
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Sends live GPS link & mentor credentials to your trusted emergency contact (Anita Sharma).
                </p>
              </div>
              <button
                onClick={handleShareTrip}
                disabled={sharedWithContact}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  sharedWithContact
                    ? 'bg-emerald-100 text-emerald-800 cursor-default'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {sharedWithContact ? '✓ Shared' : 'Share Now'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {activeBooking?.address.area || 'Current Geolocation Secured'}
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
