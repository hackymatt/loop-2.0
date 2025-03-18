import packageJson from "../package.json";

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: packageJson.name,
  appVersion: packageJson.version,
  env: process.env.ENV ?? "LOCAL",
};
