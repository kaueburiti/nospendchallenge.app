import { supabase } from '@/lib/supabase';
import { Tables } from '../database.types';

export const getBiggestStrike = async (userId: string): Promise<number> => {
  const { data: checks, error } = await supabase
    .from('checks')
    .select('date, challenge_id')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (error) throw new Error(error.message);
  if (!checks) return 0;

  // Group checks by challenge
  const checksByChallenge = checks.reduce(
    (acc, check) => {
      if (!acc[check.challenge_id]) {
        acc[check.challenge_id] = [];
      }
      acc[check.challenge_id].push(check.date);
      return acc;
    },
    {} as Record<number, string[]>,
  );

  // Calculate the biggest strike for each challenge
  let biggestStrike = 0;

  Object.values(checksByChallenge).forEach(dates => {
    let currentStrike = 1;
    let maxStrike = 1;

    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);

      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStrike++;
        maxStrike = Math.max(maxStrike, currentStrike);
      } else {
        currentStrike = 1;
      }
    }

    biggestStrike = Math.max(biggestStrike, maxStrike);
  });

  return biggestStrike;
};
