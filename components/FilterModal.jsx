import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function FilterModal({
  visible,
  onClose,
  filters,
  setFilters,
}) {

  const toggleOption = (key) => {
    setFilters({
      ...filters,
      [key]: !filters[key],
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>

      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>

            <Text style={styles.title}>Filters</Text>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} />
            </TouchableOpacity>

          </View>

          {/* Mention */}

          <TouchableOpacity
            style={[
              styles.option,
              filters.mentioned && styles.activeOption,
            ]}
            onPress={() => toggleOption("mentioned")}
          >
            <Text>👤 Mentioned</Text>
          </TouchableOpacity>

          {/* Completed */}

          <TouchableOpacity
            style={[
              styles.option,
              filters.completed && styles.activeOption,
            ]}
            onPress={() => toggleOption("completed")}
          >
            <Text>✅ Completed</Text>
          </TouchableOpacity>

          {/* Today */}

          <TouchableOpacity
            style={[
              styles.option,
              filters.today && styles.activeOption,
            ]}
            onPress={() => toggleOption("today")}
          >
            <Text>📅 Today</Text>
          </TouchableOpacity>

          {/* FOOTER */}

          <View style={styles.footer}>

            <TouchableOpacity
              onPress={() =>
                setFilters({
                  mentioned: false,
                  completed: false,
                  today: false,
                })
              }
            >
              <Text>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={onClose}
            >
              <Text style={{ color: "#fff" }}>Apply</Text>
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
    backgroundColor: "#00000066",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
  },

  activeOption: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#4CAF50",

    shadowColor: "#4CAF50",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },

  optionText: {
    fontSize: 15,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    alignItems: "center",
  },

  reset: {
    color: "#666",
  },

  applyBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
});