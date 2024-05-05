import { useState } from "react";
import { StyleSheet, View, Image, useWindowDimensions } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import getMobileSession from "../../utils/api";

export default function LoginScreen({ navigation }) {
    const theme = useTheme();
    const [states, setStates] = useState({
        username: "",
        password: "",
        showPass: false,
    });

    const { width, height } = useWindowDimensions();

    function handleData({ name, value }) {
        setStates((prevStates) => ({ ...prevStates, [name]: value }));
    }

    async function onLoginPress() {
        const { username, password } = states;

        if (!username || !password)
            return alert("Debe llenar los campos de manera correcta");

        const sessionKey = await getMobileSession({ username, password });
        console.log("sessionKey: ", JSON.stringify(sessionKey));
        return;
    }

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
                <Image
                    source={require("../../../assets/images/logo.jpg")}
                    style={styles.image}
                />
            </View>
            <View style={styles.formContainer}>
                <TextInput
                    mode="outlined"
                    label="Correo Electrónico"
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
