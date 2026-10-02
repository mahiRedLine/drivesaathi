import { describe, it, expect } from 'vitest';
import { generateAICoachFeedback } from '../services/aiCoach';

describe('AI Coach & Progress Evaluator', () => {
  it('generates personalized curriculum and highlights progress areas', () => {
    const feedback = generateAICoachFeedback(
      ['STARTING_STOPPING', 'CLUTCH_CONTROL', 'PARALLEL_PARKING'],
      'Customer stalls clutch during tight reverse parking, but lane discipline was great.',
      'HAS_LICENCE_NEEDS_PRACTICE',
      'CAR'
    );

    expect(feedback.overallConfidenceScore).toBeGreaterThanOrEqual(40);
    expect(feedback.overallConfidenceScore).toBeLessThanOrEqual(100);
    expect(feedback.suggestedCurriculum.drills.length).toBe(3);
    expect(feedback.inProgressSkills.length).toBeGreaterThan(0);
    expect(feedback.coachInsights).toContain('parking');
  });

  it('generates customized drill times adding up to 60 minutes', () => {
    const feedback = generateAICoachFeedback(
      ['CITY_HEAVY_TRAFFIC', 'HIGHWAY_LANE_MERGE'],
      'Smooth speed control, ready for highway lane changes.',
      'HAS_LICENCE_NEEDS_PRACTICE',
      'CAR'
    );

    expect(feedback.suggestedCurriculum.durationMinutes).toBe(60);
    expect(feedback.masteredSkills).toContain('Junction & Roundabout Navigation');
  });
});
