import * as React from "react";
import { useEffect } from "react";
import {
    NavigationContainer,
    DefaultTheme,
    useNavigation,
} from "@react-navigation/native";
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
    createDrawerNavigator,
} from "@react-navigation/drawer";
import {
    PaperProvider,
    adaptNavigationTheme,
    Button,
    IconButton,
    Text,
} from "react-native-paper";
import { BackHandler, Image, View } from "react-native";
import HomeScreen from "./src/views/Home/Index";
import SongDetails from "./src/views/SongDetails/Index";
import Profile from "./src/views/Profile/Index";
import Login from "./src/views/Login/Index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sessionNames from "./src/utils/sessionInfo";

const theme = {
    ...LightTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
        ...DefaultTheme.colors,
        primary: "#6b65c7",
        primaryLight: "#A19DDB",
        primaryLightRGBA: "rgba(210, 208, 242, 0.18)",
        primaryContrast: "#fff",
        darkColor: "#646471",
        loved: "red",
    },
};

const { LightTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    backgroundColor: "#6b65c7",
});

function CustomDrawerContent(props) {
    const { navigation } = props;
    const handleLogout = () => {
        function backAction() {
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        AsyncStorage.getAllKeys()
            .then((keys) => {
                keys.forEach(async (key) => {
                    await AsyncStorage.removeItem(key);
                });
            })
            .catch((error) => console.error(error));
        navigation.navigate("Login");
    };

    return (
        <DrawerContentScrollView>
            <DrawerItemList {...props} />
            <DrawerItem
                label="Cerrar Sesión"
                onPress={handleLogout}
                icon={({ color, size }) => (
                    <IconButton
                        icon="exit-to-app"
                        size={size}
                        iconColor={color}
                    />
                )}
            />
        </DrawerContentScrollView>
    );
}

const Routes = [
    {
        name: "Home",
        component: HomeScreen,
        options: (navigation) => ({
            title: "Inicio",
            headerStyle: {
                backgroundColor: theme.colors.primary,
                shadowOpacity: 0,
                elevation: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            drawerIcon: () => <IconButton icon="home" />,
            headerRight: () => (
                <IconButton
                    icon="account"
                    iconColor={theme.colors.primaryContrast}
                    onPress={() => {
                        navigation.navigate("Profile");
                    }}
                />
            ),
        }),
    },
    {
        name: "Details",
        component: SongDetails,
        options: (navigation) => ({
            title: "Detalles de Canción",
            headerStyle: {
                backgroundColor: "#6b65c7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            drawerItemStyle: {
                display: "none",
            },
            gestureEnabled: false,
            headerRight: () => (
                <IconButton
                    icon="arrow-left"
                    onPress={() => {
                        navigation.goBack();
                    }}
                    iconColor={theme.colors.primaryContrast}
                />
            ),
        }),
    },
    {
        name: "Profile",
        component: Profile,
        options: (navigation) => ({
            title: "Mi Perfil",
            headerStyle: {
                backgroundColor: "#6b65c7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            drawerIcon: () => <IconButton icon="account" />,
        }),
    },
    {
        name: "Login",
        component: Login,
        options: (navigation) => ({
            title: "Iniciar Sesión",
            headerStyle: {
                backgroundColor: "#6b65c7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
                fontWeight: "bold",
            },
            drawerItemStyle: {
                display: "none",
            },
            swipeEnabled: false,
            headerShown: false,
            drawerIcon: () => <IconButton icon="account" />,
        }),
    },
];
const Drawer = createDrawerNavigator();

function MyDrawer() {
    const navigation = useNavigation();
    const [userName, setUserName] = React.useState(null);

    async function getUser() {
        return await AsyncStorage.getItem(sessionNames.user);
    }
    useEffect(() => {
        setUserName(getUser());
    }, []);

    return (
        <Drawer.Navigator
            drawerIcon={() => <Button icon="menu" />}
            initialRouteName={!userName ? "Login" : "Home"}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            {Routes.map((v, k) => (
                <Drawer.Screen key={k} {...v} options={v.options(navigation)} />
            ))}
        </Drawer.Navigator>
    );
}

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer theme={LightTheme}>
                <MyDrawer />
            </NavigationContainer>
        </PaperProvider>
    );
}
