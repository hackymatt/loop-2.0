import type { ButtonProps } from "@mui/material/Button";
import type { Theme, SxProps } from "@mui/material/styles";

import { useTranslation } from "react-i18next";
import { varAlpha } from "minimal-shared/utils";

import Button from "@mui/material/Button";

import { paths } from "src/routes/paths";

import { AnimateBorder } from "src/components/animate";

// ----------------------------------------------------------------------

export type UpgradeButtonProps = {
  sx?: SxProps<Theme>;
  slotProps?: {
    button?: ButtonProps<"a">;
  };
};

export function UpgradeButton({ slotProps, sx }: UpgradeButtonProps) {
  const { t } = useTranslation("navigation");
  return (
    <AnimateBorder
      sx={[
        {
          borderRadius: 1,
          position: "relative",
          bgcolor: "text.primary",
          color: "background.paper",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      duration={6}
      slotProps={{
        outlineColor: (theme) =>
          `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0.04)}, ${varAlpha(theme.vars.palette.warning.mainChannel, 0.04)})`,
        primaryBorder: {
          size: 32,
          width: "2px",
          sx: (theme) => ({
            color: theme.vars.palette.primary.main,
          }),
        },
        secondaryBorder: {
          sx: (theme) => ({
            color: theme.vars.palette.warning.main,
          }),
        },
      }}
    >
      <Button
        variant="text"
        href={paths.pricing}
        {...slotProps?.button}
        sx={[
          { px: 2, borderRadius: "inherit", textAlign: "center" },
          ...(Array.isArray(slotProps?.button?.sx)
            ? (slotProps?.button?.sx ?? [])
            : [slotProps?.button?.sx]),
        ]}
      >
        {t("upgrade")}
      </Button>
    </AnimateBorder>
  );
}
