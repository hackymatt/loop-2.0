import type { CardProps } from "@mui/material";
import type { ICourseTeacherProp } from "src/types/course";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Card } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// ----------------------------------------------------------------------

type Props = CardProps & {
  teachers: ICourseTeacherProp[];
};

export function CourseDetailsTeachers({ teachers, sx, ...other }: Props) {
  const { t } = useTranslation("course");

  return (
    <Card
      sx={[
        { p: 3, gap: 2, borderRadius: 2, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography component="h6" variant="h6">
        {t("instructors")} ({teachers.length})
      </Typography>
      {teachers.map((teacher) => (
        <TeacherItem key={teacher.id} teacher={teacher} />
      ))}
    </Card>
  );
}

// ----------------------------------------------------------------------

type TeacherItemProps = {
  teacher: ICourseTeacherProp;
};

function TeacherItem({ teacher }: TeacherItemProps) {
  return (
    <Box
      sx={{
        gap: 1,
        display: "flex",
      }}
    >
      <Avatar src={teacher.avatarUrl} sx={{ width: 48, height: 48 }} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1">{teacher.name}</Typography>
        <Typography variant="caption" color="textDisabled">
          {teacher.role}
        </Typography>
      </Box>
    </Box>
  );
}
