import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
// import * as SecureStore from 'expo-secure-store';

const { apiKey, apiSecretKey, apiUrl } = Constants.expoConfig.extra;

const authParams = {
    method: "auth.getMobileSession",
    api_key: apiKey,
};

async function generateHash(text) {
    try {
        const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            text
        );
        return digest;
    } catch (error) {
        console.error(error);
    }
}

async function generateApiSig(params) {
    // Ordena alfabéticamente los parámetros y concaténalos en una cadena
    const apiSig = Object.keys(params)
        .sort()
        .map((key) => `${key}${params[key]}`)
        .join("");

    // Agrega el secreto al final de la cadena y luego genera el hash MD5
    const signatureString = `${apiSig}${apiSecretKey}`;
    return await generateHash(signatureString);
}

function createUrl(params) {
    const urlBase = apiUrl;
    return (
        urlBase +
        "?" +
        Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&")
    );
}

async function getMobileSession({ username, password }) {
    const url = createUrl({
        method: "auth.getMobileSession",
        api_key: apiKey,
    });

    const formData = {
        username,
        password,
        api_key: apiKey,
        api_sig: "",
    };
    formData.api_sig = await generateApiSig({
        username,
        password,
        api_key: apiKey,
    });

    // console.log("formData", JSON.stringify(formData));

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
    })
        .then((response) => response)
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.error("Error:", error);
            return error;
        });
    const data = await response;
    // console.log(JSON.stringify(data));
    return data;
}

export default getMobileSession;
