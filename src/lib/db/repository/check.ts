import { supabase } from '@/lib/supabase';
import type { Tables } from '../database.types';

export const createCheck = async (
  check: Omit<Tables<'checks'>, 'id' | 'created_at' | 'updated_at' | 'user_id'>,
) => {
  const { data: user } = await supabase.auth.getUser();
  const formattedDate = new Date(check.date).toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('checks')
    .insert({
      ...check,
      user_id: String(user.user?.id),
      date: formattedDate,
    })
    .select();

  if (error) {
    console.error('Error details:', error);
    throw error;
  }

  return data;
};

export const getUserChecksByChallenge = async (challengeId: number) => {
  const { data: user } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('checks')
    .select()
    .eq('challenge_id', challengeId)
    .eq('user_id', String(user.user?.id));

  if (error) throw error;

  return data;
};

type CheckWithProfile = Tables<'checks'> & {
  profiles: {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
  } | null;
};

export const getAllChecksByChallenge = async (
  challengeId: number,
): Promise<CheckWithProfile[]> => {
  const { data, error } = await supabase
    .from('checks')
    .select(
      `
      *,
      profiles:user_id (
        id,
        display_name,
        first_name,
        last_name,
        avatar_url,
        created_at,
        updated_at
      )
    `,
    )
    .eq('challenge_id', challengeId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching checks with profiles:', error);
    throw error;
  }

  return data;
};

// Delete a check
export const deleteCheck = async (checkId: number) => {
  const { error } = await supabase.from('checks').delete().eq('id', checkId);

  if (error) throw error;

  return true;
};

// Get the total savings for a challenge
export const getChallengeTotalSavings = async (challengeId: number) => {
  const { data, error } = await supabase.rpc('get_challenge_total_savings', {
    challenge_id_param: challengeId,
  });

  if (error) {
    console.error('Error getting total savings:', error);
    throw error;
  }

  return data;
};

// Get savings history by challenge (for chart visualization)
export const getChallengeSavingsHistory = async (challengeId: number) => {
  const { data, error } = await supabase
    .from('checks')
    .select('date, saved_amount')
    .eq('challenge_id', challengeId)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching savings history:', error);
    throw error;
  }

  return data;
};
