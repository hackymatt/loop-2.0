import "./style.css";

import type { ICodingLessonProps } from "src/types/lesson";

import Split from "react-split";
import { useTranslation } from "react-i18next";
import { varAlpha } from "minimal-shared/utils";
import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import { Tab, Tabs, Button, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";
import { Markdown } from "src/components/markdown";
import { CodeEditor } from "src/components/code-editor";

// ----------------------------------------------------------------------

type CodingLessonProps = {
  lesson: ICodingLessonProps;
  onSubmit: (answer: string) => void;
  onShowAnswer: () => void;
  error?: string;
};

type SectionProps = {
  title: string;
  icon: string;
};

const TABS = ["Context", "Exercise"];

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
        bgcolor: varAlpha(theme.vars.palette.grey["500Channel"], 0.14),
        width: 1,
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

export function CodingLesson({ lesson, onSubmit, onShowAnswer }: CodingLessonProps) {
  const { t } = useTranslation("learn");
  const { introduction, instructions, starterCode, answer: userAnswer } = lesson;

  const [code, setCode] = useState<string>(starterCode);
  const [tab, setTab] = useState(TABS[0]);

  useEffect(() => {
    if (userAnswer) setCode(userAnswer);
  }, [userAnswer]);

  const handleSubmit = () => {
    onSubmit(code);
  };

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  }, []);

  const renderRunCodeButton = () => (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        variant="outlined"
        color="secondary"
        size="medium"
        onClick={onShowAnswer}
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
        // disabled={isMultiple ? selectedOptions.length === 0 : selectedOption === null}
        sx={{ px: 2, whiteSpace: "nowrap" }}
      >
        {t("coding.editor.submit")}
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

  const renderSection = (title: string, icon: string, content: string) => (
    <Box sx={{ bgcolor: "background.paper", overflowY: "auto" }}>
      <SectionHeader title={title} icon={icon} />
      <Box sx={{ px: 2 }}>
        <Markdown key={content} content={content} />
      </Box>
    </Box>
  );

  const renderEditor = () => (
    <Box
      sx={{
        position: "relative",
        height: 300,
      }}
    >
      <SectionHeader title={t("coding.editor.label")} icon="solar:code-2-bold" />
      <Box
        sx={{
          position: "absolute",
          inset: "15px 0 0 0",
          mt: 3,
        }}
      >
        <CodeEditor language={lesson.language} value={code} onChange={setCode} />
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
      sizes={[70, 30]}
      minSize={200}
      gutterSize={5}
      style={{ display: "flex", flexDirection: "column", gap: 2, overflow: "auto" }}
    >
      {renderSection(t("coding.introduction"), "solar:book-broken", introduction)}
      {renderSection(t("coding.instructions"), "solar:checklist-bold", instructions)}
    </Split>
  );

  const renderRight = () => (
    <Split
      direction="vertical"
      sizes={[60, 40]}
      minSize={100}
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
      <Tabs
        value={tab}
        onChange={handleChangeTab}
        centered
        variant="standard"
        sx={{ width: "100%", mb: 1 }}
      >
        {TABS.map((category) => (
          <Tab key={category} value={category} label={category} />
        ))}
      </Tabs>

      {tab === TABS[0] && renderLeft()}
      {tab === TABS[1] && renderRight()}
    </>
  );

  return (
    <>
      <Box sx={{ height: 1, display: { xs: "none", md: "block" } }}>{renderContentDesktop()}</Box>
      <Box sx={{ height: 1, display: { xs: "block", md: "none" } }}>{renderContentMobile()}</Box>
    </>
  );
}
