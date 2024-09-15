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
import { Button, ButtonSpinner, ButtonText } from '@/components/ui';
import { Keyboard } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { Pressable } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { useRouter } from 'expo-router';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
});

type forgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<forgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const { resetPassword, isLoading } = useResetPassword();
  const router = useRouter();

  const onSubmit = async (data: forgotPasswordSchemaType) => {
    await resetPassword({ email: data.email, onSuccess: () => reset() });
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    void handleSubmit(onSubmit)();
  };

  return (
    <GuestLayout>
      <VStack className="py-12 px-4 flex-1" space="md">
        <VStack className="md:items-center" space="md">
          <Pressable onPress={() => router.back()}>
            <Icon
              as={ArrowLeft}
              className="md:hidden stroke-background-800"
              size="xl"
            />
          </Pressable>
          <VStack>
            <Heading className="md:text-center" size="3xl">
              Forgot Password?
            </Heading>
            <Text className="text-sm">
              Enter email ID associated with your account.
            </Text>
          </VStack>
        </VStack>

        <VStack space="xl" className="w-full ">
          <FormControl isInvalid={!!errors?.email} className="w-full">
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Controller
              defaultValue=""
              name="email"
              control={control}
              rules={{
                validate: async value => {
                  try {
                    await forgotPasswordSchema.parseAsync({ email: value });
                    return true;
                  } catch (error) {
                    return (error as Error).message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    placeholder="Enter email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    returnKeyType="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.email?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
          <Button
            className="w-full"
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}>
            {!isLoading ? (
              <ButtonText className="font-medium">Send Link</ButtonText>
            ) : (
              <ButtonSpinner />
            )}
          </Button>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default ForgotPasswordScreen;
