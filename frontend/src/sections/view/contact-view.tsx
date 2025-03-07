"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Container from "@mui/material/Container";

import { Newsletter } from "../newsletter";
import { ContactForm } from "../contact/contact-form";
import { ContactInfo } from "../contact/contact-info";

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      <Box component="section" sx={{ pt: { xs: 3, md: 10 }, pb: { xs: 10, md: 15 } }}>
        <Container>
          <Grid
            container
            spacing={{ xs: 5, md: 3 }}
            direction={{ xs: "column-reverse", md: "row" }}
            sx={{ justifyContent: { md: "space-between" } }}
          >
            <Grid size={{ xs: 12, md: 6, lg: 5 }}>
              <ContactInfo />
            </Grid>

            <Grid size={{ xs: 12, md: 6, lg: 6 }}>
              <ContactForm />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Newsletter />
    </>
  );
}
