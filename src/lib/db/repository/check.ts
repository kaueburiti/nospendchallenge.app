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
  profiles: Tables<'profiles'> | null;
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
        avatar_url
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
