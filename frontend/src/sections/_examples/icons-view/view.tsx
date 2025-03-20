"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";

import { CONFIG } from "src/global-config";
import { countries } from "src/assets/data";
import {
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon,
} from "src/assets/icons";

import { Logo } from "src/components/logo";
import { Iconify } from "src/components/iconify";
import { SvgColor } from "src/components/svg-color";
import { FlagIcon } from "src/components/flag-icon";

import { ComponentBox, ComponentLayout } from "../layout";

// ----------------------------------------------------------------------

const ASSETS_DIR = `${CONFIG.assetsDir}/assets/icons`;

const DEMO_COMPONENTS = [
  {
    name: "Logo",
    component: (
      <ComponentBox>
        <Logo disabled isSingle sx={{ width: 64, height: 64 }} />
        <Logo disabled sx={{ width: 180, height: "auto" }} />
      </ComponentBox>
    ),
  },

  {
    name: "Material icons",
    component: (
      <ComponentBox>
        <Link href="https://mui.com/components/icons/#main-content" target="_blank" rel="noopener">
          https://mui.com/components/icons/#main-content
        </Link>
      </ComponentBox>
    ),
  },
  {
    name: "Iconify icons",
    component: (
      <ComponentBox>
        <Tooltip title="Iconify">
          <Iconify icon="eva:color-palette-fill" width={32} />
        </Tooltip>
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "action.active" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "action.disabled" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "primary.main" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "secondary.main" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "info.main" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "success.main" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "warning.main" }} />
        <Iconify icon="eva:color-palette-fill" width={32} sx={{ color: "error.main" }} />
      </ComponentBox>
    ),
  },
  {
    name: "Local icons",
    component: (
      <ComponentBox>
        <Tooltip title="SvgColor">
          <SvgColor src={`${ASSETS_DIR}/settings/ic-moon.svg`} sx={{ width: 32, height: 32 }} />
        </Tooltip>
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "action.active" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "action.disabled" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "primary.main" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "secondary.main" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "info.main" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "success.main" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "warning.main" }}
        />
        <SvgColor
          src={`${ASSETS_DIR}/settings/ic-moon.svg`}
          sx={{ width: 32, height: 32, color: "error.main" }}
        />
      </ComponentBox>
    ),
  },
  {
    name: "Social icons",
    component: (
      <ComponentBox sx={{ gap: 3, flexDirection: "column" }}>
        <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
          <Tooltip title="Google">
            <GoogleIcon sx={{ width: 24 }} />
          </Tooltip>
          <InstagramIcon sx={{ width: 24 }} />
          <FacebookIcon sx={{ width: 24 }} />
          <LinkedinIcon sx={{ width: 24 }} />
          <TwitterIcon sx={{ width: 24 }} />
          <GithubIcon sx={{ width: 24 }} />
        </Box>

        <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap" }}>
          <GoogleIcon
            sx={[
              (theme) => ({
                "--color": theme.vars.palette.primary.main,
                width: 32,
              }),
            ]}
          />
          <InstagramIcon
            sx={[
              (theme) => ({
                "--color": theme.vars.palette.warning.main,
                width: 32,
              }),
            ]}
          />
          <FacebookIcon sx={{ color: "secondary.main", width: 32 }} />
          <LinkedinIcon sx={{ color: "info.main", width: 32 }} />
          <TwitterIcon sx={[{ color: "success.main", width: 32 }]} />
          <GithubIcon sx={[{ color: "error.main", width: 32 }]} />
        </Box>
      </ComponentBox>
    ),
  },
  {
    name: "Flag icons",
    component: (
      <ComponentBox sx={{ gap: 1.5 }}>
        {countries.map((country) =>
          country.label ? (
            <Tooltip key={country.code} title={`${country.label} - ${country.code}`}>
              <FlagIcon code={country.code} />
            </Tooltip>
          ) : null
        )}
      </ComponentBox>
    ),
  },
];

// ----------------------------------------------------------------------

export function IconsView() {
  return (
    <ComponentLayout
      sectionData={DEMO_COMPONENTS}
      heroProps={{
        heading: "Icons",
        moreLinks: [
          "https://mui.com/components/material-icons",
          "https://iconify.design/icon-sets",
        ],
      }}
    />
  );
}
