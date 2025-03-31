import { supabase } from '@/lib/supabase';
import { type Tables } from '@/lib/db/database.types';

export const getChallengeActivities = async (
  ids: string[],
  limit = 5,
): Promise<Tables<'challenge_activities'>[]> => {
  const { data, error } = await supabase
    .from('challenge_activities')
    .select(
      `
      *
    `,
    )
    .order('created_at', { ascending: false })
    .in('challenge_id', ids.map(Number))
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
};
