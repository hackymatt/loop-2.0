import "src/global.css";

// ----------------------------------------------------------------------
import type { Metadata, Viewport } from "next";

import { GoogleOAuthProvider } from "@react-oauth/google";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { CONFIG } from "src/global-config";
import { themeConfig, ThemeProvider } from "src/theme";
import { themeOverrides } from "src/theme/theme-overrides";
import { TranslationProvider, LocalizationProvider } from "src/locales";

import { detectUser } from "src/components/user/server";
import { ProgressBar } from "src/components/progress-bar";
import { UserProvider } from "src/components/user/context";
import { defaultUser } from "src/components/user/user-config";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { SettingsDrawer, defaultSettings, SettingsProvider } from "src/components/settings";

import SnackbarProvider from "./snackbar-provider";
import { ReactQueryProvider } from "./react-query-provider";

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
        <GoogleOAuthProvider clientId={CONFIG.googleClientId}>
          <ReactQueryProvider>
            <UserProvider defaultUser={defaultUser} cookieUser={await detectUser()}>
              <SettingsProvider defaultSettings={defaultSettings}>
                <TranslationProvider>
                  <LocalizationProvider>
                    <AppRouterCacheProvider options={{ key: "css" }}>
                      <ThemeProvider
                        themeOverrides={themeOverrides}
                        defaultMode={themeConfig.defaultMode}
                        modeStorageKey={themeConfig.modeStorageKey}
                      >
                        <SnackbarProvider>
                          <MotionLazy>
                            <ProgressBar />
                            <SettingsDrawer defaultSettings={defaultSettings} />
                            {children}
                          </MotionLazy>
                        </SnackbarProvider>
                      </ThemeProvider>
                    </AppRouterCacheProvider>
                  </LocalizationProvider>
                </TranslationProvider>
              </SettingsProvider>
            </UserProvider>
          </ReactQueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
