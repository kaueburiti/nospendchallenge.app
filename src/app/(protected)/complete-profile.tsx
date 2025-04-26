import React from 'react';
import { VStack, Box, Heading, Text } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '@/components/ui/form/input';
import { Button, ButtonText } from '@/components/ui/button';
import { profileSchema, type ProfileSchemaType } from '@/lib/schema/profile';
import { useUpdateProfile } from '@/hooks/useProfile';
import { useSession } from '@/hooks/useSession';
import { router } from 'expo-router';

const CompleteProfile = () => {
  const { session } = useSession();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = (data: ProfileSchemaType) => {
    updateProfile(
      {
        first_name: data.first_name,
        last_name: data.last_name,
        display_name: `${data.first_name} ${data.last_name}`.trim(),
      },
      {
        onSuccess: () => {
          router.replace('/(protected)/(tabs)/home');
        },
      },
    );
  };

  return (
    <Box className="flex-1 p-4">
      <VStack className="flex-1 justify-center space-y-6">
        <Heading className="text-center text-2xl">
          Complete Your Profile
        </Heading>
        <Text className="text-center">
          Please tell us a bit about yourself to get started
        </Text>

        <FormInput
          name="first_name"
          control={control}
          placeholder="First Name"
          errorMessage={errors.first_name?.message}
        />

        <FormInput
          name="last_name"
          control={control}
          placeholder="Last Name"
          errorMessage={errors.last_name?.message}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isPending}
          className="mt-4">
          <ButtonText>{isPending ? 'Saving...' : 'Continue'}</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};

export default CompleteProfile;
