import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes
} from '@react-native-google-signin/google-signin';
import { useRootNavigationState, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import style from '../../assets/styles/login.styles.js';
import { registerPushToken } from '../../services/registerPushToken.jsx';
import { useAuthStore } from '../../store/authStore.js';

// Initialize Google Sign-In
const initializeGoogleSignIn = async () => {
  try {
    console.log("Initializing Google Sign-In for platform:", Platform.OS);

    GoogleSignin.configure({
      webClientId: "579924007355-ncr1om23fjr7fjnetd4r7s25f3rdljpq.apps.googleusercontent.com",
      // androidClientId: "579924007355-tmapjum1pccmd52cotg4nt57v3ddoac0.apps.googleusercontent.com",
      iosClientId: "579924007355-e1n2mqrb9c5ng7l5r3k8p4q6s9t2u3v4w.apps.googleusercontent.com", // optional; replace with actual if available
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });
    console.log("Google Sign-In initialized successfully");
  } catch (error) {
    console.error("Error initializing Google Sign-In:", error);
  }
};

// Initialize on app load
initializeGoogleSignIn();

export default function Index() {
  const { user, loginToken, isAuthChecked, setLoginToken, updateFCMToken, checkAuth,login,setPushToken } = useAuthStore();

  console.log("At (auth)/index page :: After Auth check User >>", user);
  console.log("At (auth)/index page :: Login Token >>", loginToken);
  console.log("At (auth)/index page :: isAuthChecked >>", isAuthChecked);


  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // ✅ wait until navigation ready
    if (!rootNavigationState?.key) return;

    if (isAuthChecked && loginToken) {
      router.replace('/(tabs)');
    }
  }, [rootNavigationState?.key, isAuthChecked, loginToken]);

  const handleGoogleSignIn = async () => {
    console.log("Calling handle Google sign >>");
    try {
      await GoogleSignin.hasPlayServices();
      console.log("Play services available");

      const response = await GoogleSignin.signIn();
      console.log("Full Google response >>", JSON.stringify(response, null, 2));

      if (response.type === 'success') {
        const user = response.data.user;
        const email = user.email;
        const name = user.name;

        console.log("Google sign is successful >>", { email, name });



        if (email) {
          console.log("Email from Google Sign-In >> ", email);
          await AsyncStorage.setItem("email", email);

          const responseData = await login(email);
          // const { res: loginResponse, usedUrl } = await fetchWithFallback('/api/auth/login', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ email }),
          // });
          // console.log("Used backend URL >> ", usedUrl);

          const loginData = await responseData.data;
          console.log("Backend login response status >> ", responseData.status);
          console.log("Backend login response data >> ", loginData);


          if (responseData.status === 200) {
            await AsyncStorage.setItem("user", JSON.stringify(loginData.user));
            await AsyncStorage.setItem("token", loginData.token);


            // ✅ Push token update
            const storedPushToken = await AsyncStorage.getItem("pushToken");

            if (!storedPushToken) {
              console.log("No Push Token found. Generating new token...");

              const generatedPushToken = await registerPushToken();

              console.log("Generated push notification token >> ", generatedPushToken);

              if (!generatedPushToken) {
                console.log("Push token not generated");
                return;
              }

              await AsyncStorage.setItem("pushToken", generatedPushToken);
              setPushToken(generatedPushToken);
              console.log("Push token saved & set successfully >> ", generatedPushToken);
              updateFCMToken({ fcmToken: generatedPushToken });
            } else {
              console.log("Stored Push Token >> ", storedPushToken);
              console.log("Update FCM token in backend >> ");
              updateFCMToken({ fcmToken: storedPushToken });
            }
            
            // ✅ Zustand update
            setLoginToken(loginData.token);
            // useAuthStore.setState({ user: loginData.user });
            checkAuth();

            // ✅ Navigation
            // if (!rootNavigationState?.key) return;
            router.replace('/(tabs)');
          } else {
              console.log("Generating FCM token");            
              const generatedPushToken = await registerPushToken();

              console.log("Generated push notification token >> ", generatedPushToken);

              if (!generatedPushToken) {
                console.log("Push token not generated");
                return;
              }

              await AsyncStorage.setItem("pushToken", generatedPushToken);
              setPushToken(generatedPushToken);
              console.log("Push token saved & set successfully >> ", generatedPushToken);

            console.log("Navigate to profile ");
            // ✅ Navigation
            router.replace('/profile');
          }




          // wait navigation ready
          // if (!rootNavigationState?.key) return;
          //LOGIN TOKEN

          // const getToken = async () => {
          //   try {
          //     const storedToken = await AsyncStorage.getItem("token");
          //     if (storedToken !== null) {
          //       console.log("Login Token from AsyncStorage >> ", storedToken);

          //       //UPDATE FCM TOKEN IN BACKEND                
          //       const storedPushToken = await AsyncStorage.getItem("pushToken");
          //       console.log("Stored Push Token after generation >> ", storedPushToken);
          //       console.log("Update FCM token in backend >> ");
          //       updateFCMToken({ fcmToken: storedPushToken });

          //       if (mounted) setLoginToken(storedToken);
          //     } else {
          //       console.log("No token found in AsyncStorage");
          //     }
          //   } catch (error) {
          //     console.log("Error retrieving token from AsyncStorage >> ", error);
          //   }
          // };
          // getToken();



          // if (loginToken) {
          //   console.log("Navigating to Home page");
          //   router.replace('/(tabs)');
          // } else {
          //   console.log("Navigating to profile page");
          //   router.replace('/profile');
          // }

        } else {
          console.log("Email not found in Google Sign-In response");
          Alert.alert('Error', 'Email not found in Google Sign-In response');
        }
      } else {
        Alert.alert('Sign in cancelled by user');
      }
    } catch (error) {
      console.log("Google Sign-In Error >>", error);
      console.log("Error Code:", error.code);
      console.log("Error Message:", error.message);
      console.log("Full Error Details:", JSON.stringify(error, null, 2));

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Sign In In Progress', 'Operation is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Play Services', 'Play services not available or outdated');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Alert.alert('Cancelled', 'Sign in was cancelled by user');
            break;
          default:
            Alert.alert('Something went wrong please try again after some time');
            console.log('Sign In Error', `Error: ${error.code}\n\nMessage: ${error.message}\n\nPlease ensure:\n1. SHA-1 fingerprint from your debug keystore is registered in Google Cloud Console\n2. Android OAuth 2.0 credential is created for package "com.lknandroiddapp.TaskOnTime"\n3. You're using the correct OAuth client ID`);
        }
      } else {
        console.log('Sign In Failed', error.message || 'An error occurred during sign in');
      }
    }
  };

  
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



    </View>
  )
}
