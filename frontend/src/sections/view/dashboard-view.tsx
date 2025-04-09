"use client";

import { Box, Container } from "@mui/material";

import { CoursesProgress } from "../dashboard/courses-progress";
import { CertificatesProgress } from "../dashboard/certificates-progress";

// ----------------------------------------------------------------------

export function DashboardView() {
  return (
    <Container>
      <Box
        sx={{
          mb: 10,
          py: 5,
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            gap: 5,
            mb: 1,
          }}
        >
          <CoursesProgress />

          <CertificatesProgress />
        </Box>
      </Box>
    </Container>
  );
}
