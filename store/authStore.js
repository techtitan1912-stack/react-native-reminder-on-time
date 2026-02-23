import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { BASE_URL } from "../lib/utils/api.js";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  email: null,
  isAuthChecked: false,
  // store an array by default so callers can safely call .filter/.map
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  // init: () => {
  //   const state = get();
  //   console.log(
  //     "Auth Store Initialized",
  //     state.user,
  //     state.token,
  //     state.email,
  //     state.isLoading
  //   );
  // },

  register: async (userName, dateOfBirth, mobileNumber, email) => {

    set({ isLoading: true });

    try {
      console.log("Saving user profile with data >> ", { userName, dateOfBirth, mobileNumber, email });

      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userName,
          email,
          mobileNumber,
          dateOfBirth
        }),

      });
      const responseData = await response.json();
      console.log("At save user profile Response Data >> ", responseData);
      if (!response.ok) throw new Error(responseData.message || "Something went wrong");

      await AsyncStorage.setItem("user", JSON.stringify(responseData.user));
      await AsyncStorage.setItem("token", responseData.token);

      set({ user: responseData.user, token: responseData.token, email: email, isLoading: false })

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
      console.log("Getting task list with data >> ", { userName, pageNumber, limit });

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
      console.log("At get task list Response Data >> ", responseData);
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
      const token = await AsyncStorage.getItem("token")
      const userJson = await AsyncStorage.getItem("user")
      const user = userJson ? JSON.parse(userJson) : null;
      
      set({ token, user, isAuthChecked:true });
      console.log("At checkAuth >>  check auth done ")
    } catch (error) {
      console.log("Auth check failed", error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("user")

      set({ token: null, user: null });
    } catch (error) {
      console.log("Auth check failed", error);
    }
  }
}));