import { describe, it, expect } from 'vitest';
import { canTransitionBooking, calculateCancellationRefund } from '../services/stateMachine';
import { INITIAL_BOOKINGS } from '../data/mockData';

describe('Booking State Machine', () => {
  it('allows valid progressive transitions', () => {
    expect(canTransitionBooking('CONFIRMED', 'TRAINER_ACCEPTED')).toBe(true);
    expect(canTransitionBooking('TRAINER_ACCEPTED', 'TRAINER_EN_ROUTE')).toBe(true);
    expect(canTransitionBooking('TRAINER_EN_ROUTE', 'TRAINER_ARRIVED')).toBe(true);
    expect(canTransitionBooking('TRAINER_ARRIVED', 'SESSION_STARTED')).toBe(true);
    expect(canTransitionBooking('SESSION_STARTED', 'SESSION_COMPLETED')).toBe(true);
  });

  it('rejects invalid arbitrary state jumps', () => {
    expect(canTransitionBooking('DRAFT', 'SESSION_COMPLETED')).toBe(false);
    expect(canTransitionBooking('CONFIRMED', 'SESSION_COMPLETED')).toBe(false);
    expect(canTransitionBooking('COMPLETED', 'SESSION_STARTED')).toBe(false);
  });

  it('computes 100% refund when customer cancels > 6 hours before slot', () => {
    const booking = INITIAL_BOOKINGS[0];
    const refund = calculateCancellationRefund(booking, 'CUSTOMER', 8);
    expect(refund.eligibleForRefund).toBe(true);
    expect(refund.refundPercentage).toBe(100);
    expect(refund.refundAmount).toBe(booking.pricing.totalAmount);
    expect(refund.cancellationFee).toBe(0);
  });

  it('computes 50% partial refund when customer cancels 2-6 hours before slot', () => {
    const booking = INITIAL_BOOKINGS[0];
    const refund = calculateCancellationRefund(booking, 'CUSTOMER', 4);
    expect(refund.eligibleForRefund).toBe(true);
    expect(refund.refundPercentage).toBe(50);
    expect(refund.refundAmount).toBe(Math.round(booking.pricing.totalAmount * 0.5));
  });

  it('always gives 100% refund if trainer cancels', () => {
    const booking = INITIAL_BOOKINGS[0];
    const refund = calculateCancellationRefund(booking, 'TRAINER', 1);
    expect(refund.eligibleForRefund).toBe(true);
    expect(refund.refundPercentage).toBe(100);
    expect(refund.refundAmount).toBe(booking.pricing.totalAmount);
  });
});
