import type { BoxProps } from "@mui/material/Box";
import type { ICourseProps } from "src/types/course";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid2";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";

import { usePluralize } from "src/hooks/use-pluralize";

import { fShortenNumber } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { SignUpView } from "../auth/sign-up-view";
import { FormHead } from "../auth/components/form-head";

// ----------------------------------------------------------------------

type Props = BoxProps & Partial<ICourseProps> & { totalLessons: number };

export function CourseDetailsHero({
  sx,
  slug,
  level,
  teachers,
  category,
  technology,
  coverUrl,
  languages,
  totalHours,
  description,
  isBestSeller,
  ratingNumber,
  totalReviews,
  totalQuizzes,
  totalExercises,
  totalArticles,
  totalVideos,
  totalLessons,
  totalStudents,
  ...other
}: Props) {
  const { t } = useTranslation("course");

  const teacher = t("teacher", { returnObjects: true }) as string[];
  const student = t("student", { returnObjects: true }) as string[];
  const review = t("review", { returnObjects: true }) as string[];
  const hour = t("hour", { returnObjects: true }) as string[];
  const lesson = t("lesson", { returnObjects: true }) as string[];
  const video = t("video", { returnObjects: true }) as string[];
  const article = t("article", { returnObjects: true }) as string[];
  const exercise = t("exercise", { returnObjects: true }) as string[];
  const quiz = t("quiz", { returnObjects: true }) as string[];

  const languagePluralize = usePluralize();

  const renderInfo = () => (
    <Box sx={{ gap: 1.5, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <Box sx={{ gap: 0.5, display: "flex", alignItems: "center" }}>
        <Iconify icon="eva:star-fill" sx={{ color: "warning.main" }} />
        <Box sx={{ typography: "h6" }}>
          {Number.isInteger(ratingNumber) ? `${ratingNumber}.0` : ratingNumber}
        </Box>

        {totalReviews && (
          <Link variant="body2" sx={{ color: "text.secondary" }}>
            ({fShortenNumber(totalReviews)} {languagePluralize(review, totalReviews)})
          </Link>
        )}
      </Box>

      <Divider orientation="vertical" sx={{ height: 20, my: "auto" }} />

      {totalStudents ? (
        <Box sx={{ display: "flex", typography: "subtitle2" }}>
          {fShortenNumber(totalStudents)}
          <Box component="span" sx={{ typography: "body2", ml: 0.5 }}>
            {languagePluralize(student, totalStudents)}
          </Box>
        </Box>
      ) : null}
    </Box>
  );

  const renderTeacher = () => (
    <Box sx={{ gap: 1.5, display: "flex", alignItems: "center" }}>
      <Avatar src={teachers?.[0]?.avatarUrl} />

      <Box sx={{ gap: 0.75, display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="body2">{teachers?.[0]?.name}</Typography>

        {Number(teachers?.length) - 1 > 0 && (
          <Box component="span" sx={{ typography: "body2", color: "text.secondary" }}>
            + {Number(teachers?.length) - 1}
            <Link underline="always" color="inherit" sx={{ ml: 0.25 }}>
              {languagePluralize(teacher, Number(teachers?.length) - 1)}
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderTexts = () => (
    <Box sx={{ gap: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography variant="overline" sx={{ color: "secondary.main" }}>
        {category}
      </Typography>

      <Typography variant="h3" component="h1">
        {slug}
      </Typography>

      <Typography sx={{ color: "text.secondary" }}>{description}</Typography>
    </Box>
  );

  const renderSummary = () => (
    <Box
      sx={{
        rowGap: 3,
        columnGap: 5,
        display: "flex",
        flexWrap: "wrap",
        maxWidth: 480,
        typography: "body2",
        "& > div": { gap: 1, display: "flex", alignItems: "center" },
      }}
    >
      <div>
        <Iconify
          icon={
            (level === "Beginner" && "carbon:skill-level-basic") ||
            (level === "Intermediate" && "carbon:skill-level-intermediate") ||
            "carbon:skill-level-advanced"
          }
        />
        {level}
      </div>

      <div>
        <Iconify icon="carbon:code" />
        {technology}
      </div>

      {totalHours ? (
        <div>
          <Iconify icon="solar:clock-circle-outline" />{" "}
          {`${totalHours} ${languagePluralize(hour, totalHours)}`}
        </div>
      ) : null}

      {totalLessons ? (
        <div>
          <Iconify icon="solar:documents-minimalistic-outline" />
          {totalLessons} {languagePluralize(lesson, totalLessons)}
        </div>
      ) : null}

      {totalVideos ? (
        <div>
          <Iconify icon="solar:video-frame-outline" />
          {`${totalVideos} ${languagePluralize(video, totalVideos)}`}
        </div>
      ) : null}

      {totalArticles ? (
        <div>
          <Iconify icon="solar:book-outline" />
          {`${totalArticles} ${languagePluralize(article, totalArticles)}`}
        </div>
      ) : null}

      {totalExercises ? (
        <div>
          <Iconify icon="solar:code-circle-outline" />
          {`${totalExercises} ${languagePluralize(exercise, totalExercises)}`}
        </div>
      ) : null}

      {totalQuizzes ? (
        <div>
          <Iconify icon="solar:question-circle-outline" />
          {`${totalQuizzes} ${languagePluralize(quiz, totalQuizzes)}`}
        </div>
      ) : null}
    </Box>
  );

  const renderForm = () => (
    <Box
      sx={(theme) => ({
        py: 5,
        width: 1,
        zIndex: 2,
        borderRadius: 2,
        flexDirection: "column",
        px: { xs: 3, md: 5 },
        boxShadow: theme.vars.customShadows.z24,
        maxWidth: "var(--layout-auth-content-width)",
        bgcolor: theme.vars.palette.background.default,
        flex: "1 1 auto",
        display: "block",
      })}
    >
      <div>
        <SignUpView
          header={<FormHead title={t("sign-up.header")} />}
          buttonText={t("sign-up.button")}
        />
      </div>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[{ pt: 5, pb: 10, bgcolor: "background.neutral" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container sx={{ overflow: "hidden" }}>
        <CustomBreadcrumbs
          links={[
            { name: "Home", href: "/" },
            { name: "Courses", href: paths.eLearning.courses },
            { name: slug },
          ]}
          sx={{ mb: { xs: 5, md: 10 } }}
        />

        <Grid
          container
          spacing={{ xs: 5, md: 10 }}
          direction={{ xs: "column-reverse", md: "row-reverse" }}
        >
          <Grid size={{ xs: 12, md: 5 }}>{renderForm()}</Grid>

          <Grid size={{ xs: 12, md: 7 }} sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
            {renderTexts()}
            {renderInfo()}
            {renderTeacher()}
            <Divider sx={{ borderStyle: "dashed" }} />
            {renderSummary()}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
