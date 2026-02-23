import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import style from '../../assets/styles/login.styles.js';
import { useAuthStore } from '../../store/authStore.js';

GoogleSignin.configure({
  webClientId: "579924007355-ncr1om23fjr7fjnetd4r7s25f3rdljpq.apps.googleusercontent.com",
});

export default function Index() {
  const{user, token, checkAuth} = useAuthStore();

  console.log("At index page auth store data >>", user, token);

  useEffect(() => {
    checkAuth();
  }, []);
  
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        console.log("Google sign is successful >>", response.data);
        setUserInfo(response.data);

        const email = response.data?.user?.email;
        if (email) {
          console.log("Email from Google Sign-In >> ", email);
          await AsyncStorage.setItem("email", email);
        } else {
          console.log("Email not found in Google Sign-In response");
        }
        router.replace('/profile');
      } else {
        Alert.alert('Sign in cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Operation (e.g. sign in) is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play services not available or outdated');
            break;
          default:
          // some other error happened
        }
      } else {
        Alert.alert('An error occurred during sign in');
        console.log("Google Sign-In Error >>", error);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
      Alert.alert('Successfully signed out');
    } catch (error) {
      console.log("Logout Error >>", error);
      Alert.alert('An error occurred during sign out');
    }
  }
  return (
    <View style={style.container}>
      <View style={style.topIllustration}>

        <Image
          source={require('../../assets/images/loginimage.png')}
          style={style.illustrationImage}
          resizeMode="contain"
        />
      </View>
      <View style={style.header}>
        <Text style={style.headerTitle}>Let's get started!</Text>
        <Text style={style.headerTitle}>Sign in to continue</Text>
      </View>
      <View >

        <View>
          <TouchableOpacity style={style.googleButton} onPress={handleGoogleSignIn}>
            <View style={style.googleInner}>
              <Image
                source={require("../../assets/images/google.png")}
                style={style.googleIcon}
              />
              <Text style={style.googleText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <TouchableOpacity style={style.googleButton} onPress={handleSignOut}>
          <Text style={style.googleText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <Link href="/(tabs)">Go to Home Page</Link>
      <Link href="/(auth)/profile">Go to Profile</Link>

    </View>
  )
}
