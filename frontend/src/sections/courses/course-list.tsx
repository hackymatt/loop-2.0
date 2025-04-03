import type { BoxProps } from "@mui/material/Box";
import type { ICourseListProps } from "src/types/course";

import Box from "@mui/material/Box";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import { CourseItem } from "./course-item";

// ----------------------------------------------------------------------

type Props = BoxProps & {
  courses: ICourseListProps[];
  count: number;
  page: number;
  onPageChange: (selectedPage: number) => void;
};

export function CourseList({ courses, count, page, onPageChange, sx, ...other }: Props) {
  return (
    <>
      <Box
        sx={[
          { gap: 4, display: "flex", flexDirection: "column" },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {courses.map((course) => (
          <CourseItem key={course.slug} course={course} />
        ))}
      </Box>

      <Pagination
        count={count}
        page={page}
        onChange={(event, selectedPage: number) => onPageChange(selectedPage)}
        sx={{ my: 10, [`& .${paginationClasses.ul}`]: { justifyContent: "center" } }}
      />
    </>
  );
}
