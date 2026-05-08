import { StyleSheet, View } from "react-native";

export default function ActiveFilters({ filters, clearFilter }) {
  return (
    <View style={styles.chipContainer}>

      {/* {filters.type !== "All" && (
        <Chip label={filters.type} onRemove={() => clearFilter("type")} />
      )}

      {filters.mentioned && (
        <Chip label="Mentioned" onRemove={() => clearFilter("mentioned")} />
      )}

      {filters.completed === true && (
        <Chip label="Completed" onRemove={() => clearFilter("completed")} />
      )}

      {filters.completed === false && (
        <Chip label="Pending" onRemove={() => clearFilter("completed")} />
      )} */}

    </View>
  );
}

// const Chip = ({ label, onRemove }) => (
//   <View style={styles.chip}>
//     {/* <Text style={styles.chipText}>{label}</Text> */}
//     <TouchableOpacity onPress={onRemove}>
//       {/* <Ionicons name="close" size={16} /> */}
//     </TouchableOpacity>
//   </View>
// );

const styles = StyleSheet.create({
  chipContainer: {
   flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 15,
    marginTop: 8,
},

chip: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#E8F5E9",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
  marginRight: 8,
},

chipText: {
  marginRight: 5,
  color: "#2E7D32",
},
});