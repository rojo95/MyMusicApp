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
    useWindowDimensions,
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
import { encodeFormData, generateApiSig } from "../../utils/functions";

function PlaylistScreen({ route }) {
    const theme = useTheme();
    const { id } = route.params;
    const [loading, setLoading] = useState(true);
    const [song, setSong] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const { apiKey, apiUrl } = Constants.expoConfig.extra;
    const [loved, setLoved] = useState(false);
    const [wait, setWait] = useState(false);
    const fabsKey = sessionNames.fabs;
    const { width, height } = useWindowDimensions();

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
            height: width < height ? 260 : 150,
            borderRadius: 0,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
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

    async function getFabs() {
        const user = await AsyncStorage.getItem(sessionNames.user);
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=${user}&api_key=${apiKey}&format=json`;
        try {
            const fabs = await fetch(url);
            if (!fabs.ok) {
                throw new Error("La solicitud no pudo ser completada");
            }
            const data = await fabs.json();
            const tracks = data?.lovedtracks?.track;
            const exists = tracks?.find(
                (v) =>
                    v.mbid === id ||
                    (v.name === song?.name &&
                        v.artist.name === song?.artist?.name)
            );

            setLoved(exists ? true : false);
            console.log(tracks);
        } catch (error) {
            alert("Error realizando la consulta de usuario");
        } finally {
            setLoading(false);
        }
    }

    async function addFab() {
        if (wait) return;
        setWait(true);
        try {
            const method = `track.${loved ? "un" : ""}love`;
            const sk = await AsyncStorage.getItem(sessionNames.key);
            const apiSig = await generateApiSig({
                api_key: apiKey,
                artist: song.artist?.name,
                method: method,
                sk: sk,
                track: song.name,
            }).catch((err) => {
                throw err;
            });
            const formData = {
                artist: song.artist?.name,
                api_key: apiKey,
                method: method,
                sk: sk,
                track: song.name,
                api_sig: apiSig,
                format: "json",
            };

            const encodedData = await encodeFormData(formData);
            await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: encodedData,
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoved(!loved);
                    Alert.alert(
                        `Se ha ${
                            !loved ? "agregado a" : "retirado de los"
                        } favoritos.`
                    );
                    return;
                })
                .catch((error) => {
                    console.error("Error:", error);
                    return error;
                })
                .finally(() => setWait(false));
        } catch (error) {
            console.log(error);
            Alert.alert(`Error gestionando los favoritos.`);
        }
    }

    async function getSong() {
        setLoading(true);
        const liked = JSON.parse(await AsyncStorage.getItem(fabsKey))?.find(
            (v) => v.mbid === id
        );
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

    const execute = async () => {
        await getSong();
        await getFabs();
    };

    useEffect(() => {
        execute();
    }, [id]);

    useEffect(() => {
        execute();
        return () => {
            setLoved(false);
            setSong(null);
            setLoading(true);
            setLoading(false);
        };
    }, []);

    useEffect(() => {
        if (loved) {
            setLoved(true);
        } else {
            setLoved(false);
        }
    }, [song]);

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
                            <Text style={{ marginBottom: 5 }}>Tags:</Text>
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
