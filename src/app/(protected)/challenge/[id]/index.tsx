import { Button, ButtonText } from '@/components/ui';
import { router } from 'expo-router';

<Button onPress={() => router.push(`/challenge/${id}/invite`)} className="mt-4">
  <ButtonText>Invite Friends</ButtonText>
</Button>;
