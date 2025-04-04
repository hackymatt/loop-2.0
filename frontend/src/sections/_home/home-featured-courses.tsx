import type { Variants } from "framer-motion";
import type { BoxProps } from "@mui/material/Box";

import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useFeaturedCourses } from "src/api/course/featured";

import { Iconify } from "src/components/iconify";
import { varFade, MotionViewport } from "src/components/animate";

import { CourseItem } from "../courses/course-item";
// ----------------------------------------------------------------------

const variants: Variants = varFade("inUp", { distance: 24 });

export function HomeFeaturedCourses({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("home");
  const { data: featuredCourses } = useFeaturedCourses();
  return (
    <Box
      component="section"
      sx={[{ pt: { xs: 5, md: 10 }, pb: { xs: 10, md: 15 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport}>
        <Grid
          container
          spacing={{ xs: 2, md: 4 }}
          sx={{ textAlign: { xs: "center", md: "unset" } }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <m.div variants={variants}>
              <Typography variant="overline" sx={{ color: "text.disabled" }}>
                {t("course.header")}
              </Typography>
            </m.div>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <m.div variants={variants}>
              <Typography variant="h3">{t("course.subtitle")}</Typography>
            </m.div>
          </Grid>
        </Grid>

        <Box
          sx={{
            columnGap: 4,
            display: "grid",
            py: { xs: 5, md: 10 },
            rowGap: { xs: 4, md: 5 },
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {(featuredCourses ?? []).map((course) => (
            <m.div key={course.slug} variants={variants}>
              <CourseItem key={course.slug} course={course} />
            </m.div>
          ))}
        </Box>

        <m.div variants={variants}>
          <Box sx={{ textAlign: "center" }}>
            <Button
              component={RouterLink}
              href={paths.courses}
              color="inherit"
              size="large"
              variant="outlined"
              endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
            >
              {t("course.button")}
            </Button>
          </Box>
        </m.div>
      </Container>
    </Box>
  );
}
