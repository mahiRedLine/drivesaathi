import { BookingStatus, Booking } from '../types';

export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PAYMENT_PENDING', 'CANCELLED_BY_CUSTOMER'],
  PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED_BY_CUSTOMER'],
  CONFIRMED: ['TRAINER_ASSIGNED', 'TRAINER_ACCEPTED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TRAINER'],
  TRAINER_ASSIGNED: ['TRAINER_ACCEPTED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TRAINER', 'NO_SHOW'],
  TRAINER_ACCEPTED: ['TRAINER_EN_ROUTE', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TRAINER'],
  TRAINER_EN_ROUTE: ['TRAINER_ARRIVED', 'CANCELLED_BY_CUSTOMER', 'CANCELLED_BY_TRAINER', 'DISPUTED'],
  TRAINER_ARRIVED: ['SESSION_STARTED', 'NO_SHOW', 'CANCELLED_BY_CUSTOMER'],
  SESSION_STARTED: ['SESSION_COMPLETED', 'DISPUTED'],
  SESSION_COMPLETED: ['RATING_PENDING', 'COMPLETED'],
  RATING_PENDING: ['COMPLETED'],
  COMPLETED: [], // Terminal
  CANCELLED_BY_CUSTOMER: ['REFUND_PENDING', 'REFUNDED'],
  CANCELLED_BY_TRAINER: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [], // Terminal
  DISPUTED: ['REFUND_PENDING', 'COMPLETED'],
  NO_SHOW: ['REFUND_PENDING', 'COMPLETED']
};

export function canTransitionBooking(from: BookingStatus, to: BookingStatus): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

export interface CancellationRefundResult {
  eligibleForRefund: boolean;
  refundPercentage: number; // e.g. 100, 50, 0
  refundAmount: number;
  cancellationFee: number;
  reason: string;
}

export function calculateCancellationRefund(
  booking: Booking,
  cancelledBy: 'CUSTOMER' | 'TRAINER',
  hoursBeforeSession: number
): CancellationRefundResult {
  const totalPaid = booking.pricing.totalAmount;

  if (cancelledBy === 'TRAINER') {
    return {
      eligibleForRefund: true,
      refundPercentage: 100,
      refundAmount: totalPaid,
      cancellationFee: 0,
      reason: '100% full refund because the trainer cancelled the session. We also added ₹100 apology credit to your wallet.'
    };
  }

  // Customer cancellation rules
  if (hoursBeforeSession >= 6) {
    return {
      eligibleForRefund: true,
      refundPercentage: 100,
      refundAmount: totalPaid,
      cancellationFee: 0,
      reason: 'Free cancellation. 100% refund credited back to your original payment method.'
    };
  } else if (hoursBeforeSession >= 2) {
    const refundAmount = Math.round(totalPaid * 0.5);
    const cancellationFee = totalPaid - refundAmount;
    return {
      eligibleForRefund: true,
      refundPercentage: 50,
      refundAmount,
      cancellationFee,
      reason: '50% partial refund applied since cancellation was made between 2 and 6 hours before the scheduled time.'
    };
  } else {
    return {
      eligibleForRefund: false,
      refundPercentage: 0,
      refundAmount: 0,
      cancellationFee: totalPaid,
      reason: 'No refund applicable for cancellations made less than 2 hours before the session slot to compensate trainer schedule block.'
    };
  }
}
