import { supabase } from '@/lib/supabase';

export const getMultipleProfiles = async (userIds: string[]) => {
  console.log(userIds);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('id', userIds)
    .limit(3);

  if (error) throw error;

  return data;
};
