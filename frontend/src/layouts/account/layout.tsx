"use client";

import type { Breakpoint } from "@mui/material/styles";

import Box from "@mui/material/Box";

import { CONFIG } from "src/global-config";

import { Logo } from "src/components/logo";

import { langs } from "../langs-config";
import { MainSection } from "../core/main-section";
import { LayoutSection } from "../core/layout-section";
import { HeaderSection } from "../core/header-section";
import { SettingsButton } from "../components/settings-button";
import { LanguagePopover } from "../components/language-popover";
import {
  NavAccountMobile,
  NavAccountDesktop,
  NavAccountPopover,
  navData as navDataAccount,
} from "../account";

import type { MainSectionProps } from "../core/main-section";
import type { HeaderSectionProps } from "../core/header-section";
import type { LayoutSectionProps } from "../core/layout-section";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, "sx" | "children" | "cssVars">;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function AccountLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}: MainLayoutProps) {
  const renderHeader = () => {
    const headerSlots: HeaderSectionProps["slots"] = {
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <NavAccountMobile data={navDataAccount} />

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

          {/** @slot Account popover */}
          <NavAccountPopover data={navDataAccount} />
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

  const renderMain = () => (
    <MainSection {...slotProps?.main}>
      {" "}
      <Box
        sx={{
          display: "flex",
          ml: { md: 4 },
          alignItems: { md: "flex-start" },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <NavAccountDesktop data={navDataAccount} sx={{ display: { xs: "none", md: "block" } }} />

        <Box
          sx={{
            flexGrow: 1,
            pl: { md: 8 },
            width: { md: `calc(100% - ${280}px)` },
          }}
        >
          {children}
        </Box>
      </Box>
    </MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
