import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Headphones,
  Clock,
  Sparkles
} from 'lucide-react';
import { sound } from '../../services/sound';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'call' | 'ticket' | 'faq'>('chat');
  const [chatMessages, setChatMessages] = useState<{ sender: 'USER' | 'AGENT'; text: string; time: string }[]>([
    { sender: 'AGENT', text: 'Hello! I am Priya from DriveSaathi 24×7 Support. How can I assist you with your driving sessions today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Session Reschedule');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sound.playTap();
    const userMsg = { sender: 'USER' as const, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulated instant agent reply after 800ms
    setTimeout(() => {
      sound.playNotification();
      let replyText = 'Thanks for reaching out! A dedicated operations executive is reviewing your request. For urgent safety help, press the SOS button anytime.';
      if (userMsg.text.toLowerCase().includes('female') || userMsg.text.toLowerCase().includes('lady')) {
        replyText = 'Yes! You can select "Female Mentor" during the booking flow. All our mentors are background & police verified.';
      } else if (userMsg.text.toLowerCase().includes('refund') || userMsg.text.toLowerCase().includes('cancel')) {
        replyText = 'Our policy offers 100% free cancellation if requested >6 hours before your slot. Refunds credit back to your payment method within 24 hours.';
      } else if (userMsg.text.toLowerCase().includes('price') || userMsg.text.toLowerCase().includes('cost')) {
        replyText = 'Our doorstep sessions start at ₹599/hr for Cars and ₹499/hr for Two-Wheelers in your city, with discounts up to 25% on 5-session packages.';
      }
      setChatMessages(prev => [...prev, { sender: 'AGENT', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    setTicketSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-modal shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[88vh]">

        {/* Support Header */}
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">DriveSaathi 24×7 Care & Help</h3>
              <p className="text-xs text-brand-200">Doorstep Mentorship Support & Safety Desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/15 rounded-lg text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Tabs */}
        <div className="bg-slate-100 p-2 flex items-center gap-1 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => { sound.playTap(); setActiveTab('chat'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Chat</span>
          </button>
          <button
            onClick={() => { sound.playTap(); setActiveTab('call'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'call' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Us</span>
          </button>
          <button
            onClick={() => { sound.playTap(); setActiveTab('ticket'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ticket' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Raise Ticket</span>
          </button>
          <button
            onClick={() => { sound.playTap(); setActiveTab('faq'); }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'faq' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FAQs</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">

          {/* 1. LIVE CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[340px] space-y-3">
              <div className="flex-1 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                        msg.sender === 'USER'
                          ? 'bg-brand-500 text-white rounded-br-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything (female mentors, refunds, vehicle)..."
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

          {/* 2. CALL US TAB */}
          {activeTab === 'call' && (
            <div className="space-y-4 text-center py-2 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto text-2xl shadow-inner">
                <Phone className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900">24×7 Customer & Safety Helpline</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Speak directly with an operations coordinator for doorstep session assistance or emergency support.
                </p>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <a
                  href="tel:18002008899"
                  onClick={() => sound.playTap()}
                  className="p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-between shadow transition group"
                >
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-400">Toll-Free Support Line</div>
                    <div className="text-lg font-black text-white">1800-200-8899</div>
                  </div>
                  <div className="p-2 bg-brand-500 text-white rounded-xl">
                    <Phone className="w-4 h-4" />
                  </div>
                </a>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 text-left">
                  <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Average connection time: <strong>&lt; 15 seconds</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* 3. RAISE A TICKET TAB */}
          {activeTab === 'ticket' && (
            <div className="space-y-3 animate-fade-in">
              {!ticketSubmitted ? (
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                    <select
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      <option value="Session Reschedule">Reschedule Session Date/Time</option>
                      <option value="Vehicle Change">Change Practice Vehicle Model</option>
                      <option value="Billing Dispute">Billing & Payment Receipt Inquiry</option>
                      <option value="Mentor Feedback">Trainer Conduct or Feedback</option>
                      <option value="Other">Other Operational Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Describe your request</label>
                    <textarea
                      rows={3}
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      placeholder="Please provide booking ID or session details..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                  >
                    <span>Submit Support Ticket</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">Ticket #DS-CARE-8491 Created</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    We have assigned this to our Bangalore operations desk. You will receive an SMS and email update shortly.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    Create Another Ticket
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. TOP FAQS TAB */}
          {activeTab === 'faq' && (
            <div className="space-y-2.5 text-xs animate-fade-in">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">Can I request a female driving trainer?</h5>
                <p className="text-slate-600 text-[11px]">
                  Yes! During booking, choose "Female Mentor" and our matching algorithm will prioritize verified female trainers in your neighborhood.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">What is the cancellation & refund policy?</h5>
                <p className="text-slate-600 text-[11px]">
                  100% free cancellation if done &gt; 6 hours before session. If trainer cancels, you receive 100% refund + ₹100 apology credit.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">What if I don't have my own car yet?</h5>
                <p className="text-slate-600 text-[11px]">
                  Select "Need Trainer Car" during booking and your mentor will bring a dual-pedal practice vehicle to your doorstep.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Verified Operations Desk</span>
          </span>
          <span>care@drivesaathi.in</span>
        </div>
      </div>
    </div>
  );
};
