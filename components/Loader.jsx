import { ActivityIndicator, View } from "react-native";

import COLORS from "../constants/colors";

export default function Loader({ size = "large" }) {
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.background,
            }}
        >
            <ActivityIndicator
                size={size} color={COLORS.primary}
            />


        </View>
    )
};