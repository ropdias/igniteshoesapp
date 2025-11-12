import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { LogLevel, NotificationClickEvent, OneSignal } from 'react-native-onesignal';
import * as Linking from 'expo-linking';

import { Routes } from './src/routes';

import { THEME } from './src/theme';
import { Loading } from './src/components/Loading';

import { CartContextProvider } from './src/contexts/CartContext';
import { tagUserInfoCreate } from './src/notifications/notificationsTags';

const oneSignalAppId = Platform.OS === "ios" ? "4842b32d-6131-4b63-b3c6-d09b5c8b227b" : "1905ae86-2e20-4b51-a268-6eee8bb717ea";

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  // Initialize OneSignal in useEffect to ensure it runs only once
  useEffect(() => {
    // Enable verbose logging for debugging (remove in production)
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    // Initialize with your OneSignal App ID
    OneSignal.initialize(oneSignalAppId);
    OneSignal.Notifications.requestPermission(true);
    tagUserInfoCreate();
  }, []); // Ensure this only runs once on app mount

  useEffect(() => {
    const handleNotificationClick = (event: NotificationClickEvent): void => {
      const { actionId, url } = event.result;

      // Handle deep link from notification click (app was background/closed)
      // The URL comes in event.result.url (most reliable)
      if (url) {
        Linking.openURL(url);
        return;
      }

      // Handle action buttons
      switch(actionId) {
        case "1":
          console.log("Ver todos")
          break
        case "2":
          console.log("Ver pedido")
          break
        default:
          console.log("Nenhum botão de ação selecionado")
          break
      }
    }

    OneSignal.Notifications.addEventListener("click", handleNotificationClick);

    return () => {
      OneSignal.Notifications.removeEventListener("click", handleNotificationClick);
    }
  }, [])

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <CartContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </CartContextProvider>
    </NativeBaseProvider>
  );
}