import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Switch, Text, TextInput } from "react-native-paper";
import styles from "../../assets/styles/home.styles.js";
import {
    cancelAllNotifications,
    scheduleMultipleTaskAlarms, testAlarmNotification
} from "../../assets/utils/notifications.jsx";
import ProfileHeader from "../../components/ProfileHeader";
import COLORS from "../../constants/colors.js";
import { SYSTEM_RINGTONES } from "../../constants/ringtone.jsx";
import { fetchWithFallback } from "../../lib/utils/api.js";
import { useAuthStore } from "../../store/authStore.js";

export default function Home() {
    const { User, isLoading, getTaskList, token, tasks } = useAuthStore();

    // fetch tasks when user is available
    useEffect(() => {
        const fetchTaskList = async () => {
            if (User && User.userName) {
                await getTaskList(User.userName, 1, 10);
            }
        };
        fetchTaskList();
    }, [User, getTaskList]);

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true, // 🔥 VERY IMPORTANT (iPhone)
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });
    }, []);

    /* ================= STATES ================= */
    const [taskPopup, setTaskPopup] = useState(false);
    const [ringtonePopup, setRingtonePopup] = useState(false);
    const [reminderTimeDialog, setReminderTimeDialog] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [ringtoneUri, setRingtoneUri] = useState(null);
    const [ringtoneName, setRingtoneName] = useState("Default");
    const [sound, setSound] = useState(null);

    const [reminderTime, setReminderTime] = useState(new Date());
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [noTime, setNoTime] = useState(false);
    const isCompleted = false
    const [mentionNumber, setMentionNumber] = useState("");

    const previewSoundRef = useRef(null);

    const previewRingtone = async () => {
        try {
            console.log("Preview ringtoneUri:", ringtoneUri);

            if (!ringtoneUri || ringtoneUri === "default") return;

            // if a preview sound exists, stop & unload it safely
            if (previewSoundRef.current) {
                try {
                    const status = await previewSoundRef.current.getStatusAsync();
                    if (status.isLoaded) {
                        await previewSoundRef.current.stopAsync();
                        await previewSoundRef.current.unloadAsync();
                    }
                } catch (e) {
                    // ignore errors during cleanup
                }
                previewSoundRef.current = null;
            }

            const source = typeof ringtoneUri === "number" ? ringtoneUri : { uri: ringtoneUri };
            const { sound } = await Audio.Sound.createAsync(
                source,
                {
                    shouldPlay: true,
                    isLooping: false,
                    volume: 1.0,
                }
            );

            previewSoundRef.current = sound;

            // Auto stop and unload after 5 seconds (optional)
            setTimeout(async () => {
                try {
                    if (previewSoundRef.current) {
                        const status = await previewSoundRef.current.getStatusAsync();
                        if (status.isLoaded) {
                            await previewSoundRef.current.stopAsync();
                            await previewSoundRef.current.unloadAsync();
                        }
                        previewSoundRef.current = null;
                    }
                } catch (e) {
                    console.log("Error stopping preview sound:", e);
                }
            }, 5000);

        } catch (error) {
            console.log("Preview error:", error);
        }
    };



    const closeRingtonePopup = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
        }
        setRingtonePopup(false);
    };

    const closeRingtonePopupOK = async () => {
        try {
            if (previewSoundRef.current) {
                const status = await previewSoundRef.current.getStatusAsync();
                if (status.isLoaded) {
                    await previewSoundRef.current.stopAsync();
                    await previewSoundRef.current.unloadAsync();
                }
                previewSoundRef.current = null;
            }
        } catch (e) {
            console.log("Error closing preview sound:", e);
        }
        setRingtonePopup(false);
    };

    /* ================= SAVE ================= */
    const saveTask = async () => {
        // set({ isLoading: true });

        console.log("Saving task with details >>");
        console.log({ title, description, reminderTime, ringtoneName, isLoading, token });
        try {

            const path = `/api/tasks/addTask`;
            console.log("Attempting add task for path >>", path);
            const { res: response, usedUrl } = await fetchWithFallback(path, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    reminderTime,
                    ringtoneName,
                    mentionNumber,
                    isCompleted,

                })
            });

            console.log('Add task used URL >>', usedUrl);

            //title, description, reminderTime, sound, mentionNumber
            const responseData = await response.json();
            console.log("At save task Response Data >> ", responseData);
            if (!response.ok) throw new Error(responseData.message || "Something went wrong");

            setTaskPopup(false);
            if (response.ok) {
                // Refresh task list after adding a new task
                scheduleMultipleTaskAlarms([responseData.task]); // Schedule alarm for the new task
                console.log("Task added and alarm scheduled >> ", responseData.task);
            }
        } catch (error) {
            console.log("Error in saving task >> ", error);
        } finally {
            // isLoading(false);
        }

    };

    /* ================= UI ================= */
    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.container}>
                <ProfileHeader />

                {/* ADD BUTTON */}
                <TouchableOpacity onPress={() => setTaskPopup(true)}>
                    <Ionicons name="add-circle" size={60} color={COLORS.primary} />
                </TouchableOpacity>

                {/* SHOW TASK LIST */}
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.taskTitle}>Title :{item.title}</Text>
                            <Text style={styles.taskDescription}>Description :{item.description}</Text>
                            <Text style={styles.taskTime}>Task Time :{new Date(item.reminderTime).toLocaleTimeString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</Text>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}

                />

                {/* ================= TASK POPUP ================= */}
                <Portal>
                    <Dialog visible={taskPopup} onDismiss={() => setTaskPopup(false)}>
                        <Dialog.Title>Add Task</Dialog.Title>

                        <Dialog.Content>
                            <TextInput label="Title" value={title} onChangeText={setTitle} />
                            <TextInput
                                label="Description"
                                value={description}
                                onChangeText={setDescription}
                                style={{ marginTop: 10 }}
                            />
                            <View style={styles.dateTimeRow}>
                                <TouchableOpacity style={styles.dateTimeItem} onPress={() => setReminderTimeDialog(true)}>
                                    <Ionicons name="alarm-outline" size={40} color={COLORS.primary} />
                                    <Text style={styles.dateTimeText}>Date Time</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.dateTimeItem} onPress={() => setRingtonePopup(true)}>
                                    <Ionicons name="musical-notes-outline" size={40} color={COLORS.primary} />
                                    <Text style={styles.dateTimeText}>Set Ringtone</Text>
                                </TouchableOpacity>

                            </View>
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button onPress={() => setTaskPopup(false)}>Cancel</Button>
                            <Button onPress={saveTask}>Save</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                {/* ================= DATE & TIME POPUP ================= */}
                <Portal>
                    <Dialog visible={reminderTimeDialog} onDismiss={() => setReminderTimeDialog(false)}>
                        <Dialog.Title>Set Date & Time</Dialog.Title>

                        {/* Default */}
                        <Dialog.Content>
                            <View style={styles.dateTimeRow}>

                                {/* DATE */}
                                <TouchableOpacity
                                    style={styles.dateTimeItem}
                                    onPress={() => setShowDate(true)}
                                >
                                    <Ionicons
                                        name="calendar-number-outline"
                                        size={28}
                                        color={COLORS.primary}
                                    />
                                    <Text style={styles.dateTimeText}>
                                        {reminderTime.toDateString()}
                                    </Text>
                                </TouchableOpacity>

                                {/* TIME */}
                                {!noTime && (
                                    <TouchableOpacity
                                        style={styles.dateTimeItem}
                                        onPress={() => setShowTime(true)}
                                    >
                                        <Ionicons
                                            name="time-outline"
                                            size={28}
                                            color={COLORS.primary}
                                        />
                                        <Text style={styles.dateTimeText}>
                                            {new Date(reminderTime).toLocaleTimeString("en-IN", {
                                                timeZone: "Asia/Kolkata",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                            </View>

                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text>No time</Text>
                                <Switch value={noTime} onValueChange={setNoTime} />
                            </View>
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button onPress={() => setReminderTimeDialog(false)}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>

                    {/* TIME PICKER */}
                    {showTime && (
                        <DateTimePicker
                            value={reminderTime}
                            mode="time"
                            display="spinner"
                            onChange={(e, selected) => {
                                setShowTime(false);
                                if (selected) {
                                    const updated = new Date(reminderTime);
                                    updated.setHours(selected.getHours());
                                    updated.setMinutes(selected.getMinutes());
                                    setReminderTime(updated);
                                }
                            }}
                        />
                    )}


                    {/* DATE PICKER */}
                    {showDate && (
                        <DateTimePicker
                            value={reminderTime}
                            mode="date"
                            display="spinner"
                            onChange={(e, selected) => {
                                setShowDate(false);
                                if (selected) {
                                    const updated = new Date(reminderTime);
                                    updated.setFullYear(
                                        selected.getFullYear(),
                                        selected.getMonth(),
                                        selected.getDate()
                                    );
                                    setReminderTime(updated);
                                }
                            }}
                        />
                    )}
                </Portal>



                {/* ================= RINGTONE POPUP ================= */}
                <Portal>
                    <Dialog visible={ringtonePopup} onDismiss={() => closeRingtonePopup()}>
                        <Dialog.Title>Select Ringtone</Dialog.Title>

                        <Dialog.Content>
                            {SYSTEM_RINGTONES.map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={{
                                        paddingVertical: 12,
                                        backgroundColor:
                                            ringtoneUri === item.uri ? "#E3F2FD" : "transparent",
                                    }}
                                    onPress={() => {
                                        setRingtoneName(item.name);
                                        setRingtoneUri(item.uri);
                                    }}
                                >
                                    <Text style={{ fontSize: 16 }}>
                                        {item.name} {ringtoneUri === item.uri ? "✓" : ""}
                                    </Text>
                                </TouchableOpacity>
                            ))}

                            {/* 🔥 PREVIEW BUTTON (HERE) */}
                            {ringtoneUri &&
                                ringtoneUri !== "default" &&
                                ringtoneUri !== "alarm" &&
                                ringtoneUri !== "notification" && (
                                    <Button
                                        icon="play"
                                        mode="contained"
                                        style={{ marginTop: 10 }}
                                        onPress={previewRingtone}
                                    >
                                        Preview
                                    </Button>
                                )}
                        </Dialog.Content>

                        <Dialog.Actions>
                            <Button onPress={() => closeRingtonePopup()}>Cancel</Button>
                            <Button onPress={() => closeRingtonePopupOK()}>OK</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

                {/* test notification                              */}
                <View style={{ marginTop: 100 }}>
                    <Button
                        title="Allow Notification"
                        onPress={() => { }}
                    > Allow Notification</Button>

                    <Button
                        title="Cancel All Notifications"
                        onPress={cancelAllNotifications}
                    >Cancel All Notifications</Button>
                </View>

                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Button
                        title="Test Alarm (5 sec)"
                        onPress={testAlarmNotification}
                    >Test Alarm (5 sec)</Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
