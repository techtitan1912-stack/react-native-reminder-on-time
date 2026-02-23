import * as Notifications from "expo-notifications";

// Notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: true,
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

  // 🔔 ALARM CHANNEL
  await Notifications.setNotificationChannelAsync("alarm", {
    name: "Task Alarm",
    importance: Notifications.AndroidImportance.MAX,
    sound: "alarm", // 🔑 alarm.mp3 (NO extension)
    vibrationPattern: [0, 1000, 500, 1000],
    enableVibrate: true,
    bypassDnd: true, // 🔥 VERY IMPORTANT
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });

  return true;
}

// ✅ TEST LOCAL NOTIFICATION (ANDROID SAFE)
export async function scheduleTaskWithAlarm(task) {
  console.log("Scheduling notification for task >> ", task);
  const triggerDate = new Date(task.reminderTime);
  console.log("Now IST:", new Date().toString());
  console.log("Trigger IST:", triggerDate.toString());

  if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: `task-${task._id}`,
    content: {
      title: "⏰ " + task.title,
      body: "Tap to stop alarm" + (task.description ? `\n${task.description}` : ""),
      categoryIdentifier: "ALARM_ACTIONS", // 🔑 important
      priority: Notifications.AndroidNotificationPriority.MAX,
      sticky: true, // ❗ notification stays
    },
    trigger: {
      type: "date",
      date: triggerDate,
      channelId: "alarm",
    },
  });
  console.log("Notification scheduled for >> ", triggerDate);
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

/**
 * 🧪 TEST ALARM (5 seconds later)
 */
export async function testAlarmNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "TEST ALARM",
      body: "Sound test",
    },
    trigger: {
      seconds: 5,
      channelId: "alarm",
    },
  });
}