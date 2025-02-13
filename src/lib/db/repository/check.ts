import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

export const createCheck = async (
  check: Omit<Tables<'checks'>, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('checks')
    .insert({ ...check, user_id: String(user.user?.id) })
    .select();

  if (error) throw error;

  return data;
};

export const getUserChecksByChallenge = async (challengeId: number) => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('checks')
    .select()
    .eq('challenge_id', challengeId)
    .eq('user_id', String(user.user?.id));

  console.log(challengeId, user.user?.id);

  if (error) throw error;

  return data;
};
