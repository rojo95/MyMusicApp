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
        slug: "mymusicapp",
        extra: {
            eas: {
                projectId: "14d226fc-fc23-4f31-966a-7f135fbab507",
            },
        },
        android: {
            package: "com.rojo95.mymusicapp",
        },
    },
});
