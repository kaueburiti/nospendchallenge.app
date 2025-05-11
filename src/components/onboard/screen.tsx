import { forwardRef, useRef } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { Box, Heading, Text, VStack } from '@/components/ui';
import LottieView, { type AnimationObject } from 'lottie-react-native';

const { width } = Dimensions.get('window');

interface Screen {
  title: string;
  description: string;
  animationSource: AnimationObject;
}

interface OnboardScreenProps {
  screens: Screen[];
  onIndexChange: (index: number) => void;
}

const OnboardScreen = forwardRef<FlatList, OnboardScreenProps>(
  ({ screens, onIndexChange }, ref) => {
    const animation = useRef<LottieView>(null);
    const renderItem = ({ item }: { item: Screen }) => (
      <Box className="h-full w-screen flex-1 flex-col justify-center px-8">
        <VStack className="items-center" space="4xl">
          <Box className="h-72 w-72">
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 288,
                height: 288,
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={item.animationSource}
            />
          </Box>

          <VStack className="items-center">
            <Heading size="xl" className="mb-2 text-center text-white">
              {item.title}
            </Heading>
            <Text className="text-center text-white">{item.description}</Text>
          </VStack>
        </VStack>
      </Box>
    );

    return (
      <FlatList
        ref={ref}
        data={screens}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          onIndexChange(index);
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  },
);

OnboardScreen.displayName = 'OnboardScreen';

export default OnboardScreen;
