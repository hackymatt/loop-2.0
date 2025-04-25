import type { IReadingLessonProps } from "src/types/lesson";

import { m } from "framer-motion";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button, Divider, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { Markdown } from "src/components/markdown";

// ----------------------------------------------------------------------

type ReadingLessonProps = {
  lesson: IReadingLessonProps;
  onSubmit: () => void;
};

// ----------------------------------------------------------------------

export function ReadingLesson({ lesson, onSubmit }: ReadingLessonProps) {
  const { t } = useTranslation("learn");
  const { text, name, duration } = lesson;

  const renderHeader = () => (
    <Box>
      <Typography variant="h4" gutterBottom>
        {name}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        ⏱ {t("reading.estimatedTime")}: {duration} min
      </Typography>
    </Box>
  );

  const renderContent = () => (
    <m.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflowY: "auto" }}
    >
      <Markdown key={text} content={text} />
    </m.div>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<Iconify icon="solar:check-circle-bold" />}
        onClick={onSubmit}
        sx={(theme) => ({
          px: 3,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: "medium",
          boxShadow: theme.shadows[2],
        })}
      >
        {t("reading.submit")}
      </Button>
    </Box>
  );

  return (
    <>
      {renderHeader()}
      <Divider />
      {renderContent()}
      <Divider sx={{ mt: "auto" }} />
      {renderSubmitButton()}
    </>
  );
}
