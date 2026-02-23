import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import style from '../../assets/styles/profile.styles.js';
import COLORS from '../../constants/colors.js';
import { useAuthStore } from '../../store/authStore.js';


const Profile = () => {
  const{user, isLoading,register} = useAuthStore();
  
  const [userName, setUserName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({ userName: "", dateOfBirth: "", mobileNumber: "" });
  const [email, setEmail] = useState(null);
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

    return () => {
      mounted = false;
    };
    
  }, []);

  const handleSaveProfile = async () => {

    let newErrors = { userName: "", dateOfBirth: "", mobileNumber: "" };

    console.log("Validating form...Name :", userName, ", DOB : ", dateOfBirth, ", Mobile : ", mobileNumber);
    if (!userName.trim()) {
      newErrors.userName = "Full Name is required";
    }
    if (!dateOfBirth.trim()) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (mobileNumber?.trim()?.length !== 10) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits";
    }

    setErrors(newErrors);

    // Save profile logic here (e.g., API call)

    const saveProfileResult = await register(userName, dateOfBirth, mobileNumber, email)

      if(!saveProfileResult.success){
       Alert.alert("Error >> ", saveProfileResult.error )
      }else{
        console.log("Save user profile successfuly") 
        router.replace("/(tabs)")
      }  

    // try {
    //   console.log("Saving user profile with data >> ", { userName, dateOfBirth, mobileNumber, email });

    //   const response = await fetch("http://localhost:3000/api/auth/register", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       userName,
    //       email,
    //       mobileNumber,
    //       dateOfBirth         
    //     }),

    //   });
    //  const responseData = await response.json();
    //   console.log("At save user profile Response Data >> ", responseData);
    //   if (!response.ok) throw new Error(responseData.message || "Something went wrong");

    //   await AsyncStorage.setItem("user", JSON.stringify(responseData.user));
    //   await AsyncStorage.setItem("token", responseData.token);

    //   console.log("Response Data User >>",responseData.user);
    //   console.log("Response Data Token >>",responseData.token);

    //   return { success: true, message: "Registration successful" };
    // } catch (error) {
    //   console.log("Error in register >> ", error);
    //   return { success: false, message: error.message || "Registration failed" };
    // }

    // if (!newErrors.userName.trim() && !newErrors.dateOfBirth.trim() && !newErrors.mobileNumber.trim()) {
    //   Alert.alert(`${userName} ${dateOfBirth} ${mobileNumber}`);
    // } else {
    //   Alert.alert("Validation Error", "Please fill in all required fields correctly");
    //   return;
    // }

    // Alert.alert(`${userName} ${dateOfBirth} ${mobileNumber}`);
  }
  const toggleDatePicker = () => {
    console.log("Toggling Date Picker");
    setShowDatePicker(!showDatePicker);
  }

  const onDateChange = ({ type }, selectedDate) => {
    if (type == "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      console.log("Current Date >>", currentDate.toDateString());
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
  // useEffect(() => {
  //   if (userName.trim() !== "" && dateOfBirth.trim() !== "" && mobileNumber.trim()?.length === 10) {
  //     setFormReady(true);
  //   } else {
  //     setFormReady(false);
  //   }
  // }, [userName, dateOfBirth, mobileNumber]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>

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
              <Text style={style.label}>Date of Birth <Text style={{ color: 'red' }}>*</Text></Text>
              <View style={style.inputContainer}>
                { /*remove this tag if error not solved */}
                <View style={style.input}>
                  <Ionicons
                    name="calendar-outline"
                    style={style.inputIcon}
                    size={20}
                    color={COLORS.primary}
                  />
                  {!showDatePicker && (
                    <Pressable onPress={toggleDatePicker} style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={[style.input, { color: dateOfBirth ? COLORS.textDark : COLORS.placeholderText }]}>
                        {dateOfBirth ? dateOfBirth : 'Enter your DOB'}
                      </Text>
                    </Pressable>
                  )}
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display='spinner'
                      onChange={onDateChange}
                    />
                  )}

                </View>
              </View>
              {errors.dateOfBirth && <Text style={{ color: 'red', fontSize: 12, marginTop: 5 }}>{errors.dateOfBirth}</Text>}
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
        </View>

      </View>

    </KeyboardAvoidingView>
  )
}

export default Profile