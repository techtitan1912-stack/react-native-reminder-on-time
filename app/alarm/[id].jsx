import * as Notifications from "expo-notifications";
import { router, useLocalSearchParams } from "expo-router";
import { Button, Text, View } from "react-native";

export default function AlarmScreen() {
  const { id } = useLocalSearchParams();

  const stopAlarm = async () => {
    await Notifications.cancelScheduledNotificationAsync(
      `task-${id}`
    );
    router.back();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 28 }}>
        ⏰ Alarm Ringing
      </Text>

      <Text style={{ color: "#ccc", marginVertical: 20 }}>
        Task ID: {id}
      </Text>

      <Button title="STOP ALARM" onPress={stopAlarm} />
    </View>
  );
}