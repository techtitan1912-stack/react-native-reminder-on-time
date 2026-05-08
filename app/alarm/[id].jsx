import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Button, Text, View } from "react-native";
import { safeStopAndUnload } from "../../assets/utils/soundUtils";

export default function AlarmScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const soundRef = useRef(null);

  useEffect(() => {
    const playAlarm = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/alarm.mp3"),
        { isLooping: true }
      );
      soundRef.current = sound;
      await sound.playAsync();
    };

    // playAlarm();

    return async () => {
      if (soundRef.current) {
        await safeStopAndUnload(soundRef.current);
      }
    };
  }, []);

  const stopAlarm = async () => {
    await Notifications.cancelScheduledNotificationAsync(`alarm-${id}`);

    if (soundRef.current) {
      await safeStopAndUnload(soundRef.current);
    }

     if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)"); // or whatever default screen
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>⏰ ALARM</Text>
      <Button title="STOP" onPress={stopAlarm} />
    </View>
  );
}