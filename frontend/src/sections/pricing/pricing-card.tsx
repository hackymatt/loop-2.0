import type { PaperProps } from "@mui/material/Paper";

import { useTranslation } from "react-i18next";
import { varAlpha } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { CONFIG } from "src/global-config";

import { Label } from "src/components/label";

import type { PricingCardProps } from "./types";

// ----------------------------------------------------------------------

type Props = PaperProps & {
  plan: PricingCardProps;
};

const iconPath = (name: string) => `${CONFIG.assetsDir}/assets/icons/plans/${name}`;

export function PricingCard({ plan, sx, ...other }: Props) {
  const { t } = useTranslation("pricing");

  const currentPlan = ["Darmowy", "Free"];

  const renderIcons = () => (
    <Box
      component="img"
      alt={plan.license}
      src={iconPath(plan.icon)}
      sx={{ width: 80, height: 80 }}
    />
  );

  const renderPrices = () => (
    <Box
      sx={{
        gap: 0.5,
        display: "flex",
        alignItems: "center",
        ...(plan.popular && { color: "primary.main" }),
      }}
    >
      <Typography component="span" variant="h3">
        {plan.price}
      </Typography>

      <Typography component="span" variant="subtitle2">
        /{t("monthlyShort")}
      </Typography>
    </Box>
  );

  const renderList = () => (
    <Box sx={{ gap: 1, display: "flex", textAlign: "center", flexDirection: "column" }}>
      {plan.options.map((option) => (
        <Typography
          key={option.title}
          variant="body2"
          sx={{
            fontWeight: "fontWeightMedium",
            ...(option.disabled && { color: "text.disabled", textDecoration: "line-through" }),
          }}
        >
          {option.title}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Paper
      variant="outlined"
      sx={[
        (theme) => ({
          p: 5,
          gap: 5,
          display: "flex",
          borderRadius: 2,
          position: "relative",
          alignItems: "center",
          bgcolor: "transparent",
          flexDirection: "column",
          boxShadow: theme.vars.customShadows.card,
          [theme.breakpoints.up("md")]: { boxShadow: "none" },
        }),
        (theme) =>
          plan.popular && {
            py: 8,
            [theme.breakpoints.up("md")]: {
              boxShadow: `-24px 24px 72px -8px ${varAlpha(theme.vars.palette.grey["500Channel"], 0.24)}`,
              ...theme.applyStyles("dark", {
                boxShadow: `-24px 24px 72px -8px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
              }),
            },
          },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {plan.popular && (
        <Label color="info" sx={{ position: "absolute", top: 16, right: 16 }}>
          {t("popular")}
        </Label>
      )}

      <Box component="span" sx={{ color: "text.secondary", typography: "overline" }}>
        {plan.license}
      </Box>

      {renderIcons()}
      {renderPrices()}
      {renderList()}

      <Button
        fullWidth
        size="large"
        disabled={currentPlan.includes(plan.license)}
        variant={currentPlan.includes(plan.license) ? "outlined" : "contained"}
        color={plan.popular ? "primary" : "inherit"}
      >
        {currentPlan.includes(plan.license) ? t("current") : `${t("choose")} ${plan.license}`}
      </Button>
    </Paper>
  );
}
