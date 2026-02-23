import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
``

export default function AlarmScreen() {
  const router = useRouter();
  const soundRef = useRef(null);

  // 📳 Vibration pattern
  const vibrationPattern = [0, 1000, 500, 1000]; // vibrate, pause, vibrate

  useEffect(() => {
    startAlarm();

    return () => {
      stopAlarm();
    };
  }, []);

  // 🔊 Start alarm
  const startAlarm = async () => {
    Vibration.vibrate(vibrationPattern, true);

    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sound/alarm.mp3"),
      { isLooping: true, volume: 1.0 }
    );

    soundRef.current = sound;
    await sound.playAsync();
  };

  // 🛑 Stop alarm
  const stopAlarm = async () => {
    Vibration.cancel();

    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    router.back();
  };

  // 🔁 Snooze
  const snooze = async (minutes) => {
    await stopAlarm();

    const triggerTime = new Date(Date.now() + minutes * 60 * 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Snoozed Alarm",
        body: `Alarm after ${minutes} minutes`,
        sound: true,
        data: { screen: "alarm" },
      },
      trigger: triggerTime,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ ALARM</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.snooze]}
          onPress={() => snooze(5)}
        >
          <Text style={styles.btnText}>Snooze 5 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.snooze]}
          onPress={() => snooze(10)}
        >
          <Text style={styles.btnText}>Snooze 10 min</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.stop]}
          onPress={stopAlarm}
        >
          <Text style={styles.btnText}>STOP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 36,
    marginBottom: 40,
    fontWeight: "bold",
  },
  buttons: {
    width: "80%",
  },
  btn: {
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  snooze: {
    backgroundColor: "#FFA000",
  },
  stop: {
    backgroundColor: "#E53935",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
