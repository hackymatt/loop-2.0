import type { ICourseProps, ICourseChapterProp } from "src/types/course";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { Link, Badge, Stack, Button, Divider } from "@mui/material";

import { paths } from "src/routes/paths";

import { Iconify } from "src/components/iconify";

import { CourseDetailsLessonList } from "./course-details-lesson-list";

// ----------------------------------------------------------------------

type ChapterItemProps = {
  course: ICourseProps;
  chapter: ICourseChapterProp;
  index: number;
  expanded: boolean;
  onExpanded: (event: React.SyntheticEvent, isExpanded: boolean) => void;
};

export function CourseDetailsChapterItem({
  course,
  chapter,
  index,
  expanded,
  onExpanded,
}: ChapterItemProps) {
  const { t } = useTranslation("course");

  const renderButton = () => (
    <Button
      variant="contained"
      size="medium"
      color="primary"
      href={`${paths.register}?redirect=${paths.lesson}/${course.slug}/${chapter.slug}/${chapter.lessons[0].slug}`}
      sx={{ px: 2, textAlign: "center" }}
    >
      {t("chapters.button")}
    </Button>
  );

  const renderExpand = () => (
    <Link
      variant="subtitle2"
      color="inherit"
      sx={{
        gap: 1,
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        whiteSpace: "nowrap",
        minWidth: "max-content",
      }}
    >
      {expanded ? t("chapters.hide") : t("chapters.show")} {t("chapters.lesson")}
      <Iconify icon={expanded ? "solar:alt-arrow-up-outline" : "solar:alt-arrow-down-outline"} />
    </Link>
  );

  const renderSummary = () => (
    <AccordionSummary>
      <Stack spacing={2} flexGrow={1} divider={<Divider component="span" />}>
        <Box sx={{ display: "flex", alignItems: "center", width: 1 }}>
          <Badge color="primary" badgeContent={index} sx={{ ml: 1 }} />

          <Typography variant="subtitle1" sx={{ flexGrow: 1, ml: 2 }}>
            {chapter.name}
          </Typography>

          {renderButton()}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", width: 1, gap: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", flexGrow: 1 }}>
            {chapter.description}
          </Typography>

          {renderExpand()}
        </Box>
      </Stack>
    </AccordionSummary>
  );

  const renderDetails = () => (
    <AccordionDetails sx={{ typography: "body2" }}>
      <CourseDetailsLessonList course={course} chapter={chapter} />
    </AccordionDetails>
  );

  return (
    <Accordion
      expanded={expanded}
      onChange={onExpanded}
      sx={{ borderBottom: "1px solid transparent" }} // Makes divider invisible but keeps spacing
    >
      {renderSummary()}
      {renderDetails()}
    </Accordion>
  );
}
