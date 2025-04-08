import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';
import { ChallengeForm } from '@/components/home/challenges/form/challenge-form';
import { useRouter } from 'expo-router';

export default function CreateChallenge() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <ChallengeForm
        title="Create Challenge"
        subtitle="Create a new challenge"
        onSuccess={() => {
          router.replace('/(protected)/(tabs)/home');
        }}
        onError={errors => {
          console.log(errors);
        }}
      />
    </SafeAreaView>
  );
}
