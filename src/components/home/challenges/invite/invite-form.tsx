import React from 'react';
import {
  Box,
  Button,
  ButtonText,
  Heading,
  Text,
  VStack,
} from '@/components/ui';
import FormInput from '@/components/ui/form/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInviteToChallengeByEmail } from '@/hooks/invitations';
import { Alert } from 'react-native';

const inviteSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteFormProps {
  challengeId: number;
  onSuccess?: () => void;
}

export default function InviteForm({
  challengeId,
  onSuccess,
}: InviteFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: inviteByEmail, isPending } =
    useInviteToChallengeByEmail(challengeId);

  const onSubmit = (data: InviteFormData) => {
    inviteByEmail(data.email, {
      onSuccess: () => {
        Alert.alert('Success', 'Invitation sent successfully');
        reset();
        onSuccess?.();
      },
      onError: error => {
        Alert.alert('Error', error.message);
      },
    });
  };

  return (
    <Box className="p-4">
      <VStack space="md">
        <Heading size="lg">Invite a Friend</Heading>
        <Text className="text-gray-500">
          Enter your friend's email to invite them to join this challenge
        </Text>

        <FormInput
          name="email"
          control={control}
          placeholder="friend@example.com"
          errorMessage={errors.email?.message}
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || isPending}>
          <ButtonText>
            {isPending ? 'Sending...' : 'Send Invitation'}
          </ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
