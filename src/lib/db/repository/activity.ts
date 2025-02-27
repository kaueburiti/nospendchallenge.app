import { supabase } from '@/lib/supabase';

export type Activity = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
};

const mockActivities: Activity[] = [
  {
    id: 1,
    title: 'Morning Run',
    description: 'Completed 5km run',
    created_at: '2025-02-17T08:00:00Z',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    id: 2,
    title: 'Meditation Session',
    description: '20 minutes mindfulness',
    created_at: '2025-02-15T09:30:00Z',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
  },
  {
    id: 3,
    title: 'Reading Goal',
    description: 'Read 30 pages',
    created_at: '2025-02-10T14:15:00Z',
    user_id: '123e4567-e89b-12d3-a456-426614174000',
  },
];

export const getActivities = async () => {
  const { data, error } = await supabase.from('activities').select('*');
  if (error) throw error;
  return data;

  // return mockActivities;
};
