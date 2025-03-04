import "src/global.css";

// ----------------------------------------------------------------------
import type { Metadata, Viewport } from "next";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { CONFIG } from "src/global-config";
import { LocalizationProvider } from "src/locales";
import { themeConfig, ThemeProvider } from "src/theme";
import { themeOverrides } from "src/theme/theme-overrides";

import { ProgressBar } from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { SettingsDrawer, defaultSettings, SettingsProvider } from "src/components/settings";

// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  icons: [
    {
      rel: "icon",
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={themeConfig.defaultMode}
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
        />

        <SettingsProvider defaultSettings={defaultSettings}>
          <LocalizationProvider>
            <AppRouterCacheProvider options={{ key: "css" }}>
              <ThemeProvider
                themeOverrides={themeOverrides}
                defaultMode={themeConfig.defaultMode}
                modeStorageKey={themeConfig.modeStorageKey}
              >
                <MotionLazy>
                  <ProgressBar />
                  <SettingsDrawer defaultSettings={defaultSettings} />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </LocalizationProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
