import { useQuery } from '@tanstack/react-query';
import { getBiggestStrike } from '@/lib/db/repository/strike';
import { useSession } from '@/hooks/useSession';

export const useBiggestStrike = () => {
  const { session } = useSession();

  return useQuery({
    queryKey: ['biggestStrike', session?.user?.id],
    queryFn: () => getBiggestStrike(session?.user?.id ?? ''),
    enabled: !!session?.user?.id,
  });
};
