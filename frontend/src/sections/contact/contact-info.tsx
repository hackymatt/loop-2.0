import type { BoxProps } from "@mui/material/Box";
import type { Theme, SxProps } from "@mui/material/styles";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import { CONFIG } from "src/global-config";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

export function ContactInfo({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("contact");
  const rowStyles: SxProps<Theme> = {
    sx: {
      gap: 2,
      display: "flex",
      alignItems: "flex-start",
    },
  };

  const renderImage = () => (
    <Box
      component="img"
      alt="Marketing contact"
      src={`${CONFIG.assetsDir}/assets/illustrations/illustration-marketing-contact.svg`}
      sx={{ width: 380, height: 380, display: { xs: "none", md: "block" } }}
    />
  );

  const renderPhone = () => (
    <Box {...rowStyles}>
      <Iconify width={24} icon="solar:smartphone-outline" sx={{ mt: "2px" }} />
      <div>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("phoneLabel")}
        </Typography>
        <Link color="inherit" variant="body2" href="tel:+48881455596">
          +48 881 455 596
        </Link>
      </div>
    </Box>
  );

  const renderEmail = () => (
    <Box {...rowStyles}>
      <Iconify width={24} icon="carbon:email" sx={{ mt: "2px" }} />
      <div>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("emailLabel")}
        </Typography>
        <Link color="inherit" variant="body2" href="mailto:info@loop.edu.pl">
          info@loop.edu.pl
        </Link>
      </div>
    </Box>
  );

  const renderTime = () => (
    <Box {...rowStyles}>
      <Iconify width={24} icon="solar:clock-circle-outline" sx={{ mt: "2px" }} />
      <div>
        <Typography variant="h6" sx={{ mb: 0.5 }}>
          {t("workingHours.label")}
        </Typography>
        <Typography variant="body2">{t("workingHours.value")}</Typography>
      </div>
    </Box>
  );

  return (
    <Box
      sx={[
        { gap: 3, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderImage()}
      {renderPhone()}
      {renderEmail()}
      {renderTime()}
    </Box>
  );
}
