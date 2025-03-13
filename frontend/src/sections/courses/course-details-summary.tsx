import type { BoxProps } from "@mui/material/Box";
import type { ICourseProps } from "src/types/course";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { CourseDetailsLessonList } from "./course-details-lesson-list";

// ----------------------------------------------------------------------

type Props = BoxProps & Partial<ICourseProps>;

export function CourseDetailsSummary({ lessons, sx, ...other }: Props) {
  const renderOverview = () => (
    <div>
      <Typography component="h6" variant="h4" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Typography>
        Consentaneum aeternitate dignitati commoventur primisque cupit mea officia peccata parens
        egone dolorem minuis. Secundae neglegi sextilius conantur commodaita siti philosophi ioca
        tenere lorem apparet assentior pudoris sint leves neglegebat unde reliquisti simile.
      </Typography>
    </div>
  );

  return (
    <Box
      sx={[
        { gap: 5, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderOverview()}

      <CourseDetailsLessonList lessons={lessons || []} />
    </Box>
  );
}
