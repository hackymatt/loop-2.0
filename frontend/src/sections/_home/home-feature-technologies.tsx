import type { Variants } from "framer-motion";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Paper, Button } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link, { linkClasses } from "@mui/material/Link";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { getTechnologyIcon } from "src/utils/technology-icon";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

const TECHNOLOGIES = [
  "React",
  "Angular",
  "Vue",
  "Bootstrap",
  "Node.js",
  "Laravel",
  "Ruby on Rails",
];

// ----------------------------------------------------------------------

const variants: Variants = varFade("inUp", { distance: 24 });

export function HomeFeatureTechnologies({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("home");
  return (
    <Box
      component="section"
      sx={[
        { bgcolor: "background.neutral", pt: { xs: 5, md: 10 }, pb: { xs: 10, md: 15 } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container component={MotionViewport}>
        <Grid container spacing={{ xs: 5, md: 3 }} sx={{ justifyContent: { md: "space-between" } }}>
          <Grid sx={{ textAlign: { xs: "center", md: "left" } }} size={{ xs: 12, md: 4 }}>
            <m.div variants={variants}>
              <Typography variant="overline" sx={{ color: "text.disabled" }}>
                {t("technology.header")}
              </Typography>
            </m.div>

            <m.div variants={variants}>
              <Typography variant="h2" sx={{ my: 3 }}>
                {t("technology.title")}
              </Typography>
            </m.div>

            <m.div variants={variants}>
              <Typography sx={{ color: "text.secondary", mb: 5 }}>
                {t("technology.subtitle")}
              </Typography>
            </m.div>

            <m.div variants={variants}>
              <Button
                component={RouterLink}
                href={paths.courses}
                color="inherit"
                size="large"
                variant="outlined"
                endIcon={<Iconify width={16} icon="solar:alt-arrow-right-outline" />}
              >
                {t("technology.button")}
              </Button>
            </m.div>
          </Grid>

          <m.div variants={variants}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  rowGap: 5,
                  columnGap: 3,
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)" },
                }}
              >
                {TECHNOLOGIES.map((technology) => (
                  <m.div key={technology}>
                    <Link href={`${paths.courses}?technologies=${technology}`}>
                      <Paper
                        variant="outlined"
                        sx={(theme) => ({
                          p: 3,
                          minWidth: 0,
                          display: "flex",
                          borderRadius: 1.5,
                          cursor: "pointer",
                          bgcolor: "transparent",
                          flexDirection: "column",
                          alignItems: "center",
                          transition: theme.transitions.create(["all"], {
                            duration: theme.transitions.duration.enteringScreen,
                          }),
                          "&:hover": {
                            bgcolor: "background.paper",
                            boxShadow: theme.vars.customShadows.z24,
                            [`& .${linkClasses.root}`]: { color: "primary.main" },
                          },
                        })}
                      >
                        <Iconify icon={getTechnologyIcon(technology)} width={32} />
                        {technology}
                      </Paper>
                    </Link>
                  </m.div>
                ))}
              </Box>
            </Grid>
          </m.div>
        </Grid>
      </Container>
    </Box>
  );
}
