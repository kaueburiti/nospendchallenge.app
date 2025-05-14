import { Box, Button, ButtonText, Text } from '@/components/ui';
import { Heading } from '@/components/ui/heading';
import LottieView from 'lottie-react-native';
import animation from '@/assets/animations/high-five.json';
import { useRef } from 'react';
import { Image } from 'react-native';
const ListEmptyState = ({
  title,
  description,
  ctaText,
  onCtaClick,
}: {
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}) => {
  const animationRef = useRef<LottieView>(null);

  return (
    <Box className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg p-10">
      <Image
        source={require('@/assets/images/home/giving-five.png')}
        className="h-[150px] w-[224px]"
      />
      <Box className="flex flex-col items-center justify-center">
        <Heading size="xl">{title}</Heading>
        <Text className="text-center">{description}</Text>
      </Box>
      <Button onPress={onCtaClick} size="xl">
        <ButtonText>{ctaText}</ButtonText>
      </Button>
    </Box>
  );
};

export default ListEmptyState;
