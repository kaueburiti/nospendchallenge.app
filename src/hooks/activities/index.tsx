import { useQuery } from '@tanstack/react-query';
import { getActivities } from '@/lib/db/repository/activity';

export const useGetActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: getActivities,
  });
};
