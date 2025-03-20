"use client";

import { useTranslation } from "react-i18next";
import { useBoolean } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { _courses } from "src/_mock";

import { Iconify } from "src/components/iconify";

import { CourseList } from "../courses/course-list";
import { CoursesFilters } from "../courses/courses-filters";

// ----------------------------------------------------------------------

const RATING_OPTIONS = ["4", "3", "2"];

// ----------------------------------------------------------------------

export function CoursesView() {
  const { t } = useTranslation("course");

  const courses = _courses.slice(0, 10);
  const levels = ["Beginner", "Intermediate", "Advanced"];
  const technologies = [
    "React",
    "Angular",
    "Vue",
    "Bootstrap",
    "Node.js",
    "Laravel",
    "Ruby on Rails",
  ];
  const categories = ["Frontend", "Backend", "Full Stack", "DevOps", "Mobile App", "Desktop App"];

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
          levels,
          technologies,
          categories,
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
