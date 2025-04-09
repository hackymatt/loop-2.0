"use client";

import { Box, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { _courses } from "src/_mock";

import { Iconify } from "src/components/iconify";

import { CourseProgressItem } from "../courses/course-progress-item";

// ----------------------------------------------------------------------

export function CoursesProgress() {
  const courses = _courses.slice(0, 4);
  // const courses: ICourseListProps = [];

  const renderList = () => (
    <Box
      sx={{
        mt: 3,
        gap: 3,
        display: "grid",
        gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(2, 1fr)" },
      }}
    >
      {(courses || []).map((course) => (
        <CourseProgressItem key={course.slug} course={course} />
      ))}
    </Box>
  );

  const renderInfo = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 5,
        gap: 2,
      }}
    >
      <Typography variant="body1" sx={{ color: "text.disabled" }}>
        You have not started any course yet. Start today and take the first step on your programming
        journey!
      </Typography>

      <Button
        component={RouterLink}
        href={paths.courses}
        color="inherit"
        size="large"
        variant="text"
        endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
      >
        Start new course
      </Button>
    </Box>
  );

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 2,
        p: 2,
        gridTemplateColumns: "repeat(2, 1fr)",
        border: `dashed 1px ${theme.vars.palette.divider}`,
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: { xs: 2, md: 5 },
          textAlign: { xs: "center", md: "left" },
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">Courses</Typography>

        <Button
          component={RouterLink}
          href={paths.courses}
          color="inherit"
          endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
          sx={{ display: "inline-flex" }}
        >
          See all courses
        </Button>
      </Box>

      {!!courses?.length ? renderList() : renderInfo()}
    </Box>
  );
}
