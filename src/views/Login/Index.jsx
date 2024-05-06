import { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    useWindowDimensions,
    BackHandler,
    Alert,
} from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import getMobileSession from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sessionNames from "../../utils/sessionInfo";

export default function LoginScreen({ navigation }) {
    const theme = useTheme();
    const [states, setStates] = useState({
        username: "",
        password: "",
        showPass: false,
    });
    const [loading, setLoading] = useState(false);
    const { width, height } = useWindowDimensions();

    function handleData({ name, value }) {
        setStates((prevStates) => ({ ...prevStates, [name]: value }));
    }

    async function onLoginPress() {
        if (loading) return;
        setLoading(true);
        const { username, password } = states;

        if (!username || !password)
            return alert("Debe llenar los campos de manera correcta");

        const { session } = await getMobileSession({ username, password });
        console.log(session);

        if (!session) {
            setLoading(false);
            return Alert.alert(
                "No ha podido iniciar sesion verifique sus credenciales."
            );
        }

        await AsyncStorage.setItem(sessionNames.user, session.name);
        await AsyncStorage.setItem(sessionNames.key, session.key);

        navigation.navigate("Home");
        setLoading(false);
        return setStates({
            username: "",
            password: "",
            showPass: false,
        });
    }

    useEffect(() => {
        function backAction() {
            return true;
        }

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: width > height ? "row" : "column",
        },
        imageContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 100,
        },
        imgInternalCont: {
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 3 },
            elevation: 5, // Android
            backgroundColor: "white", // Add this line
            borderRadius: 100, // Add this line
        },
        image: {
            borderRadius: 100,
            width: 200,
            height: 200,
            resizeMode: "contain",
        },
        formContainer: {
            flex: 1,
        },
        input: { marginBottom: 20 },
        logiBtn: {
            backgroundColor: theme.colors.primary,
            padding: 10,
        },
        logiBtnTxt: {
            color: theme.colors.primaryContrast,
            paddingHorizontal: 90,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <View style={styles.imgInternalCont}>
                    <Image
                        source={require("../../../assets/images/logo.jpg")}
                        style={styles.image}
                    />
                </View>
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    mode="outlined"
                    label="Nombre de Usuario"
                    name="username"
                    value={states.username}
                    onChangeText={(text) =>
                        handleData({ name: "username", value: text })
                    }
                />
                <TextInput
                    mode="outlined"
                    label="Contraseña"
                    name="password"
                    value={states.password}
                    onChangeText={(text) =>
                        handleData({ name: "password", value: text })
                    }
                    {...(!states.showPass && { secureTextEntry: true })}
                    right={
                        <TextInput.Icon
                            icon={states.showPass ? "eye" : "eye-off"}
                            onPress={() =>
                                handleData({
                                    name: "showPass",
                                    value: !states.showPass,
                                })
                            }
                        />
                    }
                    style={styles.input}
                />
                <Button
                    mode="contained"
                    styles={styles.logiBtn}
                    onPress={onLoginPress}
                >
                    <Text style={styles.logiBtnTxt}>Iniciar Sesión</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}
