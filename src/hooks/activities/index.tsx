import { useChallengeActivities } from './useChallengeActivities';

export type ChallengeActivityWithRelations = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
  challenge_id: number;
  challenge_title?: string;
  user_display_name?: string;
  user_avatar_url?: string;
};

export const useGetActivities = (id: string) => {
  const { data: challengeActivities, isLoading } = useChallengeActivities(id);

  // Transform the data to include the joined fields
  const transformedActivities: ChallengeActivityWithRelations[] =
    challengeActivities?.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      created_at: activity.created_at,
      user_id: activity.user_id,
      challenge_id: activity.challenge_id,
      challenge_title: activity.challenges?.title,
      user_display_name: activity.profiles?.display_name,
      user_avatar_url: activity.profiles?.avatar_url,
    })) || [];

  // Sort by created_at (newest first)
  transformedActivities.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return {
    data: transformedActivities,
    isLoading,
  };
};
