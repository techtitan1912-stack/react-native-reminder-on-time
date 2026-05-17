import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { BASE_URL } from "../lib/utils/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  loginToken: null,
  isLoading: false,
  email: null,
  isAuthChecked: false,
  showTaskPopup: false,
  // store an array by default so callers can safely call .filter/.map
  tasks: [],
  pushToken: null,
  profileImageUri: "https://via.placeholder.com/150", // Default placeholder image
  userNameAuth: null,
  dateOfBirthAuth: null,

  setTasks: (tasks) => set({ tasks }),
  setShowTaskPopup: (show) => set({ showTaskPopup: show }),
  setPushToken: (token) => set({ pushToken: token }),
  setProfileImageUri: (imageUri) => set({ profileImageUri: imageUri }),
  setUserNameAuth: (userName) => set({ userNameAuth: userName }),
  setDateOfBirthAuth: (dateOfBirth) => set({ dateOfBirthAuth: dateOfBirth }),
  setLoginToken: (token) => set({ loginToken: token }),

  login: async (email) => {

    set({ isLoading: true });

    try {
      console.log("Login user with email >> ", { email });
      console.log("Login Using backend URL >> ", BASE_URL);

      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email
        }),

      });
      const data = await response.json();

      console.log("Login API response status >> ", response.status);
      console.log("Login API response data >> ", data);

      return {
        status: response.status,
        data
      };
    } catch (error) {
      console.log("Error in login >> ", error);
      set({ isLoading: false })
      return { success: false, message: error.message || "Login failed" };
    }


  },

  register: async (userName, dateOfBirth, mobileNumber, email, pushToken) => {

    // set({ isLoading: true });

    try {
      console.log("Saving user profile with data >> ", { userName, dateOfBirth, mobileNumber, email, pushToken });
      console.log("Using backend URL >> ", BASE_URL);

      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          email,
          mobileNumber,
          dateOfBirth,
          pushToken
        }),

      });
      const responseData = await response.json();
      console.log("At save user profile Response Data >> ", responseData);
      if (!response.ok) throw new Error(responseData.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(responseData.user));
      await AsyncStorage.setItem("loginToken", responseData.token);

      set({
        user: responseData.user, loginToken: responseData.token, email: email, isLoading: false, pushToken: pushToken,
        profileImageUri: responseData.user.profileImage || null,
        userNameAuth: responseData.user.username || null,
        dateOfBirthAuth: responseData.user.dateOfBirth || null

      });

      console.log("Response Data User >>", responseData.user);
      console.log("Response Data Token >>", responseData.token);

      return { success: true, message: "Registration successful" };
    } catch (error) {
      console.log("Error in register >> ", error);
      set({ isLoading: false })
      return { success: false, message: error.message || "Registration failed" };
    }


  },

  //get task list of user
  getTaskList: async (userName, pageNumber, limit) => {

    set({ isLoading: true });

    try {
      console.log("At auth store Getting task list with data >> ", { userName, pageNumber, limit });

      // backend expects page/limit as query params, not a request body
      const url = `${BASE_URL}/api/tasks/getTasks?page=${pageNumber}&limit=${limit}`;
      console.log("GET task list from", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const responseData = await response.json();
      console.log("At authstore to get task list Response Data >> ", responseData);
      if (!response.ok) throw new Error(responseData.message || "Something went wrong");

      set({ isLoading: false })

      console.log("Response Data User >>", responseData.user);
      console.log("Response Data Token >>", responseData.token);

      return { success: true, message: "Task list fetched successfully", data: responseData };
    } catch (error) {
      console.log("Error in getTaskList >> ", error);
      set({ isLoading: false })
      return { success: false, message: error.message || "Failed to fetch task list" };
    }


  },

  checkAuth: async () => {
    try {
      const loginToken = await AsyncStorage.getItem("token")
      const userJson = await AsyncStorage.getItem("user")
      const storedUserData = userJson ? JSON.parse(userJson) : null;
      const storedPushToken = await AsyncStorage.getItem("pushToken");
      let pushTokenData = null;
      if (loginToken) {
        if (storedPushToken) {
          set({ pushToken: storedPushToken });
          console.log("At checkAuth Push Token found from storage:", storedPushToken);
        } else {
          console.log("No Push Token found during auth check. Getting push token from DB...");
          const userDetails = await fetch(`${BASE_URL}/api/auth/getUserDetails`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${loginToken}`
            }
          });
          const userDetailsData = await userDetails.json();
          pushTokenData = userDetailsData.pushToken || {};
          set({ pushToken: pushTokenData });
          console.log("Generated push notification token during auth check >> ", pushTokenData);
        }
      }

      if (loginToken && storedUserData && (storedPushToken || pushTokenData)) {
        set({
          loginToken, user: storedUserData, isAuthChecked: true, profileImageUri: storedUserData?.profileImage || null,
          userNameAuth: storedUserData?.username || null, dateOfBirthAuth: storedUserData?.dateOfBirth || null
        });
      } else {
        console.log("At AuthStore checkAuth >>  No valid auth data found");
        set({ isAuthChecked: false })
      }
      console.log("At AuthStore checkAuth >>  Checking auth done ")
    } catch (error) {
      console.log("Auth check failed", error);
    }
  },

  logout: async () => {
    try {
      // AsyncStorage clear

      await AsyncStorage.clear();
      console.log("AsyncStorage Cleared");

      // await AsyncStorage.multiRemove([
      //   "token",
      //   "user",
      //   "email",
      //   "pushToken"
      // ]);

      // Zustand store reset
      set({
        user: null,
        loginToken: null,
        email: null,
        isAuthChecked: false,
        tasks: [],
        pushToken: null,
        showTaskPopup: false,
        profileImageUri: "https://via.placeholder.com/150",
        userNameAuth: null,
        dateOfBirthAuth: null
      });

    } catch (error) {
      console.log("Logout failed", error);
    }
  },

  updateProfile: async ({ userName, dateOfBirth, profileImage }) => {
    try {

      const token = await AsyncStorage.getItem("token");

      console.log("Updating profile with data >> ", { userName, dateOfBirth, profileImage });

      const formData = new FormData();

      formData.append("userName", userName);
      formData.append("dateOfBirth", dateOfBirth);

      // Send image only if local file
      if (
        profileImage &&
        profileImage.startsWith("file")
      ) {
        formData.append("profileImage", {
          uri: profileImage,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      const response = await fetch(
        `${BASE_URL}/api/auth/updateProfile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      console.log("Update profile response >> ", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Profile update failed");
      }

      // ✅ Create updated user object
      const updatedUser = responseData.updatedUser;

      // ✅ Update AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Update Zustand state
      set({ user: updatedUser });

      console.log("User updated in AsyncStorage successfully");
      return { success: true };

    } catch (error) {

      console.log("Error in updateProfile >> ", error);

      return {
        success: false,
        message: error.message,
      };

    }
  },

  updateFCMToken: async ({ fcmToken }) => {
    try {

      const loginToken = await AsyncStorage.getItem("token");

      console.log("Updating FCM token with data >> ", { fcmToken });

      const response = await fetch(`${BASE_URL}/api/auth/updateFCMToken`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginToken}`,
          },
          body: JSON.stringify({
            pushToken: fcmToken,
          }),
        }
      );

      const data = await response.json();

      console.log("Update FCM token response >> ", data);

      if (!response.ok) {
        throw new Error(data.message || "FCM token update failed");
      }


      console.log("FCM token updated in AsyncStorage successfully");
      return { success: true };

    } catch (error) {

      console.log("Error in updateFCMToken >> ", error);

      return {
        success: false,
        message: error.message,
      };

    }
  }
}));