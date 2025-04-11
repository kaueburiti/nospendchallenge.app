import React from 'react';
import { Share } from 'react-native';
import { Button, ButtonText } from '@/components/ui';
import { type Tables } from '@/lib/db/database.types';

interface ShareChallengeButtonProps {
  challenge: Tables<'challenges'>;
}

export function ShareChallengeButton({ challenge }: ShareChallengeButtonProps) {
  const handleShare = async () => {
    try {
      const deepLink = `nospendchallenge://challenge/${challenge.token}`;
      const webUrl = `https://nospendchallenge.app/challenge/${challenge.token}`;

      await Share.share({
        message: `Join my NoSpendChallenge: ${challenge.title}\n${deepLink}\n\nOr visit: ${webUrl}`,
        url: deepLink,
      });
    } catch (error) {
      console.error('Error sharing challenge:', error);
    }
  };

  return (
    <Button onPress={handleShare}>
      <ButtonText>Share Challenge</ButtonText>
    </Button>
  );
}
