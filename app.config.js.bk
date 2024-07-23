import { config } from "dotenv";
config();

const ENVIRONMENTS = {
    DEVELOPMENT: "development",
    PREVIEW: "preview",
    PRODUCTION: "production",
};

const ENV = process.env.APP_VARIANT;

const getAppName = () => {
    switch (ENV) {
        case ENVIRONMENTS.DEVELOPMENT:
            return "My Music App (Dev)";
        case ENVIRONMENTS.PREVIEW:
            return "My Music App (Preview)";
        default:
            return "My Music App";
    }
};

export default ({ config }) => ({
    ...config,
    expo: {
        name: getAppName(),
        slug: "music-app",
        extra: {
            eas: {
                projectId: "14d226fc-fc23-4f31-966a-7f135fbab507",
            },
            apiKey: process.env.LAST_FM_API_KEY,
            apiSecretKey: process.env.LAST_FM_API_SECRET_KEY,
            apiUrl: process.env.API_LAST_FM,
        },
        android: {
            package: "com.rojo95.mymusicapp",
        },
    },
});
