import { VehicleCategory, PricingRuleConfig, Coupon } from '../types';

export interface PriceCalculationRequest {
  vehicleCategory: VehicleCategory;
  durationMinutes: number; // 30, 45, 60, 90, 120
  trainerBaseRate?: number;
  isPeakHour?: boolean;
  isWeekend?: boolean;
  coupon?: Coupon | null;
  pricingConfig: PricingRuleConfig;
}

export interface CalculatedPriceBreakdown {
  durationMinutes: number;
  baseAmount: number;
  rawSessionAmount: number;
  peakSurgeAmount: number;
  weekendSurgeAmount: number;
  grossSessionAmount: number;
  platformFee: number;
  discountAmount: number;
  couponCode?: string;
  subtotalTaxable: number;
  taxesGst: number;
  totalAmountPayable: number;
  trainerEarnings: number;
  platformCommission: number;
}

export function calculateDynamicPrice(req: PriceCalculationRequest): CalculatedPriceBreakdown {
  const {
    vehicleCategory,
    durationMinutes,
    trainerBaseRate,
    isPeakHour = false,
    isWeekend = false,
    coupon = null,
    pricingConfig
  } = req;

  // 1. Determine hourly rate based on vehicle category or trainer custom rate
  let hourlyRate = trainerBaseRate;
  if (!hourlyRate) {
    if (vehicleCategory === 'CAR' || vehicleCategory === 'REFRESHER_CAR') {
      hourlyRate = pricingConfig.baseHourlyRateCar;
    } else if (vehicleCategory === 'MOTORCYCLE') {
      hourlyRate = pricingConfig.baseHourlyRateBike;
    } else {
      hourlyRate = pricingConfig.baseHourlyRateScooter;
    }
  }

  // 2. Proportion by duration
  const durationFactor = durationMinutes / 60;
  const rawSessionAmount = Math.round(hourlyRate * durationFactor);

  // 3. Peak and Weekend surge
  let peakSurgeAmount = 0;
  if (isPeakHour) {
    peakSurgeAmount = Math.round(rawSessionAmount * (pricingConfig.peakHourMultiplier - 1));
  }

  let weekendSurgeAmount = 0;
  if (isWeekend) {
    weekendSurgeAmount = Math.round(rawSessionAmount * (pricingConfig.weekendMultiplier - 1));
  }

  const grossSessionAmount = rawSessionAmount + peakSurgeAmount + weekendSurgeAmount;
  const platformFee = pricingConfig.platformFee;

  // 4. Discount calculation
  let discountAmount = 0;
  let couponCode: string | undefined;

  if (coupon && coupon.active && grossSessionAmount >= coupon.minOrderValue) {
    couponCode = coupon.code;
    if (coupon.discountType === 'FIXED') {
      discountAmount = Math.min(coupon.value, grossSessionAmount);
    } else if (coupon.discountType === 'PERCENTAGE') {
      const calculated = (grossSessionAmount * coupon.value) / 100;
      discountAmount = coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
      discountAmount = Math.round(discountAmount);
    }
  }

  // 5. Taxes (GST 18% on platform fee + gross session amount after discount)
  const taxableSubtotal = Math.max(0, grossSessionAmount - discountAmount) + platformFee;
  const taxesGst = Number((taxableSubtotal * pricingConfig.gstTaxRate).toFixed(2));
  const totalAmountPayable = Math.round(taxableSubtotal + taxesGst);

  // 6. Marketplace split
  // Trainer receives commission % of the gross session amount
  const trainerEarnings = Number((grossSessionAmount * pricingConfig.trainerCommissionPercent).toFixed(2));
  const platformCommission = Number((totalAmountPayable - taxesGst - trainerEarnings).toFixed(2));

  return {
    durationMinutes,
    baseAmount: hourlyRate,
    rawSessionAmount,
    peakSurgeAmount,
    weekendSurgeAmount,
    grossSessionAmount,
    platformFee,
    discountAmount,
    couponCode,
    subtotalTaxable: taxableSubtotal,
    taxesGst,
    totalAmountPayable,
    trainerEarnings,
    platformCommission
  };
}
