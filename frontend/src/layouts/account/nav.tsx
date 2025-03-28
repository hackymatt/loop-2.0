"use client";

import type { BoxProps } from "@mui/material/Box";
import type { ButtonBaseProps } from "@mui/material/ButtonBase";
import type { Theme, SxProps, Breakpoint } from "@mui/material/styles";

import { useEffect } from "react";
import { isActiveLink } from "minimal-shared/utils";
import { useBoolean, usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { Paper, Drawer } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ButtonBase, { buttonBaseClasses } from "@mui/material/ButtonBase";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { _mock } from "src/_mock";

import { Logo } from "src/components/logo";
import { Iconify } from "src/components/iconify";
import { NavBasicMobile } from "src/components/nav-basic";
import {
  navSectionCssVars,
  NavSectionVertical,
  NavSectionVerticalItem,
} from "src/components/nav-section";

import {
  NAV_BASIC_ITEMS,
  NAV_SECTION_ITEMS,
} from "src/sections/_examples/navigation-bar-view/data";

import { MenuButton } from "../components/menu-button";

// ----------------------------------------------------------------------

const config = {
  gap: 4,
  icon: 24,
  radius: 8,
  subItemHeight: 36,
  rootItemHeight: 44,
  currentRole: "admin",
  hiddenSubheader: false,
  padding: "4px 8px 4px 12px",
};

// ----------------------------------------------------------------------

export type NavItemsProps = {
  layoutQuery?: Breakpoint;
  sx?: SxProps<Theme>;
  data: {
    path?: string;
    title: string;
    icon: React.ReactNode;
  }[];
};

export function NavAccountDesktop({ data, sx }: NavItemsProps) {
  return (
    <Box
      sx={{
        gap: 5,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        ...sx,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          width: 1,
          maxWidth: 320,
          borderRadius: 1.5,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavSectionVertical
          data={NAV_SECTION_ITEMS}
          currentRole={config.currentRole}
          sx={{ flex: "1 1 auto" }}
          cssVars={{ "--nav-item-gap": `${config.gap}px` }}
          slotProps={{
            rootItem: {
              sx: {
                padding: config.padding,
                borderRadius: `${config.radius}px`,
                minHeight: config.rootItemHeight,
              },
              icon: {
                width: config.icon,
                height: config.icon,
                ...(!config.icon && { display: "none" }),
              },
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
            subItem: {
              sx: {
                padding: config.padding,
                borderRadius: `${config.radius}px`,
                minHeight: config.subItemHeight,
              },
              icon: {
                width: config.icon,
                height: config.icon,
                ...(!config.icon && { display: "none" }),
              },
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
            subheader: { ...(config.hiddenSubheader && { display: "none" }) },
          }}
        />

        <Divider sx={{ my: 2 }} />

        <NavSectionVerticalItem
          depth={1}
          path="#"
          title="Chat"
          caption="Praesent porttitor nulla vitae posuere"
          icon={<Iconify icon="solar:chat-dots-linear" />}
          sx={(theme) => ({ ...navSectionCssVars.vertical(theme) })}
        />
      </Paper>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavAccountMobile({ data, layoutQuery = "md", sx }: NavItemsProps) {
  const mobileOpen = useBoolean();

  return (
    <>
      <MenuButton
        onClick={mobileOpen.onTrue}
        sx={(theme) => ({
          mr: 1,
          ml: -1,
          [theme.breakpoints.up(layoutQuery)]: { display: "none" },
        })}
      />

      <Drawer
        open={mobileOpen.value}
        onClose={mobileOpen.onFalse}
        PaperProps={{ sx: { width: 280 } }}
      >
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

        <NavBasicMobile
          sx={{ px: 1.5 }}
          data={NAV_BASIC_ITEMS}
          cssVars={{ "--nav-item-gap": "8px" }}
          slotProps={{
            rootItem: {
              sx: {},
              icon: {},
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
            subItem: {
              sx: {},
              icon: {},
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
          }}
        />
      </Drawer>
    </>
  );
}

// ----------------------------------------------------------------------

export function NavAccountPopover({ data, sx }: NavItemsProps) {
  const { open, onClose, onOpen, anchorEl } = usePopover();

  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderNav = () => (
    <Box component="nav">
      <Box
        component="ul"
        sx={{ gap: 0.5, display: "flex", flexDirection: "column", "& li": { display: "flex" } }}
      >
        {data.map((item) => (
          <li key={item.title}>
            <NavItem title={item.title} path={item.path} icon={item.icon} />
          </li>
        ))}
      </Box>
    </Box>
  );

  const renderMenuActions = () => (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      slotProps={{
        paper: {
          sx: [
            {
              width: 220,
              [`& .${buttonBaseClasses.root}`]: {
                px: 1.5,
                py: 0.75,
                height: "auto",
              },
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ],
        },
      }}
    >
      {renderNav()}
      <Divider sx={{ my: 0.5, borderStyle: "dashed" }} />
      <NavItem title="Logout" icon={<Iconify icon="carbon:logout" />} onClick={onClose} />
    </Popover>
  );

  return (
    <>
      <IconButton disableRipple color={open ? "primary" : "inherit"} onClick={onOpen}>
        <Avatar src={_mock.image.avatar(0)} sx={{ width: 32, height: 32 }} />
        <Iconify
          width={16}
          icon={open ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"}
          sx={{ ml: 0.5 }}
        />
      </IconButton>
      {renderMenuActions()}
    </>
  );
}

// ----------------------------------------------------------------------

type NavItemProps = ButtonBaseProps & NavItemsProps["data"][number];

export function NavItem({ title, path = "", icon, sx, ...other }: NavItemProps) {
  const pathname = usePathname();

  const isActive = path && isActiveLink(pathname, path);

  const buttonProps = path
    ? {
        href: path,
        component: RouterLink,
      }
    : {};

  return (
    <ButtonBase
      disableRipple
      key={title}
      {...buttonProps}
      sx={[
        {
          gap: 2,
          width: 1,
          height: 44,
          borderRadius: 1,
          typography: "body2",
          justifyContent: "flex-start",
          ...(isActive && { color: "primary.main", typography: "subtitle2" }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {icon}
      {title}
    </ButtonBase>
  );
}

// ----------------------------------------------------------------------

export function UserPhoto({ sx, ...other }: BoxProps) {
  return (
    <Box
      sx={[
        {
          gap: 2,
          display: "flex",
          alignItems: "center",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Avatar src={_mock.image.avatar(0)} sx={{ width: 64, height: 64 }} />

      <Box
        sx={{
          gap: 1,
          display: "flex",
          cursor: "pointer",
          alignItems: "center",
          typography: "caption",
          "&:hover": { opacity: 0.72 },
        }}
      >
        <Iconify icon="solar:pen-2-outline" />
        Change photo
      </Box>
    </Box>
  );
}
