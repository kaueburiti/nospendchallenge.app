import React from 'react';
import { Box, Heading } from '../ui';
import HorizontalSlider from '../HorizontalSlider';
import type { Tables } from '@/lib/db/database.types';

const TopSection = ({
  items,
  sectionTitle,
}: {
  items: Tables<'challenges'>[];
  sectionTitle: string;
}) => {
  return (
    <Box className="flex flex-1 flex-col overflow-auto">
      <Heading size="xl" className="px-4 pb-2.5 pt-6">
        {sectionTitle}
      </Heading>
      <HorizontalSlider items={items} />
    </Box>
  );
};

export default TopSection;
