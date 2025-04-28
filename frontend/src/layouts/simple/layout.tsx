"use client";

import type { Breakpoint } from "@mui/material/styles";

import { Box } from "@mui/material";

import { CONFIG } from "src/global-config";

import { Logo } from "src/components/logo";

import { langs } from "../langs-config";
import { MainSection } from "../core/main-section";
import { LayoutSection } from "../core/layout-section";
import { SettingsButton } from "../components/settings-button";
import { LanguagePopover } from "../components/language-popover";
import { HeaderSection, type HeaderSectionProps } from "../core/header-section";

import type { SimpleCompactContentProps } from "./content";
import type { MainSectionProps } from "../core/main-section";
import type { LayoutSectionProps } from "../core/layout-section";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, "sx" | "children" | "cssVars">;

export type SimpleLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    content?: SimpleCompactContentProps & { compact?: boolean };
  };
};

export function SimpleLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}: SimpleLayoutProps) {
  const renderHeader = () => {
    const headerSlots: HeaderSectionProps["slots"] = {
      leftArea: (
        <>
          {/** @slot Logo */}
          <Logo sx={{ mt: 0.5 }} />
        </>
      ),
      rightArea: (
        <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
          {/** @slot Language popover */}
          {CONFIG.isLocal && <LanguagePopover data={langs} />}

          {/** @slot Settings button */}
          {CONFIG.isLocal && <SettingsButton />}
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ "--layout-simple-content-compact-width": "448px", ...cssVars }}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
