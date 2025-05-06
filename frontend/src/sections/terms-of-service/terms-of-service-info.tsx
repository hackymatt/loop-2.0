import type { BoxProps } from "@mui/material/Box";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { useTermsOfServiceContent } from "./terms-of-service-content";

// ----------------------------------------------------------------------

export function TermsOfServiceInfo({ sx, ...other }: BoxProps) {
  const { t } = useTranslation("terms-of-service");
  const termsOfServiceContent = useTermsOfServiceContent();

  const renderList = () =>
    termsOfServiceContent.map((section) => (
      <Link key={section.header} href={`#${section.header}`}>
        <Typography>{section.header}</Typography>
      </Link>
    ));

  const renderContent = () => (
    <Box sx={{ mt: 10 }}>
      {termsOfServiceContent.map((section) => (
        <Box key={section.header}>
          <Box
            id={section.header}
            sx={{ display: "block", position: "relative", top: "-100px", hidden: "true" }}
          />
          <Box sx={{ mt: 4 }}>
            <Typography align="center" fontWeight="bold" sx={{ mb: 2 }}>
              {section.header}
            </Typography>
            <Box>{section.content}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        { pt: { xs: 3, md: 5 }, pb: { xs: 5, md: 10 }, textAlign: { xs: "center", md: "left" } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container>
        <Typography variant="h2" sx={{ py: { xs: 3, md: 10 } }}>
          {t("title")}
        </Typography>

        {renderList()}

        {renderContent()}
      </Container>
    </Box>
  );
}
