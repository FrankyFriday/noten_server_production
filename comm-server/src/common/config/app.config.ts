export const appConfig = () => ({
  app: {
    name: process.env.APP_NAME || 'comm-server',
    env: process.env.NODE_ENV || 'production',
    port: Number(process.env.PORT || 3000),
    apiKey: process.env.API_KEY,
    releaseDataPath: process.env.RELEASE_DATA_PATH || './data/releases.json',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
});
