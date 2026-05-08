import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../../constants/colors.js';

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const TabItem = ({ isActive, onPress, icon }) => {
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Active Top Border */}
                {isActive && (
                    <View
                        style={{
                            position: "absolute",
                            top: -19,
                            height: 3,
                            width: 30,
                            backgroundColor: COLORS.primary,
                            borderRadius: 10,
                        }}
                    />
                )}

                <Ionicons
                    name={icon}
                    size={24}
                    color={isActive ? COLORS.primary : "#999"}
                />
            </TouchableOpacity>
        );
    };

    const CustomTabBar = ({ state, navigation }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    height: 60 + insets.bottom, // 👈 dynamic height
                    paddingBottom: insets.bottom, //
                    backgroundColor: COLORS.background,
                    elevation: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    // justifyContent: "space-around",
                    alignItems: "center",
                }}
            >
                {/* Home */}
                <TabItem
                    icon="home"
                    isActive={state.index === 0}
                    onPress={() => navigation.navigate("index")}
                />

                <TabItem
                    icon="settings"
                    isActive={state.index === 1}
                    onPress={() => navigation.navigate("setting")}
                />
            </View>
        );
    };

    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="setting" />
        </Tabs>
    );
}