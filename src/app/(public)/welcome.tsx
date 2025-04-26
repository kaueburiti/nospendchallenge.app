import React, { useState } from 'react';
import { Box, VStack } from '@/components/ui';
import { Center } from '@/components/ui';
import { Heading } from '@/components/ui';
import { Text } from '@/components/ui';
import GuestLayout from '../../components/GuestLayout';
import { Span } from '@expo/html-elements';
import MeditatingWoman from '@/components/ui/illustrations/meditating-woman';
import { useTranslation } from '@/hooks/useTranslation';
import OtpEmailForm from '@/components/sign-in/OtpEmailForm';
import OtpVerificationForm from '@/components/sign-in/OtpVerificationForm';

const Welcome = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setShowVerification(true);
  };

  const handleResendCode = () => {
    // The actual resending is handled in the OtpVerificationForm
  };

  return (
    <GuestLayout>
      <VStack className="relative flex-1 items-center px-4">
        <Center className="overflow-visible">
          <Box className="animate-float">
            <MeditatingWoman height={250} width={250} />
          </Box>
        </Center>

        <VStack space="md" className={`-mt-10 w-full max-w-sm flex-1`}>
          <Box className="mb-12 flex flex-col gap-2 text-center">
            <Heading className="mb-1 text-center text-4xl">
              {t('welcome.greeting')} #
              <Span className="text-[#ff7979]">NoSpend</Span>
              Challenge
            </Heading>
            <Text className="text-center">{t('welcome.description')}</Text>
          </Box>

          <Box className="mb-8 flex flex-col gap-2 text-center">
            <Heading className="mb-1 text-center text-xl">
              {showVerification
                ? t('welcome.verify_email')
                : t('welcome.sign_in')}
            </Heading>
            {showVerification ? (
              <OtpVerificationForm
                email={email}
                onResendCode={handleResendCode}
              />
            ) : (
              <OtpEmailForm onEmailSubmit={handleEmailSubmit} />
            )}
          </Box>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Welcome;
