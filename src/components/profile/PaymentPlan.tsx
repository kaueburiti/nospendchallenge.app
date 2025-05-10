import { Check } from 'lucide-react-native';
import { VStack, HStack, ButtonText, Text, Button, Box, Heading } from '../ui';
import { useTranslation } from '@/hooks/useTranslation';

interface PaymentPlanProps {
  isPro: boolean;
  onUpgrade: () => void;
}

// TODO: Translations!

export default function PaymentPlan({ onUpgrade }: PaymentPlanProps) {
  const { t } = useTranslation();

  return (
    <VStack
      space="lg"
      className="my-4 flex justify-center rounded-lg border border-gray-300 bg-slate-100 px-6 py-4 text-center">
      <VStack>
        <Heading size="lg" className="text-center">
          {t('profile.payment_title')}
        </Heading>
        <Text className="text-center text-sm">
          {t('profile.payment_body_text')}
        </Text>
      </VStack>

      <VStack space="sm" className="mb-2">
        <HStack>
          <Box className="basis-3/5 gap-2">
            <Text className="font-bold">Features</Text>
          </Box>

          <Box className="flex w-full basis-1/5 items-center justify-center gap-2 rounded-lg">
            <Text className="font-bold">Pro</Text>
          </Box>

          <Box className="flex w-full basis-1/5 items-center justify-center gap-2 rounded-lg">
            <Text className="font-bold">Basic</Text>
          </Box>
        </HStack>

        <VStack space="sm">
          <PaymentFeatureRow feature="Challenges" isFree={true} />
          <PaymentFeatureRow feature="Wishlist" isFree={true} />
          <PaymentFeatureRow feature="AI Assistant to Buying Decisions" />
          <PaymentFeatureRow feature="Challenge Progress Stats" />
          <PaymentFeatureRow feature="Savings Goals" />
          <PaymentFeatureRow feature="Saved Amount per check" />
          <PaymentFeatureRow feature="Impulsive Purchases per check" />
        </VStack>
      </VStack>

      <Button onPress={onUpgrade}>
        <ButtonText>{t('profile.payment_button_label')}</ButtonText>
      </Button>
    </VStack>
  );
}

function PaymentFeatureRow({
  feature,
  isFree,
}: {
  feature: string;
  isFree?: boolean;
}) {
  return (
    <HStack>
      <VStack className="basis-3/5 gap-2">
        <Text className="text-sm">{feature}</Text>
      </VStack>

      <Box className="flex w-full basis-1/5 items-center justify-center gap-2 rounded-lg">
        <Check size={20} color="#1ABC9C" className="text-primary-500" />
      </Box>

      {isFree ? (
        <Box className="flex w-full basis-1/5 items-center justify-center gap-2 rounded-lg">
          <Check size={20} color="#1ABC9C" className="text-primary-500" />
        </Box>
      ) : (
        <Box className="flex w-full basis-1/5 items-center justify-center gap-2 rounded-lg">
          <Text className="text-sm">-</Text>
        </Box>
      )}
    </HStack>
  );
}
