"use client";

import "dayjs/locale/pl";
import "dayjs/locale/en";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { useIsClient } from "minimal-shared/hooks";
import { useQueryClient } from "@tanstack/react-query";

import { useSettingsContext } from "src/components/settings";

import i18n from "./i18n";

type Props = {
  children: React.ReactNode;
};

export function TranslationProvider({ children }: Props) {
  const settings = useSettingsContext();
  const queryClient = useQueryClient();
  const isClient = useIsClient();

  useEffect(() => {
    const { language } = settings.state;
    i18n.changeLanguage(language);
    queryClient.invalidateQueries();
  }, [queryClient, settings.state]);

  if (!isClient) {
    return null;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
