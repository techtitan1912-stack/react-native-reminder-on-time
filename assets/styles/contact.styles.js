import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8F5E9",
        // padding: 20,
        paddingTop : 35,
        paddingHorizontal : 16,
        paddingBottom : 20,
        
    },

    title: {
        fontSize: 22,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 15,
        color: "#2E7D32",
    },

    search: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#A5D6A7",
    },

    contactItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 18,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
    },

    name: {
        fontSize: 16,
        fontWeight: "500",
        color: "#2E7D32",
    },

    number: {
        fontSize: 14,
        color: "#555",
    },

    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: "#4CAF50",
        justifyContent: "center",
        alignItems: "center",
    },

    checkboxSelected: {
        backgroundColor: "#4CAF50",
    },

    bottomButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    cancelBtn: {
        backgroundColor: "#ff8080",
        padding: 15,
        borderRadius: 25,
        width: "45%",
        alignItems: "center",
    },

    okBtn: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 25,
        width: "45%",
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontWeight: "600",
    },
});
export default styles;