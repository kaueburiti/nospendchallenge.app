import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

export const createChallenge = async (
  challenge: Omit<Tables<'challenges'>, 'id' | 'created_at' | 'updated_at'>,
) => {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select();
  if (error) throw error;

  return data;
};

export const getChallenges = async () => {
  const { data, error } = await supabase.from('challenges').select();
  if (error) throw error;
  return data;
};
