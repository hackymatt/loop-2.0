import packageJson from "../package.json";

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: packageJson.name,
  appVersion: packageJson.version,
  assetsDir: process.env.NEXT_PUBLIC_ASSETS_DIR ?? "",
  env: process.env.ENV ?? "LOCAL",
  isLocal: (process.env.ENV ?? "LOCAL") === "LOCAL",
};
