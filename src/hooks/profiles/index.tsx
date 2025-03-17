import { getMultipleProfiles } from '@/lib/db/repository/profiles';
import { useQuery } from '@tanstack/react-query';

export const useMultipleProfiles = (userIds: string[]) => {
  return useQuery({
    queryKey: ['profiles', userIds],
    queryFn: () => getMultipleProfiles(userIds),
  });
};
