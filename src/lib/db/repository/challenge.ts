import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

export const createChallenge = async (
  challenge: Omit<Tables<'challenges'>, 'id' | 'created_at' | 'updated_at'>,
) => {
  const { data, error } = await supabase
    .from('challenges')
    .insert(challenge)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const getUserChallenges = async (limit = 10) => {
  const { data: user } = await supabase.auth.getUser();
  const userId = String(user.user?.id);

  const challengeParticipants = await supabase
    .from('challenge_participants')
    .select()
    .eq('user_id', userId);
  const challengeIds = challengeParticipants?.data
    ?.map(participant => participant.challenge_id)
    .join(',');

  const { data, error } = await supabase
    .from('challenges')
    .select()
    .or(`owner_id.eq.${userId},id.in.(${challengeIds})`)
    .limit(limit);

  if (error) throw error;

  return data;
};

export const getChallenge = async (
  id: string,
): Promise<Tables<'challenges'> | null> => {
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
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteChallenge = async (id: number) => {
  const { error } = await supabase.from('challenges').delete().eq('id', id);

  if (error) throw error;
};
