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
import AsyncStorage from "@react-native-async-storage/async-storage";
import sessionNames from "../../utils/sessionInfo";

export default function LoginScreen({ navigation }) {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [recentsTracks, setRecentsTraks] = useState(null);
    const { apiKey, apiUrl } = Constants.expoConfig.extra;
    const { width, height } = useWindowDimensions();
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            const storedUserName = await AsyncStorage.getItem(
                sessionNames.user
            );
            if (storedUserName) {
                setUserName(storedUserName);
            }
        };
        fetchUserName();
    }, []);

    useEffect(() => {
        if (userName) {
            getUser();
        }
    }, [userName]);

    async function getUser() {
        setLoading(true);
        const url = `${apiUrl}?method=user.getinfo&user=${userName}&api_key=${apiKey}&format=json`;
        console.log(url);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("La solicitud no pudo ser completada");
            }
            const data = await response.json();
            setUser(data.user);
            getLast();
        } catch (error) {
            alert("Error realizando la consulta de usuario");
        } finally {
            setLoading(false);
        }
    }

    function getLast() {
        setLoading(true);
        const url = `${apiUrl}?method=user.getrecenttracks&user=${userName}&api_key=${apiKey}&format=json&limit=10&page=1`;
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("La solicitud no pudo ser completada");
                }
                return response.json();
            })
            .then((res) => {
                setRecentsTraks(res.recenttracks);
            })
            .catch((error) => {
                alert("Error realizando la consulta");
            })
            .finally(() => setLoading(false));
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
        imgInternalCont: {
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 3 },
            elevation: 5, // Android
            backgroundColor: "white", // Add this line
            borderRadius: 30, // Add this line
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
                        <View style={styles.imgInternalCont}>
                            <Image
                                source={
                                    user.image[3]["#text"]
                                        ? { uri: user.image[3]["#text"] }
                                        : require("../../../assets/images/logo.jpg")
                                }
                                style={styles.image}
                            />
                        </View>
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
                                {recentsTracks?.track.length > 0 ? (
                                    recentsTracks?.track?.map((v, k) => (
                                        <List.Item
                                            key={k}
                                            title={v.name}
                                            description={`${v.artist["#text"]} - ${v.album["#text"]}`}
                                            left={() => (
                                                <List.Image
                                                    source={{
                                                        uri: v.image[1][
                                                            "#text"
                                                        ],
                                                    }}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        borderRadius: 5,
                                                    }}
                                                />
                                            )}
                                        />
                                    ))
                                ) : (
                                    <Text>
                                        El usuario no ha agregado nada a su
                                        lista de favoritos aún
                                    </Text>
                                )}
                            </ScrollView>
                        </List.Section>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
