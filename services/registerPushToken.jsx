import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

export const registerPushToken = async () => {
  console.log("At Register FCM token")
  try {

    
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission not granted");
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log("Project ID >>", projectId);

    const pushToken = await Notifications.getDevicePushTokenAsync({
      projectId: projectId,
    });

    console.log("FCM Token >>>", pushToken.data);

    return pushToken.data;
  } catch (error) { 
    console.log("Error occurred while registering FCM token >>", error);
  }
};