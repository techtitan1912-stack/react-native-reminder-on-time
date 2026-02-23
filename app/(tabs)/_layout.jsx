import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../constants/colors';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{ headerShown: false,
                tabBarActiveTintColor:COLORS.primary,
                headerTitleStyle:{
                    fontWeight:"600",
                    color: COLORS.textPrimary
                },
                headerShadowVisible:false,
                tabBarStyle:{
                    backgroundColor:COLORS.cardBackground,
                    borderTopWidth:1,
                    borderTopColor: COLORS.border,
                    paddingTop:5,
                    paddingBottom:insets.bottom,
                    height:60+insets.bottom,
                },


             }}
        >
            <Tabs.Screen name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (<Ionicons
                        name="home-outline" size={size} color={color}
                    />)
                }}
            />
            <Tabs.Screen name="setting"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (<Ionicons
                        name="settings-outline" size={size} color={color}
                    />)
                }}
            />
        </Tabs>
    );
}
