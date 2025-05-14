import React from 'react';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Badge } from '@/components/ui/badge';
import { type User as SupabaseUser } from '@supabase/supabase-js';
import { useProfile } from '@/hooks/useProfile';
import { router } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';

interface ProfileCardProps {
  user: SupabaseUser | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = () => {
  const { data: profile } = useProfile();

  const hasToUpdateProfile = Boolean(
    !profile?.display_name || !profile?.avatar_url,
  );

  return (
    <HStack>
      <Pressable onPress={() => router.push('/profile')} className="relative">
        {hasToUpdateProfile && (
          <Badge
            className="absolute -bottom-1 -left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 p-0 text-center"
            variant="solid">
            <AlertCircle size={16} color="white" />
          </Badge>
        )}
        <Avatar className="border-2 border-primary-500 bg-primary-500">
          <AvatarFallbackText>{profile?.display_name}</AvatarFallbackText>
          {profile?.avatar_url && (
            <AvatarImage
              source={{
                uri: profile?.avatar_url,
              }}
            />
          )}
        </Avatar>
      </Pressable>
    </HStack>
  );
};
