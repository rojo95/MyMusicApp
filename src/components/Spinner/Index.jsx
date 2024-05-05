import { ActivityIndicator, MD2Colors, useTheme } from "react-native-paper";

export default function Spinner({ activate = true, size = 100, color }) {
    const theme = useTheme();

    return (
        <ActivityIndicator
            animating={activate}
            color={color || theme.colors.primary}
            size={size}
        />
    );
}
