import { config } from "dotenv";
config();

export default ({ config }) => ({
    ...config,
    extra: {
        apiKey: process.env.LAST_FM_API_KEY,
        apiSecretKey: process.env.LAST_FM_API_SECRET_KEY,
        apiUrl: process.env.API_LAST_FM,
    },
});
