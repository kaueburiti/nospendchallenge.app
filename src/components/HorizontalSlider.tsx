import React from 'react';
import { Box, Heading, HStack, Image, Text } from './ui';
import { Pressable, ScrollView } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { type Product } from '@/lib/db/models/Product';

interface HorizontalScrollerProps {
  items: Product[];
}

interface HorizontalSliderItemProps {
  product: Product;
  onPress: () => void;
}

const HorizontalSliderItem = ({ product, onPress }: HorizontalSliderItemProps) => {
  return (
    <Pressable className="flex-1 flex flex-col gap-4" onPress={onPress}>
      <Box className="flex-1 flex flex-col gap-4">
        <Image
          source={product.src}
          alt={product.name}
          className="w-64 h-64 rounded-md"
          resizeMode="cover"
        />
        <Box className="flex flex-col gap-1">
          <Heading className="mb-1">{product.name}</Heading>
          {product.description && (
            <Text className="w-64">{product.description}</Text>
          )}
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
          {data.map((item, index) => (
            <HorizontalSliderItem key={index} product={item} onPress={() => WebBrowser.openBrowserAsync(item.href)} />
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

export default HorizontalSlider;
