import { Box, Button, ButtonText, Text } from '@/components/ui';
import { Heading } from '@/components/ui/heading';

const ListEmptyState = ({
  title,
  description,
  ctaText,
  onCtaClick,
}: {
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
}) => {
  return (
    <Box className="flex flex-1 flex-col items-center justify-center gap-6 rounded-lg border border-slate-300 bg-slate-100/70 p-10">
      <Box className="flex flex-col items-center justify-center">
        <Heading size="xl">{title}</Heading>
        <Text className="text-center">{description}</Text>
      </Box>
      <Button onPress={onCtaClick}>
        <ButtonText>{ctaText}</ButtonText>
      </Button>
    </Box>
  );
};

export default ListEmptyState;
