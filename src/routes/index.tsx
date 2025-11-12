import { useEffect, useState } from 'react';
import { useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { OneSignal, NotificationWillDisplayEvent, OSNotification } from 'react-native-onesignal';
import { Notification } from '../components/Notification';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      details: {
        path: "/details/:productId",
        parse: {
          productId: (productId: string) => productId,
        }
      }
    }
  }
}

import { AppRoutes } from './app.routes';

export function Routes() {
  const [notification, setNotification] = useState<OSNotification>()
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(() => {
    // Handler ONLY for when notification appears (app in foreground)
    const handleNotification = (event: NotificationWillDisplayEvent): void => {
      event.preventDefault()
      const response = event.getNotification()
      setNotification(response)
    }

    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleNotification
    )
    
    return () => 
      OneSignal.Notifications.removeEventListener(
        "foregroundWillDisplay",
        handleNotification
      )
  }, [])

  return (
    <NavigationContainer theme={theme} linking={linking}>
      <AppRoutes />
      
      {notification?.title && (
        <Notification 
          data={notification} 
          onClose={() => setNotification(undefined)}
        />
      )}
      
    </NavigationContainer>
  );
}