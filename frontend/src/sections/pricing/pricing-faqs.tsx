import type { BoxProps } from "@mui/material/Box";

import { useState, useCallback } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Accordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import { _faqs } from "src/_mock";

import { Iconify } from "src/components/iconify";
import { MotionViewport } from "src/components/animate";

// ----------------------------------------------------------------------

export function PricingFaqs({ sx, ...other }: BoxProps) {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeExpanded = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    },
    []
  );

  const renderTexts = () => (
    <Typography variant="h2" sx={{ textAlign: "center" }}>
      Frequently asked questions
    </Typography>
  );

  const renderList = () => (
    <Box sx={{ my: { xs: 5, md: 10 } }}>
      {_faqs.map((faq) => (
        <Accordion
          key={faq.question}
          expanded={expanded === faq.question}
          onChange={handleChangeExpanded(faq.question)}
        >
          <AccordionSummary>
            <Typography variant="h6" sx={{ pr: 1, flexGrow: 1 }}>
              {faq.question}
            </Typography>

            <Iconify
              icon={expanded === faq.question ? "eva:minus-outline" : "eva:plus-outline"}
              sx={{ transform: "translateY(4px)" }}
            />
          </AccordionSummary>

          <AccordionDetails sx={{ color: "text.secondary" }}>{faq.answer}</AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[{ position: "relative", py: { xs: 5, md: 10 } }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport}>
        <Grid container spacing={{ md: 3 }} sx={{ justifyContent: "center" }}>
          <Grid size={{ xs: 12, md: 8 }}>
            {renderTexts()}
            {renderList()}

            <Box
              sx={(theme) => ({
                gap: 3,
                display: "flex",
                borderRadius: 3,
                textAlign: "center",
                alignItems: "center",
                flexDirection: "column",
                px: { xs: 3, md: 5 },
                py: { xs: 6, md: 8 },
                border: `dashed 1px ${theme.vars.palette.divider}`,
              })}
            >
              <div>
                <Typography component="h6" variant="h3">
                  Still have questions?
                </Typography>
              </div>

              <div>
                <Typography sx={{ color: "text.secondary" }}>
                  Please describe your case to receive the most accurate advice.
                </Typography>
              </div>

              <div>
                <Button
                  size="large"
                  color="inherit"
                  variant="contained"
                  href="mailto:support@minimals.cc?subject=[Feedback] from Customer"
                >
                  Contact us
                </Button>
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
