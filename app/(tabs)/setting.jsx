import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import LogoutPopup from "../../components/LogoutPopup.jsx";
import COLORS from "../../constants/colors.js";
import { formatDateOnly } from "../../lib/utils/utils.js";
import { useAuthStore } from "../../store/authStore.js";

export default function ProfileScreen() {
  const { user, profileImageUri, userNameAuth, dateOfBirthAuth, logout } = useAuthStore();
  // console.log("Profile image URI from store >> ", profileImageUri);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const profileImage = user?.profileImage?.replace(".svg", ".png") || "https://via.placeholder.com/150"; // Fallback image
  console.log("Profile Image URI >> ", profileImage);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  

  const handleLogout = async () => {
    await logout();
    setTimeout(() => {
      router.replace("/(auth)"); // Navigate to login screen
    }, 0);


    console.log("User logged out, navigating to login screen");
  };

  const handleCancel = () => {
    setLogoutVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          // paddingBottom: tabBarHeight + 20,
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}
        <LinearGradient
          colors={["#a8ff78", "#45B649"]}
          style={styles.header}
        >
          {/* Decorative Circles */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <View style={styles.circle3} />

          {/* LOGOUT ICON */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setLogoutVisible(true)} // Show logout popup
          >
            <Ionicons name="log-out-outline" size={28} color="#fff" />
          </TouchableOpacity>


          {/* Profile Image */}
          <View style={styles.profileWrapper}>
            <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
              <Image source={{ uri: profileImage || "https://via.placeholder.com/150" }}
                style={styles.profileImage}
              />
            </TouchableOpacity>

          </View>

          <Text style={styles.name}>{userNameAuth}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </LinearGradient>

        {/* BODY CARD */}
        <View style={styles.card}>
          {/* ICON ROW */}
          {/* <View style={styles.iconRow}>
          <View style={styles.iconBox}>
            <View style={[styles.iconCircle, { backgroundColor: "#fde68a" }]}>
              <Ionicons name="settings" size={24} color="#555" />
            </View>
            <Text style={styles.iconText}>Settings</Text>
          </View>

          <View style={styles.iconBox}>
            <View style={[styles.iconCircle, { backgroundColor: "#fca5a5" }]}>
              <Ionicons name="notifications" size={24} color="#555" />
            </View>
            <Text style={styles.iconText}>Notification</Text>
          </View>
        </View> */}

          {/* INFO */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mobile:</Text>
            <Text style={styles.value}>{user?.mobileNumber}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>DOB:</Text>
            <Text style={styles.value}>{formatDateOnly(dateOfBirthAuth)}</Text>
          </View>
        </View>



        {/* FULL IMAGE PREVIEW */}
        <Modal visible={imagePreviewVisible} transparent={true}>
          <TouchableOpacity
            style={styles.modalContainer}
            onPress={() => setImagePreviewVisible(false)}
          >
            <Image source={{ uri: profileImage }} style={styles.fullImage} />
          </TouchableOpacity>
        </Modal>
      </ScrollView>

      {/* ✅ EDIT PROFILE BUTTON */}
      <TouchableOpacity
        style={styles.editProfileBtn}
        onPress={() => router.push("/editProfile")}
      >
        <Text style={styles.editProfileText}>
          Edit Profile
        </Text>
      </TouchableOpacity>


      <LogoutPopup
        visible={logoutVisible}
        onCancel={handleCancel}
        onLogout={handleLogout}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  // Decorative circles behind profile image
  circle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: 30,
    left: 30,
  },
  circle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: 80,
    right: 50,
  },
  circle3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.1)",
    bottom: 20,
    left: 100,
  },

  profileWrapper: { position: "relative" },
  profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: "#fff", marginTop: -75 },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#000",
    padding: 6,
    borderRadius: 15,
  },

  name: { marginTop: 10, fontSize: 20, color: "#fff", fontWeight: "bold" },
  email: { color: "#eee" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 25,
    marginTop: -75, // overlap header
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },

  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  iconBox: { alignItems: "center" },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  iconText: { marginTop: 5, fontWeight: "500", color: "#555" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  label: { color: "#666" },
  value: { color: "#333" },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: { width: "90%", height: "70%", resizeMode: "contain" },

  editProfileBtn: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 30, // 👈 extra bottom spacing
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",

    backgroundColor: COLORS.primary,
    // marginTop: 30,
    // marginBottom: 40,
    // paddingVertical: 14,
    // borderRadius: 12,
    // alignItems: "center",
  },

  editProfileText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 100, // space for button
  },
  logoutBtn: {
    position: "absolute",
    top: 20, // adjust depending on status bar height
    right: 20,
    zIndex: 10,
  },
});