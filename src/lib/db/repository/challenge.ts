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

export const getUserChallenges = async () => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('challenges')
    .select()
    .eq('owner_id', String(user.user?.id));

  if (error) throw error;

  return data;
};

export const getChallenge = async (id: string) => {
  const { data, error } = await supabase
    .from('challenges')
    .select()
    .eq('id', Number(id))
    .single();

  if (error) throw error;
  return data;
};

export const updateChallenge = async (
  challenge: Partial<Tables<'challenges'>> & { id: number },
) => {
  const { data, error } = await supabase
    .from('challenges')
    .update(challenge)
    .eq('id', challenge.id)
    .select();

  if (error) throw error;
  return data;
};

export const deleteChallenge = async (id: number) => {
  const { error } = await supabase.from('challenges').delete().eq('id', id);

  if (error) throw error;
};
