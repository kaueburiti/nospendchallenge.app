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
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { useInviteToChallengeByEmail } from '@/hooks/invitations';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Analytics } from '@/lib/analytics';
import { useTranslation } from '@/hooks/useTranslation';

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

  const inviteSchema = z.object({
    email: z.string().email({ message: t('validation.email.invalid') }),
  });

  type InviteSchemaType = z.infer<typeof inviteSchema>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteSchemaType>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  const { mutate: inviteByEmail, isPending } =
    useInviteToChallengeByEmail(challengeId);

  const onSubmit = (data: InviteSchemaType) => {
    inviteByEmail(data.email, {
      onSuccess: () => {
        Analytics.challenge.invited(String(challengeId), data.email);
        showToast('success', t('invitations.success.sent'));
        reset();
        onSuccess?.();
      },
      onError: (error: Error) => {
        Analytics.error.occurred(error, 'challenge_invitation');
        showToast('error', t('invitations.errors.send'), error.message);
      },
    });
  };

  return (
    <VStack space="md">
      <Heading size="md">{t('participants.invite.title')}</Heading>
      <Text className="text-gray-500">
        {t('participants.invite.description')}
      </Text>

      <Box>
        <FormInput
          name="email"
          control={control}
          placeholder={t('participants.invite.form.email.placeholder')}
          errorMessage={errors.email?.message}
        />
      </Box>

      <Button onPress={handleSubmit(onSubmit)} disabled={isPending}>
        <ButtonText>
          {isPending
            ? t('participants.invite.form.saving_button')
            : t('participants.invite.form.save_button')}
        </ButtonText>
      </Button>
    </VStack>
  );
}
