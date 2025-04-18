import type { BoxProps } from "@mui/material/Box";
import type { IReadingLessonProps } from "src/types/lesson";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button } from "@mui/material";

import { Markdown } from "src/components/markdown";

import { ComponentBox } from "./component-box";

// ----------------------------------------------------------------------

type ReadingLessonProps = BoxProps & { lesson: IReadingLessonProps; onSubmit: () => void };

// ----------------------------------------------------------------------

export function ReadingLesson({ lesson, onSubmit, sx, ...other }: ReadingLessonProps) {
  const { t } = useTranslation("learn");

  const { text } = lesson;

  const renderContent = () => (
    <ComponentBox sx={{ py: 0 }}>
      <Markdown key={text} content={text} />
    </ComponentBox>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button variant="contained" color="primary" size="large" onClick={onSubmit} sx={{ px: 2 }}>
        {t("reading.submit")}
      </Button>
    </Box>
  );

  return (
    <Box
      component="section"
      sx={[
        { overflow: "hidden", gap: 2, p: 1, display: "flex", flexDirection: "column" },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderContent()}
      {renderSubmitButton()}
    </Box>
  );
}
