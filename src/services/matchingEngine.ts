import { Trainer, VehicleCategory, TransmissionType, GenderPreference, TrainingGoal } from '../types';

export interface MatchingCriteria {
  vehicleCategory: VehicleCategory;
  transmission: TransmissionType;
  customerLat: number;
  customerLng: number;
  genderPreference: GenderPreference;
  requiredSkills: TrainingGoal[];
  preferredLanguages?: string[];
  preferredSlot?: string;
  isEv?: boolean;
}

export interface ScoredTrainer {
  trainer: Trainer;
  score: number; // 0 - 100
  distanceKm: number;
  matchReasons: string[];
  isCompatible: boolean;
}

// Haversine distance in KM
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in KM
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function rankTrainersForCustomer(
  trainers: Trainer[],
  criteria: MatchingCriteria
): ScoredTrainer[] {
  return trainers.map((trainer) => {
    let score = 0;
    const matchReasons: string[] = [];
    const distanceKm = calculateDistanceKm(
      criteria.customerLat,
      criteria.customerLng,
      trainer.lat,
      trainer.lng
    );

    // Filter verification
    if (trainer.verifiedStatus.verificationStatus !== 'APPROVED') {
      return { trainer, score: 0, distanceKm, matchReasons: ['Pending Verification'], isCompatible: false };
    }

    // 1. Vehicle Compatibility (Weight: 25 pts)
    const categoryMatch = trainer.vehicleExpertise.categories.includes(criteria.vehicleCategory);
    const transmissionMatch = trainer.vehicleExpertise.transmissions.includes(criteria.transmission);
    const evMatch = criteria.isEv ? trainer.vehicleExpertise.electricVehicleExpert : true;

    if (categoryMatch && transmissionMatch) {
      score += 20;
      matchReasons.push('Exact Vehicle & Transmission Expert');
    } else if (categoryMatch) {
      score += 10;
    }

    if (criteria.isEv && evMatch) {
      score += 5;
      matchReasons.push('Certified EV Mentor');
    }

    // 2. Distance and Service Radius (Weight: 15 pts)
    if (distanceKm <= trainer.serviceRadiusKm) {
      // Score decreases gracefully with distance
      const distanceFactor = Math.max(0, 1 - (distanceKm / trainer.serviceRadiusKm));
      score += Math.round(15 * distanceFactor);
      if (distanceKm < 4) {
        matchReasons.push(`${distanceKm} km nearby`);
      }
    } else {
      // Outside standard radius, heavy penalty
      score -= 20;
    }

    // 3. Customer Gender Preference (Weight: 15 pts)
    if (criteria.genderPreference === 'NO_PREFERENCE') {
      score += 15; // Neutral bonus
    } else if (
      (criteria.genderPreference === 'FEMALE' && trainer.gender === 'FEMALE') ||
      (criteria.genderPreference === 'MALE' && trainer.gender === 'MALE')
    ) {
      score += 15;
      matchReasons.push(`Preferred ${trainer.gender === 'FEMALE' ? 'Female' : 'Male'} Trainer`);
    } else {
      // User specifically requested female/male and this trainer is not
      score -= 30;
    }

    // 4. Skills Match (Weight: 15 pts)
    if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
      const matchedSkills = criteria.requiredSkills.filter(skill => trainer.skills.includes(skill));
      const skillRatio = matchedSkills.length / criteria.requiredSkills.length;
      score += Math.round(15 * skillRatio);
      if (skillRatio >= 0.8) {
        matchReasons.push('Specialist in all your target skills');
      }
    } else {
      score += 10;
    }

    // 5. Availability & Slot match (Weight: 15 pts)
    if (criteria.preferredSlot && trainer.availability.slots.includes(criteria.preferredSlot)) {
      score += 15;
      matchReasons.push(`Available at ${criteria.preferredSlot}`);
    } else {
      score += 8;
    }

    // 6. Rating & Quality (Weight: 10 pts)
    if (trainer.rating >= 4.9) {
      score += 10;
      matchReasons.push(`Top Rated (${trainer.rating} ★)`);
    } else if (trainer.rating >= 4.7) {
      score += 7;
    } else {
      score += 4;
    }

    // 7. Experience & Sessions Track Record (Weight: 5 pts)
    if (trainer.totalSessions >= 1000) {
      score += 5;
      matchReasons.push('1,000+ sessions completed');
    } else if (trainer.totalSessions >= 500) {
      score += 3;
    } else {
      score += 1;
    }

    // Low cancellation reliability bonus
    if (trainer.cancellationRate <= 0.01) {
      score += 2;
    }

    const finalScore = Math.min(100, Math.max(0, score));
    const isCompatible = distanceKm <= trainer.serviceRadiusKm && (criteria.genderPreference === 'NO_PREFERENCE' || trainer.gender === criteria.genderPreference);

    return {
      trainer,
      score: finalScore,
      distanceKm,
      matchReasons: matchReasons.slice(0, 3),
      isCompatible
    };
  }).sort((a, b) => b.score - a.score);
}
