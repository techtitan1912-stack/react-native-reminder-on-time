// styles/home.styles.js
import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "JetBrainsMono-Medium",
    letterSpacing: 0.5,
    color: COLORS.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  taskCard: {
    flexDirection: "row",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 15,
    marginBottom: 2,
    padding: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,

    alignItems: "center",
    marginVertical: 4,
    marginHorizontal: 5,
    // backgroundColor: "#fff",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 25,
    marginRight: 6,
  },
  username: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  taskImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: COLORS.border,
  },
  taskImage: {
    width: "100%",
    height: "100%",
  },
  taskDetails: {
    padding: 2,
  },
  taskTitle: {
    // fontSize: 15,
    // fontWeight: "600",
    // color: COLORS.textPrimary,
    marginBottom: 1,

    color: "#37474F",
    fontWeight: "500",
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 8,
    lineHeight: 20,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  footerLoader: {
    marginVertical: 20,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 8,
    // marginBottom: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    // borderWidth: 1,
    // borderColor: COLORS.border,
  },
  filterContainer: {
    flex: "1",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 1,
    // marginBottom: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profileHeaderBox: {
    // flex:"1",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 4,
    // marginBottom: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 16,
  },
  taskProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 40,
    marginRight: 5,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  userNameOnTaskCard: {
    color: "#1B5E20",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  inputIcon: { marginRight: 10 },
  input: {
    backgroundColor: "#4B4258",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1.5,
    borderColor: "#4CAF50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3E3646",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    marginBottom: 15,
    height: 55,
  },
  inputWrapper: {
    marginBottom: 18,
  },
  paperInput: {
    marginBottom: 15,
    backgroundColor: "#3E3646",
    fontSize: 16,
    paddingHorizontal: 15,
  },
  darkInput: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 55,

    // Shadow
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },

  dateTimeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#1e1e1e",
  },

  dateTimeText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "700",
  },
  dialog: {
    backgroundColor: "#3A3244",
    borderRadius: 25,
    paddingVertical: 20,
  },

  dialogTitle: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    marginBottom: 25,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
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
    marginTop: 35,
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
  badge: {
    paddingHorizontal: 10,
    // paddingVertical: 8,
    padding: 6,
    borderRadius: 12,
    marginBottom: 4,
    // marginRight: 4, // 👈 space between badges
    // alignSelf: "flex-start",
  },
  badgeContainer: {
    flexDirection: "column",  // 👈 multiple badges side by side
    alignItems: "flex-end",
    marginRight: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },

  mention: {
    backgroundColor: "#3b82f6", // blue
  },

  pending: {
    backgroundColor: "#f59e0b", // orange
  },
  complete: {
    backgroundColor: "#4CAF50", // orange
  },

  newBadge: {
    backgroundColor: "#8b5cf6", // purple (Mention + Pending)
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  // MIDDLE
  middle: {
    flex: 1, // 👈 IMPORTANT (takes available space)
    justifyContent: "center",
  },
  // LEFT
  left: {
    // marginRight: 1,
  },
  date: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
  // RIGHT
  right: {
    flexDirection: "row",   // 👈 IMPORTANT (side by side)
    alignItems: "center",   // 👈 vertical center
    // justifyContent: "flex-end",
    // gap: 1,                 // 👈 spacing (RN >= 0.71)
  },

  menuBtn: {
    justifyContent: "center",
    alignItems: "center",
  },

  completedTitle: {
    textDecorationLine: "line-through",
    color: "#9CA3AF", // grey color
  },

  //
  showTaskDetails: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    marginVertical: 6,

    // Default shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    elevation: 3, // Android
  },

  taskCardPressed: {
    // Green glow shadow (UI match)
    shadowColor: "#4CAF50", // green
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,

    elevation: 8, // Android strong shadow

    transform: [{ scale: 0.98 }],
  },

  newBadge: {
    backgroundColor: "#FF3B30", // 🔴 modern red
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },

  newBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 0.5,
  }

});

export default styles;