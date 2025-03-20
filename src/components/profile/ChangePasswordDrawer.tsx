import React, { useState } from 'react';
import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
  Heading,
  Text,
  HStack,
} from '@/components/ui';
import { BottomDrawer } from '@/components/BottomDrawer';
import { supabase } from '@/lib/supabase';
import { useSimpleToast } from '@/hooks/useSimpleToast';
import { i18n } from '@/i18n';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface ChangePasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, i18n.t('validation.password_min_length')),
    newPassword: z.string().min(6, i18n.t('validation.password_min_length')),
    confirmPassword: z
      .string()
      .min(6, i18n.t('validation.password_min_length')),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: i18n.t('validation.passwords_must_match'),
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ChangePasswordDrawer: React.FC<ChangePasswordDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useSimpleToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);

      // First verify the current password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email ?? '',
        password: data.currentPassword,
      });

      if (signInError) {
        toast.showToast('error', i18n.t('profile.current_password_incorrect'));
        setIsLoading(false);
        return;
      }

      // If current password is correct, update to the new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        toast.showToast('error', i18n.t('profile.password_update_failed'));
      } else {
        toast.showToast('success', i18n.t('profile.password_updated'));
        reset();
        onClose();
      }
    } catch (error) {
      toast.showToast('error', i18n.t('common.error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <BottomDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={i18n.t('profile.change_password')}>
      <VStack space="3xl">
        <Text>{i18n.t('profile.change_password_description')}</Text>

        <VStack space="md">
          <Controller
            control={control}
            name="currentPassword"
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={!!errors.currentPassword}>
                <FormControlLabel>
                  <FormControlLabelText>
                    {i18n.t('profile.current_password')}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={value}
                    onChangeText={onChange}
                  />
                  <Pressable
                    onPress={() =>
                      setShowCurrentPassword(!showCurrentPassword)
                    }>
                    {showCurrentPassword ? (
                      <Eye size={20} color="gray" />
                    ) : (
                      <EyeOff size={20} color="gray" />
                    )}
                  </Pressable>
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.currentPassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={!!errors.newPassword}>
                <FormControlLabel>
                  <FormControlLabelText>
                    {i18n.t('profile.new_password')}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type={showNewPassword ? 'text' : 'password'}
                    value={value}
                    onChangeText={onChange}
                  />
                  <Pressable
                    onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <Eye size={20} color="gray" />
                    ) : (
                      <EyeOff size={20} color="gray" />
                    )}
                  </Pressable>
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.newPassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormControlLabel>
                  <FormControlLabelText>
                    {i18n.t('profile.confirm_password')}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={value}
                    onChangeText={onChange}
                  />
                  <Pressable
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    {showConfirmPassword ? (
                      <Eye size={20} color="gray" />
                    ) : (
                      <EyeOff size={20} color="gray" />
                    )}
                  </Pressable>
                </Input>
                <FormControlError>
                  <FormControlErrorText>
                    {errors.confirmPassword?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            )}
          />
        </VStack>
        <HStack space="sm" className="mt-auto justify-end">
          <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}
            className="mr-2">
            <ButtonText>{i18n.t('common.cancel')}</ButtonText>
          </Button>
          <Button onPress={handleSubmit(onSubmit)} isDisabled={isLoading}>
            <ButtonText>{i18n.t('common.save')}</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </BottomDrawer>
  );
};

export default ChangePasswordDrawer;
