import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useJoinChallenge = () => {
  return useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log('user', user?.id, token);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.rpc('join_challenge_by_token', {
        token_param: token,
        user_id: user.id,
      });

      if (error) throw error;
    },
  });
};
