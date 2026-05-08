import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { soundObject } from "./_layout";

export default function AlarmScreen() {
  const router = useRouter();
  const { taskDescription, taskTitle } = useLocalSearchParams();
  const soundRef = useRef(null);

  // vibration pattern…
  const vibrationPattern = [0, 1000, 500, 1000];

  useEffect(() => {
    // startAlarm();
    // return () => stopAlarm();
  }, []);

  // const startAlarm = async () => {
  //   Vibration.vibrate(vibrationPattern, true);
  //   const { sound } = await Audio.Sound.createAsync(
  //     require("../assets/sounds/alarm.mp3"),
  //     { isLooping: true, volume: 1.0 }
  //   );
  //   soundRef.current = sound;
  //   await sound.playAsync();
  // };

  const stopAlarm = async () => {
    console.log("stopAlarm called, soundObject=", soundObject);
    Vibration.cancel();
    if (soundObject) {
      console.log("check soundObject is true or not :", soundObject);
      try {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        // await safeStopAndUnload(soundObject);
        console.log("sound stopped");
      } catch (e) {
        console.log("error stopping sound", e);
      }
    } else {
      console.log("no sound to stop");
    }

    router.replace("/(tabs)");
    // only call back if there is somewhere to go
    // if (router.canGoBack()) {
    // } else {
    //   router.replace("/(tabs)"); // or whatever default screen
    // }
  };

  // const snooze = async (minutes) => {
  //   await stopAlarm();
  //   // TODO: schedule a new alarm in `minutes`
  //   console.log(`snoozed for ${minutes} minutes`);
  // };

  return (
      <View style={styles.container}>
    
    <Text style={styles.heading}>⏰ DO COMPLETE YOUR TASK</Text>

    <View style={styles.card}>
      {/* <Text style={styles.label}>Task Title</Text> */}
      <Text style={styles.titleText}>{taskTitle}</Text>

      {/* <Text style={styles.label}>Description</Text> */}
      <Text style={styles.descText}>
        {taskDescription || "No description"}
      </Text>
    </View>

    <View style={styles.buttons}>
      <TouchableOpacity
        style={[styles.btn, styles.stop]}
        onPress={async () => {
          console.log("STOP button pressed");
          await stopAlarm();
        }}
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
    padding: 20,
  },

  heading: {
    color: "#ff3b30",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textShadowColor: "#ff3b30",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 2,
  },

  card: {
    width: "100%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 25,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#ff3b30",
  },

  label: {
    color: "#888",
    fontSize: 14,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  titleText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  descText: {
    color: "#ccc",
    fontSize: 16,
    lineHeight: 22,
  },

  buttons: {
    width: "80%",
  },

  btn: {
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
  },

  stop: {
    backgroundColor: "#E53935",
    elevation: 5,
  },

  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});