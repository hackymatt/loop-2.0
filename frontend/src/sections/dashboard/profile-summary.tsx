"use client";

import { useTranslation } from "react-i18next";

import { Box, Card, Link, Avatar, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { fNumber } from "src/utils/format-number";

import { DEFAULT_AVATAR_URL } from "src/consts/avatar";

import { Iconify } from "src/components/iconify";
import { useUserContext } from "src/components/user";

// --------------------------------------------

const StatBox = ({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) => (
  <Card
    sx={(theme) => ({
      borderRadius: 2,
      p: 3,
      //   border: `dashed 1px ${theme.vars.palette.divider}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      backgroundColor: theme.palette.background.default,
      flex: 1,
      minHeight: 160,
    })}
  >
    <Iconify icon={icon} width={24} height={24} sx={{ color: `${color}.main` }} />

    <Typography variant="body2" fontWeight="bold" sx={{ mt: 1 }}>
      {label}
    </Typography>

    <Box sx={{ flexGrow: 1 }} />

    <Typography variant="h4" color={`${color}.main`} fontWeight="bold">
      {value}
    </Typography>
  </Card>
);

export function ProfileSummary() {
  const { t: locale } = useTranslation("locale");
  const { t } = useTranslation("dashboard");

  const user = useUserContext();
  const { firstName, email } = user.state;

  const totalPoints = 4250;
  const totalStreak = 12;

  const renderUser = () => (
    <Link component={RouterLink} href={paths.account.personal} color="inherit" underline="none">
      <Card
        sx={(theme) => ({
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 2,
          backgroundColor: theme.palette.background.default,
          "&:hover": { boxShadow: theme.vars.customShadows.z24 },
        })}
      >
        <Avatar src={DEFAULT_AVATAR_URL} sx={{ width: 64, height: 64 }} />

        <Box display="flex" gap={0.5} alignItems="center">
          <Typography variant="subtitle1" noWrap>
            {t("profile.greeting")}, {firstName || email}!
          </Typography>

          <Iconify icon="solar:alt-arrow-right-outline" />
        </Box>
      </Card>
    </Link>
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      sx={(theme) => ({
        borderRadius: 2,
        p: 2,
        gridTemplateColumns: "repeat(2, 1fr)",
        border: `dashed 1px ${theme.vars.palette.divider}`,
      })}
    >
      {renderUser()}

      <Box display="flex" gap={2}>
        <StatBox
          icon="solar:medal-star-bold"
          label={t("profile.points")}
          value={fNumber(totalPoints, {
            code: locale("code"),
            currency: locale("currency"),
          })}
          color="primary"
        />
        <StatBox
          icon="solar:fire-bold"
          label={t("profile.streak")}
          value={`${totalStreak} ${t("profile.days")}`}
          color="warning"
        />
      </Box>
    </Box>
  );
}
