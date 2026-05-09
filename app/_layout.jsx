import { useAuthStore } from "@/store/authStore.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from "expo-notifications";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import SafeScreen from "../components/SafeScreen.jsx";
import { setupNotificationChannel } from '../services/notificationListener.jsx';
import { registerPushToken } from '../services/registerPushToken.jsx';
export let soundObject = null;   // 👈 important
export default function RootLayout() {

  useKeepAwake();

  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const handledRef = useRef(false);
  const { setPushToken, checkAuth } = useAuthStore();



  ///Generate push token 
  useEffect(() => {


    const initPushToken = async () => {

      try {

        const storedToken = await AsyncStorage.getItem("pushToken");

        if (storedToken) {
          console.log("Using saved token:", storedToken);
          return storedToken;
        }

        console.log("No Push Token found. Generating new token...");

        const generatedPushToken = await registerPushToken();

        console.log("Generated push notification token >> ", generatedPushToken);

        if (!generatedPushToken) {
          console.log("Push token not generated");
          return;
        }

        await AsyncStorage.setItem("pushToken", generatedPushToken);
        setPushToken(generatedPushToken);
        console.log("Push token saved & set successfully >> ", generatedPushToken);

      } catch (error) {
        console.log("Error generating push token >> ", error);
      }
    };

    initPushToken();
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);


  // Listen for incoming notifications and play sound
  useEffect(() => {
    setupNotificationChannel();
    // const sub = setupNotificationChannel();

    // return () => sub?.remove();
  }, []);

  // Navigation on notification click
  useEffect(() => {
    let isMounted = true;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("Notification clicked >> ", response);

        const data = response.notification.request.content.data;

        // Alarm screen par navigate karo
        // delay so navigation ready ho jaye
        setTimeout(() => {
          router.push({
            pathname: "/(tabs)",
            params: {
              taskTitle: data.taskTitle,
              taskDescription: data.taskDescription,
            },
          });
        }, 1000); // ⏳ important
      }
    );

    return () => {
      isMounted = false;
      subscription.remove()
    };
  }, []);


  // Navigation on notification click when app is killed
  useEffect(() => {
    if (!lastNotificationResponse || handledRef.current) return;

    const notificationDate = lastNotificationResponse.notification.date;

    const now = new Date();

    const diff = (now - new Date(notificationDate)) / 1000;

    // ⛔ agar 5 sec se purana hai to ignore karo
    if (diff > 5) return;

    handledRef.current = true;

    const data = lastNotificationResponse.notification.request.content.data;

    router.push({
      pathname: "/(tabs)",
      params: {
        taskTitle: data.taskTitle,
        taskDescription: data.taskDescription,
      },
    });
  }, [lastNotificationResponse]);


  // const setupChannel = async () => {
  //   if (Platform.OS === "android") {
  //     await Notifications.setNotificationChannelAsync("alarm", {
  //       name: "Alarm Channel",
  //       importance: Notifications.AndroidImportance.MAX,
  //       sound: "alarm",   // extension nahi
  //       vibrationPattern: [0, 500, 500, 500],
  //       enableVibrate: true,
  //       lockscreenVisibility:
  //         Notifications.AndroidNotificationVisibility.PUBLIC,
  //     });
  //   }
  // };

  // const playAlarm = async () => {
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("../assets/sounds/alarm.mp3"), // apna sound file
  //     { shouldPlay: true, isLooping: true, volume: 1.0 }
  //   );

  //   soundObject = sound;

  //   // 15 second baad stop
  //   setTimeout(async () => {
  //     if (soundObject) {
  //       await soundObject.stopAsync();
  //       await soundObject.unloadAsync();
  //       soundObject = null;
  //     }
  //   }, 15000);
  // };

  return (
    <SafeScreen>
      <PaperProvider>
        <StatusBar style="dark" backgroundColor="#F3F7F3" />
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </SafeScreen>
  );


}