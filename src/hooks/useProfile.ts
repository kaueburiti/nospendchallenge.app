import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useSession } from './useSession';
import { decode } from 'base64-arraybuffer';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
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

  return useMutation({
    mutationFn: async ({
      base64,
      fileExtension,
    }: {
      base64: string;
      fileExtension: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const fileName = `${user.id}.${fileExtension}`;
      const filePath = `avatars/${fileName}`;

      // Upload the image
      const { error: uploadError } = await supabase.storage
        .from(process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET!)
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExtension}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET!)
        .getPublicUrl(filePath);

      const avatarUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;

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
