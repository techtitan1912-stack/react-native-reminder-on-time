import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {

    // const type = notification.request.content.data?.type;

    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      // shouldPlaySound: type === "REMINDER", // ✅ only reminder sound
      shouldSetBadge: true,
      // shouldSetBadge: false,
    };
  },
  });

export const setupNotificationChannel = async () => {

  if (Platform.OS === "android") {

    await Notifications.setNotificationChannelAsync("default-channel", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.MAX,
      sound: "notification_ring",
      vibrationPattern: [0, 250, 250, 250],
    });

    await Notifications.setNotificationChannelAsync("alarm-channel", {
      name: "alarm-channel",
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm",
      vibrationPattern: [0, 500, 500, 500],
    });

    console.log("Notification channels created");
  }
};

Notifications.addNotificationReceivedListener(async (notification) => {
console.log("Notification received >>>", notification);

  // const data = notification?.request?.content.data;

  // const title = data?.title || "No Title";
  // const body = data?.body;
  // const type = data?.type;
  // const profileImage = data?.profileImage;  // ✅ received from FCM

  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title,
  //     body,
  //     sound: type === "REMINDER" ? "alarm" : undefined,
  //     attachments: profileImage ? [{ url: profileImage }] : undefined  // ✅ show image
  //   },
  //   trigger: null
  // });

});