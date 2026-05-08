import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import style from "../assets/styles/profile.styles.js";
import { safeStopAndUnload } from "../assets/utils/soundUtils";
import ContactSelectComponent from "../components/ContactSelectComponent.jsx";
import ReminderTimeSelectPopup from "../components/ReminderTimeSelectPopop.jsx";
import COLORS from "../constants/colors.js";
import { SYSTEM_RINGTONES } from "../constants/ringtone.jsx";
import { BASE_URL } from "../lib/utils/api.js";
import { useAuthStore } from "../store/authStore.js";

const AddTaskPage = () => {
    const { user, loginToken, setShowTaskPopup, pushToken } = useAuthStore();
    const router = useRouter();

    /* ================= STATES ================= */
    const MAX_HEIGHT = 250;   // 👈 yaha limit set karo
    const MIN_HEIGHT = 100;
    const [descHeight, setDescHeight] = useState(MIN_HEIGHT);
    // const [taskPopup, setTaskPopup] = useState(false);
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
    // const [mentionNumber, setMentionNumber] = useState("");
    const previewSoundRef = useRef(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    const [mentionedNumbers, setMentionedNumbers] = useState("");
    const [mentionedUserNames, setMentionedUserNames] = useState("");
    const [errors, setErrors] = useState({ title: "" });
    const [reminderTimeVisible, setReminderTimeVisible] = useState(false);

    const openTimePicker = () => {
        Keyboard.dismiss();
        setReminderTime(new Date()); // ✅ current time set
        setReminderTimeDialog(true);
    };

    const previewRingtone = async () => {
        try {
            console.log("Preview ringtoneUri:", ringtoneUri);

            if (!ringtoneUri || ringtoneUri === "default") return;

            // if a preview sound exists, stop & unload it safely
            if (previewSoundRef.current) {
                // use helper to avoid unhandled errors
                await safeStopAndUnload(previewSoundRef.current);
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
                        await safeStopAndUnload(previewSoundRef.current);
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
            await safeStopAndUnload(sound);
            setSound(null);
        }
        setRingtonePopup(false);
    };

    const closeRingtonePopupOK = async () => {
        try {
            if (previewSoundRef.current) {
                await safeStopAndUnload(previewSoundRef.current);
                previewSoundRef.current = null;
            }
        } catch (e) {
            console.log("Error closing preview sound:", e);
        }
        setRingtonePopup(false);
    };

    const closeTaskPopup = () => {
        setTitle("");
        setDescription("");
        setShowTaskPopup(false);
        router.back();
    }

    const handleOk = () => {
        setReminderTimeVisible(false);
    };

    /* ================= SAVE ================= */
    const saveTask = async () => {
        // ensure reminder is not now/past
        let scheduled = new Date(reminderTime);
        const selectedDate = new Date(reminderTime);
        setReminderTime(selectedDate.toISOString()); // ✅ ALWAYS UTC

        let newErrors = { title: "" };

        if (!title.trim() || title.length < 5) {
            newErrors.title = "Title is require";
        }


        setErrors(newErrors);

        // ✅ Check if any error exists
        const hasError = Object.values(newErrors).some(
            (error) => error !== ""
        );

        if (hasError) {
            console.log("Validation failed ❌");
            return; // 🚀 STOP here if errors
        }

        if (reminderTime && new Date(reminderTime) <= new Date()) {
            setReminderTimeVisible(true);
            return;
        }


        setIsLoading(true);
        const profileImage = user.profileImage;

        console.log("Saving task with details >>");
        console.log({ title, description, reminderTime: scheduled, ringtoneName, isLoading, loginToken, pushToken, mentionedNumbers, mentionedUserNames });
        try {

            const path = `/api/tasks/addTask`;
            console.log("Attempting add task for path >>", path);
            console.log(" At saving task >>> Current Time : ", new Date());
            setShowTaskPopup(false);

            // const { res: response, usedUrl } = await fetchWithFallback(path, {
            const response = await fetch(`${BASE_URL}${path}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${loginToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    reminderTime: scheduled,
                    mentionedNumber: mentionedNumbers,
                    mentionedUserNames: mentionedUserNames,
                    isCompleted,
                    pushToken,
                    profileImage: profileImage,

                })
            });

            // console.log('Add task used URL >>', usedUrl);

            //title, description, reminderTime, sound, mentionNumber
            const responseData = await response.json();
            console.log("At save task Response Data >> ", responseData);

            const createdTask = responseData.tasks
            if (!response.ok) throw new Error(responseData.message || "Something went wrong");


            if (response.ok) {
                console.log("Task added and alarm scheduled >> ", responseData.tasks);
                router.push("/(tabs)");
            }
        } catch (error) {
            console.log("Error in saving task >> ", error);
            console.log("Tried URLs:", error.tried || 'no tried list');
            setIsLoading(false);
            router.push("/(tabs)");
        }


    };



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={style.container}>

                <View style={style.card}>
                    <View style={style.header}>
                        <Text style={style.title}>Add Task</Text>
                        {/* <Text style={style.subtitle}>Complete your profile information</Text> */}
                    </View>

                    {/* Title */}
                    <View style={style.inputGroup}>
                        <View style={style.inputContainer}>
                            <TextInput
                                style={[style.input, {
                                    borderColor: focusedInput === "title"
                                        ? COLORS.activeOutline   // activeOutlineColor
                                        : COLORS.inactiveOutline   // outlineColor
                                }]}
                                placeholder="Title"
                                placeholderTextColor={COLORS.placeholderText}
                                value={title}
                                onFocus={() => setFocusedInput("title")}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(text) => {
                                    setTitle(text);
                                    if (text.trim()) setErrors(prev => ({ ...prev, title: "" }));
                                }}

                                autoCapitalize="none"
                                keyboardType="default"
                            />
                        </View>
                        {errors.title && <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.title}</Text>}
                    </View>


                    {/* Description */}
                    <View style={style.inputGroup}>
                        <View style={style.inputContainer}>
                            <TextInput
                                style={[style.input,
                                {
                                    height: Math.min(
                                        MAX_HEIGHT,
                                        Math.max(MIN_HEIGHT, descHeight)
                                    ),
                                },
                                {
                                    borderColor: focusedInput === "description"
                                        ? COLORS.activeOutline   // activeOutlineColor
                                        : COLORS.inactiveOutline   // outlineColor
                                }]}
                                placeholder="Description"
                                placeholderTextColor={COLORS.placeholderText}
                                value={description}
                                onFocus={() => setFocusedInput("description")}
                                onBlur={() => setFocusedInput(null)}
                                onChangeText={(text) => {
                                    setDescription(text);
                                }}

                                autoCapitalize="sentences"
                                keyboardType="default"
                                onContentSizeChange={(event) => {
                                    setDescHeight(event.nativeEvent.contentSize.height);
                                }}
                                mode="outlined"
                                multiline
                                scrollEnabled={descHeight >= MAX_HEIGHT}
                            />
                        </View>
                    </View>

                    {/* Date Time & Mention Buttons Section */}
                    <View style={style.reminderSection}>
                        <Text style={style.sectionHeading}>Set Reminder</Text>

                        <View style={style.dateTimeRow}>
                            <TouchableOpacity style={style.reminderButton} onPress={() => openTimePicker()}>
                                <Ionicons name="alarm-outline" size={20} color="#4CAF50" />
                                <Text style={style.reminderText}>Date Time</Text>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={style.reminderButton}
                                onPress={() => setShowContacts(true)}
                            >
                                <Ionicons name="person-outline" size={20} color="#4CAF50" />
                                <Text style={style.reminderText}>@Mention</Text>
                            </TouchableOpacity>

                        </View>

                        <FlatList
                            data={mentionedUserNames}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ maxHeight: 150 }}
                            nestedScrollEnabled={true}
                            renderItem={({ item }) => (
                                <View style={style.chip}>
                                    <Text style={style.chipText}>{item}</Text>
                                </View>
                            )}
                        />

                    </View>


                    <View style={style.bottomButtons}>
                        <TouchableOpacity style={style.cancelButton} onPress={() => closeTaskPopup()}>
                            <Text style={style.bottomText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={style.saveButton} onPress={saveTask} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={style.bottomText}>Save</Text>
                            )}
                        </TouchableOpacity>
                        {/* <Button onPress={saveTask} style={style.button}>Save</Button> */}


                    </View>
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={style.buttonText}>Continue</Text>
                    )}
                </View>

                <ContactSelectComponent
                    visible={showContacts}
                    onClose={() => setShowContacts(false)}
                    onSelectContacts={(numbers) => {
                        console.log("Selected >>>", numbers);
                        setMentionedNumbers(numbers.split(","));
                    }}
                    onSelectContactsName={(names) => {
                        console.log("Selected >>>", names);
                        setMentionedUserNames(names.split(","));
                    }}
                />

                {/* ================= DATE & TIME POPUP ================= */}
                <Portal>
                    <Dialog visible={reminderTimeDialog} onDismiss={() => setReminderTimeDialog(false)}>
                        <Dialog.Title>Set Date & Time</Dialog.Title>

                        {/* Default */}
                        <Dialog.Content>
                            <View style={style.dateTimeRow}>

                                {/* DATE */}
                                <TouchableOpacity
                                    style={style.dateTimeItemDark}
                                    onPress={() => setShowDate(true)}
                                >
                                    <Ionicons
                                        name="calendar-number-outline"
                                        size={18}
                                        color={COLORS.primary}
                                    />
                                    <Text style={style.dateTimeTextDark}>
                                        {reminderTime ? new Date(reminderTime).toLocaleDateString() : "No Date"}
                                    </Text>
                                </TouchableOpacity>

                                {/* TIME */}
                                {!noTime && (
                                    <TouchableOpacity
                                        style={style.dateTimeItemDark}
                                        onPress={() => setShowTime(true)}
                                    >
                                        <Ionicons
                                            name="time-outline"
                                            size={18}
                                            color={COLORS.primary}
                                        />
                                        <Text style={style.dateTimeTextDark}>
                                            {new Date(reminderTime).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                            </View>



                        </Dialog.Content>

                        <Dialog.Actions style={style.dialogActionsDark}>
                            <Button
                                textColor="#4CAF50"
                                onPress={() => setReminderTimeDialog(false)}
                            >
                                OK
                            </Button>
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
                                if (!selected) return;

                                const now = new Date();

                                const chosen = new Date(reminderTime);
                                chosen.setHours(selected.getHours());
                                chosen.setMinutes(selected.getMinutes());
                                chosen.setSeconds(0);
                                chosen.setMilliseconds(0);

                                const isToday =
                                    chosen.toDateString() === now.toDateString();

                                // 🚫 Only block if TODAY and past time
                                if (isToday && chosen <= now) {
                                    alert("Please select a future time");
                                    return;
                                }

                                setReminderTime(chosen);
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

                {/* </ScrollView> */}
            </View>
            {/* </TouchableWithoutFeedback> */}

            <ReminderTimeSelectPopup
                visible={reminderTimeVisible}
                handleOk={handleOk}
            />


        </KeyboardAvoidingView>
    )
}

export default AddTaskPage;