import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSession } from './useSession';
import useUploadImage from './storage';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = (userId?: string) => {
  const { user } = useSession();
  const id = userId ?? user?.id;

  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!id,
  });
};

export const useUpdateProfile = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Update profile in the database
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select();

      if (error) throw error;

      // Also update auth metadata for backward compatibility
      if (profileData.display_name || profileData.avatar_url) {
        await supabase.auth.updateUser({
          data: {
            full_name: profileData.display_name,
            avatar_url: profileData.avatar_url,
          },
        });
      }

      return data[0] as Profile;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { upload } = useUploadImage();

  return useMutation({
    mutationFn: async ({
      base64,
      fileExtension,
    }: {
      base64: string;
      fileExtension: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const publicUrl = await upload({
        bucket: 'profiles',
        name: 'profile-avatar',
        path: `avatars/${user.id}`,
        image: { uri: '', base64, fileExtension },
      });

      const avatarUrl = `${publicUrl}?t=${new Date().getTime()}`;

      // Update the profile with the new avatar URL
      const { data, error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)
        .select();

      if (error) throw error;

      // Update auth metadata
      await supabase.auth.updateUser({
        data: { avatar_url: avatarUrl },
      });

      return data[0] as Profile;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: error => {
      console.error('Error uploading avatar:', error);
    },
  });
};
