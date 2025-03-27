"use client";

import "dayjs/locale/pl";
import "dayjs/locale/en";

import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";

type Props = {
  children: React.ReactNode;
};

export function TranslationProvider({ children }: Props) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
