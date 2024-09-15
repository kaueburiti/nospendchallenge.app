import React from 'react';
import { Box, Heading } from '../ui';
import HorizontalSlider from '../HorizontalSlider';
import { type Product } from '@/lib/db/models/Product';

const TopSection = ({
  items,
  sectionTitle,
}: {
  items: Product[];
  sectionTitle: string;
}) => {
  return (
    <Box className="flex-1 flex flex-col overflow-auto">
      <Heading size="xl" className="pt-6 pb-2.5 px-4">
        {sectionTitle}
      </Heading>
      <HorizontalSlider items={items} />
    </Box>
  );
};

export default TopSection;
