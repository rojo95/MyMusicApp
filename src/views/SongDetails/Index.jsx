import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import {
    List,
    Title,
    Paragraph,
    Divider,
    useTheme,
    FAB,
} from "react-native-paper";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "../../components/Spinner/Index";

import {
    formatNumber,
    milisegundosToMinutesAndHours,
} from "../../utils/calculos";
import sessionNames from "../../utils/sessionInfo";

function PlaylistScreen({ route }) {
    const theme = useTheme();
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [song, setSong] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const { apiKey, apiUrl } = Constants.expoConfig.extra;
    const [loved, setLoved] = useState(false);
    const fabs = sessionNames.fabs;

    const styles = StyleSheet.create({
        tags: {
            backgroundColor: theme.colors.primaryLight,
            paddingHorizontal: 20,
            paddingVertical: 4,
            borderRadius: 40,
            color: theme.colors.primaryContrast,
            Right: 50,
            flex: 1,
        },
        bodyInfo: {
            paddingHorizontal: 10,
        },
        card: {
            margin: 5,
            borderRadius: 8,
            overflow: "hidden", // para que las esquinas redondeadas de la imagen de fondo funcionen correctamente
            width: "100%",
        },
        imageBackground: {
            // backgroundColor: "rgba(0, 0, 0, 0.5)",
            height: 260,
            justifyContent: "center",
            alignItems: "center",
        },
        overlay: {
            ...StyleSheet.absoluteFillObject, // para ocupar todo el espacio del ImageBackground
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            alignItems: "left",
            justifyContent: "flex-end",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
        },
        title: {
            color: "white",
            fontSize: 40,
            lineHeight: 40,
        },
        fab: {
            position: "absolute",
            margin: 16,
            right: 0,
            top: 0,
            borderRadius: 100,
            backgroundColor: theme.colors.primary,
            color: theme.colors.primaryContrast,
        },
        dropdown: {},
    });

    async function addFab() {
        try {
            const songData = {
                name: song.name,
                artistName: song.artist?.name,
                time: milisegundosToMinutesAndHours(song.duration),
                mbid: id,
            };

            const storedValue = await AsyncStorage.getItem(fabs);
            const parsedValue = JSON.parse(storedValue) || [];

            const exists = parsedValue.find((v) => v.mbid === id);
            // console.log(exists);
            setLoved(!exists);

            const newValue = exists
                ? parsedValue.filter((v) => v.mbid !== id)
                : [...parsedValue, songData];

            await AsyncStorage.setItem(fabs, JSON.stringify(newValue));
            Alert.alert(
                `Se ha ${!exists ? "agregado a" : "retirado de los"} favoritos.`
            );
        } catch (error) {
            throw new Error(`Error storing data: ${error.message}`);
        }
    }

    async function getSong() {
        setLoading(true);
        const liked = JSON.parse(await AsyncStorage.getItem(fabs)).find(
            (v) => v.mbid === id
        );
        // console.log("liked", liked);
        setLoved(liked && true);
        const url = `${apiUrl}?method=track.getInfo&api_key=${apiKey}&mbid=${id}&format=json`;
        await fetch(url)
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
                setSong(res.track);
            })
            .catch((error) => {
                // Manejar el error
                alert("Error al consultar la canción.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        getSong();
        return () => {
            setSong(null);
            setLoading(true);
            setLoading(false);
        };
    }, [id]);
    return (
        <ScrollView
            style={{
                flex: 1,
            }}
        >
            {loading ? (
                <Spinner activate={loading} color={theme.colors.primary} />
            ) : (
                song && (
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <ImageBackground
                            source={{ uri: song.album?.image[3]["#text"] }}
                            style={styles.imageBackground}
                            blurRadius={6}
                        >
                            <View style={styles.overlay}>
                                <Title
                                    style={styles.title}
                                    numberOfLines={2}
                                    ellipsizeMode="tail"
                                >
                                    {song.name}
                                </Title>
                            </View>
                        </ImageBackground>
                        <View style={styles.bodyInfo}>
                            <Title>
                                Duracion:{" "}
                                {milisegundosToMinutesAndHours(song.duration)}
                            </Title>
                            <Title>Artista: {song.artist?.name}</Title>
                            <Title>Album: {song.album?.title}</Title>
                            <Paragraph>
                                {formatNumber(song.playcount)} de reproducciones
                            </Paragraph>
                            <Text>Tags:</Text>

                            <Text>
                                {song.toptags?.tag?.map((i, k) => (
                                    <TouchableOpacity
                                        style={{
                                            paddingRight: 8,
                                            paddingBottom: 8,
                                        }}
                                        key={k}
                                        onPress={() => Linking.openURL(i.url)}
                                    >
                                        <View style={styles.tags}>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: theme.colors
                                                        .primaryContrast,
                                                }}
                                            >
                                                {i.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </Text>
                            <Divider style={{ marginVertical: 2 }} />

                            <List.Section style={styles.dropdown}>
                                <List.Accordion
                                    title="Más sobre la canción"
                                    expanded={expanded}
                                    onPress={() => setExpanded(!expanded)}
                                >
                                    <Text>{song.wiki?.content}</Text>
                                </List.Accordion>
                            </List.Section>
                        </View>
                    </View>
                )
            )}
            <FAB
                style={styles.fab}
                icon="heart"
                onPress={() => addFab()}
                color={
                    loved ? theme.colors.loved : theme.colors.primaryContrast
                }
            />
        </ScrollView>
    );
}

export default PlaylistScreen;
