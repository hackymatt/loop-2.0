"use client";

import { useTranslation } from "react-i18next";
import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { _courses } from "src/_mock";
import { useCourseLevels } from "src/api/course/level/levels";
import { useCourseCategories } from "src/api/course/category/categories";
import { useCourseTechnologies } from "src/api/course/technology/technologies";

import { Iconify } from "src/components/iconify";

import { CourseList } from "../courses/course-list";
import { CoursesFilters } from "../courses/courses-filters";

// ----------------------------------------------------------------------

const RATING_OPTIONS = ["4", "3", "2"];

// ----------------------------------------------------------------------

export function CoursesView() {
  const { t } = useTranslation("course");
  const { data: courseLevels } = useCourseLevels({ sort_by: "order", page_size: "-1" });
  const { data: courseTechnologies } = useCourseTechnologies({ page_size: "-1" });
  const { data: courseCategories } = useCourseCategories({ page_size: "-1" });

  const courses = _courses.slice(0, 10);

  const openMobile = useBoolean();

  const renderHead = () => (
    <Box sx={{ display: "flex", alignItems: "center", py: 5 }}>
      <Typography variant="h3" sx={{ flexGrow: 1 }}>
        {t("title")}
      </Typography>

      <Iconify
        width={18}
        icon="solar:filter-outline"
        onClick={openMobile.onTrue}
        sx={{ display: { md: "none" } }}
      />
    </Box>
  );

  const renderListView = () => (
    <Box sx={{ gap: 4, display: "flex", flexDirection: "column" }}>
      <CourseList courses={courses} />
    </Box>
  );

  const renderFilters = () => (
    <Box sx={{ flexShrink: 0, width: { md: 280 } }}>
      <CoursesFilters
        open={openMobile.value}
        onClose={openMobile.onFalse}
        options={{
          levels: courseLevels ?? [],
          technologies: courseTechnologies ?? [],
          categories: courseCategories ?? [],
          ratings: RATING_OPTIONS,
        }}
      />
    </Box>
  );

  return (
    <Container>
      {renderHead()}

      <Box
        sx={{
          mb: 10,
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
        }}
      >
        {renderFilters()}

        <Box sx={{ flex: "1 1 auto", minWidth: 0, pl: { md: 8 } }}>{renderListView()}</Box>
      </Box>
    </Container>
  );
}
