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
    const usr = username.trim();
    const pass = password.trim();

    const formData = {
        api_key: apiKey,
        method: "auth.getMobileSession",
        username: usr,
        password: pass,
        api_sig: await generateApiSig({
            api_key: apiKey,
            method: "auth.getMobileSession",
            username: usr,
            password: pass,
        }),
        format: "json",
    };

    function encodeFormData(data) {
        return Object.keys(data)
            .map(
                (key) =>
                    encodeURIComponent(key) +
                    "=" +
                    encodeURIComponent(data[key])
            )
            .join("&");
    }

    const encodedData = encodeFormData(formData);

    // console.log("encodedData", encodedData);

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: encodedData,
    })
        .then((response) => response.json())
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
