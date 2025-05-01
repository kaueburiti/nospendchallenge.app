import { useQuery } from '@tanstack/react-query';
import { getChallenge } from '@/lib/db/repository/challenge';
import { getChallengeTotalSavings } from '@/lib/db/repository/check';
import { getUserChecksByChallenge } from '@/lib/db/repository/check';

interface ChallengeStatistics {
  daysProgress: number; // 0 to 1 representing progress from start to today
  savingsProgress: number; // 0 to 1 representing progress towards savings goal
  successRate: number; // 0 to 1 representing ratio of successful checks
}

export const useChallengeStatistics = (
  challengeId: number,
): ChallengeStatistics => {
  const { data: challenge } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallenge(String(challengeId)),
  });

  const { data: totalSavings } = useQuery({
    queryKey: ['challenge-total-savings', challengeId],
    queryFn: () => getChallengeTotalSavings(challengeId),
    enabled: !!challenge,
  });

  const { data: checks } = useQuery({
    queryKey: ['challenge-checks', challengeId],
    queryFn: () => getUserChecksByChallenge(challengeId),
    enabled: !!challenge,
  });

  // Calculate days progress (0 to 1)
  const daysProgress = (() => {
    if (!challenge) return 0;
    const startDate = new Date(challenge.start_date);
    const today = new Date();
    const endDate = new Date(challenge.end_date);

    const totalDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed =
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    return Math.min(Math.max(daysPassed / totalDays, 0), 1);
  })();

  // Calculate savings progress (0 to 1)
  const savingsProgress = (() => {
    if (!challenge?.savings_goal || !totalSavings) return 0;
    return Math.min(Math.max(totalSavings / challenge.savings_goal, 0), 1);
  })();

  // Calculate success rate (0 to 1)
  const successRate = (() => {
    if (!checks?.length) return 0;
    const successfulChecks = checks.filter(
      check => check.status === 'success',
    ).length;
    return successfulChecks / checks.length;
  })();

  return {
    daysProgress,
    savingsProgress,
    successRate,
  };
};
