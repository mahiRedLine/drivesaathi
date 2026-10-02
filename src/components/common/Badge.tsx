import React from 'react';
import { CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { BookingStatus } from '../../types';

export function VerifiedBadge({ text = 'Verified Mentor', size = 'sm' }: { text?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-sm px-3 py-1'}`}>
      <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
      {text}
    </span>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const configs: Record<BookingStatus, { label: string; bg: string; text: string; border: string }> = {
    DRAFT: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    PAYMENT_PENDING: { label: 'Payment Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-50', text: 'text-brand-600', border: 'border-blue-200' },
    TRAINER_ASSIGNED: { label: 'Trainer Assigned', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    TRAINER_ACCEPTED: { label: 'Trainer Accepted', bg: 'bg-cyan-50', text: 'text-cyan-800', border: 'border-cyan-200' },
    TRAINER_EN_ROUTE: { label: 'Trainer On The Way', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    TRAINER_ARRIVED: { label: 'Trainer Arrived', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    SESSION_STARTED: { label: 'Session In Progress', bg: 'bg-emerald-100 animate-pulse-subtle', text: 'text-emerald-800 font-bold', border: 'border-emerald-300' },
    SESSION_COMPLETED: { label: 'Session Finished', bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
    RATING_PENDING: { label: 'Feedback Pending', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    COMPLETED: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    CANCELLED_BY_CUSTOMER: { label: 'Cancelled by Customer', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    CANCELLED_BY_TRAINER: { label: 'Cancelled by Trainer', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    REFUND_PENDING: { label: 'Refund Pending', bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
    REFUNDED: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
    DISPUTED: { label: 'Disputed', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    NO_SHOW: { label: 'No Show', bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-300' }
  };

  const c = configs[status] || { label: status, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {c.label}
    </span>
  );
}

export function StarRating({ rating, count, showCount = true }: { rating: number; count?: number; showCount?: boolean }) {
  return (
    <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-800">
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      <span>{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-content-secondary font-normal">({count})</span>
      )}
    </div>
  );
}
