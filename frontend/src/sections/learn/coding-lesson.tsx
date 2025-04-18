import type { BoxProps } from "@mui/material/Box";
import type { ICodingLessonProps } from "src/types/lesson";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Paper, Button, Typography } from "@mui/material";

import { Markdown } from "src/components/markdown";

// ----------------------------------------------------------------------

type CodingLessonProps = BoxProps & {
  lesson: ICodingLessonProps;
  onSubmit: (answer: string) => void;
  onShowAnswer: () => void;
  error?: string;
};

// ----------------------------------------------------------------------

export function CodingLesson({
  lesson,
  onSubmit,
  onShowAnswer,
  error,
  sx,
  ...other
}: CodingLessonProps) {
  const { t } = useTranslation("learn");

  const { introduction, instructions, starterCode, answer: userAnswer } = lesson;

  const [answer, setAnswer] = useState<string>(starterCode);

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer);
    }
  }, [userAnswer]);

  const handleSubmit = () => {
    onSubmit(answer);
  };

  const renderIntroduction = () => (
    <Paper elevation={3} sx={{ flex: 1, p: 2, overflow: "auto" }}>
      <Typography variant="h6">Introduction</Typography>
      <Markdown key={introduction} content={introduction} />
    </Paper>
  );

  const renderInstructions = () => (
    <Paper elevation={3} sx={{ flex: 2, p: 2, backgroundColor: "#f4f4f4", overflow: "auto" }}>
      <Typography variant="h6">Instructions</Typography>
      <Markdown key={instructions} content={instructions} />
    </Paper>
  );

  const renderEditor = () => (
    <Paper elevation={3} sx={{ flex: 2, p: 2, overflow: "auto" }}>
      <Typography variant="h6">Code Editor</Typography>
      <Box
        sx={{
          mt: 1,
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
          background: "#1e1e1e",
          color: "#fff",
          height: "100%",
          p: 2,
        }}
      >
        {userAnswer || starterCode}
      </Box>
    </Paper>
  );

  const renderConsole = () => (
    <Paper elevation={3} sx={{ flex: 1, p: 2, backgroundColor: "#f4f4f4", overflow: "auto" }}>
      <Typography variant="h6">Console</Typography>
      <Box sx={{ mt: 1, fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
        Output will appear here.
      </Box>
    </Paper>
  );

  const renderContent = () => (
    <Grid container spacing={2} sx={{ height: "100%", minHeight: "75vh" }}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {renderIntroduction()}
        {renderInstructions()}
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {renderEditor()}
        {renderConsole()}
      </Grid>
    </Grid>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmit}
        // disabled={isMultiple ? selectedOptions.length === 0 : selectedOption === null}
        sx={{ px: 2 }}
      >
        {t("quiz.submit")}
      </Button>
    </Box>
  );

  const renderAnswerButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="text"
        color="inherit"
        size="large"
        onClick={onShowAnswer}
        // disabled={isCompleted}
        sx={{ px: 2 }}
      >
        {t("quiz.answer")}
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {renderAnswerButton()}
        {renderSubmitButton()}
      </Box>
    </Box>
  );
}
