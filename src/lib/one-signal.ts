import { LogLevel, OneSignal } from 'react-native-onesignal';
import config from '../../config';

// This file contains everything related to OneSignal
// OneSignal is a push notification service

export const initializeOneSignal = async () => {
  if(config.oneSignalAppId) {
    console.warn('OneSignal App ID is not set!');
    return;
  }
  
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(config.oneSignalAppId);
  void OneSignal.Notifications.requestPermission(true);
}

export const signInWithOneSignal = async (userId: string, email?: string) => {
  OneSignal.login(userId);
  email && OneSignal.User.addEmail(email);
};