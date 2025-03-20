"use client";

import { m } from "framer-motion";

import Link from "@mui/material/Link";
import List from "@mui/material/List";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import { varFade, MotionContainer } from "src/components/animate";

import { ComponentLayout } from "./layout";
import { navData } from "./layout/nav-config-components";

// ----------------------------------------------------------------------

export function ComponentsView() {
  const renderMuiComponents = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        MUI components
      </Typography>
      <Link href="https://mui.com/components/" target="_blank" rel="noopener">
        https://mui.com/components/
      </Link>
    </>
  );

  const renderExtraComponents = () => (
    <>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Extra components
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 5 }}>
        Some custom components / use 3rd party dependencies.
      </Typography>

      <List
        disablePadding
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        {navData.map((item) => (
          <ListItem key={item.name} disableGutters disablePadding>
            <Paper
              component={RouterLink}
              href={item.href}
              variant="outlined"
              sx={{
                px: 3,
                py: 5,
                width: 1,
                borderRadius: 1.5,
                textAlign: "center",
                bgcolor: "transparent",
                textDecoration: "none",
                typography: "subtitle2",
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {item.name}
            </Paper>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <ComponentLayout
      heroProps={{
        sx: { py: 15 },
        overrideContent: (
          <MotionContainer sx={{ textAlign: "center" }}>
            <m.div variants={varFade("inUp", { distance: 24 })}>
              <Typography variant="h3" component="h1">
                Components
              </Typography>
            </m.div>

            <m.div variants={varFade("inUp", { distance: 24 })}>
              <Typography sx={{ color: "text.secondary", mt: 3 }}>
                With huge resource pack making deployment easy and expanding more effectively
              </Typography>
            </m.div>
          </MotionContainer>
        ),
      }}
    >
      {renderMuiComponents()}
      <Divider sx={{ borderStyle: "dashed", my: 5 }} />
      {renderExtraComponents()}
    </ComponentLayout>
  );
}
