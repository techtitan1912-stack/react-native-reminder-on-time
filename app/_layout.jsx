import { useAuthStore } from "@/store/authStore.js";
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from "expo-notifications";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  initNotifications,
  scheduleMultipleTaskAlarms,
} from "../assets/utils/notifications.jsx";
import SafeScreen from "../components/SafeScreen.jsx";
import { fetchWithFallback } from "../lib/utils/api.js";

export default function RootLayout() {
  useKeepAwake();

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { user, token, checkAuth, isAuthChecked, setTasks } = useAuthStore();
  const updateTasks = useAuthStore((state) => state.setTasks);
  // useEffect(() => {
  //   registerForPushNotificationsAsync();
  // }, []);

  useEffect(() => {
    checkAuth();
    console.log("At checkAuth() done ")
  }, [])


  //alarm notification
  useEffect(() => {
    const restoreNotifications = async () => {
      await Notifications.deleteNotificationChannelAsync('alarm');
      await initNotifications();
      try {
        console.log("Fetching tasks for notifications with token >> ", token);

        // if there's no token yet, skip fetching; we'll run again when token/isAuthChecked change
        if (!token) {
          console.log("No token available yet; skipping notification task fetch.");
          return;
        }

        // 🔽 DB / API se tasks lao
        const path = `/api/tasks/getTasks?page=1&limit=1000`;
        console.log("Attempting notification fetch for path >>", path);
        const { res: fetchTaskList, usedUrl } = await fetchWithFallback(path, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Notification fetch used URL >>', usedUrl);
        const tasksFromDB = await fetchTaskList.json() || {};
        // backend returns { tasks: [...] }
        const taskArray = Array.isArray(tasksFromDB.tasks) ? tasksFromDB.tasks : [];
        console.log("Tasks fetched for notifications >> ", taskArray);
        updateTasks(taskArray);

        if (!fetchTaskList.ok) throw new Error("Failed to fetch tasks for notifications");

        // only schedule future reminders
        const futureTasks = taskArray.filter(
          (task) => new Date(task.reminderTime) > new Date()
        );
         if (futureTasks.length === 0) {
          console.log("No future tasks with reminders found; no notifications scheduled.");
          return;
        } 
        await scheduleMultipleTaskAlarms(futureTasks);
      } catch (error) {
        console.error("fetching tasks:", error);
      }
    };

     // 🔘 Action buttons
    Notifications.setNotificationCategoryAsync("ALARM_ACTIONS", [
      {
        identifier: "STOP",
        buttonTitle: "STOP",
        options: { opensAppToForeground: true },
      },
    ]);

    // 🔔 Listen to notification tap / button
    const sub =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const taskId =
            response.notification.request.identifier.replace(
              "task-",
              ""
            );

          // STOP pressed
          if (response.actionIdentifier === "STOP") {
            await Notifications.cancelScheduledNotificationAsync(
              `task-${taskId}`
            );
          }

          // Notification tapped → open full screen
          router.push(`/alarm/${taskId}`);
        }
      );

    return () => sub.remove();
  }, [isAuthChecked, token]);

  //handle navigation based on auth state
  useEffect(() => {
    console.log("At handle navigation")
    console.log("navigationState >>", navigationState?.key)
    console.log("isAuthChecked >>", isAuthChecked)

    // don't try to redirect until we know the auth state
    if (!navigationState?.key || !isAuthChecked) return;

    const inAuthScreen = segments[0] === "(auth)"
    const isSignedIn = !!user && !!token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)")
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)")
    }
  }, [user, token, segments, navigationState, isAuthChecked])




  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeScreen>

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeScreen>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </PaperProvider>
  );
}