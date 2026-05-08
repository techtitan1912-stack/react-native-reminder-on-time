import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../store/authStore.js";
// import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import style from "../assets/styles/profile.styles.js";
import COLORS from '../constants/colors.js';
import { formatDateOnly } from '../lib/utils/utils.js';


export default function EditProfile({ navigation }) {


    const { user, updateProfile, setProfileImageUri, setUserNameAuth, setDateOfBirthAuth } = useAuthStore();

    const [profileImage, setProfileImage] = useState(user?.profileImage?.replace(".svg", ".png"));
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userName, setUserName] = useState(user?.username);
    const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth);
    const router = useRouter();


    const toggleDatePicker = () => {
        console.log("Toggling Date Picker");
        setShowDatePicker(!showDatePicker);
    }
    const onDateChange = ({ type }, selectedDate) => {
        if (type == "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            console.log("Selected DOB >>", currentDate.toDateString());

            if (new Date(currentDate) >= new Date()) {
                alert("Date of Birth cannot be in the future");
                return;
            }
            setDateOfBirth(currentDate.toDateString());
            setDateOfBirthAuth(currentDate.toDateString());
            toggleDatePicker();

        } else {
            toggleDatePicker();

        }
    }

    const onChangeUserName = (text) => {
        setUserName(text);
        setUserNameAuth(text);
    }
    // 📷 Pick image from gallery
    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            //   alert("Permission required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            console.log("Selected image URI >> ", result.assets[0].uri);
            setProfileImage(result.assets[0].uri);
            setProfileImageUri(result.assets[0].uri)
        }
    };

    const handleSaveProfile = async () => {
        router.back();
        const result = await updateProfile({
            userName,
            dateOfBirth,
            profileImage
        });

        if (result.success) {
            console.log("Profile updated successfully, going back to settings")


        } else {
            alert(result.message);
        }
    }

    const handleBackBtn = () => {
        setProfileImageUri(user?.profileImage?.replace(".svg", ".png"));
        setUserNameAuth(user?.username);
        setDateOfBirthAuth(user?.dateOfBirth);
        router.back();
    }



    return (
        <ScrollView style={styles.container}>


            {/* Header with Back Arrow */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackBtn}>
                    <Ionicons name="arrow-back" size={26} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>

            <View style={styles.profileHeader}>
                {/* Profile Image */}
                <View style={styles.profileWrapper}>
                    <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
                        <Image source={{ uri: profileImage }}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>

                    {/* EDIT ICON */}
                    <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
                        <Ionicons name="camera-sharp" size={18} color="#fff" />
                    </TouchableOpacity>


                </View>
            </View>
            {/* Input Fields */}
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Full Name"
                    style={styles.input}
                    value={userName}
                    onChangeText={onChangeUserName}
                />
                {/* DOB */}
                <View style={styles.input}>

                    <Text>DOB</Text>

                    <Pressable style={style.dateInput} onPress={toggleDatePicker}>
                        <Ionicons
                            name="calendar-outline"
                            size={20}
                            color={COLORS.primary}
                            style={{ marginRight: 10 }}
                        />

                        <Text
                            style={{
                                color: dateOfBirth ? COLORS.textDark : COLORS.placeholderText,
                                flex: 1,
                            }}
                        >
                            {formatDateOnly(dateOfBirth) || 'Enter your DOB'}
                        </Text>
                    </Pressable>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="spinner"
                            onChange={onDateChange}
                        />
                    )}

                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.backBtn]}
                    onPress={handleBackBtn}
                >
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.saveBtn]}
                    onPress={handleSaveProfile}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
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
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        height: 200,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },

    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 10,
    },

    imageContainer: {
        alignItems: "center",
        marginVertical: 20,
    },

    // profileImage: {
    //     width: 110,
    //     height: 110,
    //     borderRadius: 55,
    // },

    inputContainer: {
        // marginTop: 2,
    },

    input: {
        borderWidth: 1,
        borderColor: COLORS.activeOutline,
        borderRadius: 10,
        padding: 14,
        marginBottom: 12,
        fontSize: 16,
    },

    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },

    button: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    backBtn: {
        backgroundColor: COLORS.cancelBtn,
        marginRight: 10,
    },

    saveBtn: {
        backgroundColor: COLORS.primary,
        marginLeft: 10,
    },

    backText: {
        color: "#000",
        fontWeight: "600",
    },

    saveText: {
        color: "#fff",
        fontWeight: "600",
    },

    profileWrapper: { position: "relative" },
    profileImage: { width: 90, height: 90, borderRadius: 55, borderWidth: 2, borderColor: COLORS.primary, marginTop: -45 },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#000",
        padding: 6,
        borderRadius: 15,
    },
    fullImage: { width: "90%", height: "70%", resizeMode: "contain" },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
});