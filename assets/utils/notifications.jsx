import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // notification popup
    shouldShowList: true,     // notification tray
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});



//1st Permission + Channel create
export async function initNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Notification permission denied");
    return false;
  }

  // 🔘 Action buttons
  Notifications.setNotificationCategoryAsync("ALARM_ACTIONS", [
    {
      identifier: "STOP",
      buttonTitle: "STOP",
      options: { opensAppToForeground: true },
    },
  ]);

  // 🔔 ALARM CHANNEL
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("alarm", {
      name: "Alarm Channel",
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm.mp3",
      vibrationPattern: [0, 500, 500, 500],
      enableVibrate: true,
      bypassDnd: true,
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  return true;
}

// ✅ TEST LOCAL NOTIFICATION (ANDROID SAFE)
export async function scheduleTaskWithAlarm(task) {
  console.log("Scheduling notification for task >> ", task);

  // log raw reminder time string so we can diagnose parsing issues
  console.log("raw reminderTime :", task.reminderTime);

  // parse the incoming ISO string directly
  const reminderDate = new Date(task.reminderTime);
  const triggerDate = new Date(reminderDate.getTime() - 60000);
  const istTime = triggerDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log("Notification sheduled at IST Time:", istTime);

  if (triggerDate.getTime() - Date.now() < 5000) {
    console.log("Too close to current time");
    return;
  } else if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `task-${task._id}`,
    content: {
      title: "⏰ " + task.title,
      body:
        (task.description ? `${task.description}\n` : "") +
        "Tap to stop alarm",
      sound: "alarm",
      categoryIdentifier: "ALARM_ACTIONS",
      priority: Notifications.AndroidNotificationPriority.MAX,
      sticky: true,
      // 👇 this is for showing on Alarm Screen
      data: {
        taskId: task._id,
        taskTitle: task.title,
        taskDescription: task.description,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: "alarm", // Android requires this
    },
  });
  console.log("Notification scheduled for >> ", istTime);
}

export async function scheduleMultipleTaskAlarms(tasks) {
  for (const task of tasks) {
    await scheduleTaskWithAlarm(task);
  }
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("All notifications cancelled ❌");
}