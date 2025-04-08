"use client";

import { Box, Divider, Container } from "@mui/material";

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
            mb: 1,
            gap: 5,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CoursesProgress />

          <Divider sx={{ my: 2, borderStyle: "dashed", display: { xs: "block", md: "none" } }} />

          <CertificatesProgress />
        </Box>
      </Box>
    </Container>
  );
}
