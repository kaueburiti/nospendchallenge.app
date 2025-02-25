import { Box, Button, ButtonText } from '@/components/ui';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

const ChallengesEmptyState = () => {
  return (
    <Box className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-primary-500 p-10">
      <Box className="flex flex-col items-center justify-center">
        <Heading size="xl">No challenges yet</Heading>
        <Text className="text-content-50 text-center">
          Create your first challenge to get started
        </Text>
      </Box>
      <Button onPress={() => router.push('/(protected)/create-challenge')}>
        <ButtonText>Create Challenge</ButtonText>
      </Button>
    </Box>
  );
};

export default ChallengesEmptyState;
