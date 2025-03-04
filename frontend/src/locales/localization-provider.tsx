"use client";

import { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider as MUIProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useSettingsContext } from "src/components/settings";

import i18n from "./i18n";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function LocalizationProvider({ children }: Props) {
  const settings = useSettingsContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Oznacza, że jesteśmy po stronie klienta
    i18n.changeLanguage(settings.state.language);
  }, [settings.state.language]);

  // Zapobiega problemom z hydratacją
  if (!isClient) {
    return null; // Nie renderuj nic przed uruchomieniem na kliencie
  }

  return (
    <I18nextProvider i18n={i18n}>
      <MUIProvider dateAdapter={AdapterDayjs}>{children}</MUIProvider>
    </I18nextProvider>
  );
}
