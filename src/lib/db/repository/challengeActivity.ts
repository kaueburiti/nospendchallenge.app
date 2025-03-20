import { supabase } from '@/lib/supabase';
import { type Tables } from '@/lib/db/database.types';

export const getChallengeActivities = async (
  ids: string[],
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
    .limit(20);

  console.log('ACTIVITY DATA', data);

  if (error) throw new Error(error.message);
  return data || [];
};
