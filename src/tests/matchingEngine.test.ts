import { describe, it, expect } from 'vitest';
import { rankTrainersForCustomer, calculateDistanceKm } from '../services/matchingEngine';
import { MOCK_TRAINERS } from '../data/mockData';

describe('Matching Engine', () => {
  it('correctly calculates Haversine distance in KM', () => {
    // Distance between Indiranagar and HSR Layout is approx 8-9 km
    const dist = calculateDistanceKm(12.9784, 77.6408, 12.9121, 77.6446);
    expect(dist).toBeGreaterThan(6);
    expect(dist).toBeLessThan(12);
  });

  it('ranks female trainers highest when customer chooses female preference', () => {
    const results = rankTrainersForCustomer(MOCK_TRAINERS, {
      vehicleCategory: 'CAR',
      transmission: 'AUTOMATIC',
      customerLat: 12.9716,
      customerLng: 77.5946,
      genderPreference: 'FEMALE',
      requiredSkills: ['PARALLEL_PARKING', 'CITY_HEAVY_TRAFFIC']
    });

    expect(results.length).toBeGreaterThan(0);
    // Top matched trainer should be female
    expect(results[0].trainer.gender).toBe('FEMALE');
  });

  it('filters out pending or unverified trainers from top matches', () => {
    const results = rankTrainersForCustomer(MOCK_TRAINERS, {
      vehicleCategory: 'CAR',
      transmission: 'MANUAL',
      customerLat: 12.9716,
      customerLng: 77.5946,
      genderPreference: 'NO_PREFERENCE',
      requiredSkills: ['CLUTCH_CONTROL']
    });

    results.forEach(res => {
      expect(res.trainer.verifiedStatus.verificationStatus).toBe('APPROVED');
    });
  });
});
