"use client";

import type { Breakpoint } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { Container } from "@mui/material";

import { Logo } from "src/components/logo";
import { MegaMenuMobile, MegaMenuHorizontal } from "src/components/mega-menu";

import { Footer } from "./footer";
import { langs } from "../langs-config";
import { useNavData } from "../nav-config-main";
import { MainSection } from "../core/main-section";
import { Searchbar } from "../components/searchbar";
import { MenuButton } from "../components/menu-button";
import { LayoutSection } from "../core/layout-section";
import { HeaderSection } from "../core/header-section";
import { LoginButton } from "../components/login-button";
import { RegisterButton } from "../components/register-button";
import { SettingsButton } from "../components/settings-button";
import { LanguagePopover } from "../components/language-popover";

import type { FooterProps } from "./footer";
import type { NavMainProps } from "./nav/types";
import type { MainSectionProps } from "../core/main-section";
import type { HeaderSectionProps } from "../core/header-section";
import type { LayoutSectionProps } from "../core/layout-section";

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, "sx" | "children" | "cssVars">;

export type MainLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps["data"];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "md",
}: MainLayoutProps) {
  const navData = useNavData();

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps["slots"] = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MegaMenuMobile
            data={navData}
            slots={{
              button: (
                <MenuButton
                  sx={(theme) => ({
                    mr: 1,
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: "none" },
                  })}
                />
              ),
              topArea: (
                <Box
                  sx={{
                    pt: 3,
                    pb: 2,
                    pl: 2.5,
                    display: "flex",
                  }}
                >
                  <Logo />
                </Box>
              ),
              bottomArea: (
                <Box sx={{ py: 3, px: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                  <LoginButton
                    sx={{ width: 1 }}
                    slotProps={{
                      button: {
                        fullWidth: true,
                        size: "medium",
                      },
                    }}
                  />
                  <RegisterButton
                    sx={{ width: 1 }}
                    slotProps={{
                      button: {
                        fullWidth: true,
                        size: "large",
                      },
                    }}
                  />
                </Box>
              ),
            }}
          />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      centerArea: (
        <Box component="section">
          <Container
            sx={{ height: 64, display: "flex", alignItems: "center", position: "relative" }}
          >
            <MegaMenuHorizontal
              data={navData}
              slotProps={{
                dropdown: { display: "flex", justifyContent: "center" },
                masonry: { columns: 3, defaultColumns: 3 },
              }}
              sx={(theme) => ({
                display: "none",
                [theme.breakpoints.up(layoutQuery)]: { display: "flex" },
              })}
            />
          </Container>
        </Box>
      ),
      rightArea: (
        <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
          {/** @slot Searchbar */}
          <Searchbar />

          {/** @slot Language popover */}
          <LanguagePopover data={langs} />

          {/** @slot Settings button */}
          <SettingsButton />

          {/** @slot Login button */}
          <LoginButton sx={{ display: { xs: "none", [layoutQuery]: "inline-flex" } }} />

          {/** @slot Purchase button */}
          <RegisterButton sx={{ display: { xs: "none", [layoutQuery]: "inline-flex" } }} />
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

  const renderFooter = () => <Footer layoutQuery={layoutQuery} />;

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
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
