import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity,
  TouchableWithoutFeedback, View
} from 'react-native';
import style from '../../assets/styles/profile.styles.js';
import COLORS from '../../constants/colors.js';
import { formatDateOnly } from '../../lib/utils/utils.js';
import { useAuthStore } from '../../store/authStore.js';

const Profile = () => {
  const { user, register } = useAuthStore();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const [userName, setUserName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({ userName: "", dateOfBirth: "", mobileNumber: "" });
  const [email, setEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  //Get email from async storage
  useEffect(() => {
    let mounted = true;

    const getEmailData = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        if (storedEmail !== null) {
          console.log("Email from AsyncStorage >> ", storedEmail);
          if (mounted) setEmail(storedEmail);

        } else {
          console.log("No email found in AsyncStorage");
        }
      } catch (error) {
        console.log("Error retrieving email from AsyncStorage >> ", error);
      }
    };
    getEmailData();

    return () => { mounted = false; };

  }, []);


    // Save user profile data and push token to backend
  const handleSaveProfile = async () => {

    let newErrors = { userName: "", dateOfBirth: "", mobileNumber: "" };

    console.log("Validating form...Name :", userName, ", DOB : ", dateOfBirth, ", Mobile : ", mobileNumber);
    if (!userName.trim()) {
      newErrors.userName = "Full Name is required";
    }
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (new Date(dateOfBirth) >= new Date()) {
      newErrors.dateOfBirth = "Date of Birth cannot be in the future";
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (mobileNumber?.trim()?.length !== 10) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
    }

    setErrors(newErrors);

    // ✅ Check if any error exists
    const hasError = Object.values(newErrors).some(
      (error) => error !== ""
    );

    if (hasError) {
      console.log("Validation failed ❌");
      return; // 🚀 STOP here if errors
    }

    setIsLoading(true);



    try {
      // Save profile logic here (e.g., API call)
      const pushToken = await AsyncStorage.getItem("pushToken");

      console.log("Push token got from AsyncStorage >> ", pushToken);

      const saveProfileResult = await register(userName, dateOfBirth, mobileNumber, email, pushToken)

      if (!saveProfileResult.success) {
        Alert.alert("Something went wrong contact to administrator ! ", saveProfileResult.error)
        setIsLoading(false);
        return;
      } else {
        console.log("Save user profile successfuly")
        router.replace("/(tabs)")

      }
      if (!rootNavigationState?.key) return;


    } catch (error) {
      console.log("Error saving user profile >> ", error);
      setIsLoading(false)
    }

  }
  const toggleDatePicker = () => {
    // console.log("Toggling Date Picker");
    setShowDatePicker(!showDatePicker);
  }

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      console.log("Selected DOB >>", currentDate.toDateString());
      setDateOfBirth(currentDate.toDateString());
      toggleDatePicker();

    } else {
      toggleDatePicker();

    }
    // const currentDate = selectedDate || date;
    // setShowDatePicker(Platform.OS === 'ios');
    // setDate(currentDate);
    // let tempDate = new Date(currentDate);
    // let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
    // setDateOfBirth(fDate);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accesible={false}>
        <View style={style.container}>
          <View style={style.card}>
            {/* Header */}
            <View style={style.header}>
              <Text style={style.title}>Profile</Text>
              <Text style={style.subtitle}>Complete your profile information</Text>
            </View>

            <View style={style.formContainer}>
              {/* Full Name */}
              <View style={style.inputGroup}>
                <Text style={style.label}>Full Name <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={style.inputContainer}>
                  <Ionicons
                    name="person-circle-outline"
                    style={style.inputIcon}
                    size={20}
                    color={COLORS.primary}
                  />
                  <TextInput
                    style={style.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.placeholderText}
                    value={userName}
                    onChangeText={(text) => {
                      setUserName(text);
                      if (text.trim()) setErrors(prev => ({ ...prev, userName: "" }));
                    }}
                    autoCapitalize="none"
                    keyboardType="default"
                  />
                </View>
                {errors.userName && <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.userName}</Text>}
              </View>

              {/* DOB */}
              <View style={style.inputGroup}>
                <Text style={style.label}>
                  Date of Birth <Text style={{ color: 'red' }}>*</Text>
                </Text>

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
                    {formatDateOnly(dateOfBirth.trim()) || 'Enter your DOB'}
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

                {errors.dateOfBirth && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.dateOfBirth}
                  </Text>
                )}
              </View>
              {/* MOB NO */}
              <View style={style.inputGroup}>
                <Text style={style.label}>Mobile Number <Text style={{ color: 'red' }}>*</Text></Text>
                <View style={style.inputContainer}>
                  <Ionicons
                    name="phone-portrait-outline"
                    style={style.inputIcon}
                    size={20}
                    color={COLORS.primary}
                  />
                  <TextInput
                    style={style.input}
                    placeholder="Enter your mobile number"
                    placeholderTextColor={COLORS.placeholderText}
                    value={mobileNumber}
                    onChangeText={(text = "") => {
                      setMobileNumber(text);
                      if (text.trim().length > 0) {
                        setErrors(prev => ({ ...prev, mobileNumber: "" }));
                      }
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
                {errors?.mobileNumber?.length > 0 && (
                  <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>
                    {errors.mobileNumber}
                  </Text>
                )}
              </View>

              <TouchableOpacity style={style.button} onPress={handleSaveProfile}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={style.buttonText}>Continue</Text>
                )}
              </TouchableOpacity>
            </View>
          </View >

        </View >
      </TouchableWithoutFeedback>

    </KeyboardAvoidingView >
  )
}

export default Profile