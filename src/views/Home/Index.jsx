import {
    View,
    ScrollView,
    ImageBackground,
    StyleSheet,
    Image,
    StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Text, Title, useTheme } from "react-native-paper";
import Constants from "expo-constants";
import Spinner from "../../components/Spinner/Index";

export default function HomeScreen({ navigation }) {
    const theme = useTheme();

    const [loading, setLoading] = useState(true);
    const [topSongs, setTopSongs] = useState([]);
    const { apiKey, apiUrl } = Constants.expoConfig.extra;

    const styles = StyleSheet.create({
        card: {
            margin: 5,
            borderRadius: 8,
            overflow: "hidden",
            width: "100%",
            height: 150, // add a fixed height to the card
        },
        imageBackground: {
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.primaryLightRGBA,
            alignItems: "left",
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingLeft: 110,
            paddingVertical: 8,
            borderRadius: 8,
        },
        title: {
            color: theme.colors.darkColor,
            fontSize: 20,
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 5,
            position: "absolute",
        },
        imageContainer: {
            top: 16,
            left: 16,
            width: 80,
            height: 80,
            position: "absolute",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 3 },
            elevation: 5, // Android
            backgroundColor: "white", // Add this line
            borderRadius: 5,
        },
    });

    function getTopSongs() {
        setLoading(true);
        const url = `${apiUrl}?method=geo.gettoptracks&country=spain&api_key=${apiKey}&limit=10&page=1&format=json`;
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
                // console.log(res)
                setTopSongs(res.tracks.track);
            })
            .catch((error) => {
                // Manejar el error
                alert("Error al consultar las canciones.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        StatusBar.setBackgroundColor(theme.colors.primary);
        getTopSongs();

        return () => StatusBar.setBackgroundColor("#fff");
    }, []);

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                {loading ? (
                    <Spinner activate={loading} />
                ) : (
                    <View>
                        <View>
                            <Title>Top canciones en tu pais</Title>
                        </View>

                        <View>
                            {topSongs.map((v, k) => (
                                <Card
                                    style={styles.card}
                                    key={k}
                                    onPress={() =>
                                        navigation.navigate("Details", {
                                            id: v.mbid,
                                        })
                                    }
                                >
                                    <ImageBackground
                                        source={{
                                            uri: v.image[2]["#text"],
                                        }}
                                        style={styles.imageBackground}
                                        resizeMode="cover"
                                        imageStyle={{ borderRadius: 8 }}
                                        blurRadius={6}
                                    >
                                        <View style={styles.overlay}>
                                            <Title style={styles.title}>
                                                {v.name}
                                            </Title>

                                            <Title style={styles.title}>
                                                Artista: {v.artist.name}
                                            </Title>
                                        </View>
                                    </ImageBackground>

                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={{
                                                uri: v.image[1]["#text"],
                                            }}
                                            style={styles.avatar}
                                        />
                                    </View>
                                </Card>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}
