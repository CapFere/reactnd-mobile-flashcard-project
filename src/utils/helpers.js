import { Notifications } from "expo";
import AsyncStorage from "@react-native-community/async-storage";
import * as Permissions from "expo-permissions";

export const NOTIFICATION_KEY = "MobileFlashCards:notifications";
export const FLASHCARD_DB_KEY = "MobileFlashCards:cards";

export function getUniqueId() {
  return `MobileFlashCards-${new Date().toLocaleTimeString()}-${Date.now()}`;
}

export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    () => Notifications.cancelAllScheduledNotificationsAsync
  );
}

function createNotification() {
  return {
    title: "Ready for some Quizzing?",
    body: "👋 Let's Do IT",
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: "high",
      sticky: false,
      vibrate: true,
    },
  };
}

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        if (!data) {
          Permissions.askAsync(Permissions.NOTIFICATIONS)
            .then(({ status }) => {
              if (status === "granted") {
                Notifications.cancelAllScheduledNotificationsAsync();
                let tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(20);
                tomorrow.setMinutes(0);

                Notifications.scheduleLocalNotificationAsync(
                  createNotification(),
                  {
                    time: tomorrow,
                    repeat: "day",
                  }
                );

                AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
              }
            })
            .catch(console.log);
        }
      }
      console.log("Notification Reset for tomorrow");
    });
}
