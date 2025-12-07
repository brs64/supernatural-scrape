import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/screens/HomeScreen';

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Ignore certains warnings pour le développement
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function App() {
  useEffect(() => {
    // Listener pour les notifications reçues en premier plan
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification reçue:', notification);
      }
    );

    // Listener pour les interactions avec les notifications
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification cliquée:', response);
        const convention = response.notification.request.content.data.convention;
        // Ici on pourrait naviguer vers les détails de la convention
      }
    );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return <HomeScreen />;
}
