import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/lib/db/database.types';

export const useChallenge = (token: string) => {
  return useQuery({
    queryKey: ['challenge', token],
    queryFn: async () => {
      console.log(token);
      const { data, error } = await supabase.rpc('get_challenge_by_token', {
        token_param: token,
      });

      if (error) throw error;
      return data[0] as Tables<'challenges'>;
    },
    enabled: !!token,
  });
};
