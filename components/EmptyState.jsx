import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function EmptyState({
  type = "noTask", // noTask | noResult
}) {

  const isNoTask = type === "noTask";

  return (
    <View style={styles.container}>

      <View style={styles.iconBox}>
        <Ionicons
          name={
            isNoTask
              ? "clipboard-outline"
              : "search-outline"
          }
          size={60}
          color="#4CAF50"
        />
      </View>

      <Text style={styles.title}>
        {isNoTask
          ? "No Task yet!"
          : "No matching tasks"}
      </Text>

      <Text style={styles.subtitle}>
        {isNoTask
          ? "Add your first task above to get started"
          : "Try changing filters to see results"}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  iconBox: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    borderRadius: 50,
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 40,
  },

});