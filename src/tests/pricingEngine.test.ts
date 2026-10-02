import { describe, it, expect } from 'vitest';
import { calculateDynamicPrice } from '../services/pricingEngine';
import { DEFAULT_PRICING_CONFIG, AVAILABLE_COUPONS } from '../data/mockData';

describe('Pricing Engine', () => {
  it('calculates 60 min standard car session with GST and platform fee', () => {
    const result = calculateDynamicPrice({
      vehicleCategory: 'CAR',
      durationMinutes: 60,
      pricingConfig: DEFAULT_PRICING_CONFIG
    });

    expect(result.rawSessionAmount).toBe(599);
    expect(result.platformFee).toBe(30);
    // Taxable subtotal = 599 + 30 = 629. GST 18% = 113.22. Total = 742.
    expect(result.subtotalTaxable).toBe(629);
    expect(result.taxesGst).toBeCloseTo(113.22, 1);
    expect(result.totalAmountPayable).toBe(742);
    // Trainer receives 80% of gross session amount = 479.20
    expect(result.trainerEarnings).toBeCloseTo(479.20, 1);
  });

  it('correctly applies ₹200 fixed discount coupon', () => {
    const coupon = AVAILABLE_COUPONS[0]; // DRIVESAFE200
    const result = calculateDynamicPrice({
      vehicleCategory: 'CAR',
      durationMinutes: 60,
      coupon,
      pricingConfig: DEFAULT_PRICING_CONFIG
    });

    expect(result.discountAmount).toBe(200);
    expect(result.couponCode).toBe('DRIVESAFE200');
    // Subtotal after coupon = (599 - 200) + 30 = 429
    expect(result.subtotalTaxable).toBe(429);
  });

  it('proportions session fee correctly for 90 and 120 minutes', () => {
    const result90 = calculateDynamicPrice({
      vehicleCategory: 'CAR',
      durationMinutes: 90,
      pricingConfig: DEFAULT_PRICING_CONFIG
    });
    // 599 * 1.5 = 898.5 -> 899
    expect(result90.rawSessionAmount).toBe(899);

    const result120 = calculateDynamicPrice({
      vehicleCategory: 'CAR',
      durationMinutes: 120,
      pricingConfig: DEFAULT_PRICING_CONFIG
    });
    // 599 * 2 = 1198
    expect(result120.rawSessionAmount).toBe(1198);
  });
});
