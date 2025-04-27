import { useQuery } from '@tanstack/react-query';
import { getCheckItems } from '@/lib/db/repository/check';

export const useCheckItems = (checkId: number) => {
  return useQuery({
    queryKey: ['check-items', checkId],
    queryFn: () => getCheckItems(checkId),
    enabled: !!checkId,
  });
};
