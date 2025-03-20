"use client";

import { useTranslation } from "react-i18next";
import { useBoolean } from "minimal-shared/hooks";
import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "src/components/iconify";

import { SupportNav } from "../support/support-nav";
import { SupportContent } from "../support/support-content";

// ----------------------------------------------------------------------

type IFaqProps = { question: string; answer: string };

export function SupportView() {
  const { t } = useTranslation("faq");

  const pricing = t("pricing", { returnObjects: true }) as IFaqProps[];

  const TOPICS = [
    {
      title: "Pricing",
      icon: "solar:tag-price-bold",
      content: <SupportContent contents={pricing} />,
    },
  ];

  const [topic, setTopic] = useState("Pricing");

  const openNavMobile = useBoolean();

  const handleChangeTopic = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setTopic(newValue);
  }, []);

  useEffect(() => {
    if (openNavMobile.value) {
      openNavMobile.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  return (
    <>
      <Box
        sx={(theme) => ({
          px: 2,
          py: 1.5,
          display: { md: "none" },
          borderBottom: `solid 1px ${theme.vars.palette.divider}`,
        })}
      >
        <IconButton onClick={openNavMobile.onTrue}>
          <Iconify icon="carbon:menu" />
        </IconButton>
      </Box>

      <Container component="section" sx={{ pb: { xs: 10, md: 15 } }}>
        <Typography variant="h3" sx={{ my: { xs: 3, md: 10 } }}>
          {t("title")}
        </Typography>

        <Box sx={{ gap: 10, display: "flex" }}>
          <SupportNav
            data={TOPICS}
            topic={topic}
            open={openNavMobile.value}
            onChangeTopic={handleChangeTopic}
            onClose={openNavMobile.onFalse}
          />

          {TOPICS.map((item) => item.title === topic && <div key={item.title}>{item.content}</div>)}
        </Box>
      </Container>
    </>
  );
}
