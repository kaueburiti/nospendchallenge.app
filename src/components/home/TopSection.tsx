import React from 'react';
import { Box, Button, Heading, Text } from '../ui';
import HorizontalSlider from '../HorizontalSlider';
import type { Tables } from '@/lib/db/database.types';
import { PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';
const TopSection = ({
  items,
  sectionTitle,
}: {
  items: Tables<'challenges'>[];
  sectionTitle: string;
}) => {
  return (
    <Box className="flex flex-1 flex-col overflow-auto">
      <Box className="mb-6 flex flex-row items-center justify-between">
        <Heading size="xl">{sectionTitle}</Heading>
        <Button onPress={() => router.push('/(protected)/challenges/create')}>
          <PlusCircle size={24} color="white" />
        </Button>
      </Box>
      <HorizontalSlider items={items} />
    </Box>
  );
};

export default TopSection;
