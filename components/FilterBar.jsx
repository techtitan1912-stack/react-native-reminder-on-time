import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "../constants/colors.js";

const options = ["All", "Today","Mention", "Pending", "Complete"];

export default function FilterBar({
  selectedFilters = [],
  onFilterChange,
}) {

  const toggleFilter = (filter) => {

      let updated;

  // single active filter logic
  if (selectedFilters[0] === filter) {
    updated = ["All"]; // same button click → reset
  } 
  else {
    updated = [filter]; // only one active
  }

      // ✅ call parent
  if (onFilterChange) {
    onFilterChange(updated);
  }

  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
      {options.map((item) => { 

        const active = (selectedFilters || []).includes(item);

        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.btn,
              active && styles.activeBtn,
            ]}
            onPress={() => {
              toggleFilter(item);
            }}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* <TouchableOpacity style={styles.iconBtn} onPress={openModal}>
        <Ionicons name="options-outline" size={20} />
      </TouchableOpacity> */}
  </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },

  container: {
    paddingHorizontal: 15,
    alignItems: "center",
  },

  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 10,

    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  activeBtn: {
    backgroundColor: "#E3F2FD",
    borderColor: COLORS.primary,
  },

  text: {
    color: "#555",
    fontSize: 14,
  },

  activeText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});