import { Box, Button } from '@/components/ui';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';

const RecentActivitiesEmptyState = () => {
  return (
    <Box className="mb-10 flex flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-slate-200 p-10">
      <Box className="flex flex-col items-center justify-center">
        <Heading size="lg">No activities yet</Heading>
        <Text className="text-center">
          Create your first activity to get started
        </Text>
      </Box>
      <Button
        size="sm"
        onPress={() => router.push('/(protected)/create-challenge')}>
        <Text className="text-sm text-white">Start First Challenge</Text>
      </Button>
    </Box>
  );
};

export default RecentActivitiesEmptyState;
