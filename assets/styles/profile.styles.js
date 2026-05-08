// styles/signup.styles.js
import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  editTaskContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "flex-start",
  },
  card: {
    // backgroundColor: COLORS.cardBackground,
    // borderRadius: 16,
    // padding: 24,
    // shadowColor: COLORS.black,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 8,
    // elevation: 4,
    // borderWidth: 2,
    // borderColor: COLORS.border,

    // width:'90%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#a8e6a1',
    shadowColor: '#7ecb7e', // base shadow color
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 12,


  },
  header: {
    alignItems: "center",
    marginBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  formContainer: { marginBottom: 16 },
  inputGroup: { marginBottom: 10 },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: COLORS.textPrimary,
    fontWeight: "500",
    marginTop: 10
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    // borderRadius: 12,
    // borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 15,

    borderWidth: 2,
    borderRadius: 10,
    // padding:10,
    // marginBottom:15,
    // borderColor:'#a8e6a1', // soft green border
    shadowColor: '#9bd49b', // shadow similar to bg
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  inputIcon: { marginRight: 10 },
  input: {
    // flex: 1,
    // height: 48,
    // color: COLORS.textDark,
    flex: 1,
    height: 48,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,


  },
  eyeIcon: { padding: 8 },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  darkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    width: "48%",
    justifyContent: "center",
  },

  darkButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 15,
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },

  cancelButton: {
    backgroundColor: "#ff8080",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  saveButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },

  bottomText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  reminderSection: {
    // marginTop: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderColor: COLORS.border,
    borderWidth: 2,
    borderRadius: 10,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    // marginBottom: 15,
    color: "#2E7D32"
  },
  reminderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 14,
    marginHorizontal: 5
  },

  reminderText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500"
  },
  darkDialog: {
    backgroundColor: "#1E1E1E",
    borderRadius: 18,
  },


  dateTimeItemDark: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 5,
  },

  dateTimeTextDark: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "500",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },

  switchText: {
    color: "#fff",
    fontSize: 14,
  },

  dialogActionsDark: {
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  dateInput: {
    height: 48,
    fontSize: 16,
    backgroundColor: "#fff",
    paddingVertical: 12,

    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 15,
  },
  taskDetailContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50
  },

  taskDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  createdTime: {
    fontSize: 12,
    fontWeight: "bold"
  },

  saveText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16
  },

  taskDetailLabel: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: COLORS.textPrimary
  },

  taskDetailInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 10,

  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12
  },

  dateText: {
    fontSize: 14
  },

  mentionsTitle: {
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  mentionItem: {
    color: '#333',
    marginVertical: 4,
    paddingVertical: 6,
  },

  mentionsBox: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#a8e6a1',
    borderRadius: 10,
    backgroundColor: '#f9fff9',
  },

  mentionsScroll: {
    maxHeight: 120,   // scroll area height
  },

  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",   // ⭐ main fix
  },

  chip: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginVertical: 4,
    marginRight: 6,
  },

  chipText: {
    color: "#2E7D32",
  }

});

export default styles;