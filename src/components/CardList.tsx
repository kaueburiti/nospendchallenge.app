import { Pressable } from "react-native";
import { VStack, HStack, Image, Text, Box } from "./ui";
import { type Product } from '@/lib/db/models/Product';

const CardList = ({
    products,
  }: {
    activeTab: string;
    products: Product[];
  }) => {
    return (
      <VStack className="flex-1 w-full">
        {products.map((product, index) => (
            <Box
              key={index}
              className={`flex-1 my-2 lg:my-0 ${
                index === 0 ? 'lg:ml-0' : 'lg:ml-2'
              } ${index === products.length - 1 ? 'lg:mr-0' : 'lg:mr-2'}`}>
              <Pressable className="w-full">
                <Box className="overflow-hidden rounded-md h-72">
                  <Image
                    source={{ uri: product.src }}
                    className={'w-full h-72 scale-100 opacity-100'}
                    alt={product.name}
                  />
                </Box>
              </Pressable>
              <HStack className="justify-between py-2 items-start">
                <VStack space="sm" className="flex-1">
                  <Text className="font-semibold text-typography-900">
                    {product.name}
                  </Text>
                  <Text size="sm" className="text-typography-500">
                    {product.description}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
      </VStack>
    );
  };

export default CardList;
