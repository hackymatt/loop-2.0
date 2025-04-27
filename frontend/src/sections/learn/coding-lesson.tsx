import "./style.css";

import type { ICodingLessonProps } from "src/types/lesson";

import Split from "react-split";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import { Button, Typography, ButtonGroup } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { Markdown } from "src/components/markdown";
import { CodeEditor } from "src/components/code-editor";

// ----------------------------------------------------------------------

type CodingLessonProps = {
  lesson: ICodingLessonProps;
  onRunCode: (answer: string) => void;
  onSubmit: (answer: string) => void;
  onHint: () => void;
  onShowAnswer: () => void;
  error?: string;
};

type SectionProps = {
  title: string;
  icon: string;
};

// ----------------------------------------------------------------------

function SectionHeader({ title, icon }: SectionProps) {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 2,
        py: 1,
        bgcolor: theme.vars.palette.background.neutral,
        width: 1,
        position: "sticky",
        top: 0,
        zIndex: 1,
      })}
    >
      <Iconify icon={icon} width={18} height={18} />
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function CodingLesson({
  lesson,
  onSubmit,
  onRunCode,
  onHint,
  onShowAnswer,
}: CodingLessonProps) {
  const { t } = useTranslation("learn");

  const mobileTabs = [t("coding.context"), t("coding.exercise")];

  const { introduction, instructions, starterCode, hint, answer: userAnswer } = lesson;

  const [code, setCode] = useState<string>(starterCode);
  const [mobileTab, setMobileTab] = useState(mobileTabs[0]);

  useEffect(() => {
    if (userAnswer) setCode(userAnswer);
  }, [userAnswer]);

  const handleRunCode = () => {
    onSubmit(code);
  };

  const handleSubmit = () => {
    onSubmit(code);
  };

  const renderRunCodeButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={handleRunCode}
        sx={{ px: 2, whiteSpace: "nowrap" }}
      >
        {t("coding.editor.runCode")}
      </Button>
    </Box>
  );

  const renderSubmitButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={handleSubmit}
        sx={{ px: 2, whiteSpace: "nowrap" }}
      >
        {t("coding.editor.submit")}
      </Button>
    </Box>
  );

  const renderHintButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        color="inherit"
        size="medium"
        onClick={onHint}
        startIcon={<Iconify icon="solar:lightbulb-linear" />}
        sx={{ px: 2, whiteSpace: "nowrap" }}
      >
        {t("coding.hint.button")} (-{lesson.penaltyPoints} XP)
      </Button>
    </Box>
  );

  const renderShowAnswerButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="contained"
        color="primary"
        size="medium"
        onClick={onShowAnswer}
        // disabled={isMultiple ? selectedOptions.length === 0 : selectedOption === null}
        sx={{ px: 2, whiteSpace: "nowrap" }}
      >
        {t("coding.answer")} (-{lesson.totalPoints - lesson.penaltyPoints} XP)
      </Button>
    </Box>
  );

  const renderButtons = () => (
    <Box
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        display: "flex",
        gap: 1,
        zIndex: 2,
      }}
    >
      {renderRunCodeButton()}
      {renderSubmitButton()}
    </Box>
  );

  const renderIntroduction = () => (
    <Box sx={{ bgcolor: "background.paper", overflowY: "auto" }}>
      <SectionHeader title={t("coding.introduction")} icon="solar:book-broken" />
      <Box sx={{ px: 2 }}>
        <Markdown key={introduction} content={introduction} />
      </Box>
    </Box>
  );

  const renderHint = () => (
    <Box
      sx={(theme) => ({
        bgcolor: theme.vars.palette.background.neutral,
        overflowY: "auto",
        pb: 2,
      })}
    >
      <SectionHeader title={t("coding.hint.label")} icon="solar:lightbulb-linear" />
      <Box sx={{ px: 2 }}>
        <Markdown key={hint} content={hint || ""} />
        {!userAnswer && renderShowAnswerButton()}
      </Box>
    </Box>
  );

  const renderInstructions = () => (
    <Box sx={{ bgcolor: "background.paper", overflowY: "auto" }}>
      <SectionHeader title={t("coding.instructions")} icon="solar:checklist-bold" />
      <Box sx={{ px: 2 }}>
        <Markdown key={instructions} content={instructions} />
        {!hint && renderHintButton()}
      </Box>
      {hint && renderHint()}
    </Box>
  );

  const renderEditor = () => (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SectionHeader title={t("coding.editor.label")} icon="solar:code-2-bold" />
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          height: 300,
        }}
      >
        <CodeEditor technology={lesson.technology} value={code} onChange={setCode} />
      </Box>

      <Box sx={{ position: "absolute", bottom: 0, right: 0, display: "flex" }}>
        {renderButtons()}
      </Box>
    </Box>
  );

  const renderConsole = () => (
    <Box>
      <SectionHeader title={t("coding.console")} icon="carbon:terminal" />
      <Box sx={{ p: 2 }}>console</Box>
    </Box>
  );

  const renderLeft = () => (
    <Split
      direction="vertical"
      sizes={[60, 40]}
      minSize={200}
      gutterSize={5}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: "auto",
        textAlign: "left",
      }}
    >
      {renderIntroduction()}
      {renderInstructions()}
    </Split>
  );

  const renderRight = () => (
    <Split
      direction="vertical"
      sizes={[60, 40]}
      minSize={150}
      gutterSize={5}
      style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "auto" }}
    >
      {renderEditor()}
      {renderConsole()}
    </Split>
  );

  const renderContentDesktop = () => (
    <Split
      className="split"
      sizes={[40, 60]}
      minSize={200}
      gutterSize={5}
      style={{ height: "100%" }}
    >
      {renderLeft()}
      {renderRight()}
    </Split>
  );

  const renderContentMobile = () => (
    <>
      <ButtonGroup fullWidth sx={{ mb: 1 }}>
        {mobileTabs.map((mT) => (
          <Button
            key={mT}
            onClick={() => setMobileTab(mT)}
            variant={mobileTab === mT ? "contained" : "outlined"}
          >
            {mT}
          </Button>
        ))}
      </ButtonGroup>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>
        {mobileTab === mobileTabs[0] && renderLeft()}
        {mobileTab === mobileTabs[1] && renderRight()}
      </Box>
    </>
  );

  return (
    <>
      <Box sx={{ height: 1, display: { xs: "none", md: "block" } }}>{renderContentDesktop()}</Box>
      <Box
        sx={{
          height: 1,
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
        }}
      >
        {renderContentMobile()}
      </Box>
    </>
  );
}
