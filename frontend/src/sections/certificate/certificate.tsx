import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid2";
import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";

import { fDate } from "src/utils/format-time";

import { CONFIG } from "src/global-config";

import { Logo } from "src/components/logo";

export function Certificate({ title }: { title: string }) {
  const { t } = useTranslation("certificate");
  return (
    <Box
      component="section"
      sx={(theme) => ({
        ...theme.mixins.bgGradient({
          images: [`url(${CONFIG.assetsDir}/assets/background/texture-2.webp)`],
        }),
        width: 1,
        borderRadius: 1.5,
        bgcolor: "background.neutral",
        py: 3,
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          textAlign: "center",
        }}
      >
        {/* Grid Layout: 1/5 ratio */}
        <Grid container spacing={2} width={1}>
          {/* First 1/5 for Logo */}
          <Grid size={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Logo isSingle sx={{ width: 24, height: 24 }} />
          </Grid>

          {/* The rest of the content in 4/5 */}
          <Grid size={{ xs: 12, md: 10 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <Typography sx={{ fontSize: 8, fontWeight: "bold" }}>{t("title")}</Typography>
            </Box>

            {/* Participant info */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 2 }}>
              <Typography color="primary" sx={{ fontSize: 8 }}>
                {t("award")}
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>{t("name")}</Typography>
            </Box>

            {/* Course name */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 2 }}>
              <Typography color="primary" sx={{ fontSize: 8 }}>
                {t("completion")}
              </Typography>
              <Typography sx={{ fontSize: 10, fontWeight: "bold" }}>{title}</Typography>
            </Box>

            {/* Completion date */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", mt: 2 }}>
              <Typography color="primary" sx={{ fontSize: 6 }}>
                {t("date")}
              </Typography>
              <Typography sx={{ fontSize: 8, fontWeight: "bold" }}>{fDate(new Date())}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
