import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";
import styles from "../assets/styles/home.styles";
import { useAuthStore } from "../store/authStore";

// Removing console.log to avoid excessive logging on every render
export default React.memo(function ProfileHeader(){
    const {user} = useAuthStore();
    console.log("user info >>", user)

    return(
        <View style={styles.profileHeader}>
            <Image source={{uri: user.profileImage}} style={styles.profileImage}/>
            
            <View style={styles.profileInfo}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
            </View>
        </View>
    );
})