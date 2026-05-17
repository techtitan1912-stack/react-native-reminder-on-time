import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRootNavigationState, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Portal, Switch } from "react-native-paper";
import style from "../assets/styles/profile.styles.js";
import COLORS from "../constants/colors.js";
import { BASE_URL } from "../lib/utils/api.js";
import { useAuthStore } from "../store/authStore.js";
import { formatDate } from "./../lib/utils/utils.js";

export default function TaskDetail() {

  const router = useRouter();
  const { task, taskId } = useLocalSearchParams();
  const rootNavigationState = useRootNavigationState();
  const { setShowTaskPopup, loginToken, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [noTime, setNoTime] = useState(false);
  const [mentionedNumbers, setMentionedNumbers] = useState("");
  const [mentionedUserName, setMentionedUserName] = useState("");
  const [createdTime, setCreatedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [reminderTimeDialog, setReminderTimeDialog] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isViewed, setIsViewed] = useState(false);
  const MAX_HEIGHT = 250;   // 👈 yaha limit set karo
  const MIN_HEIGHT = 60;
  const [descHeight, setDescHeight] = useState(MIN_HEIGHT);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {

    if (task) {
      const parsedTask = JSON.parse(task);
      console.log("Received Task:", parsedTask);
      console.log("Mention users:", parsedTask.mentionedUserNames);
      console.log("Mention users length:", parsedTask.mentionedUserNames.length);
      console.log("Created time:", parsedTask.createdAt);
      console.log("Mention User id:", parsedTask.user?._id);
      console.log("Self User id:", user?.id);

      if (parsedTask.user?._id === user?.id) {
        setIsEditable(true);
      }

      setIsViewed(parsedTask.isViewed || false);
      setTitle(parsedTask.title);
      setDescription(parsedTask.description || "");
      setReminderTime(
        parsedTask.reminderTime
          ? new Date(parsedTask.reminderTime)
          : new Date()
      );

      setMentionedNumbers(
        parsedTask.mentionNumber
          ? parsedTask.mentionNumber.join(", ")
          : ""
      );

      const validMentionedUsers = (parsedTask.mentionedUserNames || [])
        .filter(name => name && name.trim() !== "");

        console.log("Validate mention users : ",validMentionedUsers)

      if (validMentionedUsers.length === 0 ) {
        setMentionedUserName([]);
      } else {
        setMentionedUserName(validMentionedUsers);
      }
      setCreatedTime(parsedTask.createdAt ? parsedTask.createdAt : "");
      setIsCompleted(parsedTask.isCompleted || false);
    }

  }, []);

  // Date Picker Change
  const openTimePicker = () => {
    setReminderTime(new Date()); // ✅ current time set
    setReminderTimeDialog(true);
  };


  // Save Update
  /* ================= SAVE ================= */
  const handleSave = async () => {
    // ensure reminder is not now/past
    let scheduled = new Date(reminderTime);
    const selectedDate = new Date(reminderTime);
    setReminderTime(selectedDate.toISOString()); // ✅ ALWAYS UTC
    setIsLoading(true);

    console.log("Saving updated task with details >>");
    console.log({ title, description, reminderTime: scheduled, loginToken, taskId });
    try {

      const path = `/api/tasks/updateTask/${taskId}`;
      console.log("Attempting update task for path >>", path);
      console.log(" At update task >>> Current Time : ", new Date());
      setShowTaskPopup(false);

      const response = await fetch(`${BASE_URL}${path}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${loginToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          reminderTime: scheduled,
        })
      });

      //title, description, reminderTime, sound, mentionNumber
      const responseData = await response.json();
      console.log("At update task Response Data >> ", responseData);

      const createdTask = responseData.tasks
      if (!response.ok) throw new Error(responseData.message || "Something went wrong");


      if (response.ok) {
        console.log("Task added and alarm scheduled >> ");
        router.push("/(tabs)");
      }
    } catch (error) {
      console.log("Error in updating task >> ", error);
      console.log("Tried URLs:", error.tried || 'no tried list');
      setIsLoading(false);
      router.push("/(tabs)");
    }


  };

  const handleBack = async () => {
    setShowTaskPopup(false);
    if (isViewed) {
      router.back();
      return;
    } else {
      router.push("/(tabs)");
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
      <View style={style.taskDetailContainer}>


        {/* HEADER */}

        <View style={style.taskDetailHeader}>
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <Text style={style.headerTitle}>Task Detail</Text>
          <View style={{ width: 50, alignItems: "flex-end" }}>
            {isEditable && (
              <TouchableOpacity onPress={handleSave}>
                <Text style={style.saveText}>Save</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={style.taskDetailHeader}>
          <Text style={style.createdTime}>{formatDate(createdTime)}</Text>
        </View>

        {/* BODY */}
        <View style={style.editTaskContainer}>
          <View style={style.card}>

            {/* TITLE */}
            <Text style={style.taskDetailLabel}>Title</Text>

            <View style={style.inputGroup}>
              <View style={style.inputContainer}>
                <TextInput
                  readOnly={!isEditable}
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

                  autoCapitalize="sentences"
                  keyboardType="default"
                />
              </View>
              {errors.title && <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.title}</Text>}
            </View>

            {/* DESCRIPTION */}

            <Text style={style.label}>Description</Text>

            {/* Description */}
            <View style={style.inputGroup}>
              <View style={style.inputContainer}>
                <TextInput
                  readOnly={!isEditable}
                  style={[style.input,
                  {
                    height: Math.min(
                      MAX_HEIGHT,
                      Math.max(MIN_HEIGHT, descHeight)
                    ),
                  }, {
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
                    if (text.trim()) setErrors(prev => ({ ...prev, description: "" }));
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
              {errors.description && <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.description}</Text>}
            </View>


            {/* DATE TIME */}
            <Text style={style.label}>Reminder Time</Text>
            <View style={style.dateRow}>
              <Text style={style.dateText}>{formatDate(reminderTime)}</Text>

              {isEditable && (
                <TouchableOpacity onPress={() => openTimePicker()}>
                  <Ionicons name="time-outline" size={22} color="green" />
                </TouchableOpacity>
              )}
            </View>

            {/* DATE PICKER */}
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
                        size={28}
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
                          size={28}
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


                  <View style={style.switchRow}>
                    <Text style={style.switchText}>No time</Text>
                    <Switch
                      value={noTime}
                      onValueChange={setNoTime}
                      trackColor={{ false: "#444", true: "#4CAF50" }}
                      thumbColor={noTime ? "#ffffff" : "#cccccc"}
                    />
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
              {showDate === true && isEditable === true ? (
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
              ) : null}
            </Portal>

            {/* MENTION */}
            {mentionedUserName.length > 0 && isEditable && (
              <Text style={style.label}>Mention User</Text>

            )}
            {mentionedUserName.length > 0 && isEditable && (
              <FlatList
                data={mentionedUserName}
                keyExtractor={(item, index) => index.toString()}
                style={{ maxHeight: 150 }}
                nestedScrollEnabled={true}
                renderItem={({ item }) => (
                  <View style={style.chip}>
                    <Text style={style.chipText}>{item}</Text>
                  </View>
                )}
              />
            )}

          </View>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
  );
}