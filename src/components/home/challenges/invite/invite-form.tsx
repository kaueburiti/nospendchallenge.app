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
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { Analytics } from '@/lib/analytics';
import { useTranslation } from '@/hooks/useTranslation';

const inviteSchema = z.object({
  email: z.string().email({ message: 'invite.errors.invalid_email' }),
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
  const { t } = useTranslation();
  const { showToast } = useSimpleToast();
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
        Analytics.challenge.invited(String(challengeId), data.email);
        showToast('success', t('invite.success'));
        reset();
        onSuccess?.();
      },
      onError: error => {
        Analytics.error.occurred(error, 'challenge_invitation');
        showToast('error', t('common.error'), error.message);
      },
    });
  };

  return (
    <Box>
      <VStack space="md">
        <Heading size="md">{t('invite.title')}</Heading>
        <Text className="text-gray-500">{t('invite.description')}</Text>

        <FormInput
          name="email"
          control={control}
          placeholder={t('invite.email_placeholder')}
          errorMessage={
            errors.email?.message ? t(errors.email.message) : undefined
          }
        />

        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting || isPending}>
          <ButtonText>
            {isPending ? t('invite.sending') : t('invite.send')}
          </ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
