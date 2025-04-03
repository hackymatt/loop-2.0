import type { ICourseProps, ICourseLessonProp, ICourseChapterProp } from "src/types/course";

import { Box, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";

import { getLessonTypeIcon } from "src/utils/lesson-type-icon";

import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

type LessonItemProps = {
  course: ICourseProps;
  chapter: ICourseChapterProp;
  lesson: ICourseLessonProp;
};

export function CourseDetailsLessonItem({ course, chapter, lesson }: LessonItemProps) {
  return (
    <Button
      variant="text"
      size="medium"
      color="inherit"
      href={`${paths.register}?redirect=${paths.course}/${course.slug}/${chapter.slug}/${lesson.slug}`}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Iconify icon={getLessonTypeIcon(lesson.type)} />
        {lesson.name}
      </Box>
      <Typography variant="body2">{lesson.totalPoints} XP</Typography>
    </Button>
  );
}
