import { TrainingGoal, ExperienceLevel, VehicleCategory } from '../types';

export interface AIAnalysisResult {
  overallConfidenceScore: number; // 0-100
  masteredSkills: string[];
  inProgressSkills: string[];
  focusAreasForNextSession: string[];
  suggestedCurriculum: {
    title: string;
    durationMinutes: number;
    drills: { time: string; activity: string; objective: string }[];
  };
  coachInsights: string;
  nextRecommendedPackageOrSession: string;
}

export function generateAICoachFeedback(
  practicedSkills: TrainingGoal[],
  trainerNotes: string,
  experienceLevel: ExperienceLevel,
  vehicleCategory: VehicleCategory
): AIAnalysisResult {
  const notesLower = trainerNotes.toLowerCase();
  const mastered: string[] = [];
  const inProgress: string[] = [];
  const focusAreas: string[] = [];

  // Skill analysis heuristics
  if (practicedSkills.includes('STARTING_STOPPING')) {
    mastered.push('Ignition & Smooth Takeoff');
  }
  if (practicedSkills.includes('STEERING_LANE_DISCIPLINE')) {
    mastered.push('Steering Centering & Lane Discipline');
  }
  if (practicedSkills.includes('CLUTCH_CONTROL')) {
    if (notesLower.includes('struggle') || notesLower.includes('stall')) {
      inProgress.push('Clutch Bite-Point & Friction Zone');
      focusAreas.push('Bite-point hold in slow traffic');
    } else {
      mastered.push('Smooth Clutch Release');
    }
  }
  if (practicedSkills.includes('PARALLEL_PARKING') || practicedSkills.includes('REVERSE_DRIVING')) {
    if (notesLower.includes('parking') || notesLower.includes('reverse')) {
      inProgress.push('Mirror Reference & Reverse Bay Entry');
      focusAreas.push('45-degree angle curb judgment and pillar clearance');
    } else {
      mastered.push('Basic Reverse Alignment');
    }
  }
  if (practicedSkills.includes('CITY_HEAVY_TRAFFIC')) {
    if (notesLower.includes('confident') || notesLower.includes('smooth')) {
      mastered.push('Junction & Roundabout Navigation');
    } else {
      inProgress.push('Bumper-to-Bumper Gap Judgment');
      focusAreas.push('Creeping forward without panic braking');
    }
  }

  if (mastered.length === 0) {
    mastered.push('Pre-drive Mirror & Seat Setup', 'Cockpit Familiarity');
  }
  if (inProgress.length === 0) {
    inProgress.push('Tight U-Turns & 3-Point Turns', 'Slope Hill Start');
    focusAreas.push('Incline start without rollback');
  }

  // Base score
  let score = 70;
  if (experienceLevel === 'ABSOLUTE_BEGINNER') score = 55;
  if (experienceLevel === 'HAS_LICENCE_NEEDS_PRACTICE') score = 75;
  if (notesLower.includes('great') || notesLower.includes('excellent')) score += 15;
  if (notesLower.includes('struggle') || notesLower.includes('nervous')) score -= 10;
  score = Math.min(95, Math.max(40, score));

  const drills = [
    { time: '15 mins', activity: 'Warm-up & Reverse Alignment', objective: 'Calibrate side mirrors and practice S-curve reverse creeping' },
    { time: '25 mins', activity: 'Parallel & 90-Degree Bay Parking', objective: 'Master 45-degree turn-in point next to parked vehicles' },
    { time: '20 mins', activity: 'Main Road Traffic Integration', objective: 'Lane changes with indicator timing and safe following distances' }
  ];

  return {
    overallConfidenceScore: score,
    masteredSkills: mastered,
    inProgressSkills: inProgress,
    focusAreasForNextSession: focusAreas.length > 0 ? focusAreas : ['Reverse & Parallel Parking drills'],
    suggestedCurriculum: {
      title: `${vehicleCategory === 'CAR' ? 'Car' : 'Two-Wheeler'} Confidence Milestone #${Math.ceil(score / 20)}`,
      durationMinutes: 60,
      drills
    },
    coachInsights: `You are making steady progress! Your steering and road awareness are stabilizing nicely. Next session will focus on parking geometry and mirror reference points so you never stress in apartment basements or mall ramps.`,
    nextRecommendedPackageOrSession: score > 75 ? 'Reverse & Parallel Parking Special (3 Sessions)' : 'Beginner Confidence Booster'
  };
}
