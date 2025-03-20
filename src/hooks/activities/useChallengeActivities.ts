import { useQuery } from '@tanstack/react-query';
import { getChallengeActivities } from '@/lib/db/repository/challengeActivity';

export const useChallengeActivities = (id: string) => {
  return useQuery({
    queryKey: ['challengeActivities', id],
    queryFn: () => getChallengeActivities(id),
  });
};
