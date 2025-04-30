import "src/global.css";

// ----------------------------------------------------------------------
import type { Metadata, Viewport } from "next";

import { dir } from "i18next";
import { GoogleOAuthProvider } from "@react-oauth/google";

import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { CONFIG } from "src/global-config";
import { LANGUAGE } from "src/consts/language";
import { themeConfig, ThemeProvider } from "src/theme";
import { themeOverrides } from "src/theme/theme-overrides";
import { TranslationProvider, LocalizationProvider } from "src/locales";

import { detectUser } from "src/components/user/server";
import { ProgressBar } from "src/components/progress-bar";
import { UserProvider } from "src/components/user/context";
import { defaultUser } from "src/components/user/user-config";
import { MotionLazy } from "src/components/animate/motion-lazy";
import { SettingsDrawer, defaultSettings, SettingsProvider } from "src/components/settings";

import SnackbarProvider from "../snackbar-provider";
import { AnalyticsProvider } from "../analytics-provider";
import { ReactQueryProvider } from "../react-query-provider";
import { CookiesManagerProvider } from "../cookies-manager-provider";

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

export async function generateStaticParams() {
  return Object.values(LANGUAGE).map((lng) => ({ locale: lng }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default async function RootLayout({ children, params: { locale } }: Props) {
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
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
                <TranslationProvider locale={locale}>
                  <LocalizationProvider>
                    <AppRouterCacheProvider options={{ key: "css" }}>
                      <ThemeProvider
                        themeOverrides={themeOverrides}
                        defaultMode={themeConfig.defaultMode}
                        modeStorageKey={themeConfig.modeStorageKey}
                      >
                        <SnackbarProvider>
                          <CookiesManagerProvider>
                            <AnalyticsProvider>
                              <MotionLazy>
                                <ProgressBar />
                                <SettingsDrawer defaultSettings={defaultSettings} />
                                {children}
                              </MotionLazy>
                            </AnalyticsProvider>
                          </CookiesManagerProvider>
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
