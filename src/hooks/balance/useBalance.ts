import { useQuery } from '@tanstack/react-query';
import { getAllChallengesSavingsHistory } from '@/lib/db/repository/check';
import { getUserChallenges } from '@/lib/db/repository/challenge';

export interface BalanceData {
  totalSaved: number;
  totalSpent: number;
  netBalance: number;
  history: {
    date: string;
    savedAmount: number | null;
    spentAmount: number;
    status: string;
    challengeId: number;
  }[];
  challenges: {
    id: number;
    title: string;
    totalSaved: number;
    totalSpent: number;
    netBalance: number;
  }[];
}

export const useBalance = () => {
  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['balance', 'history'],
    queryFn: getAllChallengesSavingsHistory,
  });

  const { data: challenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['balance', 'challenges'],
    queryFn: () => getUserChallenges(),
  });

  const isLoading = isLoadingHistory || isLoadingChallenges;

  // Calculate totals and format data
  const balanceData: BalanceData | undefined =
    history && challenges
      ? {
          totalSaved: history.reduce(
            (sum, check) => sum + (check.saved_amount ?? 0),
            0,
          ),
          totalSpent: history.reduce(
            (sum, check) => sum + check.spent_amount,
            0,
          ),
          netBalance: history.reduce(
            (sum, check) =>
              sum + (check.saved_amount ?? 0) - check.spent_amount,
            0,
          ),
          history: history.map(check => ({
            date: check.date,
            savedAmount: check.saved_amount,
            spentAmount: check.spent_amount,
            status: check.status,
            challengeId: check.challenge_id,
          })),
          challenges: challenges.map(challenge => {
            const challengeHistory = history.filter(
              check => check.challenge_id === challenge.id,
            );
            const totalSaved = challengeHistory.reduce(
              (sum, check) => sum + (check.saved_amount ?? 0),
              0,
            );
            const totalSpent = challengeHistory.reduce(
              (sum, check) => sum + check.spent_amount,
              0,
            );

            return {
              id: challenge.id,
              title: challenge.title,
              totalSaved,
              totalSpent,
              netBalance: totalSaved - totalSpent,
            };
          }),
        }
      : undefined;

  return {
    data: balanceData,
    isLoading,
  };
};
