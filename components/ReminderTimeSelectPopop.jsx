import { MaterialIcons } from "@expo/vector-icons";
import { Modal, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import COLORS from "../constants/colors.js";

export default function ReminderTimeSelectPopup({
  visible,
  handleOk
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {}} // outside dismiss OFF
    >
      <View style={styles.overlay}>

        <View style={styles.popup}>

          {/* Caution Icon */}
          <View style={styles.iconCircle}>
            <MaterialIcons
              name="warning"
              size={36}
              color="#ffc048"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Reminder Time Select
          </Text>

          {/* Message */}
          <Text style={styles.message}>
            Please select a reminder time.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>

            
            {/* Ok */}
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => handleOk(false)}
            >
              <Text style={styles.deleteText}>
                Ok
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)", // premium dim
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "85%",
    backgroundColor: "#ffffff",

    borderRadius: 22,
    padding: 24,

    // Attractive Border
    borderWidth: 2,
    borderColor: COLORS.primary,

    // Premium Shadow
    elevation: 15,
  },

  iconCircle: {
    alignSelf: "center",

    backgroundColor: "#e9e4db",
    width: 60,
    height: 60,

    borderRadius: 35,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

  title: {
    fontSize: 21,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",

    marginBottom: 8,
  },

  message: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",

    marginBottom: 24,
    lineHeight: 21,
  },

  buttonRow: {
    flexDirection: "row",
  },

  cancelBtn: {
    flex: 1,

    backgroundColor: "#f1f1f1",

    paddingVertical: 13,
    borderRadius: 14,

    marginRight: 10,
  },

  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },

  deleteBtn: {
    flex: 1,

    backgroundColor: COLORS.primary, // 🔴 Red Delete

    paddingVertical: 13,
    borderRadius: 14,
    // width: "40",
    // height: 30,
  },

  deleteText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#fff",
  },

});