import { VStack } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Text } from '@/components/ui';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui';
import { Input, InputField } from '@/components/ui';
import { Icon } from '@/components/ui';
import { Button, ButtonText } from '@/components/ui';
import { Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowLeftIcon } from 'lucide-react-native';
import { Pressable } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { useRouter } from 'expo-router';
import { useUpdatePassword } from '@/hooks/auth/useUpdatePassword';

const updatePasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;

const UpdatePasswordScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });
  const { updatePassword } = useUpdatePassword();
  const router = useRouter();

  const onSubmit = async (data: UpdatePasswordSchema) => {
    await updatePassword({
      newPassword: data.password,
      onSuccess: () => reset(),
    });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <VStack className="py-12 px-4 flex-1" space="md">
      <VStack className="md:items-center" space="md">
        <Pressable onPress={() => router.back()}>
          <Icon
            as={ArrowLeftIcon}
            className="md:hidden stroke-background-800"
            size="xl"
          />
        </Pressable>
        <VStack>
          <Heading className="md:text-center" size="3xl">
            Update Password
          </Heading>
          <Text className="text-sm">Enter your new password below.</Text>
        </VStack>
      </VStack>

      <VStack space="xl" className="w-full">
        <FormControl isInvalid={!!errors?.password} className="w-full">
          <FormControlLabel>
            <FormControlLabelText>New Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            defaultValue=""
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Enter new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.password?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <FormControl isInvalid={!!errors?.confirmPassword} className="w-full">
          <FormControlLabel>
            <FormControlLabelText>Confirm New Password</FormControlLabelText>
          </FormControlLabel>
          <Controller
            defaultValue=""
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Confirm new password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  secureTextEntry
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.confirmPassword?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>

        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
          <ButtonText className="font-medium">Update Password</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
};

const UpdatePassword = () => {
  return (
    <GuestLayout>
      <UpdatePasswordScreen />
    </GuestLayout>
  );
};

export default UpdatePassword;
