import React from 'react';
import { SafeAreaView } from '@/components/ui/SafeAreaView';

export default function PageSafeAreaView({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SafeAreaView className="pb-8 pt-4">{children}</SafeAreaView>;
}
