import React from 'react';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { ChevronLeftSquareIcon } from 'lucide-react-native';

export default function BackButton() {
  return (
    <Pressable onPress={() => router.back()} className="-ml-1 mb-4">
      <ChevronLeftSquareIcon size={42} color="rgb(82,82,82)" />
    </Pressable>
  );
}
