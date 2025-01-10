import { LogLevel, OneSignal } from 'react-native-onesignal';

// This file contains everything related to OneSignal
// OneSignal is a push notification service

const ONE_SIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONE_SIGNAL_APP_ID;

export const initializeOneSignal = async () => {
  if(!ONE_SIGNAL_APP_ID) {
    return;
  }
  
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(ONE_SIGNAL_APP_ID);
  void OneSignal.Notifications.requestPermission(true);
}

export const signInWithOneSignal = async (userId: string, email?: string) => {
  if(!ONE_SIGNAL_APP_ID) {
    return;
  }

  OneSignal.login(userId);
  if (email) {
    OneSignal.User.addEmail(email);
  }
};