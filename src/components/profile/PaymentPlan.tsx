import { BadgeCheck } from 'lucide-react-native';
import { VStack, HStack, ButtonText, Text, Button, Box } from '../ui';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentPlanProps {
  isPro: boolean;
  onUpgrade: () => void;
}

export default function PaymentPlan({ isPro, onUpgrade }: PaymentPlanProps) {
  const { t } = useTranslation();

  return (
    <VStack className="gap-4">
      <HStack className="justify-between">
        <HStack className="gap-2">
          <BadgeCheck size={24} />
          <Box className="flex items-center justify-center rounded-md border border-gray-600 p-1">
            <Text>
              {isPro ? t('payment.plans.full') : t('payment.plans.basic')}
            </Text>
          </Box>
        </HStack>
      </HStack>

      <VStack className="gap-2">
        <Text>{t('profile.payment_body_text')}</Text>
        <Button onPress={onUpgrade}>
          <ButtonText>{t('profile.payment_button_label')}</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
