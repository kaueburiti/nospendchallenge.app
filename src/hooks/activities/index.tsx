import { useQuery } from '@tanstack/react-query';
import { getChallengeActivities } from '@/lib/db/repository/challengeActivity';

export const useChallengesActivities = (ids: string[]) => {
  return useQuery({
    queryKey: ['challengeActivities', ids],
    queryFn: () => getChallengeActivities(ids),
  });
};
