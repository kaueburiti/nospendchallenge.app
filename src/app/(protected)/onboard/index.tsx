import { useContext, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Box, Button, ButtonText, HStack, VStack } from '@/components/ui';
import { useTranslation } from '@/hooks/useTranslation';
import OnboardScreen from '@/components/onboard/screen';
import buying from '@/assets/animations/buying.json';
import progress from '@/assets/animations/progress.json';
import highFive from '@/assets/animations/high-five.json';
import { RevenueCatContext } from '@/provider/RevenueCatProvider';

const screens = [
  {
    title: 'Create challenges to stop impulsive buying!',
    description:
      'Take control of your finances and build better spending habits.',
    animationSource: buying,
  },
  {
    title: 'Monitor your spending habits and see your improvement over time.',
    description:
      'Monitor your spending habits and see your improvement over time.',
    animationSource: progress,
  },
  {
    title: 'Connect with others on the same journey to financial freedom.',
    description: '',
    animationSource: highFive,
  },
];

export default function Onboard() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { isProUser } = useContext(RevenueCatContext);

  const handleNext = () => {
    if (currentIndex < screens.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace('/(protected)/paywall');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  if (isProUser) {
    router.replace('/(protected)/(tabs)/home');
  }

  return (
    <SafeAreaView className="flex-1 bg-primary-500">
      <VStack className="flex-1 justify-center">
        <Box className="flex-1 flex-col items-center justify-center">
          <OnboardScreen
            ref={flatListRef}
            screens={screens}
            onIndexChange={setCurrentIndex}
          />
          <HStack space="lg" className="flex-1 justify-center">
            {screens.map((_, index) => (
              <Box
                key={index}
                className={`h-4 w-4 rounded-full border border-white ${
                  index === currentIndex ? 'bg-primary-500' : 'bg-white'
                }`}
              />
            ))}
          </HStack>
        </Box>

        <HStack className="flex justify-between p-8">
          <Button onPress={handleBack} size="xl">
            <ButtonText>Back</ButtonText>
          </Button>

          <Button onPress={handleNext} size="xl" variant="secondary">
            <ButtonText>Next</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
}
