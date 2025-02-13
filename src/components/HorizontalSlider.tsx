import React from 'react';
import { Box, Heading, HStack, Image, Text } from './ui';
import { Pressable, ScrollView } from 'react-native';
import type { Tables } from '@/lib/db/database.types';
interface HorizontalScrollerProps {
  items: Tables<'challenges'>[];
}

interface HorizontalSliderItemProps {
  challenge: Tables<'challenges'>;
  onPress: () => void;
}

const HorizontalSliderItem = ({
  challenge,
  onPress,
}: HorizontalSliderItemProps) => {
  return (
    <Pressable className="flex flex-1 flex-col gap-4" onPress={onPress}>
      <Box className="flex flex-1 flex-col gap-4">
        <Image
          source={{ uri: 'https://placehold.co/400' }}
          alt={String(challenge.title)}
          className="h-64 w-64 rounded-md bg-slate-300"
          resizeMode="cover"
        />
        <Box className="flex flex-col gap-1">
          <Heading className="mb-1">{challenge.title}</Heading>
          <Text className="w-64">Lorem ipsum dolor sit amet</Text>
        </Box>
      </Box>
    </Pressable>
  );
};

const HorizontalSlider = ({ items: data }: HorizontalScrollerProps) => {
  return (
    <Box className="w-full">
      <ScrollView
        horizontal
        style={{ width: '100%' }}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={50}>
        <HStack space="md" className="w-full px-4 md:px-0">
          {data.map(item => (
            <HorizontalSliderItem
              key={item.id}
              challenge={item}
              onPress={() => console.log(item)}
            />
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default HorizontalSlider;
