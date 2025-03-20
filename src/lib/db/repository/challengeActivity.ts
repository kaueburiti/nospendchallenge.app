import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/db/database.types';

export type ChallengeActivity =
  Database['public']['Tables']['challenge_activities']['Row'];

export type ChallengeActivityWithRelations = ChallengeActivity & {
  challenges?: { title: string } | null;
  profiles?: { display_name: string; avatar_url: string | null } | null;
};

export const getChallengeActivities = async (
  id: string,
): Promise<ChallengeActivityWithRelations[]> => {
  const { data, error } = await supabase
    .from('challenge_activities')
    .select(
      `
      *
    `,
    )
    .order('created_at', { ascending: false })
    .eq('challenge_id', Number(id))
    .limit(20);

  console.log('ACTIVITY DATA', data);

  if (error) throw new Error(error.message);
  return data || [];
};
