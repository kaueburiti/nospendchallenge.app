import React from 'react';
import { Box, Heading, HStack, Image, Text } from './ui';
import { Pressable, ScrollView } from 'react-native';
import type { Tables } from '@/lib/db/database.types';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { PlusIcon } from 'lucide-react-native';
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
          source={{
            uri: (challenge.cover ?? 'https://placehold.co/400') as string,
          }}
          alt={String(challenge.title)}
          className="h-40 w-64 rounded-md bg-slate-300"
          resizeMode="cover"
        />
        <Box className="flex flex-col gap-1">
          <Heading className="mb-1">{challenge.title}</Heading>
          <Text className="w-64">{challenge.description}</Text>
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
              onPress={() => router.push(`/challenge/${item.id}`)}
            />
          ))}

          <Pressable
            className="flex flex-1 flex-col gap-4"
            onPress={() => router.push('/(protected)/create-challenge')}>
            <Box className="relative">
              <Box className="h-40 w-64 rounded-md bg-slate-300" />
              <Box className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-slate-400/80">
                <Plus size={46} color={'white'} />
              </Box>
            </Box>
          </Pressable>
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default HorizontalSlider;
