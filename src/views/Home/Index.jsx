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
        <ScrollView
            style={{
                flex: 1,
            }}
        >
            <View
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                }}
            >
                {loading ? (
                    <Spinner activate={loading} />
                ) : (
                    topSongs.map(
                        (v, k) =>
                            v.mbid && (
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
                                            <Title style={styles.title}>
                                                Oyentes: {v.listeners}
                                            </Title>
                                        </View>
                                    </ImageBackground>
                                    <Image
                                        source={{
                                            uri: v.image[1]["#text"],
                                        }}
                                        style={styles.avatar}
                                    />
                                </Card>
                            )
                    )
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 5,
        borderRadius: 8,
        overflow: "hidden", // para que las esquinas redondeadas de la imagen de fondo funcionen correctamente
        width: "100%",
    },
    imageBackground: {
        // backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject, // para ocupar todo el espacio del ImageBackground
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "left",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingLeft: 110,
        paddingVertical: 8,
        borderRadius: 8,
    },
    title: {
        color: "white",
        fontSize: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 5, // la mitad del ancho y el alto
        position: "absolute",
        top: 16,
        left: 16,
    },
});
