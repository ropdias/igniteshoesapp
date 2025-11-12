import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NotificationClickEvent, OneSignal } from 'react-native-onesignal';

import { Routes } from './src/routes';

import { THEME } from './src/theme';
import { Loading } from './src/components/Loading';

import { CartContextProvider } from './src/contexts/CartContext';
import { tagUserInfoCreate } from './src/notifications/notificationsTags';

const oneSignalAppId = Platform.OS === "ios" ? "4842b32d-6131-4b63-b3c6-d09b5c8b227b" : "1905ae86-2e20-4b51-a268-6eee8bb717ea";

OneSignal.initialize(oneSignalAppId);
OneSignal.Notifications.requestPermission(true);

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  tagUserInfoCreate();

  useEffect(() => {
    const handleNotificationClick = (event: NotificationClickEvent): void => {
      const { actionId } = event.result

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