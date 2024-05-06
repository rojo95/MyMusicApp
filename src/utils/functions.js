import * as Crypto from "expo-crypto";
import Constants from "expo-constants";
const { apiSecretKey } = Constants.expoConfig.extra;

export async function generateMD5Hash(text) {
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

export async function generateApiSig(params) {
    // Ordena alfabéticamente los parámetros y concaténalos en una cadena
    const apiSig = Object.keys(params)
        .sort()
        .map((key) => `${key}${params[key]}`)
        .join("");

    // Agrega el secreto al final de la cadena y luego genera el hash MD5
    const signatureString = `${apiSig}${apiSecretKey}`;
    return await generateMD5Hash(signatureString);
}

export function encodeFormData(data) {
    return Object.keys(data)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
        )
        .join("&");
}
