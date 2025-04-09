"use client";

import type { ICourseListProps } from "src/types/course";

import { Box, Card, Link, Button, Typography } from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { _courses } from "src/_mock";
import { UpgradeButton } from "src/layouts/components/upgrade-button";

import { Iconify } from "src/components/iconify";

import { Certificate } from "../certificate";

// ----------------------------------------------------------------------

export function CertificatesProgress({ disabled }: { disabled?: boolean }) {
  const studentName = "John Doe";
  const courses = _courses.slice(0, 4).map((x) => ({ ...x, certificateId: "abc" }));
  // const courses = undefined;

  const renderList = () => (
    <Box
      sx={{
        mt: 3,
        gap: 3,
        display: "grid",
        gridTemplateColumns: { xs: "repeat(1, 1fr)", md: "repeat(3, 1fr)" },
      }}
    >
      {courses.map((course) => (
        <CertificateItem key={course.slug} student={studentName} course={course} />
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
        You do not have any certificates yet. Complete the course to earn your first one!
      </Typography>

      <Button
        component={RouterLink}
        href={paths.courses}
        color="inherit"
        size="large"
        variant="text"
        endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
      >
        See all courses
      </Button>
    </Box>
  );

  const renderBlocked = () => (
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          p: 5,
          gap: 2,
        }}
      >
        <Certificate
          course="Introduction to Python Programming"
          student={studentName}
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: {
              width: 300,
            },
          })}
        />

        <Typography variant="body1" sx={{ color: "text.disabled" }}>
          Improve your chances of getting hired with industry-recognized certifications. Unlock your
          learning history and certificates now.
        </Typography>
      </Box>

      <UpgradeButton
        slotProps={{
          button: { size: "large", startIcon: <Iconify icon="solar:lock-unlocked-outline" /> },
        }}
      />
    </Box>
  );

  const renderContent = () => {
    if (disabled) return renderBlocked();
    if (!!courses?.length) return renderList();
    return renderInfo();
  };

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {disabled && <Iconify icon="solar:lock-bold" sx={{ color: "text.disabled" }} />}
          <Typography
            variant="h5"
            sx={{
              ...(disabled && { color: "text.disabled" }),
            }}
          >
            Certificates
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          href={paths.certificates}
          color="inherit"
          endIcon={<Iconify icon="solar:alt-arrow-right-outline" />}
          sx={{ display: "inline-flex" }}
          disabled={disabled}
        >
          See all certificates
        </Button>
      </Box>

      {renderContent()}
    </Box>
  );
}

function CertificateItem({
  student,
  course,
}: {
  student: string;
  course: ICourseListProps & { certificateId: string };
}) {
  return (
    <Link
      component={RouterLink}
      href={`${paths.certificate}/${course.certificateId}`}
      color="inherit"
      underline="none"
    >
      <Card
        sx={(theme) => ({
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          "&:hover": { boxShadow: theme.vars.customShadows.z24 },
        })}
      >
        <Certificate course={course.name} student={student} />
      </Card>
    </Link>
  );
}
