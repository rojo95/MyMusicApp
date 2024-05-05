import { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Image,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { Text, useTheme, Title, List } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import Spinner from "../../components/Spinner/Index";

export default function LoginScreen({ navigation }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [recentsTracks, setRecentsTraks] = useState(null);
    const { apiKey, apiUrl } = Constants.expoConfig.extra;
    const { width, height } = useWindowDimensions();
    const userSession = "rj";

    function getUser() {
        setLoading(true);
        const url = `${apiUrl}?method=user.getinfo&user=${userSession}&api_key=${apiKey}&format=json`;
        fetch(url)
            .then((response) => {
                // Verificar si la respuesta es exitosa (status 200)
                if (!response.ok) {
                    alert("La solicitud no pudo ser completada");
                }
                // Convertir la respuesta a JSON
                return response.json();
            })
            .then((res) => {
                // Manejar la respuesta exitosa
                setUser(res.user);
            })
            .catch((error) => {
                // Manejar el error
                alert("Error realizando la consulta de usuario");
            })
            .finally(() => getLast());
    }

    function getLast() {
        setLoading(true);
        const url = `${apiUrl}?method=user.getrecenttracks&user=${userSession}&api_key=${apiKey}&format=json&limit=10&page=1`;
        console.log(url);
        fetch(url)
            .then((response) => {
                // Verificar si la respuesta es exitosa (status 200)
                if (!response.ok) {
                    alert("La solicitud no pudo ser completada");
                }
                // Convertir la respuesta a JSON
                return response.json();
            })
            .then((res) => {
                // Manejar la respuesta exitosa
                console.log(res.recenttracks);
                setRecentsTraks(res.recenttracks);
            })
            .catch((error) => {
                // Manejar el error
                alert("Error realizando la consulta");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        getUser();
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
        },
        image: {
            borderRadius: 30,
            width: 170,
            height: 170,
            resizeMode: "contain",
        },
        formContainer: {
            marginHorizontal: 8,
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
            {loading || !user ? (
                <Spinner activate={loading} />
            ) : (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={
                                user.image[3]["#text"]
                                    ? { uri: user.image[3]["#text"] }
                                    : require("../../../assets/images/logo.jpg")
                            }
                            style={styles.image}
                        />
                        <Title>{user.realname || user.name}</Title>
                        <View style={{ flex: 1, display: "flex" }}>
                            <Text>{user.country}</Text>
                        </View>
                    </View>
                    <View style={styles.formContainer}>
                        <List.Section>
                            <List.Subheader>
                                Ultimas Diez Canciones
                            </List.Subheader>
                            <ScrollView>
                                {recentsTracks.track?.map((v, k) => (
                                    <List.Item
                                        title={v.name}
                                        description={`${v.artist["#text"]} - ${v.album["#text"]}`}
                                        left={() => (
                                            <List.Icon
                                                color={theme.colors.primary}
                                                icon="music"
                                            />
                                        )}
                                    />
                                ))}
                            </ScrollView>
                        </List.Section>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
